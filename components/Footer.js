import styles from '../styles/Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.links}>
          <a href="#" className={styles.link}>Help</a>
          <a href="#" className={styles.link}>Contact</a>
          <a href="#" className={styles.link}>Fees</a>
          <a href="#" className={styles.link}>Security</a>
          <a href="#" className={styles.link}>Apps</a>
          <a href="#" className={styles.link}>Shop</a>
          <a href="#" className={styles.link}>Enterprise</a>
          <a href="#" className={styles.link}>Partners</a>
        </div>
        <div className={styles.legal}>
          <span className={styles.copyright}>© 1999-2024 PayPal, Inc. All rights reserved.</span>
          <div className={styles.legalLinks}>
            <a href="#" className={styles.legalLink}>Privacy</a>
            <a href="#" className={styles.legalLink}>Legal</a>
            <a href="#" className={styles.legalLink}>Policy Updates</a>
          </div>
        </div>
      </div>
    </footer>
  );
} 