import { z } from 'zod';

export const accomodationSchema = z.object({
  nama_penginapan: z.string().min(1, 'Mohon pastikan form ini terisi'),
  description: z.string(),
  location: z.string().min(1, 'Mohon pastikan form ini terisi'),
  room_tour_url: z.string().url('Must be a valid URL').or(z.literal('')),
  detail_url: z.string().min(1, 'Mohon pastikan form ini terisi').refine(val => val === '' || /^https?:\/\//.test(val), 'Must be a valid URL'),
  image_url: z.string(),
  category_id: z.string(),
});

export type AccomodationSchema = z.infer<typeof accomodationSchema>;