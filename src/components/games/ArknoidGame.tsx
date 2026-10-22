"use client";

import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import {
  Play,
  RotateCcw,
  Trophy,
  Sparkles,
  Pause,
  Heart,
  Zap,
} from "lucide-react";
import { trackAnalyticsEvent } from "@/lib/firebase";

const WIDTH = 900;
const HEIGHT = 520;
const HIGH_SCORE_KEY = "focuspulse_arknoid_highscore";

function subscribeToHighScore(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener("focuspulse:arknoid-high-score", callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("focuspulse:arknoid-high-score", callback);
  };
}

function getHighScoreSnapshot() {
  const storedScore = Number(window.localStorage.getItem(HIGH_SCORE_KEY));
  return Number.isFinite(storedScore) && storedScore > 0 ? storedScore : 0;
}

function getServerHighScoreSnapshot() {
  return 0;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  color: string;
  size: number;
}

export function ArknoidGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const currentScoreRef = useRef(0);
  const gameStartedAtRef = useRef<number | null>(null);
  const [playing, setPlaying] = useState(false);
  const [paused, setPaused] = useState(false);
  const [gameKey, setGameKey] = useState(0);
  const [score, setScore] = useState(0);
  const highScore = useSyncExternalStore(
    subscribeToHighScore,
    getHighScoreSnapshot,
    getServerHighScoreSnapshot
  );
  const [lives, setLives] = useState(3);
  const [combo, setCombo] = useState(1);
  const [message, setMessage] = useState(
    "Mova o cursor ou use A / D e as setas para controlar o rebatedor."
  );

  useEffect(() => {
    if (score > highScore) {
      localStorage.setItem(HIGH_SCORE_KEY, String(score));
      window.dispatchEvent(new Event("focuspulse:arknoid-high-score"));
      trackAnalyticsEvent({
        eventName: "game_high_score",
        appId: "arknoid",
        score,
      });
    }
  }, [score, highScore]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    const colors = ["#38bdf8", "#818cf8", "#a78bfa", "#c084fc", "#e879f9"];
    const bricks = Array.from({ length: 40 }, (_, index) => ({
      x: 78 + (index % 8) * 95,
      y: 68 + Math.floor(index / 8) * 32,
      color: colors[Math.floor(index / 8)],
      visible: true,
    }));

    let paddleX = WIDTH / 2;
    let ballX = WIDTH / 2;
    let ballY = 380;
    let velocityX = 4.3;
    let velocityY = -4.3;
    let leftPressed = false;
    let rightPressed = false;
    let currentLives = 3;
    let currentCombo = 1;
    let frame = 0;

    const trail: { x: number; y: number }[] = [];
    const particles: Particle[] = [];

    const spawnParticles = (x: number, y: number, color: string) => {
      for (let i = 0; i < 12; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 1.5 + Math.random() * 3.5;
        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          alpha: 1,
          color,
          size: 2 + Math.random() * 2.5,
        });
      }
    };

    const onPointerMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      paddleX = ((event.clientX - rect.left) / rect.width) * WIDTH;
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft" || event.key.toLowerCase() === "a")
        leftPressed = true;
      if (event.key === "ArrowRight" || event.key.toLowerCase() === "d")
        rightPressed = true;
      if (event.key.toLowerCase() === "p" && playing) {
        setPaused((prev) => !prev);
      }
    };

    const onKeyUp = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft" || event.key.toLowerCase() === "a")
        leftPressed = false;
      if (event.key === "ArrowRight" || event.key.toLowerCase() === "d")
        rightPressed = false;
    };

    const drawRoundedRect = (
      x: number,
      y: number,
      w: number,
      h: number,
      r: number
    ) => {
      context.beginPath();
      context.roundRect(x, y, w, h, r);
      context.fill();
    };

    const draw = () => {
      // Fundo escuro profundo estilo FocusPulse
      context.fillStyle = "#080a12";
      context.fillRect(0, 0, WIDTH, HEIGHT);

      // Grade sutil no canvas
      context.strokeStyle = "rgba(148, 163, 184, 0.045)";
      context.lineWidth = 1;
      for (let gx = 0; gx < WIDTH; gx += 45) {
        context.beginPath();
        context.moveTo(gx, 0);
        context.lineTo(gx, HEIGHT);
        context.stroke();
      }
      for (let gy = 0; gy < HEIGHT; gy += 45) {
        context.beginPath();
        context.moveTo(0, gy);
        context.lineTo(WIDTH, gy);
        context.stroke();
      }

      // Glow radial central
      const glow = context.createRadialGradient(
        WIDTH / 2,
        160,
        20,
        WIDTH / 2,
        160,
        480
      );
      glow.addColorStop(0, "rgba(139, 92, 246, 0.2)");
      glow.addColorStop(1, "rgba(8, 10, 18, 0)");
      context.fillStyle = glow;
      context.fillRect(0, 0, WIDTH, HEIGHT);

      if (playing && !paused) {
        if (leftPressed) paddleX -= 8.5;
        if (rightPressed) paddleX += 8.5;
        paddleX = Math.max(62, Math.min(WIDTH - 62, paddleX));

        ballX += velocityX;
        ballY += velocityY;

        trail.push({ x: ballX, y: ballY });
        if (trail.length > 10) trail.shift();

        // Colisão com paredes laterais e topo
        if (ballX < 12 || ballX > WIDTH - 12) velocityX *= -1;
        if (ballY < 12) velocityY *= -1;

        // Colisão com a plataforma (rebatedor)
        if (
          ballY > HEIGHT - 54 &&
          ballY < HEIGHT - 36 &&
          Math.abs(ballX - paddleX) < 66
        ) {
          velocityY = -Math.abs(velocityY);
          velocityX += (ballX - paddleX) * 0.04;
          currentCombo = 1;
          setCombo(1);
          spawnParticles(ballX, HEIGHT - 44, "#a78bfa");
        }

        // Queda da bola
        if (ballY > HEIGHT + 14) {
          currentLives -= 1;
          setLives(currentLives);
          currentCombo = 1;
          setCombo(1);

          if (currentLives <= 0) {
            setMessage("Fim de jogo! Clique em Recomeçar para tentar um novo recorde.");
            trackAnalyticsEvent({
              eventName: "game_end",
              appId: "arknoid",
              score: currentScoreRef.current,
              durationSeconds: Math.round(
                (Date.now() - (gameStartedAtRef.current ?? Date.now())) / 1000
              ),
            });
            setPlaying(false);
          } else {
            ballX = paddleX;
            ballY = 360;
            velocityX = 4 * (Math.random() > 0.5 ? 1 : -1);
            velocityY = -4.3;
            setMessage(`Cuidado! Restam ${currentLives} vidas.`);
          }
        }

        // Colisão com os blocos
        for (const brick of bricks) {
          if (
            brick.visible &&
            ballX > brick.x - 6 &&
            ballX < brick.x + 86 &&
            ballY > brick.y - 6 &&
            ballY < brick.y + 26
          ) {
            brick.visible = false;
            velocityY *= -1;
            const gained = 10 * currentCombo;
            const nextScore = currentScoreRef.current + gained;
            currentScoreRef.current = nextScore;
            setScore(nextScore);
            currentCombo = Math.min(8, currentCombo + 1);
            setCombo(currentCombo);
            spawnParticles(brick.x + 40, brick.y + 10, brick.color);
            break;
          }
        }

        if (bricks.every((brick) => !brick.visible)) {
          setMessage("Parabéns! Você destruiu todos os módulos com perfeição!");
          trackAnalyticsEvent({
            eventName: "game_end",
            appId: "arknoid",
            score: currentScoreRef.current,
            durationSeconds: Math.round(
              (Date.now() - (gameStartedAtRef.current ?? Date.now())) / 1000
            ),
          });
          setPlaying(false);
        }
      }

      // Desenha os blocos com cantos arredondados e neon
      for (const brick of bricks) {
        if (!brick.visible) continue;
        context.fillStyle = brick.color;
        context.shadowColor = brick.color;
        context.shadowBlur = 14;
        drawRoundedRect(brick.x, brick.y, 80, 20, 6);
      }
      context.shadowBlur = 0;

      // Desenha partículas de explosão
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= 0.03;
        if (p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }
        context.save();
        context.globalAlpha = p.alpha;
        context.fillStyle = p.color;
        context.shadowColor = p.color;
        context.shadowBlur = 8;
        context.beginPath();
        context.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        context.fill();
        context.restore();
      }

      // Desenha o rastro da esfera
      trail.forEach((pos, idx) => {
        const ratio = (idx + 1) / trail.length;
        context.beginPath();
        context.arc(pos.x, pos.y, 8 * ratio, 0, Math.PI * 2);
        context.fillStyle = `rgba(192, 132, 252, ${ratio * 0.28})`;
        context.fill();
      });

      // Desenha a plataforma (rebatedor) com gradiente
      const paddleGrad = context.createLinearGradient(
        paddleX - 58,
        0,
        paddleX + 58,
        0
      );
      paddleGrad.addColorStop(0, "#8b5cf6");
      paddleGrad.addColorStop(0.5, "#ec4899");
      paddleGrad.addColorStop(1, "#6366f1");
      context.fillStyle = paddleGrad;
      context.shadowColor = "#a855f7";
      context.shadowBlur = 18;
      drawRoundedRect(paddleX - 58, HEIGHT - 44, 116, 12, 6);

      // Desenha a bola
      context.beginPath();
      context.arc(ballX, ballY, 8.5, 0, Math.PI * 2);
      context.fillStyle = "#ffffff";
      context.shadowColor = "#e879f9";
      context.shadowBlur = 20;
      context.fill();
      context.shadowBlur = 0;

      frame = window.requestAnimationFrame(draw);
    };

    canvas.addEventListener("pointermove", onPointerMove);
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    frame = window.requestAnimationFrame(draw);

    return () => {
      window.cancelAnimationFrame(frame);
      canvas.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, [playing, paused, gameKey]);

  const startGame = () => {
    currentScoreRef.current = 0;
    gameStartedAtRef.current = Date.now();
    setScore(0);
    setLives(3);
    setCombo(1);
    setPaused(false);
    setMessage("Modo Arcade ativo! Mantenha a bola em jogo para multiplicar o combo.");
    setGameKey((currentKey) => currentKey + 1);
    setPlaying(true);
    trackAnalyticsEvent({ eventName: "game_start", appId: "arknoid" });
  };

  return (
    <div className="mx-auto max-w-5xl">
      {/* Moldura de Console FocusPulse */}
      <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-[#0b0e14]/90 shadow-[0_30px_100px_-30px_rgba(0,0,0,0.85)] backdrop-blur-2xl">
        {/* Barra Superior de Telemetria / HUD */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.08] bg-white/[0.02] px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-[#ff6b61]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#ffc14f]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#49c781]" />
            </div>
            <span className="ml-2 rounded-full border border-violet-300/20 bg-violet-400/10 px-3 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-violet-200">
              focuspulse.arcade // v2.0
            </span>
          </div>

          {/* Métricas do Jogo */}
          <div className="flex flex-wrap items-center gap-5">
            {/* Vidas */}
            <div className="flex items-center gap-1.5" aria-label={`Vidas restantes: ${lives}`}>
              {Array.from({ length: 3 }).map((_, i) => (
                <Heart
                  key={i}
                  className={`h-4 w-4 transition-all ${
                    i < lives
                      ? "fill-fuchsia-400 text-fuchsia-400 drop-shadow-[0_0_8px_rgba(232,121,249,0.6)]"
                      : "text-white/15"
                  }`}
                />
              ))}
            </div>

            {/* Multiplicador de Combo */}
            <div className="flex items-center gap-1.5 rounded-full border border-white/10 bg-black/40 px-3 py-1">
              <Zap className="h-3.5 w-3.5 text-amber-300" />
              <span className="font-mono text-xs font-bold text-white">
                {combo}x <span className="font-normal text-white/50">COMBO</span>
              </span>
            </div>

            {/* Pontuação Atual */}
            <div className="flex items-center gap-2 rounded-full border border-violet-300/25 bg-violet-500/10 px-3.5 py-1">
              <Sparkles className="h-3.5 w-3.5 text-violet-300" />
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-violet-100">
                Pontos: {score}
              </span>
            </div>

            {/* Recorde */}
            <div className="hidden items-center gap-1.5 text-xs font-semibold text-white/60 sm:flex">
              <Trophy className="h-3.5 w-3.5 text-amber-400" />
              <span className="font-mono">Recorde: {highScore}</span>
            </div>
          </div>
        </div>

        {/* Área do Canvas + Overlay Interativo */}
        <div className="relative bg-[#080a12] p-3 sm:p-5">
          <div className="relative overflow-hidden rounded-2xl border border-white/10 shadow-inner">
            <canvas
              ref={canvasRef}
              width={WIDTH}
              height={HEIGHT}
              aria-label="Jogo Arknoid. Mova a plataforma com o mouse ou as setas."
              className="block w-full touch-none"
            />

            {/* Overlay quando parado ou pausado */}
            {(!playing || paused) && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#080a12]/80 p-6 text-center backdrop-blur-md">
                <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-violet-300/30 bg-violet-500/15 px-3.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-violet-200">
                  {paused ? "Jogo Pausado" : "Interactive Canvas Lab"}
                </span>
                <h3 className="font-display text-3xl font-bold uppercase tracking-tight text-white sm:text-4xl">
                  {paused ? "Pausa Estratégica" : "Pulse Arkanoid"}
                </h3>
                <p className="mt-2 max-w-md text-sm text-white/70">{message}</p>

                <div className="mt-6 flex items-center gap-3">
                  {paused ? (
                    <button
                      type="button"
                      onClick={() => setPaused(false)}
                      className="inline-flex items-center gap-2 rounded-full bg-violet-gradient px-6 py-3 text-sm font-bold text-white shadow-violet-glow transition-transform hover:scale-105"
                    >
                      <Play className="h-4 w-4 fill-current" />
                      Continuar Partida
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={startGame}
                      className="inline-flex items-center gap-2 rounded-full bg-violet-gradient px-7 py-3.5 text-sm font-bold text-white shadow-violet-glow transition-transform hover:scale-105"
                    >
                      <Play className="h-4 w-4 fill-current" />
                      {score > 0 ? "Jogar Novamente" : "Iniciar Experimento"}
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Rodapé de Controles */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/[0.08] bg-[#0b0e14] px-6 py-4">
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <span>Controles:</span>
            <kbd className="rounded-md border border-white/15 bg-white/5 px-2 py-0.5 font-mono text-[10px] text-white/80">
              Mouse
            </kbd>
            <kbd className="rounded-md border border-white/15 bg-white/5 px-2 py-0.5 font-mono text-[10px] text-white/80">
              ← →
            </kbd>
            <kbd className="rounded-md border border-white/15 bg-white/5 px-2 py-0.5 font-mono text-[10px] text-white/80">
              A / D
            </kbd>
            <kbd className="rounded-md border border-white/15 bg-white/5 px-2 py-0.5 font-mono text-[10px] text-white/80">
              P (Pausa)
            </kbd>
          </div>

          <div className="flex items-center gap-2.5">
            {playing && (
              <button
                type="button"
                onClick={() => setPaused((p) => !p)}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-semibold text-white/80 transition-colors hover:border-violet-300/30 hover:text-white"
              >
                <Pause className="h-3.5 w-3.5" />
                {paused ? "Retomar" : "Pausar"}
              </button>
            )}
            <button
              type="button"
              onClick={startGame}
              className="inline-flex items-center gap-1.5 rounded-full border border-violet-300/30 bg-violet-500/15 px-4 py-2 text-xs font-bold text-violet-100 transition-colors hover:bg-violet-500/30"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reiniciar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}