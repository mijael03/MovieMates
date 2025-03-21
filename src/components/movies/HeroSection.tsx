'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Movie } from '@/lib/types/movie';
import { getImageUrl } from '@/lib/tmdb/client';

interface HeroSectionProps {
    movie: Movie | null;
    isLoading?: boolean;
}

const HeroSection: React.FC<HeroSectionProps> = ({ movie, isLoading = false }) => {
    if (isLoading || !movie) {
        return (
            <div className="relative w-full h-[70vh] bg-gray-900 flex items-center justify-center">
                <div className="animate-pulse bg-gray-800 w-full h-full"></div>
            </div>
        );
    }

    // Extract year from release date
    const releaseYear = movie.release_date ? new Date(movie.release_date).getFullYear() : '';

    return (
        <div className="relative w-full h-[70vh] overflow-hidden">
            {/* Backdrop image with fade-to-black effect */}
            <div className="absolute inset-0 w-full h-full">
                <Image
                    src={getImageUrl(movie.backdrop_path, 'original')}
                    alt={movie.title}
                    fill
                    priority
                    style={{ objectFit: 'cover' }}
                    className="brightness-[0.65] transition-all duration-500"
                />
            </div>

            {/* Gradient overlay that creates fade-to-black effect only on the sides */}
            <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-transparent via-25% to-gray-900/1"></div>
            <div className="absolute inset-0 bg-gradient-to-l from-gray-900 via-transparent via-25% to-gray-900/1"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent via-15% to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent via-85% to-gray-900"></div>

            {/* Movie info - positioned vertically on the side */}
            <div className="absolute right-5 top-1/2 -translate-y-1/2 z-10 flex flex-col items-end">
                <Link href={`/movies/${movie.id}`}>
                    <div className="vertical-text text-sm font-bold text-gray-400 tracking-tight hover:text-gray-300 transition-colors writing-mode-vertical">
                        {movie.title} - {releaseYear}
                    </div>
                </Link>
            </div>

            {/* Tagline at the bottom center */}
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-10 text-center">
                <h1 className="text-3xl md:text-4xl font-bold text-white tracking-wide drop-shadow-lg">
                    Explore. Review. Connect. <br /> Your next favorite movie awaits!
                </h1>
            </div>

            {/* Add custom CSS for vertical text */}
            <style jsx>{`
                .writing-mode-vertical {
                    writing-mode: vertical-rl;
                    text-orientation: mixed;
                }
            `}</style>
        </div>
    );
};

export default HeroSection;