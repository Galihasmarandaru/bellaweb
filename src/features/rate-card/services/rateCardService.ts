import { supabase } from '@/shared/lib/supabase';
import { compressImageFile } from '@/shared/utils/compressImage';
import type { RateCardData, RatePackageItem, RateTermItem } from '../types/rateCard.types';
import { DEFAULT_IMAGES, DEFAULT_RATE_CARD_DATA } from '../utils/defaultRateCard';

const RATE_CARD_ROW_ID = 'default';
const RATE_CARD_BUCKET = 'rate-card-images';

type LegacyRateCardRecord = Partial<RateCardData> & {
  cutoutSlide4Url?: string;
};

async function ensureActiveSupabaseSession(): Promise<void> {
  const { data, error } = await supabase.auth.getSession();
  if (error || !data.session) {
    throw new Error('Sesi login Supabase tidak aktif atau sudah berakhir. Silakan login ulang.');
  }
}

function normalizeTerms(items: unknown, fallback: RateTermItem[], prefix: string): RateTermItem[] {
  if (!Array.isArray(items) || items.length === 0) return fallback;
  return items.map((item, idx) =>
    typeof item === 'string' ? { id: `${prefix}-${idx}`, text: item } : (item as RateTermItem),
  );
}

function ensurePackages(items: unknown, fallback: RatePackageItem[]): RatePackageItem[] {
  return Array.isArray(items) && items.length > 0 ? (items as RatePackageItem[]) : fallback;
}

export function normalizeRateCardData(raw: unknown): RateCardData {
  if (!raw || typeof raw !== 'object') {
    return DEFAULT_RATE_CARD_DATA;
  }

  const saved = raw as LegacyRateCardRecord;
  return {
    ...DEFAULT_RATE_CARD_DATA,
    ...saved,
    cutoutSlide7Url: saved.cutoutSlide7Url || saved.cutoutSlide4Url || DEFAULT_IMAGES.cutoutSlide7,
    coverPhoto3Url: saved.coverPhoto3Url || DEFAULT_IMAGES.coverPhoto3,
    coverPhoto4Url: saved.coverPhoto4Url || DEFAULT_IMAGES.coverPhoto4,
    igAccountImageUrl: saved.igAccountImageUrl || DEFAULT_IMAGES.igAccount,
    igInsightImageUrl: saved.igInsightImageUrl || DEFAULT_IMAGES.igInsight,
    tiktokAccountImageUrl: saved.tiktokAccountImageUrl || DEFAULT_IMAGES.tiktokAccount,
    tiktokInsightImageUrl: saved.tiktokInsightImageUrl || DEFAULT_IMAGES.tiktokInsight,
    visitPackages: ensurePackages(saved.visitPackages, DEFAULT_RATE_CARD_DATA.visitPackages),
    collaborationPackages: ensurePackages(
      saved.collaborationPackages,
      DEFAULT_RATE_CARD_DATA.collaborationPackages,
    ),
    endorsementPackages: ensurePackages(
      saved.endorsementPackages,
      DEFAULT_RATE_CARD_DATA.endorsementPackages,
    ),
    additionalPackages: ensurePackages(
      saved.additionalPackages,
      DEFAULT_RATE_CARD_DATA.additionalPackages,
    ),
    endorsementTerms: normalizeTerms(
      saved.endorsementTerms,
      DEFAULT_RATE_CARD_DATA.endorsementTerms,
      'end-term',
    ),
    visitTerms: normalizeTerms(saved.visitTerms, DEFAULT_RATE_CARD_DATA.visitTerms, 'visit-term'),
    paymentTerms: normalizeTerms(
      saved.paymentTerms,
      DEFAULT_RATE_CARD_DATA.paymentTerms,
      'pay-term',
    ),
  };
}

export const rateCardService = {
  getRateCard: async (): Promise<RateCardData> => {
    await ensureActiveSupabaseSession();
    const { data, error } = await supabase
      .from('rate_cards')
      .select('data')
      .eq('id', RATE_CARD_ROW_ID)
      .maybeSingle();

    if (error) throw new Error(error.message);

    if (!data) {
      const { error: seedError } = await supabase.from('rate_cards').upsert(
        {
          id: RATE_CARD_ROW_ID,
          data: DEFAULT_RATE_CARD_DATA,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'id' },
      );

      if (seedError) throw new Error(seedError.message);
      return DEFAULT_RATE_CARD_DATA;
    }

    return normalizeRateCardData(data.data);
  },

  saveRateCard: async (rateCardData: RateCardData): Promise<RateCardData> => {
    await ensureActiveSupabaseSession();
    const { data, error } = await supabase
      .from('rate_cards')
      .upsert(
        {
          id: RATE_CARD_ROW_ID,
          data: rateCardData,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'id' },
      )
      .select('data')
      .single();

    if (error) throw new Error(error.message);
    return normalizeRateCardData(data.data);
  },

  deleteImage: async (imageUrl: string): Promise<void> => {
    if (!imageUrl?.includes(`/${RATE_CARD_BUCKET}/`)) return;
    try {
      const urlParts = imageUrl.split(`/${RATE_CARD_BUCKET}/`);
      if (urlParts.length === 2 && urlParts[1]) {
        const filePath = decodeURIComponent(urlParts[1].split('?')[0]);
        await supabase.storage.from(RATE_CARD_BUCKET).remove([filePath]);
      }
    } catch (err) {
      console.error('Failed to delete rate card image from storage:', err);
    }
  },

  uploadImage: async (file: File, previousUrl?: string): Promise<string> => {
    await ensureActiveSupabaseSession();
    const compressedFile = await compressImageFile(file);
    const fileExt = (compressedFile.name.split('.').pop() || 'png').toLowerCase();
    const fileName = `${Math.random().toString(36).substring(2, 12)}_${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from(RATE_CARD_BUCKET)
      .upload(fileName, compressedFile, {
        contentType: compressedFile.type || undefined,
        upsert: false,
      });

    if (uploadError) throw new Error(uploadError.message);

    const { data } = supabase.storage.from(RATE_CARD_BUCKET).getPublicUrl(fileName);

    if (previousUrl && previousUrl !== data.publicUrl) {
      await rateCardService.deleteImage(previousUrl);
    }

    return data.publicUrl;
  },
};
