import { get, set } from 'idb-keyval';
import type { RateCardData, RatePackageItem, RateTermItem } from '../types/rateCard.types';
import { DEFAULT_IMAGES, DEFAULT_RATE_CARD_DATA } from './defaultRateCard';

const STORAGE_KEY = 'rateCardData';
const STORAGE_VERSION_KEY = 'rateCardDataVersion';
const CURRENT_SCHEMA_VERSION = 2;

type LegacyRateCardRecord = Partial<RateCardData> & {
  cutoutSlide4Url?: string;
};

function normalizeTerms(items: unknown, fallback: RateTermItem[], prefix: string): RateTermItem[] {
  if (!Array.isArray(items) || items.length === 0) return fallback;
  return items.map((item, idx) =>
    typeof item === 'string' ? { id: `${prefix}-${idx}`, text: item } : (item as RateTermItem),
  );
}

function ensurePackages(items: unknown, fallback: RatePackageItem[]): RatePackageItem[] {
  return Array.isArray(items) && items.length > 0 ? (items as RatePackageItem[]) : fallback;
}

export async function loadRateCardData(): Promise<RateCardData> {
  const [saved, version] = await Promise.all([
    get<LegacyRateCardRecord>(STORAGE_KEY),
    get<number>(STORAGE_VERSION_KEY),
  ]);

  if (!saved) {
    await set(STORAGE_VERSION_KEY, CURRENT_SCHEMA_VERSION);
    return DEFAULT_RATE_CARD_DATA;
  }

  const needsLegacyMigration = !version || version < CURRENT_SCHEMA_VERSION;
  const migratedCutoutSlide7 =
    saved.cutoutSlide7Url ?? saved.cutoutSlide4Url ?? DEFAULT_IMAGES.cutoutSlide7;

  const hydrated: RateCardData = {
    ...DEFAULT_RATE_CARD_DATA,
    ...saved,
    cutoutSlide7Url: migratedCutoutSlide7,
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

  if (needsLegacyMigration) {
    if (!hydrated.igAccountImageUrl) hydrated.igAccountImageUrl = DEFAULT_IMAGES.igAccount;
    if (!hydrated.igInsightImageUrl) hydrated.igInsightImageUrl = DEFAULT_IMAGES.igInsight;
    if (!hydrated.tiktokAccountImageUrl)
      hydrated.tiktokAccountImageUrl = DEFAULT_IMAGES.tiktokAccount;
    if (!hydrated.tiktokInsightImageUrl)
      hydrated.tiktokInsightImageUrl = DEFAULT_IMAGES.tiktokInsight;

    await Promise.all([
      set(STORAGE_KEY, hydrated),
      set(STORAGE_VERSION_KEY, CURRENT_SCHEMA_VERSION),
    ]);
  }

  return hydrated;
}

export async function saveRateCardData(data: RateCardData): Promise<void> {
  await Promise.all([set(STORAGE_KEY, data), set(STORAGE_VERSION_KEY, CURRENT_SCHEMA_VERSION)]);
}
