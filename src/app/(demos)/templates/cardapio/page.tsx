"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag,
  Plus,
  Minus,
  X,
  Search,
  Sparkles,
  Clock,
  Bike,
  Store,
  Check,
  ChevronRight,
  Utensils,
  MapPin,
  MessageCircle,
  Zap,
  Award,
  Leaf,
  Send,
  Mail,
} from "lucide-react";

// ==========================================
// CONFIGURAÇÕES & DADOS DO CARDÁPIO
// ==========================================
const WHATSAPP_NUMBER = "5511999999999";
const FREE_DELIVERY_THRESHOLD = 95.0;
const DELIVERY_FEE = 9.9;
const CURRENT_YEAR = new Date().getFullYear();

type CategoryId = "todos" | "smash" | "artesanais" | "sides" | "drinks" | "desserts";

interface Addon {
  id: string;
  name: string;
  price: number;
}

interface MenuItem {
  id: string;
  name: string;
  tagline: string;
  description: string;
  price: number;
  category: CategoryId;
  image: string;
  calories: string;
  prepTime: string;
  spicy?: number; // 1 a 3
  badge?: string;
  featured?: boolean;
  allowDoneness?: boolean;
}

interface CartItem {
  cartItemId: string;
  product: MenuItem;
  quantity: number;
  doneness?: string;
  addons: Addon[];
  notes?: string;
  unitFinalPrice: number;
}

const ADDONS_LIST: Addon[] = [
  { id: "add-bacon", name: "Duplo Bacon Defumado em Macieira", price: 8.0 },
  { id: "add-cheddar", name: "Pool de Cheddar Inglês Derretido", price: 9.0 },
  { id: "add-patty", name: "Smash Extra 100g (Blend Wagyu)", price: 14.0 },
  { id: "add-truffle", name: "Maionese de Trufas Negras (Pote)", price: 6.0 },
];

const MENU_ITEMS: MenuItem[] = [
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
    featured: true,
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
    featured: true,
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

const CATEGORIES: { id: CategoryId; label: string; count: number }[] = [
  { id: "todos", label: "Menu Completo", count: MENU_ITEMS.length },
  { id: "artesanais", label: "Hambúrgueres Altos", count: 2 },
  { id: "smash", label: "Ultra Smash", count: 2 },
  { id: "sides", label: "Para Compartilhar", count: 2 },
  { id: "drinks", label: "Sodas & Shakes", count: 2 },
  { id: "desserts", label: "Sobremesas", count: 1 },
];

// ==========================================
// COMPONENTES AUXILIARES
// ==========================================
const FloatingWhatsApp = () => (
  <a
    href={`https://wa.me/${WHATSAPP_NUMBER}`}
    target="_blank"
    rel="noopener noreferrer"
    className="fixed bottom-6 right-6 z-40 group flex items-center justify-center w-14 h-14 rounded-full bg-emerald-500 hover:bg-emerald-400 text-zinc-950 shadow-[0_0_25px_rgba(16,185,129,0.5)] transition-all hover:scale-110"
  >
    <div className="absolute inset-0 rounded-full bg-emerald-500/30 animate-ping" />
    <MessageCircle className="w-7 h-7 relative z-10" />
  </a>
);

// ==========================================
// COMPONENTE PRINCIPAL DA PÁGINA
// ==========================================
export default function DeliveryMenuPage() {
  const [activeCategory, setActiveCategory] = useState<CategoryId>("todos");
  const [searchQuery, setSearchQuery] = useState("");
  const [orderMode, setOrderMode] = useState<"delivery" | "pickup">("delivery");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<MenuItem | null>(null);

  const [modalQty, setModalQty] = useState(1);
  const [modalDoneness, setModalDoneness] = useState("Ao Ponto do Chef (Rosado)");
  const [modalAddons, setModalAddons] = useState<Addon[]>([]);
  const [modalNotes, setModalNotes] = useState("");

  const [comboBurger, setComboBurger] = useState<MenuItem>(MENU_ITEMS[0]);
  const [comboSide, setComboSide] = useState<MenuItem>(MENU_ITEMS[4]);
  const [comboDrink, setComboDrink] = useState<MenuItem>(MENU_ITEMS[6]);

  const [customerName, setCustomerName] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("PIX (5% de Desconto)");

  const openProductModal = (item: MenuItem) => {
    setSelectedProduct(item);
    setModalQty(1);
    setModalDoneness("Ao Ponto do Chef (Rosado)");
    setModalAddons([]);
    setModalNotes("");
  };

  const toggleAddon = (addon: Addon) => {
    setModalAddons((prev) =>
      prev.some((a) => a.id === addon.id) ? prev.filter((a) => a.id !== addon.id) : [...prev, addon]
    );
  };

  const handleAddToCart = () => {
    if (!selectedProduct) return;
    const addonsTotal = modalAddons.reduce((sum, a) => sum + a.price, 0);
    const unitFinalPrice = selectedProduct.price + addonsTotal;

    const newItem: CartItem = {
      cartItemId: `${selectedProduct.id}-${Date.now()}`,
      product: selectedProduct,
      quantity: modalQty,
      doneness: selectedProduct.allowDoneness ? modalDoneness : undefined,
      addons: modalAddons,
      notes: modalNotes.trim() || undefined,
      unitFinalPrice,
    };

    setCart((prev) => [...prev, newItem]);
    setSelectedProduct(null);
    setIsCartOpen(true);
  };

  const handleAddComboToCart = () => {
    const rawTotal = comboBurger.price + comboSide.price + comboDrink.price;
    const discountedPrice = Number((rawTotal * 0.82).toFixed(2));

    const comboVirtualItem: MenuItem = {
      id: `combo-${Date.now()}`,
      name: `KOBRA BOX: ${comboBurger.name}`,
      tagline: "Combo Exclusivo (-18% OFF)",
      description: `Inclui: 1x ${comboBurger.name} + 1x ${comboSide.name} + 1x ${comboDrink.name}`,
      price: discountedPrice,
      category: "todos",
      image: comboBurger.image,
      calories: "Combo Completo",
      prepTime: "20 min",
    };

    setCart((prev) => [
      ...prev,
      {
        cartItemId: comboVirtualItem.id,
        product: comboVirtualItem,
        quantity: 1,
        addons: [],
        notes: `${comboSide.name} + ${comboDrink.name}`,
        unitFinalPrice: discountedPrice,
      },
    ]);
    setIsCartOpen(true);
  };

  const updateCartQty = (cartItemId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.cartItemId === cartItemId ? { ...item, quantity: item.quantity + delta } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const cartSubtotal = useMemo(
    () => cart.reduce((acc, item) => acc + item.unitFinalPrice * item.quantity, 0),
    [cart]
  );
  const totalItemsCount = useMemo(() => cart.reduce((acc, item) => acc + item.quantity, 0), [cart]);

  const isFreeDelivery = orderMode === "pickup" || cartSubtotal >= FREE_DELIVERY_THRESHOLD;
  const finalDeliveryFee = cartSubtotal === 0 ? 0 : isFreeDelivery ? 0 : DELIVERY_FEE;
  const cartTotal = cartSubtotal + finalDeliveryFee;
  const missingForFreeDelivery = Math.max(0, FREE_DELIVERY_THRESHOLD - cartSubtotal);

  const filteredItems = useMemo(() => {
    return MENU_ITEMS.filter((item) => {
      const matchesCat = activeCategory === "todos" || item.category === activeCategory;
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCat && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  const handleCheckoutWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    const itemsLines = cart
      .map((item) => {
        const addonsText =
          item.addons.length > 0
            ? `\n   + Adicionais: ${item.addons.map((a) => a.name).join(", ")}`
            : "";
        const donenessText = item.doneness ? `\n   • Ponto: ${item.doneness}` : "";
        const notesText = item.notes ? `\n   • Obs: ${item.notes}` : "";
        return `*${item.quantity}x ${item.product.name}* (R$ ${(
          item.unitFinalPrice * item.quantity
        ).toFixed(2)})${donenessText}${addonsText}${notesText}`;
      })
      .join("\n\n");

    const message = `*NOVO PEDIDO — KOBRA BURGER LAB* 🍔⚡\n----------------------------------\n*Modalidade:* ${
      orderMode === "delivery" ? "🛵 Delivery" : "🏪 Retirada no Balcão"
    }\n*Cliente:* ${customerName || "Não informado"}\n${
      orderMode === "delivery" ? `*Endereço:* ${customerAddress}\n` : ""
    }----------------------------------\n\n${itemsLines}\n\n----------------------------------\n*Subtotal:* R$ ${cartSubtotal.toFixed(
      2
    )}\n*Taxa de Entrega:* ${
      isFreeDelivery ? "GRÁTIS" : `R$ ${finalDeliveryFee.toFixed(2)}`
    }\n*TOTAL A PAGAR: R$ ${cartTotal.toFixed(2)}*\n*Pagamento:* ${paymentMethod}`;

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-[#060608] text-zinc-100 selection:bg-lime-400 selection:text-zinc-950 font-sans antialiased pb-20 sm:pb-0">
      <FloatingWhatsApp />

      {/* ==========================================
          1. HEADER TELEMETRY
      ========================================== */}
      <header className="fixed top-0 left-0 right-0 z-40 px-4 sm:px-6 pt-4 pointer-events-none">
        <div className="max-w-7xl mx-auto bg-[#0A0B0E]/85 backdrop-blur-xl border border-zinc-800/90 rounded-2xl px-4 sm:px-6 py-3 shadow-[0_20px_50px_rgba(0,0,0,0.5)] pointer-events-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <a href="#" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-lime-400 flex items-center justify-center text-zinc-950 shadow-[0_0_20px_rgba(163,230,53,0.4)]">
                <Leaf className="w-5 h-5 fill-current" />
              </div>
              <div>
                <span className="text-lg font-black tracking-tighter text-white block leading-none">
                  KOBRA<span className="text-lime-400">.LAB</span>
                </span>
                <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">
                  Acid Burger & Fire
                </span>
              </div>
            </a>
            <div className="hidden lg:flex items-center gap-2 pl-4 border-l border-zinc-800 text-xs font-mono text-zinc-400">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="text-zinc-300 font-semibold">FORNALHA ATIVA</span>
              <span className="text-zinc-600">•</span>
              <Clock className="w-3.5 h-3.5 text-lime-400" />
              <span>25–35 MIN</span>
            </div>
          </div>

          <div className="hidden sm:flex items-center bg-zinc-900/90 border border-zinc-800 p-1 rounded-xl">
            <button
              onClick={() => setOrderMode("delivery")}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                orderMode === "delivery"
                  ? "bg-lime-400 text-zinc-950 shadow"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <Bike className="w-3.5 h-3.5" />
              Delivery
            </button>
            <button
              onClick={() => setOrderMode("pickup")}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                orderMode === "pickup"
                  ? "bg-lime-400 text-zinc-950 shadow"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <Store className="w-3.5 h-3.5" />
              Retirada
            </button>
          </div>

          <button
            onClick={() => setIsCartOpen(true)}
            className="relative inline-flex items-center gap-3 px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/80 text-white transition-all group"
          >
            <div className="relative">
              <ShoppingBag className="w-5 h-5 text-lime-400 group-hover:scale-110 transition-transform" />
              {totalItemsCount > 0 && (
                <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-lime-400 text-zinc-950 font-mono text-[10px] font-black flex items-center justify-center">
                  {totalItemsCount}
                </span>
              )}
            </div>
            <div className="text-left hidden md:block">
              <span className="text-[10px] font-mono uppercase text-zinc-400 block leading-none">
                Sua Sacola
              </span>
              <span className="text-xs font-black text-white">R$ {cartSubtotal.toFixed(2)}</span>
            </div>
          </button>
        </div>
      </header>

      {/* ==========================================
          2. HERO SECTION
      ========================================== */}
      <section className="relative pt-32 pb-16 md:pt-40 md:pb-24 overflow-hidden border-b border-zinc-900">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-lime-400/10 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-[130px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-lime-400/10 border border-lime-400/20 text-lime-400 text-xs font-mono uppercase tracking-widest mb-6">
                <Sparkles className="w-3.5 h-3.5" /> Eleito Melhor Smash Urbano 2026
              </div>

              <h1 className="text-4xl sm:text-6xl xl:text-7xl font-black tracking-tighter uppercase text-white leading-[0.93] mb-6">
                Crosta <span className="text-lime-400 italic">Caramelizada.</span> <br />
                Suculência Absurda.
              </h1>

              <p className="text-zinc-400 text-base sm:text-lg max-w-xl leading-relaxed mb-8 border-l-2 border-lime-400/50 pl-4">
                Moemos nossos cortes de Wagyu e Angus diariamente. Pão brioche fermentado por 24h,
                selado na manteiga clarificada e molhos autorais feitos do zero.
              </p>

              <div className="flex flex-wrap items-center gap-4">
                <a
                  href="#cardapio"
                  className="px-8 py-4 rounded-2xl bg-gradient-to-r from-lime-400 to-emerald-400 hover:from-lime-500 hover:to-emerald-500 text-zinc-950 font-black uppercase tracking-wider text-xs sm:text-sm shadow-[0_0_40px_rgba(163,230,53,0.3)] transition-all flex items-center gap-3"
                >
                  <span>Explorar Cardápio</span>
                  <ChevronRight className="w-4 h-4" />
                </a>

                <a
                  href="#combo-lab"
                  className="px-6 py-4 rounded-2xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 font-bold text-xs sm:text-sm transition-all flex items-center gap-2"
                >
                  <Zap className="w-4 h-4 text-emerald-400" />
                  Montar Combo (-18% OFF)
                </a>
              </div>

              <div className="mt-12 pt-8 border-t border-zinc-900 grid grid-cols-3 gap-4 max-w-lg">
                <div>
                  <span className="text-xs font-mono text-lime-400 block">// EMBALAGEM</span>
                  <span className="text-sm sm:text-base font-bold text-white">Térmica Anti-Vapor</span>
                </div>
                <div>
                  <span className="text-xs font-mono text-lime-400 block">// BLEND</span>
                  <span className="text-sm sm:text-base font-bold text-white">100% Wagyu & Angus</span>
                </div>
                <div>
                  <span className="text-xs font-mono text-lime-400 block">// FRETE GRÁTIS</span>
                  <span className="text-sm sm:text-base font-bold text-white">
                    Acima de R$ {FREE_DELIVERY_THRESHOLD}
                  </span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="relative rounded-[2.5rem] overflow-hidden border border-zinc-800 bg-zinc-900 aspect-[4/4.2] group shadow-2xl">
                <Image
                  src={MENU_ITEMS[0].image}
                  alt={MENU_ITEMS[0].name}
                  fill
                  unoptimized
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#070708] via-[#070708]/30 to-transparent" />
                <div className="absolute top-5 left-5 px-3 py-1.5 rounded-xl bg-zinc-950/85 backdrop-blur-md border border-zinc-800 text-[11px] font-mono text-lime-400 flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5" /> PRATO ASSINATURA
                </div>
                <div className="absolute bottom-5 left-5 right-5 p-5 rounded-2xl bg-zinc-950/90 backdrop-blur-xl border border-zinc-800/90">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <h2 className="text-xl font-black text-white uppercase tracking-tight">
                        {MENU_ITEMS[0].name}
                      </h2>
                      <p className="text-xs text-zinc-400 line-clamp-1">
                        {MENU_ITEMS[0].description}
                      </p>
                    </div>
                    <span className="text-lg font-black text-lime-400 shrink-0">
                      R$ {MENU_ITEMS[0].price.toFixed(2)}
                    </span>
                  </div>
                  <button
                    onClick={() => openProductModal(MENU_ITEMS[0])}
                    className="w-full py-3 rounded-xl bg-white hover:bg-lime-400 text-zinc-950 font-black uppercase tracking-wider text-xs transition-colors flex items-center justify-center gap-2"
                  >
                    <Plus className="w-4 h-4" /> Personalizar & Pedir Agora
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          3. COMBO BUILDER
      ========================================== */}
      <section id="combo-lab" className="py-16 bg-zinc-950/70 border-b border-zinc-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-gradient-to-br from-zinc-900 via-zinc-900/90 to-zinc-950 border border-lime-400/20 p-6 sm:p-10 relative overflow-hidden shadow-[0_0_60px_rgba(163,230,53,0.05)]">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8 pb-6 border-b border-zinc-800">
              <div>
                <span className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest text-lime-400 mb-2">
                  <Zap className="w-3.5 h-3.5" /> Lab de Combos • Economia Inteligente
                </span>
                <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-white">
                  Monte sua <span className="text-lime-400 italic">Kobra Box</span> com 18% OFF
                </h2>
              </div>
              <div className="flex items-center gap-4 bg-zinc-950/90 border border-zinc-800 p-4 rounded-2xl">
                <div>
                  <span className="text-[10px] font-mono uppercase text-zinc-500 line-through block">
                    De R$ {(comboBurger.price + comboSide.price + comboDrink.price).toFixed(2)}
                  </span>
                  <span className="text-2xl font-black text-white">
                    R$ {((comboBurger.price + comboSide.price + comboDrink.price) * 0.82).toFixed(2)}
                  </span>
                </div>
                <button
                  onClick={handleAddComboToCart}
                  className="px-5 py-3 rounded-xl bg-lime-400 hover:bg-lime-500 text-zinc-950 font-black uppercase tracking-wider text-xs transition-all shadow-[0_0_20px_rgba(163,230,53,0.3)] flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" /> Adicionar Box
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { step: "01. Burger Principal", setter: setComboBurger, val: comboBurger, items: MENU_ITEMS.filter((i) => i.category === "artesanais" || i.category === "smash") },
                { step: "02. Acompanhamento", setter: setComboSide, val: comboSide, items: MENU_ITEMS.filter((i) => i.category === "sides") },
                { step: "03. Bebida Artesanal", setter: setComboDrink, val: comboDrink, items: MENU_ITEMS.filter((i) => i.category === "drinks") }
              ].map((column, idx) => (
                <div key={idx} className="bg-zinc-950/60 border border-zinc-800/80 rounded-2xl p-4">
                  <span className="text-[11px] font-mono uppercase text-lime-400 font-bold block mb-3">
                    {column.step}
                  </span>
                  <div className="space-y-2">
                    {column.items.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => column.setter(item)}
                        className={`w-full p-2.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                          column.val.id === item.id
                            ? "bg-lime-400/15 border-lime-400 text-white"
                            : "bg-zinc-900/50 border-zinc-800/60 text-zinc-400 hover:text-white"
                        }`}
                      >
                        <span className="text-xs font-bold truncate pr-2">{item.name}</span>
                        <span className="text-[11px] font-mono shrink-0">R$ {item.price.toFixed(0)}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          4. MENU GRID & FILTER
      ========================================== */}
      <section id="cardapio" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="sticky top-20 z-30 bg-[#060608]/90 backdrop-blur-xl py-4 border-b border-zinc-800/80 mb-10 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all flex items-center gap-2 ${
                  activeCategory === cat.id
                    ? "bg-lime-400 text-zinc-950 shadow-[0_0_15px_rgba(163,230,53,0.4)]"
                    : "bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800"
                }`}
              >
                <span>{cat.label}</span>
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                    activeCategory === cat.id ? "bg-black/20 text-zinc-950" : "bg-zinc-800 text-zinc-500"
                  }`}
                >
                  {cat.count}
                </span>
              </button>
            ))}
          </div>
          <div className="relative w-full md:w-72 shrink-0">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar no cardápio..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-lime-400"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <motion.div
              layout
              key={item.id}
              onClick={() => openProductModal(item)}
              className="group cursor-pointer rounded-3xl bg-zinc-900/40 border border-zinc-800/80 hover:border-lime-400/50 overflow-hidden transition-all flex flex-col justify-between hover:shadow-[0_10px_40px_rgba(0,0,0,0.4)]"
            >
              <div>
                <div className="relative h-56 w-full overflow-hidden bg-zinc-950">
                  <Image src={item.image} alt={item.name} fill unoptimized className="object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-black/30" />
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    {item.badge ? (
                      <span className="px-3 py-1 rounded-lg bg-lime-400 text-zinc-950 font-mono text-[10px] font-bold uppercase tracking-wider shadow">
                        {item.badge}
                      </span>
                    ) : (
                      <span />
                    )}
                    <span className="px-2.5 py-1 rounded-lg bg-zinc-950/80 backdrop-blur-md border border-zinc-800 text-[10px] font-mono text-zinc-300">
                      {item.prepTime} • {item.calories}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-lime-400">
                      {item.tagline}
                    </span>
                  </div>
                  <h3 className="text-xl font-black text-white uppercase tracking-tight mb-2 group-hover:text-lime-400 transition-colors">
                    {item.name}
                  </h3>
                  <p className="text-zinc-400 text-xs leading-relaxed line-clamp-3">{item.description}</p>
                </div>
              </div>
              <div className="px-6 pb-6 pt-4 border-t border-zinc-800/50 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono uppercase text-zinc-500 block">Valor Individual</span>
                  <span className="text-xl font-black text-white">R$ {item.price.toFixed(2)}</span>
                </div>
                <div className="w-10 h-10 rounded-xl bg-zinc-800 group-hover:bg-lime-400 group-hover:text-zinc-950 text-white flex items-center justify-center transition-colors">
                  <Plus className="w-5 h-5" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ==========================================
          5. CONTACT & VIP NEWSLETTER
      ========================================== */}
      <section className="py-24 relative overflow-hidden bg-zinc-950 border-t border-zinc-900">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-lime-400 text-xs font-mono uppercase tracking-widest mb-6">
              <Mail className="w-3.5 h-3.5" /> VIP Undergound
            </span>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tighter uppercase text-white mb-4">
              Entre para o <span className="text-lime-400 italic">Laboratório.</span>
            </h2>
            <p className="text-zinc-400 text-sm sm:text-base leading-relaxed mb-8 max-w-md">
              Membros VIP recebem acesso a testes de novos burgers, menus sazonais não listados no cardápio e cupons secretos de frete grátis enviados de madrugada.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4 text-sm text-zinc-400 border-t border-zinc-800/80 pt-6">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-400" /> Av. Paulista, 1000 - SP
              </div>
              <div className="hidden sm:block text-zinc-800">•</div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-400" /> lab@kobraburger.com
              </div>
            </div>
          </div>
          
          <div className="bg-zinc-900/60 p-8 rounded-3xl border border-zinc-800 shadow-2xl backdrop-blur-xl">
            <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
              <h3 className="text-lg font-bold text-white uppercase tracking-tight mb-6">Acesso Privado</h3>
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-500 mb-1.5">Como gosta de ser chamado?</label>
                <input type="text" placeholder="Seu nome" className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-lime-400 transition-colors" />
              </div>
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-500 mb-1.5">Seu melhor E-mail</label>
                <input type="email" placeholder="email@exemplo.com" className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-lime-400 transition-colors" />
              </div>
              <button type="submit" className="w-full mt-2 py-3.5 rounded-xl bg-lime-400 hover:bg-lime-500 text-zinc-950 font-black uppercase tracking-wider text-xs flex items-center justify-center gap-2 transition-all">
                <span>Desbloquear Acesso VIP</span> <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* ==========================================
          6. FOOTER
      ========================================== */}
      <footer className="bg-[#040506] border-t border-zinc-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8 pb-8 border-b border-zinc-900">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-lime-400/10 border border-lime-400/20 text-lime-400 flex items-center justify-center">
                <Leaf className="w-4 h-4" />
              </div>
              <span className="text-sm font-black tracking-wider text-white">
                KOBRA<span className="text-lime-400">.LAB</span>
              </span>
            </div>
            <nav className="flex flex-wrap items-center justify-center gap-6 text-xs font-mono uppercase tracking-wider text-zinc-500">
              <a href="#cardapio" className="hover:text-lime-400 transition-colors">Cardápio</a>
              <a href="#combo-lab" className="hover:text-lime-400 transition-colors">Combos</a>
              <a href="#" className="hover:text-lime-400 transition-colors">Sobre Nós</a>
              <a href="#" className="hover:text-lime-400 transition-colors">Políticas</a>
            </nav>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-[10px] font-mono uppercase text-zinc-600">
            <p>© {CURRENT_YEAR} KOBRA CRAFT BURGER. TODOS OS DIREITOS RESERVADOS.</p>
            <p className="flex items-center gap-1.5">
              Powered by <span className="text-emerald-500 font-bold">TechAgency</span>
            </p>
          </div>
        </div>
      </footer>

      {/* ==========================================
          MODALS & DRAWER (Mesma Lógica de Carrinho)
      ========================================== */}
      <AnimatePresence>
        {selectedProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl bg-zinc-950 border border-zinc-800 shadow-2xl no-scrollbar">
              <div className="relative h-56 w-full">
                <Image src={selectedProduct.image} alt={selectedProduct.name} fill unoptimized className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
                <button onClick={() => setSelectedProduct(null)} className="absolute top-4 right-4 w-10 h-10 rounded-full bg-zinc-950/80 border border-zinc-800 text-white flex items-center justify-center hover:bg-lime-400 hover:text-zinc-950 transition-colors"><X className="w-5 h-5" /></button>
              </div>
              <div className="p-6 sm:p-8 space-y-6">
                <div>
                  <span className="text-xs font-mono uppercase text-lime-400">{selectedProduct.tagline}</span>
                  <h3 className="text-2xl font-black text-white uppercase">{selectedProduct.name}</h3>
                  <p className="text-xs sm:text-sm text-zinc-400 mt-2 leading-relaxed">{selectedProduct.description}</p>
                </div>
                {selectedProduct.allowDoneness && (
                  <div className="space-y-3">
                    <label className="text-xs font-mono uppercase tracking-wider text-zinc-300 font-bold">1. Ponto da Carne</label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {["Mal Passado", "Ao Ponto do Chef (Rosado)", "Bem Passado"].map((point) => (
                        <button key={point} onClick={() => setModalDoneness(point)} className={`p-3 rounded-xl border text-xs font-bold transition-all ${modalDoneness === point ? "bg-lime-400/20 border-lime-400 text-white" : "bg-zinc-900 border-zinc-800 text-zinc-400"}`}>{point}</button>
                      ))}
                    </div>
                  </div>
                )}
                <div className="space-y-3">
                  <label className="text-xs font-mono uppercase tracking-wider text-zinc-300 font-bold block">Turbine sua Experiência (Opcional)</label>
                  <div className="space-y-2">
                    {ADDONS_LIST.map((addon) => {
                      const isSelected = modalAddons.some((a) => a.id === addon.id);
                      return (
                        <button key={addon.id} onClick={() => toggleAddon(addon)} className={`w-full p-3.5 rounded-xl border flex items-center justify-between text-left transition-all ${isSelected ? "bg-lime-400/15 border-lime-400 text-white" : "bg-zinc-900/60 border-zinc-800/80 text-zinc-300 hover:border-zinc-700"}`}>
                          <div className="flex items-center gap-3">
                            <div className={`w-5 h-5 rounded-md flex items-center justify-center border ${isSelected ? "bg-lime-400 border-lime-400 text-zinc-950" : "border-zinc-700"}`}>{isSelected && <Check className="w-3.5 h-3.5" />}</div>
                            <span className="text-xs font-semibold">{addon.name}</span>
                          </div>
                          <span className="text-xs font-mono text-lime-400">+ R$ {addon.price.toFixed(2)}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-mono uppercase tracking-wider text-zinc-400 block mb-2">Observações para a Cozinha</label>
                  <input type="text" value={modalNotes} onChange={(e) => setModalNotes(e.target.value)} placeholder="Ex: Sem cebola..." className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-lime-400" />
                </div>
                <div className="pt-4 border-t border-zinc-800 flex items-center gap-4">
                  <div className="flex items-center gap-3 bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2.5">
                    <button onClick={() => setModalQty(Math.max(1, modalQty - 1))} className="text-zinc-400 hover:text-white"><Minus className="w-4 h-4" /></button>
                    <span className="font-mono font-bold text-sm w-5 text-center">{modalQty}</span>
                    <button onClick={() => setModalQty(modalQty + 1)} className="text-zinc-400 hover:text-white"><Plus className="w-4 h-4" /></button>
                  </div>
                  <button onClick={handleAddToCart} className="flex-1 py-3.5 px-6 rounded-xl bg-gradient-to-r from-lime-400 to-emerald-400 hover:from-lime-500 hover:to-emerald-500 text-zinc-950 font-black uppercase tracking-wider text-xs flex items-center justify-between shadow-[0_0_20px_rgba(163,230,53,0.3)]">
                    <span>Adicionar à Sacola</span>
                    <span>R$ {((selectedProduct.price + modalAddons.reduce((s, a) => s + a.price, 0)) * modalQty).toFixed(2)}</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isCartOpen && (
          <div className="fixed inset-0 z-50 flex justify-end bg-black/75 backdrop-blur-sm">
            <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 28, stiffness: 250 }} className="w-full max-w-md bg-[#0B0C0E] border-l border-zinc-800 h-full flex flex-col justify-between shadow-2xl">
              <div className="p-6 border-b border-zinc-800">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2.5">
                    <ShoppingBag className="w-5 h-5 text-lime-400" />
                    <h2 className="text-lg font-black uppercase tracking-tight text-white">Sua Comanda</h2>
                  </div>
                  <button onClick={() => setIsCartOpen(false)} className="p-2 rounded-lg bg-zinc-900 text-zinc-400 hover:text-white"><X className="w-5 h-5" /></button>
                </div>
                {orderMode === "delivery" && (
                  <div className="p-3.5 rounded-xl bg-zinc-900/90 border border-zinc-800">
                    <div className="flex justify-between text-xs mb-2">
                      {missingForFreeDelivery > 0 ? (
                        <span className="text-zinc-300">Faltam <strong className="text-lime-400">R$ {missingForFreeDelivery.toFixed(2)}</strong> para <strong>Frete Grátis!</strong></span>
                      ) : (
                        <span className="text-emerald-400 font-bold flex items-center gap-1.5"><Sparkles className="w-4 h-4" /> ENTREGA GRÁTIS DESBLOQUEADA!</span>
                      )}
                    </div>
                    <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-lime-400 to-emerald-400 transition-all duration-500" style={{ width: `${Math.min(100, (cartSubtotal / FREE_DELIVERY_THRESHOLD) * 100)}%` }} />
                    </div>
                  </div>
                )}
              </div>
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {cart.length === 0 ? (
                  <div className="text-center py-16">
                    <Utensils className="w-12 h-12 text-zinc-700 mx-auto mb-3" />
                    <p className="text-sm font-bold text-zinc-400">Sua sacola está vazia</p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-3">
                      {cart.map((item) => (
                        <div key={item.cartItemId} className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800/90 flex items-start justify-between gap-3">
                          <div className="space-y-1">
                            <h4 className="text-sm font-bold text-white">{item.product.name}</h4>
                            {item.doneness && <span className="text-[11px] font-mono text-lime-400 block">• {item.doneness}</span>}
                            {item.addons.map((a) => <span key={a.id} className="text-[11px] text-zinc-400 block">+ {a.name}</span>)}
                            {item.notes && <span className="text-[11px] italic text-zinc-500 block">&ldquo;{item.notes}&rdquo;</span>}
                            <span className="text-xs font-black text-white block pt-1">R$ {(item.unitFinalPrice * item.quantity).toFixed(2)}</span>
                          </div>
                          <div className="flex items-center gap-2 bg-zinc-950 border border-zinc-800 rounded-lg px-2 py-1">
                            <button onClick={() => updateCartQty(item.cartItemId, -1)} className="text-zinc-400 hover:text-white"><Minus className="w-3.5 h-3.5" /></button>
                            <span className="text-xs font-mono font-bold w-4 text-center">{item.quantity}</span>
                            <button onClick={() => updateCartQty(item.cartItemId, 1)} className="text-zinc-400 hover:text-white"><Plus className="w-3.5 h-3.5" /></button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <form id="checkout-form" onSubmit={handleCheckoutWhatsApp} className="pt-6 border-t border-zinc-800 space-y-4">
                      <h4 className="text-xs font-mono uppercase tracking-wider text-lime-400 font-bold">Dados de Finalização Rápida</h4>
                      <input type="text" required value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="Seu nome completo" className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-lime-400" />
                      {orderMode === "delivery" && (
                        <input type="text" required value={customerAddress} onChange={(e) => setCustomerAddress(e.target.value)} placeholder="Rua, Número, Bairro e Complemento" className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-lime-400" />
                      )}
                      <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-lime-400">
                        <option>PIX (Chave enviada no WhatsApp)</option>
                        <option>Cartão de Crédito na Entrega</option>
                        <option>Cartão de Débito / Vale Refeição</option>
                      </select>
                    </form>
                  </>
                )}
              </div>
              {cart.length > 0 && (
                <div className="p-6 border-t border-zinc-800 bg-zinc-950 space-y-4">
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between text-zinc-400"><span>Subtotal dos Itens</span><span>R$ {cartSubtotal.toFixed(2)}</span></div>
                    <div className="flex justify-between text-zinc-400"><span>Taxa de Entrega</span><span className={isFreeDelivery ? "text-emerald-400 font-bold" : ""}>{isFreeDelivery ? "GRÁTIS" : `R$ ${finalDeliveryFee.toFixed(2)}`}</span></div>
                    <div className="flex justify-between text-base font-black text-white pt-2 border-t border-zinc-800"><span>Total do Pedido</span><span className="text-lime-400">R$ {cartTotal.toFixed(2)}</span></div>
                  </div>
                  <button type="submit" form="checkout-form" className="w-full py-4 rounded-xl bg-gradient-to-r from-lime-400 to-emerald-400 hover:from-lime-500 hover:to-emerald-500 text-zinc-950 font-black uppercase tracking-wider text-xs flex items-center justify-center gap-2 shadow-lg transition-all">
                    <MessageCircle className="w-4 h-4" /> Enviar Pedido para a Cozinha
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}