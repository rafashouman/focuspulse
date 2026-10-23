"use client";

import React, { useEffect, useState, useMemo, useCallback, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Clock,
  Users,
  Sparkles,
  Flame,
  ShieldCheck,
  LogIn,
  CheckCircle2,
  AlertTriangle,
  MessageCircle,
  X,
  ShoppingBag,
  Plus,
  Minus,
  Utensils,
  LayoutDashboard,
  Volume2,
  VolumeX,
  Search,
  Check,
  ChefHat,
  Bike,
  Store,
  TrendingUp,
  Timer,
  Receipt,
  ArrowRight,
  BellRing,
} from "lucide-react";
import { onAuthStateChanged, signInWithPopup, User } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase/client";
import { bookAppointment } from "@/app/actions/bookAppointment";
import { trackMetaEvent } from "@/components/MetaPixel";

// ==========================================
// WEB AUDIO SYNTHESIZER (ZERO EXTERNAL ASSETS)
// ==========================================
class KobraSoundEngine {
  private ctx: AudioContext | null = null;
  public enabled: boolean = true;

  private init() {
    if (typeof window === "undefined") return;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  playClick() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(520, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(180, this.ctx.currentTime + 0.045);
    gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.045);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.05);
  }

  playAddCart() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    [440, 660].forEach((freq, i) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now + i * 0.06);
      gain.gain.setValueAtTime(0.14, now + i * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.008, now + i * 0.06 + 0.12);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + i * 0.06);
      osc.stop(now + i * 0.06 + 0.13);
    });
  }

  playSuccessBell() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    [587.33, 880, 1174.66].forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);
      gain.gain.setValueAtTime(0.18, now + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.005, now + idx * 0.08 + 0.35);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 0.36);
    });
  }

  playError() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(160, now);
    osc.frequency.linearRampToValueAtTime(110, now + 0.22);
    gain.gain.setValueAtTime(0.15, now);
    gain.gain.linearRampToValueAtTime(0.01, now + 0.22);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.24);
  }
}

// ==========================================
// CATALOGO COMPLETO DE PRODUTOS & DADOS
// ==========================================
export type KobraCategoryId = "todos" | "smash" | "artesanais" | "sides" | "drinks" | "desserts";

export interface KobraAddon {
  id: string;
  name: string;
  price: number;
}

export interface KobraMenuItem {
  id: string;
  name: string;
  tagline: string;
  description: string;
  price: number;
  category: KobraCategoryId;
  image: string;
  calories: string;
  prepTime: string;
  spicy?: number;
  badge?: string;
  allowDoneness?: boolean;
}

export interface KobraCartItem {
  cartItemId: string;
  product: KobraMenuItem;
  quantity: number;
  doneness?: string;
  addons: KobraAddon[];
  notes?: string;
  unitFinalPrice: number;
}

export interface KobraOrderRecord {
  id: string;
  customer: string;
  mode: "DELIVERY" | "PICKUP" | "MESA VIP";
  itemsSummary: string;
  total: number;
  status: "PREPARANDO" | "NA BRASA" | "PRONTO" | "ENTREGUE";
  createdAt: string;
  prepMinutes: number;
  avatarImg: string;
}

export const KOBRA_ADDONS: KobraAddon[] = [
  { id: "add-bacon", name: "Duplo Bacon Defumado em Macieira", price: 8.0 },
  { id: "add-cheddar", name: "Pool de Cheddar Inglês Derretido", price: 9.0 },
  { id: "add-patty", name: "Smash Extra 100g (Blend Wagyu)", price: 14.0 },
  { id: "add-truffle", name: "Maionese de Trufas Negras (Pote)", price: 6.0 },
];

export const KOBRA_MENU_ITEMS: KobraMenuItem[] = [
  {
    id: "b-01",
    name: "Wagyu Truffle Melt",
    tagline: "A Obra-Prima da Casa",
    description:
      "Duplo blend Wagyu 180g selado na manteiga clarificada, queijo Gruyère derretido, cebola caramelizada no Bourbon e aioli de trufas negras no brioche artesanal.",
    price: 48.9,
    category: "artesanais",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=80",
    calories: "780 kcal",
    prepTime: "18 min",
    badge: "Chef's Signature",
    allowDoneness: true,
  },
  {
    id: "b-02",
    name: "Diablo Jalapeño Smash",
    tagline: "Crosta Perfeita & Picância na Medida",
    description:
      "Dois discos de 90g ultra-prensados com borda rendada crocante, American Cheese duplo, picles de jalapeño artesanal, bacon crispy e molho Kobra Fire.",
    price: 38.9,
    category: "smash",
    image: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=900&q=80",
    calories: "640 kcal",
    prepTime: "12 min",
    spicy: 2,
    badge: "Top #1 Vendas",
    allowDoneness: false,
  },
  {
    id: "b-03",
    name: "Smoked Brisket Monster",
    tagline: "12 Horas de Defumação",
    description:
      "Hambúrguer alto de 180g coberto com 100g de peito bovino desfiado defumado em lenha frutífera, anéis de cebola empanados na cerveja e barbecue de café.",
    price: 52.9,
    category: "artesanais",
    image: "https://images.unsplash.com/photo-1553979459-d2229ba7433b?auto=format&fit=crop&w=900&q=80",
    calories: "890 kcal",
    prepTime: "20 min",
    badge: "Edição Limitada",
    allowDoneness: true,
  },
  {
    id: "b-04",
    name: "Oklahoma Onion Ultra",
    tagline: "Clássico Americano Executado à Perfeição",
    description:
      "Dois smash burgers prensados diretamente sobre uma cama generosa de cebolas fatiadas finíssimas, queijo prato derretido, picles da casa e mostarda Dijon.",
    price: 34.9,
    category: "smash",
    image: "https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?auto=format&fit=crop&w=900&q=80",
    calories: "590 kcal",
    prepTime: "10 min",
    allowDoneness: false,
  },
  {
    id: "s-01",
    name: "Truffle Parmesan Fries",
    tagline: "Crocância Tripla",
    description:
      "Batatas corte rústico fritas em três tempos, finalizadas com azeite trufado, chuva de grana padano ralado na hora e alecrim fresco.",
    price: 24.9,
    category: "sides",
    image: "https://images.unsplash.com/photo-1576107232684-1279f3908594?auto=format&fit=crop&w=900&q=80",
    calories: "420 kcal",
    prepTime: "8 min",
    badge: "Imperdível",
  },
  {
    id: "s-02",
    name: "Nashville Hot Tenders",
    tagline: "Frango Crocante Picante",
    description:
      "Tiras de peito de frango marinadas no buttermilk, empanadas na farinha Panko com especiarias de Nashville. Acompanha molho Ranch de ervas.",
    price: 29.9,
    category: "sides",
    image: "https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=900&q=80",
    calories: "480 kcal",
    prepTime: "12 min",
    spicy: 2,
  },
  {
    id: "d-01",
    name: "Crimson Berry Craft Soda",
    tagline: "Fermentação Natural da Casa",
    description:
      "Soda artesanal feita com redução de frutas vermelhas silvestres, toque de gengibre fresco, limão siciliano e água intensamente gaseificada (350ml).",
    price: 16.9,
    category: "drinks",
    image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=900&q=80",
    calories: "110 kcal",
    prepTime: "3 min",
  },
  {
    id: "d-02",
    name: "Salted Caramel Bourbon Shake",
    tagline: "Ultra Cremoso",
    description:
      "Sorvete artesanal de fava de baunilha batido com caramelo salgado puxado na manteiga, flor de sal e chantilly tostado no maçarico (400ml).",
    price: 26.9,
    category: "drinks",
    image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=900&q=80",
    calories: "610 kcal",
    prepTime: "5 min",
    badge: "Best Seller",
  },
  {
    id: "ds-01",
    name: "Basque Burnt Cheesecake",
    tagline: "Interior Cremoso & Topo Caramelizado",
    description:
      "Cheesecake ao estilo de San Sebastián, assado em altíssima temperatura para criar uma casca caramelizada única e centro fluído. Acompanha calda de frutas vermelhas.",
    price: 28.9,
    category: "desserts",
    image: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=900&q=80",
    calories: "490 kcal",
    prepTime: "5 min",
  },
];

const KOBRA_SLOTS = ["19:00", "20:00", "21:00", "22:00", "23:00"];

const SEATING_ZONES = [
  {
    id: "balcao-chef",
    name: "Balcão Fire Pit",
    desc: "Frente à chapa • Degustação guiada",
    badge: "Alta Demanda",
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "booth-neon",
    name: "Booth Ember Lounge",
    desc: "Sofás reservados • Som ambiente",
    badge: "Ideal p/ Grupos",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "salao-lab",
    name: "Salão Principal Lab",
    desc: "Mesas centrais • Clima urbano",
    badge: "Clássico",
    image: "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=600&q=80",
  },
];

const INITIAL_ORDERS: KobraOrderRecord[] = [
  {
    id: "KBR-8841",
    customer: "Lucas M.",
    mode: "DELIVERY",
    itemsSummary: "2x Diablo Jalapeño Smash, 1x Truffle Parmesan Fries",
    total: 102.7,
    status: "NA BRASA",
    createdAt: "Há 4 min",
    prepMinutes: 14,
    avatarImg: KOBRA_MENU_ITEMS[1].image,
  },
  {
    id: "KBR-8840",
    customer: "Fernanda R.",
    mode: "MESA VIP",
    itemsSummary: "1x Wagyu Truffle Melt, 1x Salted Caramel Shake",
    total: 75.8,
    status: "PRONTO",
    createdAt: "Há 9 min",
    prepMinutes: 18,
    avatarImg: KOBRA_MENU_ITEMS[0].image,
  },
  {
    id: "KBR-8839",
    customer: "Thiago S.",
    mode: "PICKUP",
    itemsSummary: "1x Smoked Brisket Monster, 1x Nashville Hot Tenders",
    total: 82.8,
    status: "PREPARANDO",
    createdAt: "Agora",
    prepMinutes: 20,
    avatarImg: KOBRA_MENU_ITEMS[2].image,
  },
];

interface KobraTableBookingProps {
  embedded?: boolean;
  whatsappNumber?: string;
  onClose?: () => void;
  initialTab?: "pos" | "booking" | "dashboard";
}

export default function KobraTableBooking({
  embedded = false,
  whatsappNumber = "5511999999999",
  onClose,
  initialTab = "pos",
}: KobraTableBookingProps) {
  const soundRef = useRef<KobraSoundEngine | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [activeTab, setActiveTab] = useState<"pos" | "booking" | "dashboard">(initialTab);
  const [visualToast, setVisualToast] = useState<{ title: string; subtitle: string } | null>(null);

  // POS & Menu State
  const [activeCategory, setActiveCategory] = useState<KobraCategoryId>("todos");
  const [searchQuery, setSearchQuery] = useState("");
  const [orderMode, setOrderMode] = useState<"DELIVERY" | "PICKUP">("DELIVERY");
  const [cart, setCart] = useState<KobraCartItem[]>([
    {
      cartItemId: "initial-wagyu",
      product: KOBRA_MENU_ITEMS[0],
      quantity: 1,
      doneness: "Ao Ponto do Chef (Rosado)",
      addons: [KOBRA_ADDONS[0]],
      unitFinalPrice: KOBRA_MENU_ITEMS[0].price + KOBRA_ADDONS[0].price,
    },
  ]);
  const [customizingProduct, setCustomizingProduct] = useState<KobraMenuItem | null>(null);
  const [modalDoneness, setModalDoneness] = useState("Ao Ponto do Chef (Rosado)");
  const [modalAddons, setModalAddons] = useState<KobraAddon[]>([]);
  const [modalNotes, setModalNotes] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");

  // Dashboard Live Orders State
  const [liveOrders, setLiveOrders] = useState<KobraOrderRecord[]>(INITIAL_ORDERS);

  // Table Booking State
  const [selectedDate, setSelectedDate] = useState("");
  const [minDate, setMinDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState<string | null>("20:00");
  const [guests, setGuests] = useState<number>(2);
  const [selectedZone, setSelectedZone] = useState(SEATING_ZONES[0]);
  const [status, setStatus] = useState<"IDLE" | "LOADING" | "SUCCESS" | "ERROR">("IDLE");
  const [feedbackMsg, setFeedbackMsg] = useState("");
  const [protocolCode, setProtocolCode] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    soundRef.current = new KobraSoundEngine();
    const unsubscribe = onAuthStateChanged(auth, setUser);
    const frameId = requestAnimationFrame(() => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const formatted = [
        tomorrow.getFullYear(),
        String(tomorrow.getMonth() + 1).padStart(2, "0"),
        String(tomorrow.getDate()).padStart(2, "0"),
      ].join("-");
      setSelectedDate(formatted);
      setMinDate(formatted);
    });

    return () => {
      unsubscribe();
      cancelAnimationFrame(frameId);
    };
  }, []);

  const triggerToast = useCallback((title: string, subtitle: string) => {
    setVisualToast({ title, subtitle });
    setTimeout(() => {
      setVisualToast((prev) => (prev?.title === title ? null : prev));
    }, 3200);
  }, []);

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    if (soundRef.current) {
      soundRef.current.enabled = next;
      if (next) soundRef.current.playClick();
    }
  };

  // Filtered Menu
  const filteredProducts = useMemo(() => {
    return KOBRA_MENU_ITEMS.filter((item) => {
      const matchCat = activeCategory === "todos" || item.category === activeCategory;
      const matchSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [activeCategory, searchQuery]);

  // Cart Calculations
  const cartSubtotal = useMemo(
    () => cart.reduce((acc, item) => acc + item.unitFinalPrice * item.quantity, 0),
    [cart]
  );
  const deliveryFee = orderMode === "PICKUP" || cartSubtotal >= 95 || cartSubtotal === 0 ? 0 : 9.9;
  const cartTotal = cartSubtotal + deliveryFee;

  // Handlers
  const handleQuickAdd = (product: KobraMenuItem) => {
    soundRef.current?.playAddCart();
    trackMetaEvent("AddToCart", {
      content_ids: [product.id],
      content_name: product.name,
      value: product.price,
      currency: "BRL",
    });
    setCart((prev) => {
      const existing = prev.find(
        (i) => i.product.id === product.id && i.addons.length === 0 && !i.notes
      );
      if (existing) {
        return prev.map((i) =>
          i.cartItemId === existing.cartItemId ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [
        ...prev,
        {
          cartItemId: `${product.id}-${Date.now()}`,
          product,
          quantity: 1,
          doneness: product.allowDoneness ? "Ao Ponto do Chef (Rosado)" : undefined,
          addons: [],
          unitFinalPrice: product.price,
        },
      ];
    });
    triggerToast(`${product.name} na Comanda!`, `+ R$ ${product.price.toFixed(2)} adicionado`);
  };

  const handleConfirmCustomProduct = () => {
    if (!customizingProduct) return;
    soundRef.current?.playAddCart();
    const addonsPrice = modalAddons.reduce((s, a) => s + a.price, 0);
    const unitFinalPrice = customizingProduct.price + addonsPrice;

    setCart((prev) => [
      ...prev,
      {
        cartItemId: `${customizingProduct.id}-${Date.now()}`,
        product: customizingProduct,
        quantity: 1,
        doneness: customizingProduct.allowDoneness ? modalDoneness : undefined,
        addons: modalAddons,
        notes: modalNotes.trim() || undefined,
        unitFinalPrice,
      },
    ]);
    triggerToast(`${customizingProduct.name} Personalizado!`, "Item enviado para a comanda ativa");
    setCustomizingProduct(null);
  };

  const updateCartItemQty = (id: string, delta: number) => {
    soundRef.current?.playClick();
    setCart((prev) =>
      prev
        .map((item) => (item.cartItemId === id ? { ...item, quantity: item.quantity + delta } : item))
        .filter((item) => item.quantity > 0)
    );
  };

  const handleDispatchOrderToKDS = (e: React.FormEvent) => {

    e.preventDefault();
    if (cart.length === 0) {
      soundRef.current?.playError();
      return;
    }
    soundRef.current?.playSuccessBell();
    const code = `KBR-${Math.floor(1000 + Math.random() * 9000)}`;
    const summary = cart.map((i) => `${i.quantity}x ${i.product.name}`).join(", ");

    trackMetaEvent("Purchase", {
      content_name: "Pedido KDS App",
      value: Number(cartTotal.toFixed(2)),
      currency: "BRL",
      order_id: code,
    });

    const newOrder: KobraOrderRecord = {
      id: code,
      customer: customerName.trim() || user?.displayName || "Cliente Express",
      mode: orderMode,
      itemsSummary: summary,
      total: cartTotal,
      status: "PREPARANDO",
      createdAt: "Agora mesmo",
      prepMinutes: 16,
      avatarImg: cart[0].product.image,
    };

    setLiveOrders((prev) => [newOrder, ...prev]);
    triggerToast(`Pedido #${code} Disparado!`, "Sincronizado com o KDS da Cozinha em tempo real");

    const waMsg = `*PEDIDO CONFIRMADO — KOBRA BURGER APP* 🔥🍔\n*Protocolo KDS:* #${code}\n*Cliente:* ${newOrder.customer}\n*Modalidade:* ${orderMode}\n${orderMode === "DELIVERY" && customerAddress ? `*Endereço:* ${customerAddress}\n` : ""
      }----------------------------------\n*Itens:* ${summary}\n*Total:* R$ ${cartTotal.toFixed(2)}`;

    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(waMsg)}`, "_blank");
    setCart([]);
    setActiveTab("dashboard");
  };

  const cycleOrderStatus = (orderId: string) => {
    soundRef.current?.playSuccessBell();
    const orderFlow: KobraOrderRecord["status"][] = ["PREPARANDO", "NA BRASA", "PRONTO", "ENTREGUE"];
    setLiveOrders((prev) =>
      prev.map((o) => {
        if (o.id !== orderId) return o;
        const nextIdx = (orderFlow.indexOf(o.status) + 1) % orderFlow.length;
        const nextStatus = orderFlow[nextIdx];
        triggerToast(`Status Atualizado: #${orderId}`, `Movido para [${nextStatus}]`);
        return { ...o, status: nextStatus };
      })
    );
  };

  const handleLogin = async () => {
    soundRef.current?.playClick();
    setStatus("LOADING");
    try {
      await signInWithPopup(auth, googleProvider);
      soundRef.current?.playSuccessBell();
      setStatus("IDLE");
      setFeedbackMsg("");
      triggerToast("Operador Autenticado", "Sessão Firebase Auth validada");
    } catch (error) {
      console.error("Unable to sign in before table booking.", error);
      soundRef.current?.playError();
      setStatus("ERROR");
      setFeedbackMsg("Não foi possível autenticar com o Google. Tente novamente.");
    }
  };

  const handleBooking = async () => {
    if (!selectedSlot) return;

    trackMetaEvent("Schedule", {
      content_name: `Reserva Mesa VIP - ${selectedZone.name}`,
      guests,
      slot: selectedSlot,
    });

    if (!user) {
      soundRef.current?.playError();
      setStatus("ERROR");
      setFeedbackMsg("Conecte sua conta Google para travar a mesa no sistema.");
      return;
    }

    soundRef.current?.playClick();
    setStatus("LOADING");
    try {
      const token = await user.getIdToken();
      const serviceSummary = `KOBRA VIP • ${selectedZone.name} (${guests} pessoas)`;

      const res = await bookAppointment(
        {
          date: selectedDate,
          timeSlot: selectedSlot,
          serviceName: serviceSummary,
          guests,
          seatingZone: selectedZone.name,
        },
        token
      );

      if (res.success) {
        soundRef.current?.playSuccessBell();
        const shortCode = res.bookingId?.slice(-6).toUpperCase() || "KBR99";
        setProtocolCode(shortCode);
        setStatus("SUCCESS");
        setFeedbackMsg(
          `Mesa travada às ${selectedSlot} (${selectedZone.name}) • Protocolo #${shortCode}`
        );

        // Injeta no Dashboard KDS como reserva VIP
        setLiveOrders((prev) => [
          {
            id: `VIP-${shortCode}`,
            customer: user.displayName || "Membro VIP",
            mode: "MESA VIP",
            itemsSummary: `Reserva: ${selectedZone.name} (${guests} lugares às ${selectedSlot})`,
            total: 0,
            status: "PRONTO",
            createdAt: "Reserva Ativa",
            prepMinutes: 0,
            avatarImg: selectedZone.image,
          },
          ...prev,
        ]);
        triggerToast(`Mesa #${shortCode} Travada!`, `${selectedZone.name} reservado com sucesso`);
      } else {
        soundRef.current?.playError();
        setStatus("ERROR");
        setFeedbackMsg(res.error || "Erro ao processar reserva.");
      }
    } catch (error) {
      console.error("Unable to submit appointment booking.", error);
      soundRef.current?.playError();
      setStatus("ERROR");
      setFeedbackMsg("Falha de conexão com o servidor de reservas.");
    }
  };

  const handleSendWhatsAppTicket = () => {
    if (!protocolCode || !selectedSlot) return;
    soundRef.current?.playClick();
    const text = `*RESERVA CONFIRMADA — KOBRA.LAB* 🔥🍔\n----------------------------------\n*Protocolo Firestore:* #${protocolCode}\n*Cliente:* ${user?.displayName || user?.email || "VIP"
      }\n*Data:* ${selectedDate}\n*Horário:* ${selectedSlot}\n*Lugares:* ${guests} pessoas\n*Ambiente:* ${selectedZone.name
      }\n----------------------------------\n_Reserva validada via Lock Transacional._`;

    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`, "_blank");
  };

  // Dashboard Metrics
  const totalRevenueToday = useMemo(
    () => liveOrders.reduce((acc, o) => acc + o.total, 0) + 1840.5,
    [liveOrders]
  );

  return (
    <div
      className={`${embedded
        ? "w-full rounded-[2.5rem] bg-[#0B0908] border border-orange-500/30 shadow-[0_0_90px_rgba(234,88,12,0.12)]"
        : "min-h-screen bg-[#070605] flex items-center justify-center p-4 sm:p-8"
        } text-zinc-100 font-sans relative overflow-hidden`}
    >
      {/* Visual Feedback Toast */}
      <AnimatePresence>
        {visualToast && (
          <motion.div
            initial={{ opacity: 0, y: -25, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="fixed top-24 right-6 z-50 flex items-center gap-3.5 px-5 py-3.5 rounded-2xl bg-zinc-950/95 border-2 border-orange-500 shadow-[0_0_35px_rgba(234,88,12,0.45)] backdrop-blur-xl"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 text-white flex items-center justify-center shrink-0">
              <BellRing className="w-5 h-5 animate-bounce" />
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-wider text-white">
                {visualToast.title}
              </p>
              <p className="text-[11px] font-mono text-orange-400">{visualToast.subtitle}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div
        className={`${embedded
          ? "p-5 sm:p-8 lg:p-10 w-full"
          : "w-full max-w-7xl rounded-[2.5rem] bg-[#0B0908] border border-zinc-800 p-6 sm:p-10 shadow-2xl"
          } relative z-10`}
      >
        {/* Ambient Ember Glows */}
        <div className="absolute -top-28 -right-28 w-96 h-96 bg-orange-600/15 rounded-full blur-[130px] pointer-events-none" />
        <div className="absolute -bottom-28 -left-28 w-96 h-96 bg-red-600/10 rounded-full blur-[130px] pointer-events-none" />

        {/* ==========================================
            1. TOP COMMAND BAR & NAVIGATION TABS
        ========================================== */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-zinc-800/90 pb-6 mb-8">
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 via-red-600 to-amber-500 flex items-center justify-center text-white shadow-[0_0_30px_rgba(234,88,12,0.4)] shrink-0">
              <Flame className="w-6 h-6 fill-current" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-widest text-orange-400 bg-orange-500/10 border border-orange-500/20 px-2.5 py-0.5 rounded-full">
                  <Sparkles className="w-3 h-3" /> Kobra Sales Engine v4.2
                </span>
                <span className="text-[11px] font-mono text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 rounded-full">
                  ● KDS LIVE
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white">
                Central de <span className="text-orange-500 italic">Vendas & Operação</span>
              </h2>
            </div>
          </div>

          {/* Interactive Mode Switcher */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex items-center bg-zinc-900/90 border border-zinc-800 p-1.5 rounded-2xl">
              <button
                type="button"
                onClick={() => {
                  soundRef.current?.playClick();
                  setActiveTab("pos");
                }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${activeTab === "pos"
                  ? "bg-gradient-to-r from-orange-600 to-red-600 text-white shadow-[0_0_20px_rgba(234,88,12,0.35)]"
                  : "text-zinc-400 hover:text-white"
                  }`}
              >
                <Utensils className="w-4 h-4" />
                <span>Cardápio & PDV</span>
                <span className="px-1.5 py-0.5 rounded bg-black/30 font-mono text-[10px]">
                  {KOBRA_MENU_ITEMS.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  soundRef.current?.playClick();
                  setActiveTab("dashboard");
                }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${activeTab === "dashboard"
                  ? "bg-gradient-to-r from-orange-600 to-red-600 text-white shadow-[0_0_20px_rgba(234,88,12,0.35)]"
                  : "text-zinc-400 hover:text-white"
                  }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard Pedidos</span>
                <span className="px-1.5 py-0.5 rounded bg-black/30 font-mono text-[10px]">
                  {liveOrders.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  soundRef.current?.playClick();
                  setActiveTab("booking");
                }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${activeTab === "booking"
                  ? "bg-gradient-to-r from-orange-600 to-red-600 text-white shadow-[0_0_20px_rgba(234,88,12,0.35)]"
                  : "text-zinc-400 hover:text-white"
                  }`}
              >
                <Calendar className="w-4 h-4" />
                <span>Mesas VIP</span>
              </button>
            </div>

            {/* Audio FX Toggle */}
            <button
              type="button"
              onClick={toggleSound}
              title={soundEnabled ? "Sons de Cozinha Ativos" : "Sons Silenciados"}
              className={`p-3 rounded-2xl border transition-all ${soundEnabled
                ? "bg-orange-500/15 border-orange-500/40 text-orange-400"
                : "bg-zinc-900 border-zinc-800 text-zinc-500"
                }`}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {onClose && (
              <button
                onClick={onClose}
                className="p-3 rounded-2xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-orange-500 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* ==========================================
            TAB 1: CARDÁPIO INTERATIVO & PDV DE VENDAS
        ========================================== */}
        {activeTab === "pos" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left 8 Cols: Full Menu with Images */}
            <div className="lg:col-span-8 space-y-6">
              {/* Filter & Search Bar */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-zinc-900/60 border border-zinc-800/90 p-3 rounded-2xl">
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 no-scrollbar">
                  {[
                    { id: "todos", label: "Todos (9)" },
                    { id: "artesanais", label: "Wagyu Altos" },
                    { id: "smash", label: "Ultra Smash" },
                    { id: "sides", label: "Porções" },
                    { id: "drinks", label: "Drinks & Shakes" },
                    { id: "desserts", label: "Doces" },
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => {
                        soundRef.current?.playClick();
                        setActiveCategory(cat.id as KobraCategoryId);
                      }}
                      className={`px-3.5 py-2 rounded-xl text-[11px] font-black uppercase tracking-wider whitespace-nowrap transition-all ${activeCategory === cat.id
                        ? "bg-orange-500 text-zinc-950 shadow-[0_0_15px_rgba(249,115,22,0.4)]"
                        : "bg-zinc-950/80 text-zinc-400 hover:text-white border border-zinc-800"
                        }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>

                <div className="relative w-full sm:w-56 shrink-0">
                  <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Filtrar prato ou ingrediente..."
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              {/* Products Grid (All with High-Res Images) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredProducts.map((item) => (
                  <motion.div
                    layout
                    key={item.id}
                    whileHover={{ y: -3 }}
                    className="group rounded-2xl bg-zinc-900/50 border border-zinc-800/90 hover:border-orange-500/60 overflow-hidden flex flex-col justify-between transition-all shadow-lg"
                  >
                    <div>
                      <div className="relative h-40 w-full overflow-hidden bg-zinc-950">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          unoptimized
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-black/30" />
                        {item.badge && (
                          <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-md bg-gradient-to-r from-orange-600 to-red-600 text-white font-mono text-[10px] font-bold uppercase shadow">
                            {item.badge}
                          </span>
                        )}
                        <span className="absolute bottom-2 right-2.5 px-2 py-0.5 rounded bg-zinc-950/85 border border-zinc-800 font-mono text-[10px] text-amber-400">
                          {item.prepTime} • {item.calories}
                        </span>
                      </div>

                      <div className="p-4">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-orange-400 block mb-0.5">
                          {item.tagline}
                        </span>
                        <h3 className="text-sm font-black uppercase text-white group-hover:text-orange-400 transition-colors">
                          {item.name}
                        </h3>
                        <p className="text-[11px] text-zinc-400 line-clamp-2 mt-1 leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </div>

                    <div className="px-4 pb-4 pt-2.5 border-t border-zinc-800/60 flex items-center justify-between gap-2">
                      <span className="text-base font-black text-white">
                        R$ {item.price.toFixed(2)}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            soundRef.current?.playClick();
                            setCustomizingProduct(item);
                            setModalAddons([]);
                            setModalNotes("");
                          }}
                          className="px-2.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-[10px] font-bold uppercase text-zinc-200 transition-colors"
                        >
                          Opções
                        </button>
                        <button
                          type="button"
                          onClick={() => handleQuickAdd(item)}
                          className="p-2 rounded-lg bg-orange-500 hover:bg-orange-400 text-zinc-950 font-black transition-transform active:scale-90 shadow-[0_0_15px_rgba(249,115,22,0.4)]"
                          title="Adicionar Rápido"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Right 4 Cols: Live Order Terminal / Checkout */}
            <div className="lg:col-span-4 rounded-3xl bg-zinc-950/95 border border-orange-500/30 p-5 sm:p-6 sticky top-24 shadow-2xl">
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-zinc-800">
                <div className="flex items-center gap-2.5">
                  <ShoppingBag className="w-5 h-5 text-orange-500" />
                  <div>
                    <h3 className="text-base font-black uppercase tracking-tight text-white">
                      Terminal de Pedido
                    </h3>
                    <span className="text-[10px] font-mono uppercase text-zinc-400">
                      Comanda Digital Direta
                    </span>
                  </div>
                </div>

                <div className="flex bg-zinc-900 p-1 rounded-xl border border-zinc-800">
                  <button
                    type="button"
                    onClick={() => {
                      soundRef.current?.playClick();
                      setOrderMode("DELIVERY");
                    }}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase flex items-center gap-1 transition-all ${orderMode === "DELIVERY"
                      ? "bg-orange-500 text-zinc-950"
                      : "text-zinc-400 hover:text-white"
                      }`}
                  >
                    <Bike className="w-3 h-3" /> Delivery
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      soundRef.current?.playClick();
                      setOrderMode("PICKUP");
                    }}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase flex items-center gap-1 transition-all ${orderMode === "PICKUP"
                      ? "bg-orange-500 text-zinc-950"
                      : "text-zinc-400 hover:text-white"
                      }`}
                  >
                    <Store className="w-3 h-3" /> Balcão
                  </button>
                </div>
              </div>

              {/* Cart Items List with Mini Thumbnails */}
              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1 mb-5">
                {cart.length === 0 ? (
                  <div className="py-12 text-center border border-dashed border-zinc-800 rounded-2xl">
                    <Utensils className="w-8 h-8 text-zinc-700 mx-auto mb-2" />
                    <p className="text-xs font-bold text-zinc-400">Comanda Vazia</p>
                    <p className="text-[11px] text-zinc-600 mt-0.5">
                      Clique em + nos produtos ao lado para iniciar
                    </p>
                  </div>
                ) : (
                  cart.map((item) => (
                    <motion.div
                      layout
                      key={item.cartItemId}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="p-3 rounded-2xl bg-zinc-900/80 border border-zinc-800/90 flex items-center gap-3"
                    >
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-zinc-700">
                        <Image
                          src={item.product.image}
                          alt={item.product.name}
                          fill
                          unoptimized
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-black text-white truncate">
                          {item.product.name}
                        </h4>
                        {item.doneness && (
                          <span className="text-[10px] font-mono text-orange-400 block truncate">
                            • {item.doneness}
                          </span>
                        )}
                        {item.addons.length > 0 && (
                          <span className="text-[10px] text-zinc-400 block truncate">
                            + {item.addons.map((a) => a.name).join(", ")}
                          </span>
                        )}
                        <span className="text-xs font-black text-amber-400 mt-0.5 block">
                          R$ {(item.unitFinalPrice * item.quantity).toFixed(2)}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 bg-zinc-950 border border-zinc-800 rounded-xl px-2 py-1">
                        <button
                          type="button"
                          onClick={() => updateCartItemQty(item.cartItemId, -1)}
                          className="text-zinc-400 hover:text-white"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="font-mono text-xs font-bold w-4 text-center">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateCartItemQty(item.cartItemId, 1)}
                          className="text-zinc-400 hover:text-white"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>

              {/* Customer Inputs & Totals */}
              <form onSubmit={handleDispatchOrderToKDS} className="space-y-3 pt-4 border-t border-zinc-800">
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Nome do cliente na comanda..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500"
                />
                {orderMode === "DELIVERY" && (
                  <input
                    type="text"
                    required
                    value={customerAddress}
                    onChange={(e) => setCustomerAddress(e.target.value)}
                    placeholder="Endereço completo de entrega..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500"
                  />
                )}

                <div className="p-3.5 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 space-y-1.5 text-xs">
                  <div className="flex justify-between text-zinc-400">
                    <span>Subtotal</span>
                    <span>R$ {cartSubtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>Taxa de Entrega</span>
                    <span className={deliveryFee === 0 ? "text-amber-400 font-bold" : ""}>
                      {deliveryFee === 0 ? "GRÁTIS" : `R$ ${deliveryFee.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm font-black text-white pt-2 border-t border-zinc-800">
                    <span>Total da Comanda</span>
                    <span className="text-orange-500">R$ {cartTotal.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={cart.length === 0}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-orange-600 via-red-600 to-amber-500 hover:from-orange-500 hover:to-red-500 text-white font-black uppercase tracking-wider text-xs flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(234,88,12,0.4)] transition-all disabled:opacity-40"
                >
                  <Flame className="w-4 h-4 fill-current" />
                  <span>Disparar Pedido p/ Cozinha (KDS)</span>
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ==========================================
            TAB 2: DASHBOARD DE PEDIDOS (KDS LIVE)
        ========================================== */}
        {activeTab === "dashboard" && (
          <div className="space-y-8">
            {/* Telemetry KPI Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  label: "Faturamento do Turno",
                  val: `R$ ${totalRevenueToday.toFixed(2)}`,
                  sub: "+18.4% vs ontem",
                  icon: TrendingUp,
                  accent: "text-orange-400",
                },
                {
                  label: "Comandas Ativas na Brasa",
                  val: `${liveOrders.filter((o) => o.status !== "ENTREGUE").length} Pedidos`,
                  sub: "Fluxo nominal sem gargalo",
                  icon: ChefHat,
                  accent: "text-red-400",
                },
                {
                  label: "Tempo Médio de Chapa",
                  val: "13m 40s",
                  sub: "Meta SLA: < 18 min",
                  icon: Timer,
                  accent: "text-amber-400",
                },
                {
                  label: "Ticket Médio no App",
                  val: "R$ 89,40",
                  sub: "Conversão de Adicionais: 74%",
                  icon: Receipt,
                  accent: "text-orange-500",
                },
              ].map((kpi, idx) => {
                const Icon = kpi.icon;
                return (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800/90 flex items-start justify-between"
                  >
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 block mb-1">
                        {kpi.label}
                      </span>
                      <span className="text-2xl font-black text-white tracking-tight block">
                        {kpi.val}
                      </span>
                      <span className={`text-[11px] font-mono ${kpi.accent} mt-1 block`}>
                        {kpi.sub}
                      </span>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Live KDS Kanban / Order Queue */}
            <div className="rounded-3xl bg-zinc-950/90 border border-zinc-800 p-6">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-zinc-800">
                <div>
                  <h3 className="text-lg font-black uppercase tracking-tight text-white flex items-center gap-2">
                    <ChefHat className="w-5 h-5 text-orange-500" />
                    Monitor KDS • Fila de Produção em Tempo Real
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Clique no botão de status de qualquer pedido para avançar a etapa na cozinha com alerta sonoro.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    soundRef.current?.playClick();
                    setActiveTab("pos");
                  }}
                  className="px-4 py-2.5 rounded-xl bg-orange-500/15 border border-orange-500/40 text-orange-400 hover:bg-orange-500 hover:text-zinc-950 font-black text-xs uppercase tracking-wider transition-all flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" /> Lançar Novo Pedido
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {liveOrders.map((order) => {
                  const statusStyles = {
                    PREPARANDO: "bg-amber-500/15 text-amber-400 border-amber-500/40",
                    "NA BRASA": "bg-orange-500/20 text-orange-400 border-orange-500/50 animate-pulse",
                    PRONTO: "bg-red-500/20 text-red-300 border-red-500/50",
                    ENTREGUE: "bg-zinc-800 text-zinc-400 border-zinc-700",
                  }[order.status];

                  return (
                    <motion.div
                      layout
                      key={order.id}
                      className="p-5 rounded-2xl bg-zinc-900/70 border border-zinc-800/90 flex flex-col justify-between gap-4 hover:border-orange-500/40 transition-all"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-3">
                          <span className="font-mono text-xs font-black text-orange-400 bg-orange-500/10 px-2.5 py-1 rounded-lg border border-orange-500/20">
                            #{order.id}
                          </span>
                          <span className="text-[10px] font-mono uppercase px-2.5 py-1 rounded-md bg-zinc-950 border border-zinc-800 text-zinc-300">
                            {order.mode} • {order.createdAt}
                          </span>
                        </div>

                        <div className="flex items-center gap-3 mb-3">
                          <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-zinc-700">
                            <Image
                              src={order.avatarImg}
                              alt={order.customer}
                              fill
                              unoptimized
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <h4 className="text-sm font-black text-white uppercase">
                              {order.customer}
                            </h4>
                            <p className="text-xs text-zinc-400 line-clamp-2">
                              {order.itemsSummary}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between gap-2">
                        <div>
                          <span className="text-[10px] font-mono text-zinc-500 block">TOTAL</span>
                          <span className="text-sm font-black text-white">
                            {order.total > 0 ? `R$ ${order.total.toFixed(2)}` : "VIP PASS"}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => cycleOrderStatus(order.id)}
                          className={`px-3.5 py-2 rounded-xl border font-mono text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5 transition-all ${statusStyles}`}
                        >
                          <span>{order.status}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ==========================================
            TAB 3: RESERVA ATÔMICA DE MESAS VIP
        ========================================== */}
        {activeTab === "booking" && (
          <div>
            {/* Barra de Sessão Firebase Auth */}
            <div className="mb-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 p-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400 shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 block">
                    Credencial Anti-Conflito • Firestore Atomic Lock
                  </span>
                  <p className="truncate text-xs sm:text-sm font-bold text-zinc-200">
                    {user
                      ? `Operador Autenticado: ${user.displayName || user.email}`
                      : "Conecte seu Google para bloquear uma mesa ou lounge exclusivo na fornalha."}
                  </p>
                </div>
              </div>

              {!user && (
                <button
                  type="button"
                  onClick={() => void handleLogin()}
                  disabled={status === "LOADING"}
                  className="shrink-0 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-400 hover:to-red-500 px-4 py-2.5 text-xs font-black uppercase tracking-wider text-white transition-all shadow-[0_0_20px_rgba(234,88,12,0.3)] disabled:opacity-50"
                >
                  <LogIn className="w-4 h-4" />
                  Autenticar com Google
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
              {/* Coluna Esquerda: Data & Pessoas */}
              <div className="lg:col-span-5 space-y-6 bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-5">
                <div>
                  <label className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-orange-400 font-bold mb-3">
                    <Calendar className="w-4 h-4" /> 01. Data da Experiência
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    min={minDate}
                    onChange={(e) => {
                      soundRef.current?.playClick();
                      setSelectedDate(e.target.value);
                      setStatus("IDLE");
                    }}
                    className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-white font-mono text-sm focus:outline-none focus:border-orange-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-orange-400 font-bold mb-3">
                    <Users className="w-4 h-4" /> 02. Lugares na Mesa
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {[2, 4, 6, 8].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => {
                          soundRef.current?.playClick();
                          setGuests(num);
                          setStatus("IDLE");
                        }}
                        className={`py-2.5 rounded-xl font-mono text-xs font-bold border transition-all ${guests === num
                          ? "bg-orange-500 text-zinc-950 border-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.35)]"
                          : "bg-zinc-950 text-zinc-400 border-zinc-800 hover:text-white"
                          }`}
                      >
                        {num}P
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Coluna Direita: Ambiente com Fotos & Horários */}
              <div className="lg:col-span-7 space-y-6 bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-5">
                <div>
                  <label className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-orange-400 font-bold mb-3">
                    <Sparkles className="w-4 h-4" /> 03. Zona do Laboratório (Com Prévia Visual)
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {SEATING_ZONES.map((zone) => {
                      const active = selectedZone.id === zone.id;
                      return (
                        <button
                          key={zone.id}
                          type="button"
                          onClick={() => {
                            soundRef.current?.playClick();
                            setSelectedZone(zone);
                            setStatus("IDLE");
                          }}
                          className={`group overflow-hidden rounded-xl border text-left transition-all ${active
                            ? "bg-orange-500/15 border-orange-500 text-white shadow-[0_0_20px_rgba(249,115,22,0.2)]"
                            : "bg-zinc-950/70 border-zinc-800/80 text-zinc-400 hover:text-white"
                            }`}
                        >
                          <div className="relative h-24 w-full overflow-hidden">
                            <Image
                              src={zone.image}
                              alt={zone.name}
                              fill
                              unoptimized
                              className="object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/30 to-transparent" />
                            <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/70 font-mono text-[9px] uppercase text-orange-400">
                              {zone.badge}
                            </span>
                          </div>
                          <div className="p-3">
                            <span className="text-xs font-black text-white block">
                              {zone.name}
                            </span>
                            <span className="text-[11px] text-zinc-400 line-clamp-1 mt-0.5">
                              {zone.desc}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-orange-400 font-bold mb-3">
                    <Clock className="w-4 h-4" /> 04. Turno de Fogo (Horário)
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                    {KOBRA_SLOTS.map((slot) => {
                      const isSelected = selectedSlot === slot;
                      return (
                        <motion.button
                          key={slot}
                          type="button"
                          whileHover={{ y: -2 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => {
                            soundRef.current?.playClick();
                            setSelectedSlot(slot);
                            setStatus("IDLE");
                          }}
                          className={`py-3 px-3 rounded-xl font-mono text-xs font-black border transition-all ${isSelected
                            ? "bg-orange-500 text-zinc-950 border-orange-400 shadow-[0_0_25px_rgba(249,115,22,0.4)]"
                            : "bg-zinc-950 text-zinc-300 border-zinc-800 hover:border-orange-500/50"
                            }`}
                        >
                          {slot}
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Rodapé de Confirmação da Reserva */}
            <div className="pt-6 border-t border-zinc-800/90 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <div className="flex-1">
                <AnimatePresence mode="wait">
                  {status !== "IDLE" ? (
                    <motion.div
                      key={status}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0 }}
                      className={`flex items-center gap-2.5 text-xs font-mono ${status === "ERROR"
                        ? "text-red-400"
                        : status === "SUCCESS"
                          ? "text-amber-400 font-bold"
                          : "text-orange-400"
                        }`}
                    >
                      {status === "SUCCESS" && <CheckCircle2 className="w-4 h-4 shrink-0" />}
                      {status === "ERROR" && <AlertTriangle className="w-4 h-4 shrink-0" />}
                      <span>
                        {status === "LOADING"
                          ? "Executando lock transacional no Firestore..."
                          : feedbackMsg}
                      </span>
                    </motion.div>
                  ) : (
                    <p className="text-xs font-mono text-zinc-500">
                      Resumo: <strong className="text-zinc-300">{guests} pessoas</strong> •{" "}
                      <strong className="text-zinc-300">{selectedZone.name}</strong> às{" "}
                      <strong className="text-orange-400">{selectedSlot}</strong>
                    </p>
                  )}
                </AnimatePresence>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {status === "SUCCESS" && (
                  <button
                    type="button"
                    onClick={handleSendWhatsAppTicket}
                    className="px-5 py-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-amber-500/40 text-amber-400 font-black text-xs uppercase tracking-wider flex items-center gap-2 transition-all"
                  >
                    <MessageCircle className="w-4 h-4" /> Enviar Ticket no WhatsApp
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => void handleBooking()}
                  disabled={!selectedSlot || status === "LOADING"}
                  className="px-8 py-4 rounded-xl bg-gradient-to-r from-orange-600 via-red-600 to-amber-500 hover:from-orange-500 hover:to-red-500 text-white font-black text-xs uppercase tracking-wider transition-all shadow-[0_0_30px_rgba(234,88,12,0.35)] disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {status === "LOADING" ? "Travando Horário..." : "Confirmar Reserva Atômica"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ==========================================
          MODAL DE PERSONALIZAÇÃO DE PRODUTO NO APP
      ========================================== */}
      <AnimatePresence>
        {customizingProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-lg rounded-3xl bg-zinc-950 border border-orange-500/40 overflow-hidden shadow-2xl"
            >
              <div className="relative h-48 w-full">
                <Image
                  src={customizingProduct.image}
                  alt={customizingProduct.name}
                  fill
                  unoptimized
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/30 to-transparent" />
                <button
                  type="button"
                  onClick={() => setCustomizingProduct(null)}
                  className="absolute top-4 right-4 w-9 h-9 rounded-full bg-zinc-950/80 border border-zinc-800 text-white flex items-center justify-center hover:bg-orange-500 hover:text-zinc-950 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-6 space-y-5">
                <div>
                  <span className="text-[11px] font-mono uppercase text-orange-400">
                    {customizingProduct.tagline}
                  </span>
                  <h3 className="text-xl font-black text-white uppercase">
                    {customizingProduct.name}
                  </h3>
                  <p className="text-xs text-zinc-400 mt-1">{customizingProduct.description}</p>
                </div>

                {customizingProduct.allowDoneness && (
                  <div className="space-y-2">
                    <label className="text-xs font-mono uppercase text-zinc-300 font-bold block">
                      Ponto da Carne
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {["Mal Passado", "Ao Ponto do Chef (Rosado)", "Bem Passado"].map((pt) => (
                        <button
                          key={pt}
                          type="button"
                          onClick={() => {
                            soundRef.current?.playClick();
                            setModalDoneness(pt);
                          }}
                          className={`p-2.5 rounded-xl border text-[11px] font-bold transition-all ${modalDoneness === pt
                            ? "bg-orange-500/20 border-orange-500 text-white"
                            : "bg-zinc-900 border-zinc-800 text-zinc-400"
                            }`}
                        >
                          {pt}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-xs font-mono uppercase text-zinc-300 font-bold block">
                    Adicionais de Fogo
                  </label>
                  <div className="space-y-1.5">
                    {KOBRA_ADDONS.map((addon) => {
                      const selected = modalAddons.some((a) => a.id === addon.id);
                      return (
                        <button
                          key={addon.id}
                          type="button"
                          onClick={() => {
                            soundRef.current?.playClick();
                            setModalAddons((prev) =>
                              selected
                                ? prev.filter((a) => a.id !== addon.id)
                                : [...prev, addon]
                            );
                          }}
                          className={`w-full p-3 rounded-xl border flex items-center justify-between text-left transition-all ${selected
                            ? "bg-orange-500/15 border-orange-500 text-white"
                            : "bg-zinc-900/60 border-zinc-800 text-zinc-300"
                            }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <div
                              className={`w-4 h-4 rounded flex items-center justify-center border ${selected
                                ? "bg-orange-500 border-orange-500 text-zinc-950"
                                : "border-zinc-700"
                                }`}
                            >
                              {selected && <Check className="w-3 h-3" />}
                            </div>
                            <span className="text-xs font-semibold">{addon.name}</span>
                          </div>
                          <span className="text-xs font-mono text-orange-400">
                            + R$ {addon.price.toFixed(2)}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <input
                  type="text"
                  value={modalNotes}
                  onChange={(e) => setModalNotes(e.target.value)}
                  placeholder="Observações (ex: sem picles, ponto da batata)..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500"
                />

                <button
                  type="button"
                  onClick={handleConfirmCustomProduct}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-orange-600 to-red-600 text-white font-black uppercase tracking-wider text-xs flex items-center justify-between px-5 shadow-[0_0_25px_rgba(234,88,12,0.4)]"
                >
                  <span>Inserir na Comanda</span>
                  <span>
                    R${" "}
                    {(
                      customizingProduct.price +
                      modalAddons.reduce((s, a) => s + a.price, 0)
                    ).toFixed(2)}
                  </span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}