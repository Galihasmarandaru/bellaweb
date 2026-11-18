import type { InvoicePdfTaxLine, InvoiceTaxItem } from '../types/invoice.types';

export interface ComputedInvoiceTax extends InvoicePdfTaxLine {
  id: string;
  name: string;
  rate: number;
  formattedRate: string;
}

export interface InvoiceTaxSummary {
  computedTaxes: ComputedInvoiceTax[];
  activeTaxes: ComputedInvoiceTax[];
  totalTaxAmount: number;
  grandTotal: number;
}

/**
 * Sanitizes a percentage input string, allowing digits and a single decimal separator (',' or '.').
 */
export function sanitizeTaxRateInput(raw: string): string {
  const cleaned = raw.replace(/[^0-9.,]/g, '');
  let hasSeparator = false;
  let result = '';

  for (const char of cleaned) {
    if (char === ',' || char === '.') {
      if (!hasSeparator) {
        hasSeparator = true;
        result += char;
      }
      continue;
    }
    result += char;
  }

  return result;
}

/**
 * Parses a localized percentage string (e.g. '2,5' or '2.5') into a non-negative number.
 */
export function parseTaxRate(rateInput: string): number {
  const normalized = rateInput.trim().replace(',', '.');
  if (!normalized || normalized === '.') return 0;

  const parsed = Number(normalized);
  if (!Number.isFinite(parsed) || parsed <= 0) return 0;
  return parsed;
}

/**
 * Formats a numeric percentage using Indonesian comma decimal separator (e.g. 2.5 -> '2,5').
 */
export function formatTaxRate(rate: number): string {
  return rate.toLocaleString('id-ID', { maximumFractionDigits: 4 });
}

/**
 * Formats an IDR amount consistently with existing invoice PDF output (e.g. 'RP 10.000').
 */
export function formatInvoiceRp(amount: number): string {
  return `RP ${Math.round(amount).toLocaleString('id-ID')}`;
}

/**
 * Formats a single tax summary detail line (e.g. 'POT PPh 2,5% (RP 10.000)').
 */
export function formatTaxDetailLabel(name: string, rate: number, amount: number): string {
  const trimmedName = name.trim();
  const formattedRate = formatTaxRate(rate);
  const formattedAmount = formatInvoiceRp(amount);

  if (trimmedName) {
    return `${trimmedName} ${formattedRate}% (${formattedAmount})`;
  }
  return `${formattedRate}% (${formattedAmount})`;
}

/**
 * Computes per-tax deduction amounts, active tax lines, total tax, and final invoice total.
 */
export function computeInvoiceTaxSummary(
  subTotal: number,
  taxes: InvoiceTaxItem[],
): InvoiceTaxSummary {
  const computedTaxes: ComputedInvoiceTax[] = taxes.map((tax) => {
    const rate = parseTaxRate(tax.rateInput);
    const amount = Math.round((subTotal * rate) / 100);
    const formattedRate = formatTaxRate(rate);
    const detailLabel = formatTaxDetailLabel(tax.name, rate, amount);

    return {
      id: tax.id,
      name: tax.name,
      rate,
      amount,
      formattedRate,
      detailLabel,
    };
  });

  const activeTaxes = computedTaxes.filter((tax) => tax.rate > 0);
  const totalTaxAmount = activeTaxes.reduce((sum, tax) => sum + tax.amount, 0);
  const grandTotal = Math.max(0, subTotal - totalTaxAmount);

  return {
    computedTaxes,
    activeTaxes,
    totalTaxAmount,
    grandTotal,
  };
}
