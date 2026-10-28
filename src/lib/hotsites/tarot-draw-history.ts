// src/lib/hotsites/tarot-draw-history.ts
// Guarda as cartas da última leitura de cada monte para que o próximo acesso
// sorteie cartas diferentes. Falhas de storage (modo privado, quota) são ignoradas.

const STORAGE_KEY = "oraculo:last-draw:v1";

type DrawHistory = Record<string, string[]>;

function readHistory(): DrawHistory {
  if (typeof window === "undefined") return {};
  try {
    const parsed: unknown = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "{}");
    return parsed && typeof parsed === "object" ? (parsed as DrawHistory) : {};
  } catch {
    return {};
  }
}

export function readLastDraw(deckId: string): string[] {
  const ids = readHistory()[deckId];
  return Array.isArray(ids) ? ids.filter((id) => typeof id === "string") : [];
}

export function rememberDraw(deckId: string, cardIds: readonly string[]): void {
  if (typeof window === "undefined") return;
  try {
    const next: DrawHistory = { ...readHistory(), [deckId]: [...cardIds] };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Sem persistência o sorteio continua funcionando, apenas sem memória entre acessos.
  }
}
