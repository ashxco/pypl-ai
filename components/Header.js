import styles from '../styles/Header.module.css';
import { useRouter } from 'next/router';
import { useState, useRef, useEffect } from 'react';
import NotificationPanel from './NotificationPanel';
import UserDropdown from './UserDropdown';
import AiChatPanel from './AiChatPanel';

export default function Header({ toggleSidebar }) {
  const router = useRouter();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showAiChat, setShowAiChat] = useState(false);
  const [userData, setUserData] = useState(null);
  const [businessName, setBusinessName] = useState('Business Name');
  const bellButtonRef = useRef(null);
  const avatarRef = useRef(null);
  const aiSparkleRef = useRef(null);

  // Check if we're on the home3 page
  const isHome3Page = router.pathname === '/home3';

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
    // Close other panels
    setShowUserDropdown(false);
    setShowAiChat(false);
  };

  const handleCloseNotifications = () => {
    setShowNotifications(false);
  };

  const handleUserDropdownClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowUserDropdown(prev => !prev);
    // Close other panels
    setShowNotifications(false);
    setShowAiChat(false);
  };

  const handleCloseUserDropdown = () => {
    setShowUserDropdown(false);
  };

  const handleAiSparkleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('AI Sparkle clicked!');
    setShowAiChat(prev => !prev);
    // Close other panels
    setShowNotifications(false);
    setShowUserDropdown(false);
  };

  const handleCloseAiChat = () => {
    setShowAiChat(false);
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
        <div className={styles.right}>
          {isHome3Page && (
            <button className={styles.iconBtn} ref={aiSparkleRef} onClick={handleAiSparkleClick}>
              <i className="ph ph-sparkle"></i>
            </button>
          )}
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
      {isHome3Page && (
        <AiChatPanel 
          isOpen={showAiChat} 
          onClose={handleCloseAiChat}
          buttonRef={aiSparkleRef}
        />
      )}
    </>
  );
} 