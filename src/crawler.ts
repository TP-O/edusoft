import { edusoft } from "./configs/edusoft";
import { uri } from "./configs/uri";
import filter from "./filter";
import request from "./request";

const news = async () => {
  return filter.news(await request.get(uri.news));
};

const schedule = async () => {
  return filter.schedule(await request.get(uri.schedule));
};

const finalExamSchedule = async () => {
  return filter.examSchedule(await request.get(uri.finalExamSchedule));
};

const midtermExamSchedule = async () => {
  return filter.examSchedule(await request.get(uri.midtermExamSchedule));
};

const tuition = async () => {
  return filter.tuition(await request.get(uri.tuition));
};

const transcript = async (year: number, semester = 1) => {
  await request.get(uri.transcript);

  return filter.transcript(
    await request.post(uri.transcript, {
      ...edusoft.commonBody,
      ctl00$ContentPlaceHolder1$ctl00$MessageBox1$imgCloseButton: "",
      ctl00$ContentPlaceHolder1$ctl00$MessageBox1$btnOk: "",
      ctl00$ContentPlaceHolder1$ctl00$txtChonHK: `${year}${semester}`,
      ctl00$ContentPlaceHolder1$ctl00$btnChonHK: "Xem",
    })
  );
};

export default {
  news,
  finalExamSchedule,
  midtermExamSchedule,
  transcript,
  tuition,
  schedule,
};
