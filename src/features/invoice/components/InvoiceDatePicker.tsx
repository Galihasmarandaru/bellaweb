import { CalendarIcon } from 'lucide-react';
import { useState } from 'react';
import { id as idLocale } from 'react-day-picker/locale';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { parseIsoDateString, toIsoDateString } from '../utils/invoiceDate';

interface InvoiceDatePickerProps {
  id?: string;
  valueIso: string;
  onChangeIso: (iso: string) => void;
  displayLabel: string;
  placeholder?: string;
  className?: string;
}

export function InvoiceDatePicker({
  id,
  valueIso,
  onChangeIso,
  displayLabel,
  placeholder = 'Pilih tanggal...',
  className,
}: InvoiceDatePickerProps) {
  const [open, setOpen] = useState(false);
  const selectedDate = parseIsoDateString(valueIso);

  const handleSelectDate = (date: Date | undefined) => {
    if (!date) return;
    onChangeIso(toIsoDateString(date));
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button
            id={id}
            type="button"
            variant="outline"
            className={cn(
              'h-9 w-full justify-start text-left font-normal',
              !displayLabel && 'text-muted-foreground',
              className,
            )}
          />
        }
      >
        <CalendarIcon className="mr-2 size-4 shrink-0 text-muted-foreground" />
        <span className="truncate">{displayLabel || placeholder}</span>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={selectedDate}
          defaultMonth={selectedDate}
          onSelect={handleSelectDate}
          locale={idLocale}
          captionLayout="dropdown"
        />
      </PopoverContent>
    </Popover>
  );
}
