// src/store/useGameStore.ts
import { create } from 'zustand';
import {
  TarotCard,
  MajorArcanaJoker,
  MAJOR_ARCANA_POOL,
  CardShader,
  generateMinorArcanaDeck,
  evaluateSpatialBoard,
  ConjunctionResult,
  CardScoreStep,
} from '@/lib/games/tarot-engine';
import { soundFX } from '@/lib/audio/sound-fx';
import { saveDaemonRunLog } from '@/lib/firebase';

export type SpreadStage = 'PAST' | 'PRESENT' | 'FUTURE';

interface SpreadConfig {
  stage: SpreadStage;
  stepNumber: number;
  shortName: string;
  title: string;
  tarotReaderProphecy: string;
  ruleWarning: string;
  targetScore: number;
  forceReversedOnly: boolean;
}

export const ACT_1_SPREADS: Record<SpreadStage, SpreadConfig> = {
  PAST: {
    stage: 'PAST',
    stepNumber: 1,
    shortName: '1. O PASSADO',
    title: 'TIRAGEM I: O PASSADO // A CULPA NO SPRAWL',
    tarotReaderProphecy: '"Posicione suas memórias na Cruz da Mesa. Veremos como elas entram em colapso umas com as outras."',
    ruleWarning: 'Posicione até 5 cartas na Cruz Central. Cartas vizinhas criam combos e interferências.',
    targetScore: 260,
    forceReversedOnly: false,
  },
  PRESENT: {
    stage: 'PRESENT',
    stepNumber: 2,
    shortName: '2. O PRESENTE',
    title: 'TIRAGEM II: O PRESENTE // CONTRATO DE SANGUE',
    tarotReaderProphecy: '"O córtex dele pulsa em dívida. Use seus Arcanos Maiores ou afunde no determinismo."',
    ruleWarning: 'Meta elevada: 600 PTS. Use a Casa 1 (Nexo) e a Casa 2 (Cruzamento) para multiplicar o Caos.',
    targetScore: 600,
    forceReversedOnly: false,
  },
  FUTURE: {
    stage: 'FUTURE',
    stepNumber: 3,
    shortName: '3. O FUTURO (BOSS)',
    title: 'TIRAGEM III: O FUTURO // DETERMINISMO CEGO',
    tarotReaderProphecy: '"TRAVA DE BOSS: Desativei todas as memórias estáveis! Apenas cartas [INVERTIDAS] pontuam na mesa!"',
    ruleWarning: 'BOSS M0IRA-8: Cartas [NORMAIS] valem ZERO! Use o botão GIRAR ou coloque na Casa 2 (Cruzamento)!',
    targetScore: 1100,
    forceReversedOnly: true,
  },
};

interface GameState {
  deck: TarotCard[];
  hand: TarotCard[];
  boardSlots: (TarotCard | null)[]; // As 5 Casas da Tiragem no Centro da Mesa
  activeJokers: MajorArcanaJoker[];
  shopJokers: MajorArcanaJoker[];
  isShopOpen: boolean;

  fateLuck: number;
  credits: number;
  currentSpread: SpreadStage;
  currentScore: number;
  rewritesLeft: number;
  discardsLeft: number;
  flipsLeft: number;

  isResolving: boolean;
  activeStepSlot: number | null;
  activeStepBanner: string | null;
  displayChips: number;
  displayMult: number;

  lastEvaluation: ConjunctionResult | null;
  combatLog: string[];
  isVictory: boolean;
  isGameOver: boolean;

  initRun: () => void;
  placeOrRemoveCard: (cardId: string, targetSlotIndex?: number) => void;
  removeCardFromSlot: (slotIndex: number) => void;
  flipCardOrientation: (cardId: string) => void;
  playBoardSpread: () => void;
  discardFromBoard: () => void;
  openBlindSpotShop: () => void;
  buyMajorArcana: (joker: MajorArcanaJoker) => void;
  applyShaderToRandomCard: (shader: CardShader, cost: number) => void;
  proceedFromShopToNextSpread: () => void;
}

const HAND_LIMIT = 8;

export const useGameStore = create<GameState>((set, get) => ({
  deck: [],
  hand: [],
  boardSlots: [null, null, null, null, null],
  activeJokers: [],
  shopJokers: [],
  isShopOpen: false,

  fateLuck: 3,
  credits: 20,
  currentSpread: 'PAST',
  currentScore: 0,
  rewritesLeft: 4,
  discardsLeft: 3,
  flipsLeft: 4,

  isResolving: false,
  activeStepSlot: null,
  activeStepBanner: null,
  displayChips: 0,
  displayMult: 0,

  lastEvaluation: null,
  combatLog: [],
  isVictory: false,
  isGameOver: false,

  initRun: () => {
    const fullDeck = generateMinorArcanaDeck();
    const initialHand = fullDeck.slice(0, HAND_LIMIT);
    const remainingDeck = fullDeck.slice(HAND_LIMIT);
    const emptyBoard = [null, null, null, null, null];

    set({
      deck: remainingDeck,
      hand: initialHand,
      boardSlots: emptyBoard,
      activeJokers: [MAJOR_ARCANA_POOL[0]], // Começa com "O Louco (0)" instalado na memória
      shopJokers: [],
      isShopOpen: false,
      fateLuck: 3,
      credits: 20,
      currentSpread: 'PAST',
      currentScore: 0,
      rewritesLeft: 4,
      discardsLeft: 3,
      flipsLeft: 4,
      isResolving: false,
      activeStepSlot: null,
      activeStepBanner: null,
      displayChips: 0,
      displayMult: 0,
      lastEvaluation: null,
      combatLog: [
        '[SISTEMA] Clique nas cartas da mão para posicioná-las nas 5 Casas da Tiragem no centro da mesa.',
        '[ADJACÊNCIA] A carta na Casa 1 (Nexo Central) toca todas as outras 4 casas e ativa combos de vizinhança!',
      ],
      isVictory: false,
      isGameOver: false,
    });
  },

  placeOrRemoveCard: (cardId: string, targetSlotIndex?: number) => {
    const { hand, boardSlots, activeJokers, currentSpread, isResolving } = get();
    if (isResolving) return;

    const spreadRule = ACT_1_SPREADS[currentSpread];

    // Se já está na mesa, devolve para a mão
    const existingSlotIdx = boardSlots.findIndex(c => c?.id === cardId);
    if (existingSlotIdx !== -1) {
      const removedCard = boardSlots[existingSlotIdx]!;
      const nextBoard = [...boardSlots];
      nextBoard[existingSlotIdx] = null;
      const nextHand = [...hand, removedCard];
      soundFX.playSelect(false);

      const preview = evaluateSpatialBoard(nextBoard, activeJokers, spreadRule.forceReversedOnly);
      set({
        boardSlots: nextBoard,
        hand: nextHand,
        lastEvaluation: preview,
        displayChips: preview.totalChips,
        displayMult: preview.totalMult,
      });
      return;
    }

    // Procura o slot escolhido ou o primeiro slot vazio na Cruz Central
    const cardToPlace = hand.find(c => c.id === cardId);
    if (!cardToPlace) return;

    const freeSlotIdx =
      targetSlotIndex !== undefined && boardSlots[targetSlotIndex] === null
        ? targetSlotIndex
        : boardSlots.findIndex(slot => slot === null);

    if (freeSlotIdx === -1) return; // Todas as 5 casas da mesa estão ocupadas

    const nextBoard = [...boardSlots];
    nextBoard[freeSlotIdx] = cardToPlace;
    const nextHand = hand.filter(c => c.id !== cardId);
    soundFX.playSelect(true);

    const preview = evaluateSpatialBoard(nextBoard, activeJokers, spreadRule.forceReversedOnly);
    set({
      boardSlots: nextBoard,
      hand: nextHand,
      lastEvaluation: preview,
      displayChips: preview.totalChips,
      displayMult: preview.totalMult,
    });
  },

  removeCardFromSlot: (slotIndex: number) => {
    const { boardSlots, hand, activeJokers, currentSpread, isResolving } = get();
    if (isResolving) return;
    const card = boardSlots[slotIndex];
    if (!card) return;

    const nextBoard = [...boardSlots];
    nextBoard[slotIndex] = null;
    const nextHand = [...hand, card];
    soundFX.playSelect(false);

    const spreadRule = ACT_1_SPREADS[currentSpread];
    const preview = evaluateSpatialBoard(nextBoard, activeJokers, spreadRule.forceReversedOnly);
    set({
      boardSlots: nextBoard,
      hand: nextHand,
      lastEvaluation: preview,
      displayChips: preview.totalChips,
      displayMult: preview.totalMult,
    });
  },

  flipCardOrientation: (cardId: string) => {
    const { flipsLeft, hand, boardSlots, activeJokers, currentSpread, isResolving } = get();
    if (flipsLeft <= 0 || isResolving) return;

    soundFX.playFlip();
    const nextHand = hand.map(c => (c.id === cardId ? { ...c, isReversed: !c.isReversed } : c));
    const nextBoard = boardSlots.map(c => (c && c.id === cardId ? { ...c, isReversed: !c.isReversed } : c));

    const spreadRule = ACT_1_SPREADS[currentSpread];
    const preview = evaluateSpatialBoard(nextBoard, activeJokers, spreadRule.forceReversedOnly);

    set({
      hand: nextHand,
      boardSlots: nextBoard,
      flipsLeft: flipsLeft - 1,
      lastEvaluation: preview,
      displayChips: preview.totalChips,
      displayMult: preview.totalMult,
    });
  },

  playBoardSpread: () => {
    const {
      boardSlots,
      hand,
      deck,
      activeJokers,
      currentScore,
      rewritesLeft,
      currentSpread,
      credits,
      fateLuck,
      isResolving,
      combatLog,
    } = get();

    const placedCount = boardSlots.filter(Boolean).length;
    if (placedCount === 0 || rewritesLeft <= 0 || isResolving) return;

    const spreadConfig = ACT_1_SPREADS[currentSpread];
    const result = evaluateSpatialBoard(boardSlots, activeJokers, spreadConfig.forceReversedOnly);

    set({
      isResolving: true,
      displayChips: result.baseChips,
      displayMult: result.baseMult,
      activeStepBanner: `TIRAGEM ATIVADA: ${result.label.toUpperCase()} (${result.baseChips} × ${result.baseMult})`,
    });

    let runningChips = result.baseChips;
    let runningMult = result.baseMult;

    result.steps.forEach((step: CardScoreStep, idx: number) => {
      setTimeout(() => {
        if (step.blockedByBoss) {
          soundFX.playDamageAlert();
          set({
            activeStepSlot: step.slotIndex,
            activeStepBanner: `CASA ${step.slotIndex + 1}: ${step.cardName} BLOQUEADA PELO BOSS!`,
          });
        } else {
          runningChips += step.addedChips;
          runningMult += step.addedMult;
          soundFX.playCardTrigger(idx, step.isReversed);

          set({
            activeStepSlot: step.slotIndex,
            displayChips: runningChips,
            displayMult: runningMult,
            activeStepBanner: `CASA ${step.slotIndex + 1} (${step.cardName}) ➔ +${step.addedChips} Sinc | +${step.addedMult} Caos [${step.adjacencyNote}]`,
          });
        }
      }, (idx + 1) * 480);
    });

    const totalDelay = (result.steps.length + 1) * 500;
    setTimeout(() => {
      soundFX.playScoreSlam();
      const updatedScore = currentScore + result.finalScore;
      const needed = HAND_LIMIT - hand.length;
      const drawn = deck.slice(0, needed);
      const nextDeck = deck.slice(needed);
      const nextRewrites = rewritesLeft - 1;
      const emptyBoard = [null, null, null, null, null];

      // Venceu a Tiragem Atual!
      if (updatedScore >= spreadConfig.targetScore) {
        soundFX.playStageClear();
        const totalCredits = credits + result.earnedCredits + 12;

        if (currentSpread === 'FUTURE') {
          saveDaemonRunLog({
            spreadReached: 'ACT_1_CLEARED',
            finalScore: updatedScore,
            creditsEarned: totalCredits,
            victory: true,
          });
        }

        set({
          isResolving: false,
          activeStepSlot: null,
          activeStepBanner: `PROFECIA QUEBRADA! +${result.finalScore} PONTOS!`,
          boardSlots: emptyBoard,
          hand: [...hand, ...drawn],
          deck: nextDeck,
          currentScore: updatedScore,
          rewritesLeft: nextRewrites,
          credits: totalCredits,
          lastEvaluation: null,
          combatLog: [
            `[VITÓRIA NA ETAPA] +${result.finalScore} PTS! Você recebeu +¢${result.earnedCredits + 12} Créditos.`,
            ...result.adjacencyLog,
            ...combatLog.slice(0, 3),
          ],
        });
        return;
      }

      // Acabaram as Reescritas sem bater a meta
      if (nextRewrites <= 0) {
        soundFX.playDamageAlert();
        const nextLuck = fateLuck - 1;
        if (nextLuck <= 0) {
          saveDaemonRunLog({
            spreadReached: currentSpread,
            finalScore: updatedScore,
            creditsEarned: credits,
            victory: false,
          });
          set({
            isResolving: false,
            activeStepSlot: null,
            activeStepBanner: 'COLAPSO NEURAL: SORTE ZERADA!',
            fateLuck: 0,
            isGameOver: true,
          });
        } else {
          set({
            isResolving: false,
            activeStepSlot: null,
            activeStepBanner: 'FALHA NA META! -1 SORTE (+2 JOGADAS DE EMERGÊNCIA)',
            fateLuck: nextLuck,
            rewritesLeft: 2,
            boardSlots: emptyBoard,
            hand: [...hand, ...drawn],
            deck: nextDeck,
            currentScore: updatedScore,
            lastEvaluation: null,
          });
        }
        return;
      }

      set({
        isResolving: false,
        activeStepSlot: null,
        activeStepBanner: `IMPACTO DA TIRAGEM: +${result.finalScore} PTS`,
        boardSlots: emptyBoard,
        hand: [...hand, ...drawn],
        deck: nextDeck,
        currentScore: updatedScore,
        rewritesLeft: nextRewrites,
        credits: credits + result.earnedCredits,
        lastEvaluation: null,
        combatLog: [
          `[TIRAGEM] ${result.label}: +${result.finalScore} PTS.`,
          ...result.adjacencyLog,
          ...combatLog.slice(0, 3),
        ],
      });
    }, totalDelay);
  },

  discardFromBoard: () => {
    const { boardSlots, hand, deck, discardsLeft, isResolving } = get();
    const placedCount = boardSlots.filter(Boolean).length;
    if (placedCount === 0 || discardsLeft <= 0 || isResolving) return;

    soundFX.playSelect(false);
    const needed = HAND_LIMIT - hand.length;
    const drawn = deck.slice(0, needed);
    const nextDeck = deck.slice(needed);

    set({
      boardSlots: [null, null, null, null, null],
      hand: [...hand, ...drawn],
      deck: nextDeck,
      discardsLeft: discardsLeft - 1,
      lastEvaluation: null,
      displayChips: 0,
      displayMult: 0,
    });
  },

  // Abre a Loja "O Ponto Cego" entre as Tiragens
  openBlindSpotShop: () => {
    const { activeJokers, currentSpread } = get();
    if (currentSpread === 'FUTURE') {
      set({ isVictory: true });
      return;
    }

    const ownedIds = new Set(activeJokers.map(j => j.id));
    const available = MAJOR_ARCANA_POOL.filter(j => !ownedIds.has(j.id));
    const shuffled = [...available].sort(() => 0.5 - Math.random()).slice(0, 3);

    set({
      isShopOpen: true,
      shopJokers: shuffled,
      activeStepBanner: null,
    });
  },

  buyMajorArcana: (joker: MajorArcanaJoker) => {
    const { credits, activeJokers, shopJokers } = get();
    if (credits < joker.cost || activeJokers.length >= 4) return;

    soundFX.playStageClear();
    set({
      credits: credits - joker.cost,
      activeJokers: [...activeJokers, joker],
      shopJokers: shopJokers.filter(item => item.id !== joker.id),
    });
  },

  applyShaderToRandomCard: (shader: CardShader, cost: number) => {
    const { credits, deck, hand, combatLog } = get();
    if (credits < cost) return;

    const allCards = [...hand, ...deck];
    if (allCards.length === 0) return;
    const randomTarget = allCards[Math.floor(Math.random() * allCards.length)];

    const updateCard = (c: TarotCard) => (c.id === randomTarget.id ? { ...c, shader } : c);
    soundFX.playFlip();

    set({
      credits: credits - cost,
      hand: hand.map(updateCard),
      deck: deck.map(updateCard),
      combatLog: [`[UPGRADE] Shader ${shader} instalado em ${randomTarget.name}!`, ...combatLog.slice(0, 4)],
    });
  },

  proceedFromShopToNextSpread: () => {
    const { currentSpread, hand, deck } = get();
    soundFX.playStageClear();

    // Reúne todas as cartas do baralho do jogador (mantendo Shaders adquiridos) e reembaralha
    const combined = [...hand, ...deck];
    const reshuffled = combined.sort(() => 0.5 - Math.random());
    const nextHand = reshuffled.slice(0, HAND_LIMIT);
    const nextDeck = reshuffled.slice(HAND_LIMIT);

    const nextStage: SpreadStage = currentSpread === 'PAST' ? 'PRESENT' : 'FUTURE';

    set({
      isShopOpen: false,
      currentSpread: nextStage,
      currentScore: 0,
      rewritesLeft: 4,
      discardsLeft: 3,
      flipsLeft: 5,
      boardSlots: [null, null, null, null, null],
      hand: nextHand,
      deck: nextDeck,
      lastEvaluation: null,
      activeStepBanner:
        nextStage === 'FUTURE'
          ? 'BOSS FINAL M0IRA-8: APENAS CARTAS INVERTIDAS PONTUAM!'
          : 'ETAPA II INICIADA: POSICIONE SUAS CARTAS NA MESA!',
    });
  },
}));