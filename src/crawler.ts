import ISender from './contracts/isender';
import { Sender } from './sender';

class Crawler {
    private _sender: ISender;

    public constructor()
    {
        this._sender = new Sender();
    }

    async crawlNews(url: string, domain: string): Promise<Array<object>>
    {
        let $: CheerioAPI = await this._sender.get(url);
        let news: Array<object> = [];

        $('.TextTitle').each((index, element) => {
            let text:string[] = $(element).text().split('\n').join('').split('... ');
            let title: string = text[0];
            let date: string = text[1];
            let link: string|undefined = `${domain}/${$(element).attr('href')}`;

            if (title && date) news.push({ title: title, date: date, link: link });
        });

        return news;
    }

    async crawlTestSchedule(url: string): Promise<Array<object>>
    {
        let $: CheerioAPI = await this._sender.get(url);
        let tests: Array<object> = [];

        $('#ctl00_ContentPlaceHolder1_ctl00_gvXem tr[onmouseout="className=\'\'"]').each((index, element) => {
            let columns: Cheerio = $(element).find('td span');
            let test: Object = {
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

    async crawlTranscript(url: string, data: object): Promise<Array<object>>
    {
        await this._sender.get(url);

        let $: CheerioAPI = await this._sender.post(url, data);
        let transcript: Array<object> = [];

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

    async crawlTuition(url: string): Promise<object>
    {
        let $: CheerioAPI = await this._sender.get(url);
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

    async crawlSchedule(url: string, period: Array<object>): Promise<any>
    {
        let $: CheerioAPI = await this._sender.get(url);
        let rows = $('#ctl00_ContentPlaceHolder1_ctl00_Table1 > tbody > tr');
        let schedule: Array<object> = [];

        rows.each((start, tr) => {
            $(tr).find('> td').each((i, td) => {
                if ($(td).attr('maph')) {
                    schedule.push({
                        subject: $($(td).find('span')[0]).text(),
                        room: $($(td).find('span')[2]).text(),
                        date: i + 1,
                        from: Object.values(period[start])[0],
                        to: Object.values(period[start - 1 + +($(td).attr('rowspan') || '0')])[1]
                    });
                }
            });
        })

        return schedule;
    }
}

export { Crawler };
