import styles from '../styles/AnalyticsCard.module.css';

export default function AnalyticsCard({ 
  title, 
  value, 
  trend, 
  trendValue, 
  description, 
  link 
}) {
  const isZeroPercent = trendValue === '0%' || trendValue === '0.0%';

  const getTrendIcon = (trend, isZero) => {
    if (isZero) return '−';
    return trend === 'up' ? '↑' : '↓';
  };

  const getTrendClass = (trend, isZero) => {
    if (isZero) return styles.trendNeutral;
    return trend === 'up' ? styles.trendUp : styles.trendDown;
  };

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <h3 className={styles.title}>{title}</h3>
      </div>
      
      <div className={styles.value}>{value}</div>
      
      <div className={`${styles.trend} ${getTrendClass(trend, isZeroPercent)}`}>
        <span className={styles.trendIcon}>{getTrendIcon(trend, isZeroPercent)}</span>
        <span className={styles.trendValue}>{trendValue}</span>
      </div>
      
      <div className={styles.description}>
        {description}
        {link && (
          <a href="#" className={styles.link}>
            {link}
          </a>
        )}
      </div>
    </div>
  );
} 