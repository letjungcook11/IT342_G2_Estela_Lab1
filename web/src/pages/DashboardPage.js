import { Outlet } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import styles from './DashboardPage.module.css';

export default function DashboardPage() {
  return (
    <div className={styles.layout}>
      <Sidebar />
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}