import { RequestPromise } from 'request-promise';
import { Types } from '../types';

export namespace Constracts {

    export interface IEduSoft {

        host: string;
        username: string;
        password: string;

        getNews(): Promise<object[]>;

        getSchedule(): Promise<object[]>;

        getTestSchedule(): Promise<object[]>;

        getTranscript(year: number, semester: number): Promise<object[]>;

        getTuition(): Promise<object>

        register(id: string): Promise<any>;
    }

    export interface IAuth {

        signIn(infor: Types.LoginInfor): Promise<boolean>;

        signOut(infor: Types.LoginInfor): Promise<boolean>;
    }

    export interface IRegister {

        register(infor: Types.RegisterInfo): Promise<boolean>;
    }

    export interface ICrawler {

        crawlTuition(url: string): Promise<object>;

        crawlTestSchedule(url: string): Promise<object[]>;

        crawlNews(url: string, domain: string): Promise<object[]>;

        crawlTranscript(url: string, data: object): Promise<object[]>;

        crawlSchedule(url: string, period: object[]): Promise<object[]>;
    }

    export interface IFilter {

        filterTuition(stuff: any): any;

        filterTestSchedule(stuff: any): any;

        filterNews(stuff: any): any;

        filterTranscript(stuff: any): any;

        filterSchedule(stuff: any): any;
    }

    export interface ISender {

        get(url: string): RequestPromise;
        
        put(url: string, data?: object, headers?: object, json?: boolean): RequestPromise;

        post(url: string, data?: object, headers?: object, json?: boolean): RequestPromise;

        delete(url: string, data?: object, headers?: object, json?: boolean): RequestPromise;
    }
    
    export interface ICAPTCHA {

        byPass(infor: Types.CAPTCHAInfor): Promise<boolean>;
    }
}
