import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { RatePackageItem } from '../types/rateCard.types';

interface PackageSectionEditorProps {
  sectionLabel: string;
  title: string;
  items: RatePackageItem[];
  onTitleChange: (value: string) => void;
  onAddItem: () => void;
  onRemoveItem: (id: string) => void;
  onUpdateItem: (id: string, field: keyof RatePackageItem, value: string) => void;
}

export function PackageSectionEditor({
  sectionLabel,
  title,
  items,
  onTitleChange,
  onAddItem,
  onRemoveItem,
  onUpdateItem,
}: PackageSectionEditorProps) {
  return (
    <div className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-slate-50/60 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-1 items-center gap-2">
          <span className="shrink-0 font-semibold text-slate-500 text-xs uppercase">
            {sectionLabel}
          </span>
          <Input
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            placeholder="Nama Kategori"
            className="h-8 max-w-[180px] bg-white font-bold text-xs uppercase"
          />
        </div>
        <Button type="button" size="sm" variant="outline" onClick={onAddItem} className="h-8">
          <Plus className="mr-1 h-3.5 w-3.5" /> Tambah Paket
        </Button>
      </div>

      <div className="flex flex-col gap-2.5">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex flex-col gap-2 rounded-md border border-slate-200 bg-white p-3"
          >
            <div className="flex items-center gap-2">
              <Input
                value={item.name}
                onChange={(e) => onUpdateItem(item.id, 'name', e.target.value)}
                placeholder="Nama paket (mis. Instagram Package)"
                className="flex-1 text-sm"
              />
              <Input
                value={item.price}
                onChange={(e) => onUpdateItem(item.id, 'price', e.target.value)}
                placeholder="Harga (650K)"
                className="w-28 text-right font-semibold text-sm sm:w-32"
              />
              {items.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="shrink-0 text-red-500 hover:bg-red-50 hover:text-red-700"
                  onClick={() => onRemoveItem(item.id)}
                  title="Hapus paket"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
            <Textarea
              value={item.description || ''}
              onChange={(e) => onUpdateItem(item.id, 'description', e.target.value)}
              placeholder="Deskripsi/benefit (opsional)..."
              rows={2}
              className="text-xs"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
