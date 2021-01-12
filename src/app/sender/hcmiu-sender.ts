import requestPromise, { RequestPromise } from 'request-promise';
import { injectable } from 'inversify';
import { Constracts } from '../../contracts';
import cheerio from 'cheerio';
import 'reflect-metadata';

@injectable()
export class Sender implements Constracts.ISender
{
    private _send(method: string, url: string, data?: object, headers?: object, json?: boolean): RequestPromise {
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

    private _convertData(data: object): any[] {
        let convertedData: any[] = [];
        
        for (const [key, value] of Object.entries(data)) {
            convertedData.push({
                'Content-Disposition': `form-data; name="${key}"`,
                body: value
            });
        }

        return convertedData;
    }

    get(url: string): RequestPromise {
        return this._send('GET', url);
    }

    post(url: string, data?: object, headers?: object, json?: boolean): RequestPromise {
        return this._send('POST', url, data, headers, json);
    }

    put(url: string, data?: object, headers?: object, json?: boolean): RequestPromise {
        return this._send('PUT', url, data);
    }

    delete(url: string, data?: object, headers?: object, json?: boolean): RequestPromise {
        return this._send('DELETE', url, data);
    }
}
