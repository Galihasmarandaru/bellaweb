import { Download, Loader2, RotateCcw } from 'lucide-react';
import { useEffect, useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { fileToCompressedDataUrl } from '@/shared/utils/compressImage';
import type { RateCardData, RatePackageItem } from '../types/rateCard.types';
import { DEFAULT_IMAGES, DEFAULT_RATE_CARD_DATA } from '../utils/defaultRateCard';
import { generateRateCardPdf } from '../utils/generateRateCardPdf';
import { loadRateCardData, saveRateCardData } from '../utils/rateCardStorage';
import { PackageSectionEditor } from './PackageSectionEditor';
import { PhotoSlotCard } from './PhotoSlotCard';
import { RateCardPreview } from './RateCardPreview';
import { TermListEditor } from './TermListEditor';

type EditorTab = 'identity' | 'insights' | 'rate' | 'photos' | 'terms' | 'payment';
type TermListKey = 'endorsementTerms' | 'visitTerms' | 'paymentTerms';
type PackageListKey =
  | 'visitPackages'
  | 'collaborationPackages'
  | 'endorsementPackages'
  | 'additionalPackages';
type PackageTitleKey = 'visitTitle' | 'collaborationTitle' | 'endorsementTitle' | 'additionalTitle';
type ImageFieldKey =
  | 'cutoutSlide1Url'
  | 'cutoutSlide2Url'
  | 'cutoutSlide7Url'
  | 'polaroid1Url'
  | 'polaroid2Url'
  | 'polaroid3Url'
  | 'polaroid4Url'
  | 'igAccountImageUrl'
  | 'igInsightImageUrl'
  | 'tiktokAccountImageUrl'
  | 'tiktokInsightImageUrl';

const EDITOR_TABS: ReadonlyArray<{ id: EditorTab; label: string }> = [
  { id: 'identity', label: '1. Cover & Bio' },
  { id: 'insights', label: '2. Social Insight' },
  { id: 'rate', label: '3. Paket Rate' },
  { id: 'photos', label: '4. Foto & PNG' },
  { id: 'terms', label: '5. T&C' },
  { id: 'payment', label: '6. Payment' },
];

const PACKAGE_SECTIONS: ReadonlyArray<{
  label: string;
  titleKey: PackageTitleKey;
  listKey: PackageListKey;
}> = [
  { label: 'Slide 5 Kiri', titleKey: 'visitTitle', listKey: 'visitPackages' },
  { label: 'Slide 5 Kanan', titleKey: 'collaborationTitle', listKey: 'collaborationPackages' },
  { label: 'Slide 6 Kiri', titleKey: 'endorsementTitle', listKey: 'endorsementPackages' },
  { label: 'Slide 6 Kanan', titleKey: 'additionalTitle', listKey: 'additionalPackages' },
];

const INSIGHT_PHOTO_SLOTS: ReadonlyArray<{
  field: ImageFieldKey;
  defaultUrl: string;
  label: string;
  hint: string;
}> = [
  {
    field: 'igAccountImageUrl',
    defaultUrl: DEFAULT_IMAGES.igAccount,
    label: 'Akun Instagram',
    hint: 'Screenshot profil Instagram (Slide 3 kiri)',
  },
  {
    field: 'igInsightImageUrl',
    defaultUrl: DEFAULT_IMAGES.igInsight,
    label: 'Insight Instagram',
    hint: 'Screenshot insight / jangkauan Instagram (Slide 3 kanan)',
  },
  {
    field: 'tiktokAccountImageUrl',
    defaultUrl: DEFAULT_IMAGES.tiktokAccount,
    label: 'Akun TikTok',
    hint: 'Screenshot profil TikTok (Slide 4 kiri)',
  },
  {
    field: 'tiktokInsightImageUrl',
    defaultUrl: DEFAULT_IMAGES.tiktokInsight,
    label: 'Insight TikTok',
    hint: 'Screenshot metrik utama / insight TikTok (Slide 4 kanan)',
  },
];

const PORTFOLIO_PHOTO_SLOTS: ReadonlyArray<{
  field: ImageFieldKey;
  defaultUrl: string;
  label: string;
  hint: string;
}> = [
  {
    field: 'cutoutSlide1Url',
    defaultUrl: DEFAULT_IMAGES.cutoutSlide1,
    label: 'Cutout Slide 1 (Cover Kiri)',
    hint: 'PNG transparan tanpa background (IMG_7387)',
  },
  {
    field: 'cutoutSlide2Url',
    defaultUrl: DEFAULT_IMAGES.cutoutSlide2,
    label: 'Cutout Slide 2 (About Kanan)',
    hint: 'PNG transparan tanpa background (IMG_6077)',
  },
  {
    field: 'cutoutSlide7Url',
    defaultUrl: DEFAULT_IMAGES.cutoutSlide7,
    label: 'Cutout Slide 7 (T&C Kanan)',
    hint: 'PNG transparan tanpa background (IMG_1413)',
  },
  {
    field: 'polaroid1Url',
    defaultUrl: DEFAULT_IMAGES.polaroid1,
    label: 'Polaroid 1 (Cover Kiri)',
    hint: 'Foto kartu polaroid Slide 1 (IMG_6077)',
  },
  {
    field: 'polaroid2Url',
    defaultUrl: DEFAULT_IMAGES.polaroid2,
    label: 'Polaroid 2 (Cover Kanan & Slide 6)',
    hint: 'Foto kartu polaroid miring (IMG_1413)',
  },
  {
    field: 'polaroid3Url',
    defaultUrl: DEFAULT_IMAGES.polaroid3,
    label: 'Polaroid 3 (Lanyard Slide 2)',
    hint: 'Foto tergantung di klip lanyard (IMG_0241)',
  },
  {
    field: 'polaroid4Url',
    defaultUrl: DEFAULT_IMAGES.polaroid4,
    label: 'Polaroid 4 (Slide 5 Kanan)',
    hint: 'Foto kartu polaroid Slide 5 (IMG_7387)',
  },
];

export function RateCardGenerator() {
  const [data, setData] = useState<RateCardData>(DEFAULT_RATE_CARD_DATA);
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState<EditorTab>('identity');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  useEffect(() => {
    loadRateCardData().then((hydrated) => {
      setData(hydrated);
      setIsLoaded(true);
    });
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    void saveRateCardData(data);
  }, [data, isLoaded]);

  const updateField = <K extends keyof RateCardData>(field: K, value: RateCardData[K]): void => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddPackage = (listKey: PackageListKey): void => {
    setData((prev) => ({
      ...prev,
      [listKey]: [
        ...prev[listKey],
        { id: `${listKey}-${Date.now()}`, name: '', price: '', description: '' },
      ],
    }));
  };

  const handleRemovePackage = (listKey: PackageListKey, id: string): void => {
    setData((prev) => ({
      ...prev,
      [listKey]: prev[listKey].filter((item) => item.id !== id),
    }));
  };

  const handleUpdatePackage = (
    listKey: PackageListKey,
    id: string,
    field: keyof RatePackageItem,
    value: string,
  ): void => {
    setData((prev) => ({
      ...prev,
      [listKey]: prev[listKey].map((item) => (item.id === id ? { ...item, [field]: value } : item)),
    }));
  };

  const handleAddTerm = (listKey: TermListKey): void => {
    setData((prev) => ({
      ...prev,
      [listKey]: [...prev[listKey], { id: `${listKey}-${Date.now()}`, text: '' }],
    }));
  };

  const handleUpdateTerm = (listKey: TermListKey, id: string, value: string): void => {
    setData((prev) => ({
      ...prev,
      [listKey]: prev[listKey].map((item) => (item.id === id ? { ...item, text: value } : item)),
    }));
  };

  const handleRemoveTerm = (listKey: TermListKey, id: string): void => {
    setData((prev) => ({
      ...prev,
      [listKey]: prev[listKey].filter((item) => item.id !== id),
    }));
  };

  const handleImageUpload = async (field: ImageFieldKey, file?: File): Promise<void> => {
    if (!file) return;
    setIsUploadingImage(true);
    try {
      const dataUrl = await fileToCompressedDataUrl(file);
      updateField(field, dataUrl);
    } catch (error) {
      console.error('Failed to process image:', error);
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleDownloadPdf = async (): Promise<void> => {
    setIsGenerating(true);
    try {
      await generateRateCardPdf(data);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-start">
      <Card className="lg:col-span-5">
        <CardHeader className="flex flex-col gap-4 border-b pb-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <CardTitle className="text-[#232220] text-lg">Input Rate Card</CardTitle>
            <AlertDialog>
              <AlertDialogTrigger
                render={
                  <Button type="button" variant="outline" size="sm" className="h-8 text-xs">
                    <RotateCcw className="mr-1.5 h-3.5 w-3.5" /> Reset Default
                  </Button>
                }
              />
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Reset ke template default?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Semua perubahan teks, harga, dan foto akan dikembalikan ke template awal.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Batal</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => setData(DEFAULT_RATE_CARD_DATA)}
                    className="bg-[#E82C8A] text-white hover:bg-[#d1227a]"
                  >
                    Ya, Reset
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {EDITOR_TABS.map((tab) => (
              <Button
                key={tab.id}
                type="button"
                size="sm"
                variant={activeTab === tab.id ? 'default' : 'outline'}
                onClick={() => setActiveTab(tab.id)}
                className={
                  activeTab === tab.id
                    ? 'h-8 bg-[#1b3b2c] text-white text-xs hover:bg-[#1b3b2c]/90'
                    : 'h-8 text-slate-600 text-xs'
                }
              >
                {tab.label}
              </Button>
            ))}
          </div>
        </CardHeader>

        <CardContent className="flex flex-col gap-4 pt-5">
          {activeTab === 'identity' && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="rc-name" className="font-semibold text-xs uppercase">
                  Nama Lengkap (Script Pink)
                </label>
                <Input
                  id="rc-name"
                  value={data.name}
                  onChange={(e) => updateField('name', e.target.value)}
                  placeholder="Bella Rhema"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="rc-short" className="font-semibold text-xs uppercase">
                  Nama Panggilan (Slide 2: I&apos;M ...)
                </label>
                <Input
                  id="rc-short"
                  value={data.shortName}
                  onChange={(e) => updateField('shortName', e.target.value)}
                  placeholder="BELLA"
                />
              </div>
              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <label htmlFor="rc-tagline" className="font-semibold text-xs uppercase">
                  Tagline / Niche (Slide 1)
                </label>
                <Input
                  id="rc-tagline"
                  value={data.tagline}
                  onChange={(e) => updateField('tagline', e.target.value)}
                  placeholder="TRAVELING • LIFESTYLE • RUNNING • CONTENT CREATOR"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="rc-ig" className="font-semibold text-xs uppercase">
                  Instagram Handle
                </label>
                <Input
                  id="rc-ig"
                  value={data.instagramHandle}
                  onChange={(e) => updateField('instagramHandle', e.target.value)}
                  placeholder="@bellarhemaagnesia"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="rc-tt" className="font-semibold text-xs uppercase">
                  TikTok Handle
                </label>
                <Input
                  id="rc-tt"
                  value={data.tiktokHandle}
                  onChange={(e) => updateField('tiktokHandle', e.target.value)}
                  placeholder="@bellarhemaagnesiaa"
                />
              </div>
              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <label htmlFor="rc-bio" className="font-semibold text-xs uppercase">
                  About / Bio Singkat (Slide 2)
                </label>
                <Textarea
                  id="rc-bio"
                  value={data.bio}
                  onChange={(e) => updateField('bio', e.target.value)}
                  rows={4}
                  placeholder="Ceritakan profil dan fokus konten Anda..."
                />
              </div>
            </div>
          )}

          {activeTab === 'insights' && (
            <div className="flex flex-col gap-3">
              {INSIGHT_PHOTO_SLOTS.map((slot) => (
                <PhotoSlotCard
                  key={slot.field}
                  label={slot.label}
                  hint={slot.hint}
                  imageUrl={data[slot.field]}
                  defaultUrl={slot.defaultUrl}
                  isUploading={isUploadingImage}
                  onUpload={(file) => handleImageUpload(slot.field, file)}
                  onReset={() => updateField(slot.field, slot.defaultUrl)}
                />
              ))}
            </div>
          )}

          {activeTab === 'rate' && (
            <div className="flex flex-col gap-4">
              {PACKAGE_SECTIONS.map((section) => (
                <PackageSectionEditor
                  key={section.listKey}
                  sectionLabel={section.label}
                  title={data[section.titleKey]}
                  items={data[section.listKey]}
                  onTitleChange={(val) => updateField(section.titleKey, val)}
                  onAddItem={() => handleAddPackage(section.listKey)}
                  onRemoveItem={(id) => handleRemovePackage(section.listKey, id)}
                  onUpdateItem={(id, field, val) =>
                    handleUpdatePackage(section.listKey, id, field, val)
                  }
                />
              ))}
            </div>
          )}

          {activeTab === 'photos' && (
            <div className="flex flex-col gap-3">
              {PORTFOLIO_PHOTO_SLOTS.map((slot) => (
                <PhotoSlotCard
                  key={slot.field}
                  label={slot.label}
                  hint={slot.hint}
                  imageUrl={data[slot.field]}
                  defaultUrl={slot.defaultUrl}
                  isUploading={isUploadingImage}
                  onUpload={(file) => handleImageUpload(slot.field, file)}
                  onReset={() => updateField(slot.field, slot.defaultUrl)}
                />
              ))}
            </div>
          )}

          {activeTab === 'terms' && (
            <div className="flex flex-col gap-4">
              <TermListEditor
                label="TERM & CONDITION — ENDORSEMENT"
                terms={data.endorsementTerms}
                onAdd={() => handleAddTerm('endorsementTerms')}
                onUpdate={(id, val) => handleUpdateTerm('endorsementTerms', id, val)}
                onRemove={(id) => handleRemoveTerm('endorsementTerms', id)}
              />
              <TermListEditor
                label="TERM & CONDITION — VISIT"
                terms={data.visitTerms}
                onAdd={() => handleAddTerm('visitTerms')}
                onUpdate={(id, val) => handleUpdateTerm('visitTerms', id, val)}
                onRemove={(id) => handleRemoveTerm('visitTerms', id)}
              />
            </div>
          )}

          {activeTab === 'payment' && (
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-1 gap-3 rounded-lg border border-slate-200 bg-slate-50/60 p-4 sm:grid-cols-3">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="rc-phone" className="font-semibold text-xs uppercase">
                    WhatsApp / Telp
                  </label>
                  <Input
                    id="rc-phone"
                    value={data.phone}
                    onChange={(e) => updateField('phone', e.target.value)}
                    className="bg-white"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="rc-email" className="font-semibold text-xs uppercase">
                    Email
                  </label>
                  <Input
                    id="rc-email"
                    type="email"
                    value={data.email}
                    onChange={(e) => updateField('email', e.target.value)}
                    className="bg-white"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="rc-loc" className="font-semibold text-xs uppercase">
                    Lokasi
                  </label>
                  <Input
                    id="rc-loc"
                    value={data.location}
                    onChange={(e) => updateField('location', e.target.value)}
                    className="bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 rounded-lg border border-slate-200 bg-slate-50/60 p-4 sm:grid-cols-3">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="rc-bank" className="font-semibold text-xs uppercase">
                    Nama Bank
                  </label>
                  <Input
                    id="rc-bank"
                    value={data.bankName}
                    onChange={(e) => updateField('bankName', e.target.value)}
                    className="bg-white"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="rc-account" className="font-semibold text-xs uppercase">
                    No. Rekening
                  </label>
                  <Input
                    id="rc-account"
                    value={data.accountNumber}
                    onChange={(e) => updateField('accountNumber', e.target.value)}
                    className="bg-white"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="rc-holder" className="font-semibold text-xs uppercase">
                    Atas Nama
                  </label>
                  <Input
                    id="rc-holder"
                    value={data.accountHolder}
                    onChange={(e) => updateField('accountHolder', e.target.value)}
                    className="bg-white"
                  />
                </div>
              </div>

              <TermListEditor
                label="KETENTUAN PEMBAYARAN (TERM OF PAYMENT)"
                terms={data.paymentTerms}
                onAdd={() => handleAddTerm('paymentTerms')}
                onUpdate={(id, val) => handleUpdateTerm('paymentTerms', id, val)}
                onRemove={(id) => handleRemoveTerm('paymentTerms', id)}
              />
            </div>
          )}
        </CardContent>

        <CardFooter className="flex justify-end border-t pt-4 pb-6">
          <Button
            type="button"
            size="lg"
            disabled={isGenerating}
            onClick={handleDownloadPdf}
            className="w-full bg-[#1b3b2c] text-white hover:bg-[#1b3b2c]/90 sm:w-auto"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Membuat PDF...
              </>
            ) : (
              <>
                <Download className="mr-2 h-5 w-5" /> Generate &amp; Download PDF (8 Slide)
              </>
            )}
          </Button>
        </CardFooter>
      </Card>

      <div className="lg:sticky lg:top-20 lg:col-span-7">
        <Card className="p-4 sm:p-5">
          <RateCardPreview data={data} />
        </Card>
      </div>
    </div>
  );
}
