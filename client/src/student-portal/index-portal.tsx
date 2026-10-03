import { useState } from "react";
import { AppData } from "@/lib/types";
import { initials } from "@/const";
import { Button } from "@/components/button";
import { PortalShell } from "@/components/portal-shell";
import { Logo } from "@/components/logo";
import { StudentAuth } from "./student-auth";
import { StudentOverview } from "./student-overview";
import { StudentAssignments } from "./student-assignments";
import { StudentLearning } from "./student-learning";
import { StudentFinances } from "./student-finances";
import { StudentResults } from "./student-results";
import { StudentSupport } from "./student-support";
import { StudentSettings } from "./student-settings";
import { Registration } from "@/components/student-registration";


export function StudentPortal({ data, setData, path, navigate }: {
  data: AppData;
  setData: React.Dispatch<React.SetStateAction<AppData>>;
  path: string;
  navigate: (path: string) => void
}) {
  const [register, setRegister] = useState(path === "/portal/apply");
  const [loggedIn, setLoggedIn] = useState(() => path === "/portal/apply" || localStorage.getItem("nstc-portal-session") === "active");

  if (path !== "/portal/apply" && !loggedIn) return <StudentAuth onAuthenticated={() => setLoggedIn(true)} />;

  if (register)
    return (
      <div className="registration-page">
        <div className="registration-top">
          <Logo light />
          <a href="/" className="text-sm font-semibold text-white/60 hover:text-white">Back to website</a>
        </div>
        <Registration onComplete={(application) => {
          if (application?.email && application.registration) {
            setData((old) => ({
              ...old,
              students: [...old.students, {
                id: application.registration.studentId,
                name: application.name || "New NSTC learner",
                email: application.email,
                phone: application.phone,
                studentNo: application.registration.studentNumber,
                campus: "Middleburg Campus",
                course: application.course,
                status: "Active",
                startDate: new Date().toISOString().slice(0, 10),
                attendance: 0,
                balance: 500,
                termAverage: 0,
                initials: initials(application.name || "New learner"),
                guardian: application.kinName || "",
                nextOfKin: { name: application.kinName || "", relationship: application.kinRelationship || "", email: application.kinEmail || "", phone: application.kinPhone || "" },
                remarks: ""
              }]
            }));
          }
          setRegister(false);
          navigate("/portal");
        }} />
      </div>
    );

  const active = path.startsWith("/portal/assignments")
    ? "/portal/assignments"
    : path.startsWith("/portal/results")
      ? "/portal/results"
      : path.startsWith("/portal/finances")
        ? "/portal/finances"
        : path.startsWith("/portal/support")
          ? "/portal/support"
          : path.startsWith("/portal/settings")
            ? "/portal/settings"
            : path.startsWith("/portal/learning")
              ? "/portal/learning"
              : "/portal";

  return (
    <PortalShell active={active} onNavigate={navigate}>
      <div className="mb-5 flex justify-end lg:hidden">
        <Button onClick={() => setRegister(true)}>Apply for another programme</Button>
      </div>
      {active === "/portal" &&
        <StudentOverview data={data} onNavigate={navigate} />
      }
      {active === "/portal/learning" &&
        <StudentLearning data={data} onNavigate={navigate} />
      }
      {active === "/portal/assignments" &&
        <StudentAssignments data={data} />
      }
      {active === "/portal/results" &&
        <StudentResults data={data} />
      }
      {active === "/portal/finances" &&
        <StudentFinances data={data} />
      }
      {active === "/portal/support" &&
        <StudentSupport data={data} setData={setData} />
      }
      {active === "/portal/settings" &&
        <StudentSettings onSignOut={() => { localStorage.removeItem("nstc-portal-session"); setLoggedIn(false); }} />
      }
    </PortalShell>
  );
}