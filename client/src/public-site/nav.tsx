import { useState } from "react";
import { Logo } from "@/components/logo";
import { Button } from "@/components/button";
import { ArrowRight, Menu } from "lucide-react";

// Navbar Area Component
export function PublicNav({ onApply }: { onApply: () => void }) {
  const [open, setOpen] = useState(false);
  return (
    <header className="public-nav">
      <div className="container public-nav__main flex h-[78px] items-center justify-between">
        <Logo light />
        <nav className="hidden items-center gap-7 lg:flex">
          <a href="#about">About</a>
          <a href="#programmes">Programmes</a>
          <a href="#skills">Graduate CVs</a>
          <a href="#apprenticeships">Employment</a>
          {/* <a href="#occupational">Occupational</a> */}
          <a href="#fees">Fees</a>
          {/* <a href="#sales">Market Place</a> */}
          <a href="#contact">Contact</a>
        </nav>
        <div className="hidden items-center gap-3 sm:flex">
          <a className="nav-portal" href="/portal">Portal login <ArrowRight className="h-4 w-4" /></a>
          <Button onClick={onApply}>Apply now <ArrowRight className="h-4 w-4" /></Button>
        </div>
        <button className="text-white lg:hidden" onClick={() => setOpen(!open)}><Menu /></button>
      </div>
      {open &&
        <div className="mobile-nav lg:hidden">
          <a href="#about" onClick={() => setOpen(false)}>About</a>
          <a href="#programmes" onClick={() => setOpen(false)}>Programmes</a>
          <a href="#skills" onClick={() => setOpen(false)}>Graduate CVs</a>
          <a href="/apprenticeships" onClick={() => setOpen(false)}>Employment</a>
          <a href="#fees" onClick={() => setOpen(false)}>Fees</a>
          <a href="/portal">Student portal</a>
          <Button onClick={onApply}>Apply now</Button>
        </div>
      }
    </header>
  );
}