import { CrawlerAPI, Crawler } from './crawler';
import { loggedIn } from './decorator';

export class Edusoft {

    /**
     * Get some Edusoft account information.
     * 
     * @param {string}      id          Your student ID.
     * @param {string}      password    Edusoft password.
     * @param {boolean}     loggedIn    Check login.
     * @param {object}      body        General data.
     * @param {CrawlerAPI}  crawler     Object that can crawl the web page.
     */
    id: string;
    password: string;
    loggedIn: boolean;
    host: string;
    body: object;
    crawler: CrawlerAPI;

    /**
     * Initialize
     * 
     * @param {string}  id          Your student ID.
     * @param {string}  password    Edusoft password.
     */
    constructor(id: string, password: string) {
        if (typeof id !== 'string' || typeof password !== 'string') {
            throw new Error('ID and Password must be string!');
        }

        this.id = id;
        this.password = password;
        this.loggedIn = false;
        this.host = 'https://edusoftweb.hcmiu.edu.vn';
        this.body = {
            __EVENTTARGET: '',
            __EVENTARGUMENT: '',
            __VIEWSTATEGENERATOR: 'CA0B0334'
        }
        this.crawler = new Crawler();
    }

    /**
     * Get session.
     * 
     * @return {Promise<boolean>}
     * @throws {Error}
     */
    async login(): Promise<boolean> {
        // Data of login form
        let data: object = {
            ctl00$ContentPlaceHolder1$ctl00$ucDangNhap$btnDangNhap: 'Đăng Nhập',
            ctl00$ContentPlaceHolder1$ctl00$ucDangNhap$txtTaiKhoa: this.id,
            ctl00$ContentPlaceHolder1$ctl00$ucDangNhap$txtMatKhau: this.password
        }

        // Send data to login form
        let $: CheerioAPI = await this.crawler
            .post(`${this.host}/default.aspx`, { ...this.body, ...data });

        // Check login
        if (! $('#ctl00_Header1_Logout1_lblNguoiDung').text()) {
            throw new Error('Login failed!');
        }
        return this.loggedIn = true
    }

    /**
     * Display a listing of news.
     * 
     * @return {Promise<object[]>}
     */
    async getNews(): Promise<object[]> {
        let news: object[] = await this.crawler
            .crawlNews(`${this.host}/default.aspx?page=danhsachthongtin&type=0`);

        return news;
    }

    /**
     * Display schedule.
     * 
     * @return {Promise<Object>}
     */
    @loggedIn
    async getSchedule(): Promise<object[]> {
        return [{}];
    }

    /**
     * Display testing time.
     * 
     * @return {Promise<object[]>}
     */
    @loggedIn
    async getTestSchedule(): Promise<object[]> {
        let testSchedule: object[] = await this.crawler
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
        
        let scores: object[] = await this.crawler
            .crawlTranscript(`${this.host}/Default.aspx?page=xemdiemthi`, { ...this.body, ...data })
        
        return scores;
    }

    /**
     * Display tuition information.
     * 
     * @return {Promise<object>}
     */
    @loggedIn
    async getTuition(): Promise<object> {
        let tuition: object = await this.crawler
            .crawlTuition(`${this.host}/Default.aspx?page=xemhocphi`);

        return tuition;
    }
}