export interface Accomodation {
  id: string;
  nama_penginapan: string;
  description?: string;
  room_tour_url?: string;
  detail_url?: string;
  location?: string;
  image_url?: string;
  category_id?: string;
  is_favourite?: boolean;
  created_at?: string;
}

export interface CreateAccomodationPayload {
  nama_penginapan: string;
  description?: string;
  room_tour_url?: string;
  detail_url?: string;
  location?: string;
  image_url?: string;
  category_id?: string;
  is_favourite?: boolean;
}

export interface UpdateAccomodationPayload extends Partial<CreateAccomodationPayload> {}