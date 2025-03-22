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
  // Campos adicionales para mostrar en la lista de comentarios recientes
  movieTitle?: string;
  movieYear?: number;
  posterPath?: string;
}
