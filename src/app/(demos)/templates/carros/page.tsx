"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Gauge,
  Zap,
  ShieldCheck,
  Calendar,
  Clock,
  Search,
  SlidersHorizontal,
  ArrowUpRight,
  MessageCircle,
  Volume2,
  VolumeX,
  CheckCircle2,
  Sparkles,
  Car,
  Fuel,
  Award,
  MapPin,
  Phone,
  X,
  ChevronRight,
  Calculator,
  KeyRound,
  LogIn,
  AlertTriangle,
  Menu,
} from "lucide-react";
import { onAuthStateChanged, signInWithPopup, User } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase/client";
import { bookAppointment } from "@/app/actions/bookAppointment";
import { trackMetaEvent } from "@/components/MetaPixel";

// ==========================================
// CONFIGURAÇÕES GERAIS
// ==========================================
const WHATSAPP_NUMBER = "5511999999999";
const CURRENT_YEAR = new Date().getFullYear();

// ==========================================
// WEB AUDIO SYNTHESIZER (COCKPIT & ENGINE REV)
// ==========================================
class AutomotiveSoundEngine {
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

  playCockpitClick() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(920, now);
    osc.frequency.exponentialRampToValueAtTime(240, now + 0.035);
    gain.gain.setValueAtTime(0.1, now);
    gain.gain.linearRampToValueAtTime(0.005, now + 0.035);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.04);
  }

  // Simula o som de partida e giro do motor (Combustão vs Elétrico)
  playEngineRev(type: "combustion" | "electric" = "combustion") {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    if (type === "electric") {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.55);
      osc.frequency.exponentialRampToValueAtTime(320, now + 0.85);
      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.14, now + 0.4);
      gain.gain.exponentialRampToValueAtTime(0.005, now + 0.88);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.9);
      return;
    }

    // Ronco grave sintetizado com dois osciladores defasados (V8 / Flat-6)
    [65, 98].forEach((baseFreq) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(baseFreq, now);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 2.9, now + 0.38);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.3, now + 0.82);

      gain.gain.setValueAtTime(0.02, now);
      gain.gain.linearRampToValueAtTime(0.11, now + 0.25);
      gain.gain.exponentialRampToValueAtTime(0.004, now + 0.85);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.86);
    });
  }

  playLockChime() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    [587.33, 880, 1174.66].forEach((freq, i) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now + i * 0.075);
      gain.gain.setValueAtTime(0.12, now + i * 0.075);
      gain.gain.exponentialRampToValueAtTime(0.004, now + i * 0.075 + 0.3);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + i * 0.075);
      osc.stop(now + i * 0.075 + 0.32);
    });
  }
}

// ==========================================
// CATÁLOGO DO ACERVO AUTOMOTIVO
// ==========================================
type VehicleCategory = "todos" | "superesportivos" | "suv-blindados" | "eletricos" | "sedans";

interface Vehicle {
  id: string;
  brand: string;
  model: string;
  year: string;
  price: number;
  category: VehicleCategory;
  soundProfile: "combustion" | "electric";
  image: string;
  km: string;
  power: string;
  zeroToHundred: string;
  topSpeed: string;
  transmission: string;
  drivetrain: string;
  exteriorColor: string;
  interiorSpec: string;
  armored: boolean;
  badge?: string;
  highlights: string[];
}

const INVENTORY: Vehicle[] = [
  {
    id: "car-01",
    brand: "PORSCHE",
    model: "911 GT3 RS (992) Weissach",
    year: "2025/2026",
    price: 2890000,
    category: "superesportivos",
    soundProfile: "combustion",
    image: "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=1200&q=85",
    km: "1.150 km",
    power: "525 cv",
    zeroToHundred: "3.2 s",
    topSpeed: "296 km/h",
    transmission: "PDK 7 Marchas",
    drivetrain: "Tração Traseira",
    exteriorColor: "GT Silver Metallic",
    interiorSpec: "Alcântara Preta & Carbono",
    armored: false,
    badge: "Pacote Weissach",
    highlights: [
      "Aerodinâmica ativa DRS de pista",
      "Freios de Compósito Cerâmico (PCCB)",
      "Bancos concha inteiriços em fibra de carbono",
      "Sistema de elevação do eixo dianteiro (Front Lift)",
    ],
  },
  {
    id: "car-02",
    brand: "MERCEDES-AMG",
    model: "G 63 Magno Edition (Blindado III-A)",
    year: "2025/2025",
    price: 2350000,
    category: "suv-blindados",
    soundProfile: "combustion",
    image: "https://images.unsplash.com/photo-1520031441872-265e4ff70366?auto=format&fit=crop&w=1200&q=85",
    km: "4.800 km",
    power: "585 cv",
    zeroToHundred: "4.5 s",
    topSpeed: "240 km/h",
    transmission: "AMG Speedshift 9G",
    drivetrain: "4MATIC Integral",
    exteriorColor: "Night Black Magno (Fosco)",
    interiorSpec: "Couro Nappa Vermelho Classic",
    armored: true,
    badge: "Blindado Nível III-A",
    highlights: [
      "Blindagem certificada com vidros AGP B33 ultra-leves",
      "Motor V8 4.0 Biturbo montado à mão (One Man, One Engine)",
      "Escapamento lateral AMG Performance com válvula ativa",
      "Som Burmester High-End 3D Surround",
    ],
  },
  {
    id: "car-03",
    brand: "AUDI",
    model: "RS e-tron GT Performance",
    year: "2026/2026",
    price: 1120000,
    category: "eletricos",
    soundProfile: "electric",
    image: "https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1200&q=85",
    km: "0 km",
    power: "646 cv",
    zeroToHundred: "3.1 s",
    topSpeed: "250 km/h",
    transmission: "2 Velocidades EV",
    drivetrain: "Quattro Elétrico",
    exteriorColor: "Daytona Grey Pearl",
    interiorSpec: "Couro Valcona Honeycomb",
    armored: false,
    badge: "100% Elétrico • 0 KM",
    highlights: [
      "Arquitetura de 800V (recarga de 5% a 80% em 22 minutos)",
      "Teto panorâmico em polímero reforçado com carbono",
      "Eixo traseiro direcional e suspensão pneumática adaptativa",
      "Faróis Matrix LED com tecnologia Laserlight",
    ],
  },
  {
    id: "car-04",
    brand: "BMW",
    model: "M3 Competition Track Package",
    year: "2025/2026",
    price: 849000,
    category: "sedans",
    soundProfile: "combustion",
    image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=85",
    km: "3.200 km",
    power: "510 cv",
    zeroToHundred: "3.9 s",
    topSpeed: "290 km/h",
    transmission: "M Steptronic 8V",
    drivetrain: "Traseira c/ M Drift Analyzer",
    exteriorColor: "Brooklyn Grey",
    interiorSpec: "Concha Carbono Kyalami Orange",
    armored: false,
    badge: "Pacote M Carbon",
    highlights: [
      "Bancos M Carbon Bucket com estrutura aparente",
      "Freios M Carbono-Cerâmica com pinças douradas",
      "Painel BMW Curved Display com telemetria M Setup",
      "Garantia de fábrica vigente e PPF Full frontal aplicado",
    ],
  },
  {
    id: "car-05",
    brand: "LAMBORGHINI",
    model: "Urus Performante V8",
    year: "2024/2025",
    price: 3690000,
    category: "suv-blindados",
    soundProfile: "combustion",
    image: "https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&w=1200&q=85",
    km: "2.400 km",
    power: "666 cv",
    zeroToHundred: "3.3 s",
    topSpeed: "306 km/h",
    transmission: "Automática 8 Marchas",
    drivetrain: "AWD c/ Diferencial Torsen",
    exteriorColor: "Giallo Auge",
    interiorSpec: "Alcântara Nero Cosmus",
    armored: false,
    badge: "Escape Akrapovič Titânio",
    highlights: [
      "Sistema de exaustão original Akrapovič em titânio de série",
      "Capô e teto em fibra de carbono visível",
      "Modo de condução exclusivo RALLY para baixa aderência",
      "Rodas Pelope 23 polegadas com parafusos em titânio",
    ],
  },
  {
    id: "car-06",
    brand: "PORSCHE",
    model: "Taycan Turbo S Cross Turismo",
    year: "2025/2025",
    price: 1190000,
    category: "eletricos",
    soundProfile: "electric",
    image: "https://images.unsplash.com/photo-1619767886558-efdc259cde1a?auto=format&fit=crop&w=1200&q=85",
    km: "5.900 km",
    power: "761 cv",
    zeroToHundred: "2.9 s",
    topSpeed: "250 km/h",
    transmission: "2 Velocidades EV",
    drivetrain: "AWD Overboost",
    exteriorColor: "Chalk (Giz)",
    interiorSpec: "Couro Olea Club Basalt Black",
    armored: true,
    badge: "Blindado • 761 cv",
    highlights: [
      "Launch Control com 761 cv e 107 kgfm de torque instantâneo",
      "Blindagem ultra-leve nível III-A sem perda dinâmica",
      "Tela dedicada para o passageiro dianteiro + Sport Chrono",
      "Suspensão ativa PASM com modo Gravel integrado",
    ],
  },
];

const CATEGORIES: { id: VehicleCategory; label: string }[] = [
  { id: "todos", label: "Acervo Completo (6)" },
  { id: "superesportivos", label: "Superesportivos" },
  { id: "suv-blindados", label: "SUVs & Blindados" },
  { id: "eletricos", label: "Hyper EVs" },
  { id: "sedans", label: "Sedans de Pista" },
];

const TEST_DRIVE_SLOTS = ["10:00", "11:30", "14:30", "16:00", "18:00"];

const formatBRL = (val: number) =>
  val.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  });

export default function CarDealershipPage() {
  const soundRef = useRef<AutomotiveSoundEngine | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Filtros do Showroom
  const [activeCategory, setActiveCategory] = useState<VehicleCategory>("todos");
  const [searchQuery, setSearchQuery] = useState("");
  const [onlyArmored, setOnlyArmored] = useState(false);
  const [selectedVehicleModal, setSelectedVehicleModal] = useState<Vehicle | null>(null);
  const [revvingId, setRevvingId] = useState<string | null>(null);

  // Simulador Financeiro & Trade-In
  const [simVehicle, setSimVehicle] = useState<Vehicle>(INVENTORY[3]); // Default BMW M3
  const [downPaymentPct, setDownPaymentPct] = useState<number>(40);
  const [months, setMonths] = useState<number>(36);
  const [tradeInModel, setTradeInModel] = useState("");
  const [tradeInValue, setTradeInValue] = useState<number>(0);

  // Agendamento de Test Drive VIP (Firebase Atomic Lock)
  const [user, setUser] = useState<User | null>(null);
  const [tdVehicle, setTdVehicle] = useState<Vehicle>(INVENTORY[0]);
  const [tdDate, setTdDate] = useState("");
  const [tdMinDate, setTdMinDate] = useState("");
  const [tdSlot, setTdSlot] = useState<string>("14:30");
  const [tdMode, setTdMode] = useState<"SHOWROOM" | "DELIVERY">("SHOWROOM");
  const [tdStatus, setTdStatus] = useState<"IDLE" | "LOADING" | "SUCCESS" | "ERROR">("IDLE");
  const [tdFeedback, setTdFeedback] = useState("");
  const [tdProtocol, setTdProtocol] = useState<string | null>(null);

  useEffect(() => {
    soundRef.current = new AutomotiveSoundEngine();
    const unsub = onAuthStateChanged(auth, setUser);
    const frameId = requestAnimationFrame(() => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const formatted = [
        tomorrow.getFullYear(),
        String(tomorrow.getMonth() + 1).padStart(2, "0"),
        String(tomorrow.getDate()).padStart(2, "0"),
      ].join("-");
      setTdDate(formatted);
      setTdMinDate(formatted);
    });

    return () => {
      unsub();
      cancelAnimationFrame(frameId);
    };
  }, []);

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    if (soundRef.current) {
      soundRef.current.enabled = next;
      if (next) soundRef.current.playCockpitClick();
    }
  };

  const handleEngineRev = (vehicle: Vehicle, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    soundRef.current?.playEngineRev(vehicle.soundProfile);
    setRevvingId(vehicle.id);
    setTimeout(() => {
      setRevvingId((prev) => (prev === vehicle.id ? null : prev));
    }, 900);
  };

  // Filtragem de estoque
  const filteredVehicles = useMemo(() => {
    return INVENTORY.filter((car) => {
      const matchCat = activeCategory === "todos" || car.category === activeCategory;
      const matchSearch =
        car.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        car.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
        car.exteriorColor.toLowerCase().includes(searchQuery.toLowerCase());
      const matchArmor = !onlyArmored || car.armored;
      return matchCat && matchSearch && matchArmor;
    });
  }, [activeCategory, searchQuery, onlyArmored]);

  // Cálculos do Simulador Financeiro
  const downPaymentAmount = Math.round((simVehicle.price * downPaymentPct) / 100);
  const financedPrincipal = Math.max(0, simVehicle.price - downPaymentAmount - tradeInValue);
  const monthlyRate = 0.0119; // Taxa Private Bank 1.19% a.m.
  const monthlyInstallment = useMemo(() => {
    if (financedPrincipal <= 0) return 0;
    const factor =
      (monthlyRate * Math.pow(1 + monthlyRate, months)) /
      (Math.pow(1 + monthlyRate, months) - 1);
    return Math.round(financedPrincipal * factor);
  }, [financedPrincipal, months]);

  const handleSendFinancingWhatsApp = () => {
    soundRef.current?.playLockChime();
    trackMetaEvent("InitiateCheckout", {
      content_name: `Simulação ${simVehicle.brand} ${simVehicle.model}`,
      value: simVehicle.price,
      currency: "BRL",
    });
    trackMetaEvent("Lead", {
      content_name: "Proposta Financiamento / Trade-In Aether Motors",
      value: simVehicle.price,
      currency: "BRL",
    });

    const msg = `*PROPOSTA DE COMPRA / TRADE-IN — AETHER MOTORS* 🏎️✨\n----------------------------------\n*Veículo:* ${
      simVehicle.brand
    } ${simVehicle.model} (${simVehicle.year})\n*Valor de Tabela:* ${formatBRL(
      simVehicle.price
    )}\n----------------------------------\n*Entrada (${downPaymentPct}%):* ${formatBRL(
      downPaymentAmount
    )}\n${
      tradeInModel
        ? `*Veículo na Troca:* ${tradeInModel} (Avaliação est.: ${formatBRL(tradeInValue)})\n`
        : ""
    }*Saldo Financiado:* ${formatBRL(
      financedPrincipal
    )}\n*Plano Escolhido:* ${months}x de *${formatBRL(
      monthlyInstallment
    )}*\n----------------------------------\n_Solicito análise de crédito Private e avaliação presencial._`;

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  // Handlers de Autenticação e Agendamento de Test Drive VIP
  const handleGoogleLogin = async () => {
    soundRef.current?.playCockpitClick();
    setTdStatus("LOADING");
    try {
      await signInWithPopup(auth, googleProvider);
      soundRef.current?.playLockChime();
      setTdStatus("IDLE");
      setTdFeedback("");
    } catch {
      setTdStatus("ERROR");
      setTdFeedback("Não foi possível autenticar com o Google.");
    }
  };

  const handleConfirmTestDrive = async () => {
    if (!user) {
      setTdStatus("ERROR");
      setTdFeedback("Autentique-se com Google para bloquear o veículo e o Concierge.");
      return;
    }

    soundRef.current?.playCockpitClick();
    setTdStatus("LOADING");

    try {
      const token = await user.getIdToken();
      const serviceSummary = `TEST DRIVE ${tdMode} • ${tdVehicle.brand} ${tdVehicle.model}`;

      const res = await bookAppointment(
        {
          date: tdDate,
          timeSlot: tdSlot,
          serviceName: serviceSummary,
        },
        token
      );

      if (res.success) {
        soundRef.current?.playLockChime();
        const code = res.bookingId?.slice(-6).toUpperCase() || "AET992";
        setTdProtocol(code);
        setTdStatus("SUCCESS");
        setTdFeedback(
          `Experiência reservada para ${tdDate} às ${tdSlot} • Protocolo #${code}`
        );

        trackMetaEvent("Schedule", {
          content_name: serviceSummary,
          value: tdVehicle.price,
          currency: "BRL",
        });
      } else {
        setTdStatus("ERROR");
        setTdFeedback(res.error || "Horário indisponível para este chassi.");
      }
    } catch {
      setTdStatus("ERROR");
      setTdFeedback("Falha de conexão com o servidor de reservas.");
    }
  };

  return (
    <div className="min-h-screen bg-[#07080A] text-zinc-100 selection:bg-[#D4AF37] selection:text-zinc-950 font-sans antialiased overflow-x-hidden">
      {/* ==========================================
          1. FLOATING METALLIC NAVBAR
      ========================================== */}
      <header className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 pt-4 pointer-events-none">
        <div className="max-w-7xl mx-auto bg-[#0B0C0E]/85 backdrop-blur-xl border border-zinc-800/90 rounded-2xl px-4 sm:px-6 py-3.5 shadow-[0_20px_50px_rgba(0,0,0,0.75)] pointer-events-auto flex items-center justify-between gap-4">
          <a href="#" className="flex items-center gap-3.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#D4AF37] via-amber-200 to-amber-600 p-[1px]">
              <div className="w-full h-full bg-[#090A0C] rounded-[11px] flex items-center justify-center">
                <Gauge className="w-5 h-5 text-[#D4AF37]" />
              </div>
            </div>
            <div>
              <span className="text-lg font-black tracking-[0.14em] text-white block leading-none">
                AETHER<span className="text-[#D4AF37]">.MOTORS</span>
              </span>
              <span className="text-[9px] font-mono uppercase tracking-[0.25em] text-zinc-500">
                Bespoke & Armored Showroom
              </span>
            </div>
          </a>

          <nav className="hidden lg:flex items-center gap-1 bg-zinc-900/70 border border-zinc-800 rounded-xl p-1">
            {[
              { label: "Acervo Disponível", href: "#acervo" },
              { label: "Simulador & Trade-In", href: "#simulador" },
              { label: "Test Drive VIP", href: "#test-drive" },
              { label: "Blindagem & Garantia", href: "#diferenciais" },
              { label: "Contato", href: "#contato" },
            ].map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => soundRef.current?.playCockpitClick()}
                className="px-3.5 py-1.5 rounded-lg text-xs font-medium text-zinc-400 hover:text-white hover:bg-zinc-800/70 transition-all"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={toggleSound}
              title="Áudio de Cockpit & Ronco dos Motores"
              className={`p-2.5 rounded-xl border transition-all ${
                soundEnabled
                  ? "bg-[#D4AF37]/15 border-[#D4AF37]/40 text-[#D4AF37]"
                  : "bg-zinc-900 border-zinc-800 text-zinc-500"
              }`}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            <a
              href="#test-drive"
              onClick={() => soundRef.current?.playCockpitClick()}
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-amber-500 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-black text-xs uppercase tracking-wider transition-all shadow-[0_0_25px_rgba(212,175,55,0.3)]"
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>Agendar Experiência</span>
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

        {/* Mobile Nav Dropdown */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="lg:hidden max-w-7xl mx-auto mt-2 bg-[#0B0C0E]/95 backdrop-blur-xl border border-zinc-800 rounded-2xl p-4 pointer-events-auto flex flex-col gap-2"
            >
              {[
                { label: "Acervo Disponível", href: "#acervo" },
                { label: "Simulador Financeiro & Troca", href: "#simulador" },
                { label: "Agendar Test Drive VIP", href: "#test-drive" },
                { label: "Blindagem & Certificação", href: "#diferenciais" },
                { label: "Falar com Concierge", href: "#contato" },
              ].map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-sm font-semibold text-zinc-300 hover:bg-zinc-900 hover:text-[#D4AF37]"
                >
                  {item.label}
                </a>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ==========================================
          2. HERO SECTION (COCKPIT TELEMETRY + FLAGSHIP)
      ========================================== */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden border-b border-zinc-900">
        {/* Metallic Grid Overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
            backgroundSize: "56px 56px",
          }}
        />
        <div className="absolute top-1/4 left-1/4 w-[550px] h-[550px] bg-[#D4AF37]/10 rounded-full blur-[160px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column (7 Cols) */}
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-zinc-900/90 border border-zinc-800 mb-6">
                <span className="px-2 py-0.5 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] font-mono text-[10px] font-bold uppercase">
                  PRIVATE COLLECTION 2026
                </span>
                <span className="text-xs text-zinc-300 font-medium">
                  Curadoria de Superesportivos & Blindados Certificados
                </span>
              </div>

              <h1 className="text-4xl sm:text-6xl xl:text-7xl font-black uppercase tracking-tighter leading-[0.94] text-white mb-6">
                Engenharia que <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-amber-200 to-zinc-400 italic">
                  domina o asfalto.
                </span>
              </h1>

              <p className="text-zinc-400 text-base sm:text-lg max-w-xl leading-relaxed mb-8 border-l-2 border-[#D4AF37]/60 pl-5">
                Cada veículo do nosso acervo passa por perícia cautelar de 240 pontos, leitura
                eletrônica de telemetria de pista e certificação balística nível III-A. Pronta
                entrega imediata em todo o território nacional.
              </p>

              <div className="flex flex-wrap items-center gap-4">
                <a
                  href="#acervo"
                  onClick={() => soundRef.current?.playCockpitClick()}
                  className="px-8 py-4 rounded-2xl bg-gradient-to-r from-[#D4AF37] via-amber-300 to-[#D4AF37] text-zinc-950 font-black uppercase tracking-wider text-xs sm:text-sm shadow-[0_0_40px_rgba(212,175,55,0.3)] hover:scale-[1.02] transition-all flex items-center gap-3"
                >
                  <span>Explorar Showroom (6 Unidades)</span>
                  <ChevronRight className="w-4 h-4" />
                </a>

                <button
                  type="button"
                  onClick={() => handleEngineRev(INVENTORY[0])}
                  className="px-6 py-4 rounded-2xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-200 font-mono font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2.5"
                >
                  <Volume2 className="w-4 h-4 text-[#D4AF37] animate-pulse" />
                  <span>Ouvir Ignição GT3 RS</span>
                </button>
              </div>

              {/* Quick Telemetry Metrics */}
              <div className="mt-12 pt-8 border-t border-zinc-800/80 grid grid-cols-3 gap-6 max-w-lg">
                <div>
                  <span className="text-[10px] font-mono text-[#D4AF37] block">// LAUDO</span>
                  <span className="text-xl sm:text-2xl font-black text-white">100% Aprovado</span>
                  <span className="text-xs text-zinc-500 block">Vistoria Dekra & Fábrica</span>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-[#D4AF37] block">// BLINDAGEM</span>
                  <span className="text-xl sm:text-2xl font-black text-white">Nível III-A</span>
                  <span className="text-xs text-zinc-500 block">Vidros Ultra-Leves AGP</span>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-[#D4AF37] block">// LOGÍSTICA</span>
                  <span className="text-xl sm:text-2xl font-black text-white">Plataforma Fechada</span>
                  <span className="text-xs text-zinc-500 block">Entrega em Todo o Brasil</span>
                </div>
              </div>
            </div>

            {/* Right Column: Flagship Showcase Card (5 Cols) */}
            <div className="lg:col-span-5">
              <div className="relative rounded-[2.5rem] overflow-hidden border border-zinc-800 bg-zinc-900 aspect-[4/4.3] group shadow-2xl">
                <Image
                  src={INVENTORY[0].image}
                  alt={INVENTORY[0].model}
                  fill
                  unoptimized
                  className="object-cover group-hover:scale-105 transition-transform duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#07080A] via-[#07080A]/25 to-transparent" />

                <div className="absolute top-5 left-5 right-5 flex items-center justify-between">
                  <span className="px-3.5 py-1.5 rounded-xl bg-zinc-950/85 backdrop-blur-md border border-[#D4AF37]/40 font-mono text-[10px] font-bold uppercase text-[#D4AF37] flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" /> DESTAQUE DO ACERVO
                  </span>
                  <span className="px-3 py-1.5 rounded-xl bg-zinc-950/85 backdrop-blur-md border border-zinc-800 font-mono text-[10px] text-zinc-300">
                    {INVENTORY[0].year} • {INVENTORY[0].km}
                  </span>
                </div>

                <div className="absolute bottom-5 left-5 right-5 p-6 rounded-3xl bg-zinc-950/90 backdrop-blur-xl border border-zinc-800/90 space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-widest text-[#D4AF37]">
                        {INVENTORY[0].brand}
                      </span>
                      <h2 className="text-xl font-black text-white uppercase tracking-tight">
                        {INVENTORY[0].model}
                      </h2>
                    </div>
                    <span className="text-lg font-black text-[#D4AF37] shrink-0">
                      {formatBRL(INVENTORY[0].price)}
                    </span>
                  </div>

                  {/* Mini Telemetry Strip */}
                  <div className="grid grid-cols-3 gap-2 py-2.5 px-3 rounded-xl bg-zinc-900/90 border border-zinc-800 font-mono text-[11px] text-center">
                    <div>
                      <span className="text-zinc-500 block text-[9px]">POTÊNCIA</span>
                      <strong className="text-white">{INVENTORY[0].power}</strong>
                    </div>
                    <div className="border-x border-zinc-800">
                      <span className="text-zinc-500 block text-[9px]">0-100 KM/H</span>
                      <strong className="text-[#D4AF37]">{INVENTORY[0].zeroToHundred}</strong>
                    </div>
                    <div>
                      <span className="text-zinc-500 block text-[9px]">VEL. MÁX</span>
                      <strong className="text-white">{INVENTORY[0].topSpeed}</strong>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      soundRef.current?.playCockpitClick();
                      setSelectedVehicleModal(INVENTORY[0]);
                    }}
                    className="w-full py-3.5 rounded-xl bg-white hover:bg-[#D4AF37] text-zinc-950 font-black uppercase tracking-wider text-xs transition-colors flex items-center justify-center gap-2"
                  >
                    <span>Inspecionar Ficha Técnica Completa</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          3. SHOWROOM INTERATIVO & FILTROS
      ========================================== */}
      <section id="acervo" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div>
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#D4AF37] block mb-2">
              // 01. SHOWROOM DISPONÍVEL
            </span>
            <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tighter text-white">
              Acervo <span className="text-[#D4AF37] italic">Selecionado</span>
            </h2>
          </div>
          <p className="text-xs font-mono uppercase tracking-widest text-zinc-500">
            CLIQUE NO ÍCONE DE ÁUDIO DE QUALQUER VEÍCULO PARA OUVIR A IGNIÇÃO
          </p>
        </div>

        {/* Filter Bar */}
        <div className="bg-zinc-900/60 border border-zinc-800/90 rounded-2xl p-4 mb-10 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 no-scrollbar">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  soundRef.current?.playCockpitClick();
                  setActiveCategory(cat.id);
                }}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all ${
                  activeCategory === cat.id
                    ? "bg-[#D4AF37] text-zinc-950 shadow-[0_0_20px_rgba(212,175,55,0.35)]"
                    : "bg-zinc-950 text-zinc-400 hover:text-white border border-zinc-800"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              type="button"
              onClick={() => {
                soundRef.current?.playCockpitClick();
                setOnlyArmored(!onlyArmored);
              }}
              className={`px-4 py-2.5 rounded-xl border text-xs font-mono font-bold uppercase flex items-center justify-center gap-2 transition-all ${
                onlyArmored
                  ? "bg-emerald-500/15 border-emerald-400 text-emerald-300"
                  : "bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white"
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Apenas Blindados</span>
            </button>

            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar marca, modelo ou cor..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#D4AF37]"
              />
            </div>
          </div>
        </div>

        {/* Vehicles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {filteredVehicles.map((car) => {
            const isRevving = revvingId === car.id;
            return (
              <motion.div
                layout
                key={car.id}
                onClick={() => {
                  soundRef.current?.playCockpitClick();
                  setSelectedVehicleModal(car);
                }}
                className="group cursor-pointer rounded-3xl bg-zinc-900/40 border border-zinc-800/90 hover:border-[#D4AF37]/60 overflow-hidden flex flex-col justify-between transition-all hover:shadow-[0_15px_50px_rgba(0,0,0,0.65)]"
              >
                <div>
                  {/* Image Container */}
                  <div className="relative h-60 w-full overflow-hidden bg-zinc-950">
                    <Image
                      src={car.image}
                      alt={`${car.brand} ${car.model}`}
                      fill
                      unoptimized
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-black/35" />

                    {/* Top Badges */}
                    <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between">
                      {car.badge ? (
                        <span className="px-3 py-1 rounded-lg bg-[#D4AF37] text-zinc-950 font-mono text-[10px] font-black uppercase tracking-wider shadow">
                          {car.badge}
                        </span>
                      ) : (
                        <span />
                      )}

                      <button
                        type="button"
                        onClick={(e) => handleEngineRev(car, e)}
                        title="Ouvir Ronco / Propulsão"
                        className={`px-2.5 py-1.5 rounded-lg backdrop-blur-md border font-mono text-[10px] font-bold uppercase flex items-center gap-1.5 transition-all ${
                          isRevving
                            ? "bg-[#D4AF37] text-zinc-950 border-[#D4AF37] scale-105"
                            : "bg-zinc-950/85 text-zinc-200 border-zinc-700 hover:border-[#D4AF37]"
                        }`}
                      >
                        <Volume2 className={`w-3.5 h-3.5 ${isRevving ? "animate-bounce" : "text-[#D4AF37]"}`} />
                        <span>{isRevving ? "ACELERANDO..." : "REV"}</span>
                      </button>
                    </div>

                    <div className="absolute bottom-3 left-3.5 right-3.5 flex items-center justify-between text-[11px] font-mono text-zinc-300">
                      <span>{car.year}</span>
                      <span>•</span>
                      <span>{car.km}</span>
                      <span>•</span>
                      <span className="text-[#D4AF37]">{car.drivetrain}</span>
                    </div>
                  </div>

                  {/* Specs Body */}
                  <div className="p-6">
                    <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#D4AF37] block mb-1">
                      {car.brand}
                    </span>
                    <h3 className="text-xl font-black text-white uppercase tracking-tight mb-4 group-hover:text-[#D4AF37] transition-colors">
                      {car.model}
                    </h3>

                    <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-zinc-950/80 border border-zinc-800/80 font-mono text-xs text-center">
                      <div>
                        <span className="text-[9px] text-zinc-500 block">POTÊNCIA</span>
                        <strong className="text-white">{car.power}</strong>
                      </div>
                      <div className="border-x border-zinc-800">
                        <span className="text-[9px] text-zinc-500 block">0-100 KM/H</span>
                        <strong className="text-[#D4AF37]">{car.zeroToHundred}</strong>
                      </div>
                      <div>
                        <span className="text-[9px] text-zinc-500 block">CÂMBIO</span>
                        <strong className="text-white truncate block px-1">
                          {car.transmission.split(" ")[0]}
                        </strong>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="px-6 pb-6 pt-4 border-t border-zinc-800/60 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-zinc-500 block">
                      Valor à Vista / Trade-In
                    </span>
                    <span className="text-xl font-black text-white">{formatBRL(car.price)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        soundRef.current?.playCockpitClick();
                        setSimVehicle(car);
                        document.getElementById("simulador")?.scrollIntoView({ behavior: "smooth" });
                      }}
                      className="px-3 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-[10px] font-mono font-bold uppercase text-zinc-200 transition-colors"
                    >
                      Simular
                    </button>
                    <div className="w-10 h-10 rounded-xl bg-zinc-800 group-hover:bg-[#D4AF37] group-hover:text-zinc-950 text-white flex items-center justify-center transition-colors">
                      <ArrowUpRight className="w-5 h-5" />
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ==========================================
          4. SIMULADOR DE FINANCIAMENTO & TRADE-IN
      ========================================== */}
      <section
        id="simulador"
        className="py-20 bg-zinc-950/80 border-y border-zinc-900 scroll-mt-20"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-[2.5rem] bg-gradient-to-br from-zinc-900 via-[#0B0C0F] to-zinc-950 border border-[#D4AF37]/30 p-6 sm:p-10 lg:p-12 shadow-[0_0_80px_rgba(212,175,55,0.07)]">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8 mb-10 border-b border-zinc-800">
              <div>
                <span className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-[#D4AF37] mb-2">
                  <Calculator className="w-4 h-4" /> 02. Aether Financial & Trade-In Desk
                </span>
                <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-white">
                  Simulador <span className="text-[#D4AF37] italic">Private Banking & Troca</span>
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-zinc-400 max-w-md">
                Configure sua entrada, inclua seu veículo atual como parte de pagamento e envie a
                estrutura diretamente para aprovação na nossa mesa de crédito.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              {/* Left 7 Cols: Controls */}
              <div className="lg:col-span-7 space-y-6">
                {/* 1. Escolha o Veículo */}
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-[#D4AF37] font-bold mb-2.5">
                    01. Veículo Desejado do Estoque
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {INVENTORY.map((v) => (
                      <button
                        key={v.id}
                        type="button"
                        onClick={() => {
                          soundRef.current?.playCockpitClick();
                          setSimVehicle(v);
                        }}
                        className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                          simVehicle.id === v.id
                            ? "bg-[#D4AF37]/15 border-[#D4AF37] text-white"
                            : "bg-zinc-950/70 border-zinc-800 text-zinc-400 hover:text-white"
                        }`}
                      >
                        <div className="truncate pr-2">
                          <span className="text-[10px] font-mono text-[#D4AF37] block">
                            {v.brand}
                          </span>
                          <span className="text-xs font-bold truncate block">{v.model}</span>
                        </div>
                        <span className="text-xs font-mono font-bold shrink-0">
                          {formatBRL(v.price)}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Slider de Entrada */}
                <div className="p-5 rounded-2xl bg-zinc-950/80 border border-zinc-800/90 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-mono uppercase text-zinc-300 font-bold">
                      02. Entrada em Recursos Próprios ({downPaymentPct}%)
                    </label>
                    <span className="text-base font-black text-[#D4AF37]">
                      {formatBRL(downPaymentAmount)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={20}
                    max={80}
                    step={5}
                    value={downPaymentPct}
                    onChange={(e) => setDownPaymentPct(Number(e.target.value))}
                    className="w-full accent-[#D4AF37] cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] font-mono text-zinc-500">
                    <span>MÍN: 20%</span>
                    <span>50%</span>
                    <span>MÁX: 80%</span>
                  </div>
                </div>

                {/* 3. Prazo & Veículo na Troca */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-5 rounded-2xl bg-zinc-950/80 border border-zinc-800/90">
                    <label className="block text-xs font-mono uppercase text-zinc-300 font-bold mb-3">
                      03. Prazo de Amortização
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {[12, 24, 36, 48].map((m) => (
                        <button
                          key={m}
                          type="button"
                          onClick={() => {
                            soundRef.current?.playCockpitClick();
                            setMonths(m);
                          }}
                          className={`py-2.5 rounded-xl font-mono text-xs font-bold border transition-all ${
                            months === m
                              ? "bg-[#D4AF37] text-zinc-950 border-[#D4AF37]"
                              : "bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white"
                          }`}
                        >
                          {m}x
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="p-5 rounded-2xl bg-zinc-950/80 border border-zinc-800/90 space-y-2.5">
                    <label className="block text-xs font-mono uppercase text-zinc-300 font-bold">
                      04. Seu Veículo na Troca (Opcional)
                    </label>
                    <input
                      type="text"
                      value={tradeInModel}
                      onChange={(e) => setTradeInModel(e.target.value)}
                      placeholder="Ex: Porsche Macan 2023..."
                      className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#D4AF37]"
                    />
                    <input
                      type="number"
                      min={0}
                      step={10000}
                      value={tradeInValue || ""}
                      onChange={(e) => setTradeInValue(Number(e.target.value) || 0)}
                      placeholder="Valor estimado (R$)"
                      className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                </div>
              </div>

              {/* Right 5 Cols: Live Financial Summary Card */}
              <div className="lg:col-span-5 rounded-3xl bg-zinc-950 border border-zinc-800 p-6 sm:p-8 space-y-6 shadow-2xl">
                <div className="flex items-center gap-4 pb-5 border-b border-zinc-800">
                  <div className="relative w-20 h-16 rounded-2xl overflow-hidden shrink-0 border border-zinc-700">
                    <Image
                      src={simVehicle.image}
                      alt={simVehicle.model}
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase text-[#D4AF37]">
                      RESUMO DA OPERAÇÃO
                    </span>
                    <h3 className="text-base font-black text-white uppercase">
                      {simVehicle.brand} {simVehicle.model}
                    </h3>
                    <span className="text-xs font-mono text-zinc-400">
                      Valor: {formatBRL(simVehicle.price)}
                    </span>
                  </div>
                </div>

                <div className="space-y-2.5 text-xs font-mono">
                  <div className="flex justify-between text-zinc-400">
                    <span>Entrada ({downPaymentPct}%)</span>
                    <span className="text-white font-bold">{formatBRL(downPaymentAmount)}</span>
                  </div>
                  {tradeInValue > 0 && (
                    <div className="flex justify-between text-emerald-400">
                      <span>Abatimento Trade-In ({tradeInModel || "Usado"})</span>
                      <span className="font-bold">- {formatBRL(tradeInValue)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-zinc-400">
                    <span>Saldo a Financiar</span>
                    <span className="text-white font-bold">{formatBRL(financedPrincipal)}</span>
                  </div>
                  <div className="flex justify-between text-zinc-500">
                    <span>Taxa Private Estimada</span>
                    <span>1,19% a.m. (CET reduzido)</span>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-gradient-to-br from-[#D4AF37]/15 via-zinc-900 to-zinc-950 border border-[#D4AF37]/40">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#D4AF37] block mb-1">
                    PARCELA MENSAL ESTIMADA ({months} MESES)
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                      {formatBRL(monthlyInstallment)}
                    </span>
                    <span className="text-xs font-mono text-zinc-400">/mês</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleSendFinancingWhatsApp}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-[#D4AF37] to-amber-500 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-black uppercase tracking-wider text-xs flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(212,175,55,0.3)] transition-all"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Enviar Proposta p/ Mesa Private</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          5. AGENDAMENTO ATÔMICO DE TEST DRIVE VIP (FIREBASE)
      ========================================== */}
      <section id="test-drive" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-20">
        <div className="rounded-[2.5rem] bg-[#0B0C0F] border border-zinc-800 p-6 sm:p-10 lg:p-12 relative overflow-hidden shadow-2xl">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-800 pb-6 mb-8">
            <div>
              <span className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-[#D4AF37] mb-1.5">
                <KeyRound className="w-3.5 h-3.5" /> 03. Firestore Atomic Lock • Concierge
              </span>
              <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-white">
                Agendar <span className="text-[#D4AF37] italic">Test Drive & Visita VIP</span>
              </h2>
            </div>

            <div className="font-mono text-[11px] bg-zinc-900 border border-zinc-800 px-4 py-2 rounded-xl text-right">
              <p className="text-zinc-400">SYNC: FIRESTORE TX</p>
              <p className="text-emerald-400 font-bold">● RESERVA EXCLUSIVA DE CHASSI</p>
            </div>
          </div>

          {/* Auth Bar */}
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-zinc-900/70 border border-zinc-800 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37]">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase text-zinc-500 block">
                  Protocolo de Segurança & Blindagem
                </span>
                <p className="text-xs sm:text-sm font-bold text-zinc-200">
                  {user
                    ? `Membro Autenticado: ${user.displayName || user.email}`
                    : "Conecte sua conta Google para bloquear um horário exclusivo com nosso piloto instrutor."}
                </p>
              </div>
            </div>

            {!user && (
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="px-4 py-2.5 rounded-xl bg-[#D4AF37] hover:bg-amber-400 text-zinc-950 font-black text-xs uppercase tracking-wider flex items-center gap-2 transition-all"
              >
                <LogIn className="w-4 h-4" /> Autenticar Google
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
            <div className="lg:col-span-5 space-y-5 bg-zinc-900/40 border border-zinc-800 rounded-2xl p-5">
              <div>
                <label className="block text-xs font-mono uppercase text-[#D4AF37] font-bold mb-2">
                  1. Modalidade da Experiência
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setTdMode("SHOWROOM")}
                    className={`p-3 rounded-xl border text-xs font-bold uppercase transition-all ${
                      tdMode === "SHOWROOM"
                        ? "bg-[#D4AF37] text-zinc-950 border-[#D4AF37]"
                        : "bg-zinc-950 border-zinc-800 text-zinc-400"
                    }`}
                  >
                    Lounge Privado
                  </button>
                  <button
                    type="button"
                    onClick={() => setTdMode("DELIVERY")}
                    className={`p-3 rounded-xl border text-xs font-bold uppercase transition-all ${
                      tdMode === "DELIVERY"
                        ? "bg-[#D4AF37] text-zinc-950 border-[#D4AF37]"
                        : "bg-zinc-950 border-zinc-800 text-zinc-400"
                    }`}
                  >
                    Delivery VIP (Em Casa)
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-[#D4AF37] font-bold mb-2">
                  2. Data Desejada
                </label>
                <input
                  type="date"
                  value={tdDate}
                  min={tdMinDate}
                  onChange={(e) => {
                    setTdDate(e.target.value);
                    setTdStatus("IDLE");
                  }}
                  className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-white font-mono text-sm focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
            </div>

            <div className="lg:col-span-7 space-y-5 bg-zinc-900/40 border border-zinc-800 rounded-2xl p-5">
              <div>
                <label className="block text-xs font-mono uppercase text-[#D4AF37] font-bold mb-2">
                  3. Escolha a Máquina para Preparação
                </label>
                <select
                  value={tdVehicle.id}
                  onChange={(e) => {
                    const found = INVENTORY.find((i) => i.id === e.target.value);
                    if (found) setTdVehicle(found);
                  }}
                  className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-xs sm:text-sm font-bold focus:outline-none focus:border-[#D4AF37]"
                >
                  {INVENTORY.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.brand} {v.model} ({v.power} • {formatBRL(v.price)})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-[#D4AF37] font-bold mb-2">
                  4. Janela de Horário
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                  {TEST_DRIVE_SLOTS.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => {
                        soundRef.current?.playCockpitClick();
                        setTdSlot(slot);
                        setTdStatus("IDLE");
                      }}
                      className={`py-3 rounded-xl font-mono text-xs font-black border transition-all ${
                        tdSlot === slot
                          ? "bg-[#D4AF37] text-zinc-950 border-[#D4AF37] shadow-[0_0_20px_rgba(212,175,55,0.35)]"
                          : "bg-zinc-950 text-zinc-300 border-zinc-800 hover:border-[#D4AF37]/50"
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs font-mono">
              {tdStatus !== "IDLE" ? (
                <span
                  className={`flex items-center gap-2 ${
                    tdStatus === "ERROR"
                      ? "text-red-400"
                      : tdStatus === "SUCCESS"
                      ? "text-emerald-400 font-bold"
                      : "text-[#D4AF37]"
                  }`}
                >
                  {tdStatus === "SUCCESS" && <CheckCircle2 className="w-4 h-4" />}
                  {tdStatus === "ERROR" && <AlertTriangle className="w-4 h-4" />}
                  {tdStatus === "LOADING"
                    ? "Executando lock transacional no Firestore..."
                    : tdFeedback}
                </span>
              ) : (
                <span className="text-zinc-400">
                  Selecionado: <strong className="text-white">{tdVehicle.brand} {tdVehicle.model}</strong> ({tdMode}) às <strong className="text-[#D4AF37]">{tdSlot}</strong>
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {tdStatus === "SUCCESS" && tdProtocol && (
                <button
                  type="button"
                  onClick={() => {
                    const txt = `*CREDENTIAL VIP TEST DRIVE — AETHER MOTORS* 🏎️\n*Protocolo:* #${tdProtocol}\n*Veículo:* ${tdVehicle.brand} ${tdVehicle.model}\n*Modalidade:* ${tdMode}\n*Data/Hora:* ${tdDate} às ${tdSlot}`;
                    window.open(
                      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(txt)}`,
                      "_blank"
                    );
                  }}
                  className="px-5 py-4 rounded-xl bg-zinc-900 border border-emerald-500/40 text-emerald-400 font-black text-xs uppercase tracking-wider flex items-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" /> Enviar Credencial no WhatsApp
                </button>
              )}

              <button
                type="button"
                onClick={handleConfirmTestDrive}
                disabled={tdStatus === "LOADING"}
                className="px-8 py-4 rounded-xl bg-gradient-to-r from-[#D4AF37] to-amber-500 text-zinc-950 font-black text-xs uppercase tracking-wider shadow-[0_0_30px_rgba(212,175,55,0.3)] transition-all disabled:opacity-50"
              >
                {tdStatus === "LOADING" ? "Reservando Chassi..." : "Confirmar Agendamento Atômico"}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          6. DIFERENCIAIS & GARANTIA (BENTO GRID)
      ========================================== */}
      <section id="diferenciais" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: ShieldCheck,
              tag: "CERTIFICAÇÃO BALÍSTICA",
              title: "Blindagem Nível III-A Ultra-Leve",
              desc: "Parceria oficial com as maiores blindadoras do país. Vidros de baixa espessura sem delaminação e mantas de aramida de última geração.",
            },
            {
              icon: Award,
              tag: "LAUDO 240 PONTOS",
              title: "Perícia Óptica & Scanner de Pista",
              desc: "Verificação de espessura de pintura a laser, histórico de revisões em concessionária e leitura de horas de motor (Overrev check).",
            },
            {
              icon: Car,
              tag: "CONCIERGE LOGÍSTICO",
              title: "Entrega em Caminhão Fechado",
              desc: "Seu veículo viaja em prancha sider 100% blindada contra detritos e intempéries, com seguro total até a porta da sua residência.",
            },
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <div
                key={i}
                className="p-8 rounded-3xl bg-zinc-900/40 border border-zinc-800/80 hover:border-[#D4AF37]/40 transition-all flex flex-col justify-between"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37]">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">
                    {item.tag}
                  </span>
                </div>
                <div>
                  <h3 className="text-xl font-black uppercase text-white mb-2">{item.title}</h3>
                  <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ==========================================
          7. CONTATO & FOOTER
      ========================================== */}
      <footer id="contato" className="bg-[#040506] border-t border-zinc-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 pb-12 border-b border-zinc-900 items-center">
            <div className="lg:col-span-7 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#D4AF37]/15 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37]">
                  <Gauge className="w-5 h-5" />
                </div>
                <span className="text-lg font-black tracking-widest text-white">
                  AETHER<span className="text-[#D4AF37]">.MOTORS</span>
                </span>
              </div>
              <p className="text-sm text-zinc-400 max-w-lg">
                Showroom Flagship com heliponto homologado e atendimento individualizado com hora
                marcada.
              </p>
              <div className="flex flex-wrap items-center gap-6 pt-2 text-xs font-mono text-zinc-400">
                <span className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#D4AF37]" /> Av. Europa, 880 - Jardim Europa, SP
                </span>
                <span className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-[#D4AF37]" /> (11) 99999-9999
                </span>
              </div>
            </div>

            <div className="lg:col-span-5 flex lg:justify-end">
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                  "Olá! Gostaria de falar com um consultor Private da Aether Motors."
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() =>
                  trackMetaEvent("Contact", {
                    content_name: "Footer WhatsApp Aether Motors",
                  })
                }
                className="px-7 py-4 rounded-2xl bg-gradient-to-r from-[#D4AF37] to-amber-500 text-zinc-950 font-black text-xs uppercase tracking-wider flex items-center gap-2.5 shadow-lg"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Atendimento Private via WhatsApp</span>
              </a>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] font-mono uppercase text-zinc-600">
            <p>© {CURRENT_YEAR} AETHER MOTORS SHOWROOM. TODOS OS DIREITOS RESERVADOS.</p>
            <p>
              ARQUITETURA DESENVOLVIDA POR <strong className="text-[#D4AF37]">FOCUSPULSE</strong>
            </p>
          </div>
        </div>
      </footer>

      {/* ==========================================
          MODAL DE FICHA TÉCNICA COMPLETA DO VEÍCULO
      ========================================== */}
      <AnimatePresence>
        {selectedVehicleModal && (
          <div
            onClick={() => setSelectedVehicleModal(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-zinc-950 border border-[#D4AF37]/40 shadow-2xl no-scrollbar"
            >
              <div className="relative h-64 sm:h-72 w-full">
                <Image
                  src={selectedVehicleModal.image}
                  alt={selectedVehicleModal.model}
                  fill
                  unoptimized
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/30 to-transparent" />
                <button
                  type="button"
                  onClick={() => setSelectedVehicleModal(null)}
                  className="absolute top-4 right-4 w-10 h-10 rounded-full bg-zinc-950/80 border border-zinc-800 text-white flex items-center justify-center hover:bg-[#D4AF37] hover:text-zinc-950 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={(e) => handleEngineRev(selectedVehicleModal, e)}
                  className="absolute bottom-4 right-4 px-4 py-2 rounded-xl bg-[#D4AF37] text-zinc-950 font-mono text-xs font-black uppercase flex items-center gap-2 shadow-lg"
                >
                  <Volume2 className="w-4 h-4" /> Ouvir Ronco / Ignição
                </button>
              </div>

              <div className="p-6 sm:p-8 space-y-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <span className="text-xs font-mono uppercase tracking-widest text-[#D4AF37]">
                      {selectedVehicleModal.brand} • {selectedVehicleModal.year}
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-black text-white uppercase">
                      {selectedVehicleModal.model}
                    </h3>
                  </div>
                  <span className="text-2xl font-black text-[#D4AF37]">
                    {formatBRL(selectedVehicleModal.price)}
                  </span>
                </div>

                {/* Specs Table */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-zinc-900/70 border border-zinc-800 text-xs">
                  <div>
                    <span className="text-[10px] font-mono text-zinc-500 block">COR EXTERNA</span>
                    <strong className="text-white">{selectedVehicleModal.exteriorColor}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-zinc-500 block">INTERIOR</span>
                    <strong className="text-white">{selectedVehicleModal.interiorSpec}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-zinc-500 block">QUILOMETRAGEM</span>
                    <strong className="text-white">{selectedVehicleModal.km}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-zinc-500 block">POTÊNCIA</span>
                    <strong className="text-[#D4AF37]">{selectedVehicleModal.power}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-zinc-500 block">0 A 100 KM/H</span>
                    <strong className="text-[#D4AF37]">{selectedVehicleModal.zeroToHundred}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-zinc-500 block">BLINDAGEM</span>
                    <strong className="text-white">
                      {selectedVehicleModal.armored ? "Sim (Nível III-A)" : "Original Não Blindado"}
                    </strong>
                  </div>
                </div>

                {/* Highlights */}
                <div>
                  <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-bold mb-3">
                    Configuração & Opcionais de Fábrica
                  </h4>
                  <div className="space-y-2">
                    {selectedVehicleModal.highlights.map((h, i) => (
                      <div key={i} className="flex items-center gap-2.5 text-xs sm:text-sm text-zinc-300">
                        <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-zinc-800 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setSimVehicle(selectedVehicleModal);
                      setSelectedVehicleModal(null);
                      document.getElementById("simulador")?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="py-3.5 px-5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-white font-bold text-xs uppercase tracking-wider"
                  >
                    Simular Financiamento / Troca
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setTdVehicle(selectedVehicleModal);
                      setSelectedVehicleModal(null);
                      document.getElementById("test-drive")?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="py-3.5 px-5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-amber-500 text-zinc-950 font-black text-xs uppercase tracking-wider"
                  >
                    Reservar Test Drive deste Chassi
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