"use client";

import React, { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag,
  Sparkles,
  Plus,
  Minus,
  X,
  Ruler,
  ShieldCheck,
  Truck,
  ArrowDown,
  Check,
  Sliders,
  MessageCircle,
  Send,
  Layers,
  Eye,
  QrCode,
  Box,
} from "lucide-react";
import { ScrollProgress } from "@/components/ui/MotionKit";
import { StickyMobileCta } from "@/components/ui/StickyMobileCta";
import { useFocusTrap } from "@/components/ui/useFocusTrap";

// ==========================================
// CONFIGURAÇÕES & DADOS DO DROP
// ==========================================
const WHATSAPP_NUMBER = "5511999999999";
const FREE_SHIPPING_THRESHOLD = 299.0;
const SHIPPING_FLAT_RATE = 18.9;
const CURRENT_YEAR = new Date().getFullYear();

type SizeType = "P" | "M" | "G" | "GG" | "XGG";
type CategoryFilter = "all" | "heavy-tees" | "acid-wash" | "longsleeve" | "accessories";

interface ColorOption {
  name: string;
  hex: string;
}

interface ProductItem {
  id: string;
  code: string;
  name: string;
  subtitle: string;
  price: number;
  originalPrice?: number;
  category: CategoryFilter;
  gsm: string;
  fit: string;
  image: string;
  backImage: string;
  colors: ColorOption[];
  badge?: string;
  stockLeft: number;
  description: string;
}

interface CartItem {
  cartId: string;
  product: ProductItem;
  size: SizeType;
  color: string;
  quantity: number;
}

const PRODUCTS: ProductItem[] = [
  {
    id: "vx-01",
    code: "ARCH-001",
    name: "Atelier Heavy Boxy Tee",
    subtitle: "320 GSM • Algodão Pima Peruano",
    price: 169.9,
    originalPrice: 219.9,
    category: "heavy-tees",
    gsm: "320 GSM",
    fit: "Boxy Oversized",
    image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=85",
    backImage: "https://images.unsplash.com/photo-1562157873-818bc0726f68?auto=format&fit=crop&w=1000&q=85",
    colors: [
      { name: "Raw Ecru (Cru)", hex: "#E6E2D8" },
      { name: "Cobalt Blue", hex: "#1D4ED8" },
      { name: "Onyx Black", hex: "#18181B" },
    ],
    badge: "DROP #04 • DESTAQUE",
    stockLeft: 7,
    description:
      "Modelagem quadrada arquitetônica (Boxy) desenvolvida em nosso ateliê. Gola canelada de 3.2cm indeformável, toque aveludado e caimento estruturado que não marca o corpo.",
  },
  {
    id: "vx-02",
    code: "ARCH-002",
    name: "Botanical Pigment Dyed Tee",
    subtitle: "Tingimento Mineral Artesanal • Peça Única",
    price: 189.9,
    category: "acid-wash",
    gsm: "300 GSM",
    fit: "Drop Shoulder",
    image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=1000&q=85",
    backImage: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1000&q=85",
    colors: [
      { name: "Washed Slate", hex: "#475569" },
      { name: "Terracotta Fade", hex: "#C2410C" },
    ],
    badge: "TIRAGEM LIMITADA",
    stockLeft: 4,
    description:
      "Submetida a banho de pigmentos minerais e amaciamento natural, garantindo que nenhuma camiseta seja idêntica à outra. Costuras externas aparentes e etiqueta em sarja.",
  },
  {
    id: "vx-03",
    code: "ARCH-003",
    name: "Bauhaus Exhibition Graphic Tee",
    subtitle: "Serigrafia Base D'água • Toque Zero",
    price: 159.9,
    category: "heavy-tees",
    gsm: "290 GSM",
    fit: "Relaxed Fit",
    image: "https://images.unsplash.com/photo-1562157873-818bc0726f68?auto=format&fit=crop&w=1000&q=85",
    backImage: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=85",
    colors: [
      { name: "Pure Gallery White", hex: "#FFFFFF" },
      { name: "Cobalt Blue", hex: "#1D4ED8" },
    ],
    stockLeft: 12,
    description:
      "Inspirada nos pôsteres de exposições suíças dos anos 70. Arte aplicada com tintas ecológicas que penetram na fibra sem deixar relevo plástico.",
  },
  {
    id: "vx-04",
    code: "ARCH-004",
    name: "Knit-Ribbed Heavy Longsleeve",
    subtitle: "Manga Longa Estruturada • Punho Canelado",
    price: 219.9,
    originalPrice: 259.9,
    category: "longsleeve",
    gsm: "340 GSM",
    fit: "Boxy Heavy",
    image: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=1000&q=85",
    backImage: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=1000&q=85",
    colors: [
      { name: "Onyx Black", hex: "#18181B" },
      { name: "Alabaster Cream", hex: "#F5F5F0" },
    ],
    badge: "ALTA GRAMATURA",
    stockLeft: 5,
    description:
      "A fronteira perfeita entre camiseta e suéter leve. Algodão encorpado de 340g/m² com bordado minimalista tom-sobre-tom no peito.",
  },
  {
    id: "vx-05",
    code: "ARCH-005",
    name: "Mediterranean Sun Washed Tee",
    subtitle: "Estonada a Sol • Pré-Encolhida",
    price: 174.9,
    category: "acid-wash",
    gsm: "310 GSM",
    fit: "Boxy Oversized",
    image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1000&q=85",
    backImage: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=1000&q=85",
    colors: [
      { name: "Sage Olive", hex: "#65A30D" },
      { name: "Raw Ecru (Cru)", hex: "#E6E2D8" },
    ],
    stockLeft: 9,
    description:
      "Pré-lavada industrialmente em tambor com pedras vulcânicas para zero encolhimento pós-compra e maciez imediata no primeiro uso.",
  },
  {
    id: "vx-06",
    code: "ARCH-006",
    name: "Canvas Tote 16oz + Cap",
    subtitle: "Kit Utilitário Lona Crua",
    price: 139.9,
    category: "accessories",
    gsm: "480 GSM Canvas",
    fit: "Tamanho Único Ajustável",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1000&q=85",
    backImage: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1000&q=85",
    colors: [{ name: "Raw Canvas", hex: "#D6D3C9" }],
    badge: "ARCHIVE PACK",
    stockLeft: 3,
    description:
      "Tote bag estruturada em lona de algodão 16oz com bolso interno para notebook de 16', acompanhada de boné desestruturado 6-panel.",
  },
];

const SIZES: SizeType[] = ["P", "M", "G", "GG", "XGG"];

// ==========================================
// BOTÃO FLUTUANTE WHATSAPP (TEMA CLARO EDITORIAL)
// ==========================================
const FloatingWhatsApp = () => (
  <a
    href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
      "Olá! Estou na loja online da VORTEX // ARCHIVE e gostaria de ajuda com um tamanho ou pedido."
    )}`}
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Atendimento via WhatsApp"
    className="fixed bottom-6 right-6 z-40 group flex items-center gap-3 px-5 py-3.5 rounded-full bg-zinc-950 hover:bg-blue-600 text-white shadow-[0_15px_35px_rgba(0,0,0,0.18)] transition-all duration-300 hover:scale-105"
  >
    <span className="relative flex h-2.5 w-2.5">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400" />
    </span>
    <MessageCircle className="w-4 h-4" />
    <span className="hidden sm:inline text-xs font-mono font-bold uppercase tracking-wider">
      Personal Stylist
    </span>
  </a>
);

// ==========================================
// COMPONENTE PRINCIPAL
// ==========================================
export default function StreetwearEcommerceLightPage() {
  // Estados de Filtro e Vitrine
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>("all");
  const [hoveredProductId, setHoveredProductId] = useState<string | null>(null);
  const [selectedProductModal, setSelectedProductModal] = useState<ProductItem | null>(null);
  const [modalSize, setModalSize] = useState<SizeType>("G");
  const [modalColor, setModalColor] = useState<string>("");

  // Estado da Sacola
  const [cart, setCart] = useState<CartItem[]>([
    {
      cartId: "initial-demo",
      product: PRODUCTS[0],
      size: "G",
      color: PRODUCTS[0].colors[0].name,
      quantity: 1,
    },
  ]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Estados do Provador Virtual (Fit Finder)
  const [userHeight, setUserHeight] = useState<number>(178);
  const [userWeight, setUserWeight] = useState<number>(76);
  const [fitPreference, setFitPreference] = useState<"regular" | "oversized" | "baggy">("oversized");

  // Estados do Lookbook Interativo
  const [activeHotspot, setActiveHotspot] = useState<number>(0);

  // Estados do Checkout & Newsletter
  const [customerName, setCustomerName] = useState("");
  const [customerZip, setCustomerZip] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [paymentType, setPaymentType] = useState<"pix" | "card">("pix");
  const [vipEmail, setVipEmail] = useState("");
  const [vipPhone, setVipPhone] = useState("");
  const [vipSubmitted, setVipSubmitted] = useState(false);

  // Cronômetro regressivo do Drop
  const [timeLeft, setTimeLeft] = useState({ hours: 14, minutes: 42, seconds: 19 });
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        return { hours: Math.max(0, prev.hours - 1), minutes: 59, seconds: 59 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Recomendador de Tamanho IA
  const recommendedSize = useMemo((): SizeType => {
    let baseScore = 0;
    if (userHeight > 185 || userWeight > 92) baseScore = 3;
    else if (userHeight > 176 || userWeight > 78) baseScore = 2;
    else if (userHeight > 168 || userWeight > 65) baseScore = 1;
    else baseScore = 0;

    if (fitPreference === "baggy") baseScore = Math.min(4, baseScore + 1);
    if (fitPreference === "regular") baseScore = Math.max(0, baseScore - 1);

    return SIZES[baseScore];
  }, [userHeight, userWeight, fitPreference]);

  // Funções da Sacola
  const [toast, setToast] = useState<string | null>(null);
  const [cartBump, setCartBump] = useState(0);
  const productTrapRef = useFocusTrap<HTMLDivElement>(!!selectedProductModal);
  const cartTrapRef = useFocusTrap<HTMLDivElement>(isCartOpen);

  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(null), 2600);
    return () => clearTimeout(id);
  }, [toast]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setSelectedProductModal(null);
      setIsCartOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const addToCart = (product: ProductItem, size: SizeType, color?: string) => {
    const chosenColor = color || product.colors[0].name;
    const cartId = `${product.id}-${size}-${chosenColor}`;

    setCart((prev) => {
      const existing = prev.find((item) => item.cartId === cartId);
      if (existing) {
        return prev.map((item) =>
          item.cartId === cartId ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { cartId, product, size, color: chosenColor, quantity: 1 }];
    });

    setSelectedProductModal(null);
    setToast(`${product.name} (${size}) adicionado à sacola`);
    setCartBump((n) => n + 1);
  };

  const updateCartQty = (cartId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.cartId === cartId ? { ...item, quantity: item.quantity + delta } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const subtotal = useMemo(
    () => cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0),
    [cart]
  );
  const totalCount = useMemo(
    () => cart.reduce((acc, item) => acc + item.quantity, 0),
    [cart]
  );

  const hasFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD;
  const shippingCost = subtotal === 0 ? 0 : hasFreeShipping ? 0 : SHIPPING_FLAT_RATE;
  const pixDiscount = paymentType === "pix" ? subtotal * 0.08 : 0;
  const finalTotal = subtotal - pixDiscount + shippingCost;

  const filteredProducts = useMemo(() => {
    if (activeCategory === "all") return PRODUCTS;
    return PRODUCTS.filter((p) => p.category === activeCategory);
  }, [activeCategory]);

  // Checkout WhatsApp
  const handleCheckoutWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    const lines = cart
      .map(
        (item) =>
          `▪ *${item.quantity}x ${item.product.name}* [${item.product.code}]\n   Tam: *${
            item.size
          }* | Cor: ${item.color} — R$ ${(item.product.price * item.quantity).toFixed(2)}`
      )
      .join("\n\n");

    const msg = `*NOVO PEDIDO — VORTEX // ARCHIVE DROP #04*\n----------------------------------\n*Cliente:* ${customerName}\n*CEP:* ${customerZip}\n*Endereço:* ${customerAddress}\n----------------------------------\n\n${lines}\n\n----------------------------------\n*Subtotal:* R$ ${subtotal.toFixed(
      2
    )}\n${
      paymentType === "pix" ? `*Desconto PIX (8%):* -R$ ${pixDiscount.toFixed(2)}\n` : ""
    }*Frete Express:* ${
      hasFreeShipping ? "GRÁTIS (+ Pack de Stickers)" : `R$ ${shippingCost.toFixed(2)}`
    }\n*VALOR FINAL: R$ ${finalTotal.toFixed(2)}*\n*Modalidade:* ${
      paymentType === "pix" ? "PIX Imediato" : "Link de Cartão (Até 4x Sem Juros)"
    }`;

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  return (
    <main id="conteudo" className="demo-light min-h-screen bg-[#FAF9F5] text-zinc-900 selection:bg-blue-600 selection:text-white font-sans antialiased overflow-x-hidden">
          <ScrollProgress />
          <FloatingWhatsApp />
          <div aria-live="polite" className="pointer-events-none fixed inset-x-0 top-20 z-[70] flex justify-center px-4">
            <AnimatePresence>
              {toast && (
                <motion.div
                  key={toast}
                  initial={{ opacity: 0, y: -16, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -12 }}
                  className="pointer-events-auto flex items-center gap-3 rounded-full border border-zinc-200 bg-zinc-950 px-5 py-3 text-xs font-bold text-white shadow-2xl"
                >
                  <Check className="h-4 w-4 text-blue-400" />
                  {toast}
                  <button
                    onClick={() => setIsCartOpen(true)}
                    className="rounded-full bg-white px-3 py-1 text-[11px] font-black uppercase text-zinc-950 hover:bg-blue-100"
                  >
                    Ver sacola
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

      {/* ==========================================
          1. FLOATING GLASS NAVBAR (SOBRE O HERO FULLPAGE)
      ========================================== */}
      <header className="fixed top-0 left-0 right-0 z-40 px-4 sm:px-8 pt-4 sm:pt-6 pointer-events-none">
        <div className="max-w-7xl mx-auto bg-white/85 backdrop-blur-xl border border-zinc-200/80 rounded-full px-5 sm:px-7 py-3.5 shadow-[0_10px_40px_rgba(0,0,0,0.06)] pointer-events-auto flex items-center justify-between">
          {/* Logo */}
          <a href="#" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white group-hover:bg-zinc-950 transition-colors">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <span className="text-base sm:text-lg font-black tracking-tighter text-zinc-950 block leading-none">
                VORTEX<span className="text-blue-600">{"//"}</span>ATELIER
              </span>
              <span className="text-[9px] font-mono uppercase tracking-[0.22em] text-zinc-500">
                Heavyweight Garments
              </span>
            </div>
          </a>

          {/* Center Links */}
          <nav className="hidden md:flex items-center gap-1 bg-zinc-100/90 border border-zinc-200/70 rounded-full p-1">
            {[
              { label: "Coleção #04", href: "#vitrine" },
              { label: "Simulador de Caimento", href: "#fit-finder" },
              { label: "Editorial", href: "#lookbook" },
              { label: "Lista Privada", href: "#contato" },
            ].map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="px-4 py-1.5 rounded-full text-xs font-semibold text-zinc-600 hover:text-zinc-950 hover:bg-white transition-all"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right Countdown + Cart Trigger */}
          <div className="flex items-center gap-3">
            <div className="hidden xl:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-[11px] font-mono text-blue-700 font-bold">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>
                DROP ENCERRA EM {String(timeLeft.hours).padStart(2, "0")}:
                {String(timeLeft.minutes).padStart(2, "0")}:
                {String(timeLeft.seconds).padStart(2, "0")}
              </span>
            </div>

            <button
              onClick={() => setIsCartOpen(true)}
              aria-label={`Abrir sacola, ${totalCount} itens`}
              className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-zinc-950 hover:bg-blue-600 text-white transition-all group"
            >
              <motion.span
                key={cartBump}
                animate={cartBump ? { scale: [1, 1.35, 1], rotate: [0, -12, 0] } : undefined}
                transition={{ duration: 0.5 }}
                className="inline-flex"
              >
                <ShoppingBag className="w-4 h-4" />
              </motion.span>
              <span className="text-xs font-bold hidden sm:inline">Sacola</span>
              <span className="px-2 py-0.5 rounded-full bg-white/20 text-[11px] font-mono font-bold">
                {totalCount}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* ==========================================
          2. FULLPAGE HERO (100VH) — EDITORIAL CAMPAIGN
      ========================================== */}
      <section className="relative w-full min-h-screen flex flex-col justify-between p-4 sm:p-6 lg:p-8 pt-24 sm:pt-28">
        {/* Main Full-Bleed Architectural Frame */}
        <div className="relative flex-1 w-full rounded-[2rem] sm:rounded-[3rem] overflow-hidden shadow-[0_25px_70px_rgba(0,0,0,0.08)] border border-zinc-200/80 flex flex-col justify-between p-6 sm:p-12 lg:p-16 bg-zinc-900">
          {/* Background Editorial Photography */}
          <Image
            src="https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=2000&q=90"
            alt="Vortex Atelier Editorial Campaign"
            fill
            priority
            unoptimized
            className="object-cover object-center scale-105 animate-[pulse_15s_ease-in-out_infinite]"
          />

          {/* Soft Sunlight & Editorial Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/85 via-zinc-950/25 to-zinc-950/30" />

          {/* Top Bar Inside Hero */}
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 pt-4">
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/90 backdrop-blur-md text-zinc-950 text-xs font-mono font-bold uppercase tracking-wider shadow-sm">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping" />
              ARCHIVAL RELEASE 04 // PRIMAVERA-VERÃO
            </div>

            <div className="hidden sm:flex items-center gap-6 px-5 py-2 rounded-full bg-black/40 backdrop-blur-md border border-white/15 text-white/90 text-xs font-mono">
              <span>ALGODÃO PIMA 320 GSM</span>
              <span>•</span>
              <span>TIRAGEM NUMERADA</span>
              <span>•</span>
              <span>0% ENCOLHIMENTO</span>
            </div>
          </div>

          {/* Bottom Content Split: Giant Typography + Floating Quick-Shop Card */}
          <div className="relative z-10 mt-auto grid min-w-0 grid-cols-1 items-end gap-8 pt-16 lg:grid-cols-12">
            {/* Left Editorial Headline (7 Cols) */}
            <div className="min-w-0 text-white lg:col-span-7">
              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-xs sm:text-sm font-mono uppercase tracking-[0.3em] text-blue-300 mb-3"
              >
                [ ENGENHARIA TÊXTIL & DESIGN INDEPENDENTE ]
              </motion.p>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="mb-6 text-4xl font-black uppercase leading-[0.88] tracking-tighter sm:text-7xl xl:text-8xl"
              >
                Forma Pura. <br />
                <span className="italic font-light text-[#FAF9F5]/90">Peso</span> Absoluto.
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-sm sm:text-base text-zinc-200 max-w-lg leading-relaxed mb-8"
              >
                Redefinimos a camiseta essencial através da gramatura extrema (320g/m²), tingimento
                mineral botânico e corte quadrado arquitetônico. Feita para durar décadas.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-wrap items-center gap-4"
              >
                <a
                  href="#vitrine"
                  className="flex items-center gap-3 rounded-full bg-white px-5 py-4 text-xs font-black uppercase tracking-wider text-zinc-950 shadow-xl transition-all hover:bg-blue-600 hover:text-white sm:px-8 sm:text-sm"
                >
                  <span>Explorar Coleção Completa</span>
                  <ArrowDown className="w-4 h-4" />
                </a>

                <a
                  href="#fit-finder"
                  className="px-6 py-4 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-md border border-white/25 text-white font-bold text-xs sm:text-sm transition-all flex items-center gap-2"
                >
                  <Ruler className="w-4 h-4 text-blue-400" />
                  Descobrir Meu Tamanho
                </a>
              </motion.div>
            </div>

            {/* Right Floating Glass Quick-Buy Card (5 Cols) */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="lg:col-span-5 bg-white/95 backdrop-blur-2xl rounded-3xl p-6 sm:p-7 text-zinc-900 shadow-2xl border border-white"
            >
              <div className="flex items-center justify-between border-b border-zinc-200 pb-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="relative w-14 h-16 rounded-2xl overflow-hidden bg-zinc-100 border border-zinc-200 shrink-0">
                    <Image
                      src={PRODUCTS[0].image}
                      alt={PRODUCTS[0].name}
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-blue-600 font-bold block">
                      PEÇA CHAVE DA CAMPANHA
                    </span>
                    <h2 className="text-lg font-black uppercase tracking-tight text-zinc-950">
                      {PRODUCTS[0].name}
                    </h2>
                    <span className="text-xs text-zinc-500">{PRODUCTS[0].subtitle}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs text-zinc-400 line-through block">
                    R$ {PRODUCTS[0].originalPrice?.toFixed(2)}
                  </span>
                  <span className="text-xl font-black text-zinc-950">
                    R$ {PRODUCTS[0].price.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-zinc-500 mb-2">
                <span className="font-mono uppercase text-[10px]">
                  Clique no tamanho para compra rápida:
                </span>
                <span className="font-mono text-[10px] text-rose-600 font-bold">
                  • Apenas {PRODUCTS[0].stockLeft} disp.
                </span>
              </div>

              <div className="grid grid-cols-5 gap-2">
                {SIZES.map((sz) => (
                  <button
                    key={sz}
                    onClick={() => addToCart(PRODUCTS[0], sz)}
                    className="py-2.5 rounded-xl bg-zinc-100 hover:bg-blue-600 text-zinc-900 hover:text-white font-mono text-xs font-bold border border-zinc-200/80 transition-all"
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ==========================================
          3. VITRINE DE PRODUTOS (GALERIA CLARA)
      ========================================== */}
      <section id="vitrine" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-blue-600 font-bold block mb-2">
              {"// ARQUIVO TÊXTIL 2026 • TIRAGEM LIMITADA"}
            </span>
            <h2 className="text-4xl sm:text-5xl font-black uppercase tracking-tighter text-zinc-950">
              Peças do <span className="italic font-light text-blue-600">Drop #04</span>
            </h2>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-2">
            {[
              { id: "all", label: "Todas as Peças (6)" },
              { id: "heavy-tees", label: "Heavyweight 320g" },
              { id: "acid-wash", label: "Tingimento Mineral" },
              { id: "longsleeve", label: "Manga Longa" },
              { id: "accessories", label: "Acessórios" },
            ].map((cat) => (
              <button
                key={cat.id}
                aria-pressed={activeCategory === cat.id}
                onClick={() => setActiveCategory(cat.id as CategoryFilter)}
                className={`px-4 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                  activeCategory === cat.id
                    ? "bg-zinc-950 text-white shadow-md"
                    : "bg-white text-zinc-600 hover:text-zinc-950 border border-zinc-200"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => {
            const isHovered = hoveredProductId === product.id;

            return (
              <motion.div
                layout
                key={product.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                onMouseEnter={() => setHoveredProductId(product.id)}
                onMouseLeave={() => setHoveredProductId(null)}
                className="group rounded-[2rem] bg-white border border-zinc-200/90 hover:border-zinc-400 hover:-translate-y-1 overflow-hidden transition-all flex flex-col justify-between hover:shadow-[0_20px_50px_rgba(0,0,0,0.06)]"
              >
                <div>
                  {/* Image Container */}
                  <div
                    role="button"
                    tabIndex={0}
                    aria-label={`Ver ficha técnica de ${product.name}`}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setSelectedProductModal(product);
                        setModalSize(recommendedSize);
                        setModalColor(product.colors[0].name);
                      }
                    }}
                    onClick={() => {
                      setSelectedProductModal(product);
                      setModalSize(recommendedSize);
                      setModalColor(product.colors[0].name);
                    }}
                    className="relative aspect-[4/4.5] w-full overflow-hidden bg-zinc-100 cursor-pointer"
                  >
                    <Image
                      src={isHovered ? product.backImage : product.image}
                      alt=""
                      fill
                      unoptimized
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />

                    {/* Top Badges */}
                    <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                      {product.badge ? (
                        <span className="px-3 py-1 rounded-full bg-zinc-950 text-white font-mono text-[10px] font-bold uppercase tracking-wider shadow-sm">
                          {product.badge}
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-md border border-zinc-200 text-zinc-600 font-mono text-[10px] font-bold">
                          {product.code}
                        </span>
                      )}

                      <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-md border border-zinc-200 font-mono text-[10px] text-blue-600 font-bold">
                        {product.gsm} • {product.fit}
                      </span>
                    </div>

                    {/* Hover Details Button */}
                    <div className="absolute bottom-3 right-3 px-3.5 py-1.5 rounded-full bg-white/95 backdrop-blur-md text-[11px] font-semibold text-zinc-900 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm">
                      <Eye className="w-3.5 h-3.5 text-blue-600" /> Ver Ficha Técnica
                    </div>
                  </div>

                  {/* Product Details */}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[11px] font-mono text-zinc-500">
                        {product.subtitle}
                      </span>
                      <span className="text-[10px] font-mono text-rose-600 font-bold">
                        • Restam {product.stockLeft}
                      </span>
                    </div>

                    <h3
                      onClick={() => {
                        setSelectedProductModal(product);
                        setModalSize(recommendedSize);
                        setModalColor(product.colors[0].name);
                      }}
                      className="text-xl font-black text-zinc-950 uppercase tracking-tight mb-4 cursor-pointer group-hover:text-blue-600 transition-colors"
                    >
                      {product.name}
                    </h3>

                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center gap-1.5">
                        {product.colors.map((c) => (
                          <span
                            key={c.name}
                            title={c.name}
                            className="w-4 h-4 rounded-full border border-zinc-300 shadow-inner"
                            style={{ backgroundColor: c.hex }}
                          />
                        ))}
                        <span className="text-[11px] text-zinc-500 font-mono ml-1">
                          {product.colors.length} {product.colors.length > 1 ? "tons" : "tom"}
                        </span>
                      </div>

                      <div className="text-right">
                        {product.originalPrice && (
                          <span className="text-xs text-zinc-400 line-through mr-2 font-mono">
                            R$ {product.originalPrice.toFixed(2)}
                          </span>
                        )}
                        <span className="text-xl font-black text-zinc-950">
                          R$ {product.price.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Size Add Bar */}
                <div className="px-6 pb-6 pt-3 border-t border-zinc-100 bg-zinc-50/60">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono uppercase text-zinc-500">
                      Adicionar Direto:
                    </span>
                    <span className="text-[10px] font-mono text-blue-600 font-bold">
                      R$ {(product.price * 0.92).toFixed(2)} no PIX
                    </span>
                  </div>
                  <div className="grid grid-cols-5 gap-1.5">
                    {SIZES.map((sz) => (
                      <button
                        key={sz}
                        aria-label={`Adicionar ${product.name} tamanho ${sz} à sacola`}
                        onClick={() => addToCart(product, sz)}
                        className="py-2 rounded-xl bg-white hover:bg-zinc-950 border border-zinc-200 hover:border-zinc-950 text-xs font-mono font-bold text-zinc-800 hover:text-white transition-all shadow-2xs"
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ==========================================
          4. SIMULADOR DE CAIMENTO (FIT FINDER CLARO)
      ========================================== */}
      <section id="fit-finder" className="py-20 bg-[#F2F0E8] border-y border-zinc-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-[2.5rem] bg-white border border-zinc-200 p-8 sm:p-12 shadow-[0_20px_60px_rgba(0,0,0,0.04)]">
            <div className="grid lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-7 space-y-6">
                <div>
                  <span className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-blue-600 font-bold mb-2">
                    <Sliders className="w-3.5 h-3.5" /> Provador Biométrico • Precisão de Ateliê
                  </span>
                  <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-zinc-950">
                    Calculadora de <span className="italic font-light text-blue-600">Proporção Boxy</span>
                  </h2>
                  <p className="text-zinc-600 text-sm mt-2">
                    Informe sua estrutura corporal abaixo para descobrir qual tamanho entregará o
                    caimento exato que você prefere.
                  </p>
                </div>

                <div className="grid sm:grid-cols-2 gap-6 pt-2">
                  <div className="p-5 rounded-2xl bg-[#FAF9F5] border border-zinc-200">
                    <div className="flex justify-between text-xs font-mono mb-2">
                      <span className="text-zinc-500 font-bold">SUA ALTURA</span>
                      <span className="text-blue-600 font-black">{userHeight} cm</span>
                    </div>
                    <input
                      type="range"
                      min={155}
                      max={200}
                      value={userHeight}
                      onChange={(e) => setUserHeight(Number(e.target.value))}
                      className="w-full accent-blue-600 cursor-pointer"
                    />
                  </div>

                  <div className="p-5 rounded-2xl bg-[#FAF9F5] border border-zinc-200">
                    <div className="flex justify-between text-xs font-mono mb-2">
                      <span className="text-zinc-500 font-bold">SEU PESO</span>
                      <span className="text-blue-600 font-black">{userWeight} kg</span>
                    </div>
                    <input
                      type="range"
                      min={50}
                      max={120}
                      value={userWeight}
                      onChange={(e) => setUserWeight(Number(e.target.value))}
                      className="w-full accent-blue-600 cursor-pointer"
                    />
                  </div>
                </div>

                <div>
                  <span className="text-xs font-mono uppercase text-zinc-500 font-bold block mb-2.5">
                    Estética de Caimento Desejada:
                  </span>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: "regular", label: "Alinhado", desc: "Corte reto clássico" },
                      { id: "oversized", label: "Boxy Original", desc: "Ombro estruturado" },
                      { id: "baggy", label: "Drapeado Amplo", desc: "Silhueta editorial" },
                    ].map((style) => (
                      <button
                        key={style.id}
                        onClick={() => setFitPreference(style.id as "regular" | "oversized" | "baggy")}
                        className={`p-3.5 rounded-2xl border text-left transition-all ${
                          fitPreference === style.id
                            ? "bg-blue-600 border-blue-600 text-white shadow-md"
                            : "bg-[#FAF9F5] border-zinc-200 text-zinc-700 hover:border-zinc-400"
                        }`}
                      >
                        <span className="text-xs font-bold block">{style.label}</span>
                        <span
                          className={`text-[10px] ${
                            fitPreference === style.id ? "text-blue-100" : "text-zinc-500"
                          }`}
                        >
                          {style.desc}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5">
                <div className="p-8 rounded-3xl bg-[#FAF9F5] border border-zinc-200 text-center">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-blue-600 font-bold block mb-2">
                    TAMANHO RECOMENDADO PELO ATELIÊ
                  </span>
                  <div className="text-7xl font-black text-zinc-950 my-3">{recommendedSize}</div>
                  <p className="text-xs text-zinc-600 max-w-xs mx-auto mb-6 leading-relaxed">
                    Para <strong>{userHeight}cm</strong> e <strong>{userWeight}kg</strong> com
                    caimento <strong className="uppercase">{fitPreference}</strong>, o tamanho{" "}
                    <strong className="text-blue-600">{recommendedSize}</strong> oferece a proporção
                    áurea de ombro e tórax.
                  </p>
                  <a
                    href="#vitrine"
                    className="inline-flex items-center justify-center gap-2 w-full py-4 rounded-full bg-zinc-950 hover:bg-blue-600 text-white font-black uppercase tracking-wider text-xs transition-all"
                  >
                    Ver Peças no Tamanho {recommendedSize}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          5. LOOKBOOK EDITORIAL INTERATIVO
      ========================================== */}
      <section id="lookbook" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-blue-600 font-bold block mb-2">
              {"// CAMPANHA ARQUITETURA SOLAR 2026"}
            </span>
            <h2 className="text-4xl sm:text-5xl font-black uppercase tracking-tighter text-zinc-950">
              Lookbook <span className="italic font-light text-blue-600">Interativo</span>
            </h2>
          </div>
          <p className="text-xs font-mono text-zinc-500 uppercase">
            [ CLIQUE NOS PONTOS (+) SOBRE A FOTOGRAFIA PARA COMPRAR O LOOK ]
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 relative aspect-[16/11] rounded-[2.5rem] overflow-hidden border border-zinc-200 bg-zinc-100 shadow-lg">
            <Image
              src="https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1400&q=85"
              alt="Lookbook Editorial"
              fill
              unoptimized
              className="object-cover"
            />

            {/* Hotspot 1 */}
            <button
              onClick={() => setActiveHotspot(0)}
              aria-label="Ver peça 1 do lookbook"
              aria-pressed={activeHotspot === 0}
              className={`absolute top-[38%] left-[45%] w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-lg ${
                activeHotspot === 0
                  ? "bg-blue-600 text-white scale-125 ring-4 ring-white"
                  : "bg-white text-zinc-950 hover:scale-110"
              }`}
            >
              <Plus className="w-4 h-4 font-bold" />
            </button>

            {/* Hotspot 2 */}
            <button
              onClick={() => setActiveHotspot(1)}
              aria-label="Ver peça 2 do lookbook"
              aria-pressed={activeHotspot === 1}
              className={`absolute top-[62%] left-[58%] w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-lg ${
                activeHotspot === 1
                  ? "bg-blue-600 text-white scale-125 ring-4 ring-white"
                  : "bg-white text-zinc-950 hover:scale-110"
              }`}
            >
              <Plus className="w-4 h-4 font-bold" />
            </button>

            <div className="absolute bottom-4 left-4 px-4 py-1.5 rounded-full bg-white/90 backdrop-blur-md text-[11px] font-mono font-bold text-zinc-900">
               FOTOGRAFADO EM 120MM • LUZ NATURAL
            </div>
          </div>

          <div className="lg:col-span-5">
            {(() => {
              const spotProduct = activeHotspot === 0 ? PRODUCTS[1] : PRODUCTS[5];
              return (
                <div className="p-8 rounded-[2.5rem] bg-white border border-zinc-200 shadow-sm space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono uppercase text-blue-600 font-bold">
                      PEÇA EM DESTAQUE NO LOOK #{activeHotspot + 1}
                    </span>
                    <span className="text-xs font-mono text-zinc-400">{spotProduct.code}</span>
                  </div>

                  <div className="flex gap-5 items-center">
                    <div className="relative w-24 h-28 rounded-2xl overflow-hidden shrink-0 border border-zinc-200 bg-zinc-100">
                      <Image
                        src={spotProduct.image}
                        alt={spotProduct.name}
                        fill
                        unoptimized
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="text-xl font-black uppercase text-zinc-950">
                        {spotProduct.name}
                      </h3>
                      <p className="text-xs text-zinc-500 mt-1">{spotProduct.subtitle}</p>
                      <span className="text-2xl font-black text-blue-600 block mt-2">
                        R$ {spotProduct.price.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-zinc-600 leading-relaxed">{spotProduct.description}</p>

                  <button
                    onClick={() => addToCart(spotProduct, recommendedSize)}
                    className="w-full py-4 rounded-full bg-zinc-950 hover:bg-blue-600 text-white font-black uppercase tracking-wider text-xs transition-all flex items-center justify-center gap-2"
                  >
                    <ShoppingBag className="w-4 h-4" /> Adicionar Tam. {recommendedSize} à Sacola
                  </button>
                </div>
              );
            })()}
          </div>
        </div>
      </section>

      {/* ==========================================
          6. CLUBE PRIVADO & FORMULÁRIO DE INSCRIÇÃO
      ========================================== */}
      <section id="contato" className="py-24 bg-white border-t border-zinc-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-5">
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-mono font-bold uppercase tracking-widest">
                <QrCode className="w-3.5 h-3.5" /> Private Atelier List
              </span>
              <h2 className="text-4xl sm:text-5xl font-black uppercase tracking-tighter text-zinc-950 leading-none">
                Acesso Antecipado <br />
                <span className="italic font-light text-blue-600">ao Drop #05.</span>
              </h2>
              <p className="text-zinc-600 text-sm sm:text-base leading-relaxed max-w-lg">
                Nossas tiragens são limitadas a 150 peças por modelo. Inscreva seu contato para
                receber o link privado 1 hora antes da abertura geral + **15% OFF na sua primeira
                compra**.
              </p>

              <div className="pt-4 flex flex-wrap gap-6 text-xs font-mono text-zinc-500 font-semibold">
                <span className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-blue-600" /> Primeira Troca Gratuita
                </span>
                <span className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-blue-600" /> Despacho no Mesmo Dia
                </span>
              </div>
            </div>

            <div className="lg:col-span-6">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setVipSubmitted(true);
                }}
                className="p-8 sm:p-10 rounded-[2.5rem] bg-[#FAF9F5] border border-zinc-200 space-y-4"
              >
                <div className="flex items-center justify-between border-b border-zinc-200 pb-4 mb-2">
                  <span className="text-xs font-mono uppercase text-zinc-900 font-bold">
                    CREDENCIAL DE MEMBRO // VORTEX
                  </span>
                  <span className="text-[10px] font-mono font-bold text-blue-700 bg-blue-100 px-3 py-1 rounded-full">
                    VOUCHER: ATELIER15
                  </span>
                </div>

                {vipSubmitted ? (
                  <div className="p-6 rounded-2xl bg-blue-50 border border-blue-200 text-center space-y-2">
                    <Check className="w-8 h-8 text-blue-600 mx-auto" />
                    <h4 className="text-base font-black uppercase text-zinc-950">
                      Inscrição Confirmada!
                    </h4>
                    <p className="text-xs text-zinc-600">
                      Utilize o código <strong className="text-blue-600 font-mono">ATELIER15</strong>{" "}
                      no seu pedido de hoje.
                    </p>
                  </div>
                ) : (
                  <>
                    <div>
                      <label className="block text-[11px] font-mono uppercase text-zinc-600 font-bold mb-1.5">
                        Seu E-mail Principal
                      </label>
                      <input
                        type="email"
                        required
                        value={vipEmail}
                        onChange={(e) => setVipEmail(e.target.value)}
                        placeholder="nome@exemplo.com"
                        className="w-full px-4 py-3.5 rounded-2xl bg-white border border-zinc-300 text-xs text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-blue-600"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono uppercase text-zinc-600 font-bold mb-1.5">
                        WhatsApp (Para receber a Senha do Drop)
                      </label>
                      <input
                        type="tel"
                        required
                        value={vipPhone}
                        onChange={(e) => setVipPhone(e.target.value)}
                        placeholder="(11) 99999-9999"
                        className="w-full px-4 py-3.5 rounded-2xl bg-white border border-zinc-300 text-xs text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-blue-600"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full py-4 rounded-full bg-blue-600 hover:bg-zinc-950 text-white font-black uppercase tracking-wider text-xs transition-all flex items-center justify-center gap-2 shadow-md"
                    >
                      <span>Desbloquear 15% OFF + Early Access</span>
                      <Send className="w-4 h-4" />
                    </button>
                  </>
                )}
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          7. FOOTER EDITORIAL CLARO
      ========================================== */}
      <footer className="bg-[#F2F0E8] border-t border-zinc-200 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 pb-10 border-b border-zinc-300/80">
            <div>
              <span className="text-xl font-black tracking-tighter text-zinc-950">
                VORTEX<span className="text-blue-600">{"//"}</span>ATELIER
              </span>
              <p className="text-xs text-zinc-600 mt-1 max-w-sm">
                Estúdio independente de engenharia têxtil e vestuário pesado. Produzido eticamente
                em lotes numerados no Brasil.
              </p>
            </div>

            <div className="flex flex-wrap gap-6 text-xs font-mono font-bold uppercase text-zinc-600">
              <a href="#vitrine" className="hover:text-blue-600 transition-colors">
                Coleção #04
              </a>
              <a href="#fit-finder" className="hover:text-blue-600 transition-colors">
                Guia de Medidas
              </a>
              <a href="#lookbook" className="hover:text-blue-600 transition-colors">
                Editorial
              </a>
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-600 transition-colors"
              >
                Atendimento WhatsApp
              </a>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-mono text-zinc-500">
            <p>© {CURRENT_YEAR} VORTEX ATELIER. TODOS OS DIREITOS RESERVADOS.</p>
            <p>PAGAMENTO VIA PIX COM 8% OFF OU CARTÃO EM ATÉ 4X SEM JUROS.</p>
          </div>
        </div>
      </footer>

      {/* ==========================================
          8. MODAL DE DETALHES DA PEÇA (LIGHT MODE)
      ========================================== */}
      <AnimatePresence>
        {selectedProductModal && (
          <div
            onClick={() => setSelectedProductModal(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-sm"
          >
            <motion.div
              ref={productTrapRef}
              role="dialog"
              aria-modal="true"
              aria-label={`Ficha técnica ${selectedProductModal.name}`}
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-2xl rounded-[2.5rem] bg-white border border-zinc-200 overflow-hidden shadow-2xl grid md:grid-cols-2"
            >
              <div className="relative aspect-square md:aspect-auto bg-zinc-100">
                <Image
                  src={selectedProductModal.image}
                  alt={selectedProductModal.name}
                  fill
                  unoptimized
                  className="object-cover"
                />
              </div>

              <div className="p-6 sm:p-8 flex flex-col justify-between space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono font-bold text-blue-600 uppercase">
                      {selectedProductModal.code} • {selectedProductModal.gsm}
                    </span>
                    <button
                      onClick={() => setSelectedProductModal(null)}
                      aria-label="Fechar ficha"
                      className="p-1.5 rounded-full bg-zinc-100 text-zinc-600 hover:text-zinc-950"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <h3 className="text-2xl font-black uppercase text-zinc-950 mb-1">
                    {selectedProductModal.name}
                  </h3>
                  <p className="text-xl font-black text-blue-600 mb-4">
                    R$ {selectedProductModal.price.toFixed(2)}
                  </p>
                  <p className="text-xs text-zinc-600 leading-relaxed mb-6">
                    {selectedProductModal.description}
                  </p>

                  <div className="mb-4">
                    <span className="text-[10px] font-mono uppercase text-zinc-500 block mb-2">
                      Tonalidade: <strong className="text-zinc-950">{modalColor}</strong>
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {selectedProductModal.colors.map((c) => (
                        <button
                          key={c.name}
                          onClick={() => setModalColor(c.name)}
                          className={`px-3 py-1.5 rounded-full border text-xs font-mono font-bold ${
                            modalColor === c.name
                              ? "border-blue-600 bg-blue-50 text-blue-700"
                              : "border-zinc-200 bg-zinc-50 text-zinc-600"
                          }`}
                        >
                          {c.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] font-mono uppercase text-zinc-500 block mb-2">
                      Tamanho (Sugerido: {recommendedSize}):
                    </span>
                    <div className="grid grid-cols-5 gap-2">
                      {SIZES.map((sz) => (
                        <button
                          key={sz}
                          onClick={() => setModalSize(sz)}
                          className={`py-2.5 rounded-xl font-mono text-xs font-bold border transition-all ${
                            modalSize === sz
                              ? "bg-zinc-950 border-zinc-950 text-white"
                              : "bg-zinc-50 border-zinc-200 text-zinc-700"
                          }`}
                        >
                          {sz}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => addToCart(selectedProductModal, modalSize, modalColor)}
                  className="w-full py-4 rounded-full bg-blue-600 hover:bg-zinc-950 text-white font-black uppercase tracking-wider text-xs transition-colors"
                >
                  Adicionar à Sacola
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ==========================================
          9. SLIDE-OVER CART DRAWER (LIGHT MODE)
      ========================================== */}
      <AnimatePresence>
        {isCartOpen && (
          <div
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 z-50 flex justify-end bg-zinc-950/50 backdrop-blur-xs"
          >
            <motion.div
              ref={cartTrapRef}
              role="dialog"
              aria-modal="true"
              aria-label="Sua sacola"
              onClick={(e) => e.stopPropagation()}
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 250 }}
              className="w-full max-w-md bg-white border-l border-zinc-200 h-full flex flex-col justify-between shadow-2xl"
            >
              <div className="p-6 border-b border-zinc-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2.5">
                    <ShoppingBag className="w-5 h-5 text-blue-600" />
                    <h2 className="text-lg font-black uppercase tracking-tight text-zinc-950">
                      Sua Sacola ({totalCount})
                    </h2>
                  </div>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    aria-label="Fechar sacola"
                    className="p-2 rounded-full bg-zinc-100 text-zinc-600 hover:text-zinc-950"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#FAF9F5] border border-zinc-200">
                  <div className="text-xs mb-2">
                    {!hasFreeShipping ? (
                      <span className="text-zinc-600">
                        Faltam{" "}
                        <strong className="text-blue-600">
                          R$ {(FREE_SHIPPING_THRESHOLD - subtotal).toFixed(2)}
                        </strong>{" "}
                        para <strong>Frete Grátis + Pack de Stickers!</strong>
                      </span>
                    ) : (
                      <span className="text-blue-600 font-bold flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4" /> Frete Grátis + Pack de Stickers Liberado!
                      </span>
                    )}
                  </div>
                  <div className="w-full h-1.5 bg-zinc-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-600 transition-all duration-500"
                      style={{
                        width: `${Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100)}%`,
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {cart.length === 0 ? (
                  <div className="text-center py-16">
                    <Box className="w-12 h-12 text-zinc-300 mx-auto mb-3" />
                    <p className="text-sm font-bold text-zinc-500">Sua sacola está vazia</p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-3">
                      {cart.map((item) => (
                        <div
                          key={item.cartId}
                          className="p-3.5 rounded-2xl bg-[#FAF9F5] border border-zinc-200 flex items-center justify-between gap-3"
                        >
                          <div className="flex items-center gap-3">
                            <div className="relative w-14 h-16 rounded-xl overflow-hidden shrink-0 border border-zinc-200 bg-white">
                              <Image
                                src={item.product.image}
                                alt={item.product.name}
                                fill
                                unoptimized
                                className="object-cover"
                              />
                            </div>
                            <div>
                              <h4 className="text-xs font-bold text-zinc-950 uppercase">
                                {item.product.name}
                              </h4>
                              <span className="text-[11px] font-mono text-blue-600 font-semibold block">
                                Tam: {item.size} • {item.color}
                              </span>
                              <span className="text-xs font-black text-zinc-900 block mt-1">
                                R$ {(item.product.price * item.quantity).toFixed(2)}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 bg-white border border-zinc-200 rounded-full px-2.5 py-1">
                            <button
                              onClick={() => updateCartQty(item.cartId, -1)}
                              aria-label={`Diminuir quantidade de ${item.product.name}`}
                              className="text-zinc-500 hover:text-zinc-950"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="text-xs font-mono font-bold w-4 text-center text-zinc-950">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateCartQty(item.cartId, 1)}
                              aria-label={`Aumentar quantidade de ${item.product.name}`}
                              className="text-zinc-500 hover:text-zinc-950"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <form
                      id="streetwear-checkout"
                      onSubmit={handleCheckoutWhatsApp}
                      className="pt-5 border-t border-zinc-200 space-y-3"
                    >
                      <span className="text-[11px] font-mono uppercase text-blue-600 font-bold block">
                        Dados de Envio Rápido
                      </span>
                      <input
                        type="text"
                        required
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="Seu nome completo"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF9F5] border border-zinc-300 text-xs text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-blue-600"
                      />
                      <input
                        type="text"
                        required
                        value={customerZip}
                        onChange={(e) => setCustomerZip(e.target.value)}
                        placeholder="CEP (00000-000)"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF9F5] border border-zinc-300 text-xs text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-blue-600"
                      />
                      <input
                        type="text"
                        required
                        value={customerAddress}
                        onChange={(e) => setCustomerAddress(e.target.value)}
                        placeholder="Endereço completo com número"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF9F5] border border-zinc-300 text-xs text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-blue-600"
                      />

                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => setPaymentType("pix")}
                          className={`p-2.5 rounded-xl border text-xs font-mono font-bold transition-all ${
                            paymentType === "pix"
                              ? "bg-blue-600 border-blue-600 text-white"
                              : "bg-[#FAF9F5] border-zinc-200 text-zinc-600"
                          }`}
                        >
                          PIX (-8% OFF)
                        </button>
                        <button
                          type="button"
                          onClick={() => setPaymentType("card")}
                          className={`p-2.5 rounded-xl border text-xs font-mono font-bold transition-all ${
                            paymentType === "card"
                              ? "bg-zinc-950 border-zinc-950 text-white"
                              : "bg-[#FAF9F5] border-zinc-200 text-zinc-600"
                          }`}
                        >
                          Cartão (Até 4x)
                        </button>
                      </div>
                    </form>
                  </>
                )}
              </div>

              {cart.length > 0 && (
                <div className="p-6 border-t border-zinc-200 bg-[#FAF9F5] space-y-4">
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between text-zinc-600">
                      <span>Subtotal</span>
                      <span>R$ {subtotal.toFixed(2)}</span>
                    </div>
                    {paymentType === "pix" && (
                      <div className="flex justify-between text-blue-600 font-mono font-bold">
                        <span>Desconto PIX (8%)</span>
                        <span>- R$ {pixDiscount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-zinc-600">
                      <span>Frete Express</span>
                      <span className={hasFreeShipping ? "text-blue-600 font-bold" : ""}>
                        {hasFreeShipping ? "GRÁTIS" : `R$ ${shippingCost.toFixed(2)}`}
                      </span>
                    </div>
                    <div className="flex justify-between text-base font-black text-zinc-950 pt-2 border-t border-zinc-200">
                      <span>Total Final</span>
                      <span className="text-blue-600">R$ {finalTotal.toFixed(2)}</span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    form="streetwear-checkout"
                    className="w-full py-4 rounded-full bg-blue-600 hover:bg-zinc-950 text-white font-black uppercase tracking-wider text-xs flex items-center justify-center gap-2 shadow-lg transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" /> Finalizar Pedido no WhatsApp
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <StickyMobileCta
        label="Ver peças do Drop #04"
        href="#vitrine"
        hideWhenVisibleId="vitrine"
        className="bg-zinc-950 text-white"
      />
    </main>
  );
}