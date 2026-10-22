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



const appPlans = [
  {
    id: "app-01",
    name: "Mini Apps",
    category: "Jogos & Experiências Interativas",
    price: "349,00",
    originalPrice: "499,00",
    promoLabel: "Lançamento · 5 primeiros projetos",
    deliveryTime: "Entrega estimada: 5 a 10 dias úteis",
    idealFor: "Campanhas, jogos e engajamento",
    description:
      "Experiências interativas que funcionam no navegador para divertir, engajar visitantes e criar campanhas digitais memoráveis.",
    highlight: false,
    features: [
      "Desenvolvimento de um mini app ou jogo simples",
      "Quizzes e testes interativos",
      "Jogos de memória ou desafios de pontuação",
      "Roletas promocionais com regras definidas",
      "Interface personalizada para sua marca",
      "Design responsivo para celular e desktop",
      "Tela de início, instruções e resultado",
      "Botões de compartilhamento ou contato",
      "Publicação e configuração inicial",
      "1 rodada de ajustes",
    ],
    scope:
      "Inclui uma experiência simples por projeto. Não inclui multiplayer, sistemas de apostas, prêmios com sorteios regulamentados, pagamentos ou backend complexo.",
    buttonText: "Criar meu Mini App",
    waMessage:
      "Olá! Tenho interesse na oferta de lançamento de Mini Apps e Jogos Web. Quero apresentar minha ideia.",
  },

  {
    id: "app-02",
    name: "Agendamentos",
    category: "Reservas & Gestão de Horários",
    price: "499,00",
    originalPrice: "699,00",
    promoLabel: "Lançamento · 5 primeiros projetos",
    deliveryTime: "Entrega estimada: 7 a 15 dias úteis",
    idealFor: "Autônomos e pequenos negócios",
    description:
      "Simplifique sua rotina com uma aplicação web para apresentar serviços, receber solicitações de agendamento e organizar horários.",
    highlight: true,
    badge: "Mais recomendado",
    features: [
      "Página de apresentação dos serviços",
      "Formulário de agendamento online",
      "Seleção de serviço, data e horário",
      "Cadastro de clientes",
      "Painel administrativo básico",
      "Visualização das solicitações recebidas",
      "Confirmação de agendamento por WhatsApp",
      "Interface responsiva",
      "Configuração inicial e publicação",
      "Orientação para utilização",
      "2 rodadas de ajustes",
    ],
    scope:
      "O plano básico pode utilizar solicitações de agendamento sem sincronização automática. Disponibilidade em tempo real, login de clientes, lembretes automáticos, pagamentos e integração com calendários são orçados conforme a complexidade.",
    buttonText: "Quero automatizar meus horários",
    waMessage:
      "Olá! Tenho interesse na oferta de lançamento do sistema de Agendamentos Online. Gostaria de explicar como funciona meu negócio.",
  },

  {
    id: "app-03",
    name: "Gestão Web",
    category: "Painéis & Sistemas Simplificados",
    price: "1.599,00",
    originalPrice: "1.999,00",
    promoLabel: "Lançamento · 3 primeiros projetos",
    deliveryTime: "Cronograma definido após análise",
    idealFor: "Pequenas empresas e equipes",
    description:
      "Centralize informações e organize processos do dia a dia com um sistema web enxuto, desenvolvido para uma necessidade específica do seu negócio.",
    highlight: false,
    features: [
      "Aplicação web com finalidade definida",
      "Painel administrativo personalizado",
      "Cadastro e consulta de registros",
      "Organização de clientes, pedidos ou tarefas",
      "Busca, filtros e visualização de informações",
      "Formulários de inclusão e edição",
      "Banco de dados conforme o escopo",
      "Interface responsiva",
      "Controle de acesso básico, quando incluído",
      "Publicação e configuração inicial",
      "Orientação para utilização",
      "2 rodadas de ajustes",
    ],
    scope:
      "Inclui um fluxo de trabalho principal e funcionalidades delimitadas no orçamento. Automações complexas, múltiplos perfis de acesso, integrações externas e relatórios avançados podem exigir orçamento adicional.",
    buttonText: "Apresentar meu projeto",
    waMessage:
      "Olá! Tenho interesse no plano Gestão Web. Quero explicar um processo do meu negócio que gostaria de simplificar com um sistema online.",
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

export function PlansApps() {
  return (
    <section
      id="planosapp"
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
            Seu negócio precisa de mais do que {" "}
            <span className="text-violet-gradient">um site?</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-muted-foreground"
          >
            Desenvolvemos aplicações web sob medida para simplificar tarefas, automatizar processos e criar experiências interativas. {" "}
            <span className="font-medium text-violet-100">
              Da primeira ideia a uma ferramenta funcional, {" "}
            </span>{" "}
             acessível diretamente pelo navegador.{" "}
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
          {appPlans.map((plan) => (
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