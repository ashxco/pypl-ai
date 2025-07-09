import { useState } from 'react';
import styles from '../styles/ChatPromptBox.module.css';

export default function ChatPromptBox({ onChatActivate }) {
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      console.log('Chat message:', message);
      // Activate full-screen chat with the message
      onChatActivate(message);
      setMessage('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleInputChange = (e) => {
    setMessage(e.target.value);
  };

  return (
    <div className={styles.container}>
      {/* Glowing orbs */}
      <div className={`${styles.orb} ${styles.orb1}`}></div>
      <div className={`${styles.orb} ${styles.orb2}`}></div>
      <div className={`${styles.orb} ${styles.orb3}`}></div>
      
      <div className={styles.chatBox}>
        <h2 className={styles.title}>What do you want to do today?</h2>
        <div className={styles.chatContainer}>
          <form onSubmit={handleSubmit} className={styles.form}>
            <textarea
              value={message}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder="Ask anything"
              className={styles.messageInput}
              rows={8}
            />
            <div className={styles.buttonRow}>
              <button 
                type="submit" 
                className={styles.sendButton}
                disabled={!message.trim()}
              >
                <i className="ph ph-arrow-up"></i>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 