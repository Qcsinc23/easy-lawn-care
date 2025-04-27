import HeroSection from "@/components/home/HeroSection";
import HowItWorksSection from "@/components/home/HowItWorksSection";
import ServiceTiersSection from "@/components/home/ServiceTiersSection";
import TrustSignalsSection from "@/components/home/TrustSignalsSection";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <HeroSection />
        <HowItWorksSection />
        <ServiceTiersSection />
        <TrustSignalsSection />
        {/* Additional sections will be added below */}
      </main>
    </div>
  );
}
