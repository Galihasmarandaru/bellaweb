import { Loader2, Upload } from 'lucide-react';
import { useId, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface PhotoSlotCardProps {
  label: string;
  hint: string;
  imageUrl: string;
  defaultUrl: string;
  isUploading: boolean;
  onUpload: (file?: File) => void;
  onReset: () => void;
  resetLabel?: string;
}

export function PhotoSlotCard({
  label,
  hint,
  imageUrl,
  defaultUrl,
  isUploading,
  onUpload,
  onReset,
  resetLabel = 'Reset Default',
}: PhotoSlotCardProps) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const previewSrc = imageUrl || defaultUrl;
  const showReset = defaultUrl ? imageUrl !== defaultUrl : Boolean(imageUrl);

  return (
    <div className="flex flex-col gap-2 rounded-lg border border-slate-200 bg-slate-50/60 p-3.5">
      <div>
        <span className="block font-bold text-[#232220] text-xs uppercase">{label}</span>
        <span className="text-[11px] text-slate-500">{hint}</span>
      </div>
      <div className="flex items-center gap-3">
        <div className="h-20 w-16 shrink-0 overflow-hidden rounded border border-slate-300 bg-white">
          {previewSrc ? (
            <img src={previewSrc} alt={label} className="h-full w-full object-contain" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-center text-[10px] text-slate-400">
              Kosong
            </div>
          )}
        </div>
        <div className="flex flex-1 flex-wrap items-center gap-2">
          <Input
            id={inputId}
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.currentTarget.files?.[0];
              onUpload(file);
              e.currentTarget.value = '';
            }}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={isUploading}
            onClick={() => inputRef.current?.click()}
            className="h-8 bg-white text-xs"
          >
            {isUploading ? (
              <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
            ) : (
              <Upload className="mr-1.5 h-3.5 w-3.5" />
            )}
            {previewSrc ? 'Ganti Foto' : 'Upload Foto'}
          </Button>
          {showReset && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="text-slate-600 text-xs"
              onClick={onReset}
            >
              {resetLabel}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
