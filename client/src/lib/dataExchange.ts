import * as XLSX from "xlsx";

export type ImportCourse = { id: string; course_name: string };
export type ImportSchool = { id: string; courses: ImportCourse[] };
export type ImportStudent = {
  id: string;
  fullname: string;
  dateOfBirth: string;
  contacts: { phone: string; email?: string };
  address: string;
  courses: string[];
  studentNumber: string;
  admissionYear: number;
  year_completed?: number;
  school_id: string;
};

const HEADER_ALIASES: Record<string, string> = {
  fullname: "fullname",
  name: "fullname",
  dateofbirth: "dateOfBirth",
  dob: "dateOfBirth",
  contacts: "contacts",
  phone: "contacts",
  address: "address",
  studentnumber: "studentNumber",
  number: "studentNumber",
  admissionyear: "admissionYear",
  yearcompleted: "year_completed",
  course: "course",
  courses: "course",
};

const cleanKey = (value: unknown) =>
  String(value ?? "").toLowerCase().replace(/[ _-]/g, "");

const excelDateToIso = (value: unknown) => {
  if (typeof value === "number") {
    const date = XLSX.SSF.parse_date_code(value);
    if (date)
      return `${date.y}-${String(date.m).padStart(2, "0")}-${String(date.d).padStart(2, "0")}`;
  }
  const text = String(value ?? "").trim();
  if (!text) return "";
  const parsed = new Date(text);
  return Number.isNaN(parsed.getTime()) ? text : parsed.toISOString().slice(0, 10);
};

const normalizeRow = (row: Record<string, unknown>) =>
  Object.entries(row).reduce<Record<string, unknown>>((acc, [key, value]) => {
    const normalized = HEADER_ALIASES[cleanKey(key)];
    if (normalized) acc[normalized] = value;
    return acc;
  }, {});

/** Levenshtein distance */
function levenshtein(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,      // deletion
        dp[i][j - 1] + 1,      // insertion
        dp[i - 1][j - 1] + cost // substitution
      );
    }
  }
  return dp[m][n];
}

/** Similarity ratio 0–1 (1 = identical) */
function stringSimilarity(a: string, b: string): number {
  const s1 = a.toLowerCase().trim();
  const s2 = b.toLowerCase().trim();
  if (!s1 && !s2) return 1;
  if (!s1 || !s2) return 0;
  if (s1 === s2) return 1;

  const distance = levenshtein(s1, s2);
  const maxLen = Math.max(s1.length, s2.length);
  return 1 - distance / maxLen;
}

/**
 * Find the best matching school course for a spreadsheet value.
 * - Exact id match, or
 * - Exact (case-insensitive) name match, or
 * - Fuzzy name match ≥ 97% similarity
 */
function findMatchingCourse(
  courseText: string,
  courses: ImportCourse[]
): ImportCourse | undefined {
  const text = courseText.trim();
  if (!text || !courses.length) return undefined;

  // 1. Exact ID
  const byId = courses.find((c) => c.id === text);
  if (byId) return byId;

  // 2. Exact name (case-insensitive)
  const exactName = courses.find(
    (c) => c.course_name.toLowerCase() === text.toLowerCase()
  );
  if (exactName) return exactName;

  // 3. Fuzzy match ≥ 97%
  let best: ImportCourse | undefined;
  let bestScore = 0;

  for (const c of courses) {
    const score = stringSimilarity(text, c.course_name);
    if (score > bestScore) {
      bestScore = score;
      best = c;
    }
  }

  return bestScore >= 0.97 ? best : undefined;
}

export async function parseStudentWorkbook(
  file: File,
  school: ImportSchool,
  existing: ImportStudent[]
) {
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: "array", cellDates: false });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = XLSX.utils
    .sheet_to_json<Record<string, unknown>>(sheet, { defval: "" })
    .map(normalizeRow);

  const knownNumbers = new Set(
    existing.map((s) => s.studentNumber.trim().toLowerCase())
  );
  const batchNumbers = new Set<string>();
  const errors: string[] = [];
  const duplicates: string[] = [];
  const students: ImportStudent[] = [];

  rows.forEach((row, index) => {
    const line = index + 2;
    const fullname = String(row.fullname ?? "").trim();
    const studentNumber = String(row.studentNumber ?? "").trim();
    const dateOfBirth = excelDateToIso(row.dateOfBirth);
    const admissionYear = Number(row.admissionYear);
    const completedText = String(row.year_completed ?? "").trim();
    const year_completed = completedText ? Number(completedText) : undefined;
    const courseText = String(row.course ?? "").trim();
    const course = findMatchingCourse(courseText, school.courses);

    // Parse contacts early so we can validate with the rest
    const contacts = String(row.contacts ?? "")
      .split(/[;,|]/)
      .map((v) => v.trim())
      .filter(Boolean);

    const rowErrors: string[] = [];
    if (!fullname) rowErrors.push("fullname is required");
    if (!studentNumber) rowErrors.push("studentNumber is required");
    if (!dateOfBirth || Number.isNaN(new Date(dateOfBirth).getTime()))
      rowErrors.push("dateOfBirth must be a valid date");
    if (
      !Number.isInteger(admissionYear) ||
      admissionYear < 1900 ||
      admissionYear > 2200
    )
      rowErrors.push("admissionYear must be a four-digit year");
    if (
      completedText &&
      (!Number.isInteger(year_completed) ||
        (year_completed as number) < admissionYear)
    )
      rowErrors.push("year_completed must be after admissionYear");
    if (courseText && !course)
      rowErrors.push(
        `course '${courseText}' was not found (no match ≥ 97% with school courses)`
      );
    if (contacts.length > 2)
      rowErrors.push(
        "contacts must be a phone number and an optional email, separated by a comma or semicolon"
      );

    const numberKey = studentNumber.toLowerCase();
    if (knownNumbers.has(numberKey) || batchNumbers.has(numberKey)) {
      duplicates.push(`Row ${line}: ${studentNumber}`);
      return;
    }
    if (rowErrors.length) {
      errors.push(`Row ${line}: ${rowErrors.join(", ")}`);
      return;
    }

    batchNumbers.add(numberKey);

    students.push({
      id: crypto.randomUUID(),
      fullname,
      dateOfBirth,
      contacts: {
        phone: contacts[0] || "",
        email: contacts[1] || "",
      },
      address: String(row.address ?? "").trim() || "Address pending",
      courses: course
        ? [course.id]
        : ([school.courses[0]?.id].filter(Boolean) as string[]),
      studentNumber,
      admissionYear,
      year_completed,
      school_id: school.id,
    });
  });

  return { students, errors, duplicates, totalRows: rows.length };
}

export function exportStudents(
  students: ImportStudent[],
  school: ImportSchool,
  format: "csv" | "xlsx"
) {
  const rows = students.map((s) => {
    const phone = s.contacts?.phone?.trim() || "";
    const email = s.contacts?.email?.trim() || "";
    const contactsStr = [phone, email].filter(Boolean).join("; ");

    return {
      fullname: s.fullname,
      dateOfBirth: s.dateOfBirth,
      contacts: contactsStr,
      address: s.address,
      course:
        school.courses.find((c) => s.courses.includes(c.id))?.course_name ?? "",
      studentNumber: s.studentNumber,
      admissionYear: s.admissionYear,
      year_completed: s.year_completed ?? "",
    };
  });

  const worksheet = XLSX.utils.json_to_sheet(rows);

  // Make every cell locked (default is locked once the sheet is protected)
  const range = XLSX.utils.decode_range(worksheet["!ref"] || "A1");

  // Style header row: UPPERCASE + bold (bold needs xlsx-js-style to show in Excel)
  for (let C = range.s.c; C <= range.e.c; C++) {
    const addr = XLSX.utils.encode_cell({ r: 0, c: C });
    const cell = worksheet[addr];
    if (!cell) continue;

    cell.v = String(cell.v ?? "").toUpperCase();
    cell.t = "s";
    cell.s = {
      font: { bold: true },
      alignment: { vertical: "center", horizontal: "left" },
    };
  }

  for (let R = range.s.r; R <= range.e.r; R++) {
    for (let C = range.s.c; C <= range.e.c; C++) {
      const addr = XLSX.utils.encode_cell({ r: R, c: C });
      if (!worksheet[addr]) continue;
      if (!worksheet[addr].s) worksheet[addr].s = {};
      worksheet[addr].s.protection = { locked: true };
    }
  }

  // Protect the sheet (discourages editing in Excel / compatible apps)
  // Note: full password enforcement needs SheetJS Pro; community build still
  // sets the "protected" flag so users get a lock UI.
  if (format === "xlsx") {
    worksheet["!protect"] = {
      password: "yatolla-readonly",
      sheet: true,
      objects: true,
      scenarios: true,
      selectLockedCells: true,
      selectUnlockedCells: false,
      formatCells: false,
      formatColumns: false,
      formatRows: false,
      insertColumns: false,
      insertRows: false,
      insertHyperlinks: false,
      deleteColumns: false,
      deleteRows: false,
      sort: false,
      autoFilter: false,
      pivotTables: false,
    } as XLSX.ProtectInfo;
  }

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Students");

  XLSX.writeFile(
    workbook,
    `yatolla-students-${new Date().toISOString().slice(0, 10)}.${format}`,
    {
      bookType: format === "csv" ? "csv" : "xlsx",
      // Keep cell styles so protection metadata is more likely to survive
      cellStyles: true,
    }
  );
}