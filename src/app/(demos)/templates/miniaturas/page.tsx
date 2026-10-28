"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Layers,
  Palette,
  Cpu,
  Eye,
  Sliders,
  Volume2,
  VolumeX,
  MessageCircle,
  ArrowUpRight,
  CheckCircle2,
  ZoomIn,
  X,
  Clock,
  ShieldCheck,
  Flame,
  Wand2,
  Droplets,
  Box,
  Maximize2,
  Menu,
  Search,
  ChevronRight,
} from "lucide-react";
import { trackMetaEvent } from "@/components/MetaPixel";

// ==========================================
// CONFIGURAÇÕES GERAIS
// ==========================================
const WHATSAPP_NUMBER = "5511999999999";
const CURRENT_YEAR = new Date().getFullYear();

// ==========================================
// WEB AUDIO SYNTHESIZER (UV LASER & AIRBRUSH)
// ==========================================
class AtelierSoundEngine {
  private ctx: AudioContext | null = null;
  public enabled: boolean = true;

  private init() {
    if (typeof window === "undefined") return;
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  // Clique sutil de chave mecânica / seletor
  playSwitch() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(680, now);
    osc.frequency.exponentialRampToValueAtTime(1120, now + 0.04);
    gain.gain.setValueAtTime(0.08, now);
    gain.gain.linearRampToValueAtTime(0.004, now + 0.04);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.045);
  }

  // Pulso cristalino que remete à cura UV 405nm
  playUvCurePulse() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    [528, 792, 1056].forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now + idx * 0.055);
      gain.gain.setValueAtTime(0.1, now + idx * 0.055);
      gain.gain.exponentialRampToValueAtTime(0.003, now + idx * 0.055 + 0.28);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + idx * 0.055);
      osc.stop(now + idx * 0.055 + 0.3);
    });
  }

  // Sopro curto de aerógrafo sintetizado via White Noise + Bandpass Filter
  playAirbrushSpray() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const bufferSize = this.ctx.sampleRate * 0.18;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(2400, now);
    filter.Q.setValueAtTime(1.8, now);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.12, now + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.005, now + 0.17);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);
    noise.start(now);
    noise.stop(now + 0.18);
  }
}

// ==========================================
// DADOS DO INSPEKTOR DE ESTÁGIOS (WORKBENCH)
// ==========================================
interface StageSpec {
  id: "mesh" | "resin" | "painted";
  step: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  techSpecs: { label: string; value: string }[];
  swatches?: { name: string; hex: string }[];
}

const WORKBENCH_STAGES: StageSpec[] = [
  {
    id: "mesh",
    step: "ESTÁGIO 01 // ZBRUSH & BLENDER",
    title: "Escultura Digital & Suportes Táticos",
    subtitle: "Malha High-Poly de 18 Milhões de Polígonos",
    description:
      "Preparamos cada modelo com escavação inteligente (hollowing de 1.8mm), furos de drenagem ocultos nos encaixes e suportes micro-esféricos posicionados manualmente para zero marcas nas áreas visíveis.",
    image:
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=85",
    techSpecs: [
      { label: "Altura de Camada", value: "0.018 mm (18µm)" },
      { label: "Anti-Aliasing", value: "8x Sub-Pixel Grey" },
      { label: "Suportes", value: "Micro-Tip 0.22mm" },
    ],
  },
  {
    id: "resin",
    step: "ESTÁGIO 02 // CURA UV 405nm & PRIMER",
    title: "Resina 12K Curada & Pré-Sombreamento",
    subtitle: "Lavagem Ultrassônica + Zenithal Highlighting",
    description:
      "Após o banho duplo em álcool isopropílico pureza 99.8% e cura térmica controlada, aplicamos o primer acrílico de poliuretano em aerógrafo com iluminação zenital para revelar cada textura de armadura, pele e tecido.",
    image:
      "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1200&q=85",
    techSpecs: [
      { label: "Resina Base", value: "Conjure / Phrozen Aqua 8K" },
      { label: "Pós-Cura", value: " Câmara UV 360° Aquecida" },
      { label: "Pré-Sombra", value: "Zenithal Black/Grey/White" },
    ],
  },
  {
    id: "painted",
    step: "ESTÁGIO 03 // PINTURA MASTERPIECE",
    title: "Acabamento NMM, OSL & Weathering",
    subtitle: "35 Horas de Pincel Kolinsky & Aerógrafo",
    description:
      "Camadas translúcidas (glazing), metal não-metálico (NMM) pintado à mão para simular reflexos hiper-realistas, efeitos de iluminação direcionada (OSL) de plasma/fogo e verniz fosco protetor UV.",
    image:
      "https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=1200&q=85",
    techSpecs: [
      { label: "Técnicas", value: "NMM + OSL + Wet Blending" },
      { label: "Tintas", value: "Vallejo / AK 3Gen / Citadel" },
      { label: "Proteção", value: "Duplo Verniz Matte Ultra" },
    ],
    swatches: [
      { name: "Obsidian Shadow", hex: "#14111F" },
      { name: "Plasma Magenta OSL", hex: "#E11D48" },
      { name: "Cyber Cyan Glow", hex: "#06B6D4" },
      { name: "NMM Gold Ochre", hex: "#F59E0B" },
      { name: "Bone Highlight", hex: "#FEF3C7" },
    ],
  },
];

// ==========================================
// ACERVO DA GALERIA DE MINIATURAS & RESINA
// ==========================================
type GalleryCategory = "todos" | "fantasy" | "cyberpunk" | "bustos" | "keycaps";

interface MiniatureWork {
  id: string;
  title: string;
  characterClass: string;
  category: GalleryCategory;
  scale: string;
  layerHeight: string;
  paintHours: string;
  priceRaw: number;
  pricePainted: number;
  image: string;
  badge: string;
  techniques: string[];
  paintsUsed: { name: string; hex: string }[];
  story: string;
}

const GALLERY_WORKS: MiniatureWork[] = [
  {
    id: "mini-01",
    title: "Valkyrie of the Astral Eclipse",
    characterClass: "Dark Fantasy • Boss Scale",
    category: "fantasy",
    scale: "75mm (1/24)",
    layerHeight: "18µm (Resina 12K)",
    paintHours: "42h de Pintura",
    priceRaw: 210,
    pricePainted: 1180,
    image:
      "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=1000&q=85",
    badge: "Ouro NMM & OSL",
    techniques: ["Non-Metallic Metal (NMM)", "Object Source Lighting", "Micro-Freehand na Capa"],
    paintsUsed: [
      { name: "Deep Violet", hex: "#3B0764" },
      { name: "Crimson Glaze", hex: "#BE123C" },
      { name: "NMM Solar Gold", hex: "#FBBF24" },
      { name: "Ice Yellow", hex: "#FEF08A" },
    ],
    story:
      "Escultura impressa em 7 partes com encaixes magnéticos de neodímio. Asas translúcidas graduadas no aerógrafo e armadura inteiramente executada em técnica de metal não-metálico.",
  },
  {
    id: "mini-02",
    title: "Nyx-09 // Sprawl Netrunner",
    characterClass: "Cyberpunk Edgerunner",
    category: "cyberpunk",
    scale: "1/10 Display Bust",
    layerHeight: "16µm Ultra-Detail",
    paintHours: "28h de Pintura",
    priceRaw: 185,
    pricePainted: 890,
    image:
      "https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=1000&q=85",
    badge: "Fluorescente UV",
    techniques: ["Pigmento Fluor Reativo UV", "Couro Desgastado", "Cromado Cibernético"],
    paintsUsed: [
      { name: "Neon Magenta", hex: "#EC4899" },
      { name: "Electric Cyan", hex: "#06B6D4" },
      { name: "Carbon Black", hex: "#18181B" },
      { name: "Chrome Silver", hex: "#E4E4E7" },
    ],
    story:
      "Busto de colecionador com circuitos pintados com tinta fluorescente que brilha intensamente sob luz negra ou iluminação RGB de setup.",
  },
  {
    id: "mini-03",
    title: "Inquisitor Malakor & Diorama",
    characterClass: "Grimdark Sci-Fi Tabletop",
    category: "fantasy",
    scale: "32mm Heroic",
    layerHeight: "20µm ABS-Like Tough",
    paintHours: "16h de Pintura",
    priceRaw: 75,
    pricePainted: 420,
    image:
      "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1000&q=85",
    badge: "Resina Anti-Queda",
    techniques: ["Oil Wash Grimdark", "Pigmento de Ferrugem Real", "Efeito de Plasma"],
    paintsUsed: [
      { name: "Burnt Umber", hex: "#451A03" },
      { name: "Rust Orange", hex: "#EA580C" },
      { name: "Plasma Green", hex: "#22C55E" },
      { name: "Steel Grey", hex: "#71717A" },
    ],
    story:
      "Impresso em blend de resina Tough ABS-Like flexível, resistente a quedas durante partidas de RPG de mesa e wargames.",
  },
  {
    id: "mini-04",
    title: "Oni Mecha Keycap // Cherry MX",
    characterClass: "Artisan Keycap Colecionável",
    category: "keycaps",
    scale: "1U Esc / Função",
    layerHeight: "14µm Micro-Precision",
    paintHours: "8h + Encapsulamento",
    priceRaw: 95,
    pricePainted: 260,
    image:
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=1000&q=85",
    badge: "Backlit Translúcido",
    techniques: ["Olhos Translúcidos p/ LED", "Verniz Automotivo 2K", "Encaixe Cruzado Reforçado"],
    paintsUsed: [
      { name: "Oni Red", hex: "#DC2626" },
      { name: "Ivory Fang", hex: "#FDE68A" },
      { name: "Clear Cyan", hex: "#22D3EE" },
    ],
    story:
      "Keycap artesanal para teclados mecânicos (switches estilo Cherry MX). Os olhos e chifres permitem a passagem do LED RGB do próprio teclado.",
  },
  {
    id: "mini-05",
    title: "Ancient Dragon Lord (280mm)",
    characterClass: "Colossal Centerpiece",
    category: "fantasy",
    scale: "280mm Wingspan",
    layerHeight: "22µm High-Speed",
    paintHours: "65h de Pintura",
    priceRaw: 490,
    pricePainted: 2450,
    image:
      "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1000&q=85",
    badge: "Peça de Museu",
    techniques: ["Transição de Aerógrafo em Escamas", "Base de Lava com Resina Epóxi", "Olhos Vítreos"],
    paintsUsed: [
      { name: "Magma Red", hex: "#EF4444" },
      { name: "Volcanic Ash", hex: "#27272A" },
      { name: "Sulfur Yellow", hex: "#FACC15" },
      { name: "Drake Teal", hex: "#0D9488" },
    ],
    story:
      "Peça monumental para centro de mesa ou vitrine. A base inclui efeito de magma fluindo com resina cristal pigmentada e iluminação interna opcional.",
  },
  {
    id: "mini-06",
    title: "Ronin Cyber-Samurai Bust",
    characterClass: "Busto de Exposição 1/6",
    category: "bustos",
    scale: "1/6 (150mm Altura)",
    layerHeight: "16µm Skin-Texture",
    paintHours: "38h de Pintura",
    priceRaw: 290,
    pricePainted: 1390,
    image:
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1000&q=85",
    badge: "Textura de Pele Real",
    techniques: ["Micro-pontilhismo de Pele", "Laca Japonesa Urushi Simulada", "Damasco na Lâmina"],
    paintsUsed: [
      { name: "Lacquer Red", hex: "#991B1B" },
      { name: "Warm Flesh", hex: "#FDBA74" },
      { name: "Cold Steel", hex: "#94A3B8" },
      { name: "Jade Accent", hex: "#10B981" },
    ],
    story:
      "Foco absoluto em sub-surface scattering (translucidez da pele humana) pintado à mão com dezenas de veladuras finíssimas.",
  },
];

// ==========================================
// OPÇÕES DA CALCULADORA DE ENCOMENDAS (FORGE)
// ==========================================
const SCALE_OPTIONS = [
  { id: "keycap", label: "Artisan Keycap (1U)", basePrice: 90, time: "3 a 5 dias" },
  { id: "32mm", label: "Miniatura RPG 32mm–40mm", basePrice: 65, time: "3 a 5 dias" },
  { id: "75mm", label: "Colecionável / Busto 75mm", basePrice: 175, time: "5 a 8 dias" },
  { id: "150mm", label: "Estátua 1/8 ou 1/6 (15cm–22cm)", basePrice: 380, time: "10 a 15 dias" },
];

const RESIN_OPTIONS = [
  { id: "12k-grey", label: "Resina 12K Matte Grey (Máximo Detalhe)", mult: 1.0 },
  { id: "abs-tough", label: "Resina ABS-Like Tough (Flexível p/ Jogo)", mult: 1.15 },
  { id: "clear-uv", label: "Resina Translúcida / Cristal (Magias & LED)", mult: 1.2 },
];

const FINISH_TIERS = [
  {
    id: "raw",
    label: "01. Apenas Impressão 3D (Lavada, Curada & Sem Suportes)",
    mult: 1.0,
    badge: "DIY Painter",
    desc: "Peça pronta para receber primer na sua casa, lixada nos pontos críticos.",
  },
  {
    id: "zenithal",
    label: "02. Pré-Sombreada (Primer + Zenithal Highlight no Aerógrafo)",
    mult: 1.45,
    badge: "Pronta p/ Contrast",
    desc: "Volume de luz e sombra já aplicado em aerógrafo + base colada.",
  },
  {
    id: "tabletop",
    label: "03. Pintura Tabletop Pro (Pronta para a Mesa de Jogo)",
    mult: 2.8,
    badge: "Mais Pedido RPG",
    desc: "Cores vibrantes, sombreamento rico, destaques precisos e verniz fosco.",
  },
  {
    id: "masterpiece",
    label: "04. Pintura Display Masterpiece (NMM, OSL & Nível Competição)",
    mult: 5.2,
    badge: "Colecionador VIP",
    desc: "Nível máximo de vitrine: metais não-metálicos, luz direcional e diorama.",
  },
];

const BASE_STYLES = [
  { id: "simple", label: "Pedestal Clássico Preto Matte", addPrice: 0 },
  { id: "dungeon", label: "Ruínas Góticas & Pedras Esculpidas", addPrice: 45 },
  { id: "cyber", label: "Asfalto Cyberpunk + Poças Neon UV", addPrice: 65 },
  { id: "magma", label: "Diorama de Lava / Cristal em Epóxi", addPrice: 95 },
];

export default function ResinAndMiniatureStudioPage() {
  const soundRef = useRef<AtelierSoundEngine | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Estado do Inspektor de Estágios (Workbench)
  const [activeStageIdx, setActiveStageIdx] = useState<number>(2); // Começa no Pintado
  const activeStage = WORKBENCH_STAGES[activeStageIdx];

  // Estado da Galeria
  const [activeCategory, setActiveCategory] = useState<GalleryCategory>("todos");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewPriceMode, setViewPriceMode] = useState<"painted" | "raw">("painted");
  const [lightboxWork, setLightboxWork] = useState<MiniatureWork | null>(null);

  // Estado da Calculadora de Encomendas (Custom Forge)
  const [selectedScale, setSelectedScale] = useState(SCALE_OPTIONS[2]); // 75mm
  const [selectedResin, setSelectedResin] = useState(RESIN_OPTIONS[0]);
  const [selectedFinish, setSelectedFinish] = useState(FINISH_TIERS[2]); // Tabletop Pro
  const [selectedBase, setSelectedBase] = useState(BASE_STYLES[1]);
  const [customModelNote, setCustomModelNote] = useState("");

  useEffect(() => {
    soundRef.current = new AtelierSoundEngine();
  }, []);

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    if (soundRef.current) {
      soundRef.current.enabled = next;
      if (next) soundRef.current.playUvCurePulse();
    }
  };

  const handleStageChange = (idx: number) => {
    setActiveStageIdx(idx);
    if (idx === 0) soundRef.current?.playSwitch();
    if (idx === 1) soundRef.current?.playUvCurePulse();
    if (idx === 2) soundRef.current?.playAirbrushSpray();
  };

  // Filtragem da Galeria
  const filteredGallery = useMemo(() => {
    return GALLERY_WORKS.filter((w) => {
      const matchCat = activeCategory === "todos" || w.category === activeCategory;
      const matchSearch =
        w.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        w.characterClass.toLowerCase().includes(searchQuery.toLowerCase()) ||
        w.techniques.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchCat && matchSearch;
    });
  }, [activeCategory, searchQuery]);

  // Cálculo da Encomenda
  const estimatedTotal = useMemo(() => {
    const core = selectedScale.basePrice * selectedResin.mult * selectedFinish.mult;
    return Math.round(core + selectedBase.addPrice);
  }, [selectedScale, selectedResin, selectedFinish, selectedBase]);

  const handleSendForgeQuote = (e: React.FormEvent) => {
    e.preventDefault();
    soundRef.current?.playUvCurePulse();

    trackMetaEvent("InitiateCheckout", {
      content_name: `Encomenda Custom: ${selectedScale.label} - ${selectedFinish.badge}`,
      value: estimatedTotal,
      currency: "BRL",
    });
    trackMetaEvent("Lead", {
      content_name: "Orçamento Impressão 3D & Pintura",
      value: estimatedTotal,
      currency: "BRL",
    });

    const msg = `*ORÇAMENTO DE BANCADA — ALCHEMIST VOXEL & FORGE* 🎨🧪\n----------------------------------\n*Escala:* ${
      selectedScale.label
    }\n*Resina:* ${selectedResin.label}\n*Acabamento:* ${
      selectedFinish.label
    }\n*Base Cenográfica:* ${selectedBase.label}\n${
      customModelNote ? `*Personagem / Link STL:* ${customModelNote}\n` : ""
    }----------------------------------\n*Investimento Estimado: R$ ${estimatedTotal},00*\n_Gostaria de verificar a fila de produção e enviar meu arquivo/referência!_`;

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-[#08060C] text-zinc-100 selection:bg-fuchsia-500 selection:text-white font-sans antialiased overflow-x-hidden">
      {/* ==========================================
          1. FLOATING ATELIER NAVBAR
      ========================================== */}
      <header className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 pt-4 pointer-events-none">
        <div className="max-w-7xl mx-auto bg-[#0E0A16]/85 backdrop-blur-xl border border-fuchsia-500/20 rounded-2xl px-4 sm:px-6 py-3.5 shadow-[0_20px_60px_rgba(0,0,0,0.8)] pointer-events-auto flex items-center justify-between gap-4">
          <a href="#" className="flex items-center gap-3.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-fuchsia-500 via-purple-600 to-indigo-500 flex items-center justify-center text-white shadow-[0_0_25px_rgba(217,70,239,0.4)]">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <span className="text-lg font-black tracking-tight text-white block leading-none">
                ALCHEMIST<span className="text-fuchsia-400">.VOXEL</span>
              </span>
              <span className="text-[9px] font-mono uppercase tracking-[0.22em] text-zinc-400">
                12K Resin & Miniature Art
              </span>
            </div>
          </a>

          <nav className="hidden lg:flex items-center gap-1 bg-zinc-950/70 border border-white/10 rounded-xl p-1">
            {[
              { label: "O Processo (Raio-X)", href: "#processo" },
              { label: "Galeria & Receitas", href: "#galeria" },
              { label: "Simulador de Encomenda", href: "#forja" },
              { label: "Especificações 12K", href: "#tecnologia" },
              { label: "Contato", href: "#contato" },
            ].map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => soundRef.current?.playSwitch()}
                className="px-3.5 py-1.5 rounded-lg text-xs font-medium text-zinc-300 hover:text-white hover:bg-fuchsia-500/15 transition-all"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={toggleSound}
              title="Áudio de Bancada (Laser UV & Aerógrafo)"
              className={`p-2.5 rounded-xl border transition-all ${
                soundEnabled
                  ? "bg-fuchsia-500/15 border-fuchsia-400/40 text-fuchsia-300"
                  : "bg-zinc-900 border-zinc-800 text-zinc-500"
              }`}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            <a
              href="#forja"
              onClick={() => soundRef.current?.playSwitch()}
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-fuchsia-600 to-indigo-600 hover:from-fuchsia-500 hover:to-indigo-500 text-white font-black text-xs uppercase tracking-wider transition-all shadow-[0_0_25px_rgba(217,70,239,0.35)]"
            >
              <Wand2 className="w-3.5 h-3.5" />
              <span>Orçar Minha Peça</span>
            </a>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="lg:hidden max-w-7xl mx-auto mt-2 bg-[#0E0A16]/95 backdrop-blur-xl border border-fuchsia-500/30 rounded-2xl p-4 pointer-events-auto flex flex-col gap-2"
            >
              {[
                { label: "O Processo (Raio-X)", href: "#processo" },
                { label: "Galeria & Receitas de Tinta", href: "#galeria" },
                { label: "Simulador de Encomenda", href: "#forja" },
                { label: "Especificações 12K", href: "#tecnologia" },
                { label: "Contato Direto", href: "#contato" },
              ].map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-sm font-semibold text-zinc-200 hover:bg-fuchsia-500/20"
                >
                  {item.label}
                </a>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ==========================================
          2. HERO SECTION (CREATIVE ATELIER + UV GLOW)
      ========================================== */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden border-b border-white/10">
        {/* Ambient UV 405nm & Magenta Glows */}
        <div className="absolute top-20 left-1/4 w-[550px] h-[550px] bg-fuchsia-600/15 rounded-full blur-[160px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[480px] h-[480px] bg-indigo-600/15 rounded-full blur-[150px] pointer-events-none" />

        {/* Subtle Voxel Matrix Grid */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.035]"
          style={{
            backgroundImage: `radial-gradient(#e879f9 1px, transparent 1px)`,
            backgroundSize: "32px 32px",
          }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left 7 Cols */}
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-fuchsia-500/10 border border-fuchsia-500/30 mb-6">
                <span className="px-2 py-0.5 rounded-full bg-fuchsia-500 text-zinc-950 font-mono text-[10px] font-black uppercase">
                  405nm SLA // 18µm
                </span>
                <span className="text-xs text-fuchsia-200 font-medium">
                  Estúdio de Impressão 3D em Resina & Pintura de Miniaturas
                </span>
              </div>

              <h1 className="text-4xl sm:text-6xl xl:text-7xl font-black uppercase tracking-tighter leading-[0.94] text-white mb-6">
                Da luz líquida <br />
                ao <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 via-amber-300 to-indigo-400 italic">pincel vivo.</span>
              </h1>

              <p className="text-zinc-300 text-base sm:text-lg max-w-xl leading-relaxed mb-8 border-l-2 border-fuchsia-500 pl-5">
                Materializamos personagens de RPG, bustos colecionáveis, dioramas e artisan keycaps
                com precisão microscópica de resina 12K e pintura artística feita à mão com
                técnicas de exposição internacional.
              </p>

              <div className="flex flex-wrap items-center gap-4">
                <a
                  href="#galeria"
                  onClick={() => soundRef.current?.playUvCurePulse()}
                  className="px-8 py-4 rounded-2xl bg-gradient-to-r from-fuchsia-600 via-purple-600 to-indigo-600 hover:from-fuchsia-500 hover:to-indigo-500 text-white font-black uppercase tracking-wider text-xs sm:text-sm shadow-[0_0_40px_rgba(217,70,239,0.4)] transition-all flex items-center gap-3"
                >
                  <span>Explorar Galeria de Obras</span>
                  <ChevronRight className="w-4 h-4" />
                </a>

                <a
                  href="#processo"
                  onClick={() => soundRef.current?.playAirbrushSpray()}
                  className="px-6 py-4 rounded-2xl bg-zinc-900/90 hover:bg-zinc-800 border border-white/15 text-zinc-200 font-bold text-xs sm:text-sm transition-all flex items-center gap-2.5"
                >
                  <Layers className="w-4 h-4 text-amber-300" />
                  <span>Inspecionar Raio-X (3 Estágios)</span>
                </a>
              </div>

              {/* Telemetry Strip */}
              <div className="mt-12 pt-8 border-t border-white/10 grid grid-cols-3 gap-6 max-w-lg">
                <div>
                  <span className="text-[10px] font-mono text-fuchsia-400 block">// RESOLUÇÃO</span>
                  <span className="text-xl sm:text-2xl font-black text-white">12K MSLA</span>
                  <span className="text-xs text-zinc-400 block">Zero linhas de camada</span>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-amber-300 block">// PINTURA</span>
                  <span className="text-xl sm:text-2xl font-black text-white">NMM & OSL</span>
                  <span className="text-xs text-zinc-400 block">Kolinsky & Aerógrafo</span>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-indigo-400 block">// ARQUIVOS</span>
                  <span className="text-xl sm:text-2xl font-black text-white">Seu STL ou Nosso</span>
                  <span className="text-xs text-zinc-400 block">Suporte tático incluso</span>
                </div>
              </div>
            </div>

            {/* Right 5 Cols: Interactive Hero Showcase */}
            <div className="lg:col-span-5">
              <div className="relative rounded-[2.5rem] overflow-hidden border border-fuchsia-500/30 bg-[#110C1D] aspect-[4/4.4] group shadow-[0_0_80px_rgba(217,70,239,0.15)]">
                <Image
                  src={GALLERY_WORKS[0].image}
                  alt={GALLERY_WORKS[0].title}
                  fill
                  unoptimized
                  className="object-cover group-hover:scale-105 transition-transform duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#08060C] via-[#08060C]/30 to-transparent" />

                <div className="absolute top-5 left-5 right-5 flex items-center justify-between">
                  <span className="px-3.5 py-1.5 rounded-xl bg-zinc-950/85 backdrop-blur-md border border-fuchsia-400/40 font-mono text-[10px] font-bold uppercase text-fuchsia-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" /> OBRA EM DESTAQUE
                  </span>
                  <span className="px-3 py-1.5 rounded-xl bg-zinc-950/85 backdrop-blur-md border border-white/10 font-mono text-[10px] text-amber-300">
                    {GALLERY_WORKS[0].paintHours}
                  </span>
                </div>

                {/* Floating Paint Swatches Pill on Image */}
                <div className="absolute bottom-5 left-5 right-5 p-5 rounded-3xl bg-zinc-950/90 backdrop-blur-xl border border-white/15 space-y-3.5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-widest text-fuchsia-400 block">
                        {GALLERY_WORKS[0].characterClass}
                      </span>
                      <h2 className="text-lg sm:text-xl font-black text-white uppercase">
                        {GALLERY_WORKS[0].title}
                      </h2>
                    </div>
                    <div className="flex items-center -space-x-1.5">
                      {GALLERY_WORKS[0].paintsUsed.map((sw, i) => (
                        <span
                          key={i}
                          title={sw.name}
                          className="w-6 h-6 rounded-full border-2 border-zinc-950 shadow"
                          style={{ backgroundColor: sw.hex }}
                        />
                      ))}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      soundRef.current?.playSwitch();
                      setLightboxWork(GALLERY_WORKS[0]);
                    }}
                    className="w-full py-3 rounded-xl bg-white hover:bg-fuchsia-400 text-zinc-950 font-black uppercase tracking-wider text-xs transition-colors flex items-center justify-center gap-2"
                  >
                    <ZoomIn className="w-4 h-4" />
                    <span>Inspecionar Lupa & Paleta de Tintas</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          3. INSPEKTOR INTERATIVO DE 3 ESTÁGIOS (RAIO-X)
      ========================================== */}
      <section
        id="processo"
        className="py-24 bg-[#0B0812] border-b border-white/10 scroll-mt-20 relative"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-12 gap-6">
            <div>
              <span className="font-mono text-xs uppercase tracking-[0.25em] text-fuchsia-400 block mb-2">
                // 01. ALQUIMIA DE PRODUÇÃO INTERATIVA
              </span>
              <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tighter text-white">
                Inspektor de <span className="text-amber-300 italic">Bancada (3 Estágios)</span>
              </h2>
            </div>

            {/* Stage Selector Buttons */}
            <div className="flex flex-wrap items-center gap-2 bg-zinc-950 p-1.5 rounded-2xl border border-white/10">
              {[
                { idx: 0, label: "1. Malha 3D & Suportes", icon: Box },
                { idx: 1, label: "2. Resina 12K Curada", icon: Droplets },
                { idx: 2, label: "3. Pintura Final Master", icon: Palette },
              ].map((btn) => {
                const Icon = btn.icon;
                const active = activeStageIdx === btn.idx;
                return (
                  <button
                    key={btn.idx}
                    type="button"
                    onClick={() => handleStageChange(btn.idx)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                      active
                        ? "bg-gradient-to-r from-fuchsia-600 to-indigo-600 text-white shadow-[0_0_20px_rgba(217,70,239,0.4)]"
                        : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{btn.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Interactive Stage Viewer */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center rounded-[2.5rem] bg-[#120D1E]/90 border border-fuchsia-500/25 p-6 sm:p-10 shadow-2xl">
            <div className="lg:col-span-6 relative aspect-[4/3] rounded-3xl overflow-hidden border border-white/15 bg-zinc-950">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeStage.id}
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.02 }}
                  transition={{ duration: 0.35 }}
                  className="absolute inset-0"
                >
                  <Image
                    src={activeStage.image}
                    alt={activeStage.title}
                    fill
                    unoptimized
                    className={`object-cover ${
                      activeStage.id === "mesh"
                        ? "hue-rotate-180 contrast-125"
                        : activeStage.id === "resin"
                        ? "grayscale contrast-125"
                        : ""
                    }`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-transparent to-black/30" />
                </motion.div>
              </AnimatePresence>

              <div className="absolute top-4 left-4 px-3.5 py-1.5 rounded-xl bg-black/80 backdrop-blur-md border border-fuchsia-400/40 font-mono text-[11px] font-bold text-fuchsia-300">
                {activeStage.step}
              </div>

              {/* Interactive Step Slider inside Image */}
              <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-black/80 backdrop-blur-md border border-white/10">
                <div className="flex justify-between text-[10px] font-mono uppercase text-zinc-400 mb-1.5">
                  <span>ARRASTE PARA TRANSICIONAR O ESTÁGIO</span>
                  <span className="text-amber-300 font-bold">ETAPA 0{activeStageIdx + 1}/03</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={2}
                  step={1}
                  value={activeStageIdx}
                  onChange={(e) => handleStageChange(Number(e.target.value))}
                  className="w-full accent-fuchsia-500 cursor-pointer"
                />
              </div>
            </div>

            <div className="lg:col-span-6 space-y-6">
              <div>
                <span className="font-mono text-xs uppercase tracking-widest text-amber-300 block mb-1">
                  {activeStage.subtitle}
                </span>
                <h3 className="text-2xl sm:text-4xl font-black uppercase text-white tracking-tight">
                  {activeStage.title}
                </h3>
                <p className="text-sm sm:text-base text-zinc-300 leading-relaxed mt-3">
                  {activeStage.description}
                </p>
              </div>

              {/* Technical Telemetry Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {activeStage.techSpecs.map((spec, i) => (
                  <div
                    key={i}
                    className="p-3.5 rounded-2xl bg-zinc-950/80 border border-white/10"
                  >
                    <span className="font-mono text-[10px] uppercase text-zinc-500 block">
                      {spec.label}
                    </span>
                    <strong className="font-mono text-xs sm:text-sm text-fuchsia-300 mt-0.5 block">
                      {spec.value}
                    </strong>
                  </div>
                ))}
              </div>

              {/* Swatches if in Painted Stage */}
              {activeStage.swatches && (
                <div className="p-4 rounded-2xl bg-zinc-950/90 border border-amber-400/30">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-amber-300 block mb-2.5">
                    // RECEITA CROMÁTICA APLICADA NO ESTÁGIO 03
                  </span>
                  <div className="flex flex-wrap gap-2.5">
                    {activeStage.swatches.map((sw, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-900 border border-white/10 text-xs"
                      >
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-white/30"
                          style={{ backgroundColor: sw.hex }}
                        />
                        <span className="font-medium text-zinc-200">{sw.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          4. GALERIA CURADA COM RECEITAS DE PINTURA
      ========================================== */}
      <section id="galeria" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-20">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-10 gap-6">
          <div>
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-fuchsia-400 block mb-2">
              // 02. PORTFÓLIO DE PEÇAS & COLEÇÕES
            </span>
            <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tighter text-white">
              Galeria de <span className="text-fuchsia-400 italic">Miniaturas & Resina</span>
            </h2>
          </div>

          {/* Toggle de Visualização de Preço: Pintada vs Apenas Resina */}
          <div className="inline-flex items-center bg-zinc-900 border border-white/10 p-1.5 rounded-2xl self-start lg:self-auto">
            <button
              type="button"
              onClick={() => {
                soundRef.current?.playSwitch();
                setViewPriceMode("painted");
              }}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                viewPriceMode === "painted"
                  ? "bg-fuchsia-500 text-zinc-950 shadow"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              Ver Valor Pintada
            </button>
            <button
              type="button"
              onClick={() => {
                soundRef.current?.playSwitch();
                setViewPriceMode("raw");
              }}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                viewPriceMode === "raw"
                  ? "bg-amber-300 text-zinc-950 shadow"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              Apenas Impressão 3D (Crua)
            </button>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-zinc-900/60 border border-white/10 rounded-2xl p-4 mb-10 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
            {[
              { id: "todos", label: "Todas as Obras (6)" },
              { id: "fantasy", label: "Dark Fantasy & RPG" },
              { id: "cyberpunk", label: "Cyberpunk & Sci-Fi" },
              { id: "bustos", label: "Bustos 1/6 & 1/10" },
              { id: "keycaps", label: "Artisan Keycaps" },
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  soundRef.current?.playSwitch();
                  setActiveCategory(cat.id as GalleryCategory);
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all ${
                  activeCategory === cat.id
                    ? "bg-fuchsia-500 text-zinc-950 shadow-[0_0_15px_rgba(217,70,239,0.4)]"
                    : "bg-zinc-950 text-zinc-400 hover:text-white border border-white/10"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-64">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar técnica (NMM, OSL, Keycap)..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-zinc-950 border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-fuchsia-400"
            />
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {filteredGallery.map((work) => {
            const displayPrice =
              viewPriceMode === "painted" ? work.pricePainted : work.priceRaw;

            return (
              <motion.div
                layout
                key={work.id}
                onClick={() => {
                  soundRef.current?.playAirbrushSpray();
                  setLightboxWork(work);
                }}
                className="group cursor-pointer rounded-3xl bg-[#110C1D]/70 border border-white/10 hover:border-fuchsia-400/60 overflow-hidden flex flex-col justify-between transition-all hover:shadow-[0_15px_50px_rgba(217,70,239,0.15)]"
              >
                <div>
                  <div className="relative h-64 w-full overflow-hidden bg-zinc-950">
                    <Image
                      src={work.image}
                      alt={work.title}
                      fill
                      unoptimized
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B0812] via-transparent to-black/30" />

                    <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between">
                      <span className="px-3 py-1 rounded-lg bg-fuchsia-500 text-zinc-950 font-mono text-[10px] font-black uppercase tracking-wider shadow">
                        {work.badge}
                      </span>
                      <span className="px-2.5 py-1 rounded-lg bg-zinc-950/85 backdrop-blur-md border border-white/15 font-mono text-[10px] text-amber-300">
                        {work.scale}
                      </span>
                    </div>

                    {/* Paint Swatches Bar on Card Bottom */}
                    <div className="absolute bottom-3 left-3.5 right-3.5 flex items-center justify-between">
                      <div className="flex items-center -space-x-1.5">
                        {work.paintsUsed.map((sw, idx) => (
                          <span
                            key={idx}
                            title={sw.name}
                            className="w-5 h-5 rounded-full border border-zinc-950 shadow"
                            style={{ backgroundColor: sw.hex }}
                          />
                        ))}
                      </div>
                      <span className="font-mono text-[10px] text-zinc-300 bg-black/60 px-2 py-0.5 rounded">
                        {work.layerHeight}
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-fuchsia-400 block mb-1">
                      {work.characterClass} • {work.paintHours}
                    </span>
                    <h3 className="text-xl font-black text-white uppercase tracking-tight mb-2 group-hover:text-fuchsia-300 transition-colors">
                      {work.title}
                    </h3>
                    <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed mb-4">
                      {work.story}
                    </p>

                    <div className="flex flex-wrap gap-1.5">
                      {work.techniques.map((tech, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded bg-zinc-950/90 border border-white/10 font-mono text-[10px] text-zinc-300"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="px-6 pb-6 pt-4 border-t border-white/10 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-zinc-400 block">
                      {viewPriceMode === "painted"
                        ? "Obra Pintada Master"
                        : "Apenas Resina 12K Curada"}
                    </span>
                    <span className="text-xl font-black text-white">
                      R$ {displayPrice.toFixed(2)}
                    </span>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-zinc-800 group-hover:bg-fuchsia-500 group-hover:text-zinc-950 text-white flex items-center justify-center transition-colors">
                    <ZoomIn className="w-5 h-5" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ==========================================
          5. SIMULADOR DE ENCOMENDAS (CUSTOM FORGE STUDIO)
      ========================================== */}
      <section
        id="forja"
        className="py-24 bg-[#0B0812] border-y border-white/10 scroll-mt-20"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-[2.5rem] bg-gradient-to-br from-[#150E24] via-[#0D0916] to-[#08060C] border border-fuchsia-500/35 p-6 sm:p-10 lg:p-12 shadow-[0_0_90px_rgba(217,70,239,0.1)]">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8 mb-10 border-b border-white/10">
              <div>
                <span className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-amber-300 mb-2">
                  <Wand2 className="w-4 h-4" /> 03. Custom Commission Calculator
                </span>
                <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-white">
                  Forje sua <span className="text-fuchsia-400 italic">Miniatura Sob Medida</span>
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-zinc-300 max-w-md">
                Você pode nos enviar seu próprio arquivo `.STL` (Loot Studios, Archvillain,
                Nomnom, HeroForge) ou escolher uma escultura do nosso catálogo licenciado.
              </p>
            </div>

            <form onSubmit={handleSendForgeQuote} className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
              {/* Left 7 Cols: Configuration Steps */}
              <div className="lg:col-span-7 space-y-6">
                {/* 1. Escala */}
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-fuchsia-300 font-bold mb-3">
                    01. Escala & Porte da Peça
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {SCALE_OPTIONS.map((sc) => (
                      <button
                        key={sc.id}
                        type="button"
                        onClick={() => {
                          soundRef.current?.playSwitch();
                          setSelectedScale(sc);
                        }}
                        className={`p-3.5 rounded-xl border text-left transition-all ${
                          selectedScale.id === sc.id
                            ? "bg-fuchsia-500/20 border-fuchsia-400 text-white shadow-[0_0_20px_rgba(217,70,239,0.2)]"
                            : "bg-zinc-950/70 border-white/10 text-zinc-400 hover:text-white"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black uppercase">{sc.label}</span>
                          <span className="font-mono text-xs text-amber-300">
                            Base R$ {sc.basePrice}
                          </span>
                        </div>
                        <span className="font-mono text-[10px] text-zinc-500 block mt-1">
                          Prazo médio: {sc.time}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Composto de Resina */}
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-fuchsia-300 font-bold mb-3">
                    02. Composto Químico da Resina
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {RESIN_OPTIONS.map((res) => (
                      <button
                        key={res.id}
                        type="button"
                        onClick={() => {
                          soundRef.current?.playUvCurePulse();
                          setSelectedResin(res);
                        }}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          selectedResin.id === res.id
                            ? "bg-indigo-500/20 border-indigo-400 text-white"
                            : "bg-zinc-950/70 border-white/10 text-zinc-400 hover:text-white"
                        }`}
                      >
                        <span className="text-xs font-bold block leading-snug">{res.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. Nível de Pintura */}
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-fuchsia-300 font-bold mb-3">
                    03. Nível de Acabamento & Pintura Artística
                  </label>
                  <div className="space-y-2.5">
                    {FINISH_TIERS.map((tier) => (
                      <button
                        key={tier.id}
                        type="button"
                        onClick={() => {
                          soundRef.current?.playAirbrushSpray();
                          setSelectedFinish(tier);
                        }}
                        className={`w-full p-4 rounded-2xl border text-left transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${
                          selectedFinish.id === tier.id
                            ? "bg-gradient-to-r from-fuchsia-500/20 to-indigo-500/15 border-fuchsia-400 text-white"
                            : "bg-zinc-950/70 border-white/10 text-zinc-400 hover:text-white"
                        }`}
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-black text-white uppercase">
                              {tier.label}
                            </span>
                            <span className="px-2 py-0.5 rounded bg-amber-400/15 border border-amber-300/30 font-mono text-[9px] text-amber-300 uppercase">
                              {tier.badge}
                            </span>
                          </div>
                          <p className="text-[11px] text-zinc-400 mt-1">{tier.desc}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 4. Base Cenográfica & Link STL */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono uppercase text-zinc-300 font-bold mb-2">
                      04. Diorama / Base Cenográfica
                    </label>
                    <select
                      value={selectedBase.id}
                      onChange={(e) => {
                        const found = BASE_STYLES.find((b) => b.id === e.target.value);
                        if (found) setSelectedBase(found);
                      }}
                      className="w-full px-3.5 py-3 rounded-xl bg-zinc-950 border border-white/15 text-xs text-white focus:outline-none focus:border-fuchsia-400"
                    >
                      {BASE_STYLES.map((b) => (
                        <option key={b.id} value={b.id}>
                          {b.label} (+ R$ {b.addPrice})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase text-zinc-300 font-bold mb-2">
                      05. Qual o Personagem ou Link STL?
                    </label>
                    <input
                      type="text"
                      value={customModelNote}
                      onChange={(e) => setCustomModelNote(e.target.value)}
                      placeholder="Ex: Malenia 1/8, Personagem D&D..."
                      className="w-full px-3.5 py-3 rounded-xl bg-zinc-950 border border-white/15 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-fuchsia-400"
                    />
                  </div>
                </div>
              </div>

              {/* Right 5 Cols: Live Order Summary Ticket */}
              <div className="lg:col-span-5 rounded-3xl bg-zinc-950 border border-fuchsia-500/30 p-6 sm:p-8 space-y-6 sticky top-28 shadow-2xl">
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                  <div>
                    <span className="font-mono text-[10px] uppercase tracking-widest text-fuchsia-400 block">
                      FICHA TÉCNICA DE BANCADA
                    </span>
                    <h3 className="text-lg font-black uppercase text-white">
                      Resumo da Encomenda
                    </h3>
                  </div>
                  <Palette className="w-6 h-6 text-amber-300" />
                </div>

                <div className="space-y-3 text-xs font-mono">
                  <div className="flex justify-between text-zinc-400">
                    <span>Escala Selecionada</span>
                    <span className="text-white font-bold">{selectedScale.label}</span>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>Resina</span>
                    <span className="text-fuchsia-300 font-bold">
                      {selectedResin.label.split("(")[0]}
                    </span>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>Acabamento</span>
                    <span className="text-amber-300 font-bold">{selectedFinish.badge}</span>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>Base / Diorama</span>
                    <span className="text-white">+ R$ {selectedBase.addPrice},00</span>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-gradient-to-br from-fuchsia-500/15 via-purple-900/20 to-zinc-950 border border-fuchsia-400/40">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-amber-300 block mb-1">
                    INVESTIMENTO ESTIMADO DO PROJETO
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-black text-white tracking-tight">
                      R$ {estimatedTotal}
                    </span>
                    <span className="text-xs font-mono text-zinc-400">
                      (ou em até 6x sem juros)
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-fuchsia-600 via-purple-600 to-indigo-600 hover:from-fuchsia-500 hover:to-indigo-500 text-white font-black uppercase tracking-wider text-xs flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(217,70,239,0.4)] transition-all"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Enviar Projeto p/ o Artista no WhatsApp</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* ==========================================
          6. ESPECIFICAÇÕES TÉCNICAS DO LABORATÓRIO
      ========================================== */}
      <section id="tecnologia" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: Cpu,
              badge: "PRECISÃO ÓPTICA 12K",
              title: "Impressão MSLA Sem Marcas",
              desc: "Tanques calibrados com filme ACF e exposição em mícrons para preservar poros de pele, costuras de roupas e runas milimétricas.",
            },
            {
              icon: Flame,
              badge: "PIGMENTOS EUROPEUS",
              title: "Tintas Acrílicas de Alta Densidade",
              desc: "Trabalhamos exclusivamente com Vallejo Model/Game Color, AK Interactive 3rd Gen, Scale75 e vernizes com filtro UV anti-amarelamento.",
            },
            {
              icon: ShieldCheck,
              badge: "EMBALAGEM BLINDADA",
              title: "Envio Seguro c/ Espuma Cortada",
              desc: "Cada miniatura viaja suspensa em berço de espuma de célula fechada sob medida, garantindo que lanças, asas e espadas cheguem intactas.",
            },
          ].map((card, i) => {
            const Icon = card.icon;
            return (
              <div
                key={i}
                className="p-8 rounded-3xl bg-[#110C1D]/50 border border-white/10 hover:border-fuchsia-500/40 transition-all flex flex-col justify-between"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-fuchsia-500/10 border border-fuchsia-500/30 flex items-center justify-center text-fuchsia-400">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-amber-300">
                    {card.badge}
                  </span>
                </div>
                <div>
                  <h3 className="text-xl font-black uppercase text-white mb-2">{card.title}</h3>
                  <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">{card.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ==========================================
          7. FOOTER & CONTATO DIRETO
      ========================================== */}
      <footer id="contato" className="bg-[#050308] border-t border-white/10 py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-fuchsia-500/15 border border-fuchsia-500/30 flex items-center justify-center text-fuchsia-400">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <span className="text-sm font-black tracking-wider text-white block">
                ALCHEMIST<span className="text-fuchsia-400">.VOXEL</span>
              </span>
              <span className="text-[10px] font-mono text-zinc-500">
                Low Poly Comfort • High Detail Resin Art
              </span>
            </div>
          </div>

          <p className="text-[11px] font-mono text-zinc-500">
            © {CURRENT_YEAR} ALCHEMIST VOXEL STUDIO • POWERED BY{" "}
            <strong className="text-fuchsia-400">FOCUSPULSE</strong>
          </p>
        </div>
      </footer>

      {/* ==========================================
          MODAL LIGHTBOX DE INSPEÇÃO & RECEITA DE TINTAS
      ========================================== */}
      <AnimatePresence>
        {lightboxWork && (
          <div
            onClick={() => setLightboxWork(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 15 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[#0D0916] border border-fuchsia-500/40 shadow-2xl no-scrollbar"
            >
              <div className="relative h-72 sm:h-80 w-full">
                <Image
                  src={lightboxWork.image}
                  alt={lightboxWork.title}
                  fill
                  unoptimized
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0D0916] via-transparent to-black/30" />
                <button
                  type="button"
                  onClick={() => setLightboxWork(null)}
                  className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/80 border border-white/15 text-white flex items-center justify-center hover:bg-fuchsia-500 hover:text-zinc-950 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 sm:p-8 space-y-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <span className="font-mono text-xs uppercase text-fuchsia-400">
                      {lightboxWork.characterClass} • {lightboxWork.scale}
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-black text-white uppercase">
                      {lightboxWork.title}
                    </h3>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-mono text-zinc-400 block">
                      PINTADA MASTER / CRUA
                    </span>
                    <span className="text-xl font-black text-amber-300">
                      R$ {lightboxWork.pricePainted} / R$ {lightboxWork.priceRaw}
                    </span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                  {lightboxWork.story}
                </p>

                {/* Paint Swatches Recipe */}
                <div className="p-4 rounded-2xl bg-zinc-950 border border-white/10">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-amber-300 block mb-3">
                    // PALETA DE PIGMENTOS USADOS NESTA OBRA
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {lightboxWork.paintsUsed.map((sw, i) => (
                      <div
                        key={i}
                        className="p-2.5 rounded-xl bg-zinc-900 border border-white/10 flex items-center gap-2.5"
                      >
                        <span
                          className="w-5 h-5 rounded-full shrink-0 border border-white/30"
                          style={{ backgroundColor: sw.hex }}
                        />
                        <span className="text-xs font-bold text-white truncate">
                          {sw.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <a
                    href="#forja"
                    onClick={() => {
                      setCustomModelNote(lightboxWork.title);
                      setLightboxWork(null);
                    }}
                    className="flex-1 py-4 rounded-xl bg-gradient-to-r from-fuchsia-600 to-indigo-600 text-white font-black uppercase tracking-wider text-xs text-center"
                  >
                    Encomendar Esta Peça na Forja
                  </a>
                  <button
                    type="button"
                    onClick={() => setLightboxWork(null)}
                    className="py-4 px-6 rounded-xl bg-zinc-900 border border-white/10 text-zinc-300 font-bold text-xs uppercase"
                  >
                    Fechar
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}