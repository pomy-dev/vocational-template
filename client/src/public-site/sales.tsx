import { SectionTitle } from "@/components/section-title";
import { salesItems } from "@/lib/data";
import { Phone, MessageCircle, ShoppingBag, ArrowRight } from "lucide-react";

// Sales Portal Component
export function SalesPortal() {
  return (
    <section id="sales" className="section-pad bg-[#f2f5fa]">
      <div className="container">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <SectionTitle eyebrow="NSTC sales portal" title="Tools for the next chapter." body="Order laptops, textbooks, drawing boards and study guides from the college supply desk." />
          <div className="flex flex-wrap gap-3">
            <a className="btn btn-dark" href="tel:0712036198"><Phone className="h-4 w-4" /> 071 203 6198</a>
            <a className="btn btn-gold" href="https://wa.me/27825196140"><MessageCircle className="h-4 w-4" /> WhatsApp order</a>
          </div>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {salesItems.map(([name, body, price, image]) =>
            <article className="sale-card sale-card--image" key={name} style={{ backgroundImage: `linear-gradient(145deg, rgba(9,11,16,.72), rgba(9,11,16,.9)), url(${image})` }}>
              <div className="sale-icon"><ShoppingBag className="h-5 w-5" /></div>
              <h3 className="mt-6 font-display text-2xl text-white">{name}</h3>
              <p className="mt-2 text-sm leading-6 text-white/70">{body}</p>
              <p className="mt-5 text-sm font-bold text-[#f2cf63]">{price}</p>
              <a className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-white" style={{ color: "#ccc" }} href="tel:0712036198">Place an order <ArrowRight className="h-4 w-4" /></a>
            </article>
          )}
        </div>
      </div>
    </section>
  );
}