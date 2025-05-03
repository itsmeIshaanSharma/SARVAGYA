import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import rehypeHighlight from 'rehype-highlight';
import remarkGfm from 'remark-gfm';
import hljs from 'highlight.js';
import TypeWriter from './TypeWriter';
import './TypeWriterMarkdown.css';

const TypeWriterMarkdown = ({ 
  content, 
  speed = 10, 
  className = '',
  typingDelay = 0,
  highlightCode = true
}) => {
  const [isTyping, setIsTyping] = useState(true);
  const [displayContent, setDisplayContent] = useState('');
  const [shouldRenderMarkdown, setShouldRenderMarkdown] = useState(false);

  // Start typing after delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsTyping(true);
    }, typingDelay);
    
    return () => clearTimeout(timer);
  }, [typingDelay]);

  // Apply syntax highlighting when typing is complete
  useEffect(() => {
    if (!isTyping && highlightCode) {
      document.querySelectorAll('pre code').forEach((block) => {
        hljs.highlightElement(block);
      });
    }
  }, [isTyping, highlightCode]);

  const handleTypingComplete = () => {
    setIsTyping(false);
    setShouldRenderMarkdown(true);
    setDisplayContent(content);
  };

  // Function to format code blocks in the response
  const formatContent = (text) => {
    // Ensure code blocks are properly formatted
    return text.replace(/```(\w*)\n([\s\S]*?)```/g, (match, language, code) => {
      return `\n\`\`\`${language}\n${code.trim()}\n\`\`\`\n`;
    });
  };

  return (
    <div className={`typewriter-markdown ${className}`}>
      {isTyping ? (
        <TypeWriter 
          text={formatContent(content)} 
          speed={speed} 
          onComplete={handleTypingComplete}
          className="typing-text"
        />
      ) : (
        shouldRenderMarkdown && (
          <ReactMarkdown
            rehypePlugins={[rehypeRaw, rehypeHighlight]}
            remarkPlugins={[remarkGfm]}
          >
            {displayContent}
          </ReactMarkdown>
        )
      )}
    </div>
  );
};

export default TypeWriterMarkdown; 