export interface Spill {
  id: string;
  nama_item: string;
  description?: string;
  room_tour_url?: string;
  detail_url?: string;
  image_url?: string;
  category_id?: string;
  is_favourite?: boolean;
  created_at?: string;
}

export interface CreateSpillPayload {
  nama_item: string;
  description?: string;
  room_tour_url?: string;
  detail_url?: string;
  image_url?: string;
  category_id?: string;
  is_favourite?: boolean;
}

export interface UpdateSpillPayload extends Partial<CreateSpillPayload> {}
