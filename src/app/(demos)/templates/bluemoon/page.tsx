// src/app/page.tsx
"use client";

import React, { useEffect, useState } from 'react';
import TarotTableScene from '@/components/three/TarotTableScene';
import { useGameStore, ACT_1_SPREADS, SpreadStage } from '@/store/useGameStore';
import { CONJUNCTION_TABLE, SUIT_INFO, SPREAD_BOARD_SLOTS } from '@/lib/games/tarot-engine';
import { soundFX } from '@/lib/audio/sound-fx';
import {
  FateLuckIcon,
  CyberCreditIcon,
  PolarityFlipIcon,
  NeuralRewriteIcon,
} from '@/components/ui/SquareIcons';

export default function DaemonArcanaGamePage() {
  const {
    initRun,
    hand,
    boardSlots,
    activeJokers,
    shopJokers,
    isShopOpen,
    placeOrRemoveCard,
    removeCardFromSlot,
    flipCardOrientation,
    playBoardSpread,
    discardFromBoard,
    openBlindSpotShop,
    buyMajorArcana,
    applyShaderToRandomCard,
    proceedFromShopToNextSpread,
    fateLuck,
    credits,
    currentSpread,
    currentScore,
    rewritesLeft,
    discardsLeft,
    flipsLeft,
    isResolving,
    activeStepBanner,
    displayChips,
    displayMult,
    lastEvaluation,
    combatLog,
    isVictory,
    isGameOver,
  } = useGameStore();

  const [showBriefing, setShowBriefing] = useState(false);
  const [showHandsGuide, setShowHandsGuide] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    initRun();
  }, [initRun]);

  const toggleMute = () => {
    soundFX.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const spreadInfo = ACT_1_SPREADS[currentSpread];
  const spreadBeaten = currentScore >= spreadInfo.targetScore;
  const progressPct = Math.min(100, Math.round((currentScore / spreadInfo.targetScore) * 100));
  const placedCount = boardSlots.filter(Boolean).length;
  const stages: SpreadStage[] = ['PAST', 'PRESENT', 'FUTURE'];

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-[#07080B] text-slate-100 font-mono select-none">
      {/* PALCO 3D */}
      <div className="absolute inset-0 z-0">
        <TarotTableScene />
      </div>

      {/* BANNER CENTRAL DE RESOLUÇÃO PASSO A PASSO */}
      {activeStepBanner && (
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none">
          <div className="bg-[#0A0B0E]/95 border-2 border-[#00F5D4] px-6 py-2.5 shadow-[0_0_30px_rgba(0,245,212,0.5)]">
            <p className="text-xs md:text-sm font-extrabold text-[#00F5D4] tracking-wider text-center">
              {activeStepBanner}
            </p>
          </div>
        </div>
      )}

      {/* HUD PRINCIPAL */}
      <div className="relative z-10 pointer-events-none flex flex-col justify-between h-full p-3.5 md:p-5">
        
        {/* TOPO: PROGRESSO DA TIRAGEM + ARCANOS MAIORES EQUIPADOS + RECURSOS */}
        <header className="flex flex-wrap items-start justify-between gap-3">
          
          {/* Esquerda: Meta da Etapa */}
          <div className="pointer-events-auto bg-[#0C0E14]/90 backdrop-blur-md border-l-4 border-[#8B5CF6] p-3 max-w-md shadow-2xl">
            <div className="flex items-center gap-1.5 mb-1.5">
              {stages.map((st) => {
                const active = currentSpread === st;
                const done = ACT_1_SPREADS[st].stepNumber < spreadInfo.stepNumber;
                return (
                  <div
                    key={st}
                    className={`px-2 py-0.5 text-[10px] font-bold border ${
                      active
                        ? 'bg-[#8B5CF6] text-white border-[#00F5D4]'
                        : done
                        ? 'bg-emerald-950/70 text-emerald-400 border-emerald-600'
                        : 'bg-slate-900 text-slate-500 border-slate-800'
                    }`}
                  >
                    {done ? '✓ ' : ''}{ACT_1_SPREADS[st].shortName}
                  </div>
                );
              })}
            </div>

            <h1 className="text-xs md:text-sm font-bold text-white">{spreadInfo.title}</h1>
            <p className="text-[10px] text-amber-300 mt-0.5">⚡ {spreadInfo.ruleWarning}</p>

            <div className="mt-2 bg-slate-950/90 p-2 border border-slate-800">
              <div className="flex justify-between text-[11px] mb-1">
                <span className="text-slate-300 font-bold">META DA TIRAGEM:</span>
                <span className="font-extrabold text-[#00F5D4]">
                  {currentScore} / {spreadInfo.targetScore} PTS ({progressPct}%)
                </span>
              </div>
              <div className="w-full h-2 bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#8B5CF6] via-[#00F5D4] to-emerald-400 transition-all duration-300"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>
          </div>

          {/* Centro-Topo: Slots de Arcanos Maiores (Jokers) */}
          <div className="pointer-events-auto bg-[#0C0E14]/90 backdrop-blur-md border border-slate-800 p-2.5 flex flex-col gap-1.5">
            <div className="text-[10px] text-[#00F5D4] font-bold tracking-wider uppercase">
              MÓDULOS DE ARCANOS MAIORES ({activeJokers.length}/4)
            </div>
            <div className="flex gap-2">
              {activeJokers.map((joker) => (
                <div
                  key={joker.id}
                  className="bg-[#18122B] border border-[#8B5CF6] px-2.5 py-1.5 w-40 text-[10px]"
                  title={joker.description}
                >
                  <div className="font-extrabold text-[#00F5D4]">
                    [{joker.number}] {joker.name}
                  </div>
                  <div className="text-slate-300 text-[9px] leading-tight mt-0.5 line-clamp-2">
                    {joker.description}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Direita: Recursos com Ícones 1:1 Vazados */}
          <div className="pointer-events-auto flex flex-col items-end gap-2">
            <div className="flex items-center gap-4 bg-[#0C0E14]/90 backdrop-blur-md border border-slate-800 px-4 py-2">
              <div className="flex items-center gap-2">
                <FateLuckIcon className="w-5 h-5 text-[#FF2A54]" />
                <div>
                  <div className="text-[9px] text-slate-400">SORTE</div>
                  <div className="text-sm font-extrabold text-[#FF2A54]">{fateLuck}/3</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <NeuralRewriteIcon className="w-5 h-5 text-[#00F5D4]" />
                <div>
                  <div className="text-[9px] text-slate-400">JOGADAS</div>
                  <div className="text-sm font-extrabold text-[#00F5D4]">{rewritesLeft}</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <PolarityFlipIcon className="w-5 h-5 text-[#8B5CF6]" />
                <div>
                  <div className="text-[9px] text-slate-400">GIROS</div>
                  <div className="text-sm font-extrabold text-white">{flipsLeft}</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <CyberCreditIcon className="w-5 h-5 text-amber-400" />
                <div>
                  <div className="text-[9px] text-slate-400">CRÉDITOS</div>
                  <div className="text-sm font-extrabold text-amber-400">¢{credits}</div>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowBriefing(true)}
                className="px-2.5 py-1 bg-slate-900/90 border border-[#00F5D4]/60 text-[10px] font-bold text-[#00F5D4]"
              >
                [?] REGRAS & ADJACÊNCIA
              </button>
              <button
                type="button"
                onClick={() => setShowHandsGuide(!showHandsGuide)}
                className="px-2.5 py-1 bg-slate-900/90 border border-[#8B5CF6] text-[10px] font-bold text-white"
              >
                [≡] TABELA DE MÃOS
              </button>
              <button
                type="button"
                onClick={toggleMute}
                className="px-2.5 py-1 bg-slate-900/90 border border-slate-700 text-[10px] text-slate-300"
              >
                {isMuted ? 'SOM: OFF' : 'SOM: ON'}
              </button>
            </div>
          </div>
        </header>

        {/* MEIO: SIMULADOR DE CONJUNÇÃO + MINI-MAPA DAS 5 CASAS DA MESA */}
        <div className="flex flex-wrap items-center justify-between gap-4 my-auto">
          {/* Esquerda: Calculadora e Sinergias Vizinhas */}
          <aside className="pointer-events-auto bg-[#0C0E14]/95 backdrop-blur-md border-2 border-slate-800 p-3.5 w-80 shadow-2xl">
            <div className="text-[10px] text-[#00F5D4] uppercase font-bold">
              LEITURA DA MESA ({placedCount}/5 CASAS OCUPADAS)
            </div>
            <div className="text-sm font-extrabold text-white mt-0.5">
              {lastEvaluation ? lastEvaluation.label : 'Posicione cartas na Cruz Central'}
            </div>

            <div className="mt-2.5 flex items-center justify-between gap-2">
              <div className="flex-1 bg-[#101929] border border-[#00F5D4] p-1.5 text-center">
                <div className="text-[9px] text-[#00F5D4] font-bold">SINCRONIA</div>
                <div className="text-xl font-extrabold text-white">
                  {isResolving ? displayChips : lastEvaluation ? lastEvaluation.totalChips : 0}
                </div>
              </div>
              <span className="text-lg font-extrabold text-slate-400">×</span>
              <div className="flex-1 bg-[#231229] border border-[#FF2A54] p-1.5 text-center">
                <div className="text-[9px] text-[#FF2A54] font-bold">CAOS (MULT)</div>
                <div className="text-xl font-extrabold text-white">
                  {isResolving ? displayMult : lastEvaluation ? lastEvaluation.totalMult : 0}
                </div>
              </div>
            </div>

            <div className="mt-2 pt-2 border-t border-slate-800 flex justify-between items-center">
              <span className="text-[11px] text-slate-300 font-bold">IMPACTO TOTAL:</span>
              <span className="text-base font-extrabold text-[#00F5D4]">
                {lastEvaluation ? `+${lastEvaluation.finalScore} PTS` : '0 PTS'}
              </span>
            </div>

            {/* Lista de Buffs e Debuffs de Adjacência Ativos na Mesa */}
            {lastEvaluation && lastEvaluation.adjacencyLog.length > 0 && (
              <div className="mt-2 pt-2 border-t border-slate-800/80 max-h-28 overflow-y-auto space-y-1">
                <div className="text-[9px] text-amber-400 font-bold uppercase">
                  SINERGIAS DE POSIÇÃO & VIZINHANÇA ATIVAS:
                </div>
                {lastEvaluation.adjacencyLog.map((note, idx) => (
                  <div key={idx} className="text-[10px] text-slate-300 leading-tight">
                    • {note}
                  </div>
                ))}
              </div>
            )}
          </aside>

          {/* Direita: Painel Tático das 5 Casas da Tiragem (Fácil visualização e remoção) */}
          <aside className="pointer-events-auto bg-[#0C0E14]/90 backdrop-blur-md border border-slate-800 p-3 w-80">
            <div className="text-[10px] text-[#00F5D4] font-bold uppercase mb-1.5">
              CASAS DA TIRAGEM NO TABULEIRO (CLIQUE PARA RETIRAR)
            </div>
            <div className="space-y-1.5">
              {SPREAD_BOARD_SLOTS.map((slot) => {
                const occupant = boardSlots[slot.slotIndex];
                return (
                  <div
                    key={slot.slotIndex}
                    onClick={() => occupant && removeCardFromSlot(slot.slotIndex)}
                    className={`p-1.5 border text-[10px] flex justify-between items-center cursor-pointer ${
                      occupant
                        ? 'bg-[#1D1836] border-[#00F5D4] text-white'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400'
                    }`}
                  >
                    <div>
                      <span className="font-bold text-[#00F5D4]">{slot.name}: </span>
                      {occupant ? (
                        <span className="font-extrabold text-white">
                          {occupant.name} {occupant.shader !== 'NONE' ? `[★${occupant.shader}]` : ''}
                        </span>
                      ) : (
                        <span className="italic text-[9px]">{slot.ruleDesc}</span>
                      )}
                    </div>
                    {occupant && <span className="text-[9px] text-[#FF2A54] font-bold ml-2">[X]</span>}
                  </div>
                );
              })}
            </div>
          </aside>
        </div>

        {/* RODAPÉ: MÃO DO JOGADOR E EXECUÇÃO DA TIRAGEM */}
        <footer className="pointer-events-auto flex flex-col gap-2">
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-2">
            {hand.map((card) => (
              <div
                key={card.id}
                onClick={() => placeOrRemoveCard(card.id)}
                className="cursor-pointer p-2 border-2 bg-[#0C0E14]/95 border-slate-800 hover:border-[#00F5D4] transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-center text-[9px]">
                    <span style={{ color: SUIT_INFO[card.suit].color }} className="font-bold">
                      {SUIT_INFO[card.suit].name.toUpperCase()}
                    </span>
                    <span
                      className={`px-1 font-extrabold ${
                        card.isReversed ? 'text-[#FF2A54]' : 'text-[#00F5D4]'
                      }`}
                    >
                      {card.isReversed ? 'INVERTIDA' : 'NORMAL'}
                    </span>
                  </div>

                  <div className="text-[11px] font-extrabold text-white mt-1 leading-tight">
                    {card.name}
                  </div>

                  {card.shader !== 'NONE' && (
                    <div className="text-[9px] font-bold text-amber-400 mt-0.5">
                      ★ SHADER: {card.shader}
                    </div>
                  )}

                  <div className="mt-1 pt-1 border-t border-slate-800 text-[9px] text-slate-300">
                    {card.isReversed
                      ? `+${Math.ceil(card.baseChips / 2)} Sinc | +${card.reversedMult} Caos`
                      : `+${card.baseChips + (card.suit === 'WANDS' ? 10 : 0)} Sincronia`}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    flipCardOrientation(card.id);
                  }}
                  disabled={flipsLeft <= 0 || isResolving}
                  className="mt-1.5 w-full py-0.5 text-[9px] font-bold border border-[#8B5CF6] bg-[#8B5CF6]/15 hover:bg-[#8B5CF6]/40 text-white disabled:opacity-30 flex items-center justify-center gap-1"
                >
                  <PolarityFlipIcon className="w-3 h-3" />
                  GIRAR 180°
                </button>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 bg-[#0C0E14]/95 border border-slate-800 px-4 py-2">
            <div className="text-[11px] text-slate-300">
              {combatLog[0] || 'Clique nas cartas da mão para colocá-las nas 5 Casas da Cruz Central.'}
            </div>

            <div className="flex items-center gap-3">
              {!spreadBeaten && !isGameOver && !isVictory && (
                <>
                  <button
                    type="button"
                    onClick={discardFromBoard}
                    disabled={placedCount === 0 || discardsLeft <= 0 || isResolving}
                    className="px-4 py-1.5 bg-slate-900 border border-slate-700 text-xs font-bold uppercase hover:border-[#FF2A54] disabled:opacity-40"
                  >
                    Descartar da Mesa ({discardsLeft})
                  </button>

                  <button
                    type="button"
                    onClick={playBoardSpread}
                    disabled={placedCount === 0 || rewritesLeft <= 0 || isResolving}
                    className="px-6 py-1.5 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-xs font-extrabold uppercase tracking-wider shadow-[0_0_20px_rgba(139,92,246,0.5)] disabled:opacity-40"
                  >
                    {isResolving ? 'Ativando Casas...' : `Ativar Tiragem (${placedCount}/5)`}
                  </button>
                </>
              )}

              {spreadBeaten && !isVictory && (
                <button
                  type="button"
                  onClick={openBlindSpotShop}
                  className="px-6 py-2 bg-[#00F5D4] text-black text-xs font-extrabold uppercase tracking-widest animate-pulse"
                >
                  {currentSpread === 'FUTURE'
                    ? '✓ Concluir Ato I (Vitória!) >>'
                    : '✓ Abrir Loja "O Ponto Cego" >>'}
                </button>
              )}

              {(isGameOver || isVictory) && (
                <button
                  type="button"
                  onClick={initRun}
                  className="px-6 py-2 bg-[#FF2A54] text-white text-xs font-extrabold uppercase tracking-widest"
                >
                  Reiniciar Loop Neural
                </button>
              )}
            </div>
          </div>
        </footer>
      </div>

      {/* MODAL DA LOJA: "O PONTO CEGO" (SPRINT 3 & 4) */}
      {isShopOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0C0E14] border-2 border-[#00F5D4] max-w-3xl w-full p-6 shadow-2xl space-y-5">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] text-[#00F5D4] uppercase font-bold tracking-widest">
                  INTERVENÇÃO NEURAL // BLACKCLINIC
                </span>
                <h2 className="text-xl font-extrabold text-white">
                  LOJA: O PONTO CEGO (CRÉDITOS: ¢{credits})
                </h2>
              </div>
              <button
                onClick={proceedFromShopToNextSpread}
                className="px-5 py-2 bg-[#00F5D4] text-black font-extrabold text-xs uppercase"
              >
                Ir para Próxima Tiragem &gt;&gt;
              </button>
            </div>

            {/* Seção 1: Comprar Arcanos Maiores (Jokers) */}
            <div>
              <h3 className="text-xs font-bold text-[#8B5CF6] uppercase mb-2">
                1. Instalar Arcanos Maiores na Memória ({activeJokers.length}/4 Slots)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {shopJokers.map((joker) => (
                  <div key={joker.id} className="bg-slate-950 border border-slate-800 p-3 flex flex-col justify-between">
                    <div>
                      <div className="text-xs font-extrabold text-[#00F5D4]">
                        [{joker.number}] {joker.name}
                      </div>
                      <p className="text-[11px] text-slate-300 mt-1">{joker.description}</p>
                    </div>
                    <button
                      onClick={() => buyMajorArcana(joker)}
                      disabled={credits < joker.cost || activeJokers.length >= 4}
                      className="mt-3 w-full py-1.5 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-xs font-bold disabled:opacity-30"
                    >
                      Comprar (¢{joker.cost})
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Seção 2: Injetar Shaders nas Cartas do Deck */}
            <div>
              <h3 className="text-xs font-bold text-amber-400 uppercase mb-2">
                2. Revestimento de Shaders (Aprimora uma carta aleatória do seu baralho)
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 text-xs">
                <button
                  onClick={() => applyShaderToRandomCard('OVERCLOCK', 5)}
                  disabled={credits < 5}
                  className="p-2.5 bg-slate-950 border border-amber-500/50 hover:bg-amber-950/30 text-left disabled:opacity-30"
                >
                  <div className="font-extrabold text-amber-400">★ OVERCLOCK (¢5)</div>
                  <div className="text-[10px] text-slate-300 mt-0.5">+50 Sincronia permanente na carta.</div>
                </button>

                <button
                  onClick={() => applyShaderToRandomCard('HOLO', 6)}
                  disabled={credits < 6}
                  className="p-2.5 bg-slate-950 border border-pink-500/50 hover:bg-pink-950/30 text-left disabled:opacity-30"
                >
                  <div className="font-extrabold text-pink-400">★ HOLOGRÁFICA (¢6)</div>
                  <div className="text-[10px] text-slate-300 mt-0.5">+8 Caos (Mult) permanente na carta.</div>
                </button>

                <button
                  onClick={() => applyShaderToRandomCard('CHROME', 8)}
                  disabled={credits < 8}
                  className="p-2.5 bg-slate-950 border border-cyan-400/50 hover:bg-cyan-950/30 text-left disabled:opacity-30"
                >
                  <div className="font-extrabold text-cyan-300">★ CROMADA (¢8)</div>
                  <div className="text-[10px] text-slate-300 mt-0.5">Multiplica o Caos da carta por X1.5.</div>
                </button>

                <button
                  onClick={() => applyShaderToRandomCard('GLITCH', 9)}
                  disabled={credits < 9}
                  className="p-2.5 bg-slate-950 border border-[#00F5D4] hover:bg-emerald-950/30 text-left disabled:opacity-30"
                >
                  <div className="font-extrabold text-[#00F5D4]">★ GLITCH (¢9)</div>
                  <div className="text-[10px] text-slate-300 mt-0.5">A carta dispara e pontua 2 vezes seguidas!</div>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE EXPLICAÇÃO DE ADJACÊNCIA */}
      {showBriefing && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0C0E14] border-2 border-[#00F5D4] max-w-2xl w-full p-6 space-y-3 text-xs">
            <div className="flex justify-between items-center border-b border-slate-800 pb-2">
              <h2 className="text-base font-extrabold text-white">
                COMO FUNCIONAM AS 5 CASAS E A ADJACÊNCIA NA MESA
              </h2>
              <button onClick={() => setShowBriefing(false)} className="text-slate-400 font-bold">
                FECHAR [X]
              </button>
            </div>
            <p className="text-slate-300">
              A **Casa 1 (O NEXO)** fica no centro exato da mesa e está conectada às outras 4 casas ao redor. Toda carta colocada nas casas ao redor interage diretamente com a carta que estiver no Nexo:
            </p>
            <ul className="space-y-1.5 text-slate-200 bg-slate-950 p-3 border border-slate-800">
              <li>• <strong className="text-[#00F5D4]">Ressonância de Vizinhança (BUFF):</strong> Cartas do mesmo Naipe conectadas ganham <strong>+12 Sincronia</strong> cada.</li>
              <li>• <strong className="text-pink-400">Purificação Emocional (BUFF):</strong> Uma carta de <strong>Espadas</strong> ao lado de <strong>Copas</strong> recebe <strong>+4 Caos (Mult)</strong>.</li>
              <li>• <strong className="text-amber-400">Paradoxo Temporal (BUFF):</strong> Uma carta <strong>[NORMAL]</strong> ao lado de uma <strong>[INVERTIDA]</strong> gera tensão e soma <strong>+2 Caos</strong>.</li>
              <li>• <strong className="text-[#FF2A54]">Curto-Circuito de Espadas (DEBUFF):</strong> Colocar <strong>Ouros</strong> ao lado de <strong>Espadas</strong> corta a carta de Ouros (<strong>-8 Sincronia e -¢2 Créditos</strong>).</li>
            </ul>
          </div>
        </div>
      )}

      {/* MODAL TABELA DE MÃOS */}
      {showHandsGuide && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0C0E14] border-2 border-[#8B5CF6] max-w-xl w-full p-5 space-y-3">
            <div className="flex justify-between items-center border-b border-slate-800 pb-2">
              <h2 className="text-base font-extrabold text-white">TABELA DE CONJUNÇÕES</h2>
              <button onClick={() => setShowHandsGuide(false)} className="text-xs font-bold text-slate-400">
                FECHAR [X]
              </button>
            </div>
            <table className="w-full text-left text-xs">
              <tbody className="divide-y divide-slate-800">
                {Object.values(CONJUNCTION_TABLE).map((row) => (
                  <tr key={row.label}>
                    <td className="py-1.5 font-bold text-white">{row.label}</td>
                    <td className="py-1.5 text-slate-400">{row.rule}</td>
                    <td className="py-1.5 text-right font-extrabold text-[#00F5D4]">
                      {row.chips} × {row.mult}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </main>
  );
}