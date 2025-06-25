import styles from '../styles/NotificationPanel.module.css';
import { useRef, useEffect } from 'react';

export default function NotificationPanel({ isOpen, onClose, buttonRef }) {
  const panelRef = useRef(null);

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

  if (!isOpen) return null;

  const notifications = [
    {
      id: 1,
      icon: 'flag',
      iconColor: '#D50102',
      iconBg: '#FFF3F3',
      title: "We couldn't approve your business loan",
      description: "We sent you an email with more details. You can always reapply in 21 days.",
      time: "1 day ago",
      unread: true
    },
    {
      id: 2,
      icon: 'flag',
      iconColor: '#0070BA',
      iconBg: '#E6F3FF',
      title: "Invoice #21 has been paid",
      description: "$1,000 has been deposited in your account.",
      time: "1 day ago",
      unread: true
    },
    {
      id: 3,
      icon: 'flag',
      iconColor: '#666',
      iconBg: '#F5F5F5',
      title: "Your account balance is below zero",
      description: "There was a problem and we had to use money from your PayPal account to complete your June 7, 2022 purchase.",
      time: "1 day ago",
      unread: false
    },
    {
      id: 4,
      icon: 'flag',
      iconColor: '#666',
      iconBg: '#F5F5F5',
      title: "Your PayPal Credit statement is now available.",
      description: "",
      time: "1 day ago",
      unread: false
    },
    {
      id: 5,
      icon: 'flag',
      iconColor: '#666',
      iconBg: '#F5F5F5',
      title: "Simplify your workday with PayPal Zettle, our new Point of Sale system.",
      description: "It makes it easy to accept payments in store, track sales and inventory, and integrate with partners.",
      time: "1 day ago",
      unread: false
    }
  ];

  return (
    <div className={styles.overlay}>
      <div className={styles.panel} ref={panelRef}>
        <div className={styles.header}>
          <h2 className={styles.title}>Notifications</h2>
          <button className={styles.markAllRead}>
            <i className="ph ph-check"></i>
            Mark all as read
          </button>
        </div>
        
        <div className={styles.notificationsList}>
          {notifications.map((notification) => (
            <div key={notification.id} className={`${styles.notificationItem} ${!notification.unread ? styles.readNotification : ''}`}>
              <div className={styles.notificationIcon} style={{ backgroundColor: notification.iconBg }}>
                <i className={`ph ph-${notification.icon}`} style={{ color: notification.iconColor }}></i>
              </div>
              
              <div className={styles.notificationContent}>
                <div className={styles.notificationMain}>
                  <h3 className={`${styles.notificationTitle} ${!notification.unread ? styles.readTitle : ''}`}>{notification.title}</h3>
                  {notification.unread && <div className={styles.unreadDot}></div>}
                  <button className={styles.menuButton}>
                    <i className="ph ph-dots-three-vertical"></i>
                  </button>
                </div>
                
                {notification.description && (
                  <p className={styles.notificationDescription}>{notification.description}</p>
                )}
                
                <div className={styles.notificationFooter}>
                  <button className={styles.seeDetailsBtn}>See details</button>
                  <span className={styles.notificationTime}>{notification.time}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className={styles.footer}>
          <button className={styles.seeAllBtn}>
            See all notifications
            <span className={styles.notificationCount}>9</span>
          </button>
        </div>
      </div>
    </div>
  );
} 