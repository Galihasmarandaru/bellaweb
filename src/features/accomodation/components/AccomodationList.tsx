import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { useState } from 'react';
import { Heart } from 'lucide-react';
import { useAccomodations, useDeleteAccomodation, useUpdateAccomodation } from '../hooks/useAccomodation.ts';
import { useCategories } from '../../category/hooks/useCategory.ts';
import { Link } from '@tanstack/react-router';

export function AccomodationList() {
  const { data: accomodations, isLoading: isAccomodationsLoading, isError: isAccomodationsError } = useAccomodations();
  const { data: categories, isLoading: isCategoriesLoading, isError: isCategoriesError } = useCategories();
  const deleteMutation = useDeleteAccomodation();
  const updateMutation = useUpdateAccomodation();
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

  const hasFavourites = accomodations?.some(a => a.is_favourite);
  const activeCategoryIds = new Set(accomodations?.map(a => a.category_id).filter(Boolean));
  const activeCategories = categories?.filter(c => activeCategoryIds.has(c.id)) || [];

  const filteredAccomodations = selectedCategoryId === 'favourite'
    ? accomodations?.filter(a => a.is_favourite)
    : selectedCategoryId 
      ? accomodations?.filter(a => a.category_id === selectedCategoryId)
      : accomodations;

  const isLoading = isAccomodationsLoading || isCategoriesLoading;
  const isError = isAccomodationsError || isCategoriesError;

  if (isLoading) {
    return (
      <div className="mt-6 flex w-full max-w-5xl flex-col gap-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Penginapan</h2>
          <Button size="lg" disabled className="opacity-50">
            + Tambah
          </Button>
        </div>
        <div className="flex w-full gap-2 overflow-x-auto pb-2">
          <Skeleton className="h-10 w-20 shrink-0" />
          <Skeleton className="h-10 w-24 shrink-0" />
          <Skeleton className="h-10 w-28 shrink-0" />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="flex flex-col rounded-xl border p-0 shadow-sm bg-card text-card-foreground">
            <div className="flex flex-col space-y-1.5 p-6">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="mt-2 h-4 w-full" />
              <Skeleton className="mt-1 h-4 w-5/6" />
            </div>
            <div className="p-6 pt-0">
              <Skeleton className="h-5 w-1/3" />
            </div>
            <div className="mt-auto flex justify-between gap-2 p-6 pt-4">
              <Skeleton className="h-10 w-[100px]" />
              <div className="flex gap-2">
                <Skeleton className="h-10 w-[60px]" />
                <Skeleton className="h-10 w-[60px]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (isError) {
    return (
      <div className="flex min-h-[50vh] w-full flex-1 items-center justify-center">
        <p className="text-lg text-red-500">Failed to load data.</p>
      </div>
    );
  }

  return (
    <div className="mt-6 flex w-full max-w-5xl flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Penginapan</h2>
        <Link to="/admin/penginapan/create">
          <Button size="lg">
            + Tambah
          </Button>
        </Link>
      </div>

      {activeCategories.length > 0 && (
        <div className="flex w-full overflow-x-auto gap-2 pb-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <Button
            variant={selectedCategoryId === null ? "default" : "outline"}
            onClick={() => setSelectedCategoryId(null)}
            className={`shrink-0 ${selectedCategoryId === null ? "bg-[#1b3b2c] text-white hover:bg-[#1b3b2c]/90" : ""}`}
          >
            Semua
          </Button>
          {hasFavourites && (
            <Button
              variant={selectedCategoryId === 'favourite' ? "default" : "outline"}
              onClick={() => setSelectedCategoryId('favourite')}
              className={`shrink-0 ${selectedCategoryId === 'favourite' ? "bg-[#1b3b2c] text-white hover:bg-[#1b3b2c]/90" : ""}`}
            >
              <Heart className={`mr-2 h-4 w-4 ${selectedCategoryId === 'favourite' ? 'fill-white' : 'fill-[#1b3b2c] text-[#1b3b2c]'}`} /> Favourite
            </Button>
          )}
          {activeCategories.map(category => (
            <Button
              key={category.id}
              variant={selectedCategoryId === category.id ? "default" : "outline"}
              onClick={() => setSelectedCategoryId(category.id)}
              className={`shrink-0 ${selectedCategoryId === category.id ? "bg-[#1b3b2c] text-white hover:bg-[#1b3b2c]/90" : ""}`}
            >
              {category.name}
            </Button>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredAccomodations?.length === 0 ? (
            <div className="col-span-full flex min-h-[50vh] items-center justify-center">
              <p className="text-gray-500 text-center text-lg">Tidak ada data ditemukan, buat minimal 1 Bella!</p>
            </div>
          ) : (
            filteredAccomodations?.map((item) => (
              <Card key={item.id} className="flex flex-col">
                <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2 gap-4">
                  <div className="flex flex-col gap-1.5 overflow-hidden">
                    <CardTitle className="truncate" title={item.nama_penginapan}>{item.nama_penginapan}</CardTitle>
                    <CardDescription className="line-clamp-2">{item.description}</CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="shrink-0 -mt-1 -mr-2 rounded-full"
                    onClick={() => updateMutation.mutate({ id: item.id, payload: { is_favourite: !item.is_favourite } })}
                    disabled={updateMutation.isPending}
                  >
                    <Heart className={`h-5 w-5 ${item.is_favourite ? 'fill-red-500 text-red-500' : 'text-slate-400'}`} />
                  </Button>
                </CardHeader>
                <CardContent className="flex flex-col gap-2">
                  {item.location && (
                    <p className="text-foreground text-sm font-medium">📍 {item.location}</p>
                  )}

                </CardContent>
                <CardFooter className="mt-auto flex justify-between gap-2 pt-4">
                  {item.image_url ? (
                    <Dialog>
                      <DialogTrigger render={<Button className="bg-[#1b3b2c] text-white hover:bg-[#1b3b2c]/90 shadow-sm">Lihat Foto</Button>} />
                      <DialogContent className="max-w-xl p-6">
                        <DialogHeader>
                          <DialogTitle>Preview: {item.nama_penginapan}</DialogTitle>
                        </DialogHeader>
                        <div className="flex w-full items-center justify-center overflow-hidden rounded-md bg-gray-100 mt-4">
                          <img src={item.image_url} alt={item.nama_penginapan} className="w-full max-h-[70vh] object-contain" />
                        </div>
                      </DialogContent>
                    </Dialog>
                  ) : (
                    <Button variant="ghost" disabled>No Image</Button>
                  )}
                  <div className="flex gap-2">
                    <Link to="/admin/penginapan/$id/edit" params={{ id: item.id }}>
                      <Button variant="outline">
                        Edit
                      </Button>
                    </Link>
                    {accomodations && accomodations.length > 1 && (
                      <AlertDialog>
                        <AlertDialogTrigger 
                          render={
                            <Button variant="destructive" disabled={deleteMutation.isPending}>
                              Delete
                            </Button>
                          }
                        />
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Yakin data ini mau dihapus?</AlertDialogTitle>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel variant="outline" size="default">No</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => deleteMutation.mutate(item.id)}
                              className="bg-red-600 text-white hover:bg-red-700"
                            >
                              Yes
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                  </div>
                </CardFooter>
              </Card>
            ))
          )}
        </div>
    </div>
  );
}
