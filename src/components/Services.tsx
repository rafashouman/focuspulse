"use client";

import { motion } from "framer-motion";
import {
  LayoutTemplate,
  Globe,
  ImageIcon,
  ShoppingCart,
  Search,
  ShieldCheck,
  ArrowUpRight,
  Zap,
  Sparkles,
} from "lucide-react";

const WA_NUMBER = "5551993583936";

const services = [
  {
    icon: LayoutTemplate,
    title: "Landing Pages",
    desc: "Páginas focadas em um objetivo claro: transformar visitantes em contatos e oportunidades reais para o seu negócio.",
    span: "lg:col-span-7",
    tag: "Alta Conversão",
    metrics: ["+68% Leads", "Copy & UX", "A/B Ready"],
    accent: "from-violet-500/20 via-fuchsia-500/5 to-transparent",
    featured: true,
  },
  {
    icon: Globe,
    title: "Sites Institucionais",
    desc: "Apresentações ágeis e modernas que transmitem autoridade e confiança desde o primeiro acesso.",
    span: "lg:col-span-5",
    tag: "Autoridade Digital",
    metrics: ["Design Exclusivo", "CMS Integrado"],
    accent: "from-indigo-500/15 via-transparent to-transparent",
    featured: false,
  },
  {
    icon: ImageIcon,
    title: "Portfólios Dinâmicos",
    desc: "Vitrines digitais rápidas para destacar seus projetos e imagens sem comprometer a performance.",
    span: "lg:col-span-4",
    tag: "Motion & WebGL",
    metrics: ["60 FPS Animations", "Lazy Media"],
    accent: "from-purple-500/15 via-transparent to-transparent",
    featured: false,
  },
  {
    icon: ShoppingCart,
    title: "Lojas Virtuais",
    desc: "Lojas rápidas e preparadas para vender, com navegação simples e uma jornada de compra sem atritos.",
    span: "lg:col-span-8",
    tag: "E-Commerce de Escala",
    metrics: ["Checkout Sem Atrito", "Catálogo Dinâmico", "Pagamentos Pix/Cartão"],
    accent: "from-fuchsia-500/20 via-violet-500/5 to-transparent",
    featured: true,
  },
  {
    icon: Search,
    title: "Otimização SEO",
    desc: "Estrutura técnica bem organizada para ajudar sua empresa a ganhar visibilidade nos mecanismos de busca.",
    span: "lg:col-span-6",
    tag: "Tráfego Orgânico",
    metrics: ["Core Web Vitals 99+", "Schema Markup", "Indexação Rápida"],
    accent: "from-emerald-500/15 via-transparent to-transparent",
    featured: false,
  },
  {
    icon: ShieldCheck,
    title: "Manutenção Técnica",
    desc: "Acompanhamento, atualizações de segurança e otimizações para manter seu site estável, seguro e rápido.",
    span: "lg:col-span-6",
    tag: "Estabilidade 24/7",
    metrics: ["Monitoramento Uptime", "Backups & SSL", "Evolução Contínua"],
    accent: "from-cyan-500/15 via-transparent to-transparent",
    featured: false,
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
  hidden: { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] as const },
  },
};

export function Services() {
  return (
    <section
      id="servicos"
      className="relative isolate overflow-hidden border-y border-violet-200/[0.08] bg-[#110d18]/65 py-24 backdrop-blur-2xl sm:py-32"
    >
      {/* Glows Ambientais */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 top-0 -z-10 h-[34rem] w-[34rem] rounded-full bg-violet-500/[0.09] blur-[130px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-40 bottom-0 -z-10 h-[28rem] w-[28rem] rounded-full bg-fuchsia-500/[0.06] blur-[120px]"
      />

      <div className="container-luxe">
        {/* Cabeçalho */}
        <div className="mb-14 flex flex-col gap-7 md:mb-16 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-5 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-violet-200"
            >
              <span className="h-px w-7 bg-fuchsia-300/80" />
              Nossas Especialidades
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-balance font-display text-4xl font-semibold leading-[1.02] tracking-[-0.055em] text-foreground sm:text-5xl md:text-6xl"
            >
              Engenharia web
              <br />
              <span className="text-violet-gradient">feita para avançar.</span>
            </motion.h2>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-sm text-base leading-7 text-muted-foreground"
          >
            Da primeira impressão à próxima venda: soluções digitais construídas
            em torno do que o seu negócio precisa.
            <span className="mt-3 block font-medium text-violet-100">
              Estratégia, design e tecnologia em cada detalhe.
            </span>
          </motion.p>
        </div>

        {/* Bento Grid de 12 Colunas */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-12"
        >
          {services.map((service, idx) => {
            const Icon = service.icon;
            const waUrl = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(
              `Olá! Quero saber mais sobre o desenvolvimento de ${service.title} na FocusPulse.`
            )}`;

            return (
              <motion.article
                key={service.title}
                variants={itemVariants}
                className={`${service.span} group relative flex flex-col justify-between overflow-hidden rounded-[2rem] border border-white/[0.09] bg-[#0c0e14]/80 p-7 shadow-2xl shadow-black/30 backdrop-blur-2xl transition-all duration-500 hover:-translate-y-1 hover:border-violet-300/30 sm:p-8`}
              >
                {/* Gradiente Interno no Hover */}
                <div
                  aria-hidden
                  className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${service.accent} opacity-50 transition-opacity duration-500 group-hover:opacity-100`}
                />

                {/* Grade decorativa sutil nos cards em destaque */}
                {service.featured && (
                  <div
                    aria-hidden
                    className="pointer-events-none absolute right-0 top-0 h-full w-1/2 opacity-20 transition-opacity duration-500 group-hover:opacity-40"
                    style={{
                      backgroundImage:
                        "radial-gradient(rgba(167,139,250,0.35) 1px, transparent 1px)",
                      backgroundSize: "18px 18px",
                      maskImage:
                        "radial-gradient(circle at 80% 30%, black, transparent 75%)",
                    }}
                  />
                )}

                {/* Topo do Card */}
                <div className="relative z-10">
                  <div className="mb-8 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      <div className="grid h-12 w-12 place-items-center rounded-2xl border border-violet-300/20 bg-violet-400/[0.08] text-violet-200 shadow-inner transition-all duration-300 group-hover:scale-105 group-hover:border-violet-300/40 group-hover:bg-violet-500/20 group-hover:text-white">
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-violet-200/80">
                        {service.tag}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs tracking-[0.16em] text-white/30">
                        0{idx + 1} <span className="text-violet-300/50">/ 06</span>
                      </span>
                      <a
                        href={waUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Conversar sobre ${service.title}`}
                        className="grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-white/[0.03] text-white/50 transition-all duration-300 group-hover:border-violet-300/40 group-hover:bg-violet-500 group-hover:text-white"
                      >
                        <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </a>
                    </div>
                  </div>

                  {/* Conteúdo Central */}
                  <div className="max-w-xl">
                    <h3 className="font-display text-2xl font-semibold tracking-tight text-foreground transition-colors group-hover:text-violet-100 sm:text-3xl">
                      {service.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
                      {service.desc}
                    </p>
                  </div>
                </div>

                {/* Rodapé com Pills de Especificações & Micro-UI */}
                <div className="relative z-10 mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-white/[0.07] pt-5">
                  <div className="flex flex-wrap items-center gap-2">
                    {service.metrics.map((metric) => (
                      <span
                        key={metric}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-white/[0.07] bg-white/[0.025] px-2.5 py-1 font-mono text-[11px] text-white/70 transition-colors group-hover:border-violet-300/20 group-hover:text-violet-100"
                      >
                        <Sparkles className="h-2.5 w-2.5 text-fuchsia-300" />
                        {metric}
                      </span>
                    ))}
                  </div>

                  {service.featured && (
                    <div className="hidden items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 sm:inline-flex">
                      <Zap className="h-3 w-3 text-emerald-300" />
                      <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-emerald-200">
                        Alta Demanda
                      </span>
                    </div>
                  )}
                </div>
              </motion.article>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}