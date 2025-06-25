import QuickAccessSection from './QuickAccessSection';
import ScrollableSection from './ScrollableSection';
import styles from '../styles/AnalyticsSection.module.css';

export default function QuickAccessWrapper() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <div className={styles.titleSection}>
          <div className={styles.titleWithIcon}>
            <h2 className={styles.title}>Quick Access</h2>
            <i className={`ph ph-pencil-simple ${styles.editIcon}`}></i>
          </div>
        </div>
      </div>
      <ScrollableSection itemWidth={80}>
        <QuickAccessSection />
      </ScrollableSection>
    </div>
  );
} 