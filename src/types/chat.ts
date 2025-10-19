export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: number;
  isLoading?: boolean;
  streamingStatus?: StreamingStatus;
}

export interface StreamingStatus {
  isStreaming: boolean;
  currentStep: StreamingStep | null;
  completedSteps: StreamingStep[];
}

export interface StreamingStep {
  type: 'classification' | 'apiPlan' | 'executionResults' | 'finalResponse' | 'error';
  status: 'started' | 'completed';
  data?: any;
  timestamp: number;
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
  updateStreamingStatus: (messageId: string, step: StreamingStep) => void;
  setStreamingComplete: (messageId: string) => void;
  updateMessageContent: (messageId: string, content: string) => void;
}

