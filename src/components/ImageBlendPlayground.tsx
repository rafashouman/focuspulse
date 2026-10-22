"use client";

import { useState } from "react";
import {
  Eye,
  EyeOff,
  RotateCcw,
  Sliders,
  Sparkles,
  Copy,
  Check,
  Layers,
} from "lucide-react";
import { trackAnalyticsEvent } from "@/lib/firebase";

type BlendMode =
  | "screen"
  | "overlay"
  | "multiply"
  | "color-dodge"
  | "difference"
  | "hard-light";

const BLEND_MODES: { value: BlendMode; label: string }[] = [
  { value: "screen", label: "Screen" },
  { value: "overlay", label: "Overlay" },
  { value: "color-dodge", label: "Color Dodge" },
  { value: "multiply", label: "Multiply" },
  { value: "difference", label: "Difference" },
  { value: "hard-light", label: "Hard Light" },
];

const PRESETS = [
  {
    name: "Cyber Violet",
    bg: "#160d29",
    blend: "screen" as BlendMode,
    opacity: 75,
  },
  {
    name: "Neon Dodge",
    bg: "#091926",
    blend: "color-dodge" as BlendMode,
    opacity: 65,
  },
  {
    name: "Editorial Contrast",
    bg: "#23121b",
    blend: "overlay" as BlendMode,
    opacity: 85,
  },
  {
    name: "Acid Invert",
    bg: "#111827",
    blend: "difference" as BlendMode,
    opacity: 70,
  },
];

export function ImageBlendPlayground() {
  const [backgroundColor, setBackgroundColor] = useState("#160d29");
  const [showBase, setShowBase] = useState(true);
  const [showOverlay, setShowOverlay] = useState(true);
  const [blendMode, setBlendMode] = useState<BlendMode>("screen");
  const [overlayOpacity, setOverlayOpacity] = useState(75);
  const [copiedCss, setCopiedCss] = useState(false);

  const reset = () => {
    trackAnalyticsEvent({
      eventName: "miniapp_interaction",
      appId: "image-blend",
      action: "reset",
    });
    setBackgroundColor("#160d29");
    setShowBase(true);
    setShowOverlay(true);
    setBlendMode("screen");
    setOverlayOpacity(75);
  };

  const cssSnippet = `background-color: ${backgroundColor}; mix-blend-mode: ${blendMode}; opacity: ${(
    overlayOpacity / 100
  ).toFixed(2)};`;

  const copyCss = () => {
    trackAnalyticsEvent({
      eventName: "miniapp_interaction",
      appId: "image-blend",
      action: "copy_css",
    });
    navigator.clipboard.writeText(cssSnippet);
    setCopiedCss(true);
    setTimeout(() => setCopiedCss(false), 2000);
  };

  return (
    <div className="mx-auto max-w-5xl">
      <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-[#0b0e14]/90 shadow-2xl backdrop-blur-2xl">
        {/* Painel de Controle Superior */}
        <div className="border-b border-white/[0.08] p-6 sm:p-7">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <span className="grid h-9 w-9 place-items-center rounded-xl border border-violet-300/20 bg-violet-400/10 text-violet-200">
                <Sliders className="h-4 w-4" />
              </span>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-violet-200">
                  CSS Compositing Studio
                </p>
                <h3 className="font-display text-lg font-semibold text-white">
                  Inspetor de Camadas & Blend Modes
                </h3>
              </div>
            </div>

            {/* Presets Rápidos */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="mr-1 font-mono text-[10px] uppercase tracking-wider text-white/40">
                Presets:
              </span>
              {PRESETS.map((preset) => (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => {
                    trackAnalyticsEvent({
                      eventName: "miniapp_interaction",
                      appId: "image-blend",
                      action: "preset",
                    });
                    setBackgroundColor(preset.bg);
                    setBlendMode(preset.blend);
                    setOverlayOpacity(preset.opacity);
                    setShowBase(true);
                    setShowOverlay(true);
                  }}
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs font-medium text-white/75 transition-all hover:border-violet-300/40 hover:bg-violet-500/15 hover:text-white"
                >
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: preset.bg }}
                  />
                  {preset.name}
                </button>
              ))}
            </div>
          </div>

          {/* Linha de Controles Interativos */}
          <div className="grid grid-cols-1 gap-4 pt-2 md:grid-cols-12 md:items-center">
            {/* Visibilidade das Camadas */}
            <div className="flex flex-wrap items-center gap-2.5 md:col-span-5">
              <button
                type="button"
                onClick={() => {
                  trackAnalyticsEvent({
                    eventName: "miniapp_interaction",
                    appId: "image-blend",
                    action: "layer_visibility",
                  });
                  setShowBase((v) => !v);
                }}
                aria-pressed={showBase}
                className={`inline-flex items-center gap-2 rounded-xl border px-3.5 py-2 text-xs font-semibold transition-all ${
                  showBase
                    ? "border-violet-300/40 bg-violet-500/20 text-white"
                    : "border-white/10 bg-white/[0.03] text-white/45"
                }`}
              >
                {showBase ? (
                  <Eye className="h-3.5 w-3.5 text-violet-200" />
                ) : (
                  <EyeOff className="h-3.5 w-3.5" />
                )}
                Camada Base
              </button>

              <button
                type="button"
                onClick={() => {
                  trackAnalyticsEvent({
                    eventName: "miniapp_interaction",
                    appId: "image-blend",
                    action: "layer_visibility",
                  });
                  setShowOverlay((v) => !v);
                }}
                aria-pressed={showOverlay}
                className={`inline-flex items-center gap-2 rounded-xl border px-3.5 py-2 text-xs font-semibold transition-all ${
                  showOverlay
                    ? "border-fuchsia-300/40 bg-fuchsia-500/20 text-white"
                    : "border-white/10 bg-white/[0.03] text-white/45"
                }`}
              >
                {showOverlay ? (
                  <Eye className="h-3.5 w-3.5 text-fuchsia-200" />
                ) : (
                  <EyeOff className="h-3.5 w-3.5" />
                )}
                Camada Superior
              </button>

              <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-1.5 text-xs font-semibold text-white/80 hover:border-violet-300/30">
                <span>Fundo</span>
                <input
                  type="color"
                  value={backgroundColor}
                  onChange={(e) => setBackgroundColor(e.target.value)}
                  onBlur={() =>
                    trackAnalyticsEvent({
                      eventName: "miniapp_interaction",
                      appId: "image-blend",
                      action: "background_color",
                    })
                  }
                  className="h-5 w-6 cursor-pointer rounded border-0 bg-transparent p-0"
                  aria-label="Escolher cor de fundo"
                />
                <span className="font-mono text-[10px] uppercase text-white/50">
                  {backgroundColor}
                </span>
              </label>
            </div>

            {/* Seletor de Mix Blend Mode */}
            <div className="flex items-center gap-2 overflow-x-auto md:col-span-4">
              {BLEND_MODES.map((mode) => (
                <button
                  key={mode.value}
                  type="button"
                  onClick={() => {
                    trackAnalyticsEvent({
                      eventName: "miniapp_interaction",
                      appId: "image-blend",
                      action: "blend_mode",
                    });
                    setBlendMode(mode.value);
                  }}
                  className={` shrink-0 rounded-lg border px-2.5 py-1.5 font-mono text-[11px] transition-all ${
                    blendMode === mode.value
                      ? "border-violet-300/50 bg-white/15 font-bold text-white"
                      : "border-white/[0.06] bg-white/[0.02] text-white/50 hover:text-white/80"
                  }`}
                >
                  {mode.label}
                </button>
              ))}
            </div>

            {/* Opacidade + Reset */}
            <div className="flex items-center justify-between gap-3 md:col-span-3 md:justify-end">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] uppercase text-white/50">
                  Opacidade: {overlayOpacity}%
                </span>
                <input
                  type="range"
                  min={10}
                  max={100}
                  value={overlayOpacity}
                  onChange={(e) => setOverlayOpacity(Number(e.target.value))}
                  onPointerUp={() =>
                    trackAnalyticsEvent({
                      eventName: "miniapp_interaction",
                      appId: "image-blend",
                      action: "opacity",
                    })
                  }
                  className="h-1.5 w-20 cursor-pointer accent-violet-400"
                  aria-label="Opacidade da camada superior"
                />
              </div>

              <button
                type="button"
                onClick={reset}
                title="Restaurar padrões"
                className="grid h-8 w-8 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/[0.03] text-white/60 transition-colors hover:border-violet-300/30 hover:text-white"
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Viewport da Composição */}
        <div className="p-4 sm:p-6">
          <div
            className="relative isolate min-h-[24rem] overflow-hidden rounded-2xl border border-white/10 transition-colors duration-300 sm:min-h-[32rem]"
            style={{ backgroundColor }}
            aria-label="Prévia da composição de imagens"
          >
            {showBase && (
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-cover bg-center transition-opacity duration-500"
                style={{
                  backgroundImage:
                    "url(https://picsum.photos/seed/focuspulse-blend-base/1400/900)",
                }}
              />
            )}

            {showOverlay && (
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-cover bg-center transition-all duration-300"
                style={{
                  backgroundImage:
                    "url(https://picsum.photos/seed/focuspulse-blend-overlay/1400/900)",
                  mixBlendMode: blendMode,
                  opacity: overlayOpacity / 100,
                }}
              />
            )}

            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />

            {/* Badges Flutuantes dentro do Canvas */}
            <div className="absolute left-5 top-5 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-black/50 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-white backdrop-blur-md">
                <Layers className="h-3 w-3 text-violet-300" />
                mix-blend-mode: {blendMode}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-black/50 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-white/80 backdrop-blur-md">
                <Sparkles className="h-3 w-3 text-fuchsia-300" />
                {(showBase ? 1 : 0) + (showOverlay ? 1 : 0)} camadas ativas
              </span>
            </div>

            <div className="absolute inset-x-5 bottom-5 flex flex-wrap items-end justify-between gap-4 sm:inset-x-7 sm:bottom-7">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-violet-200">
                  Renderização em Tempo Real
                </p>
                <p className="mt-1 font-display text-xl font-bold uppercase tracking-tight text-white sm:text-2xl">
                  Experimente combinar as camadas
                </p>
              </div>

              {/* Botão Copiar CSS */}
              <button
                type="button"
                onClick={copyCss}
                className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-black/60 px-4 py-2.5 font-mono text-xs text-white backdrop-blur-xl transition-all hover:border-violet-300/50 hover:bg-black/80"
              >
                {copiedCss ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                    CSS Copiado!
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5 text-violet-300" />
                    Copiar CSS
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}