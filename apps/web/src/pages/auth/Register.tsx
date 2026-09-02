import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { authApi } from '../../api/auth';
import { AlertCircle, ArrowRight, ChevronDown, HelpCircle, Hourglass, Landmark, LineChart, Shield, ShieldCheck } from 'lucide-react';


export const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [agency, setAgency] = useState('');
  const [terms, setTerms] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!terms) {
      setError('You must agree to the Terms of Service and Privacy Policy.');
      return;
    }
    setError('');
    setIsLoading(true);
    try {
      const res = await authApi.register({ email, password, firstName, lastName, role: 'LEARNER' });
      login(res.token, res.user);
      navigate('/onboarding/profile');
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-background text-on-surface min-h-screen flex flex-col antialiased">
      <main className="flex-grow flex items-center justify-center p-container-margin md:p-xl">
        <div className="w-full max-w-[1200px] flex flex-col md:flex-row bg-surface rounded-xl border border-surface-variant overflow-hidden shadow-[0px_1px_3px_rgba(26,22,20,0.05)]">
          
          {/* Left Column: Branding / Trust Signals */}
          <div className="hidden md:flex md:w-5/12 bg-surface-container-high p-xl flex-col justify-between border-r border-surface-variant relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center gap-sm mb-lg text-primary">
                <Landmark className="font-variation-settings:" />
                <span className="font-headline-sm text-headline-sm font-bold tracking-tight">Skill Intelligence Platform</span>
              </div>
              <div className="mt-xl pt-xl">
                <h2 className="font-headline-md text-headline-md text-on-surface mb-md">Empowering the Government Workforce</h2>
                <p className="font-body-lg text-body-lg text-on-surface-variant mb-xl">Secure, data-driven skill mapping and learning pathways tailored for institutional excellence.</p>
                <div className="space-y-md">
                  <div className="flex items-start gap-md">
                    <Shield className="text-primary bg-primary-fixed p-sm rounded-full" />
                    <div>
                      <h3 className="font-body-md text-body-md font-bold text-on-surface">Gov-Grade Security</h3>
                      <p className="font-caption text-caption text-on-surface-variant">End-to-end encryption for institutional data.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-md">
                    <LineChart className="text-primary bg-primary-fixed p-sm rounded-full" />
                    <div>
                      <h3 className="font-body-md text-body-md font-bold text-on-surface">Data-Driven Insights</h3>
                      <p className="font-caption text-caption text-on-surface-variant">Actionable reports for workforce planning.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative z-10 mt-xl">
              <div 
                className="absolute inset-0 w-full h-full bg-cover opacity-10 mix-blend-multiply rounded-lg" 
                style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDNbvMEwBH9EB8zyUguO3DRSPFB2bK4f9SHPrikC1GWWUocxL7LK6iBrgzpIM5o8vxK23lLUNuhK9pX5_A4slsJFXxclNf8F2jzol8D30fnAuds0L7fvy51aVFw4QUnJpNAfEPOsGMSp-q_aYUfW69lWGpuxlIumWTInjxF6dcY_L4DCNv7RNKkG1unYPSx4EZpXzYGkVG6uf-fnxK8mP_1t2B8yEMW-P1siA7YSGz61RJ9zBvz7jBrHA')" }}
              />
            </div>
          </div>
          
          {/* Right Column: Registration Form */}
          <div className="w-full md:w-7/12 p-lg md:p-xl lg:px-[80px] lg:py-[64px] bg-surface flex flex-col justify-center">
            <div className="md:hidden flex items-center gap-sm mb-lg text-primary">
              <Landmark className="font-variation-settings:" />
              <span className="font-headline-sm text-headline-sm font-bold">Skill Intel</span>
            </div>
            
            <div className="mb-xl">
              <h1 className="font-display-lg text-display-lg text-on-surface mb-sm">Create an Account</h1>
              <p className="font-body-md text-body-md text-on-surface-variant">Register with your official credentials to access the platform.</p>
            </div>
            
            {error && (
              <div className="mb-lg flex items-center gap-sm p-sm bg-error-container border border-error rounded text-sm text-error">
                <AlertCircle className="shrink-0 text-[16px]" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                <div>
                  <label htmlFor="firstName" className="block font-label-caps text-label-caps text-on-surface-variant mb-xs uppercase tracking-wider">First Name</label>
                  <input 
                    id="firstName" 
                    type="text" 
                    required 
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full bg-surface-container-lowest border border-surface-variant rounded focus:border-primary focus:ring-2 focus:ring-tertiary-fixed text-on-surface font-body-md text-body-md h-[48px] px-md outline-none transition-all"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block font-label-caps text-label-caps text-on-surface-variant mb-xs uppercase tracking-wider">Last Name</label>
                  <input 
                    id="lastName" 
                    type="text" 
                    required 
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full bg-surface-container-lowest border border-surface-variant rounded focus:border-primary focus:ring-2 focus:ring-tertiary-fixed text-on-surface font-body-md text-body-md h-[48px] px-md outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block font-label-caps text-label-caps text-on-surface-variant mb-xs uppercase tracking-wider">Official Gov Email</label>
                <input 
                  id="email" 
                  type="email" 
                  placeholder="name@agency.gov" 
                  required 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-surface-container-lowest border border-surface-variant rounded focus:border-primary focus:ring-2 focus:ring-tertiary-fixed text-on-surface font-body-md text-body-md h-[48px] px-md outline-none transition-all"
                />
              </div>

              <div>
                <label htmlFor="agency" className="block font-label-caps text-label-caps text-on-surface-variant mb-xs uppercase tracking-wider">Department / Agency</label>
                <div className="relative">
                  <select 
                    id="agency" 
                    required 
                    value={agency}
                    onChange={(e) => setAgency(e.target.value)}
                    className="w-full bg-surface-container-lowest border border-surface-variant rounded focus:border-primary focus:ring-2 focus:ring-tertiary-fixed text-on-surface font-body-md text-body-md h-[48px] px-md appearance-none outline-none transition-all"
                  >
                    <option value="" disabled>Select your department...</option>
                    <option value="dept1">Department of Defense</option>
                    <option value="dept2">Department of Energy</option>
                    <option value="dept3">Department of Education</option>
                    <option value="dept4">Other Federal Agency</option>
                  </select>
                  <ChevronDown className="absolute right-md top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none" />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block font-label-caps text-label-caps text-on-surface-variant mb-xs uppercase tracking-wider">Password</label>
                <input 
                  id="password" 
                  type="password" 
                  required 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-surface-container-lowest border border-surface-variant rounded focus:border-primary focus:ring-2 focus:ring-tertiary-fixed text-on-surface font-body-md text-body-md h-[48px] px-md outline-none transition-all"
                />
                <p className="mt-xs font-caption text-caption text-on-surface-variant">Must be at least 8 characters.</p>
              </div>

              <div className="flex items-start gap-sm pt-sm">
                <div className="flex items-center h-5">
                  <input 
                    id="terms" 
                    type="checkbox" 
                    required 
                    checked={terms}
                    onChange={(e) => setTerms(e.target.checked)}
                    className="w-4 h-4 text-primary bg-surface-container-lowest border-surface-variant rounded focus:ring-primary focus:ring-2 cursor-pointer"
                  />
                </div>
                <div className="ml-2 text-sm">
                  <label htmlFor="terms" className="font-body-md text-body-md text-on-surface-variant cursor-pointer">
                    I agree to the <a href="#" className="text-primary hover:underline">Terms of Service</a> and <a href="#" className="text-primary hover:underline">Privacy Policy</a> governing institutional data usage.
                  </label>
                </div>
              </div>

              <div className="pt-md">
                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full bg-primary text-on-primary font-headline-sm text-headline-sm rounded h-[48px] hover:bg-surface-tint active:bg-primary-container transition-colors shadow-sm flex items-center justify-center gap-sm disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isLoading ? <Hourglass className="text-sm animate-spin" /> : <ArrowRight className="text-sm" />}
                  {isLoading ? 'Registering...' : 'Register Account'}
                </button>
              </div>
            </form>

            <div className="mt-xl pt-lg border-t border-surface-variant text-center">
              <p className="font-body-md text-body-md text-on-surface-variant">
                Already have an account? 
                <Link to="/login" className="text-primary font-bold hover:underline ml-xs">Sign In</Link>
              </p>
              <div className="mt-md flex justify-center items-center gap-md">
                <a href="#" className="font-caption text-caption text-on-surface-variant hover:text-primary transition-colors flex items-center gap-xs">
                  <HelpCircle className="text-[16px]" /> Support
                </a>
                <span className="text-surface-variant">|</span>
                <a href="#" className="font-caption text-caption text-on-surface-variant hover:text-primary transition-colors flex items-center gap-xs">
                  <ShieldCheck className="text-[16px]" /> Security Info
                </a>
              </div>
            </div>
            
          </div>
        </div>
      </main>
    </div>
  );
};
