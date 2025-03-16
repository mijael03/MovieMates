"use client";
import React, { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase/config";
import { useAuthStore } from "@/lib/store/authStore";
import { User } from "@/lib/types/user";

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { setUser, setLoading, setError } = useAuthStore();

  useEffect(() => {
    setLoading(true);

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          // Obtener datos adicionales del usuario desde Firestore
          const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));

          if (userDoc.exists()) {
            const userData = userDoc.data() as User;
            setUser(userData);
          } else {
            // Si no existe en Firestore pero sí en Auth
            const user: User = {
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: firebaseUser.displayName,
              photoURL: firebaseUser.photoURL,
            };
            setUser(user);
          }
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Error en AuthProvider:", error);
        setError(
          error instanceof Error ? error.message : "Error de autenticación"
        );
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [setUser, setLoading, setError]);

  return <>{children}</>;
};

export default AuthProvider;
