// lib/tmdb/client.ts
import { Movie, MovieDetails, MovieResponse } from "../types/movie";
import { LiteMovie, LiteMovieResponse } from "../types/liteMovie";
import { VideoResponse } from "../types/video";

const BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p";

type FetchOptions = {
  page?: number;
  query?: string;
};

// Obtener URL de imagen
export const getImageUrl = (
  path: string | null,
  size: string = "w500"
): string => {
  if (!path) return "/placeholder-movie.svg";
  return `${IMAGE_BASE_URL}/${size}${path}`;
};

// Función genérica para hacer peticiones
const fetchTMDB = async <T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> => {
  const { page = 1, query = "" } = options;

  let url = `${BASE_URL}${endpoint}?api_key=${API_KEY}&language=es-ES&page=${page}`;
  const authentication = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhYmE1ZTIwMjhmMmNmMDQ5MTViOGJlNzcwYTM3YzNjOCIsIm5iZiI6MTc0MjAwMTkxOS4xNTYsInN1YiI6IjY3ZDRkNmZmMjRiN2ViYzM3NjdiOTMwMSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.DLGSs6aprSnXdAK-tKa6CMhIzrVRY7AaOqho6UssK0s'
    }
  };
  if (query) url += `&query=${encodeURIComponent(query)}`;

  const response = await fetch(url,authentication);

  if (!response.ok) {
    throw new Error(`Error TMDB: ${response.status} - ${response.statusText}`);
  }

  return response.json();
};

// Obtener películas populares
export const getPopularMovies = async (
  page: number = 1
): Promise<MovieResponse> => {
  return fetchTMDB<MovieResponse>("/movie/popular?include_adult=false&sort_by=popularity.desc", { page });
};

// Obtener películas populares (versión lite)
export const getPopularMoviesLite = async (
  page: number = 1
): Promise<LiteMovieResponse> => {
  const response = await fetchTMDB<MovieResponse>("/movie/now_playing", { page });
  
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

// Buscar películas
export const searchMovies = async (
  query: string,
  page: number = 1
): Promise<MovieResponse> => {
  return fetchTMDB<MovieResponse>("/search/movie", { query, page });
};

// Obtener detalles de una película
export const getMovieDetails = async (
  movieId: number
): Promise<MovieDetails> => {
  return fetchTMDB<MovieDetails>(`/movie/${movieId}`);
};

// Obtener películas similares
export const getSimilarMovies = async (
  movieId: number
): Promise<MovieResponse> => {
  return fetchTMDB<MovieResponse>(`/movie/${movieId}/similar`);
};

// Obtener películas mejor valoradas
export const getTopRatedMovies = async (
  page: number = 1
): Promise<MovieResponse> => {
  return fetchTMDB<MovieResponse>("/movie/top_rated", { page });
};

// Obtener películas mejor valoradas (versión lite)
export const getTopRatedMoviesLite = async (
  page: number = 1
): Promise<LiteMovieResponse> => {
  const response = await fetchTMDB<MovieResponse>("/movie/top_rated", { page });
  
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

// Obtener películas próximas a estrenarse
export const getUpcomingMovies = async (
  page: number = 1
): Promise<MovieResponse> => {
  return fetchTMDB<MovieResponse>("/movie/upcoming", { page });
};

// Obtener películas próximas a estrenarse (versión lite)
export const getUpcomingMoviesLite = async (
  page: number = 1
): Promise<LiteMovieResponse> => {
  const response = await fetchTMDB<MovieResponse>("/movie/upcoming", { page });
  
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

// Obtener películas en cartelera
export const getNowPlayingMovies = async (
  page: number = 1
): Promise<MovieResponse> => {
  return fetchTMDB<MovieResponse>("/movie/now_playing", { page });
};

// Obtener videos de una película (trailers, teasers, etc.)
export const getMovieVideos = async (
  movieId: number
): Promise<VideoResponse> => {
  return fetchTMDB<VideoResponse>(`/movie/${movieId}/videos`);
};
