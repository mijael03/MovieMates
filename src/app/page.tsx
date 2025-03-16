import { Suspense } from "react";
import { getPopularMovies, getTopRatedMovies, getUpcomingMovies } from "@/lib/tmdb/client";
import MovieGrid from "@/components/movies/MovieGrid";

// Using the correct Next.js App Router pattern for async Server Components
export default async function Page() {
  // Fetch movie data in parallel
  const [popularMoviesData, topRatedMoviesData, upcomingMoviesData] = await Promise.all([
    getPopularMovies(),
    getTopRatedMovies(),
    getUpcomingMovies()
  ]);

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
          <Suspense fallback={<MovieGrid movies={[]} isLoading={true} />}>
            <MovieGrid movies={popularMoviesData.results.slice(0, 8)} />
          </Suspense>
        </section>

        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-white">Top Rated</h2>
          </div>
          <Suspense fallback={<MovieGrid movies={[]} isLoading={true} />}>
            <MovieGrid movies={topRatedMoviesData.results.slice(0, 8)} />
          </Suspense>
        </section>

        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-white">Upcoming Releases</h2>
          </div>
          <Suspense fallback={<MovieGrid movies={[]} isLoading={true} />}>
            <MovieGrid movies={upcomingMoviesData.results.slice(0, 8)} />
          </Suspense>
        </section>
      </main>
    </div>
  );
}
