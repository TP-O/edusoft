import { inject, injectable } from "inversify";
import { Constracts } from "../../contracts";
import { Types } from "../../types";
import 'reflect-metadata';

@injectable()
export class Auth implements Constracts.IAuth {

    constructor(@inject('HCMIUSender') private _sender: Constracts.ISender) {}

    async signIn(infor: Types.LoginInfor): Promise<any> {
        
        let $: CheerioAPI = await this._sender
            .get(`${infor.host}/Default.aspx?page=xacthuctrangchu`);

        // Data of login form
        let data: any = {
            ctl00$ContentPlaceHolder1$ctl00$ucDangNhap$btnDangNhap: 'Đăng Nhập',
            ctl00$ContentPlaceHolder1$ctl00$ucDangNhap$txtTaiKhoa: infor.username,
            ctl00$ContentPlaceHolder1$ctl00$ucDangNhap$txtMatKhau: infor.password,
        }

        // Send data to login form
        $ = await this._sender
            .post(`${infor.host}/default.aspx`, { ...infor.body, ...data });

        return $('#ctl00_Header1_Logout1_lbtnChangePass').text() ? true : false;
    }

    async signOut(infor: Types.LoginInfor): Promise<boolean> {

        infor.body.__EVENTTARGET = 'ctl00$Header1$Logout1$lbtnLogOut';

        let $: CheerioAPI = await this._sender
            .post(`${infor.host}/default.aspx`, infor.body);

        return $('#ctl00_Header1_Logout1_lbtnChangePass').text() ? false : true;
    }
}
