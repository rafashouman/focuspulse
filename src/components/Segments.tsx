"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Scale,
  Stethoscope,
  Building2,
  Wrench,
  UtensilsCrossed,
  Briefcase,
  Dumbbell,
  Calculator,
  ArrowUpRight,
  CheckCircle2,
} from "lucide-react";

const WA_NUMBER = "5551993583936";

const segments = [
  {
    icon: Scale,
    title: "Advocacia",
    desc: "Plataformas seguras que transmitem credibilidade jurídica e facilitam o contato rápido de novos clientes.",
    focus: "Captação ética & triagem inteligente pelo WhatsApp",
    pill: "Autoridade Jurídica",
  },
  {
    icon: Stethoscope,
    title: "Clínicas & Consultórios",
    desc: "Agendamento otimizado, navegação fluida e autoridade profissional para a área da saúde.",
    focus: "Agendamento rápido & apresentação de especialidades",
    pill: "Saúde & Bem-estar",
  },
  {
    icon: Building2,
    title: "Arquitetura & Imobiliárias",
    desc: "Portfólios visuais com carregamento ultrarrápido que valorizam imagens pesadas sem perder performance.",
    focus: "Galerias em alta definição com carregamento instantâneo",
    pill: "Alto Padrão Visual",
  },
  {
    icon: Calculator,
    title: "Contabilidade & B2B",
    desc: "Sites institucionais ágeis e diretos, estruturados para a geração de leads e atração de outras empresas.",
    focus: "Funil de cotação corporativa & prova social",
    pill: "Geração de Leads B2B",
  },
  {
    icon: Wrench,
    title: "Manutenção & Serviços",
    desc: "Presença digital otimizada para buscas locais com tempo de resposta imediato para o cliente que tem urgência.",
    focus: "SEO Local dominante & chamada de emergência em 1 clique",
    pill: "Conversão Imediata",
  },
  {
    icon: UtensilsCrossed,
    title: "Restaurantes & Lojas",
    desc: "Cardápios digitais e vitrines virtuais otimizadas com foco total em conversão e pedidos rápidos.",
    focus: "Experiência mobile-first que aumenta o ticket médio",
    pill: "Vendas & Pedidos",
  },
  {
    icon: Dumbbell,
    title: "Academias & Esportes",
    desc: "Páginas dinâmicas focadas na conversão direta de planos e captação eficiente de novos alunos.",
    focus: "Comparativo de planos interativo & matrícula online",
    pill: "Retenção & Matrículas",
  },
  {
    icon: Briefcase,
    title: "Consultoria",
    desc: "Posicionamento digital focado em autoridade e resultados concretos para especialistas e profissionais liberais.",
    focus: "Storytelling estratégico & captação de clientes high-ticket",
    pill: "Posicionamento Premium",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: "easeOut" as const },
  },
};

export function Segments() {
  const [activeIdx, setActiveIdx] = useState<number>(0);
  const activeSegment = segments[activeIdx];

  return (
    <section
      id="segmentos"
      className="relative isolate overflow-hidden bg-background py-24 sm:py-32"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -left-48 top-20 -z-10 h-[34rem] w-[34rem] rounded-full bg-fuchsia-500/[0.06] blur-[130px]"
      />
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-300/20 to-transparent"
      />

      <div className="container-luxe">
        {/* Cabeçalho */}
        <div className="mb-12 flex flex-col gap-7 md:mb-16 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-5 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-violet-200"
            >
              <span className="h-px w-7 bg-fuchsia-300/80" />
              Soluções sob Medida
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-balance font-display text-4xl font-semibold leading-[1.02] tracking-[-0.055em] sm:text-5xl md:text-6xl"
            >
              Seu mercado.
              <br />
              <span className="text-violet-gradient">Sua próxima fase.</span>
            </motion.h2>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-sm text-base leading-7 text-muted-foreground"
          >
            Cada setor tem desafios diferentes. Criamos experiências digitais
            alinhadas à rotina e às oportunidades de cada negócio.
            <span className="mt-3 block font-medium text-violet-100">
              Passe o cursor ou selecione o seu setor abaixo.
            </span>
          </motion.p>
        </div>

        {/* Grid Interativo de 8 Segmentos */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5"
        >
          {segments.map((segment, idx) => {
            const Icon = segment.icon;
            const isSelected = activeIdx === idx;
            const waLink = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(
              `Olá! Atuo no segmento de ${segment.title} e gostaria de um projeto digital sob medida.`
            )}`;

            return (
              <motion.div
                key={segment.title}
                variants={itemVariants}
                onMouseEnter={() => setActiveIdx(idx)}
                onClick={() => setActiveIdx(idx)}
                className={`group relative flex min-h-[275px] cursor-pointer flex-col justify-between overflow-hidden rounded-[1.75rem] border p-6 backdrop-blur-xl transition-all duration-300 ${
                  isSelected
                    ? "border-violet-300/40 bg-violet-400/[0.08] -translate-y-1 shadow-[0_20px_50px_-20px_rgba(139,92,246,0.35)]"
                    : "border-white/[0.08] bg-white/[0.025] hover:-translate-y-1 hover:border-violet-200/20 hover:bg-white/[0.045]"
                }`}
              >
                {/* Brilho de fundo quando selecionado */}
                <div
                  aria-hidden
                  className={`pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-500/15 via-transparent to-fuchsia-500/10 transition-opacity duration-500 ${
                    isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-60"
                  }`}
                />

                <div className="relative z-10">
                  <div className="mb-6 flex items-center justify-between">
                    <div
                      className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl border transition-all duration-300 ${
                        isSelected
                          ? "border-violet-300/50 bg-violet-500 text-white shadow-lg shadow-violet-500/30"
                          : "border-white/10 bg-white/[0.035] text-violet-200 group-hover:border-violet-300/30 group-hover:bg-violet-400/[0.1]"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="rounded-full border border-white/10 bg-black/30 px-2.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-violet-200/80">
                        {segment.pill}
                      </span>
                      <span className="font-mono text-[11px] tracking-[0.16em] text-white/30">
                        0{idx + 1}
                      </span>
                    </div>
                  </div>

                  <h3 className="mb-2.5 font-display text-xl font-semibold leading-snug tracking-tight text-foreground transition-colors group-hover:text-violet-100">
                    {segment.title}
                  </h3>
                  <p className="text-sm leading-6 text-muted-foreground">
                    {segment.desc}
                  </p>
                </div>

                {/* Rodapé do Card com entregável específico do nicho */}
                <div className="relative z-10 mt-6 flex items-center justify-between gap-2 border-t border-white/[0.08] pt-4">
                  <div className="flex items-center gap-2 text-xs text-violet-100/85">
                    <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-fuchsia-300" />
                    <span className="line-clamp-1 font-medium">
                      {segment.focus}
                    </span>
                  </div>

                  <a
                    href={waLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Solicitar proposta para ${segment.title}`}
                    className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-white/15 bg-white/5 text-white/70 transition-colors hover:border-white hover:bg-white hover:text-black"
                  >
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </a>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Barra Dinâmica de Diagnóstico Rápido do Setor Selecionado */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSegment.title}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="mt-8 flex flex-col items-start justify-between gap-4 rounded-2xl border border-violet-300/20 bg-[#130e1c]/90 px-6 py-4 backdrop-blur-xl sm:flex-row sm:items-center"
          >
            <div className="flex items-center gap-3">
              <span className="h-2 w-2 animate-pulse rounded-full bg-fuchsia-400" />
              <p className="text-sm text-white/80">
                <strong className="text-white">{activeSegment.title}:</strong>{" "}
                {activeSegment.focus}
              </p>
            </div>
            <a
              href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(
                `Olá! Quero ver exemplos e soluções para o setor de ${activeSegment.title}.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex shrink-0 items-center gap-2 text-xs font-bold uppercase tracking-[0.15em] text-violet-200 transition-colors hover:text-white"
            >
              Solicitar diagnóstico para {activeSegment.title}
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}