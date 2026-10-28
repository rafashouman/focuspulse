// src/lib/hotsites/tarot-pdf.ts
// Dossiê em PDF da leitura (A4). O jspdf só é carregado quando o usuário pede o arquivo.
import type { jsPDF } from "jspdf";
import { getArcanaNumeral, getCardArt, type ArtPrimitive } from "@/lib/hotsites/tarot-card-art";
import type { QuestionCategory, TarotReading } from "@/lib/hotsites/tarot-site-engine";

export interface TarotPdfInput {
  name: string;
  question: string;
  deckTitle: string;
  reading: TarotReading;
  whatsappUrl: string;
  issuedAt?: Date;
}

type Rgb = [number, number, number];

const COLOR = {
  bg: [7, 7, 9] as Rgb,
  surface: [17, 17, 22] as Rgb,
  line: [88, 64, 20] as Rgb,
  gold: [251, 191, 36] as Rgb,
  goldDeep: [245, 158, 11] as Rgb,
  ivory: [244, 241, 234] as Rgb,
  body: [212, 212, 216] as Rgb,
  muted: [161, 161, 170] as Rgb,
  dim: [113, 113, 122] as Rgb,
  emerald: [16, 185, 129] as Rgb,
  black: [7, 7, 9] as Rgb,
};

const PAGE = { width: 210, height: 297, margin: 20, footerY: 284, bottom: 276 };

const CATEGORY_LABELS: Record<QuestionCategory, string> = {
  love: "Amor e relacionamentos",
  career: "Trabalho e projetos",
  decision: "Decisões e caminhos",
  general: "Visão geral do momento",
};

const SECTION_LABELS = [
  ["archetype", "O ARQUÉTIPO"],
  ["forYourQuestion", "PARA A SUA PERGUNTA"],
  ["inThisPosition", "NESTA POSIÇÃO"],
] as const;

// As fontes padrão do PDF só cobrem Latin-1: troca aspas, travessões e marcadores tipográficos.
function safe(text: string): string {
  return text
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u2013\u2014]/g, "-")
    .replace(/\u2026/g, "...")
    .replace(/\u2022/g, "\u00B7")
    .replace(/[^\u0000-\u00FF]/g, "");
}

function truncate(text: string, max: number): string {
  return text.length > max ? `${text.slice(0, max - 3).trimEnd()}...` : text;
}

function slug(text: string): string {
  return (
    text
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "leitura"
  );
}

const setFill = (doc: jsPDF, c: Rgb) => doc.setFillColor(c[0], c[1], c[2]);
const setStroke = (doc: jsPDF, c: Rgb) => doc.setDrawColor(c[0], c[1], c[2]);
const setInk = (doc: jsPDF, c: Rgb) => doc.setTextColor(c[0], c[1], c[2]);

function drawArt(doc: jsPDF, art: ArtPrimitive[], x: number, y: number, size: number, color: Rgb) {
  const s = size / 100;
  setStroke(doc, color);
  setFill(doc, color);
  doc.setLineWidth(Math.max(0.25, size * 0.017));
  doc.setLineCap("round");
  doc.setLineJoin("round");

  for (const p of art) {
    if (p.kind === "circle") {
      doc.circle(x + p.cx * s, y + p.cy * s, p.r * s, p.fill ? "F" : "S");
    } else if (p.kind === "line") {
      doc.line(x + p.x1 * s, y + p.y1 * s, x + p.x2 * s, y + p.y2 * s);
    } else {
      const [first, ...rest] = p.points.map(([px, py]) => [x + px * s, y + py * s]);
      let prev = first;
      const deltas = rest.map((pt) => {
        const delta = [pt[0] - prev[0], pt[1] - prev[1]];
        prev = pt;
        return delta;
      });
      doc.lines(deltas, first[0], first[1], [1, 1], p.fill ? "F" : "S", p.closed || p.fill ? true : false);
    }
  }
}

function paintPage(doc: jsPDF) {
  setFill(doc, COLOR.bg);
  doc.rect(0, 0, PAGE.width, PAGE.height, "F");
  setStroke(doc, COLOR.line);
  doc.setLineWidth(0.3);
  doc.rect(8, 8, PAGE.width - 16, PAGE.height - 16, "S");
}

function diamond(doc: jsPDF, cx: number, cy: number, r: number, color: Rgb) {
  setFill(doc, color);
  doc.lines(
    [
      [r, r],
      [-r, r],
      [-r, -r],
    ],
    cx,
    cy - r,
    [1, 1],
    "F",
    true
  );
}

interface TextStyle {
  font?: "helvetica" | "times";
  style?: "normal" | "bold" | "italic";
  size: number;
  color: Rgb;
  charSpace?: number;
}

function applyText(doc: jsPDF, t: TextStyle) {
  doc.setFont(t.font ?? "helvetica", t.style ?? "normal");
  doc.setFontSize(t.size);
  setInk(doc, t.color);
}

function centered(doc: jsPDF, text: string, cx: number, y: number, t: TextStyle) {
  applyText(doc, t);
  const content = safe(text);
  const spacing = t.charSpace ?? 0;
  if (spacing > 0) {
    // O alinhamento central nativo ignora o espaçamento entre letras, então centralizamos manualmente.
    const width = doc.getTextWidth(content) + spacing * (content.length - 1);
    doc.text(content, cx - width / 2, y, { charSpace: spacing });
    return;
  }
  doc.text(content, cx, y, { align: "center" });
}

function lineHeightMm(size: number, factor = 1.4) {
  return size * 0.3528 * factor;
}

function wrap(doc: jsPDF, text: string, width: number, t: TextStyle): string[] {
  applyText(doc, t);
  return doc.splitTextToSize(safe(text), width) as string[];
}

function paragraph(
  doc: jsPDF,
  text: string,
  x: number,
  y: number,
  width: number,
  t: TextStyle,
  align: "left" | "center" = "left"
): number {
  const lines = wrap(doc, text, width, t);
  const step = lineHeightMm(t.size);
  lines.forEach((l, i) => {
    doc.text(l, align === "center" ? x + width / 2 : x, y + i * step, { align });
  });
  return y + lines.length * step;
}

function drawCover(doc: jsPDF, input: TarotPdfInput, dateLabel: string) {
  const cx = PAGE.width / 2;
  const { reading } = input;

  diamond(doc, cx, 26, 2.2, COLOR.gold);
  centered(doc, "ORÁCULO  ·  TIRAGEM DIRECIONADA", cx, 36, {
    size: 8.5,
    color: COLOR.gold,
    charSpace: 0.7,
  });
  centered(doc, "Dossiê da sua Leitura", cx, 56, { font: "times", size: 30, color: COLOR.ivory });
  centered(doc, `Preparado para ${input.name}  ·  ${dateLabel}`, cx, 65, {
    font: "times",
    style: "italic",
    size: 12.5,
    color: COLOR.muted,
  });

  // Etiqueta do monte
  applyText(doc, { size: 8.5, color: COLOR.gold });
  const badgeText = safe(input.deckTitle);
  const badgeW = Math.min(150, doc.getTextWidth(badgeText) + 14);
  setFill(doc, COLOR.surface);
  setStroke(doc, COLOR.line);
  doc.setLineWidth(0.3);
  doc.roundedRect(cx - badgeW / 2, 73, badgeW, 8, 4, 4, "FD");
  centered(doc, input.deckTitle, cx, 78.3, { size: 8.5, color: COLOR.gold });

  // Pergunta
  const boxX = PAGE.margin + 2;
  const boxW = PAGE.width - (PAGE.margin + 2) * 2;
  const questionStyle: TextStyle = { font: "times", style: "italic", size: 14, color: COLOR.ivory };
  const questionLines = wrap(doc, `"${truncate(input.question.trim(), 320)}"`, boxW - 16, questionStyle);
  const boxH = 18 + questionLines.length * lineHeightMm(14, 1.35);
  const boxY = 92;
  setFill(doc, COLOR.surface);
  setStroke(doc, COLOR.line);
  doc.roundedRect(boxX, boxY, boxW, boxH, 3, 3, "FD");
  setFill(doc, COLOR.goldDeep);
  doc.rect(boxX, boxY + 4, 0.9, boxH - 8, "F");
  applyText(doc, { size: 7.5, color: COLOR.gold });
  doc.text("SUA INTENÇÃO REGISTRADA", boxX + 8, boxY + 8, { charSpace: 0.5 });
  applyText(doc, questionStyle);
  questionLines.forEach((l, i) => doc.text(l, boxX + 8, boxY + 16 + i * lineHeightMm(14, 1.35)));

  // As três cartas
  const cardW = 52;
  const cardH = 88;
  const gap = 10;
  const rowX = (PAGE.width - (cardW * 3 + gap * 2)) / 2;
  const rowY = Math.max(150, boxY + boxH + 24);

  reading.cards.forEach((card, i) => {
    const x = rowX + i * (cardW + gap);
    const mid = x + cardW / 2;

    centered(doc, card.position.toUpperCase(), mid, rowY - 4.5, {
      size: 6.8,
      color: COLOR.gold,
      charSpace: 0.25,
    });

    setFill(doc, COLOR.surface);
    setStroke(doc, COLOR.goldDeep);
    doc.setLineWidth(0.35);
    doc.roundedRect(x, rowY, cardW, cardH, 3, 3, "FD");
    setStroke(doc, COLOR.line);
    doc.setLineWidth(0.2);
    doc.roundedRect(x + 1.8, rowY + 1.8, cardW - 3.6, cardH - 3.6, 2, 2, "S");

    centered(doc, getArcanaNumeral(card.arcanaNumber), mid, rowY + 9, {
      font: "times",
      size: 10,
      color: COLOR.gold,
      charSpace: 1,
    });
    drawArt(doc, getCardArt(card.id), mid - 16, rowY + 13, 32, COLOR.gold);

    const nameStyle: TextStyle = { font: "times", style: "bold", size: 10.5, color: COLOR.ivory };
    const nameEnd = paragraph(doc, card.title.toUpperCase(), x + 4, rowY + 54, cardW - 8, nameStyle, "center");

    let ky = nameEnd + 1.5;
    card.keywordList.forEach((word) => {
      centered(doc, word, mid, ky, { size: 7, color: COLOR.muted });
      ky += 3.7;
    });
  });

  const afterCards = rowY + cardH + 14;
  centered(doc, `Tema identificado: ${CATEGORY_LABELS[reading.category]}`, cx, afterCards, {
    size: 8.5,
    color: COLOR.muted,
  });
  centered(doc, "A interpretação completa de cada carta está nas próximas páginas.", cx, afterCards + 6, {
    font: "times",
    style: "italic",
    size: 10,
    color: COLOR.dim,
  });
}

function drawReadingPages(doc: jsPDF, input: TarotPdfInput, nextPage: () => void) {
  nextPage();
  const cx = PAGE.width / 2;
  const textX = PAGE.margin + 36;
  const textW = PAGE.width - PAGE.margin - textX;
  const bodyStyle: TextStyle = { size: 9, color: COLOR.body };
  const bodyStep = lineHeightMm(9, 1.38);

  centered(doc, "A LEITURA DAS CARTAS", cx, 26, { size: 8.5, color: COLOR.gold, charSpace: 0.7 });
  centered(doc, "O que cada arcano revela", cx, 35, { font: "times", size: 19, color: COLOR.ivory });
  let y = 46;

  input.reading.cards.forEach((card) => {
    const sectionLines = SECTION_LABELS.map(([key]) => wrap(doc, card.sections[key], textW, bodyStyle));
    const bodyH = sectionLines.reduce((sum, lines) => sum + 4.6 + lines.length * bodyStep + 2.6, 0);
    const blockH = Math.max(40, 23 + bodyH);

    if (y + blockH > PAGE.bottom) {
      nextPage();
      y = 28;
    }

    setFill(doc, COLOR.surface);
    setStroke(doc, COLOR.line);
    doc.setLineWidth(0.3);
    doc.roundedRect(PAGE.margin, y, 30, 38, 2.5, 2.5, "FD");
    drawArt(doc, getCardArt(card.id), PAGE.margin + 3, y + 4, 24, COLOR.gold);
    centered(doc, getArcanaNumeral(card.arcanaNumber), PAGE.margin + 15, y + 33.5, {
      font: "times",
      size: 8.5,
      color: COLOR.gold,
      charSpace: 0.8,
    });

    applyText(doc, { size: 7.2, color: COLOR.gold });
    doc.text(card.position.toUpperCase(), textX, y + 3.5, { charSpace: 0.4 });
    applyText(doc, { font: "times", style: "bold", size: 16, color: COLOR.ivory });
    doc.text(safe(card.title), textX, y + 11);
    applyText(doc, { size: 8, color: COLOR.muted });
    doc.text(safe(`${card.arcanaNumber}  ·  ${card.keywordList.join("  ·  ")}`), textX, y + 16.5);

    let ty = y + 24;
    SECTION_LABELS.forEach(([, label], i) => {
      applyText(doc, { size: 6.8, color: COLOR.goldDeep });
      doc.text(label, textX, ty, { charSpace: 0.4 });
      applyText(doc, bodyStyle);
      sectionLines[i].forEach((l, li) => doc.text(l, textX, ty + 4.2 + li * bodyStep));
      ty += 4.6 + sectionLines[i].length * bodyStep + 2.6;
    });

    y = Math.max(y + 40, ty) + 5;
  });
}

function drawClosingPage(doc: jsPDF, input: TarotPdfInput, nextPage: () => void) {
  nextPage();
  const cx = PAGE.width / 2;
  const boxX = PAGE.margin;
  const boxW = PAGE.width - PAGE.margin * 2;

  diamond(doc, cx, 62, 2.2, COLOR.gold);
  centered(doc, "O PRÓXIMO PASSO", cx, 72, { size: 8.5, color: COLOR.gold, charSpace: 0.7 });
  centered(doc, "O que as cartas ainda não disseram", cx, 84, { font: "times", size: 21, color: COLOR.ivory });

  const hookStyle: TextStyle = { font: "times", style: "italic", size: 13, color: COLOR.ivory };
  const hookLines = wrap(doc, input.reading.cliffhangerHook, boxW - 20, hookStyle);
  const hookH = 14 + hookLines.length * lineHeightMm(13, 1.45);
  const hookY = 98;
  setFill(doc, COLOR.surface);
  setStroke(doc, COLOR.line);
  doc.setLineWidth(0.3);
  doc.roundedRect(boxX, hookY, boxW, hookH, 3, 3, "FD");
  setFill(doc, COLOR.goldDeep);
  doc.rect(boxX, hookY + 5, 0.9, hookH - 10, "F");
  applyText(doc, hookStyle);
  hookLines.forEach((l, i) => doc.text(l, boxX + 10, hookY + 11 + i * lineHeightMm(13, 1.45)));

  let y = hookY + hookH + 16;
  centered(doc, "CARTAS DESTA TIRAGEM", cx, y, { size: 7.5, color: COLOR.gold, charSpace: 0.5 });
  y += 7;
  y = paragraph(
    doc,
    input.reading.cards.map((c) => `${c.title} (${c.arcanaNumber})`).join("   ·   "),
    boxX,
    y,
    boxW,
    { size: 9.5, color: COLOR.body },
    "center"
  );

  y += 12;
  const btnW = 124;
  const btnH = 14;
  const btnX = cx - btnW / 2;
  setFill(doc, COLOR.emerald);
  doc.roundedRect(btnX, y, btnW, btnH, 7, 7, "F");
  centered(doc, "Aprofundar minha leitura no WhatsApp", cx, y + 8.8, {
    style: "bold",
    size: 10.5,
    color: COLOR.black,
  });
  doc.link(btnX, y, btnW, btnH, { url: input.whatsappUrl });
  y += btnH + 8;

  paragraph(
    doc,
    "Ao chamar, mencione sua pergunta e as cartas acima para que o atendimento continue exatamente de onde esta tiragem parou.",
    boxX + 12,
    y,
    boxW - 24,
    { size: 9, color: COLOR.muted },
    "center"
  );

  paragraph(
    doc,
    "Esta leitura tem caráter simbólico, reflexivo e de entretenimento. Ela não substitui orientação médica, psicológica, jurídica ou financeira e não prevê fatos futuros com certeza.",
    boxX + 8,
    PAGE.bottom - 14,
    boxW - 16,
    { size: 7.5, color: COLOR.dim },
    "center"
  );
}

function drawFooters(doc: jsPDF) {
  const total = doc.getNumberOfPages();
  for (let page = 1; page <= total; page++) {
    doc.setPage(page);
    applyText(doc, { size: 7.5, color: COLOR.dim });
    doc.text("ORÁCULO  ·  TIRAGEM DIRECIONADA", PAGE.margin, PAGE.footerY, { charSpace: 0.3 });
    doc.text(`Página ${page} de ${total}`, PAGE.width - PAGE.margin, PAGE.footerY, { align: "right" });
  }
}

export async function buildTarotReadingPdf(input: TarotPdfInput): Promise<jsPDF> {
  const { jsPDF: PdfDocument } = await import("jspdf");
  const doc = new PdfDocument({ unit: "mm", format: "a4", orientation: "portrait" });

  const name = truncate(input.name.trim() || "você", 60);
  const dateLabel = (input.issuedAt ?? new Date()).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  const data = { ...input, name };

  doc.setProperties({
    title: safe(`Dossiê da Leitura - ${name}`),
    subject: "Tiragem de tarot personalizada",
    author: "Oráculo",
    keywords: "tarot, leitura, tiragem",
  });

  const nextPage = () => {
    doc.addPage();
    paintPage(doc);
  };

  paintPage(doc);
  drawCover(doc, data, dateLabel);
  drawReadingPages(doc, data, nextPage);
  drawClosingPage(doc, data, nextPage);
  drawFooters(doc);

  return doc;
}

export async function downloadTarotReadingPdf(input: TarotPdfInput): Promise<void> {
  const doc = await buildTarotReadingPdf(input);
  doc.save(`leitura-oraculo-${slug(input.name)}.pdf`);
}
