'use client';

import { Suspense, useEffect, useState } from "react";
import { getPopularMoviesLite, getTopRatedMoviesLite, getUpcomingMoviesLite } from "@/lib/tmdb/client";
import PaginatedMovieGrid from "@/components/movies/PaginatedMovieGrid";
import { LiteMovieResponse } from "@/lib/types/liteMovie";

export default function Page() {
  // State for movie data
  const [popularMoviesData, setPopularMoviesData] = useState<LiteMovieResponse | null>(null);
  const [topRatedMoviesData, setTopRatedMoviesData] = useState<LiteMovieResponse | null>(null);
  const [upcomingMoviesData, setUpcomingMoviesData] = useState<LiteMovieResponse | null>(null);

  // Separate loading states for each section
  const [popularLoading, setPopularLoading] = useState(true);
  const [topRatedLoading, setTopRatedLoading] = useState(true);
  const [upcomingLoading, setUpcomingLoading] = useState(true);

  // Pagination state
  const [popularPage, setPopularPage] = useState(1);
  const [topRatedPage, setTopRatedPage] = useState(1);
  const [upcomingPage, setUpcomingPage] = useState(1);

  // Define fetch functions outside useEffect so they can be passed as props
  const fetchPopularMovies = async (): Promise<LiteMovieResponse> => {
    setPopularLoading(true);
    try {
      const popular = await getPopularMoviesLite(popularPage);
      setPopularMoviesData(popular);
      return popular;
    } catch (error) {
      console.error("Error fetching popular movies:", error);
      throw error;
    } finally {
      setPopularLoading(false);
    }
  };

  const fetchTopRatedMovies = async (): Promise<LiteMovieResponse> => {
    setTopRatedLoading(true);
    try {
      const topRated = await getTopRatedMoviesLite(topRatedPage);
      setTopRatedMoviesData(topRated);
      return topRated;
    } catch (error) {
      console.error("Error fetching top rated movies:", error);
      throw error;
    } finally {
      setTopRatedLoading(false);
    }
  };

  const fetchUpcomingMovies = async (): Promise<LiteMovieResponse> => {
    setUpcomingLoading(true);
    try {
      const upcoming = await getUpcomingMoviesLite(upcomingPage);
      setUpcomingMoviesData(upcoming);
      return upcoming;
    } catch (error) {
      console.error("Error fetching upcoming movies:", error);
      throw error;
    } finally {
      setUpcomingLoading(false);
    }
  };

  // Fetch popular movies
  useEffect(() => {
    fetchPopularMovies();
  }, [popularPage]);

  // Fetch top rated movies
  useEffect(() => {
    fetchTopRatedMovies();
  }, [topRatedPage]);

  // Fetch upcoming movies
  useEffect(() => {
    fetchUpcomingMovies();
  }, [upcomingPage]);

  return (
    <div className="min-h-screen w-full bg-gray-900 dark:bg-gray-800 px-4 py-8">
      <header className="mb-12 text-center container mx-auto">
        <div className="flex justify-center mb-4">
          <img
            src="/moviemate.png"
            alt="MovieMate Logo"
            className="h-56 w-auto object-contain transform hover:scale-105 transition-transform duration-300"
          />
        </div>
        <h1 className="text-4xl font-bold mb-2 text-white">MovieMates</h1>
        <p className="text-gray-400">Discover and track your favorite movies</p>
      </header>

      <main className="space-y-12 container mx-auto">
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-white">Popular Movies</h2>
          </div>
          <PaginatedMovieGrid
            movies={popularMoviesData?.results || []}
            currentPage={popularPage}
            totalPages={popularMoviesData?.total_pages || 1}
            onPageChange={setPopularPage}
            queryKey="popularMovies"
            queryFn={fetchPopularMovies}
            isLoading={popularLoading}
          />
        </section>

        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-white">Top Rated</h2>
          </div>
          <PaginatedMovieGrid
            movies={topRatedMoviesData?.results || []}
            currentPage={topRatedPage}
            totalPages={topRatedMoviesData?.total_pages || 1}
            onPageChange={setTopRatedPage}
            queryKey="topRatedMovies"
            queryFn={fetchTopRatedMovies}
            isLoading={topRatedLoading}
          />
        </section>

        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-white">Upcoming Releases</h2>
          </div>
          <PaginatedMovieGrid
            movies={upcomingMoviesData?.results || []}
            currentPage={upcomingPage}
            totalPages={upcomingMoviesData?.total_pages || 1}
            onPageChange={setUpcomingPage}
            queryKey="upcomingMovies"
            queryFn={fetchUpcomingMovies}
            isLoading={upcomingLoading}
          />
        </section>
      </main>
    </div>
  );
}
