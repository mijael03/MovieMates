'use client';

import React from 'react';
import { LiteMovie } from '@/lib/types/liteMovie';
import LiteMovieCard from './LiteMovieCard';

interface HorizontalMovieListProps {
    title?: string;
    movies: LiteMovie[];
    isLoading?: boolean;
}

const HorizontalMovieList: React.FC<HorizontalMovieListProps> = ({
    title,
    movies,
    isLoading = false
}) => {
    //const containerId = useId().replace(/:/g, '');

    if (isLoading) {
        return (
            <div className="w-full">
                <h2 className="text-2xl font-semibold text-white mb-4">{title}</h2>
                <div className="relative w-full">
                    <div className="flex space-x-4 justify-center">
                        {Array.from({ length: 5 }).map((_, index) => (
                            <div
                                key={index}
                                className="bg-gray-800 h-[380px] w-[220px] rounded-lg animate-pulse"
                            />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (!movies.length) {
        return (
            <div className="w-full">
                <h2 className="text-xl font-semibold text-white mb-4">{title}</h2>
                <div className="text-center py-8">
                    <p className="text-gray-500">No movies found</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full">
            <h2 className="text-xl font-semibold text-white mb-4">{title}</h2>
            <div className="relative w-full">
                <div className="flex space-x-4 justify-center">
                    {movies.slice(0, 5).map((movie) => (
                        <div key={movie.id}>
                            <LiteMovieCard movie={movie} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default HorizontalMovieList;