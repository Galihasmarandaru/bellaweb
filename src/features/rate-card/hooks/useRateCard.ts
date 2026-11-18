import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { rateCardService } from '../services/rateCardService';
import type { RateCardData } from '../types/rateCard.types';

export const RATE_CARD_QUERY_KEY = ['rate-card'];

export function useRateCard() {
  return useQuery({
    queryKey: RATE_CARD_QUERY_KEY,
    queryFn: rateCardService.getRateCard,
  });
}

export function useSaveRateCard() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: RateCardData) => rateCardService.saveRateCard(payload),
    onSuccess: (saved) => {
      queryClient.setQueryData(RATE_CARD_QUERY_KEY, saved);
    },
  });
}

export function useUploadRateCardImage() {
  return useMutation({
    mutationFn: ({ file, previousUrl }: { file: File; previousUrl?: string }) =>
      rateCardService.uploadImage(file, previousUrl),
  });
}
