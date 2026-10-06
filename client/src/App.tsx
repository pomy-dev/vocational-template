import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { useLocation } from "wouter";
import { Toaster } from "sonner";
import { useData } from "./utils/use-data";
import { Landing } from "@/public-site/landing-page";
import { SalesPortal } from "@/public-site/sales";
import { StudentPortal } from "@/student-portal/index-portal";
import { ParentPortal } from "@/components/parent-portal";
import { LecturerPortal } from "@/lecturer-portal/index-portal";
import { AdminPortal } from "@/admin-portal/index-portal";
import { SectionTitle } from "@/components/section-title";
import { PublicNav } from "@/public-site/nav";
import { Footer } from "react-day-picker";
import { ApprenticeshipPortal } from "./public-site/apprenticeship-portal";
import {
  HodPortal,
  ItPortal,
  AccountantPortal,
} from "@/admin-portal/extended-portals";

function App() {
  const [location, navigate] = useLocation();
  const [data, setData] = useData();
  const [apply, setApply] = useState(false);

  useEffect(() => {
    if (location === "/") setApply(false);
  }, [location]);

  const go = (path: string) => {
    setApply(false);
    navigate(path);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  let page: ReactNode;

  if (location === "/" || location === "")
    page = (
      <Landing
        data={data}
        setData={setData}
        onApply={() => {
          setApply(true);
          navigate("/portal/apply");
        }}
      />
    );
  else if (location === "/apprenticeships")
    page = (
      <ApprenticeshipPortal
        data={data}
        setData={setData}
        onApply={() => go("/portal/apply")}
      />
    );
  else if (location === "/sales")
    page = (
      <>
        <div className="bg-[#071a3a] pb-14">
          <PublicNav onApply={() => go("/portal/apply")} />
          <div className="container pt-36">
            <SectionTitle
              light
              eyebrow="NSTC sales portal"
              title="Study tools, ready when you are."
              body="Order learning devices and course materials from the National Skills & Technical College supply desk."
            />
          </div>
        </div>
        <SalesPortal />
        <Footer />
      </>
    );
  else if (location.startsWith("/portal"))
    page = (
      <StudentPortal
        data={data}
        setData={setData}
        path={location}
        navigate={go}
      />
    );
  else if (location === "/parent")
    page = <ParentPortal data={data} navigate={go} />;
  else if (location.startsWith("/lecturer"))
    page = (
      <LecturerPortal
        data={data}
        setData={setData}
        path={location}
        navigate={go}
      />
    );
  else if (location.startsWith("/hod"))
    page = (
      <HodPortal data={data} setData={setData} path={location} navigate={go} />
    );
  else if (location.startsWith("/it"))
    page = (
      <ItPortal data={data} setData={setData} path={location} navigate={go} />
    );
  else if (location.startsWith("/accounting"))
    page = (
      <AccountantPortal
        data={data}
        setData={setData}
        path={location}
        navigate={go}
      />
    );
  else if (location.startsWith("/admin"))
    page = (
      <AdminPortal
        data={data}
        setData={setData}
        path={location}
        navigate={go}
      />
    );
  else
    page = (
      <Landing
        data={data}
        setData={setData}
        onApply={() => {
          go("/portal/apply");
        }}
      />
    );

  return (
    <>
      <Toaster position="bottom-right" richColors />
      {page}
      {apply && null}
    </>
  );
}

export default App;
