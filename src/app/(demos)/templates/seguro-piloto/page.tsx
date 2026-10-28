import type { Metadata } from "next";
import PilotosLanding from "@/components/hotsites/PilotosLanding";

export const metadata: Metadata = {
  title: "Seguro de Vida para Pilotos | Costi Corretora",
  description:
    "Seguro de vida sem exclusão para aviação: agrícola, executiva, comercial e helicópteros. Cotação em até 15 minutos.",
};

export default function SeguroPilotoPage() {
  return <PilotosLanding />;
}
