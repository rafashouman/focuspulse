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
  BarChart3,
  Cpu,
  Radio,
  Maximize2,
  Terminal,
  Flame,
  MessageSquare,
  UtensilsCrossed,
  CheckCircle2,
} from "lucide-react";
import ChronosBooking from "@/components/ChronosBooking";
import MemoryMatrix from "@/components/games/MemoryMatrix";
import PulseSpinRoulette from "@/components/games/SpinToWin";
import ArcadeCabinetHub from "@/components/ArcadeCabinetHub";
import PulseMetricsDashboard from "@/components/PulseMetricsDashboard";

type InteractiveProjectId =
  | "chronos"
  | "pulsemetrics"
  | "pulsespin"
  | "memory"
  | "voxelvaders";

// =========================================================
// 1. APPS REAIS DE NEGÓCIOS (AGENDAMENTOS, DELIVERY & DASHBOARDS)
// =========================================================
const realBusinessApps = [
  {
    id: "chronos" as InteractiveProjectId,
    isModal: true,
    title: "ChronosBook Executive",
    category: "Sistema de Agendamentos & Reservas",
    statusBadge: "FIRESTORE ATOMIC LOCK",
    metricsLabel: "Zero Conflito de Horários • Confirmação WhatsApp",
    description:
      "Plataforma completa de agendamentos para clínicas, barbearias e consultorias com bloqueio transacional de horários em tempo real no Firestore e painel de gestão.",
    highlights: [
      "Escolha de profissional, serviço, data e horário",
      "Trava automática contra agendamento duplicado",
      "Autenticação Google e recibo de protocolo",
    ],
    tech: ["Firebase Auth", "Firestore Transactions", "Next.js", "Painel Admin"],
    accent: "from-blue-500/25 via-indigo-500/10 to-transparent",
    borderGlow: "hover:border-blue-400/60",
    buttonLabel: "Testar Sistema de Agendamento",
    icon: CalendarClock,
  },
  {
    id: "kobra-pdv",
    isModal: false,
    href: "/templates/cardapio",
    title: "Kobra Burger PDV & Delivery KDS",
    category: "App de Pedidos, Comanda & Cozinha",
    statusBadge: "PDV + KDS EM TEMPO REAL",
    metricsLabel: "Cardápio Digital • Comanda de Mesa • Monitor KDS",
    description:
      "Sistema operacional completo para restaurantes e hamburguerias: recebe pedidos de delivery, gerencia mesas VIP e exibe fila de preparo ao vivo no monitor da cozinha (KDS).",
    highlights: [
      "Personalização de adicionais e ponto da carne",
      "Monitor KDS interativo para controle de fila da cozinha",
      "Fechamento de conta e envio estruturado no WhatsApp",
    ],
    tech: ["Next.js App Router", "KDS Kitchen Monitor", "Carrinho Dinâmico", "WhatsApp API"],
    accent: "from-orange-500/25 via-amber-500/10 to-transparent",
    borderGlow: "hover:border-orange-400/60",
    buttonLabel: "Abrir Sistema Delivery & KDS",
    icon: UtensilsCrossed,
  },
  {
    id: "pulsemetrics" as InteractiveProjectId,
    isModal: true,
    title: "PulseMetrics BI & Telemetria",
    category: "Dashboard Executivo & Auditoria de Conversão",
    statusBadge: "META PIXEL & BI LIVE",
    metricsLabel: "Funil de Vendas • ROAS 6.8x • Eventos em Tempo Real",
    description:
      "Painel gerencial para acompanhamento de metas, receita recorrente, atribuição de campanhas e auditoria ao vivo de eventos disparados pelo Meta Pixel.",
    highlights: [
      "Gráficos interativos de receita, ticket médio e conversão",
      "Console de inspeção de eventos de marketing ao vivo",
      "Simulador de projeção de vendas e exportação de dados",
    ],
    tech: ["Analytics BI", "Meta Pixel SDK", "SVG Telemetry", "React 19"],
    accent: "from-cyan-400/25 via-teal-500/10 to-transparent",
    borderGlow: "hover:border-cyan-400/60",
    buttonLabel: "Abrir Dashboard Executivo",
    icon: BarChart3,
  },
];

// =========================================================
// 2. MINI-APPS LÚDICOS & EXPERIÊNCIAS INTERATIVAS
// =========================================================
const playfulApps = [
  {
    id: "pulsespin" as InteractiveProjectId,
    isModal: true,
    title: "PulseSpin Roulette",
    category: "Gamificação para Captura de Leads",
    tag: "+34% Conversão em Campanhas",
    description:
      "Roleta promocional com física de desaceleração e liberação de cupons exclusivos para transformar visitantes indecisos em clientes no WhatsApp.",
    icon: Flame,
    accent: "from-fuchsia-500/20 via-violet-500/5 to-transparent",
  },
  {
    id: "memory" as InteractiveProjectId,
    isModal: true,
    title: "Memory Matrix 3D",
    category: "Desafio Interativo com Ranking Global",
    tag: "Firebase Leaderboard · 3D Flip",
    description:
      "Jogo de memória espacial com cartas 3D, cronômetro de precisão e gravação de recordes autenticada com conta Google.",
    icon: Layers3,
    accent: "from-lime-400/20 via-emerald-500/5 to-transparent",
  },
  {
    id: "arknoid",
    isModal: false,
    href: "/webdev/arknoid",
    title: "Arknoid Physics Lab",
    category: "Experimento Físico 2D no Navegador",
    tag: "HTML5 Canvas · 60 FPS",
    description:
      "Releitura vetorial de Arkanoid projetada para demonstrar colisão elástica, deflexão angular e partículas em tempo real.",
    icon: Code2,
    accent: "from-amber-400/20 via-orange-500/5 to-transparent",
  },
  {
    id: "images-blend",
    isModal: false,
    href: "/webdev/images-blend",
    title: "Image Blend Studio",
    category: "Laboratório de Shaders & Direção de Arte",
    tag: "CSS Mix-Blend · Real-Time",
    description:
      "Ferramenta criativa para composição multicamada com controle de opacidade, matiz e blend modes direto no navegador.",
    icon: Sparkles,
    accent: "from-violet-500/20 via-indigo-500/5 to-transparent",
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
    <section className="container-luxe py-28 sm:py-36 relative">
      {/* Ambient Background Glows */}
      <div className="pointer-events-none absolute top-12 left-1/4 h-[450px] w-[450px] rounded-full bg-blue-600/10 blur-[150px]" />
      <div className="pointer-events-none absolute top-1/3 right-10 h-[400px] w-[400px] rounded-full bg-cyan-500/10 blur-[140px]" />

      {/* =========================================================
          HERO HEADER — FOCO EM SOLUÇÕES REAIS DE NEGÓCIO
      ========================================================= */}
      <div className="relative z-10 mb-16 flex flex-col justify-between gap-8 border-b border-white/10 pb-12 lg:flex-row lg:items-end">
        <div className="max-w-3xl">
          <div className="mb-5 flex flex-wrap items-center gap-2.5">
            <span className="inline-flex items-center gap-2 rounded-full border border-cyan-300/25 bg-cyan-400/[0.08] px-3.5 py-1.5 text-xs font-bold uppercase tracking-widest text-cyan-200">
              <Cpu className="h-3.5 w-3.5 text-cyan-300" />
              Sistemas Web, Agendamentos, Delivery & Dashboards
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 font-mono text-[11px] font-bold text-emerald-300">
              <span className="h-2 w-2 animate-ping rounded-full bg-emerald-400" />
              DEMONSTRAÇÕES AO VIVO
            </span>
          </div>

          <h1 className="mb-6 font-display text-4xl font-black uppercase tracking-tight text-white sm:text-6xl lg:leading-[1.02]">
            Aplicações reais que{" "}
            <span className="text-violet-gradient italic">
              operam o seu negócio.
            </span>
          </h1>
          <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
            Teste na prática nossos sistemas de{" "}
            <strong className="text-white">
              agendamento online, pedidos de delivery com monitor de cozinha e
              dashboards gerenciais
            </strong>
            . Logo abaixo, explore também nossas ferramentas lúdicas de
            gamificação e o fliperama interativo.
          </p>
        </div>

        {/* Atalhos Rápidos */}
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <a
            href="#sistemas-reais"
            className="inline-flex items-center gap-2 rounded-2xl bg-cyan-400 px-5 py-3.5 font-mono text-xs font-black uppercase tracking-wider text-slate-950 transition-all hover:bg-cyan-300 shadow-[0_0_25px_rgba(34,211,238,0.25)]"
          >
            <CalendarClock className="h-4 w-4" />
            Testar Apps de Negócios
          </a>
          <Link
            href="/#contato"
            className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/[0.05] px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-white transition-all hover:border-violet-300/50 hover:bg-violet-600"
          >
            <MessageSquare className="h-4 w-4" />
            Orçar Meu Sistema
          </Link>
        </div>
      </div>

      {/* =========================================================
          1º BLOCO (DESTAQUE PRINCIPAL): APPS REAIS DE USO COMERCIAL
          (AGENDAMENTOS, DELIVERY/PDV & DASHBOARDS)
      ========================================================= */}
      <div id="sistemas-reais" className="relative z-10 mb-28 scroll-mt-28">
        <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="mb-2 font-mono text-xs font-bold uppercase tracking-[0.2em] text-cyan-300">
              // 01. SOLUÇÕES PRONTAS PARA EMPRESAS & SERVIÇOS
            </p>
            <h2 className="font-display text-3xl font-black uppercase tracking-tight text-white sm:text-4xl">
              Agendamentos, Delivery & Dashboards
            </h2>
          </div>
          <p className="max-w-md text-xs sm:text-sm text-muted-foreground">
            Clique em qualquer sistema abaixo para abrir e testar o fluxo real
            de uso como cliente e como administrador.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-7 lg:grid-cols-3">
          {realBusinessApps.map((app, idx) => {
            const Icon = app.icon;
            return (
              <motion.article
                key={app.id}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.08 }}
                className={`group relative flex flex-col justify-between overflow-hidden rounded-[2.2rem] border border-white/15 bg-[#0c0e14]/95 p-7 shadow-2xl backdrop-blur-2xl transition-all duration-300 hover:-translate-y-1.5 ${app.borderGlow}`}
              >
                <div
                  aria-hidden
                  className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${app.accent} opacity-75 transition-opacity duration-500 group-hover:opacity-100`}
                />

                <div className="relative z-10">
                  {/* Top Badges */}
                  <div className="mb-6 flex items-center justify-between gap-2">
                    <span className="rounded-full border border-emerald-400/35 bg-emerald-500/10 px-3 py-1 font-mono text-[10px] font-bold text-emerald-300">
                      ● {app.statusBadge}
                    </span>
                    <div className="grid h-12 w-12 place-items-center rounded-2xl border border-white/15 bg-black/50 text-white transition-transform duration-300 group-hover:scale-110 group-hover:border-cyan-400 group-hover:bg-cyan-500 group-hover:text-slate-950">
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>

                  <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-cyan-300 block mb-1">
                    {app.category}
                  </span>
                  <h3 className="mb-3 font-display text-2xl font-black uppercase tracking-tight text-white">
                    {app.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground mb-5">
                    {app.description}
                  </p>

                  {/* Checklist de Funcionalidades de Negócio */}
                  <div className="space-y-2 mb-6 rounded-2xl border border-white/10 bg-black/35 p-4">
                    {app.highlights.map((h, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-2 text-xs text-white/85"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5 text-cyan-400 shrink-0 mt-0.5" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="relative z-10 pt-4 border-t border-white/10 space-y-4">
                  <div className="flex flex-wrap gap-1.5">
                    {app.tech.map((t) => (
                      <span
                        key={t}
                        className="rounded-lg border border-white/10 bg-black/40 px-2.5 py-1 font-mono text-[10px] text-white/75"
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  {app.isModal ? (
                    <button
                      type="button"
                      onClick={() =>
                        setActiveProject(app.id as InteractiveProjectId)
                      }
                      className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-white hover:bg-cyan-400 text-slate-950 px-5 py-3.5 text-xs font-black uppercase tracking-wider transition-all shadow-lg"
                    >
                      <span>{app.buttonLabel}</span>
                      <MoveUpRight className="h-4 w-4" />
                    </button>
                  ) : (
                    <Link
                      href={app.href!}
                      className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-white hover:bg-orange-400 text-slate-950 px-5 py-3.5 text-xs font-black uppercase tracking-wider transition-all shadow-lg"
                    >
                      <span>{app.buttonLabel}</span>
                      <MoveUpRight className="h-4 w-4" />
                    </Link>
                  )}
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>

      {/* =========================================================
          2º BLOCO: MINI-APPS LÚDICOS, GAMIFICAÇÃO & SANDBOX CRIATIVO
      ========================================================= */}
      <div className="relative z-10 mb-28 border-t border-white/10 pt-20">
        <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="mb-2 font-mono text-xs font-bold uppercase tracking-[0.2em] text-fuchsia-300">
              // 02. ENGAJAMENTO DE CAMPANHAS & EXPERIMENTOS VISUAIS
            </p>
            <h2 className="font-display text-2xl font-black uppercase tracking-tight text-white sm:text-4xl">
              Mini-Apps Lúdicos & Sandbox Criativo
            </h2>
          </div>
          <p className="max-w-md text-xs sm:text-sm text-muted-foreground">
            Dinâmicas promocionais para capturar leads, reter visitantes e
            demonstrar física e shaders em tempo real.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {playfulApps.map((item) => {
            const Icon = item.icon;

            const CardInner = (
              <>
                <div
                  aria-hidden
                  className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${item.accent} opacity-65 transition-opacity duration-500 group-hover:opacity-100`}
                />

                <div className="relative z-10">
                  <div className="mb-6 flex items-center justify-between">
                    <div className="grid h-12 w-12 place-items-center rounded-2xl border border-violet-300/25 bg-violet-400/[0.08] text-violet-200 transition-transform duration-300 group-hover:scale-105 group-hover:bg-violet-500 group-hover:text-white">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-violet-200">
                      {item.tag}
                    </span>
                  </div>

                  <p className="mb-1.5 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-violet-200">
                    {item.category}
                  </p>
                  <div className="mb-3 flex items-center justify-between gap-4">
                    <h3 className="font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
                      {item.title}
                    </h3>
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/15 bg-white/5 text-white/70 transition-all group-hover:border-white group-hover:bg-white group-hover:text-black">
                      <ArrowUpRight className="h-5 w-5" />
                    </span>
                  </div>
                  <p className="max-w-lg text-sm leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                </div>

                <div className="relative z-10 mt-6 flex items-center justify-between border-t border-white/[0.08] pt-4 text-xs font-semibold text-violet-200/80">
                  <span>
                    {item.isModal
                      ? "Executar mini-app interativo"
                      : "Abrir laboratório dedicado"}
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-white/40 group-hover:text-violet-200">
                    Iniciar Experiência →
                  </span>
                </div>
              </>
            );

            if (item.isModal) {
              return (
                <div
                  key={item.id}
                  onClick={() =>
                    setActiveProject(item.id as InteractiveProjectId)
                  }
                  className="group cursor-pointer relative flex flex-col justify-between overflow-hidden rounded-[2rem] border border-white/10 bg-[#0c0e14]/85 p-7 shadow-2xl backdrop-blur-2xl transition-all duration-300 hover:-translate-y-1.5 hover:border-violet-300/35 sm:p-9"
                >
                  {CardInner}
                </div>
              );
            }

            return (
              <Link
                key={item.id}
                href={item.href!}
                className="group relative flex flex-col justify-between overflow-hidden rounded-[2rem] border border-white/10 bg-[#0c0e14]/85 p-7 shadow-2xl backdrop-blur-2xl transition-all duration-300 hover:-translate-y-1.5 hover:border-violet-300/35 sm:p-9"
              >
                {CardInner}
              </Link>
            );
          })}
        </div>
      </div>

      {/* =========================================================
          3º BLOCO (ENCERRAMENTO): PULSEDECK ARCADE HUB (GAMES)
      ========================================================= */}
      <div
        id="arcade-live-arena"
        className="relative z-10 mb-20 border-t border-white/10 pt-20 scroll-mt-28"
      >
        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-[0.22em] text-[#00F5D4]">
              <Radio className="h-4 w-4 animate-pulse" />
              // 03. BÔNUS TRACK · HARDWARE EMULADO NO NAVEGADOR
            </div>
            <h2 className="font-display text-3xl font-black uppercase tracking-tight text-white sm:text-4xl">
              PulseDeck <span className="text-[#FFB800]">Arcade Hub</span> (Live)
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden font-mono text-xs text-white/50 sm:inline">
              Troque os cartuchos ou jogue direto abaixo
            </span>
            <button
              type="button"
              onClick={() => setActiveProject("voxelvaders")}
              className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 font-mono text-xs font-bold uppercase tracking-wider text-white transition-all hover:border-[#00F5D4] hover:text-[#00F5D4]"
            >
              <Maximize2 className="h-3.5 w-3.5" />
              Modo Tela Cheia
            </button>
          </div>
        </div>

        <div className="relative rounded-[2.5rem] border border-white/15 bg-gradient-to-b from-[#13111C] via-[#0B0A10] to-[#07060B] p-2 sm:p-4 shadow-[0_30px_100px_rgba(0,0,0,0.85)]">
          <div className="pointer-events-none absolute -top-px left-12 right-12 h-[2px] bg-gradient-to-r from-transparent via-[#00F5D4] to-transparent opacity-70" />
          <ArcadeCabinetHub />
        </div>
      </div>

      {/* =========================================================
          MODAL DE EXECUÇÃO EM TELA CHEIA
      ========================================================= */}
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
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-2 backdrop-blur-xl sm:p-6"
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="interactive-project-title"
              initial={{ scale: 0.96, y: 16 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.96, y: 16 }}
              className="flex max-h-[94dvh] w-full max-w-6xl flex-col overflow-hidden rounded-3xl border border-white/15 bg-[#0c0e14] shadow-2xl"
            >
              <div className="flex shrink-0 items-center justify-between gap-4 border-b border-white/10 bg-[#07080d] px-5 py-3.5 sm:px-7">
                <div className="flex min-w-0 items-center gap-3">
                  <span
                    aria-hidden
                    className="h-2.5 w-2.5 shrink-0 animate-ping rounded-full bg-emerald-400"
                  />
                  <Terminal className="h-4 w-4 text-violet-400 shrink-0" />
                  <h2
                    id="interactive-project-title"
                    className="truncate font-mono text-xs font-bold uppercase tracking-widest text-white"
                  >
                    {activeProject === "voxelvaders"
                      ? "PULSEDECK ARCADE HUB // FULLSCREEN"
                      : realBusinessApps.find((p) => p.id === activeProject)
                        ?.title ??
                      playfulApps.find((p) => p.id === activeProject)?.title ??
                      "Demonstração Interativa"}
                  </h2>
                </div>
                <button
                  type="button"
                  autoFocus
                  onClick={() => setActiveProject(null)}
                  className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-3.5 py-2 text-xs font-bold uppercase tracking-wider text-white transition-colors hover:border-red-400/50 hover:bg-red-500/20"
                >
                  <span className="hidden sm:inline">Encerrar Sessão</span>
                  <X aria-hidden className="h-4 w-4" />
                </button>
              </div>

              <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
                {activeProject === "chronos" && <ChronosBooking />}
                {activeProject === "pulsespin" && <PulseSpinRoulette />}
                {activeProject === "memory" && <MemoryMatrix />}
                {activeProject === "pulsemetrics" && <PulseMetricsDashboard />}
                {activeProject === "voxelvaders" && <ArcadeCabinetHub />}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer Navigation Links */}
      <div className="mt-16 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-8">
        <div className="flex flex-wrap gap-3">
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

        <Link
          href="/#contato"
          className="inline-flex items-center gap-2 rounded-full bg-violet-600 hover:bg-violet-500 px-6 py-2.5 text-xs font-black uppercase tracking-wider text-white transition-all shadow-lg"
        >
          <span>Falar com a FocusPulse</span>
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

const DESIGN_GALLERIES = [
  {
    id: "design-grafico",
    title: "Design Gráfico & Print",
    code: "ARCHIVE // PRINT-01",
    accent: "from-rose-500/20 via-amber-500/5 to-transparent",
    badgeClass: "border-rose-400/30 bg-rose-500/10 text-rose-200",
    description:
      "Identidade física, papelaria corporativa, cardápios gastronômicos, vestuário e materiais promocionais de alto impacto.",
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
    title: "Web Design & Performance Ads",
    code: "ARCHIVE // DIGITAL-02",
    accent: "from-violet-500/20 via-cyan-500/5 to-transparent",
    badgeClass: "border-violet-400/30 bg-violet-500/10 text-violet-200",
    description:
      "Hero banners para e-commerce, campanhas de tráfego pago, social media, e-mail marketing de retenção e interfaces web.",
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

type DesignSubTag =
  | "ALL"
  | "BANNERS"
  | "SOCIAL"
  | "IDENTIDADE"
  | "IMPRESSOS"
  | "WEB_EMAIL";

const SUB_TAGS: Array<{ id: DesignSubTag; label: string }> = [
  { id: "ALL", label: "Todas as Especialidades" },
  { id: "BANNERS", label: "Banners & E-commerce" },
  { id: "SOCIAL", label: "Social Media & Capas" },
  { id: "IDENTIDADE", label: "Cartões & Identidade" },
  { id: "IMPRESSOS", label: "Cardápios & Impressos" },
  { id: "WEB_EMAIL", label: "Web & E-mail Mkt" },
];

const formatWorkTitle = (filename: string) =>
  filename
    .replace(/\.[^.]+$/, "")
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const classifyDesignPiece = (filename: string): {
  tagId: DesignSubTag;
  label: string;
  deliverableType: string;
} => {
  const lower = filename.toLowerCase();
  if (lower.includes("banner") || lower.includes("faixa") || lower.includes("faxia")) {
    return {
      tagId: "BANNERS",
      label: "Hero Banner / Display",
      deliverableType: "Alta Conversão & Destaque Visual",
    };
  }
  if (lower.includes("cartao") || lower.includes("avatar") || lower.includes("camiseta") || lower.includes("vale")) {
    return {
      tagId: "IDENTIDADE",
      label: "Branding & Identidade",
      deliverableType: "Ponto de Contato da Marca",
    };
  }
  if (lower.includes("cardapio") || lower.includes("panfleto") || lower.includes("impressao")) {
    return {
      tagId: "IMPRESSOS",
      label: "Editorial & Print",
      deliverableType: "Material Físico Diagramado",
    };
  }
  if (lower.includes("email") || lower.includes("site") || lower.includes("google")) {
    return {
      tagId: "WEB_EMAIL",
      label: "UI Web & CRM",
      deliverableType: "Layout Digital & Retenção",
    };
  }
  return {
    tagId: "SOCIAL",
    label: "Social & Campanha",
    deliverableType: "Engajamento em Redes Sociais",
  };
};

interface EnrichedWorkItem {
  id: string;
  filename: string;
  title: string;
  src: string;
  galleryId: string;
  galleryTitle: string;
  tagId: DesignSubTag;
  tagLabel: string;
  deliverableType: string;
  formatExt: string;
}

const ALL_ENRICHED_WORKS: EnrichedWorkItem[] = DESIGN_GALLERIES.flatMap(
  (gallery) =>
    gallery.works.map((filename, idx) => {
      const meta = classifyDesignPiece(filename);
      const ext = filename.split(".").pop()?.toUpperCase() || "JPG";
      return {
        id: `${gallery.id}-${idx}-${filename}`,
        filename,
        title: formatWorkTitle(filename),
        src: `/images/${gallery.folder}/${encodeURIComponent(filename)}`,
        galleryId: gallery.id,
        galleryTitle: gallery.title,
        tagId: meta.tagId,
        tagLabel: meta.label,
        deliverableType: meta.deliverableType,
        formatExt: ext,
      };
    })
);

export function DesignPageContent() {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [activeSubTag, setActiveSubTag] = useState<DesignSubTag>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [gridDensity, setGridDensity] = useState<"editorial" | "compact">(
    "editorial"
  );
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [isZoomed, setIsZoomed] = useState<boolean>(false);
  const [canvasBg, setCanvasBg] = useState<"dark" | "checker">("dark");

  // Lista filtrada globalmente para permitir navegação Anterior/Próximo no Lightbox
  const filteredAllWorks = ALL_ENRICHED_WORKS.filter((item) => {
    const matchGallery = activeTab === "all" || item.galleryId === activeTab;
    const matchSubTag =
      activeSubTag === "ALL" || item.tagId === activeSubTag;
    const matchSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tagLabel.toLowerCase().includes(searchQuery.toLowerCase());
    return matchGallery && matchSubTag && matchSearch;
  });

  const activeLightboxItem =
    lightboxIndex !== null ? filteredAllWorks[lightboxIndex] ?? null : null;

  // Navegação por teclado dentro do Studio Lightbox
  useEffect(() => {
    if (lightboxIndex === null) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setLightboxIndex(null);
        setIsZoomed(false);
      } else if (e.key === "ArrowRight") {
        setIsZoomed(false);
        setLightboxIndex((prev) =>
          prev !== null ? (prev + 1) % filteredAllWorks.length : null
        );
      } else if (e.key === "ArrowLeft") {
        setIsZoomed(false);
        setLightboxIndex((prev) =>
          prev !== null
            ? (prev - 1 + filteredAllWorks.length) % filteredAllWorks.length
            : null
        );
      }
    };

    window.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [lightboxIndex, filteredAllWorks.length]);

  const totalCount = ALL_ENRICHED_WORKS.length;

  return (
    <section className="container-luxe py-28 sm:py-36 relative">
      {/* Ambient Studio Glows */}
      <div className="pointer-events-none absolute top-10 left-1/4 h-[460px] w-[460px] rounded-full bg-rose-500/10 blur-[150px]" />
      <div className="pointer-events-none absolute top-1/3 right-10 h-[420px] w-[420px] rounded-full bg-violet-600/10 blur-[150px]" />

      {/* =========================================================
          1. HERO EDITORIAL DE DIREÇÃO DE ARTE + TELEMETRIA DO ACERVO
      ========================================================= */}
      <div className="relative z-10 mb-14 border-b border-white/10 pb-12">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <div className="mb-5 flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-2 rounded-full border border-rose-300/25 bg-rose-400/10 px-3.5 py-1.5 text-xs font-bold uppercase tracking-widest text-rose-200">
                <Sparkles className="h-3.5 w-3.5 text-amber-300" />
                FocusPulse Creative Vault · Direção de Arte
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-violet-400/30 bg-violet-500/10 px-3 py-1 font-mono text-[11px] font-bold text-violet-200">
                ● {totalCount} PEÇAS CATALOGADAS
              </span>
            </div>

            <h1 className="mb-5 font-display text-4xl font-black uppercase tracking-tight text-white sm:text-6xl lg:leading-[1.02]">
              Design pensado para{" "}
              <span className="bg-gradient-to-r from-rose-300 via-fuchsia-200 to-violet-300 bg-clip-text text-transparent italic">
                atrair, posicionar e vender.
              </span>
            </h1>

            <p className="max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              Explore nosso acervo real de campanhas para e-commerce, banners de
              alta conversão, papelaria corporativa, cardápios e identidades
              visuais. Clique em qualquer peça para abrir na{" "}
              <strong className="text-white">Mesa de Inspeção Studio</strong>.
            </p>
          </div>

          {/* Painel Lateral de Métricas do Estúdio (5 Cols) */}
          <div className="lg:col-span-5 grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="rounded-2xl border border-white/10 bg-[#0c0e14]/90 p-4 backdrop-blur-xl">
              <span className="font-mono text-[10px] uppercase tracking-widest text-rose-300 block">
                // PRINT & BRAND
              </span>
              <span className="mt-1 font-display text-3xl font-black text-white block">
                {DESIGN_GALLERIES[0].works.length}
              </span>
              <span className="text-[11px] text-muted-foreground">
                Peças Gráficas & Impressos
              </span>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#0c0e14]/90 p-4 backdrop-blur-xl">
              <span className="font-mono text-[10px] uppercase tracking-widest text-violet-300 block">
                // DIGITAL & ADS
              </span>
              <span className="mt-1 font-display text-3xl font-black text-white block">
                {DESIGN_GALLERIES[1].works.length}
              </span>
              <span className="text-[11px] text-muted-foreground">
                Banners, Social & E-mail
              </span>
            </div>

            <div className="col-span-2 sm:col-span-1 rounded-2xl border border-rose-400/25 bg-gradient-to-br from-rose-500/15 via-[#140e1a] to-[#0b0d13] p-4 flex flex-col justify-between">
              <span className="font-mono text-[10px] uppercase tracking-widest text-amber-300 block">
                // SOB MEDIDA
              </span>
              <Link
                href="/#planosdg"
                className="mt-2 inline-flex items-center justify-between text-xs font-black uppercase tracking-wider text-white hover:text-rose-200"
              >
                <span>Ver Packs de Design</span>
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================
          2. CONSOLE DE FILTRAGEM INTELIGENTE (STICKY DOCK)
      ========================================================= */}
      <div className="sticky top-20 z-30 mb-14 rounded-3xl border border-white/15 bg-[#0b0d14]/90 p-4 shadow-[0_20px_50px_rgba(0,0,0,0.75)] backdrop-blur-2xl sm:p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          {/* Abas Principais (Todos / Gráfico / Web) */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="mr-1 inline-flex items-center gap-1.5 px-2 font-mono text-[10px] uppercase tracking-widest text-white/45">
              <SlidersHorizontal className="h-3.5 w-3.5 text-rose-300" />
              Coleção:
            </span>
            <button
              type="button"
              onClick={() => setActiveTab("all")}
              className={`rounded-xl px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all ${activeTab === "all"
                  ? "bg-gradient-to-r from-rose-500 to-violet-600 text-white shadow-lg"
                  : "border border-white/10 bg-white/[0.03] text-muted-foreground hover:text-white"
                }`}
            >
              Acervo Completo ({totalCount})
            </button>
            {DESIGN_GALLERIES.map((gallery) => (
              <button
                key={gallery.id}
                type="button"
                onClick={() => setActiveTab(gallery.id)}
                className={`rounded-xl px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all ${activeTab === gallery.id
                    ? "bg-gradient-to-r from-rose-500 to-violet-600 text-white shadow-lg"
                    : "border border-white/10 bg-white/[0.03] text-muted-foreground hover:text-white"
                  }`}
              >
                {gallery.title} ({gallery.works.length})
              </button>
            ))}
          </div>

          {/* Busca + Alternador de Densidade do Grid */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative flex-1 sm:w-64">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar cliente ou peça (ex: rheem, cartão, cardápio)..."
                className="w-full rounded-xl border border-white/10 bg-black/40 py-2.5 pl-10 pr-4 text-xs text-white placeholder:text-white/35 focus:border-rose-400/50 focus:outline-none"
              />
            </div>

            <div className="inline-flex items-center rounded-xl border border-white/10 bg-black/40 p-1 self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setGridDensity("editorial")}
                className={`rounded-lg px-3 py-1.5 font-mono text-[10px] font-bold uppercase transition-all ${gridDensity === "editorial"
                    ? "bg-white/15 text-white"
                    : "text-white/45 hover:text-white"
                  }`}
                title="Grid Editorial Assimétrico com destaques"
              >
                Bento Editorial
              </button>
              <button
                type="button"
                onClick={() => setGridDensity("compact")}
                className={`rounded-lg px-3 py-1.5 font-mono text-[10px] font-bold uppercase transition-all ${gridDensity === "compact"
                    ? "bg-white/15 text-white"
                    : "text-white/45 hover:text-white"
                  }`}
                title="Grade compacta de 4 colunas"
              >
                Compacto (4x)
              </button>
            </div>
          </div>
        </div>

        {/* Sub-filtros Inteligentes por Tipo de Entregável */}
        <div className="mt-4 flex items-center gap-2 overflow-x-auto border-t border-white/[0.07] pt-3.5 no-scrollbar">
          <span className="font-mono text-[10px] uppercase tracking-wider text-white/40 shrink-0 mr-1">
            Formato:
          </span>
          {SUB_TAGS.map((tag) => {
            const active = activeSubTag === tag.id;
            return (
              <button
                key={tag.id}
                type="button"
                onClick={() => setActiveSubTag(tag.id)}
                className={`shrink-0 rounded-lg px-3 py-1 font-mono text-[11px] font-semibold transition-all ${active
                    ? "border border-rose-400/40 bg-rose-500/20 text-rose-200"
                    : "border border-transparent bg-white/[0.03] text-white/55 hover:bg-white/[0.07] hover:text-white"
                  }`}
              >
                {tag.label}
              </button>
            );
          })}

          {(activeSubTag !== "ALL" || searchQuery.trim() !== "") && (
            <button
              type="button"
              onClick={() => {
                setActiveSubTag("ALL");
                setSearchQuery("");
              }}
              className="ml-auto shrink-0 font-mono text-[10px] uppercase text-rose-300 hover:underline"
            >
              Limpar filtros ({filteredAllWorks.length} resultados)
            </button>
          )}
        </div>
      </div>

      {/* =========================================================
          3. GALERIAS COM BENTO GRID DINÂMICO & OVERLAY DE ESTÚDIO
      ========================================================= */}
      {filteredAllWorks.length === 0 ? (
        <div className="rounded-3xl border border-white/10 bg-[#0c0e14]/80 p-12 text-center">
          <p className="font-display text-2xl font-bold text-white">
            Nenhuma peça encontrada para &ldquo;{searchQuery}&rdquo;
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Tente limpar a busca ou alternar a categoria de formato acima.
          </p>
          <button
            type="button"
            onClick={() => {
              setActiveTab("all");
              setActiveSubTag("ALL");
              setSearchQuery("");
            }}
            className="mt-6 rounded-xl bg-violet-600 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white"
          >
            Restaurar Todo o Acervo
          </button>
        </div>
      ) : (
        <div className="space-y-24">
          {DESIGN_GALLERIES.filter(
            (g) => activeTab === "all" || g.id === activeTab
          ).map((gallery) => {
            const sectionItems = filteredAllWorks.filter(
              (item) => item.galleryId === gallery.id
            );

            if (sectionItems.length === 0) return null;

            return (
              <section
                key={gallery.id}
                id={gallery.id}
                className="scroll-mt-36"
              >
                {/* Cabeçalho da Seção */}
                <div className="mb-8 flex flex-wrap items-end justify-between gap-4 rounded-3xl border border-white/10 bg-gradient-to-r from-[#11131c] via-[#0c0e14] to-transparent p-6 sm:p-8">
                  <div className="max-w-2xl">
                    <span
                      className={`inline-block rounded-full border px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-widest mb-3 ${gallery.badgeClass}`}
                    >
                      {gallery.code}
                    </span>
                    <h2 className="font-display text-2xl font-black uppercase tracking-tight text-white sm:text-4xl">
                      {gallery.title}
                    </h2>
                    <p className="mt-1.5 text-sm text-muted-foreground">
                      {gallery.description}
                    </p>
                  </div>

                  <div className="text-right font-mono">
                    <span className="block text-[10px] uppercase tracking-widest text-white/40">
                      EXIBINDO AGORA
                    </span>
                    <span className="text-2xl font-black text-white">
                      {sectionItems.length}{" "}
                      <span className="text-xs font-normal text-violet-300">
                        peças
                      </span>
                    </span>
                  </div>
                </div>

                {/* Grid de Peças */}
                <motion.div
                  layout
                  className={
                    gridDensity === "compact"
                      ? "grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
                      : "grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
                  }
                >
                  {sectionItems.map((item, idx) => {
                    // No modo Editorial, destaca a 1ª peça e a cada 7 peças com 2 colunas em telas grandes
                    const isFeaturedWide =
                      gridDensity === "editorial" &&
                      idx % 7 === 0 &&
                      sectionItems.length > 4;

                    const globalIdx = filteredAllWorks.findIndex(
                      (w) => w.id === item.id
                    );

                    return (
                      <motion.figure
                        layout
                        key={item.id}
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-40px" }}
                        transition={{ duration: 0.35 }}
                        onClick={() => {
                          setIsZoomed(false);
                          setLightboxIndex(globalIdx);
                        }}
                        className={`group cursor-pointer relative flex flex-col justify-between overflow-hidden rounded-[1.8rem] border border-white/10 bg-[#0b0d13]/90 transition-all duration-300 hover:-translate-y-1.5 hover:border-rose-300/40 hover:shadow-[0_20px_50px_rgba(0,0,0,0.7)] ${isFeaturedWide ? "lg:col-span-2" : ""
                          }`}
                      >
                        {/* Palco da Imagem com Grid Sutil de Fundo */}
                        <div
                          className={`relative w-full overflow-hidden bg-[#07090e] ${isFeaturedWide
                              ? "aspect-[16/9]"
                              : gridDensity === "compact"
                                ? "aspect-square"
                                : "aspect-[4/3]"
                            }`}
                          style={{
                            backgroundImage:
                              "radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)",
                            backgroundSize: "18px 18px",
                          }}
                        >
                          {/* Numeração Técnica no Canto */}
                          <div className="absolute left-3.5 top-3.5 z-10 flex items-center gap-2">
                            <span className="rounded-lg border border-white/10 bg-black/70 px-2.5 py-1 font-mono text-[10px] font-bold text-white/80 backdrop-blur-md">
                              #{String(idx + 1).padStart(2, "0")}
                            </span>
                            {isFeaturedWide && (
                              <span className="rounded-lg border border-amber-300/30 bg-amber-400/15 px-2.5 py-1 font-mono text-[10px] font-bold uppercase text-amber-200 backdrop-blur-md">
                                ★ Destaque Editorial
                              </span>
                            )}
                          </div>

                          <span className="absolute right-3.5 top-3.5 z-10 rounded-lg border border-white/10 bg-black/70 px-2 py-0.5 font-mono text-[9px] uppercase text-white/60 backdrop-blur-md">
                            {item.formatExt}
                          </span>

                          <NextImage
                            src={item.src}
                            alt={`${item.galleryTitle}: ${item.title}`}
                            fill
                            sizes={
                              isFeaturedWide
                                ? "(max-width: 1024px) 100vw, 66vw"
                                : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            }
                            className="object-contain p-4 transition-transform duration-500 group-hover:scale-[1.05]"
                          />

                          {/* Hover Action Curtain */}
                          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-black/80 via-black/35 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                            <span className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-black/80 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-xl backdrop-blur-md">
                              <ZoomIn className="h-4 w-4 text-rose-300" />
                              Inspecionar em Alta Resolução
                            </span>
                          </div>
                        </div>

                        {/* Rodapé Técnico da Peça */}
                        <figcaption className="flex items-center justify-between gap-3 border-t border-white/[0.07] bg-[#0c0f17] px-5 py-4">
                          <div className="min-w-0">
                            <span className="block font-mono text-[10px] uppercase tracking-wider text-rose-300/90">
                              {item.tagLabel}
                            </span>
                            <p className="truncate font-display text-base font-bold capitalize text-white group-hover:text-rose-100">
                              {item.title}
                            </p>
                          </div>

                          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/[0.04] text-white/60 transition-colors group-hover:border-rose-400/40 group-hover:bg-rose-500 group-hover:text-white">
                            <ArrowUpRight className="h-4 w-4" />
                          </span>
                        </figcaption>
                      </motion.figure>
                    );
                  })}
                </motion.div>
              </section>
            );
          })}
        </div>
      )}

      {/* =========================================================
          4. CTA DE CONVERSÃO DIRETA NO FINAL DO ACERVO
      ========================================================= */}
      <div className="mt-20 rounded-[2.2rem] border border-rose-400/25 bg-gradient-to-r from-rose-500/15 via-[#130f1d] to-[#0b0d14] p-8 sm:p-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 shadow-2xl">
        <div className="max-w-xl">
          <span className="font-mono text-xs font-bold uppercase tracking-widest text-amber-300 block mb-2">
            // DIREÇÃO DE ARTE PARA SUA MARCA
          </span>
          <h3 className="font-display text-2xl sm:text-3xl font-black uppercase text-white">
            Gostou do padrão visual? Criamos o enxoval criativo da sua empresa.
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Banners para lojas virtuais, identidade visual completa, cardápios e
            criativos de alta conversão entregues prontos para uso.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <Link
            href="/#planosdg"
            className="rounded-2xl border border-white/15 bg-white/5 hover:bg-white/10 px-6 py-4 text-xs font-bold uppercase tracking-wider text-white transition-all"
          >
            Ver Tabela de Preços Design
          </Link>
          <a
            href={`https://wa.me/5551993583936?text=${encodeURIComponent(
              "Olá! Vi o portfólio de Design da FocusPulse e gostaria de orçar criativos/identidade para minha marca."
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-rose-500 to-amber-500 px-7 py-4 text-xs font-black uppercase tracking-wider text-slate-950 shadow-lg transition-transform hover:scale-[1.02]"
          >
            <Sparkles className="h-4 w-4" />
            <span>Orçar Design no WhatsApp</span>
          </a>
        </div>
      </div>

      {/* =========================================================
          5. STUDIO LIGHTBOX INSPECTOR (ZOOM, CANVA BG, PREV/NEXT & CTA)
      ========================================================= */}
      <AnimatePresence>
        {activeLightboxItem && lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              setLightboxIndex(null);
              setIsZoomed(false);
            }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-3 backdrop-blur-2xl sm:p-6"
          >
            <motion.div
              initial={{ scale: 0.95, y: 14 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 14 }}
              onClick={(e) => e.stopPropagation()}
              className="relative flex max-h-[92vh] w-full max-w-6xl flex-col overflow-hidden rounded-3xl border border-white/15 bg-[#0b0d13] shadow-[0_30px_100px_rgba(0,0,0,0.9)]"
            >
              {/* Top Inspector Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-[#07090e] px-5 py-3.5">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="rounded-lg border border-rose-400/30 bg-rose-500/15 px-2.5 py-1 font-mono text-[10px] font-bold uppercase text-rose-200">
                    {activeLightboxItem.tagLabel}
                  </span>
                  <div className="min-w-0">
                    <h3 className="truncate font-display text-base font-bold capitalize text-white sm:text-lg">
                      {activeLightboxItem.title}
                    </h3>
                  </div>
                </div>

                {/* Controles da Mesa de Luz */}
                <div className="flex items-center gap-2">
                  <span className="hidden font-mono text-[11px] text-white/45 md:inline mr-2">
                    Peça {lightboxIndex + 1} de {filteredAllWorks.length}
                  </span>

                  <button
                    type="button"
                    onClick={() => setIsZoomed(!isZoomed)}
                    className={`rounded-xl border px-3 py-1.5 font-mono text-[10px] font-bold uppercase transition-colors ${isZoomed
                        ? "border-rose-400 bg-rose-500/20 text-rose-200"
                        : "border-white/10 bg-white/5 text-white/75 hover:text-white"
                      }`}
                  >
                    {isZoomed ? "Zoom 175% (Ativo)" : "Zoom +"}
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setCanvasBg(canvasBg === "dark" ? "checker" : "dark")
                    }
                    className="hidden sm:inline-flex rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 font-mono text-[10px] font-bold uppercase text-white/75 hover:text-white"
                  >
                    Fundo: {canvasBg === "dark" ? "Studio Dark" : "Grid Neutro"}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setLightboxIndex(null);
                      setIsZoomed(false);
                    }}
                    className="grid h-9 w-9 place-items-center rounded-xl border border-white/15 bg-white/5 text-white/80 transition-colors hover:border-red-400/50 hover:bg-red-500/20 hover:text-white"
                    aria-label="Fechar inspeção"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Corpo Principal: Canvas de Visualização + Barra Lateral de Especificações */}
              <div className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-12 overflow-hidden">
                {/* Palco da Imagem (9 Cols) */}
                <div
                  onClick={() => setIsZoomed(!isZoomed)}
                  className={`relative lg:col-span-9 h-[55vh] lg:h-[72vh] w-full overflow-auto flex items-center justify-center p-6 select-none ${isZoomed ? "cursor-zoom-out" : "cursor-zoom-in"
                    }`}
                  style={
                    canvasBg === "checker"
                      ? {
                        backgroundColor: "#141720",
                        backgroundImage:
                          "linear-gradient(45deg, #1c202c 25%, transparent 25%), linear-gradient(-45deg, #1c202c 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #1c202c 75%), linear-gradient(-45deg, transparent 75%, #1c202c 75%)",
                        backgroundSize: "24px 24px",
                        backgroundPosition:
                          "0 0, 0 12px, 12px -12px, -12px 0px",
                      }
                      : {
                        backgroundColor: "#05070b",
                        backgroundImage:
                          "radial-gradient(rgba(255,255,255,0.07) 1px, transparent 1px)",
                        backgroundSize: "20px 20px",
                      }
                  }
                >
                  <div
                    className={`relative transition-transform duration-300 ${isZoomed
                        ? "h-[140%] w-[140%] scale-125"
                        : "h-full w-full"
                      }`}
                  >
                    <NextImage
                      src={activeLightboxItem.src}
                      alt={activeLightboxItem.title}
                      fill
                      sizes="90vw"
                      className="object-contain p-2"
                    />
                  </div>
                </div>

                {/* Painel Lateral de Contexto & Conversão (3 Cols) */}
                <div className="lg:col-span-3 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-white/10 bg-[#0b0e15] p-6">
                  <div className="space-y-5">
                    <div>
                      <span className="font-mono text-[10px] uppercase tracking-widest text-white/40 block">
                        COLEÇÃO
                      </span>
                      <p className="text-sm font-bold text-white mt-0.5">
                        {activeLightboxItem.galleryTitle}
                      </p>
                    </div>

                    <div>
                      <span className="font-mono text-[10px] uppercase tracking-widest text-white/40 block">
                        ESPECIALIDADE
                      </span>
                      <p className="text-sm font-bold text-rose-200 mt-0.5">
                        {activeLightboxItem.tagLabel}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {activeLightboxItem.deliverableType}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-black/30 p-4 space-y-2 font-mono text-xs">
                      <div className="flex justify-between text-white/60">
                        <span>FORMATO:</span>
                        <span className="text-white font-bold">
                          {activeLightboxItem.formatExt}
                        </span>
                      </div>
                      <div className="flex justify-between text-white/60">
                        <span>DIREÇÃO:</span>
                        <span className="text-emerald-300 font-bold">
                          FocusPulse Studio
                        </span>
                      </div>
                    </div>

                    {/* Botões Anterior / Próximo */}
                    <div className="grid grid-cols-2 gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setIsZoomed(false);
                          setLightboxIndex(
                            (lightboxIndex - 1 + filteredAllWorks.length) %
                            filteredAllWorks.length
                          );
                        }}
                        className="rounded-xl border border-white/10 bg-white/[0.04] hover:bg-white/10 py-2.5 text-xs font-bold text-white transition-colors"
                      >
                        ← Anterior
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsZoomed(false);
                          setLightboxIndex(
                            (lightboxIndex + 1) % filteredAllWorks.length
                          );
                        }}
                        className="rounded-xl border border-white/10 bg-white/[0.04] hover:bg-white/10 py-2.5 text-xs font-bold text-white transition-colors"
                      >
                        Próxima →
                      </button>
                    </div>
                  </div>

                  {/* CTA contextual para encomendar uma peça igual */}
                  <div className="pt-6 border-t border-white/10 mt-6 space-y-3">
                    <a
                      href={`https://wa.me/5551993583936?text=${encodeURIComponent(
                        `Olá! Vi a peça "${activeLightboxItem.title}" (${activeLightboxItem.tagLabel}) no portfólio da FocusPulse e gostaria de orçar algo nessa linha para o meu negócio.`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 py-3.5 px-4 text-xs font-black uppercase tracking-wider text-slate-950 shadow-lg transition-transform hover:scale-[1.02]"
                    >
                      <span>Quero uma peça assim</span>
                      <ArrowUpRight className="h-4 w-4" />
                    </a>
                  </div>
                </div>
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
      category: "Fitness & Biomecânica",
      title: "Academias & Alta Performance",
      brandName: "PulseFit Lab",
      description:
        "Página de alta conversão na identidade Acid Lime & Emerald, focada em matrículas, passaportes e tour interativo.",
      href: "/templates/academias",
      theme: "from-lime-400/20 via-[#101914] to-[#080b09]",
      badgeColor: "border-lime-400/35 bg-lime-400/10 text-lime-200",
    },
    {
      number: "02",
      category: "Gastronomia & PDV KDS",
      title: "Hamburguerias & Delivery",
      brandName: "Kobra Burger Fire",
      description:
        "Vitrine gastronômica em tons de brasa e carmesim integrada ao App de Vendas, Comanda Digital, Mesas VIP e Monitor KDS.",
      href: "/templates/cardapio",
      theme: "from-orange-500/25 via-[#1c110e] to-[#0c0807]",
      badgeColor: "border-orange-400/35 bg-orange-500/10 text-orange-200",
    },
    {
      number: "03",
      category: "E-commerce & Moda",
      title: "Lojas Virtuais & Streetwear",
      brandName: "Vortex Atelier",
      description:
        "Vitrine editorial de luxo para apresentar coleções exclusivas e criar uma jornada de compra envolvente.",
      href: "/templates/streetwear",
      theme: "from-violet-300/20 via-[#17111f] to-[#0c0d0f]",
      badgeColor: "border-violet-300/30 bg-violet-400/10 text-violet-200",
    },
    {
      number: "04",
      category: "Automotivo & Seminovos",
      title: "Concessionárias & Multimarcas",
      brandName: "Prime Motors",
      description:
        "Portal automotivo em tema claro (Alabaster & Royal Blue) com comparativo FIPE, simulador CDC e agendamento de visita.",
      href: "/templates/carros",
      theme: "from-blue-500/25 via-[#101726] to-[#07080a]",
      badgeColor: "border-blue-400/35 bg-blue-500/10 text-blue-200",
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

      <div className="grid gap-6 lg:grid-cols-2">
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

      {/* CTA Direto para o Formulário de Contato no final de Templates */}
      <div className="mt-16 rounded-3xl border border-white/10 bg-[#0c0e14]/90 p-8 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <span className="font-mono text-xs uppercase tracking-widest text-violet-300 block mb-1">
            // PROJETO SOB MEDIDA
          </span>
          <h3 className="font-display text-2xl font-bold text-white">
            Quer uma arquitetura exclusiva para o seu negócio?
          </h3>
        </div>
        <Link
          href="/#contato"
          className="shrink-0 inline-flex items-center gap-2 rounded-2xl bg-violet-600 hover:bg-violet-500 px-6 py-4 text-xs font-black uppercase tracking-wider text-white transition-all shadow-lg"
        >
          <Flame className="h-4 w-4" />
          <span>Ir para o Formulário de Contato</span>
        </Link>
      </div>
    </section>
  );
}