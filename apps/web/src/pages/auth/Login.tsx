import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { authApi } from '../../api/auth';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

export const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await authApi.login({ email, password });
      login(res.token, res.user);
      if (res.user.role === 'ADMIN') {
        navigate('/admin/workforce');
      } else {
        navigate('/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card style={{ width: '400px', maxWidth: '100%' }}>
      <CardHeader>
        <CardTitle>Sign In</CardTitle>
        <CardDescription>Enter your credentials to access your account</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {error && <div style={{ color: 'var(--color-error-text)', fontSize: '0.875rem' }}>{error}</div>}
          <Input 
            label="Email Address" 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
            placeholder="official@mospi.gov.in"
          />
          <Input 
            label="Password" 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
          <div className="text-right w-full mt-1 mb-2">
            <Link to="/forgot-password" style={{ fontSize: '0.875rem', color: 'var(--color-primary-600)' }}>Forgot password?</Link>
          </div>
        </CardContent>
        <CardFooter style={{ justifyContent: 'space-between' }}>
          <Link to="/register" style={{ fontSize: '0.875rem' }}>Create an account</Link>
          <Button type="submit" isLoading={isLoading}>Sign In</Button>
        </CardFooter>
      </form>
    </Card>
  );
};
