export interface Category {
  id: string;
  name: string;
  type: 'accomodation' | 'spill';
  created_at?: string;
}

export interface CreateCategoryPayload {
  name: string;
  type: 'accomodation' | 'spill';
}
