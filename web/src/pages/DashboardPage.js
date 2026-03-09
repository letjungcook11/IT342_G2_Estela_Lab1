import Navbar from '../components/layout/Navbar';
import { Outlet } from 'react-router-dom';
import styles from './DashboardPage.module.css';

export default function DashboardPage() {
  return (
    <div className={styles.layout}>
      <Navbar />
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}