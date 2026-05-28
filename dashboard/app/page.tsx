/**
 * Landing page — public marketing page for Cognito AI API.
 */
import { LandingNavbar } from "@/components/landing/navbar";
import { LandingFooter } from "@/components/landing/footer";
import { HeroSection } from "./hero";
import { CodeSnippet } from "./code-snippet";
import { FeaturesSection } from "./features";
import { PricingSection } from "./pricing";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <LandingNavbar />
      <main className="flex-1">
        <HeroSection />
        <CodeSnippet />
        <FeaturesSection />
        <PricingSection />
      </main>
      <LandingFooter />
    </div>
  );
}
