import { useState } from 'react';
import { Container, Title, Text, Stack, Box } from '@mantine/core';
import { useChatStore } from '../store/chatStore';
import { queryAgent } from '../services/agentApi';
import { MessageList } from './MessageList';
import { ChatInput } from './ChatInput';

export function ChatInterface() {
  const { messages, isLoading, addMessage, setLoading } = useChatStore();
  const [error, setError] = useState<string | null>(null);

  const handleSendMessage = async (content: string) => {
    // Добавляем сообщение пользователя
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      role: 'user',
      timestamp: Date.now(),
    };
    addMessage(userMessage);

    // Добавляем сообщение загрузки от агента
    const loadingMessage: Message = {
      id: (Date.now() + 1).toString(),
      content: '',
      role: 'assistant',
      timestamp: Date.now() + 1,
      isLoading: true,
    };
    addMessage(loadingMessage);

    setLoading(true);
    setError(null);

    try {
      const response = await queryAgent(content);
      
      // Удаляем сообщение загрузки
      const updatedMessages = messages.filter(msg => msg.id !== loadingMessage.id);
      
      // Добавляем ответ агента
      const agentMessage: Message = {
        id: (Date.now() + 2).toString(),
        content: response.finalResponse || 'Извините, не удалось получить ответ.',
        role: 'assistant',
        timestamp: Date.now() + 2,
      };
      
      // Обновляем store с новыми сообщениями
      useChatStore.setState({
        messages: [...updatedMessages, userMessage, agentMessage]
      });
      
    } catch (err) {
      // Удаляем сообщение загрузки и добавляем ошибку
      const updatedMessages = messages.filter(msg => msg.id !== loadingMessage.id);
      
      const errorMessage: Message = {
        id: (Date.now() + 2).toString(),
        content: 'Произошла ошибка при обращении к агенту. Попробуйте еще раз.',
        role: 'assistant',
        timestamp: Date.now() + 2,
      };
      
      useChatStore.setState({
        messages: [...updatedMessages, userMessage, errorMessage]
      });
      
      setError('Ошибка соединения с агентом');
    } finally {
      setLoading(false);
    }
  };

  const hasMessages = messages.length > 0;

  if (!hasMessages) {
    return (
      <Container size="sm" style={{ height: '100vh', display: 'flex', alignItems: 'center' }}>
        <Stack align="center" gap="xl" style={{ width: '100%' }}>
          <Title order={1} ta="center" c="dimmed">
            Agent UI
          </Title>
          <Text size="lg" c="dimmed" ta="center">
            Начните диалог с AI агентом
          </Text>
          <Box style={{ width: '100%' }}>
            <ChatInput 
              onSendMessage={handleSendMessage}
              isLoading={isLoading}
              centered
            />
          </Box>
        </Stack>
      </Container>
    );
  }

  return (
    <Container size="md" style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Box style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <MessageList messages={messages} />
      </Box>
      <Box style={{ padding: '16px 0' }}>
        <ChatInput 
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
        />
      </Box>
    </Container>
  );
}

