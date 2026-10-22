import ArcadeCabinetHub from "@/components/ArcadeCabinetHub";

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
        <p className="text-lg leading-relaxed text-muted-foreground">
          Escolha um cartucho e explore os jogos interativos do gabinete.
        </p>
      </div>
      <ArcadeCabinetHub />
    </section>
  );
}
