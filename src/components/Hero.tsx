"use client";

import { motion } from "framer-motion";
import { ArrowDown, ArrowRight, ArrowUpRight, Sparkles } from "lucide-react";

const WA =
  "https://wa.me/5551993583936?text=" +
  encodeURIComponent("Olá! Vi o portfólio da FocusPulse e quero conversar sobre um projeto.");

export function Hero() {
  return (
    <section
      id="hero"
      className="relative isolate flex min-h-[min(900px,100svh)] items-center overflow-hidden px-6 pb-20 pt-32 sm:px-10 lg:px-16"
    >
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

      <div className="mx-auto grid w-full max-w-[1440px] items-center gap-14 lg:grid-cols-[1.08fr_.92fr] lg:gap-10">
        <div className="relative z-10 max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65 }}
            className="mb-8 inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground"
          >
            <span className="grid h-8 w-8 place-items-center rounded-full border border-violet-300/25 bg-violet-400/10 text-violet-200">
              <Sparkles className="h-4 w-4" />
            </span>
            Estúdio de desenvolvimento digital e UX/UI
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.08 }}
            className="max-w-3xl text-balance font-display text-[clamp(3rem,8.2vw,3.6rem)] font-semibold uppercase leading-[1.1] tracking-[-.050em]"
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
              <span className="font-medium text-violet-100">Estratégia, design e tecnologia</span> para transformar a presença da
              sua marca em uma <span className="font-medium text-fuchsia-200">experiência</span> que traz resultados.
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

        <motion.div
          initial={{ opacity: 0, scale: 0.96, x: 18 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="relative mx-auto w-full max-w-[570px] lg:ml-auto"
          aria-label="Ilustração abstrata representando design e desenvolvimento digital"
          role="img"
        >
          <div className="relative aspect-[1.04]">
            <div className="absolute inset-[8%] rotate-[-8deg] rounded-[2rem] border border-white/10 bg-white/[0.035] shadow-2xl shadow-violet-950/40" />
            <div className="absolute inset-[5%] rotate-[5deg] rounded-[2rem] border border-violet-300/20 bg-[#17111f]/70 shadow-2xl shadow-black/40 backdrop-blur-xl" />

            <div className="absolute inset-0 overflow-hidden rounded-[2rem] border border-white/10 bg-[#0b0e13]/80 shadow-[0_30px_100px_-35px_rgba(0,0,0,.75)] backdrop-blur-2xl">
              <div className="flex h-14 items-center justify-between border-b border-white/[0.08] px-5 sm:px-7">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[#ff6b61]" />
                  <span className="h-2 w-2 rounded-full bg-[#ffc14f]" />
                  <span className="h-2 w-2 rounded-full bg-[#49c781]" />
                </div>
                <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-white/35 sm:text-[10px]">
                  focuspulse.site
                </span>
                <ArrowUpRight className="h-4 w-4 text-white/40" />
              </div>

              <div className="relative flex h-[calc(100%-3.5rem)] flex-col justify-between overflow-hidden bg-gradient-to-br from-violet-400/[0.08] via-transparent to-purple-500/[0.08] p-6 sm:p-9">
                <div
                  aria-hidden
                  className="absolute -right-20 top-4 h-64 w-64 rounded-full border border-violet-300/10"
                />
                <div
                  aria-hidden
                  className="absolute -right-8 top-16 h-48 w-48 rounded-full border border-orange-300/15"
                />
                <div
                  aria-hidden
                  className="absolute right-8 top-28 h-28 w-28 rounded-full border border-white/10"
                />

                <div className="relative flex items-start justify-between gap-4">
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-violet-200 sm:text-xs">
                      Design com intenção
                    </p>
                    <h2 className="mt-5 max-w-sm font-display text-4xl font-semibold leading-[.96] tracking-[-.06em] text-white sm:text-5xl">
                      Menos ruído.
                      <br />
                      Mais impacto.
                    </h2>
                  </div>
                  <div className="absolute -bottom-20 -left-20 rounded-2xl border border-violet-200/15 bg-[#17111f]/70 px-4 py-3 shadow-xl shadow-violet-950/20 backdrop-blur-xl sm:-left-8 sm:px-5">
                    <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
                      Da ideia ao lançamento
                    </p>
                    <p className="mt-1 text-sm font-semibold text-foreground">
                      Uma experiência completa
                    </p>
                  </div>
                  <div className="mt-1 grid h-10 w-10 shrink-0 place-items-center rounded-full border border-violet-200/15 bg-violet-300/[0.06] text-violet-200 sm:h-12 sm:w-12">
                    <Sparkles className="h-5 w-5" />
                  </div>
                </div>

                <div className="relative flex items-end justify-between gap-4 border-t border-white/10 pt-5">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.18em] text-white/40">
                      Estratégia · Design · Código
                    </p>
                    <p className="mt-2 text-sm font-medium text-white/85 sm:text-base">
                      Feito para mover marcas.
                    </p>
                  </div>
                  <div
                    aria-hidden
                    className="flex h-12 items-end gap-1.5 pb-1"
                  >
                    {[18, 30, 24, 42, 34, 48, 28].map((height, index) => (
                      <span
                        key={index}
                        className="w-1.5 rounded-full bg-gradient-to-t from-violet-600 to-fuchsia-200"
                        style={{ height }}
                      />
                    ))}
                  </div>
                </div>
              </div>
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
