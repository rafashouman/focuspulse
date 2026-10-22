import type { Metadata } from "next";
import { Sora, Plus_Jakarta_Sans } from "next/font/google";
import { AnalyticsConsent } from "@/components/AnalyticsConsent";
import "./globals.css"; // Ajuste o caminho se necessário

// Fonte para Títulos
const sora = Sora({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

// Fonte para Textos
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "FocusPulse | Soluções Digitais",
  description: "Desenvolvimento de sites institucionais, plataformas digitais e e-commerces de alta performance.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="scroll-smooth dark">
      <body
        className={`${sora.variable} ${jakarta.variable} antialiased bg-background text-foreground selection:bg-violet-500/30 font-sans`}
      >
        {/* O children aqui vai renderizar ou o SiteLayout ou a página do Template */}
        {children}
        <AnalyticsConsent />
      </body>
    </html>
  );
}