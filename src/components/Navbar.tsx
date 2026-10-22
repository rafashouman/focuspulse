"use client"; // Necessário pois usamos hooks (useState, useEffect) no Next.js App Router

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const links = [
  { label: "Projetos", href: "/#trabalhos" },
  { label: "Serviços", href: "/#servicos" },
  { label: "Templates", href: "/templates" },
  { label: "Design", href: "/design" },
  { label: "Apps", href: "/apps" },
  { label: "Arcade", href: "/arcade" },
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
          ? "backdrop-blur-2xl bg-background/55 border-b border-violet-200/10 shadow-elegant"
          : "bg-transparent"
        }`}
    >
      <div className="mx-auto flex h-20 w-full max-w-[1440px] items-center justify-between gap-6 px-6 sm:px-10 lg:px-16">
        <Link href="/" aria-label="FocusPulse — início" className="logo-pulse flex items-center gap-2 group">
          <Image
            src="/images/logo-icon.png"
            alt=""
            width={32}
            height={32}
            className="h-8 w-8 transition-transform duration-300 group-hover:rotate-[360deg]"
          />
          <Image
            src="/images/logo-text.png"
            alt="FocusPulse"
            width={202}
            height={24}
            className="h-6 w-auto transition-transform duration-300 group-hover:scale-105"
          />
        </Link>

        <nav aria-label="Navegação principal" className="hidden xl:flex items-center gap-5">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-muted-foreground hover:text-violet-200 transition-colors duration-300"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <a
          href={WA}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden xl:inline-flex items-center gap-2 rounded-full border border-violet-300/30 bg-white/[0.025] px-5 py-2.5 text-sm font-semibold text-violet-200 hover:bg-violet-gradient hover:text-white hover:border-transparent hover:shadow-violet-glow transition-all duration-300"
        >
          Iniciar meu projeto
        </a>

        <button
          type="button"
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          aria-expanded={open}
          aria-controls="mobile-navigation"
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
            className="xl:hidden overflow-hidden bg-background/75 backdrop-blur-2xl border-t border-violet-200/10"
            id="mobile-navigation"
          >
            <nav aria-label="Navegação móvel" className="mx-auto flex w-full max-w-[1440px] flex-col gap-1 px-6 py-6 sm:px-10 lg:px-16">
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
                className="mt-4 inline-flex justify-center rounded-full bg-violet-gradient px-6 py-3 text-white text-sm font-bold shadow-violet-glow"
              >
                Solicitar orçamento
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}