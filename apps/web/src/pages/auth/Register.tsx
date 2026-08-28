import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { authApi } from '../../api/auth';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

export const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await authApi.register({ email, password, firstName, lastName, role: 'LEARNER' });
      login(res.token, res.user);
      navigate('/onboarding/profile'); // Force onboarding flow for new users
    } catch (err: any) {
      setError(err.message || 'Failed to register');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card style={{ width: '400px', maxWidth: '100%' }}>
      <CardHeader>
        <CardTitle>Create Account</CardTitle>
        <CardDescription>Register for MoSPI Skill Intelligence</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {error && <div style={{ color: 'var(--color-error-text)', fontSize: '0.875rem' }}>{error}</div>}
          <div className="flex gap-4">
            <Input 
              label="First Name" 
              value={firstName} 
              onChange={(e) => setFirstName(e.target.value)} 
              required 
            />
            <Input 
              label="Last Name" 
              value={lastName} 
              onChange={(e) => setLastName(e.target.value)} 
              required 
            />
          </div>
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
            minLength={8}
          />
        </CardContent>
        <CardFooter style={{ justifyContent: 'space-between' }}>
          <Link to="/login" style={{ fontSize: '0.875rem' }}>Already have an account?</Link>
          <Button type="submit" isLoading={isLoading}>Register</Button>
        </CardFooter>
      </form>
    </Card>
  );
};
