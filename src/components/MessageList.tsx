import { ScrollArea, Paper, Text, Group, Avatar, Loader, Stack } from '@mantine/core';
import { Message } from '../types/chat';
import { MarkdownRenderer } from './MarkdownRenderer';
import { StreamingStatus } from './StreamingStatus';

interface MessageListProps {
  messages: Message[];
}

export function MessageList({ messages }: MessageListProps) {
  if (messages.length === 0) {
    return null;
  }

  return (
    <ScrollArea style={{ height: '100%', flex: 1 }}>
      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {messages.map((message) => (
          <Group
            key={message.id}
            align="flex-start"
            style={{
              justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start',
            }}
          >
            {message.role === 'assistant' && (
              <Avatar
                size="sm"
                radius="xl"
                color="blue"
                style={{ marginTop: '4px' }}
              >
                AI
              </Avatar>
            )}
            
            <Stack spacing="xs" style={{ maxWidth: '70%', width: '100%' }}>
              {message.role === 'assistant' && message.streamingStatus && (
                <StreamingStatus 
                  status={message.streamingStatus}
                  isVisible={message.streamingStatus.isStreaming || (message.streamingStatus.completedSteps.length > 0 && message.content === '')}
                />
              )}
              
              <Paper
                p="md"
                radius="md"
                style={{
                  backgroundColor: message.role === 'user' 
                    ? 'var(--mantine-color-blue-6)' 
                    : 'var(--mantine-color-gray-1)',
                  color: message.role === 'user' 
                    ? 'white' 
                    : 'var(--mantine-color-gray-9)',
                }}
              >
                {message.isLoading ? (
                  <Group gap="xs">
                    <Loader size="sm" />
                    <Text size="sm" c="dimmed">Агент печатает...</Text>
                  </Group>
                ) : (
                  <div style={{ fontSize: '14px', lineHeight: '1.5' }}>
                    <MarkdownRenderer content={message.content} />
                  </div>
                )}
              </Paper>
            </Stack>
            
            {message.role === 'user' && (
              <Avatar
                size="sm"
                radius="xl"
                color="green"
                style={{ marginTop: '4px' }}
              >
                U
              </Avatar>
            )}
          </Group>
        ))}
      </div>
    </ScrollArea>
  );
}
