import { useState, useEffect } from 'react';
import AnalyticsCard from './AnalyticsCard';
import ScrollableSection from './ScrollableSection';
import Link from 'next/link';
import styles from '../styles/AnalyticsSection.module.css';

export default function AnalyticsWrapper() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch('/api/analytics', {
          method: 'GET',
          credentials: 'include'
        });

        if (!response.ok) {
          throw new Error('Failed to fetch analytics');
        }

        const data = await response.json();
        console.log('Analytics data received:', data);
        setAnalytics(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading || !analytics) {
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
            <span className={styles.period}>Loading analytics...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
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
            <span className={styles.period}>Error loading analytics data</span>
          </div>
        </div>
      </div>
    );
  }

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
          <span className={styles.period}>Showing data for last 30 days. All comparisons to previous 30 days</span>
        </div>
      </div>
      <ScrollableSection itemWidth={290}>
        <div className={styles.cardsContainer}>
          <AnalyticsCard
            title="Total sales"
            value={analytics.totalSales?.value || '$0.00'}
            trend={analytics.totalSales?.change?.trend || 'up'}
            trendValue={analytics.totalSales?.change?.value || '0%'}
            description={analytics.totalSales?.description || 'Loading sales data...'}
          />
          <AnalyticsCard
            title="Average order value"
            value={analytics.avgOrderValue?.value || '$0.00'}
            trend={analytics.avgOrderValue?.change?.trend || 'up'}
            trendValue={analytics.avgOrderValue?.change?.value || '0%'}
            description={analytics.avgOrderValue?.description || 'Loading order value data...'}
            link={analytics.avgOrderValue?.link}
          />
          <AnalyticsCard
            title="Repeat customers"
            value={analytics.repeatCustomers?.value || '0'}
            trend={analytics.repeatCustomers?.change?.trend || 'up'}
            trendValue={analytics.repeatCustomers?.change?.value || '0%'}
            description={analytics.repeatCustomers?.description || 'Loading repeat customer data...'}
          />
          <AnalyticsCard
            title="PayPal conversion rate"
            value={analytics.conversionRate?.value || '0%'}
            trend={analytics.conversionRate?.change?.trend || 'up'}
            trendValue={analytics.conversionRate?.change?.value || '0%'}
            description={analytics.conversionRate?.description || 'Loading conversion rate data...'}
          />
        </div>
      </ScrollableSection>
    </div>
  );
} 