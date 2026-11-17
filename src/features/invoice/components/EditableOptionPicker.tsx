import { Check, ChevronDown, ListFilter } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

export interface SelectableOption {
  id: string;
  label: string;
}

interface EditableOptionPickerProps {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectableOption[];
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  groupHeading?: string;
  pickerLabel?: string;
  isLoading?: boolean;
  multiline?: boolean;
  popoverWidthClassName?: string;
}

export function EditableOptionPicker({
  id,
  value,
  onChange,
  options,
  placeholder,
  searchPlaceholder = 'Cari opsi...',
  emptyText = 'Belum ada opsi tersimpan.',
  groupHeading = 'Opsi dari Database',
  pickerLabel = 'Pilih opsi tersimpan',
  isLoading = false,
  multiline = false,
  popoverWidthClassName = 'w-80 max-w-[90vw]',
}: EditableOptionPickerProps) {
  const [open, setOpen] = useState(false);

  const handleSelectOption = (label: string) => {
    onChange(label);
    setOpen(false);
  };

  return (
    <div className={cn('flex w-full gap-1.5', multiline ? 'items-start' : 'items-center')}>
      {multiline ? (
        <Textarea
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="min-h-10 flex-1 resize-none py-2 text-sm"
        />
      ) : (
        <Input
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="h-9 flex-1"
        />
      )}

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          render={
            <Button
              type="button"
              variant="outline"
              size={multiline ? 'sm' : 'default'}
              aria-label={pickerLabel}
              title={pickerLabel}
              className={cn('shrink-0 text-slate-600', multiline ? 'h-9 px-2.5' : 'h-9 px-2.5')}
            />
          }
        >
          <ListFilter className="size-3.5" />
          <span className="hidden text-xs sm:inline">Pilih</span>
          <ChevronDown className="size-3.5 opacity-60" />
        </PopoverTrigger>
        <PopoverContent className={cn('p-0', popoverWidthClassName)} align="end">
          <Command>
            <CommandInput placeholder={searchPlaceholder} className="h-9" />
            <CommandList className="max-h-64">
              {isLoading ? (
                <div className="py-6 text-center text-muted-foreground text-xs">Memuat opsi...</div>
              ) : (
                <>
                  <CommandEmpty>{emptyText}</CommandEmpty>
                  <CommandGroup heading={groupHeading}>
                    {options.map((option) => {
                      const isSelected = value.trim() === option.label.trim();
                      return (
                        <CommandItem
                          key={option.id}
                          value={option.label}
                          onSelect={() => handleSelectOption(option.label)}
                          className="cursor-pointer items-start gap-2 py-2"
                        >
                          <Check
                            className={cn(
                              'mt-0.5 size-4 shrink-0 text-[#1b3b2c]',
                              isSelected ? 'opacity-100' : 'opacity-0',
                            )}
                          />
                          <span className="whitespace-normal break-words text-sm leading-snug">
                            {option.label}
                          </span>
                        </CommandItem>
                      );
                    })}
                  </CommandGroup>
                </>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
