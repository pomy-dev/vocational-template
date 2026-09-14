import { isSupabaseConfigured, supabase } from "./supabase";
import type { RegistrationProgramme } from "./types";

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

  // Payment fields (new)
  paymentReference: string;
  amountPaid: number;
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

/** Submits an application through the atomic Supabase database function. */
export async function registerStudent(input: StudentRegistrationInput): Promise<StudentRegistration> {
  if (!isSupabaseConfigured) {
    throw new Error("Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY to .env.local.");
  }

  const { data, error } = await supabase.rpc("register_student", {
    // Personal details
    p_full_name: input.name.trim(),
    p_email: input.email.trim().toLowerCase(),
    p_phone: input.phone.trim() || null,
    p_identity_number: input.identityNumber?.trim() || null, // optional

    // Next of kin
    p_kin_name: input.kinName.trim(),
    p_kin_relationship: input.kinRelationship.trim(),
    p_kin_email: input.kinEmail.trim().toLowerCase() || null,
    p_kin_phone: input.kinPhone.trim() || null,

    // Programmes (array)
    p_programmes: input.programmes,

    // Tracking
    p_application_trace_id: input.applicationTraceId,

    // Photo document
    p_photo_path: input.photo?.path || null,
    p_photo_url: input.photo?.url || null,
    p_photo_name: input.photo?.name || null,
    p_photo_mime: input.photo?.mimeType || null,

    // Payment details (from Paystack)
    p_payment_reference: input.paymentReference,
    p_amount_paid: input.amountPaid,
    p_registration_fee: input.registrationFee ?? 500,
    p_deposit: input.deposit ?? 2000,

    // Optional
    p_campus_id: input.campusId || null,
  });

  if (error) {
    throw new Error(error.message);
  }

  const registration = Array.isArray(data) ? data[0] : data;

  if (!registration?.student_id || !registration?.student_number) {
    throw new Error("Supabase did not return a registration confirmation.");
  }

  return {
    studentId: registration.student_id,
    studentNumber: registration.student_number,
    enrollmentId: registration.enrollment_id,
    paymentReference: registration.payment_reference,
    amountPaid: registration.amount_paid,
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
};

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
};

export async function removeRegistrationFiles(paths: string[]) {
  if (paths.length) await supabase.storage.from("registration-documents").remove(paths);
};
