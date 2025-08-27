import { NextRequest, NextResponse } from "next/server";
import { PDFDocument, StandardFonts, rgb, PDFFont } from "pdf-lib";

export const runtime = "nodejs"; // Node-Runtime

// --- Seite/Layout ---
const PAGE_W = 595, PAGE_H = 842; // A4
const M_LEFT = 50, M_RIGHT = 50, M_TOP = 80, M_BOTTOM = 50;
const TXT = rgb(0,0,0);
const GRID = rgb(0.65,0.65,0.65);
const HEADER_BG = rgb(0.92,0.92,0.92);
const BODY_SIZE = 12;
const TABLE_SIZE = 10;
const LINE_H = 14;
const PADDING_X = 6;
const PADDING_Y = 5;

type TableBlock = { header: string[]; rows: string[][] };

// ---------- Unicode-Sanitisierung (wichtig gegen 500) ----------
function safe(s: string): string {
  if (!s) return "";
  return s
    .replace(/\u00A0/g, " ")      // NBSP -> Space
    .replace(/[–—]/g, "-")        // En/Em dash -> -
    .replace(/[•·]/g, "- ")       // Bullet -> "- "
    .replace(/×/g, "x")           // Malzeichen -> x
    .replace(/✓|✔/g, "✓")         // vereinheitlichen
    .replace(/[“”„»«]/g, '"')     // Smart quotes -> "
    .replace(/[’‘]/g, "'")        // Apostroph
    .replace(/…/g, "...")         // Ellipse
    .replace(/[°]/g, "°")         // Grad lassen (wird von WinAnsi unterstützt)
    .replace(/[^\x00-\xFF]/g, ""); // übrige nicht-WinAnsi entfernen
}

// ---------- Parser ----------
function isTableLine(s: string) { return /^\s*\|/.test(s); }
function splitRow(s: string) { return s.split("|").map(c => c.trim()).filter(Boolean); }
function parseBlocks(lines: string[]): (string | TableBlock)[] {
  const out: (string | TableBlock)[] = [];
  for (let i=0;i<lines.length;i++){
    const raw = lines[i];
    if (!isTableLine(raw)) { out.push(raw); continue; }
    const header = splitRow(raw);
    const sep = lines[i+1] || "";
    const isSep = /^\s*\|?\s*[:\-]{3,}/.test(sep);
    if (isSep) i++;
    const rows: string[][] = [];
    while (i+1<lines.length && isTableLine(lines[i+1])) { i++; rows.push(splitRow(lines[i])); }
    out.push({ header, rows });
  }
  return out;
}
function wrap(text: string, font: PDFFont, size: number, maxW: number): string[] {
  const words = safe(text).split(/\s+/);
  const lines: string[] = [];
  let line = "";
  for (const w of words) {
    const cand = line ? line + " " + w : w;
    const width = font.widthOfTextAtSize(cand, size) + 2 * PADDING_X;
    if (width > maxW && line) { lines.push(line); line = w; }
    else { line = cand; }
  }
  if (line) lines.push(line);
  return lines;
}

// ---------- API ----------
export async function POST(req: NextRequest) {
  try {
    const { markdown } = await req.json();
    if (typeof markdown !== "string" || !markdown.trim()) {
      return NextResponse.json({ error: "markdown missing" }, { status: 400 });
    }

    const pdf = await PDFDocument.create();
    let page = pdf.addPage([PAGE_W, PAGE_H]);
    const font = await pdf.embedFont(StandardFonts.Helvetica);
    const bold = await pdf.embedFont(StandardFonts.HelveticaBold);

    const today = new Date().toLocaleDateString("de-AT");
    const drawHeaderFooter = () => {
      page.drawText(safe("trainingsplan.at"), { x: M_LEFT, y: PAGE_H - 40, size: 20, font: bold, color: TXT });
      page.drawText(safe(`Erstellt am: ${today}`), { x: M_LEFT, y: 30, size: 10, font, color: rgb(0.35,0.35,0.35) });
    };
    drawHeaderFooter();

    let y = PAGE_H - M_TOP;
    const usableW = PAGE_W - M_LEFT - M_RIGHT;

    const ensure = (need: number) => {
      if (y - need < M_BOTTOM + 20) {
        page = pdf.addPage([PAGE_W, PAGE_H]); 
        drawHeaderFooter();
        y = PAGE_H - M_TOP;
      }
    };

    const blocks = parseBlocks(markdown.split(/\r?\n/));
    let legendPrinted = false;

    const printLegendOnce = () => {
      if (legendPrinted) return;
      const legend = [
        "Legende:",
        "RPE (Rate of Perceived Exertion) 1-10: 5-6 = locker / Plaudertempo, 7-8 = fordernd, 9 = sehr hart.",
        "Tempo-Beispiele: 3-1-3 = 3s exzentrisch - 1s Pause - 3s konzentrisch.",
        "Pause: Satzpausen zwischen Sätzen/Intervallen."
      ];
      for (const ln of legend) {
        const ls = wrap(ln, font, BODY_SIZE, usableW);
        for (const l of ls) { ensure(LINE_H); page.drawText(safe(l), { x: M_LEFT, y, size: BODY_SIZE, font, color: TXT }); y -= LINE_H; }
      }
      y -= 6; legendPrinted = true;
    };

    for (const block of blocks) {
      // Überschriften / Fließtext
      if (typeof block === "string") {
        const line = block.replace(/\t/g, "  ");
        const h = /^(#{1,6})\s+(.*)/.exec(line);
        if (h) {
          const level = h[1].length, text = h[2].trim();
          const size = level === 1 ? 18 : level === 2 ? 16 : 14;
          ensure(LINE_H + 6);
          page.drawText(safe(text), { x: M_LEFT, y, size, font: bold, color: TXT });
          y -= (level <= 2 ? LINE_H + 6 : LINE_H);
          continue;
        }
        if (!line.trim()) { y -= LINE_H/2; continue; }
        const lines = wrap(line, font, BODY_SIZE, usableW);
        for (const l of lines) { ensure(LINE_H); page.drawText(safe(l), { x: M_LEFT, y, size: BODY_SIZE, font, color: TXT }); y -= LINE_H; }
        continue;
      }

      // ---------- Tabelle als EIN Block ----------
      const header = block.header;
      const rows = block.rows;
      const allRows = [header, ...rows];
      const cols = Math.max(...allRows.map(r => r.length));

      // Spaltenbreiten
      const colWidths = new Array(cols).fill(0);
      for (const r of allRows) {
        for (let c=0;c<cols;c++) {
          const txt = (r[c] ?? "–").trim();
          const w = font.widthOfTextAtSize(safe(txt), TABLE_SIZE) + 2*PADDING_X;
          if (w > colWidths[c]) colWidths[c] = w;
        }
      }
      const totalW = colWidths.reduce((a,b)=>a+b,0);
      if (totalW > usableW) {
        const scale = usableW / totalW;
        for (let c=0;c<cols;c++) colWidths[c] = Math.floor(colWidths[c] * scale);
        const diff = Math.round(usableW - colWidths.reduce((a,b)=>a+b,0));
        if (diff) colWidths[cols-1] += diff;
      }

      // Zeilenhöhen
      const wrappedLines: string[][][] = [];
      const rowHeights: number[] = [];
      for (const r of allRows) {
        const cellLines: string[][] = [];
        let maxLines = 1;
        for (let c=0;c<cols;c++) {
          const txt = (r[c] ?? "–").trim();
          const lines = wrap(txt, font, TABLE_SIZE, colWidths[c]);
          cellLines.push(lines);
          if (lines.length > maxLines) maxLines = lines.length;
        }
        wrappedLines.push(cellLines);
        rowHeights.push(Math.max(20, PADDING_Y*2 + maxLines*12)); // 12 ≈ Line-Spacing in 10pt
      }
      const tableHeight = rowHeights.reduce((a,b)=>a+b,0);

      // Platz + kleiner Abstand
      ensure(tableHeight + 10);
      y -= 6;

      // Spaltenpositionen
      const x0 = M_LEFT;
      const xPos: number[] = [x0];
      for (let c=0;c<cols;c++) xPos.push(xPos[c] + colWidths[c]);

      // Außenrahmen + Kopfzeile
      const yTop = y;
      page.drawRectangle({ x: x0, y: yTop - rowHeights[0], width: xPos[cols]-x0, height: rowHeights[0], color: HEADER_BG });
      page.drawRectangle({ x: x0, y: yTop - tableHeight, width: xPos[cols]-x0, height: tableHeight, borderColor: GRID, borderWidth: 1 });

      // Vertikale Linien
      for (let c=1;c<cols;c++) {
        page.drawLine({ start: { x: xPos[c], y: yTop - tableHeight }, end: { x: xPos[c], y: yTop }, thickness: 1, color: GRID });
      }
      // Horizontale Linien
      let accH = 0;
      for (let r=0;r<allRows.length;r++) {
        accH += rowHeights[r];
        page.drawLine({ start: { x: x0, y: yTop - accH }, end: { x: xPos[cols], y: yTop - accH }, thickness: 1, color: GRID });
      }

      // Text
      let yRow = yTop;
      for (let r=0;r<allRows.length;r++) {
        const rowH = rowHeights[r];
        const cells = wrappedLines[r];
        for (let c=0;c<cols;c++) {
          let ty = yRow - PADDING_Y - 2;
          for (const t of cells[c]) {
            page.drawText(safe(t), { x: xPos[c] + PADDING_X, y: ty - TABLE_SIZE, size: TABLE_SIZE, font: r === 0 ?  bold : font, color: TXT });
            ty -= 12;
          }
        }
        yRow -= rowH;
      }

      y = yTop - tableHeight - 8;
      if (!legendPrinted) { printLegendOnce(); }
    }

const bytes = await pdf.save();

return new NextResponse(bytes, {
  status: 200,
  headers: {
    "Content-Type": "application/pdf",
    "Content-Disposition": 'attachment; filename="trainingsplan.pdf"'
  }
});

  } catch (e:any) {
    console.error("PDF ERROR:", e?.message || e);
    return NextResponse.json({ error: "failed to build pdf", details: e?.message || String(e) }, { status: 500 });
  }
}
