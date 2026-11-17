import { supabase } from '@/shared/lib/supabase';
import type { InvoiceItemTemplate, InvoiceRecipient } from '../types/invoice.types';

async function ensureActiveSupabaseSession(): Promise<void> {
  const { data, error } = await supabase.auth.getSession();
  if (error || !data.session) {
    throw new Error('Sesi login Supabase tidak aktif atau sudah berakhir. Silakan login ulang.');
  }
}

export const invoiceOptionsService = {
  getRecipients: async (): Promise<InvoiceRecipient[]> => {
    const { data, error } = await supabase
      .from('invoice_recipients')
      .select('*')
      .order('name', { ascending: true });

    if (error) throw new Error(error.message);
    return (data ?? []) as InvoiceRecipient[];
  },

  createRecipient: async (name: string): Promise<InvoiceRecipient> => {
    await ensureActiveSupabaseSession();
    const { data, error } = await supabase
      .from('invoice_recipients')
      .insert([{ name: name.trim() }])
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data as InvoiceRecipient;
  },

  updateRecipient: async (id: string, name: string): Promise<InvoiceRecipient> => {
    await ensureActiveSupabaseSession();
    const { data, error } = await supabase
      .from('invoice_recipients')
      .update({ name: name.trim(), updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data as InvoiceRecipient;
  },

  deleteRecipient: async (id: string): Promise<void> => {
    await ensureActiveSupabaseSession();
    const { error } = await supabase.from('invoice_recipients').delete().eq('id', id);
    if (error) throw new Error(error.message);
  },

  getItemTemplates: async (): Promise<InvoiceItemTemplate[]> => {
    const { data, error } = await supabase
      .from('invoice_item_templates')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) throw new Error(error.message);
    return (data ?? []) as InvoiceItemTemplate[];
  },

  createItemTemplate: async (description: string): Promise<InvoiceItemTemplate> => {
    await ensureActiveSupabaseSession();
    const { data, error } = await supabase
      .from('invoice_item_templates')
      .insert([{ description: description.trim() }])
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data as InvoiceItemTemplate;
  },

  updateItemTemplate: async (id: string, description: string): Promise<InvoiceItemTemplate> => {
    await ensureActiveSupabaseSession();
    const { data, error } = await supabase
      .from('invoice_item_templates')
      .update({ description: description.trim(), updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data as InvoiceItemTemplate;
  },

  deleteItemTemplate: async (id: string): Promise<void> => {
    await ensureActiveSupabaseSession();
    const { error } = await supabase.from('invoice_item_templates').delete().eq('id', id);
    if (error) throw new Error(error.message);
  },
};
