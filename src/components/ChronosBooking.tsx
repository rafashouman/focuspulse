"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { bookAppointment } from "@/app/actions/bookAppointment";
import {
  onAuthStateChanged,
  signInWithPopup,
  User,
} from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase/client";

const AVAILABLE_SLOTS = ["09:00", "10:30", "14:00", "15:30", "17:00"];

export default function ChronosBooking() {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [status, setStatus] = useState<"IDLE" | "LOADING" | "SUCCESS" | "ERROR">("IDLE");
  const [feedbackMsg, setFeedbackMsg] = useState("");
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
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

  const handleLogin = async () => {
    setStatus("LOADING");
    try {
      await signInWithPopup(auth, googleProvider);
      setStatus("IDLE");
      setFeedbackMsg("");
    } catch (error) {
      console.error("Unable to sign in before appointment booking.", error);
      setStatus("ERROR");
      setFeedbackMsg("Não foi possível entrar com o Google. Tente novamente.");
    }
  };

  const handleBooking = async () => {
    if (!selectedSlot) return;
    
    if (!user) {
      setStatus("ERROR");
      setFeedbackMsg("Faça login para confirmar a reserva.");
      return;
    }

    setStatus("LOADING");
    try {
      const token = await user.getIdToken();
      const res = await bookAppointment(
        {
          date: selectedDate,
          timeSlot: selectedSlot,
          serviceName: "Consultoria de Arquitetura & Performance",
        },
        token
      );

      if (res.success) {
        setStatus("SUCCESS");
        setFeedbackMsg(`Horário das ${selectedSlot} reservado sob protocolo #${res.bookingId?.slice(-6)}`);
      } else {
        setStatus("ERROR");
        setFeedbackMsg(res.error || "Erro desconhecido.");
      }
    } catch (error) {
      console.error("Unable to submit appointment booking.", error);
      setStatus("ERROR");
      setFeedbackMsg("Erro de comunicação com o servidor.");
    }
  };

  return (
    <div className="min-h-[600px] bg-[#F8FAFC] text-[#0F172A] p-8 md:p-12 font-sans border border-slate-200 shadow-2xl flex flex-col justify-between relative overflow-hidden">
      {/* Detalhe Geométrico Editorial */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#002FA7]/5 rounded-bl-full pointer-events-none" />

      <div>
        <div className="flex items-center justify-between border-b border-slate-200 pb-6 mb-8">
          <div>
            <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#002FA7] block mb-1">
              Engine de Agendamento Atômico
            </span>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
              ChronosBook
            </h2>
          </div>
          <div className="text-right font-mono text-xs text-slate-500">
            <p>SYNC: FIRESTORE TX</p>
            <p className="text-emerald-600 font-bold">● DEMONSTRAÇÃO</p>
          </div>
        </div>

        <div className="mb-7 flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-5">
          <p className="min-w-0 truncate text-sm text-slate-600">
            {user
              ? `Sessão: ${user.displayName || user.email || "Google"}`
              : "Entre com Google para reservar um horário."}
          </p>
          {!user && (
            <button
              type="button"
              onClick={() => void handleLogin()}
              disabled={status === "LOADING"}
              className="shrink-0 rounded border border-slate-300 px-3 py-2 text-xs font-bold uppercase tracking-wider text-slate-700 transition-colors hover:border-[#002FA7] hover:text-[#002FA7] disabled:opacity-50"
            >
              Entrar com Google
            </button>
          )}
        </div>

        {/* Seletor de Data */}
        <div className="mb-8">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
            1. Data de Operação
          </label>
          <input
            type="date"
            value={selectedDate}
            min={selectedDate}
            onChange={(e) => {
              setSelectedDate(e.target.value);
              setStatus("IDLE");
            }}
            className="w-full md:w-auto px-4 py-3 bg-white border border-slate-300 text-slate-900 font-mono text-sm focus:outline-none focus:border-[#002FA7] transition-colors"
          />
        </div>

        {/* Grid de Horários */}
        <div className="mb-10">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
            2. Janela de Disponibilidade
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {AVAILABLE_SLOTS.map((slot) => {
              const isSelected = selectedSlot === slot;
              return (
                <motion.button
                  key={slot}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => {
                    setSelectedSlot(slot);
                    setStatus("IDLE");
                  }}
                  className={`py-4 px-3 font-mono text-sm font-bold border transition-all ${
                    isSelected
                      ? "bg-[#002FA7] text-white border-[#002FA7] shadow-[0_10px_25px_rgba(0,47,167,0.25)]"
                      : "bg-white text-slate-700 border-slate-200 hover:border-slate-400"
                  }`}
                >
                  {slot}
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Rodapé de Confirmação e Feedback */}
      <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex-1">
          <AnimatePresence mode="wait">
            {status !== "IDLE" && (
              <motion.p
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                className={`text-xs font-mono ${
                  status === "ERROR" ? "text-red-600" : status === "SUCCESS" ? "text-emerald-700 font-bold" : "text-slate-500"
                }`}
              >
                {status === "LOADING" ? "Executando lock transacional no Firestore..." : feedbackMsg}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        <button
          onClick={handleBooking}
          disabled={!selectedSlot || status === "LOADING"}
          className="w-full sm:w-auto px-8 py-4 bg-[#0F172A] text-white font-bold text-xs uppercase tracking-[0.2em] hover:bg-[#002FA7] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {status === "LOADING" ? "Reservando..." : "Confirmar Horário"}
        </button>
      </div>
    </div>
  );
}