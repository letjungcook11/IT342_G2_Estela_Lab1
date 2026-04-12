import styles from './Button.module.css';

export default function Button({
  children, variant = 'primary', loading, size = 'md', ...props
}) {
  return (
    <button
      className={[styles.btn, styles[variant], styles[size]].join(' ')}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading
        ? <span className={styles.spinner} />
        : children}
    </button>
  );
}