import { getApp, getApps, initializeApp } from "firebase/app";
import type { AppCheck } from "firebase/app-check";
import {
  initializeAppCheck,
  ReCaptchaV3Provider,
} from "firebase/app-check";
import {
  Analytics,
  initializeAnalytics,
  isSupported,
  logEvent,
} from "firebase/analytics";
import {
  addDoc,
  collection,
  getFirestore,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

const APP_CHECK_KEY = "__focusPulseAppCheckInstance";
const ANALYTICS_CONSENT_KEY = "focuspulse_analytics_consent";
const LEAD_RETENTION_DAYS = 180;
const DAY_IN_MS = 24 * 60 * 60 * 1000;
let analyticsPromise: Promise<Analytics | null> | null = null;

export type AnalyticsEvent =
  | { eventName: "page_view" }
  | {
      eventName: "pilot_cta_click" | "pilot_whatsapp_click";
      placement:
        | "header"
        | "hero"
        | "footer"
        | "floating"
        | "success"
        | "sticky_bar";
    }
  | { eventName: "pilot_form_start" | "pilot_lead_save_error" }
  | {
      eventName: "pilot_form_validation_error";
      field: "name" | "whatsapp" | "consent";
    }
  | {
      eventName: "pilot_modality_select";
      modality: (typeof PILOT_MODALITIES)[number];
    }
  | {
      eventName: "pilot_capital_select";
      capitalInsured: number;
    }
  | {
      eventName: "pilot_faq_open";
      faqIndex: number;
    }
  | {
      eventName: "pilot_lead_submitted";
      modality: (typeof PILOT_MODALITIES)[number];
      capitalInsured: number;
    }
  | {
      eventName: "game_start" | "game_end" | "game_high_score";
      appId: "arknoid";
      score?: number;
      durationSeconds?: number;
    }
  | {
      eventName: "miniapp_interaction";
      appId: "image-blend";
      action:
        | "preset"
        | "layer_visibility"
        | "blend_mode"
        | "reset"
        | "copy_css"
        | "background_color"
        | "opacity";
    };

function isFirebaseConfigured() {
  return Boolean(
    firebaseConfig.apiKey &&
      firebaseConfig.authDomain &&
      firebaseConfig.projectId &&
      firebaseConfig.appId
  );
}

export function getFirebaseApp() {
  if (!isFirebaseConfigured()) {
    throw new Error(
      "Firebase is not configured. Set the NEXT_PUBLIC_FIREBASE_* environment variables."
    );
  }

  const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_V3_SITE_KEY;
  const globalState = globalThis as typeof globalThis & {
    [APP_CHECK_KEY]?: AppCheck;
  };

  if (typeof window !== "undefined" && siteKey && !globalState[APP_CHECK_KEY]) {
    globalState[APP_CHECK_KEY] = initializeAppCheck(app, {
      provider: new ReCaptchaV3Provider(siteKey),
      isTokenAutoRefreshEnabled: true,
    });
  }

  return app;
}

function getDatabase() {
  return getFirestore(getFirebaseApp());
}

function getAnalyticsClient() {
  if (!analyticsPromise) {
    analyticsPromise = isSupported().then((supported) =>
      supported
        ? initializeAnalytics(getFirebaseApp(), {
            config: { send_page_view: false },
          })
        : null
    );
  }

  return analyticsPromise;
}

function retentionDate(days: number) {
  return Timestamp.fromDate(new Date(Date.now() + days * DAY_IN_MS));
}

export async function saveContactRequest(input: {
  name: string;
  company: string;
  message: string;
  projectType: string;
  plan: string;
  route: string;
}) {
  await addDoc(collection(getDatabase(), "leads"), {
    ...input,
    consent: true,
    createdAt: serverTimestamp(),
    deleteAfter: retentionDate(LEAD_RETENTION_DAYS),
  });
}

export interface TarotLeadData {
  name: string;
  whatsapp: string;
  chosenDeck: string;
  question: string;
  drawnCards: string[];
  consent: true;
}

export async function saveTarotLead(input: TarotLeadData) {
  const name = input.name.trim();
  const whatsapp = input.whatsapp.trim();
  const question = input.question.trim();
  const drawnCards = input.drawnCards.map((card) => card.trim());

  if (
    !name ||
    name.length > 100 ||
    !/^[0-9+() -]{8,24}$/.test(whatsapp) ||
    !["obsidian", "mercury", "gold"].includes(input.chosenDeck) ||
    input.chosenDeck.length > 120 ||
    !question ||
    question.length > 600 ||
    drawnCards.length !== 3 ||
    drawnCards.some((card) => !card || card.length > 100) ||
    input.consent !== true
  ) {
    throw new Error("Os dados da leitura estão incompletos ou inválidos.");
  }

  const docRef = await addDoc(collection(getDatabase(), "tarot_leads"), {
    name,
    whatsapp,
    chosenDeck: input.chosenDeck,
    question,
    drawnCards,
    consent: input.consent,
    createdAt: serverTimestamp(),
    deleteAfter: retentionDate(LEAD_RETENTION_DAYS),
    source: "hotsite_3_montes",
    status: "novo",
  });

  return { id: docRef.id };
}

export const PILOT_MODALITIES = [
  "agricola",
  "executivo",
  "comercial",
  "helicoptero",
  "instrucao",
] as const;

export interface PilotLeadData {
  name: string;
  whatsapp: string;
  modality: (typeof PILOT_MODALITIES)[number];
  capitalInsured: number;
  consent: true;
}

export async function savePilotLead(input: PilotLeadData) {
  const name = input.name.trim();
  const whatsapp = input.whatsapp.trim();

  if (
    !name ||
    name.length > 100 ||
    !/^[0-9+() -]{8,24}$/.test(whatsapp) ||
    !PILOT_MODALITIES.includes(input.modality) ||
    !Number.isInteger(input.capitalInsured) ||
    input.capitalInsured < 100000 ||
    input.capitalInsured > 5000000 ||
    input.consent !== true
  ) {
    throw new Error("Os dados da cotação estão incompletos ou inválidos.");
  }

  const docRef = await addDoc(collection(getDatabase(), "pilot_leads"), {
    name,
    whatsapp,
    modality: input.modality,
    capitalInsured: input.capitalInsured,
    consent: input.consent,
    createdAt: serverTimestamp(),
    deleteAfter: retentionDate(LEAD_RETENTION_DAYS),
    source: "hotsite_seguro_pilotos",
    status: "novo",
  });

  return { id: docRef.id };
}

export function trackAnalyticsEvent(event: AnalyticsEvent) {
  if (
    typeof window === "undefined" ||
    window.localStorage.getItem(ANALYTICS_CONSENT_KEY) !== "accepted"
  ) {
    return;
  }

  void getAnalyticsClient()
    .then((analytics) => {
      if (!analytics) return;

      const params: Record<string, string | number> = {
        page_path: window.location.pathname,
      };

      if ("appId" in event) params.app_id = event.appId;
      if ("action" in event) params.action = event.action;
      if ("score" in event && event.score !== undefined) {
        params.score = event.score;
      }
      if ("durationSeconds" in event && event.durationSeconds !== undefined) {
        params.duration_seconds = event.durationSeconds;
      }
      if ("placement" in event) params.placement = event.placement;
      if ("field" in event) params.field = event.field;
      if ("modality" in event) params.modality = event.modality;
      if ("capitalInsured" in event) {
        params.capital_insured = event.capitalInsured;
      }
      if ("faqIndex" in event) params.faq_index = event.faqIndex;

      if (event.eventName === "page_view") {
        logEvent(analytics, "page_view", params);
      } else {
        logEvent(analytics, event.eventName, params);
      }
    })
    .catch((error: unknown) => {
      console.error("Unable to record Firebase analytics event.", error);
    });
}

export function getAnalyticsConsentKey() {
  return ANALYTICS_CONSENT_KEY;
}

export function isAnalyticsConfigured() {
  return isFirebaseConfigured() && Boolean(firebaseConfig.measurementId);
}

export async function saveDaemonRunLog(data: {
  spreadReached: string;
  finalScore: number;
  creditsEarned: number;
  victory: boolean;
}) {
  try {
    await addDoc(collection(getDatabase(), "daemon_runs"), {
      ...data,
      createdAt: serverTimestamp(),
      deleteAfter: retentionDate(LEAD_RETENTION_DAYS),
    });
  } catch (err) {
    console.error("Erro ao registrar telemetria no Firestore:", err);
  }
}
