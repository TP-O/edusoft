import auth from "./auth";
import crawler from "./crawler";
import registration from "./registration";
import { Credentials } from "./types";

let credentials: Credentials = {
  username: "",
  password: "",
};

const signIn = async () => {
  if (!(await auth.signIn(credentials))) {
    throw Error("Sign in failed!");
  }
};

export const config = (data: Credentials) => {
  credentials = data;
};

export const getNews = async () => {
  return await crawler.news();
};

export const getSchedule = async () => {
  await signIn();

  return await crawler.schedule();
};

export const getFinalExamSchedule = async () => {
  await signIn();

  return await crawler.finalExamSchedule();
};

export const getMidtermExamSchedule = async () => {
  await signIn();

  return await crawler.midtermExamSchedule();
};

export const getTuition = async () => {
  await signIn();

  return await crawler.tuition();
};

export const getTranscript = async (year: number, semester = 1) => {
  await signIn();

  return await crawler.transcript(year, semester);
};

export const register = async (ids: string[], logging = false) => {
  await signIn();

  return ids.reduce(
    (prevId, curId) =>
      prevId.then(async () => {
        const result = await registration.register({ id: curId });

        if (logging) {
          console.log(`${curId}: ${result}`);
        }

        return result;
      }),
    Promise.resolve(true)
  );
};
