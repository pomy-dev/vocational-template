import { useState } from "react";
import type { AppData } from "@/lib/types"; // No need for CourseType alias, as we'll use string for state
import { Button } from "@/components/button";
import { toast } from "sonner";
import { Field } from "@/components/field";
import { courses } from "@/lib/data";

export function FeePlanEditor({
  data,
  setData,
}: {
  data: AppData;
  setData: React.Dispatch<React.SetStateAction<AppData>>;
}) {
  const [course, setCourse] = useState<string>(
    (data.feePlans?.[0]?.course as string) || courses[0].name // Initialize with course name string
  );

  const current = data.feePlans?.find(x => x.course === course);
  const [total, setTotal] = useState(String(current?.total || 0));
  const [intervals, setIntervals] = useState(
    current?.intervals.join(", ") || "Monthly, Per term"
  );
  return (
    <section className="portal-card mt-5">
      <p className="eyebrow">Accountant controls</p>
      <h3 className="mt-2 font-display text-2xl">
        Update course fees & instalment intervals
      </h3>
      <div className="mt-4 grid gap-4 md:grid-cols-3">
        <Field label="Course">
          <select
            className="field"
            value={course} // 'course' state is now guaranteed to be a string (the course name)
            onChange={e => {
              const selectedCourseName = e.target.value; // e.target.value is always a string
              setCourse(selectedCourseName);
              const plan = data.feePlans?.find(
                x => x.course === selectedCourseName // Compare with the string course name
              );
              setTotal(String(plan?.total || 0));
              setIntervals(plan?.intervals.join(", ") || "Monthly, Per term");
            }}
          >
            {courses.map((c, id) => (
              <option key={id} value={c.name}> {/* Use c.name as the option's value */}
                {c.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Total course fee (R)">
          <input
            className="field"
            type="number"
            min="0"
            value={total}
            onChange={e => setTotal(e.target.value)}
          />
        </Field>
        <Field label="Payment intervals (comma separated)">
          <input
            className="field"
            value={intervals}
            onChange={e => setIntervals(e.target.value)}
          />
        </Field>
      </div>
      <Button
        className="mt-3"
        onClick={() => {
          const plan = {
            course, // 'course' is already the string name here, correctly typed
            total: Number(total),
            intervals: intervals
              .split(",")
              .map(x => x.trim())
              .filter(Boolean),
            options: ["EFT", "Card", "Cash office"],
          };
          setData(old => ({
            ...old,
            feePlans: (old.feePlans || []).some(x => x.course === course) // Compare with the string course name
              ? old.feePlans!.map(x => (x.course === course ? plan : x))
              : [...(old.feePlans || []), plan],
          }));
          toast.success("Course fee plan updated in the demo ledger.");
        }}
      >
        Save fee plan
      </Button>
    </section>
  );
}



// import { useState } from "react";
// import type { AppData } from "@/lib/types";
// import { Button } from "@/components/button";
// import { toast } from "sonner";
// import { Field } from "@/components/field";
// import { courses } from "@/lib/data";

// export function FeePlanEditor({
//   data,
//   setData,
// }: {
//   data: AppData;
//   setData: React.Dispatch<React.SetStateAction<AppData>>;
// }) {
//   const [course, setCourse] = useState(
//     data.feePlans?.[0]?.course || courses[0]
//   );
//   const current = data.feePlans?.find(x => x.course === course);
//   const [total, setTotal] = useState(String(current?.total || 0));
//   const [intervals, setIntervals] = useState(
//     current?.intervals.join(", ") || "Monthly, Per term"
//   );
//   return (
//     <section className="portal-card mt-5">
//       <p className="eyebrow">Accountant controls</p>
//       <h3 className="mt-2 font-display text-2xl">
//         Update course fees & instalment intervals
//       </h3>
//       <div className="mt-4 grid gap-4 md:grid-cols-3">
//         <Field label="Course">
//           <select
//             className="field"
//             value={course.toString()}
//             onChange={e => {
//               setCourse(e.target.value);
//               const plan = data.feePlans?.find(
//                 x => x.course === e.target.value
//               );
//               setTotal(String(plan?.total || 0));
//               setIntervals(plan?.intervals.join(", ") || "Monthly, Per term");
//             }}
//           >
//             {courses.map((c, id) => (
//               <option key={id}>{c.name}</option>
//             ))}
//           </select>
//         </Field>
//         <Field label="Total course fee (R)">
//           <input
//             className="field"
//             type="number"
//             min="0"
//             value={total}
//             onChange={e => setTotal(e.target.value)}
//           />
//         </Field>
//         <Field label="Payment intervals (comma separated)">
//           <input
//             className="field"
//             value={intervals}
//             onChange={e => setIntervals(e.target.value)}
//           />
//         </Field>
//       </div>
//       <Button
//         className="mt-3"
//         onClick={() => {
//           const plan = {
//             course,
//             total: Number(total),
//             intervals: intervals
//               .split(",")
//               .map(x => x.trim())
//               .filter(Boolean),
//             options: ["EFT", "Card", "Cash office"],
//           };
//           setData(old => ({
//             ...old,
//             feePlans: (old.feePlans || []).some(x => x.course === course)
//               ? old.feePlans!.map(x => (x.course === course ? plan : x))
//               : [...(old.feePlans || []), plan],
//           }));
//           toast.success("Course fee plan updated in the demo ledger.");
//         }}
//       >
//         Save fee plan
//       </Button>
//     </section>
//   );
// }