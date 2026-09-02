import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { authApi } from '../../api/auth';
import { AlertCircle, ArrowLeft, CheckCircle, Hourglass, Lock } from 'lucide-react';


export const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setSuccess('');
    if (password !== confirmPassword) { setError('Passwords do not match'); return; }
    if (!token) { setError('Invalid or missing reset token. Please request a new link.'); return; }
    setIsLoading(true);
    try {
      const res = await authApi.resetPassword({ token, newPassword: password });
      setSuccess(res.message || 'Password has been reset successfully.');
      setTimeout(() => navigate('/login'), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to reset password. The link may have expired.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-background h-screen flex flex-col items-center justify-center font-body-md text-on-surface antialiased p-container-margin">
      {/* Main Content Area */}
      <main className="w-full max-w-[440px] flex flex-col items-center">
        {/* Brand Header */}
        <div className="mb-xl text-center">
          <h1 className="font-headline-md text-headline-md text-primary mb-sm">Skill Intelligence Platform</h1>
          <p className="font-body-md text-body-md text-on-surface-variant">Government Workforce Division</p>
        </div>

        {/* Reset Password Card */}
        <div className="bg-surface-container-lowest w-full border border-surface-container-highest rounded-lg p-xl shadow-[0px_1px_3px_rgba(26,22,20,0.05)]">
          {success ? (
            <div className="text-center animate-in fade-in duration-300">
              <div className="w-14 h-14 rounded-full bg-primary-fixed-dim border border-primary-fixed flex items-center justify-center mx-auto mb-md">
                <CheckCircle className="text-primary text-[26px]" />
              </div>
              <h2 className="font-headline-sm text-headline-sm text-on-surface mb-sm">Password Reset!</h2>
              <p className="font-body-md text-body-md text-on-surface-variant mb-sm">
                {success}
              </p>
              <p className="font-caption text-caption text-on-surface-variant mb-lg">
                Redirecting you to sign in...
              </p>
              <div className="border-t border-surface-container-highest pt-md mt-lg">
                <Link to="/login" className="inline-flex items-center gap-xs font-body-md text-body-md text-primary hover:text-primary-container transition-colors group">
                  <ArrowLeft className="text-[16px] group-hover:-translate-x-1 transition-transform" />
                  <span>Back to Login</span>
                </Link>
              </div>
            </div>
          ) : (
            <div className="animate-in fade-in duration-300">
              <div className="mb-lg">
                <h2 className="font-headline-sm text-headline-sm text-on-surface mb-sm">Set New Password</h2>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Create a new strong password for your official account.
                </p>
              </div>

              {error && (
                <div className="flex items-center gap-sm p-sm bg-error-container border border-error rounded text-sm text-error mb-lg">
                  <AlertCircle className="shrink-0 text-[16px]" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate className="space-y-md">
                <div className="flex flex-col gap-sm">
                  <label htmlFor="password" className="font-label-caps text-label-caps text-on-surface-variant uppercase">New Password</label>
                  <div className="relative">
                    <Lock className="absolute left-sm top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]" />
                    <input 
                      id="password" 
                      type="password" 
                      placeholder="Min. 8 characters" 
                      required 
                      minLength={8}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-xl pr-sm py-sm bg-surface-container-lowest border border-surface-container-highest rounded text-on-surface font-body-md focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-fixed focus:ring-opacity-50 transition-colors"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-sm">
                  <label htmlFor="confirmPassword" className="font-label-caps text-label-caps text-on-surface-variant uppercase">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-sm top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]" />
                    <input 
                      id="confirmPassword" 
                      type="password" 
                      placeholder="Repeat password" 
                      required 
                      minLength={8}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full pl-xl pr-sm py-sm bg-surface-container-lowest border border-surface-container-highest rounded text-on-surface font-body-md focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-fixed focus:ring-opacity-50 transition-colors"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full mt-lg bg-primary hover:bg-primary-container text-on-primary font-body-lg rounded py-sm px-md transition-colors flex items-center justify-center gap-sm active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  <span>{isLoading ? 'Resetting...' : 'Reset Password'}</span>
                  {isLoading ? <Hourglass className="animate-spin" /> : <CheckCircle />}
                </button>
              </form>

              {/* Back to Login Link */}
              <div className="mt-lg text-center pt-md border-t border-surface-container-highest">
                <Link to="/login" className="inline-flex items-center gap-xs font-body-md text-body-md text-primary hover:text-primary-container transition-colors group">
                  <ArrowLeft className="text-[16px] group-hover:-translate-x-1 transition-transform" />
                  <span>Back to Login</span>
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="mt-xl w-full text-center py-lg px-md">
          <p className="font-caption text-caption text-on-surface-variant mb-sm">
            © 2024 Skill Intelligence Platform. All rights reserved. Government Workforce Division.
          </p>
          <div className="flex justify-center flex-wrap gap-md">
            <a href="#" className="font-caption text-caption text-on-surface-variant hover:text-primary transition-colors duration-200">Privacy Policy</a>
            <a href="#" className="font-caption text-caption text-on-surface-variant hover:text-primary transition-colors duration-200">Terms of Service</a>
            <a href="#" className="font-caption text-caption text-on-surface-variant hover:text-primary transition-colors duration-200">Security Compliance</a>
          </div>
        </footer>
      </main>
    </div>
  );
};
