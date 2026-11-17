import jsPDF from 'jspdf';
import { getRateCardSvgMarkup } from '../components/RateCardSvgGraphics';
import type {
  RateCardData,
  RatePackageItem,
  RateTermItem,
  SocialHandles,
} from '../types/rateCard.types';

const SLIDE_W = 297;
const SLIDE_H = 167;
const FOOTER_SAFE_BOTTOM_Y = 151;

const COLORS = {
  paper: [248, 248, 246] as const,
  paperAlt: [239, 239, 234] as const,
  ink: [35, 34, 32] as const,
  pink: [232, 44, 138] as const,
  muted: [95, 92, 88] as const,
  borderSoft: [224, 222, 216] as const,
  white: [255, 255, 255] as const,
};

interface MeasuredAsset {
  dataUrl: string;
  aspect: number;
}

interface PlatformInsightSlideOptions {
  platformTitle: string;
  titleOffsetX: number;
  scriptInsight: MeasuredAsset | null;
  handleText: string;
  accountLabel: string;
  accountImg: MeasuredAsset | null;
  insightLabel: string;
  insightImg: MeasuredAsset | null;
  social: SocialHandles;
  tintedBg?: boolean;
}

interface RateCardPackageSlideOptions {
  leftTitle: string;
  leftItems: RatePackageItem[];
  leftBadgeColor: readonly [number, number, number];
  rightTitle: string;
  rightItems: RatePackageItem[];
  rightBadgeColor: readonly [number, number, number];
  polaroid: MeasuredAsset | null;
  polaroidX: number;
  scriptCardSmall: MeasuredAsset | null;
  social: SocialHandles;
}

const loadImageElement = (src: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(err);
    img.src = src;
  });

const loadCutoutPng = async (src: string): Promise<MeasuredAsset | null> => {
  if (!src) return null;
  try {
    const img = await loadImageElement(src);
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    ctx.drawImage(img, 0, 0);
    return {
      dataUrl: canvas.toDataURL('image/png'),
      aspect: img.width / Math.max(img.height, 1),
    };
  } catch {
    return null;
  }
};

const createPolaroidPng = async (
  src: string,
  angleDeg: number,
  frameW = 340,
  frameH = 400,
): Promise<MeasuredAsset | null> => {
  if (!src) return null;
  try {
    const img = await loadImageElement(src);
    const pad = 64;
    const canvas = document.createElement('canvas');
    canvas.width = frameW + pad * 2;
    canvas.height = frameH + pad * 2;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((angleDeg * Math.PI) / 180);

    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.22)';
    ctx.shadowBlur = 18;
    ctx.shadowOffsetX = 4;
    ctx.shadowOffsetY = 8;
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(-frameW / 2, -frameH / 2, frameW, frameH);
    ctx.restore();

    ctx.strokeStyle = 'rgba(0, 0, 0, 0.08)';
    ctx.lineWidth = 2;
    ctx.strokeRect(-frameW / 2, -frameH / 2, frameW, frameH);

    const border = 20;
    const bottomExtra = 44;
    const photoX = -frameW / 2 + border;
    const photoY = -frameH / 2 + border;
    const photoW = frameW - border * 2;
    const photoH = frameH - border - bottomExtra;

    const targetRatio = photoW / photoH;
    const imgRatio = img.width / img.height;
    let sourceX = 0;
    let sourceY = 0;
    let sourceW = img.width;
    let sourceH = img.height;
    if (imgRatio > targetRatio) {
      sourceW = img.height * targetRatio;
      sourceX = (img.width - sourceW) / 2;
    } else {
      sourceH = img.width / targetRatio;
      sourceY = (img.height - sourceH) / 2;
    }

    ctx.drawImage(img, sourceX, sourceY, sourceW, sourceH, photoX, photoY, photoW, photoH);

    return {
      dataUrl: canvas.toDataURL('image/png'),
      aspect: canvas.width / canvas.height,
    };
  } catch {
    return null;
  }
};

const renderScriptTextPng = async (
  lines: string[],
  fontSizePx: number,
  color = '#E82C8A',
  align: 'left' | 'center' = 'left',
): Promise<MeasuredAsset | null> => {
  try {
    if (document?.fonts?.ready) {
      await document.fonts.ready;
    }
    const font = `700 ${fontSizePx}px "Caveat", cursive`;
    const measureCanvas = document.createElement('canvas');
    const measureCtx = measureCanvas.getContext('2d');
    if (!measureCtx) return null;
    measureCtx.font = font;

    const lineHeight = fontSizePx * 0.92;
    const maxW = Math.max(...lines.map((line) => measureCtx.measureText(line).width), 40);
    const padX = fontSizePx * 0.35;
    const padY = fontSizePx * 0.35;

    const canvas = document.createElement('canvas');
    canvas.width = Math.ceil(maxW + padX * 2);
    canvas.height = Math.ceil(lines.length * lineHeight + padY * 2);

    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    ctx.font = font;
    ctx.fillStyle = color;
    ctx.textBaseline = 'top';
    ctx.textAlign = align;

    const textX = align === 'center' ? canvas.width / 2 : padX;
    lines.forEach((line, idx) => {
      ctx.fillText(line, textX, padY + idx * lineHeight);
    });

    return {
      dataUrl: canvas.toDataURL('image/png'),
      aspect: canvas.width / Math.max(canvas.height, 1),
    };
  } catch {
    return null;
  }
};

const svgToPng = async (svg: string, width: number, height: number): Promise<string | null> => {
  const dataUri = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  try {
    const img = await loadImageElement(dataUri);
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    ctx.drawImage(img, 0, 0, width, height);
    return canvas.toDataURL('image/png');
  } catch {
    return null;
  }
};

const drawPaperBackdrop = (doc: jsPDF): void => {
  doc.setFillColor(...COLORS.paper);
  doc.rect(0, 0, SLIDE_W, SLIDE_H, 'F');

  doc.setFillColor(...COLORS.paperAlt);
  doc.ellipse(260, 148, 56, 36, 'F');
  doc.ellipse(24, 150, 44, 28, 'F');
};

const drawSocialFooter = (doc: jsPDF, social: SocialHandles): void => {
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(...COLORS.ink);
  if (social.instagramHandle.trim()) {
    doc.text(`INSTAGRAM | ${social.instagramHandle.trim().toUpperCase()}`, 14, 159);
  }
  if (social.tiktokHandle.trim()) {
    doc.text(`TIKTOK | ${social.tiktokHandle.trim().toUpperCase()}`, 283, 159, { align: 'right' });
  }
};

const measureRateCardHeight = (
  doc: jsPDF,
  items: RatePackageItem[],
  boxW: number,
  minH: number,
  maxH: number,
): number => {
  const padX = 8;
  const priceColReserve = 42;
  const textColW = boxW - padX * 2 - priceColReserve;
  let totalH = 22;

  items.forEach((item, idx) => {
    if (!item.name.trim() && !item.price.trim()) return;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11.5);
    const nameLines = doc.splitTextToSize(item.name.trim() || '-', textColW) as string[];
    totalH += nameLines.length * 4.8;

    if (item.description?.trim()) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.8);
      const descLines = doc.splitTextToSize(item.description.trim(), textColW) as string[];
      totalH += descLines.length * 3.8 + 1;
    }

    if (idx < items.length - 1) {
      totalH += 8;
    }
  });

  return Math.min(Math.max(totalH + 8, minH), maxH);
};

const drawSpaciousRateCard = (
  doc: jsPDF,
  title: string,
  items: RatePackageItem[],
  boxX: number,
  boxY: number,
  boxW: number,
  minH: number,
  maxH: number,
  badgeColor: readonly [number, number, number],
): number => {
  const boxH = measureRateCardHeight(doc, items, boxW, minH, maxH);

  doc.setFillColor(...COLORS.white);
  doc.setDrawColor(...COLORS.ink);
  doc.setLineWidth(0.4);
  doc.roundedRect(boxX, boxY, boxW, boxH, 3, 3, 'FD');

  const padX = 8;
  let cursorY = boxY + 7;

  const label = (title || 'CATEGORY').toUpperCase();
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  const pillW = Math.max(doc.getTextWidth(label) + 16, 40);
  doc.setFillColor(...badgeColor);
  doc.roundedRect(boxX + padX, cursorY, pillW, 8, 2, 2, 'F');
  doc.setTextColor(...COLORS.white);
  doc.text(label, boxX + padX + pillW / 2, cursorY + 5.5, { align: 'center' });

  cursorY += 15;

  const priceColReserve = 42;
  const textColW = boxW - padX * 2 - priceColReserve;
  const priceRightX = boxX + boxW - padX;

  items.forEach((item, idx) => {
    if (!item.name.trim() && !item.price.trim()) return;
    if (cursorY > boxY + boxH - 6) return;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11.5);
    doc.setTextColor(...COLORS.ink);
    const nameLines = doc.splitTextToSize(item.name.trim() || '-', textColW) as string[];
    doc.text(nameLines, boxX + padX, cursorY);

    if (item.price.trim()) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.setTextColor(...COLORS.pink);
      doc.text(item.price.trim(), priceRightX, cursorY, { align: 'right' });
    }

    cursorY += nameLines.length * 4.8;

    if (item.description?.trim()) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.8);
      doc.setTextColor(...COLORS.muted);
      const descLines = doc.splitTextToSize(item.description.trim(), textColW) as string[];
      doc.text(descLines, boxX + padX, cursorY + 0.5);
      cursorY += descLines.length * 3.8 + 1;
    }

    if (idx < items.length - 1 && cursorY + 8 < boxY + boxH - 4) {
      cursorY += 2.5;
      doc.setDrawColor(...COLORS.borderSoft);
      doc.setLineWidth(0.25);
      doc.line(boxX + padX, cursorY, boxX + boxW - padX, cursorY);
      cursorY += 5.5;
    }
  });

  return boxY + boxH;
};

const drawPlatformInsightSlide = (doc: jsPDF, options: PlatformInsightSlideOptions): void => {
  doc.addPage();
  drawPaperBackdrop(doc);

  if (options.tintedBg) {
    doc.setFillColor(...COLORS.paperAlt);
    doc.rect(0, 26, SLIDE_W, 128, 'F');
  }

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(24);
  doc.setTextColor(...COLORS.ink);
  doc.text(options.platformTitle, 14, 20);

  if (options.scriptInsight) {
    const insightTitleH = 21;
    const insightTitleW = insightTitleH * options.scriptInsight.aspect;
    doc.addImage(
      options.scriptInsight.dataUrl,
      'PNG',
      options.titleOffsetX,
      5,
      insightTitleW,
      insightTitleH,
    );
  }

  if (options.handleText.trim()) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(...COLORS.muted);
    doc.text(options.handleText.trim().toUpperCase(), 283, 19, { align: 'right' });
  }

  const columns: Array<{
    label: string;
    img: MeasuredAsset | null;
    x: number;
    w: number;
    badgeColor: readonly [number, number, number];
  }> = [
    {
      label: options.accountLabel,
      img: options.accountImg,
      x: 14,
      w: 156,
      badgeColor: COLORS.ink,
    },
    {
      label: options.insightLabel,
      img: options.insightImg,
      x: 178,
      w: 105,
      badgeColor: COLORS.pink,
    },
  ];

  const cardY = 38;
  const cardH = 112;

  for (const col of columns) {
    doc.setFillColor(...col.badgeColor);
    const pillW = Math.min(col.w - 16, 72);
    doc.roundedRect(col.x + (col.w - pillW) / 2, 28, pillW, 7.5, 3.75, 3.75, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(...COLORS.white);
    doc.text(col.label, col.x + col.w / 2, 33.1, { align: 'center' });

    if (col.img) {
      const innerPad = 2.5;
      const maxW = col.w - innerPad * 2;
      const maxH = cardH - innerPad * 2;
      let drawW = maxW;
      let drawH = drawW / col.img.aspect;
      if (drawH > maxH) {
        drawH = maxH;
        drawW = drawH * col.img.aspect;
      }
      const frameW = drawW + innerPad * 2;
      const frameH = drawH + innerPad * 2;
      const frameX = col.x + (col.w - frameW) / 2;
      const frameY = cardY + (cardH - frameH) / 2;

      doc.setFillColor(...COLORS.white);
      doc.setDrawColor(...COLORS.ink);
      doc.setLineWidth(0.35);
      doc.roundedRect(frameX, frameY, frameW, frameH, 3, 3, 'FD');

      doc.addImage(col.img.dataUrl, 'PNG', frameX + innerPad, frameY + innerPad, drawW, drawH);
    } else {
      doc.setFillColor(...COLORS.white);
      doc.setDrawColor(...COLORS.ink);
      doc.setLineWidth(0.35);
      doc.roundedRect(col.x, cardY, col.w, cardH, 3, 3, 'FD');

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(...COLORS.muted);
      doc.text('Belum diupload', col.x + col.w / 2, cardY + cardH / 2, { align: 'center' });
    }
  }

  drawSocialFooter(doc, options.social);
};

const drawRateCardPackageSlide = (doc: jsPDF, options: RateCardPackageSlideOptions): void => {
  doc.addPage();
  drawPaperBackdrop(doc);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(26);
  doc.setTextColor(...COLORS.ink);
  doc.text('RATE', 14, 22);

  if (options.scriptCardSmall) {
    const cardTitleH = 22;
    const cardTitleW = cardTitleH * options.scriptCardSmall.aspect;
    doc.addImage(options.scriptCardSmall.dataUrl, 'PNG', 43, 7, cardTitleW, cardTitleH);
  }

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(...COLORS.muted);
  doc.text(
    `${options.leftTitle.trim() || 'LEFT'} & ${options.rightTitle.trim() || 'RIGHT'}`.toUpperCase(),
    283,
    20,
    { align: 'right' },
  );

  drawSpaciousRateCard(
    doc,
    options.leftTitle,
    options.leftItems,
    14,
    28,
    144,
    108,
    122,
    options.leftBadgeColor,
  );

  const rightBoxBottomY = drawSpaciousRateCard(
    doc,
    options.rightTitle,
    options.rightItems,
    166,
    28,
    117,
    60,
    122,
    options.rightBadgeColor,
  );

  const availablePolaroidSpace = FOOTER_SAFE_BOTTOM_Y - rightBoxBottomY - 4;
  if (options.polaroid && availablePolaroidSpace >= 30) {
    const polaroidH = Math.min(44, availablePolaroidSpace);
    const polaroidW = polaroidH * options.polaroid.aspect;
    doc.addImage(
      options.polaroid.dataUrl,
      'PNG',
      options.polaroidX,
      rightBoxBottomY + 3,
      polaroidW,
      polaroidH,
    );
  }

  drawSocialFooter(doc, options.social);
};

const drawTermColumn = (
  doc: jsPDF,
  badgeText: string,
  terms: RateTermItem[],
  startX: number,
  startY: number,
  colW: number,
  badgeColor: readonly [number, number, number],
): void => {
  doc.setFillColor(...badgeColor);
  doc.roundedRect(startX, startY, 38, 7, 1.5, 1.5, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(...COLORS.white);
  doc.text(badgeText, startX + 19, startY + 4.8, { align: 'center' });

  let cursorY = startY + 13;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.4);
  doc.setTextColor(...COLORS.ink);

  for (const term of terms) {
    const clean = term.text.trim();
    if (!clean || cursorY > 149) continue;
    const lines = doc.splitTextToSize(clean, colW - 6) as string[];
    doc.setFillColor(...badgeColor);
    doc.circle(startX + 1.4, cursorY - 0.9, 0.65, 'F');
    doc.text(lines, startX + 4.5, cursorY);
    cursorY += lines.length * 3.1 + 1.4;
  }
};

export const generateRateCardPdf = async (data: RateCardData): Promise<void> => {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: [SLIDE_W, SLIDE_H],
  });

  const social: SocialHandles = {
    instagramHandle: data.instagramHandle,
    tiktokHandle: data.tiktokHandle,
  };

  const svgMarkup = getRateCardSvgMarkup();
  const nameLines = (data.name.trim() || 'Nama Kreator').split(/\s+/);
  const groupedNameLines =
    nameLines.length > 2 ? [nameLines[0], nameLines.slice(1).join(' ')] : nameLines;

  const [
    cutout1,
    cutout2,
    cutout7,
    polaroid1,
    polaroid2,
    polaroid3,
    polaroid4,
    igAccountImg,
    igInsightImg,
    ttAccountImg,
    ttInsightImg,
    lanyardTopPng,
    lanyardClipPng,
    cardsPng,
    scriptCard,
    scriptCardSmall,
    scriptName,
    scriptHiThere,
    scriptInsight,
    scriptCondition,
    scriptPayment,
  ] = await Promise.all([
    loadCutoutPng(data.cutoutSlide1Url),
    loadCutoutPng(data.cutoutSlide2Url),
    loadCutoutPng(data.cutoutSlide7Url),
    createPolaroidPng(data.polaroid1Url, -6),
    createPolaroidPng(data.polaroid2Url, 6),
    createPolaroidPng(data.polaroid3Url, -5),
    createPolaroidPng(data.polaroid4Url, 4),
    loadCutoutPng(data.igAccountImageUrl),
    loadCutoutPng(data.igInsightImageUrl),
    loadCutoutPng(data.tiktokAccountImageUrl),
    loadCutoutPng(data.tiktokInsightImageUrl),
    svgToPng(svgMarkup.lanyardTopRight, 160, 260),
    svgToPng(svgMarkup.lanyardClip, 220, 300),
    svgToPng(svgMarkup.dualCards, 360, 288),
    renderScriptTextPng(['Card'], 165, '#E82C8A', 'center'),
    renderScriptTextPng(['Card'], 105, '#E82C8A', 'left'),
    renderScriptTextPng(groupedNameLines, 82, '#E82C8A', 'left'),
    renderScriptTextPng(['Hi there!'], 115, '#E82C8A', 'left'),
    renderScriptTextPng(['Insight'], 105, '#E82C8A', 'left'),
    renderScriptTextPng(['Condition'], 105, '#E82C8A', 'left'),
    renderScriptTextPng(['Payment'], 105, '#E82C8A', 'left'),
  ]);

  // ==========================================
  // SLIDE 1: COVER RATE CARD
  // ==========================================
  drawPaperBackdrop(doc);

  if (cutout1) {
    const cutoutHeight = 154;
    const cutoutWidth = Math.min(cutoutHeight * cutout1.aspect, 96);
    const drawHeight = cutoutWidth / cutout1.aspect;
    doc.addImage(cutout1.dataUrl, 'PNG', 12, SLIDE_H - drawHeight, cutoutWidth, drawHeight);
  }

  if (polaroid1) {
    const polaroidWidth = 56;
    const polaroidHeight = polaroidWidth / polaroid1.aspect;
    doc.addImage(polaroid1.dataUrl, 'PNG', 3, 72, polaroidWidth, polaroidHeight);
  }

  if (scriptName) {
    const nameHeight = groupedNameLines.length > 1 ? 26 : 16;
    const nameWidth = nameHeight * scriptName.aspect;
    doc.addImage(scriptName.dataUrl, 'PNG', 55, 88, Math.min(nameWidth, 62), nameHeight);
  }

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(54);
  doc.setTextColor(...COLORS.ink);
  doc.text('RATE', 176, 56, { align: 'center' });

  if (scriptCard) {
    const scriptHeight = 38;
    const scriptWidth = scriptHeight * scriptCard.aspect;
    doc.addImage(scriptCard.dataUrl, 'PNG', 186 - scriptWidth / 2, 48, scriptWidth, scriptHeight);
  }

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(...COLORS.ink);
  const tagLines = doc.splitTextToSize(
    (data.tagline.trim() || 'CONTENT CREATOR').toUpperCase(),
    102,
  ) as string[];
  doc.text(tagLines, 174, 96, { align: 'center' });

  if (lanyardTopPng) {
    doc.addImage(lanyardTopPng, 'PNG', 266, 0, 28, 46);
  }
  if (polaroid2) {
    const polaroidWidth = 56;
    const polaroidHeight = polaroidWidth / polaroid2.aspect;
    doc.addImage(polaroid2.dataUrl, 'PNG', 234, 80, polaroidWidth, polaroidHeight);
  }

  drawSocialFooter(doc, social);

  // ==========================================
  // SLIDE 2: ABOUT ME + LANYARD + CUTOUT
  // ==========================================
  doc.addPage();
  drawPaperBackdrop(doc);

  if (scriptHiThere) {
    const headingHeight = 24;
    const headingWidth = headingHeight * scriptHiThere.aspect;
    doc.addImage(scriptHiThere.dataUrl, 'PNG', 16, 16, headingWidth, headingHeight);
  }

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(42);
  doc.setTextColor(...COLORS.ink);
  doc.text("I'M", 18, 52);
  const shortUpper = (data.shortName.trim() || data.name.trim() || 'CREATOR').toUpperCase();
  let shortSize = 42;
  doc.setFontSize(shortSize);
  while (doc.getTextWidth(shortUpper) > 106 && shortSize > 22) {
    shortSize -= 2;
    doc.setFontSize(shortSize);
  }
  doc.text(shortUpper, 18, 69);

  if (data.bio.trim()) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(...COLORS.ink);
    const bioLines = doc.splitTextToSize(data.bio.trim().replace(/\n+/g, ' '), 104) as string[];
    doc.text(bioLines, 18, 86);
  }

  if (cutout2) {
    const cutoutHeight = 148;
    const cutoutWidth = Math.min(cutoutHeight * cutout2.aspect, 90);
    const drawHeight = cutoutWidth / cutout2.aspect;
    doc.addImage(cutout2.dataUrl, 'PNG', 202, SLIDE_H - drawHeight, cutoutWidth, drawHeight);
  }

  if (polaroid3) {
    const polaroidWidth = 62;
    const polaroidHeight = polaroidWidth / polaroid3.aspect;
    doc.addImage(polaroid3.dataUrl, 'PNG', 132, 62, polaroidWidth, polaroidHeight);
  }
  if (lanyardClipPng) {
    doc.addImage(lanyardClipPng, 'PNG', 120, 0, 48, 66);
  }

  drawSocialFooter(doc, social);

  // ==========================================
  // SLIDE 3: INSTAGRAM INSIGHT
  // ==========================================
  drawPlatformInsightSlide(doc, {
    platformTitle: 'INSTAGRAM',
    titleOffsetX: 68,
    scriptInsight,
    handleText: data.instagramHandle,
    accountLabel: 'AKUN INSTAGRAM',
    accountImg: igAccountImg,
    insightLabel: 'INSIGHT INSTAGRAM',
    insightImg: igInsightImg,
    social,
    tintedBg: false,
  });

  // ==========================================
  // SLIDE 4: TIKTOK INSIGHT
  // ==========================================
  drawPlatformInsightSlide(doc, {
    platformTitle: 'TIKTOK',
    titleOffsetX: 52,
    scriptInsight,
    handleText: data.tiktokHandle,
    accountLabel: 'AKUN TIKTOK',
    accountImg: ttAccountImg,
    insightLabel: 'INSIGHT TIKTOK',
    insightImg: ttInsightImg,
    social,
    tintedBg: true,
  });

  // ==========================================
  // SLIDE 5: RATE CARD — VISIT & COLLABORATION
  // ==========================================
  drawRateCardPackageSlide(doc, {
    leftTitle: data.visitTitle,
    leftItems: data.visitPackages,
    leftBadgeColor: COLORS.ink,
    rightTitle: data.collaborationTitle,
    rightItems: data.collaborationPackages,
    rightBadgeColor: COLORS.pink,
    polaroid: polaroid4,
    polaroidX: 238,
    scriptCardSmall,
    social,
  });

  // ==========================================
  // SLIDE 6: RATE CARD — ENDORSEMENT & ADDITIONAL
  // ==========================================
  drawRateCardPackageSlide(doc, {
    leftTitle: data.endorsementTitle,
    leftItems: data.endorsementPackages,
    leftBadgeColor: COLORS.pink,
    rightTitle: data.additionalTitle,
    rightItems: data.additionalPackages,
    rightBadgeColor: COLORS.ink,
    polaroid: polaroid2,
    polaroidX: 238,
    scriptCardSmall,
    social,
  });

  // ==========================================
  // SLIDE 7: TERM & CONDITION + CUTOUT
  // ==========================================
  doc.addPage();
  drawPaperBackdrop(doc);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(26);
  doc.setTextColor(...COLORS.ink);
  doc.text('TERM &', 16, 23);

  if (scriptCondition) {
    const titleH = 22;
    const titleW = titleH * scriptCondition.aspect;
    doc.addImage(scriptCondition.dataUrl, 'PNG', 55, 8, titleW, titleH);
  }

  drawTermColumn(doc, 'ENDORSEMENT', data.endorsementTerms, 16, 33, 98, COLORS.ink);
  drawTermColumn(doc, 'VISIT', data.visitTerms, 120, 33, 98, COLORS.pink);

  if (cutout7) {
    const cutoutHeight = 140;
    const cutoutWidth = Math.min(cutoutHeight * cutout7.aspect, 66);
    const drawHeight = cutoutWidth / cutout7.aspect;
    doc.addImage(cutout7.dataUrl, 'PNG', 226, SLIDE_H - drawHeight, cutoutWidth, drawHeight);
  }

  drawSocialFooter(doc, social);

  // ==========================================
  // SLIDE 8: TERM OF PAYMENT & CONTACT
  // ==========================================
  doc.addPage();
  drawPaperBackdrop(doc);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(26);
  doc.setTextColor(...COLORS.ink);
  doc.text('TERM OF', 16, 23);

  if (scriptPayment) {
    const titleH = 22;
    const titleW = titleH * scriptPayment.aspect;
    doc.addImage(scriptPayment.dataUrl, 'PNG', 58, 8, titleW, titleH);
  }

  doc.setFillColor(...COLORS.white);
  doc.setDrawColor(...COLORS.ink);
  doc.setLineWidth(0.4);
  doc.roundedRect(16, 36, 108, 106, 3, 3, 'FD');

  doc.setFillColor(...COLORS.ink);
  doc.roundedRect(24, 44, 44, 7, 1.5, 1.5, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(...COLORS.white);
  doc.text('CONTACT & BOOKING', 46, 48.8, { align: 'center' });

  const contactRows: Array<[string, string]> = [
    ['WHATSAPP', data.phone.trim() || '-'],
    ['E-MAIL', data.email.trim() || '-'],
    ['INSTAGRAM', data.instagramHandle.trim() || '-'],
    ['TIKTOK', data.tiktokHandle.trim() || '-'],
    ['LOKASI', data.location.trim() || '-'],
  ];
  let contactCursorY = 64;
  for (const [label, val] of contactRows) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(...COLORS.pink);
    doc.text(label, 24, contactCursorY);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(...COLORS.ink);
    doc.text(val, 24, contactCursorY + 5);
    contactCursorY += 15;
  }

  doc.setFillColor(...COLORS.pink);
  doc.roundedRect(138, 39, 142, 62, 3, 3, 'F');

  doc.setFillColor(...COLORS.white);
  doc.setDrawColor(...COLORS.ink);
  doc.setLineWidth(0.45);
  doc.roundedRect(135, 36, 142, 62, 3, 3, 'FD');

  if (cardsPng) {
    doc.addImage(cardsPng, 'PNG', 191, 40, 30, 24);
  }

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(19);
  doc.setTextColor(...COLORS.ink);
  doc.text(
    `${data.bankName.trim() || 'BCA'} ${data.accountNumber.trim() || '-'}`.toUpperCase(),
    206,
    76,
    { align: 'center' },
  );
  doc.setFontSize(14);
  doc.setTextColor(...COLORS.pink);
  doc.text((data.accountHolder.trim() || '-').toUpperCase(), 206, 87, { align: 'center' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  const paymentBlocks = data.paymentTerms
    .map((term) => term.text.trim())
    .filter(Boolean)
    .map((text) => doc.splitTextToSize(text.toUpperCase(), 126) as string[]);

  const payBoxY = 107;
  const maxPayBoxH = FOOTER_SAFE_BOTTOM_Y - payBoxY;
  const measuredPayContentH = paymentBlocks.reduce((sum, lines) => sum + lines.length * 4 + 2.5, 0);
  const payBoxH = Math.min(Math.max(measuredPayContentH + 14, 28), maxPayBoxH);

  doc.setFillColor(...COLORS.paperAlt);
  doc.setDrawColor(...COLORS.ink);
  doc.setLineWidth(0.35);
  doc.roundedRect(135, payBoxY, 142, payBoxH, 3, 3, 'FD');

  let paymentCursorY = payBoxY + 9;
  doc.setTextColor(...COLORS.ink);
  for (const lines of paymentBlocks) {
    const blockH = lines.length * 4 + 2.5;
    if (paymentCursorY + blockH > payBoxY + payBoxH - 3) break;
    doc.setFillColor(...COLORS.pink);
    doc.circle(142, paymentCursorY - 1, 1, 'F');
    doc.text(lines, 146, paymentCursorY);
    paymentCursorY += blockH;
  }

  drawSocialFooter(doc, social);

  const safeName = (data.name.trim() || 'Rate_Card').replace(/[^a-zA-Z0-9_-]+/g, '_');
  doc.save(`${safeName}_Rate_Card.pdf`);
};
