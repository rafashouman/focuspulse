"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";
import {
  ArrowRight,
  Coins,
  Heart,
  RotateCcw,
  Sparkles,
  Target,
} from "lucide-react";
import { CardShader } from "@/lib/games/tarot-engine";
import { ACT_1_SPREADS, useGameStore } from "@/store/useGameStore";

const TarotTableScene = dynamic(
  () => import("@/components/three/TarotTableScene"),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full items-center justify-center font-mono text-xs uppercase tracking-[0.2em] text-violet-300">
        Carregando a mesa astral...
      </div>
    ),
  }
);

const STAGE_LABELS = {
  PAST: "Passado",
  PRESENT: "Presente",
  FUTURE: "Futuro",
} as const;

const SHADER_UPGRADES: { shader: CardShader; cost: number }[] = [
  { shader: "CHROME", cost: 8 },
  { shader: "HOLO", cost: 10 },
  { shader: "GLITCH", cost: 12 },
  { shader: "OVERCLOCK", cost: 14 },
];

export default function TarotGame() {
  const {
    hand,
    boardSlots,
    activeJokers,
    shopJokers,
    isShopOpen,
    fateLuck,
    credits,
    currentSpread,
    currentScore,
    rewritesLeft,
    discardsLeft,
    flipsLeft,
    lastEvaluation,
    combatLog,
    activeStepBanner,
    isResolving,
    isVictory,
    isGameOver,
    initRun,
    placeOrRemoveCard,
    flipCardOrientation,
    playBoardSpread,
    discardFromBoard,
    openBlindSpotShop,
    buyMajorArcana,
    applyShaderToRandomCard,
    proceedFromShopToNextSpread,
  } = useGameStore();

  useEffect(() => {
    initRun();
  }, [initRun]);

  const spread = ACT_1_SPREADS[currentSpread];
  const boardCount = boardSlots.filter(Boolean).length;
  const goalReached = currentScore >= spread.targetScore;
  const gameEnded = isVictory || isGameOver;
  const progress = Math.min((currentScore / spread.targetScore) * 100, 100);
  const canAdvance = goalReached && !isResolving && !isShopOpen;

  return (
    <section className="flex min-h-[580px] w-full flex-col bg-[#07080B] text-zinc-100">
      <header className="flex flex-wrap items-start justify-between gap-4 border-b border-white/10 bg-[#0B0A10] px-4 py-4 sm:px-6">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-violet-300">
            M0IRA-8 // {STAGE_LABELS[currentSpread]}
          </p>
          <h2 className="mt-1 text-lg font-black uppercase tracking-wide text-white sm:text-xl">
            {spread.title}
          </h2>
        </div>
        <button
          type="button"
          onClick={initRun}
          className="inline-flex items-center gap-2 rounded-lg border border-white/15 bg-white/5 px-3 py-2 font-mono text-[10px] font-bold uppercase tracking-wider text-zinc-300 transition hover:border-violet-400/60 hover:text-white"
        >
          <RotateCcw aria-hidden className="h-3.5 w-3.5" />
          Reiniciar
        </button>
      </header>

      <div className="grid gap-3 border-b border-white/10 bg-[#0A090F] px-4 py-3 sm:grid-cols-3 sm:px-6">
        <div className="flex items-center gap-2 font-mono text-xs">
          <Target aria-hidden className="h-4 w-4 text-violet-300" />
          <span className="text-zinc-400">Sincronia</span>
          <strong className="ml-auto text-white">
            {currentScore} / {spread.targetScore}
          </strong>
        </div>
        <div className="flex items-center gap-2 font-mono text-xs">
          <Heart aria-hidden className="h-4 w-4 text-rose-400" />
          <span className="text-zinc-400">Sorte</span>
          <strong className="ml-auto text-white">{fateLuck}</strong>
          <span className="ml-3 text-zinc-500">Mãos: {rewritesLeft}</span>
        </div>
        <div className="flex items-center gap-2 font-mono text-xs">
          <Coins aria-hidden className="h-4 w-4 text-amber-300" />
          <span className="text-zinc-400">Créditos</span>
          <strong className="ml-auto text-white">{credits}</strong>
          <span className="ml-3 text-zinc-500">Giros: {flipsLeft}</span>
        </div>
      </div>

      <div className="h-1 w-full bg-white/5">
        <div
          className="h-full bg-violet-400 transition-[width] duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="relative h-[330px] w-full sm:h-[390px]">
        <TarotTableScene />
        {(isVictory || isGameOver) && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/75 p-6 text-center backdrop-blur-sm">
            <Sparkles
              aria-hidden
              className={`mb-3 h-8 w-8 ${isVictory ? "text-emerald-300" : "text-rose-400"}`}
            />
            <h3 className="text-xl font-black uppercase tracking-wider text-white">
              {isVictory ? "Loop destruído" : "Run encerrada"}
            </h3>
            <p className="mt-2 max-w-md font-mono text-xs leading-relaxed text-zinc-300">
              {activeStepBanner ?? combatLog[0]}
            </p>
            <button
              type="button"
              onClick={initRun}
              className="mt-5 inline-flex items-center gap-2 rounded-lg bg-violet-500 px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider text-white transition hover:bg-violet-400"
            >
              <RotateCcw aria-hidden className="h-4 w-4" />
              Jogar novamente
            </button>
          </div>
        )}
      </div>

      <div className="space-y-4 border-t border-white/10 bg-[#0B0A10] p-4 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <p className="min-h-10 border-l-2 border-violet-400 pl-3 font-mono text-xs leading-relaxed text-zinc-300">
            {activeStepBanner ?? spread.tarotReaderProphecy}
            <span className="mt-1 block text-zinc-500">{spread.ruleWarning}</span>
          </p>
          <p className="shrink-0 font-mono text-[10px] uppercase tracking-wider text-zinc-500">
            {boardCount}/5 casas ocupadas
          </p>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2">
          {hand.map((card) => (
            <div
              key={card.id}
              className="flex min-w-32 items-stretch overflow-hidden rounded-lg border border-white/10 bg-black/30"
            >
              <button
                type="button"
                disabled={gameEnded || isResolving || isShopOpen}
                onClick={() => placeOrRemoveCard(card.id)}
                className="flex min-h-16 flex-1 flex-col justify-center px-3 py-2 text-left disabled:cursor-not-allowed disabled:opacity-50"
              >
                <span className="text-xs font-bold text-white">{card.name}</span>
                <span
                  className={`mt-1 font-mono text-[9px] uppercase ${
                    card.isReversed ? "text-rose-300" : "text-cyan-300"
                  }`}
                >
                  {card.isReversed ? "Invertida" : "Normal"}
                </span>
              </button>
              <button
                type="button"
                disabled={gameEnded || isResolving || flipsLeft <= 0 || isShopOpen}
                aria-label={`Inverter ${card.name}`}
                title={`Inverter carta (${flipsLeft} giros restantes)`}
                onClick={() => flipCardOrientation(card.id)}
                className="border-l border-white/10 px-2 text-zinc-400 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
              >
                <RotateCcw aria-hidden className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
          {hand.length === 0 && (
            <p className="py-4 font-mono text-xs text-zinc-500">
              Preparando o baralho...
            </p>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            disabled={gameEnded || isResolving || isShopOpen || boardCount === 0 || rewritesLeft <= 0}
            onClick={playBoardSpread}
            className="rounded-lg bg-violet-500 px-4 py-2.5 font-mono text-[10px] font-bold uppercase tracking-wider text-white transition hover:bg-violet-400 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Resolver tiragem
          </button>
          <button
            type="button"
            disabled={gameEnded || isResolving || isShopOpen || boardCount === 0 || discardsLeft <= 0}
            onClick={discardFromBoard}
            className="rounded-lg border border-white/15 px-4 py-2.5 font-mono text-[10px] font-bold uppercase tracking-wider text-zinc-300 transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Descartar mesa ({discardsLeft})
          </button>
          {canAdvance && (
            <button
              type="button"
              onClick={openBlindSpotShop}
              className="ml-auto inline-flex items-center gap-2 rounded-lg border border-emerald-400/40 px-4 py-2.5 font-mono text-[10px] font-bold uppercase tracking-wider text-emerald-300 transition hover:bg-emerald-400/10"
            >
              {currentSpread === "FUTURE" ? "Concluir tiragem" : "Abrir Ponto Cego"}
              <ArrowRight aria-hidden className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {isShopOpen && (
          <section className="space-y-4 rounded-xl border border-amber-400/25 bg-amber-400/5 p-4">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-amber-300">
                Loja // O Ponto Cego
              </p>
              <h3 className="mt-1 text-sm font-bold text-white">
                Instale um Arcano Maior ou aprimore uma carta
              </h3>
            </div>
            <div className="grid gap-2 sm:grid-cols-3">
              {shopJokers.map((joker) => (
                <article
                  key={joker.id}
                  className="flex flex-col justify-between rounded-lg border border-white/10 bg-black/30 p-3"
                >
                  <div>
                    <h4 className="text-xs font-bold text-white">
                      {joker.number}. {joker.name}
                    </h4>
                    <p className="mt-1 text-[10px] leading-relaxed text-zinc-400">
                      {joker.description}
                    </p>
                  </div>
                  <button
                    type="button"
                    disabled={credits < joker.cost || activeJokers.length >= 4}
                    onClick={() => buyMajorArcana(joker)}
                    className="mt-3 rounded-md border border-amber-300/30 px-2 py-1.5 font-mono text-[9px] uppercase text-amber-200 disabled:opacity-40"
                  >
                    Comprar // ¢{joker.cost}
                  </button>
                </article>
              ))}
              {shopJokers.length === 0 && (
                <p className="text-xs text-zinc-400">Não há novos arcanos disponíveis.</p>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="mr-1 font-mono text-[9px] uppercase tracking-wider text-zinc-500">
                Shader aleatório:
              </span>
              {SHADER_UPGRADES.map(({ shader, cost }) => (
                <button
                  key={shader}
                  type="button"
                  disabled={credits < cost || hand.length + boardCount === 0}
                  onClick={() => applyShaderToRandomCard(shader, cost)}
                  className="rounded-md border border-white/10 px-2 py-1.5 font-mono text-[9px] uppercase text-zinc-300 disabled:opacity-40"
                >
                  {shader} · ¢{cost}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="font-mono text-[9px] text-zinc-500">
                Arcanos equipados: {activeJokers.map((joker) => joker.name).join(" • ")}
              </p>
              <button
                type="button"
                onClick={proceedFromShopToNextSpread}
                className="inline-flex items-center gap-2 rounded-lg bg-violet-500 px-4 py-2 font-mono text-[10px] font-bold uppercase tracking-wider text-white transition hover:bg-violet-400"
              >
                Seguir para a próxima tiragem
                <ArrowRight aria-hidden className="h-3.5 w-3.5" />
              </button>
            </div>
          </section>
        )}

        <div className="flex min-h-5 flex-wrap items-center justify-between gap-2 font-mono text-[10px] uppercase tracking-wider text-zinc-500">
          <p aria-live="polite">{combatLog[0] ?? "Posicione até 5 cartas na mesa."}</p>
          <p>
            {lastEvaluation
              ? `${lastEvaluation.label} // ${lastEvaluation.totalChips} × ${lastEvaluation.totalMult} = ${lastEvaluation.finalScore}`
              : "Clique em uma carta da mão para posicioná-la"}
          </p>
        </div>
      </div>
    </section>
  );
}
