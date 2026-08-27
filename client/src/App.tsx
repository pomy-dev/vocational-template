import { useEffect, useMemo, useState } from "react";
import type { FormEvent, ReactNode } from "react";
import { useLocation } from "wouter";
import {
  ArrowRight, ArrowUpRight, Award, BarChart3, BookOpen, BriefcaseBusiness, Building2, CalendarDays,
  Check, ChevronLeft, ChevronRight, CircleDollarSign, ClipboardCheck, Clock3,
  Download, ExternalLink, FileText, GraduationCap, Hammer, HeartHandshake, Laptop,
  LayoutDashboard, Loader2, Mail, MapPin, Menu, MessageCircle, MoreHorizontal,
  Phone, Play, Plus, Search, ShieldCheck, Sparkles, Star, Trash2, TrendingUp,
  UserRound, Users, WalletCards, X, Zap
} from "lucide-react";
import { toast, Toaster } from "sonner";

type Icon = typeof ArrowRight;
type Status = "Active" | "Suspended" | "Completed" | "Alumni";

type Course = {
  id: string;
  name: string;
  category: string;
  level: string;
  duration: string;
  fee: number;
  regFee: number;
  monthly?: number;
  popular?: boolean;
  subjects: string[];
  mode: "Online" | "On campus" | "Hybrid"
};
type Student = {
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
  remarks: string
};
type Announcement = {
  id: string;
  title: string;
  body: string;
  date: string;
  audience: string
};
type Assignment = {
  id: string;
  title: string;
  course: string;
  due: string;
  status: string;
  score?: number
};
type Schedule = {
  id: string;
  title: string;
  kind: string;
  date: string;
  time: string;
  location: string
};
type Payment = {
  id: string;
  label: string;
  amount: number;
  date: string;
  status: string
};
type AppData = {
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
  }[]
};

const gold = "#D4AF37";
const fee = (value: number) => `R${value.toLocaleString("en-ZA")}`;
const initials = (name: string) => name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase();

const courses: Course[] = [
  { id: "eng-electrical", name: "Electrical Engineering N1–N6", category: "Engineering Studies", level: "N1–N6", duration: "3 years", fee: 18500, regFee: 500, popular: true, mode: "Hybrid", subjects: ["Mathematics", "Engineering Science", "Logic Systems", "Industrial Electronics", "Electrical Trade Theory"] },
  { id: "business-management", name: "Business Management N4–N6", category: "Business & Management", level: "N4–N6", duration: "18 months", fee: 16500, regFee: 500, popular: true, mode: "On campus", subjects: ["Economics", "Financial Accounting", "Management Communication", "Sales Management", "Computer Practice"] },
  { id: "it", name: "Information Technology", category: "Information Technology", level: "Certificate", duration: "12 months", fee: 14500, regFee: 500, popular: true, mode: "Hybrid", subjects: ["Computer Hardware", "Networking", "Programming", "Database Fundamentals", "Technical Support"] },
  { id: "health-safety", name: "Health & Safety Officer", category: "Health & Safety", level: "Occupational", duration: "12 months", fee: 22000, regFee: 500, mode: "On campus", subjects: ["Occupational Health", "Risk Assessment", "First Aid", "Incident Investigation", "Safety Legislation"] },
  { id: "bricklayer", name: "Occupational Certificate: Bricklayer", category: "QCTO Skills", level: "Occupational", duration: "18 months", fee: 32000, regFee: 500, mode: "On campus", subjects: ["Construction Theory", "Practical Skills", "Workplace Experience", "Site Safety"] },
  { id: "supply-chain", name: "Supply Chain Practitioner", category: "Logistics & Transport", level: "Occupational", duration: "12 months", fee: 24000, regFee: 500, mode: "Hybrid", subjects: ["Procurement", "Inventory Management", "Logistics", "Supply Chain Systems"] },
  { id: "matric", name: "Matric Rewrite & Upgrade", category: "Matric Rewrite", level: "Grade 12", duration: "6 months", fee: 8500, regFee: 500, mode: "On campus", subjects: ["Mathematics", "Physical Science", "Life Science", "English", "Accounting"] },
  { id: "solar", name: "Solar Panel Installation", category: "Short Course", level: "Skills", duration: "2 months", fee: 7500, regFee: 2500, monthly: 2500, mode: "On campus", subjects: ["Solar Theory", "Panel Installation", "Wiring & Testing"] },
  { id: "first-aid", name: "First Aid / Fire", category: "Short Course", level: "Skills", duration: "5 days", fee: 2800, regFee: 0, mode: "On campus", subjects: ["First Aid", "Fire Safety", "Emergency Response"] },
  { id: "welding", name: "Arc Welding", category: "Artisan & Trade Testing", level: "Practical", duration: "4 weeks", fee: 25000, regFee: 500, mode: "On campus", subjects: ["Welding Safety", "Arc Techniques", "Joint Preparation", "Trade Test Prep"] },
];

const shortCourses = [
  ["A+ PC Technician", "2 months", 2500, 3000, 8500], ["N+ Networking", "2 months", 2500, 2500, 7500], ["Programming (C++, HTML, VB)", "2 months", 2500, 3000, 8500], ["Beautician", "2 months", 2500, 3000, 8500], ["Solar Panel", "2 months", 2500, 2500, 7500], ["Computer Literacy", "2 months", 2500, 3000, 8500], ["Data Capture", "2 months", 2500, 3000, 8500], ["Computerized Cashier / Bookkeeping", "2 months", 2500, 2500, 7500], ["Bookkeeping", "2 months", 2500, 3000, 8500], ["Pastel Accounting", "2 months", 2500, 3000, 8500], ["Pastel Payroll", "2 months", 2500, 3000, 8500], ["Call Center Agent", "2 months", 2500, 2500, 7500], ["Chef", "2 months", 3000, 3000, 9000], ["Hair Dressing", "2 months", 2500, 3000, 8500], ["Sewing", "2 months", 2500, 3000, 8500], ["HIV/AIDS Counselling & Mentoring", "2 months", 2500, 2500, 7500], ["Supervisory Management", "2 months", 2500, 2500, 7500], ["Customer Care", "2 months", 2500, 2500, 7500], ["Community Development", "2 months", 2500, 2500, 7500], ["Nails Technician", "2 months", 2500, 2000, 6500], ["First Aid / Fire", "5 days", 0, 0, 2800],
] as const;
const machineCourses = [["Dump Truck (ADT)", 4800], ["Mobile Crane (50 Tones)", 5800], ["Drill Rig", 7800], ["Advanced Rigging", 10000], ["Excavator", 5800], ["Forklift F1", 2500], ["Front End Loader", 2800], ["Bulldozer", 5800], ["Reach Stacker", 7500], ["Plant Operator", 32500], ["Blasting", 32000], ["Competency A", 16550]] as const;
const artisanFields = [["Diesel Mechanics", 20000], ["Boilermaker", 20000], ["Rigging & Fitting", 20000], ["Electrical", 20000], ["Auto-Electrical", 20000], ["Panel Beater & Body Spray", 20000], ["Plumber", 20000], ["Instrumentation", 20000], ["Brick Laying", 20500], ["Carpentry", 20500]] as const;
const academicFields = ["Engineering Studies", "Business / Management / Teaching", "Information Technology", "Mine & Construction Machines", "Artisan / Trade Testing", "GCC Plant Factories / Mining", "Health and Safety", "Matric Rewrite & Upgrade", "QCTO Occupational Qualifications", "QCTO Skills Programs"];
const qcto = ["Bricklayer", "Plumbing", "Health Promotion Officer", "Safety Officer", "First Aid", "Poultry Farmer", "Landscape Gardener", "Early Childhood Development", "School Principal", "Public Administrator", "Community Counsellor", "Retail Supervisor", "Office Administration", "Project Manager", "Supply Chain Practitioner", "Management Accountant", "Financial Advisor", "Investment Advisor", "Sewer"];

const seedData: AppData = {
  students: [
    { id: "s1", name: "Thabo Mokoena", email: "thabo.mokoena@example.com", phone: "+27 71 234 8821", studentNo: "NSTC-26-0014", campus: "Wynberg Johannesburg", course: "Electrical Engineering N1–N6", status: "Active", startDate: "2026-02-03", attendance: 94, balance: 0, termAverage: 82, initials: "TM", guardian: "Lerato Mokoena", remarks: "Consistent practical work and strong participation." },
    { id: "s2", name: "Naledi Dlamini", email: "naledi.dlamini@example.com", phone: "+27 82 441 6072", studentNo: "NSTC-26-0027", campus: "Middelburg", course: "Business Management N4–N6", status: "Active", startDate: "2026-02-03", attendance: 88, balance: 4500, termAverage: 76, initials: "ND", guardian: "Mandla Dlamini", remarks: "Shows promise in accounting; follow up on outstanding fees." },
    { id: "s3", name: "Kagiso Ndlovu", email: "kagiso.ndlovu@example.com", phone: "+27 79 884 1260", studentNo: "NSTC-25-0188", campus: "Wynberg Johannesburg", course: "Occupational Certificate: Bricklayer", status: "Completed", startDate: "2025-01-13", attendance: 91, balance: 0, termAverage: 79, initials: "KN", guardian: "Mpho Ndlovu", remarks: "Eligible for transcript and graduate directory." },
    { id: "s4", name: "Ayanda Khumalo", email: "ayanda.khumalo@example.com", phone: "+27 76 510 4318", studentNo: "NSTC-24-0092", campus: "Middelburg", course: "Health & Safety Officer", status: "Alumni", startDate: "2024-02-05", attendance: 96, balance: 0, termAverage: 88, initials: "AK", guardian: "Sibusiso Khumalo", remarks: "Alumni mentor for current Health & Safety cohort." },
    { id: "s5", name: "Bongani Maseko", email: "bongani.maseko@example.com", phone: "+27 73 119 5524", studentNo: "NSTC-26-0049", campus: "Wynberg Johannesburg", course: "Information Technology", status: "Suspended", startDate: "2026-02-03", attendance: 41, balance: 6800, termAverage: 53, initials: "BM", guardian: "Zanele Maseko", remarks: "Suspended pending attendance and finance review." },
  ],
  announcements: [
    { id: "a1", title: "Trimester 2 registration is open", body: "Secure your place in the next learning cycle. Registration closes 30 June.", date: "2026-05-18", audience: "All students" },
    { id: "a2", title: "Practical assessment week", body: "Engineering and artisan cohorts should review their published workshop schedules.", date: "2026-05-11", audience: "Engineering & Artisan" },
    { id: "a3", title: "AI Laptop sponsorship drive", body: "Corporate partners can sponsor a learner device through the NSTC office.", date: "2026-04-28", audience: "Partners" },
  ],
  assignments: [
    { id: "as1", title: "Electrical installation rules case study", course: "Electrical Engineering", due: "2026-06-12", status: "Submitted", score: 86 },
    { id: "as2", title: "Management communication presentation", course: "Business Management", due: "2026-06-16", status: "In progress" },
    { id: "as3", title: "Workshop risk assessment", course: "Health & Safety", due: "2026-06-20", status: "Not started" },
  ],
  schedules: [
    { id: "sc1", title: "Engineering Science", kind: "Class", date: "2026-06-08", time: "09:00 – 11:00", location: "Workshop 2 · Wynberg" },
    { id: "sc2", title: "Mathematics N2", kind: "Class", date: "2026-06-09", time: "13:00 – 15:00", location: "Room 4 · Online" },
    { id: "sc3", title: "Trimester 2 examinations", kind: "Exam", date: "2026-06-22", time: "08:30 – 12:30", location: "Main Hall · Wynberg" },
  ],
  payments: [
    { id: "p1", label: "Registration fee", amount: 500, date: "2026-02-01", status: "Paid" },
    { id: "p2", label: "February tuition", amount: 3000, date: "2026-02-03", status: "Paid" },
    { id: "p3", label: "March tuition", amount: 3000, date: "2026-03-03", status: "Paid" },
  ],
  graduateRequests: [],
};

function loadData(): AppData {
  if (typeof window === "undefined") return seedData;
  const saved = localStorage.getItem("nstc-data");
  if (saved) { try { return JSON.parse(saved) as AppData; } catch { return seedData; } }
  localStorage.setItem("nstc-data", JSON.stringify(seedData));
  return seedData;
}
function useData() {
  const [data, setData] = useState<AppData>(loadData);
  useEffect(() => { localStorage.setItem("nstc-data", JSON.stringify(data)); }, [data]);
  return [data, setData] as const;
}
function delay(ms = 650) { return new Promise((resolve) => window.setTimeout(resolve, ms)); }
function useAction() {
  const [loading, setLoading] = useState(false);
  const run = async (action: () => void | Promise<void>) => { setLoading(true); await delay(); await action(); setLoading(false); };
  return { loading, run };
}

function Spinner({ label = "Working" }: { label?: string }) {
  return (
    <span className="inline-flex items-center gap-2">
      <Loader2 className="h-4 w-4 animate-spin" />
      {label}
    </span>);
}

function Button({ children, variant = "gold", className = "", onClick, type = "button", disabled = false }: {
  children: ReactNode;
  variant?: "gold" | "dark" | "light" | "ghost" | "danger";
  className?: string; onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean
}) {
  return (
    <button type={type} disabled={disabled} onClick={onClick} className={`btn btn-${variant} ${className} ${disabled ? "opacity-60" : ""}`}>
      {children}
    </button>
  );
}

function Modal({ title, children, onClose }: { title: string; children: ReactNode; onClose: () => void }) {
  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <div className="modal-card" onMouseDown={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <h3 className="font-display text-xl text-slate-950">{title}</h3>
          <button onClick={onClose} className="icon-btn"><X className="h-5 w-5" /></button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Confirm({ title, body, onCancel, onConfirm, loading }: {
  title: string;
  body: string;
  onCancel: () => void;
  onConfirm: () => void;
  loading?: boolean
}) {
  return (
    <Modal title={title} onClose={onCancel}>
      <p className="mt-5 text-sm leading-6 text-slate-600">{body}</p>
      <div className="mt-7 flex justify-end gap-3">
        <Button variant="light" onClick={onCancel}>Cancel</Button>
        <Button variant="dark" onClick={onConfirm} disabled={loading}>
          {loading ? <Spinner label="Confirming" /> : "Confirm"}
        </Button>
      </div>
    </Modal>
  );
}

function Logo({ light = false }: { light?: boolean }) {
  return (
    <a href="/" className={`flex items-center gap-3 ${light ? "text-white" : "text-slate-950"}`}>
      <span className="logo-mark">N</span>
      <span>
        <span className="block font-display text-lg leading-none">National Skills</span>
        <span className={`block text-[9px] font-bold uppercase tracking-[.22em] ${light ? "text-white/55" : "text-slate-500"}`}>Technical College</span>
      </span>
    </a>
  );
}

function Pill({ children, tone = "gold" }: {
  children: ReactNode;
  tone?: "gold" | "green" | "red" | "slate"
}) {
  return (<span className={`pill pill-${tone}`}>{children}</span>);
}

function SectionTitle({ eyebrow, title, body, light = false }: {
  eyebrow: string;
  title: string;
  body?: string;
  light?: boolean
}) {
  return (
    <div className="max-w-2xl">
      <p className={`eyebrow ${light ? "text-[#D4AF37]" : "text-[#a27e10]"}`}>{eyebrow}</p>
      <h2 className={`mt-3 font-display text-4xl leading-tight md:text-5xl ${light ? "text-white" : "text-slate-950"}`}>{title}</h2>
      {body &&
        <p className={`mt-4 text-base leading-7 ${light ? "text-white/60" : "text-slate-600"}`}>{body}</p>
      }
    </div>
  );
}

function PublicNav({ onApply }: { onApply: () => void }) {
  const [open, setOpen] = useState(false);
  return (
    <header className="public-nav">
      <div className="container flex h-[78px] items-center justify-between">
        <Logo light />
        <nav className="hidden items-center gap-7 lg:flex">
          <a href="#about">About</a>
          <a href="#programmes">Programmes</a>
          <a href="#skills">Skills & trades</a>
          <a href="#fees">Fees</a>
          <a href="#contact">Contact</a>
        </nav>
        <div className="hidden items-center gap-3 sm:flex">
          <a className="nav-portal" href="/portal">Portal login <ArrowRight className="h-4 w-4" /></a>
          <Button onClick={onApply}>Apply now <ArrowRight className="h-4 w-4" /></Button>
        </div>
        <button className="text-white lg:hidden" onClick={() => setOpen(!open)}><Menu /></button>
      </div>
      {open && <div className="mobile-nav lg:hidden">
        <a href="#about" onClick={() => setOpen(false)}>About</a>
        <a href="#programmes" onClick={() => setOpen(false)}>Programmes</a>
        <a href="#skills" onClick={() => setOpen(false)}>Skills & trades</a>
        <a href="#fees" onClick={() => setOpen(false)}>Fees</a>
        <a href="/portal">Student portal</a>
        <Button onClick={onApply}>Apply now</Button>
      </div>
      }
    </header>
  );
}

function Hero({ onApply }: { onApply: () => void }) {
  return (
    <section className="hero">
      <div className="hero-grid" />
      <PublicNav onApply={onApply} />
      <div className="container relative grid min-h-[660px] items-center gap-10 pb-16 pt-20 lg:grid-cols-[1.05fr_.95fr]">
        <div className="max-w-2xl">
          <div className="eyebrow text-[#D4AF37]">South Africa · Skills for tomorrow</div>
          <h1 className="mt-5 font-display text-6xl leading-[.98] text-white md:text-8xl">Your future is <span className="gold-text">our concern.</span></h1>
          <p className="mt-7 max-w-xl text-lg leading-8 text-white/65">Practical education, recognised pathways and human mentorship for learners ready to build a life of purpose.</p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Button onClick={onApply}>Start your application <ArrowRight className="h-4 w-4" /></Button>
            <a className="hero-link" href="#programmes"><Play className="h-4 w-4 fill-current" /> Explore programmes</a>
          </div>
          <div className="mt-12 flex flex-wrap gap-8 text-white/60">
            <div>
              <strong className="block font-display text-3xl text-white">25,500<span className="gold-text">+</span></strong>
              <span className="text-xs uppercase tracking-wider">graduates in the field</span>
            </div>
            <div>
              <strong className="block font-display text-3xl text-white">1,000<span className="gold-text">+</span></strong>
              <span className="text-xs uppercase tracking-wider">active learners</span>
            </div>
            <div>
              <strong className="block font-display text-3xl text-white">10</strong>
              <span className="text-xs uppercase tracking-wider">academic fields</span>
            </div>
          </div>
        </div>
        <div className="hero-card-wrap">
          <div className="hero-card">
            <div className="flex items-start justify-between">
              <span className="eyebrow text-white/45">Featured pathway</span>
              <span className="rounded-full bg-[#D4AF37] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-black">Popular</span>
            </div>
            <div className="mt-16">
              <p className="text-sm text-white/50">National Certificate</p>
              <h3 className="mt-2 font-display text-4xl text-white">Electrical<br />
                Engineering <span className="gold-text">N1–N6</span>
              </h3>
            </div>
            <div className="mt-14 grid grid-cols-2 gap-3 border-t border-white/10 pt-5 text-sm">
              <div>
                <span className="block text-white/40">Duration</span>
                <strong className="text-white">3 years</strong>
              </div>
              <div>
                <span className="block text-white/40">Mode</span>
                <strong className="text-white">Hybrid</strong>
              </div>
            </div>
            <a href="/portal" className="mt-7 flex items-center justify-between rounded-xl bg-white/10 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/15">View pathway <ArrowUpRight className="h-4 w-4" /></a>
          </div>
          <div className="hero-stamp">
            <Award className="h-5 w-5" />
            <span>DHET<br /><b>Registered</b></span>
          </div>
        </div>
      </div>
    </section>
  );
}

function Stats() {
  return (
    <section className="stats-strip">
      <div className="container grid gap-8 py-11 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="stat-number">25,500<span>+</span></p>
          <p className="stat-label">NSTC learners in jobs, mines & municipalities</p>
        </div>
        <div>
          <p className="stat-number">100<span>%</span></p>
          <p className="stat-label">Employment & mentorship guarantee</p>
        </div>
        <div>
          <p className="stat-number">10</p>
          <p className="stat-label">Academic & occupational fields</p>
        </div>
        <div>
          <p className="stat-number">2</p>
          <p className="stat-label">Connected campuses in Gauteng & Mpumalanga</p>
        </div>
      </div>
    </section>
  );
}

function About() {
  return (
    <section id="about" className="section-pad bg-[#f8f6f1]">
      <div className="container grid gap-14 lg:grid-cols-[.9fr_1.1fr] lg:items-center">
        <div className="about-art">
          <div className="about-art-inner">
            <span className="eyebrow text-[#D4AF37]">Since day one</span>
            <span className="big-letter">N</span>
            <div className="flex items-end justify-between">
              <span className="font-display text-2xl text-white">We teach skills<br />to change lives.</span>
              <span className="text-right text-xs uppercase tracking-widest text-white/45">Wynberg<br />Johannesburg</span>
            </div>
          </div>
        </div>
        <div>
          <SectionTitle eyebrow="The NSTC difference" title="Education that meets the real world." body="National Skills & Technical College brings together academic knowledge, workshop confidence and the kind of mentorship that helps learners take the next step. Our classrooms are designed around opportunity: for school leavers, working adults, companies and communities." />
          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            <div className="feature-line">
              <ShieldCheck className="text-[#a27e10]" />
              <div>
                <h4>Recognised pathways</h4>
                <p>DHET, QCTO, SETA and ICB-aligned learning options.</p>
              </div>
            </div>
            <div className="feature-line">
              <HeartHandshake className="text-[#a27e10]" />
              <div>
                <h4>Mentorship included</h4>
                <p>Guidance from registration through to graduation and work.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FlipCard({ course }: { course: Course }) {
  return (
    <div className="flip-card group">
      <div className="flip-inner">
        <div className="flip-front">
          <div className="flex items-start justify-between">
            <div className="course-icon">
              <GraduationCap className="h-5 w-5" />
            </div>
            {course.popular && <Pill>Popular</Pill>}
          </div>
          <div className="mt-auto">
            <p className="eyebrow text-white/45">{course.category}</p>
            <h3 className="mt-2 font-display text-2xl text-white">{course.name}</h3>

            <div className="mt-4 flex items-center justify-between text-xs text-white/55">
              <span><Clock3 className="mr-1 inline h-3.5 w-3.5" /> {course.duration}</span>
              <span>{course.mode}</span>
            </div>
          </div>
        </div>
        <div className="flip-back">
          <p className="eyebrow text-[#a27e10]">What you will study</p>
          <h3 className="mt-2 font-display text-2xl text-slate-950">{course.name}</h3>
          <ul className="mt-4 space-y-2 text-sm text-slate-600">
            {course.subjects.map((subject) =>
              <li key={subject}><Check className="mr-2 inline h-4 w-4 text-[#a27e10]" />{subject}</li>
            )}
          </ul>
          <a href="/portal" className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-slate-950">View course <ArrowRight className="h-4 w-4" /></a>
        </div>
      </div>
    </div>
  );
}

function Programmes({ onApply }: { onApply: () => void }) {
  return (
    <section id="programmes" className="section-pad bg-white">
      <div className="container">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionTitle eyebrow="Learn with direction" title="Pathways for every kind of builder." body="From National Certificates to occupational qualifications and short practical programmes, choose the route that fits your ambitions." />
          <Button variant="dark" onClick={onApply}>Find your programme <ArrowRight className="h-4 w-4" /></Button>
        </div>
        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">{courses.slice(0, 8).map((course) => <FlipCard key={course.id} course={course} />)}</div>
        <div className="mt-16 rounded-2xl bg-[#111] p-7 text-white md:p-10">
          <div className="grid gap-8 lg:grid-cols-[.9fr_1.1fr] lg:items-center">
            <div>
              <p className="eyebrow text-[#D4AF37]">Academic catalogue</p>
              <h3 className="mt-3 font-display text-3xl">Ten fields. One clear next step.</h3>
              <p className="mt-3 max-w-lg text-sm leading-6 text-white/55">Explore the full catalogue from Engineering N1–N6 and Business N4–N6 to QCTO skills programmes, GCC, health and safety, IT and Matric upgrades.</p>
            </div>
            <div>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {academicFields.map((field) =>
                  <div key={field} className="rounded-xl border border-white/10 bg-white/[.04] p-3 text-xs text-white/70">{field}</div>
                )}
              </div>
              <p className="mt-5 eyebrow text-[#D4AF37]">QCTO & SETA pathways</p>
              <div className="mt-3 flex flex-wrap gap-2">{qcto.slice(0, 12).map((item) =>
                <span key={item} className="rounded-full border border-white/10 px-3 py-1.5 text-[11px] text-white/60">{item}</span>
              )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Skills({ data, setData }: {
  data: AppData;
  setData: React.Dispatch<React.SetStateAction<AppData>>
}) {
  const [category, setCategory] = useState("All skills");
  const [requestOpen, setRequestOpen] = useState(false);
  const [selected, setSelected] = useState("Artisan / Trade Testing");
  const [done, setDone] = useState(false);
  const categories = ["All skills", "Artisan / Trade Testing", "Machine operators", "QCTO graduates"];
  const graduates = [
    {
      name: "Kagiso Ndlovu",
      skill: "Bricklayer",
      category: "Artisan / Trade Testing",
      place: "Gauteng"
    },
    {
      name: "Ayanda Khumalo",
      skill: "Health & Safety Officer",
      category: "QCTO graduates",
      place: "Mpumalanga"
    },
    {
      name: "Mpho Mthembu",
      skill: "Forklift F1",
      category: "Machine operators",
      place: "Gauteng"
    },
    {
      name: "Refilwe Molefe",
      skill: "Plumber",
      category: "Artisan / Trade Testing",
      place: "Gauteng"
    }
  ];
  const visible = category === "All skills" ? graduates : graduates.filter((g) => g.category === category);
  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setData((old) => ({
      ...old,
      graduateRequests: [...old.graduateRequests,
      {
        id: crypto.randomUUID(),
        category: selected,
        quantity: Number(form.get("quantity") || 1),
        requester: String(form.get("requester") || "Company partner"),
        email: String(form.get("email") || ""),
        status: "New"
      }]
    }));
    setDone(true);
  };
  return (
    <section id="skills" className="section-pad bg-[#f8f6f1]">
      <div className="container">
        <SectionTitle eyebrow="Talent on demand" title="The hands that keep South Africa moving." body="Our artisan, operator and occupational graduates leave with practical confidence. Companies can request talent by category and let our placement team make the connection." />
        <div className="mt-9 flex flex-wrap gap-2">{categories.map((item) => <button key={item} className={`filter-chip ${category === item ? "active" : ""}`} onClick={() => setCategory(item)}>{item}</button>)}</div>
        <div className="mt-7 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {visible.map((graduate) => <div key={graduate.name} className="graduate-card">
            <div className="avatar-large">{initials(graduate.name)}</div>
            <div className="mt-5">
              <p className="eyebrow">{graduate.category}</p>
              <h3 className="mt-1 font-display text-xl text-slate-950">{graduate.name}</h3>
              <p className="mt-1 text-sm text-slate-500">{graduate.skill}</p>
              <p className="mt-4 flex items-center gap-1 text-xs text-slate-400">
                <MapPin className="h-3.5 w-3.5" /> {graduate.place}</p>
            </div>
          </div>
          )}
        </div>
        <div className="mt-10 flex flex-col items-start justify-between gap-5 rounded-2xl border border-[#d9cfb3] bg-[#fbf7e8] p-6 md:flex-row md:items-center">
          <div>
            <p className="eyebrow text-[#a27e10]">For employers & project partners</p>
            <h3 className="mt-2 font-display text-2xl text-slate-950">Request a graduate for your next team.</h3>
          </div>
          <Button onClick={() => { setDone(false); setRequestOpen(true); }}>Request graduate <ArrowRight className="h-4 w-4" /></Button>
        </div>
      </div>
      {requestOpen &&
        (
          <Modal title="Request NSTC graduates" onClose={() => setRequestOpen(false)}>
            {done ? (
              <div className="py-7 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                  <Check />
                </div>
                <h4 className="mt-4 font-display text-2xl">Request received.</h4>
                <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-600">Our placement team will contact you with suitable graduate profiles.</p>
                <Button className="mt-6" onClick={() => setRequestOpen(false)}>Done</Button>
              </div>
            ) :
              (
                <form onSubmit={submit} className="mt-5 space-y-4">
                  <label>Skill category
                    <select name="category" value={selected} onChange={(e) => setSelected(e.target.value)} className="field">
                      <option>Artisan / Trade Testing</option>
                      <option>Machine operators</option>
                      <option>QCTO graduates</option>
                    </select>
                  </label>
                  <label>Number of graduates
                    <input name="quantity" className="field" type="number" min="1" defaultValue="1" />
                  </label>
                  <label>Company / requester
                    <input name="requester" className="field" required placeholder="Your organisation" />
                  </label>
                  <label>Work email
                    <input name="email" className="field" type="email" required placeholder="name@company.co.za" />
                  </label>
                  <div className="flex justify-end gap-3 pt-3">
                    <Button variant="light" onClick={() => setRequestOpen(false)}>Cancel</Button>
                    <Button type="submit">Send request <ArrowRight className="h-4 w-4" /></Button>
                  </div>
                </form>
              )}
          </Modal>
        )
      }
    </section>
  );
}

function Fees() {
  return (
    <section id="fees" className="section-pad bg-[#111] text-white">
      <div className="container">
        <SectionTitle light eyebrow="Straightforward investment" title="A clear price for a stronger future." body="Start with a R500 registration fee and choose the learning pathway that matches your goals. All figures shown are demo brochure pricing for planning purposes." />
        <div className="mt-11 grid gap-5 lg:grid-cols-[1.1fr_.9fr]">
          <div className="overflow-hidden rounded-2xl border border-white/10">
            <div className="grid grid-cols-[1.5fr_.8fr_.8fr_.8fr] border-b border-white/10 bg-white/[.05] px-5 py-4 text-[10px] font-bold uppercase tracking-wider text-white/45">
              <span>Short course</span>
              <span>Duration</span>
              <span>Reg.</span>
              <span>Total</span>
            </div>
            {shortCourses.map(([name, duration, reg, monthly, total]) =>
              <div key={name} className="grid grid-cols-[1.5fr_.8fr_.8fr_.8fr] border-b border-white/5 px-5 py-4 text-sm last:border-0">
                <span className="text-white/80">{name}</span>
                <span className="text-white/45">{duration}</span>
                <span className="text-white/55">{reg ? fee(reg) : "—"}</span>
                <span className="font-semibold text-[#D4AF37]">{fee(total)}</span>
              </div>
            )}
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            <div className="dark-info-card">
              <Hammer className="text-[#D4AF37]" />
              <div>
                <h4>Artisan preparation</h4>
                <p>Four-week Diesel Mechanics, Boilermaker, Electrical, Plumber and more from <strong>R20,000</strong>.</p>
              </div>
            </div>
            <div className="dark-info-card">
              <BriefcaseBusiness className="text-[#D4AF37]" />
              <div>
                <h4>Machine & license training</h4>
                <p>Forklift, crane, excavator, ADT, rigging and plant operator routes from <strong>R2,200</strong>.</p>
              </div>
            </div>
            <div className="dark-info-card">
              <CircleDollarSign className="text-[#D4AF37]" />
              <div>
                <h4>Administrative fees</h4>
                <p>Registration fee <strong>R500</strong> plus practical fee <strong>R500</strong> where applicable.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-5 border-t border-white/10 pt-8 md:grid-cols-2">
        <div>
          <p className="eyebrow text-[#D4AF37]">Machine & licence training</p>
          <div className="mt-4 grid grid-cols-2 gap-x-5 gap-y-3">
            {machineCourses.map(([name, price]) =>
              <div key={name} className="flex items-center justify-between gap-3 border-b border-white/5 pb-2 text-xs">
                <span className="text-white/60">{name}</span>
                <strong className="text-[#D4AF37]">{fee(price)}</strong>
              </div>)}
          </div>
        </div>
        <div>
          <p className="eyebrow text-[#D4AF37]">Semi-skilled & artisan fields · 4 weeks</p>
          <div className="mt-4 grid grid-cols-2 gap-x-5 gap-y-3">
            {artisanFields.map(([name, price]) =>
              <div key={name} className="flex items-center justify-between gap-3 border-b border-white/5 pb-2 text-xs">
                <span className="text-white/60">{name}</span>
                <strong className="text-[#D4AF37]">{fee(price)}</strong>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function Gallery() {
  const items = [
    { title: "Workshop learning", tag: "Hands-on" },
    { title: "A culture of progress", tag: "Campus life" },
    { title: "Skills in action", tag: "Practical" }
  ];
  return (
    <section className="section-pad bg-white">
      <div className="container">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <SectionTitle eyebrow="Life at NSTC" title="A place to learn out loud." body="Beyond the timetable: community, confidence and the small moments that make a learning journey memorable." />
          <a className="inline-flex items-center gap-2 text-sm font-bold text-slate-950" href="#contact">Visit a campus <ArrowRight className="h-4 w-4" /></a></div>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {items.map((item, i) =>
            <div key={item.title} className={`gallery-tile gallery-${i}`}>
              <div className="relative z-10">
                <span className="rounded-full bg-black/30 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white">{item.tag}</span>
                <h3 className="mt-32 font-display text-3xl text-white">{item.title}</h3>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function Team() {
  const [offset, setOffset] = useState(0);
  const team = [
    { name: "Dr. Nandi Mthembu", role: "Principal & Academic Director" },
    { name: "Siyabonga Radebe", role: "Head of Engineering" },
    { name: "Lindiwe Nkosi", role: "Student Success Lead" },
    { name: "Musa Dube", role: "Industry Partnerships" }
  ];
  return (
    <section className="section-pad bg-[#f8f6f1]">
      <div className="container">
        <div className="flex items-end justify-between">
          <SectionTitle eyebrow="People behind the pathway" title="Your progress has a team." /><div className="flex gap-2">
            <button className="circle-control" onClick={() => setOffset(Math.max(0, offset - 1))}><ChevronLeft /></button>
            <button className="circle-control" onClick={() => setOffset(Math.min(team.length - 2, offset + 1))}><ChevronRight /></button>
          </div>
        </div>
        <div className="mt-10 overflow-hidden">
          <div className="team-track" style={{ transform: `translateX(-${offset * 25}%)` }}>{team.map((person, i) => <div className="team-card" key={person.name}>
            <div className={`team-photo team-${i}`}><span>{initials(person.name)}</span></div>
            <p className="mt-5 eyebrow">NSTC team</p>
            <h3 className="mt-1 font-display text-2xl text-slate-950">{person.name}</h3>
            <p className="mt-1 text-sm text-slate-500">{person.role}</p>
          </div>)}
          </div>
        </div>
      </div>
    </section>
  );
}

function Contact() {
  const [sent, setSent] = useState(false);
  const { loading, run } = useAction();

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    run(() => setSent(true));
  };

  return (
    <section id="contact" className="section-pad bg-[#f8f6f1]">
      <div className="container grid gap-12 lg:grid-cols-[.9fr_1.1fr]">
        <div>
          <SectionTitle eyebrow="Start a conversation" title="Come build your next chapter with us." body="Visit one of our campuses, call the admissions team, or send a question and we will point you in the right direction." />
          <div className="mt-8 space-y-4">
            <div className="contact-line">
              <MapPin />
              <div><strong>Wynberg Johannesburg</strong>
                <span>Prosperitus Building, Old Pretoria Road</span>
              </div>
            </div>
            <div className="contact-line">
              <MapPin />
              <div>
                <strong>Middelburg Campus</strong>
                <span>OR Tambo Street, next to Police Detectives</span>
              </div>
            </div>
            <div className="contact-line">
              <Phone />
              <div>
                <strong>Admissions desk</strong>
                <span>+27 10 020 2026 · Mon–Fri, 08:00–16:30</span>
              </div>
            </div>
          </div>
          <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <iframe title="NSTC campus map" className="h-56 w-full grayscale" src="https://www.google.com/maps?q=Prosperitus+Building+Old+Pretoria+Road+Wynberg+Johannesburg&output=embed" loading="lazy" />
          </div>
        </div>
        <div className="rounded-2xl bg-white p-7 shadow-[0_20px_60px_rgba(15,23,42,.07)] md:p-10">
          <p className="eyebrow">Admissions enquiry</p>
          {sent ? (
            <div className="flex min-h-[360px] flex-col items-center justify-center text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-700"><Check /></div>
              <h3 className="mt-5 font-display text-3xl text-slate-950">Thank you for reaching out.</h3>
              <p className="mt-3 max-w-sm text-sm leading-6 text-slate-600">A member of the NSTC admissions team will respond using the contact details provided.</p>
              <Button className="mt-7" onClick={() => setSent(false)}>Send another message</Button>
            </div>
          ) :
            (
              <form onSubmit={submit} className="mt-7 space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <label>First name<input className="field" required /></label>
                  <label>Last name<input className="field" required /></label>
                </div>
                <label>Email address<input className="field" type="email" required /></label>
                <label>What are you interested in?
                  <select className="field">
                    <option>National Certificate</option>
                    <option>Short course</option>
                    <option>Artisan / trade test</option>
                    <option>Corporate sponsorship</option>
                  </select>
                </label>
                <label>Your message<textarea className="field min-h-[120px] py-3" required /></label>
                <Button type="submit" disabled={loading} className="w-full justify-center">
                  {loading
                    ? (<Spinner label="Sending message" />)
                    : (<>Send enquiry <ArrowRight className="h-4 w-4" /></>)
                  }
                </Button>
              </form>
            )}
        </div>
      </div>
      <div className="container mt-12 grid gap-5 border-t border-slate-200 pt-10 md:grid-cols-3">
        <div>
          <p className="eyebrow">Banking details</p>
          <p className="mt-3 text-sm leading-6 text-slate-600">First National Bank · Business Account<br />Account: <strong className="text-slate-950">62611136632</strong> · Branch: 250655<br />Reference: ID or Passport number</p>
        </div>
        <div>
          <p className="eyebrow">Registration checklist</p>
          <p className="mt-3 text-sm leading-6 text-slate-600">Completed form, ID / passport / asylum permit, relevant qualifications and proof of deposit.</p>
        </div>
        <div>
          <p className="eyebrow">Credentials</p>
          <p className="mt-3 text-sm leading-6 text-slate-600">DHET 2019FE07/016 · QCTO Examination Centre · Trade Test Centre · SETA / ICB</p>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-[#090909] py-12 text-white">
      <div className="container flex flex-col justify-between gap-8 md:flex-row md:items-end">
        <div>
          <Logo light />
          <p className="mt-5 max-w-sm text-sm leading-6 text-white/45">We Teach Skills to Change Lives. Your Future, Is Our Concern.</p>
        </div>
        <div className="grid grid-cols-2 gap-x-10 gap-y-3 text-sm text-white/50">
          <a href="#about" className="hover:text-white">About NSTC</a>
          <a href="/portal" className="hover:text-white">Student portal</a>
          <a href="#programmes" className="hover:text-white">Programmes</a>
          <a href="/admin" className="hover:text-white">Staff workspace</a>
        </div>
      </div>
      <div className="container mt-10 border-t border-white/10 pt-6 text-xs text-white/30">© 2026 National Skills & Technical College · Accredited learning pathways across South Africa</div>
    </footer>
  );
}

function Landing({ data, setData, onApply }: {
  data: AppData;
  setData: React.Dispatch<React.SetStateAction<AppData>>;
  onApply: () => void
}) {
  return (
    <div className="public-page">
      <Hero onApply={onApply} />
      <Stats />
      <About />
      <Programmes onApply={onApply} />
      <Skills data={data} setData={setData} />
      <Fees />
      <Gallery />
      <Team />
      <section className="quote-band">
        <div className="container flex flex-col gap-7 md:flex-row md:items-center md:justify-between">
          <div>
            <Star className="h-7 w-7 text-[#D4AF37]" />
            <p className="mt-4 max-w-3xl font-display text-3xl leading-tight text-white md:text-4xl">“NSTC gave me more than a certificate. It gave me the confidence to walk into a workshop and know I belong there.”</p>
            <p className="mt-4 text-sm text-white/45">— Kagiso Ndlovu, Occupational Certificate graduate</p>
          </div>
          <div className="flex shrink-0 items-center gap-3">
            <div className="avatar-large bg-white/10 text-white">KN</div>
            <div>
              <p className="text-sm font-semibold text-white">Graduate story</p>
              <p className="text-xs text-white/45">Bricklaying · 2025</p>
            </div>
          </div>
        </div>
      </section>
      <Contact />
      <Footer />
    </div>
  );
}

function PortalShell({ children, active, onNavigate, role = "Student" }: {
  children: ReactNode;
  active: string;
  onNavigate: (path: string) => void;
  role?: string
}) {
  const [open, setOpen] = useState(false);
  const items = role === "Student"
    ? [
      { label: "Overview", icon: LayoutDashboard, path: "/portal" },
      { label: "My learning", icon: BookOpen, path: "/portal/learning" },
      { label: "Assignments", icon: ClipboardCheck, path: "/portal/assignments" },
      { label: "Results & attendance", icon: BarChart3, path: "/portal/results" },
      { label: "Finances", icon: WalletCards, path: "/portal/finances" }
    ] :
    [
      { label: "Overview", icon: LayoutDashboard, path: "/admin" },
      { label: "Students", icon: Users, path: "/admin/students" },
      { label: "Academics", icon: BookOpen, path: "/admin/academics" },
      { label: "Attendance", icon: ClipboardCheck, path: "/admin/attendance" },
      { label: "Finance", icon: WalletCards, path: "/admin/finance" }
    ];

  return (
    <div className="portal-shell">
      <aside className={`portal-sidebar ${open ? "open" : ""}`}>
        <div className="p-6">
          <Logo />
          <div className="mt-10">
            <p className="eyebrow px-3">{role === "Student" ? "My workspace" : "Management"}</p>
            <div className="mt-3 space-y-1">
              {items.map((item) => {
                const I = item.icon;
                return (
                  <button key={item.path} className={`side-link ${active === item.path ? "active" : ""}`} onClick={() => { onNavigate(item.path); setOpen(false); }}>
                    <I className="h-4 w-4" />
                    {item.label}{active === item.path && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[#D4AF37]" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
        <div className="mt-auto border-t border-slate-200 p-6">
          <div className="flex items-center gap-3">
            <div className="avatar-small">{role === "Student" ? "TM" : "AD"}</div>
            <div>
              <p className="text-sm font-semibold text-slate-950">{role === "Student" ? "Thabo Mokoena" : "NSTC Admin"}</p>
              <p className="text-xs text-slate-500">{role} account</p>
            </div>
          </div>
          <a href="/" className="mt-5 flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-950">
            <ExternalLink className="h-3.5 w-3.5" /> Public website
          </a>
        </div>
      </aside>

      <div className="portal-main">
        <header className="portal-header">
          <button className="icon-btn lg:hidden" onClick={() => setOpen(!open)}>
            <Menu />
          </button>
          <div>
            <p className="eyebrow">{role === "Student" ? "Student portal" : "Management system"}</p>
            <p className="hidden text-sm font-semibold text-slate-950 sm:block">
              {role === "Student" ? "Keep moving forward." : "A clear view of every learner."}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold text-slate-950">{role === "Student" ? "Thabo Mokoena" : "Admin account"}</p>
              <p className="text-xs text-slate-500">{role === "Student" ? "NSTC-26-0014" : "Full access"}</p>
            </div>
            <div className="avatar-small">{role === "Student" ? "TM" : "AD"}</div>
          </div>
        </header>
        <main className="p-5 md:p-8">{children}</main>
      </div>
    </div>
  );
}

function MetricCard({ label, value, detail, icon: I, tone = "gold" }: {
  label: string;
  value: string | number;
  detail: string;
  icon: Icon;
  tone?: string
}) {
  return (
    <div className="metric-card">
      <div className={`metric-icon metric-${tone}`}><I className="h-5 w-5" /></div>
      <p className="mt-5 text-xs font-semibold uppercase tracking-wider text-slate-400">{label}</p>
      <p className="mt-1 font-display text-3xl text-slate-950">{value}</p>
      <p className="mt-2 text-xs text-slate-500">{detail}</p>
    </div>
  );
}
function ProgressBar({ value, color = "gold" }: { value: number; color?: string }) {
  return (
    <div className="h-2 overflow-hidden rounded-full bg-slate-100">
      <div className={`h-full rounded-full ${color === "green" ? "bg-emerald-500" : "bg-[#D4AF37]"}`} style={{ width: `${value}%` }} />
    </div>
  );
}

function StudentOverview({ data, onNavigate }: {
  data: AppData;
  onNavigate: (path: string) => void
}) {
  const student = data.students[0];
  return (
    <>
      <PageHeading eyebrow="Monday, 08 June 2026" title={`Good morning, ${student.name.split(" ")[0]}.`} body="Here is your learning snapshot for this week."
        actions={
          <Button onClick={() => onNavigate("/portal/learning")}>Continue learning <ArrowRight className="h-4 w-4" /></Button>
        }
      />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Course progress" value="68%" detail="On track for Trimester 2" icon={TrendingUp} />
        <MetricCard label="Attendance" value={`${student.attendance}%`} detail="Above the 80% target" icon={ClipboardCheck} tone="green" />
        <MetricCard label="Term average" value={`${student.termAverage}%`} detail="12% higher than last term" icon={Award} />
        <MetricCard label="Outstanding fees" value={fee(student.balance)} detail={student.balance ? "Payment plan available" : "Your account is clear"} icon={WalletCards} tone={student.balance ? "red" : "green"} />
      </div>
      <div className="mt-6 grid gap-5 xl:grid-cols-[1.25fr_.75fr]">
        <div className="portal-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="eyebrow">Your pathway</p>
              <h3 className="mt-2 font-display text-2xl text-slate-950">{student.course}</h3>
            </div>
            <Pill tone="green">Active</Pill>
          </div>
          <div className="mt-7 grid gap-5 sm:grid-cols-3">
            <div>
              <p className="text-xs text-slate-400">Current term</p>
              <p className="mt-1 text-sm font-semibold text-slate-950">Trimester 2, 2026</p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Study mode</p>
              <p className="mt-1 text-sm font-semibold text-slate-950">Hybrid learning</p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Tutor</p>
              <p className="mt-1 text-sm font-semibold text-slate-950">Siyabonga Radebe</p>
            </div>
          </div>
          <div className="mt-7">
            <div className="mb-2 flex justify-between text-xs">
              <span className="font-semibold text-slate-600">Programme completion</span>
              <span className="font-semibold text-slate-950">68%</span>
            </div>
            <ProgressBar value={68} />
          </div>
          <div className="mt-7 flex flex-wrap gap-3">
            <Button variant="dark" onClick={() => onNavigate("/portal/learning")}>Open learning hub</Button>
            <a href="mailto:tutor@nstc.example" className="btn btn-light">Email tutor <Mail className="h-4 w-4" /></a>
          </div>
        </div>
        <div className="portal-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="eyebrow">Next up</p>
              <h3 className="mt-2 font-display text-2xl text-slate-950">Your schedule</h3>
            </div>
            <CalendarDays className="text-[#a27e10]" />
          </div>
          <div className="mt-5 space-y-4">
            {data.schedules.map((item) =>
              <div className="schedule-row" key={item.id}>
                <div className="date-tile">
                  <strong>{new Date(item.date).getDate()}</strong>
                  <span>{new Date(item.date).toLocaleDateString("en", { month: "short" })}</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-950">{item.title}</p>
                  <p className="mt-1 text-xs text-slate-500">{item.time} · {item.location}</p>
                </div>
              </div>)
            }
          </div>
          <button className="mt-5 text-sm font-bold text-slate-950" onClick={() => onNavigate("/portal/results")}>View full schedule <ArrowRight className="ml-1 inline h-4 w-4" /></button>
        </div>
      </div>
      <div className="mt-5 grid gap-5 lg:grid-cols-[1.1fr_.9fr]">
        <div className="portal-card">
          <div className="flex items-center justify-between"><div>
            <p className="eyebrow">Upcoming work</p>
            <h3 className="mt-2 font-display text-2xl text-slate-950">Assignments</h3>
          </div>
            <button className="text-xs font-bold text-slate-500" onClick={() => onNavigate("/portal/assignments")}>View all</button>
          </div>
          <div className="mt-5 divide-y divide-slate-100">
            {data.assignments.map((assignment) =>
              <div className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0" key={assignment.id}>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-950">{assignment.title}</p>
                  <p className="mt-1 text-xs text-slate-500">Due {assignment.due} · {assignment.course}</p>
                </div>
                {assignment.status === "Submitted"
                  ? <Pill tone="green">{assignment.score}%</Pill>
                  : <Pill tone="gold">{assignment.status}</Pill>
                }
              </div>
            )}
          </div>
        </div>
        <div className="portal-card bg-[#111] text-white">
          <p className="eyebrow text-[#D4AF37]">Tutor connection</p>
          <h3 className="mt-3 font-display text-2xl">Need a hand?</h3>
          <p className="mt-3 text-sm leading-6 text-white/55">Your assigned tutor is available for study support and pathway guidance.</p>
          <div className="mt-6 flex gap-2">
            <a href="https://wa.me/27101234567" className="btn btn-gold"><MessageCircle className="h-4 w-4" /> WhatsApp</a>
            <a href="mailto:tutor@nstc.example" className="btn btn-dark border border-white/15 bg-white/10 text-white hover:bg-white/15"><Mail className="h-4 w-4" /> Email</a>
          </div>
        </div>
      </div>
    </>
  );
}

function PageHeading({ eyebrow, title, body, actions }: {
  eyebrow: string;
  title: string;
  body?: string;
  actions?: ReactNode
}) {
  return (
    <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="mt-2 font-display text-4xl text-slate-950">{title}</h1>
        {body && <p className="mt-2 text-sm text-slate-500">{body}</p>}
      </div>
      {actions && <div>{actions}</div>}
    </div>
  );
}

function StudentLearning({ onNavigate }: {
  onNavigate: (path: string) => void
}) {
  return (
    <>
      <PageHeading eyebrow="My learning" title="Your learning hub" body="Everything you need for your current pathway, in one place."
        actions={
          <Button variant="dark" onClick={() => toast.success("Learning resources prepared for download.")}>
            <Download className="h-4 w-4" /> Download resource pack
          </Button>
        }
      />
      <div className="grid gap-5 lg:grid-cols-[1.2fr_.8fr]">
        <div className="portal-card">
          <p className="eyebrow">Enrolled programme</p>
          <h3 className="mt-2 font-display text-3xl text-slate-950">Electrical Engineering N1–N6</h3>
          <p className="mt-2 text-sm text-slate-500">Trimester 2 · Hybrid · Tutor: Siyabonga Radebe</p>
          <div className="mt-8 space-y-5">
            {["Engineering Science", "Mathematics N2", "Electrical Trade Theory"].map((subject, i) =>
              <div key={subject}>
                <div className="mb-2 flex justify-between text-sm">
                  <span className="font-semibold text-slate-800">{subject}</span>
                  <span className="text-slate-400">{[82, 74, 61][i]}%</span>
                </div>
                <ProgressBar value={[82, 74, 61][i]} />
              </div>)}
          </div>
        </div>
        <div className="portal-card">
          <p className="eyebrow">Learning resources</p>
          <div className="mt-4 space-y-3">
            {["Electrical installation rules · PDF", "Trimester 2 learner guide · PDF", "Workshop safety checklist · PDF"].map((resource) =>
              <button key={resource} className="resource-row" onClick={() => toast.success("Demo download started.")}>
                <div className="file-icon">
                  <FileText />
                </div>
                <span>{resource}</span>
                <Download className="ml-auto h-4 w-4 text-slate-400" />
              </button>)}
          </div>
        </div>
      </div>
      <div className="mt-5 portal-card">
        <div className="flex items-center justify-between">
          <div>
            <p className="eyebrow">Upcoming timetable</p>
            <h3 className="mt-2 font-display text-2xl text-slate-950">Classes and assessments</h3>
          </div>
          <button className="text-sm font-bold text-slate-500" onClick={() => onNavigate("/portal/results")}>Open calendar <ArrowRight className="ml-1 inline h-4 w-4" /></button>
        </div>
        <div className="mt-5 overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Activity</th>
                <th>Type</th>
                <th>Date</th>
                <th>Time</th>
                <th>Location</th>
              </tr>
            </thead>
            <tbody>
              {[
                {
                  t: "Engineering Science", k: "Class", d: "08 Jun 2026",
                  time: "09:00 – 11:00", l: "Workshop 2"
                },
                {
                  t: "Mathematics N2", k: "Class", d: "09 Jun 2026",
                  time: "13:00 – 15:00", l: "Room 4 · Online"
                },
                {
                  t: "Trimester 2 examinations", k: "Exam", d: "22 Jun 2026",
                  time: "08:30 – 12:30", l: "Main Hall"
                }
              ].map((r) =>
                <tr key={r.t}>
                  <td className="font-semibold">{r.t}</td>
                  <td>
                    <Pill tone={r.k === "Exam" ? "red" : "slate"}>{r.k}</Pill>
                  </td>
                  <td>{r.d}</td>
                  <td>{r.time}</td>
                  <td>{r.l}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

function StudentAssignments({ data }: { data: AppData }) {
  const [submitOpen, setSubmitOpen] = useState(false);
  const [selected, setSelected] = useState<Assignment | null>(null);
  const { loading, run } = useAction();

  return (
    <>
      <PageHeading eyebrow="Coursework" title="Assignments" body="Receive, submit and track your coursework across every subject." />
      <div className="grid gap-4 sm:grid-cols-3">
        <MetricCard label="Completed" value="8" detail="This academic year" icon={Check} tone="green" />
        <MetricCard label="In progress" value="2" detail="Keep your momentum" icon={Clock3} />
        <MetricCard label="Average score" value="79%" detail="Across submitted work" icon={Award} />
      </div>
      <div className="mt-6 portal-card">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Assignment</th>
                <th>Course</th>
                <th>Due date</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {data.assignments.map((a) =>
                <tr key={a.id}>
                  <td>
                    <p className="font-semibold text-slate-950">{a.title}</p>
                    <p className="mt-1 text-xs text-slate-400">Assignment brief · PDF</p>
                  </td>
                  <td>{a.course}</td>
                  <td>{a.due}</td>
                  <td>
                    {a.status === "Submitted"
                      ? <Pill tone="green">Submitted · {a.score}%</Pill>
                      : <Pill>{a.status}</Pill>
                    }
                  </td>
                  <td>
                    <div className="flex justify-end gap-2">
                      <button className="icon-btn" onClick={() => toast.success("Demo assignment brief downloaded.")}>
                        <Download />
                      </button>
                      {a.status !== "Submitted" && <Button onClick={() => { setSelected(a); setSubmitOpen(true); }}>Submit</Button>}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {submitOpen && selected &&
        <Modal title={`Submit: ${selected.title}`} onClose={() => setSubmitOpen(false)}>
          <div className="mt-5 rounded-xl bg-slate-50 p-4 text-sm text-slate-600">Upload is simulated for this prototype. Your submission will be recorded locally.</div>
          <label className="mt-5 block">Choose file<input className="field" type="file" /></label>
          <div className="mt-7 flex justify-end gap-3">
            <Button variant="light" onClick={() => setSubmitOpen(false)}>Cancel</Button>
            <Button onClick={() => run(() => { toast.success("Assignment submitted successfully."); setSubmitOpen(false); })} disabled={loading}>
              {loading
                ? <Spinner label="Submitting" />
                : <>Submit assignment <ArrowRight className="h-4 w-4" /></>
              }
            </Button>
          </div>
        </Modal>
      }
    </>
  );
}

function StudentResults({ data }: { data: AppData }) {
  return (
    <>
      <PageHeading eyebrow="Progress record" title="Results & attendance" body="Trace your term performance and attendance history."
        actions={
          <Button onClick={() => toast.success("Statement of results generated.")}><Download className="h-4 w-4" /> Download statement</Button>
        }
      />
      <div className="grid gap-4 sm:grid-cols-3">
        <MetricCard label="Term average" value="82%" detail="Trimester 2 · 2026" icon={Award} />
        <MetricCard label="Attendance" value="94%" detail="Target: 80%" icon={ClipboardCheck} tone="green" />
        <MetricCard label="Classes attended" value="32 / 34" detail="Last two weeks" icon={CalendarDays} />
      </div>
      <div className="mt-6 grid gap-5 lg:grid-cols-[1.1fr_.9fr]">
        <div className="portal-card">
          <p className="eyebrow">Results by subject</p>
          <div className="mt-5 divide-y divide-slate-100">
            {[
              ["Engineering Science", 86, "A"],
              ["Mathematics N2", 78, "B"],
              ["Electrical Trade Theory", 82, "B+"],
              ["Logic Systems", 74, "B"]
            ].map(([name, score, grade]) =>
              <div className="flex items-center gap-4 py-4 first:pt-0 last:pb-0" key={String(name)}>
                <div className="file-icon"><BookOpen /></div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-950">{name}</p>
                  <div className="mt-2"><ProgressBar value={Number(score)} /></div>
                </div>
                <span className="font-display text-xl text-slate-950">{score}%</span>
                <Pill tone="green">{grade}</Pill>
              </div>
            )}
          </div>
        </div>
        <div className="portal-card">
          <p className="eyebrow">Attendance reflection</p>
          <div className="mt-6 flex items-end gap-2">{[84, 92, 100, 88, 96, 100, 75, 100, 100, 90, 100, 100, 92, 100].map((v, i) =>
            <div className="flex flex-1 flex-col items-center gap-2" key={i}>
              <div className="w-full rounded-t-md bg-[#D4AF37]" style={{ height: `${Math.max(24, v * .75)}px`, opacity: v < 80 ? .45 : 1 }} />
              <span className="text-[9px] text-slate-400">{i + 1}</span>
            </div>
          )}
          </div>
          <div className="mt-5 flex justify-between text-xs text-slate-400">
            <span>Two weeks ago</span>
            <span>This week</span>
          </div>
        </div>
      </div>
      <div className="mt-5 portal-card">
        <p className="eyebrow">Lecturer remarks</p>
        <div className="mt-4 flex gap-4">
          <div className="avatar-small">SR</div>
          <div>
            <p className="text-sm leading-6 text-slate-600">“Thabo is showing excellent practical application in the workshop. Keep the same focus through examination preparation.”</p>
            <p className="mt-2 text-xs font-semibold text-slate-950">Siyabonga Radebe · Engineering lecturer</p>
          </div>
        </div>
      </div>
    </>
  );
}
function StudentFinances({ data }: { data: AppData }) {
  return (
    <>
      <PageHeading eyebrow="Account & payments" title="Your finances" body="A transparent view of your registration, tuition and account balance."
        actions={
          <Button onClick={() => toast.success("Payment statement generated.")}><Download className="h-4 w-4" /> Download statement</Button>
        }
      />
      <div className="grid gap-4 sm:grid-cols-3">
        <MetricCard label="Paid this year" value={fee(6500)} detail="3 recorded payments" icon={CircleDollarSign} tone="green" />
        <MetricCard label="Outstanding" value={fee(data.students[0].balance)} detail="No payment due" icon={WalletCards} />
        <MetricCard label="Next instalment" value="03 Jul" detail={fee(3000)} icon={CalendarDays} />
      </div>
      <div className="mt-6 portal-card">
        <p className="eyebrow">Payment history</p>
        <div className="mt-4 overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Description</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {data.payments.map((p) =>
                <tr key={p.id}>
                  <td className="font-semibold">{p.label}</td>
                  <td>{p.date}</td>
                  <td>{fee(p.amount)}</td>
                  <td><Pill tone="green">{p.status}</Pill></td>
                  <td>
                    <button className="icon-btn" onClick={() => toast.success("Receipt downloaded.")}><Download /></button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

type ApplicationDraft = {
  name: string;
  email: string;
  phone: string;
  course: string;
  category: string;
  field: string;
  level: string;
  period: string;
  refundable: string
};

function Registration({ onComplete }: {
  onComplete: (application?: ApplicationDraft) => void
}) {
  const [step, setStep] = useState(1);
  const [done, setDone] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    course: courses[0].name,
    category: "Course",
    field: "Engineering Studies",
    level: "N1",
    period: "Trimester 2",
    refundable: "Refundable"
  });
  const { loading, run } = useAction();

  const update = (key: string, value: string) => setForm((old) => ({
    ...old, [key]: value
  }));
  const next = () => {
    if (step < 3) setStep(step + 1);
    else run(() => { onComplete(form); setDone(true); });
  };
  if (done)
    return (<div className="registration-card">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
        <Check className="h-8 w-8" />
      </div>
      <p className="mt-6 eyebrow">Application complete</p>
      <h2 className="mt-2 font-display text-4xl text-slate-950">Welcome to NSTC.</h2>
      <p className="mt-4 max-w-lg text-sm leading-6 text-slate-600">Your provisional student number is <strong className="text-slate-950">NSTC-26-0317</strong>. Admissions will verify your documents and confirm your orientation schedule.</p>
      <div className="mt-7 flex flex-wrap gap-3">
        <Button onClick={onComplete}>Open student dashboard <ArrowRight className="h-4 w-4" /></Button>
        <a className="btn btn-light" href="/">Back to website</a>
      </div>
    </div>);
  return (
    <div className="registration-card">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="eyebrow">Application journey</p>
          <h1 className="mt-2 font-display text-4xl text-slate-950">Join the NSTC community.</h1>
        </div>
        <span className="text-sm font-semibold text-slate-400">Step {step} of 3</span>
      </div>
      <div className="mt-7 flex gap-2">
        {[1, 2, 3].map((s) =>
          <div className={`h-1.5 flex-1 rounded-full ${s <= step ? "bg-[#D4AF37]" : "bg-slate-100"}`} key={s} />
        )}
      </div>
      {step === 1 && <div className="mt-10 space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <label>Full name
            <input value={form.name} onChange={(e) => update("name", e.target.value)} className="field" placeholder="e.g. Thabo Mokoena" />
          </label>
          <label>Email address
            <input value={form.email} onChange={(e) => update("email", e.target.value)} className="field" type="email" placeholder="name@email.com" />
          </label>
        </div>
        <label>Mobile number
          <input value={form.phone} onChange={(e) => update("phone", e.target.value)} className="field" placeholder="+27 ..." />
        </label>
        <label>Identity document / passport
          <input className="field" type="file" />
        </label>
        <p className="text-xs leading-5 text-slate-400">This demo stores registration information in your browser only. No real documents or payments are processed.</p>
      </div>
      }
      {step === 2 &&
        <div className="mt-10 space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <label>Field of study
              <select value={form.field} onChange={(e) => update("field", e.target.value)} className="field">
                {academicFields.map((f) =>
                  <option key={f}>{f}</option>
                )}
              </select>
            </label>
            <label>Level
              <select value={form.level} onChange={(e) => update("level", e.target.value)} className="field">
                <option>N1</option>
                <option>N2</option>
                <option>N4</option>
                <option>Occupational</option>
                <option>Skills</option>
              </select>
            </label>
          </div>
          <label>Programme
            <select value={form.course} onChange={(e) => update("course", e.target.value)} className="field">
              {courses.map((c) => <option key={c.id}>{c.name}</option>)}
            </select>
          </label>
          <label>Examination period
            <select value={form.period} onChange={(e) => update("period", e.target.value)} className="field">
              <option>Trimester 1</option>
              <option>Trimester 2</option>
              <option>Trimester 3</option>
            </select>
          </label>
          <div>
            <p className="field-label">Select subjects / modules</p>
            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              {courses[0].subjects.map((s) =>
                <label key={s} className="check-option">
                  <input type="checkbox" defaultChecked />
                  <span>{s}</span></label>
              )}
            </div>
          </div>
        </div>
      }
      {step === 3 &&
        <div className="mt-10 space-y-5">
          <div className="rounded-xl bg-[#fbf7e8] p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="eyebrow text-[#a27e10]">Registration fee</p>
                <h3 className="mt-2 font-display text-3xl text-slate-950">R500</h3>
              </div>
              <CircleDollarSign className="text-[#a27e10]" />
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-600">Choose whether your demo registration fee should be marked as refundable or non-refundable.</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <button className={`choice-card ${form.refundable === "Refundable" ? "selected" : ""}`} onClick={() => update("refundable", "Refundable")}><Check className="h-4 w-4" /> Refundable</button>
            <button className={`choice-card ${form.refundable === "Non-refundable" ? "selected" : ""}`} onClick={() => update("refundable", "Non-refundable")}><Check className="h-4 w-4" /> Non-refundable</button>
          </div>
          <div className="rounded-xl border border-slate-200 p-4 text-sm text-slate-600">
            <strong className="text-slate-950">
              Bank transfer demo</strong><br />
            FNB Business Account · 62611136632 · Branch 250655<br />
            Use your ID/passport number as reference.
          </div>
        </div>
      }
      <div className="mt-10 flex justify-between gap-3">
        <Button variant="light" onClick={() => step === 1 ? onComplete() : setStep(step - 1)}>{step === 1
          ? "Cancel"
          : <>
            <ChevronLeft className="h-4 w-4" /> Back
          </>
        }
        </Button>
        <Button onClick={next} disabled={loading}>
          {loading ? <Spinner label="Saving" />
            : step === 3
              ? <>Complete application <Check className="h-4 w-4" /></>
              : <>Continue <ArrowRight className="h-4 w-4" /></>
          }
        </Button>
      </div>
    </div>);
}

function StudentPortal({ data, setData, path, navigate }: {
  data: AppData;
  setData: React.Dispatch<React.SetStateAction<AppData>>;
  path: string;
  navigate: (path: string) => void
}) {
  const [register, setRegister] = useState(path === "/portal/apply");
  if (register)
    return (
      <div className="registration-page">
        <div className="registration-top">
          <Logo light />
          <a href="/" className="text-sm font-semibold text-white/60 hover:text-white">Back to website</a>
        </div>
        <Registration onComplete={(application) => {
          if (application?.email) {
            const generated = `NSTC-26-${String(data.students.length + 1).padStart(4, "0")}`;
            setData((old) => ({
              ...old,
              students: [...old.students, {
                id: crypto.randomUUID(),
                name: application.name || "New NSTC learner",
                email: application.email,
                phone: application.phone,
                studentNo: generated,
                campus: "Wynberg Johannesburg",
                course: application.course,
                status: "Active",
                startDate: new Date().toISOString().slice(0, 10),
                attendance: 100,
                balance: 500,
                termAverage: 0,
                initials: initials(application.name || "New learner"),
                guardian: "",
                remarks: "Newly registered learner awaiting first assessment."
              }]
            }));
          }
          setRegister(false);
          navigate("/portal");
        }} />
      </div>
    );
  const active = path.startsWith("/portal/assignments")
    ? "/portal/assignments"
    : path.startsWith("/portal/results")
      ? "/portal/results"
      : path.startsWith("/portal/finances")
        ? "/portal/finances"
        : path.startsWith("/portal/learning")
          ? "/portal/learning"
          : "/portal";

  return (
    <PortalShell active={active} onNavigate={navigate}>
      <div className="mb-5 flex justify-end lg:hidden">
        <Button onClick={() => setRegister(true)}>Apply for another programme</Button>
      </div>
      {active === "/portal" &&
        <StudentOverview data={data} onNavigate={navigate} />
      }
      {active === "/portal/learning" &&
        <StudentLearning onNavigate={navigate} />
      }
      {active === "/portal/assignments" &&
        <StudentAssignments data={data} />
      }
      {active === "/portal/results" &&
        <StudentResults data={data} />
      }
      {active === "/portal/finances" &&
        <StudentFinances data={data} />
      }
    </PortalShell>
  );
}

function AdminDashboard({ data, setData, navigate }: {
  data: AppData;
  setData: React.Dispatch<React.SetStateAction<AppData>>;
  navigate: (path: string) => void
}) {
  const [confirm, setConfirm] = useState<Student | null>(null);
  const [announcementOpen, setAnnouncementOpen] = useState(false);
  const { loading, run } = useAction();
  const counts = {
    active: data.students.filter((s) => s.status === "Active").length,
    suspended: data.students.filter((s) => s.status === "Suspended").length,
    completed: data.students.filter((s) => s.status === "Completed").length,
    alumni: data.students.filter((s) => s.status === "Alumni").length
  };
  const absent = data.students.filter((s) => s.attendance < 80);

  const remove = () => {
    if (!confirm) return;
    run(() => {
      setData((old) => ({ ...old, students: old.students.filter((s) => s.id !== confirm.id) }));
      setConfirm(null);
      toast.success("Student removed from demo register.");
    });
  };

  return (
    <PortalShell role="Admin" active="/admin" onNavigate={navigate}>
      <PageHeading eyebrow="Monday, 08 June 2026" title="Good morning, admin." body="A live demo view of the NSTC student body."
        actions={
          <Button onClick={() => setAnnouncementOpen(true)}><Plus className="h-4 w-4" /> New announcement</Button>
        }
      />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Total learners" value={data.students.length} detail="Across 2 campuses" icon={Users} />
        <MetricCard label="Active" value={counts.active} detail="Currently enrolled" icon={TrendingUp} tone="green" />
        <MetricCard label="Owing" value={data.students.filter((s) => s.balance > 0).length} detail="Needs finance follow-up" icon={WalletCards} tone="red" />
        <MetricCard label="Alumni" value={counts.alumni} detail="In graduate network" icon={Award} />
      </div>
      <div className="mt-6 grid gap-5 xl:grid-cols-[1.3fr_.7fr]">
        <div className="portal-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="eyebrow">Student register</p>
              <h3 className="mt-2 font-display text-2xl text-slate-950">Recent learners</h3>
            </div>
            <button onClick={() => navigate("/admin/students")} className="text-sm font-bold text-slate-500">View all <ArrowRight className="ml-1 inline h-4 w-4" /></button>
          </div>
          <div className="mt-5 overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Learner</th>
                  <th>Programme</th>
                  <th>Campus</th>
                  <th>Status</th>
                  <th>Attendance</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {data.students.slice(0, 5).map((s) =>
                  <tr key={s.id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="avatar-small">{s.initials}</div>
                        <div>
                          <p className="font-semibold text-slate-950">{s.name}</p>
                          <p className="text-xs text-slate-400">{s.studentNo}</p>
                        </div>
                      </div>
                    </td>
                    <td>{s.course}</td>
                    <td>{s.campus}</td>
                    <td>
                      <Pill tone={s.status === "Suspended" ? "red" : s.status === "Active" ? "green" : "slate"}>{s.status}</Pill>
                    </td>
                    <td>
                      <span className={s.attendance < 80 ? "font-bold text-red-600" : "text-slate-600"}>{s.attendance}%</span>
                    </td>
                    <td>
                      <button className="icon-btn" onClick={() => setConfirm(s)}><MoreHorizontal /></button>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        <div className="space-y-5">
          <div className="portal-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="eyebrow">Needs attention</p>
                <h3 className="mt-2 font-display text-2xl text-slate-950">Absenteeism watch</h3>
              </div>
              <Pill tone="red">{absent.length} flagged</Pill>
            </div>
            <div className="mt-5 space-y-4">
              {absent.length
                ? absent.map((s) =>
                  <div key={s.id}>
                    <div className="flex justify-between text-sm">
                      <span className="font-semibold text-slate-950">{s.name}</span>
                      <span className="text-red-600">{s.attendance}%</span>
                    </div>
                    <div className="mt-2">
                      <ProgressBar value={s.attendance} />
                    </div>
                  </div>
                ) :
                <p className="text-sm text-slate-500">No learners are currently flagged.</p>
              }
            </div>
            <button onClick={() => navigate("/admin/attendance")} className="mt-5 text-sm font-bold text-slate-950">Open attendance register <ArrowRight className="ml-1 inline h-4 w-4" /></button>
          </div>
          <div className="portal-card">
            <p className="eyebrow">Announcements</p>
            <div className="mt-4 space-y-4">{data.announcements.slice(0, 3).map((a) =>
              <div key={a.id}>
                <p className="text-sm font-semibold text-slate-950">{a.title}</p>
                <p className="mt-1 text-xs text-slate-500">{a.date} · {a.audience}</p>
              </div>
            )}
            </div>
          </div>
        </div>
      </div>
      <div className="mt-5 grid gap-5 md:grid-cols-3">
        <div className="dark-mini-card">
          <Users />
          <span><strong>{counts.active}</strong><small>Active learners</small></span>
        </div>
        <div className="dark-mini-card">
          <GraduationCap />
          <span><strong>{counts.completed}</strong><small>Ready to graduate</small></span>
        </div>
        <div className="dark-mini-card">
          <CircleDollarSign />
          <span>
            <strong>{fee(data.students.reduce((sum, s) => sum + s.balance, 0))}</strong>
            <small>Total outstanding</small>
          </span>
        </div>
      </div>
      {confirm &&
        <Confirm title="Remove learner from register?" body={`This will remove ${confirm.name} from the local demo register. This action cannot be undone.`} onCancel={() => setConfirm(null)} onConfirm={remove} loading={loading} />
      }
      {announcementOpen &&
        <Modal title="Create announcement" onClose={() => setAnnouncementOpen(false)}>
          <form className="mt-5 space-y-4" onSubmit={(e) => {
            e.preventDefault();
            setData((old) => ({
              ...old,
              announcements: [{
                id: crypto.randomUUID(),
                title: "New campus update",
                body: "An update has been published by the admin team.",
                date: new Date().toISOString().slice(0, 10),
                audience: "All students"
              },
              ...old.announcements]
            }));
            setAnnouncementOpen(false);
            toast.success("Announcement published.");
          }}>
            <label>Title
              <input className="field" required defaultValue="New campus update" />
            </label>
            <label>Announcement
              <textarea className="field min-h-[100px] py-3" required defaultValue="An update has been published by the admin team." />
            </label>
            <Button type="submit" className="w-full justify-center">Publish announcement <ArrowRight className="h-4 w-4" /></Button>
          </form>
        </Modal>
      }
    </PortalShell>
  );
}

function AdminStudents({ data, navigate }: {
  data: AppData;
  navigate: (path: string) => void
}) {
  const [query, setQuery] = useState("");
  const list = data.students.filter((s) => `${s.name} ${s.studentNo} ${s.course}`.toLowerCase().includes(query.toLowerCase()));

  return (
    <PortalShell role="Admin" active="/admin/students" onNavigate={navigate}>
      <PageHeading eyebrow="Student register" title="All learners" body={`${data.students.length} learner profiles in the local register.`}
        actions={
          <Button onClick={() => toast.success("Student import template downloaded.")}><Download className="h-4 w-4" /> Import template</Button>
        }
      />
      <div className="portal-card">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div className="relative max-w-md flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input className="field mt-0 pl-10" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search learners, student numbers or programmes" />
          </div>
          <div className="flex gap-2">
            <Pill tone="green">{data.students.filter((s) => s.status === "Active").length} active</Pill>
            <Pill tone="red">{data.students.filter((s) => s.status === "Suspended").length} suspended</Pill>
          </div>
        </div>
        <div className="mt-6 overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Learner</th>
                <th>Programme</th>
                <th>Campus</th>
                <th>Start date</th>
                <th>Status</th>
                <th>Balance</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {list.map((s) =>
                <tr key={s.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="avatar-small">{s.initials}</div>
                      <div>
                        <p className="font-semibold text-slate-950">{s.name}</p>
                        <p className="text-xs text-slate-400">{s.studentNo} · {s.email}</p>
                      </div>
                    </div>
                  </td>
                  <td>{s.course}</td>
                  <td>{s.campus}</td>
                  <td>{s.startDate}</td>
                  <td>
                    <Pill tone={s.status === "Active" ? "green" : s.status === "Suspended" ? "red" : "slate"}>{s.status}</Pill>
                  </td>
                  <td className={s.balance ? "font-bold text-red-600" : "text-slate-500"}>{fee(s.balance)}</td>
                  <td>
                    <button className="icon-btn" onClick={() => toast.info(`${s.name}'s profile is ready for review.`)}><ExternalLink /></button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </PortalShell>
  );
}

function AdminAcademics({ data, setData, navigate }: {
  data: AppData;
  setData: React.Dispatch<React.SetStateAction<AppData>>;
  navigate: (path: string) => void
}) {
  const [tab, setTab] = useState("Schedules");
  const [modal, setModal] = useState(false);
  const tabs = ["Schedules", "Assignments", "Exams", "Announcements"];
  return (
    <PortalShell role="Admin" active="/admin/academics" onNavigate={navigate}>
      <PageHeading eyebrow="Academic operations" title="Plan the learning cycle" body="Create, publish and maintain the academic calendar."
        actions={
          <Button onClick={() => setModal(true)}><Plus className="h-4 w-4" /> Create {tab.slice(0, -1)}</Button>
        }
      />
      <div className="portal-card">
        <div className="flex flex-wrap gap-2 border-b border-slate-100 pb-4">
          {tabs.map((item) => <button key={item} className={`filter-chip ${tab === item ? "active" : ""}`} onClick={() => setTab(item)}>{item}</button>)}</div>
        <div className="mt-5 overflow-x-auto">
          {tab === "Schedules" &&
            <table className="data-table">
              <thead>
                <tr>
                  <th>Activity</th>
                  <th>Type</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Location</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.schedules.map((s) =>
                  <tr key={s.id}>
                    <td className="font-semibold">{s.title}</td>
                    <td>
                      <Pill tone={s.kind === "Exam" ? "red" : "slate"}>{s.kind}</Pill>
                    </td>
                    <td>{s.date}</td>
                    <td>{s.time}</td>
                    <td>{s.location}</td>
                    <td>
                      <button className="icon-btn" onClick={() => toast.success("Schedule edit mode opened.")}><MoreHorizontal /></button>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          }
          {tab === "Assignments" &&
            <table className="data-table">
              <thead>
                <tr>
                  <th>Assignment</th>
                  <th>Course</th>
                  <th>Due date</th>
                  <th>Submissions</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {data.assignments.map((a) =>
                  <tr key={a.id}>
                    <td className="font-semibold">{a.title}</td>
                    <td>{a.course}</td>
                    <td>{a.due}</td>
                    <td>18 / 24</td>
                    <td>
                      <Pill tone="green">Published</Pill>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          }
          {tab === "Exams" &&
            <div className="empty-state">
              <FileText />
              <h3>No additional exam papers yet</h3>
              <p>Create a published exam schedule to make it visible to learners.</p>
              <Button onClick={() => setModal(true)}>Create exam</Button>
            </div>
          }
          {tab === "Announcements" &&
            <div className="space-y-3">
              {data.announcements.map((a) =>
                <div className="list-row" key={a.id}>
                  <div>
                    <p className="font-semibold text-slate-950">{a.title}</p>
                    <p className="mt-1 text-xs text-slate-500">{a.date} · {a.audience}</p>
                  </div>
                  <button className="icon-btn" onClick={() => toast.success("Announcement edit mode opened.")}>
                    <MoreHorizontal />
                  </button>
                </div>
              )}
            </div>
          }
        </div>
      </div>
      {modal &&
        <Modal title={`Create ${tab.slice(0, -1).toLowerCase()}`} onClose={() => setModal(false)}>
          <form className="mt-5 space-y-4" onSubmit={(e) => {
            e.preventDefault();
            if (tab === "Schedules")
              setData((old) => ({
                ...old,
                schedules: [{
                  id: crypto.randomUUID(),
                  title: "New academic activity",
                  kind: "Class",
                  date: "2026-07-01",
                  time: "09:00 – 11:00",
                  location: "Room 1 · Wynberg"
                },
                ...old.schedules]
              }));
            setModal(false);
            toast.success(`${tab.slice(0, -1)} created and saved locally.`);
          }}>
            <label>Title
              <input className="field" defaultValue="New academic activity" required />
            </label>
            <label>Date
              <input className="field" type="date" defaultValue="2026-07-01" required />
            </label>
            <label>Notes
              <textarea className="field min-h-[100px] py-3" defaultValue="Add details for learners and teaching staff." />
            </label>
            <Button type="submit" className="w-full justify-center">Save and publish <Check className="h-4 w-4" /></Button>
          </form>
        </Modal>
      }
    </PortalShell>
  );
}

function AdminAttendance({ data, navigate }: {
  data: AppData;
  navigate: (path: string) => void
}) {
  const [records, setRecords] = useState<Record<string, boolean>>({});
  return (
    <PortalShell role="Admin" active="/admin/attendance" onNavigate={navigate}>
      <PageHeading eyebrow="Daily register" title="Record attendance" body="Mark attendance for the Engineering Science class on 08 June 2026."
        actions={
          <Button onClick={() => toast.success("Attendance saved to local register.")}><Check className="h-4 w-4" /> Save attendance</Button>
        }
      />
      <div className="portal-card">
        <div className="flex items-center justify-between border-b border-slate-100 pb-5">
          <div>
            <p className="eyebrow">Engineering Science · Workshop 2</p>
            <h3 className="mt-2 font-display text-2xl text-slate-950">Monday, 08 June 2026</h3>
          </div>
          <Pill>{Object.values(records).filter(Boolean).length} present</Pill>
        </div>
        <div className="mt-5 space-y-2">
          {data.students.filter((s) => s.status === "Active").map((s) =>
            <label className="attendance-row" key={s.id}>
              <div className="flex items-center gap-3">
                <div className="avatar-small">{s.initials}</div>
                <div>
                  <p className="text-sm font-semibold text-slate-950">{s.name}</p>
                  <p className="text-xs text-slate-400">{s.studentNo} · {s.course}</p>
                </div>
              </div>
              <input type="checkbox" checked={records[s.id] ?? s.attendance > 80} onChange={(e) => setRecords((old) => ({ ...old, [s.id]: e.target.checked }))} />
            </label>
          )}
        </div>
      </div>
    </PortalShell>
  );
}

function AdminFinance({ data, navigate }: {
  data: AppData;
  navigate: (path: string) => void
}) {
  return (
    <PortalShell role="Admin" active="/admin/finance" onNavigate={navigate}>
      <PageHeading eyebrow="Finance desk" title="Payments & statements" body="Update learner payments and print account statements."
        actions={
          <Button onClick={() => toast.success("Finance report downloaded.")}><Download className="h-4 w-4" /> Export report</Button>
        }
      />
      <div className="grid gap-4 sm:grid-cols-3">
        <MetricCard label="Collected this month" value={fee(32500)} detail="+14% versus last month" icon={CircleDollarSign} tone="green" />
        <MetricCard label="Outstanding" value={fee(data.students.reduce((sum, s) => sum + s.balance, 0))} detail={`${data.students.filter((s) => s.balance > 0).length} learners owing`} icon={WalletCards} tone="red" />
        <MetricCard label="Payment records" value="128" detail="Across both campuses" icon={FileText} />
      </div>
      <div className="mt-6 portal-card">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Learner</th>
                <th>Programme</th>
                <th>Balance</th>
                <th>Last payment</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.students.map((s) =>
                <tr key={s.id}>
                  <td className="font-semibold">{s.name}</td>
                  <td>{s.course}</td>
                  <td className={s.balance ? "font-bold text-red-600" : "text-emerald-600"}>{s.balance ? fee(s.balance) : "Clear"}</td>
                  <td>03 Mar 2026 · {fee(s.balance ? 3000 : 500)}</td>
                  <td>
                    <div className="flex gap-2">
                      <Button variant="light" onClick={() => toast.success("Payment update form opened.")}><Plus className="h-4 w-4" /> Payment</Button>
                      <button className="icon-btn" onClick={() => toast.success("Learner statement downloaded.")}><Download /></button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </PortalShell>
  );
}

function ParentPortal({ data, navigate }: {
  data: AppData;
  navigate: (path: string) => void
}) {
  const [logged, setLogged] = useState(false);
  const [email, setEmail] = useState("");
  const [number, setNumber] = useState("");
  const [error, setError] = useState("");
  const student = data.students[0];

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const found = data.students.find((s) => s.email === email.trim() && s.studentNo === number.trim());
    if (found) {
      setLogged(true);
      setError("");
    } else setError("For the demo, use thabo.mokoena@example.com and NSTC-26-0014.");
  };

  if (!logged) return (
    <div className="parent-page">
      <div className="parent-top">
        <Logo />
        <a href="/" className="text-sm font-semibold text-slate-500">Back to public website</a>
      </div>
      <div className="parent-login">
        <div className="parent-login-art">
          <p className="eyebrow text-[#D4AF37]">Family access</p>
          <h1 className="mt-3 font-display text-5xl text-white">Progress is better when shared.</h1>
          <p className="mt-5 text-sm leading-6 text-white/55">A simple, read-only view of your learner’s journey at National Skills & Technical College.</p>
        </div>
        <form onSubmit={submit} className="parent-form">
          <p className="eyebrow">Parent portal</p>
          <h2 className="mt-2 font-display text-3xl text-slate-950">Sign in to view progress.</h2>
          <p className="mt-3 text-sm leading-6 text-slate-500">Use the student’s email and NSTC student number.</p>
          <label className="mt-7 block">Student email
            <input className="field" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="student@email.com" />
          </label>
          <label className="mt-5 block">Student number / ID
            <input className="field" value={number} onChange={(e) => setNumber(e.target.value)} required placeholder="NSTC-26-0014" />
          </label>
          {error &&
            <p className="mt-4 rounded-lg bg-red-50 p-3 text-xs text-red-700">{error}</p>
          }
          <Button type="submit" className="mt-7 w-full justify-center">View learner profile <ArrowRight className="h-4 w-4" /></Button>
          <a href="/portal" className="mt-5 flex items-center justify-center text-sm font-semibold text-slate-500">Student login <ArrowRight className="ml-1 h-4 w-4" /></a>
        </form>
      </div>
    </div>
  );

  return <div className="portal-shell"><div className="portal-main"><header className="portal-header"><div><Logo /></div><div className="flex items-center gap-3"><span className="hidden text-sm text-slate-500 sm:block">Read-only family access</span><Button variant="light" onClick={() => setLogged(false)}>Sign out</Button></div></header><main className="mx-auto max-w-6xl p-5 md:p-8"><PageHeading eyebrow="Parent access · Read only" title={`${student.name}'s progress`} body="Your learner’s current academic and campus snapshot." actions={<Button onClick={() => toast.success("Statement of results downloaded.")}><Download className="h-4 w-4" /> Statement of results</Button>} /><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><MetricCard label="Current status" value={student.status} detail={student.course} icon={GraduationCap} tone="green" /><MetricCard label="Attendance" value={`${student.attendance}%`} detail="Across current term" icon={ClipboardCheck} /><MetricCard label="Average score" value={`${student.termAverage}%`} detail="Assignments + exams" icon={Award} /><MetricCard label="Course duration" value="3 years" detail={`Started ${student.startDate}`} icon={Clock3} /></div><div className="mt-6 grid gap-5 lg:grid-cols-[1.1fr_.9fr]"><div className="portal-card"><p className="eyebrow">Learner demographics</p><div className="mt-5 grid gap-5 sm:grid-cols-2"><div><p className="text-xs text-slate-400">Email</p><p className="mt-1 text-sm font-semibold">{student.email}</p></div><div><p className="text-xs text-slate-400">Mobile</p><p className="mt-1 text-sm font-semibold">{student.phone}</p></div><div><p className="text-xs text-slate-400">Campus</p><p className="mt-1 text-sm font-semibold">{student.campus}</p></div><div><p className="text-xs text-slate-400">Assigned tutor</p><p className="mt-1 text-sm font-semibold">Siyabonga Radebe</p></div></div><div className="mt-7 rounded-xl bg-slate-50 p-4"><p className="text-xs font-bold uppercase tracking-wider text-slate-400">Lecturer remark</p><p className="mt-2 text-sm leading-6 text-slate-600">“{student.remarks}”</p></div></div><div className="portal-card"><p className="eyebrow">Academic snapshot</p><h3 className="mt-2 font-display text-2xl">Results this term</h3><div className="mt-5 space-y-5">{[["Engineering Science", 86], ["Mathematics N2", 78], ["Electrical Trade Theory", 82]].map(([name, value]) => <div key={String(name)}><div className="mb-2 flex justify-between text-sm"><span className="font-semibold">{name}</span><span>{value}%</span></div><ProgressBar value={Number(value)} /></div>)}</div></div></div><div className="mt-5 portal-card"><div className="flex items-center justify-between"><div><p className="eyebrow">Activities & assignments</p><h3 className="mt-2 font-display text-2xl">Recent learning activity</h3></div><button onClick={() => navigate("/portal/results")} className="text-sm font-bold text-slate-500">View details <ArrowRight className="ml-1 inline h-4 w-4" /></button></div><div className="mt-5 overflow-x-auto"><table className="data-table"><thead><tr><th>Activity</th><th>Course</th><th>Status</th><th>Score</th></tr></thead><tbody>{data.assignments.map((a) => <tr key={a.id}><td className="font-semibold">{a.title}</td><td>{a.course}</td><td><Pill tone={a.status === "Submitted" ? "green" : "gold"}>{a.status}</Pill></td><td>{a.score ? `${a.score}%` : "Pending"}</td></tr>)}</tbody></table></div></div></main></div></div>;
}

function App() {
  const [location, navigate] = useLocation();
  const [data, setData] = useData();
  const [apply, setApply] = useState(false);

  useEffect(() => {
    if (location === "/") setApply(false);
  }, [location]);

  const go = (path: string) => {
    setApply(false);
    navigate(path);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  let page: ReactNode;
  if (location === "/" || location === "") page = <Landing data={data} setData={setData} onApply={() => { setApply(true); navigate("/portal/apply"); }} />;
  else if (location.startsWith("/portal")) page = <StudentPortal data={data} setData={setData} path={location} navigate={go} />;
  else if (location === "/parent") page = <ParentPortal data={data} navigate={go} />;
  else if (location === "/admin/students") page = <AdminStudents data={data} navigate={go} />;
  else if (location === "/admin/academics") page = <AdminAcademics data={data} setData={setData} navigate={go} />;
  else if (location === "/admin/attendance") page = <AdminAttendance data={data} navigate={go} />;
  else if (location === "/admin/finance") page = <AdminFinance data={data} navigate={go} />;
  else if (location === "/admin") page = <AdminDashboard data={data} setData={setData} navigate={go} />;
  else page = <Landing data={data} setData={setData} onApply={() => go("/portal/apply")} />;

  return (<><Toaster position="bottom-right" richColors />{page}{apply && null}</>);
}

export default App;
