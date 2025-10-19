import { create } from 'zustand';
import { Message, ChatStore, StreamingStatus, StreamingStep } from '../types/chat';

export const useChatStore = create<ChatStore>((set, get) => ({
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

  updateStreamingStatus: (messageId: string, step: StreamingStep) =>
    set((state) => {
      console.log('Updating streaming status for message:', messageId, 'step:', step);
      return {
        messages: state.messages.map((msg) => {
          if (msg.id !== messageId) return msg;
          
          const currentStatus = msg.streamingStatus || {
            isStreaming: true,
            currentStep: null,
            completedSteps: []
          };
          
          let newStatus: StreamingStatus;
          
          if (step.status === 'started') {
            newStatus = {
              ...currentStatus,
              currentStep: step
            };
          } else {
            // Завершение шага
            const completedSteps = [...currentStatus.completedSteps, step];
            newStatus = {
              isStreaming: step.type !== 'finalResponse' && step.type !== 'error',
              currentStep: null,
              completedSteps
            };
          }
          
          return {
            ...msg,
            streamingStatus: newStatus
          };
        })
      };
    }),

  setStreamingComplete: (messageId: string) =>
    set((state) => ({
      messages: state.messages.map((msg) => {
        if (msg.id !== messageId) return msg;
        
        return {
          ...msg,
          streamingStatus: {
            isStreaming: false,
            currentStep: null,
            completedSteps: msg.streamingStatus?.completedSteps || []
          }
        };
      })
    })),

  updateMessageContent: (messageId: string, content: string) =>
    set((state) => {
      console.log('Updating message content in store:', messageId, content.substring(0, 100) + '...');
      return {
        messages: state.messages.map((msg) => {
          if (msg.id !== messageId) return msg;
          
          return {
            ...msg,
            content
          };
        })
      };
    })
}));

