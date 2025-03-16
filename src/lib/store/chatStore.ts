import { create } from "zustand";
import { ChatMessage, ChatRoom } from "../types/chat";

interface ChatState {
  messages: ChatMessage[];
  rooms: ChatRoom[];
  currentRoom: string | null;
  loading: boolean;
  error: string | null;
  setMessages: (messages: ChatMessage[]) => void;
  setRooms: (rooms: ChatRoom[]) => void;
  setCurrentRoom: (roomId: string | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  addMessage: (message: ChatMessage) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  rooms: [],
  currentRoom: null,
  loading: false,
  error: null,
  setMessages: (messages) => set({ messages }),
  setRooms: (rooms) => set({ rooms }),
  setCurrentRoom: (roomId) => set({ currentRoom: roomId }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  addMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, message],
    })),
}));
