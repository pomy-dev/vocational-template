import { useEffect, useState, useRef } from "react";

// Stats Section Component
export function Stats() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [started, setStarted] = useState(false);
  const [values, setValues] = useState([0, 0, 0]);
  const targets = [10500, 98, 30];

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setStarted(true);
        observer.disconnect();
      }
    }, { threshold: 0.35 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    const startedAt = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const progress = Math.min((now - startedAt) / 1200, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValues(targets.map((target) => Math.round(target * eased)));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [started]);

  const suffixes = ["+", "%", "+"];
  const labels = [
    "MITC learners in jobs, self-employed & industry",
    "Employment & mentorship guarantee",
    "Academic pathways"
  ];
  return (
    <section ref={sectionRef} className="stats-strip" aria-label="NSTC impact statistics">
      <div className="container grid gap-8 py-11 sm:grid-cols-2 lg:grid-cols-3">
        {values.map((value, index) => <div key={labels[index]}>
          <p className="stat-number">{value.toLocaleString("en-ZA")}<span>{suffixes[index]}</span></p>
          <p className="stat-label">{labels[index]}</p>
        </div>)}
      </div>
    </section>
  );
}