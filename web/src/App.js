import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import LoginPage     from './pages/LoginPage';
import RegisterPage  from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import HomePage      from './pages/HomePage';
import ReportsPage   from './pages/ReportsPage';
import HistoryPage   from './pages/HistoryPage';
import OAuth2CallbackPage from './pages/OAuth2CallbackPage';
import ProfilePage   from './pages/ProfilePage';

function PrivateRoute({ children }) {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"         element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/oauth2/callback" element={<OAuth2CallbackPage />} />

        <Route
          path="/dashboard"
          element={<PrivateRoute><DashboardPage /></PrivateRoute>}
        >
          <Route index               element={<HomePage />} />
          <Route path="reports"      element={<ReportsPage />} />
          <Route path="history"      element={<HistoryPage />} />
          <Route path="profile"      element={<ProfilePage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}