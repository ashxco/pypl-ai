import styles from '../styles/QuickCard.module.css';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';

export default function QuickCard({ icon, title, desc }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const menuButtonRef = useRef(null);

  // Extract main action from title (e.g., "Review 2 disputes" -> "Go to disputes")
  const getMainAction = (title) => {
    if (title.toLowerCase().includes('dispute')) return 'Go to disputes';
    if (title.toLowerCase().includes('ship')) return 'Go to shipping';
    if (title.toLowerCase().includes('inquir')) return 'Go to inquiries';
    if (title.toLowerCase().includes('loan')) return 'Go to loan application';
    return 'Go to ' + title.toLowerCase();
  };

  const mainAction = getMainAction(title);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target) &&
        menuButtonRef.current &&
        !menuButtonRef.current.contains(event.target)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMenuClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowDropdown(!showDropdown);
  };

  const handleMainAction = () => {
    console.log(`Action: ${mainAction}`);
    setShowDropdown(false);
  };

  const handleDismiss = () => {
    console.log('Dismissed card:', title);
    setShowDropdown(false);
  };

  return (
    <div className={styles.card}>
      <div className={styles.topRow}>
        <i className={`ph ph-${icon} ${styles.icon}`}></i>
        <div className={styles.menuContainer}>
          <i 
            ref={menuButtonRef}
            className={`ph ph-dots-three-vertical ${styles.menu}`}
            onClick={handleMenuClick}
          ></i>
          {showDropdown && (
            <div ref={dropdownRef} className={styles.dropdown}>
              <button className={styles.dropdownItem} onClick={handleMainAction}>
                {mainAction}
              </button>
              <button className={styles.dropdownItem} onClick={handleDismiss}>
                Dismiss
              </button>
            </div>
          )}
        </div>
      </div>
      <Link href="#" className={styles.link}>{title}</Link>
      <p className={styles.desc}>{desc}</p>
    </div>
  );
} 