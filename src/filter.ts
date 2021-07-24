import { edusoft } from "./configs/edusoft";
import { path } from "./configs/path";
import { ExamDay } from "./types/exam";
import { Lesson } from "./types/lesson";
import { News } from "./types/news";
import { Score } from "./types/score";
import { Tuition } from "./types/tuition";

const news = ($: cheerio.CheerioAPI): News[] => {
  const news: News[] = [];

  $(path.news).each((_: any, element: any) => {
    const [title, date] = $(element).text().split("\n").join("").split("... ");
    const url = `${edusoft.host}/${$(element).attr("href")}`;

    if (title && date) {
      news.push({ title, date, url });
    }
  });

  return news;
};

const schedule = ($: cheerio.CheerioAPI): Lesson[] => {
  const lessons: Lesson[] = [];

  $(path.schedule).each((start: number, tr: any) => {
    $(tr)
      .find("> td")
      .each((i: number, td: any) => {
        if ($(td).attr("maph")) {
          lessons.push({
            subject: $($(td).find("span")[0]).text(),
            room: $($(td).find("span")[2]).text(),
            dayOfWeek: i + 1,
            from: edusoft.classTime[start].from,
            to: edusoft.classTime[start - 1 + +($(td).attr("rowspan") || "0")].to,
          });
        }
      });
  });

  return lessons;
};

const examSchedule = ($: cheerio.CheerioAPI): ExamDay[] => {
  const days: ExamDay[] = [];

  $(path.examSchedule).each((_: any, element: any) => {
    const columns = $(element).find("td span");

    days.push({
      subject: $(columns[2]).text(),
      amount: $(columns[4]).text(),
      date: $(columns[5]).text(),
      time: $(columns[6]).text(),
      room: $(columns[8]).text(),
    });
  });

  return days;
};

const tuition = ($: cheerio.CheerioAPI): Tuition => {
  return {
    credits: $(path.credits).text(),
    tuition: $(path.tuition).text(),
    discount: $(path.discount).text(),
    prevDebt: $(path.prevDebt).text(),
    paid: $(path.paid).text(),
    healthInsurance: $(path.healthInsurance).text(),
    healthInsuranceDebt: $(path.healthInsuranceDebt).text(),
    healthInsurancePaid: $(path.healthInsurancePaid).text(),
    debt: $(path.debt).text(),
  };
};

const transcript = ($: cheerio.CheerioAPI): Score[] => {
  const scores: Score[] = [];

  $(path.transcript).each((_: any, element: any) => {
    let columns = $(element).find("td");
    scores.push({
      subject: $(columns[2]).text(),
      assignment: $(columns[7]).text(),
      midterm: $(columns[8]).text(),
      final: $(columns[9]).text(),
    });
  });

  return scores;
};

export default { news, schedule, examSchedule, tuition, transcript };
