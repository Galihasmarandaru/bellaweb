import { useState } from 'react';
import { FiSearch } from 'react-icons/fi';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

export interface SearchAutocompleteProps {
  placeholder?: string;
  items: string[];
  onSelect?: (value: string) => void;
  className?: string;
}

export function SearchAutocomplete({
  placeholder = 'Search...',
  items,
  onSelect,
  className,
}: SearchAutocompleteProps) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('');

  return (
    <div className={cn('relative w-full', className)}>
      <div className="relative w-full">
        <Input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => setOpen(true)}
          onBlur={() => setOpen(false)}
          className="h-12 w-full rounded-xl border border-gray-300 bg-white pr-10 pl-4 text-sm shadow-sm focus-visible:border-gray-300 focus-visible:ring-0"
        />
        <div className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-gray-500">
          <FiSearch size={20} />
        </div>

        {open && (
          <div
            className="fade-in zoom-in-95 absolute top-full right-0 left-0 z-50 mt-2 animate-in overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg"
            onMouseDown={(e) => e.preventDefault()}
          >
            <Command>
              <CommandList className="max-h-[300px]">
                <CommandEmpty>Tidak ada hasil ditemukan.</CommandEmpty>
                <CommandGroup heading="Saran Populer">
                  {items
                    .filter((item) => item.toLowerCase().includes(value.toLowerCase()))
                    .map((item) => (
                      <CommandItem
                        key={item}
                        value={item}
                        onSelect={() => {
                          setValue(item);
                          setOpen(false);
                          onSelect?.(item);
                        }}
                        className="cursor-pointer py-3"
                      >
                        {item}
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
