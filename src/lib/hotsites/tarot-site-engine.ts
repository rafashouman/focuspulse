// src/lib/hotsites/tarot-site-engine.ts

export type QuestionCategory = "love" | "career" | "decision" | "general";

export interface TarotCard {
  id: string;
  name: string;
  arcanaNumber: string;
  keywords: string[];
  literalEssence: string; // Significado literal e honesto da carta
  contextualNuance: Record<QuestionCategory, string>; // Adaptação leve ao tema da pergunta
  positionRole: {
    root: string;      // Carta 1: Onde você pisa agora
    movement: string;  // Carta 2: O que está em jogo / Ponto de virada
    verdict: string;   // Carta 3: A chave de ação (Bloqueada até o Lead)
  };
}

// 1. Classificador leve por palavras-chave (0ms, roda no cliente ou servidor)
export function detectQuestionCategory(question: string): QuestionCategory {
  const q = question.toLowerCase();

  if (
    /amor|relacionamento|afeto|afetiv|casal|\bex\b|paixão|sentimento|namor|casament|ficante|pessoa amada/.test(q)
  ) {
    return "love";
  }

  if (
    /trabalho|carreira|dinheiro|financ|projeto|emprego|negócio|sociedade|venda|profiss|estudo/.test(q)
  ) {
    return "career";
  }

  if (
    /devo|escolh|decis|caminho|mudar|mudança|viagem|ir ou ficar|vale a pena|risco/.test(q)
  ) {
    return "decision";
  }

  return "general";
}

// 2. Base de Arcanos (Separados ou sorteados conforme o Monte escolhido)
export const TAROT_CARDS_DB: Record<string, TarotCard[]> = {
  // MONTE I: Véu de Obsidiana (Foco em clareza, cortes e estrutura)
  obsidian: [
    {
      id: "eremita",
      name: "O Eremita",
      arcanaNumber: "Arcano IX",
      keywords: ["Prudência", "Autonomia", "Busca Interna"],
      literalEssence:
        "Tradicionalmente, O Eremita representa o recuo estratégico para enxergar com a própria lanterna, longe do ruído e da opinião alheia.",
      contextualNuance: {
        love: "No campo afetivo, aponta para a necessidade de entender o que você realmente quer antes de exigir uma definição do outro.",
        career: "Em projetos e carreira, indica uma fase de maturação silenciosa: planejar os bastidores antes de expor seus próximos passos.",
        decision: "Sobre sua decisão, a carta alerta que a resposta não virá de conselhos externos, mas de uma análise fria do que traz paz a você.",
        general: "Para a sua questão, sugere desacelerar o ritmo imediato para observar detalhes que passaram despercebidos na pressa.",
      },
      positionRole: {
        root: "Como base da sua questão, mostra que você já intui a resposta, mas ainda busca validação externa.",
        movement: "Como ponto de transição, pede que você filtre quem realmente merece saber dos seus planos.",
        verdict: "O conselho final é claro: dê um passo atrás por alguns dias para observar os fatos sem filtro emocional.",
      },
    },
    {
      id: "justica",
      name: "A Justiça",
      arcanaNumber: "Arcano VIII",
      keywords: ["Equilíbrio", "Verdade Literal", "Causa e Efeito"],
      literalEssence:
        "A Justiça é o arcano da objetividade, dos limites claros e da colheita exata daquilo que foi plantado, sem ilusões.",
      contextualNuance: {
        love: "Nas relações, pede reciprocidade real: observar atitudes concretas em vez de promessas ou expectativas.",
        career: "No âmbito profissional, favorece acordos formais, cortes de gastos de energia inúteis e foco no que dá retorno mensurável.",
        decision: "Para decidir com segurança, coloque os prós e contras no papel de maneira imparcial, separando desejo de viabilidade.",
        general: "Atende à sua pergunta mostrando que o momento exige postura firme e alinhamento entre o que você pensa e o que faz.",
      },
      positionRole: {
        root: "Mostra que sua situação atual exige um acerto de contas honesto consigo mesmo.",
        movement: "Indica que uma definição prática está se aproximando e pedirá um posicionamento seu.",
        verdict: "A chave aqui é cortar excessos: mantenha apenas o que é justo e recíproco para o seu esforço.",
      },
    },
    {
      id: "mago",
      name: "O Mago",
      arcanaNumber: "Arcano I",
      keywords: ["Iniciativa", "Habilidade", "Primeiro Passo"],
      literalEssence:
        "O Mago simboliza o ponto de partida: ele tem todos os quatro elementos sobre a mesa e o poder de transformar intenção em ação prática.",
      contextualNuance: {
        love: "No afeto, fala sobre abertura para novas dinâmicas, comunicação direta e poder de atração consciente.",
        career: "No trabalho, é um sinal verde para tirar ideias do papel usando as ferramentas e contatos que você já possui hoje.",
        decision: "Sobre sua escolha, mostra que você tem mais controle sobre a situação do que imagina; falta apenas dar o comando inicial.",
        general: "Responde à sua dúvida afirmando que os recursos necessários já estão ao seu alcance, mesmo que pareçam simples.",
      },
      positionRole: {
        root: "Na base da leitura, revela um potencial criativo ou oportunidade que ainda está apenas no campo mental.",
        movement: "No centro do jogo, aponta que uma conversa ou atitude sua mudará a direção do cenário.",
        verdict: "Veredito da mesa: pare de esperar o 'momento perfeito' e execute uma primeira ação concreta nas próximas 48 horas.",
      },
    },
    {
      id: "sacerdotisa",
      name: "A Sacerdotisa",
      arcanaNumber: "Arcano II",
      keywords: ["Intuição", "Segredo", "Silêncio Fértil"],
      literalEssence:
        "A Sacerdotisa guarda o limiar entre o que se sabe e o que ainda não foi dito. Representa a sabedoria que não precisa de plateia e a leitura atenta dos sinais sutis.",
      contextualNuance: {
        love: "No afeto, pede que você escute o que não está sendo dito: gestos, pausas e coerência valem mais que declarações.",
        career: "No trabalho, indica que há informações ainda não reveladas; observe os bastidores antes de assumir compromissos.",
        decision: "Sobre sua escolha, a carta sugere que você já percebeu algo importante e está ignorando a própria percepção.",
        general: "Para a sua questão, aconselha silêncio estratégico e atenção aos detalhes sutis antes de agir.",
      },
      positionRole: {
        root: "Na base da leitura, mostra que você sabe mais do que admite, e que a dúvida nasce de ignorar o que já sentiu.",
        movement: "No ponto de virada, indica que uma informação escondida virá à tona e pedirá a sua discrição.",
        verdict: "O conselho é registrar suas percepções por escrito durante três dias e só decidir depois de ler o padrão que se repete.",
      },
    },
    {
      id: "imperador",
      name: "O Imperador",
      arcanaNumber: "Arcano IV",
      keywords: ["Estrutura", "Autoridade", "Responsabilidade"],
      literalEssence:
        "O Imperador é a estrutura: limites claros, responsabilidade e autoridade exercida com método. Ele ensina que ordem não é rigidez, é a base sobre a qual algo duradouro se constrói.",
      contextualNuance: {
        love: "Nas relações, pede acordos explícitos, rotina saudável e postura adulta diante dos combinados.",
        career: "Na carreira, favorece planejamento, hierarquia clara, metas com prazo e liderança pelo exemplo.",
        decision: "Para decidir, defina critérios objetivos e prazos antes de avaliar as opções; estrutura reduz a ansiedade.",
        general: "Responde à sua questão pedindo firmeza e organização: o que está solto precisa de regras simples.",
      },
      positionRole: {
        root: "Mostra que a situação pede mais estrutura do que inspiração: faltam regras e limites bem definidos.",
        movement: "Indica que uma posição de autoridade ou uma decisão formal vai organizar o cenário.",
        verdict: "Estabeleça um plano com datas e responsabilidades escritas; liderar a própria vida começa por combinar as regras consigo mesmo.",
      },
    },
    {
      id: "morte",
      name: "A Morte",
      arcanaNumber: "Arcano XIII",
      keywords: ["Encerramento", "Transformação", "Renascimento"],
      literalEssence:
        "A Morte raramente fala de fim literal: ela representa o encerramento de um ciclo, o corte do que já cumpriu seu papel e a abertura inevitável para o novo.",
      contextualNuance: {
        love: "No afeto, sugere encerrar dinâmicas desgastadas, o que pode significar transformar o vínculo ou soltá-lo com honestidade.",
        career: "Em projetos e carreira, indica abandonar o que não rende mais para liberar energia para algo com futuro.",
        decision: "Sobre a sua decisão, aponta que manter o antigo por medo custa mais do que a mudança temporária.",
        general: "Para a sua questão, fala de uma transformação necessária e de despedir-se do que não faz mais sentido.",
      },
      positionRole: {
        root: "Na base da leitura, revela um ciclo que já terminou por dentro, mesmo que ainda continue por fora.",
        movement: "No centro do jogo, aponta uma transição que não depende de pedir licença: algo precisa sair para algo entrar.",
        verdict: "O conselho é nomear com clareza o que você vai encerrar e agir nos próximos dias, em vez de adiar o inevitável.",
      },
    },
    {
      id: "torre",
      name: "A Torre",
      arcanaNumber: "Arcano XVI",
      keywords: ["Ruptura", "Revelação", "Reconstrução"],
      literalEssence:
        "A Torre simboliza a ruptura de estruturas erguidas sobre bases frágeis. Embora assuste, ela libera: o que cai era justamente o que não se sustentava.",
      contextualNuance: {
        love: "No campo afetivo, indica uma verdade que derruba ilusões; dolorosa, mas libertadora para quem busca vínculos reais.",
        career: "No trabalho, sinaliza mudanças bruscas de cenário e a necessidade de reconstruir os planos sobre dados reais.",
        decision: "Sobre a sua escolha, mostra que a decisão que parece insuportável talvez seja só o que está desmontando uma ilusão.",
        general: "Para a sua questão, avisa que uma suposição precisa ser revista, e que quanto antes isso acontecer, menor o desgaste.",
      },
      positionRole: {
        root: "Mostra que a situação foi construída sobre uma premissa que já não se sustenta.",
        movement: "Indica um evento súbito ou uma conversa franca que vai derrubar o que estava só de aparência.",
        verdict: "Antes que algo caia sozinho, revise a premissa mais frágil do seu plano e decida se ela merece reforço ou descarte.",
      },
    },
  ],

  // MONTE II: Espelho de Mercúrio (Foco em movimento, escolhas e ciclos)
  mercury: [
    {
      id: "roda",
      name: "A Roda da Fortuna",
      arcanaNumber: "Arcano X",
      keywords: ["Ciclos", "Movimento Rápido", "Sincronicidade"],
      literalEssence:
        "A Roda da Fortuna retrata a impermanência e as viradas de ciclo. O que está parado começa a girar, trazendo novas variáveis para o jogo.",
      contextualNuance: {
        love: "Nos relacionamentos, indica mudança de fase ou encontros inesperados que quebram a rotina atual.",
        career: "Nos negócios e carreira, sinaliza que o cenário externo vai mudar rapidamente, exigindo adaptabilidade e visão de oportunidade.",
        decision: "Em relação à sua dúvida, mostra que fatores externos vão ajudar a destravar o que hoje parece um impasse.",
        general: "Para o seu momento, lembra que nenhuma estagnação dura para sempre; o vento está mudando de direção.",
      },
      positionRole: {
        root: "Indica que você está exatamente no fim de um ciclo que já deu o que tinha que dar.",
        movement: "Mostra uma reviravolta ou novidade chegando para alterar suas prioridades.",
        verdict: "Não resista à mudança: flexibilize seus planos e aproveite a oportunidade que surgir de forma imprevista.",
      },
    },
    {
      id: "enamorados",
      name: "Os Enamorados",
      arcanaNumber: "Arcano VI",
      keywords: ["Escolha Consciente", "Alinhamento", "Encruzilhada"],
      literalEssence:
        "Mais do que romance, Os Enamorados falam sobre estar diante de uma bifurcação onde é preciso escolher um caminho inteiro e abrir mão da dúvida.",
      contextualNuance: {
        love: "No campo afetivo, destaca magnetismo forte, mas pede definição clara de compromissos e vontades.",
        career: "Na vida profissional, aponta para parcerias estratégicas ou a necessidade de escolher onde focar sua energia principal.",
        decision: "Toca diretamente na sua pergunta: dividir sua energia entre duas opções está drenando sua força. Escolha uma direção.",
        general: "Sugere que a harmonia que você procura virá no instante em que você se comprometer de verdade com a sua prioridade.",
      },
      positionRole: {
        root: "Reflete a divisão interna ou dúvida que motivou você a buscar esta resposta hoje.",
        movement: "Mostra que um convite, proposta ou conversa colocará as cartas na mesa.",
        verdict: "Escolha pelo que conecta com seus valores reais, não pelo caminho que parece mais cômodo no curto prazo.",
      },
    },
    {
      id: "carro",
      name: "O Carro",
      arcanaNumber: "Arcano VII",
      keywords: ["Direção", "Avanço", "Superação de Obstáculos"],
      literalEssence:
        "O Carro representa o triunfo através do foco e da determinação: manter as rédeas firmes mesmo quando forças opostas tentam distrair você.",
      contextualNuance: {
        love: "Nas relações, pede clareza sobre se ambos estão olhando para a mesma direção de futuro.",
        career: "Em projetos, é uma das cartas mais favoráveis para expansão, metas audaciosas e conquista de espaço.",
        decision: "Sobre sua decisão: uma vez escolhido o rumo, avance sem olhar para trás e sem deixar inseguranças frearem você.",
        general: "Atende à sua questão com um chamado ao movimento direcionado e confiança na própria capacidade.",
      },
      positionRole: {
        root: "Mostra uma vontade forte de resolver a questão e sair do lugar rapidamente.",
        movement: "Indica aceleração dos acontecimentos assim que você definir sua meta.",
        verdict: "Assuma o volante da situação: defina onde você quer estar em 30 dias e direcione toda a sua rotina para isso.",
      },
    },
    {
      id: "louco",
      name: "O Louco",
      arcanaNumber: "Arcano 0",
      keywords: ["Recomeço", "Leveza", "Salto Consciente"],
      literalEssence:
        "O Louco é o início sem garantias: um passo dado com confiança e leveza, sem o mapa completo. Representa a coragem de recomeçar e o risco consciente de se mover.",
      contextualNuance: {
        love: "No afeto, convida à leveza e à abertura para o novo, sem levar a bagagem de decepções antigas para a conversa.",
        career: "Em projetos, favorece experimentar, testar uma ideia pequena e aprender fazendo, em vez de esperar o plano perfeito.",
        decision: "Sobre a sua decisão, indica que o risco existe, mas a imobilidade também tem custo; um teste pequeno responde mais que muita análise.",
        general: "Para a sua questão, pede espontaneidade responsável: dar o primeiro passo mantendo os pés no chão.",
      },
      positionRole: {
        root: "Na base, mostra um desejo de recomeço que já está maduro, mas ainda sem coragem para o primeiro passo.",
        movement: "No ponto de virada, indica uma oportunidade inesperada que exigirá resposta rápida e flexibilidade.",
        verdict: "Dê um primeiro passo reversível nas próximas 72 horas: pequeno o bastante para não assustar, real o bastante para mudar o jogo.",
      },
    },
    {
      id: "temperanca",
      name: "A Temperança",
      arcanaNumber: "Arcano XIV",
      keywords: ["Equilíbrio", "Paciência", "Medida Certa"],
      literalEssence:
        "A Temperança mistura opostos até achar a medida certa. Fala de paciência, adaptação e da arte de dosar esforço, emoção e tempo para obter um resultado estável.",
      contextualNuance: {
        love: "Nas relações, pede ritmo equilibrado: nem pressa nem frieza, e um diálogo que concilie o que cada um precisa.",
        career: "No trabalho, favorece parcerias, ajustes graduais e rotinas sustentáveis em vez de picos de esforço.",
        decision: "Para decidir, sugere uma via do meio ou uma transição em etapas, em lugar de uma ruptura total.",
        general: "Responde à sua questão com um convite à moderação e ao ajuste fino do que já está em andamento.",
      },
      positionRole: {
        root: "Mostra que você oscila entre extremos e que a resposta está em encontrar a dose certa.",
        movement: "Indica que um processo gradual, e não um golpe de sorte, é o que vai destravar o cenário.",
        verdict: "Ajuste uma variável por vez, em pequenas doses, e observe os efeitos por duas semanas antes de mudar tudo.",
      },
    },
    {
      id: "enforcado",
      name: "O Enforcado",
      arcanaNumber: "Arcano XII",
      keywords: ["Pausa", "Nova Perspectiva", "Entrega"],
      literalEssence:
        "O Enforcado representa a pausa voluntária e a mudança de ponto de vista. Algo fica suspenso para que uma nova percepção apareça, e a entrega ao processo vira vantagem.",
      contextualNuance: {
        love: "No afeto, pede que você olhe a situação pelo ângulo do outro e pare de forçar um desfecho imediato.",
        career: "Em projetos, indica um período de espera produtiva: revisar a abordagem em vez de insistir na mesma tática.",
        decision: "Sobre a sua escolha, mostra que decidir agora seria prematuro; falta uma perspectiva que ainda não foi considerada.",
        general: "Para a sua questão, sugere pausar a insistência e experimentar enxergar o problema de cabeça para baixo.",
      },
      positionRole: {
        root: "Mostra que você está há tempo demais tentando resolver a questão sempre pelo mesmo ângulo.",
        movement: "Indica um período de suspensão em que o melhor movimento é observar e reavaliar prioridades.",
        verdict: "Reserve um tempo definido de pausa e, ao fim dele, escolha com a perspectiva nova, sem culpa pelo tempo parado.",
      },
    },
    {
      id: "julgamento",
      name: "O Julgamento",
      arcanaNumber: "Arcano XX",
      keywords: ["Chamado", "Balanço", "Despertar"],
      literalEssence:
        "O Julgamento é o chamado: um despertar de consciência em que o passado é visto com honestidade e perdoado, abrindo espaço para uma resposta mais autêntica.",
      contextualNuance: {
        love: "No afeto, indica uma conversa de balanço, em que cada parte reconhece sua responsabilidade e decide o que merece continuar.",
        career: "Na carreira, fala de uma avaliação, de um chamado vocacional e de reposicionar-se com base no que você aprendeu.",
        decision: "Sobre a sua decisão, sugere revisar o histórico com honestidade: o que sua trajetória já mostrou sobre o que funciona para você?",
        general: "Para a sua questão, aponta um momento de balanço e de responder com coragem a um chamado que vem se repetindo.",
      },
      positionRole: {
        root: "Na base, mostra que um chamado interno vem se repetindo há algum tempo e já não dá para ignorá-lo.",
        movement: "No centro do jogo, indica uma avaliação, um retorno ou uma conversa que fecha uma conta antiga.",
        verdict: "Faça um balanço escrito: o que aprendi, o que não repito mais, o que escolho agora, e aja a partir dele.",
      },
    },
  ],

  // MONTE III: Chave de Âmbar (Foco em vitalidade, intuição e construção)
  gold: [
    {
      id: "estrela",
      name: "A Estrela",
      arcanaNumber: "Arcano XVII",
      keywords: ["Renovação", "Clareza", "Caminho Alinhado"],
      literalEssence:
        "A Estrela surge após a tempestade: simboliza cura, autenticidade e a certeza tranquila de que o futuro reserva um terreno fértil.",
      contextualNuance: {
        love: "No afeto, traz leveza, transparência emocional e reconstrução da confiança.",
        career: "No trabalho, favorece projetos autorais, visibilidade positiva e reconhecimento pelo seu talento natural.",
        decision: "Para a sua escolha, orienta seguir a opção que traz sensação de alívio e expansão, não a que é baseada no medo.",
        general: "Ilumina sua pergunta mostrando que o pior do desgaste já passou e uma fase mais limpa se abre agora.",
      },
      positionRole: {
        root: "Mostra que, apesar das dúvidas recentes, sua intuição continua apontando para um ideal verdadeiro.",
        movement: "Sinaliza uma abertura de caminhos e sinais claros de que você está sendo guiado na direção certa.",
        verdict: "Mantenha a confiança e aja com autenticidade; não diminua seus planos para caber em cenários pequenos.",
      },
    },
    {
      id: "imperatriz",
      name: "A Imperatriz",
      arcanaNumber: "Arcano III",
      keywords: ["Fertilidade", "Criação", "Colheita Material"],
      literalEssence:
        "A Imperatriz é o arquétipo do crescimento natural, da inteligência criativa e da nutrição daquilo que tem potencial para florescer.",
      contextualNuance: {
        love: "Nos relacionamentos, fala de magnetismo, presença, afeto nutrido no dia a dia e prazer compartilhado.",
        career: "Nas finanças e projetos, indica fase fértil para gestar novas fontes de renda, produtos ou ideias criativas.",
        decision: "Na sua decisão, pergunte-se: qual desses caminhos realmente nutre você e tem espaço para crescer no longo prazo?",
        general: "Responde à sua questão pedindo cuidado prático com o seu ambiente, seu corpo e seus projetos em andamento.",
      },
      positionRole: {
        root: "Indica que há sementes muito promissoras já plantadas na sua situação atual.",
        movement: "Mostra que o desenvolvimento acontecerá de forma orgânica se você der atenção constante.",
        verdict: "Valorize o seu próprio passe: invista onde há retorno real e permita-se receber o melhor dessa fase.",
      },
    },
    {
      id: "sol",
      name: "O Sol",
      arcanaNumber: "Arcano XIX",
      keywords: ["Vitalidade", "Revelação", "Sucesso Claro"],
      literalEssence:
        "O Sol representa a luz do meio-dia que dissipa sombras e mal-entendidos, trazendo vitalidade, acordos claros e realização.",
      contextualNuance: {
        love: "No amor, aponta para verdade revelada, calor humano e momentos de cumplicidade sem jogos ocultos.",
        career: "Na carreira, representa visibilidade, clareza de propósito e colheita positiva de esforços recentes.",
        decision: "Para a sua dúvida, indica que fatos novos virão à tona em breve, tornando a escolha muito mais óbvia do que parece hoje.",
        general: "Atende à sua leitura trazendo um prognóstico de clareza, energia renovada e resolução direta.",
      },
      positionRole: {
        root: "Revela que a verdade central da sua questão já está visível, bastando aceitá-la com naturalidade.",
        movement: "Aponta para um esclarecimento importante que dissolve incertezas.",
        verdict: "Saia da sombra da dúvida: posicione-se com clareza, celebre suas conquistas e avance sob a luz dos fatos.",
      },
    },
    {
      id: "hierofante",
      name: "O Hierofante",
      arcanaNumber: "Arcano V",
      keywords: ["Mentoria", "Tradição", "Método"],
      literalEssence:
        "O Hierofante é a tradição que ensina: o mestre, a instituição, o método comprovado. Fala de aprender com quem já percorreu o caminho e de respeitar rituais que dão sentido e pertencimento.",
      contextualNuance: {
        love: "No campo afetivo, favorece compromissos assumidos com clareza, valores compartilhados e rituais que fortalecem o vínculo.",
        career: "No trabalho, aponta para mentoria, formação, certificações e métodos testados em vez de improvisos.",
        decision: "Na sua decisão, vale ouvir alguém experiente e de confiança, sem abrir mão da sua palavra final.",
        general: "Atende à sua pergunta sugerindo aprendizado estruturado e apoio de quem já resolveu algo parecido.",
      },
      positionRole: {
        root: "Mostra que a resposta passa por buscar orientação confiável em vez de reinventar tudo sozinho.",
        movement: "Indica a aproximação de um professor, método ou comunidade que ajuda a organizar o seu caminho.",
        verdict: "Escolha um mentor ou método e comprometa-se com ele por trinta dias antes de julgar o resultado.",
      },
    },
    {
      id: "forca",
      name: "A Força",
      arcanaNumber: "Arcano XI",
      keywords: ["Coragem Serena", "Domínio Gentil", "Constância"],
      literalEssence:
        "A Força não é violência, e sim domínio gentil: a coragem tranquila de lidar com impulsos, medos e conflitos com paciência, firmeza e compaixão.",
      contextualNuance: {
        love: "Nas relações, pede paciência ativa e coragem para falar do que dói sem agressividade.",
        career: "No trabalho, indica resistência, autocontrole e persistência serena diante de pressões ou pessoas difíceis.",
        decision: "Sobre a sua escolha, mostra que a opção certa exigirá coragem emocional, não apenas raciocínio.",
        general: "Para a sua questão, sinaliza que o que parece um desafio enorme cede mais à constância calma do que à pressa.",
      },
      positionRole: {
        root: "Na base da leitura, revela uma força interior maior do que a que você vem reconhecendo.",
        movement: "No ponto de virada, aponta uma situação de tensão que será resolvida com firmeza gentil.",
        verdict: "Enfrente o ponto difícil com calma e consistência; pequenas ações repetidas valem mais que um grande ataque de coragem.",
      },
    },
    {
      id: "diabo",
      name: "O Diabo",
      arcanaNumber: "Arcano XV",
      keywords: ["Apego", "Magnetismo", "Libertação"],
      literalEssence:
        "O Diabo mostra aquilo que prende: apegos, hábitos, dependências e narrativas que parecem inevitáveis. A corrente, porém, costuma estar frouxa, e perceber isso já é o começo da liberdade.",
      contextualNuance: {
        love: "No afeto, fala de magnetismo intenso e de padrões de dependência; pergunte-se se é desejo ou hábito que mantém você ali.",
        career: "No trabalho e nas finanças, alerta para ambições que viram obrigação, gastos por impulso ou segurança que prende demais.",
        decision: "Sobre a sua decisão, pergunte qual opção você escolheria se não houvesse medo, culpa ou necessidade de aprovação.",
        general: "Para a sua questão, mostra um apego ou hábito que consome energia e que você tem mais poder de soltar do que imagina.",
      },
      positionRole: {
        root: "Mostra que há um padrão repetitivo ou um apego prendendo a sua energia nesta questão.",
        movement: "Indica que a tentação de manter o confortável vai competir com o desejo de mudar.",
        verdict: "Identifique a corrente mais visível, um hábito ou um vínculo, e dê um passo concreto para afrouxá-la esta semana.",
      },
    },
    {
      id: "lua",
      name: "A Lua",
      arcanaNumber: "Arcano XVIII",
      keywords: ["Intuição", "Incerteza", "Sensibilidade"],
      literalEssence:
        "A Lua ilumina pouco e por isso pede cautela: representa o terreno das emoções, dos sonhos e das incertezas, onde nem tudo é o que parece à primeira vista.",
      contextualNuance: {
        love: "No campo afetivo, indica sensibilidade aumentada e possíveis ilusões; confirme os fatos antes de tirar conclusões emocionais.",
        career: "No trabalho, pede cuidado com informações incompletas e boatos; espere clareza antes de comprometer recursos.",
        decision: "Para decidir, evite escolher no auge da ansiedade; deixe a noite passar e reveja com a mente mais calma.",
        general: "Responde à sua questão com um alerta gentil: há algo ainda nebuloso, e a pressa pode distorcer o que você enxerga.",
      },
      positionRole: {
        root: "Na base, mostra um estado de incerteza em que medo e imaginação estão preenchendo lacunas de informação.",
        movement: "No centro do jogo, aponta que um esclarecimento virá aos poucos, e não de uma só vez.",
        verdict: "Separe fatos de suposições em duas colunas no papel e só decida com base na primeira coluna.",
      },
    },
    {
      id: "mundo",
      name: "O Mundo",
      arcanaNumber: "Arcano XXI",
      keywords: ["Conclusão", "Integração", "Plenitude"],
      literalEssence:
        "O Mundo é a conclusão que integra: um ciclo completo, o aprendizado incorporado e a sensação de pertencer ao próprio caminho. Ao mesmo tempo, ele prepara o início de uma nova espiral.",
      contextualNuance: {
        love: "No afeto, indica plenitude, vínculos maduros e a possibilidade de fechar bem uma fase para iniciar outra.",
        career: "Na carreira, fala de entrega, reconhecimento e expansão: concluir bem o que está em curso abre portas maiores.",
        decision: "Sobre a sua decisão, mostra que a opção que integra o que você aprendeu até aqui tende a ser a mais sustentável.",
        general: "Para a sua questão, sinaliza que você está perto de completar um ciclo e já pode se preparar para o próximo.",
      },
      positionRole: {
        root: "Mostra que você acumulou mais aprendizado e recursos do que costuma reconhecer.",
        movement: "Indica um fechamento importante que prepara um novo patamar de possibilidades.",
        verdict: "Conclua formalmente o que está pendente, celebre e então defina a próxima meta: um ciclo bem fechado impulsiona o seguinte.",
      },
    },
  ],
};

// 3. Embaralhamento inteligente: cada monte é um pool de 7-8 cartas e cada acesso sorteia 3.
export const READING_SIZE = 3;
export const DECK_IDS = Object.keys(TAROT_CARDS_DB);

export type RandomSource = () => number;

export function getDeckPool(deckId: string): TarotCard[] {
  return TAROT_CARDS_DB[deckId] ?? TAROT_CARDS_DB.obsidian;
}

export function createSecureRandom(): RandomSource {
  return () => {
    if (typeof crypto !== "undefined" && typeof crypto.getRandomValues === "function") {
      return crypto.getRandomValues(new Uint32Array(1))[0] / 2 ** 32;
    }
    return Math.random();
  };
}

// Gerador determinístico (mulberry32) usado apenas como fallback previsível.
export function createSeededRandom(seed: string): RandomSource {
  let h = 1779033703 ^ seed.length;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(h ^ seed.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  let state = h >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffled<T>(items: readonly T[], random: RandomSource): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/**
 * Sorteia as cartas (e a ordem das posições) de um monte.
 * `avoidIds` recebe as cartas da última leitura: enquanto o pool tiver cartas
 * "frescas" suficientes, nenhuma delas se repete na tiragem seguinte.
 */
export function drawReadingCards(
  deckId: string,
  options: { avoidIds?: readonly string[]; random?: RandomSource } = {}
): string[] {
  const random = options.random ?? createSecureRandom();
  const avoid = new Set(options.avoidIds ?? []);
  const pool = getDeckPool(deckId);

  const fresh = shuffled(pool.filter((card) => !avoid.has(card.id)), random);
  const recent = shuffled(pool.filter((card) => avoid.has(card.id)), random);

  return [...fresh, ...recent].slice(0, READING_SIZE).map((card) => card.id);
}

export const READING_POSITIONS = [
  { label: "I. A Raiz do Momento", roleKey: "root", locked: false },
  { label: "II. A Dinâmica em Jogo", roleKey: "movement", locked: false },
  { label: "III. O Conselho Chave", roleKey: "verdict", locked: true },
] as const;

export interface ReadingCard {
  id: string;
  position: string;
  name: string;
  title: string;
  arcanaNumber: string;
  keywords: string;
  keywordList: string[];
  sections: {
    archetype: string;
    forYourQuestion: string;
    inThisPosition: string;
  };
  meaning: string;
  locked: boolean;
}

// 4. Função Principal que monta a leitura personalizada para a pergunta.
// Sem `drawnCardIds`, usa um sorteio determinístico a partir de monte + pergunta.
export function generateReadingForUser(
  deckId: string,
  question: string,
  drawnCardIds?: readonly string[]
) {
  const category = detectQuestionCategory(question);
  const pool = getDeckPool(deckId);
  const byId = new Map(pool.map((card) => [card.id, card]));

  let drawn = (drawnCardIds ?? []).map((id) => byId.get(id));
  if (drawn.length !== READING_SIZE || drawn.some((card) => !card)) {
    const fallbackIds = drawReadingCards(deckId, {
      random: createSeededRandom(`${deckId}|${question.trim().toLowerCase()}`),
    });
    drawn = fallbackIds.map((id) => byId.get(id));
  }

  const readingCards: ReadingCard[] = (drawn as TarotCard[]).map((card, index) => {
    const pos = READING_POSITIONS[index];
    const sections = {
      archetype: card.literalEssence,
      forYourQuestion: card.contextualNuance[category],
      inThisPosition: card.positionRole[pos.roleKey],
    };
    return {
      id: card.id,
      position: pos.label,
      name: `${card.name} (${card.arcanaNumber})`,
      title: card.name,
      arcanaNumber: card.arcanaNumber,
      keywords: card.keywords.join(" • "),
      keywordList: card.keywords,
      sections,
      // Combina o significado literal + nuance da pergunta + papel na posição
      meaning: `${sections.archetype} ${sections.forYourQuestion} ${sections.inThisPosition}`,
      locked: pos.locked,
    };
  });

  // Gancho honesto para incentivar o contato via WhatsApp ou App
  const categoryHooks: Record<QuestionCategory, string> = {
    love: "Esta tríade mostra a estrutura principal do seu momento afetivo, mas como envolve a energia de outra pessoa, uma tiragem complementar de Templo de Afrodite pode revelar as intenções ocultas do outro lado.",
    career: "Os arcanos apontam a direção estratégica para o seu projeto/carreira, mas uma abertura completa de caminhos ajuda a mapear os prazos e riscos financeiros com mais precisão.",
    decision: "As cartas deixaram claro o arquétipo central da sua escolha, porém comparar os dois caminhos lado a lado em uma leitura aprofundada evita passos em falso.",
    general: "Esta leitura inicial revela a tendência dominante da sua energia hoje. Para cruzar esses 3 Arcanos com as áreas específicas da sua vida, você pode aprofundar a consulta.",
  };

  return {
    category,
    cards: readingCards,
    drawnCardIds: readingCards.map((card) => card.id),
    cliffhangerHook: categoryHooks[category],
  };
}

export type TarotReading = ReturnType<typeof generateReadingForUser>;