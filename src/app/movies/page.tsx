'use client';

import React, { useEffect, useState, useRef } from 'react';
import { getPopularMoviesLite } from '@/lib/tmdb/client';
import { getMovieReviews } from '@/lib/firebase/reviews';
import { LiteMovie } from '@/lib/types/liteMovie';
import { MovieReview } from '@/lib/types/review';
import LiteMovieCard from '@/components/movies/LiteMovieCard';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getImageUrl } from '@/lib/tmdb/client';
import Link from 'next/link';
import Image from 'next/image';
import ReviewCard from '@/components/movies/ReviewCard';

export default function MoviesPage() {
    // Estado para películas populares
    const [popularMovies, setPopularMovies] = useState<LiteMovie[]>([]);
    const [isLoadingMovies, setIsLoadingMovies] = useState(true);

    // Estado para comentarios recientes
    const [recentReviews, setRecentReviews] = useState<MovieReview[]>([]);
    const [isLoadingReviews, setIsLoadingReviews] = useState(true);

    // Referencia para el contenedor del carrusel
    const carouselRef = useRef<HTMLDivElement>(null);

    // Obtener películas populares
    useEffect(() => {
        const fetchPopularMovies = async () => {
            try {
                setIsLoadingMovies(true);
                const response = await getPopularMoviesLite();
                // Limitamos a 15 películas como se solicitó
                setPopularMovies(response.results.slice(0, 15));
            } catch (error) {
                console.error('Error al cargar películas populares:', error);
            } finally {
                setIsLoadingMovies(false);
            }
        };

        fetchPopularMovies();
    }, []);

    // Obtener comentarios recientes
    useEffect(() => {
        setIsLoadingReviews(true);

        // Utilizamos un listener global para todos los comentarios
        const unsubscribe = getMovieReviews(0, (fetchedReviews) => {
            // Ordenamos por fecha de creación (más recientes primero)
            const sortedReviews = fetchedReviews.sort((a, b) => {
                return b.createdAt?.toDate().getTime() - a.createdAt?.toDate().getTime();
            });

            setRecentReviews(sortedReviews);
            setIsLoadingReviews(false);
        });

        return () => unsubscribe();
    }, []);

    // Función para manejar el scroll infinito
    const handleScroll = (direction: 'left' | 'right') => {
        if (!carouselRef.current) return;

        const container = carouselRef.current;
        const cardWidth = 220 + 16; // Ancho de la tarjeta + margen
        const scrollAmount = direction === 'left' ? -cardWidth : cardWidth;

        // Calculamos la nueva posición de scroll
        const newScrollLeft = container.scrollLeft + scrollAmount;

        // Si llegamos al final, volvemos al inicio
        if (newScrollLeft >= container.scrollWidth - container.clientWidth) {
            container.scrollTo({ left: 0, behavior: 'smooth' });
        }
        // Si llegamos al inicio y vamos hacia atrás, vamos al final
        else if (newScrollLeft < 0) {
            container.scrollTo({ left: container.scrollWidth - container.clientWidth, behavior: 'smooth' });
        }
        // Scroll normal
        else {
            container.scrollTo({ left: newScrollLeft, behavior: 'smooth' });
        }
    };

    return (
        <div className="min-h-screen w-full bg-gray-900 pt-24 pb-12">
            <div className="container mx-auto px-4 max-w-5xl">
                <h1 className="text-3xl font-bold text-white mb-8">Películas</h1>

                {/* Carrusel de películas populares */}
                <section className="mb-12 mx-auto">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold text-white">Películas Populares</h2>
                    </div>

                    <div className="relative">
                        {/* Botón izquierdo */}
                        <button
                            onClick={() => handleScroll('left')}
                            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/60 hover:bg-black/80 text-white rounded-full p-2 shadow-lg transition-all duration-200 focus:outline-none"
                            aria-label="Scroll left"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M15 18l-6-6 6-6" />
                            </svg>
                        </button>

                        {/* Contenedor del carrusel */}
                        <div
                            ref={carouselRef}
                            className="flex overflow-x-auto space-x-4 pb-4 scrollbar-hide scroll-smooth mx-auto"
                            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                        >
                            {isLoadingMovies ? (
                                // Esqueletos de carga
                                Array.from({ length: 5 }).map((_, index) => (
                                    <div key={index} className="bg-gray-800 h-[380px] w-[220px] rounded-lg animate-pulse flex-shrink-0" />
                                ))
                            ) : (
                                // Películas populares
                                popularMovies.map((movie) => (
                                    <div key={movie.id} className="flex-shrink-0">
                                        <LiteMovieCard movie={movie} />
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Botón derecho */}
                        <button
                            onClick={() => handleScroll('right')}
                            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/60 hover:bg-black/80 text-white rounded-full p-2 shadow-lg transition-all duration-200 focus:outline-none"
                            aria-label="Scroll right"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M9 18l6-6-6-6" />
                            </svg>
                        </button>
                    </div>
                </section>

                {/* Sección de comentarios recientes */}
                <section className="mx-auto">
                    <h2 className="text-xl font-semibold text-white mb-6">Comentarios Recientes</h2>

                    {isLoadingReviews ? (
                        // Esqueletos de carga para comentarios
                        <div className="space-y-4">
                            {Array.from({ length: 3 }).map((_, index) => (
                                <div key={index} className="bg-gray-800 p-4 rounded-lg animate-pulse">
                                    <div className="flex items-start space-x-4">
                                        <div className="rounded-full bg-gray-700 h-10 w-10"></div>
                                        <div className="flex-1 space-y-2">
                                            <div className="h-4 bg-gray-700 rounded w-1/4"></div>
                                            <div className="h-4 bg-gray-700 rounded w-1/2"></div>
                                            <div className="h-20 bg-gray-700 rounded"></div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : recentReviews.length === 0 ? (
                        <p className="text-gray-400 text-center py-8">No hay comentarios recientes</p>
                    ) : (
                        <div className="space-y-6">
                            {recentReviews.map((review) => (
                                <ReviewCard
                                    key={review.id}
                                    review={review}
                                    showMovieInfo={true}
                                    className="hover:shadow-lg transition-all duration-300"
                                />
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}