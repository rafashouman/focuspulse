"use client";

import Link from "next/link";
import { isAnalyticsConfigured } from "@/lib/firebase";

export default function PrivacyPage() {
  const analyticsAvailable = isAnalyticsConfigured();
  const openAnalyticsSettings = () => {
    window.dispatchEvent(new Event("focuspulse:open-analytics-settings"));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section className="container-luxe min-h-[70vh] py-32 sm:py-40">
      <div className="mx-auto max-w-3xl">
        <p className="mb-5 text-xs font-bold uppercase tracking-[0.2em] text-violet-200">
          FocusPulse · Privacidade
        </p>
        <h1 className="mb-6 font-display text-4xl font-bold uppercase tracking-tight sm:text-5xl">
          Aviso de Privacidade
        </h1>
        <p className="mb-10 leading-relaxed text-muted-foreground">
          Este aviso explica quais dados são registrados neste site, para que
          são usados e como você pode exercer seus direitos. Última atualização:
          28 de outubro de 2026.
        </p>

        <div className="space-y-8 text-sm leading-7 text-muted-foreground">
          <section>
            <h2 className="mb-2 font-display text-xl font-semibold text-foreground">
              Solicitações de contato
            </h2>
            <p>
              Se você enviar o briefing, armazenamos seu nome, empresa, mensagem,
              tipo de projeto, plano de referência, página de origem e registro
              do seu consentimento. Usamos essas informações apenas para
              responder ao pedido e preparar um orçamento. O WhatsApp é aberto
              separadamente; não recebemos confirmação de envio da mensagem por
              esse serviço.
            </p>
            <p className="mt-2">
              Os registros recebem um prazo-alvo de 180 dias, mas a exclusão
              automática ainda não está ativa neste projeto. Até a configuração
              de uma política TTL, eles podem permanecer armazenados além desse
              prazo e dependem de remoção manual.
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-display text-xl font-semibold text-foreground">
              Leituras e mini-game de tarot
            </h2>
            <p>
              Se você optar por desbloquear a leitura no hotsite de tarot,
              armazenamos seu nome, WhatsApp, monte escolhido, pergunta,
              cartas sorteadas e registro do consentimento para liberar o
              conteúdo e permitir contato relacionado à leitura. Os registros
              recebem um prazo-alvo de 180 dias, mas a exclusão automática ainda
              não está ativa neste projeto. Até a configuração de uma política
              TTL, eles podem permanecer armazenados além desse prazo e
              dependem de remoção manual.
            </p>
            <p className="mt-2">
              O mini-game registra de forma anônima o estágio alcançado, a
              pontuação final, os créditos e o resultado da partida. Não são
              enviados nome, WhatsApp ou pergunta do hotsite nesse registro.
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-display text-xl font-semibold text-foreground">
              Seguro de vida para pilotos
            </h2>
            <p>
              Se você solicitar uma cotação no hotsite Costi, armazenamos seu
              nome, WhatsApp, modalidade de voo, capital segurado solicitado e
              consentimento para contato na coleção pilot_leads do Firestore.
              A equipe Costi acessa esses dados em um painel protegido; o
              navegador público não pode ler os registros. Os documentos
              recebem um prazo-alvo de 180 dias, mas a exclusão automática ainda
              não está ativa neste projeto; até a configuração de uma política
              TTL, eles podem permanecer armazenados além desse prazo e
              dependem de remoção manual. A equipe Costi consulta os registros
              em um painel protegido; não enviamos os dados da cotação por
              e-mail.
            </p>
            <p className="mt-2">
              Após autorizar estatísticas, também registramos eventos gerais do
              funil (posição dos CTAs, início do formulário, modalidade,
              capital solicitado, FAQ aberto e cotação enviada) no Firebase
              Analytics. Esses eventos não incluem nome, WhatsApp ou texto
              digitado.
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-display text-xl font-semibold text-foreground">
              Pontuações dos jogos
            </h2>
            <p>
              Se você entrar com uma conta Google e escolher registrar sua
              pontuação no Memory Matrix ou no Voxel Vaders, armazenamos seu
              identificador do Firebase Auth, nome de exibição, jogo, dados da
              partida, pontuação e data no Firestore. Usamos esses dados para
              registrar resultados dos jogos. Você pode solicitar acesso ou
              exclusão pelo contato indicado abaixo.
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-display text-xl font-semibold text-foreground">
              Estatísticas opcionais
            </h2>
            <p>
              Somente após sua autorização, registramos no Firebase Analytics
              páginas visitadas, início e fim de partidas do Arknoid, pontuação,
              ações gerais no Image Blend e eventos do funil de cotação Costi.
              Esses eventos não incluem nome, WhatsApp, empresa, mensagem,
              endereço de e-mail ou texto digitado nos formulários. O Google
              Analytics pode processar identificadores técnicos e informações
              do dispositivo para produzir estatísticas.
              O período de retenção é definido nas configurações do Google
              Analytics associado ao projeto.
            </p>
            {analyticsAvailable ? (
              <button
                type="button"
                onClick={openAnalyticsSettings}
                className="mt-3 font-semibold text-violet-200 underline-offset-4 hover:underline"
              >
                Configurar estatísticas
              </button>
            ) : (
              <p className="mt-3 text-xs">
                Estatísticas ainda não estão ativas neste ambiente.
              </p>
            )}
          </section>

          <section>
            <h2 className="mb-2 font-display text-xl font-semibold text-foreground">
              Armazenamento e compartilhamento
            </h2>
            <p>
              Briefings, leads de tarot, leads Costi e registros do mini-game
              são armazenados no Firestore, com regras que impedem que
              visitantes leiam os registros. A remoção automática dos leads
              depende da política de expiração configurada no projeto. As
              estatísticas autorizadas são processadas pelo Firebase/Google
              Analytics. Não vendemos os dados nem os usamos para publicidade
              comportamental.
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-display text-xl font-semibold text-foreground">
              Seus direitos e contato
            </h2>
            <p>
              Você pode solicitar acesso, correção ou exclusão das informações
              enviando um e-mail para{" "}
              <a
                href="mailto:contato@focuspulse.site"
                className="font-semibold text-violet-200 underline-offset-4 hover:underline"
              >
                contato@focuspulse.site
              </a>
              . Para deixar de gerar estatísticas, altere sua preferência acima.
              A retirada da autorização não apaga eventos já registrados;
              solicite a exclusão pelo mesmo contato.
            </p>
          </section>
        </div>

        <Link
          href="/"
          className="mt-10 inline-flex text-sm font-semibold text-violet-200 hover:text-white"
        >
          Voltar ao início
        </Link>
      </div>
    </section>
  );
}
