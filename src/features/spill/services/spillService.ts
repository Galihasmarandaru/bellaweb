import { supabase } from '../../../shared/lib/supabase.ts';
import type { CreateSpillPayload, Spill, UpdateSpillPayload } from '../types/spill.types.ts';

export const spillService = {
  getSpills: async (): Promise<Spill[]> => {
    const { data, error } = await supabase
      .from('spills')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return data || [];
  },

  getSpillById: async (id: string): Promise<Spill> => {
    const { data, error } = await supabase.from('spills').select('*').eq('id', id).single();

    if (error) throw new Error(error.message);
    return data;
  },

  createSpill: async (payload: CreateSpillPayload): Promise<Spill> => {
    const { data, error } = await supabase.from('spills').insert([payload]).select().single();

    if (error) throw new Error(error.message);
    return data;
  },

  updateSpill: async (id: string, payload: UpdateSpillPayload): Promise<Spill> => {
    const { data, error } = await supabase
      .from('spills')
      .update(payload)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  deleteSpill: async (id: string): Promise<void> => {
    const { data: item } = await supabase.from('spills').select('image_url').eq('id', id).single();

    const { error } = await supabase.from('spills').delete().eq('id', id);
    if (error) throw new Error(error.message);

    if (item?.image_url) {
      await spillService.deleteImage(item.image_url);
    }
  },

  deleteImage: async (imageUrl: string): Promise<void> => {
    try {
      const urlParts = imageUrl.split('/spill-images/');
      if (urlParts.length === 2) {
        const filePath = urlParts[1];
        await supabase.storage.from('spill-images').remove([filePath]);
      }
    } catch (err) {
      console.error('Failed to delete image from storage:', err);
    }
  },

  uploadImage: async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('spill-images')
      .upload(filePath, file);

    if (uploadError) throw new Error(uploadError.message);

    const { data } = supabase.storage.from('spill-images').getPublicUrl(filePath);

    return data.publicUrl;
  },
};
