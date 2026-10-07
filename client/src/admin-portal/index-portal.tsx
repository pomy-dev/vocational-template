import { useState } from "react";
import { AppData } from "@/lib/types";
import { AdminAuth } from "@/admin-portal/admin-auth";
import { AdminDashboard } from "./admin-dashboard";
import { AdminAttendance } from "./admin-attendance";
import { AdminLecturers } from "./admin-lecturers";
import { AdminStudents } from "./admin-students";
import { AdminComplaints } from "./admin-complaints";
import { AdminFinance } from "./admin-finance";
import { AdminDepartments } from "./admin-departments";
import { AdminReports } from "./admin-reports";

export function AdminPortal({
  data,
  setData,
  path,
  navigate,
}: {
  data: AppData;
  setData: React.Dispatch<React.SetStateAction<AppData>>;
  path: string;
  navigate: (path: string) => void;
}) {
  const [loggedIn, setLoggedIn] = useState(() => localStorage.getItem("nstc-admin-session") === "active");

  if (!loggedIn) return <AdminAuth onAuthenticated={() => setLoggedIn(true)} />;
  if (path === "/admin/lecturers")
    return <AdminLecturers data={data} setData={setData} navigate={navigate} />;
  if (path === "/admin/departments")
    return (
      <AdminDepartments data={data} setData={setData} navigate={navigate} />
    );
  if (path === "/admin/reports")
    return <AdminReports data={data} navigate={navigate} />;
  if (path === "/admin/students")
    return <AdminStudents data={data} setData={setData} navigate={navigate} />;
  if (path === "/admin/attendance")
    return <AdminAttendance data={data} navigate={navigate} />;
  if (path === "/admin/complaints")
    return (
      <AdminComplaints data={data} setData={setData} navigate={navigate} />
    );
  if (path === "/admin/finance")
    return <AdminFinance data={data} navigate={navigate} />;

  return <AdminDashboard data={data} setData={setData} navigate={navigate} />;
}
