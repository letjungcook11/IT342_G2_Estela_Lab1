import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { login } from '../services/api';
import styles from './LoginPage.module.css';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const pre = params.get('email');
    if (pre) setEmail(pre);
  }, [location.search]);

  const handleLogin = async () => {
    if (!email || !password) { setError('Please fill in all fields.'); return; }
    setError('');
    setLoading(true);
    try {
      const res = await login(email, password);
      localStorage.setItem('token', res.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(
        err.response?.status === 401
          ? 'Invalid email or password.'
          : 'Something went wrong. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => { if (e.key === 'Enter') handleLogin(); };

  return (
    <div className={styles.page}>
      {/* Left decorative panel */}
      <div className={styles.panel}>
        <div className={styles.panelPattern} />
        <div className={styles.panelAccent} />
        <div className={styles.panelLogo}>N</div>
        <div className={styles.panelDivider} />
        <h2 className={styles.panelTitle}>Cebu Institute of Technology</h2>
        <p className={styles.panelSub}>University Student Portal</p>
      </div>

      {/* Right form */}
      <div className={styles.formArea}>
        <div className={styles.card}>
          <div className={styles.heading}>
            <span className={styles.eyebrow}>Student Portal</span>
            <h1 className={styles.title}>Welcome Back</h1>
            <p className={styles.sub}>Sign in with your credentials to continue</p>
          </div>

          {error && <div className={styles.errorBanner}>{error}</div>}

          <div className={styles.fields}>
            <Input
              label="Email Address"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={handleKeyDown}
              icon="✉"
            />
            <Input
              label="Password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={handleKeyDown}
              icon="🔒"
            />
          </div>

          <Button onClick={handleLogin} loading={loading}>
            Sign In
          </Button>

          <p className={styles.footer}>
            Don't have an account?{' '}
            <Link to="/register" className={styles.footerLink}>Register here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}