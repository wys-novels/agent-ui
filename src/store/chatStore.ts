import { create } from 'zustand';
import { Message, ChatStore } from '../types/chat';

export const useChatStore = create<ChatStore>((set) => ({
  messages: [],
  isLoading: false,
  
  addMessage: (message: Message) =>
    set((state) => ({
      messages: [...state.messages, message],
    })),
    
  setLoading: (loading: boolean) =>
    set({ isLoading: loading }),
    
  clearMessages: () =>
    set({ messages: [] }),
}));

