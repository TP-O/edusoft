export namespace Types {
    
    export interface LoginInfor {
        host: string,
        body: {
            __EVENTTARGET: string,
            __EVENTARGUMENT: string,
            __VIEWSTATEGENERATOR: string
        },
        username?: string,
        password?: string
    }

    export interface RegisterInfo {
        id: string,
        host: string
    }

    export interface CAPTCHAInfor {
        host: string,
        body: {
            __EVENTTARGET: string,
            __EVENTARGUMENT: string,
            __VIEWSTATEGENERATOR: string
        }
    }
}
