export interface Credentials {
  username: string;
  password: string;
}

export interface ExamDay {
  subject: string;
  amount: string;
  date: string;
  time: string;
  room: string;
}

export interface Lesson {
  subject: string;
  room: string;
  dayOfWeek: number;
  from: string;
  to: string;
}

export interface News {
  title: string;
  date: string;
  url: string;
}

export interface Score {
  subject: string;
  assignment: string;
  midterm: string;
  final: string;
}

export interface Subject {
  id: string;
}

export interface Tuition {
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
