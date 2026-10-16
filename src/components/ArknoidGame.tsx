"use client";

import { useEffect, useRef, useState } from "react";

const WIDTH = 900;
const HEIGHT = 500;

export function ArknoidGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [playing, setPlaying] = useState(false);
  const [gameKey, setGameKey] = useState(0);
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState("Use o mouse ou as setas para mover a plataforma.");

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    const colors = ["#38bdf8", "#818cf8", "#a78bfa", "#c084fc", "#f472b6"];
    const bricks = Array.from({ length: 40 }, (_, index) => ({
      x: 82 + (index % 8) * 94,
      y: 62 + Math.floor(index / 8) * 31,
      color: colors[Math.floor(index / 8)],
      visible: true,
    }));
    let paddleX = WIDTH / 2;
    let ballX = WIDTH / 2;
    let ballY = 360;
    let velocityX = 4;
    let velocityY = -4;
    let leftPressed = false;
    let rightPressed = false;
    let frame = 0;

    const onPointerMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      paddleX = ((event.clientX - rect.left) / rect.width) * WIDTH;
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft" || event.key.toLowerCase() === "a") leftPressed = true;
      if (event.key === "ArrowRight" || event.key.toLowerCase() === "d") rightPressed = true;
    };
    const onKeyUp = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft" || event.key.toLowerCase() === "a") leftPressed = false;
      if (event.key === "ArrowRight" || event.key.toLowerCase() === "d") rightPressed = false;
    };

    const draw = () => {
      context.fillStyle = "#080d1a";
      context.fillRect(0, 0, WIDTH, HEIGHT);

      const glow = context.createRadialGradient(WIDTH / 2, 170, 20, WIDTH / 2, 170, 470);
      glow.addColorStop(0, "rgba(37, 99, 235, 0.18)");
      glow.addColorStop(1, "rgba(8, 13, 26, 0)");
      context.fillStyle = glow;
      context.fillRect(0, 0, WIDTH, HEIGHT);

      if (playing) {
        if (leftPressed) paddleX -= 8;
        if (rightPressed) paddleX += 8;
        paddleX = Math.max(55, Math.min(WIDTH - 55, paddleX));
        ballX += velocityX;
        ballY += velocityY;

        if (ballX < 10 || ballX > WIDTH - 10) velocityX *= -1;
        if (ballY < 10) velocityY *= -1;
        if (ballY > HEIGHT - 52 && ballY < HEIGHT - 38 && Math.abs(ballX - paddleX) < 64) {
          velocityY = -Math.abs(velocityY);
          velocityX += (ballX - paddleX) * 0.035;
        }
        if (ballY > HEIGHT + 12) {
          setMessage("A bola caiu. Tente novamente!");
          setPlaying(false);
        }

        for (const brick of bricks) {
          if (brick.visible && ballX > brick.x && ballX < brick.x + 78 && ballY > brick.y && ballY < brick.y + 20) {
            brick.visible = false;
            velocityY *= -1;
            setScore((currentScore) => currentScore + 10);
            break;
          }
        }

        if (bricks.every((brick) => !brick.visible)) {
          setMessage("Você limpou a tela. Mandou bem!");
          setPlaying(false);
        }
      }

      for (const brick of bricks) {
        if (!brick.visible) continue;
        context.fillStyle = brick.color;
        context.shadowColor = brick.color;
        context.shadowBlur = 12;
        context.fillRect(brick.x, brick.y, 78, 20);
      }
      context.shadowBlur = 0;
      context.fillStyle = "#60a5fa";
      context.fillRect(paddleX - 54, HEIGHT - 42, 108, 12);
      context.beginPath();
      context.arc(ballX, ballY, 9, 0, Math.PI * 2);
      context.fillStyle = "#f8fafc";
      context.shadowColor = "#60a5fa";
      context.shadowBlur = 18;
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
  }, [playing, gameKey]);

  const startGame = () => {
    setScore(0);
    setMessage("Boa sorte! Rebata a bola e acerte os blocos.");
    setGameKey((currentKey) => currentKey + 1);
    setPlaying(true);
  };

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
        <p aria-live="polite" className="text-sm text-muted-foreground">{message}</p>
        <p className="text-sm font-bold uppercase tracking-wider text-blue-400">
          Pontos: {score}
        </p>
      </div>
      <canvas
        ref={canvasRef}
        width={WIDTH}
        height={HEIGHT}
        aria-label="Jogo Arknoid. Mova a plataforma com o mouse ou as setas."
        className="w-full rounded-3xl border border-border touch-none"
      />
      <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
        <p className="text-xs text-muted-foreground">
          Controles: mouse, setas do teclado ou A e D.
        </p>
        <button
          type="button"
          onClick={startGame}
          className="rounded-full bg-blue-gradient px-6 py-3 text-sm font-bold text-white shadow-blue-glow transition-transform hover:scale-[1.02]"
        >
          {playing ? "Recomeçar" : "Iniciar jogo"}
        </button>
      </div>
    </div>
  );
}
