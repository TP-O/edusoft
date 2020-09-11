import { requireSignIn } from '../decorators/signin';
import { ICrawler } from '../contracts/crawler';
import { ISender } from '../contracts/sender';
import { IEduSoft } from '../contracts/edusoft';
import { inject, injectable } from 'inversify';
import data from '../../data.json';
import 'reflect-metadata';

@injectable()
export class EduSoft implements IEduSoft
{
    /**
     * Domain name
     */
    private _host: string;

    /**
     * Student ID
     */
    private _username: string;

    /**
     * Password
     */
    private _password: string;    

    /**
     * General data
     */
    private _body: object;

    /**
     * Sign-in status
     */
    private _signedIn: boolean;

    /**
     * Send request
     */
    private _sender: ISender;

    /**
     * Crawl the web page
     */
    private _crawler: ICrawler;

    /**
     * Initialize
     * 
     * @param {string}  username    Student ID
     * @param {string}  password    Password
     * @param {string}  host        Domain name
     */
    constructor(
        @inject('ISender') sender: ISender,
        @inject('ICrawler') crawler: ICrawler
    )
    {
        this._username = '';
        this._password = '';
        this._host = 'https://edusoftweb.hcmiu.edu.vn';

        this._body = {
            __EVENTTARGET: '',
            __EVENTARGUMENT: '',
            __VIEWSTATEGENERATOR: 'CA0B0334'
        };
        this._signedIn = false;

        this._sender = sender;
        this._crawler = crawler;
    }

    public setUsername(username: string): void
    {
        this._username = username;
    }

    public setPassword(password: string): void
    {
        this._password = password;
    }

    public setHost(host: string): void
    {
        this._host = host;
    }

    public async signIn(): Promise<boolean>
    {
        // Data of login form
        let data: object = {
            ctl00$ContentPlaceHolder1$ctl00$ucDangNhap$btnDangNhap: 'Đăng Nhập',
            ctl00$ContentPlaceHolder1$ctl00$ucDangNhap$txtTaiKhoa: this._username,
            ctl00$ContentPlaceHolder1$ctl00$ucDangNhap$txtMatKhau: this._password
        }

        // Send data to login form
        let $: CheerioAPI = await this._sender
            .post(`${this._host}/default.aspx`, { ...this._body, ...data });

        return $('#ctl00_Header1_Logout1_lbtnChangePass').text() ? true : false;
    }

    public async signOut(): Promise<boolean>
    {
        let data: any = { ...this._body };
        data.__EVENTTARGET = 'ctl00$Header1$Logout1$lbtnLogOut';

        let $: CheerioAPI = await this._sender
            .post(`${this._host}/default.aspx`, data);

        return $('#ctl00_Header1_Logout1_lbtnChangePass').text() ? false : true;
    }

    public async getNews(): Promise<object[]>
    {
        let news: object[] = await this._crawler
            .crawlNews(`${this._host}/default.aspx?page=danhsachthongtin&type=0`, this._host);

        return news;
    }

    @requireSignIn
    public async getSchedule(): Promise<object[]>
    {
        let schedule = await this._crawler
            .crawlSchedule(`${this._host}/Default.aspx?page=thoikhoabieu`, data['period']);

        return schedule;
    }

    @requireSignIn
    public async getTestSchedule(): Promise<object[]>
    {
        let testSchedule: object[] = await this._crawler
            .crawlTestSchedule(`${this._host}/Default.aspx?page=xemlichthi`);

        return testSchedule;
    }

    @requireSignIn
    public async getTranscript(year: number, semester: number): Promise<object[]>
    {
        // Data of form
        let data: object = {
            ctl00$ContentPlaceHolder1$ctl00$MessageBox1$imgCloseButton: '',
            ctl00$ContentPlaceHolder1$ctl00$MessageBox1$btnOk: '',
            ctl00$ContentPlaceHolder1$ctl00$txtChonHK: '' + year + semester,
            ctl00$ContentPlaceHolder1$ctl00$btnChonHK: 'Xem'
        }
        
        let scores: object[] = await this._crawler
            .crawlTranscript(`${this._host}/Default.aspx?page=xemdiemthi`, { ...this._body, ...data })
        
        return scores;
    }

    @requireSignIn
    public async getTuition(): Promise<object>
    {
        let tuition: object = await this._crawler
            .crawlTuition(`${this._host}/Default.aspx?page=xemhocphi`);

        return tuition;
    }

    @requireSignIn
    public async register(id: string): Promise<any>
    {
        await this._sender.get(`${this._host}/Default.aspx?page=dkmonhoc`);

        let data = id.split('|');
        let selected = {
            "check": true,
            "maDK": data[0],
            "maMH": data[1],
            "tenMH": data[2],
            "maNh": data[3],
            "sotc": data[4],
            "strSoTCHP": data[5],
            "ngaythistr": data[6],
            "tietbd": data[7],
            "sotiet": data[8],
            "soTCTichLuyToiThieuMonYeuCau": data[9],
            "choTrung": data[10],
            "soTCMinMonYeuCau": data[11],
            "maKhoiSinhVien": data[12]
        };
        let rs = await this._sender
            .post(
                `${this._host}/ajaxpro/EduSoft.Web.UC.DangKyMonHoc,EduSoft.Web.ashx`,
                selected,
                {
                    "X-AjaxPro-Method": "DangKySelectedChange"
                },
                true);
        
        data = rs.value.split('|');
        let save = {
            "isValidCoso": false,
            "isValidTKB": false,
            "maDK": data[1],
            "maMH": data[12],
            "sotc": data[13],
            "tenMH": data[14],
            "maNh": data[15],
            "strsoTCHP": data[16],
            "isCheck": "true",
            "oldMaDK": data[4],
            "strngayThi": data[25],
            "tietBD": data[26],
            "soTiet": data[27],
            "isMHDangKyCungKhoiSV": data[35]
        }
        rs = await this._sender
            .post(
                `${this._host}/ajaxpro/EduSoft.Web.UC.DangKyMonHoc,EduSoft.Web.ashx`,
                save,
                {
                    "X-AjaxPro-Method": "LuuVaoKetQuaDangKy"
                },
                true);
        
        let checked = {};
        rs = await this._sender
            .post(
                `${this._host}/ajaxpro/EduSoft.Web.UC.DangKyMonHoc,EduSoft.Web.ashx`,
                checked,
                {
                    "X-AjaxPro-Method": "KiemTraTrungNhom"
                },
                true);
        
        let saved = {};
        rs = await this._sender
            .post(
                `${this._host}/ajaxpro/EduSoft.Web.UC.DangKyMonHoc,EduSoft.Web.ashx`,
                saved,
                {
                    "X-AjaxPro-Method": "LuuDanhSachDangKy"
                },
                true);
        
        let saved2 = {
            "isCheckSongHanh":false,
            "ChiaHP":false
        };
        rs = await this._sender
            .post(
                `${this._host}/ajaxpro/EduSoft.Web.UC.DangKyMonHoc,EduSoft.Web.ashx`,
                saved2,
                {
                    "X-AjaxPro-Method": "LuuDanhSachDangKy_HopLe"
                },
                true);

        return rs;
    }
}
