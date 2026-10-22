import Link from "next/link";
import { ArknoidGame } from "@/components/ArknoidGame";

export default function ArknoidPage() {
  return (
    <section className="container-luxe py-32 sm:py-40">
      <Link
        href="/apps"
        className="mb-8 inline-flex text-sm font-semibold text-muted-foreground transition-colors hover:text-violet-200"
      >
        ← Voltar aos aplicativos
      </Link>
      <div className="mb-10 max-w-3xl">
        <span className="mb-5 inline-flex rounded-full border border-violet-300/20 bg-violet-400/[0.06] px-3 py-1 text-xs font-bold uppercase tracking-widest text-violet-200">
          Experimento interativo
        </span>
        <h1 className="mb-5 text-4xl font-display font-bold uppercase tracking-tight sm:text-6xl">
          Arknoid
        </h1>
        <p className="text-lg leading-relaxed text-muted-foreground">
          Uma releitura de Arkanoid para explorar movimento, física e interação
          direto no navegador.
        </p>
      </div>
      <ArknoidGame />
    </section>
  );
}
