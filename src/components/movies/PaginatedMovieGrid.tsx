'use client';

import React, { useRef } from "react";
import LiteMovieGrid from "./LiteMovieGrid";
import Pagination from "@/components/ui/pagination";
import { LiteMovie, LiteMovieResponse } from "@/lib/types/liteMovie";
import { AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";

interface PaginatedMovieGridProps {
    movies: LiteMovie[];
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    isLoading?: boolean;
    // New props for React Query integration
    queryKey?: string;
    queryFn?: (page: number) => Promise<LiteMovieResponse>;
    staleTime?: number;
}

const PaginatedMovieGrid: React.FC<PaginatedMovieGridProps> = ({
    movies,
    currentPage,
    totalPages,
    onPageChange,
    isLoading: externalIsLoading = false,
    queryKey,
    queryFn,
    staleTime = 1000 * 60 * 5, // 5 minutes by default
}) => {
    const gridContainerRef = useRef<HTMLDivElement>(null);

    // Use React Query for data fetching if queryKey and queryFn are provided
    const {
        data,
        isLoading: queryIsLoading,
        isFetching,
    } = useQuery({
        queryKey: [queryKey || 'disabled-query', currentPage],
        queryFn: () => queryFn ? queryFn(currentPage) : Promise.resolve({ results: [], total_pages: 0, page: 0, total_results: 0 }),
        enabled: !!queryKey && !!queryFn,
        staleTime,
        placeholderData: (oldData) => oldData, // Replace keepPreviousData with placeholderData in v5
    });

    // Determine if we're loading based on external or query loading state
    const isLoading = queryKey ? (queryIsLoading || isFetching) : externalIsLoading;

    // Use data from query if available, otherwise use provided movies
    const displayMovies = queryKey && data ? data.results : movies;
    const displayTotalPages = queryKey && data ? data.total_pages : totalPages;

    // Custom page change handler to prevent scroll jumps
    const handlePageChange = (page: number) => {
        // Store the current scroll position before page change
        const scrollPosition = window.scrollY;

        // Change the page
        onPageChange(page);

        // Restore scroll position after state update
        window.scrollTo({
            top: scrollPosition,
            behavior: 'auto' // Use 'auto' instead of 'smooth' to prevent visible scrolling
        });
    };

    return (
        <div className="space-y-6">
            {/* Fixed height container to maintain consistent layout */}
            <div ref={gridContainerRef} className="min-h-[400px]">
                <AnimatePresence mode="wait">
                    <LiteMovieGrid movies={displayMovies} isLoading={isLoading} />
                </AnimatePresence>
            </div>
            {!isLoading && displayTotalPages > 1 && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={displayTotalPages}
                    onPageChange={handlePageChange}
                />
            )}
        </div>
    );
};

export default PaginatedMovieGrid;