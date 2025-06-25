import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from '../styles/Sidebar.module.css';
import { useState, useEffect } from 'react';

export default function Sidebar({ username, isAdmin, collapsed, onClose }) {
  const router = useRouter();
  const [showStarred, setShowStarred] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleLogout = () => {
    router.push('/login');
  };

  const handleOverlayClick = () => {
    if (isMobile && onClose) {
      onClose();
    }
  };

  const handleLinkClick = () => {
    if (isMobile && onClose) {
      onClose();
    }
  };

  const navItems = [
    { label: 'Home', href: '/', icon: 'house' },
    { label: 'Activity', href: '#', icon: 'receipt' },
    { label: 'Sales', href: '#', icon: 'money' },
    { label: 'Finance', href: '#', icon: 'bank' },
    { label: 'Operations', href: '#', icon: 'monitor' },
    { label: 'Pay & Get Paid', href: '#', icon: 'currency-circle-dollar' },
    { label: 'Business Tools', href: '#', icon: 'squares-four' },
  ];

  const sidebarClasses = [
    styles.sidebar,
    collapsed ? styles.collapsed : '',
    isMobile && !collapsed ? styles.mobileOpen : ''
  ].filter(Boolean).join(' ');

  const overlayClasses = [
    styles.mobileOverlay,
    isMobile && !collapsed ? styles.visible : ''
  ].filter(Boolean).join(' ');

  return (
    <>
      {/* Mobile overlay */}
      <div className={overlayClasses} onClick={handleOverlayClick} />
      
      <aside className={sidebarClasses}>
        <img
          src="https://www.paypalobjects.com/paypal-ui/logos/svg/paypal-wordmark-color.svg"
          alt="PayPal"
          className={styles.logo}
        />
        <button className={styles.createBtn}>
          <i className={`ph ph-plus ${styles.createIcon}`}></i>
          <span>Create New</span>
        </button>

        {/* Starred Section */}
        <div className={styles.starredContainer}>
          <div className={styles.starredHeader} onClick={() => setShowStarred(!showStarred)}>
            <span className={styles.folderIcon}>
              <i className={`ph ph-folder-star ${styles.folderIcon}`}></i>
            </span>
            <span className={styles.starredLabel}>Starred</span>
            <i className={`${styles.chevron} ph ph-${showStarred ? 'caret-down' : 'caret-right'}`}></i>
          </div>
          <ul className={`${styles.starredList} ${showStarred ? styles.open : styles.closed}`}>
            <li className={styles.starItem}>Invoices <i className={`ph-fill ph-star ${styles.starIcon} ${styles.starFill}`}></i><i className={`ph ph-star ${styles.starIcon} ${styles.starOutline}`}></i></li>
            <li className={styles.starItem}>Transactions <i className={`ph-fill ph-star ${styles.starIcon} ${styles.starFill}`}></i><i className={`ph ph-star ${styles.starIcon} ${styles.starOutline}`}></i></li>
            <li className={styles.starItem}>Money <i className={`ph-fill ph-star ${styles.starIcon} ${styles.starFill}`}></i><i className={`ph ph-star ${styles.starIcon} ${styles.starOutline}`}></i></li>
          </ul>
        </div>

        <hr className={styles.divider} />

        <nav className={styles.nav}>
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`${styles.link} ${router.pathname === item.href ? styles.active : ''}`}
              aria-current={router.pathname === item.href ? 'page' : undefined}
              onClick={handleLinkClick}
            >
              <i className={`ph ph-${item.icon} ${styles.navIcon}`}></i>
              {item.label}
              {item.label !== 'Home' && (
                <i className={`${styles.rightChevron} ph ph-caret-right`}></i>
              )}
            </Link>
          ))}
        </nav>
      </aside>
    </>
  );
}
