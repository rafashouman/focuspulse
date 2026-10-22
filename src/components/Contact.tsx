"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Mail,
  Phone,
  Globe2,
  Sparkles,
  Check,
  Copy,
  MessageSquare,
} from "lucide-react";
import { saveContactRequest } from "@/lib/firebase";

const WA_NUMBER = "5551993583936";

const PROJECT_TYPES = [
  "Landing Page",
  "Site Institucional",
  "E-commerce / Catálogo",
  "Redesign UX/UI",
  "Projeto Sob Medida",
];

const PLAN_OPTIONS = [
  "Starter (R$ 297)",
  "Profissional (R$ 499)",
  "Premium (R$ 1.999)",
  "Ainda não sei",
];

export function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedType, setSelectedType] = useState<string>("Landing Page");
  const [selectedPlan, setSelectedPlan] = useState<string>("Profissional (R$ 499)");
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");

  const handleCopyEmail = (e: React.MouseEvent) => {
    e.preventDefault();
    navigator.clipboard.writeText("contato@focuspulse.site");
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage("");

    const formData = new FormData(e.currentTarget);
    const name = String(formData.get("nome") ?? "").trim();
    const company = String(formData.get("empresa") ?? "").trim();
    const message = String(formData.get("mensagem") ?? "").trim();

    const text = [
      `Olá! Sou *${name}*, da empresa *${company}*.`,
      `• *Interesse:* ${selectedType}`,
      `• *Plano de referência:* ${selectedPlan}`,
      `• *Detalhes:* ${message}`,
    ].join("\n");

    const waUrl = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`;
    window.open(waUrl, "_blank");

    try {
      await saveContactRequest({
        name,
        company,
        message,
        projectType: selectedType,
        plan: selectedPlan,
        route: window.location.pathname,
      });
      setSubmitMessage(
        "Solicitação registrada. O WhatsApp foi aberto para você enviar o briefing."
      );
    } catch (error) {
      console.error("Unable to save the contact request in Firebase.", error);
      setSubmitMessage(
        "O WhatsApp foi aberto, mas não conseguimos registrar a solicitação. Envie sua mensagem por lá ou tente novamente."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="contato"
      className="relative overflow-hidden bg-background py-24 sm:py-32"
    >
      {/* Glow de fundo */}
      <div
        aria-hidden
        className="pointer-events-none absolute right-0 top-0 h-[600px] w-[600px] -translate-y-12 translate-x-1/3 rounded-full bg-violet-500/10 blur-[130px]"
      />

      <div className="container-luxe relative z-10">
        <div className="grid min-w-0 grid-cols-1 items-start gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
          {/* Coluna da Esquerda: Configurador + Formulário */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="min-w-0 rounded-[2rem] border border-white/[0.09] bg-[#0c0e14]/80 p-7 shadow-2xl backdrop-blur-2xl sm:p-10"
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-300/20 bg-violet-400/[0.06] px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-violet-200">
              <Sparkles className="h-3.5 w-3.5 text-fuchsia-300" />
              Iniciar Projeto
            </div>

            <h2 className="mb-4 font-display text-[clamp(1.5rem,7.5vw,3rem)] uppercase tracking-tight sm:text-4xl md:text-5xl">
              Pronto para acelerar os seus{" "}
              <span className="text-violet-gradient">Resultados?</span>
            </h2>
            <p className="mb-8 text-base text-muted-foreground sm:text-lg">
              Personalize seu briefing em segundos e fale diretamente com nossa
              equipe no WhatsApp.{" "}
              <span className="font-medium text-violet-100">
                Retornaremos rapidamente
              </span>{" "}
              com a melhor solução.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Seletor Interativo 1: Tipo de Projeto */}
              <div className="space-y-2.5">
                <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  1. O que vamos construir?
                </label>
                <div className="flex flex-wrap gap-2">
                  {PROJECT_TYPES.map((type) => {
                    const active = selectedType === type;
                    return (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setSelectedType(type)}
                        className={`rounded-xl border px-3.5 py-2 text-xs font-semibold transition-all ${
                          active
                            ? "border-violet-300/50 bg-violet-500/25 text-white shadow-sm shadow-violet-500/20"
                            : "border-white/10 bg-white/[0.03] text-white/60 hover:border-white/25 hover:text-white"
                        }`}
                      >
                        {type}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Seletor Interativo 2: Plano de Referência */}
              <div className="space-y-2.5">
                <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  2. Plano de referência
                </label>
                <div className="flex flex-wrap gap-2">
                  {PLAN_OPTIONS.map((plan) => {
                    const active = selectedPlan === plan;
                    return (
                      <button
                        key={plan}
                        type="button"
                        onClick={() => setSelectedPlan(plan)}
                        className={`rounded-xl border px-3.5 py-2 text-xs font-semibold transition-all ${
                          active
                            ? "border-fuchsia-300/50 bg-fuchsia-500/20 text-white"
                            : "border-white/10 bg-white/[0.03] text-white/60 hover:border-white/25 hover:text-white"
                        }`}
                      >
                        {plan}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Campos Nome & Empresa */}
              <div className="grid gap-5 pt-2 sm:grid-cols-2">
                <div className="space-y-2">
                  <label
                    htmlFor="nome"
                    className="text-xs font-bold uppercase tracking-widest text-muted-foreground"
                  >
                    Seu Nome
                  </label>
                  <input
                    id="nome"
                    name="nome"
                    type="text"
                    required
                    maxLength={100}
                    className="w-full rounded-xl border border-white/10 bg-white/[0.035] px-4 py-3.5 text-foreground backdrop-blur-xl transition-all focus:border-violet-300/50 focus:outline-none focus:ring-1 focus:ring-violet-300/30"
                    placeholder="Como podemos te chamar?"
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="empresa"
                    className="text-xs font-bold uppercase tracking-widest text-muted-foreground"
                  >
                    Empresa ou Marca
                  </label>
                  <input
                    id="empresa"
                    name="empresa"
                    type="text"
                    required
                    maxLength={120}
                    className="w-full rounded-xl border border-white/10 bg-white/[0.035] px-4 py-3.5 text-foreground backdrop-blur-xl transition-all focus:border-violet-300/50 focus:outline-none focus:ring-1 focus:ring-violet-300/30"
                    placeholder="Nome do seu negócio"
                  />
                </div>
              </div>

              {/* Campo Mensagem */}
              <div className="space-y-2">
                <label
                  htmlFor="mensagem"
                  className="text-xs font-bold uppercase tracking-widest text-muted-foreground"
                >
                  Objetivos do Projeto
                </label>
                <textarea
                  id="mensagem"
                  name="mensagem"
                  required
                  maxLength={1500}
                  rows={3}
                  className="w-full resize-none rounded-xl border border-white/10 bg-white/[0.035] px-4 py-3.5 text-foreground backdrop-blur-xl transition-all focus:border-violet-300/50 focus:outline-none focus:ring-1 focus:ring-violet-300/30"
                  placeholder="Conte-nos brevemente sobre seu público, prazos ou referências..."
                />
              </div>

              <label className="flex items-start gap-3 text-xs leading-relaxed text-muted-foreground">
                <input
                  type="checkbox"
                  name="consentimento"
                  required
                  className="mt-0.5 h-4 w-4 shrink-0 accent-violet-400"
                />
                <span>
                  Autorizo o uso destes dados para responder ao meu pedido,
                  conforme o{" "}
                  <Link
                    href="/privacidade"
                    className="font-semibold text-violet-200 underline-offset-4 hover:underline"
                  >
                    Aviso de Privacidade
                  </Link>
                  .
                </span>
              </label>

              <button
                type="submit"
                disabled={isSubmitting}
                className="group inline-flex w-full items-center justify-center gap-3 rounded-xl bg-violet-gradient px-8 py-4 font-bold text-white shadow-violet-glow transition-transform hover:scale-[1.015] sm:w-auto"
              >
                <MessageSquare className="h-4 w-4" />
                Enviar Briefing para o WhatsApp
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
              {submitMessage && (
                <p
                  role="status"
                  className="text-sm leading-relaxed text-violet-100"
                >
                  {submitMessage}
                </p>
              )}
            </form>
          </motion.div>

          {/* Coluna da Direita: Painel de Atendimento & Etapas */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="flex min-w-0 flex-col gap-6"
          >
            {/* Card de Status Online + Contatos Diretos */}
            <div className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-5 backdrop-blur-xl sm:p-8 lg:p-9">
              <div className="mb-6 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h3 className="font-display text-2xl font-bold text-foreground">
                  Contato Direto
                </h3>
                <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/25 bg-emerald-500/10 px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-wider text-emerald-300">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                  Disponível agora
                </span>
              </div>

              <div className="space-y-4">
                <a
                  href={`https://wa.me/${WA_NUMBER}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.025] p-3 transition-all hover:border-violet-300/30 hover:bg-white/[0.05] sm:gap-4 sm:p-4"
                >
                  <div className="flex min-w-0 items-center gap-3 sm:gap-4">
                    <div className="rounded-xl bg-violet-300/10 p-3 text-violet-200 transition-colors group-hover:bg-violet-500 group-hover:text-white">
                      <Phone className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="mb-0.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                        WhatsApp Comercial
                      </p>
                      <p className="font-medium text-foreground">
                        (51) 99358-3936
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-white/30 transition-transform group-hover:translate-x-1 group-hover:text-violet-200" />
                </a>

                <div className="group flex flex-col gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.025] p-3 transition-all hover:border-violet-300/30 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:p-4">
                  <a
                    href="mailto:contato@focuspulse.site"
                    className="flex min-w-0 items-center gap-3 sm:flex-1 sm:gap-4"
                  >
                    <div className="rounded-xl bg-violet-300/10 p-3 text-violet-200 transition-colors group-hover:bg-violet-500 group-hover:text-white">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="mb-0.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                        E-mail Oficial
                      </p>
                      <p className="break-words font-medium text-foreground">
                        contato@focuspulse.site
                      </p>
                    </div>
                  </a>
                  <button
                    type="button"
                    onClick={handleCopyEmail}
                    className="inline-flex self-start items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 font-mono text-[10px] text-white/70 transition-colors hover:border-violet-300/40 hover:text-white sm:self-auto"
                    title="Copiar e-mail"
                  >
                    {copiedEmail ? (
                      <>
                        <Check className="h-3 w-3 text-emerald-400" />
                        Copiado
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3" />
                        Copiar
                      </>
                    )}
                  </button>
                </div>

                <div className="flex items-center gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.025] p-3 sm:gap-4 sm:p-4">
                  <div className="rounded-xl bg-violet-300/10 p-3 text-violet-200">
                    <Globe2 className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="mb-0.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                      Operação Digital
                    </p>
                    <p className="font-medium text-foreground">
                      100% Remoto para todo o Brasil
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Mini Card: Como funciona nosso processo */}
            <div className="rounded-[2rem] border border-violet-300/15 bg-gradient-to-br from-violet-500/10 via-[#130e1c]/90 to-[#0c0e14] p-7 backdrop-blur-xl">
              <p className="mb-4 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-violet-200">
                Próximos Passos
              </p>
              <ol className="space-y-3 text-sm text-white/75">
                <li className="flex items-center gap-3">
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full border border-violet-300/30 bg-violet-400/10 font-mono text-[10px] text-violet-200">
                    01
                  </span>
                  <span>Alinhamento rápido de objetivos pelo WhatsApp</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full border border-violet-300/30 bg-violet-400/10 font-mono text-[10px] text-violet-200">
                    02
                  </span>
                  <span>Definição de arquitetura visual e cronograma</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full border border-violet-300/30 bg-violet-400/10 font-mono text-[10px] text-violet-200">
                    03
                  </span>
                  <span>Desenvolvimento ágil e publicação assistida</span>
                </li>
              </ol>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}