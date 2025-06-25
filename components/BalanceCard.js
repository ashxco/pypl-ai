import { useState, useRef, useEffect } from 'react';
import styles from '../styles/BalanceCard.module.css';

export default function BalanceCard() {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  const toggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setOpen(prev => !prev);
  };

  useEffect(() => {
    function handleClick(e) {
      if (dropdownRef.current && 
          !dropdownRef.current.contains(e.target) &&
          buttonRef.current &&
          !buttonRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClick);
    }
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  return (
    <div className={styles.card}>
      <h1 className={styles.amount}>$92.80 <span className={styles.currency}>USD</span></h1>
      <p className={styles.subtitle}>Available balance</p>
      <div className={styles.actions}>
        <button className={styles.manageBtn} ref={buttonRef} onClick={toggle}>
          <span>Manage money</span>
          <i className="ph ph-caret-down"></i>
        </button>
        {open && (
          <ul className={styles.dropdown} ref={dropdownRef}>
            <li className={styles.dropdownItem}>Transfer to bank</li>
            <li className={styles.dropdownItem}>Add money</li>
            <li className={styles.dropdownItem}>Manage currencies</li>
          </ul>
        )}
        <div className={styles.transferDaily}>
          <i className="ph ph-arrow-clockwise"></i>
          <span>Transfers daily</span>
        </div>
      </div>
    </div>
  );
} 