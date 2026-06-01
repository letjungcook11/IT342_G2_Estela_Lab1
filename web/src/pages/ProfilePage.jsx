import { useState, useRef } from 'react';
import { useAuth } from '../hooks/useAuth';
import { updateProfile, uploadAvatar } from '../services/api';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import styles from './ProfilePage.module.css';

export default function ProfilePage() {
  const { user, loading, refresh } = useAuth();
  const [editing, setEditing]   = useState(false);
  const [saving, setSaving]     = useState(false);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({});
  const fileRef = useRef();

  const startEdit = () => {
    setForm({
      username:   user?.username   || '',
      fullName:   user?.fullName   || '',
      department: user?.department || '',
      phone:      user?.phone      || '',
    });
    setEditing(true);
  };

  const save = async () => {
    setSaving(true);
    try {
      await updateProfile(form);
      await refresh();
      setEditing(false);
    } finally { setSaving(false); }
  };

  const handleAvatar = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      await uploadAvatar(file);
      await refresh();
    } finally { setUploading(false); }
  };

  const set = f => e => setForm(p => ({ ...p, [f]: e.target.value }));

  if (loading) return <div className={styles.center}><div className={styles.spinner} /></div>;

  const initial = user?.username?.[0]?.toUpperCase() || '?';

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Profile</h1>
        <p className={styles.sub}>Manage your account information.</p>
      </div>

      <div className={styles.body}>
        {/* Avatar card */}
        <div className={styles.avatarCard}>
          <div className={styles.avatarWrap}>
            {user?.profilePictureUrl
              ? <img src={user.profilePictureUrl} className={styles.avatarImg} alt="avatar" />
              : <div className={styles.avatarInitial}>{initial}</div>}
            <button
              className={styles.avatarEdit}
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              title="Change photo"
            >
              {uploading ? '...' : '✎'}
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              style={{ display:'none' }}
              onChange={handleAvatar}
            />
          </div>
          <div className={styles.avatarName}>{user?.username}</div>
          <div className={styles.avatarEmail}>{user?.email}</div>
          <Badge
            label={user?.role || 'STUDENT'}
            variant={user?.role?.toLowerCase() || 'student'}
          />
        </div>

        {/* Info card */}
        <div className={styles.infoCard}>
          <div className={styles.infoHeader}>
            <h2 className={styles.infoTitle}>Account details</h2>
            {!editing
              ? <Button size="sm" variant="secondary" onClick={startEdit}>Edit Profile</Button>
              : <div className={styles.editActions}>
                  <Button size="sm" onClick={save} loading={saving}>Save</Button>
                  <Button size="sm" variant="secondary" onClick={() => setEditing(false)}>Cancel</Button>
                </div>}
          </div>

          <div className={styles.fields}>
            {[
              { label:'Username',   field:'username',   value: user?.username },
              { label:'Full Name',  field:'fullName',   value: user?.fullName },
              { label:'Department', field:'department', value: user?.department },
              { label:'Phone',      field:'phone',      value: user?.phone },
            ].map(({ label, field, value }) => (
              <div key={field} className={styles.fieldRow}>
                <span className={styles.fieldLabel}>{label}</span>
                {editing
                  ? <input
                      className={styles.fieldInput}
                      value={form[field] || ''}
                      onChange={set(field)}
                      placeholder={`Enter ${label.toLowerCase()}`}
                    />
                  : <span className={styles.fieldValue}>{value || <span className={styles.empty}>—</span>}</span>}
              </div>
            ))}
            <div className={styles.fieldRow}>
              <span className={styles.fieldLabel}>Email</span>
              <span className={styles.fieldValue}>{user?.email}</span>
            </div>
            <div className={styles.fieldRow}>
              <span className={styles.fieldLabel}>Role</span>
              <Badge label={user?.role} variant={user?.role?.toLowerCase()} />
            </div>
            <div className={styles.fieldRow}>
              <span className={styles.fieldLabel}>Member since</span>
              <span className={styles.fieldValue}>{fmtDate(user?.createdAt)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function fmtDate(d) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-PH', { month:'long', day:'numeric', year:'numeric' });
}