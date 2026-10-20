import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FloatingWA } from "@/components/FloatingWA";

// Solução para o erro: Desativa a validação forçada de navegação instantânea neste segmento
export const instant = false;

export default function SiteLayout({
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