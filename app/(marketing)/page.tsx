import { Hero } from "@/components/marketing/hero";
import { TrustBar } from "@/components/marketing/trust-bar";
import { Problem } from "@/components/marketing/problem";
import { HowItWorks } from "@/components/marketing/how-it-works";
import { Features } from "@/components/marketing/features";
import { Dashboard } from "@/components/marketing/dashboard";
import { Preview } from "@/components/marketing/preview";
import { PropertyTypes } from "@/components/marketing/property-types";
import { PricingCard } from "@/components/marketing/pricing-card";
import { Testimonials } from "@/components/marketing/testimonials";
import { Faq } from "@/components/marketing/faq";
import { FinalCta } from "@/components/marketing/final-cta";

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustBar />
      <Problem />
      <HowItWorks />
      <Features />
      <Dashboard />
      <Preview />
      <PropertyTypes />
      <PricingCard />
      <Testimonials />
      <Faq />
      <FinalCta />
    </>
  );
}
