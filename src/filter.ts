import { edusoft } from "./configs/edusoft";
import { path } from "./configs/path";
import { ExamDay, Lesson, News, Score, Tuition } from "./types";

const news = ($: cheerio.CheerioAPI) => {
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

const schedule = ($: cheerio.CheerioAPI) => {
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
            to: edusoft.classTime[start - 1 + +($(td).attr("rowspan") || "0")]
              .to,
          });
        }
      });
  });

  return lessons;
};

const midtermExamSchedule = ($: cheerio.CheerioAPI) => {
  const days: ExamDay[] = [];

  $(path.examSchedule).each((_: any, element: any) => {
    const columns = $(element).find("td span");

    days.push({
      subject: $(columns[2]).text(),
      amount: $(columns[5]).text(),
      date: $(columns[6]).text(),
      time: $(columns[7]).text(),
      room: $(columns[9]).text(),
    });
  });

  return days;
};

const finalExamSchedule = ($: cheerio.CheerioAPI) => {
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

const tuition = ($: cheerio.CheerioAPI) => {
  const tuition: Tuition = {
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

  return tuition;
};

const transcript = ($: cheerio.CheerioAPI) => {
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

export default {
  news,
  schedule,
  midtermExamSchedule,
  finalExamSchedule,
  tuition,
  transcript,
};
