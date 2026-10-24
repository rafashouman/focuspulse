"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import { motion, AnimatePresence } from "framer-motion";
import { onAuthStateChanged, signInWithPopup, User } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase/client";
import { saveMatchResult } from "@/app/actions/saveMatchResult";
import { arcadeSynth } from "@/lib/audio/arcadeSynth";
import {
  Trophy,
  Heart,
  Zap,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Crosshair,
  ShieldAlert,
  Sparkles,
  Flame,
  Target,
} from "lucide-react";

interface VoxelVadersProps {
  embedded?: boolean;
  onScoreSubmit?: (score: number, wave: number) => void;
}

export default function VoxelVadersGame({
  embedded = false,
  onScoreSubmit,
}: VoxelVadersProps) {
  const mountRef = useRef<HTMLDivElement | null>(null);

  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [wave, setWave] = useState(1);
  const [killStreak, setKillStreak] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [weaponReady, setWeaponReady] = useState(true);
  const [lastFloatingGain, setLastFloatingGain] = useState<string | null>(null);

  const [gameState, setGameState] = useState<"START" | "PLAYING" | "GAMEOVER">(
    "START"
  );
  const [user, setUser] = useState<User | null>(null);
  const [isSavingScore, setIsSavingScore] = useState(false);
  const [scoreSaved, setScoreSaved] = useState(false);
  const [leaderboardError, setLeaderboardError] = useState("");
  const [finalResult, setFinalResult] = useState({ score: 0, wave: 1 });

  const controlsRef = useRef({
    left: false,
    right: false,
    shoot: false,
  });

  const restartTriggerRef = useRef<() => void>(() => {});

  useEffect(() => {
    return onAuthStateChanged(auth, setUser, (error) => {
      console.error("Unable to observe Firebase Auth state.", error);
      setLeaderboardError("Não foi possível verificar sua sessão.");
    });
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("voxelvaders_highscore");
    const frameId = requestAnimationFrame(() => {
      if (saved) setHighScore(Number.parseInt(saved, 10) || 0);
    });
    return () => cancelAnimationFrame(frameId);
  }, []);

  const updateHighScore = useCallback((newScore: number) => {
    setHighScore((prev) => {
      const best = Math.max(prev, newScore);
      localStorage.setItem("voxelvaders_highscore", String(best));
      return best;
    });
  }, []);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#04020C");
    scene.fog = new THREE.FogExp2("#04020C", 0.022);

    const camera = new THREE.PerspectiveCamera(
      55,
      container.clientWidth / container.clientHeight,
      0.1,
      120
    );
    camera.position.set(0, -17, 21);
    camera.lookAt(0, 1, 0);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.innerHTML = "";
    container.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight("#ffffff", 0.65);
    scene.add(ambientLight);

    const pointLightCyan = new THREE.PointLight("#00F5D4", 4.5, 45);
    pointLightCyan.position.set(-12, -10, 12);
    scene.add(pointLightCyan);

    const pointLightMagenta = new THREE.PointLight("#FF0055", 4.5, 45);
    pointLightMagenta.position.set(12, 12, 10);
    scene.add(pointLightMagenta);

    const gridHelper = new THREE.GridHelper(70, 35, "#FF0055", "#190B33");
    gridHelper.rotation.x = Math.PI / 2;
    gridHelper.position.z = -2;
    scene.add(gridHelper);

    const playerGeo = new THREE.ConeGeometry(1.1, 2.2, 4);
    const playerMat = new THREE.MeshStandardMaterial({
      color: "#00F5D4",
      emissive: "#00F5D4",
      emissiveIntensity: 0.45,
      roughness: 0.2,
      metalness: 0.8,
    });
    const playerMesh = new THREE.Mesh(playerGeo, playerMat);
    playerMesh.rotation.y = Math.PI / 4;
    playerMesh.position.set(0, -11, 0);
    scene.add(playerMesh);

    const invaderGeo = new THREE.OctahedronGeometry(0.85, 0);
    const invaderMatRows = [
      new THREE.MeshStandardMaterial({
        color: "#FF0055",
        emissive: "#FF0055",
        emissiveIntensity: 0.5,
      }),
      new THREE.MeshStandardMaterial({
        color: "#A855F7",
        emissive: "#A855F7",
        emissiveIntensity: 0.4,
      }),
      new THREE.MeshStandardMaterial({
        color: "#00F5D4",
        emissive: "#00F5D4",
        emissiveIntensity: 0.4,
      }),
    ];

    const bulletGeo = new THREE.BoxGeometry(0.24, 0.9, 0.24);
    const playerBulletMat = new THREE.MeshBasicMaterial({ color: "#00F5D4" });
    const enemyBulletMat = new THREE.MeshBasicMaterial({ color: "#FF0055" });
    const particleGeo = new THREE.BoxGeometry(0.22, 0.22, 0.22);

    interface InvaderNode {
      mesh: THREE.Mesh;
      alive: boolean;
      points: number;
    }
    interface BulletNode {
      mesh: THREE.Mesh;
      vy: number;
      fromPlayer: boolean;
    }
    interface ParticleNode {
      mesh: THREE.Mesh;
      vx: number;
      vy: number;
      vz: number;
      life: number;
    }

    let invaders: InvaderNode[] = [];
    let bullets: BulletNode[] = [];
    let particles: ParticleNode[] = [];

    let fleetDir = 1;
    let fleetSpeed = 4.2;
    let lastShotTime = 0;
    let currentScore = 0;
    let currentLives = 3;
    let currentWave = 1;
    let currentStreak = 0;
    let shotsFired = 0;
    let shotsHit = 0;
    let isRunning = false;

    const spawnWave = (waveNumber: number) => {
      invaders.forEach((inv) => scene.remove(inv.mesh));
      invaders = [];

      const rows = 4;
      const cols = 8;
      const spacingX = 2.4;
      const spacingY = 2.1;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const mat = invaderMatRows[r % invaderMatRows.length];
          const mesh = new THREE.Mesh(invaderGeo, mat);
          const startX = (c - (cols - 1) / 2) * spacingX;
          const startY = 9.5 - r * spacingY;
          mesh.position.set(startX, startY, 0);
          scene.add(mesh);

          invaders.push({
            mesh,
            alive: true,
            points: (rows - r) * 150,
          });
        }
      }

      fleetDir = 1;
      fleetSpeed = 4.0 + waveNumber * 1.1;
    };

    const spawnExplosion = (pos: THREE.Vector3, colorHex: string) => {
      const mat = new THREE.MeshBasicMaterial({ color: colorHex });
      for (let i = 0; i < 12; i++) {
        const pMesh = new THREE.Mesh(particleGeo, mat);
        pMesh.position.copy(pos);
        scene.add(pMesh);
        particles.push({
          mesh: pMesh,
          vx: (Math.random() - 0.5) * 11,
          vy: (Math.random() - 0.5) * 11,
          vz: Math.random() * 6,
          life: 0.45,
        });
      }
    };

    const resetAndStartGame = () => {
      bullets.forEach((b) => scene.remove(b.mesh));
      particles.forEach((p) => scene.remove(p.mesh));
      bullets = [];
      particles = [];

      currentScore = 0;
      currentLives = 3;
      currentWave = 1;
      currentStreak = 0;
      shotsFired = 0;
      shotsHit = 0;
      playerMesh.position.set(0, -11, 0);

      setScore(0);
      setLives(3);
      setWave(1);
      setKillStreak(0);
      setAccuracy(100);
      setGameState("PLAYING");
      arcadeSynth.playCoinUp();
      setScoreSaved(false);
      setLeaderboardError("");
      setFinalResult({ score: 0, wave: 1 });

      spawnWave(1);
      isRunning = true;
    };

    restartTriggerRef.current = resetAndStartGame;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A")
        controlsRef.current.left = true;
      if (e.key === "ArrowRight" || e.key === "d" || e.key === "D")
        controlsRef.current.right = true;
      if (e.key === " ") {
        e.preventDefault();
        controlsRef.current.shoot = true;
      }
    };

    const onKeyUp = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A")
        controlsRef.current.left = false;
      if (e.key === "ArrowRight" || e.key === "d" || e.key === "D")
        controlsRef.current.right = false;
      if (e.key === " ") controlsRef.current.shoot = false;
    };

    const onResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("resize", onResize);

    let animationFrameId: number;
    let prevTime = performance.now();

    const animate = (now: number) => {
      animationFrameId = requestAnimationFrame(animate);
      const dt = Math.min((now - prevTime) / 1000, 0.1);
      prevTime = now;

      gridHelper.position.y = ((now * 0.004) % 2) - 1;

      if (isRunning) {
        const moveSpeed = 16;
        if (controlsRef.current.left) {
          playerMesh.position.x = Math.max(
            -12,
            playerMesh.position.x - moveSpeed * dt
          );
          playerMesh.rotation.z = THREE.MathUtils.lerp(
            playerMesh.rotation.z,
            0.35,
            0.15
          );
        } else if (controlsRef.current.right) {
          playerMesh.position.x = Math.min(
            12,
            playerMesh.position.x + moveSpeed * dt
          );
          playerMesh.rotation.z = THREE.MathUtils.lerp(
            playerMesh.rotation.z,
            -0.35,
            0.15
          );
        } else {
          playerMesh.rotation.z = THREE.MathUtils.lerp(
            playerMesh.rotation.z,
            0,
            0.15
          );
        }

        const cooldownElapsed = now - lastShotTime > 240;
        setWeaponReady(cooldownElapsed);

        if (controlsRef.current.shoot && cooldownElapsed) {
          const bMesh = new THREE.Mesh(bulletGeo, playerBulletMat);
          bMesh.position.set(
            playerMesh.position.x,
            playerMesh.position.y + 1.3,
            0
          );
          scene.add(bMesh);
          bullets.push({ mesh: bMesh, vy: 26, fromPlayer: true });
          shotsFired += 1;
          setAccuracy(Math.min(100, Math.round((shotsHit / shotsFired) * 100)));
          arcadeSynth.playLaser();
          lastShotTime = now;
        }

        let hitEdge = false;
        const aliveInvaders = invaders.filter((i) => i.alive);

        for (const inv of aliveInvaders) {
          inv.mesh.position.x += fleetDir * fleetSpeed * dt;
          inv.mesh.rotation.y += 2.2 * dt;
          inv.mesh.rotation.x += 1.1 * dt;

          if (inv.mesh.position.x > 12.2 || inv.mesh.position.x < -12.2) {
            hitEdge = true;
          }
        }

        if (hitEdge) {
          fleetDir *= -1;
          for (const inv of aliveInvaders) {
            inv.mesh.position.y -= 0.85;
            if (inv.mesh.position.y <= playerMesh.position.y + 1.2) {
              isRunning = false;
              setGameState("GAMEOVER");
              updateHighScore(currentScore);
              setFinalResult({ score: currentScore, wave: currentWave });
              onScoreSubmit?.(currentScore, currentWave);
              break;
            }
          }
        }

        if (
          aliveInvaders.length > 0 &&
          Math.random() < 0.025 * (1 + currentWave * 0.2)
        ) {
          const shooter =
            aliveInvaders[Math.floor(Math.random() * aliveInvaders.length)];
          const ebMesh = new THREE.Mesh(bulletGeo, enemyBulletMat);
          ebMesh.position.copy(shooter.mesh.position);
          scene.add(ebMesh);
          bullets.push({ mesh: ebMesh, vy: -13, fromPlayer: false });
        }

        for (let i = bullets.length - 1; i >= 0; i--) {
          const b = bullets[i];
          b.mesh.position.y += b.vy * dt;

          if (b.mesh.position.y > 15 || b.mesh.position.y < -15) {
            if (b.fromPlayer) {
              currentStreak = 0;
              setKillStreak(0);
            }
            scene.remove(b.mesh);
            bullets.splice(i, 1);
            continue;
          }

          if (b.fromPlayer) {
            for (const inv of aliveInvaders) {
              if (b.mesh.position.distanceTo(inv.mesh.position) < 1.05) {
                inv.alive = false;
                scene.remove(inv.mesh);
                scene.remove(b.mesh);
                bullets.splice(i, 1);

                shotsHit += 1;
                currentStreak += 1;
                setKillStreak(currentStreak);
                setAccuracy(
                  Math.min(100, Math.round((shotsHit / Math.max(1, shotsFired)) * 100))
                );

                const bonus = inv.points + Math.min(currentStreak * 25, 250);
                currentScore += bonus;
                setScore(currentScore);
                setLastFloatingGain(`+${bonus} PTS`);

                spawnExplosion(inv.mesh.position, "#FF0055");
                arcadeSynth.playExplosion();
                break;
              }
            }
          } else {
            if (b.mesh.position.distanceTo(playerMesh.position) < 1.15) {
              scene.remove(b.mesh);
              bullets.splice(i, 1);
              spawnExplosion(playerMesh.position, "#00F5D4");
              arcadeSynth.playExplosion();

              currentLives -= 1;
              currentStreak = 0;
              setLives(currentLives);
              setKillStreak(0);

              if (currentLives <= 0) {
                isRunning = false;
                setGameState("GAMEOVER");
                updateHighScore(currentScore);
                setFinalResult({ score: currentScore, wave: currentWave });
                onScoreSubmit?.(currentScore, currentWave);
              }
            }
          }
        }

        if (invaders.length > 0 && invaders.every((inv) => !inv.alive)) {
          currentWave += 1;
          setWave(currentWave);
          arcadeSynth.playCoinUp();
          spawnWave(currentWave);
        }
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.mesh.position.x += p.vx * dt;
        p.mesh.position.y += p.vy * dt;
        p.mesh.position.z += p.vz * dt;
        p.life -= dt;
        p.mesh.scale.setScalar(Math.max(0.01, p.life * 2));

        if (p.life <= 0) {
          scene.remove(p.mesh);
          particles.splice(i, 1);
        }
      }

      renderer.render(scene, camera);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("resize", onResize);
      playerGeo.dispose();
      playerMat.dispose();
      invaderGeo.dispose();
      bulletGeo.dispose();
      particleGeo.dispose();
      renderer.dispose();
    };
  }, [onScoreSubmit, updateHighScore]);

  const handleLeaderboardLogin = async () => {
    setLeaderboardError("");
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Unable to sign in to submit Voxel Vaders score.", error);
      setLeaderboardError("Não foi possível entrar com o Google.");
    }
  };

  const handleScoreSubmit = async () => {
    if (!user) {
      setLeaderboardError("Entre com Google para registrar sua pontuação.");
      return;
    }

    setIsSavingScore(true);
    setLeaderboardError("");
    try {
      const idToken = await user.getIdToken(true);
      const result = await saveMatchResult(
        {
          gameId: "voxelvaders",
          score: finalResult.score,
          wave: finalResult.wave,
        },
        idToken
      );

      if (result.success) {
        setScoreSaved(true);
      } else {
        setLeaderboardError(result.error);
      }
    } catch (error) {
      console.error("Unable to submit Voxel Vaders score.", error);
      setLeaderboardError("Não foi possível salvar a pontuação.");
    } finally {
      setIsSavingScore(false);
    }
  };

  return (
    <div
      className={`relative w-full ${
        embedded ? "h-[640px]" : "min-h-screen"
      } bg-[#04020C] text-white font-mono overflow-hidden flex flex-col justify-between select-none`}
    >
      {/* Alerta de Escudo Crítico quando resta 1 vida */}
      {lives === 1 && gameState === "PLAYING" && (
        <div className="pointer-events-none absolute inset-0 z-20 border-4 border-red-500/50 animate-pulse" />
      )}

      {/* 1. HUD TELEMETRY SUPERIOR */}
      <div className="relative z-20 flex flex-wrap items-center justify-between gap-4 px-5 py-3.5 bg-[#04020C]/85 backdrop-blur-md border-b border-[#FF0055]/30">
        <div className="flex items-center gap-5">
          <div>
            <span className="text-[9px] uppercase tracking-[0.25em] text-[#FF0055] block">
              {"// SCORE ATUAL"}
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-[#00F5D4] drop-shadow-[0_0_10px_rgba(0,245,212,0.5)]">
                {String(score).padStart(6, "0")}
              </span>
              {lastFloatingGain && (
                <span className="text-[10px] font-bold text-amber-400">
                  {lastFloatingGain}
                </span>
              )}
            </div>
          </div>

          <div className="hidden sm:block border-l border-white/10 pl-5">
            <span className="text-[9px] uppercase tracking-[0.25em] text-purple-400 flex items-center gap-1">
              <Trophy className="w-3 h-3" /> RECORDE
            </span>
            <span className="text-base font-bold text-white">
              {String(highScore).padStart(6, "0")}
            </span>
          </div>

          <div className="hidden md:block border-l border-white/10 pl-5">
            <span className="text-[9px] uppercase tracking-[0.25em] text-amber-400 flex items-center gap-1">
              <Flame className="w-3 h-3" /> STREAK / MIRA
            </span>
            <span className="text-base font-bold text-white">
              {killStreak}x{" "}
              <span className="text-xs text-[#00F5D4]">({accuracy}%)</span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Indicador de Plasma / Arma */}
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-[9px] uppercase tracking-widest text-zinc-400 flex items-center gap-1">
              <Target className="w-3 h-3 text-[#00F5D4]" /> CANHÃO PLASMA
            </span>
            <span
              className={`text-[10px] font-bold ${
                weaponReady ? "text-[#00F5D4]" : "text-amber-400"
              }`}
            >
              {weaponReady ? "● PRONTO" : "RECARREGANDO"}
            </span>
          </div>

          <div className="text-right">
            <span className="text-[9px] uppercase tracking-[0.25em] text-purple-400 block">
              WAVE
            </span>
            <span className="text-lg font-black text-white">0{wave}</span>
          </div>

          <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-2 rounded-xl">
            {[1, 2, 3].map((heartIndex) => (
              <Heart
                key={heartIndex}
                className={`w-4 h-4 transition-all ${
                  heartIndex <= lives
                    ? "text-[#FF0055] fill-[#FF0055] drop-shadow-[0_0_8px_#FF0055]"
                    : "text-white/20"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* 2. CANVAS THREE.JS */}
      <div ref={mountRef} className="absolute inset-0 z-10 w-full h-full" />

      {/* 3. OVERLAYS DE INÍCIO E GAME OVER */}
      <AnimatePresence>
        {gameState !== "PLAYING" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative z-30 flex-1 flex items-center justify-center p-6 bg-[#04020C]/75 backdrop-blur-md"
          >
            <div className="max-w-md w-full rounded-3xl bg-[#0D0620]/95 border border-[#FF0055]/40 p-8 text-center shadow-[0_0_70px_rgba(255,0,85,0.2)]">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF0055]/15 border border-[#FF0055]/40 text-[#FF0055] text-[11px] uppercase tracking-widest mb-4">
                <Sparkles className="w-3.5 h-3.5" /> WebGL Three.js Arcade
              </div>

              <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tighter text-white mb-2">
                VOXEL<span className="text-[#00F5D4]">VADERS</span>
              </h2>

              <p className="text-xs text-purple-200/70 leading-relaxed mb-6">
                {gameState === "START"
                  ? "Defenda a grade orbital contra o enxame de octaedros. Use [A/D] ou [Setas] para manobrar e [ESPAÇO] para disparar."
                  : `Defesa rompida na Wave 0${wave}. Pontuação final: ${score} PTS (Precisão: ${accuracy}%).`}
              </p>

              {gameState === "GAMEOVER" && (
                <div className="mb-5 space-y-3">
                  {scoreSaved ? (
                    <p role="status" className="text-sm font-bold text-[#00F5D4]">
                      Pontuação registrada no leaderboard!
                    </p>
                  ) : (
                    <>
                      {user ? (
                        <button
                          type="button"
                          onClick={() => void handleScoreSubmit()}
                          disabled={isSavingScore}
                          className="w-full rounded-xl border border-[#00F5D4]/60 px-4 py-3 text-xs font-bold uppercase tracking-wider text-[#00F5D4] transition-colors hover:bg-[#00F5D4]/10 disabled:opacity-50"
                        >
                          {isSavingScore
                            ? "Salvando pontuação..."
                            : "Registrar no leaderboard"}
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => void handleLeaderboardLogin()}
                          className="w-full rounded-xl border border-[#00F5D4]/60 px-4 py-3 text-xs font-bold uppercase tracking-wider text-[#00F5D4] transition-colors hover:bg-[#00F5D4]/10"
                        >
                          Entrar com Google para salvar
                        </button>
                      )}
                      {leaderboardError && (
                        <p role="alert" className="text-xs text-red-300">
                          {leaderboardError}
                        </p>
                      )}
                    </>
                  )}
                </div>
              )}

              <button
                type="button"
                onClick={() => restartTriggerRef.current()}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-[#FF0055] to-purple-600 hover:from-[#ff1a66] hover:to-purple-500 text-white font-black text-xs uppercase tracking-[0.2em] shadow-[0_0_30px_rgba(255,0,85,0.4)] transition-all flex items-center justify-center gap-2"
              >
                {gameState === "START" ? (
                  <>
                    <Zap className="w-4 h-4" /> Iniciar Interceptação
                  </>
                ) : (
                  <>
                    <RotateCcw className="w-4 h-4" /> Reiniciar Sistema
                  </>
                )}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 4. CONTROLES TÁTEIS MOBILE / MOUSE BAR */}
      <div className="relative z-20 px-6 py-4 bg-[#04020C]/85 border-t border-white/10 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onPointerDown={() => (controlsRef.current.left = true)}
            onPointerUp={() => (controlsRef.current.left = false)}
            onPointerLeave={() => (controlsRef.current.left = false)}
            className="w-14 h-12 rounded-xl bg-white/5 active:bg-[#00F5D4] active:text-black border border-white/15 flex items-center justify-center transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            type="button"
            onPointerDown={() => (controlsRef.current.right = true)}
            onPointerUp={() => (controlsRef.current.right = false)}
            onPointerLeave={() => (controlsRef.current.right = false)}
            className="w-14 h-12 rounded-xl bg-white/5 active:bg-[#00F5D4] active:text-black border border-white/15 flex items-center justify-center transition-colors"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        <span className="hidden md:flex items-center gap-2 text-[11px] text-purple-300/60">
          <ShieldAlert className="w-4 h-4 text-[#00F5D4]" />
          TECLADO: [A / D] MOVER • [ESPAÇO] LASER
        </span>

        <button
          type="button"
          onPointerDown={() => (controlsRef.current.shoot = true)}
          onPointerUp={() => (controlsRef.current.shoot = false)}
          onPointerLeave={() => (controlsRef.current.shoot = false)}
          className="px-6 h-12 rounded-xl bg-[#FF0055]/20 active:bg-[#FF0055] border border-[#FF0055] text-[#FF0055] active:text-white font-black text-xs uppercase tracking-widest flex items-center gap-2 transition-colors shadow-[0_0_20px_rgba(255,0,85,0.25)]"
        >
          <Crosshair className="w-4 h-4" /> FIRE
        </button>
      </div>
    </div>
  );
}