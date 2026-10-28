"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  motion,
  AnimatePresence,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import {
  Dumbbell,
  Zap,
  Clock,
  ShieldCheck,
  ChevronDown,
  CheckCircle2,
  MessageCircle,
  ArrowRight,
  ArrowUpRight,
  Flame,
  Phone,
  MapPin,
  Menu,
  X,
  Activity,
  Sparkles,
  Gauge,
  Compass,
  Sliders,
} from "lucide-react";

import { trackMetaEvent } from "@/components/MetaPixel";
import {
  Confetti,
  CountUp,
  ScrollProgress,
} from "@/components/ui/MotionKit";
import { StickyMobileCta } from "@/components/ui/StickyMobileCta";
import { useActiveSection } from "@/components/ui/useActiveSection";

// ==========================================
// UTILS & CONFIGURATIONS
// ==========================================
const WHATSAPP_NUMBER = "5511999999999";
const WHATSAPP_MESSAGE = encodeURIComponent(
  "Olá! Quero agendar minha experiência VIP e conhecer a estrutura da PulseFit."
);

// ==========================================
// HELPER & MICRO-UI COMPONENTS
// ==========================================
const SectionTag = ({ children, index }: { children: React.ReactNode; index?: string }) => (
  <div className="inline-flex items-center gap-3 mb-4">
    {index && (
      <span className="font-mono text-xs text-lime-400 font-bold tracking-widest px-2 py-0.5 rounded bg-lime-400/10 border border-lime-400/20">
        {index}
      </span>
    )}
    <div className="h-[1px] w-6 bg-lime-400/50" />
    <span className="text-xs font-mono uppercase tracking-[0.25em] text-zinc-400 font-semibold">
      {children}
    </span>
  </div>
);

// ==========================================
// 1. FLOATING DOCK NAVBAR
// ==========================================
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const activeSection = useActiveSection(["vantagens", "galeria", "planos", "faq", "contato"]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 pt-4 sm:pt-6 pointer-events-none">
      <div
        className={`max-w-6xl mx-auto transition-all duration-500 pointer-events-auto rounded-2xl border ${scrolled
          ? "bg-[#060807]/85 backdrop-blur-xl border-zinc-800/90 shadow-[0_20px_50px_rgba(0,0,0,0.6)] py-3 px-5"
          : "bg-zinc-950/40 backdrop-blur-md border-zinc-800/40 py-4 px-6"
          }`}
      >
        <div className="flex items-center justify-between">
          {/* Brand */}
          <a href="#" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-lime-400 to-emerald-500 p-[1px] overflow-hidden">
              <div className="w-full h-full bg-[#060807] rounded-[11px] flex items-center justify-center group-hover:bg-transparent transition-colors duration-300">
                <Dumbbell className="w-5 h-5 text-lime-400 group-hover:text-zinc-950 transition-colors" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-black tracking-tighter text-white leading-none">
                PULSE<span className="text-lime-400">FIT</span>
              </span>
              <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-zinc-500">
                Performance Lab
              </span>
            </div>
          </a>

          {/* Desktop Links */}
          <nav className="hidden md:flex items-center gap-1 bg-zinc-900/60 border border-zinc-800/80 rounded-xl p-1">
            {[
              { label: "Engenharia", href: "#vantagens" },
              { label: "O Espaço", href: "#galeria" },
              { label: "Passaportes", href: "#planos" },
              { label: "Dúvidas", href: "#faq" },
            ].map((item) => {
              const isActive = activeSection === item.href.slice(1);
              return (
                <a
                  key={item.label}
                  href={item.href}
                  aria-current={isActive ? "true" : undefined}
                  className={`relative px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${isActive
                    ? "text-lime-300 bg-lime-400/10"
                    : "text-zinc-400 hover:text-white hover:bg-zinc-800/60"
                    }`}
                >
                  {item.label}
                  {isActive && (
                    <motion.span
                      layoutId="nav-active-dot"
                      className="absolute left-1/2 -bottom-0.5 h-0.5 w-5 -translate-x-1/2 rounded-full bg-lime-400"
                    />
                  )}
                </a>
              );
            })}
          </nav>

          {/* CTA & Live Status */}
          <div className="hidden md:flex items-center gap-4">
            <div className="hidden lg:flex items-center gap-2 text-xs font-mono text-zinc-400 bg-zinc-900/80 border border-zinc-800 px-3 py-1.5 rounded-lg">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-lime-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-lime-400"></span>
              </span>
              <span>LOTAÇÃO: 38% (IDEAL)</span>
            </div>

            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-lime-400 hover:bg-lime-300 text-zinc-950 font-black text-xs uppercase tracking-wider transition-all overflow-hidden shadow-[0_0_25px_rgba(163,230,53,0.3)]"
              onClick={() =>
                trackMetaEvent("Lead", {
                  content_name: "Day Pass Experimental Grátis",
                  content_category: "PulseFit Hero/Navbar",
                  value: 0,
                  currency: "BRL",
                })
              }
            >
              <span className="relative z-10 flex items-center gap-1.5">
                Day Pass Free
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </span>
            </a>
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white"
            aria-label={isOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={isOpen}
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden overflow-hidden"
            >
              <div className="pt-4 pb-2 mt-4 border-t border-zinc-800/80 flex flex-col gap-2">
                {[
                  { label: "Engenharia & Diferenciais", href: "#vantagens" },
                  { label: "Tour pelo Espaço", href: "#galeria" },
                  { label: "Planos & Passaportes", href: "#planos" },
                  { label: "Perguntas Frequentes", href: "#faq" },
                  { label: "Agendar Visita", href: "#contato" },
                ].map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className="px-3 py-2.5 rounded-lg text-sm font-medium text-zinc-300 hover:text-white hover:bg-zinc-900 transition-colors"
                  >
                    {item.label}
                  </a>
                ))}
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 w-full py-3 rounded-xl bg-lime-400 text-zinc-950 font-black text-xs uppercase tracking-widest text-center flex items-center justify-center gap-2"
                  onClick={() =>
                    trackMetaEvent("Lead", {
                      content_name: "Day Pass Experimental Grátis",
                      content_category: "PulseFit Hero/Navbar",
                      value: 0,
                      currency: "BRL",
                    })
                  }
                >
                  <MessageCircle className="w-4 h-4" />
                  Resgatar Day Pass Grátis
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

// ==========================================
// 2. HERO SECTION (EDITORIAL + HUD TELEMETRY)
// ==========================================
const Hero = () => {
  const imageWrapRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: imageWrapRef,
    offset: ["start end", "end start"],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], ["-5%", "5%"]);

  return (
    <section className="relative min-h-screen pt-32 pb-20 md:pt-40 md:pb-28 flex items-center overflow-hidden">
      {/* Architectural Technical Grid Background */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
          backgroundSize: "64px 64px",
        }}
      />

      {/* Ambient Glows */}
      <div className="absolute top-20 left-1/4 w-[600px] h-[600px] bg-lime-400/12 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-[130px] pointer-events-none" />

      {/* Giant Watermark Background Typography */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full overflow-hidden pointer-events-none select-none z-0 flex justify-center">
        <span
          className="text-[18vw] font-black uppercase tracking-tighter leading-none opacity-[0.03] whitespace-nowrap"
          style={{ WebkitTextStroke: "2px #ffffff", color: "transparent" }}
        >
          UNSTOPPABLE
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid min-w-0 grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-8">
          {/* Left Column: Editorial Impact (7 cols) */}
          <div className="min-w-0 text-left lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-zinc-900/90 border border-zinc-800 mb-6"
            >
              <span className="px-2 py-0.5 rounded-full bg-lime-400/20 text-lime-400 font-mono text-[10px] font-bold uppercase">
                V.2026
              </span>
              <span className="text-xs text-zinc-300 font-medium">
                Biomecânica de Elite & Alta Performance
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mb-6 text-4xl font-black uppercase leading-[0.95] tracking-tighter text-white sm:text-6xl xl:text-7xl"
            >
              Não treine. <br />
              <span
                className="block my-1"
                style={{
                  WebkitTextStroke: "1.5px rgba(255,255,255,0.6)",
                  color: "transparent",
                }}
              >
                Reprograme
              </span>
              sua <span className="text-lime-400 italic">biologia.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-base sm:text-lg text-zinc-400 mb-10 leading-relaxed max-w-xl border-l-2 border-lime-400/50 pl-5"
            >
              Esqueça as academias convencionais. Combinamos maquinário importado de precisão,
              design sensorial de iluminação e periodização guiada por dados para forjar resultados
              reais.
            </motion.p>

            {/* Interactive CTA Group */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4"
            >
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative inline-flex items-center justify-center gap-4 overflow-hidden px-8 py-4 rounded-2xl bg-gradient-to-r from-lime-400 to-emerald-400 text-zinc-950 font-black uppercase tracking-wider text-sm transition-all shadow-[0_0_40px_rgba(163,230,53,0.35)] hover:shadow-[0_0_60px_rgba(163,230,53,0.55)] hover:scale-[1.02] active:scale-[0.98]"
                onClick={() =>
                  trackMetaEvent("Lead", {
                    content_name: "Day Pass Experimental Grátis",
                    content_category: "PulseFit Hero/Navbar",
                    value: 0,
                    currency: "BRL",
                  })
                }
              >
                <span
                  aria-hidden
                  className="absolute inset-y-0 -left-1/3 w-1/4 -skew-x-12 bg-white/40 transition-transform duration-700 group-hover:translate-x-[700%]"
                />
                <span className="relative">Agendar Sessão Experimental</span>
                <div className="relative w-8 h-8 rounded-xl bg-black/15 flex items-center justify-center group-hover:translate-x-1 transition-transform">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </a>

              <a
                href="#galeria"
                className="inline-flex items-center justify-center gap-3 px-7 py-4 rounded-2xl bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 font-semibold text-sm transition-all"
              >
                <Compass className="w-4 h-4 text-lime-400" />
                Explorar Instalações
              </a>
            </motion.div>

            {/* Telemetry Metrics Bar */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="mt-14 pt-8 border-t border-zinc-800/80 grid grid-cols-3 gap-6 max-w-lg"
            >
              {[
                { count: 1200, suffix: "m²", label: "Área Climatizada", code: "ZONE_01" },
                { val: "Zero", label: "Filas em Horário Pico", code: "FLOW_99%" },
                { val: "Hammer", label: "& Life Fitness Pro", code: "GEAR_MAX" },
              ].map((stat, i) => (
                <div key={i} className="flex flex-col">
                  <span className="text-[10px] font-mono text-lime-400/80 mb-1">
                    {`//${stat.code}`}
                  </span>
                  <span className="text-2xl sm:text-3xl font-black text-white tracking-tight tabular-nums">
                    {stat.count ? <CountUp to={stat.count} suffix={stat.suffix} /> : stat.val}
                  </span>
                  <span className="text-xs text-zinc-400 font-medium mt-0.5">{stat.label}</span>
                </div>
              ))}
            </motion.div>
            <p className="mt-4 text-[10px] font-mono uppercase tracking-wider text-zinc-500">
              * Dados ilustrativos de demonstração
            </p>
          </div>

          {/* Right Column: Architectural Image + Floating HUDs (5 cols) */}
          <div className="lg:col-span-5 relative">
            <motion.div
              ref={imageWrapRef}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative w-full aspect-[4/5] rounded-[2.5rem] overflow-hidden border border-zinc-800 bg-zinc-900 shadow-2xl group"
            >
              {/* Duotone & Vignette Overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#060807] via-transparent to-zinc-950/40 z-10" />
              <div className="absolute inset-0 bg-lime-500/10 mix-blend-overlay z-10" />

              <motion.div
                style={reduceMotion ? undefined : { y: imageY }}
                className="absolute inset-x-0 -top-[8%] h-[116%]"
              >
                <Image
                  src="/images/templates/academia/hero-gym.png"
                  alt="Ambiente de alta performance PulseFit"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 45vw"
                  className="object-cover transition-transform duration-1000 group-hover:scale-105"
                />
              </motion.div>

              {/* Top Right HUD Badge */}
              <div className="absolute top-5 right-5 z-20 px-3.5 py-2 rounded-xl bg-zinc-950/80 backdrop-blur-md border border-zinc-800 flex items-center gap-2">
                <Activity className="w-4 h-4 text-lime-400 animate-pulse" />
                <span className="font-mono text-[11px] text-zinc-200 font-semibold">
                  BIO-TRACKING ATIVO
                </span>
              </div>

              {/* Bottom Floating Telemetry Card */}
              <div className="absolute bottom-5 left-5 right-5 z-20 p-5 rounded-2xl bg-zinc-950/85 backdrop-blur-xl border border-zinc-800/90 shadow-2xl">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-lime-400/20 border border-lime-400/30 flex items-center justify-center text-lime-400">
                      <Flame className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-mono uppercase text-zinc-400">Sessão em Destaque</p>
                      <p className="text-sm font-bold text-white">HIIT Metabolic Burn • 45 min</p>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-lime-400 bg-lime-400/10 px-2.5 py-1 rounded-md border border-lime-400/20">
                    ~850 KCAL
                  </span>
                </div>
                {/* Progress bar simulation */}
                <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: "0%" }}
                    animate={{ width: "82%" }}
                    transition={{ duration: 1.5, delay: 0.8 }}
                    className="bg-gradient-to-r from-lime-400 to-emerald-400 h-full"
                  />
                </div>
                <div className="flex justify-between mt-1.5 text-[10px] font-mono text-zinc-500">
                  <span>INTENSIDADE: ALTA</span>
                  <span>PRÓXIMA TURMA: 19:00</span>
                </div>
              </div>
            </motion.div>

            {/* Decorative Corner Element */}
            <div className="hidden sm:flex absolute -left-8 top-1/3 z-20 p-4 rounded-2xl bg-zinc-900/95 backdrop-blur-md border border-zinc-800 shadow-xl items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-lime-400/10 border border-lime-400/20 flex items-center justify-center text-lime-400 font-black text-sm">
                4.9★
              </div>
              <div className="pr-2">
                <p className="text-xs font-bold text-white">+2.500 Membros</p>
                <p className="text-[11px] text-zinc-400">Avaliação no Google</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// ==========================================
// 3. DUAL KINETIC MARQUEE
// ==========================================
const Marquee = () => {
  const words = [
    "BIOMECÂNICA DE PRECISÃO",
    "•",
    "HIPERTROFIA",
    "•",
    "METABOLIC CONDITIONING",
    "•",
    "FORÇA BRUTA",
    "•",
    "RECOVERY ZONE",
    "•",
  ];

  return (
    <div className="marquee relative py-6 bg-[#060807] overflow-hidden select-none border-y border-zinc-900">
      <div className="bg-gradient-to-r from-lime-400 via-emerald-400 to-lime-400 py-3.5 -rotate-1 scale-105 shadow-[0_0_50px_rgba(163,230,53,0.25)]">
        <div
          aria-hidden
          className="marquee-track flex w-max whitespace-nowrap gap-8 font-black italic tracking-tighter text-zinc-950 uppercase text-lg sm:text-xl"
        >
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex gap-8 shrink-0 items-center">
              {words.map((word, idx) => (
                <span key={idx} className={word === "•" ? "text-zinc-900 not-italic" : ""}>
                  {word}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 4. BENTO GRID FEATURES (ASYMMETRIC)
// ==========================================
const Features = () => {
  return (
    <section id="vantagens" className="py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <SectionTag index="01">Engenharia da Performance</SectionTag>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tighter text-white uppercase leading-none">
              Projetada para quem <br />
              <span className="text-lime-400 italic">rejeita o mediano.</span>
            </h2>
          </div>
          <p className="text-zinc-400 text-sm sm:text-base max-w-md leading-relaxed">
            Cada metro quadrado foi desenhado usando princípios de fisiologia esportiva, acústica
            motivacional e fluxo inteligente para eliminar distrações.
          </p>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Card 1: Large Span (7 cols) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="md:col-span-7 relative p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-zinc-900/90 via-zinc-900/50 to-zinc-950 border border-zinc-800/80 hover:border-lime-400/40 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(163,230,53,0.08)] transition-all group overflow-hidden flex flex-col justify-between min-h-[320px]"
          >
            <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-lime-400/10 rounded-full blur-3xl group-hover:bg-lime-400/20 transition-all" />

            <div className="flex items-start justify-between relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-lime-400/10 border border-lime-400/20 text-lime-400 flex items-center justify-center">
                <Dumbbell className="w-7 h-7" />
              </div>
              <span className="font-mono text-xs text-zinc-500 border border-zinc-800 px-3 py-1 rounded-full">
                BIOMECÂNICA PURA
              </span>
            </div>

            <div className="relative z-10 mt-8">
              <h3 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight mb-3">
                Maquinário Importado de Competição
              </h3>
              <p className="text-zinc-400 text-sm sm:text-base leading-relaxed max-w-xl">
                Equipamentos convergentes e articulados que respeitam a curva de força natural das
                suas articulações. Tensão constante no músculo alvo, risco zero de lesão articular.
              </p>
            </div>
          </motion.div>

          {/* Card 2: Medium Span (5 cols) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="md:col-span-5 relative p-8 sm:p-10 rounded-3xl bg-zinc-900/40 border border-zinc-800/80 hover:border-lime-400/40 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(163,230,53,0.08)] transition-all group flex flex-col justify-between min-h-[320px]"
          >
            <div className="flex items-start justify-between">
              <div className="w-14 h-14 rounded-2xl bg-zinc-800 border border-zinc-700 text-lime-400 flex items-center justify-center group-hover:bg-lime-400 group-hover:text-zinc-950 transition-colors">
                <Sliders className="w-7 h-7" />
              </div>
              <span className="font-mono text-xs text-lime-400 bg-lime-400/10 px-3 py-1 rounded-full">
                APP EXCLUSIVO
              </span>
            </div>

            <div className="mt-8">
              <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-3">
                Periodização Guiada por Dados
              </h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Abandone a ficha de papel. Receba progressão de carga automatizada, vídeos em 4K da
                execução biomecânica e reavaliação quinzenal diretamente no seu smartphone.
              </p>
            </div>
          </motion.div>

          {/* Card 3: 4 cols */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="md:col-span-4 group p-8 rounded-3xl bg-zinc-900/40 border border-zinc-800/80 hover:border-lime-400/40 hover:-translate-y-1 transition-all flex flex-col justify-between"
          >
            <div className="w-12 h-12 rounded-xl bg-zinc-800/80 text-lime-400 flex items-center justify-center mb-6 group-hover:bg-lime-400 group-hover:text-zinc-950 group-hover:rotate-6 transition-all">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-2">Studios Imersivos</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Salas de Spinning, Cross e HIIT com iluminação cênica sincronizada e sistema de som
                de festival para elevar sua adrenalina.
              </p>
            </div>
          </motion.div>

          {/* Card 4: 4 cols */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="md:col-span-4 group p-8 rounded-3xl bg-zinc-900/40 border border-zinc-800/80 hover:border-lime-400/40 hover:-translate-y-1 transition-all flex flex-col justify-between"
          >
            <div className="w-12 h-12 rounded-xl bg-zinc-800/80 text-lime-400 flex items-center justify-center mb-6 group-hover:bg-lime-400 group-hover:text-zinc-950 group-hover:rotate-6 transition-all">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-2">Climatização Hospitalar</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Renovação constante de ar com filtragem tripla e temperatura cravada em 21°C o ano
                inteiro, além de vestiários estilo spa.
              </p>
            </div>
          </motion.div>

          {/* Card 5: 4 cols */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="md:col-span-4 p-8 rounded-3xl bg-gradient-to-br from-lime-400 to-emerald-500 text-zinc-950 flex flex-col justify-between shadow-[0_0_40px_rgba(163,230,53,0.25)]"
          >
            <div className="flex justify-between items-start">
              <Clock className="w-8 h-8 text-zinc-950" />
              <span className="text-[10px] font-mono uppercase tracking-widest bg-black/15 text-zinc-950 px-2.5 py-1 rounded-full font-bold">
                365 DIAS
              </span>
            </div>
            <div className="mt-6">
              <h3 className="text-2xl font-black uppercase tracking-tight mb-2">
                Horário Estendido
              </h3>
              <p className="text-zinc-900 text-sm font-medium leading-relaxed mb-4">
                Das 05h às 23h nos dias úteis. Domingos e feriados abertos para você nunca quebrar a
                sua consistência.
              </p>
              <a
                href="#planos"
                className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider bg-zinc-950 text-lime-400 px-4 py-2.5 rounded-xl hover:bg-zinc-900 transition-colors"
              >
                Conferir Acesso <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// ==========================================
// 5. EXPANDING ACCORDION GALLERY
// ==========================================
const Gallery = () => {
  const [activeIdx, setActiveIdx] = useState(0);

  const zones = [
    {
      id: "01",
      title: "Iron Sanctuary",
      subtitle: "Musculação & Peso Livre",
      specs: "Halteres até 60kg • 8 Gaiolas de Agachamento • Piso de Absorção Olímpica",
      src: "/images/templates/academia/foto-1.png",
    },
    {
      id: "02",
      title: "Endurance Deck",
      subtitle: "Cardio & Simulação",
      specs: "Esteiras LifeFitness com Tela 4K • Escadas Simuladoras • Remo Concept2",
      src: "/images/templates/academia/foto-2.png",
    },
    {
      id: "03",
      title: "Neon Cycle Lab",
      subtitle: "Studio de Spinning Imersivo",
      specs: "Bikes Magnéticas de Precisão • Áudio 3D • Painel de Telemetria Coletiva",
      src: "/images/templates/academia/foto-3.png",
    },
    {
      id: "04",
      title: "The Box Arena",
      subtitle: "Cross Training & Funcional",
      specs: "Rig Oficial 12m • Pista de Sled em Grama Sintética • AirBikes & Wall Balls",
      src: "/images/templates/academia/foto-4.png",
    },
    {
      id: "05",
      title: "Recovery Lounge",
      subtitle: "Vestiários & Pós-Treino",
      specs: "Duchas de Alta Pressão • Armários Biométricos • Shake Bar Integrado",
      src: "/images/templates/academia/foto-6.png",
    },
  ];

  return (
    <section id="galeria" className="py-28 bg-zinc-950 border-y border-zinc-900 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <SectionTag index="02">Tour Interativo</SectionTag>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tighter text-white uppercase">
              5 Zonas de <span className="text-lime-400 italic">Imersão</span>
            </h2>
          </div>
          <p className="text-xs font-mono uppercase tracking-widest text-zinc-500">
            [ PASSE O MOUSE OU TOQUE PARA EXPANDIR OS AMBIENTES ]
          </p>
        </div>

        {/* Interactive Horizontal Accordion */}
        <div
          role="group"
          aria-label="Zonas da academia"
          onKeyDown={(event) => {
            const forward = event.key === "ArrowRight" || event.key === "ArrowDown";
            const backward = event.key === "ArrowLeft" || event.key === "ArrowUp";
            if (!forward && !backward) return;
            event.preventDefault();
            const next = (activeIdx + (forward ? 1 : -1) + zones.length) % zones.length;
            setActiveIdx(next);
            event.currentTarget
              .querySelectorAll<HTMLButtonElement>("button[data-zone]")
              [next]?.focus();
          }}
          className="flex flex-col lg:flex-row gap-4 h-[620px] lg:h-[520px] w-full"
        >
          {zones.map((zone, idx) => {
            const isActive = activeIdx === idx;
            return (
              <article
                key={zone.id}
                className={`relative rounded-3xl overflow-hidden border transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] ${isActive
                  ? "flex-[4] border-lime-400/60 shadow-[0_0_40px_rgba(163,230,53,0.15)]"
                  : "flex-[1] border-zinc-800/80 hover:border-zinc-700 opacity-70 hover:opacity-100"
                  }`}
              >
                <Image
                  src={zone.src}
                  alt=""
                  fill
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className={`object-cover transition-transform duration-1000 ${isActive ? "scale-105" : "scale-100 grayscale-[50%]"
                    }`}
                />

                <button
                  type="button"
                  data-zone
                  aria-expanded={isActive}
                  aria-label={`${zone.title}: ${zone.subtitle}`}
                  onMouseEnter={() => setActiveIdx(idx)}
                  onFocus={() => setActiveIdx(idx)}
                  onClick={() => setActiveIdx(idx)}
                  className="absolute inset-0 z-[5] cursor-pointer rounded-3xl"
                />

                {/* Dark Gradient Overlay */}
                <div
                  className={`absolute inset-0 transition-opacity duration-500 ${isActive
                    ? "bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent"
                    : "bg-zinc-950/75"
                    }`}
                />

                {/* Content Container */}
                <div className="pointer-events-none absolute inset-0 p-6 sm:p-8 flex flex-col justify-between z-10">
                  <div className="flex items-center justify-between">
                    <span
                      className={`font-mono text-sm font-bold px-3 py-1 rounded-lg border transition-colors ${isActive
                        ? "bg-lime-400 text-zinc-950 border-lime-300"
                        : "bg-zinc-900/80 text-zinc-400 border-zinc-800"
                        }`}
                    >
                      /{zone.id}
                    </span>

                    {isActive && (
                      <span className="hidden sm:inline-flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider text-lime-400 bg-zinc-950/80 backdrop-blur-md px-3 py-1 rounded-full border border-lime-400/30">
                        <Sparkles className="w-3 h-3" /> Ambiente Climatizado
                      </span>
                    )}
                  </div>

                  {/* Bottom Title & Specs */}
                  <div className="overflow-hidden">
                    <p className="text-xs font-mono uppercase tracking-widest text-lime-400 mb-1 truncate">
                      {zone.subtitle}
                    </p>
                    <h3
                      className={`font-black uppercase tracking-tight text-white transition-all ${isActive ? "text-2xl sm:text-4xl mb-3" : "text-lg lg:rotate-0 truncate"
                        }`}
                    >
                      {zone.title}
                    </h3>

                    <AnimatePresence>
                      {isActive && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.3, delay: 0.1 }}
                          className="pt-3 border-t border-zinc-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                        >
                          <p className="text-xs sm:text-sm text-zinc-300 font-medium max-w-md">
                            {zone.specs}
                          </p>
                          <a
                            href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                              `Olá! Quero conhecer o espaço ${zone.title} da PulseFit.`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="pointer-events-auto relative z-20 shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-zinc-950 font-bold text-xs uppercase tracking-wider hover:bg-lime-400 transition-colors self-start sm:self-auto"
                            onClick={() =>
                              trackMetaEvent("Lead", {
                                content_name: "Day Pass Experimental Grátis",
                                content_category: "PulseFit Hero/Navbar",
                                value: 0,
                                currency: "BRL",
                              })
                            }
                          >
                            Visitar Zona <ArrowUpRight className="w-3.5 h-3.5" />
                          </a>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

// ==========================================
// 6. INTERACTIVE PRICING & GOAL RECOMMENDER
// ==========================================
const Pricing = () => {
  const [billing, setBilling] = useState<"anual" | "mensal">("anual");
  const [selectedGoal, setSelectedGoal] = useState<string>("all");

  const goals = [
    { id: "all", label: "Ver Todos", recommendedPlan: "Cross Pro" },
    { id: "musculacao", label: "Foco em Hipertrofia", recommendedPlan: "Fit Básico" },
    { id: "condicionamento", label: "Emagrecimento & Cross", recommendedPlan: "Cross Pro" },
    { id: "exclusivo", label: "Acompanhamento 360°", recommendedPlan: "VIP Total" },
  ];

  const plans = [
    {
      name: "Fit Básico",
      monthlyPrice: 149,
      annualPrice: 119,
      description: "Acesso livre à nossa sala de musculação biomecânica e deck de cardio.",
      features: [
        "Musculação & Peso Livre sem restrição de horário",
        "Deck de Cardio com telas integradas",
        "Avaliação de Bioimpedância Inicial",
        "Acesso ao App PulseFit (Fichas em Vídeo)",
      ],
      cta: "Iniciar no Fit Básico",
    },
    {
      name: "Cross Pro",
      monthlyPrice: 229,
      annualPrice: 189,
      description: "A combinação definitiva de musculação livre com nossas arenas de alta intensidade.",
      features: [
        "Tudo do Passaporte Fit Básico",
        "Acesso Ilimitado ao Box de Cross & HIIT",
        "Studio Neon Cycle (Spinning Imersivo)",
        "Reavaliação física a cada 45 dias",
        "4 Acessos VIP/mês para levar convidados",
      ],
      badge: "Mais Escolhido",
      cta: "Garantir Passaporte Pro",
    },
    {
      name: "VIP Total",
      monthlyPrice: 349,
      annualPrice: 279,
      description: "Performance executiva com nutricionista e acompanhamento de perto.",
      features: [
        "Acesso Total e Irrestrito a todas as Zonas",
        "Consultoria Nutricional Esportiva Mensal",
        "Small Group Personal (2x na semana)",
        "Convidados ilimitados aos finais de semana",
        "Kit Welcome PulseFit (Coqueteleira + Camiseta Tech)",
      ],
      cta: "Aplicar para Membro VIP",
    },
  ];

  const activeRecommendation =
    goals.find((g) => g.id === selectedGoal)?.recommendedPlan || "Cross Pro";

  return (
    <section id="planos" className="py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header + Billing Switch */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-12 gap-8">
          <div>
            <SectionTag index="03">Passaportes de Acesso</SectionTag>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tighter text-white uppercase">
              Invista na sua <span className="text-lime-400 italic">alta performance</span>
            </h2>
          </div>

          {/* Billing Cycle Toggle */}
          <div className="inline-flex items-center p-1.5 rounded-2xl bg-zinc-900 border border-zinc-800 self-start lg:self-auto">
            <button
              onClick={() => setBilling("mensal")}
              aria-pressed={billing === "mensal"}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${billing === "mensal"
                ? "bg-zinc-800 text-white shadow"
                : "text-zinc-400 hover:text-white"
                }`}
            >
              Plano Flex (Mensal)
            </button>
            <button
              onClick={() => setBilling("anual")}
              aria-pressed={billing === "anual"}
              className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 ${billing === "anual"
                ? "bg-lime-400 text-zinc-950 shadow-[0_0_25px_rgba(163,230,53,0.3)]"
                : "text-zinc-400 hover:text-white"
                }`}
            >
              <span>Passaporte Anual</span>
              <span className="px-2 py-0.5 rounded-md bg-black/20 text-[10px] font-mono">
                -20% OFF
              </span>
            </button>
          </div>
        </div>

        {/* Interactive Goal Filter */}
        <div className="mb-12 p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-mono uppercase text-zinc-400">
            <Gauge className="w-4 h-4 text-lime-400" />
            <span>Qual é a sua meta principal hoje?</span>
          </div>
          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            {goals.map((g) => (
              <button
                key={g.id}
                onClick={() => setSelectedGoal(g.id)}
                aria-pressed={selectedGoal === g.id}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${selectedGoal === g.id
                  ? "bg-lime-400/20 text-lime-400 border border-lime-400/40"
                  : "bg-zinc-900 text-zinc-400 border border-zinc-800 hover:border-zinc-700"
                  }`}
              >
                {g.label}
              </button>
            ))}
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan, idx) => {
            const isRecommended = plan.name === activeRecommendation;
            const currentPrice = billing === "anual" ? plan.annualPrice : plan.monthlyPrice;

            return (
              <motion.div
                key={idx}
                layout
                className={`relative flex flex-col justify-between p-8 sm:p-10 rounded-[2.5rem] transition-all duration-500 ${isRecommended
                  ? "bg-gradient-to-b from-zinc-900 via-zinc-900/90 to-zinc-950 border-2 border-lime-400 shadow-[0_0_50px_rgba(163,230,53,0.18)] lg:-translate-y-3 z-10"
                  : "bg-zinc-900/30 border border-zinc-800/80 hover:border-zinc-700"
                  }`}
              >
                {isRecommended && (
                  <div className="absolute -top-4 left-8 px-4 py-1 rounded-full bg-gradient-to-r from-lime-400 to-emerald-400 text-zinc-950 text-[11px] font-black uppercase tracking-widest shadow-lg flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    {selectedGoal === "all" ? "Mais Popular" : "Recomendado para Você"}
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-2xl font-black uppercase tracking-tight text-white">
                      {plan.name}
                    </h3>
                    <span className="font-mono text-xs text-zinc-500">0{idx + 1}</span>
                  </div>
                  <p className="text-zinc-400 text-sm mb-8 min-h-[40px]">{plan.description}</p>

                  {/* Price Display */}
                  <div className="p-6 rounded-2xl bg-zinc-950/80 border border-zinc-800/80 mb-8">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-500 block mb-1">
                      Investimento {billing === "anual" ? "no plano anual" : "no plano mensal"}
                    </span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-sm font-bold text-lime-400">R$</span>
                      <AnimatePresence mode="wait">
                        <motion.span
                          key={currentPrice}
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          transition={{ duration: 0.2 }}
                          className="text-5xl font-black tracking-tighter text-white"
                        >
                          {currentPrice}
                        </motion.span>
                      </AnimatePresence>
                      <span className="text-zinc-500 text-xs font-mono">/mês</span>
                    </div>
                    <AnimatePresence initial={false}>
                      {billing === "anual" && (
                        <motion.p
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-3 overflow-hidden text-xs font-bold text-lime-400"
                        >
                          Você economiza R$ {(plan.monthlyPrice - plan.annualPrice) * 12} por ano
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Features List */}
                  <div className="space-y-4 mb-10">
                    {plan.features.map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-start gap-3 text-sm text-zinc-300">
                        <CheckCircle2 className="w-4 h-4 text-lime-400 shrink-0 mt-0.5" />
                        <span className="leading-snug">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                    `Olá! Quero garantir o passaporte ${plan.name} na modalidade ${billing.toUpperCase()}.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => {
                    trackMetaEvent("InitiateCheckout", {
                      content_name: `Passaporte ${plan.name} (${billing.toUpperCase()})`,
                      content_category: "Assinatura Academia",
                      value: currentPrice,
                      currency: "BRL",
                    });
                    trackMetaEvent("Lead", {
                      content_name: `Interesse Plano ${plan.name}`,
                      value: currentPrice,
                      currency: "BRL",
                    });
                  }}
                  className={`w-full py-4 px-6 rounded-2xl font-black uppercase tracking-wider text-xs flex items-center justify-center gap-2 transition-all ${isRecommended
                    ? "bg-lime-400 hover:bg-lime-300 text-zinc-950 shadow-[0_0_25px_rgba(163,230,53,0.3)]"
                    : "bg-zinc-800 hover:bg-zinc-700 text-white"
                    }`}
                >
                  <span>{plan.cta}</span>
                  <ArrowUpRight className="w-4 h-4" />
                </a>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

// ==========================================
// 7. FAQ SECTION (SPLIT EDITORIAL LAYOUT)
// ==========================================
const FAQ = () => {
  const faqs = [
    {
      q: "Existe taxa de matrícula, manutenção ou multa de cancelamento?",
      a: "Zero letras miúdas. Na modalidade Flex (Mensal), você não possui fidelidade e pode cancelar quando desejar com aviso prévio de 30 dias. No Passaporte Anual, você garante 20% de desconto fixo durante os 12 meses.",
    },
    {
      q: "Como funciona o Day Pass Experimental Gratuito?",
      a: "Basta clicar em qualquer botão de agendamento nesta página. Nosso concierge agendará um horário onde um treinador fará um tour rápido pelas 5 zonas e liberará seu acesso para um treino completo.",
    },
    {
      q: "Sou iniciante, terei acompanhamento na sala de musculação?",
      a: "Sim! Além do nosso aplicativo com vídeos em alta definição de cada máquina, temos professores de plantão em todas as zonas para corrigir sua postura, ajustar cargas e garantir segurança biomecânica.",
    },
    {
      q: "Aceitam agregadores como Gympass (Wellhub) ou TotalPass?",
      a: "Para mantermos o controle rigoroso de lotação, conforto térmico e disponibilidade imediata dos equipamentos para nossos membros, operamos exclusivamente com passaportes próprios.",
    },
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-24 bg-zinc-950/60 border-t border-zinc-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-12 items-start">
          {/* Left Column */}
          <div className="lg:col-span-5 lg:sticky lg:top-32">
            <SectionTag index="04">Transparência Total</SectionTag>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tighter text-white uppercase leading-none mb-6">
              Dúvidas <br />
              <span className="text-lime-400 italic">Frequentes</span>
            </h2>
            <p className="text-zinc-400 text-sm sm:text-base leading-relaxed mb-8">
              Ainda tem alguma pergunta específica sobre nossa metodologia ou estrutura? Fale
              diretamente com nossa recepção técnica.
            </p>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-6 py-3.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-lime-400/50 text-white text-xs font-bold uppercase tracking-wider transition-all"
              onClick={() =>
                trackMetaEvent("Lead", {
                  content_name: "Day Pass Experimental Grátis",
                  content_category: "PulseFit Hero/Navbar",
                  value: 0,
                  currency: "BRL",
                })
              }
            >
              <MessageCircle className="w-4 h-4 text-lime-400" />
              Chamar Concierge no WhatsApp
            </a>
          </div>

          {/* Right Column: Accordion */}
          <div className="lg:col-span-7 space-y-4">
            {faqs.map((faq, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div
                  key={idx}
                  className={`rounded-2xl border transition-all ${isOpen
                    ? "bg-zinc-900/70 border-lime-400/40"
                    : "bg-zinc-900/30 border-zinc-800/80 hover:border-zinc-700"
                    }`}
                >
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : idx)}
                    aria-expanded={isOpen}
                    className="w-full text-left p-6 flex justify-between items-center gap-4 text-white font-bold text-base sm:text-lg"
                  >
                    <span className="flex items-center gap-4">
                      <span className="font-mono text-xs text-lime-400">0{idx + 1}</span>
                      {faq.q}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180 text-lime-400" : "text-zinc-500"
                        }`}
                    />
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-6 pt-2 text-sm text-zinc-400 leading-relaxed border-t border-zinc-800/50">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

// ==========================================
// 8. VIP PASS GENERATOR / CONTACT SECTION
// ==========================================
const Contact = () => {
  const [name, setName] = useState("");
  const [goal, setGoal] = useState("Hipertrofia & Estética");
  const [touched, setTouched] = useState(false);
  const [issued, setIssued] = useState<{ name: string; goal: string; link: string } | null>(null);
  const nameValid = name.trim().length >= 3;

  const handleVipPassSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (!nameValid) return;

    const guestName = name.trim();

    // Dispara Lead + Schedule qualificado com o objetivo do aluno
    trackMetaEvent("Lead", {
      content_name: "Credencial VIP Pass 1 Dia Free",
      content_category: goal,
      customer_name: guestName,
      value: 49.9, // Valor estimado do Day Pass para otimização de ROAS
      currency: "BRL",
    });

    trackMetaEvent("Schedule", {
      content_name: `Treino Experimental - ${goal}`,
    });

    const customMsg = encodeURIComponent(
      `Olá! Meu nome é ${guestName}. Gerei meu VIP Pass pelo site com foco em [${goal}] e gostaria de agendar meu treino experimental.`
    );
    const link = `https://wa.me/${WHATSAPP_NUMBER}?text=${customMsg}`;
    window.open(link, "_blank", "noopener,noreferrer");
    setIssued({ name: guestName, goal, link });
  };

  return (
    <section id="contato" className="py-28 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="rounded-[3rem] bg-gradient-to-br from-zinc-900 via-zinc-950 to-[#060807] border border-zinc-800 p-8 sm:p-14 lg:p-16 relative overflow-hidden">
          {/* Glow */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-lime-400/12 rounded-full blur-[100px] pointer-events-none" />

          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6">
              <SectionTag index="05">Acesso Imediato</SectionTag>
              <h2 className="text-3xl sm:text-5xl font-black tracking-tighter text-white uppercase leading-none mb-6">
                Emita seu <span className="text-lime-400 italic">VIP Pass</span> Experimental.
              </h2>
              <p className="text-zinc-400 mb-10 leading-relaxed text-sm sm:text-base">
                Configure seu passe ao lado e envie diretamente para nossa recepção no WhatsApp. Sem
                formulários lentos ou espera por e-mail.
              </p>

              <div className="space-y-5 border-t border-zinc-800/80 pt-8">
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-lime-400">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[11px] font-mono uppercase text-zinc-500">Flagship Unit</p>
                    <p className="text-sm font-semibold text-zinc-200">
                      Av. Gaucha, 999 - Bairro Famoso, Porto Alegre - RS
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-lime-400">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[11px] font-mono uppercase text-zinc-500">
                      Concierge Direto
                    </p>
                    <p className="text-sm font-semibold text-zinc-200">(51) 99999-9999</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Ticket / Form */}
            <div id="vip-pass" className="lg:col-span-6">
              {issued ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.94 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", stiffness: 220, damping: 20 }}
                  className="relative overflow-hidden p-8 rounded-3xl bg-zinc-900/70 backdrop-blur-xl border border-lime-400/40 shadow-[0_0_50px_rgba(163,230,53,0.15)] space-y-6"
                >
                  <Confetti />
                  <div className="flex items-center justify-between border-b border-dashed border-lime-400/30 pb-4">
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-widest text-lime-400 block">
                        CREDENCIAL EMITIDA
                      </span>
                      <h3 className="text-lg font-black uppercase text-white">
                        1 DIA DE ACESSO TOTAL FREE
                      </h3>
                    </div>
                    <motion.div
                      initial={{ scale: 0, rotate: -30 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: "spring", stiffness: 260, damping: 14, delay: 0.1 }}
                    >
                      <CheckCircle2 className="w-9 h-9 text-lime-400" />
                    </motion.div>
                  </div>
                  <dl className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <dt className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">
                        Convidado(a)
                      </dt>
                      <dd className="font-bold text-white break-words">{issued.name}</dd>
                    </div>
                    <div>
                      <dt className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">
                        Foco
                      </dt>
                      <dd className="font-bold text-white">{issued.goal}</dd>
                    </div>
                  </dl>
                  <p className="text-sm text-zinc-400" role="status">
                    Abrimos a conversa com a recepção no WhatsApp. Se o navegador bloqueou a
                    janela, use o botão abaixo.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <a
                      href={issued.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-3.5 rounded-xl bg-lime-400 hover:bg-lime-300 text-zinc-950 font-black uppercase tracking-wider text-xs flex items-center justify-center gap-2 transition-colors"
                    >
                      <MessageCircle className="w-4 h-4" />
                      Abrir WhatsApp
                    </a>
                    <button
                      type="button"
                      onClick={() => {
                        setIssued(null);
                        setTouched(false);
                        setName("");
                      }}
                      className="flex-1 py-3.5 rounded-xl border border-zinc-700 hover:border-zinc-500 text-white font-bold uppercase tracking-wider text-xs transition-colors"
                    >
                      Emitir outra credencial
                    </button>
                  </div>
                </motion.div>
              ) : (
              <form
                onSubmit={handleVipPassSubmit}
                noValidate
                className="p-8 rounded-3xl bg-zinc-900/70 backdrop-blur-xl border border-zinc-800 shadow-2xl space-y-6 relative"
              >
                <div className="flex items-center justify-between border-b border-dashed border-zinc-800 pb-4">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-lime-400 block">
                      CREDENCIAL TEMPORÁRIA
                    </span>
                    <h3 className="text-lg font-black uppercase text-white">
                      1 DIA DE ACESSO TOTAL FREE
                    </h3>
                  </div>
                  <Dumbbell className="w-6 h-6 text-lime-400" />
                </div>

                <div>
                  <label
                    htmlFor="vip-name"
                    className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2"
                  >
                    Nome do Convidado(a)
                  </label>
                  <div className="relative">
                    <input
                      id="vip-name"
                      type="text"
                      autoComplete="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      onBlur={() => setTouched(true)}
                      aria-invalid={touched && !nameValid}
                      aria-describedby={touched && !nameValid ? "vip-name-error" : undefined}
                      placeholder="Digite seu nome..."
                      className={`w-full px-4 py-3.5 pr-11 rounded-xl bg-zinc-950 border text-white placeholder-zinc-600 focus:outline-none transition-colors text-sm ${nameValid
                        ? "border-lime-400/60 focus:border-lime-400"
                        : touched
                          ? "border-red-500/70 focus:border-red-400"
                          : "border-zinc-800 focus:border-lime-400"
                        }`}
                    />
                    {nameValid && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 400, damping: 18 }}
                        className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2"
                      >
                        <CheckCircle2 className="w-5 h-5 text-lime-400" />
                      </motion.span>
                    )}
                  </div>
                  {touched && !nameValid && (
                    <p id="vip-name-error" role="alert" className="mt-1.5 text-xs text-red-400">
                      Informe seu nome com pelo menos 3 letras.
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
                    Foco do Treino Experimental
                  </label>
                  <select
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                    className="w-full px-4 py-3.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white focus:outline-none focus:border-lime-400 transition-colors text-sm"
                  >
                    <option value="Hipertrofia & Estética">Hipertrofia & Estética</option>
                    <option value="Emagrecimento & Condicionamento">
                      Emagrecimento & Condicionamento
                    </option>
                    <option value="Aulas de Cross & HIIT">Aulas de Cross & HIIT</option>
                    <option value="Saúde & Longevidade">Saúde & Longevidade</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="group relative w-full overflow-hidden py-4 rounded-xl bg-gradient-to-r from-lime-400 to-emerald-400 hover:from-lime-300 hover:to-emerald-300 text-zinc-950 font-black uppercase tracking-wider text-xs transition-all shadow-[0_0_30px_rgba(163,230,53,0.3)] flex items-center justify-center gap-2 active:scale-[0.98]"
                >
                  <span
                    aria-hidden
                    className="absolute inset-y-0 -left-1/3 w-1/4 -skew-x-12 bg-white/40 transition-transform duration-700 group-hover:translate-x-[700%]"
                  />
                  <MessageCircle className="relative w-4 h-4" />
                  <span className="relative">Emitir Credencial via WhatsApp</span>
                </button>
              </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// ==========================================
// 9. FOOTER
// ==========================================
const Footer = () => {
  return (
    <footer className="bg-[#040605] border-t border-zinc-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-lime-400/10 border border-lime-400/20 text-lime-400">
            <Dumbbell className="w-4 h-4" />
          </div>
          <span className="text-sm font-black tracking-wider text-white">
            PULSE<span className="text-lime-400">FIT</span>
          </span>
        </div>
        <p className="text-xs font-mono text-zinc-600">
          © {2026} PULSEFIT PERFORMANCE LAB. TODOS OS DIREITOS RESERVADOS.
        </p>
      </div>
    </footer>
  );
};

// ==========================================
// MAIN PAGE EXPORT
// ==========================================
export default function LandingPage() {
  return (
    <div className="demo-dark min-h-screen bg-[#060807] text-zinc-100 selection:bg-lime-400 selection:text-zinc-950 font-sans antialiased overflow-x-hidden">
      <ScrollProgress />
      <Navbar />
      <main id="conteudo">
        <Hero />
        <Marquee />
        <Features />
        <Gallery />
        <Pricing />
        <FAQ />
        <Contact />
      </main>
      <Footer />
      <StickyMobileCta
        label="Agendar sessão grátis"
        href={`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`}
        hideWhenVisibleId="contato"
        className="bg-gradient-to-r from-lime-400 to-emerald-400 text-zinc-950 shadow-[0_0_30px_rgba(163,230,53,0.35)]"
        onClick={() =>
          trackMetaEvent("Lead", {
            content_name: "Day Pass Experimental Grátis",
            content_category: "PulseFit Sticky Bar",
            value: 0,
            currency: "BRL",
          })
        }
      />
    </div>
  );
}