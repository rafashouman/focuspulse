"use client";

import Link from "next/link";
import { useRef, useState } from "react";
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
  } | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const formStartTracked = useRef(false);

  const handlePhone = (value: string) => {
    const d = value.replace(/\D/g, "").slice(0, 11);
    let out = d;
    if (d.length > 2) out = `(${d.slice(0, 2)}) ${d.slice(2)}`;
    if (d.length > 7) out = `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
    setWhatsapp(out);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (name.trim().length < 3) {
      trackAnalyticsEvent({
        eventName: "pilot_form_validation_error",
        field: "name",
      });
      return setError("Informe seu nome completo.");
    }
    if (whatsapp.replace(/\D/g, "").length < 10) {
      trackAnalyticsEvent({
        eventName: "pilot_form_validation_error",
        field: "whatsapp",
      });
      return setError("Informe um WhatsApp válido com DDD.");
    }
    if (!consent) {
      trackAnalyticsEvent({
        eventName: "pilot_form_validation_error",
        field: "consent",
      });
      return setError("Aceite o contato para receber a cotação.");
    }

    const whatsappUrl = waLink(
      `Olá, equipe Costi Seguros! Sou ${name.trim()} e quero a cotação de seguro de vida para piloto (${MODALITY_LABELS[modality]}) com capital de ${formatBRL(capital)}.`
    );
    const whatsappWindow = window.open("about:blank", "_blank");
    if (whatsappWindow) whatsappWindow.opener = null;

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
      setError("Não foi possível salvar seu pedido. Tente novamente ou chame no WhatsApp.");
      try {
        trackAnalyticsEvent({ eventName: "pilot_lead_save_error" });
      } catch (analyticsError) {
        console.error("Could not track the pilot lead save error.", analyticsError);
      }
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
    });
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
    <div className="min-h-screen bg-[#050B16] font-sans text-white antialiased">
      <div className="bg-gradient-to-r from-[#FF5500] to-[#FF8A00] px-4 py-2 text-center text-xs font-bold uppercase tracking-wide sm:text-sm">
        <Zap className="mr-1 inline h-4 w-4" />
        Cotação em até 15 minutos • Sem compromisso • Compare 5 seguradoras
      </div>

      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#050B16]/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/images-jobs/Logo-Costi-Seguros-Branco.png"
            alt="Costi Corretora de Seguros"
            className="h-14 w-auto sm:h-16"
          />
          <button
            onClick={() => {
              trackAnalyticsEvent({
                eventName: "pilot_cta_click",
                placement: "header",
              });
              scrollToForm();
            }}
            className="rounded-full bg-[#FF5500] px-5 py-2 text-sm font-bold shadow-lg shadow-orange-600/30 transition hover:bg-[#FF6A1F]"
          >
            Cotar agora
          </button>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/images-jobs/bkg-seguro-piloto-agricola.jpg"
            alt=""
            className="h-full w-full object-cover object-[0%_center] opacity-75"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#050B16] via-[#050B16]/70 to-[#050B16]/15 lg:via-[#050B16]/50" />
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#050B16] to-transparent" />
          <div className="absolute -left-32 top-20 h-96 w-96 rounded-full bg-[#FF5500]/20 blur-[120px]" />
        </div>

        <div className="relative mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-12 lg:py-24">
          <div className="space-y-7 lg:col-span-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/40 bg-orange-500/10 px-4 py-1.5 text-xs font-semibold text-orange-300 sm:text-sm">
              <ShieldAlert className="h-4 w-4" />
              Seu seguro de banco pode NÃO pagar em acidente aéreo
            </div>

            <h1 className="text-4xl font-black leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
              Seu voo não para.
              <br />
              <span className="bg-gradient-to-r from-[#FF5500] to-[#FFB36B] bg-clip-text text-transparent">
                Sua família não pode ficar desprotegida.
              </span>
            </h1>

            <p className="max-w-2xl text-lg text-slate-300 sm:text-xl">
              Seguro de vida <strong className="text-white">sem exclusão para aviação</strong>:
              agrícola, executiva, comercial e helicópteros. Proteção de renda e perda de CMA
              incluídas.
            </p>

            <ul className="grid gap-3 text-sm sm:grid-cols-2 sm:text-base">
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
            </ul>

            <div className="flex flex-wrap gap-4 pt-2">
              <button
                onClick={() => {
                  trackAnalyticsEvent({
                    eventName: "pilot_cta_click",
                    placement: "hero",
                  });
                  scrollToForm();
                }}
                className="group inline-flex items-center gap-2 rounded-xl bg-[#FF5500] px-7 py-4 text-base font-extrabold shadow-xl shadow-orange-600/40 transition hover:scale-[1.03] hover:bg-[#FF6A1F]"
              >
                QUERO MINHA COTAÇÃO
                <ArrowRight className="h-5 w-5 transition group-hover:translate-x-1" />
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
                className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-7 py-4 font-bold backdrop-blur transition hover:bg-white/10"
              >
                <MessageCircle className="h-5 w-5 text-green-400" />
                Falar no WhatsApp
              </a>
            </div>
          </div>

          <div id="cotacao" className="scroll-mt-24 lg:col-span-5">
            <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-6 shadow-2xl shadow-black/50 ring-1 ring-orange-500/30 backdrop-blur-2xl sm:p-8">
              {done ? (
                <div className="space-y-5 text-center">
                  <CheckCircle2 className="mx-auto h-14 w-14 text-green-400" />
                  <h2 className="text-2xl font-black">Recebemos seu pedido!</h2>
                  <p className="text-slate-300">
                    {done.whatsappOpened
                      ? "Seu lead foi salvo e abrimos a conversa com a Costi no WhatsApp."
                      : "Seu lead foi salvo, mas o navegador bloqueou a abertura automática do WhatsApp. Use o botão abaixo para enviar a mensagem."}
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
                    className="flex items-center justify-center gap-2 rounded-xl bg-green-600 py-4 font-bold hover:bg-green-500"
                  >
                    <MessageCircle className="h-5 w-5" />
                    {done.whatsappOpened
                      ? "Abrir conversa novamente"
                      : "Enviar mensagem pelo WhatsApp"}
                  </a>
                </div>
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

                  <input
                    type="text"
                    autoComplete="name"
                    maxLength={100}
                    placeholder="Seu nome completo"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3.5 text-sm outline-none transition placeholder:text-slate-500 focus:border-[#FF5500]"
                  />
                  <input
                    type="tel"
                    autoComplete="tel"
                    placeholder="WhatsApp com DDD"
                    value={whatsapp}
                    onChange={(e) => handlePhone(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3.5 text-sm outline-none transition placeholder:text-slate-500 focus:border-[#FF5500]"
                  />
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
                    className="w-full rounded-xl border border-white/10 bg-[#0B1424] px-4 py-3.5 text-sm outline-none focus:border-[#FF5500]"
                  >
                    {PILOT_MODALITIES.map((m) => (
                      <option key={m} value={m}>
                        {MODALITY_LABELS[m]}
                      </option>
                    ))}
                  </select>

                  <div className="rounded-xl border border-white/10 bg-black/30 p-4">
                    <div className="mb-2 flex items-center justify-between text-xs text-slate-400">
                      <span>Capital segurado</span>
                      <span className="text-xl font-black text-white">{formatBRL(capital)}</span>
                    </div>
                    <input
                      type="range"
                      min={300000}
                      max={5000000}
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
                      className="w-full accent-[#FF5500]"
                    />
                  </div>

                  <label className="flex cursor-pointer items-start gap-3 text-xs text-slate-400">
                    <input
                      type="checkbox"
                      checked={consent}
                      onChange={(e) => setConsent(e.target.checked)}
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

                  {error && (
                    <p role="alert" className="flex items-center gap-2 text-sm text-red-400">
                      <X className="h-4 w-4" /> {error}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#FF5500] to-[#FF8A00] py-4 text-base font-black shadow-lg shadow-orange-600/40 transition hover:scale-[1.02] disabled:opacity-60"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" /> Enviando...
                      </>
                    ) : (
                      <>
                        RECEBER COTAÇÃO GRÁTIS <ArrowRight className="h-5 w-5" />
                      </>
                    )}
                  </button>
                  <p className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
                    <Lock className="h-3 w-3" /> Seus dados estão protegidos. Sem spam.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-white/[0.03]">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-10 text-center sm:px-6 md:grid-cols-4">
          {[
            ["R$ 5 mi", "Capital segurado até"],
            ["5+", "Seguradoras comparadas"],
            ["15 min", "Para receber a cotação"],
            ["1º lugar", "Acelera MAPFRE"],
          ].map(([value, label]) => (
            <div key={label}>
              <div className="bg-gradient-to-r from-[#FF5500] to-[#FFB36B] bg-clip-text text-3xl font-black text-transparent sm:text-4xl">
                {value}
              </div>
              <div className="mt-1 text-xs uppercase tracking-wider text-slate-400">{label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <h2 className="mb-12 text-center text-3xl font-black sm:text-5xl">
          Seguro de banco <span className="text-red-500">vs</span>{" "}
          <span className="text-[#FF5500]">Costi Aviação</span>
        </h2>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-red-500/30 bg-red-500/5 p-8">
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
          <div className="rounded-3xl border border-orange-500/40 bg-orange-500/10 p-8 shadow-xl shadow-orange-600/10">
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
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6">
        <div className="grid gap-6 md:grid-cols-3">
          {COVERAGES.map(({ icon: Icon, title, text }) => (
            <div
              key={title}
              className="rounded-3xl border border-white/10 bg-white/[0.04] p-7 transition hover:-translate-y-1 hover:border-orange-500/50"
            >
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FF5500]/15 text-[#FF5500]">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-xl font-bold">{title}</h3>
              <p className="text-slate-400">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white/[0.03] py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <h2 className="mb-12 text-center text-3xl font-black sm:text-5xl">
            Qual é o seu tipo de voo?
          </h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {MODALITIES.map((m) => (
              <button
                key={m.id}
                onClick={() => {
                  setModality(m.id);
                  trackAnalyticsEvent({
                    eventName: "pilot_modality_select",
                    modality: m.id,
                  });
                  scrollToForm();
                }}
                className="group relative h-96 overflow-hidden rounded-3xl border border-white/10 text-left"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={m.image}
                  alt={m.title}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050B16] via-[#050B16]/70 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 space-y-2 p-5">
                  <span className="inline-block rounded-full bg-[#FF5500] px-3 py-1 text-[10px] font-bold uppercase">
                    {m.badge}
                  </span>
                  <h3 className="text-xl font-black">{m.title}</h3>
                  <p className="text-xs text-orange-300">{m.subtitle}</p>
                  <p className="text-sm text-slate-300">{m.description}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-20 sm:px-6">
        <h2 className="mb-12 text-center text-3xl font-black sm:text-5xl">3 passos. Zero burocracia.</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {[
            [Clock, "Preencha em 30s", "Nome, WhatsApp e tipo de voo."],
            [Star, "Comparamos por você", "Cotação nas maiores seguradoras do mundo."],
            [ShieldCheck, "Proteção ativa", "Apólice emitida com sua atividade coberta."],
          ].map(([Icon, title, text], i) => {
            const I = Icon as typeof Clock;
            return (
              <div key={i} className="relative rounded-3xl border border-white/10 bg-white/[0.04] p-7">
                <span className="absolute right-5 top-3 text-6xl font-black text-white/5">{i + 1}</span>
                <I className="mb-4 h-8 w-8 text-[#FF5500]" />
                <h3 className="mb-1 text-lg font-bold">{title as string}</h3>
                <p className="text-slate-400">{text as string}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 pb-20 sm:px-6">
        <h2 className="mb-8 text-center text-3xl font-black">Perguntas frequentes</h2>
        <div className="space-y-3">
          {FAQS.map((f, i) => (
            <div key={f.q} className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04]">
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
                  className={`h-5 w-5 shrink-0 text-[#FF5500] transition ${openFaq === i ? "rotate-180" : ""}`}
                />
              </button>
              {openFaq === i && <p className="px-5 pb-5 text-slate-400">{f.a}</p>}
            </div>
          ))}
        </div>
      </section>

      <section className="px-4 pb-20 sm:px-6">
        <div className="mx-auto max-w-5xl rounded-3xl bg-gradient-to-br from-[#FF5500] to-[#C2410C] p-10 text-center shadow-2xl shadow-orange-700/30 sm:p-16">
          <h2 className="mb-4 text-3xl font-black sm:text-5xl">Não espere o pior para descobrir a exclusão.</h2>
          <p className="mx-auto mb-8 max-w-2xl text-orange-50">
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
            className="rounded-xl bg-white px-8 py-4 text-lg font-black text-[#C2410C] transition hover:scale-105"
          >
            COTAR AGORA
          </button>
        </div>
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
        className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-green-500 shadow-xl shadow-green-600/40 transition hover:scale-110"
      >
        <MessageCircle className="h-7 w-7" />
      </a>
    </div>
  );
}
