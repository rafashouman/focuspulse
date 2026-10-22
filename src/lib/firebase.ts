import { getApp, getApps, initializeApp } from "firebase/app";
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

const APP_CHECK_KEY = "__focusPulseAppCheckInitialized";
const ANALYTICS_CONSENT_KEY = "focuspulse_analytics_consent";
const LEAD_RETENTION_DAYS = 180;
const DAY_IN_MS = 24 * 60 * 60 * 1000;
let analyticsPromise: Promise<Analytics | null> | null = null;

export type AnalyticsEvent =
  | { eventName: "page_view" }
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

function getFirebaseApp() {
  if (!isFirebaseConfigured()) {
    throw new Error(
      "Firebase is not configured. Set the NEXT_PUBLIC_FIREBASE_* environment variables."
    );
  }

  const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_V3_SITE_KEY;
  const globalState = globalThis as typeof globalThis & {
    [APP_CHECK_KEY]?: boolean;
  };

  if (typeof window !== "undefined" && siteKey && !globalState[APP_CHECK_KEY]) {
    initializeAppCheck(app, {
      provider: new ReCaptchaV3Provider(siteKey),
      isTokenAutoRefreshEnabled: true,
    });
    globalState[APP_CHECK_KEY] = true;
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
