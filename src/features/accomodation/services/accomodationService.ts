import { supabase } from '../../../shared/lib/supabase.ts';
import type {
  Accomodation,
  CreateAccomodationPayload,
  UpdateAccomodationPayload,
} from '../types/accomodation.types.ts';

export const accomodationService = {
  getAccomodations: async (): Promise<Accomodation[]> => {
    const { data, error } = await supabase
      .from('accomodations')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return data || [];
  },

  getAccomodationById: async (id: string): Promise<Accomodation> => {
    const { data, error } = await supabase.from('accomodations').select('*').eq('id', id).single();

    if (error) throw new Error(error.message);
    return data;
  },

  createAccomodation: async (payload: CreateAccomodationPayload): Promise<Accomodation> => {
    const { data, error } = await supabase
      .from('accomodations')
      .insert([payload])
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  updateAccomodation: async (
    id: string,
    payload: UpdateAccomodationPayload,
  ): Promise<Accomodation> => {
    const { data, error } = await supabase
      .from('accomodations')
      .update(payload)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  deleteAccomodation: async (id: string): Promise<void> => {
    // 1. Fetch the accommodation to get the image_url
    const { data: item } = await supabase
      .from('accomodations')
      .select('image_url')
      .eq('id', id)
      .single();

    // 2. Delete the record from the database
    const { error } = await supabase.from('accomodations').delete().eq('id', id);
    if (error) throw new Error(error.message);

    // 3. Delete the image from Supabase Storage if it exists
    if (item?.image_url) {
      await accomodationService.deleteImage(item.image_url);
    }
  },

  deleteImage: async (imageUrl: string): Promise<void> => {
    try {
      // Extract the filename from the public URL
      // Example URL: https://[project].supabase.co/storage/v1/object/public/accomodation-images/123_456.jpg
      const urlParts = imageUrl.split('/accomodation-images/');
      if (urlParts.length === 2) {
        const filePath = urlParts[1];
        await supabase.storage.from('accomodation-images').remove([filePath]);
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
      .from('accomodation-images')
      .upload(filePath, file);

    if (uploadError) throw new Error(uploadError.message);

    const { data } = supabase.storage.from('accomodation-images').getPublicUrl(filePath);

    return data.publicUrl;
  },
};
