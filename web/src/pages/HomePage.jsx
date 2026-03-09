import styles from './HomePage.module.css';

export default function HomePage() {
  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <span className={styles.badge}>Dashboard</span>
        <h1 className={styles.title}>Welcome back 👋</h1>
        <p className={styles.sub}>Your workspace is ready. Use the nav above to explore.</p>
      </div>

      {/* Placeholder cards */}
      <div className={styles.grid}>
        {['Overview', 'Activity', 'Analytics'].map(label => (
          <div key={label} className={styles.card}>
            <div className={styles.cardInner}>
              <span className={styles.cardLabel}>{label}</span>
              <span className={styles.cardEmpty}>Coming soon</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}