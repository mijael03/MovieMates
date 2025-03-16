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
} from "firebase/firestore";
import { db } from "./config";
import { MovieReview } from "../types/review";
import { User } from "../types/user";

// Agregar reseña a película
export const addReview = async (
  movieId: number,
  user: User,
  content: string,
  rating: number
): Promise<string> => {
  try {
    const reviewRef = await addDoc(collection(db, "reviews"), {
      movieId,
      userId: user.uid,
      displayName: user.displayName,
      photoURL: user.photoURL,
      content,
      rating,
      createdAt: serverTimestamp(),
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
  const q = query(
    collection(db, "reviews"),
    where("movieId", "==", movieId),
    orderBy("createdAt", "desc")
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const reviews = snapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          } as MovieReview)
      );

      callback(reviews);
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
