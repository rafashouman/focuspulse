"use client";

import {
  animate,
  motion,
  useInView,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useEffect, useRef, type ReactNode } from "react";

export function Reveal({
  children,
  delay = 0,
  y = 28,
  className,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 28 });

  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[60] h-1 origin-left bg-gradient-to-r from-[#FF5500] via-[#FF8A00] to-[#FFB36B]"
    />
  );
}

export function CountUp({
  to,
  prefix = "",
  suffix = "",
}: {
  to: number;
  prefix?: string;
  suffix?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (!inView || reduceMotion || !ref.current) return;
    const node = ref.current;
    const controls = animate(0, to, {
      duration: 1.4,
      ease: "easeOut",
      onUpdate: (value) => {
        node.textContent = `${prefix}${Math.round(value).toLocaleString("pt-BR")}${suffix}`;
      },
    });
    return () => controls.stop();
  }, [inView, reduceMotion, to, prefix, suffix]);

  return (
    <span ref={ref}>
      {prefix}
      {to.toLocaleString("pt-BR")}
      {suffix}
    </span>
  );
}

export function TiltCard({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);
  const rotateX = useSpring(useTransform(y, [0, 1], [7, -7]), {
    stiffness: 220,
    damping: 20,
  });
  const rotateY = useSpring(useTransform(x, [0, 1], [-9, 9]), {
    stiffness: 220,
    damping: 20,
  });
  const glareX = useTransform(x, (value) => `${value * 100}%`);
  const glareY = useTransform(y, (value) => `${value * 100}%`);
  const glare = useMotionTemplate`radial-gradient(circle at ${glareX} ${glareY}, rgba(255,255,255,0.22), transparent 55%)`;
  const glareOpacity = useMotionValue(0);

  if (reduceMotion) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      style={{ rotateX, rotateY, transformPerspective: 900 }}
      onPointerMove={(event) => {
        if (event.pointerType !== "mouse") return;
        const rect = event.currentTarget.getBoundingClientRect();
        x.set((event.clientX - rect.left) / rect.width);
        y.set((event.clientY - rect.top) / rect.height);
        glareOpacity.set(1);
      }}
      onPointerLeave={() => {
        x.set(0.5);
        y.set(0.5);
        glareOpacity.set(0);
      }}
    >
      {children}
      <motion.div
        aria-hidden
        style={{ background: glare, opacity: glareOpacity }}
        className="pointer-events-none absolute inset-0 rounded-3xl transition-opacity duration-300"
      />
    </motion.div>
  );
}

export function AnimatedValue({
  value,
  format,
  className,
}: {
  value: number;
  format: (value: number) => string;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();
  const spring = useSpring(value, { stiffness: 140, damping: 22 });
  const text: MotionValue<string> = useTransform(spring, (current) =>
    format(current)
  );

  useEffect(() => {
    spring.set(value);
  }, [spring, value]);

  if (reduceMotion) return <span className={className}>{format(value)}</span>;

  return <motion.span className={className}>{text}</motion.span>;
}

const CONFETTI_COLORS = ["#FF5500", "#FF8A00", "#FFB36B", "#22C55E", "#FFFFFF"];

export function Confetti({ pieces = 28 }: { pieces?: number }) {
  const reduceMotion = useReducedMotion();
  if (reduceMotion) return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 top-6 flex justify-center"
    >
      {Array.from({ length: pieces }, (_, index) => {
        const angle = (index / pieces) * Math.PI * 2;
        const distance = 90 + ((index * 37) % 70);
        return (
          <motion.span
            key={index}
            initial={{ x: 0, y: 0, opacity: 1, scale: 1, rotate: 0 }}
            animate={{
              x: Math.cos(angle) * distance,
              y: Math.sin(angle) * distance + 70,
              opacity: 0,
              scale: 0.6,
              rotate: 240 + index * 25,
            }}
            transition={{ duration: 1.3 + (index % 5) * 0.12, ease: "easeOut" }}
            style={{ backgroundColor: CONFETTI_COLORS[index % CONFETTI_COLORS.length] }}
            className="absolute h-2.5 w-1.5 rounded-sm"
          />
        );
      })}
    </div>
  );
}
