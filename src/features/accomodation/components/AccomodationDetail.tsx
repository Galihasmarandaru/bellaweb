import { Footer } from '@/components/shared';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from '@tanstack/react-router';
import { ArrowLeft, MapPin } from 'lucide-react';

// 6 contoh data sesuai instruksi
const mockData = [
  {
    id: 1,
    title: 'Ndalam Keraton Boutique',
    location: 'Mantrijeron, Yogyakarta',
    badge: 'Favorit Budaya',
    description: '5 menit ke Keraton Yogyakarta',
    hasRoomTour: true,
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=600&h=400',
  },
  {
    id: 2,
    title: 'Urban Javanese Suites',
    location: 'Kotabaru, Yogyakarta',
    badge: 'Modern Minimalist',
    description: 'Akses mudah ke pusat kota',
    hasRoomTour: false,
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=600&h=400',
  },
  {
    id: 3,
    title: 'The Amerta Residence',
    location: 'Caturtunggal, Yogyakarta',
    badge: 'Luxury Heritage',
    description: 'Suasana tenang dan asri',
    hasRoomTour: true,
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=600&h=400',
  },
  {
    id: 4,
    title: 'Omah Klasik Kotagede',
    location: 'Kotagede, Yogyakarta',
    badge: 'Traditional Vibe',
    description: 'Pusat pengrajin perak kuno',
    hasRoomTour: false,
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=600&h=400',
  },
  {
    id: 5,
    title: 'Prawirotaman Guest House',
    location: 'Prawirotaman, Yogyakarta',
    badge: 'Backpacker Choice',
    description: '10 menit ke Malioboro',
    hasRoomTour: true,
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=600&h=400',
  },
  {
    id: 6,
    title: 'Malioboro Hidden Gem',
    location: 'Sosromenduran, Yogyakarta',
    badge: 'Center City',
    description: 'Selangkah menuju jalan utama',
    hasRoomTour: false,
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=600&h=400',
  },
];

export function AccomodationDetail() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 font-sans">
      {/* Wrapper to keep the whole layout centered on large screens */}
      <div className="mx-auto flex w-full max-w-3xl grow flex-col bg-[#F8FAFC]">
        {/* Top App Bar */}
        <div className="sticky top-0 z-10 flex items-center gap-4 bg-[#F8FAFC] px-4 py-4">
          <Link to="/accomodation" className="flex items-center justify-center rounded-full border border-slate-300 p-2 transition-colors hover:bg-slate-100">
            <ArrowLeft className="h-5 w-5 text-[#1A3B2B]" />
          </Link>
          <h1 className="font-semibold text-sm text-[#1A3B2B]">
            Rekomendasi Penginapan
          </h1>
        </div>

        <div className="grow px-5 py-2">
          {/* Header Text */}
          <div className="mt-2 mb-8">
            <h2 className="mb-3 font-bold text-3xl text-[#1A3B2B] leading-tight tracking-tight">
              Hotel
              <br />
              Yogyakarta
            </h2>
            <p className="max-w-[90%] text-[15px] text-slate-600 leading-relaxed">
              Temukan harmoni antara tradisi Jawa yang luhur dan kenyamanan modern di jantung kota
              budaya.
            </p>
          </div>

          {/* Card List: 1 column on mobile, 2 columns on sm+ */}
          <div className="mb-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
            {mockData.map((item) => (
              <Card
                key={item.id}
                className="overflow-hidden rounded-[20px] border-slate-100 p-0 gap-0 shadow-sm"
              >
                {/* Card Image */}
                <div className="relative h-48 w-full overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-full w-full object-cover"
                  />
                </div>

                {/* Card Body */}
                <CardContent className="p-5">
                  <h3 className="mb-1.5 font-extrabold text-[#1A3B2B] text-[22px] leading-tight">{item.title}</h3>
                  <p className="mb-5 font-serif text-[14px] italic text-[#1A3B2B]/70">"{item.description}"</p>

                  <div>
                    <div className="mb-5 flex items-center text-slate-500">
                      <MapPin className="mr-2 h-4 w-4 shrink-0" />
                      <span className="text-[13px] font-medium text-slate-600">{item.location}</span>
                    </div>

                    <div className="flex w-full items-center gap-2">
                      {item.hasRoomTour && (
                        <Button className="h-auto flex-[0.8] rounded-lg border border-transparent bg-[#1A3B2B] py-2.5 text-[13px] font-medium text-white shadow-none transition-colors hover:bg-[#1A3B2B]/90">
                          Room Tour
                        </Button>
                      )}
                      <Button asChild className="h-auto flex-[1.2] rounded-lg border border-[#1A3B2B] bg-transparent py-2.5 text-[13px] font-medium text-[#1A3B2B] shadow-none transition-colors hover:bg-[#1A3B2B]/5">
                        <Link to="/accomodation">Lihat Detail</Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <Footer className="mx-auto mb-8" />
      </div>
    </div>
  );
}
