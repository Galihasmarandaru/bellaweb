import { Link } from '@tanstack/react-router';
import { Heart } from 'lucide-react';
import { useState } from 'react';
import { Footer, SearchAutocomplete } from '@/components/shared';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useCategories } from '../../category/hooks/useCategory.ts';
import type { Category } from '../../category/types/category.types';
import { useSpills } from '../hooks/useSpill.ts';
import type { Spill as SpillType } from '../types/spill.types.ts';

export function Spill() {
  const { data: categories, isLoading: isCatLoading, isError: isCatError } = useCategories('spill');
  const { data: spills, isLoading: isSpillsLoading, isError: isSpillsError } = useSpills();
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [selectedSearchItem, setSelectedSearchItem] = useState<{ id: string } | null>(null);

  const isLoading = isCatLoading || isSpillsLoading;
  const isError = isCatError || isSpillsError;

  const hasFavourites = spills?.some((a: SpillType) => a.is_favourite);
  const activeCategoryIds = new Set(spills?.map((a: SpillType) => a.category_id).filter(Boolean));
  const activeCategories =
    categories?.filter((category: Category) => activeCategoryIds.has(category.id)) || [];

  const filteredSpills =
    selectedCategoryId === 'favourite'
      ? spills?.filter((a: SpillType) => a.is_favourite)
      : selectedCategoryId
        ? spills?.filter((a: SpillType) => a.category_id === selectedCategoryId)
        : spills;

  const displaySpills = selectedSearchItem
    ? spills?.filter((a: SpillType) => a.id === selectedSearchItem.id)
    : filteredSpills;

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 font-sans">
      <div className="w-full bg-white shadow-sm sticky top-0 z-20">
        <div className="mx-auto flex w-full max-w-3xl items-center justify-between gap-4 px-5 py-4">
          <Link
            to="/"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white shadow-sm hover:bg-slate-50 transition-colors shrink-0"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-[#1b3b2c]"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
          </Link>
          <h1
            className="font-bold font-serif text-[24px] md:text-3xl text-[#1b3b2c] italic leading-tight text-right"
            style={{ fontFamily: '"Playfair Display", "Times New Roman", serif' }}
          >
            Rekomendasi Barang
          </h1>
        </div>
      </div>
      <div className="mx-auto flex w-full max-w-3xl grow flex-col bg-[#F8FAFC]">
        <div className="px-5 mt-8 mb-8 flex justify-center">
          <SearchAutocomplete
            placeholder="Cari nama barang..."
            items={
              spills?.map((a: SpillType) => ({
                id: a.id,
                title: a.nama_item,
                is_favourite: a.is_favourite,
              })) || []
            }
            className="w-full max-w-[340px]"
            onSelect={(item) => setSelectedSearchItem(item)}
            onClear={() => setSelectedSearchItem(null)}
          />
        </div>

        <div className="grow px-5 py-2">
          {/* Categories Tab Bar */}
          {!selectedSearchItem && activeCategories.length > 0 && (
            <div className="flex w-full overflow-x-auto gap-2 pb-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              <Button
                variant={selectedCategoryId === null ? 'default' : 'outline'}
                onClick={() => setSelectedCategoryId(null)}
                className={`shrink-0 rounded-full px-6 shadow-sm ${selectedCategoryId === null ? 'bg-[#1b3b2c] text-white hover:bg-[#1b3b2c]/90' : 'border-[#1b3b2c]/20 text-[#1b3b2c] hover:bg-[#1b3b2c]/5'}`}
              >
                Semua
              </Button>
              {hasFavourites && (
                <Button
                  variant={selectedCategoryId === 'favourite' ? 'default' : 'outline'}
                  onClick={() => setSelectedCategoryId('favourite')}
                  className={`shrink-0 rounded-full px-6 shadow-sm ${selectedCategoryId === 'favourite' ? 'bg-[#1b3b2c] text-white hover:bg-[#1b3b2c]/90' : 'border-[#1b3b2c]/20 text-[#1b3b2c] hover:bg-[#1b3b2c]/5'}`}
                >
                  <Heart
                    className={`mr-2 h-4 w-4 ${selectedCategoryId === 'favourite' ? 'fill-white' : 'fill-[#1b3b2c] text-[#1b3b2c]'}`}
                  />{' '}
                  Favourite
                </Button>
              )}
              {activeCategories.map((category: Category) => (
                <Button
                  key={category.id}
                  variant={selectedCategoryId === category.id ? 'default' : 'outline'}
                  onClick={() => setSelectedCategoryId(category.id)}
                  className={`shrink-0 rounded-full px-6 shadow-sm ${selectedCategoryId === category.id ? 'bg-[#1b3b2c] text-white hover:bg-[#1b3b2c]/90' : 'border-[#1b3b2c]/20 text-[#1b3b2c] hover:bg-[#1b3b2c]/5'}`}
                >
                  {category.name}
                </Button>
              ))}
            </div>
          )}

          {isLoading ? (
            <div className="mb-10 grid grid-cols-2 gap-4 sm:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card
                  key={i}
                  className="overflow-hidden rounded-[20px] border-slate-100 p-0 shadow-sm"
                >
                  <Skeleton className="h-56 w-full rounded-none" />
                  <CardContent className="p-5">
                    <Skeleton className="h-6 w-3/4 mb-4" />
                    <Skeleton className="h-4 w-full mb-4" />
                    <Skeleton className="h-4 w-1/2 mb-5" />
                    <div className="flex gap-2">
                      <Skeleton className="h-10 w-full" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : isError ? (
            <div className="flex flex-col items-center justify-center py-10">
              <p className="text-red-500">Gagal memuat data spill link.</p>
            </div>
          ) : displaySpills && displaySpills.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10">
              <p className="text-slate-500">Belum ada item di kategori ini.</p>
            </div>
          ) : (
            <div
              className={`mb-10 grid grid-cols-2 gap-4 sm:grid-cols-3 ${selectedSearchItem ? 'max-w-md mx-auto' : ''}`}
            >
              {displaySpills?.map((item: SpillType) => (
                <Card
                  key={item.id}
                  className="overflow-hidden rounded-[20px] border-slate-100 p-0 gap-0 shadow-sm transition-transform hover:scale-[1.01]"
                >
                  {/* Card Image */}
                  <div className="relative h-56 w-full overflow-hidden bg-slate-200">
                    {item.image_url ? (
                      <img
                        src={item.image_url}
                        alt={item.nama_item}
                        className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-slate-400">
                        No Image
                      </div>
                    )}
                    {item.is_favourite && (
                      <div className="absolute top-3 right-3 rounded-full bg-white/90 p-1.5 shadow-sm backdrop-blur-sm">
                        <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                      </div>
                    )}
                  </div>

                  {/* Card Body */}
                  <CardContent className="p-4 flex flex-col h-[calc(100%-14rem)]">
                    <h3 className="mb-1.5 font-extrabold text-[#1A3B2B] text-lg leading-tight line-clamp-2">
                      {item.nama_item}
                    </h3>
                    {item.description ? (
                      <p className="mb-5 font-serif text-[13px] italic text-[#1A3B2B]/70 line-clamp-2">
                        "{item.description}"
                      </p>
                    ) : (
                      <div className="mb-5" />
                    )}

                    <div className="mt-auto">
                      <div className="flex w-full items-center gap-2">
                        <a
                          href={item.detail_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full block"
                        >
                          <Button className="h-auto w-full rounded-lg border border-[#1A3B2B] bg-transparent py-2.5 text-[13px] font-medium text-[#1A3B2B] shadow-none transition-colors hover:bg-[#1A3B2B]/5">
                            Lihat Detail
                          </Button>
                        </a>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        <Footer className="mx-auto mb-8" />
      </div>
    </div>
  );
}
