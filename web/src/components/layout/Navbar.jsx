import { NavLink } from 'react-router-dom';
import styles from './Navbar.module.css';

export default function Navbar() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <NavLink to="/dashboard" className={styles.logo}>
          <span className={styles.logoMark}>⬡</span>
          <span>Nexus</span>
        </NavLink>

        <nav className={styles.nav}>
          <NavLink
            to="/dashboard"
            end
            className={({ isActive }) =>
              `${styles.link} ${isActive ? styles.active : ''}`
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/dashboard/services"
            className={({ isActive }) =>
              `${styles.link} ${isActive ? styles.active : ''}`
            }
          >
            Services
          </NavLink>
          <NavLink
            to="/dashboard/profile"
            className={({ isActive }) =>
              `${styles.link} ${isActive ? styles.active : ''}`
            }
          >
            Profile
          </NavLink>
        </nav>
      </div>
    </header>
  );
}