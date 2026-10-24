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
  Hand,
} from "lucide-react";

interface VoxelVadersProps {
  embedded?: boolean;
  onScoreSubmit?: (score: number, wave: number) => void;
}

const triggerHaptic = (pattern: number | number[] = 18) => {
  if (typeof navigator !== "undefined" && "vibrate" in navigator) {
    try {
      navigator.vibrate(pattern);
    } catch {
      // Ignora em dispositivos que bloqueiam vibrate
    }
  }
};

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
  const [autoFire, setAutoFire] = useState(false);
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
    autoFire: false,
    touchTargetX: null as number | null,
    isTouchingCanvas: false,
  });

  const restartTriggerRef = useRef<() => void>(() => {});

  useEffect(() => {
    controlsRef.current.autoFire = autoFire;
  }, [autoFire]);

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
    scene.fog = new THREE.FogExp2("#04020C", 0.018);

    const camera = new THREE.PerspectiveCamera(
      55,
      container.clientWidth / container.clientHeight,
      0.1,
      140
    );

    // Função que adapta a distância da câmera para celulares em modo Retrato (Portrait)
    // garantindo que todas as 8 colunas (-12.2 a +12.2) apareçam sem corte!
    const syncCameraToAspect = () => {
      if (!container) return;
      const width = Math.max(1, container.clientWidth);
      const height = Math.max(1, container.clientHeight);
      const aspect = width / height;

      camera.aspect = aspect;
      if (aspect < 0.72) {
        // Celular estreito em pé
        camera.position.set(0, -21.5, 33.5);
        camera.lookAt(0, 0.5, 0);
      } else if (aspect < 1.05) {
        // Tablet vertical ou celular largo
        camera.position.set(0, -19.5, 27.5);
        camera.lookAt(0, 0.8, 0);
      } else {
        // Desktop / Paisagem
        camera.position.set(0, -17, 21);
        camera.lookAt(0, 1, 0);
      }
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.innerHTML = "";
    container.appendChild(renderer.domElement);
    syncCameraToAspect();

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

    const bulletGeo = new THREE.BoxGeometry(0.26, 0.95, 0.26);
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
      controlsRef.current.touchTargetX = null;
      controlsRef.current.isTouchingCanvas = false;

      setScore(0);
      setLives(3);
      setWave(1);
      setKillStreak(0);
      setAccuracy(100);
      setGameState("PLAYING");
      arcadeSynth.unlock();
      arcadeSynth.playCoinUp();
      triggerHaptic(25);
      setScoreSaved(false);
      setLeaderboardError("");
      setFinalResult({ score: 0, wave: 1 });

      spawnWave(1);
      isRunning = true;
    };

    restartTriggerRef.current = resetAndStartGame;

    // Controles de Teclado
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") {
        controlsRef.current.left = true;
        controlsRef.current.touchTargetX = null;
      }
      if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") {
        controlsRef.current.right = true;
        controlsRef.current.touchTargetX = null;
      }
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

    // Controles Touch / Drag Direto no Canvas (Ideal para Mobile!)
    const updateTouchPosition = (clientX: number) => {
      const rect = renderer.domElement.getBoundingClientRect();
      const normX = ((clientX - rect.left) / Math.max(1, rect.width)) * 2 - 1;
      controlsRef.current.touchTargetX = THREE.MathUtils.clamp(
        normX * 12.2,
        -12,
        12
      );
    };

    const onCanvasPointerDown = (e: PointerEvent) => {
      if (!isRunning) return;
      if (e.pointerType === "touch") {
        controlsRef.current.isTouchingCanvas = true;
        updateTouchPosition(e.clientX);
      }
    };

    const onCanvasPointerMove = (e: PointerEvent) => {
      if (!isRunning) return;
      if (controlsRef.current.isTouchingCanvas && e.pointerType === "touch") {
        updateTouchPosition(e.clientX);
      }
    };

    const onCanvasPointerUp = (e: PointerEvent) => {
      if (e.pointerType === "touch") {
        controlsRef.current.isTouchingCanvas = false;
        controlsRef.current.touchTargetX = null;
      }
    };

    const domElem = renderer.domElement;
    domElem.addEventListener("pointerdown", onCanvasPointerDown);
    domElem.addEventListener("pointermove", onCanvasPointerMove);
    window.addEventListener("pointerup", onCanvasPointerUp);
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("resize", syncCameraToAspect);

    let animationFrameId: number;
    let prevTime = performance.now();

    const animate = (now: number) => {
      animationFrameId = requestAnimationFrame(animate);
      const dt = Math.min((now - prevTime) / 1000, 0.1);
      prevTime = now;

      gridHelper.position.y = ((now * 0.004) % 2) - 1;

      if (isRunning) {
        const moveSpeed = 16;

        // 1. Movimentação por Botão ou Arraste Direto (Touch Drag)
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
        } else if (controlsRef.current.touchTargetX !== null) {
          const prevX = playerMesh.position.x;
          playerMesh.position.x = THREE.MathUtils.lerp(
            prevX,
            controlsRef.current.touchTargetX,
            Math.min(1, dt * 16)
          );
          const deltaX = playerMesh.position.x - prevX;
          playerMesh.rotation.z = THREE.MathUtils.lerp(
            playerMesh.rotation.z,
            THREE.MathUtils.clamp(-deltaX * 2.2, -0.4, 0.4),
            0.2
          );
        } else {
          playerMesh.rotation.z = THREE.MathUtils.lerp(
            playerMesh.rotation.z,
            0,
            0.15
          );
        }

        const cooldownElapsed = now - lastShotTime > 235;
        setWeaponReady(cooldownElapsed);

        const wantsToShoot =
          controlsRef.current.shoot ||
          controlsRef.current.autoFire ||
          controlsRef.current.isTouchingCanvas;

        if (wantsToShoot && cooldownElapsed) {
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
              triggerHaptic([40, 60, 80]);
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
              if (b.mesh.position.distanceTo(inv.mesh.position) < 1.12) {
                inv.alive = false;
                scene.remove(inv.mesh);
                scene.remove(b.mesh);
                bullets.splice(i, 1);

                shotsHit += 1;
                currentStreak += 1;
                setKillStreak(currentStreak);
                setAccuracy(
                  Math.min(
                    100,
                    Math.round((shotsHit / Math.max(1, shotsFired)) * 100)
                  )
                );

                const bonus = inv.points + Math.min(currentStreak * 25, 250);
                currentScore += bonus;
                setScore(currentScore);
                setLastFloatingGain(`+${bonus} PTS`);

                spawnExplosion(inv.mesh.position, "#FF0055");
                arcadeSynth.playExplosion();
                triggerHaptic(12);
                break;
              }
            }
          } else {
            if (b.mesh.position.distanceTo(playerMesh.position) < 1.15) {
              scene.remove(b.mesh);
              bullets.splice(i, 1);
              spawnExplosion(playerMesh.position, "#00F5D4");
              arcadeSynth.playExplosion();
              triggerHaptic([35, 50, 35]);

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
          triggerHaptic([20, 40, 20]);
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
      domElem.removeEventListener("pointerdown", onCanvasPointerDown);
      domElem.removeEventListener("pointermove", onCanvasPointerMove);
      window.removeEventListener("pointerup", onCanvasPointerUp);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("resize", syncCameraToAspect);
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
        embedded ? "h-[580px] sm:h-[650px]" : "min-h-screen"
      } bg-[#04020C] text-white font-mono overflow-hidden flex flex-col justify-between select-none touch-none`}
    >
      {/* Alerta de Escudo Crítico quando resta 1 vida */}
      {lives === 1 && gameState === "PLAYING" && (
        <div className="pointer-events-none absolute inset-0 z-20 border-4 border-red-500/50 animate-pulse" />
      )}

      {/* 1. HUD TELEMETRY SUPERIOR (COMPACTO NO MOBILE) */}
      <div className="relative z-20 flex flex-wrap items-center justify-between gap-2 sm:gap-4 px-3.5 sm:px-5 py-2.5 sm:py-3.5 bg-[#04020C]/90 backdrop-blur-md border-b border-[#FF0055]/30">
        <div className="flex items-center gap-3 sm:gap-5">
          <div>
            <span className="text-[8px] sm:text-[9px] uppercase tracking-[0.22em] text-[#FF0055] block">
              {"// SCORE"}
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg sm:text-2xl font-black text-[#00F5D4] drop-shadow-[0_0_10px_rgba(0,245,212,0.5)]">
                {String(score).padStart(6, "0")}
              </span>
              {lastFloatingGain && (
                <span className="hidden xs:inline text-[9px] font-bold text-amber-400">
                  {lastFloatingGain}
                </span>
              )}
            </div>
          </div>

          <div className="border-l border-white/10 pl-3 sm:pl-5">
            <span className="text-[8px] sm:text-[9px] uppercase tracking-[0.2em] text-purple-400 flex items-center gap-1">
              <Trophy className="w-2.5 h-2.5 sm:w-3 sm:h-3" /> BEST
            </span>
            <span className="text-xs sm:text-base font-bold text-white">
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

        <div className="flex items-center gap-2.5 sm:gap-4">
          {/* Switch de Auto-Fire p/ facilitar 1-Thumb Play no Mobile */}
          <button
            type="button"
            onClick={() => {
              setAutoFire((prev) => !prev);
              triggerHaptic(15);
            }}
            className={`px-2.5 py-1.5 rounded-lg border text-[9px] sm:text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-1.5 ${
              autoFire
                ? "bg-[#00F5D4] text-slate-950 border-[#00F5D4] shadow-[0_0_15px_rgba(0,245,212,0.4)]"
                : "bg-white/5 text-white/60 border-white/15 hover:text-white"
            }`}
          >
            <Target className="w-3 h-3" />
            <span>AUTO-FIRE {autoFire ? "ON" : "OFF"}</span>
          </button>

          <div className="text-right">
            <span className="text-[8px] sm:text-[9px] uppercase tracking-[0.2em] text-purple-400 block">
              WAVE
            </span>
            <span className="text-sm sm:text-lg font-black text-white">
              0{wave}
            </span>
          </div>

          <div className="flex items-center gap-1 bg-white/5 border border-white/10 px-2.5 py-1.5 rounded-xl">
            {[1, 2, 3].map((heartIndex) => (
              <Heart
                key={heartIndex}
                className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-all ${
                  heartIndex <= lives
                    ? "text-[#FF0055] fill-[#FF0055] drop-shadow-[0_0_8px_#FF0055]"
                    : "text-white/20"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* 2. CANVAS THREE.JS (COM SUPORTE A ARRASTE DIRETO NO MOBILE) */}
      <div
        ref={mountRef}
        className="absolute inset-0 z-10 w-full h-full touch-none"
      />

      {/* Dica Flutuante de Gesto Mobile */}
      {gameState === "PLAYING" && (
        <div className="pointer-events-none relative z-20 mt-2 flex justify-center sm:hidden">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-black/60 border border-white/10 px-3 py-1 text-[9px] text-white/70 backdrop-blur-md">
            <Hand className="w-3 h-3 text-[#00F5D4]" /> Arraste na tela p/ mover +
            atirar ou use os botões abaixo
          </span>
        </div>
      )}

      {/* 3. OVERLAYS DE INÍCIO E GAME OVER */}
      <AnimatePresence>
        {gameState !== "PLAYING" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative z-30 flex-1 flex items-center justify-center p-4 sm:p-6 bg-[#04020C]/80 backdrop-blur-md"
          >
            <div className="max-w-md w-full rounded-3xl bg-[#0D0620]/95 border border-[#FF0055]/40 p-6 sm:p-8 text-center shadow-[0_0_70px_rgba(255,0,85,0.2)]">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF0055]/15 border border-[#FF0055]/40 text-[#FF0055] text-[10px] sm:text-[11px] uppercase tracking-widest mb-3">
                <Sparkles className="w-3.5 h-3.5" /> WebGL Three.js Arcade
              </div>

              <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tighter text-white mb-2">
                VOXEL<span className="text-[#00F5D4]">VADERS</span>
              </h2>

              <p className="text-xs text-purple-200/75 leading-relaxed mb-6">
                {gameState === "START"
                  ? "No celular, deslize o dedo sobre a nave para manobrar com tiro automático ou use o gamepad abaixo. No PC, use [A/D] e [ESPAÇO]."
                  : `Defesa rompida na Wave 0${wave}. Pontuação final: ${score} PTS (Precisão: ${accuracy}%).`}
              </p>

              {gameState === "GAMEOVER" && (
                <div className="mb-5 space-y-3">
                  {scoreSaved ? (
                    <p
                      role="status"
                      className="text-sm font-bold text-[#00F5D4]"
                    >
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

      {/* 4. CONTROLES TÁTEIS MOBILE ERGONÔMICOS / GAMEPAD BAR */}
      <div className="relative z-20 px-3.5 sm:px-6 py-3 sm:py-4 bg-[#04020C]/95 border-t border-white/10 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1 sm:flex-initial">
          <button
            type="button"
            onPointerDown={(e) => {
              e.preventDefault();
              controlsRef.current.left = true;
              controlsRef.current.touchTargetX = null;
              triggerHaptic(10);
            }}
            onPointerUp={() => (controlsRef.current.left = false)}
            onPointerLeave={() => (controlsRef.current.left = false)}
            onPointerCancel={() => (controlsRef.current.left = false)}
            aria-label="Mover para a esquerda"
            className="flex-1 sm:flex-initial sm:w-16 h-14 rounded-2xl bg-white/10 active:bg-[#00F5D4] active:text-black border border-white/20 flex items-center justify-center transition-colors shadow-lg"
          >
            <ChevronLeft className="w-7 h-7" />
          </button>
          <button
            type="button"
            onPointerDown={(e) => {
              e.preventDefault();
              controlsRef.current.right = true;
              controlsRef.current.touchTargetX = null;
              triggerHaptic(10);
            }}
            onPointerUp={() => (controlsRef.current.right = false)}
            onPointerLeave={() => (controlsRef.current.right = false)}
            onPointerCancel={() => (controlsRef.current.right = false)}
            aria-label="Mover para a direita"
            className="flex-1 sm:flex-initial sm:w-16 h-14 rounded-2xl bg-white/10 active:bg-[#00F5D4] active:text-black border border-white/20 flex items-center justify-center transition-colors shadow-lg"
          >
            <ChevronRight className="w-7 h-7" />
          </button>
        </div>

        <span className="hidden lg:flex items-center gap-2 text-[11px] text-purple-300/60">
          <ShieldAlert className="w-4 h-4 text-[#00F5D4]" />
          ARRASTE NA TELA OU USE [A / D] + [ESPAÇO]
        </span>

        <button
          type="button"
          onPointerDown={(e) => {
            e.preventDefault();
            controlsRef.current.shoot = true;
            triggerHaptic(15);
          }}
          onPointerUp={() => (controlsRef.current.shoot = false)}
          onPointerLeave={() => (controlsRef.current.shoot = false)}
          onPointerCancel={() => (controlsRef.current.shoot = false)}
          className={`px-6 sm:px-8 h-14 rounded-2xl border font-black text-xs sm:text-sm uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-[0_0_25px_rgba(255,0,85,0.3)] ${
            weaponReady
              ? "bg-[#FF0055]/25 active:bg-[#FF0055] border-[#FF0055] text-white"
              : "bg-amber-500/15 border-amber-400/50 text-amber-300"
          }`}
        >
          <Crosshair className="w-5 h-5" />
          <span>FIRE</span>
        </button>
      </div>
    </div>
  );
}