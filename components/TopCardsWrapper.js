import SinceLoginCard from './SinceLoginCard';
import BusinessGlanceCard from './BusinessGlanceCard';
import styles from '../styles/TopCardsWrapper.module.css';

export default function TopCardsWrapper() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.cardContainer}>
        <SinceLoginCard />
      </div>
      <div className={styles.cardContainer}>
        <BusinessGlanceCard />
      </div>
    </div>
  );
} 