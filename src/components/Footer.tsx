import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { io } from "next/cache";

export function Footer() {
  return (
    <footer className="bg-background border-t border-border pt-16 pb-8">
      <div className="container-luxe">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

          <div className="lg:col-span-2">
            <Link href="/" aria-label="FocusPulse — início" className="logo-pulse group flex items-center gap-2 mb-6">
              <Image
                src="/images/logo-icon.png"
                alt=""
                width={32}
                height={32}
                className="h-8 w-8 transition-transform duration-300 group-hover:rotate-[360deg]"
              />
              <Image
                src="/images/logo-text.png"
                alt="FocusPulse"
                width={202}
                height={24}
                className="h-6 w-auto transition-transform duration-300 group-hover:scale-105"
              />
            </Link>
            <p className="text-muted-foreground max-w-sm leading-relaxed text-sm">
              Desenvolvemos experiências digitais e plataformas de alta performance.
              Foco absoluto em conversão, design e velocidade de carregamento.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-foreground mb-6 uppercase tracking-widest text-xs">Navegação</h4>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li><Link href="/" className="hover:text-violet-200 transition-colors">Início</Link></li>
              <li><Link href="/apps" className="hover:text-violet-200 transition-colors">Aplicativos</Link></li>
              <li><Link href="/design" className="hover:text-violet-200 transition-colors">Design</Link></li>
              <li><Link href="/templates" className="hover:text-violet-200 transition-colors">Templates</Link></li>
              <li><Link href="/#planos" className="hover:text-violet-200 transition-colors">Planos & Preços</Link></li>
              <li><Link href="/#faq" className="hover:text-violet-200 transition-colors">FAQ</Link></li>
              <li><Link href="/privacidade" className="hover:text-violet-200 transition-colors">Privacidade</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-foreground mb-6 uppercase tracking-widest text-xs">Redes Sociais</h4>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-violet-200 transition-colors">Instagram</a></li>
              <li><a href="#" className="hover:text-violet-200 transition-colors">LinkedIn</a></li>
              <li><a href="#" className="hover:text-violet-200 transition-colors">GitHub</a></li>
            </ul>
          </div>

        </div>

        <div className="border-t border-border/50 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© <Suspense fallback={null}><CurrentYear /></Suspense> FocusPulse. Todos os direitos reservados.</p>
          <p>Desenvolvido com foco em performance e experiência do utilizador.</p>
        </div>
      </div>
    </footer>
  );
}

async function CurrentYear() {
  await io();
  return 2026;
}