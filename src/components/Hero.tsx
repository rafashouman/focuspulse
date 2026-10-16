"use client";

import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";

const WA = "https://wa.me/5554996436023?text=" + encodeURIComponent("Olá! Vi seu portfólio e quero solicitar um projeto.");

export function Hero() {
    return (
        <section
            id="hero"
            className="relative min-h-[100dvh] w-full overflow-hidden flex items-center justify-center pt-24 pb-16"
        >
            {/* Grid de fundo tech sutil */}
            <div
                aria-hidden
                className="absolute inset-0 opacity-10 pointer-events-none"
                style={{
                    backgroundImage: "linear-gradient(rgba(59, 130, 246, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(59, 130, 246, 0.2) 1px, transparent 1px)",
                    backgroundSize: "60px 60px",
                    maskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, #000 40%, transparent 100%)",
                    WebkitMaskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, #000 40%, transparent 100%)",
                }}
            />

            {/* Halo Azul central */}
            <div
                aria-hidden
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(700px,90vw)] aspect-square rounded-full pointer-events-none opacity-20"
                style={{
                    background: "radial-gradient(circle, rgba(37,99,235,0.8) 0%, rgba(29,78,216,0) 70%)",
                    filter: "blur(100px)",
                }}
            />

            <div className="relative z-10 w-full max-w-5xl px-6 text-center mt-10">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full border border-blue-500/20 bg-blue-500/5 backdrop-blur-md"
                >
                    <span className="relative flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75 animate-ping" />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-500" />
                    </span>
                    <span className="text-xs uppercase tracking-widest text-blue-400 font-bold">
                        Disponibilidade para novos projetos
                    </span>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.1, ease: "easeOut" }}
                    className="text-5xl md:text-7xl lg:text-8xl font-display uppercase tracking-tighter leading-[0.9] font-size hero-title"
                >
                    Sites e Aplicações 
                    <br />
                    <span className="text-blue-gradient">de Alta Performance</span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.9, delay: 0.25 }}
                    className="max-w-2xl mx-auto mt-8 text-base sm:text-lg text-muted-foreground leading-relaxed"
                >
                    Criamos soluções web focadas em máxima performance para impulsionar métricas e entregar um retorno real. Transformamos a sua presença digital com código otimizado e design responsivo. 
                </motion.p>


                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full border border-blue-500/20 bg-blue-500/5 backdrop-blur-md"
                >
                    <span className="relative flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75 animate-ping" />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-500" />
                    </span>
                    <span className="text-xs uppercase tracking-widest text-blue-400 font-bold">
                        Especialistas em Soluções Web
                    </span>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.9, delay: 0.4 }}
                    className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6"
                >
                    <a
                        href={WA}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group relative inline-flex items-center gap-2 px-9 py-4 sm:py-5 bg-blue-gradient text-white font-black uppercase tracking-[0.15em] text-xs sm:text-sm rounded-sm transition-all duration-300 hover:scale-[1.02] shadow-blue-glow"
                    >
                        Solicitar Projeto
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </a>
                    <a
                        href="#servicos"
                        className="text-xs font-bold uppercase tracking-widest border-b border-white/20 pb-1 text-foreground/80 hover:text-blue-400 hover:border-blue-500/60 transition-colors"
                    >
                        Ver Especialidades
                    </a>
                </motion.div>
            </div>

            {/* Linha de base sutil */}
            <div
                aria-hidden
                className="absolute bottom-0 left-0 w-full h-px"
                style={{
                    background: "linear-gradient(90deg, transparent, rgba(59,130,246,0.3), transparent)",
                }}
            />
        </section>
    );
}
