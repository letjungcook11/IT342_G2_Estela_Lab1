import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { login } from '../services/api';
import styles from './LoginPage.module.css';

export default function LoginPage() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const pre = params.get('email');
    if (pre) setEmail(pre);
  }, [location.search]);

  const handle = async () => {
    if (!email || !password) { setError('Please fill in all fields.'); return; }
    setError(''); setLoading(true);
    try {
      const res = await login(email, password);
      localStorage.setItem('token', res.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.status === 401
        ? 'Invalid email or password.'
        : 'Something went wrong. Try again.');
    } finally { setLoading(false); }
  };

  const onKey = (e) => { if (e.key === 'Enter') handle(); };

  return (
    <div className={styles.page}>
      <div className={styles.left}>
        <div className={styles.leftInner}>
          <div className={styles.logoMark}>T</div>
          <h1 className={styles.brand}>TeknoyFix</h1>
          <p className={styles.tagline}>Campus maintenance, simplified.</p>
          <div className={styles.features}>
            {['Report broken items instantly',
              'Track repair status in real-time',
              'Full fix history for the campus'].map(f => (
              <div key={f} className={styles.feature}>
                <span className={styles.featureDot} />
                <span>{f}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.right}>
        <div className={styles.card}>
          <div className={styles.heading}>
            <h2 className={styles.title}>Welcome back</h2>
            <p className={styles.sub}>Sign in to your account</p>
          </div>

          {error && <div className={styles.errorBanner}>{error}</div>}

          <div className={styles.fields}>
            <div className={styles.field}>
              <label className={styles.label}>Email address</label>
              <input
                className={styles.input}
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onKeyDown={onKey}
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Password</label>
              <input
                className={styles.input}
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                onKeyDown={onKey}
              />
            </div>
          </div>

          <button className={styles.btn} onClick={handle} disabled={loading}>
            {loading ? <span className={styles.spinner} /> : 'Sign In'}
          </button>

          <p className={styles.footer}>
            Don't have an account?{' '}
            <Link to="/register" className={styles.footerLink}>Register here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}