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
  Calculator
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
    <section id="segmentos" className="relative py-24 sm:py-32 bg-background">
      <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />

      <div className="container-luxe">
        <div className="max-w-2xl mx-auto text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full border border-blue-500/20 bg-blue-500/5 text-xs font-bold uppercase tracking-widest text-blue-400"
          >
            Soluções sob Medida
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-display uppercase tracking-tight mb-6"
          >
            Presença Digital Focada em <span className="text-blue-gradient">Resultados.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-muted-foreground text-lg"
          >
            Construímos plataformas ágeis e otimizadas para as necessidades específicas do seu setor, garantindo a melhor experiência de navegação para o seu utilizador.
          </motion.p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6"
        >
          {segments.map((segment, idx) => {
            const Icon = segment.icon;
            return (
              <motion.div
                key={idx}
                variants={itemVariants}
                className="group relative flex flex-col p-8 rounded-3xl border border-border bg-card hover:bg-card/80 hover:border-blue-500/50 transition-colors duration-500 overflow-hidden"
              >
                <div className="absolute inset-0 bg-blue-500/0 group-hover:bg-blue-500/5 transition-colors duration-500 pointer-events-none" />

                <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-border bg-background group-hover:border-blue-500/50 group-hover:text-blue-400 transition-all duration-500 relative z-10">
                  <Icon className="h-5 w-5 text-muted-foreground group-hover:text-blue-400 transition-colors" />
                </div>

                <h3 className="text-xl font-bold font-display mb-3 text-foreground relative z-10">
                  {segment.title}
                </h3>

                <p className="text-sm text-muted-foreground leading-relaxed relative z-10">
                  {segment.desc}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}