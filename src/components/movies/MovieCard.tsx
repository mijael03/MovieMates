"use client"
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Movie } from "@/lib/types/movie";
import { getImageUrl } from "@/lib/tmdb/client";
import WatchedMovieButton from "./WatchedMovieButton";

interface MovieCardProps {
  movie: Movie;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  const [imageLoading, setImageLoading] = useState(true);

  return (
    <div className="relative group w-[280px] h-[480px] bg-gray-900 dark:bg-gray-800">
      <Link href={`/movies/${movie.id}`}>
        <Card className="overflow-hidden h-full w-full rounded-xl border-0 shadow-md transition-all duration-300 bg-gray-900 dark:bg-gray-800">
          {/* Card front - Image with overlay */}
          <div className="relative h-full w-full">
            {/* Loading placeholder */}
            {imageLoading && (
              <div className="absolute inset-0 rounded-xl bg-gray-700 animate-pulse flex items-center justify-center">
                <svg
                  className="w-16 h-16 text-gray-500"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
            )}
            <Image
              src={getImageUrl(movie.poster_path)}
              alt={movie.title}
              fill
              style={{ objectFit: "cover" }}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className={`rounded-xl transition-opacity duration-300 ${imageLoading ? 'opacity-0' : 'opacity-100'}`}
              onLoad={() => setImageLoading(false)}
            />

            {/* Title overlay - Visible only when not hovering */}
            <div className="absolute top-0 left-0 right-0 p-6 pt-8 bg-gradient-to-b from-black/80 to-transparent text-white opacity-100 group-hover:opacity-0 transition-opacity duration-300 rounded-xl">
              <h2 className="text-3xl font-bold">{movie.title}</h2>
              <p className="text-sm mt-1 opacity-80">
                {new Date(movie.release_date).getFullYear()}
              </p>
            </div>

            {/* Hover overlay with details */}
            <div className="absolute rounded-xl inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center p-6 text-white ">
              <h2 className="text-3xl font-bold mb-2">{movie.title}</h2>
              <p className="text-sm mb-4">
                {new Date(movie.release_date).toLocaleDateString()}
              </p>
              <p className="text-base line-clamp-4 mb-6">{movie.overview}</p>
              <div className="flex items-center mb-4">
                <svg
                  className="w-5 h-5 text-yellow-500 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 15.585l-7.071 3.712 1.357-7.89L.172 7.71l7.891-1.147L10 0l2.929 6.563 7.891 1.147-5.105 4.97 1.357 7.89z"
                  />
                </svg>
                <span className="text-lg">{movie.vote_average.toFixed(1)}</span>
              </div>
              <div className="flex flex-col gap-2 w-full">
                <WatchedMovieButton
                  movieId={movie.id}
                  movieTitle={movie.title}
                  variant="default"
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </Card>
      </Link>
    </div>
  );
};

export default MovieCard;
