import { Header } from "@/components/Header";
import { MobileCallBar } from "@/components/MobileCallBar";
import { Hero } from "@/components/Hero";
import { Advantages } from "@/components/Advantages";
import { Services } from "@/components/Services";
import { UrgentSituations } from "@/components/UrgentSituations";
import { AboutLawyer } from "@/components/AboutLawyer";
import { WorkProcess } from "@/components/WorkProcess";
import { Cases } from "@/components/Cases";
import { Pricing } from "@/components/Pricing";
import { ReviewsSlider } from "@/components/ReviewsSlider";
import { Contacts } from "@/components/Contacts";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1 pb-16 lg:pb-0">
        <Hero />
        <Advantages />
        <Services />
        <UrgentSituations />
        <AboutLawyer />
        <WorkProcess />
        <Cases />
        <Pricing />
        <ReviewsSlider />
        <Contacts />
      </main>
      <Footer />
      <MobileCallBar />
    </>
  );
}
