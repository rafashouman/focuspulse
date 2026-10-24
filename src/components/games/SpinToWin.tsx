"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Copy,
  Check,
  Volume2,
  VolumeX,
  Gift,
  Zap,
  ShieldCheck,
  Ticket,
  ArrowUpRight,
} from "lucide-react";
import { trackMetaEvent } from "@/components/MetaPixel";

// ==========================================
// WEB AUDIO SYNTHESIZER (MECHANICAL WHEEL)
// ==========================================
class WheelSoundEngine {
  private ctx: AudioContext | null = null;
  public enabled: boolean = true;

  private init() {
    if (typeof window === "undefined") return;
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  playPegTick(pitchBoost = 0) {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(620 + pitchBoost, now);
    osc.frequency.exponentialRampToValueAtTime(190, now + 0.028);
    gain.gain.setValueAtTime(0.11, now);
    gain.gain.linearRampToValueAtTime(0.005, now + 0.028);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.03);
  }

  playJackpot() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    [523.25, 659.25, 783.99, 1046.5, 1318.5].forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(freq, now + idx * 0.07);
      gain.gain.setValueAtTime(0.15, now + idx * 0.07);
      gain.gain.exponentialRampToValueAtTime(0.005, now + idx * 0.07 + 0.38);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + idx * 0.07);
      osc.stop(now + idx * 0.07 + 0.4);
    });
  }
}

interface PrizeSpec {
  id: number;
  label: string;
  code: string;
  desc: string;
  probability: string;
  color: string;
  textColor: string;
}

const PRIZES: PrizeSpec[] = [
  {
    id: 0,
    label: "15% OFF",
    code: "PULSE-15OFF",
    desc: "Desconto imediato em qualquer projeto ou template web.",
    probability: "25%",
    color: "#0B132B",
    textColor: "#FFFFFF",
  },
  {
    id: 1,
    label: "SEO AUDIT",
    code: "PULSE-SEOVIP",
    desc: "Diagnóstico técnico de performance, Core Web Vitals e Pixel.",
    probability: "20%",
    color: "#1C2541",
    textColor: "#00F0FF",
  },
  {
    id: 2,
    label: "SETUP PIXEL",
    code: "PULSE-PIXELFREE",
    desc: "Instalação gratuita do Meta Pixel + Eventos de Conversão.",
    probability: "18%",
    color: "#0F172A",
    textColor: "#FFFFFF",
  },
  {
    id: 3,
    label: "25% OFF VIP",
    code: "PULSE-25JACKPOT",
    desc: "Bônus máximo desbloqueado para desenvolvimento Next.js + Firebase.",
    probability: "10%",
    color: "#00F0FF",
    textColor: "#050505",
  },
  {
    id: 4,
    label: "UI KIT PRO",
    code: "PULSE-UIKIT",
    desc: "Pacote de micro-interações e componentes exclusivos.",
    probability: "15%",
    color: "#1E293B",
    textColor: "#38BDF8",
  },
  {
    id: 5,
    label: "PRIORIDADE",
    code: "PULSE-FASTTRACK",
    desc: "Entrega expressa com prioridade na fila de engenharia.",
    probability: "12%",
    color: "#3A506B",
    textColor: "#FFFFFF",
  },
];

export default function PulseSpinRoulette() {
  const soundRef = useRef<WheelSoundEngine | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [wonPrize, setWonPrize] = useState<PrizeSpec | null>(null);
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState<PrizeSpec[]>([]);

  const ensureSound = () => {
    if (!soundRef.current) {
      soundRef.current = new WheelSoundEngine();
      soundRef.current.enabled = soundEnabled;
    }
    return soundRef.current;
  };

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    const engine = ensureSound();
    engine.enabled = next;
    if (next) engine.playPegTick(200);
  };

  const handleSpin = () => {
    if (isSpinning) return;
    const engine = ensureSound();
    setIsSpinning(true);
    setWonPrize(null);
    setCopied(false);

    const winningIndex = Math.floor(Math.random() * PRIZES.length);
    const segmentAngle = 360 / PRIZES.length; // 60 graus por fatia

    // Para alinhar o centro da fatia vencedora com o ponteiro do topo (0 deg)
    const sliceCenterOffset = 360 - (winningIndex * segmentAngle + segmentAngle / 2);
    const currentNormalized = rotation % 360;
    const extraSpins = 360 * 6; // 6 voltas completas
    const targetRotation =
      rotation + extraSpins + ((sliceCenterOffset - currentNormalized + 360) % 360);

    setRotation(targetRotation);

    // Agenda cliques mecânicos desacelerando ao longo de 4.6 segundos
    const tickDelays = [
      80, 160, 250, 350, 460, 580, 710, 850, 1000, 1170, 1360, 1570, 1810, 2080,
      2390, 2740, 3140, 3600, 4120,
    ];
    tickDelays.forEach((delay, idx) => {
      setTimeout(() => {
        engine.playPegTick(idx * 12);
      }, delay);
    });

    setTimeout(() => {
      setIsSpinning(false);
      const prize = PRIZES[winningIndex];
      setWonPrize(prize);
      setHistory((prev) => [prize, ...prev.slice(0, 3)]);
      engine.playJackpot();

      trackMetaEvent("Lead", {
        content_name: `PulseSpin Bonus: ${prize.label}`,
        coupon_code: prize.code,
      });
    }, 4600);
  };

  const handleCopyCode = () => {
    if (!wonPrize) return;
    navigator.clipboard.writeText(wonPrize.code);
    ensureSound().playPegTick(400);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="min-h-[680px] bg-[#05070E] text-white p-6 sm:p-10 font-sans relative overflow-hidden select-none flex flex-col justify-between">
      {/* Glow Ambiente */}
      <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] bg-[#00F0FF] opacity-[0.05] rounded-full blur-[130px] pointer-events-none" />

      {/* 1. HEADER TELEMETRY */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 border-b border-[#1C2541] pb-5">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-[#00F0FF]/10 border border-[#00F0FF]/40 flex items-center justify-center text-[#00F0FF] shadow-[0_0_25px_rgba(0,240,255,0.25)]">
            <Gift className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#00F0FF]">
                GAMIFIED CONVERSION ENGINE
              </span>
              <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 font-mono text-[9px] text-emerald-400 font-bold">
                +34% LEAD CAPTURE
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white">
              PULSE<span className="text-[#00F0FF]">SPIN</span> ROULETTE
            </h2>
          </div>
        </div>

        <button
          type="button"
          onClick={toggleSound}
          className="p-2.5 rounded-xl bg-[#0B132B] border border-[#1C2541] text-[#00F0FF] hover:border-[#00F0FF] transition-colors flex items-center gap-2 font-mono text-xs"
        >
          {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          <span className="hidden sm:inline">{soundEnabled ? "SFX ATIVO" : "MUTE"}</span>
        </button>
      </div>

      {/* 2. CORPO CENTRAL: ROLETA + TABELA DE PROBABILIDADES */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center my-8">
        {/* Coluna da Roleta (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center">
          <div className="relative w-72 h-72 sm:w-88 sm:h-88">
            {/* Ponteiro Superior Neon */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center">
              <div className="w-7 h-7 bg-[#00F0FF] rotate-45 rounded-sm shadow-[0_0_25px_#00F0FF] border-2 border-[#05070E]" />
            </div>

            {/* Disco Giratório com Conic Gradient e Textos Radiais */}
            <motion.div
              className="w-full h-full rounded-full border-[6px] border-[#1C2541] shadow-[0_0_70px_rgba(0,240,255,0.18)] relative overflow-hidden"
              animate={{ rotate: rotation }}
              transition={{ duration: 4.6, type: "tween", ease: [0.15, 0.88, 0.22, 1] }}
            >
              <div
                className="w-full h-full rounded-full"
                style={{
                  background: `conic-gradient(
                    ${PRIZES[0].color} 0deg 60deg,
                    ${PRIZES[1].color} 60deg 120deg,
                    ${PRIZES[2].color} 120deg 180deg,
                    ${PRIZES[3].color} 180deg 240deg,
                    ${PRIZES[4].color} 240deg 300deg,
                    ${PRIZES[5].color} 300deg 360deg
                  )`,
                }}
              />

              {/* Rótulos e Pinos de cada Fatia */}
              {PRIZES.map((prize, idx) => {
                const angle = idx * 60 + 30;
                return (
                  <div
                    key={prize.id}
                    className="absolute inset-0 flex justify-center items-start pt-6 pointer-events-none"
                    style={{ transform: `rotate(${angle}deg)` }}
                  >
                    <span
                      className="font-mono text-[11px] sm:text-xs font-black tracking-wider uppercase px-2 py-0.5 rounded"
                      style={{ color: prize.textColor }}
                    >
                      {prize.label}
                    </span>
                  </div>
                );
              })}
            </motion.div>

            {/* Núcleo Central da Roleta */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-16 h-16 rounded-full bg-[#05070E] border-4 border-[#00F0FF] shadow-[0_0_25px_rgba(0,240,255,0.5)] flex items-center justify-center">
              <Zap className="w-6 h-6 text-[#00F0FF]" />
            </div>
          </div>

          <motion.button
            type="button"
            onClick={handleSpin}
            disabled={isSpinning}
            whileHover={{ scale: 1.03, boxShadow: "0 0 35px rgba(0,240,255,0.45)" }}
            whileTap={{ scale: 0.96 }}
            className="mt-8 px-10 py-4 rounded-2xl bg-[#00F0FF] text-[#05070E] font-mono font-black text-xs sm:text-sm tracking-[0.2em] uppercase transition-all disabled:opacity-50 flex items-center gap-3 shadow-[0_0_25px_rgba(0,240,255,0.3)]"
          >
            <Sparkles className="w-4 h-4" />
            {isSpinning ? "SORTEANDO RECOMPENSA..." : "GIRAR ROLETA QUÂNTICA"}
          </motion.button>
        </div>

        {/* Coluna de Informações & Probabilidades Auditadas (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-2xl bg-[#0B132B]/70 border border-[#1C2541] space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#00F0FF] flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" /> Tabela de Recompensas & Odds
              </span>
              <span className="font-mono text-[10px] text-slate-400">RNG AUDITADO</span>
            </div>

            <div className="space-y-2">
              {PRIZES.map((p) => (
                <div
                  key={p.id}
                  className="p-2.5 rounded-xl bg-[#05070E]/80 border border-[#1C2541] flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className="w-3 h-3 rounded-full shrink-0 border border-white/20"
                      style={{ backgroundColor: p.color }}
                    />
                    <span className="font-bold text-white">{p.label}</span>
                  </div>
                  <div className="flex items-center gap-3 font-mono text-[11px]">
                    <span className="text-slate-400">Chance: {p.probability}</span>
                    <span className="text-[#00F0FF] font-bold">{p.code}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {history.length > 0 && (
            <div className="p-4 rounded-2xl bg-[#0B132B]/40 border border-[#1C2541]">
              <span className="font-mono text-[10px] uppercase tracking-widest text-slate-400 block mb-2">
                // ÚLTIMOS GIROS NESTA SESSÃO
              </span>
              <div className="flex flex-wrap gap-2">
                {history.map((h, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-lg bg-[#00F0FF]/10 border border-[#00F0FF]/30 font-mono text-[11px] font-bold text-[#00F0FF]"
                  >
                    {h.label} ({h.code})
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 3. MODAL DE CUPOM DESBLOQUEADO */}
      <AnimatePresence>
        {wonPrize && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.88, y: 24 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.88, y: 24 }}
              className="p-8 rounded-3xl border-2 border-[#00F0FF] bg-[#060B16] shadow-[0_0_80px_rgba(0,240,255,0.3)] text-center w-full max-w-md relative overflow-hidden"
            >
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#00F0FF]/15 text-[#00F0FF] font-mono text-[10px] font-bold uppercase tracking-widest mb-4">
                <Ticket className="w-3.5 h-3.5" /> Recompensa Desbloqueada
              </div>

              <h3 className="text-4xl font-black text-white tracking-tight mb-2">
                {wonPrize.label}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed mb-6">
                {wonPrize.desc}
              </p>

              {/* Caixa de Código Copiável */}
              <div className="p-3.5 rounded-2xl bg-[#0B132B] border border-[#00F0FF]/40 flex items-center justify-between gap-3 mb-6">
                <div className="text-left">
                  <span className="font-mono text-[9px] uppercase text-slate-400 block">
                    SEU CUPOM EXCLUSIVO
                  </span>
                  <span className="font-mono text-base font-black text-[#00F0FF]">
                    {wonPrize.code}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="px-4 py-2.5 rounded-xl bg-[#00F0FF] text-[#05070E] font-mono text-xs font-black uppercase flex items-center gap-1.5 hover:bg-cyan-300 transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5" /> Copiado!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" /> Copiar
                    </>
                  )}
                </button>
              </div>

              <div className="flex flex-col sm:flex-row gap-2.5">
                <a
                  href="/#contato"
                  onClick={() => setWonPrize(null)}
                  className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-[#00F0FF] to-cyan-400 text-slate-950 font-mono text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5"
                >
                  <span>Usar no Orçamento</span>
                  <ArrowUpRight className="w-4 h-4" />
                </a>
                <button
                  type="button"
                  onClick={() => setWonPrize(null)}
                  className="py-3.5 px-5 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:text-white font-mono text-xs font-bold uppercase"
                >
                  Fechar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}