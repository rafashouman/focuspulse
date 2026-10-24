"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  MoveUpRight,
  Sparkles,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const WA =
  "https://wa.me/5551993583936?text=" +
  encodeURIComponent(
    "Olá! Vi o portfólio da FocusPulse e quero conversar sobre um projeto."
  );

const projects = [
  {
    number: "01",
    category: "Fitness & bem-estar",
    title: "PulseFit",
    description:
      "Uma experiência de marca enérgica para transformar interesse em novas matrículas.",
    href: "/templates/academias",
    theme: "from-orange-500/20 via-[#181512] to-[#0c0d0f]",
    glowColor: "rgba(249, 115, 22, 0.22)",
    badgeColor: "border-orange-400/30 bg-orange-500/10 text-orange-200",
    barGradient: "from-orange-500 to-amber-300",
  },
  {
    number: "02",
    category: "Gastronomia",
    title: "Kobra Burger Lab",
    description:
      "Cardápio digital com personalidade, pensado para abrir o apetite e facilitar pedidos.",
    href: "/templates/cardapio",
    theme: "from-amber-200/15 via-[#1c1713] to-[#0c0d0f]",
    glowColor: "rgba(245, 158, 11, 0.20)",
    badgeColor: "border-amber-300/30 bg-amber-400/10 text-amber-200",
    barGradient: "from-amber-500 to-yellow-200",
  },
  {
    number: "03",
    category: "E-commerce & moda",
    title: "Vortex Atelier",
    description:
      "Uma vitrine editorial para uma marca que tem atitude em cada detalhe.",
    href: "/templates/streetwear",
    theme: "from-violet-300/20 via-[#17111f] to-[#0c0d0f]",
    glowColor: "rgba(139, 92, 246, 0.28)",
    badgeColor: "border-violet-300/30 bg-violet-400/10 text-violet-200",
    barGradient: "from-violet-600 to-fuchsia-300",
  },
  {
    number: "04",
    category: "Automotivo & Seminovos",
    title: "Prime Motors",
    description:
      "Portal automotivo em tema claro com comparativo FIPE, simulador CDC e reserva de visita online.",
    href: "/templates/carros",
    theme: "from-blue-500/20 via-[#101726] to-[#0c0d0f]",
    glowColor: "rgba(37, 99, 235, 0.25)",
    badgeColor: "border-blue-400/30 bg-blue-500/10 text-blue-200",
    barGradient: "from-blue-600 to-cyan-300",
  },
];

const AUTOPLAY_TIME = 6000;

export function Hero() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [5, -5]), {
    stiffness: 150,
    damping: 22,
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-5, 5]), {
    stiffness: 150,
    damping: 22,
  });

  useEffect(() => {
    if (isHovered) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % projects.length);
    }, AUTOPLAY_TIME);
    return () => clearInterval(timer);
  }, [isHovered, activeIndex]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
  };

  const nextSlide = () =>
    setActiveIndex((prev) => (prev + 1) % projects.length);
  const prevSlide = () =>
    setActiveIndex((prev) => (prev - 1 + projects.length) % projects.length);

  const activeProject = projects[activeIndex];

  return (
    <section
      id="hero"
      className="relative isolate flex min-h-[min(920px,100svh)] items-center overflow-hidden px-4 pb-20 pt-32 sm:px-10 lg:px-16"
    >
      {/* Grid Background */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          backgroundImage:
            "linear-gradient(rgba(148,163,184,.055) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,.055) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
          maskImage: "linear-gradient(to bottom, black, transparent 88%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 top-16 -z-10 h-[34rem] w-[34rem] rounded-full bg-violet-500/15 blur-[120px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 left-0 -z-10 h-96 w-96 rounded-full bg-purple-500/10 blur-[100px]"
      />

      <div className="mx-auto grid w-full max-w-[1440px] grid-cols-1 items-center gap-14 lg:grid-cols-[1.05fr_.95fr] lg:gap-10">
        {/* COLUNA ESQUERDA */}
        <div className="relative z-10 w-full min-w-0 max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65 }}
            className="mb-8 inline-flex max-w-full items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground"
          >
            <span className="grid h-8 w-8 place-items-center rounded-full border border-violet-300/25 bg-violet-400/10 text-violet-200">
              <Sparkles className="h-4 w-4" />
            </span>
            <span className="min-w-0">
              Estúdio de desenvolvimento digital e UX/UI
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.08 }}
            className="min-w-0 max-w-3xl text-balance font-display text-[clamp(1.75rem,8.8vw,3.6rem)] font-semibold uppercase leading-[1.1] tracking-[-.050em]"
          >
            <span className="text-violet-gradient">Presença digital</span>
            <br />
            que gera resultados.
            <br />
            Sua marca em <span className="text-fuchsia-gradient">destaque</span>.
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-8 flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between"
          >
            <p className="max-w-lg text-base leading-7 text-muted-foreground sm:text-lg">
              <span className="font-medium text-violet-100">
                Estratégia, design e tecnologia
              </span>{" "}
              para transformar a presença da sua marca em uma{" "}
              <span className="font-medium text-fuchsia-200">experiência</span>{" "}
              que traz resultados.
            </p>
            <div className="flex shrink-0 flex-col items-start gap-5 sm:items-end">
              <a
                href={WA}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-3 rounded-full bg-violet-gradient px-6 py-4 text-sm font-bold text-white shadow-violet-glow transition-transform hover:scale-[1.03]"
              >
                Vamos criar algo?
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>
              <a
                href="#trabalhos"
                className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground transition-colors hover:text-foreground"
              >
                Conheça nosso trabalho
                <ArrowDown className="h-3.5 w-3.5" />
              </a>
            </div>
          </motion.div>
        </div>

        {/* COLUNA DIREITA: Carrossel 3D com 4 Templates */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, x: 18 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="relative mx-auto w-full max-w-[590px] lg:ml-auto"
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={handleMouseLeave}
          style={{ perspective: 1200 }}
        >
          <motion.div
            aria-hidden
            animate={{ backgroundColor: activeProject.glowColor }}
            transition={{ duration: 0.8 }}
            className="pointer-events-none absolute inset-8 -z-10 rounded-full blur-[95px]"
          />

          <motion.div
            style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
            className="relative aspect-[1.02] w-full select-none"
          >
            <div className="pointer-events-none absolute inset-[7%] -z-20 rotate-[-7deg] rounded-[2rem] border border-white/10 bg-white/[0.025] shadow-2xl shadow-violet-950/40" />

            {projects.map((project, index) => {
              const offset =
                (index - activeIndex + projects.length) % projects.length;
              const isFront = offset === 0;
              const isSecond = offset === 1;

              return (
                <motion.div
                  key={project.number}
                  layout
                  initial={false}
                  animate={{
                    scale: isFront ? 1 : isSecond ? 0.93 : 0.86,
                    y: isFront ? 0 : isSecond ? -20 : -38,
                    x: isFront ? 0 : isSecond ? 18 : -18,
                    rotateZ: isFront ? 0 : isSecond ? 3.5 : -4.5,
                    opacity: isFront ? 1 : isSecond ? 0.5 : 0.18,
                    zIndex: projects.length - offset,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 260,
                    damping: 26,
                  }}
                  drag={isFront ? "x" : false}
                  dragConstraints={{ left: 0, right: 0 }}
                  onDragEnd={(_, info) => {
                    if (info.offset.x < -50) nextSlide();
                    else if (info.offset.x > 50) prevSlide();
                  }}
                  onClick={() => {
                    if (!isFront) setActiveIndex(index);
                  }}
                  className={`
                    group absolute inset-0 flex flex-col overflow-hidden rounded-[2rem] border backdrop-blur-2xl
                    ${
                      isFront
                        ? "cursor-grab border-white/15 bg-[#0b0e13]/90 shadow-[0_30px_100px_-35px_rgba(0,0,0,.85)] active:cursor-grabbing"
                        : "cursor-pointer border-violet-300/15 bg-[#17111f]/70"
                    }
                  `}
                >
                  <div className="flex h-13 shrink-0 items-center justify-between border-b border-white/[0.08] bg-[#0b0e13]/90 px-5 sm:px-6">
                    <div className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full bg-[#ff6b61]" />
                      <span className="h-2.5 w-2.5 rounded-full bg-[#ffc14f]" />
                      <span className="h-2.5 w-2.5 rounded-full bg-[#49c781]" />
                    </div>

                    <div className="flex min-w-0 max-w-[60%] items-center gap-2 rounded-full border border-white/[0.07] bg-white/[0.03] px-3 py-1">
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                      <span className="min-w-0 truncate font-mono text-[9px] tracking-[0.16em] text-white/50 sm:text-[10px]">
                        focuspulse.site{project.href}
                      </span>
                    </div>

                    <Link
                      href={project.href}
                      aria-label={`Abrir template ${project.title}`}
                      className="grid h-7 w-7 place-items-center rounded-full border border-white/10 bg-white/5 text-white/60 transition-colors hover:border-white/40 hover:bg-white hover:text-black"
                    >
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>

                  <div
                    className={`relative flex-1 overflow-hidden bg-gradient-to-br ${project.theme} p-4 sm:p-5`}
                  >
                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_70%_20%,rgba(255,255,255,.1),transparent_60%)]" />

                    <div className="relative h-full w-full overflow-hidden rounded-2xl border border-white/15 bg-[#0b0d10] shadow-2xl">
                      <iframe
                        src={project.href}
                        title={`Prévia do template ${project.title}`}
                        loading="lazy"
                        scrolling="no"
                        tabIndex={-1}
                        className="pointer-events-none h-[200%] w-[200%] origin-top-left scale-50 border-0 bg-[#0b0d10]"
                      />

                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#090a0f] via-[#090a0f]/45 to-transparent" />

                      <div className="absolute left-4 top-4 flex items-center gap-2">
                        <span
                          className={`rounded-full border px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] backdrop-blur-md ${project.badgeColor}`}
                        >
                          {project.category}
                        </span>
                      </div>

                      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 sm:p-6">
                        <div className="max-w-xs">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs text-white/45">
                              /{project.number}
                            </span>
                            <h2 className="font-display text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                              {project.title}
                            </h2>
                          </div>
                          <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-white/70 sm:text-sm">
                            {project.description}
                          </p>
                        </div>

                        <Link
                          href={project.href}
                          aria-label={`Explorar o template demonstrativo ${project.title}`}
                          className="group/btn flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/25 bg-black/50 text-white backdrop-blur-md transition-all hover:scale-105 hover:border-white hover:bg-white hover:text-black"
                        >
                          <MoveUpRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                        </Link>
                      </div>
                    </div>
                  </div>

                  <div className="flex h-14 shrink-0 items-center justify-between border-t border-white/10 bg-[#0b0e13]/95 px-5 sm:px-6">
                    <div>
                      <p className="text-[8px] uppercase tracking-[0.18em] text-white/40">
                        Estratégia · Design · Código
                      </p>
                      <p className="mt-0.5 text-xs font-medium text-white/85">
                        Template interativo disponível
                      </p>
                    </div>

                    <div aria-hidden className="flex h-7 items-end gap-1">
                      {[12, 22, 16, 26, 18, 28, 15].map((height, idx) => (
                        <span
                          key={idx}
                          className={`w-1 rounded-full bg-gradient-to-t ${project.barGradient}`}
                          style={{ height: isFront ? height : 8 }}
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              );
            })}

            <AnimatePresence mode="wait">
              <motion.div
                key={activeProject.number}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                style={{ transform: "translateZ(40px)" }}
                className="pointer-events-none absolute -bottom-4 -left-4 z-30 hidden rounded-2xl border border-violet-200/15 bg-[#17111f]/85 px-4 py-3 shadow-xl shadow-violet-950/30 backdrop-blur-xl sm:block"
              >
                <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                  Prévia ao vivo · {activeProject.number}
                </p>
                <p className="mt-0.5 text-xs font-semibold text-foreground">
                  {activeProject.title} — {activeProject.category}
                </p>
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {/* DOCK DE NAVEGAÇÃO DOS TEMPLATES */}
          <div className="mt-7 flex items-center justify-between gap-3 rounded-full border border-white/10 bg-[#0d1017]/80 px-3.5 py-2 backdrop-blur-xl">
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              {projects.map((proj, idx) => {
                const isActive = idx === activeIndex;
                return (
                  <button
                    key={proj.number}
                    onClick={() => setActiveIndex(idx)}
                    className={`relative flex items-center gap-2 rounded-full px-3 py-1.5 text-xs transition-all ${
                      isActive
                        ? "bg-white/10 font-semibold text-white"
                        : "text-white/45 hover:text-white/80"
                    }`}
                  >
                    <span className="font-mono text-[10px] text-violet-300/80">
                      {proj.number}
                    </span>
                    <span className="whitespace-nowrap">{proj.title}</span>

                    {isActive && !isHovered && (
                      <motion.span
                        layoutId="heroProjectProgress"
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{
                          duration: AUTOPLAY_TIME / 1000,
                          ease: "linear",
                        }}
                        className="absolute bottom-0 left-2 right-2 h-[2px] rounded-full bg-gradient-to-r from-violet-400 to-fuchsia-400"
                      />
                    )}
                  </button>
                );
              })}
            </div>

            <div className="flex shrink-0 items-center gap-1.5">
              <button
                onClick={prevSlide}
                aria-label="Projeto anterior"
                className="grid h-8 w-8 place-items-center rounded-full border border-white/10 bg-white/5 text-white/70 transition-colors hover:border-violet-400/40 hover:bg-violet-500/20 hover:text-white"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={nextSlide}
                aria-label="Próximo projeto"
                className="grid h-8 w-8 place-items-center rounded-full border border-white/10 bg-white/5 text-white/70 transition-colors hover:border-violet-400/40 hover:bg-violet-500/20 hover:text-white"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      <div
        aria-hidden
        className="absolute bottom-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent sm:left-10 sm:right-10 lg:left-16 lg:right-16"
      />
    </section>
  );
}