import { useEffect, useMemo, useRef, useState } from "react";
import type { FormEvent, ReactNode } from "react";
import { useLocation } from "wouter";
import {
  ArrowRight, ArrowUpRight, Award, BarChart3, BookOpen, BriefcaseBusiness, Building2, CalendarDays,
  Check, ChevronDown, ChevronLeft, ChevronRight, CircleDollarSign, ClipboardCheck, Clock3,
  Download, ExternalLink, FileText, GraduationCap, Hammer, HeartHandshake, Laptop, BookOpenIcon,
  LayoutDashboard, Loader2, Mail, MapPin, Menu, MessageCircle, MoreHorizontal,
  Phone, Play, Plus, Search, ShieldCheck, Sparkles, Star, Trash2, TrendingUp,
  Upload, UserRound, Users, WalletCards, X, Zap, ShoppingBag
} from "lucide-react";
import { toast, Toaster } from "sonner";
import { MapView } from "./components/Map";
import { Icon, Course, AppData, ApplicationDraft, ApprenticeshipPost, Schedule, Assignment, Student, RegistrationProgramme } from "./lib/types";
import { fee } from "./const";
import { initials } from "./const";
import { registerStudent, removeRegistrationFiles, uploadRegistrationFiles, type StudentRegistration } from "./lib/studentRegistration";
import {
  courses, shortCourses, machineCourses, artisanFields,
  firstClassFields, weldingFields, subNum, monNum, feeRows, academicFields,
  accreditationBodies, occupationalColleges, departmentCatalog, salesItems,
  partners, partnerServices, serviceBorderPalettes, corporateReferences,
  qcto, seedData
} from "./lib/data";

import PaystackPop from '@paystack/inline-js'

// ============================ Static Images =============================== //
import StudentGrad from "/assets/students-in-grad.jpg";
import TertiaryExperience from "/assets/tertiary-experience.jpg";
import ExperienceOne from "/assets/justone.jpeg";
import DayOne from "/assets/datone.jpeg";
import GradOfTwo from "/assets/grad.jpg";
import NSTCLogo from "/assets/MainLogo.jpg";

function loadData(): AppData {
  if (typeof window === "undefined") return seedData;
  const saved = localStorage.getItem("nstc-data");
  if (saved) {
    try {
      const parsed = JSON.parse(saved) as Partial<AppData>;
      return {
        ...seedData,
        ...parsed,
        suggestions: parsed.suggestions ?? [],
        apprenticeships: parsed.apprenticeships ?? seedData.apprenticeships,
        complaints: parsed.complaints ?? [],
        resources: parsed.resources ?? seedData.resources,
        lecturerNotifications: parsed.lecturerNotifications ?? seedData.lecturerNotifications,
        tutors: parsed.tutors ?? seedData.tutors
      };
    } catch { return seedData; }
  }
  localStorage.setItem("nstc-data", JSON.stringify(seedData));
  return seedData;
}

function useData() {
  const [data, setData] = useState<AppData>(loadData);
  useEffect(() => { localStorage.setItem("nstc-data", JSON.stringify(data)); }, [data]);
  return [data, setData] as const;
}

function delay(ms = 650) { return new Promise((resolve) => window.setTimeout(resolve, ms)); }

// Custom hook to handle async actions with loading state
function useAction() {
  const [loading, setLoading] = useState(false);
  const run = async (action: () => void | Promise<void>) => {
    setLoading(true);
    try {
      await delay();
      await action();
    } finally {
      setLoading(false);
    }
  };
  return { loading, run };
}

// Spinner Component
function Spinner({ label = "Working" }: { label?: string }) {
  return (
    <span className="inline-flex items-center gap-2">
      <Loader2 className="h-4 w-4 animate-spin" />
      {label}
    </span>
  );
}

// Button Component
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

// Modal Component
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

// Confirmation Modal Component
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

// ============================= Website Components ======================== //

// Logo Component
function Logo({ light = false }: { light?: boolean }) {
  return (
    <a href="/" className={`flex items-center gap-3 ${light ? "text-white" : "text-slate-950"}`}>
      <img src={NSTCLogo} alt="NSTC Logo" className="logo-mark" />
      <span>
        <span className="block font-display text-2xl leading-none">National Skills</span>
        <span className={`block text-[12px] font-bold uppercase tracking-[.22em] ${light ? "text-white/55" : "text-slate-500"}`}>Technical College</span>
      </span>
    </a>
  );
}

// Custom Pill Component
function Pill({ children, tone = "gold" }: {
  children: ReactNode;
  tone?: "gold" | "green" | "red" | "slate"
}) {
  return (<span className={`pill pill-${tone}`}>{children}</span>);
}

// Custome Section Title Component
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

// Navbar Area Component
function PublicNav({ onApply }: { onApply: () => void }) {
  const [open, setOpen] = useState(false);
  return (
    <header className="public-nav">
      <div className="mission-band" aria-label="NSTC impact pathway">
        <div className="container mission-band__content">
          <p className="mission-band__promise">
            <span>Empower</span><i aria-hidden="true">|</i><span>Employ</span><i aria-hidden="true">|</i><span>Excel</span><i aria-hidden="true">|</i>
          </p>
          <p className="mission-band__pillars">Skills <i aria-hidden="true">|</i> Innovation <i aria-hidden="true">|</i> Impact</p>
          <p className="mission-band__pathway">Train <i aria-hidden="true">→</i> Certify <i aria-hidden="true">→</i> Workplace Experience <i aria-hidden="true">→</i> Employment/Enterprise <i aria-hidden="true">→</i> Impact</p>
        </div>
      </div>
      <div className="container public-nav__main flex h-[78px] items-center justify-between">
        <Logo light />
        <nav className="hidden items-center gap-7 lg:flex">
          <a href="#about">About</a>
          <a href="#programmes">Programmes</a>
          <a href="#skills">Graduate CVs</a>
          <a href="#apprenticeships">Employment</a>
          <a href="#occupational">Occupational</a>
          <a href="#fees">Fees</a>
          <a href="#sales">Market Place</a>
          <a href="#contact">Contact</a>
        </nav>
        <div className="hidden items-center gap-3 sm:flex">
          <a className="nav-portal" href="/portal">Portal login <ArrowRight className="h-4 w-4" /></a>
          <Button onClick={onApply}>Apply now <ArrowRight className="h-4 w-4" /></Button>
        </div>
        <button className="text-white lg:hidden" onClick={() => setOpen(!open)}><Menu /></button>
      </div>
      {open &&
        <div className="mobile-nav lg:hidden">
          <a href="#about" onClick={() => setOpen(false)}>About</a>
          <a href="#programmes" onClick={() => setOpen(false)}>Programmes</a>
          <a href="#skills" onClick={() => setOpen(false)}>Graduate CVs</a>
          <a href="/apprenticeships" onClick={() => setOpen(false)}>Employment</a>
          <a href="#fees" onClick={() => setOpen(false)}>Fees</a>
          <a href="/portal">Student portal</a>
          <Button onClick={onApply}>Apply now</Button>
        </div>
      }
    </header>
  );
}

// Sponsor Panel Component
function SponsorPanel() {

  const messages = [
    { title: "Compliance & financial benefits", body: "Tax exemptions · B-BBEE scorecard integration · WSP / ATR alignment · SDL grants · CSI compliance", background: "/assets/love.jpg", variant: "slide-left" },
    { title: "Direct sponsorship opportunities", body: "Sponsor a student or an AI laptop and connect your contribution to practical community skills.", background: "/assets/support.jpg", variant: "spin-front" },
    { title: "Community upliftment ethos", body: "We rise by lifting others · Sivuka ngokuphakamisa abanye · Ons styg deur ander op te hef", background: "/assets/education.jpg", variant: "slide-right" }
  ];

  const [active, setActive] = useState(0);
  const principles = [
    { label: "Love", icon: HeartHandshake },
    { label: "Support", icon: Users },
    { label: "Education", icon: BookOpen }
  ];

  useEffect(() => {
    const timer = window.setInterval(() => setActive((old) => (old + 1) % messages.length), 5200);
    return () => window.clearInterval(timer);
  }, [messages.length]);

  return (
    <div className="hero-card-wrap">
      <div className="hero-card sponsor-card">
        <div className="flex items-start justify-between">
          <span className="eyebrow text-white/45">Corporate partners</span>
          <span className="rounded-full bg-[#D4AF37] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-black">Sponsor pathways</span>
        </div>
        <div className="sponsor-message-stack" aria-live="polite">
          {messages.map((message, index) => {
            const isActive = index === active;
            return (
              <div
                key={`${message.title}-${index}-${isActive ? "active" : "idle"}`}
                className={`sponsor-message sponsor-message--${message.variant} ${isActive ? "is-active" : "is-hidden"}`}
                style={{
                  backgroundImage: `linear-gradient(180deg, rgba(16, 24, 40, 0.15), rgba(9, 11, 18, 0.72)), url(${message.background})`
                }}
              >
                <p className="text-sm text-[#f7d77e]">National Skills & Technical College</p>
                <h3 className="mt-3 max-w-md font-display text-3xl leading-tight text-white">{message.title}</h3>
                <p className="mt-4 text-sm leading-6 text-white/70">{message.body}</p>
              </div>
            );
          })}
        </div>
        <div className="mt-9 flex gap-2">
          {messages.map((_, i) =>
            <span key={i} className={`h-1.5 flex-1 rounded-full ${i === active ? "bg-[#D4AF37]" : "bg-white/15"}`} />
          )}
        </div>

        <div className="mt-7 border-t border-white/10 pt-5">
          <a href="#contact" className="flex items-center justify-between rounded-xl bg-white/10 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/15">Talk to partnerships <ArrowUpRight className="h-4 w-4" /></a>
        </div>

        <div className="mt-5 space-y-3">
          <div className="sponsor-principles">
            {principles.map(({ label, icon: Icon }) => (
              <div key={label} className="sponsor-principle">
                <span className="sponsor-principle-icon"><Icon className="h-4 w-4" /></span>
                <span>{label}</span>
              </div>
            ))}
          </div>
          <p className="sponsor-verse">Philippians 4:13 — I Can Do All Things Through Christ</p>
        </div>
      </div>
      <div className="hero-stamp">
        <Award className="h-5 w-5" />
        <span>DHET<br /><b>Registered</b></span>
      </div>
    </div>
  );
}

// Partner Service Modal Component
function PartnerServiceModal({ service, onClose }: { service: typeof partnerServices[number]; onClose: () => void }) {

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose]);

  return (
    <div className="service-modal p-6" role="dialog" aria-modal="true" aria-labelledby="service-modal-title">
      <button className="service-modal-backdrop" aria-label="Close service details" onClick={onClose} />
      <section className="service-modal-panel">
        <div className="service-modal-header">
          <div>
            <p className="eyebrow text-[#D4AF37]">{service.kicker}</p>
            <h2 id="service-modal-title" className="mt-3 font-display text-3xl text-white md:text-5xl">{service.title}</h2>
          </div>
          <button className="service-close" onClick={onClose} aria-label="Close service details">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="service-modal-body">
          <p className="max-w-3xl text-lg leading-8 text-white/75">{service.summary}</p>
          <div className="mt-10 grid gap-8 md:grid-cols-2">
            <div>
              <p className="eyebrow text-[#D4AF37]">Who it is for</p>
              <p className="mt-3 text-sm leading-7 text-white/70">{service.who}</p>
            </div>
            <div>
              <p className="eyebrow text-[#D4AF37]">Expected outputs</p>
              <ul className="mt-3 space-y-3 text-sm leading-6 text-white/70">
                {service.deliverables.map((item) =>
                  <li key={item}><Check className="mr-2 inline h-4 w-4 text-[#D4AF37]" />{item}</li>
                )}
              </ul>
            </div>
          </div>
          <div className="service-guardrail mt-10">
            <ShieldCheck className="h-5 w-5 shrink-0 text-[#D4AF37]" />
            <p><strong className="text-white">Responsible-service note.</strong> {service.guardrail}</p>
          </div>
          <a className="btn btn-gold mt-10" href="#contact" onClick={onClose}>Request a consultation <ArrowRight className="h-4 w-4" /></a>
        </div>
      </section>
    </div>
  );
}

// Partner Services Feature Component
function PartnerServicesFeature() {
  const pageSize = 6;
  const [page, setPage] = useState(0);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const totalPages = Math.ceil(partnerServices.length / pageSize);
  const visibleServices = partnerServices.slice(page * pageSize, (page + 1) * pageSize);
  const selected = partnerServices.find((service) => service.id === selectedId) ?? null;
  const close = () => {
    setSelectedId(null);
    if (window.location.hash.startsWith("#partner-service-")) window.history.pushState({}, "", `${window.location.pathname}${window.location.search}`);
  };

  const open = (id: string) => { setSelectedId(id); window.history.pushState({}, "", `#partner-service-${id}`); };

  useEffect(() => {
    const syncFromHash = () => {
      const id = window.location.hash.replace("#partner-service-", "");
      if (id && partnerServices.some((service) => service.id === id)) setSelectedId(id);
    };
    syncFromHash();
    window.addEventListener("popstate", syncFromHash);
    window.addEventListener("hashchange", syncFromHash);
    return () => {
      window.removeEventListener("popstate", syncFromHash);
      window.removeEventListener("hashchange", syncFromHash);
    };
  }, []);

  return (
    <>
      <div className="hero-partner-feature" aria-labelledby="hero-partner-title">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p id="hero-partner-title" className="eyebrow text-[#D4AF37]">Partner with us for services</p>
            <p className="mt-2 text-sm leading-6 text-white/65">Companies · mines · sponsors</p>
          </div>
          <span className="service-page-count">{page + 1} / {totalPages}</span>
        </div>
        <ul className="hero-partner-benefits" aria-label="Partnership services">
          {visibleServices.map((service, index) => {
            const [firstColor, secondColor] = serviceBorderPalettes[index % serviceBorderPalettes.length];
            return <li key={service.id}>
              <button className="partner-service-button" style={{ "--service-color-a": firstColor, "--service-color-b": secondColor } as React.CSSProperties} onClick={() => open(service.id)} aria-haspopup="dialog">
                <span>{service.label}</span>
                <ArrowUpRight className="h-4 w-4" />
              </button>
            </li>;
          })}
        </ul>
        <div className="service-pager">
          <button className="service-page-button" onClick={() => setPage((value) => (value - 1 + totalPages) % totalPages)} aria-label="Previous partner services">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <span>Showing {page * pageSize + 1}–{Math.min((page + 1) * pageSize, partnerServices.length)} of {partnerServices.length} services</span>
          <button className="service-page-button" onClick={() => setPage((value) => (value + 1) % totalPages)} aria-label="Next partner services"><ChevronRight className="h-5 w-5" /></button>
        </div>
      </div>
      {selected && <PartnerServiceModal service={selected} onClose={close} />}
    </>
  );
}

// Hero Section Component
function Hero({ onApply }: { onApply: () => void }) {
  const [showMore, setShowMore] = useState(false);

  return (
    <section className="hero">
      <div className="hero-grid" />
      <PublicNav onApply={onApply} />
      <div className="container relative grid min-h-[660px] items-center gap-10 pb-16 pt-20 lg:grid-cols-[1.05fr_.95fr] mt-12">
        <div className="max-w-2xl">
          <div className="eyebrow text-[#D4AF37]">Future Skills · Skills In Demand · Learn Today Lead Tomorrow</div>
          <h1 className="mt-5 font-display text-4xl leading-[.98] text-white md:text-8l">Fighting Unemployment <span className="gold-text">& Poverty Through Education.</span></h1>
          <div className="mt-7 max-w-xl text-lg leading-8 text-white/65">
            <p>An Occupational Certificate is a nationally recognized qualification developed by the Quality Council for Trades and Occupations.</p>
            <button
              type="button"
              className="mt-4 inline-flex items-center gap-2 border-b border-[#D4AF37]/60 pb-1 text-sm font-bold text-[#D4AF37] transition hover:border-[#D4AF37] hover:text-white"
              onClick={() => setShowMore((value) => !value)}
              aria-expanded={showMore}
              aria-controls="certificate-outcomes"
            >
              {showMore ? "Less" : "More"}
              <ChevronDown className={`h-4 w-4 transition-transform ${showMore ? "rotate-180" : ""}`} />
            </button>
            {showMore && (
              <div id="certificate-outcomes" className="mt-5 border-l-2 border-[#D4AF37] pl-5 text-base leading-7 text-white/70">
                <p className="mb-3 text-sm font-bold uppercase tracking-[.16em] text-white/45">It equips you with</p>
                <ul className="space-y-3">
                  <li><strong className="text-white">Knowledge</strong><span className="text-white/45"> · Theory</span> — concepts and principles for your chosen occupation.</li>
                  <li><strong className="text-white">Practical skills</strong> — hands-on training in a simulated or controlled environment.</li>
                  <li><strong className="text-white">Workplace experience</strong> — real-life training in a workplace setting.</li>
                </ul>
              </div>
            )}
          </div>

          {/* Application handles */}
          <div className="mt-9 flex flex-wrap gap-3">
            <Button onClick={onApply}>Start your application <ArrowRight className="h-4 w-4" /></Button>
            <a className="hero-link" href="#programmes"><Play className="h-4 w-4 fill-current" /> Explore programmes</a>
          </div>

          {/* partners for services */}
          <PartnerServicesFeature />

        </div>
        <SponsorPanel />
      </div>
    </section>
  );
}

// Stats Section Component
function Stats() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [started, setStarted] = useState(false);
  const [values, setValues] = useState([0, 0, 0, 0]);
  const targets = [25500, 100, 30, 4];

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setStarted(true);
        observer.disconnect();
      }
    }, { threshold: 0.35 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    const startedAt = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const progress = Math.min((now - startedAt) / 1200, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValues(targets.map((target) => Math.round(target * eased)));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [started]);

  const suffixes = ["+", "%", "+", ""];
  const labels = [
    "NSTC learners in jobs, mines & municipalities",
    "Employment & mentorship guarantee",
    "Academic & occupational fields",
    "Connected campuses in Gauteng & Mpumalanga"
  ];
  return (
    <section ref={sectionRef} className="stats-strip" aria-label="NSTC impact statistics">
      <div className="container grid gap-8 py-11 sm:grid-cols-2 lg:grid-cols-4">
        {values.map((value, index) => <div key={labels[index]}>
          <p className="stat-number">{value.toLocaleString("en-ZA")}<span>{suffixes[index]}</span></p>
          <p className="stat-label">{labels[index]}</p>
        </div>)}
      </div>
    </section>
  );
}

// Accreditation Bodies Section Component
function AccreditationBodies() {
  const marqueeBodies = [...accreditationBodies, ...accreditationBodies];

  return (
    <section className="accreditation-section section-pad">
      <div className="container">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionTitle
            eyebrow="Accredited by leading bodies"
            title="Accredited with Department of Higher Education & Training."
            body="Our learning pathways are shaped by the quality frameworks that matter most to employers, learners and communities across South Africa."
          />
          <div className="inline-flex items-center gap-2 rounded-full border border-[#d7bf6f] bg-[#f9f1d2] px-4 py-2 text-[11px] font-bold uppercase tracking-[0.18em] text-[#795e0e]">
            <ShieldCheck className="h-4 w-4" />
            Trusted network
          </div>
        </div>

        <div className="accreditation-marquee mt-10">
          <div className="accreditation-track">
            {marqueeBodies.map(({ code, name, logo, description }, index) => (
              <article className="accreditation-card" key={`${code}-${index}`}>
                <div className="accreditation-logo-wrap">
                  <img src={logo} alt={`${name} logo`} className="accreditation-logo" />
                </div>
                <div className="accreditation-card-body">
                  <p className="eyebrow text-[#a27e10]">{code}</p>
                  <h3 className="mt-2 font-display text-xl text-slate-950">{name}</h3>
                  <p className="mt-2 text-xs leading-5 text-slate-600">{description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// Partners Showcase Section Component
function PartnersShowcase() {
  return (
    <section id="partners" className="section-pad bg-white">
      <div className="container">
        <SectionTitle eyebrow="Partners & Stakeholders" title="Our partners in trust" body="" />
        <div className="partner-grid mt-10">
          {partners.map(([name, logo]) =>
            <article className="partner-card" key={name}>
              <div className="partner-logo">
                <img src={logo} alt={`${name} logo`} className="rounded-lg" />
              </div>
            </article>
          )}
        </div>
      </div>
    </section>
  );
}

// About Section Component
function About() {
  return (
    <section id="about" className="section-pad bg-[#f2f5fa]">
      <div className="container grid gap-14 lg:grid-cols-[.9fr_1.1fr] lg:items-center">
        {/* histor card */}
        <div className="about-art">
          <div className="about-art-inner about-image-art" style={{ backgroundImage: `linear-gradient(145deg, rgba(10,10,10,.25), rgba(10,10,10,.72)), url(${DayOne})` }}>
            <span className="eyebrow text-[#D4AF37]">Since day one</span>
            <div className="flex items-end justify-between">
              <span className="font-display text-2xl text-white">We teach skills<br />to change lives.</span>
              <span className="text-right text-xs uppercase tracking-widest text-white/65">Wynberg<br />Johannesburg</span>
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

// Flip Card Component
function FlipCard({ course, image }: { course: Course; image?: string }) {
  return (
    <div className="flip-card group">
      <div className="flip-inner">
        <div className="flip-front" style={{ backgroundImage: `linear-gradient(155deg, rgba(18,18,18,.38), rgba(5,5,6,.88)), url(${image})` }}>
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
            {course.subjects.map((subject, idx) =>
              <li key={idx}><Check className="mr-2 inline h-4 w-4 text-[#a27e10]" />{subject.name}</li>
            ).slice(0, 4)}
          </ul>
          <a href="/#fees" className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-slate-950">View course <ArrowRight className="h-4 w-4" /></a>
        </div>
      </div>
    </div>
  );
}

// Programmes Section Component
function Programmes({ onApply }: { onApply: () => void }) {
  return (
    <section id="programmes" className="section-pad bg-white">
      <div className="container">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionTitle eyebrow="Learn with direction" title="Pathways for every kind." body="From National Certificates to occupational qualifications and short practical programmes, choose the route that fits your ambitions." />
          <Button variant="gold" onClick={onApply}>Find your programme <ArrowRight className="h-4 w-4" /></Button>
        </div>
        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">{courses.slice(0, 8).map((course, index) => <FlipCard key={course.id} course={course} image={course?.image} />)}</div>
        <div className="mt-16 rounded-2xl catalogue-panel bg-[#071a3a] p-7 text-white md:p-10">
          <div className="grid gap-8 lg:grid-cols-[.9fr_1.1fr] lg:items-center">
            {/* catelogue part */}
            <div className="catalogue-intro h-[100%] rounded-xl p-6 md:p-8" style={{ backgroundImage: `linear-gradient(110deg, rgba(10,10,10,.94), rgba(10,10,10,.68)), url(${ExperienceOne})` }}>
              <p className="eyebrow text-[#D4AF37]">Academic catalogue</p>
              <h3 className="mt-3 font-display text-3xl">N Certificates & Diplomas</h3>
              <p className="mt-3 max-w-lg text-sm leading-6 text-white/55">Explore the full catalogue from Engineering N1–N6 and Business N4–N6 to QCTO skills programmes, GCC, health and safety, IT and Matric upgrades.</p>
            </div>

            {/* fields part */}
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

// Skills Section Component
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
    <section id="skills" className="section-pad bg-[#f2f5fa]">
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

// Fees Section Component
function Fees() {
  return (
    <section id="fees" className="section-pad bg-[#071a3a] text-white">
      <div className="container">
        <SectionTitle light eyebrow="Straightforward investment" title="Fee Structure" body="(100% EMPLOYMENT)Pay less for hight quality. Start with a R500 registration fee and choose the learning pathway that matches your goals." />
        <div className="cash-discount-banner discount-promo mt-8" role="status">
          <span className="discount-badge">10%<br />OFF</span>
          <p className="font-display text-xl text-[#f1d36d] sm:text-2xl">10% discount on cash payment this season</p>
        </div>

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
            {/* Engineering Card */}
            <div className="dark-info-card flex-col gap-4 overflow-hidden">
              <div className="flex items-start gap-3">
                <Hammer className="mt-0.5 shrink-0 text-[#D4AF37]" />
                <div className="min-w-0 flex-1">
                  <h4>Engineering Studies N2-N6 Fees</h4>
                  <p className="mt-1">Registration - R500.00 (No Refund). Deposit - R2,000.00 (No Refund). <strong>Complete admission = Reg + Deposit</strong>.</p>
                </div>
              </div>

              <div className="w-full overflow-hidden rounded-xl border border-white/10 bg-black/10">
                <div className="grid grid-cols-[minmax(0,1.4fr)_repeat(5,minmax(0,0.7fr))] gap-1 bg-white/[0.03] p-1.5 text-[9px] font-semibold uppercase tracking-[0.12em] text-white/45">
                  <div className="px-2 py-1.5">Subjects</div>
                  {subNum.map((level) => (
                    <div key={level} className="px-1 py-1.5 text-center">{level}</div>
                  ))}
                </div>

                {feeRows.engineering.map((row) => (
                  <div key={row[0]} className="grid grid-cols-[minmax(0,1.4fr)_repeat(5,minmax(0,0.7fr))] gap-1 border-t border-white/5 p-1.5 text-[10px]">
                    <div className="flex items-center px-2 py-1.5 text-left text-white/75">{row[0]}</div>
                    {row.slice(1).map((cell, index) => (
                      <div key={`${row[0]}-${index}`} className="break-words rounded-md bg-white/[0.025] px-1 py-1.5 text-center leading-tight text-white/80">
                        {cell}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {/* Management Card */}
            <div className="dark-info-card flex-col gap-4 overflow-hidden">
              <div className="flex items-start gap-3">
                <BriefcaseBusiness className="text-[#D4AF37]" />
                <div className="min-w-0 flex-1">
                  <h4>Management & Business Studies N4-N6 Fees</h4>
                  <p className="mt-1">Registration - R500.00 (No Refund). Deposit - R2,000.00 (No Refund). <strong>Complete admission = Reg + Deposit</strong>.</p>
                </div>
              </div>

              <div className="w-full overflow-hidden rounded-xl border border-white/10 bg-black/10">
                <div className="grid grid-cols-[minmax(0,1.4fr)_repeat(5,minmax(0,0.7fr))] gap-1 bg-white/[0.03] p-1.5 text-[9px] font-semibold uppercase tracking-[0.12em] text-white/45">
                  <div className="px-2 py-1.5">Subjects</div>
                  {subNum.map((level) => (
                    <div key={level} className="px-1 py-1.5 text-center">{level}</div>
                  ))}
                </div>
                {feeRows.business.map((row) => (
                  <div key={row[0]} className="grid grid-cols-[minmax(0,1.4fr)_repeat(5,minmax(0,0.7fr))] gap-1 border-t border-white/5 p-1.5 text-[10px]">
                    <div className="flex items-center px-2 py-1.5 text-left text-white/75">{row[0]}</div>
                    {row.slice(1).map((cell, index) => (
                      <div key={`${row[0]}-${index}`} className="break-words rounded-md bg-white/[0.025] px-1 py-1.5 text-center leading-tight text-white/80">
                        {cell}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {/* Occupational Card */}
            <div className="dark-info-card flex-col gap-4 overflow-hidden">
              <div className="flex items-start gap-3">
                <Sparkles className="text-[#D4AF37]" />
                <div className="min-w-0 flex-1">
                  <h4>Occupational Qualifications Fees</h4>
                  <p className="mt-1">Registration - R500.00 (No Refund). Deposit - R2,000.00 (No Refund). <strong>Complete admission = Reg + Deposit</strong>.</p>
                </div>
              </div>

              <div className="w-full overflow-hidden rounded-xl border border-white/10 bg-black/10">
                <div className="grid grid-cols-[minmax(0,1.4fr)_repeat(5,minmax(0,0.7fr))] gap-1 bg-white/[0.03] p-1.5 text-[9px] font-semibold uppercase tracking-[0.12em] text-white/45">
                  <div className="px-2 py-1.5">Period</div>
                  {monNum.map((level) => (
                    <div key={level} className="px-1 py-1.5 text-center">{level}</div>
                  ))}
                </div>
                {feeRows.occupational.map((row) => (
                  <div key={row[0]} className="grid grid-cols-[minmax(0,1.4fr)_repeat(5,minmax(0,0.7fr))] gap-1 border-t border-white/5 p-1.5 text-[10px]">
                    <div className="flex items-center px-2 py-1.5 text-left text-white/75">{row[0]}</div>
                    {row.slice(1).map((cell, index) => (
                      <div key={`${row[0]}-${index}`} className="break-words rounded-md bg-white/[0.025] px-1 py-1.5 text-center leading-tight text-white/80">
                        {cell}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {/* Matric Card */}
            {/* <div className="dark-info-card flex-col gap-4 overflow-hidden">
              <div className="flex items-start gap-3">
                <BookOpenIcon className="text-[#D4AF37]" />
                <div>
                  <h4>Matric Upgrade & Rewrite Fees</h4>
                  <p className="mt-1">Registration - R500.00 (No Refund). Deposit - R2,000.00 (No Refund). <strong>Complete admission = Reg + Deposit</strong>.</p>
                </div>
              </div>

              <div className="w-full overflow-hidden rounded-xl border border-white/10 bg-black/10">
                <div className="grid grid-cols-[minmax(0,1.4fr)_repeat(5,minmax(0,0.7fr))] gap-1 bg-white/[0.03] p-1.5 text-[9px] font-semibold uppercase tracking-[0.12em] text-white/45">
                  <div className="px-2 py-1.5">Subjects</div>
                  <div className="px-1 py-1.5 text-center">Sub-7&6</div>
                  {subNum.map((level) => (
                    <div key={level} className="px-1 py-1.5 text-center">{level}</div>
                  ))}
                </div>
                {feeRows.matric.map((row) => (
                  <div key={row[0]} className="grid grid-cols-[minmax(0,1.4fr)_repeat(5,minmax(0,0.7fr))] gap-1 border-t border-white/5 p-1.5 text-[10px]">
                    <div className="flex items-center px-2 py-1.5 text-left text-white/75">{row[0]}</div>
                    {row.slice(1).map((cell, index) => (
                      <div key={`${row[0]}-${index}`} className="break-words rounded-md bg-white/[0.025] px-1 py-1.5 text-center leading-tight text-white/80">
                        {cell}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div> */}
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-5 border-t border-white/10 pt-8 pl-2 pr-2 md:grid-cols-2">
        {/* Machine Courses */}
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
          {/* First Class Fields */}
          <>
            <p className="eyebrow text-[#D4AF37]">Premium Courses · First Class</p>
            <div className="mt-4 grid grid-cols-2 gap-x-5 gap-y-3">
              {firstClassFields.map(([name, price]) =>
                <div key={name} className="flex items-center justify-between gap-3 border-b border-white/5 pb-2 text-xs">
                  <span className="text-white/60">{name}</span>
                  <strong className="text-[#D4AF37]">{fee(price)}</strong>
                </div>
              )}
            </div>
          </>

          {/* Artisans Fields */}
          <>
            <p className="eyebrow text-[#D4AF37] mt-12">Semi-skilled & artisan fields · 4 weeks</p>
            <div className="mt-4 grid grid-cols-2 gap-x-5 gap-y-3">
              {artisanFields.map(([name, price]) =>
                <div key={name} className="flex items-center justify-between gap-3 border-b border-white/5 pb-2 text-xs">
                  <span className="text-white/60">{name}</span>
                  <strong className="text-[#D4AF37]">{fee(price)}</strong>
                </div>
              )}
            </div>
          </>

          {/* Welding Fields */}
          <>
            <p className="eyebrow text-[#D4AF37] mt-12">Semi-skilled Welding Courses · 4 weeks</p>
            <div className="mt-4 grid grid-cols-2 gap-x-5 gap-y-3">
              {weldingFields.map(([name, price]) =>
                <div key={name} className="flex items-center justify-between gap-3 border-b border-white/5 pb-2 text-xs">
                  <span className="text-white/60">{name}</span>
                  <strong className="text-[#D4AF37]">{fee(price)}</strong>
                </div>
              )}
            </div>
          </>
        </div>
      </div>
    </section>
  );
}

// Occupational Certificates Section Component
function OccupationalCertificates() {
  return (
    <section id="occupational" className="section-pad bg-[#f2f5fa]">
      <div className="container">
        <SectionTitle eyebrow="Occupational certificates" title="Practical routes into the world of work." body="Explore the colleges and SETA-aligned certificates that build opportunity in communities across South Africa." />
        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {occupationalColleges.map(([college, accreditor, programmes]) =>
            <article className="catalog-card" key={college}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="eyebrow text-[#a27e10]">{accreditor}</p>
                  <h3 className="mt-2 font-display text-2xl text-slate-950">{college}</h3>
                </div>
                <span className="catalog-mark">{accreditor.slice(0, 2)}</span>
              </div>
              <ul className="mt-5 space-y-2 text-sm text-slate-600">
                {programmes.map((item) =>
                  <li className="flex gap-2" key={item}><Check className="mt-0.5 h-4 w-4 shrink-0 text-[#a27e10]" />{item}</li>)}</ul>
            </article>
          )}
        </div>
      </div>
    </section>
  );
}

// Departments of Study Section Component
function DepartmentsStudy() {
  return (
    <section id="departments" className="section-pad bg-white">
      <div className="container">
        <SectionTitle eyebrow="Departments of study" title="Courses, subjects and clear next steps." body="Browse the departments that shape our academic, occupational and matric pathways." />
        <div className="mt-10 space-y-5">{
          departmentCatalog.map(([department, coursesList]) =>
            <details className="department-panel" key={department}>
              <summary>{department}<ChevronDown className="h-5 w-5" /></summary>
              <div className="grid gap-5 p-6 md:grid-cols-2 xl:grid-cols-4">
                {coursesList.map(([course, subjects]) =>
                  <div key={course}>
                    <h3 className="font-semibold text-slate-950">{course}</h3>
                    <ul className="mt-3 space-y-2 text-sm text-slate-500">{subjects.map((subject) => <li key={subject}>• {subject}</li>)}</ul>
                  </div>)}
              </div>
            </details>
          )}
        </div>
      </div>
    </section>
  );
}

// Contact Section Component
function Contact() {
  const [sent, setSent] = useState(false);
  const { loading, run } = useAction();

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    run(() => setSent(true));
  };

  return (
    <section id="contact" className="section-pad bg-[#f2f5fa]">
      <div className="container grid gap-12 lg:grid-cols-[.9fr_1.1fr]">
        {/* locations */}
        <div>
          <SectionTitle eyebrow="Start a conversation" title="Come build your next future with us." body="Visit one of our campuses, call the admissions team, or send a question and we will point you in the right direction." />
          <div className="mt-8 space-y-4">
            <div className="contact-line">
              <MapPin />
              <div><strong>Midrand Campus</strong>
                <span>675 Old Pretoria Road</span>
              </div>
            </div>
            <div className="contact-line">
              <MapPin />
              <div>
                <strong>Middelburg Campus</strong>
                <span>22 OR Tambo Street Middleburg, Same Building Police Detective</span>
              </div>
            </div>
            <div className="contact-line">
              <MapPin />
              <div>
                <strong>Sandton Campus</strong>
                <span>Wynberg Johannesburg 729 Prosperitus Building Next to Home Affairs</span>
              </div>
            </div>
            <div className="contact-line">
              <MapPin />
              <div>
                <strong>Burgersfort Campus</strong>
                <span>OR Tambo Street, next to Police Detectives</span>
              </div>
            </div>
            <div className="contact-line">
              <Phone />
              <div>
                <strong>Admissions desk</strong>
                <span>+27 71 203 6198 · Mon–Fri, 08:00–16:30</span>
              </div>
            </div>
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
                <Button type="submit" disabled={loading} className="w-full justify-center mt-12">
                  {loading
                    ? (<Spinner label="Sending message" />)
                    : (<>Send enquiry <ArrowRight className="h-4 w-4" /></>)
                  }
                </Button>
              </form>
            )}
        </div>
      </div>
      <div className="container contact-map-email mt-8">
        <div className="h-72 overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <MapView
            className="h-full w-full"
            initialCenter={{ lat: -25.94, lng: 28.74 }}
            initialZoom={7}
            markers={[
              { id: "midrand", lat: -25.9897, lng: 28.1284, label: "Midrand Campus", sublabel: "675 Old Pretoria Road" },
              { id: "middelburg", lat: -25.7731, lng: 29.4689, label: "Middelburg Campus", sublabel: "22 OR Tambo Street" },
              { id: "sandton", lat: -26.1076, lng: 28.0567, label: "Sandton Campus", sublabel: "Wynberg Johannesburg area" },
              { id: "burgersfort", lat: -24.6667, lng: 30.3333, label: "Burgersfort Campus", sublabel: "OR Tambo Street" },
            ]}
          />
        </div>
        <div className="email-panel rounded-2xl border border-slate-200 bg-white p-5">
          <p className="eyebrow">Email the right desk</p>
          <div className="mt-4 space-y-3">{
            [["Secretary", "support@nationalskills.org.za"], ["Manager", "admin@nationalskills.org.za"], ["Examinations", "exams@nationalskills.org.za"], ["Finance", "accounts@nationaskills.org.za"], ["Certificates", "certificates@nationalskills.org.za"]].map(([label, address]) =>
              <a className="email-row" href={`mailto:${address}`} key={address}>
                <Mail className="h-4 w-4 shrink-0 text-[#a27e10]" />
                <span><strong>{label}</strong>
                  <small>{address}</small>
                </span>
              </a>
            )}
          </div>
        </div>
      </div>
      <div className="container mt-12 grid gap-5 border-t border-slate-200 pt-10 md:grid-cols-3">
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

// Apprenticeships Section Component
function Apprenticeships({ data, setData }: {
  data: AppData;
  setData: React.Dispatch<React.SetStateAction<AppData>>
}) {
  const [selected, setSelected] = useState<ApprenticeshipPost | null>(null);
  const [sent, setSent] = useState(false);

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setData((old) => ({
      ...old,
      suggestions: [...old.suggestions, {
        id: crypto.randomUUID(),
        name: String(f.get("name") || "Applicant"),
        email: String(f.get("email") || ""),
        category: `Apprenticeship application: ${selected?.title || "Open role"}`,
        message: `CV submitted: ${String(f.get("cv") || "No filename")}`,
        date: new Date().toISOString().slice(0, 10)
      }]
    }));

    setSent(true);
  };

  return (
    <section id="apprenticeships" className="section-pad bg-white">
      <div className="container">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionTitle eyebrow="Workplace experience" title="Your next opportunity starts here." body="Browse live internship and apprenticeship opportunities from NSTC industry partners. Submit your CV through our application sub-portal." />
          <Pill tone="green">{data.apprenticeships.length} open opportunities</Pill>
        </div>
        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {data.apprenticeships.map((post) =>
            <article key={post.id} className="rounded-2xl border border-slate-200 bg-[#f2f5fa] p-6 transition hover:-translate-y-1 hover:shadow-lg">
              <div className="flex items-center justify-between gap-3">
                <Pill>{post.type}</Pill>
                <span className="text-xs text-slate-400">Closes {post.closing}</span>
              </div>
              <h3 className="mt-5 font-display text-2xl text-slate-950">{post.title}</h3>
              <p className="mt-2 text-sm font-semibold text-[#8b6b12]">{post.employer}</p>
              <p className="mt-3 text-sm leading-6 text-slate-600">{post.description}</p>
              <p className="mt-4 flex items-center gap-2 text-xs text-slate-500">
                <MapPin className="h-4 w-4 text-[#a27e10]" />{post.location}
              </p>
              <Button className="mt-6 w-full justify-center" onClick={() => { setSelected(post); setSent(false); }}>Apply with CV <ArrowRight className="h-4 w-4" /></Button>
            </article>
          )}
        </div>
      </div>
      {selected &&
        <Modal title={sent ? "Application received" : `Apply: ${selected.title}`} onClose={() => setSelected(null)}>
          {sent
            ?
            (
              <div className="py-8 text-center">
                <Check className="mx-auto h-10 w-10 text-emerald-600" />
                <h3 className="mt-4 font-display text-2xl">CV submitted successfully.</h3>
                <p className="mt-2 text-sm text-slate-600">The partner employer and NSTC placement team can now review your profile.</p>
                <Button className="mt-6" onClick={() => setSelected(null)}>Close</Button>
              </div>
            )
            :
            (
              <form onSubmit={submit} className="mt-5 space-y-4">
                <p className="rounded-xl bg-[#fbf7e8] p-4 text-sm text-slate-600">Applying for <strong className="text-slate-950">{selected.title}</strong> with {selected.employer}.</p>
                <label>Full name
                  <input name="name" className="field" required />
                </label>
                <label>Email address
                  <input name="email" className="field" type="email" required />
                </label>
                <label>Phone number
                  <input name="phone" className="field" required />
                </label>
                <label>Upload CV
                  <input name="cv" className="field" type="file" accept=".pdf,.doc,.docx" required />
                </label>
                <p className="text-xs leading-5 text-slate-400">Prototype note: your CV filename and application details are stored locally; production should connect this to secure file storage.</p>
                <Button type="submit" className="w-full justify-center">Submit application <ArrowRight className="h-4 w-4" /></Button>
              </form>
            )
          }
        </Modal>
      }
    </section>
  );
}

// Suggestion Box Section Component
function SuggestionBox({ data, setData }: {
  data: AppData;
  setData: React.Dispatch<React.SetStateAction<AppData>>
}) {
  const [sent, setSent] = useState(false);

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);

    setData((old) => ({
      ...old,
      suggestions: [...old.suggestions, {
        id: crypto.randomUUID(),
        name: String(f.get("name") || "Anonymous"),
        email: String(f.get("email") || ""),
        category: String(f.get("category") || "General improvement"),
        message: String(f.get("message") || ""),
        date: new Date().toISOString().slice(0, 10)
      }]
    }));

    setSent(true);
  };

  return (
    <section id="suggestions" className="section-pad bg-[#fbf7e8]">
      <div className="container grid gap-10 lg:grid-cols-[.9fr_1.1fr] lg:items-center">
        <SectionTitle eyebrow="Your voice shapes NSTC" title="Leave a suggestion." body="Tell us what would make your learning, campus or support experience stronger. Suggestions are reviewed by the student success team." />
        {sent
          ?
          (
            <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
              <Check className="mx-auto h-10 w-10 text-emerald-600" />
              <h3 className="mt-4 font-display text-3xl text-slate-950">Thank you for sharing.</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">Your suggestion has been added to the student voice register.</p>
              <Button className="mt-6" onClick={() => setSent(false)}>Share another suggestion</Button>
            </div>
          )
          :
          (
            <form onSubmit={submit} className="rounded-2xl bg-white p-7 shadow-[0_20px_60px_rgba(15,23,42,.07)] md:p-9">
              <div className="grid gap-5 sm:grid-cols-2">
                <label>Your name
                  <input name="name" className="field" placeholder="Optional" />
                </label>
                <label>Email address
                  <input name="email" className="field" type="email" placeholder="Optional" />
                </label>
              </div>
              <label className="mt-5 block">Suggestion type
                <select name="category" className="field">
                  <option>General improvement</option>
                  <option>Teaching & learning</option>
                  <option>Campus facilities</option>
                  <option>Student support</option>
                  <option>Anonymous feedback</option>
                </select>
              </label>
              <label className="mt-5 block">Your suggestion
                <textarea name="message" required className="field min-h-[130px] py-3" placeholder="What should NSTC know?" />
              </label>
              <Button type="submit" className="mt-5">Submit suggestion <ArrowRight className="h-4 w-4" /></Button>
            </form>
          )
        }
      </div>
    </section>
  );
}

// Apprenticeship Portal Component
function ApprenticeshipPortal({ data, setData, onApply }: {
  data: AppData;
  setData: React.Dispatch<React.SetStateAction<AppData>>;
  onApply: () => void
}) {
  return (
    <div className="public-page">
      <div className="bg-[#071a3a] pb-14">
        <PublicNav onApply={onApply} />
        <div className="container pt-36">
          <SectionTitle light eyebrow="Apprenticeship & internship placement" title="Step into the workplace." body="Find a live opportunity, submit your CV securely through this placement sub-portal, and let NSTC connect your practical training with industry." />
        </div>
      </div>
      <Apprenticeships data={data} setData={setData} />
      <Footer />
    </div>
  );
}

// Sales Portal Component
function SalesPortal() {
  return (
    <section id="sales" className="section-pad bg-[#f2f5fa]">
      <div className="container">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <SectionTitle eyebrow="NSTC sales portal" title="Tools for the next chapter." body="Order laptops, textbooks, drawing boards and study guides from the college supply desk." />
          <div className="flex flex-wrap gap-3">
            <a className="btn btn-dark" href="tel:0712036198"><Phone className="h-4 w-4" /> 071 203 6198</a>
            <a className="btn btn-gold" href="https://wa.me/27825196140"><MessageCircle className="h-4 w-4" /> WhatsApp order</a>
          </div>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {salesItems.map(([name, body, price, image]) =>
            <article className="sale-card sale-card--image" key={name} style={{ backgroundImage: `linear-gradient(145deg, rgba(9,11,16,.72), rgba(9,11,16,.9)), url(${image})` }}>
              <div className="sale-icon"><ShoppingBag className="h-5 w-5" /></div>
              <h3 className="mt-6 font-display text-2xl text-white">{name}</h3>
              <p className="mt-2 text-sm leading-6 text-white/70">{body}</p>
              <p className="mt-5 text-sm font-bold text-[#f2cf63]">{price}</p>
              <a className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-white" style={{ color: "#ccc" }} href="tel:0712036198">Place an order <ArrowRight className="h-4 w-4" /></a>
            </article>
          )}
        </div>
      </div>
    </section>
  );
}

// Footer
function Footer() {
  return (
    <footer className="bg-[#071a3a] py-12 text-white">
      <div className="container grid gap-10 lg:grid-cols-[1fr_1fr_1fr]">
        <div>
          <Logo light />
          <p className="mt-5 max-w-sm text-sm leading-6 text-white/45">We Teach Skills to Change Lives. Your Future, Is Our Concern.</p>
        </div>
        <div>
          <p className="eyebrow text-[#D4AF37]">Bank details</p>
          <div className="mt-4 space-y-2 text-sm text-white/60">
            <p>First National Bank · Business Account</p>
            <p>Account number: <strong className="text-white">62447593436</strong></p>
            <p>Branch code: <strong className="text-white">250655</strong></p>
            <p>Reference: Initials & Surname</p>
          </div>
        </div>
        <div>
          <p className="eyebrow text-[#D4AF37]">Admission requirements</p>
          <ul className="mt-4 space-y-2 text-sm text-white/60">
            <li>Copies of relevant qualification</li>
            <li>Copy of ID, passport or asylum permit</li>
            <li>Completed registration form</li>
            <li>Payment of deposit</li>
          </ul>
        </div>
      </div>
      <div className="container mt-10 grid gap-8 border-t border-white/10 pt-8 lg:grid-cols-[1.1fr_.9fr]">
        <div>
          <p className="eyebrow text-[#D4AF37]">Corporate-services references</p>
          <div className="footer-reference-grid mt-4">
            {corporateReferences.map(([label, url]) =>
              <a href={url} target="_blank" rel="noreferrer" key={label}>{label} <ExternalLink className="inline h-3 w-3" /></a>
            )}
          </div>
        </div>
        <div className="lg:text-right">
          <p className="eyebrow text-[#D4AF37]">Technology partner</p>
          <p className="mt-3 text-sm text-white/60">Powered by: <a className="font-bold text-white underline decoration-[#D4AF37] underline-offset-4" href="https://indabuko-global.vercel.app" target="_blank" rel="noreferrer">Indabuko Tech Crafts</a></p>
          <p className="mt-2 text-sm text-white/60">Call <a className="text-white" href="tel:+26876957019">+27 074 503 2009 / +268 7695 7019</a></p></div>
      </div>
      <div className="container mt-8 flex flex-col justify-between gap-3 border-t border-white/10 pt-6 text-xs text-white/30 md:flex-row">
        <span>© 2026 National Skills & Technical College · Accredited learning pathways across South Africa</span>
        <span>Bank transfer: R500.00 registration + R2,000.00 non-refundable deposit</span>
      </div>
    </footer>
  );
}

// Scroll Image Band Component
function ScrollImageBand({ image, eyebrow, title }: {
  image: string;
  eyebrow: string;
  title: string
}) {
  return (
    <section className="image-band" style={{ backgroundImage: `linear-gradient(90deg, rgba(10,10,10,.78), rgba(10,10,10,.26)), url(${image})` }} aria-label={title}>
      <div className="container image-band-content">
        <p className="eyebrow text-[#D4AF37]">{eyebrow}</p>
        <h2 className="mt-3 max-w-xl font-display text-3xl text-white md:text-5xl">{title}</h2>
      </div>
    </section>
  );
}

// Landing Page Component
function Landing({ data, setData, onApply }: {
  data: AppData;
  setData: React.Dispatch<React.SetStateAction<AppData>>;
  onApply: () => void
}) {
  return (
    <div className="public-page">
      <Hero onApply={onApply} />
      <Stats />
      <AccreditationBodies />
      <PartnersShowcase />
      <About />
      <Programmes onApply={onApply} />
      <ScrollImageBand image={StudentGrad} eyebrow="Talent on demand" title="Learning that moves with the world of work." />
      <Skills data={data} setData={setData} />
      <Apprenticeships data={data} setData={setData} />
      <ScrollImageBand image={GradOfTwo} eyebrow="Workplace experience" title="Confidence built in the workshop, carried into the workplace." />
      <Fees />
      <OccupationalCertificates />
      <DepartmentsStudy />
      <section className="quote-band">
        <div className="container flex flex-col gap-7 md:flex-row md:items-center md:justify-between">
          <div>
            <Star className="h-7 w-7 text-[#D4AF37]" />
            <p className="mt-4 max-w-3xl font-display text-3xl leading-tight text-white md:text-4xl">“Thanks to NSTC and Department of Higher Education. I obtained my Diploma in Public Management, it was not an easy journey, repeated some modules twice. I was promoted in the at the manicipality to a good position and  salary.”</p>
            <p className="mt-4 text-sm text-white/45">— Pillay Dilisha, Public Management graduate</p>
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
      <ScrollImageBand image={TertiaryExperience} eyebrow="Your voice matters" title="A better learning experience starts with a conversation." />
      <SuggestionBox data={data} setData={setData} />
      <SalesPortal />
      <Contact />
      <Footer />
    </div>
  );
}

// =================== Student Portal Components =================== //

// Student Authentication Component
function StudentAuth({ onAuthenticated }: { onAuthenticated: () => void }) {
  const [mode, setMode] = useState<"login" | "forgot" | "reset">("login");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    if (mode === "login") {
      const email = String(f.get("email") || "");
      const number = String(f.get("studentNo") || "");
      const password = String(f.get("password") || "");
      if (email === "thabo.mokoena@example.com" && number === "NSTC-26-0014" && password === (localStorage.getItem("nstc-password") || "nstc2026")) {
        localStorage.setItem("nstc-portal-session", "active");
        onAuthenticated();
      } else setError("Invalid credentials. Use correct student details or reset your password.");
    } else if (mode === "forgot") {
      setMessage("If the account exists, request a reset link.");
      setMode("reset");
    } else {
      const next = String(f.get("newPassword") || "");
      if (next.length < 6) setError("Use at least 6 characters.");
      else {
        localStorage.setItem("nstc-password", next);
        setMessage("Password updated. You can now sign in.");
        setMode("login");
      }
    }
  };

  return (
    <div className="registration-page">
      <div className="registration-top">
        <Logo light />
        <a href="/" className="text-sm font-semibold text-white/60">Back to website</a>
      </div>
      <div className="registration-card max-w-[520px]">
        <p className="eyebrow">Secure student access</p>
        <h1 className="mt-2 font-display text-4xl text-slate-950">
          {mode === "login" ? "Welcome back." : mode === "forgot" ? "Recover your access." : "Set a new password."}
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-500">
          {mode === "login"
            ? "Sign in with your NSTC learner details to view your academic workspace."
            : mode === "forgot"
              ? "Enter your student email and we will guide you through a password reset."
              : "Choose a new password for your student portal account."
          }
        </p>
        {message && <p className="mt-5 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-700">{message}</p>}
        {error && <p className="mt-5 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        <form onSubmit={submit} className="mt-7 space-y-5">
          {mode !== "reset" &&
            <>
              <label>Email address<input name="email" className="field" type="email" required placeholder="student@email.com" /></label>
              <label>Student number<input name="studentNo" className="field" required placeholder="NSTC-26-0014" /></label>
            </>
          }
          {mode === "login" && <label>Password<input name="password" className="field" type="password" required placeholder="Your password" /></label>}
          {mode === "reset" && <label>New password<input name="newPassword" className="field" type="password" required placeholder="At least 6 characters" /></label>}
          <Button type="submit" className="w-full justify-center mt-8">{mode === "login" ? "Sign in to student portal" : mode === "forgot" ? "Send reset instructions" : "Save new password"} <ArrowRight className="h-4 w-4" /></Button>
        </form>
        <div className="mt-6 flex flex-wrap justify-between gap-3 text-sm font-semibold text-slate-500">
          {mode === "login"
            ? <button onClick={() => { setMode("forgot"); setError(""); }}>Forgot password?</button>
            : <button onClick={() => { setMode("login"); setError(""); }}>Back to sign in</button>
          }
          <a href="/parent">Family / next-of-kin access</a>
        </div>
      </div>
    </div>
  );
}

// Student Support Component
function StudentSupport({ data, setData }: {
  data: AppData;
  setData: React.Dispatch<React.SetStateAction<AppData>>
}) {
  const [sent, setSent] = useState(false);
  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);

    const evidenceFile = f.get("evidence");
    setData((old) => ({
      ...old,
      complaints: [...old.complaints, {
        id: crypto.randomUUID(),
        subject: String(f.get("subject") || "Support request"),
        category: String(f.get("category") || "Query"),
        message: String(f.get("message") || ""),
        evidence: evidenceFile instanceof File && evidenceFile.name ? evidenceFile.name : "",
        status: "Open",
        date: new Date().toISOString().slice(0, 10)
      }]
    }));

    setSent(true);
  };
  return (
    <>
      <PageHeading eyebrow="Student support" title="Complaints & queries" body="Ask for help, report a concern or follow up on an unresolved student matter." />
      {sent
        ?
        (
          <div className="portal-card text-center">
            <Check className="mx-auto h-10 w-10 text-emerald-600" />
            <h3 className="mt-4 font-display text-2xl">Your support request is open.</h3>
            <p className="mt-2 text-sm text-slate-600">Student success will respond through your registered contact details.</p>
            <Button className="mt-6" onClick={() => setSent(false)}>Create another request</Button>
          </div>
        )
        :
        (
          <div className="portal-card max-w-2xl">
            <form onSubmit={submit} className="space-y-5">
              <label>Subject
                <input name="subject" className="field" required placeholder="What do you need help with?" />
              </label>
              <label>Request type
                <select name="category" className="field">
                  <option>Query</option>
                  <option>Complaint</option>
                  <option>Academic support</option>
                  <option>Finance support</option>
                  <option>Technical support</option>
                </select>
              </label>
              <label>Details
                <textarea name="message" className="field min-h-[150px] py-3" required placeholder="Tell us what happened or what you need." />
              </label>
              <label>Evidence document or image
                <input name="evidence" className="field" type="file" accept=".pdf,.png,.jpg,.jpeg,.doc,.docx" />
                <span className="mt-2 block text-xs font-normal text-slate-400">Attach a screenshot, letter or other supporting evidence.</span>
              </label>
              <Button type="submit">Submit to student success <ArrowRight className="h-4 w-4" /></Button>
            </form>
          </div>
        )
      }
      <div className="mt-6 portal-card">
        <p className="eyebrow">Your request history</p>
        <div className="mt-4 space-y-3">
          {data.complaints.length ? data.complaints.map((c) =>
            <div key={c.id} className="list-row"><div>
              <p className="font-semibold text-slate-950">{c.subject}</p>
              <p className="mt-1 text-xs text-slate-500">{c.category} · {c.date}{c.evidence ? ` · Evidence: ${c.evidence}` : ""}</p>
            </div>
              <Pill tone={c.status === "Open" ? "gold" : "green"}>{c.status}</Pill>
            </div>
          ) :
            <p className="mt-3 text-sm text-slate-500">No support requests yet.</p>
          }
        </div>
      </div>
    </>
  );
}

// Student Settings Component
function StudentSettings({ onSignOut }: { onSignOut: () => void }) {
  const [saved, setSaved] = useState(false);

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const next = String(f.get("newPassword") || "");
    const confirm = String(f.get("confirmPassword") || "");
    if (next !== confirm) {
      toast.error("New passwords do not match.");
      return;
    }

    if (next.length < 6) {
      toast.error("Use at least 6 characters.");
      return;
    }

    localStorage.setItem("nstc-password", next);
    setSaved(true);
  };

  return (
    <>
      <PageHeading eyebrow="Account settings" title="Keep your account secure" body="Update your student portal password and manage your current session." />
      <div className="grid gap-5 lg:grid-cols-[1fr_.8fr]">
        <div className="portal-card">
          <p className="eyebrow">Change password</p>
          {saved && <p className="mt-4 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-700">Password updated successfully.</p>}
          <form onSubmit={submit} className="mt-5 max-w-md space-y-5">
            <label>Current password
              <input name="currentPassword" className="field" type="password" required />
            </label>
            <label>New password
              <input name="newPassword" className="field" type="password" required minLength={6} />
            </label>
            <label>Confirm new password
              <input name="confirmPassword" className="field" type="password" required minLength={6} />
            </label>
            <Button type="submit">Update password <Check className="h-4 w-4" /></Button>
          </form>
        </div>
        <div className="portal-card bg-[#111] text-white">
          <p className="eyebrow text-[#D4AF37]">Session</p>
          <h3 className="mt-3 font-display text-2xl">Thabo Mokoena</h3>
          <div className="mt-5 grid gap-4 text-sm">
            <div><p className="text-xs uppercase tracking-wider text-white/35">Last login</p><p className="mt-1 text-white">08 June 2026 · 08:42</p></div>
            <div><p className="text-xs uppercase tracking-wider text-white/35">User email</p><p className="mt-1 text-white">thabo.mokoena@example.com</p></div>
            <div><p className="text-xs uppercase tracking-wider text-white/35">Current location</p><p className="mt-1 text-white">Wynberg Johannesburg, South Africa</p></div>
            <div><p className="text-xs uppercase tracking-wider text-white/35">Status</p><p className="mt-1 text-[#D4AF37]">Active session</p></div>
          </div>
          <Button variant="light" className="mt-6" onClick={onSignOut}>Sign out</Button>
        </div>
      </div>
    </>
  );
}

// Portal Shell Component
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
      { label: "Finances", icon: WalletCards, path: "/portal/finances" },
      { label: "Complaints & queries", icon: MessageCircle, path: "/portal/support" },
      { label: "Account settings", icon: ShieldCheck, path: "/portal/settings" }
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

// Metric Card Component
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

// Progress Bar Component
function ProgressBar({ value, color = "gold" }: { value: number; color?: string }) {
  return (
    <div className="h-2 overflow-hidden rounded-full bg-slate-100">
      <div className={`h-full rounded-full ${color === "green" ? "bg-emerald-500" : "bg-[#D4AF37]"}`} style={{ width: `${value}%` }} />
    </div>
  );
}

// Student Overview Component
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
          <div className="mt-4 flex items-center gap-3"><div className="avatar-large">{data.tutors[0]?.initials || "SR"}</div><div><h3 className="font-display text-2xl">{data.tutors[0]?.name || "Siyabonga Radebe"}</h3><p className="mt-1 text-xs text-white/50">Assigned tutor · Engineering faculty</p></div></div>
          <div className="mt-5"><p className="text-xs uppercase tracking-wider text-white/35">Courses & subjects</p><div className="mt-2 flex flex-wrap gap-2">{(data.tutors[0]?.courses || []).map((course) => <span key={course} className="rounded-full bg-white/10 px-2.5 py-1 text-[11px] text-white/70">{course}</span>)}</div></div>
          <div className="mt-6 flex gap-2"><a href="https://wa.me/27101234567" className="btn btn-gold"><MessageCircle className="h-4 w-4" /> WhatsApp</a><a href={`mailto:${data.tutors[0]?.email || "tutor@nstc.example"}`} className="btn btn-dark border border-white/15 bg-white/10 text-white hover:bg-white/15"><Mail className="h-4 w-4" /> Email</a></div>
        </div>
      </div>
      <div className="mt-5 portal-card">
        <div className="flex items-center justify-between"><div><p className="eyebrow">Announcements</p><h3 className="mt-2 font-display text-2xl text-slate-950">Stay in the loop</h3></div><span className="metric-icon"><MessageCircle className="h-5 w-5" /></span></div>
        <div className="mt-4 grid gap-3 md:grid-cols-3">{data.announcements.map((announcement) => <div key={announcement.id} className="rounded-xl bg-slate-50 p-4"><p className="text-xs font-semibold text-slate-400">{announcement.date} · {announcement.audience}</p><p className="mt-2 text-sm font-semibold text-slate-950">{announcement.title}</p><p className="mt-2 text-xs leading-5 text-slate-500">{announcement.body}</p></div>)}</div>
      </div>
    </>
  );
}

// Page Heading Component
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

// Calendar Drawer Component
function CalendarDrawer({ schedules, assignments, onClose }: {
  schedules: Schedule[];
  assignments: Assignment[];
  onClose: () => void
}) {
  const [view, setView] = useState<"month" | "week">("month");
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);
  const days = Array.from({ length: 30 }, (_, index) => index + 1);
  const events = [
    ...schedules.map((item) => ({ day: Number(item.date.slice(-2)), title: item.title, meta: `${item.time} · ${item.kind}`, tone: item.kind === "Exam" ? "exam" : "class" })),
    ...assignments.map((item) => ({ day: Number(item.due.slice(-2)), title: item.title, meta: "Assignment due", tone: "assignment" }))
  ];
  return (
    <div className="drawer-backdrop" onMouseDown={onClose}>
      <aside className="calendar-drawer" onMouseDown={(event) => event.stopPropagation()}>
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-5">
          <div><p className="eyebrow">Academic calendar</p><h2 className="mt-2 font-display text-3xl text-slate-950">June 2026</h2><p className="mt-1 text-sm text-slate-500">Classes, assignments and examinations in one view.</p></div>
          <button className="icon-btn" onClick={onClose} aria-label="Close calendar"><X /></button>
        </div>
        <div className="mt-5 flex items-center justify-between"><div className="flex gap-2"><button className={`filter-chip ${view === "month" ? "active" : ""}`} onClick={() => setView("month")}>Month</button><button className={`filter-chip ${view === "week" ? "active" : ""}`} onClick={() => setView("week")}>Week</button></div><button className="icon-btn" onClick={() => toast.info("Calendar navigation is ready for the next teaching cycle.")}><ChevronRight /></button></div>
        {view === "month" ? <div className="calendar-grid mt-5"><div className="calendar-weekdays">{["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => <span key={day}>{day}</span>)}</div><div className="calendar-days">{days.map((day) => { const dayEvents = events.filter((event) => event.day === day); return <div className={`calendar-day ${day === 8 ? "today" : ""}`} key={day}><span className="calendar-day-number">{day}</span>{dayEvents.slice(0, 2).map((event) => <div className={`calendar-event ${event.tone}`} key={`${day}-${event.title}`} title={`${event.title} · ${event.meta}`}>{event.title}</div>)}</div>; })}</div></div> : <div className="mt-5 space-y-3"><p className="text-xs font-bold uppercase tracking-wider text-slate-400">08–14 June 2026</p>{[...schedules, ...assignments.map((a) => ({ id: a.id, title: a.title, kind: "Assignment", date: a.due, time: "Due by 23:59", location: "Online submission" }))].map((item) => <div key={item.id} className="schedule-row rounded-xl border border-slate-200 p-3"><div className="date-tile"><strong>{new Date(item.date).getDate()}</strong><span>{new Date(item.date).toLocaleDateString("en", { month: "short" })}</span></div><div><p className="text-sm font-semibold text-slate-950">{item.title}</p><p className="mt-1 text-xs text-slate-500">{item.time} · {item.location}</p></div></div>)}</div>}
        <div className="mt-6 border-t border-slate-200 pt-5"><p className="eyebrow">Legend</p><div className="mt-3 flex flex-wrap gap-3 text-xs text-slate-500"><span><i className="legend-dot class" /> Class</span><span><i className="legend-dot assignment" /> Assignment</span><span><i className="legend-dot exam" /> Exam</span></div></div>
      </aside>
    </div>
  );
}

// Student Learning Component
function StudentLearning({ data, onNavigate }: { data: AppData; onNavigate: (path: string) => void }) {
  const [calendarOpen, setCalendarOpen] = useState(false);
  return (
    <>
      <PageHeading eyebrow="My learning" title="Your learning hub" body="Everything you need for your current pathway, in one place."
        actions={<Button variant="dark" onClick={() => toast.success("Learning resources prepared for download.")}><Download className="h-4 w-4" /> Download resource pack</Button>}
      />
      <div className="grid gap-5 lg:grid-cols-[1.2fr_.8fr]">
        <div className="portal-card"><p className="eyebrow">Enrolled programme</p><h3 className="mt-2 font-display text-3xl text-slate-950">Electrical Engineering N1–N6</h3><p className="mt-2 text-sm text-slate-500">Trimester 2 · Hybrid · Tutor: Siyabonga Radebe</p><div className="mt-8 space-y-5">{["Engineering Science", "Mathematics N2", "Electrical Trade Theory"].map((subject, i) => <div key={subject}><div className="mb-2 flex justify-between text-sm"><span className="font-semibold text-slate-800">{subject}</span><span className="text-slate-400">{[82, 74, 61][i]}%</span></div><ProgressBar value={[82, 74, 61][i]} /></div>)}</div></div>
        <div className="portal-card"><p className="eyebrow">Learning resources</p><div className="mt-4 space-y-3">{data.resources.filter((resource) => resource.published).map((resource) => <button key={resource.id} className="resource-row" onClick={() => toast.success("Demo download started.")}><div className="file-icon"><FileText /></div><span>{resource.title} · {resource.fileType}</span><Download className="ml-auto h-4 w-4 text-slate-400" /></button>)}</div></div>
      </div>
      <div className="mt-5 portal-card">
        <div className="flex items-center justify-between">
          <div>
            <p className="eyebrow">Upcoming timetable</p>
            <h3 className="mt-2 font-display text-2xl text-slate-950">Classes and assessments</h3>
          </div>
          <Button variant="light" onClick={() => setCalendarOpen(true)}>Open calendar <CalendarDays className="h-4 w-4" /></Button>
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
              {data.schedules.map((r) =>
                <tr key={r.id}>
                  <td className="font-semibold">{r.title}</td>
                  <td><Pill tone={r.kind === "Exam" ? "red" : "slate"}>{r.kind}</Pill></td>
                  <td>{r.date}</td>
                  <td>{r.time}</td>
                  <td>{r.location}</td>
                </tr>)}
            </tbody>
          </table>
        </div>
      </div>
      {calendarOpen && <CalendarDrawer schedules={data.schedules} assignments={data.assignments} onClose={() => setCalendarOpen(false)} />}
    </>
  );
}

// Student Assignments Component
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

// Student Results Component
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
          <div className="mt-6 flex items-end gap-2">{[4, 5, 5, 4, 5, 5, 3, 5, 5, 4, 5, 5, 5, 5].map((subjectsAttended, i) =>
            <div className="flex flex-1 flex-col items-center gap-2" key={i}>
              <div className="w-full rounded-t-md bg-[#D4AF37]" style={{ height: `${Math.max(24, subjectsAttended * 18)}px`, opacity: subjectsAttended < 4 ? .45 : 1 }} title={`${subjectsAttended} subjects attended`} />
              <span className="text-[9px] text-slate-400">{i + 1}</span>
            </div>
          )}
          </div>
          <p className="mt-3 text-xs text-slate-500">Subjects attended per day · 5 scheduled subjects maximum</p>
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

// Student Finances Component
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

// Student Registration Component
function Registration({ onComplete }: {
  onComplete: (application?: ApplicationDraft) => void | Promise<void>
}) {
  const [step, setStep] = useState(1);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [registration, setRegistration] = useState<StudentRegistration | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState("");
  const [subjectLevels, setSubjectLevels] = useState<Record<string, string>>({});
  const [programmes, setProgrammes] = useState<RegistrationProgramme[]>([]);
  const [deposit, setDeposit] = useState(2000);
  const [paying, setPaying] = useState(false);
  const [applicationTraceId] = useState(() => crypto.randomUUID());

  const categories = [
    "Main Courses",
    "Short Courses",
    "Machine & Licence",
    "Artisan Fields",
    "Premium Courses",
    "Welding Fields"
  ] as const;

  const getCourseOptions = (category: typeof categories[number]) => {
    switch (category) {
      case "Main Courses": return courses.map((c) => c.name);
      case "Short Courses": return shortCourses.map(([name]) => name);
      case "Machine & Licence": return machineCourses.map(([name]) => name);
      case "Artisan Fields": return artisanFields.map(([name]) => name);
      case "Premium Courses": return firstClassFields.map(([name]) => name);
      case "Welding Fields": return weldingFields.map(([name]) => name);
      default: return [];
    }
  };

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    category: "Main Courses" as typeof categories[number],
    field: "Main Courses",
    course: "",
    level: "N1",
    period: "Trimester 2",
    kinName: "",
    kinRelationship: "",
    kinEmail: "",
    kinPhone: ""
  });

  const { loading, run } = useAction();
  const isMainCourse = form.category === "Main Courses";
  const selectedCourse = isMainCourse ? courses.find((c) => c.name === form.course) : undefined;
  const selectedSubjects = selectedCourse?.subjects ?? [];

  // Keep course in sync when category changes
  useEffect(() => {
    const options = getCourseOptions(form.category);
    if (options.length > 0 && !options.includes(form.course)) {
      setForm(prev => ({ ...prev, course: options[0] }));
      setSubjectLevels({});
    }
  }, [form.category]);

  const currentProgramme = (): RegistrationProgramme => ({
    course: form.course,
    category: form.category,
    field: form.field,
    level: form.level,
    period: form.period,
    subjects: Object.entries(subjectLevels).map(([name, level]) => ({ name, level })),
  });

  const update = (key: string, value: string) => {
    setForm(prev => {
      const next = { ...prev, [key]: value };
      if (key === "category") {
        next.field = value;
        next.course = getCourseOptions(value as any)[0] || "";
        setSubjectLevels({});
      }
      if (key === "course") setSubjectLevels({});
      return next;
    });
  };

  const addProgramme = () => {
    const programme = currentProgramme();

    if (!programme.course) {
      setError("Please select a programme first.");
      return;
    }

    const alreadyExists = programmes.some(
      p => p.course === programme.course && p.category === programme.category
    );

    if (alreadyExists) {
      setError("This programme has already been added.");
      return;
    }

    // For Main Courses we recommend at least one subject, but we don't force it
    setProgrammes(prev => [...prev, programme]);
    setError("");

    // Reset editor for next programme
    setSubjectLevels({});
  };

  const removeProgramme = (index: number) => {
    setProgrammes(prev => prev.filter((_, i) => i !== index));
  };

  const next = async () => {
    setError("");

    // Step 1 validation
    if (step === 1) {
      if (!form.name.trim() || !form.email.trim() || !form.phone.trim() || !photoFile ||
        !form.kinName.trim() || !form.kinRelationship.trim() || !form.kinEmail.trim() || !form.kinPhone.trim()) {
        setError("Please complete all personal details, ID document and next-of-kin information.");
        return;
      }
      if (!/^\S+@\S+\.\S+$/.test(form.email) || !/^\S+@\S+\.\S+$/.test(form.kinEmail)) {
        setError("Please enter valid email addresses.");
        return;
      }
      setStep(2);
      return;
    }

    // Step 2 validation
    if (step === 2) {
      if (programmes.length === 0) {
        setError("Please add at least one programme before continuing.");
        return;
      }
      setStep(3);
      return;
    }

    // Step 3 → go to payment
    if (step === 3) {
      setStep(4);
      return;
    }
  };

  // ========== PAYSTACK PAYMENT ==========
  const handlePayment = async () => {
    setError("");
    setPaying(true);

    const registrationFee = 500;
    const totalAmount = registrationFee + Number(deposit);

    if (isNaN(totalAmount) || totalAmount < 500) {
      setError("Please enter a valid deposit amount.");
      setPaying(false);
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/payment/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email,
          amount: totalAmount, // Total in Rands
          metadata: {
            applicationTraceId,
            studentName: form.name,
            registrationFee,
            deposit: Number(deposit),
            programmes: programmes.map(p => p.course).join(", ")
          }
        })
      });

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.error || "Could not initialize payment");
      }

      const popup = new PaystackPop();
      popup.resumeTransaction(data.access_code, {
        onSuccess: async (transaction) => {
          try {
            await run(async () => {
              const { photo: uploadedPhoto } = await uploadRegistrationFiles(
                { photo: photoFile ?? undefined },
                applicationTraceId
              );

              const created = await registerStudent({
                ...form,
                programmes,
                applicationTraceId,
                photo: uploadedPhoto,
                paymentReference: transaction.reference,
                amountPaid: totalAmount,
                registrationFee: 500,
                deposit: Number(deposit),
              });

              setRegistration(created);
              setDone(true);
            });
          } catch (err: any) {
            setError(
              err.message ||
              `Payment succeeded but registration failed. Please contact support with reference: ${transaction.reference}`
            );
          } finally {
            setPaying(false);
          }
        },
        onCancel: () => {
          setPaying(false);
          setError("Payment was cancelled. You can try again.");
        }
      });
    } catch (err: any) {
      setPaying(false);
      setError(err.message || "Payment could not be started. Please try again.");
    }
  };

  // ========== SUCCESS SCREEN ==========
  if (done) {
    return (
      <div className="registration-card text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
          <Check className="h-8 w-8" />
        </div>
        <p className="mt-6 eyebrow">Application complete</p>
        <h2 className="mt-2 font-display text-4xl text-slate-950">Welcome to NSTC</h2>
        <p className="mt-4 max-w-lg mx-auto text-sm leading-6 text-slate-600">
          Your provisional student number is <strong>{registration?.studentNumber}</strong>.
          Admissions will verify your documents and confirm your orientation schedule.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button onClick={() => onComplete(registration as any)}>
            Open student dashboard <ArrowRight className="h-4 w-4" />
          </Button>
          <a className="btn btn-light" href="/">Back to website</a>
        </div>
      </div>
    );
  }

  return (
    <div className="registration-card">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="eyebrow">Application journey</p>
          <h1 className="mt-2 font-display text-4xl text-slate-950">Join the NSTC community</h1>
        </div>
        <span className="text-sm font-semibold text-slate-400">Step {step} of 4</span>
      </div>

      {/* Progress bar */}
      <div className="mt-7 flex gap-2">
        {[1, 2, 3, 4].map((s) => (
          <div key={s} className={`h-1.5 flex-1 rounded-full ${s <= step ? "bg-[#D4AF37]" : "bg-slate-100"}`} />
        ))}
      </div>

      {/* ========== STEP 1: Personal Details ========== */}
      {step === 1 && (
        <div className="mt-10 space-y-5">
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

          <div className="grid gap-5 sm:grid-cols-2 mt-6">
            <label>Identity document / passport
              <input
                className="field"
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setPhotoFile(file);
                    setPhotoPreview(URL.createObjectURL(file));
                  }
                }}
              />
            </label>

            {photoPreview && (
              <div className="mt-3">
                <img src={photoPreview} alt="ID preview" className="w-15 h-15 rounded-full object-stretch border" />
              </div>
            )}
          </div>

          <div className="rounded-xl border border-slate-200 p-5 mt-6">
            <p className="eyebrow text-[#a27e10]">Next of kin</p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <label>Full name
                <input value={form.kinName} onChange={(e) => update("kinName", e.target.value)} className="field" />
              </label>
              <label>Relationship
                <input value={form.kinRelationship} onChange={(e) => update("kinRelationship", e.target.value)} className="field" placeholder="e.g. Mother" />
              </label>
              <label>Email
                <input value={form.kinEmail} onChange={(e) => update("kinEmail", e.target.value)} className="field" type="email" />
              </label>
              <label>Phone
                <input value={form.kinPhone} onChange={(e) => update("kinPhone", e.target.value)} className="field" />
              </label>
            </div>
          </div>
        </div>
      )}

      {/* ========== STEP 2: Programmes ========== */}
      {step === 2 && (
        <div className="mt-10 space-y-6">
          {/* Already added programmes */}
          {programmes.length > 0 && (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
              <p className="eyebrow text-emerald-700">Selected programmes ({programmes.length})</p>
              <div className="mt-3 space-y-2">
                {programmes.map((p, idx) => (
                  <div key={idx} className="flex items-center justify-between rounded-lg bg-white p-3 text-sm">
                    <div>
                      <p className="font-semibold text-slate-950">{p.course}</p>
                      <p className="text-xs text-slate-500 mt-1">
                        {p.category} · {p.period}
                        {p.subjects.length > 0 && ` · ${p.subjects.map(s => `${s.name} (${s.level})`).join(", ")}`}
                      </p>
                    </div>
                    <button type="button" onClick={() => removeProgramme(idx)} className="text-xs font-bold text-red-600">
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Category selector */}
          <div>
            <p className="field-label">Field of study</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  className={`filter-chip ${form.category === cat ? "active" : ""}`}
                  onClick={() => update("category", cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <label>Programme
              <select value={form.course} onChange={(e) => update("course", e.target.value)} className="field">
                {getCourseOptions(form.category).map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </label>

            <label>Examination period
              <select
                value={form.period}
                onChange={(e) => update("period", e.target.value)}
                className="field"
                disabled={!isMainCourse}
              >
                <option>Trimester 1</option>
                <option>Trimester 2</option>
                <option>Trimester 3</option>
              </select>
            </label>
          </div>

          {/* Subjects (only for Main Courses) */}
          {isMainCourse && selectedSubjects.length > 0 && (
            <div>
              <p className="field-label">Select subjects & levels</p>
              <div className="mt-2 grid gap-2 sm:grid-cols-2">
                {selectedSubjects.map((s) => (
                  <label key={s.name} className="check-option">
                    <input
                      type="checkbox"
                      checked={Boolean(subjectLevels[s.name])}
                      onChange={(e) => {
                        setSubjectLevels(prev => {
                          const next = { ...prev };
                          if (e.target.checked) next[s.name] = s.level[0] || "N1";
                          else delete next[s.name];
                          return next;
                        });
                      }}
                    />
                    <span className="flex flex-1 items-center justify-between gap-2">
                      {s.name}
                      {subjectLevels[s.name] && (
                        <select
                          className="field mt-0 w-28 py-1.5 text-sm"
                          value={subjectLevels[s.name]}
                          onChange={(e) => setSubjectLevels(prev => ({ ...prev, [s.name]: e.target.value }))}
                        >
                          {s.level.map((lvl) => (
                            <option key={lvl} value={lvl}>{lvl}</option>
                          ))}
                        </select>
                      )}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end border-t border-slate-100 pt-4">
            <Button variant="light" onClick={addProgramme}>
              <Plus className="h-4 w-4" /> Add this programme
            </Button>
          </div>
        </div>
      )}

      {/* ========== STEP 3: Review ========== */}
      {step === 3 && (
        <div className="mt-10 space-y-5">
          <p className="eyebrow text-[#a27e10]">Review your application</p>

          <div className="grid gap-4 rounded-xl border border-slate-200 p-5 text-sm sm:grid-cols-2">
            <div>
              <strong className="text-slate-950">Learner</strong><br />
              {form.name}<br />{form.email}<br />{form.phone}
            </div>
            <div>
              <strong className="text-slate-950">Next of kin</strong><br />
              {form.kinName} ({form.kinRelationship})<br />
              {form.kinEmail}<br />{form.kinPhone}
            </div>
            <div className="sm:col-span-2">
              <strong className="text-slate-950">Programmes</strong>
              <ul className="mt-1 space-y-1">
                {programmes.map((p, i) => (
                  <li key={i}>
                    {p.course} · {p.period}
                    {p.subjects.length > 0 && (
                      <span className="text-slate-500"> — {p.subjects.map(s => `${s.name} (${s.level})`).join(", ")}</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* ========== STEP 4: Payment ========== */}
      {step === 4 && (
        <div className="mt-10 space-y-6">
          <div className="rounded-xl bg-[#fbf7e8] p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="eyebrow text-[#a27e10]">Registration fee</p>
                <h3 className="mt-2 font-display text-3xl text-slate-950">R500.00</h3>
              </div>
              <div>
                <p className="eyebrow text-[#a27e10]">Deposit fee</p>
                <h3 className="mt-2 font-display text-3xl text-slate-950">R2000.00</h3>
              </div>
              <CircleDollarSign className="text-[#a27e10]" />
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              This non-refundable registration fee secures your place.
              A deposit is required upfront for full enrollment.
            </p>
          </div>

          <div>
            <label className="block">
              <span className="field-label">Deposit amount (R)</span>
              <input
                type="number"
                min="0"
                step="100"
                value={deposit}
                onChange={(e) => setDeposit(Number(e.target.value))}
                className="field mt-1"
                placeholder="2000"
              />
            </label>
            <p className="mt-2 text-xs text-slate-500">
              Default is R2,000. You may increase or decrease the deposit if needed.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 p-5 text-sm text-slate-600">
            You will complete payment securely via Paystack (Card, Instant EFT, SnapScan, Capitec Pay, etc.).
          </div>
        </div>
      )}

      {/* Error message */}
      {error && (
        <p className="mt-6 rounded-lg bg-red-50 p-3 text-sm leading-6 text-red-700" role="alert">
          {error}
        </p>
      )}

      {/* Navigation buttons */}
      <div className="mt-10 flex justify-between gap-3">
        <Button
          variant="light"
          onClick={() => step === 1 ? onComplete() : setStep(step - 1)}
          disabled={paying || loading}
        >
          {step === 1 ? "Cancel" : <><ChevronLeft className="h-4 w-4" /> Back</>}
        </Button>

        {step < 4 ? (
          <Button onClick={next} disabled={loading}>
            Continue <ArrowRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button onClick={handlePayment} disabled={paying || loading}>
            {paying ? <Spinner label="Processing payment..." /> : <>Pay R{(500 + Number(deposit || 0)).toLocaleString()} & Complete Application</>}
          </Button>
        )}
      </div>
    </div>
  );
}

// function Registration({ onComplete }: {
//   onComplete: (application?: ApplicationDraft) => void | Promise<void>
// }) {
//   const [step, setStep] = useState(1);
//   const [done, setDone] = useState(false);
//   const [error, setError] = useState("");
//   const [registration, setRegistration] = useState<StudentRegistration | null>(null);
//   const [receipt, setReceipt] = useState({ name: "", url: "", mimeType: "" });
//   const [photo, setPhoto] = useState({ name: "", url: "", mimeType: "" });
//   const [photoFile, setPhotoFile] = useState<File | null>(null);
//   const [receiptFile, setReceiptFile] = useState<File | null>(null);
//   const [subjectLevels, setSubjectLevels] = useState<Record<string, string>>({});
//   const [programmes, setProgrammes] = useState<RegistrationProgramme[]>([]);
//   const [applicationTraceId] = useState(() => crypto.randomUUID());

//   const categories = [
//     "Main Courses",
//     "Short Courses",
//     "Machine & Licence",
//     "Artisan Fields",
//     "Premium Courses",
//     "Welding Fields"
//   ] as const;

//   const getCourseOptions = (category: typeof categories[number]) => {
//     switch (category) {
//       case "Main Courses": return courses.map((c) => c.name);
//       case "Short Courses": return shortCourses.map(([name]) => name);
//       case "Machine & Licence": return machineCourses.map(([name]) => name);
//       case "Artisan Fields": return artisanFields.map(([name]) => name);
//       case "Premium Courses": return firstClassFields.map(([name]) => name);
//       case "Welding Fields": return weldingFields.map(([name]) => name);
//       default: return [];
//     }
//   };

//   const [form, setForm] = useState(() => {
//     const defaultCategory = "Main Courses" as typeof categories[number];
//     const defaultCourseOptions = getCourseOptions(defaultCategory);
//     return {
//       name: "",
//       email: "",
//       phone: "",
//       category: defaultCategory,
//       field: defaultCategory,
//       course: "",
//       level: "N1",
//       period: "",
//       kinName: "",
//       kinRelationship: "",
//       kinEmail: "",
//       kinPhone: ""
//     };
//   });
//   const { loading, run } = useAction();
//   const isMainCourse = form.category === "Main Courses";
//   const selectedCourse = isMainCourse ? courses.find((course) => course.name === form.course) : undefined;
//   const selectedSubjects = selectedCourse?.subjects ?? [];
//   const chosenSubjects = Object.entries(subjectLevels).map(([name, level]) => ({ name, level }));

//   const currentProgramme = (): RegistrationProgramme => ({
//     course: form.course,
//     category: form.category,
//     field: form.field,
//     level: form.level,
//     period: form.period,
//     subjects: chosenSubjects,
//   });

//   const resetProgrammeEditor = () => {
//     const defaultCategory = categories[0];
//     const defaultCourse = getCourseOptions(defaultCategory)[0] || "";
//     setSubjectLevels({});
//     setForm((old) => ({ ...old, category: defaultCategory, field: defaultCategory, course: defaultCourse, level: "N1", period: "Trimester 2" }));
//   };

//   const commitCurrentProgramme = (allowExisting = false) => {
//     const programme = currentProgramme();
//     if (!programme.course) {
//       setError("Select a programme before adding it.");
//       return false;
//     }
//     // if (isMainCourse && (!programme.subjects.length || programme.subjects.some((subject) => !subject.level))) {
//     //   setError("Select at least one subject and a level for every selected subject.");
//     //   return false;
//     // }
//     if (programmes.some((item) => item.course === programme.course && item.category === programme.category)) {
//       if (allowExisting) return true;
//       setError("That programme has already been added. Choose another programme.");
//       return false;
//     }
//     setProgrammes((old) => [...old, programme]);
//     setError("");
//     return true;
//   };

//   const update = (key: string, value: string) => {
//     if (key === "category" || key === "course") setSubjectLevels({});
//     setForm((old) => {
//       const newForm = { ...old, [key]: value };
//       if (key === "category" && old.category !== value) {
//         const nextCategory = value as typeof categories[number];
//         const newOptions = getCourseOptions(nextCategory);
//         newForm.field = nextCategory;
//         if (newOptions.length > 0) {
//           newForm.course = newOptions[0];
//         } else {
//           newForm.course = "";
//         }
//       }
//       return newForm;
//     });
//   };

//   const next = async () => {
//     setError("");
//     if (step === 1) {
//       if (!form.name.trim() || !form.email.trim() || !form.phone.trim() || !photoFile || !form.kinName.trim() || !form.kinRelationship.trim() || !form.kinEmail.trim() || !form.kinPhone.trim()) {
//         setError("Complete all learner, identity and next-of-kin fields before continuing.");
//         return;
//       }
//       if (!/^\S+@\S+\.\S+$/.test(form.email.trim()) || !/^\S+@\S+\.\S+$/.test(form.kinEmail.trim())) {
//         setError("Enter valid email addresses before continuing.");
//         return;
//       }
//     }
//     if (step === 2) {
//       const currentProgrammeObject = currentProgramme();
//       const isCurrentProgrammeSelected = !!currentProgrammeObject.course;
//       const isCurrentProgrammeAlreadyAdded = programmes.some(p => p.course === currentProgrammeObject.course && p.category === currentProgrammeObject.category);

//       if (isCurrentProgrammeSelected && !isCurrentProgrammeAlreadyAdded) {
//         if (!commitCurrentProgramme()) {
//           return;
//         }
//       }

//       if (programmes.length === 0) {
//         setError("Select at least one programme to continue.");
//         return;
//       }
//       setError("");
//     }
//     if (step === 3) {
//       if (!receiptFile || !receiptFile.type.startsWith("image/") || receiptFile.size > 5 * 1024 * 1024) {
//         setError("Upload a valid receipt image (PNG, JPEG or WebP, maximum 5 MB) before continuing.");
//         return;
//       }
//       setStep(4);
//       return;
//     }
//     if (step < 3) {
//       setStep(step + 1);
//       return;
//     }
//     if (step === 4) {
//       setError("");
//       let uploadedPaths: string[] = [];
//       try {
//         await run(async () => {
//           const { photo: uploadedPhoto, receipt: uploadedReceipt } = await uploadRegistrationFiles({ photo: photoFile ?? undefined, receipt: receiptFile ?? undefined }, applicationTraceId);
//           uploadedPaths = [uploadedPhoto?.path, uploadedReceipt?.path].filter((path): path is string => Boolean(path));
//           const created = await registerStudent({
//             ...form,
//             programmes: programmes.some((item) => item.course === form.course && item.category === form.category)
//               ? programmes
//               : [...programmes, currentProgramme()],
//             applicationTraceId,
//             photo: uploadedPhoto,
//             receipt: uploadedReceipt,
//           });
//           setRegistration(created);
//         });
//         setDone(true);
//       } catch (submissionError) {
//         await removeRegistrationFiles(uploadedPaths);
//         setError(submissionError instanceof Error ? submissionError.message : "Registration could not be submitted.");
//       }
//     }
//   };

//   if (done)
//     return (
//       <div className="registration-card" role="dialog" aria-labelledby="registration-success-title" aria-describedby="registration-success-description">
//         <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
//           <Check className="h-8 w-8" />
//         </div>
//         <p className="mt-6 eyebrow">Application complete</p>
//         <h2 id="registration-success-title" className="mt-2 font-display text-4xl text-slate-950">Welcome to NSTC.</h2>
//         <p id="registration-success-description" className="mt-4 max-w-lg text-sm leading-6 text-slate-600">Your provisional student number is <strong className="text-slate-950">{registration?.studentNumber}</strong>. Admissions will verify your documents and confirm your orientation schedule.</p>
//         <div className="mt-7 flex flex-wrap gap-3">
//           <Button onClick={() => {
//             // registration && onComplete({ ...form, ...(programmes[0] || currentProgramme()), programmes, receipt, registration })
//           }}>Open student dashboard <ArrowRight className="h-4 w-4" /></Button>
//           <a className="btn btn-light" href="/">Back to website</a>
//         </div>
//       </div>
//     );

//   return (
//     <div className="registration-card">
//       <div className="flex flex-wrap items-center justify-between gap-4">
//         <div>
//           <p className="eyebrow">Application journey</p>
//           <h1 className="mt-2 font-display text-4xl text-slate-950">Join the NSTC community.</h1>
//         </div>
//         <span className="text-sm font-semibold text-slate-400">Step {step} of 4</span>
//       </div>
//       <div className="mt-7 flex gap-2">
//         {[1, 2, 3, 4].map((s) =>
//           <div className={`h-1.5 flex-1 rounded-full ${s <= step ? "bg-[#D4AF37]" : "bg-slate-100"}`} key={s} />
//         )}
//       </div>
//       {
//         step === 1 &&
//         <div className="mt-10 space-y-5">
//           <div className="grid gap-5 sm:grid-cols-2">
//             <label>Full name
//               <input value={form.name} onChange={(e) => update("name", e.target.value)} className="field" placeholder="e.g. Thabo Mokoena" />
//             </label>
//             <label>Email address
//               <input value={form.email} onChange={(e) => update("email", e.target.value)} className="field" type="email" placeholder="name@email.com" />
//             </label>
//           </div>
//           <label>Mobile number
//             <input value={form.phone} onChange={(e) => update("phone", e.target.value)} className="field" placeholder="+27 ..." />
//           </label>
//           <label>Identity document / passport
//             <input className="field" type="file" accept=".png,.jpg,.jpeg" onChange={(e) => {
//               const file = e.target.files?.[0];
//               if (file) {
//                 setPhotoFile(file);
//                 setPhoto({
//                   name: file.name,
//                   url: URL.createObjectURL(file),
//                   mimeType: file.type,
//                 });
//               } else {
//                 setPhotoFile(null);
//                 setPhoto({ name: "", url: "", mimeType: "" });
//               }
//             }} />
//           </label>
//           <div className="rounded-xl border border-slate-200 p-4 mt-6">
//             <p className="eyebrow text-[#a27e10]">Next of kin</p>
//             <div className="mt-4 grid gap-4 sm:grid-cols-2">
//               <label>Full name
//                 <input value={form.kinName} onChange={(e) => update("kinName", e.target.value)} className="field" placeholder="Parent / guardian name" />
//               </label>
//               <label>Relationship
//                 <input value={form.kinRelationship} onChange={(e) => update("kinRelationship", e.target.value)} className="field" placeholder="e.g. Mother" />
//               </label>
//               <label>Email
//                 <input value={form.kinEmail} onChange={(e) => update("kinEmail", e.target.value)} className="field" type="email" placeholder="family@email.com" />
//               </label>
//               <label>Phone
//                 <input value={form.kinPhone} onChange={(e) => update("kinPhone", e.target.value)} className="field" placeholder="+27 ..." />
//               </label>
//             </div>
//           </div>
//         </div>
//       }
//       {step === 2 &&
//         <div className="mt-10 space-y-5">
//           {programmes.length > 0 &&
//             <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
//               <p className="eyebrow text-emerald-700">Added programmes</p>
//               <div className="mt-3 space-y-2">
//                 {programmes.map((programme, index) =>
//                   <div className="flex items-center justify-between gap-3 rounded-lg bg-white p-3 text-sm" key={`${programme.course}-${index}`}>
//                     <div>
//                       <p className="font-semibold text-slate-950">{programme.course}</p>
//                       <p className="mt-1 text-xs text-slate-500">{programme.subjects.length} subject(s) · {programme.subjects.map((subject) => `${subject.name} (${subject.level})`).join(", ") || "No individual subjects"}</p>
//                     </div>
//                     <button type="button" className="text-xs font-bold text-red-600" onClick={() => setProgrammes((old) => old.filter((_, itemIndex) => itemIndex !== index))}>Remove</button>
//                   </div>
//                 )}
//               </div>
//             </div>
//           }
//           <div>
//             <p className="field-label">Field of study</p>
//             <div className="mt-2 flex flex-wrap gap-2" role="group" aria-label="Field of study categories">
//               {categories.map((category) =>
//                 <button
//                   key={category}
//                   type="button"
//                   className={`filter-chip ${form.category === category ? "active" : ""}`}
//                   onClick={() => update("category", category)}
//                   aria-pressed={form.category === category}
//                 >
//                   {category}
//                 </button>
//               )}
//             </div>
//           </div>
//           <div className="grid gap-5 sm:grid-cols-2">
//             <label>Programme
//               <select value={form.course} onChange={(e) => update("course", e.target.value)} className="field">
//                 {getCourseOptions(form.category as typeof categories[number]).map((course) =>
//                   <option key={course}>{course}</option>
//                 )}
//               </select>
//             </label>

//             <label>Examination period
//               <select disabled={!isMainCourse} value={form.period} onChange={(e) => update("period", e.target.value)} className="field">
//                 <option>Trimester 1</option>
//                 <option>Trimester 2</option>
//                 <option>Trimester 3</option>
//               </select>
//             </label>
//           </div>
//           <div>
//             <p className="field-label">Select subjects / modules</p>
//             <div className="mt-2 grid gap-2 sm:grid-cols-2">
//               {selectedSubjects.map((s, i) =>
//                 <label key={i} className="check-option">
//                   <input type="checkbox" checked={Boolean(subjectLevels[s.name])} onChange={(e) => setSubjectLevels((old) => {
//                     const next = { ...old };
//                     if (e.target.checked) next[s.name] = s.level[0] || "";
//                     else delete next[s.name];
//                     return next;
//                   })} disabled={!isMainCourse} />
//                   <span className="flex flex-1 items-center justify-between gap-2">{s.name}
//                     {subjectLevels[s.name] && <select className="field mt-0 w-32 py-2" value={subjectLevels[s.name]} onChange={(e) => setSubjectLevels((old) => ({ ...old, [s.name]: e.target.value }))}>
//                       {s.level.map((level) => <option key={level} value={level}>{level}</option>)}
//                     </select>}
//                   </span>
//                 </label>
//               )}
//               {!selectedSubjects.length && <p className="text-sm text-slate-400">Subjects and modules are available for Main Courses.</p>}
//             </div>
//           </div>
//           <div className="flex justify-end border-t border-slate-100 pt-4">
//             <Button variant="light" onClick={() => { if (commitCurrentProgramme()) resetProgrammeEditor(); }}>
//               <Plus className="h-4 w-4" /> Add another programme
//             </Button>
//           </div>
//         </div>
//       }
//       {step === 3 &&
//         <div className="mt-10 space-y-5">
//           <div className="rounded-xl bg-[#fbf7e8] p-5">
//             <div className="flex items-start justify-between">
//               <div>
//                 <p className="eyebrow text-[#a27e10]">Registration fee</p>
//                 <h3 className="mt-2 font-display text-3xl text-slate-950">R500</h3>
//               </div>
//               <CircleDollarSign className="text-[#a27e10]" />
//             </div>
//             <p className="mt-3 text-sm leading-6 text-slate-600">Registration is R500.00 plus a R2,000.00 deposit. Both amounts are non-refundable once the application is submitted.</p>
//           </div>
//           <div className="rounded-xl border border-slate-200 p-4 text-sm text-slate-600">
//             <strong className="text-slate-950">Bank transfer registration</strong><br />
//             First National Bank · Business Account · 62447593436 · Branch 250655<br />
//             Reference: Initials & Surname
//           </div>
//           <label className="block">Payment receipt image or document
//             <input className="field" type="file" accept=".png,.jpg,.jpeg" onChange={(e) => {
//               const file = e.target.files?.[0];
//               if (file) {
//                 setReceiptFile(file);
//                 setReceipt({
//                   name: file.name,
//                   url: URL.createObjectURL(file),
//                   mimeType: file.type,
//                 });
//               } else {
//                 setReceiptFile(null);
//                 setReceipt({ name: "", url: "", mimeType: "" });
//               }
//             }} />
//             <span className="mt-2 block text-xs font-normal text-slate-400">Upload a receipt as evidence of payment. A preview will appear before completion.</span>
//           </label>

//           {receipt.name &&
//             <div className="receipt-preview">
//               <FileText className="h-5 w-5 text-[#a27e10]" />
//               <span>{receipt.name}</span>
//               <span className="ml-auto text-xs font-semibold text-emerald-700">Ready to attach</span>
//             </div>
//           }
//         </div>
//       }
//       {step === 4 &&
//         <div className="mt-10 space-y-5">
//           <p className="eyebrow text-[#a27e10]">Review before saving</p>
//           <div className="grid gap-4 rounded-xl border border-slate-200 p-5 text-sm sm:grid-cols-2">
//             <p><strong className="text-slate-950">Learner</strong><br />{form.name}<br />{form.email}<br />{form.phone}</p>
//             <p><strong className="text-slate-950">Next of kin</strong><br />{form.kinName} ({form.kinRelationship})<br />{form.kinEmail}<br />{form.kinPhone}</p>
//             <p><strong className="text-slate-950">Programmes</strong><br />{programmes.map((programme) => `${programme.course} (${programme.period})`).join("; ")}</p>
//             <p><strong className="text-slate-950">Payment evidence</strong><br />{receipt.name}<br /><span className="text-emerald-700">Receipt image validated</span></p>
//           </div>
//           <div className="rounded-xl bg-slate-50 p-5 text-sm">
//             <strong className="text-slate-950">Selected subjects and levels</strong>
//             <div className="mt-2 space-y-3">
//               {programmes.length > 0 ? (
//                 programmes.map((programme) =>
//                   <div key={programme.course}>
//                     <p className="font-semibold text-slate-800">{programme.course}</p>
//                     <p className="mt-1 text-slate-500">
//                       {programme.subjects.map((subject) => `${subject.name} · ${subject.level}`).join(", ") || "No individual subjects selected."}
//                     </p>
//                   </div>
//                 )
//               ) : (
//                 <p className="text-slate-500">No programmes selected.</p>
//               )}
//             </div>
//           </div>
//         </div>
//       }
//       {error && <p className="mt-6 rounded-lg bg-red-50 p-3 text-sm leading-6 text-red-700" role="alert">{error}</p>}

//       <div className="mt-10 flex justify-between gap-3">
//         <Button variant="light" onClick={() => step === 1 ? onComplete() : setStep(step - 1)}>
//           {step === 1
//             ? "Cancel"
//             : <><ChevronLeft className="h-4 w-4" /> Back</>
//           }
//         </Button>
//         <Button onClick={next} disabled={loading}>
//           {loading ? <Spinner label="Saving" />
//             : step === 4
//               ? <>Complete application <Check className="h-4 w-4" /></>
//               : <>Continue <ArrowRight className="h-4 w-4" /></>
//           }
//         </Button>
//       </div>
//     </div>
//   );
// }

// ============================ Main STUDENT PORTAL ============================ //
function StudentPortal({ data, setData, path, navigate }: {
  data: AppData;
  setData: React.Dispatch<React.SetStateAction<AppData>>;
  path: string;
  navigate: (path: string) => void
}) {
  const [register, setRegister] = useState(path === "/portal/apply");
  const [loggedIn, setLoggedIn] = useState(() => path === "/portal/apply" || localStorage.getItem("nstc-portal-session") === "active");

  if (path !== "/portal/apply" && !loggedIn) return <StudentAuth onAuthenticated={() => setLoggedIn(true)} />;

  if (register)
    return (
      <div className="registration-page">
        <div className="registration-top">
          <Logo light />
          <a href="/" className="text-sm font-semibold text-white/60 hover:text-white">Back to website</a>
        </div>
        <Registration onComplete={(application) => {
          if (application?.email && application.registration) {
            setData((old) => ({
              ...old,
              students: [...old.students, {
                id: application.registration.studentId,
                name: application.name || "New NSTC learner",
                email: application.email,
                phone: application.phone,
                studentNo: application.registration.studentNumber,
                campus: "Middleburg Campus",
                course: application.course,
                status: "Active",
                startDate: new Date().toISOString().slice(0, 10),
                attendance: 0,
                balance: 500,
                termAverage: 0,
                initials: initials(application.name || "New learner"),
                guardian: application.kinName || "",
                nextOfKin: { name: application.kinName || "", relationship: application.kinRelationship || "", email: application.kinEmail || "", phone: application.kinPhone || "" },
                remarks: ""
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
        : path.startsWith("/portal/support")
          ? "/portal/support"
          : path.startsWith("/portal/settings")
            ? "/portal/settings"
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
        <StudentLearning data={data} onNavigate={navigate} />
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
      {active === "/portal/support" &&
        <StudentSupport data={data} setData={setData} />
      }
      {active === "/portal/settings" &&
        <StudentSettings onSignOut={() => { localStorage.removeItem("nstc-portal-session"); setLoggedIn(false); }} />
      }
    </PortalShell>
  );
}

// ============================ LECTURER PORTAL ============================ //

function LecturerAuth({ onAuthenticated }: { onAuthenticated: () => void }) {
  const [error, setError] = useState("");
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") || "");
    const password = String(form.get("password") || "");
    if (email === "lecturer@nstc.example" && password === "lecturer2026") {
      localStorage.setItem("nstc-lecturer-session", "active");
      onAuthenticated();
    } else setError("Demo login: lecturer@nstc.example · lecturer2026");
  };
  return <div className="registration-page"><div className="registration-top"><Logo light /><a href="/" className="text-sm font-semibold text-white/60">Back to website</a></div><div className="registration-card max-w-[520px]"><p className="eyebrow">Lecturer & tutor access</p><h1 className="mt-2 font-display text-4xl text-slate-950">Lead learning with clarity.</h1><p className="mt-3 text-sm leading-6 text-slate-500">Sign in to manage classes, resources, attendance, assessments and student progress.</p>{error && <p className="mt-5 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}<form onSubmit={submit} className="mt-7 space-y-5"><label>Email address<input className="field" name="email" type="email" required placeholder="lecturer@nstc.example" /></label><label>Password<input className="field" name="password" type="password" required placeholder="Your password" /></label><Button type="submit" className="w-full justify-center">Sign in to lecturer portal <ArrowRight className="h-4 w-4" /></Button></form><p className="mt-7 rounded-xl bg-slate-50 p-4 text-xs leading-5 text-slate-500">Demo credentials: <strong>lecturer@nstc.example</strong> with password <strong>lecturer2026</strong>.</p><div className="mt-5 text-center text-sm font-semibold text-slate-500"><a href="/portal">Student portal</a><span className="mx-2 text-slate-300">·</span><a href="/admin">Admin access</a></div></div></div>;
}

function LecturerShell({ children, active, onNavigate, onSignOut }: {
  children: ReactNode;
  active: string;
  onNavigate: (path: string) => void;
  onSignOut: () => void
}) {
  const [open, setOpen] = useState(false);
  const items = [
    { label: "Overview", icon: LayoutDashboard, path: "/lecturer" },
    { label: "Students", icon: Users, path: "/lecturer/students" },
    { label: "Resources & assignments", icon: FileText, path: "/lecturer/resources" },
    { label: "Attendance", icon: ClipboardCheck, path: "/lecturer/attendance" },
    { label: "Student results", icon: BarChart3, path: "/lecturer/results" },
    { label: "Submissions & marks", icon: Upload, path: "/lecturer/submissions" },
    { label: "Announcements", icon: MessageCircle, path: "/lecturer/announcements" },
    { label: "Schedules", icon: CalendarDays, path: "/lecturer/schedules" }
  ];
  return (
    <div className="portal-shell lecturer-shell">
      <aside className={`portal-sidebar ${open ? "open" : ""}`}>
        <div className="p-6"><Logo />
          <div className="mt-10">
            <p className="eyebrow px-3">Teaching workspace</p>
            <div className="mt-3 space-y-1">
              {items.map((item) => {
                const I = item.icon;
                return <button key={item.path} className={`side-link ${active === item.path ? "active" : ""}`} onClick={() => { onNavigate(item.path); setOpen(false); }}>
                  <I className="h-4 w-4" />{item.label}{active === item.path && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[#D4AF37]" />}
                </button>;
              })}
            </div>
          </div>
        </div>
        <div className="mt-auto border-t border-slate-200 p-6">
          <div className="flex items-center gap-3">
            <div className="avatar-small">SR</div>
            <div>
              <p className="text-sm font-semibold text-slate-950">Siyabonga Radebe</p>
              <p className="text-xs text-slate-500">Lecturer account</p>
            </div>
          </div>
          <button className="mt-5 flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-950" onClick={onSignOut}>
            <X className="h-3.5 w-3.5" /> Sign out</button>
          <a href="/" className="mt-3 flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-950">
            <ExternalLink className="h-3.5 w-3.5" /> Public website
          </a>
        </div>
      </aside>
      <div className="portal-main">
        <header className="portal-header">
          <button className="icon-btn lg:hidden" onClick={() => setOpen(!open)}><Menu /></button>
          <div>
            <p className="eyebrow">Lecturer portal</p>
            <p className="hidden text-sm font-semibold text-slate-950 sm:block">Make every class count.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="notification-badge">
              <MessageCircle className="h-4 w-4" />
              <span>3</span>
            </div>
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold text-slate-950">Siyabonga Radebe</p>
              <p className="text-xs text-slate-500">Engineering faculty</p>
            </div>
            <div className="avatar-small">SR</div>
          </div>
        </header>
        <main className="p-5 md:p-8">{children}</main>
      </div>
    </div>
  );
}

const lecturerSubjects = ["Engineering Science", "Mathematics N2", "Electrical Trade Theory", "Logic Systems"];
const lecturerCourses = ["Electrical Engineering N1–N6", "Information Technology"];
const lecturerStudentRows = [
  { id: "s1", name: "Thabo Mokoena", email: "thabo.mokoena@example.com", phone: "+27 71 234 8821", course: "Electrical Engineering N1–N6", subject: "Engineering Science", status: "Active", kin: "Lerato Mokoena · +27 71 333 0198" },
  { id: "s2", name: "Naledi Dlamini", email: "naledi.dlamini@example.com", phone: "+27 82 441 6072", course: "Business Management N4–N6", subject: "Financial Accounting", status: "Active", kin: "Mandla Dlamini · +27 82 111 8034" },
  { id: "s3", name: "Kagiso Ndlovu", email: "kagiso.ndlovu@example.com", phone: "+27 79 884 1260", course: "Occupational Certificate: Bricklayer", subject: "Practical Skills", status: "Active", kin: "Mpho Ndlovu · +27 79 711 4021" },
  { id: "s4", name: "Ayanda Khumalo", email: "ayanda.khumalo@example.com", phone: "+27 76 510 4318", course: "Health & Safety Officer", subject: "Risk Assessment", status: "Active", kin: "Sibusiso Khumalo · +27 76 222 2401" },
  { id: "s5", name: "Bongani Maseko", email: "bongani.maseko@example.com", phone: "+27 73 119 5524", course: "Information Technology", subject: "Networking", status: "Suspended", kin: "Zanele Maseko · +27 73 110 0022" }
];

function LecturerOverview({ data, onNavigate }: {
  data: AppData; onNavigate: (path: string) => void
}) {
  const unread = data.lecturerNotifications.filter((item) => !item.read);
  return (
    <>
      <PageHeading eyebrow="Monday, 08 June 2026" title="Good morning, Siyabonga." body="Your teaching workspace for classes, learners and assessments."
        actions={
          <Button onClick={() => onNavigate("/lecturer/schedules")}>Edit timetable <CalendarDays className="h-4 w-4" /></Button>
        }
      />
      <div className="grid gap-4 sm:grid-cols-3">
        <MetricCard label="Courses + subjects" value="2 + 4" detail="Across your teaching load" icon={BookOpen} />
        <MetricCard label="Assignments created" value={data.assignments.length + 4} detail="2 awaiting review" icon={FileText} />
        <MetricCard label="Total students" value="24" detail="5 require attention" icon={Users} tone="green" />
      </div>
      <div className="mt-6 grid gap-5 xl:grid-cols-[1.2fr_.8fr]">
        <div className="portal-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="eyebrow">My teaching load</p>
              <h3 className="mt-2 font-display text-2xl text-slate-950">Courses, subjects & class sizes</h3>
            </div>
            <Pill tone="green">Active term</Pill>
          </div>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {
              [{
                course: "Electrical Engineering N1–N6",
                subject: "Engineering Science",
                count: 14,
                time: "Mon · 09:00"
              },
              {
                course: "Electrical Engineering N1–N6",
                subject: "Electrical Trade Theory",
                count: 12,
                time: "Wed · 13:00"
              },
              {
                course: "Information Technology",
                subject: "Networking",
                count: 8,
                time: "Thu · 10:00"
              },
              {
                course: "Information Technology",
                subject: "Database Fundamentals",
                count: 7,
                time: "Fri · 09:00"
              }
              ].map((item) =>
                <div className="rounded-xl border border-slate-200 p-4" key={`${item.course}-${item.subject}`}>
                  <p className="text-sm font-semibold text-slate-950">{item.subject}</p>
                  <p className="mt-1 text-xs text-slate-500">{item.course}</p>
                  <div className="mt-4 flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700">{item.count} students</span>
                    <span className="text-slate-400">{item.time}</span>
                  </div>
                </div>
              )}
          </div>
        </div>
        <div className="portal-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="eyebrow">Notifications</p>
              <h3 className="mt-2 font-display text-2xl text-slate-950">Needs your attention</h3>
            </div>
            <Pill>{unread.length} unread</Pill>
          </div>
          <div className="mt-4 space-y-3">
            {unread.slice(0, 3).map((item) =>
              <div className="rounded-xl bg-slate-50 p-3" key={item.id}>
                <p className="text-sm font-semibold text-slate-950">{item.title}</p>
                <p className="mt-1 text-xs leading-5 text-slate-500">{item.body}</p>
                <p className="mt-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">{item.date}</p>
              </div>
            )}
          </div>
          <button className="mt-5 text-sm font-bold text-slate-950" onClick={() => onNavigate("/lecturer/announcements")}>View all notifications <ArrowRight className="ml-1 inline h-4 w-4" /></button>
        </div>
      </div>
      <div className="mt-5 grid gap-5 lg:grid-cols-3">
        <div className="dark-mini-card">
          <Users /><div><strong>5</strong><small>students to follow up</small></div>
        </div>
        <div className="dark-mini-card">
          <ClipboardCheck /><div><strong>94%</strong><small>aggregated attendance</small>
          </div>
        </div>

        <div className="dark-mini-card"><Award /><div><strong>79%</strong><small>average class score</small></div></div>
      </div>
    </>
  );
}

function LecturerStudents() {
  const [course, setCourse] = useState("All courses");
  const [subject, setSubject] = useState("All subjects");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const filtered = lecturerStudentRows.filter((student) => (course === "All courses" || student.course === course) && (subject === "All subjects" || student.subject === subject) && `${student.name} ${student.email} ${student.course}`.toLowerCase().includes(search.toLowerCase()));
  const pageRows = filtered.slice((page - 1) * 10, page * 10);
  return (
    <>
      <PageHeading eyebrow="Learner directory" title="Students" body="Filter your assigned learners by course and subject, then reach the right person quickly." />
      <div className="portal-card">
        <div className="grid gap-3 md:grid-cols-[1fr_1fr_1.4fr]">
          <select className="field mt-0" value={course} onChange={(event) => { setCourse(event.target.value); setPage(1); }}>
            <option>All courses</option>
            {lecturerCourses.map((item) =>
              <option key={item}>{item}</option>
            )}
          </select>
          <select className="field mt-0" value={subject} onChange={(event) => { setSubject(event.target.value); setPage(1); }}>
            <option>All subjects</option>
            {lecturerSubjects.map((item) => <option key={item}>{item}</option>)}
          </select>
          <label className="relative">
            <Search className="absolute left-3 top-[21px] h-4 w-4 text-slate-400" />
            <input className="field mt-0 pl-10" value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} placeholder="Search name, email or course" />
          </label>
        </div>
        <div className="mt-6 overflow-x-auto">
          <table className="data-table lecturer-table">
            <thead>
              <tr>
                <th>Full name & contacts</th>
                <th>Course</th>
                <th>Subject</th>
                <th>Status</th>
                <th>Next of kin</th>
              </tr>
            </thead>

            <tbody>
              {pageRows.map((student) =>
                <tr key={student.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="avatar-small">{initials(student.name)}</div>
                      <div>
                        <p className="font-semibold text-slate-950">{student.name}</p>
                        <p className="mt-1 text-xs text-slate-500">{student.email}<br />{student.phone}</p>
                      </div>
                    </div>
                  </td>
                  <td>{student.course}</td>
                  <td>
                    <button className="text-left font-semibold text-slate-700" onClick={() => toast.info(`${student.subject} selected for ${student.name}.`)}>{student.subject} <ChevronDown className="ml-1 inline h-3 w-3" /></button>
                  </td>
                  <td>
                    <Pill tone={student.status === "Suspended" ? "red" : "green"}>{student.status}</Pill>
                  </td>
                  <td>{student.kin}</td>
                </tr>
              )}
            </tbody>
          </table>
          {!pageRows.length && <div className="empty-state"><Users /><h3>No matching students</h3><p>Try a different course, subject or search term.</p></div>}
        </div>

        <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 text-xs text-slate-500">
          <span>Showing {pageRows.length} of {filtered.length} records · 10 per page</span>
          <div className="flex gap-2">
            <button className="filter-chip" disabled={page === 1} onClick={() => setPage((value) => Math.max(1, value - 1))}>Previous</button>
            <button className="filter-chip" disabled={page * 10 >= filtered.length} onClick={() => setPage((value) => value + 1)}>Next</button>
          </div>
        </div>
      </div>
    </>
  );
}

function LecturerResources({ data, setData }: { data: AppData; setData: React.Dispatch<React.SetStateAction<AppData>> }) {
  const [message, setMessage] = useState("");
  const submitResource = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); const form = new FormData(event.currentTarget); setData((old) => ({ ...old, resources: [{ id: crypto.randomUUID(), title: String(form.get("title") || "New learning resource"), course: String(form.get("course") || lecturerCourses[0]), subject: String(form.get("subject") || lecturerSubjects[0]), fileType: "PDF", published: form.get("publish") === "on", uploaded: "2026-06-08" }, ...old.resources] })); event.currentTarget.reset(); setMessage("Resource uploaded and saved to your teaching library."); };
  return (
    <>
      <PageHeading eyebrow="Teaching library" title="Resources & assignments" body="Upload learning materials, publish them to a class and track assignment progress." />
      <div className="grid gap-5 lg:grid-cols-[.9fr_1.1fr]">
        <div className="portal-card">
          <p className="eyebrow">Upload & publish resource</p>
          <form onSubmit={submitResource} className="mt-5 space-y-4">
            <label>Resource title
              <input name="title" className="field" required placeholder="e.g. Motor control workbook" />
            </label>
            <label>Course
              <select name="course" className="field">
                <option>{lecturerCourses[0]}</option>
                <option>{lecturerCourses[1]}</option>
              </select>
            </label>
            <label>Subject
              <select name="subject" className="field">
                {lecturerSubjects.map((item) =>
                  <option key={item}>{item}</option>
                )}
              </select>
            </label>
            <label>File
              <input className="field" type="file" required />
            </label>
            <label className="check-option">
              <input name="publish" type="checkbox" defaultChecked /> Publish to enrolled students now
            </label>
            <Button type="submit">
              <Upload className="h-4 w-4" /> Upload resource</Button>
            {message && <p className="rounded-lg bg-emerald-50 p-3 text-sm text-emerald-700">{message}</p>}
          </form>
        </div>
        <div className="portal-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="eyebrow">Published library</p>
              <h3 className="mt-2 font-display text-2xl text-slate-950">Learning resources</h3>
            </div>
            <Pill>{data.resources.length} files</Pill>
          </div>
          <div className="mt-4 space-y-2">
            {data.resources.map((resource) =>
              <div className="resource-row" key={resource.id}>
                <div className="file-icon"><FileText /></div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">{resource.title}</p>
                  <p className="mt-1 text-xs text-slate-500">{resource.course} · {resource.subject} · {resource.uploaded}</p>
                </div>
                <Pill tone={resource.published ? "green" : "slate"}>{resource.published ? "Published" : "Draft"}</Pill>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="mt-5 portal-card">
        <div className="flex items-center justify-between">
          <div>
            <p className="eyebrow">Assignment activity</p>
            <h3 className="mt-2 font-display text-2xl text-slate-950">Post and track coursework</h3>
          </div>
          <Button onClick={() => toast.success("Assignment creation form is ready for your next brief.")}><Plus className="h-4 w-4" /> New assignment</Button>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-3">{
          [{ label: "Completed", value: "18", tone: "green" },
          { label: "In progress", value: "7", tone: "gold" },
          { label: "Not started", value: "4", tone: "slate" }
          ].map((item) =>
            <div className="rounded-xl bg-slate-50 p-4" key={item.label}>
              <p className="text-xs text-slate-500">{item.label}</p>
              <p className="mt-1 font-display text-3xl text-slate-950">{item.value}</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function LecturerAttendance() {
  const [subject, setSubject] = useState(lecturerSubjects[0]);
  const [present, setPresent] = useState<Record<string, boolean>>({ s1: true, s2: true, s3: true, s4: false, s5: true });
  const students = lecturerStudentRows.filter((student) => student.subject === subject || subject === lecturerSubjects[0]);
  const markSaved = () => toast.success(`Attendance saved for ${subject}.`);
  return (
    <>
      <PageHeading eyebrow="Class register" title="Attendance" body="Mark each subject at its scheduled time and keep the aggregate visible."
        actions={
          <Button onClick={markSaved}>Save attendance <Check className="h-4 w-4" /></Button>
        }
      />
      <div className="grid gap-4 sm:grid-cols-3">
        <MetricCard label="Today’s class" value="09:00" detail="Engineering Science · Workshop 2" icon={Clock3} />
        <MetricCard label="Present today" value={`${Object.values(present).filter(Boolean).length} / ${students.length}`} detail="Current register" icon={ClipboardCheck} tone="green" />
        <MetricCard label="Aggregate attendance" value="94%" detail="Across the last two weeks" icon={TrendingUp} />
      </div>
      <div className="mt-6 grid gap-5 lg:grid-cols-[1.2fr_.8fr]">
        <div className="portal-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="eyebrow">Mark attendance</p>
              <h3 className="mt-2 font-display text-2xl text-slate-950">08 June 2026 · Engineering Science</h3>
            </div>
            <select className="field mt-0 max-w-[220px]" value={subject} onChange={(event) => setSubject(event.target.value)}>
              {lecturerSubjects.map((item) =>
                <option key={item}>{item}</option>
              )}
            </select>
          </div>
          <div className="mt-5">
            {students.map((student) =>
              <label className="attendance-row" key={student.id}>
                <span className="flex items-center gap-3">
                  <span className="avatar-small">{initials(student.name)}</span>
                  <span><strong className="block text-sm text-slate-950">{student.name}</strong><small className="text-xs text-slate-500">{student.course}</small></span>
                </span>
                <input type="checkbox" checked={Boolean(present[student.id])} onChange={(event) => setPresent((old) => ({ ...old, [student.id]: event.target.checked }))} /></label>
            )}
          </div>
        </div>
        <div className="portal-card">
          <p className="eyebrow">Attendance trend</p>
          <h3 className="mt-2 font-display text-2xl text-slate-950">Last two weeks</h3>
          <div className="mt-6 flex h-48 items-end gap-2">
            {[92, 96, 88, 100, 94, 90, 97, 100, 92, 96, 100, 94, 98, 94].map((value, index) =>
              <div className="flex flex-1 flex-col items-center gap-2" key={index}>
                <div className="w-full rounded-t-md bg-[#D4AF37]" style={{ height: `${Math.max(20, value * 1.3)}px`, opacity: value < 90 ? .5 : 1 }} />
                <span className="text-[9px] text-slate-400">{index + 1}</span>
              </div>
            )}
          </div>
          <p className="mt-4 text-xs text-slate-500">Aggregated by scheduled subject and attendance session.</p>
        </div>
      </div>
    </>
  );
}

function LecturerResults() {
  const [course, setCourse] = useState("All courses");
  const [subject, setSubject] = useState("All subjects");
  const [search, setSearch] = useState("");
  const [profile, setProfile] = useState<typeof lecturerStudentRows[number] | null>(null);
  const [transcript, setTranscript] = useState<typeof lecturerStudentRows[number] | null>(null);
  const rows = lecturerStudentRows.filter((student) => (course === "All courses" || student.course === course) && (subject === "All subjects" || student.subject === subject) && student.name.toLowerCase().includes(search.toLowerCase()));
  return (
    <>
      <PageHeading eyebrow="Assessment book" title="Student results" body="Review scores, progress and attendance rates before publishing the next academic update." />
      <div className="portal-card">
        <div className="grid gap-3 md:grid-cols-[1fr_1fr_1.4fr]">
          <select className="field mt-0" value={course} onChange={(event) => setCourse(event.target.value)}>
            <option>All courses</option>
            {lecturerCourses.map((item) => <option key={item}>{item}</option>)}
          </select>
          <select className="field mt-0" value={subject} onChange={(event) => setSubject(event.target.value)}>
            <option>All subjects</option>
            {lecturerSubjects.map((item) => <option key={item}>{item}</option>)}
          </select>
          <label className="relative">
            <Search className="absolute left-3 top-[21px] h-4 w-4 text-slate-400" />
            <input className="field mt-0 pl-10" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search student" />
          </label>
        </div>
        <div className="mt-6 overflow-x-auto">
          <table className="data-table lecturer-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Course</th>
                <th>Assignments written</th>
                <th>Aggregated score</th>
                <th>Total marks</th>
                <th>Attendance · 2 weeks</th>
                <th>Profile</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((student, index) =>
                <tr key={student.id}>
                  <td className="font-semibold text-slate-950">{student.name}</td>
                  <td>{student.course}</td>
                  <td>{[3, 4, 4, 4, 2][lecturerStudentRows.findIndex((row) => row.id === student.id)]} / 4</td>
                  <td className="font-semibold text-slate-950">{[86, 78, 82, 74, 53][lecturerStudentRows.findIndex((row) => row.id === student.id)] || 76}%</td>
                  <td>100</td>
                  <td>
                    <Pill tone={student.status === "Suspended" ? "red" : "green"}>{[94, 88, 91, 96, 71][lecturerStudentRows.findIndex((row) => row.id === student.id)] || 84}%</Pill></td>
                  <td>
                    <button className="text-xs font-bold text-slate-700 underline" onClick={() => setProfile(student)}>View profile</button><button className="ml-3 text-xs font-bold text-[#916e0a] underline" onClick={() => setTranscript(student)}>Transcript</button></td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {profile &&
        <Modal title={`${profile.name} · Academic profile`} onClose={() => setProfile(null)}>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-xs text-slate-400">Course</p>
              <p className="mt-1 font-semibold">{profile.course}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Status</p>
              <Pill tone={profile.status === "Suspended" ? "red" : "green"}>
                {profile.status}
              </Pill>
            </div>
            <div>
              <p className="text-xs text-slate-400">Subject</p>
              <p className="mt-1 font-semibold">{profile.subject}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Progress</p>
              <p className="mt-1 font-semibold">On track · 68%</p>
            </div>
          </div>
          <div className="mt-6 rounded-xl bg-slate-50 p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Lecturer remark</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">Strong practical participation. Continue with weekly revision and submit outstanding work before the next assessment.</p>
          </div>
        </Modal>
      }

      {transcript &&
        <Modal title={`Generate transcript · ${transcript.name}`} onClose={() => setTranscript(null)}>
          <p className="mt-5 text-sm leading-6 text-slate-600">Add a lecturer remark that will appear on the student’s transcript and academic profile.</p>
          <textarea className="field mt-4 min-h-[130px]" defaultValue="Demonstrates consistent commitment and practical understanding across the current term." />
          <div className="mt-6 flex justify-end">
            <Button onClick={() => { toast.success(`Transcript generated for ${transcript.name}.`); setTranscript(null); }}>
              <FileText className="h-4 w-4" /> Generate transcript</Button>
          </div>
        </Modal>
      }
    </>
  );
}

function LecturerSubmissions() {
  const [scores, setScores] = useState<Record<string, string>>({ s1: "86", s2: "78", s3: "82", s4: "74" });
  return (
    <>
      <PageHeading eyebrow="Marking queue" title="Submissions & marks" body="Preview submitted files, download evidence and update marks for each assignment." />
      <div className="portal-card">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="eyebrow">Electrical installation rules</p>
            <h3 className="mt-2 font-display text-2xl text-slate-950">Submitted assignment files</h3>
          </div>
          <Pill tone="green">4 submitted</Pill>
        </div>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Submitted</th>
                <th>File</th>
                <th>Preview</th>
                <th>Marks / 100</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {lecturerStudentRows.slice(0, 4).map((student) =>
                <tr key={student.id}>
                  <td className="font-semibold text-slate-950">{student.name}</td>
                  <td>08 Jun 2026 · 08:20</td>
                  <td>
                    <button className="text-xs font-semibold text-slate-700 underline" onClick={() => toast.success("Demo file download started.")}><Download className="mr-1 inline h-3.5 w-3.5" />submission.pdf</button>
                  </td>
                  <td>
                    <button className="text-xs font-semibold text-[#916e0a] underline" onClick={() => toast.info("Preview opened in the marking workspace.")}>Preview</button>
                  </td>
                  <td><input className="field mt-0 w-24" value={scores[student.id] || ""} onChange={(event) => setScores((old) => ({ ...old, [student.id]: event.target.value }))} /></td>
                  <td><Button onClick={() => toast.success(`Score updated for ${student.name}.`)}>Update</Button>
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

function LecturerAnnouncements({ data, setData }: {
  data: AppData;
  setData: React.Dispatch<React.SetStateAction<AppData>>
}) {
  const [date, setDate] = useState("All dates");
  const dates = Array.from(new Set(data.lecturerNotifications.map((item) => item.date)));
  const visible = data.lecturerNotifications.filter((item) => date === "All dates" || item.date === date);
  const markRead = (id: string) => setData((old) => ({ ...old, lecturerNotifications: old.lecturerNotifications.map((item) => item.id === id ? { ...item, read: true } : item) }));
  return (
    <>
      <PageHeading eyebrow="Communication centre" title="Announcements & notifications" body="Review every teaching update and mark items as read once actioned."
        actions={
          <Button onClick={() => toast.success("Announcement composer opened.")}>
            <Plus className="h-4 w-4" /> New announcement</Button>
        }
      />
      <div className="portal-card">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div><p className="eyebrow">Full notification view</p>
            <h3 className="mt-2 font-display text-2xl text-slate-950">Teaching updates</h3>
          </div>
          <select className="field mt-0 max-w-[220px]" value={date} onChange={(event) => setDate(event.target.value)}><option>All dates</option>
            {dates.map((item) => <option key={item}>{item}</option>)}
          </select>
        </div>
        <div className="mt-5 divide-y divide-slate-100">
          {visible.map((item) =>
            <div className="flex flex-col gap-4 py-5 first:pt-0 md:flex-row md:items-start md:justify-between" key={item.id}>
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-slate-950">{item.title}</p>
                  {!item.read && <Pill>Unread</Pill>}
                </div>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">{item.body}</p>
                <p className="mt-2 text-xs text-slate-400">{item.date}</p>
              </div>
              {!item.read && <Button variant="light" onClick={() => markRead(item.id)}>Mark as read <Check className="h-4 w-4" /></Button>}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function LecturerSchedules({ data, setData }: {
  data: AppData;
  setData: React.Dispatch<React.SetStateAction<AppData>>
}) {
  const [editing, setEditing] = useState<Schedule | null>(null);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const next: Schedule = {
      id: editing?.id || crypto.randomUUID(),
      title: String(form.get("title") || "New class"),
      kind: String(form.get("kind") || "Class"),
      date: String(form.get("date") || "2026-06-10"),
      time: String(form.get("time") || "09:00 – 11:00"),
      location: String(form.get("location") || "Workshop 2")
    };
    setData((old) => ({
      ...old,
      schedules: editing ? old.schedules.map((item) => item.id === editing.id ? next : item) : [...old.schedules, next]
    }));
    setEditing(null);
    toast.success("Schedule saved and published to the class calendar.");
  };

  return (
    <>
      <PageHeading eyebrow="Timetable builder" title="Schedules" body="Create and edit class, assignment and examination schedules with time and location." />
      <div className="grid gap-5 lg:grid-cols-[.85fr_1.15fr]">
        <div className="portal-card">
          <p className="eyebrow">{editing ? "Edit schedule" : "Create schedule"}</p>
          <form onSubmit={submit} className="mt-5 space-y-4">
            <label>Title<input name="title" className="field" required defaultValue={editing?.title || ""} placeholder="Engineering Science" /></label>
            <label>Type<select name="kind" className="field" defaultValue={editing?.kind || "Class"}>
              <option>Class</option>
              <option>Assignment</option>
              <option>Exam</option>
            </select>
            </label>
            <label>Date<input name="date" className="field" type="date" required defaultValue={editing?.date || "2026-06-10"} /></label>
            <label>Time<input name="time" className="field" required defaultValue={editing?.time || "09:00 – 11:00"} /></label>
            <label>Location<input name="location" className="field" required defaultValue={editing?.location || "Workshop 2 · Wynberg"} /></label>
            <div className="flex gap-3">
              <Button type="submit">{editing ? "Save changes" : "Publish schedule"} <Check className="h-4 w-4" /></Button>
              {editing && <Button variant="light" onClick={() => setEditing(null)}>Cancel</Button>}
            </div>
          </form>
        </div>
        <div className="portal-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="eyebrow">Published timetable</p>
              <h3 className="mt-2 font-display text-2xl text-slate-950">Upcoming events</h3>
            </div>
            <CalendarDays className="text-[#a27e10]" />
          </div>
          <div className="mt-4 space-y-2">
            {data.schedules.map((item) =>
              <div className="schedule-row rounded-xl border border-slate-200 p-3" key={item.id}>
                <div className="date-tile">
                  <strong>{new Date(item.date).getDate()}</strong>
                  <span>{new Date(item.date).toLocaleDateString("en", { month: "short" })}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-slate-950">{item.title}</p>
                  <p className="mt-1 text-xs text-slate-500">{item.kind} · {item.time} · {item.location}</p>
                </div>
                <button className="icon-btn" onClick={() => setEditing(item)}><MoreHorizontal /></button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

function LecturerPortal({ data, setData, path, navigate }: {
  data: AppData;
  setData: React.Dispatch<React.SetStateAction<AppData>>;
  path: string;
  navigate: (path: string) => void
}) {

  const [loggedIn, setLoggedIn] = useState(() => localStorage.getItem("nstc-lecturer-session") === "active");

  if (!loggedIn) return <LecturerAuth onAuthenticated={() => setLoggedIn(true)} />;

  const active = path === "/lecturer"
    ? "/lecturer"
    : ["students", "resources", "attendance", "results", "submissions", "announcements", "schedules"].map((item) => `/lecturer/${item}`).find((item) => path.startsWith(item)) || "/lecturer";

  const content = active === "/lecturer"
    ? <LecturerOverview data={data} onNavigate={navigate} />
    : active === "/lecturer/students"
      ? <LecturerStudents />
      : active === "/lecturer/resources"
        ? <LecturerResources data={data} setData={setData} />
        : active === "/lecturer/attendance"
          ? <LecturerAttendance />
          : active === "/lecturer/results"
            ? <LecturerResults />
            : active === "/lecturer/submissions"
              ? <LecturerSubmissions />
              : active === "/lecturer/announcements"
                ? <LecturerAnnouncements data={data} setData={setData} />
                : <LecturerSchedules data={data} setData={setData} />;

  return (<LecturerShell active={active} onNavigate={navigate} onSignOut={() => { localStorage.removeItem("nstc-lecturer-session"); setLoggedIn(false); }}>{content}</LecturerShell>);
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
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const student = data.students[0];

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const found = data.students.find((s) => s.email === email.trim() && s.studentNo === number.trim() && s.phone === phone.trim());
    if (found) {
      setLogged(true);
      setError("");
    } else setError("For the demo, use thabo.mokoena@example.com · NSTC-26-0014 · +27 71 234 8821.");
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
          <p className="mt-3 text-sm leading-6 text-slate-500">Use the student’s email, NSTC student number and registered phone number.</p>
          <label className="mt-7 block">Student email
            <input className="field" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="student@email.com" />
          </label>
          <label className="mt-5 block">Student number / ID
            <input className="field" value={number} onChange={(e) => setNumber(e.target.value)} required placeholder="NSTC-26-0014" />
          </label>
          <label className="mt-5 block">Registered phone number
            <input className="field" value={phone} onChange={(e) => setPhone(e.target.value)} required placeholder="+27 71 234 8821" />
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

  return (
    <div className="portal-shell">
      <div className="portal-main">
        <header className="portal-header">
          <div><Logo /></div>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-slate-500 sm:block">Read-only family access</span>
            <Button variant="light" onClick={() => setLogged(false)}>Sign out</Button>
          </div>
        </header>
        <main className="mx-auto max-w-6xl p-5 md:p-8">
          <PageHeading eyebrow="Parent access · Read only" title={`${student.name}'s progress`} body="Your learner’s current academic and campus snapshot." actions={
            <Button onClick={() => toast.success("Statement of results downloaded.")}>
              <Download className="h-4 w-4" /> Statement of results
            </Button>
          } />

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <MetricCard label="Current status" value={student.status} detail={student.course} icon={GraduationCap} tone="green" />
            <MetricCard label="Attendance" value={`${student.attendance}%`} detail="Across current term" icon={ClipboardCheck} />
            <MetricCard label="Average score" value={`${student.termAverage}%`} detail="Assignments + exams" icon={Award} />
            <MetricCard label="Course duration" value="3 years" detail={`Started ${student.startDate}`} icon={Clock3} />
          </div>
          <div className="mt-6 grid gap-5 lg:grid-cols-[1.1fr_.9fr]">
            <div className="portal-card"><p className="eyebrow">Learner demographics</p>
              <div className="mt-5 grid gap-5 sm:grid-cols-2"><div>
                <p className="text-xs text-slate-400">Email</p>
                <p className="mt-1 text-sm font-semibold">{student.email}</p>
              </div>
                <div>
                  <p className="text-xs text-slate-400">Mobile</p>
                  <p className="mt-1 text-sm font-semibold">{student.phone}</p>
                </div><div><p className="text-xs text-slate-400">Campus</p>
                  <p className="mt-1 text-sm font-semibold">{student.campus}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Assigned tutor</p>
                  <p className="mt-1 text-sm font-semibold">Siyabonga Radebe</p>
                </div>
              </div>
              <div className="mt-7 rounded-xl bg-slate-50 p-4">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Lecturer remark</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">“{student.remarks}”</p>
              </div>
            </div>
            <div className="portal-card">
              <p className="eyebrow">Academic snapshot</p>
              <h3 className="mt-2 font-display text-2xl">Results this term</h3>
              <div className="mt-5 space-y-5">
                {[["Engineering Science", 86], ["Mathematics N2", 78], ["Electrical Trade Theory", 82]].map(([name, value]) =>
                  <div key={String(name)}>
                    <div className="mb-2 flex justify-between text-sm">
                      <span className="font-semibold">{name}</span>
                      <span>{value}%</span>
                    </div>
                    <ProgressBar value={Number(value)} />
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="mt-5 portal-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="eyebrow">Activities & assignments</p>
                <h3 className="mt-2 font-display text-2xl">Recent learning activity</h3>
              </div>
              <button onClick={() => navigate("/portal/results")} className="text-sm font-bold text-slate-500">View details <ArrowRight className="ml-1 inline h-4 w-4" /></button>
            </div>
            <div className="mt-5 overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Activity</th>
                    <th>Course</th>
                    <th>Status</th>
                    <th>Score</th>
                  </tr>
                </thead>
                <tbody>
                  {data.assignments.map((a) =>
                    <tr key={a.id}>
                      <td className="font-semibold">{a.title}</td>
                      <td>{a.course}</td>
                      <td>
                        <Pill tone={a.status === "Submitted" ? "green" : "gold"}>{a.status}</Pill>
                      </td>
                      <td>{a.score ? `${a.score}%` : "Pending"}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
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

  if (location === "/" || location === "") page = <Landing data={data} setData={setData} onApply={() => {
    setApply(true); navigate("/portal/apply");
  }} />;
  else if (location === "/apprenticeships") page = <ApprenticeshipPortal data={data} setData={setData} onApply={() => go("/portal/apply")} />;
  else if (location === "/sales") page = <>
    <div className="bg-[#071a3a] pb-14">
      <PublicNav onApply={() => go("/portal/apply")} />
      <div className="container pt-36">
        <SectionTitle light eyebrow="NSTC sales portal" title="Study tools, ready when you are." body="Order learning devices and course materials from the National Skills & Technical College supply desk." />
      </div>
    </div>
    <SalesPortal />
    <Footer />
  </>;
  else if (location.startsWith("/portal")) page = <StudentPortal data={data} setData={setData} path={location} navigate={go} />;
  else if (location === "/parent") page = <ParentPortal data={data} navigate={go} />;
  else if (location.startsWith("/lecturer")) page = <LecturerPortal data={data} setData={setData} path={location} navigate={go} />;
  else if (location === "/admin/students") page = <AdminStudents data={data} navigate={go} />;
  else if (location === "/admin/academics") page = <AdminAcademics data={data} setData={setData} navigate={go} />;
  else if (location === "/admin/attendance") page = <AdminAttendance data={data} navigate={go} />;
  else if (location === "/admin/finance") page = <AdminFinance data={data} navigate={go} />;
  else if (location === "/admin") page = <AdminDashboard data={data} setData={setData} navigate={go} />;
  else page = <Landing data={data} setData={setData} onApply={() => { go("/portal/apply") }} />;

  return (<><Toaster position="bottom-right" richColors />{page}{apply && null}</>);
}

export default App;
