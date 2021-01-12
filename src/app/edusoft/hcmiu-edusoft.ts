import { requireSignIn } from '../../decorators/signin';
import { inject, injectable } from 'inversify';
import data from '../../data.json';
import 'reflect-metadata';
import { Constracts } from '../../contracts';

@injectable()
export class EduSoft implements Constracts.IEduSoft
{
    private _username = '';

    private _password = '';

    private _singedIn = false;

    private _host = 'https://edusoftweb.hcmiu.edu.vn';

    private _body = {
        __EVENTTARGET: '',
        __EVENTARGUMENT: '',
        __VIEWSTATEGENERATOR: 'CA0B0334'
    };

    constructor(
        @inject('HCMIUSender') private _sender: Constracts.ISender,
        @inject('HCMIUCrawler') private _crawler: Constracts.ICrawler,
        @inject('HCMIURegister') private _register: Constracts.IRegister,
        @inject('HCMIUAuth') private _auth: Constracts.IAuth
    ) {}

    get host() {
        return this._host;
    }

    set host(host: string) {
        this._host = host;
    }

    get username() {
        return this._username;
    }

    set username(username: string) {
        this._username = username;
    }

    get password() {
        return this._password;
    }

    set password(password: string) {
        this._password = password;
    }

    async getNews(): Promise<object[]> {
        let news: object[] = await this._crawler
            .crawlNews(`${this._host}/default.aspx?page=danhsachthongtin&type=0`, this._host);

        return news;
    }

    @requireSignIn
    async getSchedule(): Promise<object[]> {
        let schedule = await this._crawler
            .crawlSchedule(`${this._host}/Default.aspx?page=thoikhoabieu`, data['period']);

        return schedule;
    }

    @requireSignIn
    async getTestSchedule(): Promise<object[]> {
        let testSchedule: object[] = await this._crawler
            .crawlTestSchedule(`${this._host}/Default.aspx?page=xemlichthi`);

        return testSchedule;
    }

    @requireSignIn
    async getTranscript(year: number, semester: number): Promise<object[]> {
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
    async getTuition(): Promise<object> {
        let tuition: object = await this._crawler
            .crawlTuition(`${this._host}/Default.aspx?page=xemhocphi`);

        return tuition;
    }

    @requireSignIn
    async register(id: string): Promise<any> {

        return this._register.register({
            id: id,
            host: this._host
        });
    }
}
