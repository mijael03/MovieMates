import React from "react";
import LiteMovieCard from "./LiteMovieCard";
import { LiteMovie } from "@/lib/types/liteMovie";
import { motion } from "framer-motion";

interface LiteMovieGridProps {
    movies: LiteMovie[];
    isLoading?: boolean;
}

const LiteMovieGrid: React.FC<LiteMovieGridProps> = ({ movies, isLoading = false }) => {
    if (isLoading) {
        return (
            <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                key="loading-grid"
            >
                {Array.from({ length: 20 }).map((_, index) => (
                    <div
                        key={index}
                        className="bg-gray-800 h-[380px] w-[220px] rounded-lg animate-pulse"
                    />
                ))}
            </motion.div>
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
        <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            key="movies-grid"
        >
            {movies.map((movie) => (
                <LiteMovieCard key={movie.id} movie={movie} />
            ))}
        </motion.div>
    );
};

export default LiteMovieGrid;