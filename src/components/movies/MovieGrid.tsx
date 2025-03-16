import React from "react";
import MovieCard from "./MovieCard";
import { Movie } from "@/lib/types/movie";

interface MovieGridProps {
  movies: Movie[];
  isLoading?: boolean;
}

const MovieGrid: React.FC<MovieGridProps> = ({ movies, isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="bg-gray-200 h-96 rounded-lg animate-pulse"
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
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </div>
  );
};

export default MovieGrid;
