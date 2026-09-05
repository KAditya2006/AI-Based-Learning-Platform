import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { authApi } from '../../api/auth';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { AlertCircle, Badge, Hourglass, Key, Landmark, LogIn, Shield } from 'lucide-react';


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
      navigate(res.user.role === 'ADMIN' ? '/admin/dashboard' : '/dashboard');
    } catch (err: any) {
      setError(err.message || 'Invalid credentials. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-background text-on-background font-body-md min-h-screen flex flex-col justify-center items-center p-md antialiased">
      <main className="w-full max-w-md">
        {/* Brand / Header */}
        <div className="text-center mb-xl">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-container text-on-primary-container mb-md">
            <Landmark className="text-4xl" />
          </div>
          <h1 className="font-display-lg text-display-lg text-primary">Learning Mate</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant mt-sm">Official Governance Portal</p>
        </div>

        {/* Login Card */}
        <div className="bg-surface-container-lowest border border-surface-variant rounded-lg p-xl shadow-[0px_1px_3px_rgba(26,22,20,0.05)]">
          {/* Security Badge */}
          <div className="flex items-center justify-center gap-sm bg-surface-container-high border border-surface-variant rounded px-md py-sm mb-lg">
            <Shield className="text-on-surface-variant text-lg font-variation-settings:" />
            <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">Secure Government System</span>
          </div>
          
          <form onSubmit={handleSubmit} noValidate className="space-y-lg animate-in fade-in duration-300">
            {error && (
              <div className="flex items-center gap-sm p-sm bg-error-container border border-error rounded text-sm text-error">
                <AlertCircle className="shrink-0 text-[16px]" />
                <span>{error}</span>
              </div>
            )}

            <div className="flex flex-col gap-md">
              <div>
                <label htmlFor="official_id" className="block font-label-caps text-label-caps text-on-surface mb-xs uppercase">Official ID / Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Badge className="text-on-surface-variant text-[20px]" />
                  </div>
                  <input 
                    id="official_id" 
                    name="official_id" 
                    type="text" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="gov.ID or official email" 
                    required 
                    className="block w-full pl-10 pr-3 py-2 border border-surface-variant rounded bg-surface-container-lowest text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-fixed sm:text-sm transition-colors"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block font-label-caps text-label-caps text-on-surface mb-xs uppercase">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Key className="text-on-surface-variant text-[20px]" />
                  </div>
                  <input 
                    id="password" 
                    name="password" 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••" 
                    required 
                    className="block w-full pl-10 pr-3 py-2 border border-surface-variant rounded bg-surface-container-lowest text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-fixed sm:text-sm transition-colors"
                  />
                </div>
                <div className="flex justify-end mt-sm">
                  <Link to="/forgot-password" className="font-caption text-caption text-primary hover:underline focus:outline-none">Forgot password?</Link>
                </div>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded bg-primary text-on-primary font-label-caps text-label-caps uppercase hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors active:scale-95 duration-150 disabled:opacity-70 disabled:cursor-not-allowed mt-lg"
            >
              {isLoading ? <Hourglass className="mr-sm text-lg animate-spin" /> : <LogIn className="mr-sm text-lg" />}
              {isLoading ? 'Authenticating...' : 'Authenticate'}
            </button>
          </form>
        </div>

        {/* Footer Links */}
        <footer className="mt-xl text-center flex flex-col items-center space-y-md">
          <div className="flex gap-md font-caption text-caption text-on-surface-variant">
            <Link to="/register" className="hover:text-primary transition-colors font-semibold">Register New Official</Link>
            <span>•</span>
            <Link to="#" className="hover:text-primary transition-colors">Privacy Policy</Link>
            <span>•</span>
            <Link to="#" className="hover:text-primary transition-colors">Terms of Service</Link>
            <span>•</span>
            <Link to="#" className="hover:text-primary transition-colors">Help Center</Link>
          </div>
          <p className="font-caption text-caption text-outline">
            Unauthorized access is strictly prohibited.
          </p>
        </footer>
      </main>
    </div>
  );
};

