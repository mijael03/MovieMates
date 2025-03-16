"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getPopularMovies, getTopRatedMovies, getUpcomingMovies } from "@/lib/tmdb/client";
import SearchModal from "./SearchModal";
import { useSearchModalStore } from "@/lib/store/movieStore";

const SearchModalWrapper: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const { isOpen, setIsOpen } = useSearchModalStore();

  // Fetch movie data using React Query
  const { data: popularMoviesData } = useQuery({
    queryKey: ["popularMovies"],
    queryFn: () => getPopularMovies(),
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

  return (
    <>
      {children}
      <SearchModal
        popularMovies={popularMoviesData?.results || []}
        topRatedMovies={topRatedMoviesData?.results || []}
        upcomingMovies={upcomingMoviesData?.results || []}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      />
    </>
  );
};

export default SearchModalWrapper;