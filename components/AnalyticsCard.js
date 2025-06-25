import styles from '../styles/AnalyticsCard.module.css';

export default function AnalyticsCard({ 
  title, 
  value, 
  trend, 
  trendValue, 
  description, 
  link 
}) {
  const getTrendIcon = (trend) => {
    return trend === 'up' ? '↗' : '↘';
  };

  const getTrendClass = (trend) => {
    return trend === 'up' ? styles.trendUp : styles.trendDown;
  };

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <h3 className={styles.title}>{title}</h3>
        <div className={`${styles.trend} ${getTrendClass(trend)}`}>
          <span className={styles.trendIcon}>{getTrendIcon(trend)}</span>
          <span className={styles.trendValue}>{trendValue}</span>
        </div>
      </div>
      
      <div className={styles.value}>{value}</div>
      
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