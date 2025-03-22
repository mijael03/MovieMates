'use client';

import React from 'react';
import { MovieReview } from '@/lib/types/review';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { StarIcon } from '@/components/ui/star-icon';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import Image from 'next/image';
import { getImageUrl } from '@/lib/tmdb/client';

interface ReviewCardProps {
    review: MovieReview;
    showMovieInfo?: boolean;
    className?: string;
}

export const ReviewCard: React.FC<ReviewCardProps> = ({
    review,
    showMovieInfo = true,
    className = ''
}) => {
    const {
        id,
        movieId,
        userId,
        displayName,
        photoURL,
        rating,
        content,
        createdAt,
        movieTitle,
        movieYear,
        posterPath
    } = review;

    // Format the date
    const formattedDate = createdAt?.toDate ?
        createdAt.toDate().toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        }) : '';

    // Star rating display component
    const StarRating = () => (
        <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
                <StarIcon
                    key={star}
                    filled={star <= rating}
                    className={`w-4 h-4 ${star <= rating ? 'text-yellow-500' : 'text-gray-400'}`}
                />
            ))}
        </div>
    );

    return (
        <Card className={`bg-gray-800 border-gray-700 hover:bg-gray-750 transition-colors ${className}`}>
            <div className="flex p-4">
                {/* Left side - Movie poster (if showMovieInfo is true) */}
                {showMovieInfo && posterPath && (
                    <div className="mr-4 flex-shrink-0">
                        <Link href={`/movies/${movieId}`}>
                            <div className="relative w-16 h-24 overflow-hidden rounded-md">
                                <Image
                                    src={getImageUrl(posterPath, 'w92')}
                                    alt={movieTitle || 'Movie poster'}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        </Link>
                    </div>
                )}

                {/* Right side - Review content */}
                <div className="flex-1">
                    {/* Header with user info and rating */}
                    <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center">
                            <Avatar className="h-8 w-8 mr-2">
                                <AvatarImage src={photoURL || undefined} alt={displayName} />
                                <AvatarFallback>{displayName.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                                <h4 className="font-semibold text-white text-sm">{displayName}</h4>
                                <p className="text-xs text-gray-400">{formattedDate}</p>
                            </div>
                        </div>
                        <StarRating />
                    </div>

                    {/* Movie title and year (if showMovieInfo is true) */}
                    {showMovieInfo && movieTitle && (
                        <Link href={`/movies/${movieId}`}>
                            <h3 className="text-md font-medium text-blue-400 hover:text-blue-300 mb-1">
                                {movieTitle} {movieYear && `(${movieYear})`}
                            </h3>
                        </Link>
                    )}

                    {/* Review content */}
                    <p className="text-gray-300 text-sm line-clamp-3">{content}</p>

                    {/* Footer with likes count (placeholder for future implementation) */}
                    <div className="mt-2 flex items-center">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 text-gray-400 mr-1"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                            />
                        </svg>
                        <span className="text-xs text-gray-400">25,338 likes</span>
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default ReviewCard;