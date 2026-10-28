import type { Metadata } from "next";
import PilotAdminPanel from "./PilotAdminPanel";

export const metadata: Metadata = {
  title: "Painel de Leads | Costi",
  robots: { index: false, follow: false },
};

export default function PilotAdminPage() {
  return <PilotAdminPanel />;
}
