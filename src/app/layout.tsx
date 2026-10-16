import type { Metadata } from "next";
import { Sora, Plus_Jakarta_Sans } from "next/font/google";
import { FloatingWA } from "@/components/FloatingWA";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import "./globals.css";

// Fonte para Títulos (Moderna, Geométrica, Tech)
const sora = Sora({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

// Fonte para Textos (Limpa, Sofisticada, Legível)
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "FocusPulse |  Soluções Digitais",
  description: "Desenvolvimento de sites institucionais, plataformas digitais e e-commerces de alta performance. Transformamos a sua presença digital através de interfaces rápidas e design responsivo ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // A classe "dark" fixa o tema escuro como padrão
    <html lang="pt-BR" className="scroll-smooth dark">
      <body
        className={`${sora.variable} ${jakarta.variable} antialiased bg-background text-foreground selection:bg-blue-500/30 font-sans`}
      >
        <Navbar />
        <main className="relative flex min-h-screen flex-col overflow-hidden">
          {children}
        </main>
        <Footer />
        <FloatingWA />
      </body>
    </html>
  );
}