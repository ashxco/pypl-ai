import styles from '../styles/BusinessGlanceCard.module.css';
import { ChartLine, Users, CheckCircle, ShoppingCart, Target } from 'phosphor-react';
import { useState } from 'react';

export default function BusinessGlanceCard() {
  const [selectedPeriod, setSelectedPeriod] = useState('30d');

  const data = {
    '7d': {
      revenue: '$12,345.67',
      customers: '89',
      averageOrderValue: '$79.13',
      orders: '156',
      conversionRate: '5.1%',
      revenueLabel: 'Weekly revenue',
      ordersLabel: 'Orders this week'
    },
    '30d': {
      revenue: '$45,892.13',
      customers: '1,247',
      averageOrderValue: '$134.18',
      orders: '342',
      conversionRate: '4.2%',
      revenueLabel: 'Monthly revenue',
      ordersLabel: 'Orders this month'
    },
    '90d': {
      revenue: '$142,756.89',
      customers: '3,891',
      averageOrderValue: '$131.07',
      orders: '1,089',
      conversionRate: '3.8%',
      revenueLabel: 'Quarterly revenue',
      ordersLabel: 'Orders this quarter'
    }
  };

  const currentData = data[selectedPeriod];

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h3 className={styles.title}>At a glance</h3>
        <div className={styles.segmentController}>
          <button 
            className={`${styles.segmentButton} ${selectedPeriod === '7d' ? styles.active : ''}`}
            onClick={() => setSelectedPeriod('7d')}
          >
            7d
          </button>
          <button 
            className={`${styles.segmentButton} ${selectedPeriod === '30d' ? styles.active : ''}`}
            onClick={() => setSelectedPeriod('30d')}
          >
            30d
          </button>
          <button 
            className={`${styles.segmentButton} ${selectedPeriod === '90d' ? styles.active : ''}`}
            onClick={() => setSelectedPeriod('90d')}
          >
            90d
          </button>
        </div>
      </div>
      <div className={styles.content}>
        <div className={styles.listItem}>
          <div className={styles.labelContainer}>
            <div className={styles.iconCircle}>
              <ChartLine size={16} className={styles.icon} />
            </div>
            <span className={styles.label}>{currentData.revenueLabel}</span>
          </div>
          <span className={styles.value}>{currentData.revenue}</span>
        </div>
        <div className={styles.listItem}>
          <div className={styles.labelContainer}>
            <div className={styles.iconCircle}>
              <Users size={16} className={styles.icon} />
            </div>
            <span className={styles.label}>Total customers</span>
          </div>
          <span className={styles.value}>{currentData.customers}</span>
        </div>
        <div className={styles.listItem}>
          <div className={styles.labelContainer}>
            <div className={styles.iconCircle}>
              <CheckCircle size={16} className={styles.icon} />
            </div>
            <span className={styles.label}>Average order value</span>
          </div>
          <span className={styles.value}>{currentData.averageOrderValue}</span>
        </div>
        <div className={styles.listItem}>
          <div className={styles.labelContainer}>
            <div className={styles.iconCircle}>
              <ShoppingCart size={16} className={styles.icon} />
            </div>
            <span className={styles.label}>{currentData.ordersLabel}</span>
          </div>
          <span className={styles.value}>{currentData.orders}</span>
        </div>
        <div className={styles.listItem}>
          <div className={styles.labelContainer}>
            <div className={styles.iconCircle}>
              <Target size={16} className={styles.icon} />
            </div>
            <span className={styles.label}>Conversion rate</span>
          </div>
          <span className={styles.value}>{currentData.conversionRate}</span>
        </div>
        <div className={styles.viewMoreContainer}>
          <a href="#" className={styles.viewMoreLink}>View more</a>
        </div>
      </div>
    </div>
  );
} 