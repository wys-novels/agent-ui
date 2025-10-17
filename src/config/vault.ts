export interface AgentApiConfig {
  HOST: string;
  PORT: string;
}

export async function getAgentApiConfig(): Promise<AgentApiConfig> {
  try {
    // Отладочная информация
    console.log('=== ОТЛАДКА ПЕРЕМЕННЫХ ОКРУЖЕНИЯ ===');
    console.log('import.meta.env:', import.meta.env);
    console.log('import.meta.env.MODE:', import.meta.env.MODE);
    console.log('import.meta.env.DEV:', import.meta.env.DEV);
    console.log('import.meta.env.PROD:', import.meta.env.PROD);
    console.log('VITE_VAULT_ADDR:', import.meta.env.VITE_VAULT_ADDR);
    console.log('VITE_VAULT_TOKEN:', import.meta.env.VITE_VAULT_TOKEN);
    console.log('Все ключи env:', Object.keys(import.meta.env));
    console.log('=====================================');
    
    const vaultAddr = import.meta.env.VITE_VAULT_ADDR || 'http://localhost:8200';
    const vaultToken = import.meta.env.VITE_VAULT_TOKEN;
    
    if (!vaultToken) {
      console.error('Vault token не найден в переменных окружения');
      console.log('Используем fallback значения...');
      return {
        HOST: import.meta.env.VITE_API_HOST || '185.104.112.84',
        PORT: import.meta.env.VITE_API_PORT || '3035'
      };
    }

    const response = await fetch(`${vaultAddr}/v1/secret/data/apps/agent-api`, {
      method: 'GET',
      headers: {
        'X-Vault-Token': vaultToken,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Vault request failed: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    return {
      HOST: result.data.data.HOST,
      PORT: result.data.data.PORT
    };
  } catch (error) {
    console.error('Error reading from Vault:', error);
    throw new Error('Failed to get agent API configuration from Vault');
  }
}
