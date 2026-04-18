import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function OAuth2CallbackPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const params  = new URLSearchParams(window.location.search);
    const token   = params.get('token');
    const role    = params.get('role');

    if (token) {
      localStorage.setItem('token', token);
      localStorage.setItem('role', role || 'STUDENT');
      navigate('/dashboard', { replace: true });
    } else {
      navigate('/?error=oauth_failed', { replace: true });
    }
  }, [navigate]);

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      fontFamily: 'sans-serif',
      color: '#555'
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{
          width: 36, height: 36,
          border: '3px solid #e5e5e7',
          borderTopColor: '#7B1C1C',
          borderRadius: '50%',
          animation: 'spin 0.7s linear infinite',
          margin: '0 auto 16px'
        }} />
        <p>Signing you in...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  );
}