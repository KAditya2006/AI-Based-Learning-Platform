import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { authApi } from '../../api/auth';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

export const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      const res = await authApi.forgotPassword({ email });
      setSuccess(res.message || 'If an account exists with this email, a reset link has been sent.');
    } catch (err: any) {
      setError(err.message || 'Failed to request password reset');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card style={{ width: '400px', maxWidth: '100%' }}>
      <CardHeader>
        <CardTitle>Forgot Password</CardTitle>
        <CardDescription>Enter your email to receive a password reset link.</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {error && <div style={{ color: 'var(--color-error-text)', fontSize: '0.875rem' }}>{error}</div>}
          {success && <div style={{ color: 'var(--color-success-600)', fontSize: '0.875rem' }}>{success}</div>}
          <Input 
            label="Email Address" 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
            placeholder="official@mospi.gov.in"
          />
        </CardContent>
        <CardFooter style={{ justifyContent: 'space-between' }}>
          <Link to="/login" style={{ fontSize: '0.875rem' }}>Back to login</Link>
          <Button type="submit" isLoading={isLoading}>Send Reset Link</Button>
        </CardFooter>
      </form>
    </Card>
  );
};
