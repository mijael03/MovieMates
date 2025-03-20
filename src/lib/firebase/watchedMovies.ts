// lib/firebase/watchedMovies.ts
import { doc, updateDoc, arrayUnion, arrayRemove, getDoc } from "firebase/firestore";
import { db } from "./config";

/**
 * Toggles a movie's watched status for a user
 * @param userId The user's ID
 * @param movieId The movie's ID
 * @param movieTitle The movie's title (for display purposes)
 * @returns A promise that resolves to the updated watched status
 */
export const toggleWatchedMovie = async (
  userId: string,
  movieId: number,
  movieTitle: string
): Promise<boolean> => {
  try {
    // Reference to the user document
    const userRef = doc(db, "users", userId);
    
    // Get the current user data
    const userDoc = await getDoc(userRef);
    const userData = userDoc.data();
    
    // Check if the user has a watchedMovies array and if the movie is in it
    const watchedMovies = userData?.watchedMovies || [];
    const isWatched = watchedMovies.some((movie: any) => movie.id === movieId);
    
    if (isWatched) {
      // Remove the movie from watchedMovies
      await updateDoc(userRef, {
        watchedMovies: arrayRemove({ id: movieId, title: movieTitle })
      });
      return false; // Movie is now unwatched
    } else {
      // Add the movie to watchedMovies
      await updateDoc(userRef, {
        watchedMovies: arrayUnion({ id: movieId, title: movieTitle })
      });
      return true; // Movie is now watched
    }
  } catch (error) {
    console.error("Error toggling watched movie:", error);
    throw error;
  }
};

/**
 * Gets all watched movies for a user
 * @param userId The user's ID
 * @returns A promise that resolves to an array of watched movies
 */
export const getWatchedMovies = async (userId: string) => {
  try {
    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      const userData = userDoc.data();
      return userData.watchedMovies || [];
    }
    
    return [];
  } catch (error) {
    console.error("Error getting watched movies:", error);
    throw error;
  }
};

/**
 * Checks if a movie is in the user's watched list
 * @param userId The user's ID
 * @param movieId The movie's ID
 * @returns A promise that resolves to a boolean indicating if the movie is watched
 */
export const isMovieWatched = async (userId: string, movieId: number): Promise<boolean> => {
  if (!userId) return false;
  
  try {
    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      const userData = userDoc.data();
      const watchedMovies = userData.watchedMovies || [];
      return watchedMovies.some((movie: any) => movie.id === movieId);
    }
    
    return false;
  } catch (error) {
    console.error("Error checking if movie is watched:", error);
    return false;
  }
};