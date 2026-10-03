import { Pill } from "./pill";
import { GraduationCap, Clock3, Check, ArrowRight } from "lucide-react";
import { Course } from "@/lib/types";

// Flip Card Component
export function FlipCard({ course, image }: { course: Course; image?: string }) {
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