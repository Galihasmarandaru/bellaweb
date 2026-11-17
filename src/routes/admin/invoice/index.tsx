import { createFileRoute } from '@tanstack/react-router';
import { InvoiceGenerator, InvoiceOptionsManager } from '@/features/invoice';

export const Route = createFileRoute('/admin/invoice/')({
  component: InvoiceRoute,
});

function InvoiceRoute() {
  return (
    <div className="mt-6 flex w-full max-w-5xl flex-col gap-8 pb-24">
      <div className="flex flex-col gap-1">
        <h2 className="font-bold text-2xl text-[#1b3b2c]">Generate Invoice</h2>
        <p className="text-slate-500 text-sm">
          Buat dan unduh invoice dalam format PDF serta kelola opsi KEPADA dan deskripsi item
          tersimpan.
        </p>
      </div>

      <InvoiceGenerator />
      <InvoiceOptionsManager />
    </div>
  );
}
