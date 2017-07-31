import { Service } from 'octopod'
import * as request from 'request'
import * as url from 'url'
import * as path from 'path'

interface GetterServiceRequest
{
    url : string
}
interface GetterServiceResult
{
    filePath : string
}
interface GetterServiceDirectResult
{
    body : string
}

interface HostnameAction
{
    (callback : (error : Error) => void) : void
}
interface HostnameDictionary
{
    [hostname : string] : HostnameAction[]
}

class GetterService extends Service
{
    hostnames : HostnameDictionary = { };

    constructor(envUrl : string)
    {
        super('getter', envUrl, false);
    }

    hostnameRuntime(host : string) : void
    {
        let actions = this.hostnames[host];
        //this.log(host + ' / ' + actions.length);

        if(actions.length === 0)
        {
            setTimeout(() => this.hostnameRuntime(host), 1000);
            return;
        }

        const action = actions.shift();
        action((e) => {
            if(e)
            {
                this.error('Host action execution : Error', e);
                actions.push(action);
            }

            setTimeout(() => this.hostnameRuntime(host), 10000);
        });
    }

    start(callback ?: () => void)
    {
        this.reference({
            inputs: {
                'request': {
                    isVolatile: true,
                    mainOutputMethod: 'result',
                    outputs: {
                        'result': 1,
                        'webfile': 1
                    }
                },
                'direct': {
                    isVolatile: true,
                    mainOutputMethod: 'result',
                    outputs: {
                        'result': 1
                    }
                }
            }
        }, (e) => {

            this.commands['pending'] = (input, cb) => {
                const host = url.parse(input.url).host;
                cb({
                    nb: this.hostnames[host] ? this.hostnames[host].length : 0
                });
            }
            this.commands['stop'] = (input, cb) => {
                cb();
                process.exit();
            }

            this.bindMethod<GetterServiceRequest>('request', (data, info) => {
                const host = url.parse(data.url).host;

                if(!this.hostnames[host])
                {
                    this.hostnames[host] = [];
                    process.nextTick(() => this.hostnameRuntime(host));
                }
                
                this.hostnames[host].push((cb) => {
                    this.log('Downloading', data.url);

                    const filePath = info.outputs['webfile'][0];

                    const rStream = request(data.url);
                    const wStream = this.put(filePath);
                    rStream.on('error', (e) => cb(e));
                    rStream.on('end', () => {
                        this.log('Downloaded with success', data.url);
                        this.putObject(info.mainOutput, {
                            filePath
                        } as GetterServiceResult, (e) => {
                            this.log('Writing result', data.url);
                            cb(e);
                            this.dispose(info);
                        })
                    });
                    rStream.pipe(wStream);
                })
            })
            
            this.bindMethod<GetterServiceRequest>('direct', (data, info) => {
                const host = url.parse(data.url).host;

                if(!this.hostnames[host])
                {
                    this.hostnames[host] = [];
                    process.nextTick(() => this.hostnameRuntime(host));
                }
                
                this.hostnames[host].push((cb) => {
                    this.log('Downloading', data.url);

                    const filePath = info.mainOutput;

                    request(data.url, (e, res, body) => {
                        this.log('Downloaded with success', data.url);
                        this.putObject(info.mainOutput, {
                            body: body ? body.toString() : null
                        } as GetterServiceDirectResult, (e) => {
                            this.log('Writing result', data.url);
                            cb(e);
                            this.dispose(info);
                        })
                    });
                })
            })

            if(callback)
                callback();
        })
    }
}
