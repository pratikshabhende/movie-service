import { Review } from './review.model';

export interface Movie {
  id?: number;
  title: string;
  director: string;
  releaseDate: string;
  durationMinutes?: number;
  genre?: string;
  imagePath?: string;
  description?: string;
  reviews?: Review[];
}
