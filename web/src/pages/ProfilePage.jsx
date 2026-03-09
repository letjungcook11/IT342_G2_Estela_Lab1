import Button from '../components/ui/Button';
import { useAuth } from '../hooks/useAuth';
import styles from './ProfilePage.module.css';

export default function ProfilePage() {
  const { user, loading, logout } = useAuth();

  if (loading) {
    return (
      <div className={styles.centered}>
        <div className={styles.spinner} />
      </div>
    );
  }

  const initial = user?.username?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || '?';

  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <span className={styles.badge}>Profile</span>
        <h1 className={styles.title}>Your Account</h1>
      </div>

      <div className={styles.card}>
        {/* Avatar */}
        <div className={styles.avatarWrap}>
          <div className={styles.avatar}>{initial}</div>
          <div className={styles.avatarGlow} />
        </div>

        {/* Details */}
        <div className={styles.details}>
          <div className={styles.row}>
            <span className={styles.rowLabel}>Username</span>
            <span className={styles.rowValue}>{user?.username || '—'}</span>
          </div>
          <div className={styles.divider} />
          <div className={styles.row}>
            <span className={styles.rowLabel}>Email</span>
            <span className={styles.rowValue}>{user?.email || '—'}</span>
          </div>
          <div className={styles.divider} />
          <div className={styles.row}>
            <span className={styles.rowLabel}>Role</span>
            <span className={styles.rowValue}>
              <span className={styles.roleBadge}>{user?.role || 'Member'}</span>
            </span>
          </div>
        </div>

        {/* Logout */}
        <div className={styles.actions}>
          <Button variant="danger" onClick={logout}>
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
}