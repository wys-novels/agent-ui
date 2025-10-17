import { useState } from 'react';
import { Box } from '@mantine/core';
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
      <div className="app-layout">
        {/* Header Zone */}
        <div className="header-zone">
          <h1 className="header-title">
            Lifes Agent
          </h1>
          <p className="header-subtitle">
            AI-агент, поддерживающий интеграции с другими сервисами
          </p>
        </div>

        {/* Core Zone - Main Interactive Area */}
        <div className="core-zone">
          <div className="visual-core">
            <div className="input-field">
              <ChatInput 
                onSendMessage={handleSendMessage}
                isLoading={isLoading}
                centered
              />
            </div>
          </div>
          <div className="hint-text">
            Например: <span className="example">/analyze air quality</span>
          </div>
        </div>

        {/* Footer Zone */}
        <div className="footer-zone">
          <div className="footer-text">
            © 2025 Lifes Agent
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-layout">
      <div className="chat-layout">
        <div className="chat-messages">
          <MessageList messages={messages} />
        </div>
        <div className="chat-input-container">
          <ChatInput 
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
}

