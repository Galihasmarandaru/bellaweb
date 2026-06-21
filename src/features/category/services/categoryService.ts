import { supabase } from '@/shared/lib/supabase';
import type { Category, CreateCategoryPayload } from '../types/category.types';

export const getCategories = async (type?: 'accomodation' | 'spill'): Promise<Category[]> => {
  let query = supabase.from('categories').select('*');

  if (type) {
    query = query.eq('type', type);
  }

  const { data, error } = await query.order('name', { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return data as Category[];
};

export const createCategory = async (payload: CreateCategoryPayload): Promise<Category> => {
  const { data, error } = await supabase
    .from('categories')
    .insert([{ name: payload.name, type: payload.type }])
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as Category;
};
