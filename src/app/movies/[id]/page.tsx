import React from 'react';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getMovieDetails, getMovieVideos, getImageUrl } from '@/lib/tmdb/client';
import { getSimilarMoviesLite } from '@/lib/tmdb/client-extension';
import { MovieReviewSection } from '@/components/movies/MovieReviewSection';
import { MovieTrailer } from '@/components/movies/MovieTrailer';
import LiteMovieCard from '@/components/movies/LiteMovieCard';
import WatchedMovieButton from '@/components/movies/WatchedMovieButton';
import ScrollButtons from '@/components/movies/ScrollButtons';
import styles from "./HorizontalScroll.module.css";
export async function generateMetadata({ params }: { params: { id: string } }) {
  // Await the params object before accessing its properties
  const { id } = await params;
  const movieId = parseInt(id);

  try {
    const movie = await getMovieDetails(movieId);

    return {
      title: `${movie.title} | MovieMates`,
      description: movie.overview,
    };
  } catch (error) {
    return {
      title: 'Película no encontrada | MovieMates',
      description: 'La película que buscas no existe o no está disponible.',
    };
  }
}

export default async function MoviePage({ params }: { params: { id: string } }) {
  // Await the params object before accessing its properties
  const { id } = await params;
  const movieId = parseInt(id);

  try {
    // Fetch movie data in parallel
    const [movie, videos, similarMovies] = await Promise.all([
      getMovieDetails(movieId),
      getMovieVideos(movieId),
      getSimilarMoviesLite(movieId)
    ]);

    // Find trailer
    const trailer = videos.results.find(
      (video) => video.type === 'Trailer' && video.site === 'YouTube'
    ) || videos.results[0];

    return (
      <div className="min-h-screen w-full bg-gray-900 dark:bg-gray-800 pb-12 relative pt-10">
        {/* Hero section with backdrop */}
        <div className="relative w-full h-[60vh] mb-8 overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src={getImageUrl(movie.backdrop_path, 'original')}
              alt={movie.title}
              fill
              priority
              style={{ objectFit: 'cover' }}
              className="brightness-50"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent" />

          <div className="absolute bottom-0 left-0 right-0 p-8 text-white container mx-auto flex flex-col md:flex-row gap-8">
            <div className="relative w-64 h-96 flex-shrink-0 shadow-xl rounded-lg overflow-hidden hidden md:block">
              <Image
                src={getImageUrl(movie.poster_path)}
                alt={movie.title}
                fill
                style={{ objectFit: 'cover' }}
                className="rounded-lg"
              />
            </div>

            <div className="flex-1">
              <h1 className="text-4xl md:text-5xl font-bold mb-2">{movie.title}</h1>
              {movie.tagline && (
                <p className="text-xl text-gray-300 mb-4 italic">{movie.tagline}</p>
              )}

              <div className="flex items-center mb-4">
                <div className="flex items-center mr-6">
                  <svg className="w-5 h-5 text-yellow-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                  </svg>
                  <span className="text-white font-semibold">{movie.vote_average.toFixed(1)}</span>
                </div>

                <div className="text-gray-300 mr-6">
                  {movie.runtime} min
                </div>

                <div className="text-gray-300">
                  {new Date(movie.release_date).getFullYear()}
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-2">Géneros</h3>
                <div className="flex flex-wrap gap-2">
                  {movie.genres.map((genre) => (
                    <span
                      key={genre.id}
                      className="px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-sm"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-2">Sinopsis</h3>
                <p className="text-gray-300">{movie.overview}</p>
              </div>

              <div className="mb-6">
                <WatchedMovieButton
                  movieId={movieId}
                  movieTitle={movie.title}
                  variant="default"
                  size="lg"
                  className="mt-2"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="container mx-auto px-4 grid grid-cols-1 gap-8">
          {/* Trailer section */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">Trailer</h2>
            <MovieTrailer trailer={trailer} title={movie.title} />

            <div className="mt-12">
              <MovieReviewSection
                movieId={movieId}
                movieTitle={movie.title}
                movieYear={new Date(movie.release_date).getFullYear()}
                posterPath={movie.poster_path}
              />
            </div>
          </div>

        </div>

        {/* Similar movies section - Horizontal scrollable list at the bottom */}
        <div className="container mx-auto px-4 mt-12 pb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Películas similares</h2>
          <div className="relative">
            <ScrollButtons containerId="similar-movies-container" />

            {/* Scrollable container */}
            <div id="similar-movies-container" className={`${styles.scrollContainer} flex overflow-x-auto pb-4 space-x-4 `} >
              {similarMovies.results.slice(0, 10).map((movie) => (
                <div key={movie.id} className="flex-shrink-0">
                  <LiteMovieCard movie={movie} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error loading movie:', error);
    notFound();
  }
}