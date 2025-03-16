export interface ChatMessage {
  id: string;
  text: string;
  createdAt: any;
  userId: string;
  displayName: string;
  photoURL?: string | null;
}

export interface ChatRoom {
  id: string;
  name: string;
  description?: string;
  createdAt: any;
  updatedAt: any;
  lastMessage?: string;
  participants: string[];
}
