// lib/types/review.ts
export interface MovieReview {
  id: string;
  movieId: number;
  userId: string;
  displayName: string;
  photoURL?: string | null;
  rating: number;
  content: string;
  createdAt: any;
}
