"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dumbbell,
  Zap,
  Clock,
  ShieldCheck,
  ChevronDown,
  CheckCircle2,
  MessageCircle,
  ArrowRight,
  Trophy,
  Users,
  Flame,
  Phone,
  Mail,
  MapPin,
  Menu,
  X,
} from "lucide-react";

// ==========================================
// UTILS & CONFIGURATIONS
// ==========================================
const WHATSAPP_NUMBER = "5511999999999";
const WHATSAPP_MESSAGE = encodeURIComponent(
  "Olá! Quero agendar minha aula experimental e conhecer os planos da academia."
);

// ==========================================
// HELPER COMPONENTS
// ==========================================
const GradientText = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <span className={`bg-clip-text text-transparent bg-gradient-to-r from-orange-500 via-amber-400 to-orange-400 ${className}`}>
    {children}
  </span>
);

const Badge = ({ children }: { children: React.ReactNode }) => (
  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-orange-500/10 text-orange-400 border border-orange-500/20 shadow-orange-glow mb-4 -skew-x-12">
    <span className="skew-x-12 inline-flex items-center gap-1.5">{children}</span>
  </span>
);

// ==========================================
// SECTIONS & COMPONENTS
// ==========================================

// --- MARQUEE ---
const Marquee = () => {
  const words = ["PERFORMANCE", "•", "FOCO", "•", "RESISTÊNCIA", "•", "FORÇA", "•", "DISCIPLINA", "•"];
  return (
    <div className="relative w-full overflow-hidden bg-orange-600/10 border-y border-orange-500/20 py-4 font-black italic tracking-tighter text-orange-500 uppercase text-lg sm:text-2xl select-none">
      <motion.div
        className="flex whitespace-nowrap gap-8"
        animate={{ x: [0, -1000] }}
        transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
      >
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex gap-8 shrink-0 items-center">
            {words.map((word, idx) => (
              <span key={idx} className={word === "•" ? "text-amber-500 not-italic" : ""}>{word}</span>
            ))}
          </div>
        ))}
      </motion.div>
    </div>
  );
};

// --- NAVBAR ---
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#08090A]/80 backdrop-blur-md border-b border-zinc-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-orange-600/20 border border-orange-500/30 text-orange-400">
            <Dumbbell className="w-6 h-6" />
          </div>
          <span className="text-xl font-bold tracking-wider text-white">
            PULSE<span className="text-orange-500">FIT</span>
          </span>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
          <a href="#vantagens" className="hover:text-white transition-colors">Vantagens</a>
          <a href="#galeria" className="hover:text-white transition-colors">Galeria</a>
          <a href="#planos" className="hover:text-white transition-colors">Planos</a>
          <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
          <a href="#contato" className="hover:text-white transition-colors">Contato</a>
        </div>

        <div className="hidden md:flex items-center">
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-medium text-sm transition-all shadow-orange-glow hover:scale-105"
          >
            <MessageCircle className="w-4 h-4" />
            Matricule-se Já
          </a>
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-zinc-900 border-b border-zinc-800 px-4 py-6 flex flex-col gap-4"
          >
            <a href="#vantagens" onClick={() => setIsOpen(false)} className="text-zinc-300 hover:text-white">Vantagens</a>
            <a href="#galeria" onClick={() => setIsOpen(false)} className="text-zinc-300 hover:text-white">Galeria</a>
            <a href="#planos" onClick={() => setIsOpen(false)} className="text-zinc-300 hover:text-white">Planos</a>
            <a href="#faq" onClick={() => setIsOpen(false)} className="text-zinc-300 hover:text-white">FAQ</a>
            <a href="#contato" onClick={() => setIsOpen(false)} className="text-zinc-300 hover:text-white">Contato</a>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-orange-600 text-white font-medium text-sm shadow-orange-glow mt-4"
            >
              <MessageCircle className="w-4 h-4" />
              Matricule-se Já
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

// --- HERO SECTION ---
const Hero = () => {
  return (
    <section className="relative pt-32 pb-20 md:pt-44 md:pb-32 overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-orange-600/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 left-1/3 w-[300px] h-[300px] bg-amber-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge>
              <Flame className="w-3.5 h-3.5" /> A Melhora Começa Hoje
            </Badge>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-6xl font-black italic tracking-tighter text-white mb-6 leading-none uppercase"
          >
            Transforme seu corpo e ultrapasse seus <GradientText>limites físicos</GradientText>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg sm:text-xl text-zinc-400 mb-8 leading-relaxed"
          >
            Treinos de alta performance, equipamentos de última geração e acompanhamento profissional completo para você alcançar sua melhor versão.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white font-black italic tracking-wider text-lg transition-all duration-300 shadow-orange-glow hover:scale-105 -skew-x-12 uppercase"
            >
              <MessageCircle className="w-5 h-5" />
              <span className="skew-x-12 inline-flex items-center gap-2">Iniciar Projeto no WhatsApp</span>
            </a>
            <a
              href="#planos"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800 font-semibold text-lg transition-all"
            >
              Ver Planos <ArrowRight className="w-4 h-4" />
            </a>
          </motion.div>

          {/* Social Proof Badges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-12 pt-12 border-t border-zinc-800/80 grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            <div>
              <p className="text-3xl font-bold text-white mb-1">+2.500</p>
              <p className="text-xs text-zinc-500 uppercase tracking-wider">Alunos Ativos</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-white mb-1">99.8%</p>
              <p className="text-xs text-zinc-500 uppercase tracking-wider">Satisfação</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-white mb-1">100%</p>
              <p className="text-xs text-zinc-500 uppercase tracking-wider">Equipamentos Pro</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-white mb-1">24/7</p>
              <p className="text-xs text-zinc-500 uppercase tracking-wider">Suporte Técnico</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// --- FEATURES / SERVICES ---
const Features = () => {
  const items = [
    {
      icon: Dumbbell,
      title: "Equipamentos de Ponta",
      description: "Aparelhos de biomecânica avançada importados para garantir máxima eficiência e segurança no seu treino.",
    },
    {
      icon: Zap,
      title: "Aulas Dinâmicas",
      description: "Modalidades exclusivas de Cross, HIIT, Spinning e Funcional com instrutores certificados.",
    },
    {
      icon: Clock,
      title: "Horários Flexíveis",
      description: "Academia aberta do início da manhã até o fim da noite para adaptar-se perfeitamente à sua rotina.",
    },
    {
      icon: Trophy,
      title: "Treino Personalizado",
      description: "Fichas digitais personalizadas via aplicativo com acompanhamento de progresso quinzenal.",
    },
    {
      icon: ShieldCheck,
      title: "Ambiente Climatizado",
      description: "Estrutura premium de 1.200m² totalmente climatizada e com vestiários individuais completos.",
    },
    {
      icon: Users,
      title: "Comunidade Motivadora",
      description: "Eventos, desafios mensais e uma comunidade engajada para impulsionar seus resultados continuamente.",
    },
  ];

  return (
    <section id="vantagens" className="py-24 bg-zinc-950/50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-xs font-semibold text-orange-400 tracking-widest uppercase mb-2">Diferenciais Elite</h2>
          <p className="text-3xl sm:text-5xl font-black italic tracking-tighter text-white uppercase">
            Por que escolher a nossa estrutura?
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              whileHover={{ scale: 1.05, rotate: idx % 2 === 0 ? -2 : 2, skewX: -2 }}
              className="p-8 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 hover:border-orange-500/40 transition-all group"
            >
              <div className="w-12 h-12 rounded-xl bg-orange-600/10 border border-orange-500/20 text-orange-400 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-orange-600 group-hover:text-white transition-all">
                <item.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// --- GALLERY SECTION ---
const Gallery = () => {
  // 1. Atualize aqui com o nome real e caminho das suas fotos na pasta public
  const images = [
    { aspect: "aspect-square", label: "Área de Musculação Premium", src: "/images/templates/academia/foto-1.png" },
    { aspect: "aspect-square", label: "Espaço de Cardio & Running", src: "/images/templates/academia/foto-2.png" },
    { aspect: "aspect-square", label: "Studio de Spinning", src: "/images/templates/academia/foto-3.png" },
    { aspect: "aspect-square", label: "Box de Cross Training", src: "/images/templates/academia/foto-4.png" },
    { aspect: "aspect-square", label: "Área de Peso Livre", src: "/images/templates/academia/foto-5.png" },
    { aspect: "aspect-square", label: "Vestiários Climatizados", src: "/images/templates/academia/foto-6.png" },
  ];

  return (
    <section id="galeria" className="py-24 bg-zinc-950 border-t border-zinc-900 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <Badge>Conheça Nosso Espaço</Badge>
          <h2 className="text-3xl sm:text-5xl font-black italic tracking-tighter text-white uppercase mt-2">Galeria de Fotos</h2>
          <p className="text-zinc-400 mt-4 text-sm sm:text-base">
            Estrutura moderna planejada para oferecer conforto, alto rendimento e a melhor experiência de treino.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {images.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              whileHover={{ scale: 1.05, skewY: -1, zIndex: 10 }}
              className={`relative group overflow-hidden rounded-2xl border border-zinc-800/80 hover:border-orange-500/40 transition-all ${item.aspect} flex items-center justify-center p-6 text-center`}
            >
              {/* 2. A imagem real usando Next.js Image */}
              <Image
                src={item.src}
                alt={item.label}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />

              {/* 3. Gradiente escuro por cima da imagem para garantir leitura do texto */}
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-900/60 to-transparent opacity-70 group-hover:opacity-40 transition-opacity" />

              <div className="relative z-10 flex flex-col items-center justify-center gap-2 mt-auto pb-4">
                <div className="w-10 h-10 rounded-xl bg-orange-500/90 border border-orange-500/20 text-white flex items-center justify-center group-hover:scale-110 transition-transform shadow-orange-glow">
                  <Dumbbell className="w-5 h-5" />
                </div>
                <span className="text-sm font-bold tracking-wide text-white drop-shadow-md">
                  {item.label}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// --- PRICING SECTION ---
const Pricing = () => {
  const plans = [
    {
      name: "Fit Básico",
      price: "119",
      period: "/mês",
      description: "Ideal para quem quer focar na musculação diária em horário livre.",
      features: [
        "Acesso à área de Musculação",
        "Área de Cardio Completa",
        "Avaliação Física Inicial",
        "Armários no Vestiário",
      ],
      highlight: false,
      cta: "Matricular no Básico",
    },
    {
      name: "Cross Pro",
      price: "189",
      period: "/mês",
      description: "Perfeito para quem busca treinos dinâmicos, alta intensidade e aulas em grupo.",
      features: [
        "Tudo do Plano Fit Básico",
        "Acesso ilimitado às Aulas de Cross",
        "Aulas de Spinning e Funcional",
        "Acompanhamento no App",
        "Acesso a 2 Convidados/mês",
      ],
      highlight: true,
      badge: "Mais Popular",
      cta: "Garantir Vaga Pro",
    },
    {
      name: "VIP Total",
      price: "279",
      period: "/mês",
      description: "A experiência máxima em saúde com acompanhamento multidisciplinar.",
      features: [
        "Acesso Total e Ilimitado",
        "Consultoria Nutricional Mensal",
        "Personal Trainer (2x na semana)",
        "Acesso Livre a Convidados",
        "Kit Exclusivo PulseFit",
      ],
      highlight: false,
      cta: "Sejar Membro VIP",
    },
  ];

  return (
    <section id="planos" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-xs font-semibold text-orange-400 tracking-widest uppercase mb-2">Planos & Investimento</h2>
          <p className="text-3xl sm:text-5xl font-black italic tracking-tighter text-white uppercase">Escolha o plano ideal para sua rotina</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className={`relative flex flex-col justify-between p-8 rounded-[3rem] text-center transition-all ${plan.highlight
                  ? "bg-gradient-to-b from-zinc-900 via-zinc-900 to-zinc-950 border-2 border-orange-500 shadow-orange-glow scale-105 z-10"
                  : "bg-zinc-900/40 border border-zinc-800/80 hover:border-zinc-700"
                }`}
            >
              {plan.badge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-orange-600 to-amber-500 text-white text-xs font-bold uppercase tracking-wider shadow-md -skew-x-12">
                  <span className="skew-x-12 inline-block">{plan.badge}</span>
                </div>
              )}

              <div className="flex flex-col items-center">
                <h3 className="text-2xl font-black italic tracking-tighter uppercase text-white mb-2">{plan.name}</h3>
                <p className="text-zinc-400 text-xs mb-6 max-w-xs mx-auto min-h-[36px]">{plan.description}</p>

                <div className="w-40 h-40 rounded-full flex flex-col items-center justify-center mx-auto mb-8 border-4 border-orange-500/30 bg-zinc-900/80 shadow-orange-glow shrink-0 transition-transform hover:scale-105">
                  <span className="text-xs font-bold uppercase text-orange-400 tracking-wider">A partir de</span>
                  <div className="flex items-baseline justify-center gap-0.5">
                    <span className="text-xs font-bold text-zinc-400">R$</span>
                    <span className="text-4xl font-black italic tracking-tighter text-white">{plan.price}</span>
                  </div>
                  <span className="text-zinc-500 text-xs font-medium">{plan.period}</span>
                </div>

                <div className="space-y-3 mb-8 w-full text-left">
                  {plan.features.map((feat, fIdx) => (
                    <div key={fIdx} className="flex items-center gap-3 text-sm text-zinc-300">
                      <CheckCircle2 className="w-4 h-4 text-orange-400 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`Olá! Quero assinar o plano ${plan.name}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className={`w-full py-4 rounded-xl text-center font-bold uppercase tracking-wider text-sm transition-all duration-300 -skew-x-12 ${plan.highlight
                    ? "bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white shadow-orange-glow"
                    : "bg-zinc-800 hover:bg-zinc-700 text-white"
                  }`}
              >
                <span className="skew-x-12 inline-block">{plan.cta}</span>
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// --- FAQ SECTION ---
const FAQ = () => {
  const faqs = [
    {
      q: "Preciso pagar taxa de matrícula ou cancelamento?",
      a: "Não trabalhamos com fidelidade compulsória nos planos mensais. A matrícula é simplificada e totalmente transparente.",
    },
    {
      q: "Como funciona a aula experimental?",
      a: "Você pode agendar um dia de treino grátis através do nosso WhatsApp. Nossa equipe apresentará toda a estrutura e você poderá testar nossas instalações sem compromisso.",
    },
    {
      q: "Qual o horário de funcionamento?",
      a: "Funcionamos de segunda a sexta das 05h às 23h, aos sábados das 08h às 18h e aos domingos/feriados das 08h às 14h.",
    },
    {
      q: "Possuo acesso a aplicativo de treinos?",
      a: "Sim! Todos os nossos alunos possuem acesso exclusivo ao aplicativo PulseFit, onde podem visualizar vídeos com execução correta dos exercícios e histórico de cargas.",
    },
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="py-24 bg-zinc-950/50 border-t border-zinc-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-xs font-semibold text-orange-400 tracking-widest uppercase mb-2">Tire suas dúvidas</h2>
          <p className="text-3xl sm:text-5xl font-black italic tracking-tighter text-white uppercase">Perguntas Frequentes</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="border border-zinc-800/80 rounded-2xl bg-zinc-900/40 overflow-hidden transition-colors"
            >
              <button
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className="w-full text-left p-6 flex justify-between items-center gap-4 text-white font-semibold"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-5 h-5 text-zinc-400 transition-transform duration-300 ${openIndex === idx ? "rotate-180 text-orange-400" : ""
                    }`}
                />
              </button>

              <AnimatePresence>
                {openIndex === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="px-6 pb-6 text-sm text-zinc-400 leading-relaxed border-t border-zinc-800/40 pt-4"
                  >
                    {faq.a}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// --- CONTACT SECTION ---
const Contact = () => {
  return (
    <section id="contato" className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-zinc-900/60 border border-zinc-800/80 rounded-3xl p-8 sm:p-12">
          <div>
            <Badge>Contato Rápido</Badge>
            <h2 className="text-3xl sm:text-5xl font-black italic tracking-tighter text-white uppercase mb-4">
              Pronto para começar seu treino?
            </h2>
            <p className="text-zinc-400 mb-8 leading-relaxed">
              Preencha os dados ao lado ou chame diretamente no WhatsApp para agendar uma visita guiada com avaliação grátis.
            </p>

            <div className="space-y-6">
              <div className="flex items-center gap-4 text-zinc-300">
                <div className="p-3 rounded-xl bg-zinc-800 border border-zinc-700 text-orange-400">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-zinc-500 uppercase">Telefone / WhatsApp</p>
                  <p className="font-semibold">(11) 99999-9999</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-zinc-300">
                <div className="p-3 rounded-xl bg-zinc-800 border border-zinc-700 text-orange-400">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-zinc-500 uppercase">E-mail</p>
                  <p className="font-semibold">contato@pulsefit.com.br</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-zinc-300">
                <div className="p-3 rounded-xl bg-zinc-800 border border-zinc-700 text-orange-400">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-zinc-500 uppercase">Localização</p>
                  <p className="font-semibold">Av. Paulista, 1000 - Bela Vista, São Paulo - SP</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-zinc-950/60 border border-zinc-800/80 p-6 sm:p-8 rounded-2xl">
            <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                  Nome Completo
                </label>
                <input
                  type="text"
                  placeholder="Seu nome"
                  className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-600 focus:outline-none focus:border-orange-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                  WhatsApp
                </label>
                <input
                  type="tel"
                  placeholder="(11) 99999-9999"
                  className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-600 focus:outline-none focus:border-orange-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                  Objetivo Principal
                </label>
                <select className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white focus:outline-none focus:border-orange-500 transition-colors">
                  <option>Ganho de Massa (Hipertrofia)</option>
                  <option>Perda de Peso / Emagrecimento</option>
                  <option>Condicionamento Físico</option>
                  <option>Aulas de Cross / Grupo</option>
                </select>
              </div>
              <button
                type="submit"
                className="w-full py-4 rounded-xl bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white font-semibold text-base transition-all shadow-orange-glow"
              >
                Solicitar Contato Especializado
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

// --- FOOTER ---
const Footer = () => {
  const [year, setYear] = useState(2026);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="bg-zinc-950 border-t border-zinc-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-orange-600/20 border border-orange-500/30 text-orange-400">
            <Dumbbell className="w-5 h-5" />
          </div>
          <span className="text-lg font-bold tracking-wider text-white">
            PULSE<span className="text-orange-500">FIT</span>
          </span>
        </div>
        <p className="text-sm text-zinc-500">
          © {year} PulseFit. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
};

// ==========================================
// MAIN PAGE COMPONENT
// ==========================================
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#08090A] text-zinc-100 selection:bg-orange-500 selection:text-white font-sans antialiased overflow-x-hidden">
      <Navbar />
      <main>
        <Hero />
        <Marquee />
        <Features />
        <Gallery />
        <Pricing />
        <FAQ />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}