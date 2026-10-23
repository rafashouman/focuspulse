"use client";

import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Clock,
  ShieldCheck,
  Sparkles,
  Activity,
  Volume2,
  VolumeX,
  CheckCircle2,
  AlertCircle,
  LayoutDashboard,
  Layers,
  Cpu,
  UserCheck,
  ArrowUpRight,
  Lock,
  Terminal,
} from "lucide-react";
import { bookAppointment } from "@/app/actions/bookAppointment";
import { onAuthStateChanged, signInWithPopup, User } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase/client";

// ==========================================
// WEB AUDIO SYNTHESIZER (PRECISION UI SOUNDS)
// ==========================================
class ChronosSoundEngine {
  private ctx: AudioContext | null = null;
  public enabled: boolean = true;

  private init() {
    if (typeof window === "undefined") return;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  playTick() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(880, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(440, this.ctx.currentTime + 0.035);
    gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.005, this.ctx.currentTime + 0.035);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.04);
  }

  playLockSuccess() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    [523.25, 659.25, 783.99, 1046.5].forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(freq, now + idx * 0.065);
      gain.gain.setValueAtTime(0.14, now + idx * 0.065);
      gain.gain.exponentialRampToValueAtTime(0.004, now + idx * 0.065 + 0.28);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + idx * 0.065);
      osc.stop(now + idx * 0.065 + 0.3);
    });
  }

  playAlert() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(190, now);
    osc.frequency.linearRampToValueAtTime(130, now + 0.2);
    gain.gain.setValueAtTime(0.12, now);
    gain.gain.linearRampToValueAtTime(0.01, now + 0.2);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.22);
  }
}

const AVAILABLE_SLOTS = [
  { time: "09:00", load: "Baixa Concorrência" },
  { time: "10:30", load: "Alta Demanda" },
  { time: "14:00", load: "Ideal" },
  { time: "15:30", load: "Última Vaga" },
  { time: "17:00", load: "Executivo" },
];

const SERVICES_CATALOG = [
  {
    id: "srv-arch",
    name: "Consultoria de Arquitetura & Performance",
    category: "System Design & Cloud",
    duration: "60 min",
    sla: "99.99% TX Lock",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80",
    specialist: "Dr. Marcus Vance",
    specialistRole: "Principal Cloud Architect",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: "srv-sec",
    name: "Auditoria Zero-Trust & Firestore Rules",
    category: "Cybersecurity & Auth",
    duration: "45 min",
    sla: "Isolamento Atômico",
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80",
    specialist: "Elena Rostova",
    specialistRole: "Lead Security Engineer",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: "srv-ui",
    name: "Design System & Next.js App Router Lab",
    category: "Front-End Engineering",
    duration: "90 min",
    sla: "Edge Rendering",
    image: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80",
    specialist: "Kaelen Sato",
    specialistRole: "Staff UX Engineer",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
  },
];

interface BookingRecord {
  id: string;
  service: string;
  specialist: string;
  date: string;
  slot: string;
  latencyMs: number;
  status: "LOCKED" | "VERIFIED";
  image: string;
}

export default function ChronosBooking() {
  const soundRef = useRef<ChronosSoundEngine | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [activeView, setActiveView] = useState<"booking" | "dashboard">("booking");

  const [selectedService, setSelectedService] = useState(SERVICES_CATALOG[0]);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState<string | null>("10:30");
  const [status, setStatus] = useState<"IDLE" | "LOADING" | "SUCCESS" | "ERROR">("IDLE");
  const [feedbackMsg, setFeedbackMsg] = useState("");
  const [user, setUser] = useState<User | null>(null);

  const [bookingsHistory, setBookingsHistory] = useState<BookingRecord[]>([
    {
      id: "CHR-904A",
      service: SERVICES_CATALOG[0].name,
      specialist: SERVICES_CATALOG[0].specialist,
      date: "2026-10-25",
      slot: "14:00",
      latencyMs: 38,
      status: "VERIFIED",
      image: SERVICES_CATALOG[0].image,
    },
    {
      id: "CHR-772B",
      service: SERVICES_CATALOG[1].name,
      specialist: SERVICES_CATALOG[1].specialist,
      date: "2026-10-26",
      slot: "09:00",
      latencyMs: 42,
      status: "LOCKED",
      image: SERVICES_CATALOG[1].image,
    },
  ]);

  useEffect(() => {
    soundRef.current = new ChronosSoundEngine();
    const unsubscribe = onAuthStateChanged(auth, setUser);
    const frameId = requestAnimationFrame(() => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setSelectedDate(
        [
          tomorrow.getFullYear(),
          String(tomorrow.getMonth() + 1).padStart(2, "0"),
          String(tomorrow.getDate()).padStart(2, "0"),
        ].join("-")
      );
    });

    return () => {
      unsubscribe();
      cancelAnimationFrame(frameId);
    };
  }, []);

  const toggleAudio = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    if (soundRef.current) {
      soundRef.current.enabled = next;
      if (next) soundRef.current.playTick();
    }
  };

  const handleLogin = async () => {
    soundRef.current?.playTick();
    setStatus("LOADING");
    try {
      await signInWithPopup(auth, googleProvider);
      soundRef.current?.playLockSuccess();
      setStatus("IDLE");
      setFeedbackMsg("");
    } catch (error) {
      console.error("Unable to sign in before appointment booking.", error);
      soundRef.current?.playAlert();
      setStatus("ERROR");
      setFeedbackMsg("Não foi possível entrar com o Google. Tente novamente.");
    }
  };

  const handleBooking = async () => {
    if (!selectedSlot) return;

    if (!user) {
      soundRef.current?.playAlert();
      setStatus("ERROR");
      setFeedbackMsg("Autentique-se com Google para executar o Lock Transacional.");
      return;
    }

    soundRef.current?.playTick();
    setStatus("LOADING");
    const startTime = performance.now();

    try {
      const token = await user.getIdToken();
      const res = await bookAppointment(
        {
          date: selectedDate,
          timeSlot: selectedSlot,
          serviceName: selectedService.name,
        },
        token
      );

      const elapsed = Math.max(24, Math.round(performance.now() - startTime));

      if (res.success) {
        soundRef.current?.playLockSuccess();
        const shortId = `CHR-${res.bookingId?.slice(-4).toUpperCase() || "881X"}`;
        setStatus("SUCCESS");
        setFeedbackMsg(
          `Slot ${selectedSlot} travado sob protocolo #${shortId} (${elapsed}ms)`
        );
        setBookingsHistory((prev) => [
          {
            id: shortId,
            service: selectedService.name,
            specialist: selectedService.specialist,
            date: selectedDate,
            slot: selectedSlot,
            latencyMs: elapsed,
            status: "LOCKED",
            image: selectedService.image,
          },
          ...prev,
        ]);
      } else {
        soundRef.current?.playAlert();
        setStatus("ERROR");
        setFeedbackMsg(res.error || "Conflito de concorrência detectado.");
      }
    } catch (error) {
      console.error("Unable to submit appointment booking.", error);
      soundRef.current?.playAlert();
      setStatus("ERROR");
      setFeedbackMsg("Erro de comunicação com o servidor transacional.");
    }
  };

  return (
    <div className="min-h-[680px] bg-[#F8FAFC] text-[#0F172A] p-6 sm:p-10 font-sans border border-slate-200/90 shadow-2xl flex flex-col justify-between relative overflow-hidden">
      {/* Subtle Cobalt Blueprint Grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.035]"
        style={{
          backgroundImage: `linear-gradient(to right, #002FA7 1px, transparent 1px), linear-gradient(to bottom, #002FA7 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative z-10">
        {/* ==========================================
            1. TOP HEADER & TELEMETRY SWITCHER
        ========================================== */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6 mb-8">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#002FA7] text-white flex items-center justify-center shadow-[0_10px_25px_rgba(0,47,167,0.3)]">
              <Cpu className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-[0.22em] text-[#002FA7] font-bold">
                  Chronos Atomic Engine v3.8
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 font-mono text-[10px] font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                  FIRESTORE TX
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
                Chronos<span className="text-[#002FA7]">Book</span> Executive
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="flex bg-slate-200/80 p-1 rounded-xl border border-slate-300/80">
              <button
                type="button"
                onClick={() => {
                  soundRef.current?.playTick();
                  setActiveView("booking");
                }}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                  activeView === "booking"
                    ? "bg-[#002FA7] text-white shadow"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Agendamento</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  soundRef.current?.playTick();
                  setActiveView("dashboard");
                }}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                  activeView === "dashboard"
                    ? "bg-[#002FA7] text-white shadow"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>Dashboard</span>
                <span className="px-1.5 py-0.2 rounded bg-black/20 font-mono text-[10px]">
                  {bookingsHistory.length}
                </span>
              </button>
            </div>

            <button
              type="button"
              onClick={toggleAudio}
              className={`p-2.5 rounded-xl border transition-colors ${
                soundEnabled
                  ? "bg-blue-50 border-[#002FA7]/30 text-[#002FA7]"
                  : "bg-slate-100 border-slate-300 text-slate-400"
              }`}
              title="Feedback Sonoro de Precisão"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* ==========================================
            2. AUTHENTICATION BAR
        ========================================== */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-white border border-slate-200/90 p-4 shadow-sm">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-[#002FA7] shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 block">
                Sessão Criptografada • OAuth 2.0
              </span>
              <p className="truncate text-xs sm:text-sm font-bold text-slate-800">
                {user
                  ? `Credencial Ativa: ${user.displayName || user.email}`
                  : "Autentique-se com Google para habilitar reservas atômicas no Firestore."}
              </p>
            </div>
          </div>

          {!user && (
            <button
              type="button"
              onClick={() => void handleLogin()}
              disabled={status === "LOADING"}
              className="shrink-0 rounded-xl bg-[#002FA7] hover:bg-blue-800 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white transition-all shadow-[0_8px_20px_rgba(0,47,167,0.25)] disabled:opacity-50"
            >
              Autenticar Google
            </button>
          )}
        </div>

        {/* ==========================================
            VIEW 1: INTERACTIVE BOOKING SUITE
        ========================================== */}
        {activeView === "booking" && (
          <div className="space-y-8">
            {/* Visual Service Cards with Images */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                1. Selecione a Especialidade & Arquitetura
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {SERVICES_CATALOG.map((srv) => {
                  const active = selectedService.id === srv.id;
                  return (
                    <motion.div
                      key={srv.id}
                      whileHover={{ y: -3 }}
                      onClick={() => {
                        soundRef.current?.playTick();
                        setSelectedService(srv);
                        setStatus("IDLE");
                      }}
                      className={`cursor-pointer rounded-2xl overflow-hidden border transition-all flex flex-col justify-between bg-white ${
                        active
                          ? "border-2 border-[#002FA7] shadow-[0_12px_30px_rgba(0,47,167,0.15)]"
                          : "border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <div>
                        <div className="relative h-32 w-full overflow-hidden bg-slate-900">
                          <Image
                            src={srv.image}
                            alt={srv.name}
                            fill
                            unoptimized
                            className="object-cover opacity-90"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
                          <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-md bg-[#002FA7] text-white font-mono text-[10px] font-bold uppercase">
                            {srv.duration}
                          </span>
                          <span className="absolute bottom-2 left-2.5 text-[10px] font-mono text-blue-200 uppercase">
                            {srv.category}
                          </span>
                        </div>

                        <div className="p-4">
                          <h3 className="text-sm font-extrabold text-slate-900 leading-snug">
                            {srv.name}
                          </h3>
                        </div>
                      </div>

                      <div className="px-4 pb-3.5 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="relative w-7 h-7 rounded-full overflow-hidden border border-slate-300">
                            <Image
                              src={srv.avatar}
                              alt={srv.specialist}
                              fill
                              unoptimized
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <p className="text-[11px] font-bold text-slate-800 leading-none">
                              {srv.specialist}
                            </p>
                            <p className="text-[9px] font-mono text-slate-400">
                              {srv.specialistRole}
                            </p>
                          </div>
                        </div>
                        <span className="font-mono text-[10px] font-bold text-[#002FA7] bg-blue-50 px-2 py-0.5 rounded">
                          {srv.sla}
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Date & Time Slot Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                  <Calendar className="w-4 h-4 text-[#002FA7]" /> 2. Data de Operação
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  min={selectedDate}
                  onChange={(e) => {
                    soundRef.current?.playTick();
                    setSelectedDate(e.target.value);
                    setStatus("IDLE");
                  }}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-mono text-sm focus:outline-none focus:border-[#002FA7] transition-colors"
                />
              </div>

              <div className="lg:col-span-8 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                  <Clock className="w-4 h-4 text-[#002FA7]" /> 3. Janela de Disponibilidade Atômica
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                  {AVAILABLE_SLOTS.map((item) => {
                    const isSelected = selectedSlot === item.time;
                    return (
                      <motion.button
                        key={item.time}
                        type="button"
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.96 }}
                        onClick={() => {
                          soundRef.current?.playTick();
                          setSelectedSlot(item.time);
                          setStatus("IDLE");
                        }}
                        className={`p-3 rounded-xl font-mono text-left border transition-all ${
                          isSelected
                            ? "bg-[#002FA7] text-white border-[#002FA7] shadow-[0_10px_25px_rgba(0,47,167,0.28)]"
                            : "bg-slate-50 text-slate-800 border-slate-200 hover:border-[#002FA7]/50"
                        }`}
                      >
                        <span className="text-sm font-black block">{item.time}</span>
                        <span
                          className={`text-[9px] uppercase block mt-0.5 ${
                            isSelected ? "text-blue-200" : "text-slate-400"
                          }`}
                        >
                          {item.load}
                        </span>
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==========================================
            VIEW 2: TELEMETRY & AUDIT DASHBOARD
        ========================================== */}
        {activeView === "dashboard" && (
          <div className="space-y-6">
            {/* Metrics Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono uppercase text-slate-400 block">
                    Latência Média Firestore TX
                  </span>
                  <span className="text-2xl font-black text-slate-900">39.4 ms</span>
                  <span className="text-[11px] font-mono text-emerald-600 block mt-0.5">
                    ● Zero Colisões Detectadas
                  </span>
                </div>
                <Activity className="w-8 h-8 text-[#002FA7]" />
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono uppercase text-slate-400 block">
                    Taxa de Ocupação da Agenda
                  </span>
                  <span className="text-2xl font-black text-slate-900">84.2%</span>
                  <span className="text-[11px] font-mono text-[#002FA7] block mt-0.5">
                    3 Especialistas Online
                  </span>
                </div>
                <UserCheck className="w-8 h-8 text-[#002FA7]" />
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono uppercase text-slate-400 block">
                    Protocolos Ativos
                  </span>
                  <span className="text-2xl font-black text-slate-900">
                    {bookingsHistory.length} Locks
                  </span>
                  <span className="text-[11px] font-mono text-slate-500 block mt-0.5">
                    Auditoria SHA-256 Ativa
                  </span>
                </div>
                <Lock className="w-8 h-8 text-[#002FA7]" />
              </div>
            </div>

            {/* Active Protocols List with Visual Previews */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-[#002FA7]" />
                  Registro Transacional de Agendamentos
                </h3>
                <span className="font-mono text-[11px] text-slate-400">
                  REAL-TIME SNAPSHOT
                </span>
              </div>

              <div className="space-y-3">
                {bookingsHistory.map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-slate-300">
                        <Image
                          src={item.image}
                          alt={item.service}
                          fill
                          unoptimized
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-[#002FA7]">
                            #{item.id}
                          </span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-700 font-bold">
                            {item.status} ({item.latencyMs}ms)
                          </span>
                        </div>
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900 mt-0.5">
                          {item.service}
                        </h4>
                        <p className="text-[11px] text-slate-500">
                          Especialista: {item.specialist}
                        </p>
                      </div>
                    </div>

                    <div className="sm:text-right font-mono text-xs text-slate-700 shrink-0">
                      <p className="font-bold">{item.date}</p>
                      <p className="text-[#002FA7] font-black">{item.slot} BRT</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ==========================================
          3. FOOTER CONFIRMATION & VISUAL FEEDBACK
      ========================================== */}
      <div className="relative z-10 pt-6 mt-8 border-t border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex-1">
          <AnimatePresence mode="wait">
            {status !== "IDLE" ? (
              <motion.div
                key={status}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                className={`flex items-center gap-2 text-xs font-mono ${
                  status === "ERROR"
                    ? "text-red-600 font-bold"
                    : status === "SUCCESS"
                    ? "text-emerald-700 font-bold"
                    : "text-[#002FA7]"
                }`}
              >
                {status === "SUCCESS" && <CheckCircle2 className="w-4 h-4 shrink-0" />}
                {status === "ERROR" && <AlertCircle className="w-4 h-4 shrink-0" />}
                <span>
                  {status === "LOADING"
                    ? "Executando lock transacional no Firestore..."
                    : feedbackMsg}
                </span>
              </motion.div>
            ) : (
              <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
                <Sparkles className="w-4 h-4 text-[#002FA7]" />
                <span>
                  Selecionado: <strong className="text-slate-800">{selectedService.name}</strong> às{" "}
                  <strong className="text-[#002FA7]">{selectedSlot}</strong>
                </span>
              </div>
            )}
          </AnimatePresence>
        </div>

        <button
          type="button"
          onClick={handleBooking}
          disabled={!selectedSlot || status === "LOADING"}
          className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#0F172A] hover:bg-[#002FA7] text-white font-bold text-xs uppercase tracking-[0.18em] transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <span>{status === "LOADING" ? "Processando Lock..." : "Confirmar Horário Atômico"}</span>
          <ArrowUpRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}