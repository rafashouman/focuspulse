import Link from "next/link";
import { ArrowRight, ArrowUpRight, MoveUpRight } from "lucide-react";
import { Reveal } from "@/components/ui/MotionKit";

const projects = [
  {
    number: "01",
    category: "Fitness & bem-estar",
    title: "PulseFit",
    description:
      "Uma experiência de marca enérgica para transformar interesse em novas matrículas.",
    href: "/templates/academias",
    theme: "from-orange-500/20 via-[#181512] to-[#0c0d0f]",
  },
  {
    number: "02",
    category: "Gastronomia",
    title: "Kobra Burger Lab",
    description:
      "Cardápio digital com personalidade, pensado para abrir o apetite e facilitar pedidos.",
    href: "/templates/cardapio",
    theme: "from-amber-200/15 via-[#1c1713] to-[#0c0d0f]",
  },
  {
    number: "03",
    category: "E-commerce & moda",
    title: "Vortex Atelier",
    description:
      "Uma vitrine editorial para uma marca que tem atitude em cada detalhe.",
    href: "/templates/streetwear",
    theme: "from-violet-300/20 via-[#17111f] to-[#0c0d0f]",
  },
  {
    number: "04",
    category: "Automotivo & Seminovos",
    title: "Prime Motors",
    description:
      "Portal de concessionária em tema claro com comparativo FIPE, simulador CDC e agendamento de visita.",
    href: "/templates/carros",
    theme: "from-blue-500/20 via-[#101726] to-[#0c0d0f]",
  },
];

export function SelectedWork() {
  return (
    <section
      id="trabalhos"
      className="relative scroll-mt-24 border-y border-violet-200/[0.08] bg-[#110d18]/65 py-24 backdrop-blur-2xl sm:py-32"
    >
      <div className="container-luxe">
        <div className="mb-12 flex flex-col gap-7 md:mb-16 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="mb-5 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-violet-200">
              <span className="h-px w-7 bg-fuchsia-300/80" />
              Feito para ser lembrado
            </p>
            <h2 className="text-balance font-display text-4xl font-semibold leading-[1.02] tracking-[-0.055em] sm:text-5xl md:text-6xl">
              Não é só um site.
              <br />
              <span className="text-violet-gradient">
                É a sua próxima impressão.
              </span>
            </h2>
          </div>
          <p className="max-w-sm text-base leading-7 text-muted-foreground">
            Explore alguns conceitos demonstrativos e descubra como{" "}
            <span className="font-medium text-violet-100">
              estratégia, conteúdo e identidade visual
            </span>{" "}
            podem trabalhar juntos.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {projects.map((project, i) => (
            <Reveal key={project.number} delay={(i % 2) * 0.1}>
            <article
              className="group h-full min-w-0 overflow-hidden rounded-[1.6rem] border border-white/[0.1] bg-white/[0.035] shadow-xl shadow-black/10 backdrop-blur-xl transition-transform duration-300 hover:-translate-y-1 hover:border-violet-200/20"
            >
              <Link
                href={project.href}
                className="block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-violet-300"
                aria-label={`Explorar o template demonstrativo ${project.title}`}
              >
                <div
                  className={`relative h-[270px] overflow-hidden bg-gradient-to-br ${project.theme} sm:h-[310px]`}
                >
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_30%,rgba(255,255,255,.09),transparent_55%)]" />
                  <div className="absolute inset-x-4 top-4 overflow-hidden rounded-xl border border-white/15 bg-[#100d15]/70 shadow-2xl shadow-violet-950/20 backdrop-blur-xl transition-transform duration-500 group-hover:scale-[1.025] sm:inset-x-6 sm:top-6">
                    <div className="flex h-8 items-center gap-1.5 border-b border-white/[0.08] px-3">
                      <span className="h-1.5 w-1.5 rounded-full bg-white/20" />
                      <span className="h-1.5 w-1.5 rounded-full bg-white/20" />
                      <span className="h-1.5 w-1.5 rounded-full bg-white/20" />
                      <span className="ml-auto min-w-0 max-w-[75%] truncate text-right font-mono text-[8px] text-white/35">
                        focuspulse.site{project.href}
                      </span>
                    </div>
                    <iframe
                      src={project.href}
                      title={`Prévia do template ${project.title}`}
                      loading="lazy"
                      scrolling="no"
                      tabIndex={-1}
                      className="pointer-events-none block h-[260px] w-full border-0 bg-[#0b0d10]/80 sm:h-[300px]"
                    />
                  </div>
                  <span className="absolute bottom-4 right-4 grid h-10 w-10 place-items-center rounded-full border border-white/20 bg-black/40 text-white backdrop-blur transition-colors group-hover:border-white/50 group-hover:bg-white group-hover:text-black">
                    <MoveUpRight className="h-4 w-4" />
                  </span>
                </div>

                <div className="p-6 sm:p-7">
                  <div className="mb-4 flex items-center justify-between gap-4">
                    <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-violet-100/60">
                      {project.category}
                    </span>
                    <span className="font-mono text-xs text-white/35">
                      {project.number}
                    </span>
                  </div>
                  <div className="flex items-start justify-between gap-5">
                    <div>
                      <h3 className="font-display text-2xl font-semibold tracking-tight text-foreground">
                        {project.title}
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-muted-foreground">
                        {project.description}
                      </p>
                    </div>
                    <ArrowUpRight className="mt-1 h-5 w-5 shrink-0 text-white/40 transition-colors group-hover:text-violet-200" />
                  </div>
                </div>
              </Link>
            </article>
            </Reveal>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-5 border-t border-white/10 pt-7 sm:flex-row sm:items-center">
          <p className="text-sm text-muted-foreground">
            Os exemplos são demonstrativos e podem ser adaptados à sua marca.
          </p>
          <Link
            href="/templates"
            className="group inline-flex items-center gap-2 text-sm font-semibold text-foreground transition-colors hover:text-violet-200"
          >
            Ver todos os templates
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}