"use client";

import { motion } from "framer-motion";
import {
  Check,
  ArrowRight,
  Clock,
  Palette,
  PenTool,
  CalendarCheck2,
  Sparkles,
  FileCheck,
} from "lucide-react";

const WA_NUMBER = "5551993583936";

const designPlans = [
  {
    id: "01",
    tag: "COMUNICAÇÃO SOCIAL",
    name: "Design Starter",
    price: "199,00",
    originalPrice: "249,00",
    promoLabel: "Lançamento · 5 primeiros pacotes",
    deliveryTime: "3 a 5 dias úteis",
    idealFor: "Pequenos negócios e profissionais autônomos",
    description:
      "Eleve o padrão visual do seu perfil e campanhas com peças digitais consistentes, modernas e alinhadas à sua marca.",
    highlight: false,
    icon: Palette,
    deliverablesSummary: ["3 Artes Feed/Stories", "1 Banner Digital", "Guia de Cores & Fontes"],
    features: [
      "Briefing inicial de direção visual",
      "3 artes estratégicas para redes sociais",
      "1 banner digital ou peça promocional de campanha",
      "Definição de paleta de cores e tipografia de referência",
      "Adaptação visual à identidade existente",
      "Arquivos finais em alta resolução (PNG / JPG)",
      "1 rodada completa de ajustes",
    ],
    scope:
      "Indicado para marcas que já possuem logotipo básico. Não inclui criação de marca do zero ou arquivos editáveis abertos.",
    buttonText: "Solicitar Pack Starter",
    waMessage:
      "Olá! Tenho interesse na oferta de lançamento do Design Starter e gostaria de melhorar a apresentação visual do meu negócio.",
  },
  {
    id: "02",
    tag: "IDENTIDADE VISUAL COMPLETA",
    name: "Design Profissional",
    price: "650,00",
    originalPrice: "799,00",
    promoLabel: "Mais Escolhido · 5 primeiros projetos",
    deliveryTime: "5 a 8 dias úteis",
    idealFor: "Marcas em estruturação ou reposicionamento",
    description:
      "Construa uma marca memorável do zero. Criamos seu logotipo vetorial, manual de identidade e kit completo de lançamento digital.",
    highlight: true,
    badge: "Direção de Arte Recomendada",
    icon: PenTool,
    deliverablesSummary: [
      "Logotipo Exclusivo + Vetores",
      "Manual da Marca",
      "5 Artes + 1 Capa Digital",
    ],
    features: [
      "Briefing estratégico e conceito criativo de marca",
      "Criação de logotipo exclusivo com defesa conceitual",
      "Sistema oficial de cores (CMYK, RGB, HEX) e tipografia",
      "Mini manual de identidade visual e aplicação correta",
      "5 artes para redes sociais + 1 capa/banner digital",
      "Entrega de arquivos vetoriais (SVG, PDF, EPS) e PNG transparente",
      "2 rodadas completas de ajustes",
    ],
    scope:
      "Inclui proposta completa de identidade visual e aplicações digitais listadas. Registro no INPI e impressão gráfica física não estão incluídos.",
    buttonText: "Criar minha Identidade Visual",
    waMessage:
      "Olá! Tenho interesse na oferta de lançamento do Design Profissional para desenvolver ou fortalecer a identidade visual da minha marca.",
  },
  {
    id: "03",
    tag: "INTERFACES & EXPERIÊNCIA DO USUÁRIO",
    name: "Design UI/UX Premium",
    price: "1.490,00",
    originalPrice: "1.990,00",
    promoLabel: "Lançamento · 3 primeiros projetos",
    deliveryTime: "Definido conforme o projeto",
    idealFor: "SaaS, Startups, E-commerces e Aplicativos",
    description:
      "Projetamos interfaces de alta conversão com wireframes, protótipo navegável e guia de estilos pronto para implementação.",
    highlight: false,
    icon: CalendarCheck2,
    deliverablesSummary: [
      "Até 3 Telas Principais (Desktop & Mobile)",
      "Wireframes & UI Kit",
      "Protótipo Navegável",
    ],
    features: [
      "Arquitetura da informação e mapeamento de jornada",
      "Wireframes estruturais das páginas principais",
      "Design UI de alta fidelidade (Desktop e Mobile)",
      "Projeto de até 3 páginas ou telas principais do produto",
      "Protótipo interativo navegável para validação",
      "Componentes visuais padronizados (botões, cards, estados)",
      "Entrega organizada para desenvolvedores + 2 rodadas de ajustes",
    ],
    scope:
      "Contempla exclusivamente o projeto visual e de interface (UI/UX). Caso deseje a programação completa, consulte nossos planos Web/Apps.",
    buttonText: "Orçar Projeto UI/UX",
    waMessage:
      "Olá! Tenho interesse na oferta de lançamento do Design Premium para desenvolver o design de um site, landing page ou aplicação web.",
  },
];

export function PlansDG() {
  return (
    <section
      id="planosdg"
      className="relative isolate overflow-hidden py-24 sm:py-32 border-t border-white/[0.06]"
    >
      {/* Glow Editorial Rose/Amber exclusivo para Design */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/3 top-1/4 -z-10 h-[32rem] w-[48rem] -translate-x-1/2 rounded-full bg-rose-500/[0.07] blur-[150px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute right-10 bottom-16 -z-10 h-[26rem] w-[36rem] rounded-full bg-amber-500/[0.06] blur-[140px]"
      />

      <div className="container-luxe">
        {/* Cabeçalho */}
        <div className="mb-16 flex flex-col justify-between gap-6 border-b border-white/10 pb-10 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-rose-400/25 bg-rose-500/10 px-3.5 py-1.5 text-xs font-bold uppercase tracking-widest text-rose-200">
              <Palette className="h-3.5 w-3.5 text-amber-300" />
              Estúdio de Identidade & Direção de Arte
            </div>
            <h2 className="font-display text-3xl font-bold uppercase tracking-tight sm:text-5xl">
              Packs de Design Gráfico{" "}
              <span className="bg-gradient-to-r from-rose-300 via-fuchsia-200 to-amber-200 bg-clip-text text-transparent">
                & UI/UX Design
              </span>
            </h2>
          </div>

          <p className="max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
            Do primeiro logotipo ao protótipo de alta fidelidade: pacotes
            fechados com entregáveis claros para marcas que buscam autoridade
            visual imediata.
          </p>
        </div>

        {/* =========================================================
            LAYOUT HORIZONTAL EDITORIAL (DIFERENTE DE PLANS E APPS)
        ========================================================= */}
        <div className="space-y-6">
          {designPlans.map((plan, index) => {
            const Icon = plan.icon;
            return (
              <motion.article
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`group relative overflow-hidden rounded-[2.2rem] border p-7 transition-all duration-300 sm:p-9 ${
                  plan.highlight
                    ? "border-rose-400/45 bg-gradient-to-r from-rose-500/[0.12] via-[#19101c]/95 to-[#0d0c12]/95 shadow-[0_25px_80px_-25px_rgba(244,63,94,0.3)]"
                    : "border-white/10 bg-[#0c0e14]/85 hover:border-rose-300/30"
                }`}
              >
                {plan.badge && (
                  <div className="mb-6 inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-rose-500 to-amber-500 px-4 py-1 text-[11px] font-black uppercase tracking-wider text-slate-950 shadow-lg">
                    <Sparkles className="h-3 w-3" />
                    {plan.badge}
                  </div>
                )}

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-center">
                  {/* Coluna 1: Identidade do Pack & Resumo Rápido (4 Cols) */}
                  <div className="lg:col-span-4 space-y-4">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-2xl font-black text-rose-400/80">
                        /{plan.id}
                      </span>
                      <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-widest text-rose-200">
                        {plan.tag}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-rose-300/25 bg-rose-400/10 text-rose-200">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-display text-2xl font-bold text-white sm:text-3xl">
                          {plan.name}
                        </h3>
                        <p className="text-xs text-rose-200/75">
                          Para: {plan.idealFor}
                        </p>
                      </div>
                    </div>

                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {plan.description}
                    </p>

                    {/* Pílulas de Entregáveis Chave */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {plan.deliverablesSummary.map((item) => (
                        <span
                          key={item}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-amber-300/20 bg-amber-400/[0.07] px-2.5 py-1 font-mono text-[11px] font-semibold text-amber-200"
                        >
                          <FileCheck className="h-3 w-3 text-amber-300" />
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Coluna 2: Checklist de Direção de Arte (5 Cols) */}
                  <div className="lg:col-span-5 lg:border-x lg:border-white/10 lg:px-8">
                    <p className="mb-3.5 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-white/45">
                      Entregáveis do Pacote:
                    </p>
                    <ul className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-1">
                      {plan.features.map((feat, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2.5 text-xs sm:text-sm text-foreground/85"
                        >
                          <span
                            className={`mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full ${
                              plan.highlight
                                ? "bg-rose-500/25 text-rose-200 border border-rose-400/40"
                                : "bg-white/10 text-white/70"
                            }`}
                          >
                            <Check className="h-2.5 w-2.5" />
                          </span>
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Coluna 3: Investimento & Contratação (3 Cols) */}
                  <div className="lg:col-span-3 flex flex-col justify-between rounded-2xl border border-white/[0.08] bg-black/30 p-5">
                    <div>
                      <span className="block font-mono text-[10px] font-bold uppercase tracking-wider text-amber-300">
                        {plan.promoLabel}
                      </span>

                      <div className="mt-2 flex items-baseline gap-2">
                        <span className="text-sm font-bold text-muted-foreground">
                          R$
                        </span>
                        <span className="font-display text-4xl font-black tracking-tight text-white">
                          {plan.price}
                        </span>
                        {plan.originalPrice && (
                          <del className="text-xs text-muted-foreground/70">
                            R$ {plan.originalPrice}
                          </del>
                        )}
                      </div>

                      <div className="mt-3 flex items-center gap-2 border-t border-white/[0.06] pt-2.5 text-xs text-white/65">
                        <Clock className="h-3.5 w-3.5 text-rose-300" />
                        <span>Entrega: {plan.deliveryTime}</span>
                      </div>

                      <p className="mt-3 text-[11px] leading-relaxed text-white/40">
                        {plan.scope}
                      </p>
                    </div>

                    <a
                      href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(
                        plan.waMessage
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`mt-5 group/btn flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-xs font-black uppercase tracking-wider transition-all ${
                        plan.highlight
                          ? "bg-gradient-to-r from-rose-500 to-amber-500 text-slate-950 shadow-lg hover:scale-[1.02]"
                          : "border border-white/15 bg-white/[0.05] text-white hover:border-rose-300/40 hover:bg-rose-500/20"
                      }`}
                    >
                      <span>{plan.buttonText}</span>
                      <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                    </a>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}