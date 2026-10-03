// Scroll Image Band Component
export function ScrollImageBand({ image, eyebrow, title }: {
  image: string;
  eyebrow: string;
  title: string
}) {
  return (
    <section className="image-band" style={{ backgroundImage: `linear-gradient(90deg, rgba(10,10,10,.78), rgba(10,10,10,.26)), url(${image})` }} aria-label={title}>
      <div className="container image-band-content">
        <p className="eyebrow text-[#D4AF37]">{eyebrow}</p>
        <h2 className="mt-3 max-w-xl font-display text-3xl text-white md:text-5xl">{title}</h2>
      </div>
    </section>
  );
}