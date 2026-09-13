import { isSupabaseConfigured, supabase } from "./supabase";
import type { RegistrationProgramme } from "./types";

export type StudentRegistrationInput = {
  name: string;
  email: string;
  phone: string;
  course: string;
  category: string;
  field: string;
  level: string;
  period: string;
  programmes: RegistrationProgramme[];
  kinName: string;
  kinRelationship: string;
  kinEmail: string;
  kinPhone: string;
  applicationTraceId: string;
  photo?: RegistrationFile;
  receipt?: RegistrationFile;
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
};

/** Submits an application through the atomic Supabase database function. */
export async function registerStudent(input: StudentRegistrationInput): Promise<StudentRegistration> {
  if (!isSupabaseConfigured) {
    throw new Error("Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY to .env.local.");
  }

  const { data, error } = await supabase.rpc("register_student_application", {
    p_full_name: input.name.trim(),
    p_email: input.email.trim().toLowerCase(),
    p_phone: input.phone.trim() || null,
    p_course_name: input.course,
    p_category: input.category,
    p_field: input.field,
    p_level: input.level,
    p_examination_period: input.period,
    p_programmes: input.programmes,
    p_guardian_name: input.kinName.trim() || null,
    p_guardian_relationship: input.kinRelationship.trim() || null,
    p_guardian_email: input.kinEmail.trim().toLowerCase() || null,
    p_guardian_phone: input.kinPhone.trim() || null,
    p_application_trace_id: input.applicationTraceId,
    p_photo: input.photo ?? null,
    p_receipt: input.receipt ?? null,
  });

  if (error) throw new Error(error.message);
  const registration = Array.isArray(data) ? data[0] : data;
  if (!registration?.student_id || !registration?.student_number || !registration?.enrollment_id) {
    throw new Error("Supabase did not return a registration confirmation.");
  }

  return {
    studentId: registration.student_id,
    studentNumber: registration.student_number,
    enrollmentId: registration.enrollment_id,
  };
}

export async function uploadRegistrationFile(file: File, traceId: string, kind: "photo" | "receipt"): Promise<RegistrationFile> {
  if (!isSupabaseConfigured) {
    throw new Error("Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY to .env.local.");
  }

  const extension = file.name.includes(".") ? file.name.split(".").pop()?.toLowerCase() : "bin";
  const path = `applications/${traceId}/${kind}-${crypto.randomUUID()}.${extension}`;
  const { error } = await supabase.storage.from("registration-documents").upload(path, file, {
    contentType: file.type || "application/octet-stream",
    upsert: false,
  });
  if (error) throw new Error(`Could not upload ${kind}: ${error.message}`);

  const { data } = supabase.storage.from("registration-documents").getPublicUrl(path);
  return { path, url: data.publicUrl, name: file.name, mimeType: file.type || "application/octet-stream" };
}

export async function uploadRegistrationFiles(files: { photo?: File; receipt?: File }, traceId: string) {
  const uploaded: RegistrationFile[] = [];
  try {
    if (files.photo) uploaded.push(await uploadRegistrationFile(files.photo, traceId, "photo"));
    if (files.receipt) uploaded.push(await uploadRegistrationFile(files.receipt, traceId, "receipt"));
    return {
      photo: uploaded.find((file) => file.path.includes("/photo-")),
      receipt: uploaded.find((file) => file.path.includes("/receipt-")),
    };
  } catch (error) {
    if (uploaded.length) await supabase.storage.from("registration-documents").remove(uploaded.map((file) => file.path));
    throw error;
  }
}

export async function removeRegistrationFiles(paths: string[]) {
  if (paths.length) await supabase.storage.from("registration-documents").remove(paths);
}
