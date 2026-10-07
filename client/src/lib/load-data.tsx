import { AppData } from "./types";
import { seedData } from "./data";

export function loadData(): AppData {
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
        lecturerNotifications:
          parsed.lecturerNotifications ?? seedData.lecturerNotifications,
        tutors: parsed.tutors ?? seedData.tutors,
        lecturers: parsed.lecturers ?? seedData.lecturers,
      };
    } catch {
      return seedData;
    }
  }
  localStorage.setItem("nstc-data", JSON.stringify(seedData));
  return seedData;
}
