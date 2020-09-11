import { RequestPromise } from 'request-promise';

export interface ISender
{
    get(url: string): RequestPromise;
    put(url: string, data?: object, headers?: object, json?: boolean): RequestPromise;
    post(url: string, data?: object, headers?: object, json?: boolean): RequestPromise;
    delete(url: string, data?: object, headers?: object, json?: boolean): RequestPromise;
}
