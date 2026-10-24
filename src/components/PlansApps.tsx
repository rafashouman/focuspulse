"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  ArrowRight,
  Clock,
  Cpu,
  CalendarCheck2,
  Database,
  Gamepad2,
  Terminal,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

const WA_NUMBER = "5551993583936";

const appPlans = [
  {
    id: "app-01",
    code: "SYS // BOOKING",
    name: "Agendamentos Online",
    category: "Reservas & Gestão de Horários",
    price: "499,00",
    originalPrice: "699,00",
    promoLabel: "Mais Procurado · 5 vagas promocionais",
    deliveryTime: "7 a 15 dias úteis",
    idealFor: "Clínicas, Barbearias, Estúdios e Consultorias",
    description:
      "Substitua a agenda de papel por uma aplicação web que apresenta seus serviços, recebe reservas 24h por dia e organiza a rotina da sua equipe.",
    highlight: true,
    badge: "Recomendado p/ Serviços",
    icon: CalendarCheck2,
    stack: ["Next.js App Router", "Painel Admin", "Notificação WhatsApp", "Mobile-First"],
    features: [
      "Página de apresentação dos serviços e profissionais",
      "Fluxo de agendamento online passo a passo",
      "Seleção inteligente de serviço, data e horário",
      "Cadastro rápido de clientes",
      "Painel administrativo para gestão da agenda",
      "Visualização e aprovação das solicitações recebidas",
      "Disparo de confirmação rápida via WhatsApp",
      "Interface 100% responsiva (Celular, Tablet e PC)",
      "Configuração inicial, publicação e treinamento",
      "2 rodadas completas de ajustes",
    ],
    scope:
      "O plano básico utiliza solicitações de agendamento estruturadas. Trava atômica em tempo real no Firestore, login social de clientes e pagamentos online podem ser adicionados sob medida.",
    buttonText: "Automatizar meus agendamentos",
    waMessage:
      "Olá! Tenho interesse na oferta de lançamento do sistema de Agendamentos Online. Gostaria de explicar como funciona meu negócio.",
  },
  {
    id: "app-02",
    code: "SYS // ERP-LITE",
    name: "Gestão Web & Dashboards",
    category: "Painéis, PDV & Sistemas Sob Medida",
    price: "1.599,00",
    originalPrice: "1.999,00",
    promoLabel: "Lançamento · 3 primeiros projetos",
    deliveryTime: "Definido conforme escopo",
    idealFor: "Pequenas empresas, Delivery e Operações",
    description:
      "Centralize pedidos, clientes, comandas ou indicadores financeiros em um painel administrativo exclusivo, pensado exatamente para o fluxo da sua empresa.",
    highlight: false,
    badge: "Alta Performance",
    icon: Database,
    stack: ["Firestore Database", "Firebase Auth", "CRUD Completo", "Filtros & Métricas"],
    features: [
      "Aplicação web desenhada para a regra do seu negócio",
      "Painel administrativo privado com login seguro",
      "Cadastro, edição e consulta rápida de registros",
      "Organização de clientes, comandas, pedidos ou tarefas",
      "Busca instantânea, filtros por status e indicadores",
      "Banco de dados em nuvem configurado conforme o escopo",
      "Controle de acesso básico para sua equipe",
      "Interface fluida para operação em balcão ou celular",
      "Publicação, configuração e orientação de uso",
      "2 rodadas completas de ajustes",
    ],
    scope:
      "Inclui um fluxo de trabalho principal e funcionalidades delimitadas no orçamento. Integrações fiscais, múltiplos níveis hierárquicos e relatórios complexos são orçados à parte.",
    buttonText: "Orçar sistema de gestão",
    waMessage:
      "Olá! Tenho interesse no plano Gestão Web. Quero explicar um processo do meu negócio que gostaria de simplificar com um sistema online.",
  },
  {
    id: "app-03",
    code: "EXP // GAMIFICATION",
    name: "Mini Apps & Gamificação",
    category: "Jogos Promocionais & Engajamento",
    price: "349,00",
    originalPrice: "499,00",
    promoLabel: "Lançamento · 5 primeiros projetos",
    deliveryTime: "5 a 10 dias úteis",
    idealFor: "Campanhas de marketing, eventos e captura de leads",
    description:
      "Experiências interativas que rodam direto no navegador para reter a atenção do visitante, distribuir cupons e multiplicar a conversão de campanhas.",
    highlight: false,
    badge: "Ideal p/ Campanhas",
    icon: Gamepad2,
    stack: ["Framer Motion", "HTML5 Canvas", "Lead Capture", "60 FPS UI"],
    features: [
      "Desenvolvimento de 1 mini app ou jogo promocional",
      "Roletas de descontos, quizzes ou desafios de memória",
      "Sistema de pontuação ou resultado personalizado",
      "Identidade visual 100% adaptada à sua campanha",
      "Captura de contato antes ou após a dinâmica",
      "Tela de início, regras claras e chamada para ação",
      "Botão de resgate de prêmio direto no WhatsApp",
      "Design responsivo para ações em redes sociais",
      "Publicação inicial e 1 rodada de ajustes",
    ],
    scope:
      "Inclui uma experiência interativa simples por projeto. Não inclui multiplayer em rede, apostas financeiras ou sorteios regulamentados.",
    buttonText: "Criar meu Mini App interativo",
    waMessage:
      "Olá! Tenho interesse na oferta de lançamento de Mini Apps e Jogos Web. Quero apresentar minha ideia.",
  },
];

export function PlansApps() {
  const [selectedId, setSelectedId] = useState<string>(appPlans[0].id);
  const activePlan =
    appPlans.find((p) => p.id === selectedId) || appPlans[0];
  const ActiveIcon = activePlan.icon;

  return (
    <section
      id="planosapp"
      className="relative isolate overflow-hidden py-24 sm:py-32 border-t border-white/[0.06]"
    >
      {/* Ambient Cyan/Indigo Glow exclusivo para Sistemas */}
      <div
        aria-hidden
        className="pointer-events-none absolute right-1/4 top-1/3 -z-10 h-[34rem] w-[46rem] rounded-full bg-cyan-500/[0.07] blur-[150px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute left-10 bottom-10 -z-10 h-[28rem] w-[36rem] rounded-full bg-indigo-500/[0.08] blur-[140px]"
      />

      <div className="container-luxe">
        {/* Cabeçalho */}
        <div className="mb-14 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-400/25 bg-cyan-400/[0.08] px-3.5 py-1.5 font-mono text-xs font-bold uppercase tracking-widest text-cyan-200">
              <Cpu className="h-3.5 w-3.5 text-cyan-400" />
              Engenharia de Aplicações Web
            </div>

            <h2 className="font-display text-3xl font-bold uppercase tracking-tight sm:text-5xl">
              Seu negócio precisa de mais do que{" "}
              <span className="bg-gradient-to-r from-cyan-300 via-sky-200 to-indigo-300 bg-clip-text text-transparent">
                apenas um site?
              </span>
            </h2>
          </div>

          <p className="max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
            Selecione abaixo a arquitetura de software ideal para automatizar
            reservas, controlar sua operação ou engajar clientes direto pelo
            navegador.
          </p>
        </div>

        {/* =========================================================
            CONSOLE MASTER-DETAIL (DIFERENTE DOS 3 CARDS DE SITE)
        ========================================================= */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-stretch">
          {/* COLUNA ESQUERDA: Seletor de Módulos de Sistema (5 Cols) */}
          <div className="flex flex-col justify-between gap-4 lg:col-span-5">
            <div className="space-y-3.5">
              {appPlans.map((plan) => {
                const Icon = plan.icon;
                const isSelected = plan.id === selectedId;

                return (
                  <button
                    key={plan.id}
                    type="button"
                    onClick={() => setSelectedId(plan.id)}
                    className={`group relative w-full text-left rounded-3xl border p-6 transition-all duration-300 ${
                      isSelected
                        ? "border-cyan-400/50 bg-gradient-to-r from-cyan-500/[0.14] via-[#0e1624] to-[#0b0f19] shadow-[0_20px_60px_-20px_rgba(6,182,212,0.3)]"
                        : "border-white/[0.08] bg-[#0b0e15]/75 hover:border-white/20 hover:bg-white/[0.03]"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3.5">
                        <div
                          className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl border transition-colors ${
                            isSelected
                              ? "border-cyan-400/40 bg-cyan-400/15 text-cyan-300"
                              : "border-white/10 bg-white/[0.04] text-white/60 group-hover:text-white"
                          }`}
                        >
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[10px] uppercase tracking-widest text-cyan-300/80">
                              {plan.code}
                            </span>
                            {plan.badge && (
                              <span
                                className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${
                                  plan.highlight
                                    ? "bg-cyan-400 text-slate-950"
                                    : "border border-white/15 bg-white/5 text-white/70"
                                }`}
                              >
                                {plan.badge}
                              </span>
                            )}
                          </div>
                          <h3 className="mt-1 font-display text-xl font-bold text-white">
                            {plan.name}
                          </h3>
                          <p className="text-xs text-muted-foreground">
                            {plan.category}
                          </p>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="block font-mono text-[10px] uppercase text-white/40">
                          A partir de
                        </span>
                        <span
                          className={`font-display text-2xl font-bold ${
                            isSelected ? "text-cyan-300" : "text-white"
                          }`}
                        >
                          R$ {plan.price}
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Box Técnico de Infraestrutura na Base da Coluna Esquerda */}
            <div className="rounded-3xl border border-white/[0.08] bg-[#090c12]/90 p-5">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-cyan-400/20 bg-cyan-400/10 text-cyan-300">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-white">
                    Infraestrutura Cloud Serverless
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Sistemas construídos em Next.js + Firebase sem necessidade de
                    instalar nada no celular ou computador.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* COLUNA DIREITA: Blueprint Detalhado do Módulo Ativo (7 Cols) */}
          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              <motion.div
                key={activePlan.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.28 }}
                className="relative flex h-full flex-col justify-between overflow-hidden rounded-[2.2rem] border border-cyan-400/30 bg-gradient-to-br from-[#0e1624]/95 via-[#0a0d16]/95 to-[#07090f] p-7 shadow-2xl sm:p-10"
              >
                {/* Barra de Terminal no Topo do Card */}
                <div>
                  <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-5">
                    <div className="flex items-center gap-2.5">
                      <Terminal className="h-4 w-4 text-cyan-400" />
                      <span className="font-mono text-xs font-bold uppercase tracking-widest text-cyan-300">
                        ESPECIFICAÇÃO DE SISTEMA // {activePlan.code}
                      </span>
                    </div>
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 font-mono text-[11px] font-semibold text-cyan-200">
                      <Sparkles className="h-3 w-3" />
                      {activePlan.promoLabel}
                    </span>
                  </div>

                  {/* Cabeçalho e Preço em Linha */}
                  <div className="mb-7 flex flex-col justify-between gap-6 rounded-2xl border border-white/[0.08] bg-black/35 p-6 sm:flex-row sm:items-center">
                    <div className="max-w-md">
                      <span className="text-xs font-semibold uppercase tracking-wider text-cyan-300">
                        Ideal para: {activePlan.idealFor}
                      </span>
                      <h3 className="mt-1 font-display text-3xl font-bold text-white">
                        {activePlan.name}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                        {activePlan.description}
                      </p>
                    </div>

                    <div className="shrink-0 border-t border-white/10 pt-4 sm:border-l sm:border-t-0 sm:pl-6 sm:pt-0 sm:text-right">
                      {activePlan.originalPrice && (
                        <del className="block text-xs text-muted-foreground/70">
                          De R$ {activePlan.originalPrice}
                        </del>
                      )}
                      <div className="flex items-baseline gap-1 sm:justify-end">
                        <span className="text-sm font-bold text-cyan-300">
                          R$
                        </span>
                        <span className="font-display text-4xl font-black tracking-tight text-white sm:text-5xl">
                          {activePlan.price}
                        </span>
                      </div>
                      <div className="mt-2 inline-flex items-center gap-1.5 text-xs text-white/65">
                        <Clock className="h-3.5 w-3.5 text-cyan-400" />
                        <span>Prazo: {activePlan.deliveryTime}</span>
                      </div>
                    </div>
                  </div>

                  {/* Stack Badges */}
                  <div className="mb-6 flex flex-wrap items-center gap-2">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-white/40 mr-1">
                      Arquitetura:
                    </span>
                    {activePlan.stack.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-lg border border-cyan-400/20 bg-cyan-400/[0.06] px-2.5 py-1 font-mono text-[11px] font-semibold text-cyan-200"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Grid de Entregáveis em 2 Colunas */}
                  <p className="mb-4 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-white/45">
                    Módulos & Entregáveis Incluídos:
                  </p>
                  <ul className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {activePlan.features.map((feature, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-2.5 rounded-xl border border-white/[0.05] bg-white/[0.02] p-3 text-xs sm:text-sm text-foreground/90"
                      >
                        <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border border-cyan-400/40 bg-cyan-500/20 text-cyan-200">
                          <Check className="h-3 w-3" />
                        </span>
                        <span className="leading-snug">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Rodapé com Escopo e CTA */}
                <div className="border-t border-white/10 pt-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <p className="text-[11px] leading-relaxed text-white/45 max-w-md">
                    {activePlan.scope}
                  </p>

                  <a
                    href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(
                      activePlan.waMessage
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group/btn shrink-0 inline-flex items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-500 px-7 py-4 text-sm font-black uppercase tracking-wider text-slate-950 shadow-[0_0_30px_rgba(6,182,212,0.35)] transition-all hover:scale-[1.02]"
                  >
                    <ActiveIcon className="h-4 w-4" />
                    <span>{activePlan.buttonText}</span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                  </a>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}