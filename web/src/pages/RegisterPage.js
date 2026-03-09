import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../services/authService';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import styles from './RegisterPage.module.css';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm]     = useState({ username: '', email: '', password: '', confirm: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }));

  const validate = () => {
    const e = {};
    if (!form.username.trim())            e.username = 'Username is required.';
    if (!/\S+@\S+\.\S+/.test(form.email)) e.email    = 'Enter a valid email.';
    if (form.password.length < 6)         e.password = 'At least 6 characters.';
    if (form.password !== form.confirm)   e.confirm  = 'Passwords do not match.';
    return e;
  };

  const handleRegister = async () => {
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;
    setApiError('');
    setLoading(true);
    try {
      await register(form.username, form.email, form.password);
      // Pre-fill login page via query params
      navigate(`/?email=${encodeURIComponent(form.email)}`);
    } catch (err) {
      setApiError(err.response?.data || 'Registration failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.orb1} />
      <div className={styles.orb2} />

      <div className={styles.card}>
        <div className={styles.brand}>
          <span className={styles.brandMark}>⬡</span>
          <span className={styles.brandName}>Nexus</span>
        </div>

        <div className={styles.heading}>
          <h1 className={styles.title}>Create account</h1>
          <p className={styles.sub}>Join us today, it's free</p>
        </div>

        {apiError && <div className={styles.errorBanner}>{apiError}</div>}

        <div className={styles.fields}>
          <Input
            label="Username"
            placeholder="johndoe"
            value={form.username}
            onChange={set('username')}
            error={errors.username}
            icon="👤"
          />
          <Input
            label="Email"
            type="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={set('email')}
            error={errors.email}
            icon="✉"
          />
          <Input
            label="Password"
            type="password"
            placeholder="Min. 6 characters"
            value={form.password}
            onChange={set('password')}
            error={errors.password}
            icon="🔒"
          />
          <Input
            label="Confirm Password"
            type="password"
            placeholder="Repeat password"
            value={form.confirm}
            onChange={set('confirm')}
            error={errors.confirm}
            icon="🔒"
          />
        </div>

        <Button onClick={handleRegister} loading={loading}>
          Create Account
        </Button>

        <p className={styles.footer}>
          Already have an account?{' '}
          <Link to="/" className={styles.footerLink}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}