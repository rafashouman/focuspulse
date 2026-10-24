"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { onAuthStateChanged, signInWithPopup, User } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase/client";
import { saveMatchResult } from "@/app/actions/saveMatchResult";
import { trackMetaEvent } from "@/components/MetaPixel";
import {
  Cpu,
  Timer,
  Zap,
  Trophy,
  RotateCcw,
  Volume2,
  VolumeX,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Unlock,
} from "lucide-react";

// ==========================================
// WEB AUDIO SYNTHESIZER (NEURAL MATRIX FX)
// ==========================================
class MatrixSoundEngine {
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

  playFlip() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(340, now);
    osc.frequency.exponentialRampToValueAtTime(780, now + 0.06);
    gain.gain.setValueAtTime(0.1, now);
    gain.gain.linearRampToValueAtTime(0.005, now + 0.06);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.065);
  }

  playMatch(streak: number) {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const base = 523.25 + Math.min(streak * 65, 300);
    [base, base * 1.25].forEach((freq, i) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(freq, now + i * 0.06);
      gain.gain.setValueAtTime(0.14, now + i * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.005, now + i * 0.06 + 0.22);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + i * 0.06);
      osc.stop(now + i * 0.06 + 0.24);
    });
  }

  playMismatch() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(190, now);
    osc.frequency.linearRampToValueAtTime(125, now + 0.18);
    gain.gain.setValueAtTime(0.09, now);
    gain.gain.linearRampToValueAtTime(0.005, now + 0.18);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.19);
  }

  playVictory() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    [523.25, 659.25, 783.99, 1046.5].forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);
      gain.gain.setValueAtTime(0.16, now + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.005, now + idx * 0.08 + 0.35);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 0.36);
    });
  }
}

const CARD_MODULES = [
  { symbol: "{ }", name: "OBJ_LITERAL" },
  { symbol: "[ ]", name: "ARRAY_BUFFER" },
  { symbol: "< >", name: "JSX_NODE" },
  { symbol: "//", name: "COMMENT_PTR" },
  { symbol: "/*", name: "BLOCK_OPEN" },
  { symbol: "*/", name: "BLOCK_CLOSE" },
  { symbol: "0x", name: "HEX_ADDR" },
  { symbol: "=>", name: "LAMBDA_FN" },
];

interface Card {
  id: string;
  symbol: string;
  name: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export default function MemoryMatrix() {
  const soundRef = useRef<MatrixSoundEngine | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const [user, setUser] = useState<User | null>(null);
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [authError, setAuthError] = useState("");
  const [saveError, setSaveError] = useState("");
  const [savedScore, setSavedScore] = useState<number | null>(null);
  const [feedbackBanner, setFeedbackBanner] = useState<string>("AGUARDANDO INÍCIO DE VARREDURA...");
  const gameStartedAt = useRef(0);

  useEffect(() => {
    soundRef.current = new MatrixSoundEngine();
    return onAuthStateChanged(auth, setUser, (error) => {
      console.error("Unable to observe Firebase Auth state.", error);
      setAuthError("Não foi possível verificar sua sessão.");
    });
  }, []);

  const isVictory = matches === CARD_MODULES.length;

  // Cronômetro em tempo real
  useEffect(() => {
    if (isVictory || moves === 0) return;
    const interval = setInterval(() => {
      setElapsedSeconds(Math.max(1, Math.floor((Date.now() - gameStartedAt.current) / 1000)));
    }, 1000);
    return () => clearInterval(interval);
  }, [isVictory, moves]);

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    if (soundRef.current) {
      soundRef.current.enabled = next;
      if (next) soundRef.current.playFlip();
    }
  };

  const handleLogin = async () => {
    setAuthError("");
    try {
      await signInWithPopup(auth, googleProvider);
      soundRef.current?.playMatch(2);
    } catch (error) {
      console.error("Unable to sign in with Google.", error);
      setAuthError("Não foi possível iniciar sessão com o Google.");
    }
  };

  const initializeGame = useCallback(() => {
    const duplicated = [...CARD_MODULES, ...CARD_MODULES];
    const shuffledCards = duplicated
      .sort(() => Math.random() - 0.5)
      .map((item) => ({
        id: crypto.randomUUID(),
        symbol: item.symbol,
        name: item.name,
        isFlipped: false,
        isMatched: false,
      }));

    setCards(shuffledCards);
    setFlippedIndices([]);
    setMoves(0);
    setMatches(0);
    setStreak(0);
    setMaxStreak(0);
    setElapsedSeconds(0);
    setIsLocked(false);
    setSavedScore(null);
    setSaveError("");
    setFeedbackBanner("MATRIZ CRIPTOGRAFADA • SELECIONE DOIS NÓS");
    gameStartedAt.current = Date.now();
  }, []);

  useEffect(() => {
    const frameId = requestAnimationFrame(initializeGame);
    return () => cancelAnimationFrame(frameId);
  }, [initializeGame]);

  const handleCardClick = (index: number) => {
    if (isLocked || cards[index].isFlipped || cards[index].isMatched) return;

    if (moves === 0 && flippedIndices.length === 0) {
      gameStartedAt.current = Date.now();
    }

    soundRef.current?.playFlip();

    const newCards = cards.map((card, cardIndex) =>
      cardIndex === index ? { ...card, isFlipped: true } : card
    );
    setCards(newCards);

    const newFlippedIndices = [...flippedIndices, index];
    setFlippedIndices(newFlippedIndices);

    if (newFlippedIndices.length === 2) {
      setIsLocked(true);
      const nextMoves = moves + 1;
      setMoves(nextMoves);

      const [firstIndex, secondIndex] = newFlippedIndices;
      const firstCard = newCards[firstIndex];
      const secondCard = newCards[secondIndex];

      if (firstCard.symbol === secondCard.symbol) {
        const nextMatches = matches + 1;
        const nextStreak = streak + 1;
        setMatches(nextMatches);
        setStreak(nextStreak);
        setMaxStreak((prev) => Math.max(prev, nextStreak));

        if (nextMatches === CARD_MODULES.length) {
          soundRef.current?.playVictory();
          setFeedbackBanner("ACESSO ROOT CONCEDIDO • TODOS OS MÓDULOS DESBLOQUEADOS!");
          trackMetaEvent("Lead", {
            content_name: "Memory Matrix Victory",
            moves: nextMoves,
          });
        } else {
          soundRef.current?.playMatch(nextStreak);
          setFeedbackBanner(
            `MÓDULO [${firstCard.name}] PAREADO! ${nextStreak > 1 ? `STREAK ${nextStreak}x 🔥` : ""}`
          );
        }

        setCards((currentCards) =>
          currentCards.map((card, cardIndex) =>
            cardIndex === firstIndex || cardIndex === secondIndex
              ? { ...card, isMatched: true }
              : card
          )
        );
        setFlippedIndices([]);
        setIsLocked(false);
      } else {
        soundRef.current?.playMismatch();
        setStreak(0);
        setFeedbackBanner("ASSINATURA INCOMPATÍVEL • REVERTENDO BUFFER...");
        setTimeout(() => {
          setCards((currentCards) =>
            currentCards.map((card, cardIndex) =>
              cardIndex === firstIndex || cardIndex === secondIndex
                ? { ...card, isFlipped: false }
                : card
            )
          );
          setFlippedIndices([]);
          setIsLocked(false);
        }, 850);
      }
    }
  };

  const handleVictory = async () => {
    if (!user) {
      setAuthError("Inicie sessão para registrar sua pontuação.");
      return;
    }

    setIsSaving(true);
    setSaveError("");
    try {
      const idToken = await user.getIdToken(true);
      const result = await saveMatchResult(
        {
          gameId: "memory",
          moves,
          timeInSeconds: Math.max(1, elapsedSeconds),
        },
        idToken
      );

      if (result.success) {
        soundRef.current?.playVictory();
        setSavedScore(result.score);
      } else {
        setSaveError(result.error);
      }
    } catch (error) {
      console.error("Unable to submit game result.", error);
      setSaveError("Não foi possível salvar a pontuação. Tente novamente.");
    } finally {
      setIsSaving(false);
    }
  };

  const accuracy = moves > 0 ? Math.min(100, Math.round((matches / moves) * 100)) : 100;
  const estimatedScore = Math.max(
    100,
    1000 - moves * 25 - elapsedSeconds * 4 + maxStreak * 80
  );
  const progressPct = Math.round((matches / CARD_MODULES.length) * 100);

  return (
    <div className="flex flex-col items-center justify-between min-h-[680px] bg-[#05070E] p-5 sm:p-8 font-mono text-[#00F0FF] selection:bg-[#00F0FF] selection:text-black relative overflow-hidden">
      {/* Ambient Cyber Grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage: `linear-gradient(to right, #00F0FF 1px, transparent 1px), linear-gradient(to bottom, #00F0FF 1px, transparent 1px)`,
          backgroundSize: "36px 36px",
        }}
      />

      {/* ==========================================
          1. TOP TELEMETRY & AUTH HEADER
      ========================================== */}
      <div className="w-full max-w-2xl relative z-10 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#1C2541] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-[#00F0FF]/10 border border-[#00F0FF]/40 flex items-center justify-center text-[#00F0FF] shadow-[0_0_20px_rgba(0,240,255,0.25)]">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] tracking-[0.25em] text-[#3A506B] uppercase font-bold">
                  NEURAL DECRYPTOR v3.4
                </span>
                <span className="px-2 py-0.5 rounded bg-[#00F0FF]/10 border border-[#00F0FF]/30 text-[9px] font-bold">
                  {isVictory ? "ROOT UNLOCKED" : "ACTIVE SCAN"}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                MEMORY <span className="text-[#00F0FF]">MATRIX 3D</span>
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {user ? (
              <div className="px-3 py-1.5 rounded-xl bg-[#0B132B] border border-[#1C2541] text-xs flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span className="max-w-32 truncate text-white font-bold">
                  {user.displayName || user.email}
                </span>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleLogin}
                className="rounded-xl border border-[#00F0FF]/60 bg-[#00F0FF]/10 px-3.5 py-2 text-xs font-bold uppercase tracking-wider text-[#00F0FF] transition-all hover:bg-[#00F0FF] hover:text-[#050505]"
              >
                Autenticar Google
              </button>
            )}

            <button
              type="button"
              onClick={toggleSound}
              className="p-2.5 rounded-xl bg-[#0B132B] border border-[#1C2541] text-[#00F0FF] hover:border-[#00F0FF] transition-colors"
              title="Sintetizador Neural"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* 4 KPI Telemetry Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <div className="p-3 rounded-xl bg-[#0B132B]/70 border border-[#1C2541]">
            <span className="text-[9px] uppercase tracking-widest text-slate-400 flex items-center gap-1">
              <Timer className="w-3 h-3 text-[#00F0FF]" /> Tempo
            </span>
            <span className="text-lg font-black text-white">
              {String(Math.floor(elapsedSeconds / 60)).padStart(2, "0")}:
              {String(elapsedSeconds % 60).padStart(2, "0")}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-[#0B132B]/70 border border-[#1C2541]">
            <span className="text-[9px] uppercase tracking-widest text-slate-400 flex items-center gap-1">
              <Cpu className="w-3 h-3 text-[#00F0FF]" /> Tentativas
            </span>
            <span className="text-lg font-black text-white">
              {String(moves).padStart(2, "0")}{" "}
              <span className="text-[10px] text-[#00F0FF]">({accuracy}%)</span>
            </span>
          </div>

          <div className="p-3 rounded-xl bg-[#0B132B]/70 border border-[#1C2541]">
            <span className="text-[9px] uppercase tracking-widest text-slate-400 flex items-center gap-1">
              <Zap className="w-3 h-3 text-amber-400" /> Streak Atual
            </span>
            <span className="text-lg font-black text-amber-400">
              {streak}x <span className="text-[10px] text-slate-400">(Máx {maxStreak}x)</span>
            </span>
          </div>

          <div className="p-3 rounded-xl bg-[#0B132B]/70 border border-[#1C2541]">
            <span className="text-[9px] uppercase tracking-widest text-slate-400 flex items-center gap-1">
              <Trophy className="w-3 h-3 text-emerald-400" /> Score Est.
            </span>
            <span className="text-lg font-black text-emerald-400">{estimatedScore}</span>
          </div>
        </div>

        {/* Barra de Descriptografia & Status */}
        <div className="p-3 rounded-xl bg-[#080D1A] border border-[#1C2541] space-y-2">
          <div className="flex items-center justify-between text-[11px]">
            <span className="flex items-center gap-1.5 text-cyan-200 font-bold truncate">
              {isVictory ? (
                <Unlock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              ) : (
                <Lock className="w-3.5 h-3.5 text-[#00F0FF] shrink-0" />
              )}
              {feedbackBanner}
            </span>
            <span className="font-bold text-[#00F0FF] shrink-0">
              {matches}/{CARD_MODULES.length} NÓS ({progressPct}%)
            </span>
          </div>
          <div className="w-full h-1.5 bg-[#050505] rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-[#00F0FF] to-emerald-400"
              initial={{ width: 0 }}
              animate={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      </div>

      {authError && (
        <p role="alert" className="my-2 text-center text-xs text-red-400 flex items-center gap-1.5">
          <AlertTriangle className="w-4 h-4" /> {authError}
        </p>
      )}

      {/* ==========================================
          2. TABULEIRO 3D INTERATIVO (4x4)
      ========================================== */}
      <div className="grid grid-cols-4 gap-3 sm:gap-4 w-full max-w-md aspect-square my-6 relative z-10">
        {cards.map((card, index) => (
          <div
            key={card.id}
            className="relative w-full h-full aspect-square [perspective:1000px] cursor-pointer group"
            onClick={() => handleCardClick(index)}
          >
            <motion.div
              animate={{
                rotateY: card.isFlipped || card.isMatched ? 180 : 0,
                scale: card.isMatched ? 0.96 : 1,
              }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              className="w-full h-full relative [transform-style:preserve-3d]"
            >
              {/* Costas da Carta */}
              <div className="absolute inset-0 w-full h-full rounded-2xl bg-gradient-to-br from-[#0B132B] to-[#060A17] border border-[#1C2541] group-hover:border-[#00F0FF]/60 [backface-visibility:hidden] flex flex-col items-center justify-center transition-all shadow-lg">
                <div className="w-3.5 h-3.5 bg-[#1C2541] rotate-45 group-hover:bg-[#00F0FF] group-hover:shadow-[0_0_12px_#00F0FF] transition-all" />
                <span className="text-[8px] text-slate-500 mt-2 tracking-widest">
                  NODE_{String(index + 1).padStart(2, "0")}
                </span>
              </div>

              {/* Frente da Carta */}
              <div
                className={`absolute inset-0 w-full h-full rounded-2xl flex flex-col items-center justify-center [backface-visibility:hidden] [transform:rotateY(180deg)] border-2 transition-all ${
                  card.isMatched
                    ? "bg-emerald-950/20 border-emerald-500/50 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.2)]"
                    : "bg-[#070E20] border-[#00F0FF] text-[#00F0FF] shadow-[0_0_25px_rgba(0,240,255,0.4)]"
                }`}
              >
                <span className="text-2xl sm:text-3xl font-black drop-shadow-[0_0_10px_currentColor]">
                  {card.symbol}
                </span>
                <span className="text-[8px] uppercase tracking-wider opacity-75 mt-1">
                  {card.name}
                </span>
              </div>
            </motion.div>
          </div>
        ))}
      </div>

      {/* ==========================================
          3. RODAPÉ DE VITÓRIA & CONTROLES
      ========================================== */}
      <div className="w-full max-w-2xl relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#1C2541]">
        <AnimatePresence mode="wait">
          {isVictory ? (
            <motion.div
              key="victory-box"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex flex-wrap items-center gap-3"
            >
              {savedScore !== null ? (
                <span
                  role="status"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs font-bold"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Score Registrado no Firebase: {savedScore} PTS
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => void handleVictory()}
                  disabled={isSaving || !user}
                  className="px-5 py-2.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black text-xs uppercase tracking-wider transition-all disabled:opacity-50 flex items-center gap-2 shadow-[0_0_20px_rgba(52,211,153,0.4)]"
                >
                  <Sparkles className="w-4 h-4" />
                  {isSaving
                    ? "Gravando no Firestore..."
                    : user
                    ? `Salvar Recorde (${estimatedScore} PTS)`
                    : "Entre com Google p/ Salvar"}
                </button>
              )}
              {saveError && <span className="text-xs text-red-400">{saveError}</span>}
            </motion.div>
          ) : (
            <span className="text-xs text-slate-400">
              Dica: Pares consecutivos aumentam seu multiplicador de <strong className="text-amber-400">Streak</strong>.
            </span>
          )}
        </AnimatePresence>

        <motion.button
          type="button"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => {
            soundRef.current?.playFlip();
            initializeGame();
          }}
          className="px-6 py-2.5 rounded-xl border border-[#00F0FF] bg-[#050505] hover:bg-[#00F0FF] text-[#00F0FF] hover:text-[#050505] text-xs font-black tracking-widest uppercase transition-colors flex items-center gap-2"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reiniciar Matriz
        </motion.button>
      </div>
    </div>
  );
}