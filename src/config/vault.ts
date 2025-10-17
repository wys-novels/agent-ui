export interface AgentApiConfig {
  HOST: string;
  PORT: string;
}

export async function getAgentApiConfig(): Promise<AgentApiConfig> {
  try {
    // Отладочная информация
    console.log('=== ОТЛАДКА ПЕРЕМЕННЫХ ОКРУЖЕНИЯ ===');
    console.log('import.meta.env:', import.meta.env);
    console.log('VITE_API_HOST:', import.meta.env.VITE_API_HOST);
    console.log('VITE_API_PORT:', import.meta.env.VITE_API_PORT);
    console.log('=====================================');
    
    // Используем переменные окружения напрямую (без Vault из-за CORS)
    const HOST = import.meta.env.VITE_API_HOST || '185.104.112.84';
    const PORT = import.meta.env.VITE_API_PORT || '3035';
    
    console.log('Используем конфигурацию:', { HOST, PORT });
    
    return {
      HOST,
      PORT
    };
  } catch (error) {
    console.error('Error getting configuration:', error);
    // Fallback к статическим значениям
    return {
      HOST: '185.104.112.84',
      PORT: '3035'
    };
  }
}
