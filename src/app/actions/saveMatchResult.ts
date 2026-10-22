"use server";

import { getAuth } from "firebase-admin/auth";
import { Timestamp } from "firebase-admin/firestore";
import { getAdminApp, getAdminDb } from "@/lib/firebase/admin";

type MatchPayload =
  | {
      gameId: "memory";
      moves: number;
      timeInSeconds: number;
    }
  | {
      gameId: "voxelvaders";
      score: number;
      wave: number;
    };

type SaveMatchResultResponse =
  | { success: true; score: number; id: string }
  | { success: false; error: string };

export async function saveMatchResult(
  data: MatchPayload,
  idToken: string
): Promise<SaveMatchResultResponse> {
  if (
    !data ||
    (data.gameId !== "memory" && data.gameId !== "voxelvaders") ||
    typeof idToken !== "string" ||
    idToken.length === 0 ||
    idToken.length > 10_000
  ) {
    return { success: false, error: "Dados da partida inválidos." };
  }

  if (
    (data.gameId === "memory" &&
      (!Number.isSafeInteger(data.moves) ||
        data.moves < 1 ||
        data.moves > 1000 ||
        !Number.isSafeInteger(data.timeInSeconds) ||
        data.timeInSeconds < 1 ||
        data.timeInSeconds > 3600)) ||
    (data.gameId === "voxelvaders" &&
      (!Number.isSafeInteger(data.score) ||
        data.score < 0 ||
        data.score > 1_000_000 ||
        !Number.isSafeInteger(data.wave) ||
        data.wave < 1 ||
        data.wave > 1000))
  ) {
    return { success: false, error: "Dados da partida inválidos." };
  }

  let decodedToken;
  try {
    decodedToken = await getAuth(getAdminApp()).verifyIdToken(idToken);
  } catch (error) {
    console.error("Unable to verify game result authentication.", error);
    return { success: false, error: "Acesso não autorizado." };
  }

  const calculatedScore =
    data.gameId === "memory"
      ? Math.max(0, 10_000 - data.moves * 150 - data.timeInSeconds * 50)
      : data.score;

  try {
    const gameDetails =
      data.gameId === "memory"
        ? { moves: data.moves, timeInSeconds: data.timeInSeconds }
        : { wave: data.wave };

    const docRef = await getAdminDb()
      .collection("leaderboard")
      .add({
        gameId: data.gameId,
        uid: decodedToken.uid,
        playerName: decodedToken.name || "Operador Anônimo",
        ...gameDetails,
        score: calculatedScore,
        scoreVerification: "client-reported",
        playedAt: Timestamp.now(),
      });

    return { success: true, score: calculatedScore, id: docRef.id };
  } catch (error) {
    console.error("Unable to save game result to Firestore.", error);
    return {
      success: false,
      error: "Falha ao salvar a pontuação. Tente novamente.",
    };
  }
}