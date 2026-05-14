import { Hero } from "@/frontend/components/marketing/hero";
import { TrustBar } from "@/frontend/components/marketing/trust-bar";
import { Problem } from "@/frontend/components/marketing/problem";
import { HowItWorks } from "@/frontend/components/marketing/how-it-works";
import { Features } from "@/frontend/components/marketing/features";
import { Dashboard } from "@/frontend/components/marketing/dashboard";
import { Preview } from "@/frontend/components/marketing/preview";
import { PropertyTypes } from "@/frontend/components/marketing/property-types";
import { PricingCard } from "@/frontend/components/marketing/pricing-card";
import { Testimonials } from "@/frontend/components/marketing/testimonials";
import { Faq } from "@/frontend/components/marketing/faq";
import { FinalCta } from "@/frontend/components/marketing/final-cta";

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
