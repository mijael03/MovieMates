import { create } from "zustand";
import { Movie, MovieDetails } from "../types/movie";

interface MovieState {
  movies: Movie[];
  selectedMovie: MovieDetails | null;
  loading: boolean;
  error: string | null;
  setMovies: (movies: Movie[]) => void;
  setSelectedMovie: (movie: MovieDetails | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearSelectedMovie: () => void;
}

interface SearchModalState {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export const useSearchModalStore = create<SearchModalState>((set) => ({
  isOpen: false,
  setIsOpen: (isOpen) => set({ isOpen }),
}));

export const useMovieStore = create<MovieState>((set) => ({
  movies: [],
  selectedMovie: null,
  loading: false,
  error: null,
  setMovies: (movies) => set({ movies }),
  setSelectedMovie: (movie) => set({ selectedMovie: movie }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  clearSelectedMovie: () => set({ selectedMovie: null }),
}));
