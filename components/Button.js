import styles from '../styles/Login.module.css';

export default function Button({ variant = 'primary', children, className = '', ...props }) {
  const variantClass = variant === 'secondary' ? styles.btnSecondary : styles.btnPrimary;
  return (
    <button className={`${variantClass} ${className}`} {...props}>
      {children}
    </button>
  );
} 