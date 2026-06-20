import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { spillService } from '../services/spillService.ts';
import type { CreateSpillPayload, UpdateSpillPayload } from '../types/spill.types.ts';

export const useSpills = () => {
  return useQuery({
    queryKey: ['spills'],
    queryFn: () => spillService.getSpills(),
  });
};

export const useSpillById = (id: string) => {
  return useQuery({
    queryKey: ['spills', id],
    queryFn: () => spillService.getSpillById(id),
    enabled: !!id,
  });
};

export const useCreateSpill = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateSpillPayload) => spillService.createSpill(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['spills'] });
    },
  });
};

export const useUpdateSpill = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateSpillPayload }) =>
      spillService.updateSpill(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['spills'] });
    },
  });
};

export const useDeleteSpill = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => spillService.deleteSpill(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['spills'] });
    },
  });
};

export const useUploadSpillImage = () => {
  return useMutation({
    mutationFn: (file: File) => spillService.uploadImage(file),
  });
};
