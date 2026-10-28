"use client";

import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";

export function StickyMobileCta({
  label,
  href,
  onClick,
  hideWhenVisibleId,
  showAfter = 560,
  className = "",
  icon,
}: {
  label: string;
  href: string;
  onClick?: () => void;
  hideWhenVisibleId?: string;
  showAfter?: number;
  className?: string;
  icon?: ReactNode;
}) {
  const reduceMotion = useReducedMotion();
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [targetVisible, setTargetVisible] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > showAfter);
  });

  useEffect(() => {
    if (!hideWhenVisibleId) return;
    const target = document.getElementById(hideWhenVisibleId);
    if (!target) return;
    const observer = new IntersectionObserver(
      ([entry]) => setTargetVisible(entry.isIntersecting),
      { threshold: 0.15 }
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, [hideWhenVisibleId]);

  return (
    <AnimatePresence>
      {scrolled && !targetVisible && (
        <motion.div
          initial={reduceMotion ? false : { y: 90, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={reduceMotion ? { opacity: 0 } : { y: 90, opacity: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 26 }}
          className="fixed inset-x-0 bottom-0 z-40 p-3 md:hidden"
        >
          <a
            href={href}
            onClick={onClick}
            className={`flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-black shadow-2xl active:scale-[0.98] ${className}`}
          >
            {icon}
            {label} <ArrowRight className="h-4 w-4" />
          </a>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
