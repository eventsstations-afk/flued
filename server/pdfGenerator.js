/**
 * CHRISTMAS FEUD — ADMINISTRATOR-ONLY PDF 1.4 ANSWER KEY GENERATOR
 * Features a dedicated full-page Christmas Cover Page on Page 1, followed by
 * crisp paginated question & answer tables dynamically generated from the live saved database:
 *  - CHRISTMAS FEUD CLASSIC – 70 ROUND ANSWER KEY.pdf
 *  - CHRISTMAS FEUD DELUXE – 100 ROUND ANSWER KEY.pdf
 *  - CHRISTMAS FEUD ULTIMATE – 150 ROUND ANSWER KEY.pdf
 *  - CHRISTMAS FEUD FAST MONEY ANSWER KEY.pdf
 */

const { EDITION_META, GAME_DATA_DISCLAIMER } = require('./data');

function sanitizePdfText(input) {
  return String(input ?? '')
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/[\u2013\u2014]/g, '-')
    .replace(/\u2026/g, '...')
    .replace(/\u2022/g, '*')
    .replace(/[ûüùú]/g, 'u')
    .replace(/[ÛÜÙÚ]/g, 'U')
    .replace(/[ëéèê]/g, 'e')
    .replace(/[ËÉÈÊ]/g, 'E')
    .replace(/[áàâäã]/g, 'a')
    .replace(/[ÁÀÂÄÃ]/g, 'A')
    .replace(/[íìîï]/g, 'i')
    .replace(/[óòôöõ]/g, 'o')
    .replace(/[ñ]/g, 'n')
    .replace(/[ç]/g, 'c')
    .replace(/[^\x20-\x7E]/g, ' ')
    .replace(/\\/g, '\\\\')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)');
}

function wrapText(text, maxChars) {
  const words = String(text || '').trim().split(/\s+/).filter(Boolean);
  if (!words.length) return [''];
  const lines = [];
  let cur = '';
  for (const w of words) {
    if (!cur) cur = w;
    else if (cur.length + 1 + w.length <= maxChars) cur += ' ' + w;
    else { lines.push(cur); cur = w; }
  }
  if (cur) lines.push(cur);
  return lines;
}

const C = {
  emerald: '0.03 0.34 0.22',
  emeraldDark: '0.04 0.21 0.14',
  burgundy: '0.42 0.05 0.10',
  burgundyDeep: '0.26 0.03 0.06',
  gold: '0.82 0.64 0.27',
  goldLight: '0.97 0.89 0.66',
  ivory: '0.98 0.96 0.92',
  ivoryRow: '0.95 0.92 0.86',
  white: '1 1 1',
  ink: '0.13 0.12 0.14',
  muted: '0.40 0.38 0.40',
  border: '0.80 0.72 0.52'
};

class ChristmasPdfDoc {
  constructor({ title, editionLabel, countLabel, roomId, generatedDate, categoriesSummary }) {
    this.title = title;
    this.editionLabel = editionLabel;
    this.countLabel = countLabel;
    this.roomId = roomId;
    this.generatedDate = generatedDate;
    this.categoriesSummary = categoriesSummary || [];
    this.pageW = 612;
    this.pageH = 792;
    this.margin = 40;
    this.pages = [];
    this.curOps = [];
    this.y = this.pageH - 72;
  }

  addCoverPage() {
    this.curOps = [];
    // Rich Christmas Burgundy outer cover background
    this.rectFill(0, 0, this.pageW, this.pageH, C.burgundyDeep);
    // Double Champagne Gold festive frame
    this.rectStroke(22, 22, this.pageW - 44, this.pageH - 44, C.gold, 2.4);
    this.rectStroke(30, 30, this.pageW - 60, this.pageH - 60, C.goldLight, 0.8);

    // Top Deep Emerald Festive Banner
    this.rectFill(46, this.pageH - 130, this.pageW - 92, 68, C.emerald);
    this.rectStroke(46, this.pageH - 130, this.pageW - 92, 68, C.gold, 1.8);
    this.text('THE ULTIMATE CHRISTMAS GAME SHOW', this.pageW / 2, this.pageH - 88, {
      font: 'F2', size: 12, color: C.goldLight, align: 'center'
    });
    this.text('OFFICIAL ADMINISTRATOR PRINT EDITION', this.pageW / 2, this.pageH - 110, {
      font: 'F1', size: 9, color: C.white, align: 'center'
    });

    // Center Marquee Title Plaque
    this.rectFill(46, this.pageH - 340, this.pageW - 92, 182, C.burgundy);
    this.rectStroke(46, this.pageH - 340, this.pageW - 92, 182, C.gold, 2.2);
    this.text('CHRISTMAS', this.pageW / 2, this.pageH - 210, {
      font: 'F2', size: 28, color: C.ivory, align: 'center'
    });
    this.text('FEUD', this.pageW / 2, this.pageH - 258, {
      font: 'F2', size: 48, color: C.goldLight, align: 'center'
    });
    this.line(120, this.pageH - 278, this.pageW - 120, this.pageH - 278, C.gold, 1.2);
    this.text(this.title, this.pageW / 2, this.pageH - 304, {
      font: 'F2', size: 13.5, color: C.white, align: 'center'
    });
    this.text(this.editionLabel, this.pageW / 2, this.pageH - 324, {
      font: 'F1', size: 10, color: C.goldLight, align: 'center'
    });

    // Warm Ivory Document Metadata & Contents Box
    this.rectFill(46, 200, this.pageW - 92, 224, C.ivory);
    this.rectStroke(46, 200, this.pageW - 92, 224, C.gold, 1.5);

    this.rectFill(46, 394, this.pageW - 92, 30, C.emeraldDark);
    this.text('DOCUMENT SUMMARY & SAVED BANK DETAILS', this.pageW / 2, 405, {
      font: 'F2', size: 10.5, color: C.goldLight, align: 'center'
    });

    this.text(`Contents: ${this.countLabel}`, 68, 370, { font: 'F2', size: 10.5, color: C.burgundy });
    this.text(`Game Room ID: ${this.roomId}   |   Export Date: ${this.generatedDate}`, 68, 350, { font: 'F1', size: 9.5, color: C.ink });
    this.line(68, 338, this.pageW - 68, 338, C.border, 0.7);

    // Categories included list (2 columns)
    this.text('Included Categories:', 68, 322, { font: 'F2', size: 9.5, color: C.emeraldDark });
    const cats = this.categoriesSummary.slice(0, 16);
    const half = Math.ceil(cats.length / 2);
    cats.forEach((catStr, idx) => {
      const col = idx < half ? 0 : 1;
      const row = idx < half ? idx : idx - half;
      const cx = col === 0 ? 74 : 318;
      const cy = 304 - row * 12.5;
      this.text(`* ${catStr}`, cx, cy, { font: 'F1', size: 8.4, color: C.ink });
    });

    // Confidential Administrator Seal & Disclaimer at bottom of cover
    this.rectFill(46, 118, this.pageW - 92, 58, C.emeraldDark);
    this.rectStroke(46, 118, this.pageW - 92, 58, C.gold, 1.4);
    this.text('CONFIDENTIAL - ADMINISTRATOR ANSWER KEY ONLY', this.pageW / 2, 154, {
      font: 'F2', size: 11, color: C.goldLight, align: 'center'
    });
    this.text('Keep private during live play. Do not share with contestants or public screens.', this.pageW / 2, 134, {
      font: 'F1', size: 8.8, color: C.white, align: 'center'
    });

    const discLines = wrapText(GAME_DATA_DISCLAIMER, 88);
    discLines.forEach((dl, i) => {
      this.text(dl, this.pageW / 2, 86 - i * 11, { font: 'F1', size: 7.8, color: C.goldLight, align: 'center' });
    });

    this.pages.push({ isCover: true, ops: this.curOps });
    this.curOps = [];
  }

  newContentPage() {
    if (this.curOps.length) {
      this.pages.push({ isCover: false, ops: this.curOps });
    }
    this.curOps = [];
    // Running broadcast header
    this.rectFill(0, this.pageH - 46, this.pageW, 46, C.burgundy);
    this.rectFill(0, this.pageH - 49, this.pageW, 3, C.gold);
    this.text(this.title, this.margin, this.pageH - 28, { font: 'F2', size: 10.5, color: C.goldLight });
    this.text('PRIVATE ADMINISTRATOR KEY', this.pageW - this.margin, this.pageH - 28, {
      font: 'F2', size: 8, color: C.white, align: 'right'
    });
    this.y = this.pageH - 66;
  }

  ensureSpace(heightNeeded) {
    if (!this.curOps.length) this.newContentPage();
    else if (this.y - heightNeeded < 54) this.newContentPage();
  }

  rectFill(x, y, w, h, rgb) {
    this.curOps.push(`${rgb} rg ${x.toFixed(2)} ${y.toFixed(2)} ${w.toFixed(2)} ${h.toFixed(2)} re f`);
  }

  rectStroke(x, y, w, h, rgb, lw = 0.8) {
    this.curOps.push(`${lw.toFixed(2)} w ${rgb} RG ${x.toFixed(2)} ${y.toFixed(2)} ${w.toFixed(2)} ${h.toFixed(2)} re S`);
  }

  line(x1, y1, x2, y2, rgb, lw = 0.6) {
    this.curOps.push(`${lw.toFixed(2)} w ${rgb} RG ${x1.toFixed(2)} ${y1.toFixed(2)} m ${x2.toFixed(2)} ${y2.toFixed(2)} l S`);
  }

  text(str, x, y, { font = 'F1', size = 10, color = C.ink, align = 'left' } = {}) {
    const clean = sanitizePdfText(str);
    const avgW = size * (font === 'F2' ? 0.54 : 0.50);
    const estW = clean.length * avgW;
    let drawX = x;
    if (align === 'center') drawX = x - estW / 2;
    else if (align === 'right') drawX = x - estW;
    this.curOps.push(`BT /${font} ${size} Tf ${color} rg ${drawX.toFixed(2)} ${y.toFixed(2)} Td (${clean}) Tj ET`);
  }

  addStandardRoundCard(round, roundNum, totalRounds) {
    const qLines = wrapText(round.question, 78);
    const headerH = 22 + qLines.length * 13 + 8;
    const rowH = 16;
    const tableH = 4 * rowH + 20;
    const blockH = headerH + tableH + 10;

    this.ensureSpace(blockH);

    const x = this.margin;
    const w = this.pageW - this.margin * 2;
    const topY = this.y;

    this.rectFill(x, topY - blockH + 8, w, blockH - 8, C.white);
    this.rectStroke(x, topY - blockH + 8, w, blockH - 8, C.border, 0.9);

    // Emerald Round Header
    this.rectFill(x, topY - 20, w, 20, C.emerald);
    this.rectFill(x, topY - 21.5, w, 1.5, C.gold);
    this.text(`ROUND ${roundNum} OF ${totalRounds}`, x + 10, topY - 13.5, { font: 'F2', size: 9, color: C.goldLight });
    this.text(`CATEGORY: ${(round.category || 'Christmas').toUpperCase()}`, x + w - 10, topY - 13.5, {
      font: 'F2', size: 8, color: C.white, align: 'right'
    });

    const qBandTop = topY - 21.5;
    const qBandH = qLines.length * 13 + 8;
    this.rectFill(x, qBandTop - qBandH, w, qBandH, C.ivory);
    qLines.forEach((line, i) => {
      this.text(line, x + 10, qBandTop - 13 - i * 13, { font: 'F2', size: 10.5, color: C.burgundy });
    });

    const tblTop = qBandTop - qBandH;
    const colW = w / 2;
    let totalPts = 0;
    const answers = Array.isArray(round.answers) ? round.answers : [];

    for (let r = 0; r < 4; r++) {
      const rowY = tblTop - (r + 1) * rowH;
      if (r % 2 === 1) this.rectFill(x + 0.5, rowY, w - 1, rowH, C.ivoryRow);
      this.line(x, rowY, x + w, rowY, C.border, 0.4);

      const aL = answers[r];
      if (aL) {
        totalPts += Number(aL.points) || 0;
        this.rectFill(x + 8, rowY + 2.5, 16, 11, C.burgundy);
        this.text(String(r + 1), x + 16, rowY + 5, { font: 'F2', size: 8, color: C.goldLight, align: 'center' });
        this.text(String(aL.text || '').slice(0, 34), x + 30, rowY + 4.5, { font: 'F1', size: 9, color: C.ink });
        this.text(String(aL.points), x + colW - 14, rowY + 4.5, { font: 'F2', size: 9.5, color: C.emeraldDark, align: 'right' });
      }
      const aR = answers[r + 4];
      if (aR) {
        totalPts += Number(aR.points) || 0;
        this.rectFill(x + colW + 8, rowY + 2.5, 16, 11, C.burgundy);
        this.text(String(r + 5), x + colW + 16, rowY + 5, { font: 'F2', size: 8, color: C.goldLight, align: 'center' });
        this.text(String(aR.text || '').slice(0, 34), x + colW + 30, rowY + 4.5, { font: 'F1', size: 9, color: C.ink });
        this.text(String(aR.points), x + w - 14, rowY + 4.5, { font: 'F2', size: 9.5, color: C.emeraldDark, align: 'right' });
      }
    }
    this.line(x + colW, tblTop, x + colW, tblTop - 4 * rowH, C.border, 0.5);

    const footY = tblTop - 4 * rowH - 18;
    this.rectFill(x, footY, w, 18, C.burgundyDeep);
    this.text(`TOTAL ROUND POINTS: ${totalPts} / 100`, x + w - 10, footY + 5.5, {
      font: 'F2', size: 8.5, color: C.goldLight, align: 'right'
    });
    this.text(`Round ID: ${round.id || `#${roundNum}`}`, x + 10, footY + 5.5, {
      font: 'F1', size: 7.5, color: C.white
    });

    this.y = topY - blockH - 4;
  }

  addFastMoneyCard(q, qNum, totalQ) {
    const qLines = wrapText(q.question, 78);
    const notesLines = wrapText(`Administrator Notes: ${q.notes || 'Use host discretion for close wording.'}`, 86);
    const acc = Array.isArray(q.acceptedAnswers) ? q.acceptedAnswers : [];
    const rows = Math.ceil(acc.length / 2);
    const rowH = 16;
    const headerH = 20 + qLines.length * 13 + 8;
    const tableH = Math.max(1, rows) * rowH;
    const notesH = notesLines.length * 11 + 10;
    const blockH = headerH + tableH + notesH + 10;

    this.ensureSpace(blockH);

    const x = this.margin;
    const w = this.pageW - this.margin * 2;
    const topY = this.y;

    this.rectFill(x, topY - blockH + 8, w, blockH - 8, C.white);
    this.rectStroke(x, topY - blockH + 8, w, blockH - 8, C.border, 0.9);

    this.rectFill(x, topY - 20, w, 20, C.burgundy);
    this.rectFill(x, topY - 21.5, w, 1.5, C.gold);
    this.text(`FAST MONEY Q${qNum} OF ${totalQ}  (SET ${q.set || 1})`, x + 10, topY - 13.5, {
      font: 'F2', size: 9, color: C.goldLight
    });
    this.text(`CATEGORY: ${(q.category || 'Christmas').toUpperCase()}`, x + w - 10, topY - 13.5, {
      font: 'F2', size: 8, color: C.white, align: 'right'
    });

    const qBandTop = topY - 21.5;
    const qBandH = qLines.length * 13 + 8;
    this.rectFill(x, qBandTop - qBandH, w, qBandH, C.ivory);
    qLines.forEach((line, i) => {
      this.text(line, x + 10, qBandTop - 13 - i * 13, { font: 'F2', size: 10.5, color: C.emeraldDark });
    });

    const tblTop = qBandTop - qBandH;
    const colW = w / 2;
    for (let r = 0; r < rows; r++) {
      const rowY = tblTop - (r + 1) * rowH;
      if (r % 2 === 1) this.rectFill(x + 0.5, rowY, w - 1, rowH, C.ivoryRow);
      this.line(x, rowY, x + w, rowY, C.border, 0.4);

      const aL = acc[r];
      if (aL) {
        this.rectFill(x + 8, rowY + 2.5, 16, 11, C.emerald);
        this.text(String(r + 1), x + 16, rowY + 5, { font: 'F2', size: 8, color: C.white, align: 'center' });
        this.text(String(aL.text || '').slice(0, 34), x + 30, rowY + 4.5, { font: 'F1', size: 9, color: C.ink });
        this.text(`${aL.points} pts`, x + colW - 10, rowY + 4.5, { font: 'F2', size: 9, color: C.burgundy, align: 'right' });
      }
      const aR = acc[r + rows];
      if (aR) {
        this.rectFill(x + colW + 8, rowY + 2.5, 16, 11, C.emerald);
        this.text(String(r + rows + 1), x + colW + 16, rowY + 5, { font: 'F2', size: 8, color: C.white, align: 'center' });
        this.text(String(aR.text || '').slice(0, 34), x + colW + 30, rowY + 4.5, { font: 'F1', size: 9, color: C.ink });
        this.text(`${aR.points} pts`, x + w - 10, rowY + 4.5, { font: 'F2', size: 9, color: C.burgundy, align: 'right' });
      }
    }
    this.line(x + colW, tblTop, x + colW, tblTop - rows * rowH, C.border, 0.5);

    const notesTop = tblTop - rows * rowH;
    this.rectFill(x, notesTop - notesH, w, notesH, '0.96 0.94 0.89');
    this.line(x, notesTop, x + w, notesTop, C.gold, 0.8);
    notesLines.forEach((line, i) => {
      this.text(line, x + 10, notesTop - 12 - i * 11, { font: i === 0 ? 'F2' : 'F1', size: 8.2, color: C.emeraldDark });
    });

    this.y = topY - blockH - 4;
  }

  toBuffer() {
    if (this.curOps.length) {
      this.pages.push({ isCover: false, ops: this.curOps });
      this.curOps = [];
    }
    const totalPages = this.pages.length;

    const renderedStreams = this.pages.map((page, idx) => {
      const pageNum = idx + 1;
      if (page.isCover) {
        return [
          ...page.ops,
          `BT /F2 8.5 Tf ${C.goldLight} rg ${this.pageW / 2 - 28} 38 Td (Page ${pageNum} of ${totalPages}) Tj ET`
        ].join('\n');
      }
      const footerOps = [
        `0.65 w ${C.gold} RG ${this.margin} 36 m ${this.pageW - this.margin} 36 l S`,
        `BT /F1 7.5 Tf ${C.muted} rg ${this.margin} 23 Td (${sanitizePdfText('CHRISTMAS FEUD - THE ULTIMATE CHRISTMAS GAME SHOW  |  Private Administrator Copy')}) Tj ET`,
        `BT /F2 8.5 Tf ${C.burgundy} rg ${this.pageW - this.margin - 60} 23 Td (Page ${pageNum} of ${totalPages}) Tj ET`
      ];
      return [...page.ops, ...footerOps].join('\n');
    });

    const objects = [];
    const addObj = (body) => { objects.push(body); return objects.length; };
    const catalogId = addObj('');
    const pagesId = addObj('');
    const fontRegId = addObj('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>');
    const fontBoldId = addObj('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>');

    const pageObjIds = [];
    for (const streamStr of renderedStreams) {
      const streamBuf = Buffer.from(streamStr, 'latin1');
      const contentId = addObj(`<< /Length ${streamBuf.length} >>\nstream\n${streamStr}\nendstream`);
      const pageId = addObj(
        `<< /Type /Page /Parent ${pagesId} 0 R /MediaBox [0 0 ${this.pageW} ${this.pageH}] /Resources << /Font << /F1 ${fontRegId} 0 R /F2 ${fontBoldId} 0 R >> >> /Contents ${contentId} 0 R >>`
      );
      pageObjIds.push(pageId);
    }

    objects[catalogId - 1] = `<< /Type /Catalog /Pages ${pagesId} 0 R >>`;
    objects[pagesId - 1] = `<< /Type /Pages /Kids [${pageObjIds.map((id) => `${id} 0 R`).join(' ')}] /Count ${pageObjIds.length} >>`;

    const chunks = [Buffer.from('%PDF-1.4\n%\xE2\xE3\xCF\xD3\n', 'binary')];
    const offsets = [0];
    let byteOffset = chunks[0].length;

    objects.forEach((objBody, i) => {
      offsets.push(byteOffset);
      const entry = Buffer.from(`${i + 1} 0 obj\n${objBody}\nendobj\n`, 'latin1');
      chunks.push(entry);
      byteOffset += entry.length;
    });

    const xrefStart = byteOffset;
    let xref = `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
    for (let i = 1; i <= objects.length; i++) {
      xref += `${String(offsets[i]).padStart(10, '0')} 00000 n \n`;
    }
    const trailer = `trailer\n<< /Size ${objects.length + 1} /Root ${catalogId} 0 R >>\nstartxref\n${xrefStart}\n%%EOF\n`;
    chunks.push(Buffer.from(xref + trailer, 'latin1'));
    return Buffer.concat(chunks);
  }
}

function summarizeCategories(items) {
  const map = new Map();
  items.forEach((it) => {
    const c = it.category || 'Christmas';
    map.set(c, (map.get(c) || 0) + 1);
  });
  return Array.from(map.entries()).map(([k, v]) => `${k} (${v})`);
}

function generateStandardAnswerKeyPdf(room, edition) {
  const meta = EDITION_META[edition] || EDITION_META.classic;
  const rounds = (room.editionBanks && room.editionBanks[edition]) || [];
  const doc = new ChristmasPdfDoc({
    title: meta.pdfTitle,
    editionLabel: `${meta.shortName.toUpperCase()}  |  ${rounds.length} SURVEY ROUNDS`,
    countLabel: `${rounds.length} Complete Survey Rounds (8 Ranked Answers, 100 Points Each)`,
    roomId: room.roomId,
    generatedDate: new Date().toISOString().slice(0, 10),
    categoriesSummary: summarizeCategories(rounds)
  });
  doc.addCoverPage();
  doc.newContentPage();
  rounds.forEach((round, idx) => doc.addStandardRoundCard(round, idx + 1, rounds.length));
  return {
    filename: meta.pdfFilename,
    buffer: doc.toBuffer()
  };
}

function generateFastMoneyAnswerKeyPdf(room) {
  const bank = room.fastMoneyBank || [];
  const doc = new ChristmasPdfDoc({
    title: 'CHRISTMAS FEUD FAST MONEY ANSWER KEY',
    editionLabel: `PRIVATE HOST SCORING EDITION  |  ${bank.length} QUESTIONS`,
    countLabel: `${bank.length} Private Fast Money Questions with Sample Answers, Points & Admin Notes`,
    roomId: room.roomId,
    generatedDate: new Date().toISOString().slice(0, 10),
    categoriesSummary: summarizeCategories(bank)
  });
  doc.addCoverPage();
  doc.newContentPage();
  bank.forEach((q, idx) => doc.addFastMoneyCard(q, idx + 1, bank.length));
  return {
    filename: 'CHRISTMAS FEUD FAST MONEY ANSWER KEY.pdf',
    buffer: doc.toBuffer()
  };
}

module.exports = {
  generateStandardAnswerKeyPdf,
  generateFastMoneyAnswerKeyPdf
};
