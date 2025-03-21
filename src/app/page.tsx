'use client';

import { Suspense, useEffect, useState } from "react";
import { getPopularMovies, getPopularMoviesLite, getTopRatedMoviesLite, getUpcomingMoviesLite } from "@/lib/tmdb/client";
import HorizontalMovieList from "@/components/movies/HorizontalMovieList";
import HeroSection from "@/components/movies/HeroSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import { LiteMovieResponse } from "@/lib/types/liteMovie";
import { Movie, MovieResponse } from "@/lib/types/movie";

export default function Page() {
  // State for movie data
  const [popularMoviesData, setPopularMoviesData] = useState<LiteMovieResponse | null>(null);
  const [topRatedMoviesData, setTopRatedMoviesData] = useState<LiteMovieResponse | null>(null);
  const [upcomingMoviesData, setUpcomingMoviesData] = useState<LiteMovieResponse | null>(null);
  const [featuredMovie, setFeaturedMovie] = useState<Movie | null>(null);

  // Loading states
  const [popularLoading, setPopularLoading] = useState(true);
  const [topRatedLoading, setTopRatedLoading] = useState(true);
  const [upcomingLoading, setUpcomingLoading] = useState(true);
  const [featuredLoading, setFeaturedLoading] = useState(true);

  // Fetch featured movie (most popular movie with backdrop)
  const fetchFeaturedMovie = async () => {
    setFeaturedLoading(true);
    try {
      const response = await getPopularMovies();
      // Find the first movie with a backdrop path
      const movieWithBackdrop = response.results.find(movie => movie.backdrop_path);
      setFeaturedMovie(movieWithBackdrop || response.results[0]);
    } catch (error) {
      console.error("Error fetching featured movie:", error);
    } finally {
      setFeaturedLoading(false);
    }
  };

  // Fetch popular movies
  const fetchPopularMovies = async () => {
    setPopularLoading(true);
    try {
      const popular = await getPopularMoviesLite();
      setPopularMoviesData(popular);
    } catch (error) {
      console.error("Error fetching popular movies:", error);
    } finally {
      setPopularLoading(false);
    }
  };

  // Fetch top rated movies
  const fetchTopRatedMovies = async () => {
    setTopRatedLoading(true);
    try {
      const topRated = await getTopRatedMoviesLite();
      setTopRatedMoviesData(topRated);
    } catch (error) {
      console.error("Error fetching top rated movies:", error);
    } finally {
      setTopRatedLoading(false);
    }
  };

  // Fetch upcoming movies
  const fetchUpcomingMovies = async () => {
    setUpcomingLoading(true);
    try {
      const upcoming = await getUpcomingMoviesLite();
      setUpcomingMoviesData(upcoming);
    } catch (error) {
      console.error("Error fetching upcoming movies:", error);
    } finally {
      setUpcomingLoading(false);
    }
  };

  // Fetch all movie data on component mount
  useEffect(() => {
    fetchFeaturedMovie();
    fetchPopularMovies();
    fetchTopRatedMovies();
    fetchUpcomingMovies();
  }, []);

  return (
    <div className="min-h-screen w-full bg-gray-900">
      {/* Hero Section with Featured Movie */}
      <HeroSection movie={featuredMovie} isLoading={featuredLoading} />

      {/* Popular Movies Section */}
      <div className="container mx-auto px-6 py-16">
        <HorizontalMovieList
          movies={popularMoviesData?.results || []}
          isLoading={popularLoading}
        />
      </div>

      {/* Features Section */}
      <FeaturesSection />
    </div>
  );
}
