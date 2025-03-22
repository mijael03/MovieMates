'use client';
import React, { useState, useEffect } from 'react';
import { useAuthStore } from '@/lib/store/authStore';
import { getMovieReviews, addReview, deleteReview, updateReview } from '@/lib/firebase/reviews';
import { MovieReview } from '@/lib/types/review';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { StarIcon } from '@/components/ui/star-icon';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';
import ReviewCard from './ReviewCard';

interface MovieReviewSectionProps {
  movieId: number;
  movieTitle: string;
  movieYear?: number;
  posterPath?: string | null;
}

export const MovieReviewSection: React.FC<MovieReviewSectionProps> = ({ movieId, movieTitle, movieYear, posterPath }) => {
  const { user } = useAuthStore();
  const [reviews, setReviews] = useState<MovieReview[]>([]);
  const [newReview, setNewReview] = useState('');
  const [rating, setRating] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingReview, setEditingReview] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [editRating, setEditRating] = useState(5);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    setError(null);

    try {
      const unsubscribe = getMovieReviews(movieId, (fetchedReviews) => {
        setReviews(fetchedReviews);
        setIsLoading(false);
      });

      return () => unsubscribe();
    } catch (err) {
      console.error('Error setting up reviews listener:', err);
      setError('No se pudieron cargar las reseñas. Por favor, inténtalo de nuevo más tarde.');
      setIsLoading(false);
      return () => { };
    }
  }, [movieId]);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newReview.trim()) return;

    setIsSubmitting(true);
    try {
      // Obtener información de la película desde props
      await addReview(
        movieId,
        user,
        newReview,
        rating,
        movieTitle, // Título de la película
        movieYear || new Date().getFullYear(), // Usar el año proporcionado o el actual como fallback
        posterPath // Usar el poster path proporcionado
      );
      setNewReview('');
      setRating(5);
    } catch (error) {
      console.error('Error submitting review:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar esta reseña?')) return;

    try {
      await deleteReview(reviewId);
    } catch (error) {
      console.error('Error deleting review:', error);
    }
  };

  const handleStartEdit = (review: MovieReview) => {
    setEditingReview(review.id);
    setEditContent(review.content);
    setEditRating(review.rating);
  };

  const handleCancelEdit = () => {
    setEditingReview(null);
    setEditContent('');
    setEditRating(5);
  };

  const handleSaveEdit = async (reviewId: string) => {
    if (!editContent.trim()) return;

    try {
      await updateReview(reviewId, editContent, editRating);
      setEditingReview(null);
    } catch (error) {
      console.error('Error updating review:', error);
    }
  };

  const StarRating = ({ value, onChange }: { value: number; onChange?: (value: number) => void }) => {
    const [hoverValue, setHoverValue] = useState(0);

    return (
      <div
        className="flex space-x-1"
        onMouseLeave={() => onChange && setHoverValue(0)}
      >
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange && onChange(star)}
            onMouseEnter={() => onChange && setHoverValue(star)}
            className={`${onChange ? 'cursor-pointer' : 'cursor-default'} transition-transform duration-200 ${onChange && hoverValue >= star ? 'transform scale-110' : ''}`}
            disabled={!onChange}
          >
            <StarIcon
              filled={hoverValue > 0 ? star <= hoverValue : star <= value}
              className={`w-6 h-6 transition-colors duration-200 ${hoverValue > 0 ? (star <= hoverValue ? 'text-yellow-500' : 'text-gray-400') : (star <= value ? 'text-yellow-500' : 'text-gray-400')}`}
            />
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
      <h2 className="text-2xl font-bold text-white mb-6">Reseñas de {movieTitle}</h2>

      {user ? (
        <form onSubmit={handleSubmitReview} className="mb-8">
          <div className="mb-4">
            <label htmlFor="rating" className="block text-sm font-medium text-gray-300 mb-2">
              Tu calificación
            </label>
            <StarRating value={rating} onChange={setRating} />
          </div>

          <div className="mb-4">
            <label htmlFor="review" className="block text-sm font-medium text-gray-300 mb-2">
              Tu reseña
            </label>
            <Textarea
              id="review"
              value={newReview}
              onChange={(e) => setNewReview(e.target.value)}
              placeholder="Comparte tu opinión sobre esta película..."
              className="w-full bg-gray-700 text-white border-gray-600"
              rows={4}
              required
            />
          </div>

          <Button
            type="submit"
            disabled={isSubmitting || !newReview.trim()}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isSubmitting ? 'Enviando...' : 'Publicar reseña'}
          </Button>
        </form>
      ) : (
        <div className="bg-gray-700 rounded-lg p-4 mb-8 text-center">
          <p className="text-gray-300 mb-2">Inicia sesión para dejar tu reseña</p>
          <Link href="/auth/login">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              Iniciar sesión
            </Button>
          </Link>

        </div>
      )}

      <div className="space-y-6">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-900/20 border border-red-900/50 rounded-lg p-4 text-center">
            <p className="text-red-200">{error}</p>
            <Button
              onClick={() => window.location.reload()}
              className="mt-2 bg-red-700 hover:bg-red-800 text-white"
              size="sm"
            >
              Reintentar
            </Button>
          </div>
        ) : reviews.length === 0 ? (
          <p className="text-gray-400 text-center py-4">No hay reseñas para esta película. ¡Sé el primero en opinar!</p>
        ) : (
          reviews.map((review) => (
            <div key={review.id}>
              {editingReview === review.id ? (
                <div className="bg-gray-700 rounded-lg p-4 shadow mt-3">
                  <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Editar calificación
                    </label>
                    <StarRating value={editRating} onChange={setEditRating} />
                  </div>

                  <Textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="w-full bg-gray-600 text-white border-gray-500 mb-3"
                    rows={3}
                  />

                  <div className="flex space-x-2">
                    <Button
                      type="button"
                      onClick={() => handleSaveEdit(review.id)}
                      className="bg-green-600 hover:bg-green-700 text-white"
                      size="sm"
                    >
                      Guardar
                    </Button>
                    <Button
                      type="button"
                      onClick={handleCancelEdit}
                      variant="outline"
                      size="sm"
                    >
                      Cancelar
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <ReviewCard
                    review={review}
                    showMovieInfo={false}
                    className="mb-2"
                  />

                  {user && user.uid === review.userId && (
                    <div className="mt-2 mb-4 flex space-x-2">
                      <Button
                        onClick={() => handleStartEdit(review)}
                        variant="outline"
                        size="sm"
                      >
                        Editar
                      </Button>
                      <Button
                        onClick={() => handleDeleteReview(review.id)}
                        variant="destructive"
                        size="sm"
                      >
                        Eliminar
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};