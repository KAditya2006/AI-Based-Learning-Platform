import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { authApi } from '../../api/auth';
import { Button } from '../../components/ui/Button';

export const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      return;
    }

    const verify = async () => {
      try {
        await authApi.verifyEmail({ token });
        setStatus('success');
      } catch (err) {
        setStatus('error');
      }
    };
    verify();
  }, [token]);

  return (
    <div className="auth-container" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--background)' }}>
      <div className="auth-card" style={{ padding: '2rem', background: 'var(--surface)', borderRadius: '12px', boxShadow: 'var(--shadow-lg)', maxWidth: '400px', width: '100%', textAlign: 'center' }}>
        {status === 'loading' && (
          <div>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>Verifying Email...</h2>
            <p style={{ color: 'var(--text-secondary)' }}>Please wait while we verify your email address.</p>
          </div>
        )}
        
        {status === 'success' && (
          <div>
            <div style={{ color: 'var(--success)', fontSize: '3rem', marginBottom: '1rem' }}>✓</div>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>Email Verified</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Your email address has been successfully verified.</p>
            <Button onClick={() => navigate('/login')} variant="primary" style={{ width: '100%' }}>Continue to Login</Button>
          </div>
        )}

        {status === 'error' && (
          <div>
            <div style={{ color: 'var(--error)', fontSize: '3rem', marginBottom: '1rem' }}>⚠</div>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>Verification Failed</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>The verification link is invalid or has expired.</p>
            <Button onClick={() => navigate('/login')} variant="secondary" style={{ width: '100%' }}>Return to Login</Button>
          </div>
        )}
      </div>
    </div>
  );
};
