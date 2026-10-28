// src/lib/tarot-engine.ts

export type Suit = 'SWORDS' | 'PENTACLES' | 'CUPS' | 'WANDS';

export type Rank = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14;
export type CardShader = 'NONE' | 'CHROME' | 'HOLO' | 'GLITCH' | 'OVERCLOCK';

export interface TarotCard {
  id: string;
  suit: Suit;
  rank: Rank;
  name: string;
  isReversed: boolean;
  baseChips: number;
  reversedMult: number;
  shader: CardShader;
  textureUrl?: string;
}

export interface MajorArcanaJoker {
  id: string;
  number: string;
  name: string;
  description: string;
  cost: number;
  textureUrl: string;
}

export const MAJOR_ARCANA_POOL: MajorArcanaJoker[] = [
  { id: 'MA_0', number: '0', name: 'O Louco', cost: 6, description: 'Se a mão for Fragmento Isolado, ganha +12 Caos.', textureUrl: '/assets/cards/major/00_fool.png' },
  { id: 'MA_1', number: 'I', name: 'O Mago', cost: 8, description: 'A carta no Nexo Central dispara sua pontuação duas vezes.', textureUrl: '/assets/cards/major/01_magician.png' },
  { id: 'MA_2', number: 'II', name: 'A Sacerdotisa', cost: 7, description: '+25 Sincronia para cada carta de Copas pontuada.', textureUrl: '/assets/cards/major/02_priestess.png' },
  { id: 'MA_3', number: 'III', name: 'A Imperatriz', cost: 7, description: 'Cartas normais pontuadas concedem +3 Caos.', textureUrl: '/assets/cards/major/03_empress.png' },
  { id: 'MA_4', number: 'IV', name: 'O Imperador', cost: 8, description: 'Cartas da Corte pontuadas concedem +30 Sincronia.', textureUrl: '/assets/cards/major/04_emperor.png' },
  { id: 'MA_5', number: 'V', name: 'O Hierofante', cost: 6, description: 'Bônus de adjacência são duplicados.', textureUrl: '/assets/cards/major/05_hierophant.png' },
  { id: 'MA_6', number: 'VI', name: 'Os Enamorados', cost: 7, description: 'Uma combinação com par multiplica o Caos por 1,5.', textureUrl: '/assets/cards/major/06_lovers.png' },
  { id: 'MA_7', number: 'VII', name: 'A Carruagem', cost: 8, description: 'Cartas de Paus pontuadas concedem +6 Caos.', textureUrl: '/assets/cards/major/07_chariot.png' },
  { id: 'MA_8', number: 'VIII', name: 'A Força', cost: 9, description: 'Cartas de Espadas pontuadas concedem +20 Sincronia e +4 Caos.', textureUrl: '/assets/cards/major/08_strength.png' },
  { id: 'MA_9', number: 'IX', name: 'O Eremita', cost: 9, description: 'Com até 3 cartas na mesa, multiplica o Caos por 2.', textureUrl: '/assets/cards/major/09_hermit.png' },
];

export interface SpreadSlotSpec {
  slotIndex: number;
  name: string;
  shortTag: string;
  ruleDesc: string;
  position3D: [number, number, number];
  rotationZ: number;
  neighbors: number[];
}

export const SPREAD_BOARD_SLOTS: SpreadSlotSpec[] = [
  { slotIndex: 0, name: '1. O NEXO (Centro)', shortTag: 'NEXO', ruleDesc: 'Coração da tiragem: +15 Sincronia.', position3D: [0, 0.08, -0.15], rotationZ: 0, neighbors: [1, 2, 3, 4] },
  { slotIndex: 1, name: '2. O CRUZAMENTO (Acima)', shortTag: 'CRUZAMENTO', ruleDesc: 'Inverte a polaridade da carta e concede +4 Caos.', position3D: [0, 0.14, -1.35], rotationZ: 0, neighbors: [0] },
  { slotIndex: 2, name: '3. A SOMBRA (Esquerda)', shortTag: 'PASSADO', ruleDesc: 'Cartas invertidas dobram seu Caos.', position3D: [-1.45, 0.08, -0.15], rotationZ: 0, neighbors: [0] },
  { slotIndex: 3, name: '4. O VÉU (Direita)', shortTag: 'FUTURO', ruleDesc: 'Cartas normais concedem +30 Sincronia.', position3D: [1.45, 0.08, -0.15], rotationZ: 0, neighbors: [0] },
  { slotIndex: 4, name: '5. A COROA (Abaixo)', shortTag: 'COROA', ruleDesc: 'Gera +¢4 se a carta pontuar.', position3D: [0, 0.08, 1.05], rotationZ: 0, neighbors: [0] },
];

const SHADER_INFO: Record<CardShader, { chips: number; mult: number; retrigger: boolean }> = {
  NONE: { chips: 0, mult: 0, retrigger: false },
  CHROME: { chips: 0, mult: 0, retrigger: false },
  HOLO: { chips: 0, mult: 8, retrigger: false },
  GLITCH: { chips: 0, mult: 0, retrigger: true },
  OVERCLOCK: { chips: 50, mult: 0, retrigger: false },
}

export type ConjunctionType =
  | 'HIGH_ARCANA'
  | 'DUAL_MIRROR'
  | 'DOUBLE_MIRROR'
  | 'TRIAD'
  | 'KARMIC_STREAM'
  | 'SUIT_RESONANCE'
  | 'FULL_CONVERGENCE'
  | 'ROYAL_COURT'
  | 'TETRAD'
  | 'ASTRAL_ALIGNMENT';

export interface CardScoreStep {
  slotIndex: number;
  cardId: string;
  cardName: string;
  addedChips: number;
  addedMult: number;
  adjacencyNote: string;
  blockedByBoss: boolean;
  isReversed: boolean;
}

export interface ConjunctionResult {
  type: ConjunctionType;
  label: string;
  description: string;
  baseChips: number;
  baseMult: number;
  totalChips: number;
  totalMult: number;
  finalScore: number;
  earnedCredits: number;
  scoringCardIds: string[];
  steps: CardScoreStep[];
  adjacencyLog: string[];
}

export const CONJUNCTION_TABLE: Record<
  ConjunctionType,
  { label: string; rule: string; chips: number; mult: number }
> = {
  HIGH_ARCANA:      { label: 'Fragmento Isolado',     rule: 'Nenhuma combinação (Apenas a maior carta pontua)', chips: 10,  mult: 1 },
  DUAL_MIRROR:      { label: 'Espelho Binário',       rule: '2 cartas de mesmo número/valor',                   chips: 20,  mult: 2 },
  DOUBLE_MIRROR:    { label: 'Duplo Reflexo',         rule: '2 pares de cartas de mesmo valor',                 chips: 40,  mult: 3 },
  TRIAD:            { label: 'Tríade Neural',         rule: '3 cartas de mesmo valor',                          chips: 50,  mult: 4 },
  KARMIC_STREAM:    { label: 'Fluxo Kármico',         rule: '5 cartas em sequência numérica',                   chips: 65,  mult: 5 },
  SUIT_RESONANCE:   { label: 'Ressonância de Naipe',  rule: '5 cartas do mesmo Naipe',                          chips: 75,  mult: 5 },
  FULL_CONVERGENCE: { label: 'Convergência Total',    rule: '1 Tríade (3 iguais) + 1 Espelho (2 iguais)',       chips: 90,  mult: 7 },
  ROYAL_COURT:      { label: 'Conselho da Corte',     rule: 'Valete (11), Cavaleiro (12), Rainha (13) e Rei (14)', chips: 110, mult: 8 },
  TETRAD:           { label: 'Tétrade Absoluta',      rule: '4 cartas de mesmo valor',                          chips: 130, mult: 9 },
  ASTRAL_ALIGNMENT: { label: 'Alinhamento do Sprawl', rule: '5 cartas em sequência e do mesmo Naipe',           chips: 180, mult: 14 },
};

const RANK_LABELS: Record<Rank, string> = {
  1: 'Ás (1)', 2: 'II (2)', 3: 'III (3)', 4: 'IV (4)', 5: 'V (5)',
  6: 'VI (6)', 7: 'VII (7)', 8: 'VIII (8)', 9: 'IX (9)', 10: 'X (10)',
  11: 'Valete (11)', 12: 'Cavaleiro (12)', 13: 'Rainha (13)', 14: 'Rei (14)'
};

export const SUIT_INFO: Record<Suit, { name: string; bonusDesc: string; color: string }> = {
  SWORDS:    { name: 'Espadas', bonusDesc: 'Foco ofensivo: +3 Caos (Mult) quando Invertida', color: '#00F5D4' },
  PENTACLES: { name: 'Ouros',   bonusDesc: 'Gera +¢3 Créditos por carta jogada',             color: '#F59E0B' },
  CUPS:      { name: 'Copas',   bonusDesc: 'Estabilidade emocional alta',                    color: '#EC4899' },
  WANDS:     { name: 'Paus',    bonusDesc: 'Sobrecarga: +8 Sincronia extra se Normal',       color: '#8B5CF6' },
};

export function generateMinorArcanaDeck(): TarotCard[] {
  const suits: Suit[] = ['SWORDS', 'PENTACLES', 'CUPS', 'WANDS'];
  const ranks: Rank[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
  const deck: TarotCard[] = [];

  for (const suit of suits) {
    for (const rank of ranks) {
      const isReversed = Math.random() < 0.3;
      const baseChips = rank === 1 ? 15 : rank > 10 ? 12 : rank + 2;
      deck.push({
        id: `${suit}-${rank}-${Math.random().toString(36).substring(2, 7)}`,
        suit,
        rank,
        name: `${RANK_LABELS[rank]} de ${SUIT_INFO[suit].name}`,
        isReversed,
        baseChips,
        reversedMult: suit === 'SWORDS' ? 3 : 2,
        shader: 'NONE',
      });
    }
  }
  return shuffleDeck(deck);
}

export function shuffleDeck(deck: TarotCard[]): TarotCard[] {
  const copy = [...deck];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function evaluateTarotHand(cards: TarotCard[], forceReversedOnly = false): ConjunctionResult {
  if (cards.length === 0) {
    return {
      type: 'HIGH_ARCANA',
      label: 'Selecione até 5 cartas',
      description: 'Combine números iguais, sequências ou cartas do mesmo naipe.',
      baseChips: 0,
      baseMult: 0,
      totalChips: 0,
      totalMult: 0,
      finalScore: 0,
      earnedCredits: 0,
      scoringCardIds: [],
      steps: [],
      adjacencyLog: [],
    };
  }

  const ranks = cards.map(c => c.rank).sort((a, b) => a - b);
  const suits = cards.map(c => c.suit);

  const rankCounts = new Map<Rank, TarotCard[]>();
  cards.forEach(c => {
    rankCounts.set(c.rank, [...(rankCounts.get(c.rank) || []), c]);
  });

  const groups = Array.from(rankCounts.values()).sort((a, b) => b.length - a.length);
  const isFlush = cards.length === 5 && new Set(suits).size === 1;
  
  let isStraight = false;
  if (cards.length === 5 && groups.length === 5) {
    isStraight = ranks[4] - ranks[0] === 4;
  }

  const courtRanks: Rank[] = [11, 12, 13, 14];
  const hasRoyalCourt = courtRanks.every(r => ranks.includes(r));

  let type: ConjunctionType = 'HIGH_ARCANA';
  let scoringCards: TarotCard[] = [];

  if (isFlush && isStraight) {
    type = 'ASTRAL_ALIGNMENT';
    scoringCards = cards;
  } else if (groups[0].length === 4) {
    type = 'TETRAD';
    scoringCards = groups[0];
  } else if (hasRoyalCourt) {
    type = 'ROYAL_COURT';
    scoringCards = cards.filter(c => courtRanks.includes(c.rank));
  } else if (groups[0].length === 3 && groups[1]?.length === 2) {
    type = 'FULL_CONVERGENCE';
    scoringCards = cards;
  } else if (isFlush) {
    type = 'SUIT_RESONANCE';
    scoringCards = cards;
  } else if (isStraight) {
    type = 'KARMIC_STREAM';
    scoringCards = cards;
  } else if (groups[0].length === 3) {
    type = 'TRIAD';
    scoringCards = groups[0];
  } else if (groups[0].length === 2 && groups[1]?.length === 2) {
    type = 'DOUBLE_MIRROR';
    scoringCards = [...groups[0], ...groups[1]];
  } else if (groups[0].length === 2) {
    type = 'DUAL_MIRROR';
    scoringCards = groups[0];
  } else {
    type = 'HIGH_ARCANA';
    const highest = [...cards].sort((a, b) => b.baseChips - a.baseChips)[0];
    scoringCards = [highest];
  }

  const baseInfo = CONJUNCTION_TABLE[type];
  let totalChips = baseInfo.chips;
  let totalMult = baseInfo.mult;
  const steps: CardScoreStep[] = [];

  scoringCards.forEach(card => {
    if (forceReversedOnly && !card.isReversed) {
      steps.push({
        slotIndex: -1,
        cardId: card.id,
        cardName: card.name,
        addedChips: 0,
        addedMult: 0,
        adjacencyNote: 'Bloqueada pelo chefe',
        blockedByBoss: true,
        isReversed: card.isReversed,
      });
      return;
    }

    if (card.isReversed) {
      const chips = Math.ceil(card.baseChips / 2);
      const mult = card.reversedMult;
      totalChips += chips;
      totalMult += mult;
      steps.push({
        slotIndex: -1,
        cardId: card.id,
        cardName: card.name,
        addedChips: chips,
        addedMult: mult,
        adjacencyNote: 'Carta invertida',
        blockedByBoss: false,
        isReversed: true,
      });
    } else {
      const chips = card.baseChips + (card.suit === 'WANDS' ? 8 : 0);
      totalChips += chips;
      steps.push({
        slotIndex: -1,
        cardId: card.id,
        cardName: card.name,
        addedChips: chips,
        addedMult: 0,
        adjacencyNote: 'Carta normal',
        blockedByBoss: false,
        isReversed: false,
      });
    }
  });

  return {
    type,
    label: baseInfo.label,
    description: baseInfo.rule,
    baseChips: baseInfo.chips,
    baseMult: baseInfo.mult,
    totalChips,
    totalMult,
    finalScore: totalChips * totalMult,
    earnedCredits: 0,
    scoringCardIds: scoringCards.map(c => c.id),
    steps,
    adjacencyLog: [],
  };
}

export function evaluateSpatialBoard(
  boardSlots: (TarotCard | null)[],
  activeJokers: MajorArcanaJoker[],
  forceReversedOnly = false,
): ConjunctionResult {
  const placedCards = boardSlots
    .map((card, slotIndex) => (card ? { card, slotIndex } : null))
    .filter((entry): entry is { card: TarotCard; slotIndex: number } => entry !== null);
  const jokerIds = new Set(activeJokers.map((joker) => joker.id));
  const cardById = new Map(placedCards.map(({ card, slotIndex }) => [card.id, { card, slotIndex }]));
  const effectiveCards = placedCards.map(({ card, slotIndex }) => ({
    ...card,
    isReversed: slotIndex === 1 ? !card.isReversed : card.isReversed,
  }));
  const handEvaluation = evaluateTarotHand(effectiveCards, forceReversedOnly);
  const adjacencyLog: string[] = [];
  let earnedCredits = placedCards.filter(({ card }) => card.suit === 'PENTACLES').length * 3;
  for (const { slotIndex, card } of placedCards) {
    if (card.suit !== 'PENTACLES') continue;
    earnedCredits -= SPREAD_BOARD_SLOTS[slotIndex].neighbors.filter(
      (neighborIndex) => boardSlots[neighborIndex]?.suit === 'SWORDS',
    ).length * 2;
  }

  const steps = handEvaluation.steps.flatMap((handStep): CardScoreStep[] => {
    const entry = cardById.get(handStep.cardId);
    if (!entry) return [];
    const { card, slotIndex } = entry;
    const effectiveReversed = slotIndex === 1 ? !card.isReversed : card.isReversed;

    if (handStep.blockedByBoss) {
      return [{
        ...handStep,
        slotIndex,
        adjacencyNote: 'Bloqueada pelo chefe',
        isReversed: effectiveReversed,
      }];
    }

    let addedChips = handStep.addedChips;
    let addedMult = handStep.addedMult;
    const notes: string[] = [];

    if (slotIndex === 0) {
      addedChips += 15;
      notes.push('Nexo +15 Sinc');
    } else if (slotIndex === 1) {
      addedMult += 4;
      notes.push('Cruzamento +4 Caos');
    } else if (slotIndex === 2 && effectiveReversed) {
      addedMult *= 2;
      notes.push('Sombra dobra o Caos invertido');
    } else if (slotIndex === 3 && !effectiveReversed) {
      addedChips += 30;
      notes.push('Véu +30 Sinc');
    }

    if (jokerIds.has('MA_2') && card.suit === 'CUPS') {
      addedChips += 25;
      notes.push('Sacerdotisa +25 Sinc');
    }
    if (jokerIds.has('MA_3') && !effectiveReversed) {
      addedMult += 3;
      notes.push('Imperatriz +3 Caos');
    }
    if (jokerIds.has('MA_4') && card.rank >= 11) {
      addedChips += 30;
      notes.push('Imperador +30 Sinc');
    }
    if (jokerIds.has('MA_7') && card.suit === 'WANDS') {
      addedMult += 6;
      notes.push('Carruagem +6 Caos');
    }
    if (jokerIds.has('MA_8') && card.suit === 'SWORDS') {
      addedChips += 20;
      addedMult += 4;
      notes.push('A Força +20 Sinc / +4 Caos');
    }

    const shader = SHADER_INFO[card.shader];
    addedChips += shader.chips;
    addedMult += shader.mult;
    if (card.shader === 'CHROME') {
      addedMult = Math.round(addedMult * 1.5);
      notes.push('Chrome ×1,5 Caos');
    } else if (card.shader !== 'NONE') {
      notes.push(`Shader ${card.shader}`);
    }

    const adjacencyBonuses = SPREAD_BOARD_SLOTS[slotIndex].neighbors.flatMap((neighborIndex) => {
      const neighbor = boardSlots[neighborIndex];
      if (!neighbor) return [];

      const neighborIsReversed =
        neighborIndex === 1 ? !neighbor.isReversed : neighbor.isReversed;
      const bonuses: {
        chips: number;
        mult: number;
        description: string;
        isPenalty: boolean;
      }[] = [];

      if (card.suit === neighbor.suit) {
        bonuses.push({
          chips: 12,
          mult: 0,
          description: 'Ressonância de Vizinhança (+12 Sinc)',
          isPenalty: false,
        });
      }
      if (card.suit === 'SWORDS' && neighbor.suit === 'CUPS') {
        bonuses.push({
          chips: 0,
          mult: 4,
          description: 'Purificação Emocional (+4 Caos)',
          isPenalty: false,
        });
      }
      if (!effectiveReversed && neighborIsReversed) {
        bonuses.push({
          chips: 0,
          mult: 2,
          description: 'Paradoxo Temporal (+2 Caos)',
          isPenalty: false,
        });
      }
      if (card.suit === 'PENTACLES' && neighbor.suit === 'SWORDS') {
        bonuses.push({
          chips: -8,
          mult: 0,
          description: 'Curto-Circuito de Espadas (-8 Sinc / -¢2)',
          isPenalty: true,
        });
      }
      return bonuses;
    });

    const adjacencyMultiplier = jokerIds.has('MA_5') ? 2 : 1;
    for (const bonus of adjacencyBonuses) {
      const multiplier = bonus.isPenalty ? 1 : adjacencyMultiplier;
      addedChips += bonus.chips * multiplier;
      addedMult += bonus.mult * multiplier;
      notes.push(multiplier > 1 ? `${bonus.description} ×2` : bonus.description);
    }

    if (slotIndex === 4) {
      earnedCredits += 4;
      notes.push('Coroa +¢4');
    }

    if (notes.length > 0) adjacencyLog.push(`[${SPREAD_BOARD_SLOTS[slotIndex].shortTag}] ${card.name}: ${notes.join(' • ')}`);

    const triggerCount = 1 +
      (shader.retrigger ? 1 : 0) +
      (slotIndex === 0 && jokerIds.has('MA_1') ? 1 : 0);

    return Array.from({ length: triggerCount }, (_, triggerIndex) => ({
      ...handStep,
      slotIndex,
      cardName: triggerCount > 1 ? `${card.name} (x${triggerIndex + 1})` : card.name,
      addedChips,
      addedMult,
      adjacencyNote: notes.join(' • ') || 'Ativação padrão',
      isReversed: effectiveReversed,
    }));
  });

  const lastScoringStep = [...steps].reverse().find((step) => !step.blockedByBoss);
  if (lastScoringStep) {
    let globalMultBonus = 0;
    if (jokerIds.has('MA_0') && handEvaluation.type === 'HIGH_ARCANA') {
      globalMultBonus += 12;
      adjacencyLog.push('[O LOUCO] Fragmento Isolado: +12 Caos.');
    }

    const hasPair = placedCards.some(({ card }) =>
      placedCards.some(({ card: other }) => card.id !== other.id && card.rank === other.rank),
    );
    if (jokerIds.has('MA_6') && hasPair) {
      const currentMult = handEvaluation.baseMult + steps.reduce((sum, step) => sum + step.addedMult, 0);
      globalMultBonus += Math.round((currentMult + globalMultBonus) * 0.5);
      adjacencyLog.push('[OS ENAMORADOS] Par na mesa: +50% Caos.');
    }
    if (jokerIds.has('MA_9') && placedCards.length <= 3) {
      const currentMult = handEvaluation.baseMult + steps.reduce((sum, step) => sum + step.addedMult, 0);
      globalMultBonus += currentMult + globalMultBonus;
      adjacencyLog.push('[O EREMITA] Até 3 cartas: Caos dobrado.');
    }

    if (globalMultBonus !== 0) {
      lastScoringStep.addedMult += globalMultBonus;
      lastScoringStep.adjacencyNote = [lastScoringStep.adjacencyNote, 'Bônus global dos Arcanos'].filter(Boolean).join(' • ');
    }
  }

  const totalChips = handEvaluation.baseChips +
    steps.reduce((sum, step) => sum + (step.blockedByBoss ? 0 : step.addedChips), 0);
  const totalMult = handEvaluation.baseMult +
    steps.reduce((sum, step) => sum + (step.blockedByBoss ? 0 : step.addedMult), 0);

  return {
    ...handEvaluation,
    totalChips,
    totalMult,
    finalScore: totalChips * totalMult,
    earnedCredits,
    steps,
    adjacencyLog,
  };
}