import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { StickyMobileCta } from "@/components/layout/StickyMobileCta";
import { HeroSection } from "@/components/sections/HeroSection";
import { WhyNowSection } from "@/components/sections/WhyNowSection";
import { AudienceSection } from "@/components/sections/AudienceSection";
import { ReportFormSection } from "@/components/sections/ReportFormSection";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <WhyNowSection />
        <AudienceSection />
        <ReportFormSection />
      </main>
      <Footer />
      <StickyMobileCta />
    </>
  );
}
