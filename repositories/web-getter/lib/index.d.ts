import { Service } from 'octopod';
export interface GetterServiceRequest {
    url: string;
}
export interface GetterServiceResult {
    filePath: string;
}
export interface GetterServiceDirectResult {
    body: string;
}
export interface HostnameAction {
    (callback: (error: Error) => void): void;
}
export interface HostnameDictionary {
    [hostname: string]: HostnameAction[];
}
export declare class GetterService extends Service {
    hostnames: HostnameDictionary;
    constructor(envUrl: string);
    hostnameRuntime(host: string): void;
    start(callback?: () => void): void;
}
