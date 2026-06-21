import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { accomodationService } from '../services/accomodationService.ts';
import type {
  CreateAccomodationPayload,
  UpdateAccomodationPayload,
} from '../types/accomodation.types.ts';

export const useAccomodations = () => {
  return useQuery({
    queryKey: ['accomodations'],
    queryFn: () => accomodationService.getAccomodations(),
  });
};

export const useAccomodationById = (id: string) => {
  return useQuery({
    queryKey: ['accomodations', id],
    queryFn: () => accomodationService.getAccomodationById(id),
    enabled: !!id,
  });
};

export const useCreateAccomodation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateAccomodationPayload) =>
      accomodationService.createAccomodation(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accomodations'] });
    },
  });
};

export const useUpdateAccomodation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateAccomodationPayload }) =>
      accomodationService.updateAccomodation(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accomodations'] });
    },
  });
};

export const useDeleteAccomodation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => accomodationService.deleteAccomodation(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accomodations'] });
    },
  });
};

export const useUploadAccomodationImage = () => {
  return useMutation({
    mutationFn: (file: File) => accomodationService.uploadImage(file),
  });
};
