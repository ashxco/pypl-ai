import styles from '../styles/Login.module.css';

export default function Input({ id, label, type = 'text', value, onChange, ...rest }) {
  return (
    <div className={styles.floatGroup}>
      <input
        id={id}
        className={styles.input}
        type={type}
        placeholder=" "
        value={value}
        onChange={onChange}
        {...rest}
      />
      <label htmlFor={id} className={styles.floatLabel}>
        {label}
      </label>
    </div>
  );
} 