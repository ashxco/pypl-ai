import styles from '../styles/UserDropdown.module.css';
import { useRef, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function UserDropdown({ isOpen, onClose, buttonRef, userData }) {
  const panelRef = useRef(null);
  const router = useRouter();

  // Generate initials from full name
  const getInitials = (fullName) => {
    if (!fullName) return 'U';
    return fullName
      .split(' ')
      .map(name => name[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (panelRef.current && 
          !panelRef.current.contains(event.target) &&
          buttonRef.current &&
          !buttonRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose, buttonRef]);

  const handleLogout = () => {
    // Clear cookies by setting them to expire in the past
    document.cookie = 'username=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    document.cookie = 'role=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    
    // Close dropdown and redirect to login
    onClose();
    router.push('/login');
  };

  if (!isOpen) return null;

  const displayName = userData?.fullName || 'User';
  const displayEmail = userData?.email || 'user@example.com';
  const initials = getInitials(displayName);

  return (
    <div className={styles.overlay}>
      <div className={styles.panel} ref={panelRef}>
        <div className={styles.userInfo}>
          <div className={styles.avatar}>{initials}</div>
          <div className={styles.userDetails}>
            <div className={styles.userName}>{displayName}</div>
            <div className={styles.userEmail}>{displayEmail}</div>
          </div>
        </div>
        
        <div className={styles.menuItems}>
          <button className={styles.menuItem}>
            <i className="ph ph-user"></i>
            Profile Settings
          </button>
          <button className={styles.menuItem}>
            <i className="ph ph-gear"></i>
            Account Settings
          </button>
          <button className={styles.menuItem}>
            <i className="ph ph-chat"></i>
            Message Center
          </button>
          <button className={styles.menuItem}>
            <i className="ph ph-question"></i>
            Help
          </button>
        </div>
        
        <div className={styles.divider}></div>
        
        <button className={styles.logoutBtn} onClick={handleLogout}>
          <i className="ph ph-sign-out"></i>
          Log out
        </button>
      </div>
    </div>
  );
} 