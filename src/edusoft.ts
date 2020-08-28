import { ICrawler, Crawler } from './crawler';
import { loggedIn } from './decorator';
import fs from 'fs';

class Edusoft {

    /**
     * Get some Edusoft account information.
     * 
     * @param {string}      id          Your student ID.
     * @param {string}      password    Edusoft password.
     * @param {boolean}     loggedIn    Check login.
     * @param {object}      body        General data.
     * @param {ICrawler}    crawler     Object that can crawl the web page.
     */
    id: string;
    password: string;
    host: string;
    private _body: object;
    private _crawler: ICrawler;
    private _loggedIn: boolean;

    /**
     * Initialize
     * 
     * @param {string}  id          Your student ID.
     * @param {string}  password    Edusoft password.
     */
    constructor(id: string, password: string, host?: string|undefined) {
        this.id = id;
        this.password = password;
        this._loggedIn = false;
        this._crawler = new Crawler();
        this.host = host || 'https://edusoftweb.hcmiu.edu.vn';
        this._body = {
            __EVENTTARGET: '',
            __EVENTARGUMENT: '',
            __VIEWSTATEGENERATOR: 'CA0B0334'
        }
    }

    /**
     * Get session.
     * 
     * @return {Promise<boolean>}
     */
    async login(): Promise<boolean> {
        // Data of login form
        let data: object = {
            ctl00$ContentPlaceHolder1$ctl00$ucDangNhap$btnDangNhap: 'Đăng Nhập',
            ctl00$ContentPlaceHolder1$ctl00$ucDangNhap$txtTaiKhoa: this.id,
            ctl00$ContentPlaceHolder1$ctl00$ucDangNhap$txtMatKhau: this.password
        }

        // Send data to login form
        let $: CheerioAPI = await this._crawler
            .post(`${this.host}/default.aspx`, { ...this._body, ...data });

        return $('#ctl00_Header1_Logout1_lbtnLogOut').text() ? true : false;
    }

    /**
     * Display a listing of news.
     * 
     * @return {Promise<object[]>}
     */
    async getNews(): Promise<object[]> {
        let news: object[] = await this._crawler
            .crawlNews(`${this.host}/default.aspx?page=danhsachthongtin&type=0`);

        return news;
    }

    /**
     * Display schedule.
     * 
     * @return {Promise<object>}
     */
    @loggedIn
    async getSchedule(): Promise<object[]> {
        let period: object[] = JSON.parse(fs.readFileSync(`${__dirname}/../period.json`, 'utf-8'));
        let schedule = await this._crawler
            .crawlSchedule(`${this.host}/Default.aspx?page=thoikhoabieu`, period);

        return schedule;
    }

    /**
     * Display testing time.
     * 
     * @return {Promise<object[]>}
     */
    @loggedIn
    async getTestSchedule(): Promise<object[]> {
        let testSchedule: object[] = await this._crawler
            .crawlTestSchedule(`${this.host}/Default.aspx?page=xemlichthi`);

        return testSchedule;
    }

    /**
     * Display the specified listing of scores.
     * 
     * @param {object}  obj
     * @param {number}  obj.year        School year.
     * @param {number}  obj.semester    Semester of year.
     * 
     * @return {Promise<object[]>}
     */
    @loggedIn
    async getTranscript({ year = 2019, semester = 1 }: { year?: number, semester?: number }): Promise<object[]> {
        // Data of form
        let data: object = {
            ctl00$ContentPlaceHolder1$ctl00$MessageBox1$imgCloseButton: '',
            ctl00$ContentPlaceHolder1$ctl00$MessageBox1$btnOk: '',
            ctl00$ContentPlaceHolder1$ctl00$txtChonHK: '' + year + semester,
            ctl00$ContentPlaceHolder1$ctl00$btnChonHK: 'Xem'
        }
        
        let scores: object[] = await this._crawler
            .crawlTranscript(`${this.host}/Default.aspx?page=xemdiemthi`, { ...this._body, ...data })
        
        return scores;
    }

    /**
     * Display tuition information.
     * 
     * @return {Promise<object>}
     */
    @loggedIn
    async getTuition(): Promise<object> {
        let tuition: object = await this._crawler
            .crawlTuition(`${this.host}/Default.aspx?page=xemhocphi`);

        return tuition;
    }
}

export {
    Edusoft
}