import { MantineProvider } from '@mantine/core';
import { ChatInterface } from './components/ChatInterface';

function App() {
  return (
    <MantineProvider
      theme={{
        colorScheme: 'dark',
        primaryColor: 'blue',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      <ChatInterface />
    </MantineProvider>
  );
}

export default App;
