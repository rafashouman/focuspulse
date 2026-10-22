import Link from "next/link";
import NextImage from "next/image";

import {
  ArrowUpRight,
  Code2,
  Image as ImageIcon,
  Layers3,
} from "lucide-react";
import { tr } from "framer-motion/client";

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
        <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-violet-300/20 bg-violet-400/[0.06] px-3 py-1 text-xs font-bold uppercase tracking-widest text-violet-200">
          Aplicativos
        </span>
        <h1 className="mb-6 text-4xl font-display font-bold uppercase tracking-tight sm:text-6xl">
          Ideias que viram <span className="text-violet-gradient">experiências.</span>
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
              className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.035] p-8 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-violet-300/25 hover:shadow-violet-glow sm:p-10"
            >
              <div className="mb-12 flex items-start justify-between">
                <div className="grid h-14 w-14 place-items-center rounded-2xl border border-violet-300/20 bg-violet-400/[0.06] text-violet-200">
                  <Icon className="h-6 w-6" />
                </div>
                <span className="font-display text-sm text-muted-foreground">
                  {project.number}
                </span>
              </div>
              <p className="mb-2 text-xs font-bold uppercase tracking-widest text-violet-200">
                {project.category}
              </p>
              <div className="mb-3 flex items-center justify-between gap-4">
                <h2 className="text-2xl font-bold font-display">{project.title}</h2>
                <ArrowUpRight className="h-5 w-5 text-muted-foreground transition-colors group-hover:text-violet-200" />
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
          className="rounded-full border border-white/10 bg-white/[0.025] px-5 py-2.5 text-sm font-semibold text-muted-foreground transition-colors hover:border-violet-300/25 hover:text-violet-200"
        >
          Explorar design
        </Link>
        <Link
          href="/templates"
          className="rounded-full border border-white/10 bg-white/[0.025] px-5 py-2.5 text-sm font-semibold text-muted-foreground transition-colors hover:border-violet-300/25 hover:text-violet-200"
        >
          Ver templates
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
        <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-violet-300/20 bg-violet-400/[0.06] px-3 py-1 text-xs font-bold uppercase tracking-widest text-violet-200">
          Design
        </span>
        <h1 className="mb-6 text-4xl font-display font-bold uppercase tracking-tight sm:text-6xl">
          Design que conecta <span className="text-violet-gradient">ideias e pessoas.</span>
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
            className="rounded-full border border-white/10 bg-white/[0.025] px-5 py-2.5 text-sm font-semibold text-muted-foreground transition-colors hover:border-violet-300/25 hover:text-violet-200"
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
      number: "01",
      category: "Fitness & bem-estar",
      title: "Academias & Esportes",
      description: "Página de alta conversão focada em matrículas, exibição de planos e horários.",
      href: "/templates/academias",
      theme: "from-orange-500/20 via-[#181512] to-[#0c0d0f]",
    },
    {
      number: "02",
      category: "Gastronomia",
      title: "Cardápios & Restaurantes",
      description: "Um cardápio digital com identidade marcante, pensado para apresentar pratos e facilitar pedidos.",
      href: "/templates/cardapio",
      theme: "from-amber-200/15 via-[#1c1713] to-[#0c0d0f]",
    },
    {
      number: "03",
      category: "E-commerce & moda",
      title: "Lojas virtuais",
      description: "Uma vitrine editorial para apresentar coleções e criar uma experiência de compra envolvente.",
      href: "/templates/streetwear",
      theme: "from-violet-300/20 via-[#17111f] to-[#0c0d0f]",
    },
  ];

  return (
    <section className="container-luxe py-32 sm:py-40">
      <div className="mx-auto mb-14 max-w-3xl text-center">
        <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-violet-300/20 bg-violet-400/[0.06] px-3 py-1 text-xs font-bold uppercase tracking-widest text-violet-200">
          Templates
        </span>
        <h1 className="mb-6 text-4xl font-display font-bold uppercase tracking-tight sm:text-6xl">
          Seu próximo site começa <span className="text-violet-gradient">por aqui.</span>
        </h1>
        <p className="text-lg leading-relaxed text-muted-foreground">
          Explore nossos modelos de alta conversão prontos para diferentes tipos de negócios. 
          Escolha a arquitetura ideal e nós personalizamos para a sua marca.
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        {templates.map((template) => {
          return (
            <article
              key={template.href}
              className="group min-w-0 overflow-hidden rounded-[1.6rem] border border-white/[0.1] bg-white/[0.035] shadow-xl shadow-black/10 backdrop-blur-xl transition-transform duration-300 hover:-translate-y-1 hover:border-violet-200/20"
            >
              <Link
                href={template.href}
                className="block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-violet-300"
                aria-label={`Explorar o template ${template.title}`}
              >
                <div
                  className={`relative h-[270px] overflow-hidden bg-gradient-to-br ${template.theme} sm:h-[310px]`}
                >
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_30%,rgba(255,255,255,.09),transparent_55%)]" />
                  <div className="absolute inset-x-4 top-4 overflow-hidden rounded-xl border border-white/15 bg-[#100d15]/70 shadow-2xl shadow-violet-950/20 backdrop-blur-xl transition-transform duration-500 group-hover:scale-[1.025] sm:inset-x-6 sm:top-6">
                    <div className="flex h-8 items-center gap-1.5 border-b border-white/[0.08] px-3">
                      <span className="h-1.5 w-1.5 rounded-full bg-white/20" />
                      <span className="h-1.5 w-1.5 rounded-full bg-white/20" />
                      <span className="h-1.5 w-1.5 rounded-full bg-white/20" />
                      <span className="ml-auto font-mono text-[8px] text-white/35">
                        focuspulse.site{template.href}
                      </span>
                    </div>
                    <iframe
                      src={template.href}
                      title={`Prévia do template ${template.title}`}
                      loading="lazy"
                      scrolling="no"
                      tabIndex={-1}
                      className="pointer-events-none block h-[260px] w-full border-0 bg-[#0b0d10]/80 sm:h-[300px]"
                    />
                  </div>
                  <span className="absolute bottom-4 right-4 grid h-10 w-10 place-items-center rounded-full border border-white/20 bg-black/40 text-white backdrop-blur transition-colors group-hover:border-white/50 group-hover:bg-white group-hover:text-black">
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                </div>

                <div className="p-6 sm:p-7">
                  <div className="mb-4 flex items-center justify-between gap-4">
                    <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-violet-100/60">
                      {template.category}
                    </span>
                    <span className="font-mono text-xs text-white/35">
                      {template.number}
                    </span>
                  </div>
                  <div className="flex items-start justify-between gap-5">
                    <div>
                      <h2 className="font-display text-2xl font-semibold tracking-tight text-foreground">
                        {template.title}
                      </h2>
                      <p className="mt-2 text-sm leading-6 text-muted-foreground">
                        {template.description}
                      </p>
                    </div>
                    <ArrowUpRight className="mt-1 h-5 w-5 shrink-0 text-white/40 transition-colors group-hover:text-violet-200" />
                  </div>
                </div>
              </Link>
            </article>
          );
        })}
      </div>
    </section>
  );
}