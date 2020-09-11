import { requireSignIn } from '../decorators/signin';
import { IRegister } from '../contracts/register';
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
     * Register subjects
     */
    private _register: IRegister;

    /**
     * Initialize
     * 
     * @param {string}  username    Student ID
     * @param {string}  password    Password
     * @param {string}  host        Domain name
     */
    constructor(
        @inject('ISender') sender: ISender,
        @inject('ICrawler') crawler: ICrawler,
        @inject('IRegister') register: IRegister
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
        this._register = register;
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

        this._register.setId(id);

        let rs = await this._register
            .select(`${this._host}/ajaxpro/EduSoft.Web.UC.DangKyMonHoc,EduSoft.Web.ashx`)
            .then(r => r.save(`${this._host}/ajaxpro/EduSoft.Web.UC.DangKyMonHoc,EduSoft.Web.ashx`))
            .then(r => r.check(`${this._host}/ajaxpro/EduSoft.Web.UC.DangKyMonHoc,EduSoft.Web.ashx`))
            .then(r => r.saved(`${this._host}/ajaxpro/EduSoft.Web.UC.DangKyMonHoc,EduSoft.Web.ashx`))
            .then(r => r.saved2(`${this._host}/ajaxpro/EduSoft.Web.UC.DangKyMonHoc,EduSoft.Web.ashx`))
            .catch(e => false);

        return rs;
    }
}
