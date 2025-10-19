import { useState } from 'react';
import { Box } from '@mantine/core';
import { useChatStore } from '../store/chatStore';
import { queryAgent, queryAgentStream } from '../services/agentApi';
import { MessageList } from './MessageList';
import { ChatInput } from './ChatInput';
import { StreamingStatus } from './StreamingStatus';
import { Message } from '../types/chat';

export function ChatInterface() {
  const { 
    messages, 
    isLoading, 
    addMessage, 
    setLoading, 
    updateStreamingStatus, 
    setStreamingComplete,
    updateMessageContent
  } = useChatStore();
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

    // Добавляем сообщение агента для стриминга
    const agentMessageId = (Date.now() + 1).toString();
    const agentMessage: Message = {
      id: agentMessageId,
      content: '',
      role: 'assistant',
      timestamp: Date.now() + 1,
      streamingStatus: {
        isStreaming: true,
        currentStep: null,
        completedSteps: []
      }
    };
    addMessage(agentMessage);

    setLoading(true);
    setError(null);

    try {
      await queryAgentStream(content, (step) => {
        console.log('Received step:', step);
        updateStreamingStatus(agentMessageId, step);
        
        // Обновляем контент сообщения при получении финального ответа
        if (step.type === 'finalResponse' && step.status === 'completed' && step.response) {
          console.log('Updating message content:', step.response);
          updateMessageContent(agentMessageId, step.response);
        }
      });
      
      setStreamingComplete(agentMessageId);
      
    } catch (err) {
      // Обновляем сообщение с ошибкой
      const errorMessage: Message = {
        id: agentMessageId,
        content: 'Произошла ошибка при обращении к агенту. Попробуйте еще раз.',
        role: 'assistant',
        timestamp: Date.now() + 1,
      };
      
      const updatedMessages = messages.map(msg => 
        msg.id === agentMessageId ? errorMessage : msg
      );
      useChatStore.setState({ messages: updatedMessages });
      
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

