import Header from "./_components/Header";
import { Pricing } from "./_components/Pricing";
import { HeroSection } from "./_components/HeroSection";
import Costumers from "./_components/Costumers";
import { Testimonials } from "./_components/Testimonials";
import Benefits from "./_components/Benefits";
import Footer from "./_components/Footer";

export default async function HomePage() {



  return (
    <main className="bg-gradient-to-r from-[var(--color-via)] via-[var(--color-from)] to-[var(--color-via)] text-secondary">
        <Header />
        <HeroSection />
        <Benefits/>
        <Testimonials/>
        <Pricing />
        <Costumers/> 
        <Footer/>
    </main>
  );
}
