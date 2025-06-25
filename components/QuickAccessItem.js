import styles from '../styles/QuickAccess.module.css';

export default function QuickAccessItem({ icon, label }) {
  return (
    <div className={styles.item}>
      <div className={styles.circle}>
        <i className={`ph ph-${icon}`}></i>
      </div>
      <span className={styles.label}>{label}</span>
    </div>
  );
} 