import { LeadUIProvider } from "@/components/forms/LeadUIProvider";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { Benefits } from "@/components/sections/Benefits";
import { DataProtection } from "@/components/sections/DataProtection";
import { Deliverables } from "@/components/sections/Deliverables";
import { Faq } from "@/components/sections/Faq";
import { FinalBrief } from "@/components/sections/FinalBrief";
import { Hero } from "@/components/sections/Hero";
import { MidCta } from "@/components/sections/MidCta";
import { PriceFactors } from "@/components/sections/PriceFactors";
import { Process } from "@/components/sections/Process";
import { SiteTypes } from "@/components/sections/SiteTypes";
import { WorkShowcase } from "@/components/sections/WorkShowcase";
import { StructuredData } from "@/components/layout/StructuredData";

export default function HomePage() {
  return (
    <LeadUIProvider>
      <a className="skip-link" href="#main">
        Перейти к содержимому
      </a>
      <div id="top" />
      <Header />
      <main id="main" tabIndex={-1}>
        <Hero />
        <Benefits />
        <SiteTypes />
        <WorkShowcase />
        <DataProtection />
        <Process />
        <Deliverables />
        <PriceFactors />
        <MidCta />
        <Faq />
        <FinalBrief />
      </main>
      <Footer />
      <StructuredData />
    </LeadUIProvider>
  );
}
