export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-background border-t border-border pt-16 pb-8">
      <div className="container-luxe">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

          <div className="lg:col-span-2">
            <a href="/" aria-label="FocusPulse — início" className="logo-pulse flex items-center gap-2 mb-6">
              <img
                src="/images/logo-icon.png"
                alt="Logo do site"
                className="h-8 w-8 transition-transform duration-300 group-hover:rotate-[360deg]"
              />
              <img
                src="/images/logo-text.png"
                alt="Logo do site"
                className="h-6 w-auto transition-transform duration-300 group-hover:scale-105"
              />
            </a>
            <p className="text-muted-foreground max-w-sm leading-relaxed text-sm">
              Desenvolvemos experiências digitais e plataformas de alta performance.
              Foco absoluto em conversão, design e velocidade de carregamento.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-foreground mb-6 uppercase tracking-widest text-xs">Navegação</h4>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li><a href="/" className="hover:text-blue-400 transition-colors">Início</a></li>
              <li><a href="/webdev" className="hover:text-blue-400 transition-colors">Portfólio</a></li>
              <li><a href="/apps" className="hover:text-blue-400 transition-colors">Aplicativos</a></li>
              <li><a href="/design" className="hover:text-blue-400 transition-colors">Design</a></li>
              <li><a href="/blog" className="hover:text-blue-400 transition-colors">Blog</a></li>
              <li><a href="/#planos" className="hover:text-blue-400 transition-colors">Planos & Preços</a></li>
              <li><a href="/#faq" className="hover:text-blue-400 transition-colors">FAQ</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-foreground mb-6 uppercase tracking-widest text-xs">Redes Sociais</h4>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-blue-400 transition-colors">Instagram</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">LinkedIn</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">GitHub</a></li>
            </ul>
          </div>

        </div>

        <div className="border-t border-border/50 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© {year} FocusPulse. Todos os direitos reservados.</p>
          <p>Desenvolvido com foco em performance e experiência do utilizador.</p>
        </div>
      </div>
    </footer>
  );
}