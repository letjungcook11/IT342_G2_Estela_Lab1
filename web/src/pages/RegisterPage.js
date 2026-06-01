import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../services/api';
import styles from './LoginPage.module.css';
import rStyles from './RegisterPage.module.css';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm]       = useState({ username:'', email:'', password:'', confirm:'', role:'STUDENT' });
  const [errors, setErrors]   = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);

  const set = f => e => setForm(p => ({ ...p, [f]: e.target.value }));

  const validate = () => {
    const e = {};
    if (!form.username.trim())             e.username = 'Required.';
    if (!/\S+@\S+\.\S+/.test(form.email)) e.email    = 'Valid email required.';
    if (form.password.length < 6)         e.password = 'Min 6 characters.';
    if (form.password !== form.confirm)   e.confirm  = 'Passwords do not match.';
    return e;
  };

  const handle = async () => {
    const e = validate(); setErrors(e);
    if (Object.keys(e).length) return;
    setApiError(''); setLoading(true);
    try {
      await register(form.username, form.email, form.password, form.role);
      navigate(`/?email=${encodeURIComponent(form.email)}`);
    } catch (err) {
      setApiError(err.response?.data || 'Registration failed.');
    } finally { setLoading(false); }
  };

  return (
    <div className={styles.page}>
      <div className={styles.left}>
        <div className={styles.leftInner}>
          <div className={styles.logoMark}>T</div>
          <h1 className={styles.brand}>TeknoyFix</h1>
          <p className={styles.tagline}>Join the campus maintenance network.</p>
          <div className={styles.features}>
            {['Submit reports with photos',
              'Get notified on repairs',
              'View campus fix history'].map(f => (
              <div key={f} className={styles.feature}>
                <span className={styles.featureDot} /><span>{f}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.right}>
        <div className={styles.card}>
          <div className={styles.heading}>
            <h2 className={styles.title}>Create account</h2>
            <p className={styles.sub}>It's free and takes a minute</p>
          </div>

          {apiError && <div className={styles.errorBanner}>{apiError}</div>}

          <div className={styles.fields}>
            {[
              { label:'Username',         field:'username', type:'text',     ph:'johndoe' },
              { label:'Email address',    field:'email',    type:'email',    ph:'you@cit.edu' },
              { label:'Password',         field:'password', type:'password', ph:'Min. 6 characters' },
              { label:'Confirm password', field:'confirm',  type:'password', ph:'Repeat password' },
            ].map(({ label, field, type, ph }) => (
              <div key={field} className={styles.field}>
                <label className={styles.label}>{label}</label>
                <input
                  className={`${styles.input} ${errors[field] ? rStyles.inputError : ''}`}
                  type={type}
                  placeholder={ph}
                  value={form[field]}
                  onChange={set(field)}
                />
                {errors[field] && <span className={rStyles.err}>{errors[field]}</span>}
              </div>
            ))}

            <div className={styles.field}>
              <label className={styles.label}>I am a</label>
              <select
                className={styles.input}
                value={form.role}
                onChange={set('role')}
              >
                <option value="STUDENT">Student</option>
                <option value="EMPLOYEE">Employee / Staff</option>
              </select>
            </div>
          </div>

          <button className={styles.btn} onClick={handle} disabled={loading}>
            {loading ? <span className={styles.spinner} /> : 'Create Account'}
          </button>

          <p className={styles.footer}>
            Already have an account?{' '}
            <Link to="/" className={styles.footerLink}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}