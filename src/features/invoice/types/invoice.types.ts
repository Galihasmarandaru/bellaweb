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

export interface InvoiceFormState {
  kepada: string;
  tanggalIso: string;
  noInvoiceCode: string;
  noInvoiceDateIso: string;
  hasCustomNoInvoiceDate: boolean;
  items: InvoiceItem[];
}

export interface InvoicePdfData {
  kepada: string;
  tanggal: string;
  noInvoice: string;
  items: InvoiceItem[];
}
