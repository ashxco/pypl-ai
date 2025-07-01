import styles from '../styles/Header.module.css';
import { useRouter } from 'next/router';
import { useState, useRef, useEffect } from 'react';
import NotificationPanel from './NotificationPanel';
import UserDropdown from './UserDropdown';

export default function Header({ toggleSidebar }) {
  const router = useRouter();
  const username = router.query.user || 'Business Name';
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [userData, setUserData] = useState(null);
  const bellButtonRef = useRef(null);
  const avatarRef = useRef(null);

  // Fetch user data when component mounts
  useEffect(() => {
    fetch('/api/login', { method: 'GET', credentials: 'include' })
      .then(async (res) => {
        if (res.ok) {
          const data = await res.json();
          setUserData({ fullName: data.fullName, email: data.email });
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

  return (
    <>
      <header className={styles.header}>
        <div className={styles.left}>
          <button className={styles.menuBtn} onClick={toggleSidebar}>
            <i className="ph ph-list"></i>
          </button>
          <span className={styles.business}>{username}</span>
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