import { useEffect, useState, useRef } from 'react';
import { useAuth } from '../hooks/useAuth';
import {
  getReports, getNotifications, getUnreadCount,
  markAllRead, getTicker, rateReport
} from '../services/api';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import styles from './HomePage.module.css';

const BUILDINGS = [
  'Main Building', 'Engineering Building', 'IT Building',
  'Science Building', 'Library', 'Gymnasium', 'Canteen',
  'Admin Building', 'Chapel', 'Dormitory'
];

export default function HomePage() {
  const { user } = useAuth();
  const navigate  = useNavigate();
  const isEmployee = user?.role === 'EMPLOYEE';

  const [reports, setReports]           = useState([]);
  const [notifications, setNotifs]      = useState([]);
  const [unreadCount, setUnreadCount]   = useState(0);
  const [showNotifs, setShowNotifs]     = useState(false);
  const [ticker, setTicker]             = useState([]);
  const [tickerIndex, setTickerIndex]   = useState(0);
  const [loading, setLoading]           = useState(true);
  const [search, setSearch]             = useState('');
  const [showGuide, setShowGuide]       = useState(false);
  const [feedbackReport, setFeedbackReport] = useState(null);
  const [rating, setRating]             = useState(0);
  const [feedback, setFeedback]         = useState('');
  const [submittingFeedback, setSubmittingFeedback] = useState(false);
  const pollRef = useRef(null);

  const loadData = async () => {
    try {
      const [rRes, nRes, uRes, tRes] = await Promise.all([
        getReports(),
        getNotifications(),
        getUnreadCount(),
        getTicker(),
      ]);
      setReports(rRes.data);
      setNotifs(nRes.data);
      setUnreadCount(uRes.data.count);
      setTicker(tRes.data);
    } catch (e) {}
    finally { setLoading(false); }
  };

  useEffect(() => {
    loadData();
    pollRef.current = setInterval(loadData, 30000);
    return () => clearInterval(pollRef.current);
  }, []);

  // Ticker rotation
  useEffect(() => {
    if (ticker.length === 0) return;
    const t = setInterval(() => {
      setTickerIndex(i => (i + 1) % ticker.length);
    }, 3000);
    return () => clearInterval(t);
  }, [ticker]);

  // Check for completed reports needing feedback
  useEffect(() => {
    if (isEmployee) return;
    const completed = reports.find(
      r => r.status === 'COMPLETED' && !r.assignment?.rating
    );
    if (completed) setFeedbackReport(completed);
  }, [reports, isEmployee]);

  const handleMarkAllRead = async () => {
    await markAllRead();
    setUnreadCount(0);
    setNotifs(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const handleFeedbackSubmit = async () => {
    if (!rating) return;
    setSubmittingFeedback(true);
    try {
      await rateReport(feedbackReport.id, { rating, feedback });
      setFeedbackReport(null);
      setRating(0);
      setFeedback('');
      loadData();
    } finally { setSubmittingFeedback(false); }
  };

  // Stats
  const total     = reports.length;
  const pending   = reports.filter(r => r.status === 'PENDING').length;
  const inprog    = reports.filter(r =>
    r.status === 'IN_PROGRESS' || r.status === 'ASSIGNED').length;
  const completed = reports.filter(r => r.status === 'COMPLETED').length;
  const urgent    = reports.filter(r => r.priority === 'URGENT').length;
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  // Overdue: PENDING for more than 3 days
  const overdue = reports.filter(r => {
    if (r.status === 'COMPLETED') return false;
    const days = (Date.now() - new Date(r.createdAt)) / (1000 * 60 * 60 * 24);
    return days > 3;
  });

  // Heatmap: count reports per building
  const buildingCounts = {};
  BUILDINGS.forEach(b => { buildingCounts[b] = 0; });
  reports.forEach(r => {
    if (r.building && buildingCounts[r.building] !== undefined) {
      buildingCounts[r.building]++;
    }
  });
  const maxCount = Math.max(...Object.values(buildingCounts), 1);

  // Search filter
  const searchResults = search.trim()
    ? reports.filter(r =>
        r.title.toLowerCase().includes(search.toLowerCase()) ||
        r.location?.toLowerCase().includes(search.toLowerCase()) ||
        r.building?.toLowerCase().includes(search.toLowerCase())
      )
    : [];

  // Recent reports
  const recent = [...reports]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  // Donut ring math
  const radius = 54;
  const circ   = 2 * Math.PI * radius;
  const offset = circ - (completionRate / 100) * circ;

  return (
    <div className={styles.page}>

      {/* Live Ticker */}
      {ticker.length > 0 && (
        <div className={styles.ticker}>
          <span className={styles.tickerLabel}>LIVE</span>
          <span className={styles.tickerText}>
            {ticker[tickerIndex]?.message}
          </span>
        </div>
      )}

      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>
            Good {greeting()}, {user?.username || 'there'} 👋
          </h1>
          <p className={styles.sub}>
            {isEmployee
              ? "Here's an overview of all campus reports."
              : "Here's a summary of your submitted reports."}
          </p>
        </div>

        <div className={styles.headerActions}>
          {/* Search */}
          <div className={styles.searchWrap}>
            <input
              className={styles.searchInput}
              placeholder="Search reports..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            {search && (
              <div className={styles.searchDropdown}>
                {searchResults.length === 0
                  ? <div className={styles.searchEmpty}>No results found</div>
                  : searchResults.map(r => (
                    <div
                      key={r.id}
                      className={styles.searchItem}
                      onClick={() => { navigate('/dashboard/reports'); setSearch(''); }}
                    >
                      <span className={styles.searchTitle}>{r.title}</span>
                      <span className={styles.searchMeta}>
                        {r.building} · {r.status}
                      </span>
                    </div>
                  ))
                }
              </div>
            )}
          </div>

          {/* Notification Bell */}
          <div className={styles.bellWrap}>
            <button
              className={styles.bellBtn}
              onClick={() => {
                setShowNotifs(v => !v);
                if (!showNotifs && unreadCount > 0) handleMarkAllRead();
              }}
            >
              <BellIcon />
              {unreadCount > 0 && (
                <span className={styles.bellBadge}>
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>
            {showNotifs && (
              <div className={styles.notifPanel}>
                <div className={styles.notifHeader}>
                  <span>Notifications</span>
                  <button
                    className={styles.notifClear}
                    onClick={handleMarkAllRead}
                  >
                    Mark all read
                  </button>
                </div>
                {notifications.length === 0
                  ? <div className={styles.notifEmpty}>No notifications yet</div>
                  : notifications.slice(0, 8).map(n => (
                    <div
                      key={n.id}
                      className={`${styles.notifItem} ${!n.isRead ? styles.notifUnread : ''}`}
                    >
                      <span className={styles.notifMsg}>{n.message}</span>
                      <span className={styles.notifTime}>
                        {fmtDate(n.createdAt)}
                      </span>
                    </div>
                  ))
                }
              </div>
            )}
          </div>

          {/* New Report button for students */}
          {!isEmployee && (
            <Button onClick={() => navigate('/dashboard/reports')}>
              + New Report
            </Button>
          )}
        </div>
      </div>

      {/* Stat Cards */}
      <div className={styles.cards}>
        {[
          { label: 'Total',     value: total,     bar: 'default'  },
          { label: 'Pending',   value: pending,   bar: 'pending'  },
          { label: 'In Progress', value: inprog,  bar: 'assigned' },
          { label: 'Completed', value: completed, bar: 'completed'},
          { label: 'Urgent',    value: urgent,    bar: 'urgent'   },
        ].map(c => (
          <div key={c.label} className={styles.card}>
            <div className={styles.cardValue}>{loading ? '—' : c.value}</div>
            <div className={styles.cardLabel}>{c.label}</div>
            <div className={`${styles.cardBar} ${styles['bar_' + c.bar]}`} />
          </div>
        ))}
      </div>

      {/* Middle row: Completion Ring + Heatmap */}
      <div className={styles.midRow}>

        {/* Completion Rate Ring */}
        <div className={styles.ringCard}>
          <div className={styles.sectionTitle}>Completion rate</div>
          <div className={styles.ringWrap}>
            <svg width="140" height="140" viewBox="0 0 140 140">
              <circle
                cx="70" cy="70" r={radius}
                fill="none"
                stroke="var(--border)"
                strokeWidth="12"
              />
              <circle
                cx="70" cy="70" r={radius}
                fill="none"
                stroke="var(--maroon)"
                strokeWidth="12"
                strokeDasharray={circ}
                strokeDashoffset={offset}
                strokeLinecap="round"
                transform="rotate(-90 70 70)"
                style={{ transition: 'stroke-dashoffset 0.8s ease' }}
              />
            </svg>
            <div className={styles.ringLabel}>
              <span className={styles.ringPct}>{completionRate}%</span>
              <span className={styles.ringSub}>resolved</span>
            </div>
          </div>
          <div className={styles.ringStats}>
            <div className={styles.ringStat}>
              <span className={styles.ringStatVal}>{completed}</span>
              <span className={styles.ringStatLbl}>Completed</span>
            </div>
            <div className={styles.ringStat}>
              <span className={styles.ringStatVal}>{total - completed}</span>
              <span className={styles.ringStatLbl}>Remaining</span>
            </div>
          </div>
        </div>

        {/* Priority Heatmap */}
        <div className={styles.heatmapCard}>
          <div className={styles.sectionTitle}>Building heatmap</div>
          <div className={styles.heatmap}>
            {BUILDINGS.map(b => {
              const count = buildingCounts[b];
              const intensity = count / maxCount;
              return (
                <div key={b} className={styles.heatCell}>
                  <div
                    className={styles.heatBlock}
                    style={{
                      background: count === 0
                        ? 'var(--surface2)'
                        : `rgba(123, 28, 28, ${0.15 + intensity * 0.85})`,
                    }}
                    title={`${b}: ${count} report${count !== 1 ? 's' : ''}`}
                  >
                    <span className={styles.heatCount}>{count}</span>
                  </div>
                  <span className={styles.heatLabel}>
                    {b.replace(' Building', '').replace('Building', '')}
                  </span>
                </div>
              );
            })}
          </div>
          <div className={styles.heatLegend}>
            <span className={styles.heatLegendText}>Low</span>
            <div className={styles.heatGradient} />
            <span className={styles.heatLegendText}>High</span>
          </div>
        </div>
      </div>

      {/* Overdue Reports */}
      {overdue.length > 0 && (
        <div className={styles.overdueCard}>
          <div className={styles.overdueHeader}>
            <span className={styles.overdueIcon}>!</span>
            <span className={styles.overdueTitle}>
              {overdue.length} overdue report{overdue.length > 1 ? 's' : ''}
            </span>
            <span className={styles.overdueSub}>
              Pending for more than 3 days
            </span>
          </div>
          <div className={styles.overdueList}>
            {overdue.map(r => (
              <div key={r.id} className={styles.overdueItem}>
                <div>
                  <div className={styles.overdueItemTitle}>{r.title}</div>
                  <div className={styles.overdueItemMeta}>
                    {r.building} · {r.location} · {daysSince(r.createdAt)} days ago
                  </div>
                </div>
                <Badge label={r.priority} variant={r.priority.toLowerCase()} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* How to Report Guide (students only) */}
      {!isEmployee && (
        <div className={styles.guideCard}>
          <button
            className={styles.guideToggle}
            onClick={() => setShowGuide(v => !v)}
          >
            <span className={styles.guideToggleText}>
              How to submit a report
            </span>
            <span className={styles.guideChevron}>
              {showGuide ? '▲' : '▼'}
            </span>
          </button>
          {showGuide && (
            <div className={styles.guideSteps}>
              {[
                { n: '1', title: 'Go to My Reports', desc: 'Click "My Reports" in the sidebar to access the reports page.' },
                { n: '2', title: 'Click New Report',  desc: 'Press the "+ New Report" button at the top right.' },
                { n: '3', title: 'Fill in the details', desc: 'Enter the title, description, building, room, category and priority.' },
                { n: '4', title: 'Submit',            desc: 'Click "Submit Report" and your report will be sent to the maintenance team.' },
                { n: '5', title: 'Track your report', desc: 'Monitor the status from Pending → Assigned → In Progress → Completed.' },
              ].map(s => (
                <div key={s.n} className={styles.guideStep}>
                  <div className={styles.guideStepNum}>{s.n}</div>
                  <div>
                    <div className={styles.guideStepTitle}>{s.title}</div>
                    <div className={styles.guideStepDesc}>{s.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Recent Reports */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Recent reports</h2>
          <button
            className={styles.seeAll}
            onClick={() => navigate('/dashboard/reports')}
          >
            See all
          </button>
        </div>
        {loading ? (
          <div className={styles.empty}>Loading...</div>
        ) : recent.length === 0 ? (
          <div className={styles.empty}>No reports yet.</div>
        ) : (
          <div className={styles.table}>
            <div className={styles.thead}>
              <span>Title</span>
              <span>Building</span>
              <span>Priority</span>
              <span>Status</span>
              <span>Date</span>
            </div>
            {recent.map(r => (
              <div key={r.id} className={styles.row}>
                <span className={styles.rowTitle}>{r.title}</span>
                <span className={styles.muted}>{r.building || r.location}</span>
                <span>
                  <Badge label={r.priority} variant={r.priority.toLowerCase()} />
                </span>
                <span>
                  <Badge label={r.status} variant={statusVariant(r.status)} />
                </span>
                <span className={styles.muted}>{fmtDate(r.createdAt)}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Feedback Modal */}
      {feedbackReport && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3 className={styles.modalTitle}>How was the repair?</h3>
            <p className={styles.modalSub}>
              "{feedbackReport.title}" has been completed.
              Rate the service below.
            </p>
            <div className={styles.stars}>
              {[1, 2, 3, 4, 5].map(s => (
                <button
                  key={s}
                  className={`${styles.star} ${rating >= s ? styles.starActive : ''}`}
                  onClick={() => setRating(s)}
                >
                  ★
                </button>
              ))}
            </div>
            <textarea
              className={styles.feedbackInput}
              placeholder="Leave a comment (optional)"
              value={feedback}
              onChange={e => setFeedback(e.target.value)}
              rows={3}
            />
            <div className={styles.modalActions}>
              <Button
                onClick={handleFeedbackSubmit}
                loading={submittingFeedback}
                disabled={!rating}
              >
                Submit Feedback
              </Button>
              <Button
                variant="secondary"
                onClick={() => setFeedbackReport(null)}
              >
                Skip
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function BellIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
      <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
    </svg>
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
  return new Date(d).toLocaleDateString('en-PH', {
    month: 'short', day: 'numeric', year: 'numeric'
  });
}
function daysSince(d) {
  return Math.floor((Date.now() - new Date(d)) / (1000 * 60 * 60 * 24));
}
function statusVariant(s) {
  return {
    PENDING: 'pending', ASSIGNED: 'assigned',
    IN_PROGRESS: 'inprogress', COMPLETED: 'completed'
  }[s] || 'default';
}