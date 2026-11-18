import { Check, Copy, ExternalLink, MessageCircle } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Button, buttonVariants } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

export const GOOGLE_DRIVE_RATE_CARD_FOLDER_URL =
  'https://drive.google.com/drive/u/0/folders/1geHzhBOTu-NoCTzKNXOwQcSm4q55nXXF';

interface WhatsAppShareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function WhatsAppShareDialog({ open, onOpenChange }: WhatsAppShareDialogProps) {
  const [recipientName, setRecipientName] = useState('');
  const [pdfLink, setPdfLink] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!open) {
      setCopied(false);
    }
  }, [open]);

  const message = useMemo(() => {
    const cleanName = recipientName.trim() || '….';
    const cleanLink = pdfLink.trim() || '<link-pdf>';
    return `Halo ka ${cleanName} salam kenal! Thanks for reach out me 👋🏻

Boleh ka, berikut aku kirimkan ratecardnya ya :

${cleanLink}

Thankyou so much! Ditunggu info selanjutnya ya, semoga kita bisa bekerja sama ✨☺️`;
  }, [recipientName, pdfLink]);

  const handleCopyMessage = async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy WhatsApp message:', err);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-[#1b3b2c]">
            <MessageCircle className="h-5 w-5 text-[#25D366]" />
            Pesan Siap Copy ke WhatsApp
          </DialogTitle>
          <DialogDescription>
            PDF Rate Card sudah berhasil diunduh. Upload PDF tersebut ke folder Google Drive, tempel
            link PDF-nya di bawah (opsional), lalu copy pesan untuk WhatsApp.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="flex flex-col gap-1">
              <label htmlFor="wa-recipient-name" className="font-semibold text-xs uppercase">
                Nama Penerima (Opsional)
              </label>
              <Input
                id="wa-recipient-name"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                placeholder="Contoh: Dina"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="wa-pdf-link" className="font-semibold text-xs uppercase">
                Link PDF Google Drive (Opsional)
              </label>
              <Input
                id="wa-pdf-link"
                value={pdfLink}
                onChange={(e) => setPdfLink(e.target.value)}
                placeholder="https://drive.google.com/file/d/..."
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="wa-message-preview" className="font-semibold text-xs uppercase">
              Preview Pesan WhatsApp
            </label>
            <Textarea
              id="wa-message-preview"
              readOnly
              value={message}
              rows={8}
              className="resize-none bg-slate-50 text-sm leading-relaxed"
            />
          </div>
        </div>

        <DialogFooter className="sm:justify-between">
          <a
            href={GOOGLE_DRIVE_RATE_CARD_FOLDER_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(buttonVariants({ variant: 'outline' }), 'w-full sm:w-auto')}
          >
            <ExternalLink className="mr-1.5 h-4 w-4" />
            Buka Folder Google Drive
          </a>

          <Button
            type="button"
            onClick={() => void handleCopyMessage()}
            className="w-full bg-[#1b3b2c] text-white hover:bg-[#1b3b2c]/90 sm:w-auto"
          >
            {copied ? (
              <>
                <Check className="mr-1.5 h-4 w-4" /> Tersalin!
              </>
            ) : (
              <>
                <Copy className="mr-1.5 h-4 w-4" /> Copy Pesan WA
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
