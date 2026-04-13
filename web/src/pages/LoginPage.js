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
    const err = params.get('error');
    if (err === 'oauth_failed') setError('Google sign-in failed. Please try again.');
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

          {/* Divider */}
          <div className={styles.divider}>
            <span className={styles.dividerLine} />
            <span className={styles.dividerText}>or</span>
            <span className={styles.dividerLine} />
          </div>

          {/* Google Sign In */}

            href="http://localhost:8080/oauth2/authorization/google"
            className={styles.googleBtn}
          >
            <svg width="18" height="18" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
              <path fill="none" d="M0 0h48v48H0z"/>
            </svg>
            Continue with Google
          </a>

          <p className={styles.footer}>
            Don't have an account?{' '}
            <Link to="/register" className={styles.footerLink}>Register here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}