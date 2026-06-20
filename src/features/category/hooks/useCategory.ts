import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createCategory, getCategories } from '../services/categoryService';
import type { CreateCategoryPayload } from '../types/category.types';

export const CATEGORIES_QUERY_KEY = ['categories'];

export const useCategories = (type?: 'accomodation' | 'spill') => {
  return useQuery({
    queryKey: [...CATEGORIES_QUERY_KEY, type],
    queryFn: () => getCategories(type),
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateCategoryPayload) => createCategory(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CATEGORIES_QUERY_KEY });
    },
  });
};
