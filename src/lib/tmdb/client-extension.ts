// This file extends the TMDB client with additional functionality
import { MovieResponse } from "../types/movie";
import { LiteMovieResponse } from "../types/liteMovie";
import { getSimilarMovies } from "./client";

// Get similar movies (lite version)
export const getSimilarMoviesLite = async (
  movieId: number
): Promise<LiteMovieResponse> => {
  const response = await getSimilarMovies(movieId);
  
  // Transform to lite version
  return {
    page: response.page,
    results: response.results.map(movie => ({
      id: movie.id,
      title: movie.title,
      poster_path: movie.poster_path,
      vote_average: movie.vote_average
    })),
    total_pages: response.total_pages,
    total_results: response.total_results
  };
};