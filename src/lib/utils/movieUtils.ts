// lib/utils/movieUtils.ts
import { getMovieDetails } from "../tmdb/client";
import { MovieReview } from "../types/review";

/**
 * Fills missing movie information in a review by fetching data from TMDB API
 * @param review The review object that might have missing movie information
 * @returns A promise that resolves to the review with filled information
 */
export const fillMissingMovieInfo = async (review: MovieReview): Promise<MovieReview> => {
  console.log(`Processing review ${review.id} for movie ${review.movieId}`);
  console.log(`Current review data: Title=${review.movieTitle}, Year=${review.movieYear}, Poster=${review.posterPath}`);
  
  // If the review already has all the information, return it as is
  // Only skip API call if ALL required fields are present
  if (review.movieTitle && review.movieYear !== undefined && review.posterPath !== undefined) {
    console.log(`Review ${review.id} already has all information, skipping API call`);
    return review;
  }

  try {
    // Fetch movie details from TMDB API
    const movieDetails = await getMovieDetails(review.movieId);
    console.log('Retrieving movie details')
    // Create a new review object with the filled information
    // Create a new review object with the filled information
    // Ensure we're properly handling the posterPath property
    const updatedReview = {
      ...review,
      movieTitle: review.movieTitle || movieDetails.title,
      movieYear: review.movieYear || (movieDetails.release_date ? 
        new Date(movieDetails.release_date).getFullYear() : undefined),
      posterPath: review.posterPath !== undefined && review.posterPath !== null ? 
        review.posterPath : movieDetails.poster_path === null ? undefined : movieDetails.poster_path
    };
    
    console.log('Updated review with movie info:', updatedReview.id, updatedReview.movieTitle, updatedReview.posterPath);
    return updatedReview;
  } catch (error) {
    console.error(`Error fetching movie details for review ${review.id}:`, error);
    // Return the original review if there was an error
    return review;
  }
};

/**
 * Fills missing movie information for an array of reviews
 * @param reviews Array of reviews that might have missing movie information
 * @returns A promise that resolves to an array of reviews with filled information
 */
export const fillMissingMovieInfoBatch = async (reviews: MovieReview[]): Promise<MovieReview[]> => {
  console.log(`Processing batch of ${reviews.length} reviews`);
  
  // Process reviews sequentially to avoid rate limiting and make debugging easier
  const filledReviews: MovieReview[] = [];
  
  for (const review of reviews) {
    try {
      const filledReview = await fillMissingMovieInfo(review);
      filledReviews.push(filledReview);
    } catch (error) {
      console.error(`Error processing review ${review.id}:`, error);
      // Keep the original review if there was an error
      filledReviews.push(review);
    }
  }
  
  console.log(`Completed processing ${filledReviews.length} reviews`);
  return filledReviews;
};