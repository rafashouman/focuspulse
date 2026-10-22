"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Clock,
  Users,
  Sparkles,
  Flame,
  ShieldCheck,
  LogIn,
  CheckCircle2,
  AlertTriangle,
  MessageCircle,
  X,
} from "lucide-react";
import { onAuthStateChanged, signInWithPopup, User } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase/client";
import { bookAppointment } from "@/app/actions/bookAppointment";

const KOBRA_SLOTS = ["19:00", "20:00", "21:00", "22:00", "23:00"];

const SEATING_ZONES = [
  {
    id: "balcao-chef",
    name: "Balcão Fire Pit",
    desc: "Frente à chapa • Degustação guiada",
    badge: "Alta Demanda",
  },
  {
    id: "booth-neon",
    name: "Booth Acid Lounge",
    desc: "Sofás reservados • Som ambiente",
    badge: "Ideal p/ Grupos",
  },
  {
    id: "salao-lab",
    name: "Salão Principal Lab",
    desc: "Mesas centrais • Clima urbano",
    badge: "Clássico",
  },
];

interface KobraTableBookingProps {
  embedded?: boolean;
  whatsappNumber?: string;
  onClose?: () => void;
}

export default function KobraTableBooking({
  embedded = false,
  whatsappNumber = "5511999999999",
  onClose,
}: KobraTableBookingProps) {
  const [selectedDate, setSelectedDate] = useState("");
  const [minDate, setMinDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState<string | null>("20:00");
  const [guests, setGuests] = useState<number>(2);
  const [selectedZone, setSelectedZone] = useState(SEATING_ZONES[0]);
  const [status, setStatus] = useState<"IDLE" | "LOADING" | "SUCCESS" | "ERROR">("IDLE");
  const [feedbackMsg, setFeedbackMsg] = useState("");
  const [protocolCode, setProtocolCode] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, setUser);
    const frameId = requestAnimationFrame(() => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const formatted = [
        tomorrow.getFullYear(),
        String(tomorrow.getMonth() + 1).padStart(2, "0"),
        String(tomorrow.getDate()).padStart(2, "0"),
      ].join("-");
      setSelectedDate(formatted);
      setMinDate(formatted);
    });

    return () => {
      unsubscribe();
      cancelAnimationFrame(frameId);
    };
  }, []);

  const handleLogin = async () => {
    setStatus("LOADING");
    try {
      await signInWithPopup(auth, googleProvider);
      setStatus("IDLE");
      setFeedbackMsg("");
    } catch (error) {
      console.error("Unable to sign in before table booking.", error);
      setStatus("ERROR");
      setFeedbackMsg("Não foi possível autenticar com o Google. Tente novamente.");
    }
  };

  const handleBooking = async () => {
    if (!selectedSlot) return;

    if (!user) {
      setStatus("ERROR");
      setFeedbackMsg("Conecte sua conta Google para travar a mesa no sistema.");
      return;
    }

    setStatus("LOADING");
    try {
      const token = await user.getIdToken();
      const serviceSummary = `KOBRA VIP • ${selectedZone.name} (${guests} pessoas)`;

      const res = await bookAppointment(
        {
          date: selectedDate,
          timeSlot: selectedSlot,
          serviceName: serviceSummary,
          guests,
          seatingZone: selectedZone.name,
        },
        token
      );

      if (res.success) {
        const shortCode = res.bookingId?.slice(-6).toUpperCase() || "KBR99";
        setProtocolCode(shortCode);
        setStatus("SUCCESS");
        setFeedbackMsg(
          `Mesa travada às ${selectedSlot} (${selectedZone.name}) • Protocolo #${shortCode}`
        );
      } else {
        setStatus("ERROR");
        setFeedbackMsg(res.error || "Erro ao processar reserva.");
      }
    } catch (error) {
      console.error("Unable to submit appointment booking.", error);
      setStatus("ERROR");
      setFeedbackMsg("Falha de conexão com o servidor de reservas.");
    }
  };

  const handleSendWhatsAppTicket = () => {
    if (!protocolCode || !selectedSlot) return;
    const text = `*RESERVA CONFIRMADA — KOBRA.LAB* ⚡🍔\n----------------------------------\n*Protocolo Firestore:* #${protocolCode}\n*Cliente:* ${
      user?.displayName || user?.email || "VIP"
    }\n*Data:* ${selectedDate}\n*Horário:* ${selectedSlot}\n*Lugares:* ${guests} pessoas\n*Ambiente:* ${
      selectedZone.name
    }\n----------------------------------\n_Reserva validada via Lock Transacional._`;

    window.open(
      `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`,
      "_blank"
    );
  };

  return (
    <div
      className={`${
        embedded
          ? "w-full rounded-3xl bg-zinc-950/90 border border-lime-400/25 shadow-[0_0_70px_rgba(163,230,53,0.07)]"
          : "min-h-screen bg-[#060608] flex items-center justify-center p-4 sm:p-8"
      } text-zinc-100 font-sans relative overflow-hidden`}
    >
      <div
        className={`${
          embedded
            ? "p-6 sm:p-10 w-full"
            : "w-full max-w-4xl rounded-3xl bg-[#0A0B0E] border border-zinc-800 p-6 sm:p-10 shadow-2xl"
        } relative z-10`}
      >
        {/* Glow Urbano de Fundo */}
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-lime-400/10 rounded-full blur-[110px] pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-emerald-500/10 rounded-full blur-[110px] pointer-events-none" />

        {/* 1. Header Telemetry */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-800/90 pb-6 mb-8">
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest text-lime-400 mb-1.5">
              <Flame className="w-3.5 h-3.5" /> Kobra.Lab Table Engine • Atomic Lock
            </span>
            <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-white">
              Reserva de <span className="text-lime-400 italic">Mesa & Balcão</span>
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right font-mono text-[11px] bg-zinc-900/90 border border-zinc-800 px-3.5 py-2 rounded-xl">
              <p className="text-zinc-400">SYNC: FIRESTORE TX</p>
              <p className="text-emerald-400 font-bold flex items-center justify-end gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                ZERO DOUBLE-BOOKING
              </p>
            </div>
            {onClose && (
              <button
                onClick={onClose}
                className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-lime-400 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* 2. Barra de Sessão Firebase Auth */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 p-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-lime-400/10 border border-lime-400/30 flex items-center justify-center text-lime-400 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 block">
                Credencial Anti-Conflito
              </span>
              <p className="truncate text-xs sm:text-sm font-bold text-zinc-200">
                {user
                  ? `Operador Autenticado: ${user.displayName || user.email}`
                  : "Conecte seu Google para bloquear um horário exclusivo na fornalha."}
              </p>
            </div>
          </div>

          {!user && (
            <button
              type="button"
              onClick={() => void handleLogin()}
              disabled={status === "LOADING"}
              className="shrink-0 inline-flex items-center gap-2 rounded-xl bg-lime-400 hover:bg-lime-300 px-4 py-2.5 text-xs font-black uppercase tracking-wider text-zinc-950 transition-all shadow-[0_0_20px_rgba(163,230,53,0.3)] disabled:opacity-50"
            >
              <LogIn className="w-4 h-4" />
              Autenticar com Google
            </button>
          )}
        </div>

        {/* 3. Configuração da Reserva */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
          {/* Coluna Esquerda: Data & Pessoas */}
          <div className="lg:col-span-5 space-y-6 bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-5">
            <div>
              <label className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-lime-400 font-bold mb-3">
                <Calendar className="w-4 h-4" /> 01. Data da Experiência
              </label>
              <input
                type="date"
                value={selectedDate}
                min={minDate}
                onChange={(e) => {
                  setSelectedDate(e.target.value);
                  setStatus("IDLE");
                }}
                className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-white font-mono text-sm focus:outline-none focus:border-lime-400 transition-colors"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-lime-400 font-bold mb-3">
                <Users className="w-4 h-4" /> 02. Lugares na Mesa
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[2, 4, 6, 8].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => {
                      setGuests(num);
                      setStatus("IDLE");
                    }}
                    className={`py-2.5 rounded-xl font-mono text-xs font-bold border transition-all ${
                      guests === num
                        ? "bg-lime-400 text-zinc-950 border-lime-400 shadow-[0_0_15px_rgba(163,230,53,0.3)]"
                        : "bg-zinc-950 text-zinc-400 border-zinc-800 hover:text-white"
                    }`}
                  >
                    {num}P
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Coluna Direita: Ambiente & Horários */}
          <div className="lg:col-span-7 space-y-6 bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-5">
            <div>
              <label className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-lime-400 font-bold mb-3">
                <Sparkles className="w-4 h-4" /> 03. Zona do Laboratório
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {SEATING_ZONES.map((zone) => {
                  const active = selectedZone.id === zone.id;
                  return (
                    <button
                      key={zone.id}
                      type="button"
                      onClick={() => {
                        setSelectedZone(zone);
                        setStatus("IDLE");
                      }}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        active
                          ? "bg-lime-400/15 border-lime-400 text-white"
                          : "bg-zinc-950/70 border-zinc-800/80 text-zinc-400 hover:text-white"
                      }`}
                    >
                      <span className="text-[10px] font-mono uppercase text-lime-400 block">
                        {zone.badge}
                      </span>
                      <span className="text-xs font-black text-white block mt-0.5">
                        {zone.name}
                      </span>
                      <span className="text-[11px] text-zinc-400 line-clamp-1 mt-1">
                        {zone.desc}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-lime-400 font-bold mb-3">
                <Clock className="w-4 h-4" /> 04. Turno de Fogo (Horário)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                {KOBRA_SLOTS.map((slot) => {
                  const isSelected = selectedSlot === slot;
                  return (
                    <motion.button
                      key={slot}
                      type="button"
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => {
                        setSelectedSlot(slot);
                        setStatus("IDLE");
                      }}
                      className={`py-3 px-3 rounded-xl font-mono text-xs font-black border transition-all ${
                        isSelected
                          ? "bg-lime-400 text-zinc-950 border-lime-400 shadow-[0_0_25px_rgba(163,230,53,0.35)]"
                          : "bg-zinc-950 text-zinc-300 border-zinc-800 hover:border-lime-400/50"
                      }`}
                    >
                      {slot}
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* 4. Rodapé de Confirmação e Disparo Transacional */}
        <div className="pt-6 border-t border-zinc-800/90 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="flex-1">
            <AnimatePresence mode="wait">
              {status !== "IDLE" ? (
                <motion.div
                  key={status}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  className={`flex items-center gap-2.5 text-xs font-mono ${
                    status === "ERROR"
                      ? "text-red-400"
                      : status === "SUCCESS"
                      ? "text-emerald-400 font-bold"
                      : "text-lime-400"
                  }`}
                >
                  {status === "SUCCESS" && <CheckCircle2 className="w-4 h-4 shrink-0" />}
                  {status === "ERROR" && <AlertTriangle className="w-4 h-4 shrink-0" />}
                  <span>
                    {status === "LOADING"
                      ? "Executando lock transacional no Firestore..."
                      : feedbackMsg}
                  </span>
                </motion.div>
              ) : (
                <p className="text-xs font-mono text-zinc-500">
                  Resumo: <strong className="text-zinc-300">{guests} pessoas</strong> •{" "}
                  <strong className="text-zinc-300">{selectedZone.name}</strong> às{" "}
                  <strong className="text-lime-400">{selectedSlot}</strong>
                </p>
              )}
            </AnimatePresence>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {status === "SUCCESS" && (
              <button
                type="button"
                onClick={handleSendWhatsAppTicket}
                className="px-5 py-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-emerald-500/40 text-emerald-400 font-black text-xs uppercase tracking-wider flex items-center gap-2 transition-all"
              >
                <MessageCircle className="w-4 h-4" /> Enviar Ticket no WhatsApp
              </button>
            )}

            <button
              type="button"
              onClick={() => void handleBooking()}
              disabled={!selectedSlot || status === "LOADING"}
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-lime-400 to-emerald-400 hover:from-lime-500 hover:to-emerald-500 text-zinc-950 font-black text-xs uppercase tracking-wider transition-all shadow-[0_0_30px_rgba(163,230,53,0.3)] disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {status === "LOADING" ? "Travando Horário..." : "Confirmar Reserva Atômica"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}