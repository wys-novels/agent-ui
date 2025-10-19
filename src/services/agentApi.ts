import type { AgentResponse, StreamingStep } from '../types/chat';
import { getAgentApiConfig } from '../config/vault';

let AGENT_API_URL: string | null = null;

async function initializeApiConfig(): Promise<void> {
  console.log('initializeApiConfig вызвана, AGENT_API_URL:', AGENT_API_URL);
  if (!AGENT_API_URL) {
    console.log('Получаем конфигурацию из Vault...');
    const config = await getAgentApiConfig();
    AGENT_API_URL = `http://${config.HOST}:${config.PORT}/agent/query`;
    console.log('URL настроен:', AGENT_API_URL);
  }
}

export async function queryAgent(message: string): Promise<AgentResponse> {
  try {
    // Инициализируем конфигурацию если еще не сделано
    await initializeApiConfig();
    
    const response = await fetch(`${AGENT_API_URL}?message=${encodeURIComponent(message)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    return {
      finalResponse: data.finalResponse,
      needsClarification: data.needsClarification,
      reasoning: data.reasoning,
      tasks: data.tasks,
    };
  } catch (error) {
    console.error('Error querying agent:', error);
    throw new Error('Failed to get response from agent');
  }
}

export async function queryAgentStream(
  message: string,
  onStep: (step: StreamingStep) => void
): Promise<void> {
  try {
    // Инициализируем конфигурацию если еще не сделано
    await initializeApiConfig();
    
    const response = await fetch(`${AGENT_API_URL}?message=${encodeURIComponent(message)}`, {
      method: 'GET',
      headers: {
        'Accept': 'text/event-stream',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('No response body reader available');
    }

    const decoder = new TextDecoder();
    let buffer = '';

    let currentEvent: any = {};
    
    while (true) {
      const { done, value } = await reader.read();
      
      if (done) break;
      
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || ''; // Сохраняем неполную строку в буфере
      
      for (const line of lines) {
        if (line.trim() === '') {
          // Пустая строка означает конец события
          if (currentEvent.data) {
            try {
              const stepData = JSON.parse(currentEvent.data);
              // Добавляем type из event поля
              if (currentEvent.event) {
                stepData.type = currentEvent.event;
              }
              console.log('Parsed SSE step:', stepData);
              onStep(stepData);
            } catch (parseError) {
              console.warn('Failed to parse SSE data:', currentEvent.data, parseError);
            }
          }
          currentEvent = {};
          continue;
        }
        
        if (line.startsWith('event: ')) {
          currentEvent.event = line.slice(7);
        } else if (line.startsWith('id: ')) {
          currentEvent.id = line.slice(4);
        } else if (line.startsWith('data: ')) {
          currentEvent.data = line.slice(6);
        }
      }
    }
  } catch (error) {
    console.error('Error in streaming query:', error);
    onStep({
      type: 'error',
      status: 'completed',
      data: { error: error instanceof Error ? error.message : String(error) },
      timestamp: Date.now()
    });
  }
}

