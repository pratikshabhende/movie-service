export interface Review {
  id?: number;
  movieId: number;
  reviewerName: string;
  comment: string;
  rating: number;
  createdAt?: string;
}
