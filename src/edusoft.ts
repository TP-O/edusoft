import { CrawlerAPI, Crawler } from './crawler';
import { loggedIn } from './decorator';

export class Edusoft {

    /**
     * Get some Edusoft account information.
     * 
     * @param {string}      id          Your student ID.
     * @param {string}      password    Edusoft password.
     * @param {boolean}     loggedIn    Check login.
     * @param {Object}      body        General data.
     * @param {CrawlerAPI}  crawler     Object that can crawl the web page.
     */
    id: string;
    password: string;
    loggedIn: boolean;
    host: string;
    body: Object;
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
            '__EVENTTARGET': '',
            '__EVENTARGUMENT': '',
            '__VIEWSTATEGENERATOR': 'CA0B0334'
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
            'ctl00$ContentPlaceHolder1$ctl00$ucDangNhap$btnDangNhap': 'Đăng Nhập',
            'ctl00$ContentPlaceHolder1$ctl00$ucDangNhap$txtTaiKhoa': this.id,
            'ctl00$ContentPlaceHolder1$ctl00$ucDangNhap$txtMatKhau': this.password
        }

        // Send data to login form
        let $: CheerioAPI = await this.crawler.post(`${this.host}/default.aspx`, { ...this.body, ...data });

        // Check login
        if (! $('#ctl00_Header1_Logout1_lblNguoiDung').text()) {
            throw new Error('Login failed!');
        }
        return this.loggedIn = true
    }

    /**
     * Display a listing of news.
     * 
     * @return {Promise<Object>}
     */
    async getNews(): Promise<Object> {
        let news: Object = await this.crawler.crawlNews(`${this.host}/default.aspx?page=danhsachthongtin&type=0`);

        return news;
    }


    /**
     * Display schedule.
     * 
     * @return {Promise<Object>}
     */
    @loggedIn
    async getSchedule(): Promise<Object> {
        return {};
    }

    /**
     * Display testing time.
     * 
     * @return {Promise<Object>}
     */
    @loggedIn
    async getTestSchedule(): Promise<Object> {
        let testSchedule: Object = await this.crawler.crawlTestSchedule(`${this.host}/Default.aspx?page=xemlichthi`);

        return testSchedule;
    }

    /**
     * Display the specified listing of scores.
     * 
     * @param {Object}  obj
     * @param {number}  obj.year        School year.
     * @param {number}  obj.semester    Semester of year.
     * 
     * @return {Promise<Object>}
     */
    @loggedIn
    async getTranscript({ year = 2019, semester = 1 }: { year?: number, semester?: number }): Promise<Object> {
        // Data of form
        let data: Object = {
            'ctl00$ContentPlaceHolder1$ctl00$MessageBox1$imgCloseButton': '',
            'ctl00$ContentPlaceHolder1$ctl00$MessageBox1$btnOk': '',
            'ctl00$ContentPlaceHolder1$ctl00$txtChonHK': '' + year + semester,
            'ctl00$ContentPlaceHolder1$ctl00$btnChonHK': 'Xem'
        }
        
        let scores: Object = await this.crawler.crawlTranscript(`${this.host}/Default.aspx?page=xemdiemthi`, { ...this.body, ...data })
        
        return scores;
    }

    /**
     * Display tuition information.
     * 
     * @return {Promise<Object>}
     */
    @loggedIn
    async getTuition(): Promise<Object> {
        let tuition: Object = await this.crawler.crawlTuition(`${this.host}/Default.aspx?page=xemhocphi`);

        return tuition;
    }
}