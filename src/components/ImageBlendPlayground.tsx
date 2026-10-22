"use client";

import { useState } from "react";
import { Eye, EyeOff, RotateCcw } from "lucide-react";

export function ImageBlendPlayground() {
  const [backgroundColor, setBackgroundColor] = useState("#111827");
  const [showBase, setShowBase] = useState(true);
  const [showOverlay, setShowOverlay] = useState(true);

  const reset = () => {
    setBackgroundColor("#111827");
    setShowBase(true);
    setShowOverlay(true);
  };

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => setShowBase((visible) => !visible)}
          aria-pressed={showBase}
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.035] px-4 py-2 text-sm font-semibold backdrop-blur-xl transition-colors hover:border-violet-300/25"
        >
          {showBase ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
          Camada base
        </button>
        <button
          type="button"
          onClick={() => setShowOverlay((visible) => !visible)}
          aria-pressed={showOverlay}
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.035] px-4 py-2 text-sm font-semibold backdrop-blur-xl transition-colors hover:border-violet-300/25"
        >
          {showOverlay ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
          Camada superior
        </button>
        <label className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold">
          Cor de fundo
          <input
            type="color"
            value={backgroundColor}
            onChange={(event) => setBackgroundColor(event.target.value)}
            className="h-6 w-7 cursor-pointer rounded border-0 bg-transparent p-0"
            aria-label="Escolher cor de fundo"
          />
        </label>
        <button
          type="button"
          onClick={reset}
          className="ml-auto inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-violet-200"
        >
          <RotateCcw className="h-4 w-4" />
          Restaurar
        </button>
      </div>

      <div
        className="relative isolate min-h-[24rem] overflow-hidden rounded-3xl border border-border sm:min-h-[34rem]"
        style={{ backgroundColor }}
        aria-label="Prévia da composição de imagens"
      >
        {showBase && (
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: "url(https://picsum.photos/seed/focuspulse-blend-base/1400/900)",
            }}
          />
        )}
        {showOverlay && (
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-cover bg-center opacity-70 mix-blend-screen"
            style={{
              backgroundImage: "url(https://picsum.photos/seed/focuspulse-blend-overlay/1400/900)",
            }}
          />
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <p className="absolute bottom-6 left-6 text-sm font-bold uppercase tracking-[0.2em] text-white sm:bottom-8 sm:left-8">
          Experimente combinar as camadas
        </p>
      </div>
    </div>
  );
}
