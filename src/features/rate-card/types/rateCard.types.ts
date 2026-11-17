export interface RatePackageItem {
  id: string;
  name: string;
  price: string;
  description?: string;
}

export interface RateTermItem {
  id: string;
  text: string;
}

export interface SocialHandles {
  instagramHandle: string;
  tiktokHandle: string;
}

export interface RateCardData extends SocialHandles {
  // Identity & Contact
  name: string;
  shortName: string;
  tagline: string;
  phone: string;
  email: string;
  location: string;

  // Slide 2: About
  bio: string;

  // Slide 5 & 6: Rate Card Categories
  visitTitle: string;
  visitPackages: RatePackageItem[];
  collaborationTitle: string;
  collaborationPackages: RatePackageItem[];
  endorsementTitle: string;
  endorsementPackages: RatePackageItem[];
  additionalTitle: string;
  additionalPackages: RatePackageItem[];

  // Cutout PNGs (transparent), Polaroids & Social Media Insights
  cutoutSlide1Url: string;
  cutoutSlide2Url: string;
  cutoutSlide7Url: string;
  polaroid1Url: string;
  polaroid2Url: string;
  polaroid3Url: string;
  polaroid4Url: string;
  igAccountImageUrl: string;
  igInsightImageUrl: string;
  tiktokAccountImageUrl: string;
  tiktokInsightImageUrl: string;

  // Slide 7 & 8: Bank, T&C, Payment
  bankName: string;
  accountNumber: string;
  accountHolder: string;
  endorsementTerms: RateTermItem[];
  visitTerms: RateTermItem[];
  paymentTerms: RateTermItem[];
}
