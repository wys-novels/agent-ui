import { AgentResponse } from '../types/chat';

const AGENT_API_URL = 'http://localhost:3036/agent/query';

export async function queryAgent(message: string): Promise<AgentResponse> {
  try {
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

