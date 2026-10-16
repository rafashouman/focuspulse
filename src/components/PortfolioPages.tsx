import Link from "next/link";
import {
  ArrowUpRight,
  Code2,
  Image,
  Layers3,
  Palette,
  ShoppingBag,
  Tags,
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

export function PortfolioIndex() {
  return (
    <section className="container-luxe py-32 sm:py-40">
      <div className="max-w-3xl mb-14">
        <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/5 px-3 py-1 text-xs font-bold uppercase tracking-widest text-blue-400">
          Portfólio web
        </span>
        <h1 className="mb-6 text-4xl font-display font-bold uppercase tracking-tight sm:text-6xl">
          Ideias que viram <span className="text-blue-gradient">experiências.</span>
        </h1>
        <p className="text-lg leading-relaxed text-muted-foreground">
          Projetos e experimentos do site anterior, agora apresentados em uma
          interface mais clara, responsiva e alinhada à nova identidade.
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
          href="/apps"
          className="rounded-full border border-border px-5 py-2.5 text-sm font-semibold text-muted-foreground transition-colors hover:border-blue-500/40 hover:text-blue-400"
        >
          Aplicativos de suporte
        </Link>
        <Link
          href="/design"
          className="rounded-full border border-border px-5 py-2.5 text-sm font-semibold text-muted-foreground transition-colors hover:border-blue-500/40 hover:text-blue-400"
        >
          Galeria de design
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

export function AppsPageContent() {
  const apps = [
    {
      title: "Habilitar ou inativar produtos",
      description:
        "Ferramenta de apoio para organizar a disponibilidade de produtos em um catálogo.",
      icon: ShoppingBag,
      tag: "Catálogo",
    },
    {
      title: "Consultar SKUs",
      description:
        "Atalho para localizar e reunir códigos SKU de produtos de forma prática.",
      icon: Tags,
      tag: "Operação",
    },
  ];

  return (
    <section className="container-luxe py-32 sm:py-40">
      <div className="mx-auto mb-14 max-w-3xl text-center">
        <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/5 px-3 py-1 text-xs font-bold uppercase tracking-widest text-blue-400">
          Aplicativos
        </span>
        <h1 className="mb-6 text-4xl font-display font-bold uppercase tracking-tight sm:text-6xl">
          Pequenas ferramentas, <span className="text-blue-gradient">grandes atalhos.</span>
        </h1>
        <p className="text-lg leading-relaxed text-muted-foreground">
          Utilitários de suporte para tarefas de catálogo e operação, renovados
          com o layout do novo site.
        </p>
      </div>

      <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2">
        {apps.map((app) => {
          const Icon = app.icon;
          return (
            <article
              key={app.title}
              className="rounded-3xl border border-border bg-card p-8 sm:p-10"
            >
              <div className="mb-8 flex items-center justify-between">
                <div className="grid h-14 w-14 place-items-center rounded-2xl border border-blue-500/20 bg-blue-500/5 text-blue-400">
                  <Icon className="h-6 w-6" />
                </div>
                <span className="rounded-full border border-border px-3 py-1 text-xs font-semibold text-muted-foreground">
                  {app.tag}
                </span>
              </div>
              <h2 className="mb-3 text-xl font-bold font-display">{app.title}</h2>
              <p className="leading-relaxed text-muted-foreground">
                {app.description}
              </p>
            </article>
          );
        })}
      </div>
      <p className="mx-auto mt-8 max-w-4xl text-sm leading-relaxed text-muted-foreground">
        As duas ferramentas da versão anterior eram apenas protótipos visuais.
        Esta página preserva a apresentação sem simular integrações que ainda
        não estão configuradas.
      </p>
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
          <Image className="h-5 w-5 text-blue-400" />
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
          conhecer os projetos do portfólio.
        </p>
        <Link
          href="/webdev"
          className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-blue-400 transition-colors hover:text-blue-300"
        >
          Explorar portfólio <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}

export function DesignPageContent() {
  const works = [
    { title: "Composição natural", seed: "shouman-design-01", tone: "from-emerald-950/20" },
    { title: "Luz e arquitetura", seed: "shouman-design-02", tone: "from-sky-950/20" },
    { title: "Texturas urbanas", seed: "shouman-design-03", tone: "from-amber-950/20" },
    { title: "Formas e contraste", seed: "shouman-design-04", tone: "from-violet-950/20" },
    { title: "Paisagem em foco", seed: "shouman-design-05", tone: "from-teal-950/20" },
    { title: "Estudo de cor", seed: "shouman-design-06", tone: "from-rose-950/20" },
  ];

  return (
    <section className="container-luxe py-32 sm:py-40">
      <div className="mb-14 max-w-3xl">
        <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/5 px-3 py-1 text-xs font-bold uppercase tracking-widest text-blue-400">
          Design
        </span>
        <h1 className="mb-6 text-4xl font-display font-bold uppercase tracking-tight sm:text-6xl">
          Um olhar para <span className="text-blue-gradient">composição e cor.</span>
        </h1>
        <p className="text-lg leading-relaxed text-muted-foreground">
          Galeria visual inspirada no mural de imagens do site anterior,
          apresentada em uma grade responsiva com molduras renovadas.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {works.map((work, index) => (
          <figure
            key={work.seed}
            className={`group relative isolate min-h-[24rem] overflow-hidden rounded-3xl border border-border bg-card ${
              index === 1 || index === 4 ? "lg:translate-y-8" : ""
            }`}
          >
            <div
              role="img"
              aria-label={work.title}
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
              style={{
                backgroundImage: `url(https://picsum.photos/seed/${work.seed}/900/1200)`,
              }}
            />
            <div className={`absolute inset-0 bg-gradient-to-t ${work.tone} via-transparent to-black/10`} />
            <figcaption className="absolute inset-x-0 bottom-0 p-6 text-lg font-bold font-display text-white">
              {work.title}
            </figcaption>
          </figure>
        ))}
      </div>
      <p className="mt-16 text-xs text-muted-foreground">
        Imagens de demonstração servidas pelo Picsum Photos.
      </p>
    </section>
  );
}
