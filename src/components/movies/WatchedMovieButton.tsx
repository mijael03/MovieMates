"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/lib/store/authStore";
import { toggleWatchedMovie, isMovieWatched } from "@/lib/firebase/watchedMovies";
import { EyeIcon, EyeOffIcon } from "lucide-react";

interface WatchedMovieButtonProps {
    movieId: number;
    movieTitle: string;
    variant?: "default" | "outline" | "ghost" | "link";
    className?: string;
    size?: "default" | "sm" | "lg" | "icon";
    showText?: boolean;
}

const WatchedMovieButton: React.FC<WatchedMovieButtonProps> = ({
    movieId,
    movieTitle,
    variant = "outline",
    className = "",
    size = "default",
    showText = true,
}) => {
    const { user } = useAuthStore();
    const [isWatched, setIsWatched] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const checkWatchedStatus = async () => {
            if (user) {
                try {
                    const watched = await isMovieWatched(user.uid, movieId);
                    setIsWatched(watched);
                } catch (error) {
                    console.error("Error checking watched status:", error);
                } finally {
                    setIsLoading(false);
                }
            } else {
                setIsLoading(false);
            }
        };

        checkWatchedStatus();
    }, [user, movieId]);

    const handleToggleWatched = async (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent link navigation if button is inside a link
        e.stopPropagation(); // Prevent event bubbling

        if (!user) return;

        try {
            setIsLoading(true);
            const newWatchedStatus = await toggleWatchedMovie(user.uid, movieId, movieTitle);
            setIsWatched(newWatchedStatus);
        } catch (error) {
            console.error("Error toggling watched status:", error);
        } finally {
            setIsLoading(false);
        }
    };

    if (!user) return null;

    return (
        <Button
            variant={variant}
            size={size}
            className={`${className} ${isWatched ? "bg-green-600 hover:bg-green-700 text-white" : ""}`}
            onClick={handleToggleWatched}
            disabled={isLoading}
        >
            {isWatched ? (
                <>
                    <EyeIcon className="w-5 h-5" />
                    {showText && <span>Ya vista</span>}
                </>
            ) : (
                <>
                    <EyeOffIcon className="w-5 h-5" />
                    {showText && <span>Marcar como vista</span>}
                </>
            )}
        </Button>
    );
};

export default WatchedMovieButton;