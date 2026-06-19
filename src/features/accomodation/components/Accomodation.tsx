import { Footer, SearchAutocomplete } from '@/components/shared';
import { Button } from '@/components/ui/button';
import { Link } from '@tanstack/react-router';

export function Accomodation() {
  return (
    <div className="flex min-h-screen flex-col items-center bg-slate-50 px-4 py-10 font-sans">
      <div className="mt-4 mb-8 text-center">
        <h1
          className="mb-4 font-bold font-serif text-4xl text-[#1b3b2c] italic md:text-5xl"
          style={{ fontFamily: '"Playfair Display", "Times New Roman", serif' }}
        >
          Rekomendasi Villa
          <br />
          dan Hotel
        </h1>
        <p className="mt-2 font-semibold text-[#1b3b2c] text-sm md:text-base">
          by Bella Rhema Agnesia
        </p>
      </div>

      <SearchAutocomplete
        placeholder="Cari nama villa atau hotel..."
        items={[
          'Vila Asri Puncak',
          'Romantic Sunrise Villa Bali',
          'Malioboro Inn Jogja',
          'Lawang Sewu View Hotel',
          'Keluarga Bahagia Resort'
        ]}
        className="mb-10 max-w-[340px]"
        onSelect={(item) => console.log('Selected:', item)}
      />

      <div className="mb-auto grid w-full max-w-md grid-cols-1 gap-4 sm:max-w-2xl sm:grid-cols-2">
        <Button className="h-auto w-full rounded-xl border border-[#1b3b2c] bg-transparent px-6 py-6 text-center font-semibold text-base text-[#1b3b2c] shadow-sm transition-transform hover:scale-[1.02] hover:bg-[#1b3b2c]/5">
          👨‍👩‍👧‍👦 Vila Keluarga
        </Button>
        <Button className="h-auto w-full rounded-xl border border-[#1b3b2c] bg-transparent px-6 py-6 text-center font-semibold text-base text-[#1b3b2c] shadow-sm transition-transform hover:scale-[1.02] hover:bg-[#1b3b2c]/5">
          🥂 Vila Honeymoon
        </Button>
        <Button
          asChild
          className="h-auto w-full rounded-xl border border-[#1b3b2c] bg-transparent px-6 py-6 text-center font-semibold text-base text-[#1b3b2c] shadow-sm transition-transform hover:scale-[1.02] hover:bg-[#1b3b2c]/5"
        >
          <Link to="/accomodation/detail">🏨 Hotel Jogja</Link>
        </Button>
        <Button className="h-auto w-full rounded-xl border border-[#1b3b2c] bg-transparent px-6 py-6 text-center font-semibold text-base text-[#1b3b2c] shadow-sm transition-transform hover:scale-[1.02] hover:bg-[#1b3b2c]/5">
          🏢 Hotel Semarang
        </Button>
      </div>

      <Footer />
    </div>
  );
}
