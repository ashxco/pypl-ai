import { useState, useEffect } from 'react';
import AnalyticsCardHome3 from './AnalyticsCardHome3';
import ScrollableSection from './ScrollableSection';
import styles from '../styles/AnalyticsSection.module.css';

export default function AnalyticsWrapperHome3() {
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
        <ScrollableSection itemWidth={290}>
          <div className={styles.cardsContainer}>
            <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
              Loading analytics...
            </div>
          </div>
        </ScrollableSection>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.wrapper}>
        <ScrollableSection itemWidth={290}>
          <div className={styles.cardsContainer}>
            <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
              Error loading analytics data
            </div>
          </div>
        </ScrollableSection>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <ScrollableSection itemWidth={290}>
        <div className={styles.cardsContainer}>
          <AnalyticsCardHome3
            title="Total sales"
            value={analytics.totalSales?.value || '$0.00'}
            trend={analytics.totalSales?.change?.trend || 'up'}
            trendValue={analytics.totalSales?.change?.value || '0%'}
          />
          <AnalyticsCardHome3
            title="Average order value"
            value={analytics.avgOrderValue?.value || '$0.00'}
            trend={analytics.avgOrderValue?.change?.trend || 'up'}
            trendValue={analytics.avgOrderValue?.change?.value || '0%'}
          />
          <AnalyticsCardHome3
            title="Repeat customers"
            value={analytics.repeatCustomers?.value || '$0.00'}
            trend={analytics.repeatCustomers?.change?.trend || 'up'}
            trendValue={analytics.repeatCustomers?.change?.value || '0%'}
          />
          <AnalyticsCardHome3
            title="PayPal conversion rate"
            value={analytics.conversionRate?.value || '0%'}
            trend={analytics.conversionRate?.change?.trend || 'up'}
            trendValue={analytics.conversionRate?.change?.value || '0%'}
          />
        </div>
      </ScrollableSection>
    </div>
  );
} 