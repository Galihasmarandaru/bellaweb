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
const TARGET_MAX_PDF_BYTES = 1.2 * 1024 * 1024;
const IMAGE_COMPRESSION = 'MEDIUM' as const;

const COLORS = {
  paper: [248, 248, 246] as const,
  paperAlt: [239, 239, 234] as const,
  ink: [35, 34, 32] as const,
  pink: [232, 44, 138] as const,
  muted: [95, 92, 88] as const,
  borderSoft: [224, 222, 216] as const,
  white: [255, 255, 255] as const,
};

type PdfImageFormat = 'PNG' | 'JPEG';

interface MeasuredAsset {
  dataUrl: string;
  aspect: number;
  format: PdfImageFormat;
  alias: string;
}

interface PdfCompressionPreset {
  cutoutMaxDim: number;
  polaroidFrameW: number;
  polaroidFrameH: number;
  polaroidPad: number;
  screenshotMaxDim: number;
  screenshotQuality: number;
}

const PDF_COMPRESSION_PRESETS: readonly PdfCompressionPreset[] = [
  {
    cutoutMaxDim: 760,
    polaroidFrameW: 220,
    polaroidFrameH: 259,
    polaroidPad: 32,
    screenshotMaxDim: 1100,
    screenshotQuality: 0.82,
  },
  {
    cutoutMaxDim: 620,
    polaroidFrameW: 185,
    polaroidFrameH: 218,
    polaroidPad: 26,
    screenshotMaxDim: 920,
    screenshotQuality: 0.72,
  },
  {
    cutoutMaxDim: 500,
    polaroidFrameW: 156,
    polaroidFrameH: 184,
    polaroidPad: 22,
    screenshotMaxDim: 780,
    screenshotQuality: 0.62,
  },
  {
    cutoutMaxDim: 400,
    polaroidFrameW: 132,
    polaroidFrameH: 155,
    polaroidPad: 18,
    screenshotMaxDim: 660,
    screenshotQuality: 0.54,
  },
];

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

interface PreparedPdfAssets {
  cutout1: MeasuredAsset | null;
  cutout2: MeasuredAsset | null;
  cutout7: MeasuredAsset | null;
  polaroid1: MeasuredAsset | null;
  polaroid2: MeasuredAsset | null;
  coverPhoto3: MeasuredAsset | null;
  coverPhoto4: MeasuredAsset | null;
  polaroid3: MeasuredAsset | null;
  polaroid4: MeasuredAsset | null;
  igAccountImg: MeasuredAsset | null;
  igInsightImg: MeasuredAsset | null;
  ttAccountImg: MeasuredAsset | null;
  ttInsightImg: MeasuredAsset | null;
  lanyardTopPng: MeasuredAsset | null;
  lanyardClipPng: MeasuredAsset | null;
  cardsPng: MeasuredAsset | null;
  scriptCard: MeasuredAsset | null;
  scriptCardSmall: MeasuredAsset | null;
  scriptHiThere: MeasuredAsset | null;
  scriptInsight: MeasuredAsset | null;
  scriptCondition: MeasuredAsset | null;
  scriptPayment: MeasuredAsset | null;
}

const addMeasuredImage = (
  doc: jsPDF,
  asset: MeasuredAsset,
  x: number,
  y: number,
  w: number,
  h: number,
): void => {
  doc.addImage(asset.dataUrl, asset.format, x, y, w, h, asset.alias, IMAGE_COMPRESSION);
};

const loadImageElement = (src: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(err);
    img.src = src;
  });

const tryLoadImage = async (src: string): Promise<HTMLImageElement | null> => {
  if (!src) return null;
  try {
    return await loadImageElement(src);
  } catch {
    return null;
  }
};

const encodeCutoutPng = (
  img: HTMLImageElement | null,
  alias: string,
  maxDim: number,
): MeasuredAsset | null => {
  if (!img) return null;
  const maxSourceDim = Math.max(img.width, img.height, 1);
  const scale = Math.min(1, maxDim / maxSourceDim);
  const width = Math.max(1, Math.round(img.width * scale));
  const height = Math.max(1, Math.round(img.height * scale));

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(img, 0, 0, width, height);

  return {
    dataUrl: canvas.toDataURL('image/png'),
    aspect: img.width / Math.max(img.height, 1),
    format: 'PNG',
    alias,
  };
};

const encodeScreenshotJpeg = (
  img: HTMLImageElement | null,
  alias: string,
  maxDim: number,
  quality: number,
): MeasuredAsset | null => {
  if (!img) return null;
  const maxSourceDim = Math.max(img.width, img.height, 1);
  const scale = Math.min(1, maxDim / maxSourceDim);
  const width = Math.max(1, Math.round(img.width * scale));
  const height = Math.max(1, Math.round(img.height * scale));

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, width, height);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(img, 0, 0, width, height);

  return {
    dataUrl: canvas.toDataURL('image/jpeg', quality),
    aspect: img.width / Math.max(img.height, 1),
    format: 'JPEG',
    alias,
  };
};

const createPolaroidPng = (
  img: HTMLImageElement | null,
  alias: string,
  angleDeg: number,
  frameW: number,
  frameH: number,
  pad: number,
): MeasuredAsset | null => {
  if (!img) return null;

  const scale = frameW / 340;
  const canvas = document.createElement('canvas');
  canvas.width = frameW + pad * 2;
  canvas.height = frameH + pad * 2;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.rotate((angleDeg * Math.PI) / 180);

  ctx.save();
  ctx.shadowColor = 'rgba(0, 0, 0, 0.22)';
  ctx.shadowBlur = 18 * scale;
  ctx.shadowOffsetX = 4 * scale;
  ctx.shadowOffsetY = 8 * scale;
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(-frameW / 2, -frameH / 2, frameW, frameH);
  ctx.restore();

  ctx.strokeStyle = 'rgba(0, 0, 0, 0.08)';
  ctx.lineWidth = Math.max(1, 2 * scale);
  ctx.strokeRect(-frameW / 2, -frameH / 2, frameW, frameH);

  const border = Math.max(8, Math.round(20 * scale));
  const bottomExtra = Math.max(16, Math.round(44 * scale));
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
    format: 'PNG',
    alias,
  };
};

const renderScriptTextPng = async (
  lines: string[],
  fontSizePx: number,
  alias: string,
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
      format: 'PNG',
      alias,
    };
  } catch {
    return null;
  }
};

const svgToPng = async (
  svg: string,
  width: number,
  height: number,
  alias: string,
): Promise<MeasuredAsset | null> => {
  const dataUri = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  try {
    const img = await loadImageElement(dataUri);
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    ctx.drawImage(img, 0, 0, width, height);
    return {
      dataUrl: canvas.toDataURL('image/png'),
      aspect: width / Math.max(height, 1),
      format: 'PNG',
      alias,
    };
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
    addMeasuredImage(
      doc,
      options.scriptInsight,
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

      addMeasuredImage(doc, col.img, frameX + innerPad, frameY + innerPad, drawW, drawH);
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
    addMeasuredImage(doc, options.scriptCardSmall, 43, 7, cardTitleW, cardTitleH);
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
    addMeasuredImage(
      doc,
      options.polaroid,
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

const composeRateCardPdf = (data: RateCardData, assets: PreparedPdfAssets): jsPDF => {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: [SLIDE_W, SLIDE_H],
    compress: true,
  });

  const social: SocialHandles = {
    instagramHandle: data.instagramHandle,
    tiktokHandle: data.tiktokHandle,
  };
  const displayName = data.name.trim() || 'Bella Rhema Agnesia';

  // ==========================================
  // SLIDE 1: COVER RATE CARD
  // ==========================================
  drawPaperBackdrop(doc);

  if (assets.cutout1) {
    const cutoutHeight = 160;
    const cutoutWidth = Math.min(cutoutHeight * assets.cutout1.aspect, 102);
    const drawHeight = cutoutWidth / assets.cutout1.aspect;
    addMeasuredImage(doc, assets.cutout1, 6, SLIDE_H - drawHeight, cutoutWidth, drawHeight);
  }

  if (assets.polaroid1) {
    const polaroidWidth = 60;
    const polaroidHeight = polaroidWidth / assets.polaroid1.aspect;
    addMeasuredImage(doc, assets.polaroid1, 4, 76, polaroidWidth, polaroidHeight);
  }

  const coverCenterX = 152;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(50);
  doc.setTextColor(...COLORS.ink);
  doc.text('RATE', coverCenterX, 50, { align: 'center' });

  if (assets.scriptCard) {
    const scriptHeight = 36;
    const scriptWidth = scriptHeight * assets.scriptCard.aspect;
    addMeasuredImage(
      doc,
      assets.scriptCard,
      coverCenterX + 4 - scriptWidth / 2,
      42,
      scriptWidth,
      scriptHeight,
    );
  }

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  const namePillW = Math.min(Math.max(doc.getTextWidth(displayName) + 14, 42), 88);
  const namePillH = 8.5;
  doc.setFillColor(...COLORS.ink);
  doc.roundedRect(coverCenterX - namePillW / 2, 83, namePillW, namePillH, 4.25, 4.25, 'F');
  doc.setTextColor(...COLORS.white);
  doc.text(displayName, coverCenterX, 88.8, { align: 'center' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(...COLORS.ink);
  const tagLines = doc.splitTextToSize(
    (data.tagline.trim() || 'CONTENT CREATOR').toUpperCase(),
    84,
  ) as string[];
  doc.text(tagLines, coverCenterX, 99, { align: 'center' });

  if (assets.coverPhoto3) {
    const w3 = 55;
    const h3 = w3 / assets.coverPhoto3.aspect;
    addMeasuredImage(doc, assets.coverPhoto3, 197, 8, w3, h3);
  }
  if (assets.coverPhoto4) {
    const w4 = 55;
    const h4 = w4 / assets.coverPhoto4.aspect;
    addMeasuredImage(doc, assets.coverPhoto4, 238, 12, w4, h4);
  }
  if (assets.polaroid2) {
    const polaroidWidth = 58;
    const polaroidHeight = polaroidWidth / assets.polaroid2.aspect;
    addMeasuredImage(doc, assets.polaroid2, 216, 75, polaroidWidth, polaroidHeight);
  }
  if (assets.lanyardTopPng) {
    addMeasuredImage(doc, assets.lanyardTopPng, 272, 0, 22, 36);
  }

  drawSocialFooter(doc, social);

  // ==========================================
  // SLIDE 2: ABOUT ME + LANYARD + CUTOUT
  // ==========================================
  doc.addPage();
  drawPaperBackdrop(doc);

  if (assets.scriptHiThere) {
    const headingHeight = 24;
    const headingWidth = headingHeight * assets.scriptHiThere.aspect;
    addMeasuredImage(doc, assets.scriptHiThere, 16, 16, headingWidth, headingHeight);
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

  if (assets.cutout2) {
    const cutoutHeight = 148;
    const cutoutWidth = Math.min(cutoutHeight * assets.cutout2.aspect, 90);
    const drawHeight = cutoutWidth / assets.cutout2.aspect;
    addMeasuredImage(doc, assets.cutout2, 202, SLIDE_H - drawHeight, cutoutWidth, drawHeight);
  }

  if (assets.polaroid3) {
    const polaroidWidth = 62;
    const polaroidHeight = polaroidWidth / assets.polaroid3.aspect;
    addMeasuredImage(doc, assets.polaroid3, 132, 62, polaroidWidth, polaroidHeight);
  }
  if (assets.lanyardClipPng) {
    addMeasuredImage(doc, assets.lanyardClipPng, 120, 0, 48, 66);
  }

  drawSocialFooter(doc, social);

  // ==========================================
  // SLIDE 3: INSTAGRAM INSIGHT
  // ==========================================
  drawPlatformInsightSlide(doc, {
    platformTitle: 'INSTAGRAM',
    titleOffsetX: 68,
    scriptInsight: assets.scriptInsight,
    handleText: data.instagramHandle,
    accountLabel: 'AKUN INSTAGRAM',
    accountImg: assets.igAccountImg,
    insightLabel: 'INSIGHT INSTAGRAM',
    insightImg: assets.igInsightImg,
    social,
    tintedBg: false,
  });

  // ==========================================
  // SLIDE 4: TIKTOK INSIGHT
  // ==========================================
  drawPlatformInsightSlide(doc, {
    platformTitle: 'TIKTOK',
    titleOffsetX: 52,
    scriptInsight: assets.scriptInsight,
    handleText: data.tiktokHandle,
    accountLabel: 'AKUN TIKTOK',
    accountImg: assets.ttAccountImg,
    insightLabel: 'INSIGHT TIKTOK',
    insightImg: assets.ttInsightImg,
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
    polaroid: assets.polaroid4,
    polaroidX: 238,
    scriptCardSmall: assets.scriptCardSmall,
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
    polaroid: assets.polaroid2,
    polaroidX: 238,
    scriptCardSmall: assets.scriptCardSmall,
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

  if (assets.scriptCondition) {
    const titleH = 22;
    const titleW = titleH * assets.scriptCondition.aspect;
    addMeasuredImage(doc, assets.scriptCondition, 55, 8, titleW, titleH);
  }

  drawTermColumn(doc, 'ENDORSEMENT', data.endorsementTerms, 16, 33, 98, COLORS.ink);
  drawTermColumn(doc, 'VISIT', data.visitTerms, 120, 33, 98, COLORS.pink);

  if (assets.cutout7) {
    const cutoutHeight = 140;
    const cutoutWidth = Math.min(cutoutHeight * assets.cutout7.aspect, 66);
    const drawHeight = cutoutWidth / assets.cutout7.aspect;
    addMeasuredImage(doc, assets.cutout7, 226, SLIDE_H - drawHeight, cutoutWidth, drawHeight);
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

  if (assets.scriptPayment) {
    const titleH = 22;
    const titleW = titleH * assets.scriptPayment.aspect;
    addMeasuredImage(doc, assets.scriptPayment, 58, 8, titleW, titleH);
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

  if (assets.cardsPng) {
    addMeasuredImage(doc, assets.cardsPng, 191, 40, 30, 24);
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
  return doc;
};

export const generateRateCardPdf = async (data: RateCardData): Promise<void> => {
  const svgMarkup = getRateCardSvgMarkup();

  const [
    cutout1El,
    cutout2El,
    cutout7El,
    polaroid1El,
    polaroid2El,
    coverPhoto3El,
    coverPhoto4El,
    polaroid3El,
    polaroid4El,
    igAccountEl,
    igInsightEl,
    ttAccountEl,
    ttInsightEl,
    lanyardTopPng,
    lanyardClipPng,
    cardsPng,
    scriptCard,
    scriptCardSmall,
    scriptHiThere,
    scriptInsight,
    scriptCondition,
    scriptPayment,
  ] = await Promise.all([
    tryLoadImage(data.cutoutSlide1Url),
    tryLoadImage(data.cutoutSlide2Url),
    tryLoadImage(data.cutoutSlide7Url),
    tryLoadImage(data.polaroid1Url),
    tryLoadImage(data.polaroid2Url),
    tryLoadImage(data.coverPhoto3Url),
    tryLoadImage(data.coverPhoto4Url),
    tryLoadImage(data.polaroid3Url),
    tryLoadImage(data.polaroid4Url),
    tryLoadImage(data.igAccountImageUrl),
    tryLoadImage(data.igInsightImageUrl),
    tryLoadImage(data.tiktokAccountImageUrl),
    tryLoadImage(data.tiktokInsightImageUrl),
    svgToPng(svgMarkup.lanyardTopRight, 160, 260, 'lanyard-top'),
    svgToPng(svgMarkup.lanyardClip, 220, 300, 'lanyard-clip'),
    svgToPng(svgMarkup.dualCards, 360, 288, 'dual-cards'),
    renderScriptTextPng(['Card'], 155, 'script-card', '#E82C8A', 'center'),
    renderScriptTextPng(['Card'], 105, 'script-card-small', '#E82C8A', 'left'),
    renderScriptTextPng(['Hi there!'], 115, 'script-hi-there', '#E82C8A', 'left'),
    renderScriptTextPng(['Insight'], 105, 'script-insight', '#E82C8A', 'left'),
    renderScriptTextPng(['Condition'], 105, 'script-condition', '#E82C8A', 'left'),
    renderScriptTextPng(['Payment'], 105, 'script-payment', '#E82C8A', 'left'),
  ]);

  let finalDoc: jsPDF | null = null;

  for (const preset of PDF_COMPRESSION_PRESETS) {
    const assets: PreparedPdfAssets = {
      cutout1: encodeCutoutPng(cutout1El, 'cutout-1', preset.cutoutMaxDim),
      cutout2: encodeCutoutPng(cutout2El, 'cutout-2', preset.cutoutMaxDim),
      cutout7: encodeCutoutPng(cutout7El, 'cutout-7', preset.cutoutMaxDim),
      polaroid1: createPolaroidPng(
        polaroid1El,
        'polaroid-1',
        -6,
        preset.polaroidFrameW,
        preset.polaroidFrameH,
        preset.polaroidPad,
      ),
      polaroid2: createPolaroidPng(
        polaroid2El,
        'polaroid-2',
        2,
        preset.polaroidFrameW,
        preset.polaroidFrameH,
        preset.polaroidPad,
      ),
      coverPhoto3: createPolaroidPng(
        coverPhoto3El,
        'cover-photo-3',
        -6,
        preset.polaroidFrameW,
        preset.polaroidFrameH,
        preset.polaroidPad,
      ),
      coverPhoto4: createPolaroidPng(
        coverPhoto4El,
        'cover-photo-4',
        6,
        preset.polaroidFrameW,
        preset.polaroidFrameH,
        preset.polaroidPad,
      ),
      polaroid3: createPolaroidPng(
        polaroid3El,
        'polaroid-3',
        -5,
        preset.polaroidFrameW,
        preset.polaroidFrameH,
        preset.polaroidPad,
      ),
      polaroid4: createPolaroidPng(
        polaroid4El,
        'polaroid-4',
        4,
        preset.polaroidFrameW,
        preset.polaroidFrameH,
        preset.polaroidPad,
      ),
      igAccountImg: encodeScreenshotJpeg(
        igAccountEl,
        'ig-account',
        preset.screenshotMaxDim,
        preset.screenshotQuality,
      ),
      igInsightImg: encodeScreenshotJpeg(
        igInsightEl,
        'ig-insight',
        preset.screenshotMaxDim,
        preset.screenshotQuality,
      ),
      ttAccountImg: encodeScreenshotJpeg(
        ttAccountEl,
        'tt-account',
        preset.screenshotMaxDim,
        preset.screenshotQuality,
      ),
      ttInsightImg: encodeScreenshotJpeg(
        ttInsightEl,
        'tt-insight',
        preset.screenshotMaxDim,
        preset.screenshotQuality,
      ),
      lanyardTopPng,
      lanyardClipPng,
      cardsPng,
      scriptCard,
      scriptCardSmall,
      scriptHiThere,
      scriptInsight,
      scriptCondition,
      scriptPayment,
    };

    const candidateDoc = composeRateCardPdf(data, assets);
    finalDoc = candidateDoc;
    const sizeBytes = candidateDoc.output('arraybuffer').byteLength;
    if (sizeBytes <= TARGET_MAX_PDF_BYTES) {
      break;
    }
  }

  const safeName = (data.name.trim() || 'Rate_Card').replace(/[^a-zA-Z0-9_-]+/g, '_');
  finalDoc?.save(`${safeName}_Rate_Card.pdf`);
};
