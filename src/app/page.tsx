import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { CaseStudy } from "@/components/sections/CaseStudy";
import { Problems } from "@/components/sections/Problems";
import { Approach } from "@/components/sections/Approach";
import { Services } from "@/components/sections/Services";
import { PaymentModel } from "@/components/sections/PaymentModel";
import { Audiences } from "@/components/sections/Audiences";
import { Process } from "@/components/sections/Process";
import { Proof } from "@/components/sections/Proof";
import { LeadSection } from "@/components/sections/LeadSection";
import { FAQ } from "@/components/sections/FAQ";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { FaqJsonLd } from "@/components/layout/FaqJsonLd";

export default function HomePage() {
  return (
    <>
      <Header />
      <main id="main">
        <Hero />
        <CaseStudy />
        <Problems />
        <Approach />
        <Services />
        <PaymentModel />
        <Audiences />
        <Process />
        <Proof />
        <LeadSection />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
      <FaqJsonLd />
    </>
  );
}
