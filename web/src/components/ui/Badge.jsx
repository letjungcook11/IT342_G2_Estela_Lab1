import styles from './Badge.module.css';

export default function Badge({ label, variant = 'default' }) {
  return <span className={`${styles.badge} ${styles[variant]}`}>{label}</span>;
}