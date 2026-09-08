import { isSupabaseConfigured, supabase } from "./supabase";

export type StudentRegistrationInput = {
  name: string;
  email: string;
  phone: string;
  course: string;
  category: string;
  field: string;
  level: string;
  period: string;
  kinName: string;
  kinRelationship: string;
  kinEmail: string;
  kinPhone: string;
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
    p_guardian_name: input.kinName.trim() || null,
    p_guardian_relationship: input.kinRelationship.trim() || null,
    p_guardian_email: input.kinEmail.trim().toLowerCase() || null,
    p_guardian_phone: input.kinPhone.trim() || null,
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
