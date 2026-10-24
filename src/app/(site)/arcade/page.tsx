import ArcadeCabinetHub from "@/components/ArcadeCabinetHub";
import { Radio } from "lucide-react";

export default function ArcadePage() {
  return (
    <section className="container-luxe py-32 sm:py-40">
      <div className="mb-10 max-w-3xl">
        <p className="mb-3 font-mono text-xs font-bold uppercase tracking-[0.2em] text-violet-200">
          FocusPulse Labs
        </p>
        <h1 className="mb-4 font-display text-4xl font-bold uppercase tracking-tight sm:text-6xl">
          Arcade
        </h1>
        <div>
          <div className="mb-2 inline-flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-[0.22em] text-[#00F5D4]">
            <Radio className="h-4 w-4 animate-pulse" />
            Destaque Interativo · Hardware Emulado no Navegador
          </div>
          <h2 className="font-display text-3xl font-black uppercase tracking-tight text-white sm:text-4xl">
            PulseDeck <span className="text-[#FFB800]">Arcade Hub</span> (Live)
          </h2>
        </div>
        <p className="text-lg leading-relaxed text-muted-foreground">
          Troque os cartuchos ou jogue direto abaixo
        </p>
      </div>
      <ArcadeCabinetHub />
    </section>

  );
}
