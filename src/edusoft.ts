import requireSignIn from './decorators/signin';
import IEduSoft from './contracts/iedusoft';
import ICrawler from './contracts/icrawler';
import ISender from './contracts/isender';
import { Crawler } from './crawler';
import { Sender } from './sender';
import data from '../data.json';

class EduSoft implements IEduSoft
{

    /**
     * Get some Edusoft account information.
     * 
     * @param {string}      _host       Domain name
     * @param {string}      _username   Student ID
     * @param {string}      _password   Password
     * @param {object}      _body       General data
     * @param {boolean}     _signedIn   Check sign-in status
     * @param {ISender}     _sender     Send request
     * @param {ICrawler}    _crawler    Crawl the web page
     */
    private _host: string;
    private _username: string;
    private _password: string;

    private _body: object;
    private _signedIn: boolean;

    private _sender: ISender;
    private _crawler: ICrawler;

    /**
     * Initialize
     * 
     * @param {string}  username    Student ID
     * @param {string}  password    Password
     * @param {string}  host        Domain name
     */
    constructor(username: string, password: string, host?: string)
    {
        this._username = username;
        this._password = password;
        this._host = host || 'https://edusoftweb.hcmiu.edu.vn';

        this._body = {
            __EVENTTARGET: '',
            __EVENTARGUMENT: '',
            __VIEWSTATEGENERATOR: 'CA0B0334'
        };
        this._signedIn = false;

        this._sender = new Sender();
        this._crawler = new Crawler();
    }
    /**
     * Sign-in
     * 
     * @return {Promise<boolean>}
     */
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

    /**
     * Sign-out
     * 
     * @return {Promise<boolean>}
     */
    public async signOut(): Promise<boolean>
    {
        let data: any = { ...this._body };
        data.__EVENTTARGET = 'ctl00$Header1$Logout1$lbtnLogOut';

        let $: CheerioAPI = await this._sender
            .post(`${this._host}/default.aspx`, data);

        return $('#ctl00_Header1_Logout1_lbtnChangePass').text() ? false : true;
    }

    /**
     * Display a listing of news
     * 
     * @return {Promise<Array<object>>}
     */
    public async getNews(): Promise<Array<object>>
    {
        let news: Array<object> = await this._crawler
            .crawlNews(`${this._host}/default.aspx?page=danhsachthongtin&type=0`, this._host);

        return news;
    }

    /**
     * Display schedule
     * 
     * @return {Promise<object>}
     */
    @requireSignIn
    public async getSchedule(): Promise<Array<object>>
    {
        let schedule = await this._crawler
            .crawlSchedule(`${this._host}/Default.aspx?page=thoikhoabieu`, data['period']);

        return schedule;
    }

    /**
     * Display test schedule
     * 
     * @return {Promise<Array<object>>}
     */
    @requireSignIn
    public async getTestSchedule(): Promise<Array<object>>
    {
        let testSchedule: object[] = await this._crawler
            .crawlTestSchedule(`${this._host}/Default.aspx?page=xemlichthi`);

        return testSchedule;
    }

    /**
     * Display the specified listing of scores
     * 
     * @param {object}  obj
     * @param {number}  obj.year        School year.
     * @param {number}  obj.semester    Semester of year.
     * 
     * @return {Promise<Array<object>>}
     */
    @requireSignIn
    public async getTranscript({ year = 2019, semester = 1 }:
        { year?: number, semester?: number }): Promise<Array<object>>
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

    /**
     * Display tuition information.
     * 
     * @return {Promise<object>}
     */
    @requireSignIn
    public async getTuition(): Promise<object>
    {
        let tuition: object = await this._crawler
            .crawlTuition(`${this._host}/Default.aspx?page=xemhocphi`);

        return tuition;
    }
}

export { EduSoft };
