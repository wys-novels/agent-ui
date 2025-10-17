import { AgentResponse } from '../types/chat';
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

