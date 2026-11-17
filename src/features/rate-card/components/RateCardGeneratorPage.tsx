import { Link } from '@tanstack/react-router';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RateCardGenerator } from './RateCardGenerator';

export function RateCardGeneratorPage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-gray-50">
      <header className="fixed top-0 z-50 flex h-16 w-full items-center justify-between bg-white px-6 shadow-sm">
        <div className="flex w-[100px] items-center">
          <Link to="/admin">
            <Button
              variant="outline"
              className="flex h-10 w-10 items-center justify-center rounded-md border border-input bg-background p-0 hover:bg-accent hover:text-accent-foreground"
              title="Kembali ke Admin"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
        </div>

        <h1 className="font-bold text-gray-800 text-lg sm:text-xl">Rate Card Generator</h1>

        <div className="w-[100px]" />
      </header>

      <main className="mx-auto mt-16 flex w-full max-w-7xl flex-1 flex-col gap-6 p-4 pt-6 pb-24 sm:p-6">
        <div className="flex flex-col gap-1">
          <h2 className="font-bold text-2xl text-[#1b3b2c]">Generate Rate Card</h2>
          <p className="text-slate-500 text-sm">
            Atur profil, daftar paket, Term &amp; Condition, dan Term of Payment lalu unduh sebagai
            PDF. Perubahan tersimpan otomatis di browser tanpa database.
          </p>
        </div>

        <RateCardGenerator />
      </main>
    </div>
  );
}
