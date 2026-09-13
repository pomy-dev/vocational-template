import { ArrowRight } from "lucide-react";
import { type StudentRegistration } from "./studentRegistration"

export type Icon = typeof ArrowRight;
export type Status = "Active" | "Suspended" | "Completed" | "Alumni";
export type NextOfKin = { name: string; relationship: string; email: string; phone: string };
export type ApprenticeshipPost = { id: string; title: string; employer: string; location: string; type: string; closing: string; description: string };
export type Suggestion = { id: string; name: string; email: string; category: string; message: string; date: string };
export type Complaint = { id: string; subject: string; category: string; message: string; status: string; date: string; evidence?: string };
export type LearningResource = { id: string; title: string; course: string; subject: string; fileType: string; published: boolean; uploaded: string };
export type LecturerNotification = { id: string; title: string; body: string; date: string; read: boolean };
export type TutorProfile = { name: string; initials: string; email: string; phone: string; courses: string[] };

export enum Level {
  N1 = "N1", N2 = "N2", N3 = "N3", N4 = "N4", N5 = "N5", N6 = "N6", Certificate = "Certificate",
  Diploma = "Diploma", Occupational = "Occupational", Skills = "Skills"
}

export type Subject = {
  name: string;
  level: Level[];
};
export type Course = {
  id: string;
  name: string;
  category: string;
  // level: string;
  duration: string;
  fee: number;
  regFee: number;
  monthly?: number;
  popular?: boolean;
  subjects: Subject[];
  mode: "Online" | "On campus" | "Hybrid",
  image?: string;
};
export type Student = {
  id: string;
  name: string;
  email: string;
  phone: string;
  studentNo: string;
  campus: string;
  course: string;
  status: Status;
  startDate: string;
  attendance: number;
  balance: number;
  termAverage: number;
  initials: string;
  guardian: string;
  remarks: string;
  nextOfKin?: NextOfKin
};
export type Announcement = {
  id: string;
  title: string;
  body: string;
  date: string;
  audience: string
};
export type Assignment = {
  id: string;
  title: string;
  course: string;
  due: string;
  status: string;
  score?: number
};
export type Schedule = {
  id: string;
  title: string;
  kind: string;
  date: string;
  time: string;
  location: string
};
export type Payment = {
  id: string;
  label: string;
  amount: number;
  date: string;
  status: string
};
export type AppData = {
  students: Student[];
  announcements: Announcement[];
  assignments: Assignment[];
  schedules: Schedule[];
  payments: Payment[];
  graduateRequests: {
    id: string;
    category: string;
    quantity: number;
    requester: string;
    email: string;
    status: string
  }[];
  suggestions: Suggestion[];
  apprenticeships: ApprenticeshipPost[];
  complaints: Complaint[];
  resources: LearningResource[];
  lecturerNotifications: LecturerNotification[];
  tutors: TutorProfile[];
};

export type ApplicationDraft = {
  name: string;
  email: string;
  phone: string;
  course: string;
  category: string;
  level: string;
  period: string;
  programmes: RegistrationProgramme[];
  kinName: string;
  kinRelationship: string;
  kinEmail: string;
  kinPhone: string;
  receipt: { name: string, url: string, mimeType: string }
  registration: StudentRegistration;
};

export type RegistrationProgramme = {
  course: string;
  category: string;
  field: string;
  level: string;
  period: string;
  subjects: { name: string; level: string }[];
};
