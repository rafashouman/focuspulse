"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import {
  getAnalyticsConsentKey,
  isAnalyticsConfigured,
  trackAnalyticsEvent,
} from "@/lib/firebase";

type ConsentChoice = "accepted" | "declined" | "unknown";

function subscribeToConsent(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener("focuspulse:analytics-consent-changed", callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(
      "focuspulse:analytics-consent-changed",
      callback
    );
  };
}

function getConsentSnapshot(): ConsentChoice {
  const storedChoice = window.localStorage.getItem(getAnalyticsConsentKey());
  return storedChoice === "accepted" || storedChoice === "declined"
    ? storedChoice
    : "unknown";
}

function getServerConsentSnapshot(): ConsentChoice {
  return "unknown";
}

export function AnalyticsConsent() {
  const pathname = usePathname();
  const choice = useSyncExternalStore(
    subscribeToConsent,
    getConsentSnapshot,
    getServerConsentSnapshot
  );
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [available] = useState(isAnalyticsConfigured);

  useEffect(() => {
    const openSettings = () => setSettingsOpen(true);
    window.addEventListener("focuspulse:open-analytics-settings", openSettings);
    return () =>
      window.removeEventListener(
        "focuspulse:open-analytics-settings",
        openSettings
      );
  }, []);

  useEffect(() => {
    if (choice === "accepted" && pathname) {
      trackAnalyticsEvent({ eventName: "page_view" });
    }
  }, [choice, pathname]);

  if (!available || (choice !== "unknown" && !settingsOpen)) {
    return null;
  }

  const saveChoice = (nextChoice: Exclude<ConsentChoice, "unknown">) => {
    window.localStorage.setItem(getAnalyticsConsentKey(), nextChoice);
    window.dispatchEvent(new Event("focuspulse:analytics-consent-changed"));
    setSettingsOpen(false);
  };

  return (
    <aside
      aria-label="Preferências de privacidade"
      className="fixed inset-x-4 bottom-4 z-[120] mx-auto max-w-2xl rounded-2xl border border-violet-200/15 bg-[#100d17]/95 p-5 shadow-2xl shadow-black/40 backdrop-blur-2xl sm:inset-x-6 sm:bottom-6 sm:p-6"
    >
      <p className="font-display text-base font-semibold text-foreground">
        Privacidade e estatísticas
      </p>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        Com sua autorização, registramos páginas visitadas e interações gerais
        com os miniapps para entender o uso do site. Não enviamos informações
        do formulário ou seu nome nessas estatísticas. Você pode alterar sua
        escolha quando quiser.
      </p>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <a
          href="/privacidade"
          className="text-xs font-semibold text-violet-200 underline-offset-4 hover:underline"
        >
          Aviso de Privacidade
        </a>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => saveChoice("declined")}
            className="rounded-full border border-white/15 px-4 py-2 text-xs font-semibold text-foreground/80 transition-colors hover:bg-white/10"
          >
            Somente essenciais
          </button>
          <button
            type="button"
            onClick={() => saveChoice("accepted")}
            className="rounded-full bg-violet-gradient px-4 py-2 text-xs font-bold text-white shadow-violet-glow"
          >
            Autorizar estatísticas
          </button>
        </div>
      </div>
    </aside>
  );
}
