import { Service } from 'octopod';
export interface Notification {
    notify: {
        node: string;
        type: string;
    };
    title: string;
    body: any;
    operations?: DestinationType[];
}
export interface DestinationType {
    type: string;
    settings?: any;
    retryTimeout?: number;
}
export interface NotifierConfiguration {
    operations?: DestinationType[];
    types?: NotifierServiceTypes;
}
export declare type NotifierServiceType = (this: NotifierService, type: DestinationType, data: Notification, callback: () => void) => void;
export interface NotifierServiceTypes {
    [name: string]: NotifierServiceType;
}
export declare class NotifierService extends Service {
    operations: DestinationType[];
    types: NotifierServiceTypes;
    constructor(coreUrl: string, options?: NotifierConfiguration);
    execDestination(type: DestinationType, data: Notification, callback: () => void): void;
    start(): void;
}
