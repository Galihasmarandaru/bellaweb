import type { RateCardData } from '../types/rateCard.types';

export const DEFAULT_IMAGES = {
  cutoutSlide1: '/images/rate-card/cutout-7387.png',
  cutoutSlide2: '/images/rate-card/cutout-6077.png',
  cutoutSlide7: '/images/rate-card/cutout-1413.png',
  polaroid1: '/images/rate-card/photo-6077.jpg',
  polaroid2: '/images/rate-card/photo-1413.jpg',
  polaroid3: '/images/rate-card/profile.jpg',
  polaroid4: '/images/rate-card/photo-7387.jpg',
  igAccount: '/images/rate-card/ig-account.jpg',
  igInsight: '/images/rate-card/ig-insight.jpg',
  tiktokAccount: '/images/rate-card/tiktok-account.jpg',
  tiktokInsight: '/images/rate-card/tiktok-insight.jpg',
} as const;

export const DEFAULT_RATE_CARD_DATA: RateCardData = {
  name: 'Bella Rhema',
  shortName: 'BELLA',
  tagline: 'TRAVELING • LIFESTYLE • RUNNING • REVIEWER • CONTENT CREATOR',
  instagramHandle: '@bellarhemaagnesia',
  tiktokHandle: '@bellarhemaagnesiaa',
  phone: '089504643409',
  email: 'aisyahichaa10@gmail.com',
  location: 'Yogyakarta, Indonesia',

  bio: 'Content creator yang berfokus pada review penginapan, traveling, running, dan lifestyle dengan visual yang estetik serta storytelling yang autentik.\n\nSenang mengeksplorasi pengalaman baru dan menghadirkan rekomendasi produk maupun destinasi secara natural dan relatable untuk audiens.',

  visitTitle: 'VISIT',
  visitPackages: [
    {
      id: 'visit-1',
      name: 'Instagram Package',
      price: '650K',
      description:
        '1x Post (Feed/Reels) | 1-2 Slide Instastory | Permanent Post | Mention Social Media & Collab Post',
    },
    {
      id: 'visit-2',
      name: 'TikTok Package',
      price: '650K',
      description: '1x Post | Permanent Post | Mention Social Media Brand',
    },
    {
      id: 'visit-3',
      name: 'Bundling Package',
      price: '850K',
      description: '1x Post TikTok & Instagram | Permanent Post | All Benefit Include',
    },
  ],

  collaborationTitle: 'COLLABORATION',
  collaborationPackages: [
    {
      id: 'collab-1',
      name: 'Brand Ambassador',
      price: '2000K',
      description: '',
    },
    {
      id: 'collab-2',
      name: 'Muse',
      price: '500K/Sesi',
      description: '',
    },
    {
      id: 'collab-3',
      name: 'Photo Catalogue',
      price: '500K',
      description: '',
    },
  ],

  endorsementTitle: 'ENDORSEMENT',
  endorsementPackages: [
    {
      id: 'endorse-1',
      name: 'Instagram Package',
      price: '500K',
      description:
        '1x Post (Feed/Reels) | 1-2 Slide Instastory | Permanent Post | Mention Social Media & Collab Post',
    },
    {
      id: 'endorse-2',
      name: 'TikTok Package',
      price: '500K',
      description: '1x Post | Permanent Post | Mention Social Media Brand',
    },
    {
      id: 'endorse-3',
      name: 'Bundling Package',
      price: '650K',
      description: '1x Post TikTok & Instagram | All Benefit Include',
    },
    {
      id: 'endorse-4',
      name: 'Paid Promote',
      price: '50K',
      description: 'Instagram Story & Tiktok Story',
    },
  ],

  additionalTitle: 'ADDITIONAL',
  additionalPackages: [
    {
      id: 'add-1',
      name: 'Ads Code',
      price: 'Start From 100K',
      description: '',
    },
    {
      id: 'add-2',
      name: 'Owning Video',
      price: '500K',
      description: '',
    },
  ],

  cutoutSlide1Url: DEFAULT_IMAGES.cutoutSlide1,
  cutoutSlide2Url: DEFAULT_IMAGES.cutoutSlide2,
  cutoutSlide7Url: DEFAULT_IMAGES.cutoutSlide7,
  polaroid1Url: DEFAULT_IMAGES.polaroid1,
  polaroid2Url: DEFAULT_IMAGES.polaroid2,
  polaroid3Url: DEFAULT_IMAGES.polaroid3,
  polaroid4Url: DEFAULT_IMAGES.polaroid4,
  igAccountImageUrl: DEFAULT_IMAGES.igAccount,
  igInsightImageUrl: DEFAULT_IMAGES.igInsight,
  tiktokAccountImageUrl: DEFAULT_IMAGES.tiktokAccount,
  tiktokInsightImageUrl: DEFAULT_IMAGES.tiktokInsight,

  bankName: 'BCA',
  accountNumber: '2000854851',
  accountHolder: 'Siti Aisyah',

  endorsementTerms: [
    {
      id: 'end-term-1',
      text: 'Produk yang di endorse harus HALAL dan/atau sudah BPOM, serta layak dikonsumsi atau digunakan sebagai review.',
    },
    { id: 'end-term-2', text: 'Review produk tetap berdasarkan kejujuran.' },
    {
      id: 'end-term-3',
      text: 'Diperbolehkan request materi promosi, nantinya akan diimprovisasi & disesuaikan oleh kreator.',
    },
    {
      id: 'end-term-4',
      text: 'Biaya kirim produk menjadi tanggung jawab pihak brand/agency/company.',
    },
    {
      id: 'end-term-5',
      text: 'No. rekening & alamat akan diberikan setelah ada persetujuan kedua belah pihak.',
    },
    { id: 'end-term-6', text: 'Konten akan tayang 5 - 7 hari setelah produk tiba.' },
    {
      id: 'end-term-7',
      text: 'Revisi MAX 2x (hanya revisi pada editing, tidak pada pengambilan video).',
    },
    {
      id: 'end-term-8',
      text: 'Feedback/Insight yang terjadi merupakan diluar kendali kreator.',
    },
    {
      id: 'end-term-9',
      text: 'Konten yang sudah jadi belum termasuk owning video. (DILARANG MENCURI VIDEO)',
    },
    { id: 'end-term-10', text: 'Rate Card bersifat negotiable, diskusi hingga sepakat.' },
    { id: 'end-term-11', text: 'Syarat & ketentuan dapat berubah sewaktu-waktu.' },
    { id: 'end-term-12', text: 'TIDAK BOLEH MENYEBARLUASKAN RATE CARD.' },
  ],

  visitTerms: [
    {
      id: 'visit-term-1',
      text: 'Produk/destinasi yang dipromosikan harus HALAL dan/atau sudah BPOM, layak digunakan, dan bebas unsur SARA.',
    },
    {
      id: 'visit-term-2',
      text: 'Menerima visit dengan kategori: Traveling, Staycation, Lifestyle, Running & Kuliner.',
    },
    {
      id: 'visit-term-3',
      text: 'Diperbolehkan request materi promosi, nantinya akan diimprovisasi & disesuaikan oleh kreator.',
    },
    {
      id: 'visit-term-4',
      text: 'No. rekening akan diberikan setelah ada persetujuan kedua belah pihak.',
    },
    {
      id: 'visit-term-5',
      text: 'Konten akan tayang maksimal 1 minggu setelah dilaksanakannya visit.',
    },
    {
      id: 'visit-term-6',
      text: 'Revisi MAX 2x (hanya revisi pada editing, tidak pada pengambilan video).',
    },
    {
      id: 'visit-term-7',
      text: 'Feedback/Insight yang terjadi merupakan diluar kendali kreator.',
    },
    {
      id: 'visit-term-8',
      text: 'Konten yang sudah jadi belum termasuk owning video. (DILARANG MENCURI VIDEO)',
    },
    { id: 'visit-term-9', text: 'Rate Card bersifat negotiable, diskusi hingga sepakat.' },
    { id: 'visit-term-10', text: 'Syarat & ketentuan dapat berubah sewaktu-waktu.' },
    { id: 'visit-term-11', text: 'TIDAK BOLEH MENYEBARLUASKAN RATE CARD.' },
  ],

  paymentTerms: [
    { id: 'pay-term-1', text: 'PEMBAYARAN DI AWAL KERJASAMA UNTUK LOCK TANGGAL.' },
    {
      id: 'pay-term-2',
      text: 'JIKA SUDAH MELAKUKAN PEMBAYARAN HARAP MEMBERIKAN BUKTI TRANSFER.',
    },
  ],
};
