import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from '@/components/ui/command';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from '@tanstack/react-form';
import imageCompression from 'browser-image-compression';
import { CheckCircle2, ChevronDown, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { CategoryFormDialog } from '../../category/components/CategoryFormDialog.tsx';
import { useCategories } from '../../category/hooks/useCategory.ts';
import { useCreateAccomodation, useUpdateAccomodation, useUploadAccomodationImage } from '../hooks/useAccomodation.ts';
import { accomodationSchema } from '../schemas/accomodationSchema.ts';
import { accomodationService } from '../services/accomodationService.ts';
import type { Accomodation, CreateAccomodationPayload } from '../types/accomodation.types.ts';

interface AccomodationFormProps {
  initialData?: Accomodation;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function AccomodationForm({ initialData, onSuccess, onCancel }: AccomodationFormProps) {
  const createMutation = useCreateAccomodation();
  const updateMutation = useUpdateAccomodation();
  const uploadMutation = useUploadAccomodationImage();

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageError, setImageError] = useState('');
  const [isCompressing, setIsCompressing] = useState(false);
  const [isCompressed, setIsCompressed] = useState(false);

  const { data: categories = [], isLoading: isLoadingCategories } = useCategories('accomodation');
  const [openCategory, setOpenCategory] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialData?.category_id || "");
  const [categoryError, setCategoryError] = useState('');
  const [isCategoryFormOpen, setIsCategoryFormOpen] = useState(false);

  const selectedCategoryName = categories.find(c => c.id === selectedCategory)?.name || "";
  const isSaving = createMutation.isPending || updateMutation.isPending || uploadMutation.isPending;

  const form = useForm({
    defaultValues: {
      nama_penginapan: initialData?.nama_penginapan || '',
      description: initialData?.description || '',
      room_tour_url: initialData?.room_tour_url || '',
      detail_url: initialData?.detail_url || '',
      location: initialData?.location || '',
      image_url: initialData?.image_url || '',
      category_id: initialData?.category_id || '',
    },
    validators: { onChange: accomodationSchema },
    onSubmit: async ({ value }) => {
      if (!initialData?.image_url && !imageFile) {
        setImageError('Mohon pastikan form ini terisi');
        return;
      }
      if (!selectedCategory) {
        setCategoryError('Mohon pastikan form ini terisi');
        return;
      }

      try {
        let imageUrl = value.image_url;

        // Upload image if a new file is selected
        if (imageFile) {
          imageUrl = await uploadMutation.mutateAsync(imageFile);
          
          // Delete old image if we are updating an existing accommodation
          if (initialData?.image_url) {
            await accomodationService.deleteImage(initialData.image_url);
          }
        }

        const payload: CreateAccomodationPayload = {
          ...value,
          image_url: imageUrl,
          category_id: selectedCategory || undefined,
        };

        if (initialData) {
          await updateMutation.mutateAsync({ id: initialData.id, payload });
        } else {
          await createMutation.mutateAsync(payload);
        }

        if (onSuccess) onSuccess();
      } catch (error) {
        console.error('Submission failed', error);
      }
    },
  });

  return (
    <Card className="w-full">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        <CardContent className="pb-8 flex flex-col gap-4">
          <form.Field name="nama_penginapan">
            {(field) => (
              <div className="flex flex-col gap-1">
                <label className="font-semibold text-sm">Nama Penginapan <span className="text-red-500">*</span></label>
                <Input
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Cx. Deluxe Room"
                  className={field.state.meta.errors?.length ? "border-red-500 focus-visible:ring-red-500" : ""}
                />
                {field.state.meta.errors?.length ? <em className="text-red-500 text-sm">{field.state.meta.errors.map((e: any) => e.message || e).join(', ')}</em> : null}
              </div>
            )}
          </form.Field>

          <form.Field name="description">
            {(field) => (
              <div className="flex flex-col gap-1">
                <label className="font-semibold text-sm">Deskripsi (Opsional)</label>
                <Textarea
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Room description..."
                  rows={3}
                />
              </div>
            )}
          </form.Field>

          <form.Field name="location">
            {(field) => (
              <div className="flex flex-col gap-1">
                <label className="font-semibold text-sm">Lokasi <span className="text-red-500">*</span></label>
                <Input
                  type="text"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Cx. Mantrijeron, Yogyakarta"
                  className={field.state.meta.errors?.length ? "border-red-500 focus-visible:ring-red-500" : ""}
                />
                {field.state.meta.errors?.length ? <em className="text-red-500 text-sm">{field.state.meta.errors.map((e: any) => e.message || e).join(', ')}</em> : null}
              </div>
            )}
          </form.Field>

          <form.Field name="room_tour_url">
            {(field) => (
              <div className="flex flex-col gap-1">
                <label className="font-semibold text-sm">Room Tour URL (Opsional)</label>
                <Input
                  type="url"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="https://..."
                />
                {field.state.meta.errors?.length ? <em className="text-red-500 text-sm">{field.state.meta.errors.map((e: any) => e.message || e).join(', ')}</em> : null}
              </div>
            )}
          </form.Field>

          <form.Field name="detail_url">
            {(field) => (
              <div className="flex flex-col gap-1">
                <label className="font-semibold text-sm">Lihat Detail URL <span className="text-red-500">*</span></label>
                <Input
                  type="url"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="https://..."
                  className={field.state.meta.errors?.length ? "border-red-500 focus-visible:ring-red-500" : ""}
                />
                {field.state.meta.errors?.length ? <em className="text-red-500 text-sm">{field.state.meta.errors.map((e: any) => e.message || e).join(', ')}</em> : null}
              </div>
            )}
          </form.Field>

          <div className="flex flex-col gap-1">
            <label className="font-semibold text-sm">Gambar <span className="text-red-500">*</span></label>
            <div className="flex gap-2 items-center">
              <Input
                type="file"
                accept="image/*"
                className={imageError ? "flex-1 border-red-500 focus-visible:ring-red-500" : "flex-1"}
                disabled={isCompressing}
                onChange={async (e) => {
                  if (e.target.files && e.target.files[0]) {
                    let file = e.target.files[0];
                    
                    // Compress if file is larger than 400KB
                    if (file.size > 400 * 1024) {
                      try {
                        setIsCompressing(true);
                        setIsCompressed(false);
                        const options = {
                          maxSizeMB: 0.4, // 400KB
                          maxWidthOrHeight: 1920,
                          useWebWorker: true,
                        };
                        file = await imageCompression(file, options);
                      } catch (error) {
                        console.error("Compression error:", error);
                        setImageError("Gagal mengompres gambar");
                        setIsCompressing(false);
                        return;
                      } finally {
                        setIsCompressing(false);
                      }
                    }

                    setImageFile(file);
                    setImageError('');
                    setIsCompressed(true);
                  }
                }}
              />
              
              {isCompressing && <Loader2 className="h-5 w-5 animate-spin text-slate-500 shrink-0" />}

              {!isCompressing && (imageFile || initialData?.image_url) && (
                <Dialog>
                  <DialogTrigger render={<Button variant="outline" type="button" className="shrink-0">Preview</Button>} />
                  <DialogContent className="max-w-xl p-6">
                    <DialogHeader>
                      <DialogTitle>Preview Image</DialogTitle>
                    </DialogHeader>
                    <div className="flex w-full items-center justify-center overflow-hidden rounded-md bg-gray-100 mt-2">
                      <img 
                        src={imageFile ? URL.createObjectURL(imageFile) : initialData?.image_url} 
                        alt="Preview" 
                        className="w-full object-contain max-h-[60vh]"
                      />
                    </div>
                  </DialogContent>
                </Dialog>
              )}

              {isCompressed && !isCompressing && <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />}
            </div>
            {imageError ? <em className="text-red-500 text-sm">{imageError}</em> : null}
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-semibold text-sm">Pilih Kategori <span className="text-red-500">*</span></label>
            <Popover open={openCategory} onOpenChange={setOpenCategory}>
              <PopoverTrigger 
                render={
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={openCategory}
                    className={`w-full justify-between ${categoryError ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                    disabled={isLoadingCategories}
                  />
                }
              >
                {selectedCategoryName || (isLoadingCategories ? "Loading..." : "Pilih Kategori...")}
                <ChevronDown className="h-4 w-4 opacity-50" />
              </PopoverTrigger>
              <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                <Command>
                  <CommandInput placeholder="Cari kategori..." className="h-9" />
                  <CommandList>
                    <CommandEmpty>Kategori tidak ditemukan.</CommandEmpty>
                    <CommandGroup>
                      {categories.map((category) => (
                        <CommandItem
                          key={category.id}
                          value={category.name}
                          onSelect={() => {
                            setSelectedCategory(category.id === selectedCategory ? "" : category.id);
                            if (category.id) setCategoryError('');
                            setOpenCategory(false);
                          }}
                        >
                          {category.name}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                  <CommandSeparator />
                  <div className="p-1">
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-sm text-[#1b3b2c] font-semibold"
                      onClick={(e) => {
                        e.preventDefault();
                        setOpenCategory(false);
                        setIsCategoryFormOpen(true);
                      }}
                    >
                      + add kategori
                    </Button>
                  </div>
                </Command>
              </PopoverContent>
            </Popover>
            {categoryError ? <em className="text-red-500 text-sm">{categoryError}</em> : null}
          </div>
        </CardContent>

        <CardFooter className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-6 pb-8 px-6">
          {onCancel && (
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
              disabled={isSaving || isCompressing || isLoadingCategories}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
          )}
          <Button 
            size="lg" 
            type="button" 
            className="bg-[#1b3b2c] text-white hover:bg-[#1b3b2c]/90 w-full sm:w-auto" 
            onClick={() => {
              if (!initialData?.image_url && !imageFile) {
                setImageError('Mohon pastikan form ini terisi');
                return;
              }
              if (!selectedCategory) {
                setCategoryError('Mohon pastikan form ini terisi');
                return;
              }
              form.handleSubmit();
            }} 
            disabled={isSaving || isCompressing || isLoadingCategories}
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Menyimpan...
              </>
            ) : (
              'Save'
            )}
          </Button>
        </CardFooter>
      </form>
      <CategoryFormDialog 
        type="accomodation"
        open={isCategoryFormOpen} 
        onOpenChange={setIsCategoryFormOpen}
        onSuccess={() => {
          // Additional logic on success if needed, e.g. toast
        }}
      />
    </Card>
  );
}
