import { AppData } from "@/lib/types";
import { PublicNav } from "./nav";
import { SectionTitle } from "@/components/section-title";
import { Apprenticeships } from "./apprenticeship";
import { Footer } from "./footer";


export function ApprenticeshipPortal({ data, setData, onApply }: {
  data: AppData;
  setData: React.Dispatch<React.SetStateAction<AppData>>;
  onApply: () => void
}) {
  return (
    <div className="public-page">
      <div className="bg-[#071a3a] pb-14">
        <PublicNav onApply={onApply} />
        <div className="container pt-36">
          <SectionTitle light eyebrow="Apprenticeship & internship placement" title="Step into the workplace." body="Find a live opportunity, submit your CV securely through this placement sub-portal, and let NSTC connect your practical training with industry." />
        </div>
      </div>
      <Apprenticeships data={data} setData={setData} />
      <Footer />
    </div>
  );
}