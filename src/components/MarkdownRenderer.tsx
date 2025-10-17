import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import '../styles/markdown.css';

interface MarkdownRendererProps {
  content: string;
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div className="markdown-content">
      <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeHighlight]}
      components={{
        // Стилизация заголовков
        h1: ({ children }) => (
          <h1 style={{ 
            fontSize: '1.5em', 
            fontWeight: 'bold', 
            margin: '16px 0 8px 0',
            color: 'inherit'
          }}>
            {children}
          </h1>
        ),
        h2: ({ children }) => (
          <h2 style={{ 
            fontSize: '1.3em', 
            fontWeight: 'bold', 
            margin: '12px 0 6px 0',
            color: 'inherit'
          }}>
            {children}
          </h2>
        ),
        h3: ({ children }) => (
          <h3 style={{ 
            fontSize: '1.1em', 
            fontWeight: 'bold', 
            margin: '10px 0 4px 0',
            color: 'inherit'
          }}>
            {children}
          </h3>
        ),
        // Стилизация параграфов
        p: ({ children }) => (
          <p style={{ 
            margin: '8px 0', 
            lineHeight: '1.6',
            color: 'inherit'
          }}>
            {children}
          </p>
        ),
        // Стилизация списков
        ul: ({ children }) => (
          <ul style={{ 
            margin: '8px 0', 
            paddingLeft: '20px',
            color: 'inherit'
          }}>
            {children}
          </ul>
        ),
        ol: ({ children }) => (
          <ol style={{ 
            margin: '8px 0', 
            paddingLeft: '20px',
            color: 'inherit'
          }}>
            {children}
          </ol>
        ),
        // Стилизация кода
        code: ({ children, className }) => {
          const isInline = !className;
          return (
            <code
              style={{
                backgroundColor: isInline ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                padding: isInline ? '2px 4px' : '0',
                borderRadius: '4px',
                fontSize: '0.9em',
                fontFamily: 'Monaco, Consolas, "Courier New", monospace',
                color: isInline ? 'inherit' : 'inherit',
              }}
            >
              {children}
            </code>
          );
        },
        pre: ({ children }) => (
          <pre style={{
            backgroundColor: 'rgba(0, 0, 0, 0.1)',
            padding: '12px',
            borderRadius: '8px',
            overflow: 'auto',
            margin: '12px 0',
            fontSize: '0.9em',
            fontFamily: 'Monaco, Consolas, "Courier New", monospace',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}>
            {children}
          </pre>
        ),
        // Стилизация блоков цитат
        blockquote: ({ children }) => (
          <blockquote style={{
            borderLeft: '4px solid rgba(255, 255, 255, 0.3)',
            paddingLeft: '16px',
            margin: '12px 0',
            fontStyle: 'italic',
            color: 'inherit',
            opacity: 0.9,
          }}>
            {children}
          </blockquote>
        ),
        // Стилизация ссылок
        a: ({ children, href }) => (
          <a 
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: 'var(--mantine-color-blue-4)',
              textDecoration: 'underline',
            }}
          >
            {children}
          </a>
        ),
        // Стилизация таблиц
        table: ({ children }) => (
          <div style={{ overflow: 'auto', margin: '12px 0' }}>
            <table style={{
              borderCollapse: 'collapse',
              width: '100%',
              fontSize: '0.9em',
            }}>
              {children}
            </table>
          </div>
        ),
        th: ({ children }) => (
          <th style={{
            border: '1px solid rgba(255, 255, 255, 0.2)',
            padding: '8px 12px',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            textAlign: 'left',
            fontWeight: 'bold',
          }}>
            {children}
          </th>
        ),
        td: ({ children }) => (
          <td style={{
            border: '1px solid rgba(255, 255, 255, 0.2)',
            padding: '8px 12px',
          }}>
            {children}
          </td>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
    </div>
  );
}
