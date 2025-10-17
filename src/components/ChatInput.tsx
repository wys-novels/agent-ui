import { useState } from 'react';
import { Textarea, Button, Group, Paper } from '@mantine/core';
import { IconSend } from '@tabler/icons-react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  placeholder?: string;
  centered?: boolean;
}

export function ChatInput({ onSendMessage, isLoading, placeholder = "Напишите сообщение...", centered = false }: ChatInputProps) {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('ChatInput: handleSubmit вызван, message:', message.trim(), 'isLoading:', isLoading);
    if (message.trim() && !isLoading) {
      console.log('ChatInput: вызываем onSendMessage');
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ width: '100%' }}>
      <Group gap="md" align="flex-end" style={{ width: '100%' }}>
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={isLoading}
          autosize
          minRows={1}
          maxRows={4}
          style={{ flex: 1 }}
          styles={{
            input: {
              border: 'none',
              backgroundColor: 'transparent',
              color: 'var(--color-text)',
              fontSize: '16px',
              padding: '0',
              resize: 'none',
              '&:focus': {
                outline: 'none'
              }
            }
          }}
        />
        <Button
          type="submit"
          disabled={!message.trim() || isLoading}
          loading={isLoading}
          size="md"
          style={{
            minWidth: '40px',
            height: '40px',
            padding: '0',
            backgroundColor: 'var(--color-accent)'
          }}
        >
          <IconSend size={16} />
        </Button>
      </Group>
    </form>
  );
}

