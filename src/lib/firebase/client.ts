"use client";

import "client-only";

import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirebaseApp } from "../firebase";

export const auth = getAuth(getFirebaseApp());
export const googleProvider = new GoogleAuthProvider();
