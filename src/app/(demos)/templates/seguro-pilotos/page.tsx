import type { Metadata } from "next";
import PilotosLanding from "./PilotosLanding";

export const metadata: Metadata = {
  title: "Seguro de Vida para Pilotos | Costi Corretora",
  description:
    "Seguro de vida sem exclusão para aviação: agrícola, executiva, comercial e helicópteros. Cotação em até 15 minutos.",
};

export default function SeguroPilotosPage() {
  return <PilotosLanding />;
}
