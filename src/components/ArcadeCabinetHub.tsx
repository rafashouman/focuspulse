"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Gamepad2,
  Tv,
  Zap,
  RotateCcw,
  Volume2,
  VolumeX,
} from "lucide-react";
import VoxelVadersGame from "@/components/games/VoxelVadersGame";
import { arcadeSynth } from "@/lib/audio/arcadeSynth";

type GameId = "voxelvaders" | "arkanoid";
type BootPhase = "INSERTING" | "CRT_WARMUP" | "RUNNING";

interface CartridgeSpec {
  id: GameId;
  code: string;
  title: string;
  subtitle: string;
  engine: string;
  accentHex: string;
  badgeClass: string;
}

const CARTRIDGES: CartridgeSpec[] = [
  {
    id: "voxelvaders",
    code: "ROM-01 // 3D",
    title: "VOXELVADERS 3D",
    subtitle: "Defesa Orbital em WebGL com Partículas",
    engine: "THREE.JS WEBGL",
    accentHex: "#00F5D4",
    badgeClass: "border-[#00F5D4]/40 text-[#00F5D4] bg-[#00F5D4]/10",
  },
  {
    id: "arkanoid",
    code: "ROM-02 // 2D",
    title: "PULSE ARKANOID",
    subtitle: "Física Vetorial de Rebate & Destruição de Blocos",
    engine: "HTML5 CANVAS 60FPS",
    accentHex: "#FFB800",
    badgeClass: "border-[#FFB800]/40 text-[#FFB800] bg-[#FFB800]/10",
  },
];

// =========================================================
// CARTUCHO 2: PULSE ARKANOID (Motor 60FPS Embutido)
// (Caso já tenha seu próprio componente Arkanoid, basta importá-lo)
// =========================================================
function PulseArkanoidBuiltIn() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [status, setStatus] = useState<"READY" | "PLAYING" | "WON" | "LOST">("READY");
  const restartRef = useRef<() => void>(() => {});

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    const width = 760;
    const height = 520;
    canvas.width = width;
    canvas.height = height;

    // Estado Físico Interno
    const paddle = { w: 115, h: 14, x: width / 2 - 57, y: height - 38, speed: 9, dx: 0 };
    const ball = { x: width / 2, y: height - 55, r: 7, speed: 6, dx: 4.5, dy: -4.5 };

    const rows = 5;
    const cols = 9;
    const brickColors = ["#FF2A85", "#FFB800", "#00F5D4", "#A855F7", "#10B981"];

    interface Brick {
      x: number;
      y: number;
      w: number;
      h: number;
      color: string;
      alive: boolean;
      pts: number;
    }

    let bricks: Brick[] = [];
    let currentScore = 0;
    let currentLives = 3;
    let running = false;

    const buildBricks = () => {
      bricks = [];
      const pad = 10;
      const offsetTop = 55;
      const offsetLeft = 35;
      const bw = (width - offsetLeft * 2 - pad * (cols - 1)) / cols;
      const bh = 22;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          bricks.push({
            x: offsetLeft + c * (bw + pad),
            y: offsetTop + r * (bh + pad),
            w: bw,
            h: bh,
            color: brickColors[r % brickColors.length],
            alive: true,
            pts: (rows - r) * 100,
          });
        }
      }
    };

    const resetBallAndPaddle = () => {
      paddle.x = width / 2 - paddle.w / 2;
      ball.x = width / 2;
      ball.y = height - 55;
      ball.dx = (Math.random() > 0.5 ? 1 : -1) * 4.5;
      ball.dy = -4.8;
    };

    const startGame = () => {
      buildBricks();
      resetBallAndPaddle();
      currentScore = 0;
      currentLives = 3;
      setScore(0);
      setLives(3);
      setStatus("PLAYING");
      running = true;
      arcadeSynth.playCoinUp();
    };

    restartRef.current = startGame;
    buildBricks();

    // Controles Teclado & Mouse/Touch
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") paddle.dx = -paddle.speed;
      if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") paddle.dx = paddle.speed;
    };
    const onKeyUp = (e: KeyboardEvent) => {
      if (
        e.key === "ArrowLeft" ||
        e.key === "ArrowRight" ||
        e.key === "a" ||
        e.key === "d" ||
        e.key === "A" ||
        e.key === "D"
      ) {
        paddle.dx = 0;
      }
    };
    const onPointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const relX = ((e.clientX - rect.left) / rect.width) * width;
      paddle.x = Math.max(12, Math.min(width - paddle.w - 12, relX - paddle.w / 2));
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    canvas.addEventListener("pointermove", onPointerMove);

    const render = () => {
      animId = requestAnimationFrame(render);

      // Fundo Obsidian
      ctx.fillStyle = "#07060B";
      ctx.fillRect(0, 0, width, height);

      // Grade sutil
      ctx.strokeStyle = "rgba(255, 184, 0, 0.05)";
      ctx.lineWidth = 1;
      for (let gx = 0; gx < width; gx += 38) {
        ctx.beginPath();
        ctx.moveTo(gx, 0);
        ctx.lineTo(gx, height);
        ctx.stroke();
      }
      for (let gy = 0; gy < height; gy += 38) {
        ctx.beginPath();
        ctx.moveTo(0, gy);
        ctx.lineTo(width, gy);
        ctx.stroke();
      }

      if (running) {
        // Movimento do Paddle
        paddle.x = Math.max(12, Math.min(width - paddle.w - 12, paddle.x + paddle.dx));

        // Movimento da Bola
        ball.x += ball.dx;
        ball.y += ball.dy;

        // Colisão Paredes
        if (ball.x + ball.r > width - 8 || ball.x - ball.r < 8) {
          ball.dx *= -1;
          arcadeSynth.playBounce("wall");
        }
        if (ball.y - ball.r < 8) {
          ball.dy *= -1;
          arcadeSynth.playBounce("wall");
        }

        // Colisão com o Paddle (Ângulo Dinâmico)
        if (
          ball.y + ball.r >= paddle.y &&
          ball.y - ball.r <= paddle.y + paddle.h &&
          ball.x >= paddle.x &&
          ball.x <= paddle.x + paddle.w
        ) {
          arcadeSynth.playBounce("paddle");
          const hitOffset = (ball.x - (paddle.x + paddle.w / 2)) / (paddle.w / 2);
          const angle = hitOffset * (Math.PI / 3); // Max 60 graus
          const spd = Math.min(9.5, Math.hypot(ball.dx, ball.dy) * 1.02);
          ball.dx = spd * Math.sin(angle);
          ball.dy = -Math.abs(spd * Math.cos(angle));
        }

        // Colisão com Tijolos
        for (const b of bricks) {
          if (!b.alive) continue;
          if (
            ball.x + ball.r > b.x &&
            ball.x - ball.r < b.x + b.w &&
            ball.y + ball.r > b.y &&
            ball.y - ball.r < b.y + b.h
          ) {
            b.alive = false;
            ball.dy *= -1;
            currentScore += b.pts;
            setScore(currentScore);
            arcadeSynth.playBounce("brick");
            break;
          }
        }

        // Vitória
        if (bricks.every((b) => !b.alive)) {
          running = false;
          setStatus("WON");
        }

        // Queda da Bola
        if (ball.y - ball.r > height) {
          arcadeSynth.playExplosion();
          currentLives -= 1;
          setLives(currentLives);
          if (currentLives <= 0) {
            running = false;
            setStatus("LOST");
          } else {
            resetBallAndPaddle();
          }
        }
      }

      // Desenha Tijolos
      for (const b of bricks) {
        if (!b.alive) continue;
        ctx.fillStyle = b.color;
        ctx.shadowColor = b.color;
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.roundRect(b.x, b.y, b.w, b.h, 5);
        ctx.fill();
      }

      // Desenha Paddle
      ctx.fillStyle = "#FFB800";
      ctx.shadowColor = "#FFB800";
      ctx.shadowBlur = 16;
      ctx.beginPath();
      ctx.roundRect(paddle.x, paddle.y, paddle.w, paddle.h, 7);
      ctx.fill();

      // Desenha Bola
      ctx.fillStyle = "#FFFFFF";
      ctx.shadowColor = "#00F5D4";
      ctx.shadowBlur = 14;
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      canvas.removeEventListener("pointermove", onPointerMove);
    };
  }, []);

  return (
    <div className="relative w-full h-[640px] bg-[#07060B] flex flex-col justify-between font-mono text-white select-none overflow-hidden">
      {/* HUD Superior */}
      <div className="relative z-20 flex items-center justify-between px-6 py-4 bg-black/60 border-b border-[#FFB800]/30">
        <div>
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#FFB800] block">
            {"// ARKANOID SCORE"}
          </span>
          <span className="text-2xl font-black text-white">
            {String(score).padStart(6, "0")}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs text-zinc-400 hidden sm:inline">
            MOVA COM MOUSE / TOUCH OU [A / D]
          </span>
          <div className="px-3 py-1.5 rounded-lg bg-[#FFB800]/10 border border-[#FFB800]/30 text-[#FFB800] text-xs font-bold">
            VIDAS: {lives}
          </div>
        </div>
      </div>

      {/* Área do Canvas */}
      <div className="relative flex-1 flex items-center justify-center p-4">
        <canvas
          ref={canvasRef}
          className="w-full max-w-[760px] h-full max-h-[500px] rounded-2xl border border-white/10 shadow-[0_0_50px_rgba(255,184,0,0.08)] cursor-ew-resize"
        />

        {status !== "PLAYING" && (
          <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/75 backdrop-blur-sm p-6">
            <div className="max-w-md w-full rounded-3xl bg-[#110F18] border border-[#FFB800]/40 p-8 text-center shadow-[0_0_60px_rgba(255,184,0,0.18)]">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFB800]/15 text-[#FFB800] text-[10px] uppercase tracking-widest mb-3">
                <Zap className="w-3.5 h-3.5" /> Física Vetorial 2D
              </span>
              <h3 className="text-3xl font-black uppercase tracking-tight text-white mb-2">
                PULSE <span className="text-[#FFB800]">ARKANOID</span>
              </h3>
              <p className="text-xs text-zinc-400 mb-6 leading-relaxed">
                {status === "READY"
                  ? "Destrua a muralha de blocos neon controlando o ângulo de deflexão da barra magnética."
                  : status === "WON"
                  ? `Muralha demolida! Pontuação final: ${score} PTS.`
                  : `Sinal encerrado. Pontuação atingida: ${score} PTS.`}
              </p>
              <button
                type="button"
                onClick={() => restartRef.current()}
                className="w-full py-4 rounded-xl bg-[#FFB800] hover:bg-[#ffc633] text-zinc-950 font-black text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(255,184,0,0.4)]"
              >
                <RotateCcw className="w-4 h-4" />
                {status === "READY" ? "Lançar Esfera" : "Jogar Novamente"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// =========================================================
// COMPONENTE PRINCIPAL DO GABINETE ARCADE
// =========================================================
export default function ArcadeCabinetHub() {
  const [selectedGame, setSelectedGame] = useState<GameId>("voxelvaders");
  const [bootPhase, setBootPhase] = useState<BootPhase>("RUNNING");
  const [crtScanlines, setCrtScanlines] = useState(true);
  const [isMuted, setIsMuted] = useState(arcadeSynth.getMuted());
  const bootTimersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const activeSpec = CARTRIDGES.find((c) => c.id === selectedGame)!;

  useEffect(
    () => () => {
      bootTimersRef.current.forEach(clearTimeout);
    },
    []
  );

  const handleSelectCartridge = (id: GameId) => {
    if (id === selectedGame || bootPhase !== "RUNNING") return;
    bootTimersRef.current.forEach(clearTimeout);
    bootTimersRef.current = [];

    setSelectedGame(id);
    setBootPhase("INSERTING");
    arcadeSynth.unlock();

    bootTimersRef.current.push(
      setTimeout(() => arcadeSynth.playCartridgeInsert(), 220),
      setTimeout(() => {
        setBootPhase("CRT_WARMUP");
        arcadeSynth.playCoinUp();
      }, 580),
      setTimeout(() => {
        setBootPhase("RUNNING");
        bootTimersRef.current = [];
      }, 1050)
    );
  };

  const toggleAudio = () => {
    const nextMuted = !isMuted;
    arcadeSynth.setMuted(nextMuted);
    setIsMuted(nextMuted);
    if (!nextMuted) arcadeSynth.playCoinUp();
  };

  return (
    <div className="w-full bg-[#0B0A10] text-zinc-100 p-4 sm:p-6 font-sans select-none">
      {/* Moldura Externa do Gabinete */}
      <div className="max-w-5xl mx-auto rounded-[2rem] bg-gradient-to-b from-[#171522] via-[#0E0D15] to-[#09080D] border-2 border-zinc-800/90 shadow-[0_25px_90px_rgba(0,0,0,0.85)] overflow-hidden">
        
        {/* 1. MARQUEE ILUMINADO DO FLIPERAMA (DECK DE CARTUCHOS) */}
        <div className="relative p-5 sm:p-6 bg-[#07060B] border-b-2 border-zinc-800/90 overflow-hidden">
          <div
            className="absolute -top-20 left-1/2 -translate-x-1/2 w-96 h-36 rounded-full blur-[90px] opacity-25 pointer-events-none transition-colors duration-500"
            style={{ backgroundColor: activeSpec.accentHex }}
          />

          <div className="relative z-10 grid grid-cols-1 items-center gap-6 lg:grid-cols-12">
            <div className="flex items-center gap-3.5 lg:col-span-4">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center border border-white/15 shadow-lg transition-colors"
                style={{
                  backgroundColor: `${activeSpec.accentHex}15`,
                  color: activeSpec.accentHex,
                }}
              >
                <Gamepad2 className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#FFB800]">
                    PULSEDECK V2.6
                  </span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-[9px] font-bold">
                    ROM LOCK
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white">
                  Deck de Cartuchos
                </h2>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center lg:col-span-3">
              <div className="relative flex h-24 w-52 flex-col items-center justify-end">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedGame}
                    initial={{ y: -68, scale: 1.04, opacity: 0 }}
                    animate={{
                      y: bootPhase === "INSERTING" ? -6 : 14,
                      scale: 1,
                      opacity: 1,
                    }}
                    exit={{
                      y: -75,
                      opacity: 0,
                      transition: { duration: 0.14 },
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 420,
                      damping: 22,
                      mass: 1.1,
                    }}
                    className="relative z-10 flex h-20 w-44 flex-col justify-between rounded-t-xl border-2 border-zinc-700 bg-gradient-to-b from-zinc-800 via-zinc-900 to-zinc-950 px-3 pb-4 pt-2 shadow-2xl"
                    style={{
                      borderColor:
                        bootPhase === "RUNNING"
                          ? `${activeSpec.accentHex}88`
                          : "#3F3F46",
                    }}
                  >
                    <div className="flex items-center justify-between gap-1 opacity-40">
                      <span className="h-1 flex-1 rounded-full bg-zinc-500" />
                      <span className="h-1 flex-1 rounded-full bg-zinc-500" />
                      <span className="h-1 flex-1 rounded-full bg-zinc-500" />
                    </div>
                    <div
                      className="flex items-center justify-between rounded-md border border-white/10 px-2.5 py-1.5"
                      style={{
                        background: `linear-gradient(135deg, ${activeSpec.accentHex}28, #09080D)`,
                      }}
                    >
                      <div className="min-w-0 truncate pr-2">
                        <span className="block font-mono text-[8px] uppercase tracking-widest text-zinc-300">
                          {activeSpec.code}
                        </span>
                        <span className="mt-0.5 block truncate text-[11px] font-black uppercase text-white">
                          {activeSpec.title}
                        </span>
                      </div>
                      <span
                        aria-hidden
                        className="h-2 w-2 shrink-0 animate-pulse rounded-full"
                        style={{
                          backgroundColor: activeSpec.accentHex,
                          boxShadow: `0 0 8px ${activeSpec.accentHex}`,
                        }}
                      />
                    </div>
                    <div
                      aria-hidden
                      className="flex justify-center gap-1 opacity-70"
                    >
                      {Array.from({ length: 12 }, (_, index) => (
                        <span
                          key={index}
                          className="h-1.5 w-1 rounded-t bg-amber-400/80"
                        />
                      ))}
                    </div>
                  </motion.div>
                </AnimatePresence>

                <div className="relative z-20 flex h-6 w-52 items-center justify-between rounded-xl border-2 border-zinc-700/90 bg-gradient-to-b from-zinc-900 to-black px-3 shadow-[0_-6px_18px_rgba(0,0,0,0.9)]">
                  <span className="font-mono text-[8px] uppercase tracking-widest text-zinc-500">
                    BUS // 64-BIT
                  </span>
                  <motion.span
                    aria-hidden
                    animate={{
                      opacity: bootPhase === "INSERTING" ? [0, 1, 0] : 0.7,
                      scaleX: bootPhase === "INSERTING" ? [0.4, 1.2, 1] : 1,
                    }}
                    transition={{ duration: 0.35 }}
                    className="h-1 w-16 rounded-full"
                    style={{
                      backgroundColor: activeSpec.accentHex,
                      boxShadow: `0 0 12px ${activeSpec.accentHex}`,
                    }}
                  />
                  <span className="font-mono text-[8px] font-bold uppercase text-emerald-400">
                    {bootPhase === "RUNNING" ? "LOCKED" : "SYNC..."}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 lg:col-span-5">
              {CARTRIDGES.map((cart) => {
                const isSelected = cart.id === selectedGame;
                return (
                  <button
                    key={cart.id}
                    type="button"
                    disabled={bootPhase !== "RUNNING"}
                    onClick={() => handleSelectCartridge(cart.id)}
                    className={`group relative flex items-center justify-between gap-3 rounded-2xl border px-4 py-3 text-left transition-all disabled:cursor-wait ${
                      isSelected
                        ? "bg-zinc-900/95 border-white/40 shadow-[0_0_30px_rgba(255,255,255,0.08)]"
                        : "bg-zinc-950/60 border-zinc-800/80 opacity-65 hover:opacity-100 hover:border-zinc-700"
                    }`}
                  >
                    <div>
                      <span className="block font-mono text-[9px] uppercase tracking-widest text-zinc-400">
                        {cart.code}
                      </span>
                      <span className="mt-0.5 block truncate text-xs font-black uppercase text-white sm:text-sm">
                        {cart.title}
                      </span>
                      <span className="mt-0.5 block font-mono text-[10px] text-zinc-500">
                        {isSelected ? "● INSERIDO NO SLOT" : "CLIQUE P/ INSERIR"}
                      </span>
                    </div>

                    <div
                      className="w-3 h-8 rounded-full transition-all"
                      style={{
                        backgroundColor: isSelected ? cart.accentHex : "#27272A",
                        boxShadow: isSelected ? `0 0 12px ${cart.accentHex}` : "none",
                      }}
                    />
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* 2. BEZEL DO MONITOR CRT & TELA DO JOGO */}
        <div className="bg-[#0B0A10] p-3 sm:p-5">
          <div className="relative flex min-h-[640px] items-center justify-center overflow-hidden rounded-2xl border-4 border-[#1C1926] bg-black shadow-inner">
            
            {/* Efeito opcional de Scanlines CRT por cima do Canvas */}
            {crtScanlines && (
              <div
                className="pointer-events-none absolute inset-0 z-40 opacity-20"
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.45) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.03), rgba(0, 255, 0, 0.01), rgba(0, 0, 255, 0.03))",
                  backgroundSize: "100% 4px, 6px 100%",
                }}
              />
            )}

            <AnimatePresence mode="wait">
              {bootPhase !== "RUNNING" ? (
                <motion.div
                  key="crt-boot-screen"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, transition: { duration: 0.15 } }}
                  aria-live="polite"
                  className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-[#050408] p-6 font-mono"
                >
                  <motion.div
                    initial={{ width: "0%", height: "2px", opacity: 0.4 }}
                    animate={
                      bootPhase === "INSERTING"
                        ? { width: "65%", height: "3px", opacity: 1 }
                        : { width: "100%", height: "100%", opacity: [1, 0.2] }
                    }
                    transition={{ duration: 0.38, ease: "easeOut" }}
                    className="rounded-full"
                    style={{
                      backgroundColor: activeSpec.accentHex,
                      boxShadow: `0 0 40px ${activeSpec.accentHex}`,
                    }}
                  />
                  <div className="mt-6 space-y-1 text-center">
                    <p
                      className="text-xs font-bold uppercase tracking-[0.3em]"
                      style={{ color: activeSpec.accentHex }}
                    >
                      {bootPhase === "INSERTING"
                        ? "ACOPLANDO CARTUCHO NO BARRAMENTO..."
                        : `BOOTING ${activeSpec.title} // ${activeSpec.engine}`}
                    </p>
                    <p className="text-[10px] uppercase tracking-widest text-zinc-500">
                      VRAM CHECK: OK • AUDIO SYNTH: READY
                    </p>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key={selectedGame}
                  initial={{
                    scaleY: 0.02,
                    scaleX: 0.85,
                    filter: "brightness(2.5)",
                  }}
                  animate={{ scaleY: 1, scaleX: 1, filter: "brightness(1)" }}
                  transition={{
                    type: "spring",
                    stiffness: 260,
                    damping: 24,
                  }}
                  className="h-full w-full"
                >
                  {selectedGame === "voxelvaders" ? (
                    <VoxelVadersGame embedded />
                  ) : (
                    <PulseArkanoidBuiltIn />
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* 3. PAINEL DE CONTROLE INFERIOR DO GABINETE */}
        <div className="px-6 py-4 bg-[#07060B] border-t border-zinc-800/80 flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
          <div className="flex items-center gap-3">
            <span className={`px-2.5 py-1 rounded border text-[10px] font-bold ${activeSpec.badgeClass}`}>
              CARTUCHO ATIVO: {activeSpec.title}
            </span>
            <span className="text-zinc-500 hidden md:inline">
              {activeSpec.subtitle}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setCrtScanlines((prev) => !prev)}
              className={`px-3 py-1.5 rounded-xl border text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors ${
                crtScanlines
                  ? "bg-[#FFB800]/15 border-[#FFB800]/50 text-[#FFB800]"
                  : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white"
              }`}
            >
              <Tv className="w-3.5 h-3.5" />
              Filtro CRT: {crtScanlines ? "ON" : "OFF"}
            </button>
            <button
              type="button"
              onClick={toggleAudio}
              aria-pressed={!isMuted}
              className={`px-3 py-1.5 rounded-xl border text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors ${
                !isMuted
                  ? "bg-emerald-500/15 border-emerald-500/50 text-emerald-400"
                  : "bg-zinc-900 border-zinc-800 text-zinc-500 hover:text-white"
              }`}
            >
              {!isMuted ? (
                <Volume2 aria-hidden className="h-3.5 w-3.5" />
              ) : (
                <VolumeX aria-hidden className="h-3.5 w-3.5" />
              )}
              Áudio 8-Bit: {!isMuted ? "ON" : "MUTE"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}