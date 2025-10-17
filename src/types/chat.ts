export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: number;
  isLoading?: boolean;
}

export interface AgentResponse {
  finalResponse?: string;
  needsClarification?: boolean;
  reasoning?: {
    analysis: any;
    recommendations: string[];
  };
  tasks?: Array<{
    command: string;
    prompt: string;
  }>;
}

export interface ChatStore {
  messages: Message[];
  isLoading: boolean;
  addMessage: (message: Message) => void;
  setLoading: (loading: boolean) => void;
  clearMessages: () => void;
}

