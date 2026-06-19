import { Footer } from '@/components/shared';
import { Button } from '@/components/ui/button';
import { Link } from '@tanstack/react-router';

export function Dashboard() {
  return (
    <div className="flex min-h-screen flex-col items-center bg-slate-50 px-4 py-10 font-sans">
      <div className="mt-4 mb-8 text-center">
        <h1
          className="mb-4 font-bold font-serif text-4xl text-[#1b3b2c] italic md:text-5xl"
          style={{ fontFamily: '"Playfair Display", "Times New Roman", serif' }}
        >
          Rekomendasi Penginapan
          <br />
          dan Barang
        </h1>
        <p className="mt-2 font-semibold text-[#1b3b2c] text-sm md:text-base">
          by Bella Rhema Agnesia
        </p>
      </div>

      <div className="mb-auto grid w-full max-w-md grid-cols-1 gap-4 sm:max-w-2xl sm:grid-cols-2">
        <Button
          asChild
          className="h-auto w-full rounded-xl border border-[#1b3b2c] bg-transparent px-6 py-6 text-center font-semibold text-base text-[#1b3b2c] shadow-sm transition-transform hover:scale-[1.02] hover:bg-[#1b3b2c]/5"
        >
          <Link to="/accomodation">🏨 Spill Penginapan</Link>
        </Button>
        <Button className="h-auto w-full rounded-xl border border-[#1b3b2c] bg-transparent px-6 py-6 text-center font-semibold text-base text-[#1b3b2c] shadow-sm transition-transform hover:scale-[1.02] hover:bg-[#1b3b2c]/5">
          🛍️ Spill Link
        </Button>
      </div>

      <Footer />
    </div>
  );
}
