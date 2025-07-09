import { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import styles from '../styles/FullScreenChat.module.css';

export default function FullScreenChat({ isActive, onClose, initialMessage }) {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    if (isActive && initialMessage) {
      // Send the initial message when chat becomes active
      handleSendMessage(initialMessage);
    }
  }, [isActive, initialMessage]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isActive && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isActive]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (messageText = message) => {
    if (!messageText.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: messageText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setMessage('');
    setIsTyping(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: messageText,
          messages: messages
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server error: ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let aiMessageContent = '';
      
      const aiMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: '',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') break;
            
            try {
              const parsed = JSON.parse(data);
              if (parsed.content) {
                aiMessageContent += parsed.content;
                setMessages(prev => prev.map(msg => 
                  msg.id === aiMessage.id 
                    ? { ...msg, content: aiMessageContent }
                    : msg
                ));
              }
            } catch (e) {
              console.log('Parse error:', e);
            }
          }
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setIsTyping(false);
      
      let errorText = 'Sorry, I encountered an error while processing your message. Please try again.';
      
      // Provide more specific error messages
      if (error.message.includes('timeout')) {
        errorText = '⚠️ **Connection Timeout**\n\nThe AI service is taking too long to respond. This might be due to:\n- High server load\n- Network connectivity issues\n\nPlease try again in a few moments.';
      } else if (error.message.includes('Unable to connect')) {
        errorText = '🔌 **Connection Error**\n\nUnable to connect to the AI service. Please check your internet connection and try again.';
      } else if (error.message.includes('temporarily unavailable')) {
        errorText = '🛠️ **Service Unavailable**\n\nThe AI service is temporarily unavailable. Please try again in a few moments.';
      } else if (error.message.includes('Server error: 503')) {
        errorText = '🛠️ **Service Unavailable**\n\nThe AI service is currently experiencing issues. Please try again later.';
      } else if (error.message.includes('Server error: 408')) {
        errorText = '⏱️ **Request Timeout**\n\nThe request took too long to process. Please try again.';
      }
      
      const errorMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: errorText,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };



  const formatTime = (timestamp) => {
    return timestamp.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  if (!isActive) return null;

  return (
    <div className={styles.fullScreenContainer}>
      <div className={styles.header}>
        <button className={styles.closeBtn} onClick={onClose}>
          <i className="ph ph-x"></i>
        </button>
      </div>

      <div className={styles.messagesContainer}>
        <div className={styles.messagesWrapper}>
          {messages.map((msg) => (
            <div key={msg.id} className={`${styles.message} ${styles[msg.type]}`}>
              {msg.type === 'ai' && (
                <div className={styles.messageAvatar}>
                  <i className="ph ph-sparkle"></i>
                </div>
              )}
              <div className={styles.messageContent}>
                <div className={styles.messageText}>
                  {msg.type === 'ai' ? (
                    <div className={styles.markdownContent}>
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {msg.content}
                      </ReactMarkdown>
                    </div>
                  ) : (
                    msg.content
                  )}
                </div>
                <div className={styles.messageTime}>{formatTime(msg.timestamp)}</div>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className={`${styles.message} ${styles.ai}`}>
              <div className={styles.messageAvatar}>
                <i className="ph ph-sparkle"></i>
              </div>
              <div className={styles.messageContent}>
                <div className={styles.typingIndicator}>
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className={styles.inputContainer}>
        <div className={styles.messageForm}>
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me anything about your business..."
            className={styles.messageInput}
            rows={1}
          />
          <button 
            onClick={() => handleSendMessage()}
            className={styles.sendBtn} 
            disabled={!message.trim()}
          >
            <i className="ph ph-arrow-up"></i>
          </button>
        </div>
      </div>
    </div>
  );
} 