"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useAnimationControls,
  useInView,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import {
  ArrowRight,
  Award,
  CheckCircle2,
  ChevronDown,
  Clock,
  HeartPulse,
  Loader2,
  Lock,
  MessageCircle,
  ShieldAlert,
  ShieldCheck,
  Star,
  X,
  Zap,
} from "lucide-react";
import {
  PILOT_MODALITIES,
  savePilotLead,
  trackAnalyticsEvent,
} from "@/lib/firebase";
import {
  AnimatedValue,
  Confetti,
  CountUp,
  Reveal,
  ScrollProgress,
  TiltCard,
} from "@/components/ui/MotionKit";

const WHATSAPP_NUMBER = "5511993182472";
const CURRENT_YEAR = new Date().getFullYear();

type Modality = (typeof PILOT_MODALITIES)[number];

const MODALITIES: {
  id: Modality;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  badge: string;
}[] = [
  {
    id: "agricola",
    title: "Aviação Agrícola",
    subtitle: "Air Tractor • Ipanema • Thrush",
    description:
      "Apólice sem exclusão para pulverização aeroagrícola, voo a baixa altitude e pistas rurais.",
    image:
      "/images/images-jobs/air-tractor.jpg",
    badge: "Especialidade Costi",
  },
  {
    id: "executivo",
    title: "Executiva & Táxi Aéreo",
    subtitle: "Jatos • Turboélices • King Air",
    description:
      "Proteção de renda (DIT), perda de CMA e cobertura internacional 24h para comandantes.",
    image:
      "/images/images-jobs/jato-executivo.jpg",
    badge: "Renda Protegida",
  },
  {
    id: "comercial",
    title: "Linha Aérea Comercial",
    subtitle: "Airbus • Boeing • Embraer • ATR",
    description:
      "Seguro individual que acompanha sua carreira em qualquer companhia, com foco em perda de licença.",
    image:
      "/images/images-jobs/1920-wing-of-an-airplane-flying-above-the-clouds.jpg",
    badge: "Portabilidade Total",
  },
  {
    id: "helicoptero",
    title: "Helicópteros",
    subtitle: "Esquilo • Bell • Agusta • Robinson",
    description:
      "Cobertura para operações VIP, helipontos elevados, resgate aeromédico e offshore.",
    image:
      "/images/images-jobs/Helicoptero.jpg",
    badge: "Asas Rotativas",
  },
];

const MODALITY_LABELS: Record<Modality, string> = {
  agricola: "Aviação Agrícola",
  executivo: "Aviação Executiva / Táxi Aéreo",
  comercial: "Linha Aérea Comercial",
  helicoptero: "Helicópteros",
  instrucao: "Aviação Privada / Instrução",
};

const COVERAGES = [
  {
    icon: ShieldCheck,
    title: "Sem exclusão para aviação",
    text: "Sua atividade de piloto consta expressamente coberta na apólice, em voo e em solo.",
  },
  {
    icon: HeartPulse,
    title: "Proteção de CMA e renda (DIT)",
    text: "Diárias por incapacidade temporária ou indenização se você ficar impedido de renovar o CMA.",
  },
  {
    icon: Award,
    title: "Invalidez e doenças graves",
    text: "Até 100% do capital em caso de invalidez ou diagnóstico grave, com liquidez imediata para sua família.",
  },
];

const FAQS = [
  {
    q: "Por que o seguro de vida de banco não cobre pilotos?",
    a: "Apólices tradicionais trazem nas letras miúdas uma cláusula de riscos excluídos que retira a cobertura de acidentes aéreos fora da aviação regular. Na Costi, sua profissão é declarada e 100% coberta.",
  },
  {
    q: "Pilotos agrícolas têm cobertura durante a pulverização?",
    a: "Sim. A Costi é referência nacional em seguro de vida para pilotos agrícolas (1º lugar na campanha Acelera MAPFRE). Você fica protegido na aplicação, no translado e em solo.",
  },
  {
    q: "E se eu perder meu CMA ou ficar afastado?",
    a: "Com Diária por Incapacidade Temporária, Doenças Graves e Invalidez você mantém sua estabilidade financeira enquanto se recupera ou se não puder retornar à cabine.",
  },
  {
    q: "Em quanto tempo recebo minha cotação?",
    a: "Preencha o formulário e um especialista em aviação compara as maiores seguradoras (MAPFRE, Prudential, Porto, Icatu, MAG) e envia no seu WhatsApp.",
  },
];

const CAPITAL_MIN = 300000;
const CAPITAL_MAX = 5000000;

function capitalTier(value: number) {
  if (value < 1500000) return { label: "Proteção essencial", level: 1 };
  if (value < 3000000) return { label: "Proteção reforçada", level: 2 };
  return { label: "Proteção máxima", level: 3 };
}

const STATS: { to: number; prefix?: string; suffix: string; label: string }[] = [
  { to: 5, prefix: "R$ ", suffix: " mi", label: "Capital segurado até" },
  { to: 5, suffix: "+", label: "Seguradoras comparadas" },
  { to: 15, suffix: " min", label: "Para receber a cotação" },
  { to: 1, suffix: "º lugar", label: "Acelera MAPFRE" },
];

const formatBRL = (value: number) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(value);

function waLink(text: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

function trackLead() {
  const fbq = (window as unknown as { fbq?: (...args: unknown[]) => void }).fbq;
  fbq?.("track", "Lead", { content_name: "seguro_pilotos" });
}

function FieldStatus({ valid, invalid }: { valid: boolean; invalid: boolean }) {
  if (!valid && !invalid) return null;

  return (
    <motion.span
      key={valid ? "valid" : "invalid"}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 400, damping: 18 }}
      className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2"
    >
      {valid ? (
        <CheckCircle2 className="h-5 w-5 text-green-400" />
      ) : (
        <X className="h-5 w-5 text-red-400" />
      )}
    </motion.span>
  );
}

export default function PilotosLanding() {
  const [name, setName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [modality, setModality] = useState<Modality>("agricola");
  const [capital, setCapital] = useState(1000000);
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState<{
    link: string;
    whatsappOpened: boolean;
    whatsappRequested: boolean;
  } | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const formStartTracked = useRef(false);
  const submitting = useRef(false);
  const [saveFailed, setSaveFailed] = useState(false);
  const [touched, setTouched] = useState({
    name: false,
    whatsapp: false,
    consent: false,
  });
  const [showStickyBar, setShowStickyBar] = useState(false);
  const reduceMotion = useReducedMotion();
  const shakeControls = useAnimationControls();
  const heroRef = useRef<HTMLElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const formInView = useInView(formRef, { margin: "0px 0px -20% 0px" });
  const { scrollY } = useScroll();
  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroImageY = useTransform(heroProgress, [0, 1], ["0%", "7%"]);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setShowStickyBar(latest > 560);
  });

  const nameValid = name.trim().length >= 3;
  const whatsappValid = whatsapp.replace(/\D/g, "").length >= 10;
  const completedSteps =
    Number(nameValid) + Number(whatsappValid) + Number(consent);
  const tier = capitalTier(capital);
  const capitalPercent =
    ((capital - CAPITAL_MIN) / (CAPITAL_MAX - CAPITAL_MIN)) * 100;

  const fieldClass = (valid: boolean, wasTouched: boolean) =>
    `w-full rounded-xl border bg-black/30 px-4 py-3.5 pr-11 text-sm outline-none transition placeholder:text-slate-500 focus:shadow-[0_0_0_4px_rgba(255,85,0,0.18)] ${
      valid
        ? "border-green-500/60 focus:border-green-400"
        : wasTouched
          ? "border-red-500/70 focus:border-red-400"
          : "border-white/10 focus:border-[#FF5500]"
    }`;

  const shakeForm = () => {
    if (reduceMotion) return;
    void shakeControls.start({
      x: [0, -10, 10, -7, 7, -3, 0],
      transition: { duration: 0.45 },
    });
  };

  const handlePhone = (value: string) => {
    const d = value.replace(/\D/g, "").slice(0, 11);
    let out = d;
    if (d.length > 2) out = `(${d.slice(0, 2)}) ${d.slice(2)}`;
    if (d.length > 7) out = `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
    setWhatsapp(out);
  };

  const submit = async (
    e: { preventDefault(): void },
    openWhatsApp = false
  ) => {
    e.preventDefault();
    if (submitting.current) return;
    setError("");

    if (name.trim().length < 3) {
      setTouched({ name: true, whatsapp: true, consent: true });
      shakeForm();
      trackAnalyticsEvent({
        eventName: "pilot_form_validation_error",
        field: "name",
      });
      return setError("Informe seu nome completo.");
    }
    if (whatsapp.replace(/\D/g, "").length < 10) {
      setTouched({ name: true, whatsapp: true, consent: true });
      shakeForm();
      trackAnalyticsEvent({
        eventName: "pilot_form_validation_error",
        field: "whatsapp",
      });
      return setError("Informe um WhatsApp válido com DDD.");
    }
    if (!consent) {
      setTouched({ name: true, whatsapp: true, consent: true });
      shakeForm();
      trackAnalyticsEvent({
        eventName: "pilot_form_validation_error",
        field: "consent",
      });
      return setError("Aceite o contato para receber a cotação.");
    }

    const whatsappUrl = waLink(
      `Olá, equipe Costi Seguros! Sou ${name.trim()} e quero a cotação de seguro de vida para piloto (${MODALITY_LABELS[modality]}) com capital de ${formatBRL(capital)}.`
    );
    const whatsappWindow = openWhatsApp
      ? window.open("about:blank", "_blank")
      : null;
    if (whatsappWindow) whatsappWindow.opener = null;

    submitting.current = true;
    setLoading(true);
    try {
      await savePilotLead({
        name,
        whatsapp,
        modality,
        capitalInsured: capital,
        consent: true,
      });
    } catch (saveError) {
      whatsappWindow?.close();
      console.error("Could not save the pilot lead.", saveError);
      setError(
        saveError instanceof Error && saveError.message === "firestore/timeout"
          ? "A conexão demorou demais e não conseguimos confirmar o envio. Use o botão do WhatsApp abaixo."
          : "Não foi possível salvar seu pedido. Tente novamente ou chame no WhatsApp."
      );
      setSaveFailed(true);
      try {
        trackAnalyticsEvent({ eventName: "pilot_lead_save_error" });
      } catch (analyticsError) {
        console.error("Could not track the pilot lead save error.", analyticsError);
      }
      submitting.current = false;
      setLoading(false);
      return;
    }

    let whatsappOpened = false;
    if (whatsappWindow && !whatsappWindow.closed) {
      try {
        whatsappWindow.location.replace(whatsappUrl);
        whatsappOpened = true;
      } catch (whatsappError) {
        console.error("Could not open the Costi WhatsApp conversation.", whatsappError);
        whatsappWindow.close();
      }
    }

    setDone({
      link: whatsappUrl,
      whatsappOpened,
      whatsappRequested: openWhatsApp,
    });
    submitting.current = false;
    setLoading(false);

    try {
      trackLead();
      if (whatsappOpened) {
        trackAnalyticsEvent({
          eventName: "pilot_whatsapp_click",
          placement: "success",
        });
      }
      trackAnalyticsEvent({
        eventName: "pilot_lead_submitted",
        modality,
        capitalInsured: capital,
      });
    } catch (analyticsError) {
      console.error("Lead was saved, but analytics tracking failed.", analyticsError);
    }

  };

  const scrollToForm = () =>
    document.getElementById("cotacao")?.scrollIntoView({ behavior: "smooth" });

  return (
    <main id="conteudo" className="min-h-screen bg-[#050B16] font-sans text-white antialiased">
      <ScrollProgress />
      <div className="bg-gradient-to-r from-[#FF5500] to-[#FF8A00] px-4 py-2 text-center text-xs font-bold uppercase tracking-wide sm:text-sm">
        <Zap className="mr-1 inline h-4 w-4 animate-pulse" />
        Cotação em até 15 minutos • Sem compromisso • Compare 5 seguradoras
      </div>

      <header
        className={`sticky top-0 z-40 border-b backdrop-blur-xl transition-all duration-300 ${
          showStickyBar
            ? "border-orange-500/30 bg-[#050B16]/95 shadow-lg shadow-black/40"
            : "border-white/10 bg-[#050B16]/85"
        }`}
      >
        <div
          className={`mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 transition-all duration-300 ${
            showStickyBar ? "py-1.5" : "py-3"
          }`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/images-jobs/Logo-Costi-Seguros-Branco.png"
            alt="Costi Corretora de Seguros"
            className={`w-auto transition-all duration-300 ${
              showStickyBar ? "h-11 sm:h-12" : "h-14 sm:h-16"
            }`}
          />
          <button
            onClick={() => {
              trackAnalyticsEvent({
                eventName: "pilot_cta_click",
                placement: "header",
              });
              scrollToForm();
            }}
            className="rounded-full bg-[#FF5500] px-5 py-2 text-sm font-bold shadow-lg shadow-orange-600/30 transition hover:scale-105 hover:bg-[#FF6A1F] active:scale-95"
          >
            Cotar agora
          </button>
        </div>
      </header>

      <section ref={heroRef} className="relative overflow-hidden">
        <div className="absolute inset-0">
          <motion.div
            style={reduceMotion ? undefined : { y: heroImageY }}
            className="absolute inset-x-0 -top-[10%] h-[120%]"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/images-jobs/bkg-seguro-piloto-agricola.jpg"
              alt=""
              className="h-full w-full object-cover object-[0%_center] opacity-75"
            />
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-r from-[#050B16] via-[#050B16]/70 to-[#050B16]/15 lg:via-[#050B16]/50" />
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#050B16] to-transparent" />
          <motion.div
            animate={
              reduceMotion
                ? undefined
                : { scale: [1, 1.18, 1], opacity: [0.7, 1, 0.7] }
            }
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -left-32 top-20 h-96 w-96 rounded-full bg-[#FF5500]/20 blur-[120px]"
          />
        </div>

        <div className="relative mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-12 lg:py-24">
          <motion.div
            initial={reduceMotion ? false : "hidden"}
            animate="show"
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.12 } },
            }}
            className="space-y-7 lg:col-span-7"
          >
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 18 },
                show: { opacity: 1, y: 0 },
              }}
              className="inline-flex items-center gap-2 rounded-full border border-orange-500/40 bg-orange-500/10 px-4 py-1.5 text-xs font-semibold text-orange-300 sm:text-sm"
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#FF5500] opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#FF5500]" />
              </span>
              <ShieldAlert className="h-4 w-4" />
              Seu seguro de banco pode NÃO pagar em acidente aéreo
            </motion.div>

            <motion.h1
              variants={{
                hidden: { opacity: 0, y: 26 },
                show: { opacity: 1, y: 0 },
              }}
              className="text-4xl font-black leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl"
            >
              Seu voo não para.
              <br />
              <motion.span
                animate={
                  reduceMotion
                    ? undefined
                    : { backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }
                }
                transition={{ duration: 7, repeat: Infinity, ease: "linear" }}
                style={{ backgroundSize: "200% 100%" }}
                className="bg-gradient-to-r from-[#FF5500] via-[#FFB36B] to-[#FF5500] bg-clip-text text-transparent"
              >
                Sua família não pode ficar desprotegida.
              </motion.span>
            </motion.h1>

            <motion.p
              variants={{
                hidden: { opacity: 0, y: 22 },
                show: { opacity: 1, y: 0 },
              }}
              className="max-w-2xl text-lg text-slate-300 sm:text-xl"
            >
              Seguro de vida <strong className="text-white">sem exclusão para aviação</strong>:
              agrícola, executiva, comercial e helicópteros. Proteção de renda e perda de CMA
              incluídas.
            </motion.p>

            <motion.ul
              variants={{
                hidden: { opacity: 0, y: 22 },
                show: { opacity: 1, y: 0 },
              }}
              className="grid gap-3 text-sm sm:grid-cols-2 sm:text-base"
            >
              {[
                "Cobertura 100% em voo e solo",
                "Proteção de renda e perda de CMA",
                "1º lugar Acelera MAPFRE",
                "Atendimento direto por WhatsApp",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2 text-slate-200">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-[#FF5500]" />
                  {item}
                </li>
              ))}
            </motion.ul>

            <motion.div
              variants={{
                hidden: { opacity: 0, y: 22 },
                show: { opacity: 1, y: 0 },
              }}
              className="flex flex-wrap gap-4 pt-2"
            >
              <button
                onClick={() => {
                  trackAnalyticsEvent({
                    eventName: "pilot_cta_click",
                    placement: "hero",
                  });
                  scrollToForm();
                }}
                className="group relative inline-flex items-center gap-2 overflow-hidden rounded-xl bg-[#FF5500] px-7 py-4 text-base font-extrabold shadow-xl shadow-orange-600/40 transition hover:scale-[1.03] hover:bg-[#FF6A1F] active:scale-95"
              >
                <span
                  aria-hidden
                  className="absolute inset-y-0 -left-1/3 w-1/4 -skew-x-12 bg-white/30 transition-transform duration-700 group-hover:translate-x-[600%]"
                />
                <span className="relative">QUERO MINHA COTAÇÃO</span>
                <ArrowRight className="relative h-5 w-5 transition group-hover:translate-x-1" />
              </button>
              <a
                href={waLink("Olá, equipe Costi Seguros! Quero uma cotação de seguro de vida para piloto.")}
                onClick={() =>
                  trackAnalyticsEvent({
                    eventName: "pilot_whatsapp_click",
                    placement: "hero",
                  })
                }
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-7 py-4 font-bold backdrop-blur transition hover:border-green-400/60 hover:bg-white/10 active:scale-95"
              >
                <MessageCircle className="h-5 w-5 text-green-400" />
                Falar no WhatsApp
              </a>
            </motion.div>
          </motion.div>

          <div id="cotacao" ref={formRef} className="scroll-mt-24 lg:col-span-5">
            <motion.div
              animate={shakeControls}
              className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.06] p-6 shadow-2xl shadow-black/50 ring-1 ring-orange-500/30 backdrop-blur-2xl sm:p-8"
            >
              {done ? (
                <motion.div
                  initial={reduceMotion ? false : { opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", stiffness: 220, damping: 20 }}
                  className="relative space-y-5 text-center"
                >
                  <Confetti />
                  <motion.div
                    initial={reduceMotion ? false : { scale: 0, rotate: -40 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 260, damping: 14, delay: 0.1 }}
                    className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-500/15 ring-8 ring-green-500/10"
                  >
                    <CheckCircle2 className="h-14 w-14 text-green-400" />
                  </motion.div>
                  <h2 className="text-2xl font-black">Recebemos seu pedido!</h2>
                  <p className="text-slate-300">
                    {done.whatsappOpened
                      ? "Seu lead foi salvo e abrimos a conversa com a Costi no WhatsApp."
                      : done.whatsappRequested
                        ? "Seu lead foi salvo, mas o navegador bloqueou a abertura automática do WhatsApp. Use o botão abaixo para enviar a mensagem."
                        : "Seu pedido foi salvo. Para agilizar, envie também a solicitação pelo WhatsApp com o botão abaixo."}
                  </p>
                  <a
                    href={done.link}
                    onClick={() =>
                      trackAnalyticsEvent({
                        eventName: "pilot_whatsapp_click",
                        placement: "success",
                      })
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 rounded-xl bg-green-600 py-4 font-bold shadow-lg shadow-green-600/30 transition hover:bg-green-500 active:scale-95"
                  >
                    <MessageCircle className="h-5 w-5" />
                    {done.whatsappOpened
                      ? "Abrir conversa novamente"
                      : "Enviar solicitação pelo WhatsApp"}
                  </a>
                </motion.div>
              ) : (
                <form
                  onSubmit={submit}
                  onFocusCapture={() => {
                    if (formStartTracked.current) return;
                    formStartTracked.current = true;
                    trackAnalyticsEvent({ eventName: "pilot_form_start" });
                  }}
                  className="space-y-4"
                  noValidate
                >
                  <div>
                    <span className="text-xs font-bold uppercase tracking-widest text-[#FF7A33]">
                      Cotação gratuita
                    </span>
                    <h2 className="text-2xl font-black">Receba sua proposta no WhatsApp</h2>
                  </div>

                  <div
                    role="progressbar"
                    aria-label="Progresso do formulário"
                    aria-valuemin={0}
                    aria-valuemax={3}
                    aria-valuenow={completedSteps}
                    className="space-y-1.5"
                  >
                    <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                      <span>
                        {completedSteps === 3
                          ? "Tudo pronto!"
                          : `${completedSteps} de 3 etapas`}
                      </span>
                      <span className={completedSteps === 3 ? "text-green-400" : ""}>
                        {Math.round((completedSteps / 3) * 100)}%
                      </span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          completedSteps === 3
                            ? "bg-green-500"
                            : "bg-gradient-to-r from-[#FF5500] to-[#FF8A00]"
                        }`}
                        style={{ width: `${(completedSteps / 3) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="relative">
                      <input
                        type="text"
                        autoComplete="name"
                        maxLength={100}
                        placeholder="Seu nome completo"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        onBlur={() => setTouched((t) => ({ ...t, name: true }))}
                        aria-invalid={touched.name && !nameValid}
                        className={fieldClass(nameValid, touched.name)}
                      />
                      <FieldStatus valid={nameValid} invalid={touched.name && !nameValid} />
                    </div>
                    {touched.name && !nameValid && (
                      <p className="mt-1 text-xs text-red-400">Informe seu nome completo.</p>
                    )}
                  </div>
                  <div>
                    <div className="relative">
                      <input
                        type="tel"
                        autoComplete="tel"
                        placeholder="WhatsApp com DDD"
                        value={whatsapp}
                        onChange={(e) => handlePhone(e.target.value)}
                        onBlur={() => setTouched((t) => ({ ...t, whatsapp: true }))}
                        aria-invalid={touched.whatsapp && !whatsappValid}
                        className={fieldClass(whatsappValid, touched.whatsapp)}
                      />
                      <FieldStatus
                        valid={whatsappValid}
                        invalid={touched.whatsapp && !whatsappValid}
                      />
                    </div>
                    {touched.whatsapp && !whatsappValid && (
                      <p className="mt-1 text-xs text-red-400">
                        Informe um WhatsApp válido com DDD.
                      </p>
                    )}
                  </div>
                  <select
                    value={modality}
                    onChange={(e) => {
                      const selectedModality = e.target.value as Modality;
                      setModality(selectedModality);
                      trackAnalyticsEvent({
                        eventName: "pilot_modality_select",
                        modality: selectedModality,
                      });
                    }}
                    className="w-full rounded-xl border border-white/10 bg-[#0B1424] px-4 py-3.5 text-sm outline-none transition focus:border-[#FF5500] focus:shadow-[0_0_0_4px_rgba(255,85,0,0.18)]"
                  >
                    {PILOT_MODALITIES.map((m) => (
                      <option key={m} value={m}>
                        {MODALITY_LABELS[m]}
                      </option>
                    ))}
                  </select>

                  <div className="rounded-xl border border-white/10 bg-black/30 p-4">
                    <div className="mb-3 flex items-center justify-between text-xs text-slate-400">
                      <span>Capital segurado</span>
                      <AnimatedValue
                        value={capital}
                        format={(v) => formatBRL(Math.round(v / 100000) * 100000)}
                        className="text-2xl font-black tabular-nums text-white"
                      />
                    </div>
                    <input
                      type="range"
                      min={CAPITAL_MIN}
                      max={CAPITAL_MAX}
                      step={100000}
                      value={capital}
                      onChange={(e) => setCapital(Number(e.target.value))}
                      onPointerUp={(e) =>
                        trackAnalyticsEvent({
                          eventName: "pilot_capital_select",
                          capitalInsured: Number(e.currentTarget.value),
                        })
                      }
                      onKeyUp={(e) =>
                        trackAnalyticsEvent({
                          eventName: "pilot_capital_select",
                          capitalInsured: Number(e.currentTarget.value),
                        })
                      }
                      aria-label="Capital segurado"
                      style={{
                        background: `linear-gradient(to right, #FF5500 0%, #FF8A00 ${capitalPercent}%, rgba(255,255,255,0.12) ${capitalPercent}%)`,
                      }}
                      className="h-2 w-full cursor-pointer appearance-none rounded-full outline-none [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:cursor-grab [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-4 [&::-moz-range-thumb]:border-[#FF5500] [&::-moz-range-thumb]:bg-white [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:cursor-grab [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-4 [&::-webkit-slider-thumb]:border-[#FF5500] [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-orange-600/50 [&::-webkit-slider-thumb]:transition-transform active:[&::-webkit-slider-thumb]:scale-125 focus-visible:[&::-webkit-slider-thumb]:ring-4 focus-visible:[&::-webkit-slider-thumb]:ring-orange-500/40"
                    />
                    <div className="mt-2 flex justify-between text-[10px] text-slate-500">
                      <span>R$ 300 mil</span>
                      <span>R$ 5 mi</span>
                    </div>
                    <div className="mt-3 flex items-center gap-3">
                      <div className="flex flex-1 gap-1">
                        {[1, 2, 3].map((level) => (
                          <span
                            key={level}
                            className={`h-1.5 flex-1 rounded-full transition-colors duration-500 ${
                              level <= tier.level ? "bg-[#FF5500]" : "bg-white/10"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs font-semibold text-orange-300">{tier.label}</span>
                    </div>
                  </div>

                  <div>
                    <label className="flex cursor-pointer items-start gap-3 text-xs text-slate-400">
                      <input
                        type="checkbox"
                        checked={consent}
                        onChange={(e) => {
                          setConsent(e.target.checked);
                          setTouched((t) => ({ ...t, consent: true }));
                        }}
                        aria-invalid={touched.consent && !consent}
                        className="mt-0.5 h-4 w-4 accent-[#FF5500]"
                      />
                      <span>
                        Autorizo a Costi a entrar em contato por WhatsApp e usar meus dados para
                        elaborar a cotação (LGPD). A exclusão automática ainda não está ativa;
                        consulte o{" "}
                        <Link href="/privacidade" className="underline hover:text-white">
                          Aviso de Privacidade
                        </Link>{" "}
                        sobre retenção e remoção dos dados.
                      </span>
                    </label>
                    {touched.consent && !consent && (
                      <p className="mt-1 text-xs text-red-400">
                        Aceite o contato para receber a cotação.
                      </p>
                    )}
                  </div>

                  <AnimatePresence>
                    {error && (
                      <motion.p
                        key={error}
                        initial={reduceMotion ? false : { opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        role="alert"
                        className="flex items-center gap-2 text-sm text-red-400"
                      >
                        <X className="h-4 w-4" /> {error}
                      </motion.p>
                    )}
                  </AnimatePresence>

                  <button
                    type="submit"
                    disabled={loading}
                    className={`group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl py-4 text-base font-black shadow-lg transition hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 ${
                      completedSteps === 3
                        ? "bg-gradient-to-r from-[#FF5500] to-[#FF8A00] shadow-orange-600/50"
                        : "bg-gradient-to-r from-[#FF5500]/80 to-[#FF8A00]/80 shadow-orange-600/30"
                    }`}
                  >
                    {completedSteps === 3 && !loading && !reduceMotion && (
                      <span
                        aria-hidden
                        className="absolute inset-0 animate-pulse rounded-xl ring-2 ring-white/40"
                      />
                    )}
                    {loading ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" /> Enviando...
                      </>
                    ) : (
                      <>
                        RECEBER COTAÇÃO GRÁTIS{" "}
                        <ArrowRight className="h-5 w-5 transition group-hover:translate-x-1" />
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    disabled={loading}
                    onClick={(e) => submit(e, true)}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 py-3.5 text-sm font-bold shadow-lg shadow-green-600/30 transition hover:bg-green-500 active:scale-[0.98] disabled:opacity-60"
                  >
                    <MessageCircle className="h-5 w-5" />
                    ENVIAR SOLICITAÇÃO PELO WHATSAPP
                  </button>
                  {saveFailed && (
                    <a
                      href={waLink(
                        `Olá, equipe Costi Seguros! Sou ${name.trim() || "piloto"} e quero a cotação de seguro de vida para piloto (${MODALITY_LABELS[modality]}) com capital de ${formatBRL(capital)}. WhatsApp: ${whatsapp}`
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex w-full items-center justify-center gap-2 rounded-xl border border-green-500/50 py-3 text-sm font-bold text-green-300 transition hover:bg-green-500/10"
                    >
                      <MessageCircle className="h-4 w-4" />
                      Falar direto no WhatsApp da Costi
                    </a>
                  )}
                  <p className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
                    <Lock className="h-3 w-3" /> Seus dados estão protegidos. Sem spam.
                  </p>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-white/[0.03]">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-10 text-center sm:px-6 md:grid-cols-4">
          {STATS.map((stat, index) => (
            <Reveal key={stat.label} delay={index * 0.08}>
              <div className="bg-gradient-to-r from-[#FF5500] to-[#FFB36B] bg-clip-text text-3xl font-black tabular-nums text-transparent sm:text-4xl">
                <CountUp to={stat.to} prefix={stat.prefix} suffix={stat.suffix} />
              </div>
              <div className="mt-1 text-xs uppercase tracking-wider text-slate-400">
                {stat.label}
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <Reveal>
          <h2 className="mb-12 text-center text-3xl font-black sm:text-5xl">
            Seguro de banco <span className="text-red-500">vs</span>{" "}
            <span className="text-[#FF5500]">Costi Aviação</span>
          </h2>
        </Reveal>
        <div className="grid gap-6 md:grid-cols-2">
          <Reveal y={40}>
            <div className="h-full rounded-3xl border border-red-500/30 bg-red-500/5 p-8">
              <h3 className="mb-4 text-xl font-bold text-red-400">Seguro comum</h3>
              {[
                "Exclui acidentes aéreos nas letras miúdas",
                "Ignora perda de CMA",
                "Sem proteção de renda para PJ",
                "Família descobre o problema na hora errada",
              ].map((t) => (
                <p key={t} className="flex items-start gap-2 py-1.5 text-slate-300">
                  <X className="mt-0.5 h-5 w-5 shrink-0 text-red-500" /> {t}
                </p>
              ))}
            </div>
          </Reveal>
          <Reveal y={40} delay={0.12}>
            <div className="h-full rounded-3xl border border-orange-500/40 bg-orange-500/10 p-8 shadow-xl shadow-orange-600/10 transition hover:shadow-orange-600/25">
              <h3 className="mb-4 text-xl font-bold text-[#FF7A33]">Costi Aviação</h3>
              {[
                "Profissão de piloto declarada e coberta",
                "Perda de CMA e invalidez protegidas",
                "DIT para pilotos PJ e autônomos",
                "Cotação comparada em 5 seguradoras",
              ].map((t) => (
                <p key={t} className="flex items-start gap-2 py-1.5 text-slate-100">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#FF5500]" /> {t}
                </p>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6">
        <div className="grid gap-6 md:grid-cols-3">
          {COVERAGES.map(({ icon: Icon, title, text }, index) => (
            <Reveal key={title} delay={index * 0.1}>
              <div className="group h-full rounded-3xl border border-white/10 bg-white/[0.04] p-7 transition duration-300 hover:-translate-y-1.5 hover:border-orange-500/50 hover:shadow-xl hover:shadow-orange-600/10">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FF5500]/15 text-[#FF5500] transition duration-300 group-hover:scale-110 group-hover:rotate-6 group-hover:bg-[#FF5500] group-hover:text-white">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-xl font-bold">{title}</h3>
                <p className="text-slate-400">{text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="bg-white/[0.03] py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <Reveal>
            <h2 className="mb-12 text-center text-3xl font-black sm:text-5xl">
              Qual é o seu tipo de voo?
            </h2>
          </Reveal>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {MODALITIES.map((m, index) => {
              const selected = modality === m.id;
              return (
                <Reveal key={m.id} delay={index * 0.08}>
                  <TiltCard className="relative h-96 rounded-3xl">
                    <button
                      onClick={() => {
                        setModality(m.id);
                        trackAnalyticsEvent({
                          eventName: "pilot_modality_select",
                          modality: m.id,
                        });
                        scrollToForm();
                      }}
                      aria-pressed={selected}
                      className={`group relative h-full w-full overflow-hidden rounded-3xl border text-left transition duration-300 ${
                        selected
                          ? "border-[#FF5500] shadow-xl shadow-orange-600/30 ring-2 ring-[#FF5500]"
                          : "border-white/10 hover:border-orange-500/50"
                      }`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={m.image}
                        alt={m.title}
                        loading="lazy"
                        className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#050B16] via-[#050B16]/70 to-transparent" />
                      {selected && (
                        <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-[#FF5500] px-3 py-1 text-[10px] font-bold uppercase shadow-lg">
                          <CheckCircle2 className="h-3.5 w-3.5" /> Selecionado
                        </span>
                      )}
                      <div className="absolute inset-x-0 bottom-0 space-y-2 p-5 transition-transform duration-300 group-hover:-translate-y-1">
                        <span className="inline-block rounded-full bg-[#FF5500] px-3 py-1 text-[10px] font-bold uppercase">
                          {m.badge}
                        </span>
                        <h3 className="text-xl font-black">{m.title}</h3>
                        <p className="text-xs text-orange-300">{m.subtitle}</p>
                        <p className="text-sm text-slate-300">{m.description}</p>
                        <span className="flex items-center gap-1 pt-1 text-xs font-bold text-[#FF8A33] opacity-0 transition duration-300 group-hover:opacity-100">
                          Cotar esta modalidade <ArrowRight className="h-3.5 w-3.5" />
                        </span>
                      </div>
                    </button>
                  </TiltCard>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-20 sm:px-6">
        <Reveal>
          <h2 className="mb-12 text-center text-3xl font-black sm:text-5xl">3 passos. Zero burocracia.</h2>
        </Reveal>
        <div className="grid gap-6 md:grid-cols-3">
          {[
            [Clock, "Preencha em 30s", "Nome, WhatsApp e tipo de voo."],
            [Star, "Comparamos por você", "Cotação nas maiores seguradoras do mundo."],
            [ShieldCheck, "Proteção ativa", "Apólice emitida com sua atividade coberta."],
          ].map(([Icon, title, text], i) => {
            const I = Icon as typeof Clock;
            return (
              <Reveal key={i} delay={i * 0.12}>
                <div className="group relative h-full overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-7 transition duration-300 hover:-translate-y-1.5 hover:border-orange-500/50">
                  <span className="absolute right-5 top-3 text-6xl font-black text-white/5 transition duration-300 group-hover:text-[#FF5500]/20">
                    {i + 1}
                  </span>
                  <I className="mb-4 h-8 w-8 text-[#FF5500] transition duration-300 group-hover:scale-110" />
                  <h3 className="mb-1 text-lg font-bold">{title as string}</h3>
                  <p className="text-slate-400">{text as string}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 pb-20 sm:px-6">
        <Reveal>
          <h2 className="mb-8 text-center text-3xl font-black">Perguntas frequentes</h2>
        </Reveal>
        <div className="space-y-3">
          {FAQS.map((f, i) => (
            <Reveal key={f.q} delay={i * 0.06}>
              <div
                className={`overflow-hidden rounded-2xl border bg-white/[0.04] transition-colors duration-300 ${
                  openFaq === i ? "border-orange-500/50" : "border-white/10 hover:border-white/25"
                }`}
              >
                <button
                  onClick={() => {
                    const opening = openFaq !== i;
                    setOpenFaq(opening ? i : null);
                    if (opening) {
                      trackAnalyticsEvent({
                        eventName: "pilot_faq_open",
                        faqIndex: i + 1,
                      });
                    }
                  }}
                  aria-expanded={openFaq === i}
                  className="flex w-full items-center justify-between gap-4 p-5 text-left font-semibold"
                >
                  {f.q}
                  <ChevronDown
                    className={`h-5 w-5 shrink-0 text-[#FF5500] transition-transform duration-300 ${openFaq === i ? "rotate-180" : ""}`}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {openFaq === i && (
                    <motion.div
                      initial={reduceMotion ? false : { height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={reduceMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                      className="overflow-hidden"
                    >
                      <p className="px-5 pb-5 text-slate-400">{f.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="px-4 pb-20 sm:px-6">
        <Reveal>
          <div className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl bg-gradient-to-br from-[#FF5500] to-[#C2410C] p-10 text-center shadow-2xl shadow-orange-700/30 sm:p-16">
            <motion.div
              aria-hidden
              animate={reduceMotion ? undefined : { x: ["-20%", "20%", "-20%"] }}
              transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-24 left-1/4 h-64 w-64 rounded-full bg-white/15 blur-3xl"
            />
            <h2 className="relative mb-4 text-3xl font-black sm:text-5xl">Não espere o pior para descobrir a exclusão.</h2>
            <p className="relative mx-auto mb-8 max-w-2xl text-orange-50">
              Em 15 minutos você sabe exatamente quanto custa proteger quem depende de você.
            </p>
            <button
              onClick={() => {
                trackAnalyticsEvent({
                  eventName: "pilot_cta_click",
                  placement: "footer",
                });
                scrollToForm();
              }}
              className="relative rounded-xl bg-white px-8 py-4 text-lg font-black text-[#C2410C] shadow-xl transition hover:scale-105 active:scale-95"
            >
              COTAR AGORA
            </button>
          </div>
        </Reveal>
      </section>

      <footer className="space-y-4 border-t border-white/10 px-4 py-8 text-center text-xs text-slate-500">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/images-jobs/Logo-Costi-Seguros-Branco.png"
          alt="Costi Corretora de Seguros"
          className="mx-auto h-10 w-auto opacity-80"
        />
        <p>
          © {CURRENT_YEAR} Costi Corretora de Seguros • Demonstração de hotsite •
          Cotação sujeita a análise e aceitação das seguradoras.
        </p>
      </footer>

      <AnimatePresence>
        {showStickyBar && !formInView && !done && (
          <motion.div
            initial={reduceMotion ? false : { y: 90, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { y: 90, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 26 }}
            className="fixed inset-x-0 bottom-0 z-40 border-t border-orange-500/30 bg-[#050B16]/95 p-3 backdrop-blur-xl lg:hidden"
          >
            <button
              onClick={() => {
                trackAnalyticsEvent({
                  eventName: "pilot_cta_click",
                  placement: "sticky_bar",
                });
                scrollToForm();
              }}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#FF5500] to-[#FF8A00] py-3.5 text-sm font-black shadow-lg shadow-orange-600/40 active:scale-[0.98]"
            >
              RECEBER COTAÇÃO GRÁTIS <ArrowRight className="h-4 w-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <a
        href={waLink("Olá, equipe Costi Seguros! Quero uma cotação de seguro de vida para piloto.")}
        onClick={() =>
          trackAnalyticsEvent({
            eventName: "pilot_whatsapp_click",
            placement: "floating",
          })
        }
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Falar no WhatsApp"
        className={`group fixed right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-green-500 shadow-xl shadow-green-600/40 transition-all duration-300 hover:scale-110 ${
          showStickyBar && !formInView && !done ? "bottom-24 lg:bottom-5" : "bottom-5"
        }`}
      >
        {!reduceMotion && (
          <span
            aria-hidden
            className="absolute inset-0 animate-ping rounded-full bg-green-500/50"
          />
        )}
        <MessageCircle className="relative h-7 w-7" />
        <span className="pointer-events-none absolute right-16 hidden whitespace-nowrap rounded-lg bg-[#0B1424] px-3 py-1.5 text-xs font-semibold opacity-0 shadow-lg transition group-hover:opacity-100 sm:block">
          Falar com a Costi
        </span>
      </a>
    </main>
  );
}
