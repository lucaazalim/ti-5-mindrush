import Customers from "~/app/(home)/_components/Customers";
import Benefits from "./_components/Benefits";
import Footer from "./_components/Footer";
import Header from "./_components/Header";
import { HeroSection } from "./_components/HeroSection";
import { Pricing } from "./_components/Pricing";
import { Testimonials } from "./_components/Testimonials";

export default async function HomePage() {
  return (
    <div className="bg-gradient-to-r from-[var(--color-via)] via-[var(--color-from)] to-[var(--color-via)] text-secondary">
      <Header />
      <HeroSection />
      <Benefits />
      <Testimonials />
      <Pricing />
      <Customers />
      <Footer />
    </div>
  );
}
