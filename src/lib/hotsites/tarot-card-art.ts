// src/lib/hotsites/tarot-card-art.ts
// Arte minimalista dos Arcanos em primitivas vetoriais (caixa 100x100).
// A mesma descrição alimenta o SVG da página e o desenho vetorial do PDF.

export type Point = [number, number];

export type ArtPrimitive =
  | { kind: "circle"; cx: number; cy: number; r: number; fill?: boolean }
  | { kind: "line"; x1: number; y1: number; x2: number; y2: number }
  | { kind: "path"; points: Point[]; closed?: boolean; fill?: boolean };

const rad = (deg: number) => (deg * Math.PI) / 180;

const ring = (cx: number, cy: number, r: number): ArtPrimitive => ({ kind: "circle", cx, cy, r });
const dot = (cx: number, cy: number, r = 2.5): ArtPrimitive => ({ kind: "circle", cx, cy, r, fill: true });
const line = (x1: number, y1: number, x2: number, y2: number): ArtPrimitive => ({
  kind: "line",
  x1,
  y1,
  x2,
  y2,
});
const poly = (points: Point[], opts: { closed?: boolean; fill?: boolean } = {}): ArtPrimitive => ({
  kind: "path",
  points,
  ...opts,
});

// Ângulos em graus no sistema da tela: 0 = direita, 90 = baixo, 270 = cima.
function arc(cx: number, cy: number, r: number, from: number, to: number, steps = 28): Point[] {
  return Array.from({ length: steps + 1 }, (_, i) => {
    const a = rad(from + ((to - from) * i) / steps);
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)] as Point;
  });
}

function star(cx: number, cy: number, outer: number, inner: number, points: number, rotation = -90): Point[] {
  return Array.from({ length: points * 2 }, (_, i) => {
    const r = i % 2 === 0 ? outer : inner;
    const a = rad(rotation + (i * 180) / points);
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)] as Point;
  });
}

function pentagram(cx: number, cy: number, r: number, rotation: number): Point[] {
  const vertices = Array.from({ length: 5 }, (_, i) => {
    const a = rad(rotation + i * 72);
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)] as Point;
  });
  return [0, 2, 4, 1, 3].map((i) => vertices[i]);
}

function lemniscate(cx: number, cy: number, width: number, steps = 48): Point[] {
  return Array.from({ length: steps }, (_, i) => {
    const t = (i / steps) * Math.PI * 2;
    const d = 1 + Math.sin(t) ** 2;
    return [cx + (width * Math.cos(t)) / d, cy + (width * Math.sin(t) * Math.cos(t)) / d] as Point;
  });
}

function crescent(cx: number, cy: number, r: number, thickness: number): Point[] {
  const outer = arc(cx, cy, r, 90, 270);
  const inner = arc(cx, cy, r, 270, 90).map(([x, y]) => [cx + (x - cx) * (1 - thickness), y] as Point);
  return [...outer, ...inner];
}

function wave(x1: number, x2: number, y: number, amplitude: number, cycles: number, steps = 36): Point[] {
  return Array.from({ length: steps + 1 }, (_, i) => {
    const t = i / steps;
    return [x1 + (x2 - x1) * t, y + amplitude * Math.sin(Math.PI * 2 * cycles * t)] as Point;
  });
}

function rays(cx: number, cy: number, from: number, to: number, angles: number[]): ArtPrimitive[] {
  return angles.map((deg) => {
    const a = rad(deg);
    return line(
      cx + from * Math.cos(a),
      cy + from * Math.sin(a),
      cx + to * Math.cos(a),
      cy + to * Math.sin(a)
    );
  });
}

const spokes = (count: number, offset = 0) =>
  Array.from({ length: count }, (_, i) => offset + (360 / count) * i);

const CARD_ART: Record<string, ArtPrimitive[]> = {
  louco: [ring(50, 58, 22), dot(50, 24, 4), line(12, 88, 62, 88)],
  mago: [
    poly(lemniscate(50, 26, 22), { closed: true }),
    line(50, 40, 50, 80),
    dot(30, 92, 3),
    dot(43.3, 92, 3),
    dot(56.7, 92, 3),
    dot(70, 92, 3),
  ],
  sacerdotisa: [
    line(24, 18, 24, 90),
    line(76, 18, 76, 90),
    line(17, 18, 31, 18),
    line(69, 18, 83, 18),
    poly(crescent(46, 54, 22, 0.55), { closed: true, fill: true }),
    ring(58, 54, 9),
  ],
  imperatriz: [ring(50, 38, 18), dot(50, 38, 3), line(50, 56, 50, 88), line(36, 72, 64, 72)],
  imperador: [
    poly(
      [
        [30, 32],
        [30, 20],
        [40, 27],
        [50, 15],
        [60, 27],
        [70, 20],
        [70, 32],
      ],
      { closed: true }
    ),
    poly(
      [
        [30, 40],
        [70, 40],
        [70, 82],
        [30, 82],
      ],
      { closed: true }
    ),
    poly(
      [
        [50, 50],
        [62, 61],
        [50, 72],
        [38, 61],
      ],
      { closed: true }
    ),
    dot(50, 61, 2.5),
  ],
  hierofante: [
    line(50, 14, 50, 90),
    line(40, 28, 60, 28),
    line(32, 42, 68, 42),
    line(24, 56, 76, 56),
    dot(50, 14, 3),
  ],
  enamorados: [ring(38, 58, 20), ring(62, 58, 20), poly(star(50, 20, 9, 3.5, 4), { closed: true, fill: true })],
  carro: [
    poly(
      [
        [26, 44],
        [50, 24],
        [74, 44],
      ],
      { closed: true }
    ),
    poly(
      [
        [26, 44],
        [74, 44],
        [74, 66],
        [26, 66],
      ],
      { closed: true }
    ),
    ring(36, 76, 10),
    ring(64, 76, 10),
    dot(36, 76, 2),
    dot(64, 76, 2),
    dot(50, 12, 3),
  ],
  justica: [
    line(50, 20, 50, 86),
    line(34, 86, 66, 86),
    line(20, 32, 80, 32),
    dot(50, 14, 3.5),
    line(20, 32, 13, 58),
    line(20, 32, 35, 58),
    poly(arc(24, 58, 11, 0, 180), { closed: true }),
    line(80, 32, 65, 58),
    line(80, 32, 87, 58),
    poly(arc(76, 58, 11, 0, 180), { closed: true }),
  ],
  eremita: [
    poly(arc(44, 28, 16, 180, 360, 20)),
    line(28, 28, 28, 90),
    line(60, 28, 60, 36),
    poly(star(60, 50, 15, 7.5, 6), { closed: true }),
    dot(60, 50, 2.5),
    line(16, 90, 80, 90),
  ],
  roda: [ring(50, 50, 32), ring(50, 50, 10), ...rays(50, 50, 10, 32, spokes(8)), dot(50, 50, 2.5)],
  forca: [
    poly(lemniscate(50, 24, 20), { closed: true }),
    ring(50, 64, 24),
    dot(41, 58, 2.5),
    dot(59, 58, 2.5),
    poly(arc(50, 64, 12, 25, 155)),
  ],
  enforcado: [
    line(22, 16, 78, 16),
    line(50, 16, 50, 36),
    poly(
      [
        [36, 36],
        [64, 36],
        [50, 64],
      ],
      { closed: true }
    ),
    ring(50, 77, 9),
  ],
  morte: [
    line(14, 68, 86, 68),
    poly(arc(50, 68, 20, 180, 360), { closed: true }),
    ...rays(50, 68, 27, 40, [210, 240, 270, 300, 330]),
    line(36, 78, 64, 78),
    line(43, 87, 57, 87),
  ],
  temperanca: [
    poly(
      [
        [18, 24],
        [42, 24],
        [38, 46],
        [22, 46],
      ],
      { closed: true }
    ),
    poly(
      [
        [58, 62],
        [82, 62],
        [78, 84],
        [62, 84],
      ],
      { closed: true }
    ),
    poly(
      Array.from({ length: 25 }, (_, i) => {
        const t = i / 24;
        return [42 + 18 * t + 4 * Math.sin(3 * Math.PI * t), 28 + 36 * t] as Point;
      })
    ),
  ],
  diabo: [ring(50, 52, 34), poly(pentagram(50, 54, 27, 90), { closed: true })],
  torre: [
    poly(
      [
        [36, 40],
        [36, 28],
        [44, 28],
        [44, 34],
        [56, 34],
        [56, 28],
        [64, 28],
        [64, 40],
      ],
      { closed: true }
    ),
    poly(
      [
        [40, 40],
        [60, 40],
        [63, 90],
        [37, 90],
      ],
      { closed: true }
    ),
    ring(50, 60, 4),
    poly([
      [80, 8],
      [68, 28],
      [76, 32],
      [62, 52],
    ]),
    dot(24, 46, 2),
    dot(18, 66, 2),
    dot(82, 72, 2),
  ],
  estrela: [
    poly(star(50, 36, 24, 9, 8), { closed: true }),
    dot(50, 36, 2.5),
    poly(wave(16, 84, 78, 3, 3)),
    poly(wave(26, 74, 88, 3, 2)),
  ],
  lua: [
    poly(crescent(52, 38, 28, 0.62), { closed: true, fill: true }),
    dot(34, 70, 2.5),
    dot(66, 66, 2.5),
    poly(wave(16, 84, 86, 3, 3)),
  ],
  sol: [
    dot(50, 50, 12),
    ring(50, 50, 19),
    ...spokes(12).flatMap((deg, i) => rays(50, 50, 26, i % 2 === 0 ? 42 : 35, [deg])),
  ],
  julgamento: [
    poly(
      [
        [14, 47],
        [46, 34],
        [46, 66],
        [14, 53],
      ],
      { closed: true }
    ),
    poly(arc(46, 50, 13, -35, 35, 12)),
    poly(arc(46, 50, 23, -35, 35, 12)),
    poly(arc(46, 50, 33, -35, 35, 12)),
    line(20, 90, 80, 90),
    dot(34, 82, 3),
    dot(50, 82, 3),
    dot(66, 82, 3),
  ],
  mundo: [
    ring(50, 50, 32),
    poly(
      [
        [50, 24],
        [76, 50],
        [50, 76],
        [24, 50],
      ],
      { closed: true }
    ),
    dot(50, 50, 4),
    dot(12, 12, 3),
    dot(88, 12, 3),
    dot(12, 88, 3),
    dot(88, 88, 3),
  ],
};

const FALLBACK_ART: ArtPrimitive[] = [ring(50, 52, 26), dot(50, 52, 4), dot(50, 18, 3)];

export function getCardArt(cardId: string): ArtPrimitive[] {
  return CARD_ART[cardId] ?? FALLBACK_ART;
}

export function hasCardArt(cardId: string): boolean {
  return cardId in CARD_ART;
}

// "Arcano XIII" -> "XIII"
export function getArcanaNumeral(arcanaNumber: string): string {
  return arcanaNumber.replace(/^Arcano\s+/i, "");
}
