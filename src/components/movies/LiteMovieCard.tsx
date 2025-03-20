"use client"
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { LiteMovie } from "@/lib/types/liteMovie";
import { getImageUrl } from "@/lib/tmdb/client";
import WatchedMovieButton from "./WatchedMovieButton";

interface LiteMovieCardProps {
    movie: LiteMovie;
}

const LiteMovieCard: React.FC<LiteMovieCardProps> = ({ movie }) => {
    const [imageLoading, setImageLoading] = useState(true);
    return (
        <div className="relative group w-[220px] h-[380px] bg-black rounded-xl">
            <Link href={`/movies/${movie.id}`}>
                <Card className="overflow-hidden h-full w-full rounded-xl border-0 shadow-none p-0 m-0 bg-transparent transition-all duration-300">
                    {/* Card front - Image with overlay */}
                    <div className="relative h-full w-full p-0 m-0">
                        {/* Static placeholder - only visible when image is loading */}
                        {imageLoading && (
                            <div className="absolute inset-0 rounded-xl flex flex-col items-center justify-center bg-black text-center z-10">
                                <svg
                                    className="w-12 h-12 text-gray-500 mb-2"
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
                                {/* Display movie title when image is loading */}
                                <h3 className="text-white font-medium text-sm">{movie.title}</h3>
                            </div>
                        )}
                        <Image
                            src={getImageUrl(movie.poster_path)}
                            alt={movie.title}
                            fill
                            style={{ objectFit: "cover" }}
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className={`rounded-xl transition-opacity duration-300 ${imageLoading ? 'opacity-0' : 'opacity-100'} object-cover w-full h-full`}
                            onLoad={() => setImageLoading(false)}
                        />

                        {/* Hover overlay - Only visible on hover */}
                        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 to-transparent text-white rounded-b-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <svg
                                        className="w-4 h-4 text-yellow-500 mr-1"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M10 15.585l-7.071 3.712 1.357-7.89L.172 7.71l7.891-1.147L10 0l2.929 6.563 7.891 1.147-5.105 4.97 1.357 7.89z"
                                        />
                                    </svg>
                                    <span className="text-sm">{movie.vote_average.toFixed(1)}</span>
                                </div>
                                <WatchedMovieButton
                                    movieId={movie.id}
                                    movieTitle={movie.title}
                                    variant="ghost"
                                    size="lg"
                                    showText={false}
                                    className="p-2"
                                />
                            </div>
                        </div>
                    </div>
                </Card>
            </Link>
        </div>
    );
};

export default LiteMovieCard;