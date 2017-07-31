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
    destinations: DestinationType[];
}
export declare class NotifierService extends Service {
    defaultOperations: DestinationType[];
    constructor(coreUrl: string, options?: NotifierConfiguration);
    execDestination(type: DestinationType, data: Notification, callback: () => void): void;
    start(): void;
}
