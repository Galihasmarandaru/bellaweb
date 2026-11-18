import { type ReactNode, useState } from 'react';
import { Button } from '@/components/ui/button';
import type {
  RateCardData,
  RatePackageItem,
  RateTermItem,
  SocialHandles,
} from '../types/rateCard.types';
import { DualCardsSvg, LanyardClipSvg, LanyardTopRightSvg } from './RateCardSvgGraphics';

interface RateCardPreviewProps {
  data: RateCardData;
}

type PreviewPageFilter = 'all' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8';

const DISPLAY_FONT = '"Montserrat", sans-serif';
const SCRIPT_FONT = '"Caveat", cursive';
const BODY_FONT = '"Plus Jakarta Sans", sans-serif';

const PREVIEW_TABS: ReadonlyArray<{ id: PreviewPageFilter; label: string }> = [
  { id: 'all', label: 'Semua' },
  { id: '1', label: '1. Cover' },
  { id: '2', label: '2. About' },
  { id: '3', label: '3. Instagram' },
  { id: '4', label: '4. TikTok' },
  { id: '5', label: '5. Visit & Collab' },
  { id: '6', label: '6. Endorse & Add' },
  { id: '7', label: '7. T&C' },
  { id: '8', label: '8. Payment' },
];

function SlideSocialFooter({ social }: { social: SocialHandles }) {
  return (
    <div className="relative z-20 flex shrink-0 items-center justify-between px-4 pb-2 font-bold text-[#232220] text-[7px] uppercase tracking-wide sm:text-[8px]">
      <span>
        {social.instagramHandle.trim() ? `INSTAGRAM | ${social.instagramHandle.trim()}` : ''}
      </span>
      <span>{social.tiktokHandle.trim() ? `TIKTOK | ${social.tiktokHandle.trim()}` : ''}</span>
    </div>
  );
}

function PolaroidCard({
  src,
  alt,
  className = '',
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  if (!src) return null;
  return (
    <div
      className={`border border-black/10 bg-white p-1.5 pb-4 shadow-[0_6px_16px_rgba(0,0,0,0.18)] ${className}`}
    >
      <div className="aspect-[1/1.05] w-full overflow-hidden bg-slate-100">
        <img src={src} alt={alt} className="h-full w-full object-cover" />
      </div>
    </div>
  );
}

function PaperRibbons() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute -bottom-12 -left-10 h-28 w-44 rounded-full bg-[#EFEFEA]" />
      <div className="absolute -right-10 -bottom-12 h-36 w-52 rounded-full bg-[#EFEFEA]" />
    </div>
  );
}

function RateCardSlideFrame({
  social,
  tintedBand = false,
  children,
}: {
  social: SocialHandles;
  tintedBand?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="relative mx-auto aspect-[16/9] w-full overflow-hidden rounded-lg border border-slate-200 bg-[#F8F8F6] shadow-md">
      <PaperRibbons />
      {tintedBand ? (
        <div className="pointer-events-none absolute inset-x-0 top-9 bottom-7 bg-[#EFEFEA]" />
      ) : null}
      <div className="absolute inset-0 z-20 flex flex-col justify-between">
        {children}
        <SlideSocialFooter social={social} />
      </div>
    </div>
  );
}

function SpaciousRateCardBox({
  title,
  items,
  badgeClass,
}: {
  title: string;
  items: RatePackageItem[];
  badgeClass: string;
}) {
  return (
    <div className="rounded-md border border-[#232220] bg-white p-2.5 sm:p-3">
      <div
        className={`mb-2 inline-flex rounded px-3 py-0.5 font-bold text-[8.5px] text-white uppercase tracking-wider sm:text-[9.5px] ${badgeClass}`}
      >
        {title || 'CATEGORY'}
      </div>
      <div className="flex flex-col divide-y divide-[#E5E3DC]">
        {items.map((item) => {
          if (!item.name.trim() && !item.price.trim()) return null;
          return (
            <div
              key={item.id}
              className="flex items-start justify-between gap-6 py-1.5 first:pt-0 last:pb-0"
            >
              <div className="min-w-0 flex-1 pr-2">
                <p className="font-bold text-[#232220] text-[9.5px] leading-snug sm:text-[11px]">
                  {item.name || '-'}
                </p>
                {item.description?.trim() ? (
                  <p className="mt-0.5 text-[#5F5C58] text-[7.5px] leading-snug sm:text-[8.5px]">
                    {item.description}
                  </p>
                ) : null}
              </div>
              <span className="shrink-0 text-right font-extrabold text-[#E82C8A] text-[10px] leading-snug sm:text-xs">
                {item.price}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function RateCardPackagesSlide({
  leftTitle,
  leftItems,
  leftBadgeClass,
  rightTitle,
  rightItems,
  rightBadgeClass,
  polaroidSrc,
  polaroidClassName,
  social,
}: {
  leftTitle: string;
  leftItems: RatePackageItem[];
  leftBadgeClass: string;
  rightTitle: string;
  rightItems: RatePackageItem[];
  rightBadgeClass: string;
  polaroidSrc: string;
  polaroidClassName: string;
  social: SocialHandles;
}) {
  return (
    <RateCardSlideFrame social={social}>
      <div className="flex min-h-0 flex-1 flex-col px-4 pt-3 pb-1">
        <div className="mb-2 flex shrink-0 items-baseline justify-between">
          <div className="flex items-baseline gap-2">
            <h2
              className="font-black text-[#232220] text-xl sm:text-2xl"
              style={{ fontFamily: DISPLAY_FONT }}
            >
              RATE
            </h2>
            <span
              className="text-2xl text-[#E82C8A] leading-none sm:text-3xl"
              style={{ fontFamily: SCRIPT_FONT }}
            >
              Card
            </span>
          </div>
          <span className="font-bold text-[#5F5C58] text-[7.5px] uppercase tracking-wider">
            {leftTitle} &amp; {rightTitle}
          </span>
        </div>

        <div className="grid min-h-0 flex-1 grid-cols-12 items-start gap-3">
          <div className="col-span-7 min-h-0">
            <SpaciousRateCardBox title={leftTitle} items={leftItems} badgeClass={leftBadgeClass} />
          </div>
          <div className="col-span-5 flex min-h-0 flex-col gap-2">
            <SpaciousRateCardBox
              title={rightTitle}
              items={rightItems}
              badgeClass={rightBadgeClass}
            />
            <PolaroidCard
              src={polaroidSrc}
              alt={`${rightTitle} polaroid`}
              className={`mr-2 ml-auto w-[26%] shrink-0 ${polaroidClassName}`}
            />
          </div>
        </div>
      </div>
    </RateCardSlideFrame>
  );
}

function PlatformInsightSlide({
  platformTitle,
  handleText,
  accountLabel,
  accountSrc,
  insightLabel,
  insightSrc,
  social,
  tintedBg = false,
}: {
  platformTitle: string;
  handleText: string;
  accountLabel: string;
  accountSrc: string;
  insightLabel: string;
  insightSrc: string;
  social: SocialHandles;
  tintedBg?: boolean;
}) {
  const columns = [
    {
      key: accountLabel,
      label: accountLabel,
      src: accountSrc,
      colSpan: 'col-span-7',
      badgeClass: 'bg-[#232220]',
    },
    {
      key: insightLabel,
      label: insightLabel,
      src: insightSrc,
      colSpan: 'col-span-5',
      badgeClass: 'bg-[#E82C8A]',
    },
  ] as const;

  return (
    <RateCardSlideFrame social={social} tintedBand={tintedBg}>
      <div className="flex min-h-0 flex-1 flex-col px-4 pt-2.5 pb-1.5">
        <div className="mb-2 flex shrink-0 items-baseline justify-between">
          <div className="flex items-baseline gap-2">
            <h2
              className="font-black text-[#232220] text-lg sm:text-2xl"
              style={{ fontFamily: DISPLAY_FONT }}
            >
              {platformTitle}
            </h2>
            <span
              className="text-2xl text-[#E82C8A] leading-none sm:text-3xl"
              style={{ fontFamily: SCRIPT_FONT }}
            >
              Insight
            </span>
          </div>
          <span className="font-bold text-[#5F5C58] text-[7.5px] uppercase tracking-wider">
            {handleText}
          </span>
        </div>

        <div className="grid min-h-0 flex-1 grid-cols-12 gap-3">
          {columns.map((col) => (
            <div
              key={col.key}
              className={`${col.colSpan} flex min-h-0 flex-col items-center gap-1.5`}
            >
              <div
                className={`inline-flex shrink-0 rounded-full px-4 py-0.5 font-bold text-[7.5px] text-white uppercase tracking-wider sm:text-[8.5px] ${col.badgeClass}`}
              >
                {col.label}
              </div>
              <div className="relative min-h-0 w-full flex-1">
                {col.src ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <img
                      src={col.src}
                      alt={col.label}
                      className="max-h-full max-w-full rounded-md border border-[#232220] bg-white object-contain p-1 shadow-xs"
                    />
                  </div>
                ) : (
                  <div className="flex h-full w-full items-center justify-center rounded-md border border-[#232220] bg-white text-[8px] text-slate-400">
                    Belum diupload
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </RateCardSlideFrame>
  );
}

function TermListPreviewColumn({
  badgeLabel,
  badgeClass,
  dotClass,
  terms,
}: {
  badgeLabel: string;
  badgeClass: string;
  dotClass: string;
  terms: RateTermItem[];
}) {
  return (
    <div className="min-h-0">
      <div
        className={`mb-1 inline-flex rounded px-2.5 py-0.5 font-bold text-[7px] text-white uppercase tracking-wider ${badgeClass}`}
      >
        {badgeLabel}
      </div>
      <ul className="flex flex-col gap-[1.5px] text-[#232220] text-[5.8px] leading-[1.2] sm:text-[6.4px]">
        {terms.map((term) =>
          term.text.trim() ? (
            <li key={term.id} className="flex items-start gap-1.5">
              <span className={`mt-[3px] h-1 w-1 shrink-0 rounded-full ${dotClass}`} />
              <span>{term.text}</span>
            </li>
          ) : null,
        )}
      </ul>
    </div>
  );
}

export function RateCardPreview({ data }: RateCardPreviewProps) {
  const [activePage, setActivePage] = useState<PreviewPageFilter>('all');

  const displayName = data.name.trim() || 'Bella Rhema Agnesia';
  const shortName = (data.shortName.trim() || displayName).toUpperCase();
  const social: SocialHandles = {
    instagramHandle: data.instagramHandle,
    tiktokHandle: data.tiktokHandle,
  };

  return (
    <div className="flex flex-col gap-4" style={{ fontFamily: BODY_FONT }}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="font-semibold text-slate-700 text-sm">Live Preview (8 Slide 16:9)</span>
        <div className="flex flex-wrap gap-1.5">
          {PREVIEW_TABS.map((tab) => (
            <Button
              key={tab.id}
              type="button"
              size="sm"
              variant={activePage === tab.id ? 'default' : 'outline'}
              onClick={() => setActivePage(tab.id)}
              className={
                activePage === tab.id
                  ? 'h-8 bg-[#E82C8A] text-white text-xs hover:bg-[#d1227a]'
                  : 'h-8 text-xs'
              }
            >
              {tab.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-5">
        {/* SLIDE 1: COVER RATE CARD */}
        {(activePage === 'all' || activePage === '1') && (
          <RateCardSlideFrame social={social}>
            <LanyardTopRightSvg className="pointer-events-none absolute top-0 right-1 z-40 h-16 w-10" />

            {data.cutoutSlide1Url ? (
              <img
                src={data.cutoutSlide1Url}
                alt={displayName}
                className="pointer-events-none absolute bottom-0 left-1 z-10 h-[95%] w-auto object-contain"
              />
            ) : null}

            <PolaroidCard
              src={data.polaroid1Url}
              alt="Polaroid 1"
              className="absolute bottom-6 left-2 z-20 w-[20%] -rotate-6"
            />

            <div className="relative z-20 my-auto ml-[31%] flex w-[36%] flex-col items-center text-center">
              <h2
                className="font-black text-4xl text-[#232220] tracking-tight sm:text-5xl"
                style={{ fontFamily: DISPLAY_FONT }}
              >
                RATE
              </h2>
              <span
                className="-mt-3.5 -rotate-3 text-4xl text-[#E82C8A] leading-none sm:-mt-4.5 sm:text-5xl"
                style={{ fontFamily: SCRIPT_FONT }}
              >
                Card
              </span>
              <div className="mt-1.5 inline-flex max-w-full rounded-full bg-[#232220] px-3 py-0.5 font-bold text-[8.5px] text-white tracking-wider sm:text-[10px]">
                <span className="truncate">{displayName}</span>
              </div>
              <p className="mt-2 max-w-[95%] font-bold text-[#232220] text-[6.5px] uppercase tracking-wider sm:text-[8px]">
                {data.tagline || 'CONTENT CREATOR'}
              </p>
            </div>

            <PolaroidCard
              src={data.coverPhoto3Url}
              alt="Cover Foto 3"
              className="absolute top-3 right-[14.5%] z-10 w-[18.5%] -rotate-6"
            />
            <PolaroidCard
              src={data.coverPhoto4Url}
              alt="Cover Foto 4"
              className="absolute top-5 right-2 z-20 w-[18.5%] rotate-6"
            />
            <PolaroidCard
              src={data.polaroid2Url}
              alt="Polaroid 2"
              className="absolute right-[7.5%] bottom-6 z-30 w-[20%] rotate-2"
            />
          </RateCardSlideFrame>
        )}

        {/* SLIDE 2: ABOUT ME + LANYARD + CUTOUT */}
        {(activePage === 'all' || activePage === '2') && (
          <RateCardSlideFrame social={social}>
            <LanyardClipSvg className="pointer-events-none absolute top-0 left-[41%] z-30 h-28 w-20" />

            <PolaroidCard
              src={data.polaroid3Url}
              alt="Lanyard Polaroid"
              className="absolute top-[36%] left-[44%] z-20 w-[20%] -rotate-3"
            />

            {data.cutoutSlide2Url ? (
              <img
                src={data.cutoutSlide2Url}
                alt={displayName}
                className="pointer-events-none absolute right-2 bottom-0 z-10 h-[88%] w-auto object-contain"
              />
            ) : null}

            <div className="relative z-20 my-auto flex w-[42%] flex-col pl-5 sm:pl-7">
              <span
                className="-mb-2 -rotate-3 text-3xl text-[#E82C8A] leading-none sm:text-4xl"
                style={{ fontFamily: SCRIPT_FONT }}
              >
                Hi there!
              </span>
              <h2
                className="font-black text-3xl text-[#232220] leading-[0.9] tracking-tight sm:text-4xl"
                style={{ fontFamily: DISPLAY_FONT }}
              >
                I&apos;M
                <span className="block truncate">{shortName}</span>
              </h2>
              {data.bio.trim() ? (
                <p className="mt-3 whitespace-pre-line text-[#232220] text-[7.5px] leading-relaxed sm:text-[8.5px]">
                  {data.bio.trim()}
                </p>
              ) : null}
            </div>
          </RateCardSlideFrame>
        )}

        {/* SLIDE 3: INSTAGRAM INSIGHT */}
        {(activePage === 'all' || activePage === '3') && (
          <PlatformInsightSlide
            platformTitle="INSTAGRAM"
            handleText={data.instagramHandle}
            accountLabel="AKUN INSTAGRAM"
            accountSrc={data.igAccountImageUrl}
            insightLabel="INSIGHT INSTAGRAM"
            insightSrc={data.igInsightImageUrl}
            social={social}
          />
        )}

        {/* SLIDE 4: TIKTOK INSIGHT */}
        {(activePage === 'all' || activePage === '4') && (
          <PlatformInsightSlide
            platformTitle="TIKTOK"
            handleText={data.tiktokHandle}
            accountLabel="AKUN TIKTOK"
            accountSrc={data.tiktokAccountImageUrl}
            insightLabel="INSIGHT TIKTOK"
            insightSrc={data.tiktokInsightImageUrl}
            social={social}
            tintedBg
          />
        )}

        {/* SLIDE 5: RATE CARD — VISIT & COLLABORATION */}
        {(activePage === 'all' || activePage === '5') && (
          <RateCardPackagesSlide
            leftTitle={data.visitTitle}
            leftItems={data.visitPackages}
            leftBadgeClass="bg-[#232220]"
            rightTitle={data.collaborationTitle}
            rightItems={data.collaborationPackages}
            rightBadgeClass="bg-[#E82C8A]"
            polaroidSrc={data.polaroid4Url}
            polaroidClassName="rotate-3"
            social={social}
          />
        )}

        {/* SLIDE 6: RATE CARD — ENDORSEMENT & ADDITIONAL */}
        {(activePage === 'all' || activePage === '6') && (
          <RateCardPackagesSlide
            leftTitle={data.endorsementTitle}
            leftItems={data.endorsementPackages}
            leftBadgeClass="bg-[#E82C8A]"
            rightTitle={data.additionalTitle}
            rightItems={data.additionalPackages}
            rightBadgeClass="bg-[#232220]"
            polaroidSrc={data.polaroid2Url}
            polaroidClassName="-rotate-3"
            social={social}
          />
        )}

        {/* SLIDE 7: TERM & CONDITION + CUTOUT */}
        {(activePage === 'all' || activePage === '7') && (
          <RateCardSlideFrame social={social}>
            {data.cutoutSlide7Url ? (
              <img
                src={data.cutoutSlide7Url}
                alt={displayName}
                className="pointer-events-none absolute right-2 bottom-0 z-10 h-[84%] w-auto object-contain"
              />
            ) : null}

            <div className="relative z-20 flex min-h-0 flex-1 flex-col px-5 pt-2.5 pb-1">
              <div className="mb-1.5 flex shrink-0 items-baseline gap-2">
                <h2
                  className="font-black text-[#232220] text-xl sm:text-2xl"
                  style={{ fontFamily: DISPLAY_FONT }}
                >
                  TERM &amp;
                </h2>
                <span
                  className="text-2xl text-[#E82C8A] leading-none sm:text-3xl"
                  style={{ fontFamily: SCRIPT_FONT }}
                >
                  Condition
                </span>
              </div>

              <div className="grid min-h-0 w-[76%] flex-1 grid-cols-2 gap-3">
                <TermListPreviewColumn
                  badgeLabel="ENDORSEMENT"
                  badgeClass="bg-[#232220]"
                  dotClass="bg-[#232220]"
                  terms={data.endorsementTerms}
                />
                <TermListPreviewColumn
                  badgeLabel="VISIT"
                  badgeClass="bg-[#E82C8A]"
                  dotClass="bg-[#E82C8A]"
                  terms={data.visitTerms}
                />
              </div>
            </div>
          </RateCardSlideFrame>
        )}

        {/* SLIDE 8: TERM OF PAYMENT & CONTACT */}
        {(activePage === 'all' || activePage === '8') && (
          <RateCardSlideFrame social={social}>
            <div className="flex min-h-0 flex-1 flex-col px-5 pt-3 pb-1">
              <div className="mb-3 flex shrink-0 items-baseline gap-2">
                <h2
                  className="font-black text-[#232220] text-xl sm:text-2xl"
                  style={{ fontFamily: DISPLAY_FONT }}
                >
                  TERM OF
                </h2>
                <span
                  className="text-2xl text-[#E82C8A] leading-none sm:text-3xl"
                  style={{ fontFamily: SCRIPT_FONT }}
                >
                  Payment
                </span>
              </div>

              <div className="grid min-h-0 flex-1 grid-cols-12 items-start gap-4 pb-2">
                <div className="col-span-5 rounded-md border border-[#232220] bg-white p-3">
                  <div className="mb-2.5 inline-flex rounded bg-[#232220] px-2.5 py-0.5 font-bold text-[7.5px] text-white uppercase tracking-wider">
                    CONTACT &amp; BOOKING
                  </div>
                  <div className="flex flex-col gap-1.5 text-[7.5px] sm:text-[8px]">
                    <div>
                      <span className="block font-bold text-[#E82C8A] text-[6.5px] uppercase">
                        WHATSAPP
                      </span>
                      <span className="font-bold text-[#232220]">{data.phone || '-'}</span>
                    </div>
                    <div>
                      <span className="block font-bold text-[#E82C8A] text-[6.5px] uppercase">
                        E-MAIL
                      </span>
                      <span className="font-bold text-[#232220]">{data.email || '-'}</span>
                    </div>
                    <div>
                      <span className="block font-bold text-[#E82C8A] text-[6.5px] uppercase">
                        INSTAGRAM / TIKTOK
                      </span>
                      <span className="font-bold text-[#232220]">
                        {data.instagramHandle || '-'} / {data.tiktokHandle || '-'}
                      </span>
                    </div>
                    <div>
                      <span className="block font-bold text-[#E82C8A] text-[6.5px] uppercase">
                        LOKASI
                      </span>
                      <span className="font-bold text-[#232220]">{data.location || '-'}</span>
                    </div>
                  </div>
                </div>

                <div className="col-span-7 flex flex-col gap-3">
                  <div className="flex flex-col items-center rounded-md border border-[#232220] bg-white px-4 py-3 text-center shadow-[4px_4px_0_#E82C8A]">
                    <DualCardsSvg className="mb-1.5 h-10 w-12" />
                    <p className="font-extrabold text-[#232220] text-sm uppercase tracking-wide sm:text-base">
                      {data.bankName || 'BCA'} {data.accountNumber || '-'}
                    </p>
                    <p className="font-bold text-[#E82C8A] text-xs uppercase tracking-wide">
                      {data.accountHolder || '-'}
                    </p>
                  </div>

                  <div className="rounded-md border border-[#232220] bg-[#EFEFEA] px-3 py-2.5">
                    <ul className="flex flex-col gap-1 font-bold text-[#232220] text-[7.5px] uppercase sm:text-[8px]">
                      {data.paymentTerms.map((term) =>
                        term.text.trim() ? (
                          <li key={term.id} className="flex items-start gap-2">
                            <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#E82C8A]" />
                            <span>{term.text}</span>
                          </li>
                        ) : null,
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </RateCardSlideFrame>
        )}
      </div>
    </div>
  );
}
