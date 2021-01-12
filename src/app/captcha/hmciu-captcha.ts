import { inject, injectable } from "inversify";
import { Constracts } from "../../contracts";
import { Types } from "../../types";
import 'reflect-metadata';

export class CAPTCHA implements Constracts.ICAPTCHA {

    public constructor(@inject('HCMIUSender') private _sender: Constracts.ISender) {}

    async byPass(infor: Types.CAPTCHAInfor): Promise<boolean> {

        let $: CheerioAPI = await this._sender
            .get(`${infor.host}/Default.aspx?page=xacthuctrangchu`);

        let text: string = $('#ctl00_ContentPlaceHolder1_ctl00_lblCapcha').text();
        let state: string = $('#__VIEWSTATE').val();

        let data = {
            ctl00$ContentPlaceHolder1$ctl00$txtCaptcha: text,
            __VIEWSTATE: state,
            ctl00$ContentPlaceHolder1$ctl00$imbReLoad: '0',
            ctl00$ContentPlaceHolder1$ctl00$btnXacNhan: 'Vào website',
        }
        
        $ = await this._sender
            .post(`${infor.host}/Default.aspx?page=xacthuctrangchu`, { ...infor.body, ...data });

        return true;
    }
}
