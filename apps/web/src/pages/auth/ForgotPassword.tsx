import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { authApi } from '../../api/auth';
import { AlertCircle, ArrowLeft, ArrowRight, CheckCircle, Hourglass, Mail } from 'lucide-react';


export const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setSuccess('');
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
    <div className="bg-background h-screen flex flex-col items-center justify-center font-body-md text-on-surface antialiased p-container-margin">
      {/* Main Content Area */}
      <main className="w-full max-w-[440px] flex flex-col items-center">
        {/* Brand Header */}
        <div className="mb-xl text-center">
          <h1 className="font-headline-md text-headline-md text-primary mb-sm">Skill Intelligence Platform</h1>
          <p className="font-body-md text-body-md text-on-surface-variant">Government Workforce Division</p>
        </div>

        {/* Forgot Password Card */}
        <div className="bg-surface-container-lowest w-full border border-surface-container-highest rounded-lg p-xl shadow-[0px_1px_3px_rgba(26,22,20,0.05)]">
          {success ? (
            <div className="text-center animate-in fade-in duration-300">
              <div className="w-14 h-14 rounded-full bg-primary-fixed-dim border border-primary-fixed flex items-center justify-center mx-auto mb-md">
                <CheckCircle className="text-primary text-[26px]" />
              </div>
              <h2 className="font-headline-sm text-headline-sm text-on-surface mb-sm">Check your email</h2>
              <p className="font-body-md text-body-md text-on-surface-variant mb-lg">
                {success}
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
                <h2 className="font-headline-sm text-headline-sm text-on-surface mb-sm">Reset Password</h2>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Enter your official institutional email address below. We will send you a secure link to reset your password.
                </p>
              </div>

              {error && (
                <div className="flex items-center gap-sm p-sm bg-error-container border border-error rounded text-sm text-error mb-lg">
                  <AlertCircle className="shrink-0 text-[16px]" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate className="space-y-lg">
                {/* Email Input */}
                <div className="flex flex-col gap-sm">
                  <label htmlFor="email" className="font-label-caps text-label-caps text-on-surface-variant uppercase">Official Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-sm top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]" />
                    <input 
                      id="email" 
                      name="email" 
                      type="email" 
                      placeholder="your.name@agency.gov" 
                      required 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-xl pr-sm py-sm bg-surface-container-lowest border border-surface-container-highest rounded text-on-surface font-body-md focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-fixed focus:ring-opacity-50 transition-colors"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full bg-primary hover:bg-primary-container text-on-primary font-body-lg rounded py-sm px-md transition-colors flex items-center justify-center gap-sm active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  <span>{isLoading ? 'Sending...' : 'Send Reset Link'}</span>
                  {isLoading ? <Hourglass className="animate-spin" /> : <ArrowRight />}
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
