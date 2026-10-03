import { useState } from "react";
import { AppData } from "@/lib/types";
import { LecturerAuth } from "./lecturer-auth";
import { LecturerOverview } from "./lecturer-overview";
import { LecturerStudents } from "./lecturer-students";
import { LecturerResources } from "./lecturer-resources";
import { LecturerAttendance } from "./lecture-attendance";
import { LecturerResults } from "./lecturer-results";
import { LecturerSubmissions } from "./lecturer-submissions";
import { LecturerAnnouncements } from "./lecturer-announcemnets";
import { LecturerComplaints } from "./lecturer-complaints";
import { LecturerSchedules } from "./lecturer-schedules";
import { LecturerShell } from "./lecturer-shell";



export function LecturerPortal({ data, setData, path, navigate }: {
  data: AppData;
  setData: React.Dispatch<React.SetStateAction<AppData>>;
  path: string;
  navigate: (path: string) => void
}) {

  const [loggedIn, setLoggedIn] = useState(() => localStorage.getItem("nstc-lecturer-session") === "active");

  if (!loggedIn) return <LecturerAuth onAuthenticated={() => setLoggedIn(true)} />;

  const active = path === "/lecturer"
    ? "/lecturer"
    : ["students", "resources", "attendance", "results", "submissions", "announcements", "schedules", "complaints"].map((item) => `/lecturer/${item}`).find((item) => path.startsWith(item)) || "/lecturer";

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
                : active === "/lecturer/complaints"
                  ? <LecturerComplaints data={data} setData={setData} />
                  : <LecturerSchedules data={data} setData={setData} />;

  return (
    <LecturerShell active={active} data={data} onNavigate={navigate}
      onSignOut={() => {
        localStorage.removeItem("nstc-lecturer-session");
        setLoggedIn(false);
      }}>
      {content}
    </LecturerShell>
  );
}