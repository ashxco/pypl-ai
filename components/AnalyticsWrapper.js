import AnalyticsCard from './AnalyticsCard';
import ScrollableSection from './ScrollableSection';
import Link from 'next/link';
import styles from '../styles/AnalyticsSection.module.css';

export default function AnalyticsWrapper() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <div className={styles.titleSection}>
          <div className={styles.titleWithIcon}>
            <h2 className={styles.title}>Business performance</h2>
            <i className={`ph ph-pencil-simple ${styles.editIcon}`}></i>
          </div>
          <Link href="/analytics" className={styles.viewMore}>View More</Link>
        </div>
        <div className={styles.headerText}>
          <span className={styles.period}>Showing data for Jan 01 - Jan 30, 2024. All comparisons to previous 30 days</span>
        </div>
      </div>
      <ScrollableSection itemWidth={290}>
        <div className={styles.cardsContainer}>
          <AnalyticsCard
            title="Total sales"
            value="$62,500.00"
            trend="up"
            trendValue="9.2%"
            description="12% of your sales are coming in through Venmo"
          />
          <AnalyticsCard
            title="Average order value"
            value="$250.00"
            trend="up"
            trendValue="32.5%"
            description="Pay Later AOV is 16% higher with messaging"
            link="Set up messaging"
          />
          <AnalyticsCard
            title="Total customers"
            value="54,450"
            trend="down"
            trendValue="7.9%"
            description="600 new customers joined you, making up 60% of your total customer base"
          />
          <AnalyticsCard
            title="PayPal conversion rate"
            value="86.5%"
            trend="down"
            trendValue="1.7%"
            description="Desktop transactions show a higher conversion rate - optimizing your mobile flows could boost performance"
          />
        </div>
      </ScrollableSection>
    </div>
  );
} 