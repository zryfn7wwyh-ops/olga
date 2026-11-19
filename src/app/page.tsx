import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { StickyCta } from "@/components/layout/StickyCta";
import { FaqJsonLd } from "@/components/layout/FaqJsonLd";
import { Hero } from "@/components/sections/Hero";
import { CaseStudy } from "@/components/sections/CaseStudy";
import { Problems } from "@/components/sections/Problems";
import { SystemSection } from "@/components/sections/SystemSection";
import { Audiences } from "@/components/sections/Audiences";
import { PaymentModel } from "@/components/sections/PaymentModel";
import { Team } from "@/components/sections/Team";
import { Process } from "@/components/sections/Process";
import { FAQ } from "@/components/sections/FAQ";
import { FinalLead } from "@/components/sections/FinalLead";

export default function HomePage() {
  return (
    <>
      <Header />
      <main id="main">
        <Hero />
        <CaseStudy />
        <Problems />
        <SystemSection />
        <Audiences />
        <PaymentModel />
        <Team />
        <Process />
        <FAQ />
        <FinalLead />
      </main>
      <Footer />
      <StickyCta />
      <FaqJsonLd />
    </>
  );
}
