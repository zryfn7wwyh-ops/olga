import { services } from "@/content/landing";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ServiceCard } from "./ServiceCard";
import { SalesConsulting } from "./SalesConsulting";

export function Services() {
  return (
    <section id="services" aria-labelledby="services-title" className="section on-light bg-paper">
      <div className="container-lp">
        <SectionHeading id="services-title" eyebrow={services.eyebrow} title={services.title} />
        <ul className="mt-14 grid gap-4 sm:grid-cols-2 lg:mt-20 lg:grid-cols-3 lg:gap-5">
          {services.items.map((item, i) => (
            <li key={item.id} data-reveal style={{ ["--reveal-delay" as string]: `${(i % 3) * 70}ms` }}>
              <ServiceCard
                index={i}
                icon={item.icon}
                title={item.title}
                what={item.what}
                result={item.result}
                details={item.details}
                doLabel={services.doLabel}
                resultLabel={services.resultLabel}
                openLabel={services.detailsOpen}
                closeLabel={services.detailsClose}
              />
            </li>
          ))}
        </ul>
        <SalesConsulting />
      </div>
    </section>
  );
}
