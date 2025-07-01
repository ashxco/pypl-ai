import { useState, useRef, useEffect } from 'react';
import styles from '../styles/BalanceCard.module.css';

export default function BalanceCard() {
  const [open, setOpen] = useState(false);
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState(null);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    fetch('/api/login', { method: 'GET', credentials: 'include' })
      .then(async (res) => {
        if (!res.ok) throw new Error('Failed to fetch balance');
        const data = await res.json();
        setBalance(data.balance);
        setUserData({ fullName: data.fullName, email: data.email });
        setLoading(false);
      })
      .catch((err) => {
        setError('Unable to load balance');
        setLoading(false);
      });
  }, []);

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

  let displayAmount;
  if (loading) {
    displayAmount = <span>Loading...</span>;
  } else if (error) {
    displayAmount = <span style={{ color: 'red' }}>{error}</span>;
  } else {
    displayAmount = <>{balance !== null ? `$${balance.toFixed(2)}` : '$0.00'} <span className={styles.currency}>USD</span></>;
  }

  return (
    <div className={styles.card}>
      <h1 className={styles.amount}>{displayAmount}</h1>
      <p className={styles.subtitle}>Available balance</p>
      <div className={styles.actions}>
        <button className={styles.manageBtn} ref={buttonRef} onClick={toggle}>
          <span>Manage money</span>
          <i className="ph ph-caret-down"></i>
        </button>
        {open && (
          <div className={styles.dropdown} ref={dropdownRef}>
            <button className={styles.dropdownItem}>Add money</button>
            <button className={styles.dropdownItem}>Transfer money</button>
            <button className={styles.dropdownItem}>Set up auto transfers</button>
            <button className={styles.dropdownItem}>View Money page</button>
          </div>
        )}
        <div className={styles.transferDaily}>
          <i className="ph ph-arrow-clockwise"></i>
          <span>Transfers daily</span>
        </div>
      </div>
    </div>
  );
} 