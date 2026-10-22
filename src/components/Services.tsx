"use client";

import { motion } from "framer-motion";
import {
  LayoutTemplate,
  Globe,
  ImageIcon,
  ShoppingCart,
  Search,
  ShieldCheck,
} from "lucide-react";

// Lista de serviços baseada no seu plano de negócios
const services = [
  {
    icon: LayoutTemplate,
    title: "Landing Pages",
    desc: "Páginas focadas em um objetivo claro: transformar visitantes em contatos e oportunidades reais para o seu negócio."
  },
  {
    icon: Globe,
    title: "Sites Institucionais",
    desc: "Apresentações ágeis e modernas que transmitem autoridade e confiança desde o primeiro acesso."
  },
  {
    icon: ImageIcon,
    title: "Portfólios Dinâmicos",
    desc: "Vitrines digitais rápidas para destacar seus projetos e imagens sem comprometer a performance."
  },
  {
    icon: ShoppingCart,
    title: "Lojas Virtuais",
    desc: "Lojas rápidas e preparadas para vender, com navegação simples e uma jornada de compra sem atritos."
  },
  {
    icon: Search,
    title: "Otimização SEO",
    desc: "Estrutura técnica bem organizada para ajudar sua empresa a ganhar visibilidade nos mecanismos de busca."
  },
  {
    icon: ShieldCheck,
    title: "Manutenção Técnica",
    desc: "Acompanhamento, atualizações de segurança e otimizações para manter seu site estável, seguro e rápido."
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } }
};

export function Services() {
  return (
    <section
      id="servicos"
      className="relative isolate overflow-hidden border-y border-violet-200/[0.08] bg-[#110d18]/65 py-24 backdrop-blur-2xl sm:py-32"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 top-0 -z-10 h-[32rem] w-[32rem] rounded-full bg-violet-500/[0.08] blur-[120px]"
      />
      <div className="container-luxe">
        <div className="mb-12 flex flex-col gap-7 md:mb-16 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: "easeOut" as const }}
              className="mb-5 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-violet-200"
            >
              <span className="h-px w-7 bg-fuchsia-300/80" />
              Nossas Especialidades
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" as const }}
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
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" as const }}
            className="max-w-sm text-base leading-7 text-muted-foreground"
          >
            Da primeira impressão à próxima venda: soluções digitais construídas em torno do que o seu negócio precisa.
            <span className="mt-4 block font-medium text-violet-100">
              Estratégia, design e tecnologia em cada detalhe.
            </span>
          </motion.p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3"
        >
          {services.map((service, idx) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.title}
                variants={itemVariants}
                className="group relative min-h-[250px] overflow-hidden rounded-[1.6rem] border border-white/[0.1] bg-white/[0.035] p-7 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-violet-200/20 hover:bg-white/[0.055] sm:p-8"
              >
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-400/0 via-transparent to-fuchsia-400/0 transition-colors duration-500 group-hover:from-violet-400/[0.08] group-hover:to-fuchsia-400/[0.04]" />
                <div className="relative z-10 flex h-full flex-col">
                  <div className="mb-8 flex items-center justify-between">
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-violet-300/20 bg-violet-400/[0.07] text-violet-200 transition-colors duration-300 group-hover:border-violet-300/40 group-hover:bg-violet-400/[0.12]">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="font-mono text-xs tracking-[0.16em] text-white/30">
                      0{idx + 1} <span className="text-violet-200/60">/ 06</span>
                    </span>
                  </div>
                  <h3 className="mb-3 font-display text-xl font-semibold tracking-tight text-foreground transition-colors group-hover:text-violet-100">
                    {service.title}
                  </h3>
                  <p className="text-sm leading-6 text-muted-foreground">
                    {service.desc}
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