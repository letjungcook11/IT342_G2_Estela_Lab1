import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import styles from './Sidebar.module.css';

const studentNav = [
  { to: '/dashboard',         label: 'Dashboard',  icon: HomeIcon    },
  { to: '/dashboard/reports', label: 'My Reports',  icon: ReportIcon  },
  { to: '/dashboard/history', label: 'History',    icon: HistoryIcon  },
  { to: '/dashboard/profile', label: 'Profile',    icon: ProfileIcon  },
];

const employeeNav = [
  { to: '/dashboard',         label: 'Dashboard',  icon: HomeIcon    },
  { to: '/dashboard/reports', label: 'All Reports', icon: ReportIcon  },
  { to: '/dashboard/history', label: 'History',    icon: HistoryIcon  },
  { to: '/dashboard/profile', label: 'Profile',    icon: ProfileIcon  },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const nav = user?.role === 'EMPLOYEE' ? employeeNav : studentNav;
  const initial = user?.username?.[0]?.toUpperCase() || '?';

  return (
    <aside className={styles.sidebar}>
      {/* Logo */}
      <div className={styles.logo}>
        <div className={styles.logoMark}>T</div>
        <div>
          <div className={styles.logoName}>TeknoyFix</div>
          <div className={styles.logoSub}>CIT-U Campus</div>
        </div>
      </div>

      {/* Nav */}
      <nav className={styles.nav}>
        {nav.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/dashboard'}
            className={({ isActive }) =>
              `${styles.link} ${isActive ? styles.active : ''}`
            }
          >
            <Icon />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* User footer */}
      <div className={styles.footer}>
        <div className={styles.avatar}>{initial}</div>
        <div className={styles.userInfo}>
          <div className={styles.userName}>{user?.username || 'User'}</div>
          <div className={styles.userRole}>{user?.role || 'STUDENT'}</div>
        </div>
        <button className={styles.logoutBtn} onClick={logout} title="Sign out">
          <LogoutIcon />
        </button>
      </div>
    </aside>
  );
}

function HomeIcon()    { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>; }
function ReportIcon()  { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>; }
function HistoryIcon() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="12 8 12 12 14 14"/><path d="M3.05 11a9 9 0 1 0 .5-4"/><polyline points="3 3 3 7 7 7"/></svg>; }
function ProfileIcon() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>; }
function LogoutIcon()  { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>; }