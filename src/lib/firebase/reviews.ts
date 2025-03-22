import {
  collection,
  query,
  orderBy,
  addDoc,
  serverTimestamp,
  onSnapshot,
  where,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  limit,
} from "firebase/firestore";
import { db } from "./config";
import { MovieReview } from "../types/review";
import { User } from "../types/user";

// Agregar reseña a película
export const addReview = async (
  movieId: number,
  user: User,
  content: string,
  rating: number,
  movieTitle?: string,
  movieYear?: number,
  posterPath?: string | null
): Promise<string> => {
  try {
    const reviewRef = await addDoc(collection(db, "reviews"), {
      movieId,
      userId: user.uid,
      displayName: user.displayName || "Usuario",
      photoURL: user.photoURL,
      rating,
      content,
      createdAt: serverTimestamp(),
      // Información adicional de la película
      movieTitle,
      movieYear,
      posterPath,
    });

    return reviewRef.id;
  } catch (error) {
    console.error("Error al añadir reseña:", error);
    throw error;
  }
};

// Obtener reseñas de una película
export const getMovieReviews = (
  movieId: number,
  callback: (reviews: MovieReview[]) => void
) => {
  // Si movieId es 0, obtenemos todos los comentarios (para la página principal)
  const q = movieId === 0
    ? query(collection(db, "reviews"), orderBy("createdAt", "desc"), limit(10))
    : query(
        collection(db, "reviews"),
        where("movieId", "==", movieId),
        orderBy("createdAt", "desc")
      );

  return onSnapshot(
    q,
    async (snapshot) => {
      const reviews = snapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          } as MovieReview)
      );

      // Import the utility function only when needed to avoid circular dependencies
      const { fillMissingMovieInfoBatch } = await import("../utils/movieUtils");
      
      // Fill missing movie information for all reviews
      const filledReviews = await fillMissingMovieInfoBatch(reviews);
      
      callback(filledReviews);
    },
    (error) => {
      console.error("Error al obtener reseñas:", error);
    }
  );
};

// Eliminar reseña
export const deleteReview = async (reviewId: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, "reviews", reviewId));
  } catch (error) {
    console.error("Error al eliminar reseña:", error);
    throw error;
  }
};

// Actualizar reseña
export const updateReview = async (
  reviewId: string,
  content: string,
  rating: number
): Promise<void> => {
  try {
    await updateDoc(doc(db, "reviews", reviewId), {
      content,
      rating,
    });
  } catch (error) {
    console.error("Error al actualizar reseña:", error);
    throw error;
  }
};
