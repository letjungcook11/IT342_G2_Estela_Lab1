import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import {
  getReports, createReport, updateStatus,
  assignReport, getCategories, getUsers
} from '../services/api';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import styles from './ReportsPage.module.css';

export default function ReportsPage() {
  const { user } = useAuth();
  const isEmployee = user?.role === 'EMPLOYEE';

  const [reports, setReports]     = useState([]);
  const [categories, setCategories] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [showForm, setShowForm]   = useState(false);
  const [selected, setSelected]   = useState(null);
  const [form, setForm] = useState({
    title:'', description:'', location:'', priority:'LOW', categoryId:''
  });
  const [submitting, setSubmitting] = useState(false);
  const [filterStatus, setFilterStatus] = useState('ALL');

  const load = () => {
    setLoading(true);
    Promise.all([
      getReports(),
      getCategories(),
      isEmployee ? getUsers() : Promise.resolve({ data: [] })
    ]).then(([r, c, u]) => {
      setReports(r.data);
      setCategories(c.data);
      setEmployees(u.data.filter(u => u.role === 'EMPLOYEE'));
    }).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const set = f => e => setForm(p => ({ ...p, [f]: e.target.value }));

  const submit = async () => {
    if (!form.title || !form.description || !form.location || !form.categoryId) return;
    setSubmitting(true);
    try {
      await createReport({ ...form, categoryId: Number(form.categoryId) });
      setShowForm(false);
      setForm({ title:'', description:'', location:'', priority:'LOW', categoryId:'' });
      load();
    } finally { setSubmitting(false); }
  };

  const handleStatusUpdate = async (id, status) => {
    await updateStatus(id, { status });
    load();
  };

  const handleAssign = async (reportId, employeeId) => {
    await assignReport(reportId, { employeeId: Number(employeeId) });
    load();
  };

  const filtered = filterStatus === 'ALL'
    ? reports
    : reports.filter(r => r.status === filterStatus);

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>{isEmployee ? 'All Reports' : 'My Reports'}</h1>
          <p className={styles.sub}>
            {isEmployee ? 'Manage and resolve campus maintenance reports.'
                        : 'Submit and track your maintenance reports.'}
          </p>
        </div>
        {!isEmployee && (
          <Button onClick={() => setShowForm(v => !v)}>
            {showForm ? 'Cancel' : '+ New Report'}
          </Button>
        )}
      </div>

      {/* New report form */}
      {showForm && (
        <div className={styles.formCard}>
          <h3 className={styles.formTitle}>Submit a Report</h3>
          <div className={styles.formGrid}>
            <div className={styles.field}>
              <label className={styles.label}>Title</label>
              <input className={styles.input} placeholder="e.g. Broken ceiling fan" value={form.title} onChange={set('title')} />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Location</label>
              <input className={styles.input} placeholder="e.g. Room 301, Building A" value={form.location} onChange={set('location')} />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Category</label>
              <select className={styles.input} value={form.categoryId} onChange={set('categoryId')}>
                <option value="">Select category</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Priority</label>
              <select className={styles.input} value={form.priority} onChange={set('priority')}>
                {['LOW','MEDIUM','HIGH','URGENT'].map(p => <option key={p}>{p}</option>)}
              </select>
            </div>
            <div className={`${styles.field} ${styles.span2}`}>
              <label className={styles.label}>Description</label>
              <textarea className={styles.textarea} rows={3} placeholder="Describe the issue in detail..." value={form.description} onChange={set('description')} />
            </div>
          </div>
          <div className={styles.formActions}>
            <Button onClick={submit} loading={submitting}>Submit Report</Button>
            <Button variant="secondary" onClick={() => setShowForm(false)}>Cancel</Button>
          </div>
        </div>
      )}

      {/* Filter tabs */}
      <div className={styles.filters}>
        {['ALL','PENDING','ASSIGNED','IN_PROGRESS','COMPLETED'].map(s => (
          <button
            key={s}
            className={`${styles.filter} ${filterStatus === s ? styles.filterActive : ''}`}
            onClick={() => setFilterStatus(s)}
          >
            {s === 'ALL' ? 'All' : s.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Reports list */}
      {loading ? (
        <div className={styles.empty}>Loading...</div>
      ) : filtered.length === 0 ? (
        <div className={styles.empty}>No reports found.</div>
      ) : (
        <div className={styles.list}>
          {filtered.map(r => (
            <div key={r.id} className={styles.reportCard}>
              <div className={styles.reportTop}>
                <div>
                  <div className={styles.reportTitle}>{r.title}</div>
                  <div className={styles.reportMeta}>
                    {r.location} · {r.category?.name} · {fmtDate(r.createdAt)}
                    {isEmployee && r.reporter && ` · by ${r.reporter.username}`}
                  </div>
                </div>
                <div className={styles.badges}>
                  <Badge label={r.priority} variant={r.priority.toLowerCase()} />
                  <Badge label={r.status}   variant={statusVariant(r.status)} />
                </div>
              </div>
              <p className={styles.reportDesc}>{r.description}</p>

              {/* Employee actions */}
              {isEmployee && (
                <div className={styles.actions}>
                  {r.status === 'PENDING' && (
                    <>
                      <select
                        className={styles.assignSelect}
                        defaultValue=""
                        onChange={e => e.target.value && handleAssign(r.id, e.target.value)}
                      >
                        <option value="">Assign to employee...</option>
                        {employees.map(e => (
                          <option key={e.id} value={e.id}>{e.username}</option>
                        ))}
                      </select>
                      <Button size="sm" onClick={() => handleStatusUpdate(r.id, 'IN_PROGRESS')}>
                        Start Progress
                      </Button>
                    </>
                  )}
                  {(r.status === 'ASSIGNED' || r.status === 'IN_PROGRESS') && (
                    <Button size="sm" onClick={() => handleStatusUpdate(r.id, 'COMPLETED')}>
                      Mark Completed
                    </Button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function fmtDate(d) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-PH', { month:'short', day:'numeric', year:'numeric' });
}
function statusVariant(s) {
  return { PENDING:'pending', ASSIGNED:'assigned', IN_PROGRESS:'inprogress', COMPLETED:'completed' }[s] || 'default';
}