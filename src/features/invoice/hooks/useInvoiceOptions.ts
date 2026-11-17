import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { invoiceOptionsService } from '../services/invoiceOptionsService';

export const INVOICE_RECIPIENTS_QUERY_KEY = ['invoice-recipients'];
export const INVOICE_ITEM_TEMPLATES_QUERY_KEY = ['invoice-item-templates'];

export function useInvoiceRecipients() {
  return useQuery({
    queryKey: INVOICE_RECIPIENTS_QUERY_KEY,
    queryFn: invoiceOptionsService.getRecipients,
  });
}

export function useCreateInvoiceRecipient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (name: string) => invoiceOptionsService.createRecipient(name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: INVOICE_RECIPIENTS_QUERY_KEY });
    },
  });
}

export function useUpdateInvoiceRecipient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) =>
      invoiceOptionsService.updateRecipient(id, name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: INVOICE_RECIPIENTS_QUERY_KEY });
    },
  });
}

export function useDeleteInvoiceRecipient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => invoiceOptionsService.deleteRecipient(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: INVOICE_RECIPIENTS_QUERY_KEY });
    },
  });
}

export function useInvoiceItemTemplates() {
  return useQuery({
    queryKey: INVOICE_ITEM_TEMPLATES_QUERY_KEY,
    queryFn: invoiceOptionsService.getItemTemplates,
  });
}

export function useCreateInvoiceItemTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (description: string) => invoiceOptionsService.createItemTemplate(description),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: INVOICE_ITEM_TEMPLATES_QUERY_KEY });
    },
  });
}

export function useUpdateInvoiceItemTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, description }: { id: string; description: string }) =>
      invoiceOptionsService.updateItemTemplate(id, description),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: INVOICE_ITEM_TEMPLATES_QUERY_KEY });
    },
  });
}

export function useDeleteInvoiceItemTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => invoiceOptionsService.deleteItemTemplate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: INVOICE_ITEM_TEMPLATES_QUERY_KEY });
    },
  });
}
