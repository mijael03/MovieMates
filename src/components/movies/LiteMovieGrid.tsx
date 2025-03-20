import React from "react";
import LiteMovieCard from "./LiteMovieCard";
import { LiteMovie } from "@/lib/types/liteMovie";

interface LiteMovieGridProps {
    movies: LiteMovie[];
    isLoading?: boolean;
}

const LiteMovieGrid: React.FC<LiteMovieGridProps> = ({ movies, isLoading = false }) => {
    if (isLoading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {Array.from({ length: 10 }).map((_, index) => (
                    <div
                        key={index}
                        className="bg-gray-800 h-80 w-[220px] rounded-lg animate-pulse"
                    />
                ))}
            </div>
        );
    }

    if (!movies.length) {
        return (
            <div className="text-center py-12">
                <p className="text-xl text-gray-500">No se encontraron películas</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {movies.map((movie) => (
                <LiteMovieCard key={movie.id} movie={movie} />
            ))}
        </div>
    );
};

export default LiteMovieGrid;