"use client";

import { motion } from "framer-motion";
import {
  LayoutTemplate,
  Globe,
  ImageIcon,
  ShoppingCart,
  Search,
  ShieldCheck
} from "lucide-react";

// Lista de serviços baseada no seu plano de negócios
const services = [
  {
    icon: LayoutTemplate,
    title: "Landing Pages",
    desc: "Páginas de alta conversão focadas em um único objetivo: transformar visitantes em leads e gerar resultados reais para o seu negócio."
  },
  {
    icon: Globe,
    title: "Sites Institucionais",
    desc: "Apresentações corporativas ágeis e modernas que transmitem autoridade e confiança logo no primeiro segundo de carregamento."
  },
  {
    icon: ImageIcon,
    title: "Portfólios Dinâmicos",
    desc: "Vitrines digitais de carregamento rápido para profissionais que precisam exibir imagens de alta qualidade sem sacrificar a performance."
  },
  {
    icon: ShoppingCart,
    title: "Lojas Virtuais",
    desc: "E-commerces fluidos e otimizados para vendas, garantindo velocidade de navegação e uma experiência de checkout sem atritos."
  },
  {
    icon: Search,
    title: "Otimização SEO",
    desc: "Estruturação técnica avançada em código limpo para que a sua empresa seja encontrada facilmente no topo das buscas do Google."
  },
  {
    icon: ShieldCheck,
    title: "Manutenção Técnica",
    desc: "Monitoramento contínuo, atualizações de segurança e otimização de infraestrutura para garantir estabilidade e velocidade máxima."
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
    <section id="servicos" className="relative py-24 sm:py-32 bg-background border-t border-border/50">
      <div className="container-luxe">

        <div className="max-w-2xl mx-auto text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" as const }}
            className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full border border-blue-500/20 bg-blue-500/5 text-xs font-bold uppercase tracking-widest text-blue-400"
          >
            Nossas Especialidades
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" as const }}
            className="text-3xl sm:text-4xl md:text-5xl font-display uppercase tracking-tight mb-6 text-foreground"
          >
            Engenharia web focada em <span className="text-blue-gradient">Conversão.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" as const }}
            className="text-muted-foreground text-lg"
          >
            A arquitetura ideal para o seu negócio. Estruturas escaláveis dimensionadas para cada fase da sua empresa. Sem taxas ocultas e com foco absoluto em velocidade, performance e resultados concretos.
          </motion.p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {services.map((service, idx) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={idx}
                variants={itemVariants}
                className="group relative p-8 rounded-3xl border border-border bg-card/50 hover:bg-card hover:border-blue-500/40 hover:-translate-y-1 transition-all duration-300"
              >
                {/* Glow subtil que aparece no hover */}
                <div className="absolute inset-0 bg-blue-500/0 group-hover:bg-blue-500/5 rounded-3xl transition-colors duration-300 pointer-events-none" />

                <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-background border border-border group-hover:border-blue-500/50 transition-colors duration-300">
                  <Icon className="h-6 w-6 text-blue-500 group-hover:text-blue-400 transition-colors" />
                </div>

                <h3 className="text-xl font-bold font-display mb-3 text-foreground group-hover:text-blue-400 transition-colors">
                  {service.title}
                </h3>

                <p className="text-sm text-muted-foreground leading-relaxed">
                  {service.desc}
                </p>
              </motion.div>
            );
          })}
        </motion.div>

      </div>
    </section>
  );
}