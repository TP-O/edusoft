import requestPromise, { RequestPromise } from 'request-promise';
import { ISender } from '../contracts/sender';
import cheerio from 'cheerio';
import { injectable } from 'inversify';
import 'reflect-metadata';

@injectable()
export class Sender implements ISender
{
    private _send(method: string, url: string, data?: object, headers?: object, json?: boolean): RequestPromise
    {
        let convertedData: any[] = data ? this._convertData(data): [];

        return requestPromise(url, {
            method: method,
            headers: {
                'content-type': 'multipart/form-data',
                ...headers
            },
            multipart: json ? undefined : {
                chunked: false,
                data: convertedData
            },
            json: json ? data : undefined,
            followAllRedirects: true,
            jar: true,
            transform: (body) => json ? body : cheerio.load(body)
        });
    }

    private _convertData(data: object): any[]
    {
        let convertedData: any[] = [];
        
        for (const [key, value] of Object.entries(data)) {
            convertedData.push({
                'Content-Disposition': `form-data; name="${key}"`,
                body: value
            });
        }

        return convertedData;
    }

    public get(url: string): RequestPromise
    {
        return this._send('GET', url);
    }

    public post(url: string, data?: object, headers?: object, json?: boolean): RequestPromise
    {
        return this._send('POST', url, data, headers, json);
    }

    public put(url: string, data?: object, headers?: object, json?: boolean): RequestPromise
    {
        return this._send('PUT', url, data);
    }

    public delete(url: string, data?: object, headers?: object, json?: boolean): RequestPromise
    {
        return this._send('DELETE', url, data);
    }
}
