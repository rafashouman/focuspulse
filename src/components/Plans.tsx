"use client";

import { motion } from "framer-motion";
import {
  Check,
  ArrowRight,
  Sparkles,
  Clock,
  ShieldCheck,
  Zap,
  Layers,
} from "lucide-react";

const WA_NUMBER = "5551993583936";


const plans = [
  {
    id: "01",
    name: "Presence",
    price: "297,00",
    originalPrice: "399,00",
    promoLabel: "Lançamento · 5 primeiros projetos",
    deliveryTime: "Entrega estimada: 3 a 5 dias úteis",
    idealFor: "Comece sua presença digital",
    description:
      "Uma solução enxuta e profissional para apresentar seu negócio, divulgar seu trabalho e facilitar o contato com novos clientes.",
    highlight: false,
    features: [
      "Landing pages para divulgação de serviços ou campanhas",
      "Portfólios profissionais",
      "Sites institucionais compactos",
      "Estrutura de até 3 páginas ou seções principais",
      "Design responsivo para celular, tablet e desktop",
      "Botão de contato pelo WhatsApp",
      "Formulário de contato",
      "Configuração básica de SEO",
      "Publicação e configuração inicial do site",
      "1 rodada de ajustes após a apresentação",
    ],
    scope:
      "Ideal para projetos compactos. Funcionalidades adicionais, domínio e hospedagem são orçados separadamente quando aplicável.",
    buttonText: "Quero meu site",
    waMessage:
      "Olá! Tenho interesse na oferta de lançamento do plano Presence para criar meu site profissional.",
  },

  {
    id: "02",
    name: "Pulse",
    price: "499,00",
    originalPrice: "599,00",
    promoLabel: "Lançamento · 5 primeiros projetos",
    deliveryTime: "Entrega estimada: 5 a 10 dias úteis",
    idealFor: "Mais estrutura para seu negócio",
    description:
      "Uma presença digital mais completa para empresas que precisam apresentar seus serviços, organizar produtos e receber pedidos.",
    highlight: true,
    badge: "Plano recomendado",
    features: [
      "Tudo o que está incluído no Presence",
      "Site com múltiplas páginas",
      "Layout personalizado para sua marca",
      "Catálogo de produtos ou serviços",
      "Cardápio ou menu digital",
      "Pedidos de delivery via WhatsApp",
      "Páginas para serviços, produtos e informações",
      "Configuração de domínio próprio",
      "SEO básico para mecanismos de busca",
      "Integração com Google Analytics",
      "Formulários e chamadas para ação estratégicas",
      "2 rodadas de ajustes",
      "Orientação para atualização do conteúdo",
    ],
    scope:
      "Catálogos e menus não incluem automaticamente estoque, checkout, pagamentos online ou gestão de pedidos. Essas funções são avaliadas à parte.",
    buttonText: "Quero o Pulse",
    waMessage:
      "Olá! Tenho interesse na oferta de lançamento do plano Pulse para minha empresa.",
  },

  {
    id: "03",
    name: "Premium",
    price: "1.599,00",
    originalPrice: "1.999,00",
    promoLabel: "Lançamento · 3 primeiros projetos",
    deliveryTime: "Prazo definido após análise do projeto",
    idealFor: "E-commerce e projetos completos",
    description:
      "Uma solução mais completa para negócios que desejam vender pela internet ou precisam de funcionalidades específicas.",
    highlight: false,
    features: [
      "Tudo o que está incluído no Pulse, conforme o escopo",
      "Pequenos e-commerces",
      "Configuração inicial da loja virtual",
      "Cadastro inicial de produtos com limite definido no orçamento",
      "Configuração de categorias e páginas de produto",
      "Integração com meios de pagamento compatíveis",
      "Configuração de frete ou entrega, quando aplicável",
      "Layout adaptado à identidade da marca",
      "Configuração de métricas e eventos de conversão compatíveis",
      "SEO técnico básico",
      "Testes de navegação e compra",
      "Orientação para administrar produtos e pedidos",
      "Cronograma e escopo definidos antes do início",
    ],
    scope:
      "O valor promocional contempla lojas de escopo reduzido e plataforma compatível. Projetos com integrações especiais, grande volume de produtos ou funcionalidades personalizadas recebem orçamento próprio.",
    buttonText: "Solicitar orçamento",
    waMessage:
      "Olá! Quero avaliar o plano Premium para desenvolver meu e-commerce ou projeto web.",
  },
];


const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

export function Plans() {
  return (
    <section
      id="planos"
      className="relative isolate overflow-hidden py-24 sm:py-32"
    >
      {/* Glow Central */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/3 -z-10 h-[36rem] w-[50rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-500/[0.08] blur-[140px]"
      />

      <div className="container-luxe">
        {/* Cabeçalho */}
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-300/20 bg-violet-400/[0.06] px-3.5 py-1.5 text-xs font-bold uppercase tracking-widest text-violet-200"
          >
            <Sparkles className="h-3.5 w-3.5 text-fuchsia-300" />
            Investimento Transparente
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-6 font-display text-3xl uppercase tracking-tight sm:text-4xl md:text-5xl"
          >
            Escolha a arquitetura ideal para o{" "}
            <span className="text-violet-gradient">seu negócio.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-muted-foreground"
          >
            Estruturas dimensionadas para cada fase da sua empresa. Sem taxas
            ocultas, focadas em entregar{" "}
            <span className="font-medium text-violet-100">
              velocidade e performance
            </span>{" "}
            desde o primeiro dia.
          </motion.p>
        </div>

        {/* Cards de Planos */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 items-stretch gap-8 md:grid-cols-3"
        >
          {plans.map((plan) => (
            <motion.div
              key={plan.name}
              variants={itemVariants}
              className={`group relative flex flex-col justify-between rounded-[2rem] border p-8 backdrop-blur-2xl transition-all duration-500 ${plan.highlight
                  ? "border-violet-300/40 bg-gradient-to-b from-violet-500/[0.14] via-[#130e1e]/95 to-[#0b0d13]/95 shadow-[0_25px_80px_-20px_rgba(139,92,246,0.35)] md:-translate-y-4"
                  : "border-white/[0.09] bg-[#0c0e14]/80 hover:-translate-y-1.5 hover:border-violet-300/25 hover:bg-white/[0.04]"
                }`}
            >
              {/* Linha Superior Brilhante no Plano Destaque */}
              {plan.highlight && (
                <div
                  aria-hidden
                  className="absolute inset-x-10 top-0 h-[2px] bg-gradient-to-r from-transparent via-fuchsia-300 to-transparent"
                />
              )}

              {plan.badge && (
                <div className="absolute -top-4 left-1/2 z-20 inline-flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-violet-gradient px-4 py-1 text-xs font-bold uppercase tracking-wider text-white shadow-violet-glow">
                  <Sparkles className="h-3 w-3" />
                  {plan.badge}
                </div>
              )}

              <div className="relative z-10 flex flex-1 flex-col">
                {/* Topo: Categoria e Número */}
                <div className="mb-5 flex items-center justify-between">
                  <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 font-mono text-[10px] uppercase tracking-[0.15em] text-violet-200">
                    {plan.idealFor}
                  </span>
                  <span className="font-mono text-xs text-white/30">
                    /{plan.id}
                  </span>
                </div>

                {/* Nome e Descrição */}
                <div className="mb-6">
                  <h3 className="font-display text-2xl font-bold text-foreground transition-colors duration-300 group-hover:text-violet-200">
                    {plan.name}
                  </h3>
                  <p className="mt-2 min-h-[40px] text-sm leading-relaxed text-muted-foreground">
                    {plan.description}
                  </p>
                </div>

                {/* Box de Preço */}
                <div className="mb-6 rounded-2xl border border-white/[0.07] bg-black/25 p-5">
                  {plan.promoLabel && (
                    <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-fuchsia-200">
                      {plan.promoLabel}
                    </p>
                  )}
                  <div className="flex flex-wrap items-end gap-x-3 gap-y-1">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-sm font-bold text-muted-foreground">
                        R$
                      </span>
                      <span
                        className={`font-display text-5xl font-semibold tracking-tighter ${plan.highlight
                            ? "text-violet-gradient"
                            : "text-foreground group-hover:text-violet-100"
                          }`}
                      >
                        {plan.price}
                      </span>
                    </div>
                    {plan.originalPrice && (
                      <del className="text-sm text-muted-foreground/70 decoration-white/50">
                        De R$ {plan.originalPrice}
                      </del>
                    )}
                  </div>
                  <div className="mt-3 flex items-center gap-2 border-t border-white/[0.06] pt-2.5 text-xs text-white/60">
                    <Clock className="h-3.5 w-3.5 text-violet-300" />
                    <span>{plan.deliveryTime}</span>
                  </div>
                </div>

                {/* Lista de Entregáveis */}
                <p className="mb-4 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-white/40">
                  O que está incluído:
                </p>
                <ul className="mb-8 flex flex-1 flex-col gap-3.5">
                  {plan.features.map((feature, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-3 text-sm text-foreground/85"
                    >
                      <span
                        className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border ${plan.highlight
                            ? "border-violet-400/40 bg-violet-500/20 text-violet-200"
                            : "border-white/10 bg-white/5 text-muted-foreground group-hover:border-violet-300/30 group-hover:text-violet-200"
                          }`}
                      >
                        <Check className="h-3 w-3" />
                      </span>
                      <span className="leading-snug">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Botão de Ação */}
                <a
                  href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(
                    plan.waMessage
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group/btn flex w-full items-center justify-center gap-2 rounded-xl py-4 text-sm font-bold transition-all duration-300 ${plan.highlight
                      ? "bg-violet-gradient text-white shadow-violet-glow hover:scale-[1.02]"
                      : "border border-white/15 bg-white/[0.04] text-foreground hover:border-violet-300/40 hover:bg-violet-500/15 hover:text-white"
                    }`}
                >
                  {plan.buttonText}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                </a>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Barra Inferior de Garantias Técnicas */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-12 grid grid-cols-1 gap-4 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 backdrop-blur-xl sm:grid-cols-3"
        >
          <div className="flex items-center gap-3.5">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-violet-300/20 bg-violet-400/10 text-violet-200">
              <Zap className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">
                Performance Extrema
              </p>
              <p className="text-xs text-muted-foreground">
                Arquitetura Next.js otimizada para Core Web Vitals
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-violet-300/20 bg-violet-400/10 text-violet-200">
              <Layers className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">
                Design Exclusivo & Responsivo
              </p>
              <p className="text-xs text-muted-foreground">
                Interfaces fluidas no mobile, tablet e desktop
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-violet-300/20 bg-violet-400/10 text-violet-200">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">
                Suporte Próximo pelo WhatsApp
              </p>
              <p className="text-xs text-muted-foreground">
                Acompanhamento direto do briefing ao lançamento
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}