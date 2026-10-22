"use client";

import { motion } from "framer-motion";
import {
  Scale,
  Stethoscope,
  Building2,
  Wrench,
  UtensilsCrossed,
  Briefcase,
  Dumbbell,
  Calculator,
} from "lucide-react";

const segments = [
  {
    icon: Scale,
    title: "Advocacia",
    desc: "Plataformas seguras que transmitem credibilidade jurídica e facilitam o contato rápido de novos clientes.",
  },
  {
    icon: Stethoscope,
    title: "Clínicas & Consultórios",
    desc: "Agendamento otimizado, navegação fluida e autoridade profissional para a área da saúde.",
  },
  {
    icon: Building2,
    title: "Arquitetura & Imobiliárias",
    desc: "Portfólios visuais com carregamento ultrarrápido que valorizam imagens pesadas sem perder performance.",
  },
  {
    icon: Calculator,
    title: "Contabilidade & B2B",
    desc: "Sites institucionais ágeis e diretos, estruturados para a geração de leads e atração de outras empresas.",
  },
  {
    icon: Wrench,
    title: "Manutenção & Serviços",
    desc: "Presença digital otimizada para buscas locais com tempo de resposta imediato para o cliente que tem urgência.",
  },
  {
    icon: UtensilsCrossed,
    title: "Restaurantes & Lojas",
    desc: "Cardápios digitais e vitrines virtuais otimizadas com foco total em conversão e pedidos rápidos.",
  },
  {
    icon: Dumbbell,
    title: "Academias & Esportes",
    desc: "Páginas dinâmicas focadas na conversão direta de planos e captação eficiente de novos alunos.",
  },
  {
    icon: Briefcase,
    title: "Consultoria",
    desc: "Posicionamento digital focado em autoridade e resultados concretos para especialistas e profissionais liberais.",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

export function Segments() {
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
            Cada setor tem desafios diferentes. Criamos experiências digitais alinhadas à rotina e às oportunidades de cada negócio.
            <span className="mt-4 block font-medium text-violet-100">
              Encontre o seu e veja o que podemos construir juntos.
            </span>
          </motion.p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5"
        >
          {segments.map((segment, idx) => {
            const Icon = segment.icon;
            return (
              <motion.div
                key={segment.title}
                variants={itemVariants}
                className="group relative flex min-h-[245px] flex-col overflow-hidden rounded-[1.5rem] border border-white/[0.09] bg-white/[0.025] p-6 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-violet-200/20 hover:bg-white/[0.05]"
              >
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-400/0 via-transparent to-fuchsia-400/0 transition-colors duration-500 group-hover:from-violet-400/[0.07] group-hover:to-fuchsia-400/[0.035]" />
                <div className="relative z-10 flex h-full flex-col">
                  <div className="mb-7 flex items-center justify-between">
                    <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.035] text-violet-200 transition-colors duration-300 group-hover:border-violet-300/30 group-hover:bg-violet-400/[0.08]">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="font-mono text-[11px] tracking-[0.16em] text-white/30">
                      0{idx + 1}
                    </span>
                  </div>
                  <h3 className="mb-3 font-display text-lg font-semibold leading-snug tracking-tight text-foreground transition-colors group-hover:text-violet-100">
                    {segment.title}
                  </h3>
                  <p className="text-sm leading-6 text-muted-foreground">
                    {segment.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}