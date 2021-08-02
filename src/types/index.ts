export type Credentials = {
  username: string;
  password: string;
}

export type ExamDay = {
  subject: string;
  amount: string;
  date: string;
  time: string;
  room: string;
}

export type Lesson = {
  subject: string;
  room: string;
  dayOfWeek: number;
  from: string;
  to: string;
}

export type News = {
  title: string;
  date: string;
  url: string;
}

export type Score = {
  subject: string;
  assignment: string;
  midterm: string;
  final: string;
}

export type Subject = {
  id: string;
}

export type Tuition = {
  credits: string;
  tuition: string;
  discount: string;
  prevDebt: string;
  paid: string;
  healthInsurance: string;
  healthInsuranceDebt: string;
  healthInsurancePaid: string;
  debt: string;
}
