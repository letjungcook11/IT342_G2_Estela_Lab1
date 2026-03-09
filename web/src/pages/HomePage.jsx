import styles from './HomePage.module.css';

export default function HomePage() {
  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <div className={styles.badge}>Dashboard</div>
        <h1 className={styles.title}>Welcome Back 👋</h1>
        <p className={styles.sub}>Your student portal is ready. Use the navigation above to explore.</p>
      </div>

      <div className={styles.grid}>
        {['Overview', 'Activity', 'Announcements'].map(label => (
          <div key={label} className={styles.card}>
            <span className={styles.cardLabel}>{label}</span>
            <span className={styles.cardEmpty}>Coming soon</span>
          </div>
        ))}
      </div>
    </div>
  );
}