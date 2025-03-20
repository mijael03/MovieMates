'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/authStore';
import { getWatchedMovies } from '@/lib/firebase/watchedMovies';
import { getMovieDetails } from '@/lib/tmdb/client';
import LiteMovieCard from '@/components/movies/LiteMovieCard';
import { Movie } from '@/lib/types/movie';

export default function WatchedMoviesPage() {
    const { user } = useAuthStore();
    const router = useRouter();
    const [movies, setMovies] = useState<Movie[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Redirect if not logged in
        if (!user && !loading) {
            router.push('/auth/login');
            return;
        }

        const fetchWatchedMovies = async () => {
            if (!user) return;

            try {
                setLoading(true);
                // Get the list of watched movie IDs from Firebase
                const watchedMovies = await getWatchedMovies(user.uid);

                // Fetch details for each movie from TMDB API
                const moviePromises = watchedMovies.map(async (watchedMovie: { id: number }) => {
                    try {
                        return await getMovieDetails(watchedMovie.id);
                    } catch (error) {
                        console.error(`Error fetching movie ${watchedMovie.id}:`, error);
                        return null;
                    }
                });

                const movieDetails = await Promise.all(moviePromises);
                // Filter out any null results (failed fetches)
                setMovies(movieDetails.filter(Boolean) as Movie[]);
            } catch (error) {
                console.error('Error fetching watched movies:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchWatchedMovies();
    }, [user, router, loading]);

    if (!user) {
        return (
            <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
                <p className="text-xl">Iniciando sesión...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
            <div className="container mx-auto">
                <h1 className="text-4xl font-bold mb-8">Mis Películas Vistas</h1>

                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        {Array.from({ length: 10 }).map((_, index) => (
                            <div
                                key={index}
                                className="bg-gray-800 h-[380px] w-[220px] rounded-lg animate-pulse"
                            />
                        ))}
                    </div>
                ) : movies.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        {movies.map((movie) => (
                            <LiteMovieCard key={movie.id} movie={movie} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <p className="text-xl text-gray-400 mb-4">
                            No has marcado ninguna película como vista todavía.
                        </p>
                        <p className="text-gray-500">
                            Explora películas y marca las que ya hayas visto para construir tu colección.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}