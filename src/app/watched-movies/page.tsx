'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/authStore';
import { getWatchedMovies } from '@/lib/firebase/watchedMovies';
import { getMovieDetails } from '@/lib/tmdb/client';
import { Movie } from '@/lib/types/movie';
import { LiteMovie } from '@/lib/types/liteMovie';
import PaginatedMovieGrid from '@/components/movies/PaginatedMovieGrid';

export default function WatchedMoviesPage() {
    const { user } = useAuthStore();
    const router = useRouter();
    const [allMovies, setAllMovies] = useState<Movie[]>([]);
    const [loading, setLoading] = useState(true);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const moviesPerPage = 10;

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
                setAllMovies(movieDetails.filter(Boolean) as Movie[]);
            } catch (error) {
                console.error('Error fetching watched movies:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchWatchedMovies();
    }, [user, router, loading]);

    // Get current movies for pagination
    const indexOfLastMovie = currentPage * moviesPerPage;
    const indexOfFirstMovie = indexOfLastMovie - moviesPerPage;
    const currentMovies = allMovies.slice(indexOfFirstMovie, indexOfLastMovie);
    const totalPages = Math.ceil(allMovies.length / moviesPerPage);

    // Handle page change
    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
        // Scroll to top when page changes
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

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
                    <PaginatedMovieGrid
                        movies={[]}
                        currentPage={1}
                        totalPages={1}
                        onPageChange={() => { }}
                        isLoading={true}
                    />
                ) : allMovies.length > 0 ? (
                    <PaginatedMovieGrid
                        movies={currentMovies as LiteMovie[]}
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                ) : (
                    <div className="text-center py-12">
                        <p className="text-xl text-gray-400 mb-4">
                            No has marcado ninguna película como vista todavía.
                        </p>
                        <p className="text-gray-500">
                            Explora películas y marca las que ya hayas visto para construir tu colección.
                        </p>
                    </div >
                )
                }
            </div >
        </div >
    );
}