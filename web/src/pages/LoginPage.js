import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { login } from '../services/api';
import styles from './LoginPage.module.css';

export default function LoginPage() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const pre    = params.get('email');
    if (pre) setEmail(pre);
  }, [location.search]);
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

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
      {/* Background orbs */}
      <div className={styles.orb1} />
      <div className={styles.orb2} />

      <div className={styles.card}>
        <div className={styles.brand}>
          <span className={styles.brandMark}>⬡</span>
          <span className={styles.brandName}>Nexus</span>
        </div>

        <div className={styles.heading}>
          <h1 className={styles.title}>Welcome back</h1>
          <p className={styles.sub}>Sign in to continue</p>
        </div>

        {error && <div className={styles.errorBanner}>{error}</div>}

        <div className={styles.fields}>
          <Input
            label="Email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            onKeyDown={handleKeyDown}
            icon="✉"
          />
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
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
          <Link to="/register" className={styles.footerLink}>Create one</Link>
        </p>
      </div>
    </div>
  );
}