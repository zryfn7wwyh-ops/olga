import { AboutAnton } from "@/components/AboutAnton";
import { Advantages } from "@/components/Advantages";
import { BankruptcyCTA } from "@/components/BankruptcyCTA";
import { Cases } from "@/components/Cases";
import { ComplexCases } from "@/components/ComplexCases";
import { ContactModalProvider } from "@/components/ContactModal";
import { Contacts } from "@/components/Contacts";
import { Expertise } from "@/components/Expertise";
import { ExpertiseCTA } from "@/components/ExpertiseCTA";
import { FAQ } from "@/components/FAQ";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { MobileCTA } from "@/components/MobileCTA";
import { Process } from "@/components/Process";
import { Reviews } from "@/components/Reviews";
import { Team } from "@/components/Team";

/**
 * Ритм страницы: тёмный hero → editorial bento → интерактивная экспертиза →
 * тёмный problem block → светлый personal → timeline → cases → команда →
 * reviews → FAQ → тёмный contact CTA.
 */
export default function Home() {
  return (
    <ContactModalProvider>
      <Header />
      <main id="main">
        <Hero />
        <Advantages />
        <Expertise />
        <ExpertiseCTA />
        <ComplexCases />
        <AboutAnton />
        <Process />
        <Cases />
        <Team />
        <Reviews />
        <FAQ />
        <BankruptcyCTA />
        <Contacts />
      </main>
      <Footer />
      <MobileCTA />
    </ContactModalProvider>
  );
}
