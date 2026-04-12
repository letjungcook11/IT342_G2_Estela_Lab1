import { useEffect, useState } from 'react';
import { getHistory } from '../services/api';
import Badge from '../components/ui/Badge';
import styles from './HistoryPage.module.css';

export default function HistoryPage() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getHistory()
      .then(r => setHistory(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Fix History</h1>
        <p className={styles.sub}>Full campus-wide log of all maintenance activity.</p>
      </div>

      {loading ? (
        <div className={styles.empty}>Loading...</div>
      ) : history.length === 0 ? (
        <div className={styles.empty}>No history yet.</div>
      ) : (
        <div className={styles.timeline}>
          {history.map((h, i) => (
            <div key={h.id} className={styles.entry}>
              <div className={styles.line}>
                <div className={`${styles.dot} ${dotColor(h.newStatus)}`} />
                {i < history.length - 1 && <div className={styles.connector} />}
              </div>
              <div className={styles.content}>
                <div className={styles.entryTop}>
                  <span className={styles.reportName}>{h.report?.title || 'Unknown Report'}</span>
                  <span className={styles.time}>{fmtDate(h.changedAt)}</span>
                </div>
                <div className={styles.entryMeta}>
                  {h.oldStatus
                    ? <><Badge label={h.oldStatus} variant={statusVariant(h.oldStatus)} /><span className={styles.arrow}>→</span></>
                    : null}
                  <Badge label={h.newStatus} variant={statusVariant(h.newStatus)} />
                </div>
                <div className={styles.entryDetails}>
                  <span>{h.report?.location}</span>
                  {h.changedBy && <span>· by {h.changedBy.username}</span>}
                  {h.notes && <span>· {h.notes}</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function fmtDate(d) {
  if (!d) return '—';
  return new Date(d).toLocaleString('en-PH', {
    month:'short', day:'numeric', year:'numeric',
    hour:'2-digit', minute:'2-digit'
  });
}
function statusVariant(s) {
  return { PENDING:'pending', ASSIGNED:'assigned', IN_PROGRESS:'inprogress', COMPLETED:'completed' }[s] || 'default';
}
function dotColor(s) {
  return {
    PENDING:'dotAmber', ASSIGNED:'dotBlue',
    IN_PROGRESS:'dotBlue', COMPLETED:'dotGreen'
  }[s] || 'dotGray';
}