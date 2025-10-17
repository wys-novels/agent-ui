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
    if (message.trim() && !isLoading) {
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
    <Paper 
      p="md" 
      radius="md" 
      style={{ 
        width: '100%', 
        maxWidth: centered ? '600px' : '100%',
        margin: centered ? '0 auto' : '0'
      }}
    >
      <form onSubmit={handleSubmit}>
        <Group>
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
                fontSize: '16px',
                lineHeight: '1.5',
                padding: '12px 16px',
                resize: 'none',
              }
            }}
          />
          <Button
            type="submit"
            disabled={!message.trim() || isLoading}
            loading={isLoading}
            leftSection={<IconSend size={16} />}
            size="md"
            radius="md"
          >
            Отправить
          </Button>
        </Group>
      </form>
    </Paper>
  );
}

