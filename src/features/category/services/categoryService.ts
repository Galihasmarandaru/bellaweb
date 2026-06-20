import { supabase } from '@/shared/lib/supabase';
import type { Category, CreateCategoryPayload } from '../types/category.types';

export const getCategories = async (): Promise<Category[]> => {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name', { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return data as Category[];
};

export const createCategory = async (payload: CreateCategoryPayload): Promise<Category> => {
  const { data, error } = await supabase
    .from('categories')
    .insert([{ name: payload.name }])
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as Category;
};
