import { CookieJar } from 'request';
import requestPromise, { RequestPromise } from 'request-promise';
import cheerio from 'cheerio';

interface CrawlerAPI {
    get(url: string): RequestPromise;
    post(url: string, data: object): RequestPromise;
    crawlTranscript(url: string, data: object): Promise<Object>;
    crawlNews(url: string): Promise<Object>;
    crawlTestSchedule(url: string): Promise<Object>;
    crawlTuition(url: string): Promise<Object>;
}

class Crawler {
    public cookie: CookieJar;

    public constructor() {
        this.cookie = requestPromise.jar();
    }

    public send(method: string, url: string, data?: object): RequestPromise {
        return requestPromise(url, {
            method: method,
            formData: data,
            followAllRedirects: true,
            jar: this.cookie,
            transform: (body) => cheerio.load(body)
        });
    }

    public get(url: string): RequestPromise {
        return this.send('GET', url);
    }

    public post(url: string, data: object): RequestPromise {
        return this.send('POST', url, data);
    }

    async crawlNews(url: string): Promise<Object> {
        let $: CheerioAPI = await this.get(url);
        let news: object[] = [];

        $('.TextTitle').each((index, element) => {
            let text:string[] = $(element).text().split('\n').join('').split('... ');
            let title: string = text[0] + '...';
            let date: string = text[1];
            let link: string|undefined = `https://edusoftweb.hcmiu.edu.vn/${$(element).attr('href')}`;

            news.push({ title: title, date: date, link: link });
        });

        return news;
    }

    async crawlTestSchedule(url: string): Promise<Object> {
        let $: CheerioAPI = await this.get(url);
        let tests: object[] = [];

        $('#ctl00_ContentPlaceHolder1_ctl00_gvXem tr[onmouseout="className=\'\'"]').each((index, element) => {
            let columns: Cheerio = $(element).find('td span');
            let test: object = {
                subject: $(columns[2]).text(),
                amount: $(columns[4]).text(),
                date: $(columns[5]).text(),
                time: $(columns[6]).text(),
                room: $(columns[8]).text()
            }
            tests.push(test);
        });

        return tests;
    }

    async crawlTranscript(url: string, data: object): Promise<Object> {
        await this.get(url);

        let $: CheerioAPI = await this.post(url, data);
        let transcript: object[] = [];

        $('#ctl00_ContentPlaceHolder1_ctl00_div1 .row-diem').each((index, element) => {
            let columns: Cheerio = $(element).find('td');
            let scores: object = {
                subject: $(columns[2]).text(),
                assignment: $(columns[7]).text(),
                midterm: $(columns[8]).text(),
                final: $(columns[9]).text()
            }
            transcript.push(scores);
        });

        return transcript;
    }

    async crawlTuition(url: string): Promise<Object> {
        let $: CheerioAPI = await this.get(url);
        let information: object = {
            credits: $('#ctl00_ContentPlaceHolder1_ctl00_xdSoTinChiHPHK').text(),
            tuition: $('#ctl00_ContentPlaceHolder1_ctl00_xdTongHK').text(),
            discount: $('#ctl00_ContentPlaceHolder1_ctl00_xdmiengiam').text(),
            prevDebt: $('#ctl00_ContentPlaceHolder1_ctl00_xdTonno').text(),
            paid: $('#ctl00_ContentPlaceHolder1_ctl00_xdDadongHK').text(),
            healthInsurance: $('#ctl00_ContentPlaceHolder1_ctl00_xdBHYT').text(),
            healthInsuranceDebt: $('#ctl00_ContentPlaceHolder1_ctl00_xdTonNoBHYT').text(),
            healthInsurancePaid: $('#ctl00_ContentPlaceHolder1_ctl00_xdDadongBHYT').text(),
            debt: $('#ctl00_ContentPlaceHolder1_ctl00_xdPhaidong').text()
        }

        return information;
    }
}

export {
    CrawlerAPI,
    Crawler
}