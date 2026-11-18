export interface InvoiceRecipient {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface InvoiceItemTemplate {
  id: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface InvoiceItem {
  id: string;
  keterangan: string;
  harga: number;
  jml: number;
}

export interface InvoiceTaxItem {
  id: string;
  name: string;
  rateInput: string;
}

export interface InvoiceFormState {
  kepada: string;
  tanggalIso: string;
  noInvoiceCode: string;
  noInvoiceDateIso: string;
  hasCustomNoInvoiceDate: boolean;
  items: InvoiceItem[];
  taxes: InvoiceTaxItem[];
}

export interface InvoicePdfTaxLine {
  detailLabel: string;
  amount: number;
}

export interface InvoicePdfData {
  kepada: string;
  tanggal: string;
  noInvoice: string;
  items: InvoiceItem[];
  taxes: InvoicePdfTaxLine[];
}
