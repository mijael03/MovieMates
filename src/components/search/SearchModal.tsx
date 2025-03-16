"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Movie } from "@/lib/types/movie";
import { searchMovies } from "@/lib/tmdb/client";
import MovieCard from "@/components/movies/MovieCard";
import { useRouter } from "next/navigation";

interface SearchModalProps {
  popularMovies: Movie[];
  topRatedMovies: Movie[];
  upcomingMovies: Movie[];
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const SearchModal: React.FC<SearchModalProps> = ({
  popularMovies = [],
  topRatedMovies = [],
  upcomingMovies = [],
  isOpen: externalIsOpen,
  setIsOpen: externalSetIsOpen,
}) => {
  const router = useRouter();
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [localResults, setLocalResults] = useState<Movie[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Use external state if provided, otherwise use internal state
  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;
  const setIsOpen = externalSetIsOpen || setInternalIsOpen;

  // Log when props change
  useEffect(() => {
    console.log("SearchModal: Props received:", { externalIsOpen, externalSetIsOpen });
    console.log("SearchModal: Using isOpen:", isOpen);
    console.log("SearchModal: setIsOpen is a function:", typeof setIsOpen === "function");
  }, [externalIsOpen, externalSetIsOpen, isOpen, setIsOpen]);

  // Combine all locally available movies and remove duplicates by movie id
  const uniqueLocalMovies = useMemo(() => {
    const allLocalMovies = [...popularMovies, ...topRatedMovies, ...upcomingMovies];
    return allLocalMovies.filter(
      (movie, index, self) => index === self.findIndex((m) => m.id === movie.id)
    );
  }, [popularMovies, topRatedMovies, upcomingMovies]);

  // Handle keyboard shortcut (Ctrl+K)
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if ((event.ctrlKey || event.metaKey) && event.key === "k") {
      event.preventDefault();
      console.log("SearchModal: Keyboard shortcut triggered, calling setIsOpen(true)");
      setIsOpen(true);
      console.log("SearchModal: After keyboard shortcut, isOpen:", isOpen);
    } else if (event.key === "Escape") {
      console.log("SearchModal: Escape key pressed, calling setIsOpen(false)");
      setIsOpen(false);
    }
  }, [setIsOpen, isOpen]);

  // Add event listener for keyboard shortcut
  useEffect(() => {
    console.log("SearchModal: Adding keyboard event listener");
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      console.log("SearchModal: Removing keyboard event listener");
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  // Filter local movies based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setLocalResults([]);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = uniqueLocalMovies.filter(
      (movie) =>
        movie.title.toLowerCase().includes(query) ||
        (movie.overview && movie.overview.toLowerCase().includes(query))
    );

    setLocalResults(filtered.slice(0, 6)); // Limit to 6 results for better UI
  }, [searchQuery, uniqueLocalMovies]);

  // Handle search through API
  const handleSearchMore = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    try {
      const results = await searchMovies(searchQuery);
      // Navigate to a search results page or handle the results as needed
      // For now, we'll just close the modal and log the results
      console.log("API search results:", results);
      setIsOpen(false);
      // Ideally, navigate to a search results page
      // router.push(`/search?query=${encodeURIComponent(searchQuery)}`);
    } catch (error) {
      console.error("Error searching movies:", error);
    } finally {
      setIsSearching(false);
    }
  };

  // Log when Dialog open state changes
  useEffect(() => {
    console.log("SearchModal: Dialog open state:", isOpen);
  }, [isOpen]);

  return (
    <Dialog 
      open={isOpen} 
      onOpenChange={(newOpen) => {
        console.log("SearchModal: Dialog onOpenChange called with:", newOpen);
        setIsOpen(newOpen);
      }}
    >
      <DialogContent className="sm:max-w-[90%] md:max-w-[80%] lg:max-w-[70%] max-h-[90vh] overflow-y-auto bg-slate-900 text-white border-none top-[5%] translate-y-0">
        <DialogTitle className="sr-only">Search Movies</DialogTitle>
        <div className="p-4">
          <div className="relative mb-6">
            <Input
              type="text"
              placeholder="Search for movies..."
              className="w-full py-6 px-4 text-lg bg-slate-800 border-slate-700 focus:border-blue-500 text-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
            {searchQuery.trim() && (
              <Button 
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 hover:bg-blue-700"
                onClick={() => setSearchQuery("")}
              >
                Clear
              </Button>
            )}
          </div>

          {searchQuery.trim() && (
            <div className="mb-4">
              <Button 
                className="w-full bg-blue-600 hover:bg-blue-700 mb-4"
                onClick={handleSearchMore}
                disabled={isSearching}
              >
                {isSearching ? "Searching..." : "Search for more results"}
              </Button>
            </div>
          )}

          {localResults.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {localResults.map((movie) => (
                <div key={movie.id} onClick={() => {
                  setIsOpen(false);
                  router.push(`/movies/${movie.id}`);
                }}>
                  <MovieCard movie={movie} />
                </div>
              ))}
            </div>
          ) : searchQuery.trim() ? (
            <div className="text-center py-8">
              <p className="text-xl">No local results found</p>
              <p className="text-gray-400 mt-2">Try searching for more results or refine your query</p>
            </div>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SearchModal;