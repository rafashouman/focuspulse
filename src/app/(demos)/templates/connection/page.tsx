"use client";

import Link from "next/link";
import React, { useMemo, useState } from "react";
import { drawReadingCards, generateReadingForUser } from "@/lib/hotsites/tarot-site-engine";
import { readLastDraw, rememberDraw } from "@/lib/hotsites/tarot-draw-history";
import { downloadTarotReadingPdf } from "@/lib/hotsites/tarot-pdf";
import { saveTarotLead } from "@/lib/firebase";
import TarotCardVisual from "@/components/hotsites/TarotCardVisual";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, 
  ArrowRight, 
  Lock, 
  Unlock, 
  FileDown, 
  MessageCircle, 
  ExternalLink, 
  RotateCcw,
  Eye,
  Compass,
  Flame
} from "lucide-react";

// --- DADOS MOCKADOS DOS MONTES E CARTAS ---
const DECKS = [
  {
    id: "obsidian",
    title: "Monte I • O Véu de Obsidiana",
    subtitle: "Foco em cortes necessários, verdades ocultas e decisões racionais.",
    accent: "from-amber-500/20 to-transparent",
    borderHover: "hover:border-amber-400/60",
    icon: Eye,
  },
  {
    id: "mercury",
    title: "Monte II • O Espelho de Mercúrio",
    subtitle: "Foco em transições rápidas, caminhos abertos e sincronicidades.",
    accent: "from-rose-500/20 to-transparent",
    borderHover: "hover:border-rose-400/60",
    icon: Compass,
  },
  {
    id: "gold",
    title: "Monte III • A Chave de Âmbar",
    subtitle: "Foco em construção, magnetismo pessoal e colheita de longo prazo.",
    accent: "from-yellow-500/20 to-transparent",
    borderHover: "hover:border-yellow-300/60",
    icon: Flame,
  },
];

const PRESET_QUESTIONS = [
  "Qual é o principal bloqueio invisível no meu caminho atual?",
  "Devo investir minha energia neste novo projeto ou mudança?",
  "O que preciso enxergar sobre minha vida afetiva neste momento?",
  "Qual será o desfecho mais provável se eu mantiver minha decisão atual?",
];

const WHATSAPP_NUMBER = "5551999999999";

export default function TarotLeadHotsite() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedDeck, setSelectedDeck] = useState<string | null>(null);
  const [question, setQuestion] = useState<string>("");
  const [drawnCardIds, setDrawnCardIds] = useState<string[] | null>(null);
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState<boolean>(false);
  const [pdfError, setPdfError] = useState<string>("");
  const [leadError, setLeadError] = useState<string>("");
  const [hasLeadConsent, setHasLeadConsent] = useState<boolean>(false);

  // Dados do Lead
  const [name, setName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");

  const generatedReading = useMemo(() => {
    if (!selectedDeck || !question.trim() || !drawnCardIds) return null;
    return generateReadingForUser(selectedDeck, question, drawnCardIds);
  }, [selectedDeck, question, drawnCardIds]);

  const selectedDeckTitle = DECKS.find((d) => d.id === selectedDeck)?.title ?? "";

  const handleSelectDeck = (id: string) => {
    setSelectedDeck(id);
    setTimeout(() => setStep(2), 350);
  };

  const handleStartReading = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDeck || !question.trim()) return;

    // Embaralha só aqui (no evento), evitando as cartas da última leitura deste monte.
    const drawn = drawReadingCards(selectedDeck, { avoidIds: readLastDraw(selectedDeck) });
    rememberDraw(selectedDeck, drawn);
    setDrawnCardIds(drawn);
    setStep(3);
  };

  const handleUnlockReading = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !name.trim() ||
      !whatsapp.trim() ||
      !selectedDeck ||
      !generatedReading ||
      !hasLeadConsent
    ) {
      return;
    }

    setLeadError("");
    setIsSubmitting(true);
    try {
      await saveTarotLead({
        name,
        whatsapp,
        chosenDeck: selectedDeck,
        question,
        drawnCards: generatedReading.cards.map((card) => card.name),
        consent: true,
      });
      setIsUnlocked(true);
    } catch (error) {
      console.error("Erro ao salvar o lead da leitura de tarot:", error);
      setLeadError(
        "Não foi possível registrar seus dados e liberar a leitura. Confira sua conexão e tente novamente."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const buildWhatsAppUrl = () => {
    const drawnNames = generatedReading?.cards.map((card) => card.title).join(", ");
    const text = encodeURIComponent(
      `Olá! Acabei de fazer minha tiragem no site.\n\n*Meu Monte:* ${selectedDeckTitle}${
        drawnNames ? `\n*Minhas Cartas:* ${drawnNames}` : ""
      }\n*Minha Pergunta:* "${question}"\n\nGostaria de aprofundar minha leitura!`
    );
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
  };

  const handleWhatsAppRedirect = () => {
    window.open(buildWhatsAppUrl(), "_blank");
  };

  const handleDownloadPdf = async () => {
    if (!generatedReading || isGeneratingPdf) return;

    setPdfError("");
    setIsGeneratingPdf(true);
    try {
      await downloadTarotReadingPdf({
        name,
        question,
        deckTitle: selectedDeckTitle,
        reading: generatedReading,
        whatsappUrl: buildWhatsAppUrl(),
      });
    } catch (error) {
      console.error("Erro ao gerar o PDF da leitura:", error);
      setPdfError("Não foi possível gerar o PDF agora. Tente novamente em instantes.");
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#070709] text-[#F4F1EA] selection:bg-amber-500/30 selection:text-amber-200 font-sans overflow-x-hidden relative">
      {/* Glow Ambiental Sutil */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-amber-500/5 blur-[140px] rounded-full" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[300px] bg-rose-900/10 blur-[130px] rounded-full" />
      </div>

      {/* Header Minimalista */}
      <header className="relative z-10 border-b border-white/5 bg-[#070709]/80 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-2.5 h-2.5 rotate-45 bg-amber-400 shadow-[0_0_12px_#f59e0b]" />
            <span className="text-xs uppercase tracking-[0.25em] text-zinc-300 font-medium">
              Oráculo • Tiragem Direcionada
            </span>
          </div>

          {/* Indicador de Progresso */}
          <div className="flex items-center gap-2 text-xs text-zinc-500">
            <span className={step >= 1 ? "text-amber-400 font-medium" : ""}>01. Monte</span>
            <span>/</span>
            <span className={step >= 2 ? "text-amber-400 font-medium" : ""}>02. Intenção</span>
            <span>/</span>
            <span className={step === 3 ? "text-amber-400 font-medium" : ""}>03. Revelação</span>
          </div>
        </div>
      </header>

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-12 md:py-20">
        <AnimatePresence mode="wait">
          {/* ================= PASSO 1: ESCOLHA DO MONTE ================= */}
          {step === 1 && (
            <motion.section
              key="step1"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.4 }}
              className="space-y-12"
            >
              <div className="max-w-2xl mx-auto text-center space-y-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] uppercase tracking-[0.2em] bg-amber-500/10 text-amber-300 border border-amber-500/20">
                  <Sparkles className="w-3 h-3" /> Sincronicidade Ativa
                </span>
                <h1 className="text-3xl md:text-5xl font-light tracking-tight text-white leading-tight">
                  Respire fundo. Qual dos três montes chama a sua atenção agora?
                </h1>
                <p className="text-zinc-400 text-sm md:text-base">
                  Não tente racionalizar. Escolha pela primeira impressão visual para destravar sua leitura personalizada de 3 cartas.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                {DECKS.map((deck, idx) => {
                  const Icon = deck.icon;
                  return (
                    <motion.button
                      key={deck.id}
                      whileHover={{ y: -8 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleSelectDeck(deck.id)}
                      className={`group relative text-left rounded-2xl p-7 bg-[#111116] border border-white/10 ${deck.borderHover} transition-all duration-300 flex flex-col justify-between min-h-[340px] overflow-hidden shadow-2xl`}
                    >
                      {/* Gradiente Interno */}
                      <div
                        className={`absolute inset-0 bg-gradient-to-b ${deck.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                      />

                      {/* Ilustração Visual de Cartas Empilhadas */}
                      <div className="relative z-10 my-auto flex justify-center py-6">
                        <div className="relative w-28 h-40">
                          <div className="absolute inset-0 rounded-xl bg-zinc-900 border border-white/10 rotate-[-8deg] translate-x-[-6px] group-hover:rotate-[-14deg] group-hover:translate-x-[-12px] transition-transform duration-500" />
                          <div className="absolute inset-0 rounded-xl bg-zinc-900 border border-white/15 rotate-[6deg] translate-x-[6px] group-hover:rotate-[12deg] group-hover:translate-x-[12px] transition-transform duration-500" />
                          <div className="relative inset-0 w-full h-full rounded-xl bg-gradient-to-b from-zinc-800 to-zinc-950 border border-amber-400/40 flex flex-col items-center justify-center p-3 shadow-[0_0_30px_rgba(0,0,0,0.8)]">
                            <div className="w-full h-full rounded-lg border border-amber-400/20 flex items-center justify-center">
                              <Icon className="w-8 h-8 text-amber-300/80 group-hover:scale-110 transition-transform duration-300" />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="relative z-10 space-y-2 pt-4 border-t border-white/5">
                        <div className="flex items-center justify-between">
                          <span className="text-xs uppercase tracking-widest text-amber-400/90">
                            Escolha 0{idx + 1}
                          </span>
                          <ArrowRight className="w-4 h-4 text-zinc-500 group-hover:text-amber-300 group-hover:translate-x-1 transition-all" />
                        </div>
                        <h2 className="text-lg font-medium text-white">
                          {deck.title}
                        </h2>
                        <p className="text-xs text-zinc-400 leading-relaxed">
                          {deck.subtitle}
                        </p>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </motion.section>
          )}

          {/* ================= PASSO 2: A PERGUNTA ================= */}
          {step === 2 && (
            <motion.section
              key="step2"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.4 }}
              className="max-w-2xl mx-auto space-y-8"
            >
              <button
                onClick={() => setStep(1)}
                className="inline-flex items-center gap-2 text-xs text-zinc-400 hover:text-white transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Trocar de monte
              </button>

              <div className="space-y-3">
                <h2 className="text-3xl md:text-4xl font-light text-white">
                  Qual questão você deseja colocar na mesa?
                </h2>
                <p className="text-zinc-400 text-sm">
                  Escreva com suas próprias palavras ou selecione uma das chaves de pergunta abaixo para abrir as cartas.
                </p>
              </div>

              <form onSubmit={handleStartReading} className="space-y-6">
                <div>
                  <textarea
                    rows={3}
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    maxLength={600}
                    placeholder="Ex: Qual caminho devo tomar em relação a..."
                    className="w-full rounded-xl bg-[#111116] border border-white/15 focus:border-amber-400/70 focus:outline-none p-4 text-white placeholder:text-zinc-600 text-sm md:text-base transition-colors resize-none"
                    required
                  />
                </div>

                {/* Sugestões Pré-definidas */}
                <div className="space-y-2.5">
                  <span className="text-xs uppercase tracking-wider text-zinc-500 block">
                    Ou escolha uma pergunta frequente:
                  </span>
                  <div className="grid grid-cols-1 gap-2">
                    {PRESET_QUESTIONS.map((preset, i) => (
                      <button
                        type="button"
                        key={i}
                        onClick={() => setQuestion(preset)}
                        className={`text-left text-xs md:text-sm p-3.5 rounded-xl border transition-all ${
                          question === preset
                            ? "bg-amber-500/15 border-amber-400/60 text-amber-200"
                            : "bg-[#111116]/60 border-white/5 text-zinc-400 hover:border-white/20 hover:text-zinc-200"
                        }`}
                      >
                        “{preset}”
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={!question.trim()}
                  className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 disabled:opacity-40 text-black font-semibold text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-[0_0_25px_rgba(245,158,11,0.25)] cursor-pointer"
                >
                  Revelar Minhas Cartas <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </motion.section>
          )}

          {/* ================= PASSO 3: REVELAÇÃO + CAPTURA DE LEAD ================= */}
          {step === 3 && (
            <motion.section
              key="step3"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-12"
            >
              {/* Resumo da Consulta */}
              <div className="p-5 rounded-2xl bg-[#111116] border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <span className="text-[11px] uppercase tracking-widest text-amber-400 block">
                    Sua Intenção Registrada
                  </span>
                  <p className="text-white text-base md:text-lg font-light italic mt-0.5">
                    “{question}”
                  </p>
                </div>
                <span className="text-xs px-3 py-1.5 rounded-lg bg-white/5 text-zinc-300 border border-white/10 self-start md:self-center">
                  {selectedDeckTitle}
                </span>
              </div>

              {/* Grid das 3 Cartas Reveladas */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {generatedReading?.cards.map((card, index) => {
                  const isCardLocked = card.locked && !isUnlocked;

                  return (
                    <motion.div
                      key={card.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.2 }}
                      className="relative rounded-2xl bg-[#111116] border border-white/10 p-6 flex flex-col justify-between overflow-hidden"
                    >
                      <div className="space-y-4">
                        <div className="flex items-center justify-between border-b border-white/10 pb-3">
                          <span className="text-xs uppercase tracking-widest text-amber-400 font-medium">
                            {card.position}
                          </span>
                          {isCardLocked ? (
                            <Lock className="w-4 h-4 text-amber-400" />
                          ) : (
                            <Unlock className="w-4 h-4 text-emerald-400/80" />
                          )}
                        </div>

                        <TarotCardVisual
                          cardId={card.id}
                          title={card.title}
                          arcanaNumber={card.arcanaNumber}
                          revealed={!isCardLocked}
                          revealDelay={0.35 + index * 0.3}
                          className="mx-auto w-32"
                        />

                        <div className={isCardLocked ? "blur-md select-none pointer-events-none" : ""}>
                          <h3 className="text-xl font-medium text-white">
                            {card.name}
                          </h3>
                          <p className="text-xs text-amber-300/80 mt-1">
                            {card.keywords}
                          </p>
                          <p className="text-sm text-zinc-300 leading-relaxed mt-4">
                            {card.meaning}
                          </p>
                        </div>
                      </div>

                      {/* Overlay se estiver bloqueado */}
                      {isCardLocked && (
                        <div className="absolute inset-0 bg-gradient-to-t from-[#070709] via-[#070709]/85 to-transparent flex flex-col items-center justify-end p-6 text-center">
                          <div className="w-10 h-10 rounded-full bg-amber-500/20 border border-amber-400/40 flex items-center justify-center mb-3">
                            <Lock className="w-4 h-4 text-amber-300" />
                          </div>
                          <p className="text-sm font-medium text-white">
                            Carta de Veredito Bloqueada
                          </p>
                          <p className="text-xs text-zinc-400 mt-1">
                            Libere gratuitamente abaixo junto com o seu PDF completo da leitura.
                          </p>
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>

              {generatedReading && (
                <p className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-5 text-sm leading-relaxed text-zinc-300">
                  {generatedReading.cliffhangerHook}
                </p>
              )}

              {/* GATE DE CONVERSÃO OU PÓS-CONVERSÃO */}
              {!isUnlocked ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="rounded-3xl bg-gradient-to-b from-[#16161e] to-[#111116] border border-amber-500/30 p-8 md:p-10 shadow-[0_0_50px_rgba(245,158,11,0.1)]"
                >
                  <div className="max-w-xl mx-auto text-center space-y-3 mb-8">
                    <span className="text-xs uppercase tracking-[0.2em] text-amber-400 font-semibold">
                      Último Passo • Acesso Gratuito
                    </span>
                    <h3 className="text-2xl md:text-3xl font-light text-white">
                      Destrave o 3º Arcano + Receba o Dossiê em PDF da sua Leitura
                    </h3>
                    <p className="text-xs md:text-sm text-zinc-400">
                      Informe seu nome e WhatsApp para revelar imediatamente a carta final na tela e receber o guia prático dessa tiragem.
                    </p>
                  </div>

                  <form
                    onSubmit={handleUnlockReading}
                    className="max-w-md mx-auto space-y-4"
                  >
                    <input
                      type="text"
                      placeholder="Seu primeiro nome"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      maxLength={100}
                      required
                      className="w-full rounded-xl bg-[#070709] border border-white/15 focus:border-amber-400 px-4 py-3.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none"
                    />
                    <input
                      type="tel"
                      placeholder="Seu WhatsApp com DDD (Ex: 51 99999-9999)"
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      maxLength={24}
                      pattern="[0-9+() -]{8,24}"
                      required
                      className="w-full rounded-xl bg-[#070709] border border-white/15 focus:border-amber-400 px-4 py-3.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none"
                    />
                    <label className="flex items-start gap-3 text-left text-xs leading-relaxed text-zinc-400">
                      <input
                        type="checkbox"
                        checked={hasLeadConsent}
                        onChange={(event) => setHasLeadConsent(event.target.checked)}
                        required
                        className="mt-0.5 accent-amber-400"
                      />
                      <span>
                        Autorizo o uso do meu nome, WhatsApp e dados desta tiragem
                        para liberar a leitura e receber contato sobre ela. O
                        prazo-alvo é de 180 dias, mas a exclusão automática ainda
                        não está ativa. Consulte o{" "}
                        <Link href="/privacidade" className="underline hover:text-white">
                          Aviso de Privacidade
                        </Link>
                        .
                      </span>
                    </label>
                    {leadError && (
                      <p role="alert" className="text-center text-xs text-rose-300">
                        {leadError}
                      </p>
                    )}
                    <button
                      type="submit"
                      disabled={isSubmitting || !hasLeadConsent}
                      className="w-full py-4 px-6 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-semibold text-sm uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      {isSubmitting
                        ? "Destravando Leitura..."
                        : "Revelar 3ª Carta + Baixar PDF"}
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </form>
                </motion.div>
              ) : (
                /* HUB DE CONVERSÃO FINAL (PÓS-DESBLOQUEIO) */
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-3xl bg-gradient-to-br from-emerald-950/30 via-[#111116] to-[#111116] border border-emerald-500/30 p-8 md:p-10 text-center space-y-6"
                >
                  <div className="space-y-2">
                    <span className="text-xs uppercase tracking-[0.2em] text-emerald-400">
                      Leitura Completa Desbloqueada, {name}!
                    </span>
                    <h3 className="text-2xl md:text-3xl font-light text-white">
                      Escolha seu próximo passo
                    </h3>
                    <p className="text-sm text-zinc-400 max-w-lg mx-auto">
                      A 3ª carta já está visível acima. Você pode salvar o PDF oficial desta tiragem ou falar com nosso atendimento para uma leitura aprofundada.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
                    <button
                      onClick={handleDownloadPdf}
                      disabled={isGeneratingPdf}
                      className="w-full sm:w-auto px-6 py-4 rounded-xl bg-white/10 hover:bg-white/15 disabled:opacity-60 border border-white/15 text-white text-sm font-medium flex items-center justify-center gap-2 transition-all cursor-pointer"
                    >
                      <FileDown className="w-4 h-4 text-amber-400" />
                      {isGeneratingPdf ? "Gerando seu PDF..." : "Baixar Dossiê em PDF"}
                    </button>

                    <button
                      onClick={handleWhatsAppRedirect}
                      className="w-full sm:w-auto px-6 py-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-sm font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-[0_0_25px_rgba(16,185,129,0.3)]"
                    >
                      <MessageCircle className="w-4 h-4" />
                      Aprofundar Leitura no WhatsApp
                    </button>

                    <a
                      href="/app"
                      className="w-full sm:w-auto px-6 py-4 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-400/40 text-amber-200 text-sm font-medium flex items-center justify-center gap-2 transition-all"
                    >
                      Acessar Plataforma Completa
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>

                  {pdfError && (
                    <p role="alert" className="text-xs text-rose-300">
                      {pdfError}
                    </p>
                  )}
                </motion.div>
              )}
            </motion.section>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}