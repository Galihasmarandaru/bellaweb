import { z } from 'zod';

export const invoiceRecipientNameSchema = z
  .string()
  .trim()
  .min(1, 'Nama penerima (KEPADA) wajib diisi')
  .max(200, 'Maksimal 200 karakter');

export const invoiceRecipientOptionSchema = z.object({
  value: invoiceRecipientNameSchema,
});

export const invoiceItemDescriptionSchema = z
  .string()
  .trim()
  .min(1, 'Deskripsi item invoice wajib diisi')
  .max(500, 'Maksimal 500 karakter');

export const invoiceItemTemplateOptionSchema = z.object({
  value: invoiceItemDescriptionSchema,
});

export type InvoiceRecipientOptionFormValues = z.infer<typeof invoiceRecipientOptionSchema>;
export type InvoiceItemTemplateOptionFormValues = z.infer<typeof invoiceItemTemplateOptionSchema>;
