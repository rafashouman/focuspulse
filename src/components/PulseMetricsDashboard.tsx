"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity,
  TrendingUp,
  Users,
  Zap,
  Volume2,
  VolumeX,
  Radio,
  ArrowUpRight,
  ArrowDownRight,
  Layers,
  Filter,
  CheckCircle2,
  Sparkles,
  Terminal,
  BarChart3,
  Globe,
  MousePointerClick,
  ShieldCheck,
  RefreshCw,
} from "lucide-react";
import { onAuthStateChanged, signInWithPopup, User } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase/client";
import { META_PIXEL_ID, trackMetaEvent } from "@/components/MetaPixel";

// ==========================================
// WEB AUDIO SYNTHESIZER (CYBER TELEMETRY FX)
// ==========================================
class MetricsSoundEngine {
  private ctx: AudioContext | null = null;
  public enabled: boolean = true;

  private init() {
    if (typeof window === "undefined") return;
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  playBlip(freq = 720) {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(freq * 1.35, this.ctx.currentTime + 0.045);
    gain.gain.setValueAtTime(0.09, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.005, this.ctx.currentTime + 0.045);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.05);
  }

  playPulseSuccess() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    [523.25, 659.25, 987.77].forEach((f, i) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(f, now + i * 0.06);
      gain.gain.setValueAtTime(0.12, now + i * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.004, now + i * 0.06 + 0.25);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + i * 0.06);
      osc.stop(now + i * 0.06 + 0.26);
    });
  }
}

// ==========================================
// DATA SETS POR PERÍODO
// ==========================================
type TimeRange = "24H" | "7D" | "30D" | "90D";

interface PeriodDataset {
  revenue: string;
  revenueDelta: string;
  roas: string;
  roasDelta: string;
  leads: number;
  leadsDelta: string;
  cpa: string;
  cpaDelta: string;
  positiveCpa: boolean;
  series: { label: string; value: number; conv: number }[];
  funnel: { stage: string; count: string; rate: number; desc: string }[];
  channels: { name: string; share: number; roas: string; status: string }[];
}

const DATASETS: Record<TimeRange, PeriodDataset> = {
  "24H": {
    revenue: "R$ 14.890",
    revenueDelta: "+22.4%",
    roas: "5.8x",
    roasDelta: "+0.9x",
    leads: 142,
    leadsDelta: "+18.1%",
    cpa: "R$ 11,40",
    cpaDelta: "-14.2%",
    positiveCpa: true,
    series: [
      { label: "00h", value: 32, conv: 18 },
      { label: "04h", value: 24, conv: 12 },
      { label: "08h", value: 58, conv: 39 },
      { label: "12h", value: 84, conv: 62 },
      { label: "16h", value: 76, conv: 55 },
      { label: "20h", value: 96, conv: 78 },
      { label: "23h", value: 88, conv: 70 },
    ],
    funnel: [
      { stage: "PageView (Meta Pixel)", count: "8.420", rate: 100, desc: "Sessões únicas rastreadas" },
      { stage: "ViewContent (Engajamento)", count: "5.190", rate: 61.6, desc: "Scroll > 50% + Interação" },
      { stage: "InitiateCheckout / Click CTA", count: "1.280", rate: 15.2, desc: "Abertura de modal ou WhatsApp" },
      { stage: "Lead / Purchase Confirmado", count: "142", rate: 11.1, desc: "Conversão auditada via Pixel" },
    ],
    channels: [
      { name: "Meta Ads (Instagram Reels)", share: 54, roas: "6.4x", status: "Escala Alta" },
      { name: "Meta Retargeting (Catalog)", share: 28, roas: "8.1x", status: "Otimizado" },
      { name: "Google Search / Orgânico", share: 18, roas: "4.2x", status: "Estável" },
    ],
  },
  "7D": {
    revenue: "R$ 98.450",
    revenueDelta: "+31.8%",
    roas: "6.2x",
    roasDelta: "+1.4x",
    leads: 964,
    leadsDelta: "+26.5%",
    cpa: "R$ 9,85",
    cpaDelta: "-19.0%",
    positiveCpa: true,
    series: [
      { label: "Seg", value: 54, conv: 40 },
      { label: "Ter", value: 62, conv: 48 },
      { label: "Qua", value: 58, conv: 44 },
      { label: "Qui", value: 79, conv: 63 },
      { label: "Sex", value: 94, conv: 81 },
      { label: "Sáb", value: 99, conv: 86 },
      { label: "Dom", value: 87, conv: 72 },
    ],
    funnel: [
      { stage: "PageView (Meta Pixel)", count: "54.900", rate: 100, desc: "Sessões únicas rastreadas" },
      { stage: "ViewContent (Engajamento)", count: "34.120", rate: 62.1, desc: "Scroll > 50% + Interação" },
      { stage: "InitiateCheckout / Click CTA", count: "8.740", rate: 15.9, desc: "Abertura de modal ou WhatsApp" },
      { stage: "Lead / Purchase Confirmado", count: "964", rate: 11.0, desc: "Conversão auditada via Pixel" },
    ],
    channels: [
      { name: "Meta Ads (Instagram Reels)", share: 58, roas: "6.8x", status: "Escala Alta" },
      { name: "Meta Retargeting (Catalog)", share: 26, roas: "8.9x", status: "Otimizado" },
      { name: "Google Search / Orgânico", share: 16, roas: "4.5x", status: "Estável" },
    ],
  },
  "30D": {
    revenue: "R$ 412.800",
    revenueDelta: "+44.2%",
    roas: "6.7x",
    roasDelta: "+1.8x",
    leads: 4180,
    leadsDelta: "+38.9%",
    cpa: "R$ 8,90",
    cpaDelta: "-24.5%",
    positiveCpa: true,
    series: [
      { label: "S1", value: 48, conv: 35 },
      { label: "S2", value: 64, conv: 49 },
      { label: "S3", value: 78, conv: 62 },
      { label: "S4", value: 85, conv: 70 },
      { label: "S5", value: 91, conv: 77 },
      { label: "S6", value: 95, conv: 84 },
      { label: "S7", value: 100, conv: 92 },
    ],
    funnel: [
      { stage: "PageView (Meta Pixel)", count: "218.400", rate: 100, desc: "Sessões únicas rastreadas" },
      { stage: "ViewContent (Engajamento)", count: "141.960", rate: 65.0, desc: "Scroll > 50% + Interação" },
      { stage: "InitiateCheckout / Click CTA", count: "39.310", rate: 18.0, desc: "Abertura de modal ou WhatsApp" },
      { stage: "Lead / Purchase Confirmado", count: "4.180", rate: 10.6, desc: "Conversão auditada via Pixel" },
    ],
    channels: [
      { name: "Meta Ads (Instagram Reels)", share: 61, roas: "7.1x", status: "Escala Alta" },
      { name: "Meta Retargeting (Catalog)", share: 24, roas: "9.4x", status: "Otimizado" },
      { name: "Google Search / Orgânico", share: 15, roas: "4.8x", status: "Estável" },
    ],
  },
  "90D": {
    revenue: "R$ 1.180.000",
    revenueDelta: "+68.0%",
    roas: "7.1x",
    roasDelta: "+2.3x",
    leads: 12450,
    leadsDelta: "+52.4%",
    cpa: "R$ 8,15",
    cpaDelta: "-31.0%",
    positiveCpa: true,
    series: [
      { label: "Ago/Q1", value: 42, conv: 30 },
      { label: "Ago/Q2", value: 55, conv: 42 },
      { label: "Set/Q1", value: 68, conv: 54 },
      { label: "Set/Q2", value: 74, conv: 61 },
      { label: "Out/Q1", value: 89, conv: 75 },
      { label: "Out/Q2", value: 96, conv: 85 },
      { label: "Atual", value: 100, conv: 94 },
    ],
    funnel: [
      { stage: "PageView (Meta Pixel)", count: "640.000", rate: 100, desc: "Sessões únicas rastreadas" },
      { stage: "ViewContent (Engajamento)", count: "428.800", rate: 67.0, desc: "Scroll > 50% + Interação" },
      { stage: "InitiateCheckout / Click CTA", count: "115.200", rate: 18.0, desc: "Abertura de modal ou WhatsApp" },
      { stage: "Lead / Purchase Confirmado", count: "12.450", rate: 10.8, desc: "Conversão auditada via Pixel" },
    ],
    channels: [
      { name: "Meta Ads (Instagram Reels)", share: 64, roas: "7.5x", status: "Escala Alta" },
      { name: "Meta Retargeting (Catalog)", share: 22, roas: "9.8x", status: "Otimizado" },
      { name: "Google Search / Orgânico", share: 14, roas: "5.1x", status: "Estável" },
    ],
  },
};

interface PixelEventLog {
  id: string;
  eventName: string;
  pixelId: string;
  payload: string;
  timestamp: string;
  latency: string;
}

export default function PulseMetricsDashboard() {
  const soundRef = useRef<MetricsSoundEngine | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [range, setRange] = useState<TimeRange>("7D");
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const [pixelLogs, setPixelLogs] = useState<PixelEventLog[]>([
    {
      id: "EV-9921",
      eventName: "PageView",
      pixelId: META_PIXEL_ID,
      payload: '{ page: "/apps", referrer: "instagram.com" }',
      timestamp: "Agora mesmo",
      latency: "18ms",
    },
    {
      id: "EV-9920",
      eventName: "ViewContent",
      pixelId: META_PIXEL_ID,
      payload: '{ content_name: "PulseMetrics BI", currency: "BRL" }',
      timestamp: "Há 12s",
      latency: "22ms",
    },
    {
      id: "EV-9919",
      eventName: "Lead",
      pixelId: META_PIXEL_ID,
      payload: '{ value: 189.00, currency: "BRL", source: "WhatsApp" }',
      timestamp: "Há 45s",
      latency: "24ms",
    },
  ]);

  useEffect(() => {
    soundRef.current = new MetricsSoundEngine();
    const unsub = onAuthStateChanged(auth, setUser);
    return () => unsub();
  }, []);

  const currentData = useMemo(() => DATASETS[range], [range]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => {
      setToast((prev) => (prev === msg ? null : prev));
    }, 3000);
  };

  const handleToggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    if (soundRef.current) {
      soundRef.current.enabled = next;
      if (next) soundRef.current.playBlip(880);
    }
  };

  const handleFireLivePixelEvent = (eventName: string, samplePayload: Record<string, unknown>) => {
    soundRef.current?.playPulseSuccess();
    // Dispara de verdade no Meta Pixel (window.fbq) se carregado na página
    trackMetaEvent(eventName, samplePayload);

    const newLog: PixelEventLog = {
      id: `EV-${Math.floor(1000 + Math.random() * 9000)}`,
      eventName,
      pixelId: META_PIXEL_ID,
      payload: JSON.stringify(samplePayload),
      timestamp: new Date().toLocaleTimeString("pt-BR"),
      latency: `${Math.floor(14 + Math.random() * 15)}ms`,
    };

    setPixelLogs((prev) => [newLog, ...prev.slice(0, 5)]);
    showToast(`Evento [${eventName}] enviado ao Meta Pixel #${META_PIXEL_ID}`);
  };

  const handleGoogleSync = async () => {
    soundRef.current?.playBlip(640);
    try {
      await signInWithPopup(auth, googleProvider);
      soundRef.current?.playPulseSuccess();
      showToast("Telemetria sincronizada com sua conta Google!");
    } catch {
      showToast("Autenticação cancelada pelo operador.");
    }
  };

  return (
    <div className="min-h-[720px] bg-[#050811] text-slate-100 p-5 sm:p-8 lg:p-10 font-sans relative overflow-hidden select-none">
      {/* Cyber-Teal & Indigo Ambient Glows */}
      <div className="absolute -top-32 left-1/4 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute -bottom-32 right-10 w-[450px] h-[450px] bg-indigo-500/10 rounded-full blur-[130px] pointer-events-none" />

      {/* Subtle Matrix Grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(to right, #22d3ee 1px, transparent 1px), linear-gradient(to bottom, #22d3ee 1px, transparent 1px)`,
          backgroundSize: "48px 48px",
        }}
      />

      {/* Floating Notification Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -15, scale: 0.95 }}
            className="fixed top-20 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl bg-[#091326]/95 border border-cyan-400/50 shadow-[0_0_30px_rgba(34,211,238,0.3)] backdrop-blur-xl"
          >
            <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
            <span className="text-xs font-mono font-bold text-cyan-100">{toast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-10 space-y-8">
        {/* ==========================================
            1. TOP COMMAND HEADER
        ========================================== */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-slate-800/80 pb-6">
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-400 via-teal-500 to-indigo-600 flex items-center justify-center text-slate-950 shadow-[0_0_30px_rgba(34,211,238,0.35)] shrink-0">
              <BarChart3 className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-400/30 font-mono text-[10px] font-bold uppercase tracking-widest text-cyan-300">
                  <Radio className="w-3 h-3 animate-pulse text-cyan-400" />
                  Meta Pixel ID: {META_PIXEL_ID}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-teal-500/10 border border-teal-400/25 font-mono text-[10px] font-bold text-teal-300">
                  ● STREAM ATIVO
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white">
                Pulse<span className="text-cyan-400 italic">Metrics</span> • Growth & BI
              </h2>
            </div>
          </div>

          {/* Timeframe Selector & Audio Controls */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center bg-[#0B1220] border border-slate-800 p-1 rounded-xl">
              {(["24H", "7D", "30D", "90D"] as TimeRange[]).map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => {
                    soundRef.current?.playBlip(680);
                    setRange(item);
                  }}
                  className={`px-3.5 py-1.5 rounded-lg font-mono text-xs font-black transition-all ${
                    range === item
                      ? "bg-gradient-to-r from-cyan-400 to-teal-400 text-slate-950 shadow-[0_0_15px_rgba(34,211,238,0.4)]"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={handleToggleSound}
              title="Feedback Sonoro de Telemetria"
              className={`p-2.5 rounded-xl border transition-all ${
                soundEnabled
                  ? "bg-cyan-500/10 border-cyan-400/40 text-cyan-300"
                  : "bg-slate-900 border-slate-800 text-slate-500"
              }`}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {!user ? (
              <button
                type="button"
                onClick={handleGoogleSync}
                className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-bold uppercase tracking-wider text-cyan-300 flex items-center gap-2 transition-all"
              >
                <ShieldCheck className="w-4 h-4" /> Sync Cloud
              </button>
            ) : (
              <span className="px-3 py-2 rounded-xl bg-cyan-950/50 border border-cyan-500/30 font-mono text-[11px] text-cyan-200">
                ● {user.displayName?.split(" ")[0] || "Admin"}
              </span>
            )}
          </div>
        </div>

        {/* ==========================================
            2. KPI EXECUTIVE CARDS (4 COLUMNS)
        ========================================== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              title: "Receita Atribuída",
              val: currentData.revenue,
              delta: currentData.revenueDelta,
              positive: true,
              sub: `Janela selecionada (${range})`,
              icon: TrendingUp,
            },
            {
              title: "ROAS Médio (Meta Ads)",
              val: currentData.roas,
              delta: currentData.roasDelta,
              positive: true,
              sub: "Retorno sobre investimento",
              icon: Zap,
            },
            {
              title: "Leads & Conversões",
              val: currentData.leads.toLocaleString("pt-BR"),
              delta: currentData.leadsDelta,
              positive: true,
              sub: "Eventos fbq('track', 'Lead')",
              icon: Users,
            },
            {
              title: "Custo por Aquisição (CPA)",
              val: currentData.cpa,
              delta: currentData.cpaDelta,
              positive: currentData.positiveCpa,
              sub: "Otimização de algoritmo ativa",
              icon: Activity,
            },
          ].map((kpi, idx) => {
            const Icon = kpi.icon;
            return (
              <motion.div
                key={`${range}-${idx}`}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                onMouseEnter={() => soundRef.current?.playBlip(520 + idx * 80)}
                className="p-5 rounded-2xl bg-[#0A1120]/90 border border-slate-800/90 hover:border-cyan-400/40 transition-all group relative overflow-hidden"
              >
                <div className="absolute -right-8 -bottom-8 w-24 h-24 bg-cyan-400/5 rounded-full blur-xl group-hover:bg-cyan-400/15 transition-all" />
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
                    {kpi.title}
                  </span>
                  <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-400/20 flex items-center justify-center text-cyan-400">
                    <Icon className="w-4 h-4" />
                  </div>
                </div>

                <div className="flex items-baseline justify-between gap-2">
                  <span className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                    {kpi.val}
                  </span>
                  <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md bg-teal-500/15 border border-teal-400/30 text-teal-300 font-mono text-[11px] font-bold">
                    {kpi.delta.startsWith("-") ? (
                      <ArrowDownRight className="w-3 h-3" />
                    ) : (
                      <ArrowUpRight className="w-3 h-3" />
                    )}
                    {kpi.delta}
                  </span>
                </div>
                <p className="text-[11px] font-mono text-slate-500 mt-2">{kpi.sub}</p>
              </motion.div>
            );
          })}
        </div>

        {/* ==========================================
            3. MAIN BENTO GRID: CHART + FUNNEL
        ========================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Interactive Velocity Chart (7 Cols) */}
          <div className="lg:col-span-7 p-6 rounded-3xl bg-[#0A1120]/90 border border-slate-800/90 flex flex-col justify-between">
            <div>
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 block">
                    // TELEMETRIA DE TRÁFEGO & CONVERSÃO
                  </span>
                  <h3 className="text-lg font-black uppercase text-white">
                    Curva de Demanda & Eventos ({range})
                  </h3>
                </div>
                <div className="flex items-center gap-4 text-xs font-mono">
                  <span className="flex items-center gap-1.5 text-cyan-300">
                    <span className="w-2.5 h-2.5 rounded-sm bg-cyan-400 inline-block" /> Volume Tráfego
                  </span>
                  <span className="flex items-center gap-1.5 text-indigo-300">
                    <span className="w-2.5 h-2.5 rounded-sm bg-indigo-500 inline-block" /> Conversões
                  </span>
                </div>
              </div>

              {/* Interactive Dual Bar Chart */}
              <div className="h-56 flex items-end justify-between gap-3 pt-6 px-2 border-b border-slate-800/80">
                {currentData.series.map((point, idx) => {
                  const isHovered = hoveredBar === idx;
                  return (
                    <div
                      key={point.label}
                      onMouseEnter={() => {
                        soundRef.current?.playBlip(600 + idx * 60);
                        setHoveredBar(idx);
                      }}
                      onMouseLeave={() => setHoveredBar(null)}
                      className="flex-1 flex flex-col items-center gap-2 h-full justify-end cursor-pointer group"
                    >
                      <div className="relative w-full flex items-end justify-center gap-1.5 h-44">
                        {isHovered && (
                          <motion.div
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="absolute -top-8 z-20 px-2 py-0.5 rounded bg-cyan-400 text-slate-950 font-mono text-[10px] font-black whitespace-nowrap shadow-lg"
                          >
                            {point.value}% / {point.conv} conv
                          </motion.div>
                        )}
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: `${point.value}%` }}
                          transition={{ duration: 0.5, delay: idx * 0.04 }}
                          className={`w-full max-w-[22px] rounded-t-lg transition-colors ${
                            isHovered
                              ? "bg-cyan-300 shadow-[0_0_20px_rgba(34,211,238,0.6)]"
                              : "bg-gradient-to-t from-cyan-600/60 to-cyan-400"
                          }`}
                        />
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: `${point.conv}%` }}
                          transition={{ duration: 0.5, delay: idx * 0.06 }}
                          className="w-full max-w-[14px] rounded-t-lg bg-gradient-to-t from-indigo-700/70 to-indigo-400"
                        />
                      </div>
                      <span className="font-mono text-[11px] text-slate-400 group-hover:text-cyan-300">
                        {point.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Channel Attribution Breakdown */}
            <div className="mt-6 pt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
              {currentData.channels.map((ch) => (
                <div
                  key={ch.name}
                  className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between text-[10px] font-mono text-cyan-400 mb-1">
                    <span>{ch.status}</span>
                    <span>ROAS {ch.roas}</span>
                  </div>
                  <p className="text-xs font-bold text-white truncate">{ch.name}</p>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-2">
                    <div
                      className="bg-gradient-to-r from-cyan-400 to-teal-400 h-full"
                      style={{ width: `${ch.share}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Conversion Funnel (5 Cols) */}
          <div className="lg:col-span-5 p-6 rounded-3xl bg-[#0A1120]/90 border border-slate-800/90 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-teal-400 block">
                    // FUNIL DE ATRIBUIÇÃO
                  </span>
                  <h3 className="text-lg font-black uppercase text-white">
                    Jornada de Eventos do Pixel
                  </h3>
                </div>
                <Filter className="w-5 h-5 text-cyan-400" />
              </div>

              <div className="space-y-4">
                {currentData.funnel.map((step, i) => (
                  <div
                    key={step.stage}
                    className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800/80 hover:border-cyan-500/30 transition-all"
                  >
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-bold text-white flex items-center gap-2">
                        <span className="font-mono text-[10px] text-cyan-400">0{i + 1}</span>
                        {step.stage}
                      </span>
                      <span className="font-mono font-black text-cyan-300">{step.count}</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2">
                      <span>{step.desc}</span>
                      <span className="font-mono text-teal-400">{step.rate}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${step.rate}%` }}
                        transition={{ duration: 0.6, delay: i * 0.08 }}
                        className="h-full bg-gradient-to-r from-cyan-400 via-teal-400 to-indigo-500"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 p-3.5 rounded-2xl bg-cyan-500/10 border border-cyan-400/25 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
                <span className="text-xs font-medium text-cyan-100">
                  Diagnóstico: Pixel <strong>#{META_PIXEL_ID}</strong> operando sem perda de pacote.
                </span>
              </div>
              <Globe className="w-4 h-4 text-cyan-400 shrink-0" />
            </div>
          </div>
        </div>

        {/* ==========================================
            4. META PIXEL LIVE EVENT SIMULATOR & INSPECTOR
        ========================================== */}
        <div className="rounded-3xl bg-[#070C17] border border-cyan-500/30 p-6 shadow-[0_0_50px_rgba(6,182,212,0.08)]">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 mb-5 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono uppercase text-cyan-400 mb-1">
                <Terminal className="w-4 h-4" />
                <span>Console de Disparo & Auditoria em Tempo Real</span>
              </div>
              <h3 className="text-lg font-black uppercase text-white">
                Testador Interativo do Meta Pixel ({META_PIXEL_ID})
              </h3>
              <p className="text-xs text-slate-400">
                Clique nos botões abaixo para disparar eventos reais no navegador (`window.fbq`) e
                validar no extensão Meta Pixel Helper.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  handleFireLivePixelEvent("Lead", {
                    content_name: "Consultoria FocusPulse",
                    value: 250.0,
                    currency: "BRL",
                  })
                }
                className="px-3.5 py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-[0_0_20px_rgba(34,211,238,0.35)]"
              >
                <MousePointerClick className="w-3.5 h-3.5" /> Disparar Lead
              </button>

              <button
                type="button"
                onClick={() =>
                  handleFireLivePixelEvent("InitiateCheckout", {
                    content_category: "Template Web",
                    num_items: 1,
                    value: 1490.0,
                    currency: "BRL",
                  })
                }
                className="px-3.5 py-2.5 rounded-xl bg-teal-400 hover:bg-teal-300 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all"
              >
                <Layers className="w-3.5 h-3.5" /> InitiateCheckout
              </button>

              <button
                type="button"
                onClick={() =>
                  handleFireLivePixelEvent("Schedule", {
                    service: "Chronos Atomic Booking",
                    status: "locked",
                  })
                }
                className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-cyan-300 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Evento Schedule
              </button>
            </div>
          </div>

          {/* Live Stream Table */}
          <div className="space-y-2 font-mono text-xs">
            {pixelLogs.map((log) => (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-3 rounded-xl bg-slate-950/90 border border-slate-800/90 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="px-2 py-0.5 rounded bg-cyan-500/15 border border-cyan-400/30 text-cyan-300 font-bold text-[10px]">
                    {log.id}
                  </span>
                  <span className="font-bold text-teal-300">fbq(&apos;track&apos;, &apos;{log.eventName}&apos;)</span>
                  <span className="text-slate-400 truncate text-[11px]">{log.payload}</span>
                </div>
                <div className="flex items-center gap-3 shrink-0 text-[11px]">
                  <span className="text-emerald-400">200 OK ({log.latency})</span>
                  <span className="text-slate-500">{log.timestamp}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}