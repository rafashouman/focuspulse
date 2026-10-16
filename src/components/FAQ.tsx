"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

// Perguntas baseadas no seu briefing, com foco em profissionalismo e transparência
const faqs = [
  {
    q: "Quanto tempo demora para a plataforma ficar pronta?",
    a: "Os projetos Starter são entregues de forma acelerada. Os planos Profissional e Premium levam em média de 1 a 2 semanas, dependendo da complexidade das integrações e da agilidade nas aprovações de design. Nosso foco é colocar sua empresa no ar rapidamente, sem sacrificar a qualidade estrutural."
  },
  {
    q: "Posso utilizar o meu próprio domínio (ex: minhaempresa.com.br)?",
    a: "Com certeza. Nos planos Profissional e Premium, cuidamos de todo o apontamento de DNS e configuração do seu domínio próprio, garantindo que o seu negócio transmita o máximo de profissionalismo e credibilidade."
  },
  {
    q: "A plataforma funciona bem em dispositivos móveis?",
    a: "Sim. Todo o nosso desenvolvimento segue a arquitetura 'Mobile-First'. A sua plataforma será altamente otimizada, responsiva e rápida, garantindo fluidez e velocidade de carregamento independentemente de ser acessada via smartphone, tablet ou desktop."
  },
  {
    q: "Oferecem suporte e manutenção pós-entrega?",
    a: "Sim, criamos parcerias de longo prazo. Oferecemos pacotes de manutenção mensal para garantir que a sua plataforma permaneça segura, atualizada e operando sempre com performance máxima."
  },
  {
    q: "Posso solicitar alterações durante o desenvolvimento?",
    a: "Sim. O nosso processo é transparente. Estabelecemos etapas claras de validação para que você possa revisar e aprovar o layout antes de iniciarmos a fase final de engenharia e otimização de código."
  },
  {
    q: "Vocês também desenvolvem lojas virtuais?",
    a: "Sim. Construímos estruturas de e-commerce e catálogos dinâmicos com foco absoluto na fluidez da experiência do usuário (UX) e em conversões rápidas, ideais para projetos no plano Premium."
  },
  {
    q: "Como funciona a estrutura de pagamentos?",
    a: "Trabalhamos de forma transparente e estruturada: um sinal para reserva da vaga na nossa agenda de desenvolvimento e início do projeto, e o saldo restante liquidado apenas no momento da aprovação e publicação final da plataforma."
  }
];

export function FAQ() {
  // Estado para controlar qual pergunta está aberta (null = nenhuma)
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="relative py-24 sm:py-32 bg-background border-t border-border">
      <div className="container-luxe">
        <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-12 lg:gap-16 items-start">

          {/* Coluna da Esquerda: Textos de ancoragem */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" as const }}
            className="sticky top-32"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full border border-blue-500/20 bg-blue-500/5 text-xs font-bold uppercase tracking-widest text-blue-400">
              Perguntas Frequentes
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-display uppercase tracking-tight mb-6 text-foreground">
              Transparência em<br />
              <span className="text-blue-gradient">Cada Etapa.</span>
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Transparência do início ao fim. Respostas diretas sobre prazos, tecnologias e o nosso processo de desenvolvimento. Garantimos alinhamento e previsibilidade antes mesmo de iniciar o seu projeto.
            </p>
          </motion.div>

          {/* Coluna da Direita: Accordion */}
          <div className="flex flex-col gap-4">
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index;

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1, ease: "easeOut" as const }}
                  className={`border rounded-2xl overflow-hidden transition-colors duration-300 ${isOpen ? "border-blue-500/50 bg-card/80 shadow-blue-glow" : "border-border bg-card/30 hover:bg-card/60 hover:border-blue-500/30"
                    }`}
                >
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    className="flex items-center justify-between w-full p-6 text-left focus:outline-none"
                  >
                    <span className="font-bold font-display text-foreground pr-4">
                      {faq.q}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180 text-blue-400" : "text-muted-foreground"
                        }`}
                    />
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" as const }}
                      >
                        <div className="px-6 pb-6 text-sm text-muted-foreground leading-relaxed border-t border-border/50 pt-4 mt-2">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
}