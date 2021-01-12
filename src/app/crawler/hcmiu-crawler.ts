import { inject, injectable } from 'inversify';
import { Constracts } from '../../contracts';
import 'reflect-metadata';

@injectable()
export class Crawler implements Constracts.ICrawler
{
    constructor(
        @inject('HCMIUSender') private _sender: Constracts.ISender,
        @inject('HCMIUFilter') private _filter: Constracts.IFilter
    ) {}

    async crawlNews(url: string, domain: string): Promise<object[]> {
        
        let $: CheerioAPI = await this._sender.get(url);

        return this._filter.filterNews({
            $: $,
            domain: domain,
            className: '.TextTitle'
        });
    }

    async crawlTestSchedule(url: string): Promise<object[]> {

        let $: CheerioAPI = await this._sender.get(url);

        return this._filter.filterTestSchedule({
            $: $,
            path: '#ctl00_ContentPlaceHolder1_ctl00_gvXem tr[onmouseout="className=\'\'"]'
        });
    }

    async crawlTranscript(url: string, data: object): Promise<object[]> {

        await this._sender.get(url);

        let $: CheerioAPI = await this._sender.post(url, data);

        return this._filter.filterTranscript({
            $: $,
            path: '#ctl00_ContentPlaceHolder1_ctl00_div1 .row-diem'
        });
    }

    async crawlTuition(url: string): Promise<object> {

        let $: CheerioAPI = await this._sender.get(url);

        return this._filter.filterTuition({
            $: $,
            creditsId: '#ctl00_ContentPlaceHolder1_ctl00_xdSoTinChiHPHK',
            tuitionId: '#ctl00_ContentPlaceHolder1_ctl00_xdTongHK',
            discountId: '#ctl00_ContentPlaceHolder1_ctl00_xdmiengiam',
            prevDebtId: '#ctl00_ContentPlaceHolder1_ctl00_xdTonno',
            paidId: '#ctl00_ContentPlaceHolder1_ctl00_xdDadongHK',
            healthInsuranceId: '#ctl00_ContentPlaceHolder1_ctl00_xdBHYT',
            healthInsuranceDebtId: '#ctl00_ContentPlaceHolder1_ctl00_xdTonNoBHYT',
            healthInsurancePaidId: '#ctl00_ContentPlaceHolder1_ctl00_xdDadongBHYT',
            debtId: '#ctl00_ContentPlaceHolder1_ctl00_xdPhaidong'
        });
    }

    async crawlSchedule(url: string, period: object[]): Promise<any> {

        let $: CheerioAPI = await this._sender.get(url);

        return this._filter.filterSchedule({
            $: $,
            period: period,
            path: '#ctl00_ContentPlaceHolder1_ctl00_Table1 > tbody > tr'
        });
    }
}
