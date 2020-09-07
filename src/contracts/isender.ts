import { RequestPromise } from 'request-promise';

export default interface ISender {
    get(url: string): RequestPromise;
    put(url: string, data?: object): RequestPromise;
    post(url: string, data?: object): RequestPromise;
    delete(url: string, data?:object): RequestPromise;
}
