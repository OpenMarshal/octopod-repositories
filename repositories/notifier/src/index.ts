import { Service } from 'octopod'
import * as directTransport from 'nodemailer-direct-transport'
import * as request from 'request'
import * as nodemailer from 'nodemailer'
import * as url from 'url'
import * as path from 'path'
import * as fs from 'fs'

export interface Notification
{
    notify : {
        node : string
        type : string
    }
    title : string
    body : any
    operations ?: DestinationType[]
}

export interface DestinationType
{
    type : string
    settings ?: any
    retryTimeout ?: number
}

export interface NotifierConfiguration
{
    operations ?: DestinationType[]
    types ?: NotifierServiceTypes
}

export type NotifierServiceType = (this : NotifierService, type : DestinationType, data : Notification, callback : () => void) => void;
export interface NotifierServiceTypes
{
    [name : string] : NotifierServiceType
}

export class NotifierService extends Service
{
    operations : DestinationType[];
    types : NotifierServiceTypes;

    constructor(coreUrl : string, options ?: NotifierConfiguration)
    {
        super('notifier', coreUrl);

        if(!options)
            options = {
                operations: []
            };

        this.operations = options.operations ? options.operations : [];
        this.types = options.types ? options.types : {};

        if(this.types['email'] === undefined)
        {
            this.types['email'] = function(this : NotifierService, type : DestinationType, data : Notification, callback : () => void)
            {
                const transporter = nodemailer.createTransport(directTransport(undefined));

                const mailData = JSON.parse(JSON.stringify(type.settings));
                mailData.subject = data.title + ' (' + data.notify.node + ' - ' + data.notify.type + ')'
                mailData.text = data.body;

                transporter.sendMail(mailData, (e, info) => {
                    if(e)
                    {
                        this.error('transporter.sendMail(...) : Error', e);
                        setTimeout(() => this.execDestination(type, data, callback), type.retryTimeout ? type.retryTimeout : 1000 * 60 * 10) // retry in 10 minutes
                    }
                    else
                    {
                        this.log('Notified by email', mailData);
                        callback();
                    }
                });
            }
        }
    }
    
    execDestination(type : DestinationType, data : Notification, callback : () => void)
    {
        const exec = this.types[type.type];
        if(!exec)
        {
            this.error('Type not defined', JSON.stringify(type));
            return callback();
        }

        exec.bind(this)(type, data, callback);
    }

    start()
    {
        this.reference({
            inputs: {
                'notify': {
                    mainOutputMethod: 'notify-done',
                    outputs: {
                        'notify-done': 1
                    }
                }
            }
        }, (e) => {
            if(e)
                throw e;

            this.bindMethod<Notification>('notify', (data, info) => {
                const operations = data.operations ? data.operations : this.operations;
                let nb = operations.length + 1;
                operations.forEach((dest) => this.execDestination(dest, data, () => {
                    if(--nb === 0)
                        this.dispose(info);
                }))
                if(--nb === 0)
                    this.dispose(info);
            })
        })
    }
}
