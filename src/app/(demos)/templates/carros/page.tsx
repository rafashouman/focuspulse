"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  Search,
  ArrowUpRight,
  MessageCircle,
  CheckCircle2,
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
  FileCheck2,
  BadgePercent,
  CalendarCheck,
  Sparkles,
  SlidersHorizontal,
} from "lucide-react";
import { onAuthStateChanged, signInWithPopup, User } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase/client";
import { bookAppointment } from "@/app/actions/bookAppointment";
import { trackMetaEvent } from "@/components/MetaPixel";

// ==========================================
// CONFIGURAÇÕES GERAIS
// ==========================================
const WHATSAPP_NUMBER = "5551993583936";
const CURRENT_YEAR = new Date().getFullYear();

// ==========================================
// CATÁLOGO REALISTA DO MERCADO BRASILEIRO
// ==========================================
type VehicleCategory = "todos" | "suvs" | "picapes" | "hibridos" | "sedans-hatches";

interface Vehicle {
  id: string;
  brand: string;
  model: string;
  version: string;
  year: string;
  price: number;
  fipePrice: number;
  category: VehicleCategory;
  image: string;
  km: string;
  fuel: string;
  transmission: string;
  power: string;
  plateEnd: string;
  exteriorColor: string;
  singleOwner: boolean;
  ipvaPaid: boolean;
  badge?: string;
  highlights: string[];
}

const INVENTORY: Vehicle[] = [
  {
    id: "br-01",
    brand: "JEEP",
    model: "Compass Overland",
    version: "2.0 Hurricane 4 Turbo Gasolina 4x4 Aut.",
    year: "2024/2025",
    price: 224900,
    fipePrice: 231500,
    category: "suvs",
    image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=85",
    km: "14.200 km",
    fuel: "Gasolina",
    transmission: "Automático 9M",
    power: "272 cv",
    plateEnd: "Final 8 (RS)",
    exteriorColor: "Cinza Sting",
    singleOwner: true,
    ipvaPaid: true,
    badge: "Abaixo da FIPE • 272 cv",
    highlights: [
      "Motor 2.0 Hurricane Turbo de 272 cv e tração 4x4 com seletor de terrenos",
      "Teto solar elétrico panorâmico Command View",
      "Som Premium Alpine de 506W e painel digital de 10,25\"",
      "Revisões carimbadas na concessionária e garantia de fábrica até 2027",
    ],
  },
  {
    id: "br-02",
    brand: "TOYOTA",
    model: "Hilux SRX Plus",
    version: "2.8 TDI 4x4 CD 16V Diesel Automático",
    year: "2024/2024",
    price: 298900,
    fipePrice: 306400,
    category: "picapes",
    image: "https://images.unsplash.com/photo-1559416523-140ddc3d238c?auto=format&fit=crop&w=1200&q=85",
    km: "26.500 km",
    fuel: "Diesel",
    transmission: "Automático 6M",
    power: "204 cv",
    plateEnd: "Final 4 (RS)",
    exteriorColor: "Branco Polar Perolizado",
    singleOwner: true,
    ipvaPaid: true,
    badge: "Eixos Alargados • Única Dona",
    highlights: [
      "Nova suspensão SRX Plus com bitolas mais largas e freios a disco nas 4 rodas",
      "Câmera 360º, Piloto Automático Adaptativo (ACC) e Toyota Safety Sense",
      "Capota marítima original, protetor de caçamba e engate homologado",
      "Laudo Cautelar Dekra 100% aprovado sem retoques de pintura",
    ],
  },
  {
    id: "br-03",
    brand: "VOLKSWAGEN",
    model: "Nivus Highline",
    version: "1.0 200 TSI Total Flex Automático",
    year: "2024/2025",
    price: 129900,
    fipePrice: 134800,
    category: "suvs",
    image: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=85",
    km: "11.800 km",
    fuel: "Flex",
    transmission: "Automático 6M",
    power: "128 cv",
    plateEnd: "Final 9 (RS)",
    exteriorColor: "Cinza Moonstone",
    singleOwner: true,
    ipvaPaid: true,
    badge: "Pacote Bicolor • 11 mil km",
    highlights: [
      "Painel Active Info Display 10,25\" + Multimídia VW Play com Apple CarPlay sem fio",
      "ACC (Controle adaptativo de velocidade) e Frenagem Autônoma de Emergência",
      "Bancos em couro sintético Native bicolor e ar digital Touch",
      "4 pneus originais novos e estepe nunca rodou",
    ],
  },
  {
    id: "br-04",
    brand: "BYD",
    model: "Song Plus DM-i",
    version: "1.5 Plug-in Hybrid (PHEV) 18,3 kWh Aut.",
    year: "2024/2025",
    price: 204900,
    fipePrice: 212000,
    category: "hibridos",
    image: "https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1200&q=85",
    km: "9.400 km",
    fuel: "Híbrido Plug-in",
    transmission: "E-CVT Híbrido",
    power: "235 cv",
    plateEnd: "Final 0 (Isento IPVA RS)",
    exteriorColor: "Azul Time",
    singleOwner: true,
    ipvaPaid: true,
    badge: "Autonomia 1.200 km • Bateria 18,3 kWh",
    highlights: [
      "Bateria Blade de 18,3 kWh com até 105 km de alcance 100% elétrico",
      "Tela giratória elétrica de 15,6\" com câmeras 360º 3D em alta definição",
      "Acompanha Wallbox original de 7kW e carregador portátil de viagem",
      "Garantia de 8 anos para a bateria Blade e 6 anos para o veículo",
    ],
  },
  {
    id: "br-05",
    brand: "FIAT",
    model: "Fastback Limited Edition",
    version: "1.3 Turbo 270 Flex Powered by Abarth Aut.",
    year: "2024/2024",
    price: 136900,
    fipePrice: 142300,
    category: "suvs",
    image: "https://images.unsplash.com/photo-1609521263047-f8f205293f24?auto=format&fit=crop&w=1200&q=85",
    km: "18.100 km",
    fuel: "Flex",
    transmission: "Automático 6M",
    power: "185 cv",
    plateEnd: "Final 2 (RS)",
    exteriorColor: "Preto Vulcano c/ Cinza",
    singleOwner: true,
    ipvaPaid: true,
    badge: "Powered by Abarth • 185 cv",
    highlights: [
      "Motor T270 de 185 cv com tecla Poison (modo esportivo Abarth no volante)",
      "Porta-malas líder da categoria com 600 litros de capacidade",
      "Rodas esportivas de 18 polegadas escurecidas e faróis Full LED",
      "Freio de estacionamento eletrônico com Auto Hold e carregador por indução",
    ],
  },
  {
    id: "br-06",
    brand: "TOYOTA",
    model: "Corolla Altis Premium Hybrid",
    version: "1.8 VVT-i Híbrido Flex Automático CVT",
    year: "2024/2025",
    price: 169900,
    fipePrice: 175900,
    category: "sedans-hatches",
    image: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&w=1200&q=85",
    km: "15.600 km",
    fuel: "Híbrido Flex",
    transmission: "Hybrid Transaxle",
    power: "122 cv",
    plateEnd: "Final 6 (RS)",
    exteriorColor: "Prata Supernova",
    singleOwner: true,
    ipvaPaid: true,
    badge: "Até 18,5 km/l • Pacote Premium",
    highlights: [
      "Pacote Altis Premium com teto solar elétrico e interior em couro bege/preto",
      "Banco do motorista com regulagem elétrica de 8 posições",
      "Consumo urbano superior a 18 km/l na gasolina com máxima confiabilidade",
      "Elegível ao programa Toyota 10 (até 10 anos de garantia ativada em revisão)",
    ],
  },
];

const CATEGORIES: { id: VehicleCategory; label: string }[] = [
  { id: "todos", label: "Todo o Estoque (6)" },
  { id: "suvs", label: "SUVs & Crossovers" },
  { id: "picapes", label: "Picapes 4x4" },
  { id: "hibridos", label: "Híbridos & Elétricos" },
  { id: "sedans-hatches", label: "Sedans Executivos" },
];

const TEST_DRIVE_SLOTS = ["09:30", "11:00", "14:00", "15:30", "17:00"];

const formatBRL = (val: number) =>
  val.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  });

export default function CarDealershipPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Filtros do Showroom
  const [activeCategory, setActiveCategory] = useState<VehicleCategory>("todos");
  const [searchQuery, setSearchQuery] = useState("");
  const [onlyBelowFipe, setOnlyBelowFipe] = useState(false);
  const [selectedVehicleModal, setSelectedVehicleModal] = useState<Vehicle | null>(null);

  // Simulador Financeiro CDC & Avaliação de Troca
  const [simVehicle, setSimVehicle] = useState<Vehicle>(INVENTORY[2]); // Default Nivus Highline
  const [downPaymentPct, setDownPaymentPct] = useState<number>(30);
  const [months, setMonths] = useState<number>(48);
  const [tradeInModel, setTradeInModel] = useState("");
  const [tradeInValue, setTradeInValue] = useState<number>(0);

  // Agendamento de Visita / Test Drive (Firebase Atomic Lock)
  const [user, setUser] = useState<User | null>(null);
  const [tdVehicle, setTdVehicle] = useState<Vehicle>(INVENTORY[0]);
  const [tdDate, setTdDate] = useState("");
  const [tdMinDate, setTdMinDate] = useState("");
  const [tdSlot, setTdSlot] = useState<string>("14:00");
  const [tdMode, setTdMode] = useState<"LOJA" | "VIDEOCHAMADA">("LOJA");
  const [tdStatus, setTdStatus] = useState<"IDLE" | "LOADING" | "SUCCESS" | "ERROR">("IDLE");
  const [tdFeedback, setTdFeedback] = useState("");
  const [tdProtocol, setTdProtocol] = useState<string | null>(null);

  useEffect(() => {
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

  // Filtragem de estoque
  const filteredVehicles = useMemo(() => {
    return INVENTORY.filter((car) => {
      const matchCat = activeCategory === "todos" || car.category === activeCategory;
      const matchSearch =
        car.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        car.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
        car.version.toLowerCase().includes(searchQuery.toLowerCase()) ||
        car.exteriorColor.toLowerCase().includes(searchQuery.toLowerCase());
      const matchFipe = !onlyBelowFipe || car.price < car.fipePrice;
      return matchCat && matchSearch && matchFipe;
    });
  }, [activeCategory, searchQuery, onlyBelowFipe]);

  // Cálculos do Simulador Financeiro CDC
  const downPaymentAmount = Math.round((simVehicle.price * downPaymentPct) / 100);
  const financedPrincipal = Math.max(0, simVehicle.price - downPaymentAmount - tradeInValue);
  const monthlyRate = 0.0139; // Taxa média CDC Seminovos 1,39% a.m.
  const monthlyInstallment = useMemo(() => {
    if (financedPrincipal <= 0) return 0;
    const factor =
      (monthlyRate * Math.pow(1 + monthlyRate, months)) /
      (Math.pow(1 + monthlyRate, months) - 1);
    return Math.round(financedPrincipal * factor);
  }, [financedPrincipal, months]);

  const handleSendFinancingWhatsApp = () => {
    trackMetaEvent("InitiateCheckout", {
      content_name: `Simulação ${simVehicle.brand} ${simVehicle.model}`,
      value: simVehicle.price,
      currency: "BRL",
    });
    trackMetaEvent("Lead", {
      content_name: "Proposta Financiamento / Troca Prime Motors",
      value: simVehicle.price,
      currency: "BRL",
    });

    const msg = `*SIMULAÇÃO DE FINANCIAMENTO & TROCA — PRIME MOTORS* 🚗\n----------------------------------\n*Veículo:* ${
      simVehicle.brand
    } ${simVehicle.model} (${simVehicle.year})\n*Valor à Vista:* ${formatBRL(
      simVehicle.price
    )} (FIPE: ${formatBRL(simVehicle.fipePrice)})\n----------------------------------\n*Entrada (${downPaymentPct}%):* ${formatBRL(
      downPaymentAmount
    )}\n${
      tradeInModel
        ? `*Usado na Troca:* ${tradeInModel} (Valor est.: ${formatBRL(tradeInValue)})\n`
        : ""
    }*Saldo a Financiar:* ${formatBRL(
      financedPrincipal
    )}\n*Plano Simulado:* ${months}x de *${formatBRL(
      monthlyInstallment
    )}*\n----------------------------------\n_Gostaria de aprovar minha ficha por CPF e agendar avaliação do meu usado._`;

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  // Handlers de Autenticação e Agendamento de Test Drive
  const handleGoogleLogin = async () => {
    setTdStatus("LOADING");
    try {
      await signInWithPopup(auth, googleProvider);
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
      setTdFeedback("Faça login com sua conta Google para reservar o horário.");
      return;
    }

    setTdStatus("LOADING");

    try {
      const token = await user.getIdToken();
      const serviceSummary = `VISITA (${tdMode}) • ${tdVehicle.brand} ${tdVehicle.model}`;

      const res = await bookAppointment(
        {
          date: tdDate,
          timeSlot: tdSlot,
          serviceName: serviceSummary,
        },
        token
      );

      if (res.success) {
        const code = res.bookingId?.slice(-6).toUpperCase() || "PRM2026";
        setTdProtocol(code);
        setTdStatus("SUCCESS");
        setTdFeedback(
          `Reserva confirmada para ${tdDate} às ${tdSlot} • Protocolo #${code}`
        );

        trackMetaEvent("Schedule", {
          content_name: serviceSummary,
          value: tdVehicle.price,
          currency: "BRL",
        });
      } else {
        setTdStatus("ERROR");
        setTdFeedback(res.error || "Este horário acabou de ser preenchido.");
      }
    } catch {
      setTdStatus("ERROR");
      setTdFeedback("Falha de conexão com o sistema de agendamentos.");
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 selection:bg-blue-600 selection:text-white font-sans antialiased overflow-x-hidden">
      {/* ==========================================
          0. TOP UTILITY BAR (CONCESSIONÁRIA REAL)
      ========================================== */}
      <div className="bg-slate-900 text-slate-300 text-xs py-2.5 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
              <FileCheck2 className="w-3.5 h-3.5" />
              100% do Estoque com Laudo Cautelar Dekra Aprovado
            </span>
            <span className="hidden md:inline text-slate-600">|</span>
            <span className="hidden md:flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-blue-400" />
              Av. Ipiranga, 4500 — Porto Alegre, RS
            </span>
          </div>
          <div className="flex items-center gap-4 font-mono text-[11px]">
            <span>Seg a Sáb: 08h30 às 19h</span>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-blue-400 font-bold flex items-center gap-1"
            >
              <Phone className="w-3 h-3 text-blue-400" /> (51) 99358-3936
            </a>
          </div>
        </div>
      </div>

      {/* ==========================================
          1. CLEAN RETAIL NAVBAR (LIGHT THEME)
      ========================================== */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          <a href="#" className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-blue-700 text-white flex items-center justify-center shadow-md shadow-blue-700/20">
              <Car className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-slate-900 block leading-none">
                PRIME<span className="text-blue-700">MOTORS</span>
              </span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                Seminovos Selecionados & 0km
              </span>
            </div>
          </a>

          <nav className="hidden lg:flex items-center gap-1">
            {[
              { label: "Estoque Atual", href: "#estoque" },
              { label: "Simular Financiamento", href: "#financiamento" },
              { label: "Avaliamos seu Usado", href: "#financiamento" },
              { label: "Agendar Test Drive", href: "#agendamento" },
              { label: "Garantia & Laudo", href: "#garantias" },
            ].map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="px-4 py-2 rounded-lg text-sm font-semibold text-slate-600 hover:text-blue-700 hover:bg-slate-100 transition-colors"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <a
              href="#agendamento"
              className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-blue-700/20"
            >
              <CalendarCheck className="w-4 h-4" />
              <span>Agendar Visita</span>
            </a>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-700"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-white border-b border-slate-200 px-4 py-4 flex flex-col gap-1"
            >
              {[
                { label: "Estoque Atual", href: "#estoque" },
                { label: "Simulador de Financiamento & Troca", href: "#financiamento" },
                { label: "Agendar Visita / Test Drive", href: "#agendamento" },
                { label: "Laudo Cautelar & Garantias", href: "#garantias" },
              ].map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-3 rounded-xl text-sm font-bold text-slate-700 hover:bg-blue-50 hover:text-blue-700"
                >
                  {item.label}
                </a>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ==========================================
          2. EDITORIAL SHOWROOM HERO (BRIGHT & REALISTIC)
      ========================================== */}
      <section className="relative bg-white pt-10 pb-20 lg:pt-14 lg:pb-24 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Coluna Esquerda: Proposta de Valor Clara (6 Cols) */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-bold">
                <BadgePercent className="w-4 h-4 text-blue-600" />
                <span>Taxas a partir de 0,99% a.m. • Superavaliação na Troca</span>
              </div>

              <h1 className="text-4xl sm:text-5xl xl:text-6xl font-black tracking-tight text-slate-900 leading-[1.05]">
                Seu próximo carro com{" "}
                <span className="text-blue-700 underline decoration-blue-200 decoration-8 underline-offset-4">
                  procedência comprovada.
                </span>
              </h1>

              <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-xl">
                Seminovos de única dona, baixa quilometragem real, IPVA {CURRENT_YEAR} quitado e{" "}
                <strong className="text-slate-900">Laudo Cautelar Dekra 100% aprovado</strong>.
                Recebemos seu veículo na troca com pagamento à vista da diferença.
              </p>

              {/* Destaques Rápidos em Pílulas Claras */}
              <div className="grid grid-cols-3 gap-3 pt-2">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-xs font-bold text-blue-700 block">Tabela FIPE</span>
                  <span className="text-lg font-black text-slate-900">Até 100%</span>
                  <span className="text-[11px] text-slate-500 block">Na avaliação do seu usado</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-xs font-bold text-emerald-700 block">Documentação</span>
                  <span className="text-lg font-black text-slate-900">IPVA {CURRENT_YEAR}</span>
                  <span className="text-[11px] text-slate-500 block">Totalmente pago</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-xs font-bold text-blue-700 block">Aprovação</span>
                  <span className="text-lg font-black text-slate-900">Em 15 min</span>
                  <span className="text-[11px] text-slate-500 block">6 bancos parceiros</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <a
                  href="#estoque"
                  className="px-7 py-4 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-sm shadow-lg shadow-blue-700/25 transition-all flex items-center gap-2"
                >
                  <span>Ver Estoque Disponível</span>
                  <ChevronRight className="w-4 h-4" />
                </a>
                <a
                  href="#financiamento"
                  className="px-6 py-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm transition-all flex items-center gap-2"
                >
                  <Calculator className="w-4 h-4 text-blue-700" />
                  <span>Simular Parcelas</span>
                </a>
              </div>
            </div>

            {/* Coluna Direita: Oportunidade da Semana em Layout Card Limpo (6 Cols) */}
            <div className="lg:col-span-6">
              <div className="rounded-3xl bg-white border-2 border-slate-200 shadow-[0_25px_60px_-15px_rgba(15,23,42,0.12)] overflow-hidden">
                <div className="bg-slate-900 text-white px-6 py-3 flex items-center justify-between text-xs font-bold">
                  <span className="flex items-center gap-2 text-amber-400 uppercase tracking-wider">
                    <Sparkles className="w-4 h-4" /> Oportunidade da Semana • Abaixo da FIPE
                  </span>
                  <span className="font-mono text-slate-300">
                    {INVENTORY[0].year} • {INVENTORY[0].km}
                  </span>
                </div>

                <div className="relative h-64 sm:h-80 w-full bg-slate-100">
                  <Image
                    src={INVENTORY[0].image}
                    alt={INVENTORY[0].model}
                    fill
                    unoptimized
                    className="object-cover"
                  />
                  <div className="absolute bottom-3 left-3 flex flex-wrap gap-2">
                    <span className="px-3 py-1 rounded-lg bg-emerald-600 text-white text-xs font-bold shadow">
                      Economia de {formatBRL(INVENTORY[0].fipePrice - INVENTORY[0].price)} sob a FIPE
                    </span>
                    <span className="px-3 py-1 rounded-lg bg-white/95 text-slate-900 text-xs font-bold shadow">
                      Único Dono • IPVA Pago
                    </span>
                  </div>
                </div>

                <div className="p-6 sm:p-7 space-y-5">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <span className="text-xs font-extrabold uppercase tracking-wider text-blue-700">
                        {INVENTORY[0].brand}
                      </span>
                      <h2 className="text-2xl font-black text-slate-900">
                        {INVENTORY[0].model}
                      </h2>
                      <p className="text-xs text-slate-500 mt-0.5">{INVENTORY[0].version}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-slate-400 line-through block">
                        FIPE: {formatBRL(INVENTORY[0].fipePrice)}
                      </span>
                      <span className="text-2xl sm:text-3xl font-black text-blue-700">
                        {formatBRL(INVENTORY[0].price)}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-2 p-3 rounded-xl bg-slate-50 border border-slate-200 text-center text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 font-semibold block">MOTOR</span>
                      <strong className="text-slate-800">{INVENTORY[0].power}</strong>
                    </div>
                    <div className="border-x border-slate-200">
                      <span className="text-[10px] text-slate-400 font-semibold block">CÂMBIO</span>
                      <strong className="text-slate-800">Aut. 9M</strong>
                    </div>
                    <div className="border-r border-slate-200">
                      <span className="text-[10px] text-slate-400 font-semibold block">COMBUSTÍVEL</span>
                      <strong className="text-slate-800">{INVENTORY[0].fuel}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-semibold block">PLACA</span>
                      <strong className="text-slate-800">{INVENTORY[0].plateEnd}</strong>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setSelectedVehicleModal(INVENTORY[0])}
                      className="py-3.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
                    >
                      <span>Ver Laudo & Opcionais</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSimVehicle(INVENTORY[0]);
                        document.getElementById("financiamento")?.scrollIntoView({ behavior: "smooth" });
                      }}
                      className="py-3.5 px-4 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 font-bold text-xs uppercase tracking-wider transition-colors"
                    >
                      Simular Financiamento
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          3. ESTOQUE MULTIMARCAS & BUSCADOR PORTAL
      ========================================== */}
      <section id="estoque" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-20">
        {/* Barra de Filtro Estilo Portal Webmotors */}
        <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-sm mb-10">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 mb-5 border-b border-slate-100">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-blue-700 block">
                Estoque Verificado Presencialmente
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                Veículos Pronta Entrega
              </h2>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button
                type="button"
                onClick={() => setOnlyBelowFipe(!onlyBelowFipe)}
                className={`px-4 py-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                  onlyBelowFipe
                    ? "bg-emerald-600 border-emerald-600 text-white shadow-sm"
                    : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                }`}
              >
                <BadgePercent className="w-4 h-4" />
                <span>Apenas Abaixo da FIPE</span>
              </button>

              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar Hilux, Compass, Nivus, BYD..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white"
                />
              </div>
            </div>
          </div>

          {/* Categorias */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            <span className="text-xs font-bold text-slate-400 flex items-center gap-1 mr-2 shrink-0">
              <SlidersHorizontal className="w-3.5 h-3.5" /> Carroceria:
            </span>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  activeCategory === cat.id
                    ? "bg-blue-700 text-white shadow-sm"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Grid de Carros */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {filteredVehicles.map((car) => {
            const fipeDiff = car.fipePrice - car.price;
            return (
              <motion.article
                layout
                key={car.id}
                onClick={() => setSelectedVehicleModal(car)}
                className="group cursor-pointer rounded-3xl bg-white border border-slate-200 hover:border-blue-600 overflow-hidden flex flex-col justify-between transition-all shadow-sm hover:shadow-xl"
              >
                <div>
                  {/* Imagem do Carro */}
                  <div className="relative h-56 w-full overflow-hidden bg-slate-100">
                    <Image
                      src={car.image}
                      alt={`${car.brand} ${car.model}`}
                      fill
                      unoptimized
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Badges Superiores */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                      {car.badge && (
                        <span className="px-3 py-1 rounded-lg bg-slate-900/90 backdrop-blur-md text-white text-[11px] font-bold shadow">
                          {car.badge}
                        </span>
                      )}
                      {fipeDiff > 0 && (
                        <span className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white text-[11px] font-bold shadow">
                          -{formatBRL(fipeDiff)} FIPE
                        </span>
                      )}
                    </div>

                    {/* Faixa Inferior da Foto */}
                    <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between">
                      <span className="px-2.5 py-1 rounded-md bg-white/95 text-slate-900 font-bold text-[11px] shadow">
                        {car.year}
                      </span>
                      <span className="px-2.5 py-1 rounded-md bg-white/95 text-slate-700 font-semibold text-[11px] shadow">
                        {car.km}
                      </span>
                    </div>
                  </div>

                  {/* Corpo de Especificações */}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[11px] font-extrabold uppercase tracking-wider text-blue-700">
                        {car.brand}
                      </span>
                      <span className="text-[11px] font-semibold text-emerald-700 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Laudo Dekra OK
                      </span>
                    </div>

                    <h3 className="text-xl font-black text-slate-900 group-hover:text-blue-700 transition-colors">
                      {car.model}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-1 mt-0.5 mb-4">
                      {car.version}
                    </p>

                    <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs text-center">
                      <div>
                        <span className="text-[10px] text-slate-400 font-semibold block">CÂMBIO</span>
                        <strong className="text-slate-800 truncate block">
                          {car.transmission.replace("Automático", "Aut.")}
                        </strong>
                      </div>
                      <div className="border-x border-slate-200">
                        <span className="text-[10px] text-slate-400 font-semibold block">MOTOR</span>
                        <strong className="text-slate-800">{car.power}</strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 font-semibold block">COMBUST.</span>
                        <strong className="text-slate-800 truncate block">{car.fuel}</strong>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Rodapé de Preço e Ação */}
                <div className="px-6 pb-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-slate-400 line-through block">
                      Tabela FIPE: {formatBRL(car.fipePrice)}
                    </span>
                    <span className="text-2xl font-black text-slate-900">
                      {formatBRL(car.price)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSimVehicle(car);
                        document
                          .getElementById("financiamento")
                          ?.scrollIntoView({ behavior: "smooth" });
                      }}
                      className="px-3.5 py-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs transition-colors"
                    >
                      Simular
                    </button>
                    <div className="w-10 h-10 rounded-xl bg-slate-900 group-hover:bg-blue-700 text-white flex items-center justify-center transition-colors">
                      <ArrowUpRight className="w-5 h-5" />
                    </div>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      </section>

      {/* ==========================================
          4. SIMULADOR DE FINANCIAMENTO CDC & AVALIAÇÃO DE TROCA
      ========================================== */}
      <section
        id="financiamento"
        className="py-16 bg-white border-y border-slate-200 scroll-mt-20"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-slate-50 border border-slate-200 p-6 sm:p-10 lg:p-12 shadow-sm">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8 mb-10 border-b border-slate-200">
              <div>
                <span className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-blue-700 mb-2">
                  <Calculator className="w-4 h-4" /> Simulador de Crédito Automotivo & Troca
                </span>
                <h2 className="text-2xl sm:text-4xl font-black text-slate-900">
                  Calcule suas parcelas e inclua seu usado
                </h2>
              </div>
              <p className="text-sm text-slate-600 max-w-md">
                Trabalhamos com Itaú, Santander, Bradesco, Safra e BV Financeira. Simule abaixo e
                envie para aprovação imediata sem burocracia.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
              {/* Controles (7 Cols) */}
              <div className="lg:col-span-7 space-y-6">
                {/* 1. Seleção do Carro */}
                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-3">
                    1. Selecione o veículo do estoque
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {INVENTORY.map((v) => (
                      <button
                        key={v.id}
                        type="button"
                        onClick={() => setSimVehicle(v)}
                        className={`p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all ${
                          simVehicle.id === v.id
                            ? "bg-blue-700 border-blue-700 text-white shadow-md"
                            : "bg-white border-slate-200 text-slate-700 hover:border-blue-400"
                        }`}
                      >
                        <div className="truncate pr-2">
                          <span
                            className={`text-[10px] font-bold block ${
                              simVehicle.id === v.id ? "text-blue-200" : "text-blue-700"
                            }`}
                          >
                            {v.brand}
                          </span>
                          <span className="text-xs font-bold truncate block">{v.model}</span>
                        </div>
                        <span className="text-xs font-extrabold shrink-0">
                          {formatBRL(v.price)}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Entrada */}
                <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-extrabold uppercase text-slate-700">
                      2. Valor de Entrada ({downPaymentPct}%)
                    </label>
                    <span className="text-lg font-black text-blue-700">
                      {formatBRL(downPaymentAmount)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={10}
                    max={80}
                    step={5}
                    value={downPaymentPct}
                    onChange={(e) => setDownPaymentPct(Number(e.target.value))}
                    className="w-full accent-blue-700 cursor-pointer"
                  />
                  <div className="flex justify-between text-[11px] font-semibold text-slate-400">
                    <span>Mínimo: 10%</span>
                    <span>Ideal: 40%</span>
                    <span>Máximo: 80%</span>
                  </div>
                </div>

                {/* 3. Prazo & Troca */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-5 rounded-2xl bg-white border border-slate-200">
                    <label className="block text-xs font-extrabold uppercase text-slate-700 mb-3">
                      3. Prazo (Meses)
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {[12, 24, 36, 48, 60].slice(0, 4).map((m) => (
                        <button
                          key={m}
                          type="button"
                          onClick={() => setMonths(m)}
                          className={`py-2.5 rounded-xl text-xs font-bold border transition-all ${
                            months === m
                              ? "bg-blue-700 text-white border-blue-700"
                              : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                          }`}
                        >
                          {m}x
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-2.5">
                    <label className="block text-xs font-extrabold uppercase text-slate-700">
                      4. Seu Carro na Troca (Opcional)
                    </label>
                    <input
                      type="text"
                      value={tradeInModel}
                      onChange={(e) => setTradeInModel(e.target.value)}
                      placeholder="Ex: Onix Premier 2022"
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600"
                    />
                    <input
                      type="number"
                      min={0}
                      step={5000}
                      value={tradeInValue || ""}
                      onChange={(e) => setTradeInValue(Number(e.target.value) || 0)}
                      placeholder="Valor estimado FIPE (R$)"
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600"
                    />
                  </div>
                </div>
              </div>

              {/* Card de Resumo Financeiro (5 Cols) */}
              <div className="lg:col-span-5 rounded-3xl bg-white border-2 border-blue-600 p-6 sm:p-8 space-y-6 shadow-xl">
                <div className="flex items-center gap-4 pb-5 border-b border-slate-100">
                  <div className="relative w-24 h-16 rounded-xl overflow-hidden shrink-0 border border-slate-200">
                    <Image
                      src={simVehicle.image}
                      alt={simVehicle.model}
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold uppercase text-blue-700">
                      Resumo da Simulação
                    </span>
                    <h3 className="text-base font-black text-slate-900">
                      {simVehicle.brand} {simVehicle.model}
                    </h3>
                    <span className="text-xs font-semibold text-slate-500">
                      Valor à vista: {formatBRL(simVehicle.price)}
                    </span>
                  </div>
                </div>

                <div className="space-y-2.5 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Entrada em dinheiro ({downPaymentPct}%)</span>
                    <span className="text-slate-900 font-bold">{formatBRL(downPaymentAmount)}</span>
                  </div>
                  {tradeInValue > 0 && (
                    <div className="flex justify-between text-emerald-700 font-semibold">
                      <span>Seu usado ({tradeInModel || "Troca"})</span>
                      <span className="font-bold">- {formatBRL(tradeInValue)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-slate-600">
                    <span>Valor Financiado</span>
                    <span className="text-slate-900 font-bold">{formatBRL(financedPrincipal)}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Taxa referencial CDC</span>
                    <span>1,39% a.m. (Sujeito a análise)</span>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-blue-50 border border-blue-200">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-blue-800 block mb-1">
                    PARCELA FIXA ESTIMADA ({months} MESES)
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl sm:text-4xl font-black text-blue-700">
                      {formatBRL(monthlyInstallment)}
                    </span>
                    <span className="text-xs font-bold text-slate-500">/mês</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleSendFinancingWhatsApp}
                  className="w-full py-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/25 transition-all"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Aprovar Ficha pelo WhatsApp</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          5. AGENDAMENTO DE VISITA / TEST DRIVE (FIRESTORE)
      ========================================== */}
      <section id="agendamento" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-20">
        <div className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-10 lg:p-12 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-6 mb-8">
            <div>
              <span className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-blue-700 mb-1.5">
                <KeyRound className="w-4 h-4" /> Reserva Online em Tempo Real
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                Agendar Test Drive ou Chamada de Vídeo Ao Vivo
              </h2>
            </div>

            <div className="text-xs bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-2 rounded-xl font-bold">
              ● Deixamos o carro higienizado e separado para você
            </div>
          </div>

          {/* Barra de Login Google */}
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-slate-50 border border-slate-200 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase text-slate-400 block">
                  Identificação do Cliente
                </span>
                <p className="text-xs sm:text-sm font-bold text-slate-800">
                  {user
                    ? `Conectado como: ${user.displayName || user.email}`
                    : "Entre com sua conta Google para confirmar o agendamento instantâneo."}
                </p>
              </div>
            </div>

            {!user && (
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all"
              >
                <LogIn className="w-4 h-4" /> Entrar com Google
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
            <div className="lg:col-span-5 space-y-5 bg-slate-50 border border-slate-200 rounded-2xl p-5">
              <div>
                <label className="block text-xs font-extrabold uppercase text-slate-700 mb-2">
                  1. Como prefere conhecer o veículo?
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setTdMode("LOJA")}
                    className={`p-3 rounded-xl border text-xs font-bold transition-all ${
                      tdMode === "LOJA"
                        ? "bg-blue-700 text-white border-blue-700"
                        : "bg-white border-slate-200 text-slate-600"
                    }`}
                  >
                    Test Drive na Loja
                  </button>
                  <button
                    type="button"
                    onClick={() => setTdMode("VIDEOCHAMADA")}
                    className={`p-3 rounded-xl border text-xs font-bold transition-all ${
                      tdMode === "VIDEOCHAMADA"
                        ? "bg-blue-700 text-white border-blue-700"
                        : "bg-white border-slate-200 text-slate-600"
                    }`}
                  >
                    Vídeo Ao Vivo (WhatsApp)
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-extrabold uppercase text-slate-700 mb-2">
                  2. Escolha a Data
                </label>
                <input
                  type="date"
                  value={tdDate}
                  min={tdMinDate}
                  onChange={(e) => {
                    setTdDate(e.target.value);
                    setTdStatus("IDLE");
                  }}
                  className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-900 font-semibold text-sm focus:outline-none focus:border-blue-600"
                />
              </div>
            </div>

            <div className="lg:col-span-7 space-y-5 bg-slate-50 border border-slate-200 rounded-2xl p-5">
              <div>
                <label className="block text-xs font-extrabold uppercase text-slate-700 mb-2">
                  3. Veículo de Interesse
                </label>
                <select
                  value={tdVehicle.id}
                  onChange={(e) => {
                    const found = INVENTORY.find((i) => i.id === e.target.value);
                    if (found) setTdVehicle(found);
                  }}
                  className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-900 text-sm font-bold focus:outline-none focus:border-blue-600"
                >
                  {INVENTORY.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.brand} {v.model} — {v.year} ({formatBRL(v.price)})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-extrabold uppercase text-slate-700 mb-2">
                  4. Horário Disponível
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                  {TEST_DRIVE_SLOTS.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => {
                        setTdSlot(slot);
                        setTdStatus("IDLE");
                      }}
                      className={`py-3 rounded-xl text-xs font-extrabold border transition-all ${
                        tdSlot === slot
                          ? "bg-blue-700 text-white border-blue-700 shadow-sm"
                          : "bg-white text-slate-700 border-slate-200 hover:border-blue-400"
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs font-semibold">
              {tdStatus !== "IDLE" ? (
                <span
                  className={`flex items-center gap-2 ${
                    tdStatus === "ERROR"
                      ? "text-red-600"
                      : tdStatus === "SUCCESS"
                      ? "text-emerald-700 font-bold"
                      : "text-blue-700"
                  }`}
                >
                  {tdStatus === "SUCCESS" && <CheckCircle2 className="w-4 h-4" />}
                  {tdStatus === "ERROR" && <AlertTriangle className="w-4 h-4" />}
                  {tdStatus === "LOADING" ? "Reservando horário na agenda..." : tdFeedback}
                </span>
              ) : (
                <span className="text-slate-500">
                  Selecionado:{" "}
                  <strong className="text-slate-900">
                    {tdVehicle.brand} {tdVehicle.model}
                  </strong>{" "}
                  ({tdMode}) às <strong className="text-blue-700">{tdSlot}</strong>
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {tdStatus === "SUCCESS" && tdProtocol && (
                <button
                  type="button"
                  onClick={() => {
                    const txt = `*AGENDAMENTO CONFIRMADO — PRIME MOTORS* 🚗\n*Protocolo:* #${tdProtocol}\n*Veículo:* ${tdVehicle.brand} ${tdVehicle.model}\n*Modalidade:* ${tdMode}\n*Data/Hora:* ${tdDate} às ${tdSlot}`;
                    window.open(
                      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(txt)}`,
                      "_blank"
                    );
                  }}
                  className="px-5 py-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold text-xs uppercase tracking-wider flex items-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" /> Enviar Comprovante no WhatsApp
                </button>
              )}

              <button
                type="button"
                onClick={handleConfirmTestDrive}
                disabled={tdStatus === "LOADING"}
                className="px-8 py-4 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all disabled:opacity-50"
              >
                {tdStatus === "LOADING" ? "Confirmando..." : "Confirmar Agendamento"}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          6. GARANTIAS & COMPROMISSOS (TEMA CLARO)
      ========================================== */}
      <section id="garantias" className="py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: FileCheck2,
              tag: "VISTORIA DEKRA",
              title: "Laudo Cautelar 100% Aprovado",
              desc: "Nenhum veículo do nosso pátio possui passagem por leilão, sinistro ou adulteração estrutural. Entregamos o laudo impresso na compra.",
            },
            {
              icon: Award,
              tag: "GARANTIA MECÂNICA",
              title: "Até 1 Ano de Garantia Gestauto",
              desc: "Cobertura nacional para motor e câmbio, além de assistência 24h com guincho e carro reserva em todo o território brasileiro.",
            },
            {
              icon: Fuel,
              tag: "ENTREGA IMEDIATA",
              title: "Tanque Cheio & Transferência Ágil",
              desc: "Despachante próprio integrado ao Detran-RS para emissão do CRLV digital no mesmo dia da aprovação do contrato.",
            },
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <div
                key={i}
                className="p-7 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between"
              >
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-700">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                    {item.tag}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ==========================================
          7. RODAPÉ INSTITUCIONAL
      ========================================== */}
      <footer className="bg-slate-900 text-slate-300 py-14 mt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-10 border-b border-slate-800 items-center">
            <div className="lg:col-span-7 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center">
                  <Car className="w-5 h-5" />
                </div>
                <span className="text-lg font-black tracking-tight text-white">
                  PRIME<span className="text-blue-400">MOTORS</span>
                </span>
              </div>
              <p className="text-sm text-slate-400 max-w-lg">
                Comércio de Veículos Multimarcas Ltda. Seminovos periciados com financiamento
                imediato e avaliação justa do seu usado na troca.
              </p>
              <div className="flex flex-wrap items-center gap-6 pt-1 text-xs text-slate-400">
                <span className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-blue-400" /> Av. Ipiranga, 4500 — Porto Alegre, RS
                </span>
                <span className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-blue-400" /> (51) 99358-3936
                </span>
              </div>
            </div>

            <div className="lg:col-span-5 flex lg:justify-end">
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                  "Olá! Vi o estoque da Prime Motors no site e gostaria de falar com um consultor."
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() =>
                  trackMetaEvent("Contact", {
                    content_name: "Footer WhatsApp Prime Motors",
                  })
                }
                className="px-6 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2.5 shadow-lg"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chamar Vendedor no WhatsApp</span>
              </a>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <p>© {CURRENT_YEAR} Prime Motors Seminovos. Todos os direitos reservados.</p>
            <p>
              Tecnologia & Design por <strong className="text-white">FocusPulse</strong>
            </p>
          </div>
        </div>
      </footer>

      {/* ==========================================
          MODAL DE FICHA TÉCNICA & LAUDO DO VEÍCULO
      ========================================== */}
      <AnimatePresence>
        {selectedVehicleModal && (
          <div
            onClick={() => setSelectedVehicleModal(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white border border-slate-200 shadow-2xl no-scrollbar"
            >
              <div className="relative h-64 sm:h-72 w-full bg-slate-100">
                <Image
                  src={selectedVehicleModal.image}
                  alt={selectedVehicleModal.model}
                  fill
                  unoptimized
                  className="object-cover"
                />
                <button
                  type="button"
                  onClick={() => setSelectedVehicleModal(null)}
                  className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/95 border border-slate-200 text-slate-900 flex items-center justify-center hover:bg-slate-900 hover:text-white transition-colors shadow"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="absolute bottom-3 left-4 flex gap-2">
                  <span className="px-3 py-1 rounded-lg bg-emerald-600 text-white text-xs font-bold shadow">
                    Laudo Dekra 100% Aprovado
                  </span>
                  {selectedVehicleModal.ipvaPaid && (
                    <span className="px-3 py-1 rounded-lg bg-blue-700 text-white text-xs font-bold shadow">
                      IPVA {CURRENT_YEAR} Pago
                    </span>
                  )}
                </div>
              </div>

              <div className="p-6 sm:p-8 space-y-6">
                <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 pb-5">
                  <div>
                    <span className="text-xs font-extrabold uppercase tracking-wider text-blue-700">
                      {selectedVehicleModal.brand} • {selectedVehicleModal.year}
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-black text-slate-900">
                      {selectedVehicleModal.model}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">{selectedVehicleModal.version}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-400 line-through block">
                      FIPE: {formatBRL(selectedVehicleModal.fipePrice)}
                    </span>
                    <span className="text-2xl font-black text-blue-700">
                      {formatBRL(selectedVehicleModal.price)}
                    </span>
                  </div>
                </div>

                {/* Tabela de Especificações */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 block">QUILOMETRAGEM</span>
                    <strong className="text-slate-900">{selectedVehicleModal.km}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 block">CÂMBIO</span>
                    <strong className="text-slate-900">{selectedVehicleModal.transmission}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 block">POTÊNCIA</span>
                    <strong className="text-slate-900">{selectedVehicleModal.power}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 block">COMBUSTÍVEL</span>
                    <strong className="text-slate-900">{selectedVehicleModal.fuel}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 block">COR</span>
                    <strong className="text-slate-900">{selectedVehicleModal.exteriorColor}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 block">FINAL DA PLACA</span>
                    <strong className="text-slate-900">{selectedVehicleModal.plateEnd}</strong>
                  </div>
                </div>

                {/* Opcionais e Destaques */}
                <div>
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-3">
                    Destaques & Histórico deste Veículo
                  </h4>
                  <div className="space-y-2.5">
                    {selectedVehicleModal.highlights.map((h, i) => (
                      <div key={i} className="flex items-start gap-2.5 text-sm text-slate-700">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setSimVehicle(selectedVehicleModal);
                      setSelectedVehicleModal(null);
                      document
                        .getElementById("financiamento")
                        ?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="py-3.5 px-5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs uppercase tracking-wider"
                  >
                    Simular Parcelas / Troca
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setTdVehicle(selectedVehicleModal);
                      setSelectedVehicleModal(null);
                      document
                        .getElementById("agendamento")
                        ?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="py-3.5 px-5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs uppercase tracking-wider"
                  >
                    Agendar Visita p/ Este Carro
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