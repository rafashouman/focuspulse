"use client";

import { MessageCircle } from "lucide-react";

export function FloatingWA() {
  const WA_NUMBER = "5554996436023";
  const MESSAGE = "Olá! Vim através do site e gostaria de conversar sobre um projeto.";

  return (
    <a
      href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(MESSAGE)}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-[100] group flex items-center gap-3"
      aria-label="Fale conosco no WhatsApp"
    >
      {/* Label visível apenas no Desktop (conforme README) */}
      <div className="hidden lg:flex px-4 py-2 bg-card border border-border rounded-full shadow-elegant opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
        <span className="text-xs font-bold text-foreground">Fale comigo</span>
      </div>
      
      {/* Ícone */}
      <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg hover:scale-110 transition-transform duration-300">
        <MessageCircle className="h-7 w-7" />
        <span className="absolute -inset-1 rounded-full border-2 border-[#25D366] opacity-50 animate-ping" />
      </div>
    </a>
  );
}