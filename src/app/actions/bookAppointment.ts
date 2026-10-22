"use server";

import { getAuth } from "firebase-admin/auth";
import { Timestamp } from "firebase-admin/firestore";
import { getAdminApp, getAdminDb } from "@/lib/firebase/admin";

export interface BookingPayload {
  date: string; // Formato: YYYY-MM-DD
  timeSlot: string; // Formato: HH:mm
  serviceName: string; // Ex: "Balcão do Chef (Fornalha) • 4 Pessoas"
  guests?: number;
  seatingZone?: string;
}

const ALLOWED_SLOTS = new Set([
  "09:00",
  "10:30",
  "14:00",
  "15:30",
  "17:00",
  "19:00",
  "20:00",
  "21:00",
  "22:00",
  "23:00",
]);

function isValidDate(value: string) {
  const date = new Date(`${value}T00:00:00.000Z`);
  return (
    Number.isFinite(date.getTime()) &&
    date.toISOString().slice(0, 10) === value
  );
}

export async function bookAppointment(data: BookingPayload, idToken: string) {
  if (
    !data ||
    typeof data.date !== "string" ||
    !/^\d{4}-\d{2}-\d{2}$/.test(data.date) ||
    !isValidDate(data.date) ||
    data.date < new Date().toISOString().slice(0, 10) ||
    typeof data.timeSlot !== "string" ||
    !ALLOWED_SLOTS.has(data.timeSlot) ||
    typeof data.serviceName !== "string" ||
    data.serviceName.trim().length === 0 ||
    data.serviceName.length > 140 ||
    typeof idToken !== "string" ||
    idToken.length === 0 ||
    idToken.length > 10_000
  ) {
    return { success: false, error: "Dados da reserva inválidos." };
  }

  let decodedToken;
  try {
    decodedToken = await getAuth(getAdminApp()).verifyIdToken(idToken);
  } catch (error) {
    console.error("Unable to verify appointment authentication.", error);
    return { success: false, error: "Faça login para confirmar a reserva." };
  }

  const uid = decodedToken.uid;
  const clientName =
    decodedToken.name || decodedToken.email || "Cliente Autenticado";
  const sanitizedSlot = data.timeSlot.replace(":", "-");
  const slotDocId = `slot_${data.date}_${sanitizedSlot}`;

  try {
    const db = getAdminDb();
    const slotRef = db.collection("appointments").doc(slotDocId);
    await db.runTransaction(async (transaction) => {
      const slotDoc = await transaction.get(slotRef);

      if (slotDoc.exists) {
        throw new Error("SLOT_ALREADY_TAKEN");
      }

      transaction.set(slotRef, {
        uid,
        clientName,
        date: data.date,
        timeSlot: data.timeSlot,
        serviceName: data.serviceName,
        guests: data.guests ?? 2,
        seatingZone: data.seatingZone ?? "Salão Principal",
        status: "CONFIRMED",
        createdAt: Timestamp.now(),
      });
    });

    return { success: true, bookingId: slotDocId };
  } catch (error) {
    if (error instanceof Error && error.message === "SLOT_ALREADY_TAKEN") {
      return {
        success: false,
        error:
          "Esta janela acabou de ser reservada por outro cliente. Escolha outro horário.",
      };
    }
    console.error("Unable to reserve appointment slot.", error);
    return {
      success: false,
      error: "Não foi possível processar a reserva. Tente novamente.",
    };
  }
}