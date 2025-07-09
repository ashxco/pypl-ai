import styles from '../styles/HeaderWithSearch.module.css';
import { useRouter } from 'next/router';
import { useState, useRef, useEffect } from 'react';
import NotificationPanel from './NotificationPanel';
import UserDropdown from './UserDropdown';

export default function HeaderWithSearch({ toggleSidebar }) {
  const router = useRouter();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [userData, setUserData] = useState(null);
  const [businessName, setBusinessName] = useState('Business Name');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [showChatUI, setShowChatUI] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const bellButtonRef = useRef(null);
  const avatarRef = useRef(null);
  const searchContainerRef = useRef(null);

  // Fetch user data when component mounts
  useEffect(() => {
    fetch('/api/login', { method: 'GET', credentials: 'include' })
      .then(async (res) => {
        if (res.ok) {
          const data = await res.json();
          setUserData({ fullName: data.fullName, email: data.email });
          setBusinessName(data.businessName || data.fullName || 'Business Name');
        }
      })
      .catch(() => {
        // Silently fail - user data will remain null
      });
  }, []);

  const handleNotificationClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowNotifications(prev => !prev);
  };

  const handleCloseNotifications = () => {
    setShowNotifications(false);
  };

  const handleUserDropdownClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowUserDropdown(prev => !prev);
  };

  const handleCloseUserDropdown = () => {
    setShowUserDropdown(false);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    console.log('Search query:', e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    console.log('Search submitted:', searchQuery);
    // Add search functionality here
  };

  const handleSearchFocus = () => {
    setIsSearchFocused(true);
    // Show dropdown after expansion animation completes (300ms)
    setTimeout(() => {
      setShowSearchDropdown(true);
    }, 300);
  };

  const handleSearchBlur = (e) => {
    // Don't blur if we're in chat mode or if clicking on dropdown items
    if (showChatUI) {
      return;
    }
    
    // Delay blur to allow clicking on dropdown items
    setTimeout(() => {
      if (!searchContainerRef.current?.contains(document.activeElement)) {
        setIsSearchFocused(false);
        setShowSearchDropdown(false);
      }
    }, 150);
  };

  const handleQuestionClick = (question) => {
    console.log('Question clicked:', question);
    // Add user message to chat
    setChatMessages([{ type: 'user', content: question }]);
    // Transform dropdown content to chat UI (keep dropdown open)
    setShowChatUI(true);
    setSearchQuery('');
    
    // Keep search focused and expanded
    const searchInput = searchContainerRef.current?.querySelector('input');
    if (searchInput) {
      setTimeout(() => {
        searchInput.focus();
      }, 50);
    }
    
    // Simulate AI response after a delay
    setTimeout(() => {
      setChatMessages(prev => [...prev, { 
        type: 'ai', 
        content: 'I understand you want to ' + question.toLowerCase() + '. Let me help you with that. Here are the steps I recommend...' 
      }]);
    }, 1000);
  };

  return (
    <>
      <header className={styles.header}>
        <div className={styles.left}>
          <button className={styles.menuBtn} onClick={toggleSidebar}>
            <i className="ph ph-list"></i>
          </button>
          <span className={styles.business}>{businessName}</span>
        </div>
        
        <div className={`${styles.center} ${isSearchFocused ? styles.centerExpanded : ''}`}>
          <form onSubmit={handleSearchSubmit} className={`${styles.searchForm} ${isSearchFocused ? styles.searchFormExpanded : ''}`}>
            <div 
              ref={searchContainerRef}
              className={`${styles.searchContainer} ${isSearchFocused ? styles.searchContainerExpanded : ''}`}
            >
              <input
                type="text"
                placeholder="What do you want to do today?"
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={handleSearchFocus}
                onBlur={handleSearchBlur}
                className={styles.searchInput}
              />
              <div className={styles.searchButtons}>
                <button 
                  type="button" 
                  className={styles.searchBtn}
                  onClick={() => console.log('Ask AI:', searchQuery)}
                >
                  <i className="ph ph-sparkle"></i>
                  <span>Ask</span>
                </button>
                <button 
                  type="submit" 
                  className={styles.searchBtn}
                >
                  <i className="ph ph-magnifying-glass"></i>
                  <span>Search</span>
                </button>
              </div>
              
              {showSearchDropdown && (
                <div className={`${styles.searchDropdown} ${showChatUI ? styles.chatMode : ''}`}>
                  <div className={styles.dropdownContent}>
                    {!showChatUI ? (
                      <div className={styles.dropdownSection}>
                        <div className={styles.sectionItems}>
                          <div 
                            className={styles.dropdownItem} 
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => handleQuestionClick("Show me which product categories generated the most revenue in Q4 2024")}
                          >
                            <i className="ph ph-clock"></i>
                            <span>Show me which product categories generated the most revenue in Q4 2024</span>
                          </div>
                          <div 
                            className={styles.dropdownItem} 
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => handleQuestionClick("Generate shipping labels for 47 new orders with automatic tracking notifications")}
                          >
                            <i className="ph ph-clock"></i>
                            <span>Generate shipping labels for 47 new orders with automatic tracking notifications</span>
                          </div>
                          <div 
                            className={styles.dropdownItem} 
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => handleQuestionClick("Configure webhook notifications for failed payments and chargeback alerts")}
                          >
                            <i className="ph ph-clock"></i>
                            <span>Configure webhook notifications for failed payments and chargeback alerts</span>
                          </div>
                          <div 
                            className={styles.dropdownItem} 
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => handleQuestionClick("Generate merchant settlement reports for tax filing with breakdown by product category")}
                          >
                            <i className="ph ph-clock"></i>
                            <span>Generate merchant settlement reports for tax filing with breakdown by product category</span>
                          </div>
                          <div 
                            className={styles.dropdownItem} 
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => handleQuestionClick("Integrate PayPal Checkout with my Shopify Plus store for subscription billing")}
                          >
                            <i className="ph ph-clock"></i>
                            <span>Integrate PayPal Checkout with my Shopify Plus store for subscription billing</span>
                          </div>
                          <div 
                            className={styles.dropdownItem} 
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => handleQuestionClick("Handle a $3,200 chargeback dispute with evidence upload and merchant protection claim")}
                          >
                            <i className="ph ph-clock"></i>
                            <span>Handle a $3,200 chargeback dispute with evidence upload and merchant protection claim</span>
                          </div>
                          <div 
                            className={styles.dropdownItem} 
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => handleQuestionClick("Set up PayPal Business Debit Card with 1% cashback on all business purchases")}
                          >
                            <i className="ph ph-clock"></i>
                            <span>Set up PayPal Business Debit Card with 1% cashback on all business purchases</span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className={styles.chatContent}>
                        <div className={styles.chatHeader}>
                          <button 
                            className={styles.backButton}
                            onClick={() => {
                              setShowChatUI(false);
                              setChatMessages([]);
                              // Keep search focused
                              const searchInput = searchContainerRef.current?.querySelector('input');
                              if (searchInput) {
                                setTimeout(() => {
                                  searchInput.focus();
                                }, 50);
                              }
                            }}
                            onMouseDown={(e) => e.preventDefault()}
                          >
                            <i className="ph ph-arrow-left"></i>
                          </button>
                        </div>
                        <div className={styles.chatMessages}>
                          {chatMessages.map((message, index) => (
                            <div key={index} className={`${styles.chatMessage} ${styles[message.type]}`}>
                              {message.type === 'ai' && (
                                <div className={styles.messageAvatar}>
                                  <i className="ph ph-sparkle"></i>
                                </div>
                              )}
                              <div className={styles.messageContent}>
                                {message.content}
                              </div>
                              {message.type === 'user' && (
                                <div className={styles.messageAvatar}>
                                  <i className="ph ph-user"></i>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                        <div className={styles.chatInput}>
                          <input
                            type="text"
                            placeholder="Ask a follow-up question..."
                            className={styles.chatInputField}
                          />
                                                  <button className={styles.chatSendBtn}>
                          <i className="ph ph-arrow-up"></i>
                        </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </form>
        </div>
        
        <div className={styles.right}>
          <button className={styles.iconBtn} ref={bellButtonRef} onClick={handleNotificationClick}>
            <i className="ph ph-bell"></i>
            <span className={styles.notificationBadge}>4</span>
          </button>
          <div className={styles.avatarContainer} ref={avatarRef} onClick={handleUserDropdownClick}>
            <img 
              src="https://i.pravatar.cc/150?img=12" 
              alt="User Avatar" 
              className={styles.avatarImage}
            />
          </div>
        </div>
      </header>
      <NotificationPanel 
        isOpen={showNotifications} 
        onClose={handleCloseNotifications}
        buttonRef={bellButtonRef}
      />
      <UserDropdown 
        isOpen={showUserDropdown} 
        onClose={handleCloseUserDropdown}
        buttonRef={avatarRef}
        userData={userData}
      />
    </>
  );
} 