import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from '../styles/Sidebar.module.css';
import { useState, useEffect } from 'react';

export default function Sidebar({ username, isAdmin, collapsed, onClose }) {
  const router = useRouter();
  const [showStarred, setShowStarred] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [expandedSections, setExpandedSections] = useState({});

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

  const toggleSection = (sectionKey) => {
    setExpandedSections(prev => {
      const isCurrentlyExpanded = prev[sectionKey];
      
      // If clicking on already expanded section, collapse it
      if (isCurrentlyExpanded) {
        return {};
      }
      
      // Otherwise, collapse all and expand only the clicked section
      return {
        [sectionKey]: true
      };
    });
  };

  const navItems = [
    { 
      label: 'Home', 
      href: '/', 
      icon: 'house',
      hasSubItems: false
    },
    { 
      label: 'Activity', 
      href: '#', 
      icon: 'receipt',
      hasSubItems: true,
      subItems: [
        { label: 'All Transactions', href: '#', starred: true },
        { label: 'All Reports', href: '/analytics', starred: true },
        { label: 'Business Overview', href: '/analytics', starred: true },
        { label: 'Tax Documents', href: '#', starred: true }
      ]
    },
    { 
      label: 'Sales', 
      href: '#', 
      icon: 'money',
      hasSubItems: true,
      subItems: [
        { label: 'Invoices', href: '#', starred: false },
        { label: 'Online Checkout', href: '#', starred: false },
        { label: 'PayPal Zettle Point of Sale', href: '#', starred: false },
        { label: 'Subscriptions', href: '#', starred: false },
        { label: 'Donations', href: '#', starred: false },
        { label: 'Payment Links and Buttons', href: '#', starred: false },
        { label: 'Shipping', href: '#', starred: false }
      ]
    },
    { 
      label: 'Finance', 
      href: '#', 
      icon: 'bank',
      hasSubItems: true,
      subItems: [
        { label: 'Money', href: '#', starred: false },
        { label: 'Banks & Cards', href: '#', starred: false },
        { label: 'Crypto', href: '#', starred: false },
        { label: 'PayPal Business Debit Mastercard', href: '#', starred: false },
        { label: 'PayPal Working Capital', href: '#', starred: false },
        { label: 'PayPal Business Loan', href: '#', starred: false }
      ]
    },
    { 
      label: 'Operations', 
      href: '#', 
      icon: 'monitor',
      hasSubItems: true,
      subItems: [
        { label: 'Disputes', href: '#', starred: false },
        { label: 'Customers With Transactions', href: '#', starred: false },
        { label: 'Pay Later Messaging', href: '#', starred: false },
        { label: 'Cross Border Trade', href: '#', starred: false },
        { label: 'PayPal Business Resource Center', href: '#', starred: false }
      ]
    },
    { 
      label: 'Pay & Get Paid', 
      href: '#', 
      icon: 'currency-circle-dollar',
      hasSubItems: true,
      subItems: [
        { label: 'Create an Invoice', href: '#', starred: false },
        { label: 'Request Money', href: '#', starred: false },
        { label: 'Business profile', href: '#', starred: false },
        { label: 'QR Code', href: '#', starred: false },
        { label: 'Virtual Terminal', href: '#', starred: false },
        { label: 'Create Payment Links and Buttons', href: '#', starred: false },
        { label: 'Create Shopping Cart Buttons', href: '#', starred: false },
        { label: 'Send Money', href: '#', starred: false },
        { label: 'Payouts', href: '#', starred: false }
      ]
    },
    { 
      label: 'Business Tools', 
      href: '#', 
      icon: 'squares-four',
      hasSubItems: false
    },
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
            <div key={item.label} className={`${styles.navItem} ${expandedSections[item.label] ? styles.expanded : ''}`}>
              {item.hasSubItems ? (
                <div
                  className={`${styles.link} ${styles.expandableLink}`}
                  onClick={() => toggleSection(item.label)}
                >
                  <i className={`ph ph-${item.icon} ${styles.navIcon}`}></i>
                  {item.label}
                  <i className={`${styles.rightChevron} ph ph-caret-${expandedSections[item.label] ? 'down' : 'right'}`}></i>
                </div>
              ) : (
                <Link
                  href={item.href}
                  className={`${styles.link} ${router.pathname === item.href ? styles.active : ''}`}
                  aria-current={router.pathname === item.href ? 'page' : undefined}
                  onClick={handleLinkClick}
                >
                  <i className={`ph ph-${item.icon} ${styles.navIcon}`}></i>
                  {item.label}
                </Link>
              )}
              
              {item.hasSubItems && (
                <ul className={`${styles.subItemsList} ${expandedSections[item.label] ? styles.expanded : styles.collapsed}`}>
                  {item.subItems.map((subItem) => (
                    <li key={subItem.label} className={styles.subItem}>
                      <Link
                        href={subItem.href}
                        className={`${styles.subLink} ${router.pathname === subItem.href ? styles.active : ''}`}
                        onClick={handleLinkClick}
                      >
                        <span className={styles.subItemLabel}>{subItem.label}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </nav>
      </aside>
    </>
  );
}
