import { injectable } from 'inversify';
import { Constracts } from '../../contracts';
import 'reflect-metadata';

@injectable()
export class Filter implements Constracts.IFilter
{
    filterNews(stuff: any): any {

        let news: any[] = [];

        stuff.$(stuff.className).each((_: any, element: any) => {
            let text: string[] = stuff.$(element)
                    .text()
                    .split('\n')
                    .join('')
                    .split('... ');
            let [ title, date ] = text;

            let link: string|undefined = `${stuff.domain}/${stuff.$(element).attr('href')}`;

            if (title && date) {
                news.push({
                    title: title,
                    date: date,
                    link: link
                });
            }
        });

        return news;
    }

    filterTestSchedule(stuff: any): any {

        let tests: any[] = [];

        stuff.$(stuff.path).each((_: any, element: any) => {
            let columns: Cheerio = stuff.$(element).find('td span');

            tests.push({
                subject: stuff.$(columns[2]).text(),
                amount: stuff.$(columns[4]).text(),
                date: stuff.$(columns[5]).text(),
                time: stuff.$(columns[6]).text(),
                room: stuff.$(columns[8]).text()
            });
        });

        return tests;
    }

    filterTranscript(stuff: any): any {

        let transcript: any[] = [];

        stuff.$(stuff.path).each((_: any, element: any) => {
            let columns: Cheerio = stuff.$(element).find('td');
            transcript.push({
                subject: stuff.$(columns[2]).text(),
                assignment: stuff.$(columns[7]).text(),
                midterm: stuff.$(columns[8]).text(),
                final: stuff.$(columns[9]).text()
            });
        });

        return transcript;
    }

    filterTuition(stuff: any): any {

        let tuition = {
            credits: stuff.$(stuff.creditsId).text(),
            tuition: stuff.$(stuff.tuitionId).text(),
            discount: stuff.$(stuff.discountId).text(),
            prevDebt: stuff.$(stuff.prevDebtId).text(),
            paid: stuff.$(stuff.paidId).text(),
            healthInsurance: stuff.$(stuff.healthInsuranceId).text(),
            healthInsuranceDebt: stuff.$(stuff.healthInsuranceDebtId).text(),
            healthInsurancePaid: stuff.$(stuff.healthInsurancePaidId).text(),
            debt: stuff.$(stuff.debtId).text()
        }

        return tuition;
    }
    
    filterSchedule(stuff: any): any {

        let schedule: any[] = [];

        stuff.$(stuff.path).each((start: number, tr: any) => {
            stuff.$(tr).find('> td').each((i: number, td: any) => {
                if (stuff.$(td).attr('maph')) {
                    schedule.push({
                        subject: stuff.$(stuff.$(td).find('span')[0]).text(),
                        room: stuff.$(stuff.$(td).find('span')[2]).text(),
                        date: i + 1,
                        from: Object.values(stuff.period[start])[0],
                        to: Object.values(stuff.period[start - 1 + +(stuff.$(td).attr('rowspan') || '0')])[1]
                    });
                }
            });
        })

        return schedule;
    }
}
