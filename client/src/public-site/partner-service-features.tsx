import { useEffect, useState } from "react";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import { partnerServices, serviceBorderPalettes } from "@/lib/data";


// Partner Services Feature Component
export function PartnerServicesFeature() {
  const pageSize = 6;
  const [page, setPage] = useState(0);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const totalPages = Math.ceil(partnerServices.length / pageSize);
  const visibleServices = partnerServices.slice(page * pageSize, (page + 1) * pageSize);
  const selected = partnerServices.find((service) => service.id === selectedId) ?? null;
  const close = () => {
    setSelectedId(null);
    if (window.location.hash.startsWith("#partner-service-")) window.history.pushState({}, "", `${window.location.pathname}${window.location.search}`);
  };

  const open = (id: string) => { setSelectedId(id); window.history.pushState({}, "", `#partner-service-${id}`); };

  useEffect(() => {
    const syncFromHash = () => {
      const id = window.location.hash.replace("#partner-service-", "");
      if (id && partnerServices.some((service) => service.id === id)) setSelectedId(id);
    };
    syncFromHash();
    window.addEventListener("popstate", syncFromHash);
    window.addEventListener("hashchange", syncFromHash);
    return () => {
      window.removeEventListener("popstate", syncFromHash);
      window.removeEventListener("hashchange", syncFromHash);
    };
  }, []);

  return (
    <>
      <div className="hero-partner-feature" aria-labelledby="hero-partner-title">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p id="hero-partner-title" className="eyebrow text-[#D4AF37]">Partner with us for services</p>
            <p className="mt-2 text-sm leading-6 text-white/65">Companies · mines · sponsors</p>
          </div>
          <span className="service-page-count">{page + 1} / {totalPages}</span>
        </div>
        <ul className="hero-partner-benefits" aria-label="Partnership services">
          {visibleServices.map((service, index) => {
            const [firstColor, secondColor] = serviceBorderPalettes[index % serviceBorderPalettes.length];
            return <li key={service.id}>
              <button className="partner-service-button" style={{ "--service-color-a": firstColor, "--service-color-b": secondColor } as React.CSSProperties} onClick={() => open(service.id)} aria-haspopup="dialog">
                <span>{service.label}</span>
                <ArrowUpRight className="h-4 w-4" />
              </button>
            </li>;
          })}
        </ul>
        <div className="service-pager">
          <button className="service-page-button" onClick={() => setPage((value) => (value - 1 + totalPages) % totalPages)} aria-label="Previous partner services">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <span>Showing {page * pageSize + 1}–{Math.min((page + 1) * pageSize, partnerServices.length)} of {partnerServices.length} services</span>
          <button className="service-page-button" onClick={() => setPage((value) => (value + 1) % totalPages)} aria-label="Next partner services">
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
      {selected && <PartnerServiceModal service={selected} onClose={close} />}
    </>
  );
}