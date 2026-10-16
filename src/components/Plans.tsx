"use client";

import { motion } from "framer-motion";
import { Check, ArrowRight } from "lucide-react";

const WA_NUMBER = "5554996436023"; // O número definido nas diretrizes

const plans = [
  {
    name: "Starter",
    price: "297,00",
    description: "Ideal para validação rápida e uma presença digital ágil e direta.",
    highlight: false,
    features: [
      "Página única (One Page)",
      "Design 100% responsivo",
      "Alta velocidade de carregamento",
      "Botão flutuante do WhatsApp",
      "Formulário de contato otimizado",
      "Publicação e setup inicial do projeto"
    ],
    buttonText: "Começar agora",
    waMessage: "Olá! Tenho interesse no Plano Starter para iniciar minha presença digital com alta performance."
  },
  {
    name: "Profissional",
    price: "499,00",
    description: "A solução completa para empresas que buscam credibilidade e resultados concretos.",
    highlight: true,
    badge: "Mais Escolhido",
    features: [
      "Todas as vantagens do plano Starter",
      "Layout totalmente personalizado",
      "Configuração de domínio próprio",
      "Otimização SEO para o Google",
      "Arquitetura focada em conversão",
      "Integração com Google Analytics",
      "Suporte técnico dedicado"
    ],
    buttonText: "Quero este plano",
    waMessage: "Olá! Tenho interesse no Plano Profissional para acelerar os resultados da minha empresa."
  },
  {
    name: "Premium",
    price: "1.999,00",
    description: "Estruturas robustas e plataformas web de alta capacidade com foco em escala e vendas.",
    highlight: false,
    features: [
      "Múltiplas páginas de carregamento rápido",
      "E-commerce ou catálogo dinâmico",
      "Integrações avançadas de sistemas (APIs)",
      "Estruturação de métricas e pixels",
      "SEO técnico estrutural",
      "Performance máxima garantida",
      "Manutenção e suporte estendido"
    ],
    buttonText: "Solicitar orçamento",
    waMessage: "Olá! Gostaria de discutir os detalhes de um projeto robusto e sob medida no Plano Premium."
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } }
};

export function Plans() {
  return (
    <section id="planos" className="relative py-24 sm:py-32 bg-background/50">
      <div className="container-luxe">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full border border-blue-500/20 bg-blue-500/5 text-xs font-bold uppercase tracking-widest text-blue-400"
          >
            Investimento
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            className="text-3xl sm:text-4xl md:text-5xl font-display uppercase tracking-tight mb-6"
          >
            Escolha a arquitetura ideal para o <span className="text-blue-gradient">seu negócio.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="text-muted-foreground text-lg"
          >
            Estruturas dimensionadas para cada fase da sua empresa. Sem taxas ocultas, focadas em entregar velocidade e performance desde o primeiro dia.
          </motion.p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-8 items-start"
        >
          {plans.map((plan) => (
            <motion.div
              key={plan.name}
              variants={itemVariants}
              className={`group relative flex flex-col p-8 rounded-3xl border transition-shadow duration-500 hover:shadow-[0_0_40px_-10px_rgba(59,130,246,0.28)] ${plan.highlight
                  ? "border-blue-500/50 bg-card shadow-blue-glow md:-translate-y-4"
                  : "border-border bg-card/50 hover:bg-card hover:border-blue-500/30"
                }`}
            >
              <div className="pointer-events-none absolute inset-0 rounded-3xl bg-blue-500/[0.06] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

              {plan.badge && (
                <div className="absolute -top-4 left-1/2 z-20 -translate-x-1/2 px-4 py-1 bg-blue-gradient rounded-full text-xs font-bold text-white uppercase tracking-wider shadow-blue-glow">
                  {plan.badge}
                </div>
              )}

              <div className="relative z-10 flex flex-1 flex-col">
                <div className="mb-6">
                  <h3 className="text-xl font-bold font-display text-foreground mb-2 transition-colors duration-300 group-hover:text-blue-400">
                    {plan.name}
                  </h3>
                  <p className="text-sm text-muted-foreground h-10">
                    {plan.description}
                  </p>
                </div>

                <div className="mb-8">
                  <span className="text-sm font-bold text-muted-foreground">R$</span>
                  <span className={`text-5xl font-display tracking-tighter transition-colors duration-300 ${plan.highlight ? "text-blue-gradient" : "text-foreground group-hover:text-blue-400"}`}>
                    {plan.price}
                  </span>
                </div>

                <ul className="flex flex-col gap-4 mb-8 flex-1">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm text-foreground/80">
                      <Check className={`w-5 h-5 shrink-0 transition-colors duration-300 ${plan.highlight ? "text-blue-500" : "text-muted-foreground group-hover:text-blue-400"}`} />
                      <span className="leading-tight">{feature}</span>
                    </li>
                  ))}
                </ul>

                <a
                  href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(plan.waMessage)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group flex items-center justify-center gap-2 w-full py-4 rounded-xl font-bold transition-all duration-300 ${plan.highlight
                      ? "bg-blue-gradient text-white shadow-blue-glow hover:scale-[1.02]"
                      : "bg-background border border-border text-foreground hover:border-blue-500/50 hover:text-blue-400"
                    }`}
                >
                  {plan.buttonText}
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </a>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}