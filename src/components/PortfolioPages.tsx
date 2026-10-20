import Link from "next/link";
import NextImage from "next/image";

import {
  ArrowUpRight,
  Code2,
  Image as ImageIcon,
  Layers3,
} from "lucide-react";

const projects = [
  {
    href: "/webdev/arknoid",
    number: "01",
    title: "Arknoid",
    category: "Experimento interativo",
    description:
      "Uma releitura de Arkanoid feita para explorar movimento, física e interação direto no navegador.",
    icon: Code2,
  },
  {
    href: "/webdev/images-blend",
    number: "02",
    title: "Image Blend",
    category: "Laboratório visual",
    description:
      "Uma composição de imagens em camadas com controles de cor e visibilidade para testar diferentes combinações.",
    icon: Layers3,
  },
];

export function AppsPageContent() {
  return (
    <section className="container-luxe py-32 sm:py-40">
      <div className="max-w-3xl mb-14">
        <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/5 px-3 py-1 text-xs font-bold uppercase tracking-widest text-blue-400">
          Aplicativos
        </span>
        <h1 className="mb-6 text-4xl font-display font-bold uppercase tracking-tight sm:text-6xl">
          Ideias que viram <span className="text-blue-gradient">experiências.</span>
        </h1>
        <p className="text-lg leading-relaxed text-muted-foreground">
          Aplicativos e experimentos interativos para explorar novas ideias
          diretamente no navegador.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {projects.map((project) => {
          const Icon = project.icon;
          return (
            <Link
              key={project.href}
              href={project.href}
              className="group relative overflow-hidden rounded-3xl border border-border bg-card p-8 transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/40 hover:shadow-blue-glow sm:p-10"
            >
              <div className="mb-12 flex items-start justify-between">
                <div className="grid h-14 w-14 place-items-center rounded-2xl border border-blue-500/20 bg-blue-500/5 text-blue-400">
                  <Icon className="h-6 w-6" />
                </div>
                <span className="font-display text-sm text-muted-foreground">
                  {project.number}
                </span>
              </div>
              <p className="mb-2 text-xs font-bold uppercase tracking-widest text-blue-400">
                {project.category}
              </p>
              <div className="mb-3 flex items-center justify-between gap-4">
                <h2 className="text-2xl font-bold font-display">{project.title}</h2>
                <ArrowUpRight className="h-5 w-5 text-muted-foreground transition-colors group-hover:text-blue-400" />
              </div>
              <p className="max-w-lg leading-relaxed text-muted-foreground">
                {project.description}
              </p>
            </Link>
          );
        })}
      </div>

      <div className="mt-12 flex flex-wrap gap-3">
        <Link
          href="/design"
          className="rounded-full border border-border px-5 py-2.5 text-sm font-semibold text-muted-foreground transition-colors hover:border-blue-500/40 hover:text-blue-400"
        >
          Explorar design
        </Link>
        <Link
          href="/templates"
          className="rounded-full border border-border px-5 py-2.5 text-sm font-semibold text-muted-foreground transition-colors hover:border-blue-500/40 hover:text-blue-400"
        >
          Ver templates
        </Link>
        <Link
          href="/blog"
          className="rounded-full border border-border px-5 py-2.5 text-sm font-semibold text-muted-foreground transition-colors hover:border-blue-500/40 hover:text-blue-400"
        >
          Blog e referências
        </Link>
      </div>
    </section>
  );
}

export function BlogPageContent() {
  const brands = ["Cadence", "Consul", "LG", "Midea", "Oster", "Philco", "Samsung"];

  return (
    <section className="container-luxe py-32 sm:py-40">
      <div className="mx-auto mb-16 max-w-3xl text-center">
        <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/5 px-3 py-1 text-xs font-bold uppercase tracking-widest text-blue-400">
          Blog
        </span>
        <h1 className="mb-6 text-4xl font-display font-bold uppercase tracking-tight sm:text-6xl">
          Ideias para o <span className="text-blue-gradient">mundo digital.</span>
        </h1>
        <p className="text-lg leading-relaxed text-muted-foreground">
          Um espaço para compartilhar referências, projetos e aprendizados sobre
          tecnologia e presença digital.
        </p>
      </div>

      <div className="mx-auto max-w-5xl rounded-3xl border border-border bg-card/60 p-8 sm:p-12">
        <div className="mb-8 flex items-center gap-3">
          <ImageIcon className="h-5 w-5 text-blue-400" />
          <h2 className="text-lg font-bold font-display">Marcas em destaque</h2>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {brands.map((brand, index) => (
            <div
              key={brand}
              className="flex min-h-24 items-center justify-center rounded-2xl border border-border bg-background px-4 text-center font-display text-lg font-bold text-foreground/80 transition-colors hover:border-blue-500/40 hover:text-blue-400"
            >
              {brand}
              <span className="sr-only">, marca {index + 1}</span>
            </div>
          ))}
        </div>
        <p className="mt-8 border-t border-border pt-6 text-sm leading-relaxed text-muted-foreground">
          Os artigos serão publicados aqui em breve. Enquanto isso, você pode
          conhecer os aplicativos e experimentos.
        </p>
        <Link
          href="/apps"
          className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-blue-400 transition-colors hover:text-blue-300"
        >
          Explorar aplicativos <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}

export function DesignPageContent() {
  const galleries = [
    {
      id: "design-grafico",
      title: "Design gráfico",
      description: "Peças gráficas, materiais impressos e comunicação visual.",
      folder: "port-dg",
      works: [
        "aw-cartao.jpg",
        "bargento-aheadworks.jpg",
        "bargento-cardapio.jpg",
        "camiseta.png",
        "cartao-pink-frente-bg.jpg",
        "cartao-pink-frente.jpg",
        "cartao-pink-verso-bg.jpg",
        "cartao-pink-verso.jpg",
        "faxia-bela-juba.jpg",
        "faxia-bela-juba.png",
        "flavia-cartao-bg.jpg",
        "flavia-cartao-vs-bg.jpg",
        "flavia-cartao-vs.jpg",
        "flavia-cartao.jpg",
        "fox-banner-1-bg.jpg",
        "fox-banner-1.jpg",
        "fox-banner-2-bg.jpg",
        "fox-banner-2.jpg",
        "fox-banner-3.jpg",
        "impressao-cardapio-1.jpg",
        "impressao-cardapio-2.jpg",
        "impressao-cardapio-bg-2.jpg",
        "meu-old.jpg",
        "panfleto-paty-1.jpg",
        "panfleto-paty-2.jpg",
        "panfleto-severo-2.jpg",
        "panfleto-severo-3.jpg",
        "panfleto-severo1.jpg",
        "pink-cardapio-2.jpg",
        "tutoia-panfleto.jpg",
        "vale-diamix-pq.jpg",
        "vale-diamix.jpg",
      ],
    },
    {
      id: "web-design",
      title: "Web design",
      description: "Layouts, banners e materiais criados para experiências digitais.",
      folder: "port-wd",
      works: [
        "banner-promo-rheem-2.jpg",
        "banner-promo-rheem.jpg",
        "banners-ecommerce-(1).jpg",
        "banners-ecommerce-(3).jpg",
        "banners-ecommerce-(4).jpg",
        "banners-ecommerce-(5).jpg",
        "banners-ecommerce-aw.jpg",
        "bargento-capa-face.jpg",
        "bargento-divulga--1.jpg",
        "bargento-divulga-2.jpg",
        "bargento-divulga.jpg",
        "belajuba-faixa.jpg",
        "capa-face-(1).jpg",
        "capa-face-(2).jpg",
        "capa-face-(4).jpg",
        "capa-face-(5).jpg",
        "capa-face-(8).jpg",
        "capa-face-3.jpg",
        "capa-face-7.png",
        "capa-face-8.jpg",
        "divulga-google.jpg",
        "email-mkt (1).jpg",
        "email-mkt (1).png",
        "email-mkt (2).jpg",
        "email-mkt (4).jpg",
        "email-mkt-3.jpg",
        "email-mkt-5.jpg",
        "especial-face-pq.jpg",
        "especial-face.jpg",
        "especial-site-carol.png",
        "especial-site.jpg",
        "pink-avatar.jpg",
        "pink-face-(1).jpg",
        "pink-face-(2).jpg",
        "pink-face-(4).jpg",
        "pink-face-(5).jpg",
        "pink-face-(7).jpg",
        "pink-face-3.jpg",
        "pink-face-divulga-1-big.jpg",
        "pink-face-divulga-2-big.jpg",
        "pink-face-divulga-2-pq.jpg",
        "pink-face-divulga-3-big.jpg",
        "pink-face-divulga-3-pq.jpg",
        "pink-face-divulga-4-big.jpg",
        "pink-face-divulga-4-pq.jpg",
        "pink-face-divulga-5-big.jpg",
        "pink-face-divulga-5-pq.jpg",
        "pink-face-divulga-6-big.jpg",
        "pink-face-divulga-6-pq.jpg",
        "post-face (1).jpg",
        "post-face (1).png",
        "post-face (11).jpg",
        "post-face (2).jpg",
        "post-face (2).png",
        "post-face (3).jpg",
        "post-face (4).jpg",
        "post-face (5).jpg",
        "post-face (6).jpg",
        "post-face (6).png",
        "post-face-(10).jpg",
        "post-face-(11).jpg",
        "post-face-(3).jpg",
        "post-face-(5).jpg",
        "post-face-(7).jpg",
        "post-face-(8).jpg",
        "post-face-3.jpg",
        "ragina-Capa_Face.jpg",
        "regina-avatar.jpg",
        "site-carol-gd.jpg",
        "site-flavia-gd.png",
        "thumbnail_Capa_Face.jpg",
      ],
    },
  ];

  return (
    <section className="container-luxe py-32 sm:py-40">
      <div className="mb-14 max-w-3xl">
        <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/5 px-3 py-1 text-xs font-bold uppercase tracking-widest text-blue-400">
          Design
        </span>
        <h1 className="mb-6 text-4xl font-display font-bold uppercase tracking-tight sm:text-6xl">
          Design que conecta <span className="text-blue-gradient">ideias e pessoas.</span>
        </h1>
        <p className="text-lg leading-relaxed text-muted-foreground">
          Uma seleção de projetos de design gráfico e web design, reunidos em
          galerias com trabalhos das duas áreas.
        </p>
      </div>

      <nav aria-label="Seções de design" className="mb-12 flex flex-wrap gap-3">
        {galleries.map((gallery) => (
          <a
            key={gallery.id}
            href={`#${gallery.id}`}
            className="rounded-full border border-border px-5 py-2.5 text-sm font-semibold text-muted-foreground transition-colors hover:border-blue-500/40 hover:text-blue-400"
          >
            {gallery.title}
          </a>
        ))}
      </nav>

      <div className="space-y-20">
        {galleries.map((gallery) => (
          <section key={gallery.id} id={gallery.id} className="scroll-mt-28">
            <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
              <div>
                <h2 className="mb-2 text-2xl font-bold font-display sm:text-3xl">
                  {gallery.title}
                </h2>
                <p className="text-muted-foreground">{gallery.description}</p>
              </div>
              <span className="text-sm text-muted-foreground">
                {gallery.works.length} projetos
              </span>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {gallery.works.map((filename) => {
                const title = filename
                  .replace(/\.[^.]+$/, "")
                  .replace(/[-_]+/g, " ")
                  .replace(/\s+/g, " ")
                  .trim();

                return (
                  <figure
                    key={filename}
                    className="group overflow-hidden rounded-3xl border border-border bg-card"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                      <NextImage
                        src={`/images/${gallery.folder}/${encodeURIComponent(filename)}`}
                        alt={`${gallery.title}: ${title}`}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-contain p-2 transition-transform duration-500 group-hover:scale-[1.03]"
                      />
                    </div>
                    <figcaption className="px-4 py-3 text-sm font-medium capitalize text-foreground/90">
                      {title}
                    </figcaption>
                  </figure>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </section>
  );
}

export function TemplatesPageContent() {
  const templates = [
    {
      title: "Academias & Esportes",
      description: "Página de alta conversão focada em matrículas, exibição de planos e horários.",
      href: "/templates/academias",
      status: "Disponível",
      isReady: true,
    },
    {
      title: "Sites institucionais",
      description: "Estruturas para apresentar empresas, serviços e suas soluções.",
      href: "/templates/institucional",
      status: "Em breve",
      isReady: false,
    },
    {
      title: "Lojas virtuais",
      description: "Layouts pensados para catálogos fluidos e experiências de compra.",
      href: "/templates/ecommerce",
      status: "Em breve",
      isReady: false,
    },
  ];

  return (
    <section className="container-luxe py-32 sm:py-40">
      <div className="mx-auto mb-14 max-w-3xl text-center">
        <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/5 px-3 py-1 text-xs font-bold uppercase tracking-widest text-blue-400">
          Templates
        </span>
        <h1 className="mb-6 text-4xl font-display font-bold uppercase tracking-tight sm:text-6xl">
          Seu próximo site começa <span className="text-blue-gradient">por aqui.</span>
        </h1>
        <p className="text-lg leading-relaxed text-muted-foreground">
          Explore nossos modelos de alta conversão prontos para diferentes tipos de negócios. 
          Escolha a arquitetura ideal e nós personalizamos para a sua marca.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {templates.map((template) => {
          const CardContent = (
            <>
              <span className={`mb-8 inline-flex rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-widest ${
                template.isReady 
                  ? "border-blue-500/20 bg-blue-500/5 text-blue-400" 
                  : "border-zinc-800 bg-zinc-800/50 text-zinc-400"
              }`}>
                {template.status}
              </span>
              <div className="mb-3 flex items-center justify-between gap-4">
                <h2 className="text-xl font-bold font-display">{template.title}</h2>
                {template.isReady && (
                  <ArrowUpRight className="h-5 w-5 text-muted-foreground transition-colors group-hover:text-blue-400" />
                )}
              </div>
              <p className="leading-relaxed text-muted-foreground">
                {template.description}
              </p>
            </>
          );

          // Se estiver pronto, renderiza como um Link clicável. Se não, renderiza como um artigo inativo.
          return template.isReady ? (
            <Link
              key={template.title}
              href={template.href}
              className="group block rounded-3xl border border-border bg-card p-8 sm:p-10 transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/40 hover:shadow-blue-glow relative overflow-hidden"
            >
               {/* Glow subtil no hover */}
              <div className="absolute inset-0 bg-blue-500/0 group-hover:bg-blue-500/5 transition-colors duration-500 pointer-events-none" />
              <div className="relative z-10">
                {CardContent}
              </div>
            </Link>
          ) : (
            <article
              key={template.title}
              className="rounded-3xl border border-border bg-card/40 p-8 sm:p-10 opacity-60 grayscale cursor-not-allowed"
            >
              {CardContent}
            </article>
          );
        })}
      </div>
    </section>
  );
}