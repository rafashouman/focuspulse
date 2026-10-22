import { Hero } from "@/components/Hero";
import { SelectedWork } from "@/components/SelectedWork";
import { Services } from "@/components/Services";
import { Segments } from "@/components/Segments";
import { Plans } from "@/components/Plans";
import { PlansApps } from "@/components/PlansApps";
import { PlansDG } from "@/components/PlansDG";
import { FAQ } from "@/components/FAQ";
import { Contact } from "@/components/Contact";

export default function HomePage() {
  return (
    <>
      <Hero />
      <SelectedWork />
      <Services />
      <Segments />
      <Plans />
      <PlansApps />
      <PlansDG />
      <FAQ />
      <Contact />
    </>
  );
}