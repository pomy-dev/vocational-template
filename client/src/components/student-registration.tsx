import { useEffect, useState } from "react";
import { ApplicationDraft, StudentRegistration, RegistrationProgramme } from "@/lib/types";
import { courses, shortCourses, machineCourses, artisanFields, firstClassFields, weldingFields } from "@/lib/data";
import { useAction } from "@/lib/use-action";
import { registerStudent, sendConfirmationEmail, uploadRegistrationFiles, removeRegistrationFiles } from "@/lib/studentRegistration";
import { Check, ArrowRight, Plus, CircleDollarSign, FileText, ChevronLeft } from "lucide-react";
import { Spinner } from "./spinner";
import { Button } from "./button";

export function Registration({ onComplete }: {
  onComplete: (application?: ApplicationDraft) => void | Promise<void>
}) {
  const [step, setStep] = useState(1);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [registration, setRegistration] = useState<StudentRegistration | null>(null);
  const [receipt, setReceipt] = useState({ name: "", url: "", mimeType: "" });
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState("");
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [subjectLevels, setSubjectLevels] = useState<Record<string, string>>({});
  const [programmes, setProgrammes] = useState<RegistrationProgramme[]>([]);
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

  const [form, setForm] = useState(() => {
    const defaultCategory = "Main Courses" as typeof categories[number];
    const defaultCourseOptions = getCourseOptions(defaultCategory);
    return {
      name: "",
      email: "",
      phone: "",
      identityNumber: "",
      category: defaultCategory,
      field: defaultCategory,
      course: "",
      level: "N1",
      period: "",
      kinName: "",
      kinRelationship: "",
      kinEmail: "",
      kinPhone: ""
    };
  });

  const { loading, run } = useAction();
  const isMainCourse = form.category === "Main Courses";
  const selectedCourse = isMainCourse ? courses.find((course) => course.name === form.course) : undefined;
  const selectedSubjects = selectedCourse?.subjects ?? [];
  // const chosenSubjects = Object.entries(subjectLevels).map(([name, level]) => ({ name, level }));

  // Keep course in sync when category changes
  useEffect(() => {
    const options = getCourseOptions(form.category);
    if (options.length > 0 && !options.includes(form.course)) {
      setForm(prev => ({ ...prev, course: options[0] }));
      setSubjectLevels({});
    }
  }, [form.category]);

  const registrationFee = 500;
  // const totalAmount = registrationFee + Number(deposit);

  const currentProgramme = (): RegistrationProgramme => ({
    course: form.course,
    category: form.category,
    field: form.field,
    level: form.level,
    period: form.period,
    subjects: Object.entries(subjectLevels).map(([name, level]) => ({ name, level })),
    // subjects: chosenSubjects,
  });

  const resetProgrammeEditor = () => {
    const defaultCategory = categories[0];
    const defaultCourse = getCourseOptions(defaultCategory)[0] || "";
    setSubjectLevels({});
    setForm((old) => ({ ...old, category: defaultCategory, field: defaultCategory, course: defaultCourse, level: "N1", period: "Trimester 1" }));
  };

  const commitCurrentProgramme = (allowExisting = false) => {
    const programme = currentProgramme();
    if (!programme.course) {
      setError("Select a programme before adding it.");
      return false;
    }
    if (programmes.some((item) => item.course === programme.course && item.category === programme.category)) {
      if (allowExisting) return true;
      setError("That programme has already been added. Choose another programme.");
      return false;
    }
    setProgrammes((old) => [...old, programme]);
    setError("");
    setSubjectLevels({});
    return true;
  };

  const update = (key: string, value: string) => {
    if (key === "category" || key === "course") setSubjectLevels({});
    setForm((old) => {
      const newForm = { ...old, [key]: value };
      if (key === "category" && old.category !== value) {
        const nextCategory = value as typeof categories[number];
        const newOptions = getCourseOptions(nextCategory);
        newForm.field = nextCategory;
        if (newOptions.length > 0) {
          newForm.course = newOptions[0];
        } else {
          newForm.course = "";
        }
      }
      return newForm;
    });
  };

  const next = async () => {
    setError("");
    if (step === 1) {
      if (!form.name.trim() || !form.email.trim() || !form.phone.trim() || !photoFile || !form.kinName.trim() || !form.kinRelationship.trim() || !form.kinEmail.trim() || !form.kinPhone.trim()) {
        setError("Complete all learner, identity and next-of-kin fields before continuing.");
        return;
      }
      if (!/^\S+@\S+\.\S+$/.test(form.email.trim()) || !/^\S+@\S+\.\S+$/.test(form.kinEmail.trim())) {
        setError("Enter valid email addresses before continuing.");
        return;
      }
    }
    if (step === 2) {
      const currentProgrammeObject = currentProgramme();
      const isCurrentProgrammeSelected = !!currentProgrammeObject.course;
      const isCurrentProgrammeAlreadyAdded = programmes.some(p => p.course === currentProgrammeObject.course && p.category === currentProgrammeObject.category);

      // if (isCurrentProgrammeSelected && !isCurrentProgrammeAlreadyAdded) {
      //   if (!commitCurrentProgramme()) {
      //     return;
      //   }
      // }

      if (programmes.length === 0) {
        setError("Select at least one programme to continue.");
        return;
      }
      setError("");
    }
    if (step === 3) {
      if (!receiptFile || !receiptFile.type.startsWith("image/") || receiptFile.size > 5 * 1024 * 1024) {
        setError("Upload a valid receipt image (PNG, JPEG or WebP, maximum 5 MB) before continuing.");
        return;
      }
      setStep(4);
      return;
    }
    if (step < 3) {
      setStep(step + 1);
      return;
    }
    if (step === 4) {
      setError("");
      let uploadedPaths: string[] = [];
      try {
        await run(async () => {
          const { photo: uploadedPhoto, receipt: uploadedReceipt } = await uploadRegistrationFiles({
            photo: photoFile ?? undefined,
            receipt: receiptFile ?? undefined,
          }, applicationTraceId);
          uploadedPaths = [uploadedPhoto?.path, uploadedReceipt?.path].filter((path): path is string => Boolean(path));
          const created = await registerStudent({
            ...form,
            programmes: programmes.some((item) => item.course === form.course && item.category === form.category)
              ? programmes
              : [...programmes, currentProgramme()],
            applicationTraceId,
            photo: uploadedPhoto || null,
            receipt: uploadedReceipt
          });
          setRegistration(created);

          await sendConfirmationEmail(
            form.email, form.name, created.studentNumber,
            uploadedReceipt?.url, `T252436z63tY73728`,
            registrationFee, programmes
          );
        });
        setDone(true);
      } catch (submissionError) {
        await removeRegistrationFiles(uploadedPaths);
        setError(submissionError instanceof Error ? submissionError.message : "Registration could not be submitted.");
      }
    }
  };

  if (done)
    return (
      <div className="registration-card" role="dialog" aria-labelledby="registration-success-title" aria-describedby="registration-success-description">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
          <Check className="h-8 w-8" />
        </div>
        <p className="mt-6 eyebrow">Application complete</p>
        <h2 id="registration-success-title" className="mt-2 font-display text-4xl text-slate-950">Welcome to NSTC.</h2>
        <p id="registration-success-description" className="mt-4 max-w-lg text-sm leading-6 text-slate-600">Your provisional student number is <strong className="text-slate-950">{registration?.studentNumber}</strong>. Admissions will verify your documents and confirm your orientation schedule.</p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Button onClick={() => {
            // registration && onComplete({ ...form, ...(programmes[0] || currentProgramme()), programmes, receipt, registration })
          }}>Open student dashboard <ArrowRight className="h-4 w-4" /></Button>
          <a className="btn btn-light" href="/">Back to website</a>
        </div>
      </div>
    );

  return (
    <div className="registration-card">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="eyebrow">Application journey</p>
          <h1 className="mt-2 font-display text-4xl text-slate-950">Join the NSTC community.</h1>
        </div>
        <span className="text-sm font-semibold text-slate-400">Step {step} of 4</span>
      </div>
      <div className="mt-7 flex gap-2">
        {[1, 2, 3, 4].map((s) =>
          <div className={`h-1.5 flex-1 rounded-full ${s <= step ? "bg-[#D4AF37]" : "bg-slate-100"}`} key={s} />
        )}
      </div>
      {
        step === 1 &&
        <div className="mt-10 space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <label>Full name
              <input value={form.name} onChange={(e) => update("name", e.target.value)} className="field" placeholder="e.g. Thabo Mokoena" />
            </label>
            <label>Email address
              <input value={form.email} onChange={(e) => update("email", e.target.value)} className="field" type="email" placeholder="name@email.com" />
            </label>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 mt-6">
            <label>Mobile number
              <input value={form.phone} onChange={(e) => update("phone", e.target.value)} className="field" placeholder="+27 ..." />
            </label>

            <label>Indenty Number
              <input value={form.identityNumber} onChange={(e) => update("identityNumber", e.target.value)} className="field" placeholder="000102xxxxxxxxxx" />
            </label>
          </div>

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

          {/* <label>Identity document / passport
            <input className="field" type="file" accept=".png,.jpg,.jpeg" onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                setPhotoFile(file);
                setPhoto({
                  name: file.name,
                  url: URL.createObjectURL(file),
                  mimeType: file.type,
                });
              } else {
                setPhotoFile(null);
                setPhoto({ name: "", url: "", mimeType: "" });
              }
            }} />
          </label> */}

          <div className="rounded-xl border border-slate-200 p-4 mt-6">
            <p className="eyebrow text-[#a27e10]">Next of kin</p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <label>Full name
                <input value={form.kinName} onChange={(e) => update("kinName", e.target.value)} className="field" placeholder="Parent / guardian name" />
              </label>
              <label>Relationship
                <input value={form.kinRelationship} onChange={(e) => update("kinRelationship", e.target.value)} className="field" placeholder="e.g. Mother" />
              </label>
              <label>Email
                <input value={form.kinEmail} onChange={(e) => update("kinEmail", e.target.value)} className="field" type="email" placeholder="family@email.com" />
              </label>
              <label>Phone
                <input value={form.kinPhone} onChange={(e) => update("kinPhone", e.target.value)} className="field" placeholder="+27 ..." />
              </label>
            </div>
          </div>
        </div>
      }
      {step === 2 &&
        <div className="mt-10 space-y-5">
          {programmes.length > 0 &&
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
              <p className="eyebrow text-emerald-700">Added programmes</p>
              <div className="mt-3 space-y-2">
                {programmes.map((programme, index) =>
                  <div className="flex items-center justify-between gap-3 rounded-lg bg-white p-3 text-sm" key={`${programme.course}-${index}`}>
                    <div>
                      <p className="font-semibold text-slate-950">{programme.course}</p>
                      <p className="mt-1 text-xs text-slate-500">{programme.subjects.length} subject(s) · {programme.subjects.map((subject) => `${subject.name} (${subject.level})`).join(", ") || "No individual subjects"}</p>
                    </div>
                    <button type="button" className="text-xs font-bold text-red-600" onClick={() => setProgrammes((old) => old.filter((_, itemIndex) => itemIndex !== index))}>Remove</button>
                  </div>
                )}
              </div>
            </div>
          }
          <div>
            <p className="field-label">Field of study</p>
            <div className="mt-2 flex flex-wrap gap-2" role="group" aria-label="Field of study categories">
              {categories.map((category) =>
                <button
                  key={category}
                  type="button"
                  className={`filter-chip ${form.category === category ? "active" : ""}`}
                  onClick={() => update("category", category)}
                  aria-pressed={form.category === category}
                >
                  {category}
                </button>
              )}
            </div>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <label>Programme
              <select value={form.course} onChange={(e) => update("course", e.target.value)} className="field">
                {getCourseOptions(form.category as typeof categories[number]).map((course) =>
                  <option key={course}>{course}</option>
                )}
              </select>
            </label>

            <label>Examination period
              <select disabled={!isMainCourse} value={form.period} onChange={(e) => update("period", e.target.value)} className="field">
                <option>Trimester 1</option>
                <option>Trimester 2</option>
                <option>Trimester 3</option>
              </select>
            </label>
          </div>

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

          {/* <div>
            <p className="field-label">Select subjects / modules</p>
            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              {selectedSubjects.map((s, i) =>
                <label key={i} className="check-option">
                  <input type="checkbox" checked={Boolean(subjectLevels[s.name])} onChange={(e) => setSubjectLevels((old) => {
                    const next = { ...old };
                    if (e.target.checked) next[s.name] = s.level[0] || "";
                    else delete next[s.name];
                    return next;
                  })} disabled={!isMainCourse} />
                  <span className="flex flex-1 items-center justify-between gap-2">{s.name}
                    {subjectLevels[s.name] && <select className="field mt-0 w-32 py-2" value={subjectLevels[s.name]} onChange={(e) => setSubjectLevels((old) => ({ ...old, [s.name]: e.target.value }))}>
                      {s.level.map((level) => <option key={level} value={level}>{level}</option>)}
                    </select>}
                  </span>
                </label>
              )}
              {!selectedSubjects.length && <p className="text-sm text-slate-400">Subjects and modules are available for Main Courses.</p>}
            </div>
          </div> */}


          <div className="flex justify-end border-t border-slate-100 pt-4">
            <Button variant="light" onClick={() => { if (commitCurrentProgramme()) resetProgrammeEditor(); }}>
              <Plus className="h-4 w-4" /> Add another programme
            </Button>
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
            <p className="mt-3 text-sm leading-6 text-slate-600">Registration is R500.00 plus a R2,000.00 deposit. Both amounts are non-refundable once the application is submitted.</p>
          </div>
          <div className="rounded-xl border border-slate-200 p-4 text-sm text-slate-600">
            <strong className="text-slate-950">Bank transfer registration</strong><br />
            First National Bank · Business Account · 62447593436 · Branch 250655<br />
            Reference: Initials & Surname
          </div>
          <label className="block">Payment receipt image or document
            <input className="field" type="file" accept=".png,.jpg,.jpeg" onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                setReceiptFile(file);
                setReceipt({
                  name: file.name,
                  url: URL.createObjectURL(file),
                  mimeType: file.type,
                });
              } else {
                setReceiptFile(null);
                setReceipt({ name: "", url: "", mimeType: "" });
              }
            }} />
            <span className="mt-2 block text-xs font-normal text-slate-400">Upload a receipt as evidence of payment. A preview will appear before completion.</span>
          </label>

          {receipt.name &&
            <div className="receipt-preview">
              <FileText className="h-5 w-5 text-[#a27e10]" />
              <span>{receipt.name}</span>
              <span className="ml-auto text-xs font-semibold text-emerald-700">Ready to attach</span>
            </div>
          }
        </div>
      }
      {step === 4 &&
        <div className="mt-10 space-y-5">
          <p className="eyebrow text-[#a27e10]">Review before saving</p>
          <div className="grid gap-4 rounded-xl border border-slate-200 p-5 text-sm sm:grid-cols-2">
            <p><strong className="text-slate-950">Learner</strong><br />{form.name}<br />{form.email}<br />{form.phone}</p>
            <p><strong className="text-slate-950">Next of kin</strong><br />{form.kinName} ({form.kinRelationship})<br />{form.kinEmail}<br />{form.kinPhone}</p>
            <p><strong className="text-slate-950">Programmes</strong><br />{programmes.map((programme) => `${programme.course} (${programme.period})`).join("; ")}</p>
            <p><strong className="text-slate-950">Payment evidence</strong><br />{receipt.name}<br /><span className="text-emerald-700">Receipt image validated</span></p>
          </div>
          <div className="rounded-xl bg-slate-50 p-5 text-sm">
            <strong className="text-slate-950">Selected subjects and levels</strong>
            <div className="mt-2 space-y-3">
              {programmes.length > 0 ? (
                programmes.map((programme) =>
                  <div key={programme.course}>
                    <p className="font-semibold text-slate-800">{programme.course}</p>
                    <p className="mt-1 text-slate-500">
                      {programme.subjects.map((subject) => `${subject.name} · ${subject.level}`).join(", ") || "No individual subjects selected."}
                    </p>
                  </div>
                )
              ) : (
                <p className="text-slate-500">No programmes selected.</p>
              )}
            </div>
          </div>
        </div>
      }
      {error && <p className="mt-6 rounded-lg bg-red-50 p-3 text-sm leading-6 text-red-700" role="alert">{error}</p>}

      <div className="mt-10 flex justify-between gap-3">
        <Button variant="light" onClick={() => step === 1 ? onComplete() : setStep(step - 1)}>
          {step === 1
            ? "Cancel"
            : <><ChevronLeft className="h-4 w-4" /> Back</>
          }
        </Button>
        <Button onClick={next} disabled={loading}>
          {loading ? <Spinner label="Saving" />
            : step === 4
              ? <>Complete application <Check className="h-4 w-4" /></>
              : <>Continue <ArrowRight className="h-4 w-4" /></>
          }
        </Button>
      </div>
    </div>
  );
}

// Student Registration Component
// function Registration({ onComplete }: {
//   onComplete: (application?: ApplicationDraft) => void | Promise<void>
// }) {
//   const [step, setStep] = useState(1);
//   const [done, setDone] = useState(false);
//   const [error, setError] = useState("");
//   const [registration, setRegistration] = useState<StudentRegistration | null>(null);
//   const [photoFile, setPhotoFile] = useState<File | null>(null);
//   const [photoPreview, setPhotoPreview] = useState("");
//   const [subjectLevels, setSubjectLevels] = useState<Record<string, string>>({});
//   const [programmes, setProgrammes] = useState<RegistrationProgramme[]>([]);
//   const [deposit, setDeposit] = useState(2000);
//   const [paying, setPaying] = useState(false);
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

//   const [form, setForm] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     category: "Main Courses" as typeof categories[number],
//     field: "Main Courses",
//     course: "",
//     level: "N1",
//     period: "Trimester 2",
//     kinName: "",
//     kinRelationship: "",
//     kinEmail: "",
//     kinPhone: ""
//   });

//   const { loading, run } = useAction();
//   const isMainCourse = form.category === "Main Courses";
//   const selectedCourse = isMainCourse ? courses.find((c) => c.name === form.course) : undefined;
//   const selectedSubjects = selectedCourse?.subjects ?? [];

//   // Keep course in sync when category changes
//   useEffect(() => {
//     const options = getCourseOptions(form.category);
//     if (options.length > 0 && !options.includes(form.course)) {
//       setForm(prev => ({ ...prev, course: options[0] }));
//       setSubjectLevels({});
//     }
//   }, [form.category]);

//   const currentProgramme = (): RegistrationProgramme => ({
//     course: form.course,
//     category: form.category,
//     field: form.field,
//     level: form.level,
//     period: form.period,
//     subjects: Object.entries(subjectLevels).map(([name, level]) => ({ name, level })),
//   });

//   const update = (key: string, value: string) => {
//     setForm(prev => {
//       const next = { ...prev, [key]: value };
//       if (key === "category") {
//         next.field = value;
//         next.course = getCourseOptions(value as any)[0] || "";
//         setSubjectLevels({});
//       }
//       if (key === "course") setSubjectLevels({});
//       return next;
//     });
//   };

//   const addProgramme = () => {
//     const programme = currentProgramme();

//     if (!programme.course) {
//       setError("Please select a programme first.");
//       return;
//     }

//     const alreadyExists = programmes.some(
//       p => p.course === programme.course && p.category === programme.category
//     );

//     if (alreadyExists) {
//       setError("This programme has already been added.");
//       return;
//     }

//     // For Main Courses we recommend at least one subject, but we don't force it
//     setProgrammes(prev => [...prev, programme]);
//     setError("");

//     // Reset editor for next programme
//     setSubjectLevels({});
//   };

//   const removeProgramme = (index: number) => {
//     setProgrammes(prev => prev.filter((_, i) => i !== index));
//   };

//   const next = async () => {
//     setError("");

//     // Step 1 validation
//     if (step === 1) {
//       if (!form.name.trim() || !form.email.trim() || !form.phone.trim() || !photoFile ||
//         !form.kinName.trim() || !form.kinRelationship.trim() || !form.kinEmail.trim() || !form.kinPhone.trim()) {
//         setError("Please complete all personal details, ID document and next-of-kin information.");
//         return;
//       }
//       if (!/^\S+@\S+\.\S+$/.test(form.email) || !/^\S+@\S+\.\S+$/.test(form.kinEmail)) {
//         setError("Please enter valid email addresses.");
//         return;
//       }
//       setStep(2);
//       return;
//     }

//     // Step 2 validation
//     if (step === 2) {
//       if (programmes.length === 0) {
//         setError("Please add at least one programme before continuing.");
//         return;
//       }
//       setStep(3);
//       return;
//     }

//     // Step 3 → go to payment
//     if (step === 3) {
//       setStep(4);
//       return;
//     }
//   };

//   // ========== PAYSTACK PAYMENT ==========
//   const handlePayment = async () => {
//     setError("");
//     setPaying(true);

//     const registrationFee = 500;
//     const totalAmount = registrationFee + Number(deposit);

//     if (isNaN(totalAmount) || totalAmount < 500) {
//       setError("Please enter a valid deposit amount.");
//       setPaying(false);
//       return;
//     }

//     try {
//       const res = await fetch("http://localhost:5000/api/payment/initialize", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           email: form.email,
//           amount: totalAmount, // Total in Rands
//           metadata: {
//             applicationTraceId,
//             studentName: form.name,
//             registrationFee,
//             deposit: Number(deposit),
//             programmes: programmes.map(p => p.course).join(", ")
//           }
//         })
//       });

//       const data = await res.json();

//       if (!data.success) {
//         throw new Error(data.error || "Could not initialize payment");
//       }

//       const popup = new PaystackPop();
//       popup.resumeTransaction(data.access_code, {
//         onSuccess: async (transaction) => {
//           try {
//             await run(async () => {
//               const { photo: uploadedPhoto } = await uploadRegistrationFiles(
//                 { photo: photoFile ?? undefined },
//                 applicationTraceId
//               );

//               const created = await registerStudent({
//                 ...form,
//                 programmes,
//                 applicationTraceId,
//                 photo: uploadedPhoto,
//                 paymentReference: transaction.reference,
//                 amountPaid: totalAmount,
//                 registrationFee: 500,
//                 deposit: Number(deposit),
//               });

//               setRegistration(created);
//               setDone(true);

//               await sendConfirmationEmail(form.email, form.name, created.studentNumber, transaction.reference, totalAmount, programmes);
//             });
//           } catch (err: any) {
//             setError(
//               err.message ||
//               `Payment succeeded but registration failed. Please contact support with reference: ${transaction.reference}`
//             );
//           } finally {
//             setPaying(false);
//           }
//         },
//         onCancel: () => {
//           setPaying(false);
//           setError("Payment was cancelled. You can try again.");
//         }
//       });
//     } catch (err: any) {
//       setPaying(false);
//       setError(err.message || "Payment could not be started. Please try again.");
//     }
//   };

//   // ========== SUCCESS SCREEN ==========
//   if (done && registration) {
//     return (
//       <div className="registration-card text-center max-w-lg mx-auto">
//         <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
//           <Check className="h-10 w-10" strokeWidth={2.5} />
//         </div>

//         <p className="mt-8 eyebrow text-emerald-700">Application successful</p>

//         <h2 className="mt-3 font-display text-4xl text-slate-950">
//           Welcome to NSTC
//         </h2>

//         <p className="mt-4 text-slate-600 leading-relaxed">
//           Your registration has been received and payment confirmed.
//         </p>

//         {/* Important details card */}
//         <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-6 text-left space-y-4">
//           <div>
//             <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Provisional Student Number</p>
//             <p className="mt-1 text-2xl font-bold text-slate-900 tracking-wide">
//               {registration.studentNumber}
//             </p>
//           </div>

//           <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-200">
//             <div>
//               <p className="text-xs font-medium text-slate-500">Payment Reference</p>
//               <p className="mt-1 font-mono text-sm text-slate-800 break-all">
//                 {registration.paymentReference}
//               </p>
//             </div>
//             <div>
//               <p className="text-xs font-medium text-slate-500">Amount Paid</p>
//               <p className="mt-1 font-semibold text-slate-900">
//                 R{Number(registration.amountPaid).toLocaleString()}
//               </p>
//             </div>
//           </div>
//         </div>

//         <div className="mt-8 rounded-xl bg-blue-50 p-5 text-sm text-blue-900 text-left">
//           <p className="font-semibold mb-1">What happens next?</p>
//           <ul className="list-disc list-inside space-y-1 text-blue-800">
//             <li>Admissions will verify your documents</li>
//             <li>You will receive an email confirmation shortly</li>
//             <li>Orientation details will be sent to your email</li>
//           </ul>
//         </div>

//         <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
//           <Button
//             onClick={() => onComplete(registration as any)}
//             className="w-full sm:w-auto"
//           >
//             Open Student Dashboard
//             <ArrowRight className="h-4 w-4 ml-2" />
//           </Button>

//           <a
//             href="/"
//             className="btn btn-light w-full sm:w-auto text-center"
//           >
//             Back to Website
//           </a>
//         </div>
//       </div>
//     );
//   }

//   // if (done) {
//   //   return (
//   //     <div className="registration-card text-center">
//   //       <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
//   //         <Check className="h-8 w-8" />
//   //       </div>
//   //       <p className="mt-6 eyebrow">Application complete</p>
//   //       <h2 className="mt-2 font-display text-4xl text-slate-950">Welcome to NSTC</h2>
//   //       <p className="mt-4 max-w-lg mx-auto text-sm leading-6 text-slate-600">
//   //         Your provisional student number is <strong>{registration?.studentNumber}</strong>.
//   //         Admissions will verify your documents and confirm your orientation schedule.
//   //       </p>
//   //       <div className="mt-8 flex flex-wrap justify-center gap-3">
//   //         <Button onClick={() => onComplete(registration as any)}>
//   //           Open student dashboard <ArrowRight className="h-4 w-4" />
//   //         </Button>
//   //         <a className="btn btn-light" href="/">Back to website</a>
//   //       </div>
//   //     </div>
//   //   );
//   // }

//   return (
//     <div className="registration-card">
//       {/* Header */}
//       <div className="flex flex-wrap items-center justify-between gap-4">
//         <div>
//           <p className="eyebrow">Application journey</p>
//           <h1 className="mt-2 font-display text-4xl text-slate-950">Join the NSTC community</h1>
//         </div>
//         <span className="text-sm font-semibold text-slate-400">Step {step} of 4</span>
//       </div>

//       {/* Progress bar */}
//       <div className="mt-7 flex gap-2">
//         {[1, 2, 3, 4].map((s) => (
//           <div key={s} className={`h-1.5 flex-1 rounded-full ${s <= step ? "bg-[#D4AF37]" : "bg-slate-100"}`} />
//         ))}
//       </div>

//       {/* ========== STEP 1: Personal Details ========== */}
//       {step === 1 && (
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

//           <div className="grid gap-5 sm:grid-cols-2 mt-6">
//             <label>Identity document / passport
//               <input
//                 className="field"
//                 type="file"
//                 accept="image/png,image/jpeg,image/webp"
//                 onChange={(e) => {
//                   const file = e.target.files?.[0];
//                   if (file) {
//                     setPhotoFile(file);
//                     setPhotoPreview(URL.createObjectURL(file));
//                   }
//                 }}
//               />
//             </label>

//             {photoPreview && (
//               <div className="mt-3">
//                 <img src={photoPreview} alt="ID preview" className="w-15 h-15 rounded-full object-stretch border" />
//               </div>
//             )}
//           </div>

//           <div className="rounded-xl border border-slate-200 p-5 mt-6">
//             <p className="eyebrow text-[#a27e10]">Next of kin</p>
//             <div className="mt-4 grid gap-4 sm:grid-cols-2">
//               <label>Full name
//                 <input value={form.kinName} onChange={(e) => update("kinName", e.target.value)} className="field" />
//               </label>
//               <label>Relationship
//                 <input value={form.kinRelationship} onChange={(e) => update("kinRelationship", e.target.value)} className="field" placeholder="e.g. Mother" />
//               </label>
//               <label>Email
//                 <input value={form.kinEmail} onChange={(e) => update("kinEmail", e.target.value)} className="field" type="email" />
//               </label>
//               <label>Phone
//                 <input value={form.kinPhone} onChange={(e) => update("kinPhone", e.target.value)} className="field" />
//               </label>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ========== STEP 2: Programmes ========== */}
//       {step === 2 && (
//         <div className="mt-10 space-y-6">
//           {/* Already added programmes */}
//           {programmes.length > 0 && (
//             <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
//               <p className="eyebrow text-emerald-700">Selected programmes ({programmes.length})</p>
//               <div className="mt-3 space-y-2">
//                 {programmes.map((p, idx) => (
//                   <div key={idx} className="flex items-center justify-between rounded-lg bg-white p-3 text-sm">
//                     <div>
//                       <p className="font-semibold text-slate-950">{p.course}</p>
//                       <p className="text-xs text-slate-500 mt-1">
//                         {p.category} · {p.period}
//                         {p.subjects.length > 0 && ` · ${p.subjects.map(s => `${s.name} (${s.level})`).join(", ")}`}
//                       </p>
//                     </div>
//                     <button type="button" onClick={() => removeProgramme(idx)} className="text-xs font-bold text-red-600">
//                       Remove
//                     </button>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}

//           {/* Category selector */}
//           <div>
//             <p className="field-label">Field of study</p>
//             <div className="mt-2 flex flex-wrap gap-2">
//               {categories.map((cat) => (
//                 <button
//                   key={cat}
//                   type="button"
//                   className={`filter-chip ${form.category === cat ? "active" : ""}`}
//                   onClick={() => update("category", cat)}
//                 >
//                   {cat}
//                 </button>
//               ))}
//             </div>
//           </div>

//           <div className="grid gap-5 sm:grid-cols-2">
//             <label>Programme
//               <select value={form.course} onChange={(e) => update("course", e.target.value)} className="field">
//                 {getCourseOptions(form.category).map((c) => (
//                   <option key={c} value={c}>{c}</option>
//                 ))}
//               </select>
//             </label>

//             <label>Examination period
//               <select
//                 value={form.period}
//                 onChange={(e) => update("period", e.target.value)}
//                 className="field"
//                 disabled={!isMainCourse}
//               >
//                 <option>Trimester 1</option>
//                 <option>Trimester 2</option>
//                 <option>Trimester 3</option>
//               </select>
//             </label>
//           </div>

//           {/* Subjects (only for Main Courses) */}
//           {isMainCourse && selectedSubjects.length > 0 && (
//             <div>
//               <p className="field-label">Select subjects & levels</p>
//               <div className="mt-2 grid gap-2 sm:grid-cols-2">
//                 {selectedSubjects.map((s) => (
//                   <label key={s.name} className="check-option">
//                     <input
//                       type="checkbox"
//                       checked={Boolean(subjectLevels[s.name])}
//                       onChange={(e) => {
//                         setSubjectLevels(prev => {
//                           const next = { ...prev };
//                           if (e.target.checked) next[s.name] = s.level[0] || "N1";
//                           else delete next[s.name];
//                           return next;
//                         });
//                       }}
//                     />
//                     <span className="flex flex-1 items-center justify-between gap-2">
//                       {s.name}
//                       {subjectLevels[s.name] && (
//                         <select
//                           className="field mt-0 w-28 py-1.5 text-sm"
//                           value={subjectLevels[s.name]}
//                           onChange={(e) => setSubjectLevels(prev => ({ ...prev, [s.name]: e.target.value }))}
//                         >
//                           {s.level.map((lvl) => (
//                             <option key={lvl} value={lvl}>{lvl}</option>
//                           ))}
//                         </select>
//                       )}
//                     </span>
//                   </label>
//                 ))}
//               </div>
//             </div>
//           )}

//           <div className="flex justify-end border-t border-slate-100 pt-4">
//             <Button variant="light" onClick={addProgramme}>
//               <Plus className="h-4 w-4" /> Add this programme
//             </Button>
//           </div>
//         </div>
//       )}

//       {/* ========== STEP 3: Review ========== */}
//       {step === 3 && (
//         <div className="mt-10 space-y-5">
//           <p className="eyebrow text-[#a27e10]">Review your application</p>

//           <div className="grid gap-4 rounded-xl border border-slate-200 p-5 text-sm sm:grid-cols-2">
//             <div>
//               <strong className="text-slate-950">Learner</strong><br />
//               {form.name}<br />{form.email}<br />{form.phone}
//             </div>
//             <div>
//               <strong className="text-slate-950">Next of kin</strong><br />
//               {form.kinName} ({form.kinRelationship})<br />
//               {form.kinEmail}<br />{form.kinPhone}
//             </div>
//             <div className="sm:col-span-2">
//               <strong className="text-slate-950">Programmes</strong>
//               <ul className="mt-1 space-y-1">
//                 {programmes.map((p, i) => (
//                   <li key={i}>
//                     {p.course} · {p.period}
//                     {p.subjects.length > 0 && (
//                       <span className="text-slate-500"> — {p.subjects.map(s => `${s.name} (${s.level})`).join(", ")}</span>
//                     )}
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ========== STEP 4: Payment ========== */}
//       {step === 4 && (
//         <div className="mt-10 space-y-6">
//           <div className="rounded-xl bg-[#fbf7e8] p-6">
//             <div className="flex items-start justify-between">
//               <div>
//                 <p className="eyebrow text-[#a27e10]">Registration fee</p>
//                 <h3 className="mt-2 font-display text-3xl text-slate-950">R500.00</h3>
//               </div>
//               <div>
//                 <p className="eyebrow text-[#a27e10]">Deposit fee</p>
//                 <h3 className="mt-2 font-display text-3xl text-slate-950">R2000.00</h3>
//               </div>
//               <CircleDollarSign className="text-[#a27e10]" />
//             </div>
//             <p className="mt-3 text-sm leading-6 text-slate-600">
//               This non-refundable registration fee secures your place.
//               A deposit is required upfront for full enrollment.
//             </p>
//           </div>

//           <div>
//             <label className="block">
//               <span className="field-label">Deposit amount (R)</span>
//               <input
//                 type="number"
//                 min="0"
//                 step="100"
//                 value={deposit}
//                 onChange={(e) => setDeposit(Number(e.target.value))}
//                 className="field mt-1"
//                 placeholder="2000"
//               />
//             </label>
//             <p className="mt-2 text-xs text-slate-500">
//               Default is R2,000. You may increase or decrease the deposit if needed.
//             </p>
//           </div>

//           <div className="rounded-xl border border-slate-200 p-5 text-sm text-slate-600">
//             You will complete payment securely via Paystack (Card, Instant EFT, SnapScan, Capitec Pay, etc.).
//           </div>
//         </div>
//       )}

//       {/* Error message */}
//       {error && (
//         <p className="mt-6 rounded-lg bg-red-50 p-3 text-sm leading-6 text-red-700" role="alert">
//           {error}
//         </p>
//       )}

//       {/* Navigation buttons */}
//       <div className="mt-10 flex justify-between gap-3">
//         <Button
//           variant="light"
//           onClick={() => step === 1 ? onComplete() : setStep(step - 1)}
//           disabled={paying || loading}
//         >
//           {step === 1 ? "Cancel" : <><ChevronLeft className="h-4 w-4" /> Back</>}
//         </Button>

//         {step < 4 ? (
//           <Button onClick={next} disabled={loading}>
//             Continue <ArrowRight className="h-4 w-4" />
//           </Button>
//         ) : (
//           <Button onClick={handlePayment} disabled={paying || loading}>
//             {paying ? <Spinner label="Processing payment..." /> : <>Pay R{(500 + Number(deposit || 0)).toLocaleString()} & Complete Application</>}
//           </Button>
//         )}
//       </div>
//     </div>
//   );
// }