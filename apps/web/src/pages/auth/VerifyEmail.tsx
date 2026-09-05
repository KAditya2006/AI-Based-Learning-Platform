import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authApi } from '../../api/auth';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Mail, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';

export const VerifyEmail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [token, setToken] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const searchParams = new URLSearchParams(location.search);
  const email = searchParams.get('email') || 'your email';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    
    setIsLoading(true);
    setError('');
    
    try {
      await authApi.verifyEmail({ email, otp: token });
      navigate('/login', { state: { message: 'Email verified successfully! Please log in.' } });
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Invalid or expired verification token.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setIsResending(true);
    setError('');
    setSuccess('');
    try {
      await authApi.resendVerification({ email });
      setSuccess('Verification code resent successfully!');
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to resend verification code.');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-container-lowest flex flex-col items-center justify-center p-md">
      <Card className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-500">
        <CardHeader className="text-center pb-sm">
          <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-md">
            <Mail className="w-8 h-8" />
          </div>
          <CardTitle className="text-display-sm text-on-surface">Verify your email</CardTitle>
          <CardDescription className="text-body-lg text-on-surface-variant mt-sm">
            We've sent a 6-digit verification code to <strong className="text-on-surface">{email}</strong>. 
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="bg-error/10 text-error p-sm rounded-md flex items-start gap-sm mb-md text-body-sm">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}
          {success && (
            <div className="bg-success/10 text-success p-sm rounded-md flex items-start gap-sm mb-md text-body-sm">
              <ShieldCheck className="w-5 h-5 shrink-0 mt-0.5" />
              <span>{success}</span>
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-md">
            <div>
              <label htmlFor="token" className="block text-label-lg font-label-lg text-on-surface mb-xs">
                Verification Code
              </label>
              <Input
                id="token"
                type="text"
                placeholder="Enter the token"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                required
                className="w-full text-center tracking-widest font-mono"
              />
            </div>
            <Button 
              type="submit" 
              className="w-full group" 
              disabled={isLoading || !token}
            >
              <ShieldCheck className="w-5 h-5 mr-sm" />
              {isLoading ? 'Verifying...' : 'Verify Email'}
              <ArrowRight className="w-5 h-5 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col border-t border-surface-variant pt-md text-center">
          <p className="text-body-sm text-on-surface-variant mb-xs">Didn't receive the code?</p>
          <Button 
            variant="ghost" 
            className="text-primary hover:bg-primary/5" 
            onClick={handleResend}
            disabled={isResending || isLoading}
          >
            {isResending ? 'Sending...' : 'Resend Code'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
