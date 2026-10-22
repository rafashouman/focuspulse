import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FloatingWA } from "@/components/FloatingWA";

export const metadata: Metadata = {
  title: "FocusPulse — Sites e Aplicações de Alta Performance",
  description: "Engenharia web focada em conversão, velocidade e experiências digitais fora da caixa.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar />
      <main className="relative flex min-h-screen flex-col overflow-hidden">
        {children}
      </main>
      <Footer />
      <FloatingWA />
    </>
  );
}