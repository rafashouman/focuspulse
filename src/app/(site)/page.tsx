import { Hero } from "@/components/Hero";
import { Segments } from "@/components/Segments";
import { Services } from "@/components/Services";
import { Plans } from "@/components/Plans";
import { FAQ } from "@/components/FAQ";
import { Contact } from "@/components/Contact";

export default function Home() {
  return (
    <>
      <Hero />
      <Segments />
      <Services />
      <Plans />
      <FAQ />
      <Contact />
    </>
  );
}
