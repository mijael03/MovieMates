import {
  collection,
  query,
  orderBy,
  limit,
  addDoc,
  serverTimestamp,
  onSnapshot,
  where,
  doc,
  getDocs,
  setDoc,
} from "firebase/firestore";
import { db } from "./config";
import { ChatMessage, ChatRoom } from "../types/chat";
import { User } from "../types/user";

// Crear sala de chat
export const createChatRoom = async (
  name: string,
  description: string,
  userId: string
): Promise<string> => {
  try {
    const roomRef = await addDoc(collection(db, "chatRooms"), {
      name,
      description,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      participants: [userId],
    });

    return roomRef.id;
  } catch (error) {
    console.error("Error al crear sala de chat:", error);
    throw error;
  }
};

// Obtener salas de chat
export const getChatRooms = (callback: (rooms: ChatRoom[]) => void) => {
  const q = query(collection(db, "chatRooms"), orderBy("updatedAt", "desc"));

  return onSnapshot(
    q,
    (snapshot) => {
      const rooms = snapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          } as ChatRoom)
      );

      callback(rooms);
    },
    (error) => {
      console.error("Error al obtener salas de chat:", error);
    }
  );
};

// Unirse a sala de chat
export const joinChatRoom = async (roomId: string, userId: string) => {
  try {
    const roomRef = doc(db, "chatRooms", roomId);
    await setDoc(
      roomRef,
      {
        participants: [
          ...(
            await getDocs(collection(db, "chatRooms", roomId, "participants"))
          ).docs.map((doc) => doc.id),
          userId,
        ],
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
  } catch (error) {
    console.error("Error al unirse a sala de chat:", error);
    throw error;
  }
};

// Enviar mensaje de chat
export const sendMessage = async (
  roomId: string,
  user: User,
  text: string
): Promise<string> => {
  try {
    const messageRef = await addDoc(
      collection(db, "chatRooms", roomId, "messages"),
      {
        text,
        userId: user.uid,
        displayName: user.displayName,
        photoURL: user.photoURL,
        createdAt: serverTimestamp(),
      }
    );

    // Actualizar últimos datos de la sala
    const roomRef = doc(db, "chatRooms", roomId);
    await setDoc(
      roomRef,
      {
        lastMessage: text,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );

    return messageRef.id;
  } catch (error) {
    console.error("Error al enviar mensaje:", error);
    throw error;
  }
};

// Escuchar mensajes de chat
export const listenToMessages = (
  roomId: string,
  callback: (messages: ChatMessage[]) => void
) => {
  const q = query(
    collection(db, "chatRooms", roomId, "messages"),
    orderBy("createdAt", "asc"),
    limit(100)
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const messages = snapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          } as ChatMessage)
      );

      callback(messages);
    },
    (error) => {
      console.error("Error al escuchar mensajes:", error);
    }
  );
};
