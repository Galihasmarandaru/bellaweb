import { createFileRoute } from '@tanstack/react-router';
import { InvoiceGenerator } from '@/features/invoice/components/InvoiceGenerator';

export const Route = createFileRoute('/admin/invoice/')({
  component: InvoiceRoute,
});

function InvoiceRoute() {
  return (
    <div className="flex w-full max-w-5xl flex-col gap-6 pb-24 mt-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-bold text-[#1b3b2c]">Generate Invoice</h2>
        <p className="text-sm text-slate-500">
          Buat dan unduh invoice dalam format PDF. Data dapat disimpan dan dimuat melalui JSON.
        </p>
      </div>
      
      <InvoiceGenerator />
    </div>
  );
}
