"use client";

import React from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getPopularMovies, getPopularMoviesLite, getTopRatedMovies, getUpcomingMovies } from "@/lib/tmdb/client";
import SearchModal from "./SearchModal";
import { useSearchModalStore } from "@/lib/store/movieStore";
import { Movie } from "@/lib/types/movie";
import { LiteMovieResponse } from "@/lib/types/liteMovie";

const SearchModalWrapper: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const { isOpen, setIsOpen } = useSearchModalStore();
  const queryClient = useQueryClient();

  // Get all cached movie data from paginated queries
  const getAllCachedMovies = () => {
    // Extract all cached data for popular movies (all pages)
    const popularMoviesQueries = queryClient.getQueriesData<LiteMovieResponse>({
      queryKey: ['popularMovies'],
    });

    // Extract all cached data for top rated movies (all pages)
    const topRatedMoviesQueries = queryClient.getQueriesData<LiteMovieResponse>({
      queryKey: ['topRatedMovies'],
    });

    // Extract all cached data for upcoming movies (all pages)
    const upcomingMoviesQueries = queryClient.getQueriesData<LiteMovieResponse>({
      queryKey: ['upcomingMovies'],
    });

    // Combine all movie results from all pages
    const allPopularMovies = popularMoviesQueries
      .map(([_, data]) => data?.results || [])
      .flat();

    const allTopRatedMovies = topRatedMoviesQueries
      .map(([_, data]) => data?.results || [])
      .flat();

    const allUpcomingMovies = upcomingMoviesQueries
      .map(([_, data]) => data?.results || [])
      .flat();

    return {
      popularMovies: allPopularMovies,
      topRatedMovies: allTopRatedMovies,
      upcomingMovies: allUpcomingMovies
    };
  };

  // Fetch base movie data using React Query for non-paginated data
  const { data: popularMoviesData } = useQuery({
    queryKey: ["popularMovies"],
    queryFn: () => getPopularMoviesLite(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const { data: topRatedMoviesData } = useQuery({
    queryKey: ["topRatedMovies"],
    queryFn: () => getTopRatedMovies(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const { data: upcomingMoviesData } = useQuery({
    queryKey: ["upcomingMovies"],
    queryFn: () => getUpcomingMovies(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Get all cached movies from pagination
  const cachedMovies = getAllCachedMovies()

  return (
    <>
      {children}
      <SearchModal
        popularMovies={[
          ...(popularMoviesData?.results || []),
          ...cachedMovies.popularMovies
        ]}
        topRatedMovies={[
          ...(topRatedMoviesData?.results || []),
          ...cachedMovies.topRatedMovies
        ]}
        upcomingMovies={[
          ...(upcomingMoviesData?.results || []),
          ...cachedMovies.upcomingMovies
        ]}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      />
    </>
  );
}
export default SearchModalWrapper;