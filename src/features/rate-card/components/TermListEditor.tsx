import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import type { RateTermItem } from '../types/rateCard.types';

interface TermListEditorProps {
  label: string;
  terms: RateTermItem[];
  onAdd: () => void;
  onUpdate: (id: string, value: string) => void;
  onRemove: (id: string) => void;
}

export function TermListEditor({ label, terms, onAdd, onUpdate, onRemove }: TermListEditorProps) {
  return (
    <div className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-slate-50/60 p-4">
      <div className="flex items-center justify-between gap-2">
        <span className="font-bold text-[#232220] text-sm">{label}</span>
        <Button type="button" size="sm" variant="outline" onClick={onAdd} className="h-8">
          <Plus className="mr-1 h-3.5 w-3.5" /> Tambah Poin
        </Button>
      </div>
      <div className="flex flex-col gap-2">
        {terms.map((term, index) => (
          <div key={term.id} className="flex items-start gap-2">
            <span className="mt-2.5 w-5 shrink-0 text-right font-semibold text-slate-400 text-xs">
              {index + 1}.
            </span>
            <Textarea
              value={term.text}
              onChange={(e) => onUpdate(term.id, e.target.value)}
              rows={2}
              className="flex-1 bg-white text-sm"
              placeholder="Tulis poin ketentuan..."
            />
            {terms.length > 1 && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="mt-1 shrink-0 text-red-500 hover:bg-red-50 hover:text-red-700"
                onClick={() => onRemove(term.id)}
                title="Hapus poin"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
