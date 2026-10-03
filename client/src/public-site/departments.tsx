import { SectionTitle } from "@/components/section-title";
import { departmentCatalog } from "@/lib/data";
import { ChevronDown } from "lucide-react";


// Departments of Study Section Component
export function DepartmentsStudy() {
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