import { Box, Text, Group, Badge, Stack, Transition } from '@mantine/core';
import { IconCheck, IconClock, IconX } from '@tabler/icons-react';
import { StreamingStatus as StreamingStatusType } from '../types/chat';

interface StreamingStatusProps {
  status: StreamingStatusType;
  isVisible: boolean;
}

const stepLabels = {
  classification: 'Классификация запроса',
  apiPlan: 'Планирование API',
  executionResults: 'Выполнение запросов',
  finalResponse: 'Формирование ответа',
  error: 'Ошибка'
};

const stepIcons = {
  classification: IconClock,
  apiPlan: IconClock,
  executionResults: IconClock,
  finalResponse: IconClock,
  error: IconX
};

export function StreamingStatus({ status, isVisible }: StreamingStatusProps) {
  if (!status.isStreaming && !isVisible) {
    return null;
  }

  const getStepStatus = (stepType: string) => {
    const completedStep = status.completedSteps.find(step => step.type === stepType);
    const isCurrent = status.currentStep?.type === stepType;
    
    if (completedStep) {
      return { status: 'completed', icon: IconCheck, color: 'green' };
    } else if (isCurrent) {
      return { status: 'current', icon: IconClock, color: 'blue' };
    } else {
      return { status: 'pending', icon: IconClock, color: 'gray' };
    }
  };

  const steps = ['classification', 'apiPlan', 'executionResults', 'finalResponse'] as const;

  return (
    <Transition
      mounted={isVisible}
      transition="slide-down"
      duration={200}
      timingFunction="ease"
    >
      {(styles) => (
        <Box
          style={styles}
          p="md"
          mb="md"
          sx={(theme) => ({
            backgroundColor: theme.colorScheme === 'dark' 
              ? theme.colors.dark[6] 
              : theme.colors.gray[1],
            borderRadius: theme.radius.md,
            border: `1px solid ${
              theme.colorScheme === 'dark' 
                ? theme.colors.dark[4] 
                : theme.colors.gray[3]
            }`,
          })}
        >
          <Text size="sm" weight={500} mb="xs" color="dimmed">
            Обработка запроса...
          </Text>
          
          <Stack spacing="xs">
            {steps.map((stepType) => {
              const stepStatus = getStepStatus(stepType);
              const Icon = stepStatus.icon;
              const isCompleted = stepStatus.status === 'completed';
              const isCurrent = stepStatus.status === 'current';
              
              return (
                <Group key={stepType} spacing="xs">
                  <Icon 
                    size={16} 
                    color={stepStatus.color}
                    style={{
                      opacity: isCompleted ? 1 : isCurrent ? 0.8 : 0.4
                    }}
                  />
                  <Text 
                    size="sm" 
                    color={isCompleted ? 'green' : isCurrent ? 'blue' : 'dimmed'}
                    weight={isCurrent ? 500 : 400}
                  >
                    {stepLabels[stepType]}
                  </Text>
                  {isCompleted && (
                    <Badge size="xs" color="green" variant="light">
                      Готово
                    </Badge>
                  )}
                  {isCurrent && (
                    <Badge size="xs" color="blue" variant="light">
                      Выполняется
                    </Badge>
                  )}
                </Group>
              );
            })}
          </Stack>
        </Box>
      )}
    </Transition>
  );
}
