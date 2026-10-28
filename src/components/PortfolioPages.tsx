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
            className={`rounded-xl px-4 py-2 text-xs font-semibold transition-all ${activeTab === "all"
                ? "bg-violet-gradient text-white shadow-violet-glow"
                : "border border-white/10 bg-white/[0.03] text-muted-foreground hover:text-white"
              }`}
          >
            Todos (
            {DESIGN_GALLERIES[0].works.length +
              DESIGN_GALLERIES[1].works.length}
            )
          </button>
          {DESIGN_GALLERIES.map((gallery) => (
            <button
              key={gallery.id}
              type="button"
              onClick={() => setActiveTab(gallery.id)}
              className={`rounded-xl px-4 py-2 text-xs font-semibold transition-all ${activeTab === gallery.id
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
                          {gallery.id === "design-grafico"
                            ? "Print"
                            : "Digital"}
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
      code: "ARCH // FITNESS-LAB",
      category: "Fitness & Biomecânica",
      title: "Academias & Alta Performance",
      brandName: "PulseFit Lab",
      description:
        "Arquitetura energética em Acid Lime & Emerald projetada para converter visitantes em alunos com calculadora metabólica, grade de treinos e passaporte VIP.",
      href: "/templates/academias",
      theme: "from-lime-400/20 via-[#101914] to-[#080b09]",
      badgeColor: "border-lime-400/35 bg-lime-400/10 text-lime-200",
      accentText: "text-lime-300",
      btnGradient: "from-lime-400 to-emerald-500 text-slate-950",
      palette: [
        { name: "Acid Lime", hex: "#A3E635" },
        { name: "Emerald Deep", hex: "#10B981" },
        { name: "Carbon Dark", hex: "#080B09" },
      ],
      conversionFocus: "+42% Retenção & Agendamento de Aula Experimental",
      modules: [
        "Calculadora de Gasto Calórico & IMC Interativa",
        "Grade Dinâmica de Modalidades por Objetivo",
        "Emissão de Free Pass / Passaporte Experimental",
        "Checkout de Planos Integrado ao WhatsApp",
      ],
      stack: ["Next.js App Router", "Framer Motion", "Tailwind CSS", "Meta Pixel"],
    },
    {
      number: "02",
      code: "ARCH // FOOD-PDV-KDS",
      category: "Gastronomia & PDV KDS",
      title: "Hamburguerias & Delivery",
      brandName: "Kobra Burger Fire",
      description:
        "Sistema gastronômico completo em tons de brasa e carmesim: cardápio digital de alta conversão, reserva de mesas VIP, comanda e monitor de cozinha (KDS).",
      href: "/templates/cardapio",
      theme: "from-orange-500/25 via-[#1c110e] to-[#0c0807]",
      badgeColor: "border-orange-400/35 bg-orange-500/10 text-orange-200",
      accentText: "text-orange-300",
      btnGradient: "from-orange-500 to-amber-400 text-slate-950",
      palette: [
        { name: "Ember Orange", hex: "#F97316" },
        { name: "Flame Amber", hex: "#F59E0B" },
        { name: "Charcoal", hex: "#0C0807" },
      ],
      conversionFocus: "Zero Taxa de Marketplace • Pedidos Diretos",
      modules: [
        "Cardápio Interativo com Adicionais e Ponto da Carne",
        "Monitor KDS (Kitchen Display System) em Tempo Real",
        "Reserva de Mesas VIP & Comanda Digital",
        "Disparo Estruturado do Pedido p/ WhatsApp da Loja",
      ],
      stack: ["Next.js App Router", "KDS State Engine", "Cart Context", "WhatsApp API"],
    },
    {
      number: "03",
      code: "ARCH // EDITORIAL-COMMERCE",
      category: "E-commerce & Moda",
      title: "Lojas Virtuais & Streetwear",
      brandName: "Vortex Atelier",
      description:
        "Vitrine editorial de luxo para marcas autorais e e-commerces que exigem direção de arte marcante, lookbook interativo e jornada de compra fluida.",
      href: "/templates/streetwear",
      theme: "from-violet-400/20 via-[#17111f] to-[#0c0d0f]",
      badgeColor: "border-violet-300/35 bg-violet-400/10 text-violet-200",
      accentText: "text-violet-300",
      btnGradient: "from-violet-500 to-fuchsia-500 text-white",
      palette: [
        { name: "Cyber Violet", hex: "#8B5CF6" },
        { name: "Fuchsia Glow", hex: "#D946EF" },
        { name: "Obsidian", hex: "#0C0D0F" },
      ],
      conversionFocus: "Posicionamento Premium & Aumento de Ticket Médio",
      modules: [
        "Lookbook Editorial com Filtro por Drop/Coleção",
        "Seletor Rápido de Tamanhos, Medidas e Tecidos",
        "Sacola Deslizante (Drawer Cart) com Cálculo Rápido",
        "Integração para Compra Direta ou Checkout Externo",
      ],
      stack: ["Next.js App Router", "Editorial UI", "Framer Motion", "Responsive Grid"],
    },
    {
      number: "04",
      code: "ARCH // AUTO-DEALERSHIP",
      category: "Automotivo & Seminovos",
      title: "Concessionárias & Multimarcas",
      brandName: "Prime Motors",
      description:
        "Portal automotivo em tema claro (Alabaster & Royal Blue) focado no mercado brasileiro real, com comparativo FIPE, simulador CDC e reserva no Firestore.",
      href: "/templates/carros",
      theme: "from-blue-500/25 via-[#101726] to-[#07080a]",
      badgeColor: "border-blue-400/35 bg-blue-500/10 text-blue-200",
      accentText: "text-sky-300",
      btnGradient: "from-blue-600 to-cyan-400 text-slate-950",
      palette: [
        { name: "Alabaster Light", hex: "#F8FAFC" },
        { name: "Royal Cobalt", hex: "#1D4ED8" },
        { name: "FIPE Emerald", hex: "#059669" },
      ],
      conversionFocus: "Geração de Fichas de Financiamento & Visitas na Loja",
      modules: [
        "Buscador Estilo Portal com Filtro 'Abaixo da FIPE'",
        "Simulador de Financiamento CDC + Avaliação de Troca",
        "Agendamento Atômico de Visita / Vídeo Ao Vivo (Firestore)",
        "Modal de Laudo Cautelar Dekra & Opcionais de Série",
      ],
      stack: ["Next.js App Router", "Firebase Auth", "Firestore Lock", "Light UI System"],
    },
    
  ];

  const [selectedIndex, setSelectedIndex] = useState<number>(3); // Inicia destacando o novo Prime Motors (ou altere para 0)
  const [viewportMode, setViewportMode] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [interactiveIframe, setInteractiveIframe] = useState<boolean>(true);
  const [fullscreenTemplate, setFullscreenTemplate] = useState<(typeof templates)[0] | null>(null);

  const activeTemplate = templates[selectedIndex];

  useEffect(() => {
    if (!fullscreenTemplate) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setFullscreenTemplate(null);
    };
    window.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [fullscreenTemplate]);

  return (
    <section className="container-luxe py-28 sm:py-36 relative">
      {/* Ambient Glows */}
      <div className="pointer-events-none absolute top-12 left-1/4 h-[460px] w-[460px] rounded-full bg-violet-600/10 blur-[150px]" />
      <div className="pointer-events-none absolute top-1/3 right-10 h-[420px] w-[420px] rounded-full bg-blue-500/10 blur-[150px]" />

      {/* =========================================================
          1. HERO HEADER DO CONSOLE DE ARQUITETURAS
      ========================================================= */}
      <div className="relative z-10 mb-14 flex flex-col justify-between gap-8 border-b border-white/10 pb-12 lg:flex-row lg:items-end">
        <div className="max-w-3xl">
          <div className="mb-5 flex flex-wrap items-center gap-2.5">
            <span className="inline-flex items-center gap-2 rounded-full border border-violet-300/25 bg-violet-400/[0.08] px-3.5 py-1.5 text-xs font-bold uppercase tracking-widest text-violet-200">
              <Sparkles className="h-3.5 w-3.5 text-fuchsia-300" />
              FocusPulse Architecture Lab · Templates Interativos
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 font-mono text-[11px] font-bold text-emerald-300">
              <span className="h-2 w-2 animate-ping rounded-full bg-emerald-400" />
              SIMULADOR RESPONSIVO AO VIVO
            </span>
          </div>

          <h1 className="mb-5 font-display text-4xl font-black uppercase tracking-tight text-white sm:text-6xl lg:leading-[1.02]">
            Seu próximo site começa{" "}
            <span className="text-violet-gradient italic">
              rodando ao vivo aqui.
            </span>
          </h1>
          <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
            Não mostramos apenas fotos estáticas. Use o{" "}
            <strong className="text-white">Console de Inspeção abaixo</strong>{" "}
            para navegar dentro de cada projeto em tempo real, testar a versão
            Mobile/Desktop e escolher a base ideal para o seu negócio.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <Link
            href="/#planos"
            className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/[0.05] px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-white transition-all hover:border-violet-300/50 hover:bg-violet-600"
          >
            <span>Ver Planos & Preços</span>
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* =========================================================
          2. CONSOLE INTERATIVO DE INSPECÇÃO AO VIVO (MASTER-DETAIL)
      ========================================================= */}
      <div
        id="template-live-console"
        className="relative z-10 mb-24 scroll-mt-24 rounded-[2.4rem] border border-white/15 bg-[#0a0c12]/95 p-4 shadow-[0_30px_100px_rgba(0,0,0,0.85)] backdrop-blur-2xl sm:p-7"
      >
        {/* Barra Superior de Seleção de Arquitetura + Controles de Viewport */}
        <div className="mb-6 flex flex-col justify-between gap-4 border-b border-white/10 pb-5 xl:flex-row xl:items-center">
          {/* Seletor de Projetos (Tabs do Console) */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 xl:pb-0 no-scrollbar">
            {templates.map((tpl, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <button
                  key={tpl.href}
                  type="button"
                  onClick={() => setSelectedIndex(idx)}
                  className={`group flex items-center gap-2.5 rounded-2xl border px-4 py-3 text-left transition-all shrink-0 ${isSelected
                      ? "border-violet-400/50 bg-gradient-to-r from-violet-500/20 via-fuchsia-500/10 to-transparent text-white shadow-lg"
                      : "border-white/10 bg-white/[0.03] text-white/55 hover:border-white/25 hover:text-white"
                    }`}
                >
                  <span className="font-mono text-xs font-bold text-violet-300">
                    /{tpl.number}
                  </span>
                  <div>
                    <span className="block text-xs font-black uppercase tracking-wider">
                      {tpl.brandName}
                    </span>
                    <span className="block font-mono text-[10px] text-white/45">
                      {tpl.category}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Controles de Viewport (Desktop / Tablet / Mobile) + Interatividade */}
          <div className="flex flex-wrap items-center justify-between gap-2.5 sm:justify-end">
            <div className="inline-flex items-center rounded-xl border border-white/10 bg-black/50 p-1">
              {[
                { id: "desktop", label: "Desktop (100%)" },
                { id: "tablet", label: "Tablet (768px)" },
                { id: "mobile", label: "Mobile (390px)" },
              ].map((vp) => (
                <button
                  key={vp.id}
                  type="button"
                  onClick={() =>
                    setViewportMode(vp.id as "desktop" | "tablet" | "mobile")
                  }
                  className={`rounded-lg px-3 py-1.5 font-mono text-[10px] font-bold uppercase transition-all ${viewportMode === vp.id
                      ? "bg-violet-600 text-white shadow"
                      : "text-white/45 hover:text-white"
                    }`}
                >
                  {vp.label}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setFullscreenTemplate(activeTemplate)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/5 px-3.5 py-2 font-mono text-[10px] font-bold uppercase tracking-wider text-white transition-colors hover:border-violet-400 hover:text-violet-200"
            >
              <Maximize2 className="h-3.5 w-3.5" />
              <span>Tela Cheia</span>
            </button>
          </div>
        </div>

        {/* Corpo do Console: Viewport Interativo (8 Cols) + Blueprint Técnico (4 Cols) */}
        <div className="grid grid-cols-1 gap-7 lg:grid-cols-12 lg:items-stretch">
          {/* COLUNA ESQUERDA: Simulador de Navegador Interativo (8 Cols) */}
          <div className="lg:col-span-8 flex flex-col justify-between rounded-3xl border border-white/15 bg-gradient-to-br from-[#121521] via-[#090b10] to-[#050609] p-3 sm:p-5 shadow-inner">
            {/* Barra de Endereço do Browser Simulado */}
            <div className="mb-3 flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-[#0b0d14] px-4 py-2.5">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-[#ff6b61]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#ffc14f]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#49c781]" />
              </div>

              <div className="flex min-w-0 flex-1 max-w-md items-center justify-center gap-2 rounded-lg border border-white/[0.07] bg-black/40 px-3 py-1">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="truncate font-mono text-[11px] text-white/70">
                  https://focuspulse.site{activeTemplate.href}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setInteractiveIframe(!interactiveIframe)}
                  className={`rounded-lg border px-2.5 py-1 font-mono text-[10px] font-bold uppercase transition-colors ${interactiveIframe
                      ? "border-emerald-400/40 bg-emerald-500/15 text-emerald-300"
                      : "border-white/10 bg-white/5 text-white/50"
                    }`}
                  title="Ativar ou pausar rolagem interna do site"
                >
                  {interactiveIframe ? "● Navegação Ativa" : "Scroll Bloqueado"}
                </button>

                <Link
                  href={activeTemplate.href}
                  target="_blank"
                  className="inline-flex items-center gap-1 rounded-lg bg-white px-2.5 py-1 font-mono text-[10px] font-black uppercase text-slate-950 hover:bg-violet-300 transition-colors"
                >
                  <span>Nova Guia</span>
                  <ArrowUpRight className="h-3 w-3" />
                </Link>
              </div>
            </div>

            {/* Palco Responsivo do Iframe */}
            <div className="relative flex h-[500px] sm:h-[600px] w-full items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-[#06070b]">
              <motion.div
                key={`${activeTemplate.href}-${viewportMode}`}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className={`relative h-full overflow-hidden rounded-xl border border-white/15 bg-white shadow-2xl transition-all duration-500 ${viewportMode === "mobile"
                    ? "w-[375px] max-w-full my-auto h-[94%] rounded-[2rem] border-4 border-zinc-800"
                    : viewportMode === "tablet"
                      ? "w-[768px] max-w-full my-auto h-[96%] rounded-2xl border-2 border-zinc-700"
                      : "w-full h-full"
                  }`}
              >
                <iframe
                  src={activeTemplate.href}
                  title={`Console interativo ${activeTemplate.title}`}
                  className={`h-full w-full border-0 ${interactiveIframe ? "" : "pointer-events-none"
                    }`}
                />
              </motion.div>
            </div>
          </div>

          {/* COLUNA DIREITA: Ficha de Engenharia & Conversão do Template (4 Cols) */}
          <div className="lg:col-span-4 flex flex-col justify-between rounded-3xl border border-white/10 bg-[#0e111a]/90 p-6 sm:p-7">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTemplate.href}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span
                      className={`rounded-full border px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-wider ${activeTemplate.badgeColor}`}
                    >
                      {activeTemplate.code}
                    </span>
                    <span className="font-mono text-xs text-white/40">
                      /{activeTemplate.number}
                    </span>
                  </div>

                  <p className="font-mono text-xs uppercase tracking-widest text-white/50">
                    Projeto Demonstrativo: {activeTemplate.brandName}
                  </p>
                  <h2 className="mt-1 font-display text-2xl sm:text-3xl font-black uppercase tracking-tight text-white">
                    {activeTemplate.title}
                  </h2>
                  <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
                    {activeTemplate.description}
                  </p>
                </div>

                {/* Sistema de Cores do Projeto */}
                <div className="rounded-2xl border border-white/[0.08] bg-black/35 p-4">
                  <span className="block font-mono text-[10px] font-bold uppercase tracking-widest text-white/45 mb-3">
                    Identidade Cromática do Template:
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    {activeTemplate.palette.map((color) => (
                      <div
                        key={color.hex}
                        className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] p-2"
                      >
                        <span
                          className="h-5 w-5 shrink-0 rounded-lg border border-white/20 shadow"
                          style={{ backgroundColor: color.hex }}
                        />
                        <div className="min-w-0">
                          <span className="block truncate text-[10px] font-bold text-white">
                            {color.name}
                          </span>
                          <span className="block font-mono text-[9px] text-white/45">
                            {color.hex}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Módulos Funcionais Inclusos */}
                <div>
                  <span className="block font-mono text-[10px] font-bold uppercase tracking-widest text-white/45 mb-3">
                    Engenharia & Módulos Inclusos:
                  </span>
                  <ul className="space-y-2.5">
                    {activeTemplate.modules.map((mod, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2.5 text-xs sm:text-sm text-white/85"
                      >
                        <CheckCircle2
                          className={`h-4 w-4 shrink-0 mt-0.5 ${activeTemplate.accentText}`}
                        />
                        <span>{mod}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Stack Técnica */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {activeTemplate.stack.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-lg border border-white/10 bg-black/40 px-2.5 py-1 font-mono text-[10px] text-white/70"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Botões de Ação do Console */}
            <div className="mt-8 space-y-2.5 border-t border-white/10 pt-5">
              <a
                href={`https://wa.me/5551993583936?text=${encodeURIComponent(
                  `Olá! Testei o modelo "${activeTemplate.title}" (${activeTemplate.brandName}) no console da FocusPulse e quero orçar um projeto baseado nessa estrutura.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className={`w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r ${activeTemplate.btnGradient} py-4 px-5 text-xs font-black uppercase tracking-wider shadow-lg transition-transform hover:scale-[1.02]`}
              >
                <span>Quero este modelo para minha marca</span>
                <ArrowUpRight className="h-4 w-4" />
              </a>

              <Link
                href={activeTemplate.href}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[0.04] hover:bg-white/10 py-3 px-4 text-xs font-bold uppercase tracking-wider text-white transition-colors"
              >
                <span>Abrir Página Completa Dedicada</span>
                <MoveUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================
          3. CATÁLOGO RÁPIDO LADO A LADO (VISÃO COMPARATIVA)
      ========================================================= */}
      <div className="relative z-10">
        <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="mb-2 font-mono text-xs font-bold uppercase tracking-[0.2em] text-violet-300">
              // VISÃO COMPARATIVA DO CATÁLOGO
            </p>
            <h2 className="font-display text-2xl font-black uppercase tracking-tight text-white sm:text-4xl">
              Todas as Arquiteturas Disponíveis ({templates.length})
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Clique em &ldquo;Carregar no Simulador&rdquo; ou abra diretamente a
            demonstração em tela inteira.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {templates.map((template, idx) => {
            const isCurrentlyLoaded = idx === selectedIndex;
            return (
              <article
                key={template.href}
                className={`group flex flex-col overflow-hidden rounded-[2rem] border bg-[#0c0e14]/90 shadow-2xl backdrop-blur-2xl transition-all duration-300 hover:-translate-y-1.5 ${isCurrentlyLoaded
                    ? "border-violet-400/50 ring-1 ring-violet-400/30"
                    : "border-white/10 hover:border-violet-300/30"
                  }`}
              >
                {/* Topo com Preview Desktop em Escala */}
                <div
                  className={`relative h-[260px] overflow-hidden bg-gradient-to-br ${template.theme} p-4 sm:h-[290px] sm:p-5`}
                >
                  <div className="relative h-full w-full overflow-hidden rounded-2xl border border-white/15 bg-[#0b0d10] shadow-2xl">
                    <div className="flex h-8 items-center gap-1.5 border-b border-white/[0.08] bg-[#100d15] px-3">
                      <span className="h-2 w-2 rounded-full bg-[#ff6b61]/80" />
                      <span className="h-2 w-2 rounded-full bg-[#ffc14f]/80" />
                      <span className="h-2 w-2 rounded-full bg-[#49c781]/80" />
                      <span className="ml-auto truncate font-mono text-[9px] text-white/45">
                        focuspulse.site{template.href}
                      </span>
                    </div>

                    <div className="relative h-[calc(100%-2rem)] w-full overflow-hidden">
                      <iframe
                        src={template.href}
                        title={`Prévia ${template.title}`}
                        loading="lazy"
                        scrolling="no"
                        tabIndex={-1}
                        className="pointer-events-none h-[200%] w-[200%] origin-top-left scale-50 border-0 bg-[#0b0d10]"
                      />
                    </div>
                  </div>
                </div>

                {/* Corpo do Card */}
                <div className="flex flex-1 flex-col justify-between p-6 sm:p-7">
                  <div>
                    <div className="mb-4 flex items-center justify-between gap-4">
                      <span
                        className={`rounded-full border px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] ${template.badgeColor}`}
                      >
                        {template.category}
                      </span>
                      <span className="font-mono text-xs text-white/40">
                        /{template.number} • {template.brandName}
                      </span>
                    </div>

                    <h3 className="font-display text-2xl font-bold text-white">
                      {template.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {template.description}
                    </p>
                  </div>

                  <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-2.5 border-t border-white/[0.08] pt-5">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedIndex(idx);
                        document
                          .getElementById("template-live-console")
                          ?.scrollIntoView({ behavior: "smooth" });
                      }}
                      className={`rounded-xl py-3 px-4 font-mono text-xs font-bold uppercase tracking-wider transition-all ${isCurrentlyLoaded
                          ? "bg-violet-500/20 border border-violet-400/40 text-violet-200"
                          : "border border-white/10 bg-white/[0.04] text-white hover:bg-white/10"
                        }`}
                    >
                      {isCurrentlyLoaded
                        ? "● Ativo no Simulador"
                        : "Testar no Simulador ↑"}
                    </button>

                    <Link
                      href={template.href}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-white hover:bg-violet-400 text-slate-950 py-3 px-4 text-xs font-black uppercase tracking-wider transition-colors"
                    >
                      <span>Abrir Site Inteiro</span>
                      <ArrowUpRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {/* =========================================================
          4. CTA FINAL P/ PROJETO EXCLUSIVO
      ========================================================= */}
      <div className="mt-16 rounded-3xl border border-white/10 bg-[#0c0e14]/90 p-8 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <span className="font-mono text-xs uppercase tracking-widest text-violet-300 block mb-1">
            // ARQUITETURA 100% PERSONALIZADA
          </span>
          <h3 className="font-display text-2xl font-bold text-white">
            Seu segmento é diferente? Criamos um projeto inédito para a sua empresa.
          </h3>
        </div>
        <Link
          href="/#contato"
          className="shrink-0 inline-flex items-center gap-2 rounded-2xl bg-violet-600 hover:bg-violet-500 px-6 py-4 text-xs font-black uppercase tracking-wider text-white transition-all shadow-lg"
        >
          <Flame className="h-4 w-4" />
          <span>Solicitar Projeto Sob Medida</span>
        </Link>
      </div>

      {/* =========================================================
          MODAL DE TELA CHEIA DO TEMPLATE
      ========================================================= */}
      <AnimatePresence>
        {fullscreenTemplate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col bg-black/95 backdrop-blur-2xl"
          >
            <div className="flex items-center justify-between border-b border-white/10 bg-[#080a0f] px-5 py-3">
              <div className="flex items-center gap-3">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-ping" />
                <span className="font-mono text-xs font-bold uppercase tracking-widest text-white">
                  {fullscreenTemplate.brandName} — {fullscreenTemplate.title}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <Link
                  href={fullscreenTemplate.href}
                  className="rounded-xl bg-violet-600 hover:bg-violet-500 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white"
                >
                  Ir para a Rota Direta
                </Link>
                <button
                  type="button"
                  onClick={() => setFullscreenTemplate(null)}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/5 px-3.5 py-2 text-xs font-bold uppercase text-white hover:bg-red-500/20 hover:border-red-400/50"
                >
                  <span>Fechar</span>
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="flex-1 w-full bg-white">
              <iframe
                src={fullscreenTemplate.href}
                title={fullscreenTemplate.title}
                className="h-full w-full border-0"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}