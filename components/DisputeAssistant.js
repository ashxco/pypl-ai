import styles from '../styles/AiChatPanel.module.css';
import { useRef, useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function DisputeAssistant({ isOpen, onClose, buttonRef }) {
  const panelRef = useRef(null);
  const messagesEndRef = useRef(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      content: 'dispute-1',
      timestamp: new Date(),
      showPrompts: false
    },
    {
      id: 2,
      type: 'ai',
      content: 'dispute-2',
      timestamp: new Date(),
      showPrompts: true
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Render dispute #1
  const renderDispute1 = () => {
    return (
      <div className={styles.disputeOverview}>
        <div className={styles.disputeCard}>
                      <div className={styles.disputeCardHeader}>
              <div className={styles.disputeInfo}>
                <span className={styles.disputeNumber}>DIS-2024-061501</span>
              </div>
              <div className={styles.disputeAmount}>$99.99</div>
            </div>
          
          <div className={styles.disputeDetails}>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Customer:</span>
              <span className={styles.detailValue}>Sarah Johnson</span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Transaction ID:</span>
              <span className={styles.detailValue}>TXN-2024-061501</span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Transaction Date:</span>
              <span className={styles.detailValue}>June 15, 2024</span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Product:</span>
              <span className={styles.detailValue}>Premium Subscription</span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Claim:</span>
              <span className={styles.detailValue}>Unauthorized Transaction</span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Response Due:</span>
              <span className={styles.detailValue + ' ' + styles.urgent}>5 days remaining</span>
            </div>
          </div>

                      <div className={styles.analysisSection}>
              <h4 className={styles.sectionTitle}>Analysis</h4>
              <ul className={styles.analysisList}>
                <li className={styles.orange}>No prior purchase history</li>
                <li className={styles.negative}>Transaction from unusual location (IP mismatch)</li>
                <li className={styles.negative}>High-risk transaction pattern</li>
              </ul>
            </div>

          <div className={styles.recommendationSection}>
            <h4 className={styles.sectionTitle}>Recommendation</h4>
            <div className={styles.recommendationActions}>
              <span className={styles.recAction + ' ' + styles.escalate}>ESCALATE TO REVIEW</span>
              <button className={styles.moreActionsBtn}>
                <i className="ph ph-dots-three"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render dispute #2
  const renderDispute2 = () => {
    return (
      <div className={styles.disputeOverview}>
        <div className={styles.disputeCard}>
                      <div className={styles.disputeCardHeader}>
              <div className={styles.disputeInfo}>
                <span className={styles.disputeNumber}>DIS-2024-061202</span>
              </div>
              <div className={styles.disputeAmount}>$49.99</div>
            </div>
          
          <div className={styles.disputeDetails}>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Customer:</span>
              <span className={styles.detailValue}>Michael Chen</span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Transaction ID:</span>
              <span className={styles.detailValue}>TXN-2024-061202</span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Transaction Date:</span>
              <span className={styles.detailValue}>June 12, 2024</span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Product:</span>
              <span className={styles.detailValue}>Wireless Headphones</span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Claim:</span>
              <span className={styles.detailValue}>Item Not Received</span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Response Due:</span>
              <span className={styles.detailValue}>6 days remaining</span>
            </div>
          </div>

                      <div className={styles.analysisSection}>
              <h4 className={styles.sectionTitle}>Analysis</h4>
              <ul className={styles.analysisList}>
                <li className={styles.positive}>Repeat customer (3 purchases)</li>
                <li className={styles.positive}>Good payment history</li>
                <li className={styles.positive}>Delivery tracking shows issues</li>
              </ul>
            </div>

          <div className={styles.recommendationSection}>
            <h4 className={styles.sectionTitle}>Recommendation</h4>
            <div className={styles.recommendationActions}>
              <span className={styles.recAction + ' ' + styles.approve}>APPROVE REFUND</span>
              <button className={styles.moreActionsBtn}>
                <i className="ph ph-dots-three"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  // Handle slide animation
  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Don't close panel if modal is open
      if (isModalOpen) {
        return;
      }
      
      // Don't close if clicking on modal elements
      if (event.target.closest('[class*="modalOverlay"]') || 
          event.target.closest('[class*="modalContent"]')) {
        return;
      }
      
      if (panelRef.current && 
          !panelRef.current.contains(event.target) &&
          buttonRef.current &&
          !buttonRef.current.contains(event.target)) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, isModalOpen, onClose, buttonRef]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: message,
      timestamp: new Date()
    };

    const currentMessage = message;
    setMessages(prev => [...prev, userMessage]);
    setMessage('');
    setIsTyping(true);

    try {
      console.log('Sending dispute message to API:', currentMessage);
      
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: `As a dispute resolution assistant, help with: ${currentMessage}`,
          messages: messages
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server error: ${response.status}`);
      }

      // Create AI message that will be updated with streaming content
      const aiMessageId = Date.now() + 1;
      const aiMessage = {
        id: aiMessageId,
        type: 'ai',
        content: '',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);

      // Handle streaming response using EventSource-like approach
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulatedContent = '';
      let buffer = '';

      console.log('Starting to read dispute stream...');

      while (true) {
        const { done, value } = await reader.read();
        
        if (done) {
          console.log('Dispute stream complete');
          break;
        }

        // Decode the chunk and add to buffer
        const chunk = decoder.decode(value, { stream: true });
        buffer += chunk;
        
        // Process complete lines
        const lines = buffer.split('\n');
        buffer = lines.pop() || ''; // Keep incomplete line in buffer

        for (const line of lines) {
          if (line.trim() === '') continue;
          
          if (line.startsWith('data: ')) {
            const data = line.slice(6).trim();
            
            if (data === '[DONE]') {
              console.log('Dispute stream finished');
              return; // Exit the function completely
            }

            try {
              const parsed = JSON.parse(data);
              if (parsed.content) {
                accumulatedContent += parsed.content;
                console.log('Streaming dispute content:', parsed.content);
                
                // Update the AI message with accumulated content
                setMessages(prev => 
                  prev.map(msg => 
                    msg.id === aiMessageId 
                      ? { ...msg, content: accumulatedContent }
                      : msg
                  )
                );
                
                // Small delay to make streaming more visible
                await new Promise(resolve => setTimeout(resolve, 10));
              }
            } catch (e) {
              console.log('Failed to parse dispute JSON:', data);
              continue;
            }
          }
        }
      }
    } catch (error) {
      console.error('Error sending dispute message:', error);
      setIsTyping(false);
      
      let errorText = 'Sorry, I encountered an error while processing your dispute inquiry. Please try again.';
      
      // Provide more specific error messages
      if (error.message.includes('timeout')) {
        errorText = '⚠️ **Connection Timeout**\n\nThe dispute resolution service is taking too long to respond. This might be due to:\n- High server load\n- Network connectivity issues\n\nPlease try again in a few moments.';
      } else if (error.message.includes('Unable to connect')) {
        errorText = '🔌 **Connection Error**\n\nUnable to connect to the dispute resolution service. Please check your internet connection and try again.';
      } else if (error.message.includes('temporarily unavailable')) {
        errorText = '🛠️ **Service Unavailable**\n\nThe dispute resolution service is temporarily unavailable. Please try again in a few moments.';
      } else if (error.message.includes('Server error: 503')) {
        errorText = '🛠️ **Service Unavailable**\n\nThe dispute resolution service is currently experiencing issues. Please try again later.';
      } else if (error.message.includes('Server error: 408')) {
        errorText = '⏱️ **Request Timeout**\n\nThe dispute resolution request took too long to process. Please try again.';
      }
      
      // Add error message
      const errorMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: errorText,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  const formatTime = (timestamp) => {
    return timestamp.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const handleClose = () => {
    setIsAnimating(false);
    // Delay actual close to allow slide-out animation
    setTimeout(() => {
      onClose();
    }, 400);
  };

  const openModal = (content, type) => {
    setModalContent({ content, type });
    setIsModalOpen(true);
  };

  const closeModal = (e) => {
    if (e) {
      e.stopPropagation();
    }
    setIsModalOpen(false);
    setModalContent(null);
  };

  const handlePromptClick = (promptText) => {
    // Hide prompts from the intro message
    setMessages(prev => prev.map(msg => 
      msg.showPrompts ? { ...msg, showPrompts: false } : msg
    ));
    
    // Send the prompt as a user message
    setMessage(promptText);
    
    // Trigger the form submission
    setTimeout(() => {
      const form = document.querySelector(`.${styles.messageForm}`);
      if (form) {
        form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
      }
    }, 100);
  };

  if (!isOpen && !isAnimating) return null;

  return (
    <>
      <div className={`${styles.overlay} ${!isOpen ? styles.overlayHidden : ''}`} onClick={handleClose}>
        <div className={`${styles.panel} ${isOpen && isAnimating ? styles.slideIn : ''}`} ref={panelRef} onClick={(e) => e.stopPropagation()}>
          <div className={styles.header}>
            <div className={styles.headerLeft}>
              <div className={styles.aiIcon}>
                <i className="ph ph-scales"></i>
              </div>
              <div className={styles.headerText}>
                <h3 className={styles.title}>Dispute Assistant</h3>
                <span className={styles.status}>Ready to Help</span>
              </div>
            </div>
            <button className={styles.closeBtn} onClick={handleClose}>
              <i className="ph ph-x"></i>
            </button>
          </div>
          
          <div className={styles.messagesContainer}>
            {messages.map((msg) => (
              <div key={msg.id} className={`${styles.message} ${styles[msg.type]}`}>
                {msg.type === 'ai' && (
                  <div className={styles.messageAvatar}>
                    <i className="ph ph-scales"></i>
                  </div>
                )}
                <div className={styles.messageContent}>
                  <div className={styles.messageText}>
                    {msg.type === 'ai' ? (
                      <div className={styles.markdownContent}>
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          components={{
                            p: ({ children }) => {
                              console.log('Rendering p:', children);
                              return <p>{children}</p>;
                            },
                            ul: ({ children }) => {
                              console.log('Rendering ul:', children);
                              return <ul>{children}</ul>;
                            },
                            ol: ({ children }) => {
                              console.log('Rendering ol:', children);
                              return <ol>{children}</ol>;
                            },
                            li: ({ children }) => {
                              console.log('Rendering li:', children);
                              return <li>{children}</li>;
                            },
                            strong: ({ children }) => {
                              console.log('Rendering strong:', children);
                              return <strong>{children}</strong>;
                            },
                            em: ({ children }) => {
                              console.log('Rendering em:', children);
                              return <em>{children}</em>;
                            },
                            code: ({ children }) => {
                              console.log('Rendering code:', children);
                              return <code>{children}</code>;
                            },
                            pre: ({ children }) => {
                              console.log('Rendering pre:', children);
                              return <pre>{children}</pre>;
                            },
                            blockquote: ({ children }) => {
                              console.log('Rendering blockquote:', children);
                              return <blockquote>{children}</blockquote>;
                            },
                            h1: ({ children }) => {
                              console.log('Rendering h1:', children);
                              return <h1>{children}</h1>;
                            },
                            h2: ({ children }) => {
                              console.log('Rendering h2:', children);
                              return <h2>{children}</h2>;
                            },
                            h3: ({ children }) => {
                              console.log('Rendering h3:', children);
                              return <h3>{children}</h3>;
                            },
                            table: ({ children }) => {
                              console.log('Rendering table:', children);
                              
                              const handleTableLoad = (element) => {
                                if (element) {
                                  // Add tableReady class after a short delay to ensure table is fully rendered
                                  setTimeout(() => {
                                    element.classList.add(styles.tableReady);
                                  }, 100);
                                }
                              };
                              
                              return (
                                <div className={styles.expandableContainer} ref={handleTableLoad}>
                                  <table>{children}</table>
                                  <button 
                                    className={styles.expandButton}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      openModal(children, 'table');
                                    }}
                                    title="Expand table"
                                  >
                                    <i className="ph ph-arrows-out"></i>
                                  </button>
                                </div>
                              );
                            },
                            thead: ({ children }) => <thead>{children}</thead>,
                            tbody: ({ children }) => <tbody>{children}</tbody>,
                            tr: ({ children }) => <tr>{children}</tr>,
                            th: ({ children }) => <th>{children}</th>,
                            td: ({ children }) => <td>{children}</td>,
                            img: ({ src, alt, ...props }) => {
                              console.log('Rendering img:', src, alt);
                              return (
                                <div className={styles.expandableContainer}>
                                  <img src={src} alt={alt} {...props} />
                                  <button 
                                    className={styles.expandButton}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      openModal({ src, alt }, 'image');
                                    }}
                                    title="Expand image"
                                  >
                                    <i className="ph ph-arrows-out"></i>
                                  </button>
                                </div>
                              );
                            },
                          }}
                        >
                          {(msg.content === 'dispute-1' || msg.content === 'dispute-2') ? '' : msg.content}
                        </ReactMarkdown>
                        {msg.content === 'dispute-1' && renderDispute1()}
                        {msg.content === 'dispute-2' && renderDispute2()}
                      </div>
                    ) : (
                      msg.content
                    )}
                  </div>
                  <div className={styles.messageTime}>{formatTime(msg.timestamp)}</div>
                  {msg.showPrompts && (
                    <div className={styles.promptPills}>
                      <button 
                        className={styles.promptPill}
                        onClick={() => handlePromptClick('Process refund for Michael Chen and draft customer communication')}
                      >
                        Process refund for Michael Chen
                      </button>
                      <button 
                        className={styles.promptPill}
                        onClick={() => handlePromptClick('Show me the step-by-step process for escalating a dispute')}
                      >
                        Escalation process guide
                      </button>
                      <button 
                        className={styles.promptPill}
                        onClick={() => handlePromptClick('What evidence do I need to successfully resolve these disputes?')}
                      >
                        Required evidence checklist
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className={`${styles.message} ${styles.ai}`}>
                <div className={styles.messageAvatar}>
                  <i className="ph ph-scales"></i>
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
          
          <div className={styles.inputContainer}>
            <form onSubmit={handleSendMessage} className={styles.messageForm}>
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ask about dispute resolution, draft responses, or get guidance..."
                className={styles.messageInput}
              />
              <button type="submit" className={styles.sendBtn} disabled={!message.trim()}>
                <i className="ph ph-arrow-up"></i>
              </button>
            </form>
          </div>
        </div>
      </div>
      
      {/* Modal for expanded content - outside the panel */}
      {isModalOpen && (
        <div 
          className={styles.modalOverlay} 
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              closeModal(e);
            }
          }}
        >
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>
                {modalContent?.type === 'table' ? 'Table View' : 'Image View'}
              </h3>
              <button className={styles.modalCloseBtn} onClick={closeModal}>
                <i className="ph ph-x"></i>
              </button>
            </div>
            <div className={styles.modalBody}>
              {modalContent?.type === 'table' ? (
                <table className={styles.modalTable}>
                  {modalContent.content}
                </table>
              ) : modalContent?.type === 'image' ? (
                <img 
                  src={modalContent.content.src} 
                  alt={modalContent.content.alt} 
                  className={styles.modalImage}
                />
              ) : null}
            </div>
          </div>
        </div>
      )}
    </>
  );
} 