import type { InvoiceFormState, InvoiceItem, InvoiceTaxItem } from '../types/invoice.types';

const INDONESIAN_MONTHS: Record<string, number> = {
  januari: 0,
  februari: 1,
  maret: 2,
  april: 3,
  mei: 4,
  juni: 5,
  juli: 6,
  agustus: 7,
  september: 8,
  oktober: 9,
  november: 10,
  desember: 11,
};

export function toIsoDateString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function parseIsoDateString(iso: string): Date | undefined {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso.trim());
  if (!match) return undefined;
  const year = Number(match[1]);
  const month = Number(match[2]) - 1;
  const day = Number(match[3]);
  const date = new Date(year, month, day);
  if (
    Number.isNaN(date.getTime()) ||
    date.getFullYear() !== year ||
    date.getMonth() !== month ||
    date.getDate() !== day
  ) {
    return undefined;
  }
  return date;
}

export function formatIndonesianLongDate(iso: string): string {
  const date = parseIsoDateString(iso);
  if (!date) return '';
  return date.toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatShortSlashDate(iso: string): string {
  const date = parseIsoDateString(iso);
  if (!date) return '';
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

export function formatInvoiceNumber(code: string, dateIso: string): string {
  const trimmedCode = code.trim();
  const shortDate = formatShortSlashDate(dateIso);
  if (trimmedCode && shortDate) return `${trimmedCode} ${shortDate}`;
  return trimmedCode || shortDate;
}

function parseLegacyIndonesianDate(raw: string): string | undefined {
  const match = /(\d{1,2})\s+([a-zA-Z]+)\s+(\d{4})/.exec(raw);
  if (!match) return undefined;
  const day = Number(match[1]);
  const month = INDONESIAN_MONTHS[match[2].toLowerCase()];
  const year = Number(match[3]);
  if (month === undefined) return undefined;
  const date = new Date(year, month, day);
  return Number.isNaN(date.getTime()) ? undefined : toIsoDateString(date);
}

function parseLegacyNoInvoice(raw: string, fallbackIso: string): { code: string; dateIso: string } {
  const trimmed = raw.trim();
  const match = /^(.*?)\s+(\d{2})\/(\d{2})\/(\d{4})$/.exec(trimmed);
  if (!match) {
    return { code: trimmed, dateIso: fallbackIso };
  }
  const isoCandidate = `${match[4]}-${match[3]}-${match[2]}`;
  if (!parseIsoDateString(isoCandidate)) {
    return { code: trimmed, dateIso: fallbackIso };
  }
  return { code: match[1].trim(), dateIso: isoCandidate };
}

export function createDefaultInvoiceState(): InvoiceFormState {
  const todayIso = toIsoDateString(new Date());
  return {
    kepada: '',
    tanggalIso: todayIso,
    noInvoiceCode: '',
    noInvoiceDateIso: todayIso,
    hasCustomNoInvoiceDate: false,
    items: [{ id: Date.now().toString(), keterangan: '', harga: 0, jml: 1 }],
    taxes: [],
  };
}

function normalizeStoredTaxes(rawTaxes: unknown): InvoiceTaxItem[] {
  if (!Array.isArray(rawTaxes)) return [];
  return rawTaxes.map((tax, idx) => {
    const record = tax && typeof tax === 'object' ? (tax as Record<string, unknown>) : {};
    return {
      id: typeof record.id === 'string' && record.id ? record.id : `${Date.now()}-tax-${idx}`,
      name: typeof record.name === 'string' ? record.name : '',
      rateInput: typeof record.rateInput === 'string' ? record.rateInput : '',
    };
  });
}

export function normalizeStoredInvoiceState(raw: unknown): InvoiceFormState | null {
  if (!raw || typeof raw !== 'object') return null;
  const record = raw as Record<string, unknown>;
  const todayIso = toIsoDateString(new Date());
  const rawItems = Array.isArray(record.items) ? (record.items as InvoiceItem[]) : [];
  const items: InvoiceItem[] =
    rawItems.length > 0
      ? rawItems.map((item, idx) => ({
          id: typeof item?.id === 'string' && item.id ? item.id : `${Date.now()}-${idx}`,
          keterangan: typeof item?.keterangan === 'string' ? item.keterangan : '',
          harga: typeof item?.harga === 'number' && !Number.isNaN(item.harga) ? item.harga : 0,
          jml: typeof item?.jml === 'number' && !Number.isNaN(item.jml) ? item.jml : 1,
        }))
      : [{ id: Date.now().toString(), keterangan: '', harga: 0, jml: 1 }];
  const taxes = normalizeStoredTaxes(record.taxes);

  if (typeof record.tanggalIso === 'string' && parseIsoDateString(record.tanggalIso)) {
    const tanggalIso = record.tanggalIso;
    const noInvoiceDateIso =
      typeof record.noInvoiceDateIso === 'string' && parseIsoDateString(record.noInvoiceDateIso)
        ? record.noInvoiceDateIso
        : tanggalIso;
    return {
      kepada: typeof record.kepada === 'string' ? record.kepada : '',
      tanggalIso,
      noInvoiceCode: typeof record.noInvoiceCode === 'string' ? record.noInvoiceCode : '',
      noInvoiceDateIso,
      hasCustomNoInvoiceDate: Boolean(record.hasCustomNoInvoiceDate),
      items,
      taxes,
    };
  }

  const tanggalIso =
    (typeof record.tanggal === 'string' ? parseLegacyIndonesianDate(record.tanggal) : undefined) ??
    todayIso;
  const legacyNo = parseLegacyNoInvoice(
    typeof record.noInvoice === 'string' ? record.noInvoice : '',
    tanggalIso,
  );

  return {
    kepada: typeof record.kepada === 'string' ? record.kepada : '',
    tanggalIso,
    noInvoiceCode: legacyNo.code,
    noInvoiceDateIso: legacyNo.dateIso,
    hasCustomNoInvoiceDate: legacyNo.dateIso !== tanggalIso,
    items,
    taxes,
  };
}
