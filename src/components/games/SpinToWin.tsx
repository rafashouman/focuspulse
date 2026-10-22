"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SparklesIcon } from "@heroicons/react/24/solid";

// Paleta Bespoke: Obsidian Black (#050505), Deep Navy (#0B132B) e Electric Blue (#00F0FF)
const prizes = [
  { id: 1, label: "10% OFF", color: "#0B132B" },
  { id: 2, label: "FRETE GRÁTIS", color: "#1C2541" },
  { id: 3, label: "BRINDE", color: "#3A506B" },
  { id: 4, label: "20% OFF", color: "#00F0FF" },
];

export default function PulseSpinRoulette() {
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleSpin = async () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setResult(null);

    // Diferencial: Aqui entraria o Server Action consultando o Firebase
    // const { winningIndex, targetDegrees } = await getSecurePrize();
    
    // Simulação do cálculo protegido no servidor:
    const winningIndex = Math.floor(Math.random() * prizes.length);
    const segmentAngle = 360 / prizes.length;
    
    // A física da animação: 5 giros completos (1800deg) + o ângulo exato do prêmio
    const baseRotation = rotation + 1800;
    const targetRotation = baseRotation + (segmentAngle * winningIndex);

    setRotation(targetRotation);

    // O tempo de timeout deve casar com o duration do Framer Motion
    setTimeout(() => {
      setIsSpinning(false);
      setResult(prizes[winningIndex].label);
      // Dispara evento de conversão ou abre modal de resgate
    }, 5000); 
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#050505] font-sans overflow-hidden relative selection:bg-[#00F0FF] selection:text-black">
      
      {/* Glow Ambiente de Fundo */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#00F0FF] opacity-[0.03] rounded-full blur-[100px] pointer-events-none" />

      <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#00F0FF] to-[#3A506B] mb-12 tracking-tighter drop-shadow-[0_0_15px_rgba(0,240,255,0.2)] uppercase">
        Destrave seu Bônus
      </h1>

      <div className="relative w-80 h-80 md:w-96 md:h-96">
        {/* Marcador / Ponteiro (Glitch Square) */}
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20 w-8 h-8 bg-[#00F0FF] rotate-45 shadow-[0_0_20px_#00F0FF] border-2 border-[#050505]" />

        {/* O Corpo da Roleta */}
        <motion.div
          className="w-full h-full rounded-full border-4 border-[#1C2541] overflow-hidden shadow-[0_0_50px_rgba(28,37,65,0.8)] relative"
          animate={{ rotate: rotation }}
          transition={{ duration: 5, type: "tween", ease: [0.2, 0.9, 0.3, 1] }} // Curva de desaceleração dramática
        >
          {/* Fatias renderizadas via gradiente cônico para performance extrema sem SVG complexo */}
          <div 
            className="w-full h-full rounded-full"
            style={{
              background: `conic-gradient(
                #0B132B 0deg 90deg, 
                #1C2541 90deg 180deg, 
                #3A506B 180deg 270deg, 
                #00F0FF 270deg 360deg
              )`
            }}
          />
        </motion.div>
      </div>

      {/* Botão de Ação com Micro-interações */}
      <motion.button
        onClick={handleSpin}
        disabled={isSpinning}
        whileHover={{ scale: 1.02, boxShadow: "0 0 25px rgba(0,240,255,0.4)" }}
        whileTap={{ scale: 0.98 }}
        className="mt-14 px-10 py-4 bg-[#050505] border border-[#00F0FF] text-[#00F0FF] font-bold tracking-[0.2em] uppercase hover:bg-[#00F0FF] hover:text-[#050505] transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3 group relative overflow-hidden"
      >
        {isSpinning ? "Processando Algoritmo..." : "Girar Roleta"}
        {!isSpinning && <SparklesIcon className="w-5 h-5 group-hover:animate-pulse" />}
      </motion.button>

      {/* Modal de Resultado Fluido */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(8px)" }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ type: "spring", bounce: 0.4 }}
              className="p-12 border border-[#3A506B] bg-[#050505]/90 shadow-[0_0_60px_rgba(0,240,255,0.15)] text-center w-[90%] max-w-md relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#00F0FF] to-transparent opacity-50" />
              <p className="text-[#3A506B] text-sm uppercase tracking-[0.3em] mb-4">Acesso Liberado</p>
              <p className="text-4xl font-black text-[#00F0FF] drop-shadow-[0_0_15px_#00F0FF] mb-10">
                {result}
              </p>
              <button 
                onClick={() => setResult(null)}
                className="w-full py-4 bg-[#1C2541] text-white tracking-widest uppercase hover:bg-[#00F0FF] hover:text-black transition-colors duration-300 font-bold"
              >
                Resgatar Bônus
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}