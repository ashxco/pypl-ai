import styles from '../styles/Header.module.css';
import { useRouter } from 'next/router';
import { useState, useRef } from 'react';
import NotificationPanel from './NotificationPanel';

export default function Header({ toggleSidebar }) {
  const router = useRouter();
  const username = router.query.user || 'Business Name';
  const [showNotifications, setShowNotifications] = useState(false);
  const bellButtonRef = useRef(null);

  const handleNotificationClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowNotifications(prev => !prev);
  };

  const handleCloseNotifications = () => {
    setShowNotifications(false);
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
          <div className={styles.avatarContainer}>
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
    </>
  );
} 