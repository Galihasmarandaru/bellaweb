-- Sync existing 'default' rate_cards row with updated data from Bella_Rhema_Rate_Card.pdf
-- Preserves any uploaded photo URLs already stored on the row

UPDATE public.rate_cards
SET
  data = data || $json${
    "name": "Bella Rhema Agnesia",
    "shortName": "BELLA",
    "tagline": "TRAVELING • LIFESTYLE • HOTEL REVIEWER • CONTENT CREATOR",
    "instagramHandle": "@bellarhemaagnesia",
    "tiktokHandle": "@bellarhemaagnesiaa",
    "phone": "089504643409",
    "email": "bellarhema4@gmail.com",
    "location": "Yogyakarta, Indonesia",
    "bio": "Content creator yang berfokus pada hotel review , traveling, dan lifestyle dengan visual yang estetik serta storytelling yang autentik.\n\nSenang mengeksplorasi pengalaman baru dan menghadirkan rekomendasi produk maupun destinasi secara natural dan relatable untuk audiens.",
    "visitTitle": "VISIT",
    "visitPackages": [
      {
        "id": "visit-1",
        "name": "Instagram Package",
        "price": "500K",
        "description": "1x Post (Feed/Reels) | 1-2 Slide Instastory | Permanent Post | Mention Social Media & Collab Post"
      },
      {
        "id": "visit-2",
        "name": "TikTok Package",
        "price": "500K",
        "description": "1x Post | Permanent Post | Mention Social Media Brand"
      },
      {
        "id": "visit-3",
        "name": "Bundling Package",
        "price": "650K",
        "description": "1x Post TikTok & Instagram | Permanent Post | All Benefit Include"
      }
    ],
    "collaborationTitle": "COLLABORATION",
    "collaborationPackages": [
      {
        "id": "collab-1",
        "name": "Brand Ambassador",
        "price": "2500K",
        "description": ""
      },
      {
        "id": "collab-2",
        "name": "Muse",
        "price": "500K/Sesi",
        "description": ""
      },
      {
        "id": "collab-3",
        "name": "Photo Catalogue",
        "price": "500K",
        "description": ""
      }
    ],
    "endorsementTitle": "ENDORSEMENT",
    "endorsementPackages": [
      {
        "id": "endorse-1",
        "name": "Instagram Package",
        "price": "400K",
        "description": "1x Post (Feed/Reels) | 1-2 Slide Instastory | Permanent Post | Mention Social Media & Collab Post"
      },
      {
        "id": "endorse-2",
        "name": "TikTok Package",
        "price": "400K",
        "description": "1x Post | Permanent Post | Mention Social Media Brand"
      },
      {
        "id": "endorse-3",
        "name": "Bundling Package",
        "price": "550K",
        "description": "1x Post TikTok & Instagram | All Benefit Include"
      },
      {
        "id": "endorse-4",
        "name": "Paid Promote",
        "price": "50K",
        "description": "Instagram Story & Tiktok Story"
      }
    ],
    "additionalTitle": "ADDITIONAL",
    "additionalPackages": [
      {
        "id": "add-1",
        "name": "Ads Code",
        "price": "Start From 100K",
        "description": ""
      },
      {
        "id": "add-2",
        "name": "Owning Video",
        "price": "500K",
        "description": ""
      }
    ],
    "bankName": "BCA",
    "accountNumber": "0091816716",
    "accountHolder": "BELLA RHEMA AGNESIA",
    "visitTerms": [
      {
        "id": "visit-term-1",
        "text": "Produk/destinasi yang dipromosikan harus HALAL dan/atau sudah BPOM, layak digunakan, dan bebas unsur SARA."
      },
      {
        "id": "visit-term-2",
        "text": "Menerima visit dengan kategori: Traveling, Staycation, Lifestyle, Running."
      },
      {
        "id": "visit-term-3",
        "text": "Diperbolehkan request materi promosi, nantinya akan diimprovisasi & disesuaikan oleh kreator."
      },
      {
        "id": "visit-term-4",
        "text": "No. rekening akan diberikan setelah ada persetujuan kedua belah pihak."
      },
      {
        "id": "visit-term-5",
        "text": "Konten akan tayang maksimal 1 minggu setelah dilaksanakannya visit."
      },
      {
        "id": "visit-term-6",
        "text": "Revisi MAX 2x (hanya revisi pada editing, tidak pada pengambilan video)."
      },
      {
        "id": "visit-term-7",
        "text": "Feedback/Insight yang terjadi merupakan diluar kendali kreator."
      },
      {
        "id": "visit-term-8",
        "text": "Konten yang sudah jadi belum termasuk owning video. (DILARANG MENCURI VIDEO)"
      },
      {
        "id": "visit-term-9",
        "text": "Rate Card bersifat negotiable, diskusi hingga sepakat."
      },
      {
        "id": "visit-term-10",
        "text": "Syarat & ketentuan dapat berubah sewaktu-waktu."
      },
      {
        "id": "visit-term-11",
        "text": "TIDAK BOLEH MENYEBARLUASKAN RATE CARD."
      }
    ]
  }$json$::jsonb,
  updated_at = now()
WHERE id = 'default';
