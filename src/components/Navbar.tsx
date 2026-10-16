"use client"; // Necessário pois usamos hooks (useState, useEffect) no Next.js App Router

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import Link from "next/link";

const links = [
  { label: "Início", href: "/" },
  { label: "Serviços", href: "/#servicos" },
  { label: "Segmentos", href: "/#segmentos" },
  { label: "Contato", href: "/#contato" },
  { label: "Templates", href: "/templates" },
  { label: "Aplicativos", href: "/apps" },
  { label: "Design", href: "/design" },
  { label: "Blog", href: "/blog" },
];

const WA = "https://wa.me/5551993583936?text=" + encodeURIComponent("Olá! Gostaria de solicitar um orçamento para o meu site.");

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${scrolled
          ? "backdrop-blur-xl bg-background/80 border-b border-border shadow-elegant"
          : "bg-transparent"
        }`}
    >
      <div className="container-luxe flex h-20 items-center justify-between gap-6">
        <Link href="/" aria-label="FocusPulse — início" className="logo-pulse flex items-center gap-2 group">
          <img
            src="/images/logo-icon.png"
            alt="Logo do site"
            className="h-8 w-8 transition-transform duration-300 group-hover:rotate-[360deg]"
          />
          <img
            src="/images/logo-text.png"
            alt="Logo do site"
            className="h-6 w-auto transition-transform duration-300 group-hover:scale-105"
          />
        </Link>

        <nav className="hidden xl:flex items-center gap-5">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-muted-foreground hover:text-blue-400 transition-colors duration-300"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <a
          href={WA}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden xl:inline-flex items-center gap-2 rounded-full border border-blue-500/40 px-5 py-2.5 text-sm font-semibold text-blue-400 hover:bg-blue-gradient hover:text-white hover:border-transparent hover:shadow-blue-glow transition-all duration-300"
        >
          Iniciar meu projeto
        </a>

        <button
          className="xl:hidden grid h-10 w-10 place-items-center rounded-full border border-border text-foreground"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="xl:hidden overflow-hidden bg-background/95 backdrop-blur-xl border-t border-border"
          >
            <div className="container-luxe py-6 flex flex-col gap-1">
              {links.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="py-3 border-b border-border/50 text-foreground/90 font-medium"
                >
                  {l.label}
                </a>
              ))}
              <a
                href={WA}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex justify-center rounded-full bg-blue-gradient px-6 py-3 text-white text-sm font-bold shadow-blue-glow"
              >
                Solicitar orçamento
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}