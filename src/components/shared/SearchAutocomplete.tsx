import { useMemo, useState } from 'react';
import { FiSearch, FiX } from 'react-icons/fi';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

export interface SearchItem {
  id: string;
  title: string;
  is_favourite?: boolean;
}

export interface SearchAutocompleteProps {
  placeholder?: string;
  items: SearchItem[];
  onSelect?: (item: SearchItem) => void;
  onClear?: () => void;
  className?: string;
}

export function SearchAutocomplete({
  placeholder = 'Search...',
  items,
  onSelect,
  onClear,
  className,
}: SearchAutocompleteProps) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('');
  const [isSelected, setIsSelected] = useState(false);

  const filteredItems = useMemo(() => {
    if (value.length > 0) {
      const lowerValue = value.toLowerCase();
      return items.filter((item) => item.title.toLowerCase().includes(lowerValue));
    }
    return items.filter((item) => item.is_favourite);
  }, [items, value]);

  const showPopup = open && (value.length > 0 || filteredItems.length > 0);

  return (
    <div className={cn('relative w-full', className)}>
      <div className="relative w-full">
        <Input
          type="text"
          placeholder={placeholder}
          value={value}
          autoComplete="off"
          autoCorrect="off"
          spellCheck="false"
          onChange={(e) => {
            setValue(e.target.value);
            setIsSelected(false);
            if (isSelected) onClear?.();
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setOpen(false)}
          className="h-12 w-full rounded-xl border border-gray-300 bg-white pr-10 pl-4 text-sm shadow-sm focus-visible:border-gray-300 focus-visible:ring-0"
        />
        <div className="absolute top-1/2 right-4 -translate-y-1/2 text-gray-500">
          {isSelected ? (
            <button
              type="button"
              className="flex items-center justify-center hover:text-gray-800"
              onClick={() => {
                setValue('');
                setOpen(false);
                setIsSelected(false);
                onClear?.();
              }}
            >
              <FiX size={20} />
            </button>
          ) : (
            <FiSearch size={20} className="pointer-events-none" />
          )}
        </div>

        {showPopup && (
          <div
            className="fade-in zoom-in-95 absolute top-full right-0 left-0 z-50 mt-2 animate-in overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg"
            onMouseDown={(e) => e.preventDefault()}
          >
            <Command shouldFilter={false}>
              <CommandList className="max-h-[300px]">
                <CommandEmpty>Tidak ada hasil ditemukan.</CommandEmpty>
                <CommandGroup heading={value.length > 0 ? 'Hasil Pencarian' : 'Saran Populer'}>
                  {filteredItems.map((item) => (
                    <CommandItem
                      key={item.id}
                      value={item.title}
                      onSelect={() => {
                        setValue(item.title);
                        setOpen(false);
                        setIsSelected(true);
                        onSelect?.(item);
                      }}
                      className="cursor-pointer py-3"
                    >
                      {item.title}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </div>
        )}
      </div>
    </div>
  );
}
