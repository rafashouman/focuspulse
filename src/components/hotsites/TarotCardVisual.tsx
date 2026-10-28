"use client";

import { motion, useReducedMotion } from "framer-motion";
import { getArcanaNumeral, getCardArt, type ArtPrimitive } from "@/lib/hotsites/tarot-card-art";

function renderPrimitive(primitive: ArtPrimitive, index: number) {
  switch (primitive.kind) {
    case "circle":
      return (
        <circle
          key={index}
          cx={primitive.cx}
          cy={primitive.cy}
          r={primitive.r}
          fill={primitive.fill ? "currentColor" : "none"}
        />
      );
    case "line":
      return <line key={index} x1={primitive.x1} y1={primitive.y1} x2={primitive.x2} y2={primitive.y2} />;
    case "path": {
      const points = primitive.points.map(([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`).join(" ");
      const Shape = primitive.closed ? "polygon" : "polyline";
      return (
        <Shape
          key={index}
          points={points}
          fill={primitive.fill ? "currentColor" : "none"}
          fillOpacity={primitive.fill ? 0.85 : undefined}
        />
      );
    }
  }
}

export function TarotCardArt({ cardId, className }: { cardId: string; className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      aria-hidden
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {getCardArt(cardId).map(renderPrimitive)}
    </svg>
  );
}

function CardFace({ cardId, title, numeral }: { cardId: string; title: string; numeral: string }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-between rounded-xl border border-amber-400/35 bg-gradient-to-b from-[#17161f] to-[#0b0b0f] px-3 py-3.5 shadow-[0_0_30px_rgba(245,158,11,0.08)]">
      <div className="pointer-events-none absolute inset-1.5 rounded-lg border border-amber-400/15" />
      <span className="relative font-serif text-xs tracking-[0.35em] text-amber-300/90">{numeral}</span>
      <TarotCardArt cardId={cardId} className="relative h-[58%] w-full text-amber-300" />
      <span className="relative text-center font-serif text-[10px] uppercase leading-tight tracking-[0.18em] text-zinc-200">
        {title}
      </span>
    </div>
  );
}

function CardBack() {
  return (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden rounded-xl border border-amber-400/30 bg-[#0e0d14]">
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, rgba(245,158,11,0.16) 0 1px, transparent 1px 12px), repeating-linear-gradient(-45deg, rgba(245,158,11,0.16) 0 1px, transparent 1px 12px)",
        }}
      />
      <div className="pointer-events-none absolute inset-1.5 rounded-lg border border-amber-400/20" />
      <svg
        viewBox="0 0 100 100"
        aria-hidden
        className="relative h-1/2 w-1/2 text-amber-300/80"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.6}
        strokeLinejoin="round"
      >
        <polygon points="50,8 92,50 50,92 8,50" fill="#0e0d14" />
        <polygon points="50,24 76,50 50,76 24,50" />
        <circle cx="50" cy="50" r="7" fill="currentColor" />
      </svg>
    </div>
  );
}

interface TarotCardVisualProps {
  cardId: string;
  title: string;
  arcanaNumber: string;
  revealed?: boolean;
  revealDelay?: number;
  className?: string;
}

export default function TarotCardVisual({
  cardId,
  title,
  arcanaNumber,
  revealed = true,
  revealDelay = 0,
  className = "",
}: TarotCardVisualProps) {
  const reduceMotion = useReducedMotion();
  const hiddenFace = { backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" } as const;

  return (
    <div
      role="img"
      aria-label={revealed ? `Carta ${title}, ${arcanaNumber}` : "Carta ainda oculta"}
      className={`relative aspect-[5/8] ${className}`}
      style={{ perspective: 900 }}
    >
      <motion.div
        className="absolute inset-0"
        style={{ transformStyle: "preserve-3d" }}
        initial={{ rotateY: 180 }}
        animate={{ rotateY: revealed ? 0 : 180 }}
        transition={{ duration: reduceMotion ? 0 : 0.8, delay: reduceMotion ? 0 : revealDelay, ease: "easeOut" }}
      >
        <div className="absolute inset-0" style={hiddenFace}>
          <CardFace cardId={cardId} title={title} numeral={getArcanaNumeral(arcanaNumber)} />
        </div>
        <div className="absolute inset-0" style={{ ...hiddenFace, transform: "rotateY(180deg)" }}>
          <CardBack />
        </div>
      </motion.div>
    </div>
  );
}
