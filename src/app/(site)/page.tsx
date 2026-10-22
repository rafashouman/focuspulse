import { Hero } from "@/components/Hero";
import { SelectedWork } from "@/components/SelectedWork";
import { Services } from "@/components/Services";
import { Segments } from "@/components/Segments";
import { Plans } from "@/components/Plans";
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
      <FAQ />
      <Contact />
    </>
  );
}