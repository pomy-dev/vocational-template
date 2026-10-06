import { ArrowRight } from "lucide-react";

export type Icon = typeof ArrowRight;
export type Status = "Active" | "Suspended" | "Completed" | "Alumni";
export type NextOfKin = {
  name: string;
  relationship: string;
  email: string;
  phone: string;
};
export type ApprenticeshipPost = {
  id: string;
  title: string;
  employer: string;
  location: string;
  type: string;
  closing: string;
  description: string;
};
export type Suggestion = {
  id: string;
  name: string;
  email: string;
  category: string;
  message: string;
  date: string;
};
export type Complaint = {
  id: string;
  subject: string;
  category: string;
  message: string;
  status: string;
  date: string;
  time?: string;
  name?: string;
  email?: string;
  phone?: string;
  anonymous?: boolean;
  evidence?: string;
  source?: "Student" | "Lecturer";
  reply?: string;
  repliedBy?: string;
  repliedAt?: string;
  deleted?: boolean;
};
export type LearningResource = {
  id: string;
  title: string;
  course: string;
  subject: string;
  fileType: string;
  published: boolean;
  uploaded: string;
};
export type LecturerNotification = {
  id: string;
  title: string;
  body: string;
  date: string;
  read: boolean;
};
export type TutorProfile = {
  name: string;
  initials: string;
  email: string;
  phone: string;
  courses: string[];
};

export type StudentRegistrationInput = {
  name: string;
  email: string;
  phone: string;
  identityNumber?: string;

  kinName: string;
  kinRelationship: string;
  kinEmail: string;
  kinPhone: string;

  programmes: RegistrationProgramme[];
  applicationTraceId: string;

  photo?: {
    path: string;
    url: string;
    name: string;
    mimeType: string;
  } | null;

  receipt?: RegistrationFile;

  // Payment fields (new)
  paymentReference?: string;
  amountPaid?: number;
  registrationFee?: number;
  deposit?: number;

  campusId?: string;
};

export type RegistrationFile = {
  path: string;
  url: string;
  name: string;
  mimeType: string;
};

export type StudentRegistration = {
  studentId: string;
  studentNumber: string;
  enrollmentId: string;
  paymentReference: string;
  amountPaid: string;
};

export enum Level {
  N1 = "N1",
  N2 = "N2",
  N3 = "N3",
  N4 = "N4",
  N5 = "N5",
  N6 = "N6",
  Certificate = "Certificate",
  Diploma = "Diploma",
  Occupational = "Occupational",
  Skills = "Skills",
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
  mode: "Online" | "On campus" | "Hybrid";
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
  nextOfKin?: NextOfKin;
  subjects?: string[];
  courseSubjects?: Record<string, string[]>;
  avatarUrl?: string;
  examinationNumber?: string;
  temporaryPassword?: string;
  mustResetPassword?: boolean;
};
export type Announcement = {
  id: string;
  title: string;
  body: string;
  date: string;
  audience: string;
};
export type Assignment = {
  id: string;
  title: string;
  course: string;
  due: string;
  status: string;
  score?: number;
  subject?: string;
  instructions?: string;
  createdAt?: string;
  documentName?: string;
  documentType?: string;
};
export type LecturerRecord = {
  id: string;
  name: string;
  email: string;
  phone: string;
  employeeNo: string;
  campus: string;
  cv?: File;
  courses: string[];
  subjects: string[];
  status: "Active" | "Disabled" | "Removed";
  notice?: string;
  employeeType?: "Contract" | "Permanent" | "Part-time";
  profession?: string;
  bankAccount?: string;
  temporaryPassword?: string;
  avatarUrl?: string;
  departmentId?: string;
};
export type DepartmentRecord = {
  id: string;
  name: string;
  code: string;
  hodId: string;
  courseNames: string[];
  programmeNames: string[];
  subjectNames: string[];
  active: boolean;
};
export type AuditRecord = {
  id: string;
  entityId: string;
  entityType: string;
  action: string;
  actor: string;
  date: string;
  details: string;
};
export type FeePlan = {
  course: string;
  total: number;
  intervals: string[];
  options: string[];
};
export type LedgerEntry = {
  id: string;
  studentId: string;
  studentName: string;
  kind: "Payment" | "Charge";
  label: string;
  amount: number;
  date: string;
  reference: string;
};
export type Schedule = {
  id: string;
  title: string;
  kind: string;
  date: string;
  time: string;
  location: string;
};
export type Payment = {
  id: string;
  label: string;
  amount: number;
  date: string;
  status: string;
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
    status: string;
  }[];
  suggestions: Suggestion[];
  apprenticeships: ApprenticeshipPost[];
  complaints: Complaint[];
  resources: LearningResource[];
  lecturerNotifications: LecturerNotification[];
  tutors: TutorProfile[];
  lecturers: LecturerRecord[];
  departments?: DepartmentRecord[];
  auditLog?: AuditRecord[];
  feePlans?: FeePlan[];
  ledgerEntries?: LedgerEntry[];
  financeNotices?: {
    studentId: string;
    studentName: string;
    email: string;
    message: string;
    date: string;
  }[];
  userPermissions?: {
    userId: string;
    permissionKey: string;
    granted: boolean;
    changedBy: string;
    changedAt: string;
  }[];
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
  receipt?: RegistrationFile;
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
