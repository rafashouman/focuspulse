"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import NextImage from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowUpRight,
  Code2,
  Layers3,
  Sparkles,
  Search,
  X,
  ZoomIn,
  MoveUpRight,
  SlidersHorizontal,
  CalendarClock,
  Gamepad2,
} from "lucide-react";
import ChronosBooking from "@/components/ChronosBooking";
import MemoryMatrix from "@/components/games/MemoryMatrix";
import PulseSpinRoulette from "@/components/games/SpinToWin";
import ArcadeCabinetHub from "@/components/ArcadeCabinetHub";

type InteractiveProjectId =
  | "chronos"
  | "pulsespin"
  | "memory"
  | "voxelvaders";

const interactiveProjects: Array<{
  id: InteractiveProjectId;
  title: string;
  category: string;
  description: string;
  tech: string[];
  accent: string;
  icon: typeof CalendarClock;
}> = [
  {
    id: "chronos",
    title: "ChronosBook",
    category: "Agendamentos",
    description:
      "Demonstração de seleção de horários com autenticação e reserva protegida por transação no Firestore.",
    tech: ["Firebase Auth", "Firestore Transactions", "Next.js"],
    accent: "from-blue-500/20 via-indigo-500/5 to-transparent",
    icon: CalendarClock,
  },
  {
    id: "pulsespin",
    title: "PulseSpin",
    category: "Mini app interativo",
    description:
      "Roleta promocional demonstrativa com animação e resultado exibido no navegador.",
    tech: ["Framer Motion", "CSS conic-gradient"],
    accent: "from-cyan-400/20 via-blue-500/5 to-transparent",
    icon: Gamepad2,
  },
  {
    id: "memory",
    title: "Memory Matrix",
    category: "Jogo de memória",
    description:
      "Desafio de pares com animações 3D e opção de registrar a pontuação após entrar com Google.",
    tech: ["React", "Firebase Auth", "Firebase Admin"],
    accent: "from-lime-400/20 via-emerald-500/5 to-transparent",
    icon: Layers3,
  },
  {
    id: "voxelvaders",
    title: "Voxel Vaders 3D",
    category: "WebGL Arcade & Gamificação",
    description:
      "Space Invaders tridimensional com Three.js, partículas e controles híbridos para desktop e dispositivos móveis.",
    tech: ["Three.js WebGL", "3D Particles", "Touch HUD", "Firebase Leaderboard"],
    accent: "from-pink-500/20 via-purple-600/5 to-transparent",
    icon: Gamepad2,
  },
];

const projects = [
  {
    href: "/webdev/arknoid",
    number: "01",
    title: "Arknoid",
    category: "Experimento interativo",
    tag: "HTML5 Canvas · 60 FPS",
    description:
      "Uma releitura de Arkanoid feita para explorar movimento, física, colisão e partículas direto no navegador.",
    icon: Code2,
    accent: "from-violet-500/20 via-fuchsia-500/5 to-transparent",
  },
  {
    href: "/webdev/images-blend",
    number: "02",
    title: "Image Blend",
    category: "Laboratório visual",
    tag: "CSS Mix-Blend · Real-Time",
    description:
      "Uma composição de imagens em camadas com controles de cor, opacidade e blend modes para testar combinações visuais.",
    icon: Layers3,
    accent: "from-fuchsia-500/20 via-indigo-500/5 to-transparent",
  },
];

export function AppsPageContent() {
  const [activeProject, setActiveProject] =
    useState<InteractiveProjectId | null>(null);

  useEffect(() => {
    if (!activeProject) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActiveProject(null);
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [activeProject]);

  return (
    <section className="container-luxe py-32 sm:py-40">
      <div className="mb-14 max-w-3xl">
        <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-violet-300/20 bg-violet-400/[0.06] px-3.5 py-1.5 text-xs font-bold uppercase tracking-widest text-violet-200">
          <Sparkles className="h-3.5 w-3.5 text-fuchsia-300" />
          FocusPulse Labs · Aplicativos
        </span>
        <h1 className="mb-6 font-display text-4xl font-bold uppercase tracking-tight sm:text-6xl">
          Ideias que viram{" "}
          <span className="text-violet-gradient">experiências.</span>
        </h1>
        <p className="text-lg leading-relaxed text-muted-foreground">
          Aplicativos e experimentos interativos desenvolvidos para explorar
          física, renderização e micro-interações diretamente no navegador.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {projects.map((project) => {
          const Icon = project.icon;
          return (
            <Link
              key={project.href}
              href={project.href}
              className="group relative flex flex-col justify-between overflow-hidden rounded-[2rem] border border-white/10 bg-[#0c0e14]/85 p-8 shadow-2xl backdrop-blur-2xl transition-all duration-300 hover:-translate-y-1.5 hover:border-violet-300/35 hover:shadow-violet-glow sm:p-10"
            >
              <div
                aria-hidden
                className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${project.accent} opacity-60 transition-opacity duration-500 group-hover:opacity-100`}
              />

              <div className="relative z-10">
                <div className="mb-10 flex items-center justify-between">
                  <div className="grid h-14 w-14 place-items-center rounded-2xl border border-violet-300/25 bg-violet-400/[0.08] text-violet-200 transition-transform duration-300 group-hover:scale-105 group-hover:bg-violet-500 group-hover:text-white">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-violet-200">
                      {project.tag}
                    </span>
                    <span className="font-mono text-sm text-white/35">
                      /{project.number}
                    </span>
                  </div>
                </div>

                <p className="mb-2 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-violet-200">
                  {project.category}
                </p>
                <div className="mb-3 flex items-center justify-between gap-4">
                  <h2 className="font-display text-3xl font-bold tracking-tight text-white">
                    {project.title}
                  </h2>
                  <span className="grid h-10 w-10 place-items-center rounded-full border border-white/15 bg-white/5 text-white/70 transition-all group-hover:border-white group-hover:bg-white group-hover:text-black">
                    <ArrowUpRight className="h-5 w-5" />
                  </span>
                </div>
                <p className="max-w-lg text-sm leading-relaxed text-muted-foreground sm:text-base">
                  {project.description}
                </p>
              </div>

              <div className="relative z-10 mt-8 flex items-center justify-between border-t border-white/[0.08] pt-4 text-xs font-semibold text-violet-200/80">
                <span>Executar experimento no navegador</span>
                <span className="font-mono text-[10px] uppercase tracking-widest text-white/40 group-hover:text-violet-200">
                  Interactive Demo →
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="mt-20">
        <div className="mb-8 max-w-2xl">
          <p className="mb-3 font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-violet-200">
            Demonstrações ao vivo
          </p>
          <h2 className="mb-3 font-display text-3xl font-bold uppercase tracking-tight sm:text-4xl">
            Experimente os sistemas
          </h2>
          <p className="leading-relaxed text-muted-foreground">
            Abra uma demonstração interativa. Algumas funções que gravam dados
            exigem autenticação e configuração do Firebase.
          </p>
        </div>

        <div className="grid auto-rows-[minmax(260px,auto)] gap-5 md:grid-cols-3">
          {interactiveProjects.map((project) => {
            const Icon = project.icon;
            const isFeatured =
              project.id === "chronos" || project.id === "voxelvaders";

            return (
              <motion.article
                key={project.id}
                whileHover={{ y: -4 }}
                className={`group relative flex min-w-0 flex-col justify-between overflow-hidden rounded-[2rem] border border-white/10 bg-[#0c0e14]/85 p-7 shadow-2xl backdrop-blur-2xl transition-colors hover:border-violet-300/35 sm:p-8 ${
                  isFeatured ? "md:col-span-2" : ""
                }`}
              >
                <div
                  aria-hidden
                  className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${project.accent} opacity-60 transition-opacity duration-500 group-hover:opacity-100`}
                />

                <div className="relative z-10">
                  <div className="mb-7 flex items-center justify-between gap-3">
                    <span className="rounded-full border border-violet-300/20 bg-violet-400/[0.06] px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-violet-200">
                      {project.category}
                    </span>
                    <Icon
                      aria-hidden
                      className="h-5 w-5 shrink-0 text-violet-200"
                    />
                  </div>
                  <h3 className="mb-3 font-display text-2xl font-bold text-white transition-colors group-hover:text-violet-200 sm:text-3xl">
                    {project.title}
                  </h3>
                  <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                    {project.description}
                  </p>
                </div>

                <div className="relative z-10 mt-8">
                  <ul className="mb-6 flex flex-wrap gap-2">
                    {project.tech.map((item) => (
                      <li
                        key={item}
                        className="rounded border border-white/10 bg-black/30 px-2.5 py-1 font-mono text-[10px] text-white/70"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                  <button
                    type="button"
                    onClick={() => setActiveProject(project.id)}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3.5 text-xs font-bold uppercase tracking-[0.16em] text-white transition-colors hover:bg-violet-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-300"
                  >
                    Abrir demonstração
                    <MoveUpRight aria-hidden className="h-4 w-4" />
                  </button>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {activeProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) {
                setActiveProject(null);
              }
            }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-3 backdrop-blur-md sm:p-6"
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="interactive-project-title"
              initial={{ scale: 0.97, y: 16 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.97, y: 16 }}
              className="flex max-h-[92dvh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0c0e14] shadow-2xl"
            >
              <div className="flex shrink-0 items-center justify-between gap-4 border-b border-white/10 bg-[#090a10] px-4 py-3 sm:px-6">
                <div className="flex min-w-0 items-center gap-3">
                  <span
                    aria-hidden
                    className="h-2.5 w-2.5 shrink-0 animate-pulse rounded-full bg-emerald-400"
                  />
                  <h2
                    id="interactive-project-title"
                    className="truncate font-mono text-xs uppercase tracking-widest text-white/80"
                  >
                    {interactiveProjects.find(
                      (project) => project.id === activeProject
                    )?.title ?? "Demonstração"}
                  </h2>
                </div>
                <button
                  type="button"
                  autoFocus
                  onClick={() => setActiveProject(null)}
                  className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-white transition-colors hover:border-white/25 hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-violet-300"
                >
                  <span className="hidden sm:inline">Fechar</span>
                  <X aria-hidden className="h-4 w-4" />
                  <span className="sr-only">Fechar demonstração</span>
                </button>
              </div>

              <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
                {activeProject === "chronos" && <ChronosBooking />}
                {activeProject === "pulsespin" && <PulseSpinRoulette />}
                {activeProject === "memory" && <MemoryMatrix />}
                {activeProject === "voxelvaders" && <ArcadeCabinetHub />}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-12 flex flex-wrap gap-3">
        <Link
          href="/design"
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-5 py-2.5 text-sm font-semibold text-muted-foreground transition-colors hover:border-violet-300/30 hover:text-violet-200"
        >
          Explorar portfólio de design
          <ArrowUpRight className="h-4 w-4" />
        </Link>
        <Link
          href="/templates"
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-5 py-2.5 text-sm font-semibold text-muted-foreground transition-colors hover:border-violet-300/30 hover:text-violet-200"
        >
          Ver templates web
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}

const DESIGN_GALLERIES = [
  {
    id: "design-grafico",
    title: "Design gráfico",
    description: "Peças gráficas, materiais impressos e comunicação visual.",
    folder: "port-dg",
    works: [
      "aw-cartao.jpg",
      "bargento-aheadworks.jpg",
      "bargento-cardapio.jpg",
      "camiseta.png",
      "cartao-pink-frente-bg.jpg",
      "cartao-pink-frente.jpg",
      "cartao-pink-verso-bg.jpg",
      "cartao-pink-verso.jpg",
      "faxia-bela-juba.jpg",
      "faxia-bela-juba.png",
      "flavia-cartao-bg.jpg",
      "flavia-cartao-vs-bg.jpg",
      "flavia-cartao-vs.jpg",
      "flavia-cartao.jpg",
      "fox-banner-1-bg.jpg",
      "fox-banner-1.jpg",
      "fox-banner-2-bg.jpg",
      "fox-banner-2.jpg",
      "fox-banner-3.jpg",
      "impressao-cardapio-1.jpg",
      "impressao-cardapio-2.jpg",
      "impressao-cardapio-bg-2.jpg",
      "meu-old.jpg",
      "panfleto-paty-1.jpg",
      "panfleto-paty-2.jpg",
      "panfleto-severo-2.jpg",
      "panfleto-severo-3.jpg",
      "panfleto-severo1.jpg",
      "pink-cardapio-2.jpg",
      "tutoia-panfleto.jpg",
      "vale-diamix-pq.jpg",
      "vale-diamix.jpg",
    ],
  },
  {
    id: "web-design",
    title: "Web design",
    description:
      "Layouts, banners e materiais criados para experiências digitais.",
    folder: "port-wd",
    works: [
      "banner-promo-rheem-2.jpg",
      "banner-promo-rheem.jpg",
      "banners-ecommerce-(1).jpg",
      "banners-ecommerce-(3).jpg",
      "banners-ecommerce-(4).jpg",
      "banners-ecommerce-(5).jpg",
      "banners-ecommerce-aw.jpg",
      "bargento-capa-face.jpg",
      "bargento-divulga--1.jpg",
      "bargento-divulga-2.jpg",
      "bargento-divulga.jpg",
      "belajuba-faixa.jpg",
      "capa-face-(1).jpg",
      "capa-face-(2).jpg",
      "capa-face-(4).jpg",
      "capa-face-(5).jpg",
      "capa-face-(8).jpg",
      "capa-face-3.jpg",
      "capa-face-7.png",
      "capa-face-8.jpg",
      "divulga-google.jpg",
      "email-mkt (1).jpg",
      "email-mkt (1).png",
      "email-mkt (2).jpg",
      "email-mkt (4).jpg",
      "email-mkt-3.jpg",
      "email-mkt-5.jpg",
      "especial-face-pq.jpg",
      "especial-face.jpg",
      "especial-site-carol.png",
      "especial-site.jpg",
      "pink-avatar.jpg",
      "pink-face-(1).jpg",
      "pink-face-(2).jpg",
      "pink-face-(4).jpg",
      "pink-face-(5).jpg",
      "pink-face-(7).jpg",
      "pink-face-3.jpg",
      "pink-face-divulga-1-big.jpg",
      "pink-face-divulga-2-big.jpg",
      "pink-face-divulga-2-pq.jpg",
      "pink-face-divulga-3-big.jpg",
      "pink-face-divulga-3-pq.jpg",
      "pink-face-divulga-4-big.jpg",
      "pink-face-divulga-4-pq.jpg",
      "pink-face-divulga-5-big.jpg",
      "pink-face-divulga-5-pq.jpg",
      "pink-face-divulga-6-big.jpg",
      "pink-face-divulga-6-pq.jpg",
      "post-face (1).jpg",
      "post-face (1).png",
      "post-face (11).jpg",
      "post-face (2).jpg",
      "post-face (2).png",
      "post-face (3).jpg",
      "post-face (4).jpg",
      "post-face (5).jpg",
      "post-face (6).jpg",
      "post-face (6).png",
      "post-face-(10).jpg",
      "post-face-(11).jpg",
      "post-face-(3).jpg",
      "post-face-(5).jpg",
      "post-face-(7).jpg",
      "post-face-(8).jpg",
      "post-face-3.jpg",
      "ragina-Capa_Face.jpg",
      "regina-avatar.jpg",
      "site-carol-gd.jpg",
      "site-flavia-gd.png",
      "thumbnail_Capa_Face.jpg",
    ],
  },
];

const formatWorkTitle = (filename: string) =>
  filename
    .replace(/\.[^.]+$/, "")
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

export function DesignPageContent() {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [lightboxItem, setLightboxItem] = useState<{
    src: string;
    title: string;
    category: string;
  } | null>(null);

  const visibleGalleries = DESIGN_GALLERIES.filter(
    (g) => activeTab === "all" || g.id === activeTab
  );

  return (
    <section className="container-luxe py-32 sm:py-40">
      <div className="mb-12 max-w-3xl">
        <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-violet-300/20 bg-violet-400/[0.06] px-3.5 py-1.5 text-xs font-bold uppercase tracking-widest text-violet-200">
          <Sparkles className="h-3.5 w-3.5 text-fuchsia-300" />
          Acervo Visual · Design
        </span>
        <h1 className="mb-6 font-display text-4xl font-bold uppercase tracking-tight sm:text-6xl">
          Design que conecta{" "}
          <span className="text-violet-gradient">ideias e pessoas.</span>
        </h1>
        <p className="text-lg leading-relaxed text-muted-foreground">
          Uma seleção com mais de 100 projetos de design gráfico, identidade
          visual, banners para e-commerce e campanhas digitais.
        </p>
      </div>

      {/* Barra de Filtro + Busca Rápida */}
      <div className="mb-14 flex flex-col justify-between gap-4 rounded-2xl border border-white/10 bg-[#0c0e14]/80 p-4 backdrop-blur-xl sm:flex-row sm:items-center">
        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-1 inline-flex items-center gap-1.5 px-2 font-mono text-[10px] uppercase tracking-widest text-white/40">
            <SlidersHorizontal className="h-3 w-3" />
            Filtrar:
          </span>
          <button
            type="button"
            onClick={() => setActiveTab("all")}
            className={`rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
              activeTab === "all"
                ? "bg-violet-gradient text-white shadow-violet-glow"
                : "border border-white/10 bg-white/[0.03] text-muted-foreground hover:text-white"
            }`}
          >
            Todos ({DESIGN_GALLERIES[0].works.length + DESIGN_GALLERIES[1].works.length})
          </button>
          {DESIGN_GALLERIES.map((gallery) => (
            <button
              key={gallery.id}
              type="button"
              onClick={() => setActiveTab(gallery.id)}
              className={`rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
                activeTab === gallery.id
                  ? "bg-violet-gradient text-white shadow-violet-glow"
                  : "border border-white/10 bg-white/[0.03] text-muted-foreground hover:text-white"
              }`}
            >
              {gallery.title} ({gallery.works.length})
            </button>
          ))}
        </div>

        {/* Campo de Busca */}
        <div className="relative w-full sm:w-64">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar peça (ex: banner, cartão)..."
            className="w-full rounded-xl border border-white/10 bg-white/[0.03] py-2 pl-9 pr-4 text-xs text-white placeholder:text-white/35 focus:border-violet-300/40 focus:outline-none"
          />
        </div>
      </div>

      {/* Galerias */}
      <div className="space-y-20">
        {visibleGalleries.map((gallery) => {
          const filteredWorks = gallery.works.filter((filename) =>
            formatWorkTitle(filename)
              .toLowerCase()
              .includes(searchQuery.toLowerCase())
          );

          return (
            <section key={gallery.id} id={gallery.id} className="scroll-mt-28">
              <div className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b border-white/10 pb-5">
                <div>
                  <h2 className="mb-1.5 font-display text-2xl font-bold sm:text-3xl">
                    {gallery.title}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {gallery.description}
                  </p>
                </div>
                <span className="rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1 font-mono text-xs text-violet-200">
                  {filteredWorks.length} projetos exibidos
                </span>
              </div>

              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {filteredWorks.map((filename) => {
                  const title = formatWorkTitle(filename);
                  const imgSrc = `/images/${gallery.folder}/${encodeURIComponent(
                    filename
                  )}`;

                  return (
                    <figure
                      key={filename}
                      onClick={() =>
                        setLightboxItem({
                          src: imgSrc,
                          title,
                          category: gallery.title,
                        })
                      }
                      className="group cursor-pointer overflow-hidden rounded-[1.6rem] border border-white/10 bg-[#0c0e14]/80 transition-all duration-300 hover:-translate-y-1 hover:border-violet-300/35 hover:shadow-xl"
                    >
                      <div className="relative aspect-[4/3] overflow-hidden bg-[#080a0f]">
                        <NextImage
                          src={imgSrc}
                          alt={`${gallery.title}: ${title}`}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-contain p-3 transition-transform duration-500 group-hover:scale-[1.04]"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 backdrop-blur-[2px] transition-opacity duration-300 group-hover:opacity-100">
                          <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-black/70 px-4 py-2 text-xs font-semibold text-white">
                            <ZoomIn className="h-3.5 w-3.5 text-violet-300" />
                            Ampliar Peça
                          </span>
                        </div>
                      </div>
                      <figcaption className="flex items-center justify-between gap-2 border-t border-white/[0.06] px-5 py-3.5">
                        <span className="truncate text-sm font-medium capitalize text-foreground/90 group-hover:text-violet-100">
                          {title}
                        </span>
                        <span className="shrink-0 font-mono text-[10px] uppercase tracking-wider text-white/35">
                          {gallery.id === "design-grafico" ? "Print" : "Digital"}
                        </span>
                      </figcaption>
                    </figure>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>

      {/* Modal Lightbox para Visualização Ampliada */}
      <AnimatePresence>
        {lightboxItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxItem(null)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-xl sm:p-8"
          >
            <motion.div
              initial={{ scale: 0.94, y: 12 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.94, y: 12 }}
              onClick={(e) => e.stopPropagation()}
              className="relative flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl border border-white/15 bg-[#0b0e14] shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
                <div>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-violet-300">
                    {lightboxItem.category}
                  </span>
                  <h3 className="font-display text-lg font-bold capitalize text-white">
                    {lightboxItem.title}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setLightboxItem(null)}
                  className="grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-white/5 text-white/70 transition-colors hover:bg-white/15 hover:text-white"
                  aria-label="Fechar visualização"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="relative h-[65vh] w-full bg-[#06080c] p-6">
                <NextImage
                  src={lightboxItem.src}
                  alt={lightboxItem.title}
                  fill
                  sizes="90vw"
                  className="object-contain p-4"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

export function TemplatesPageContent() {
  const templates = [
    {
      number: "01",
      category: "Fitness & bem-estar",
      title: "Academias & Esportes",
      brandName: "PulseFit",
      description:
        "Página de alta conversão focada em matrículas, exibição de planos e horários.",
      href: "/templates/academias",
      theme: "from-orange-500/20 via-[#181512] to-[#0c0d0f]",
      badgeColor: "border-orange-400/30 bg-orange-500/10 text-orange-200",
    },
    {
      number: "02",
      category: "Gastronomia",
      title: "Cardápios & Restaurantes",
      brandName: "Kobra Burger Lab",
      description:
        "Um cardápio digital com identidade marcante, pensado para apresentar pratos e facilitar pedidos.",
      href: "/templates/cardapio",
      theme: "from-amber-200/15 via-[#1c1713] to-[#0c0d0f]",
      badgeColor: "border-amber-300/30 bg-amber-400/10 text-amber-200",
    },
    {
      number: "03",
      category: "E-commerce & moda",
      title: "Lojas virtuais",
      brandName: "Vortex Atelier",
      description:
        "Uma vitrine editorial para apresentar coleções e criar uma experiência de compra envolvente.",
      href: "/templates/streetwear",
      theme: "from-violet-300/20 via-[#17111f] to-[#0c0d0f]",
      badgeColor: "border-violet-300/30 bg-violet-400/10 text-violet-200",
    },
  ];

  return (
    <section className="container-luxe py-32 sm:py-40">
      <div className="mx-auto mb-16 max-w-3xl text-center">
        <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-violet-300/20 bg-violet-400/[0.06] px-3.5 py-1.5 text-xs font-bold uppercase tracking-widest text-violet-200">
          <Sparkles className="h-3.5 w-3.5 text-fuchsia-300" />
          Arquiteturas Prontas · Templates
        </span>
        <h1 className="mb-6 font-display text-4xl font-bold uppercase tracking-tight sm:text-6xl">
          Seu próximo site começa{" "}
          <span className="text-violet-gradient">por aqui.</span>
        </h1>
        <p className="text-lg leading-relaxed text-muted-foreground">
          Explore nossos modelos de alta conversão prontos para diferentes tipos
          de negócios. Escolha a arquitetura ideal e nós personalizamos cada
          detalhe para a sua marca.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {templates.map((template) => (
          <article
            key={template.href}
            className="group flex flex-col overflow-hidden rounded-[2rem] border border-white/10 bg-[#0c0e14]/85 shadow-2xl backdrop-blur-2xl transition-all duration-300 hover:-translate-y-1.5 hover:border-violet-300/30"
          >
            <Link
              href={template.href}
              className="flex flex-1 flex-col focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-violet-300"
              aria-label={`Explorar o template ${template.title}`}
            >
              {/* Topo com Browser Mockup + Iframe em Escala Desktop */}
              <div
                className={`relative h-[290px] overflow-hidden bg-gradient-to-br ${template.theme} p-4 sm:h-[320px] sm:p-5`}
              >
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_30%,rgba(255,255,255,.09),transparent_55%)]" />

                <div className="relative h-full w-full overflow-hidden rounded-2xl border border-white/15 bg-[#0b0d10] shadow-2xl transition-transform duration-500 group-hover:scale-[1.02]">
                  {/* Barra do Navegador */}
                  <div className="flex h-8 items-center gap-1.5 border-b border-white/[0.08] bg-[#100d15] px-3">
                    <span className="h-2 w-2 rounded-full bg-[#ff6b61]/80" />
                    <span className="h-2 w-2 rounded-full bg-[#ffc14f]/80" />
                    <span className="h-2 w-2 rounded-full bg-[#49c781]/80" />
                    <span className="ml-auto min-w-0 max-w-[70%] truncate text-right font-mono text-[9px] text-white/40">
                      focuspulse.site{template.href}
                    </span>
                  </div>

                  {/* Iframe Escalado em 50% para mostrar visão Desktop completa */}
                  <div className="relative h-[calc(100%-2rem)] w-full overflow-hidden">
                    <iframe
                      src={template.href}
                      title={`Prévia do template ${template.title}`}
                      loading="lazy"
                      scrolling="no"
                      tabIndex={-1}
                      className="pointer-events-none h-[200%] w-[200%] origin-top-left scale-50 border-0 bg-[#0b0d10]"
                    />
                  </div>
                </div>

                <span className="absolute bottom-7 right-7 grid h-11 w-11 place-items-center rounded-full border border-white/25 bg-black/60 text-white backdrop-blur-md transition-all group-hover:scale-105 group-hover:border-white group-hover:bg-white group-hover:text-black">
                  <MoveUpRight className="h-4 w-4" />
                </span>
              </div>

              {/* Informações do Template */}
              <div className="flex flex-1 flex-col justify-between p-6 sm:p-7">
                <div>
                  <div className="mb-4 flex items-center justify-between gap-4">
                    <span
                      className={`rounded-full border px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] ${template.badgeColor}`}
                    >
                      {template.category}
                    </span>
                    <span className="font-mono text-xs text-white/35">
                      /{template.number}
                    </span>
                  </div>

                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-widest text-white/40">
                        Conceito: {template.brandName}
                      </p>
                      <h2 className="mt-1 font-display text-2xl font-semibold tracking-tight text-foreground group-hover:text-violet-100">
                        {template.title}
                      </h2>
                      <p className="mt-2 text-sm leading-6 text-muted-foreground">
                        {template.description}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-white/[0.08] pt-4 text-xs font-semibold text-violet-200">
                  <span>Abrir demonstração interativa</span>
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </div>
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}