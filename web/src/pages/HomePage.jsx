import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { getReports } from '../services/api';
import Badge from '../components/ui/Badge';
import styles from './HomePage.module.css';

export default function HomePage() {
  const { user } = useAuth();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getReports()
      .then(r => setReports(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const total     = reports.length;
  const pending   = reports.filter(r => r.status === 'PENDING').length;
  const inprog    = reports.filter(r => r.status === 'IN_PROGRESS' || r.status === 'ASSIGNED').length;
  const completed = reports.filter(r => r.status === 'COMPLETED').length;
  const urgent    = reports.filter(r => r.priority === 'URGENT').length;

  const recent = [...reports]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  const cards = [
    { label: 'Total Reports',  value: total,     color: 'default'  },
    { label: 'Pending',        value: pending,   color: 'pending'  },
    { label: 'In Progress',    value: inprog,    color: 'assigned' },
    { label: 'Completed',      value: completed, color: 'completed'},
  ];

  if (urgent > 0) cards.push({ label: 'Urgent', value: urgent, color: 'urgent' });

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>
            Good {greeting()}, {user?.username || 'there'} 👋
          </h1>
          <p className={styles.sub}>
            {user?.role === 'EMPLOYEE'
              ? 'Here's an overview of all campus reports.'
              : 'Here's a summary of your submitted reports.'}
          </p>
        </div>
      </div>

      {/* Stat cards */}
      <div className={styles.cards}>
        {cards.map(c => (
          <div key={c.label} className={styles.card}>
            <div className={styles.cardValue}>{loading ? '—' : c.value}</div>
            <div className={styles.cardLabel}>{c.label}</div>
            <div className={`${styles.cardBar} ${styles['bar_' + c.color]}`} />
          </div>
        ))}
      </div>

      {/* Recent reports */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Recent reports</h2>
        </div>
        {loading ? (
          <div className={styles.empty}>Loading...</div>
        ) : recent.length === 0 ? (
          <div className={styles.empty}>No reports yet.</div>
        ) : (
          <div className={styles.table}>
            <div className={styles.thead}>
              <span>Title</span>
              <span>Location</span>
              <span>Priority</span>
              <span>Status</span>
              <span>Date</span>
            </div>
            {recent.map(r => (
              <div key={r.id} className={styles.row}>
                <span className={styles.rowTitle}>{r.title}</span>
                <span className={styles.muted}>{r.location}</span>
                <span><Badge label={r.priority} variant={r.priority.toLowerCase()} /></span>
                <span><Badge label={r.status}   variant={statusVariant(r.status)} /></span>
                <span className={styles.muted}>{fmtDate(r.createdAt)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return 'morning';
  if (h < 18) return 'afternoon';
  return 'evening';
}
function fmtDate(d) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-PH', { month:'short', day:'numeric', year:'numeric' });
}
function statusVariant(s) {
  return { PENDING:'pending', ASSIGNED:'assigned', IN_PROGRESS:'inprogress', COMPLETED:'completed' }[s] || 'default';
}