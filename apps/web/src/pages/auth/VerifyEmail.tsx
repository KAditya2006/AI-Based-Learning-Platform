import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { authApi } from '../../api/auth';
import { AlertCircle, ArrowRight, CheckCircle, Headset, Hourglass, ShieldCheck } from 'lucide-react';


export const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const urlToken = searchParams.get('token');
  const navigate = useNavigate();
  
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [timeRemaining, setTimeRemaining] = useState(299); // 4:59
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    const countdown = setInterval(() => {
      setTimeRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(countdown);
  }, []);

  useEffect(() => {
    if (urlToken) {
      handleVerify(urlToken);
    }
  }, [urlToken]);

  const handleVerify = async (tokenToVerify: string) => {
    setStatus('loading');
    setErrorMessage('');
    try {
      await authApi.verifyEmail({ token: tokenToVerify });
      setStatus('success');
    } catch (err: any) {
      setStatus('error');
      setErrorMessage(err.message || 'The verification code is invalid or has expired.');
    }
  };

  const submitOtp = () => {
    const token = otp.join('');
    if (token.length === 6) {
      handleVerify(token);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-background h-screen flex flex-col font-body-md text-on-surface antialiased">
      <main className="flex-grow flex items-center justify-center p-container-margin md:p-xl">
        <div className="w-full max-w-md bg-surface-container-lowest border border-surface-container-highest rounded-lg shadow-[0px_1px_3px_rgba(26,22,20,0.05)] p-lg flex flex-col gap-xl">
          
          {status === 'success' ? (
            <div className="flex flex-col items-center text-center gap-sm animate-in fade-in duration-300">
              <div className="flex items-center justify-center w-12 h-12 bg-primary-fixed-dim rounded-full mb-2 border border-primary-fixed">
                <CheckCircle className="text-primary text-[24px]" />
              </div>
              <h1 className="font-headline-md text-headline-md text-on-surface">Email Verified</h1>
              <p className="font-body-md text-body-md text-on-surface-variant mb-md">
                Your email address has been successfully verified. You can now access your account.
              </p>
              <button 
                onClick={() => navigate('/login')}
                className="w-full h-12 bg-primary hover:opacity-90 active:scale-95 text-on-primary rounded font-headline-sm text-headline-sm flex items-center justify-center gap-2 transition-all"
              >
                Continue to Login
                <ArrowRight className="text-[20px]" />
              </button>
            </div>
          ) : (
            <div className="animate-in fade-in duration-300">
              {/* Header & Badge */}
              <div className="flex flex-col items-center text-center gap-sm mb-xl">
                <div className="flex items-center justify-center w-12 h-12 bg-surface-container-low rounded-full mb-2">
                  <ShieldCheck className="text-primary font-variation-settings:" />
                </div>
                <h1 className="font-headline-md text-headline-md text-on-surface">Verify Identity</h1>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  For your security, please enter the 6-digit verification code sent to your official government email address.
                </p>
              </div>

              {status === 'error' && (
                <div className="flex items-center gap-sm p-sm bg-error-container border border-error rounded text-sm text-error mb-lg">
                  <AlertCircle className="shrink-0 text-[16px]" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* OTP Input Section */}
              <div className="flex flex-col gap-md mb-xl">
                <div className="flex justify-between gap-sm">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => { inputRefs.current[index] = el; }}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      className="w-12 h-14 text-center border border-surface-variant rounded bg-surface-container-lowest text-on-surface font-headline-md text-2xl font-bold focus:outline-none focus:border-primary focus:ring-2 focus:ring-tertiary-fixed transition-all"
                    />
                  ))}
                </div>
                <div className="text-center mt-2">
                  <span className="font-caption text-caption text-on-surface-variant">
                    Code expires in <span className="font-bold text-primary">{formatTime(timeRemaining)}</span>
                  </span>
                </div>
              </div>

              {/* Action */}
              <div className="flex flex-col gap-sm">
                <button 
                  onClick={submitOtp}
                  disabled={status === 'loading' || otp.join('').length < 6}
                  className="w-full h-12 bg-primary hover:opacity-90 active:scale-95 text-on-primary rounded font-headline-sm text-headline-sm flex items-center justify-center gap-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {status === 'loading' ? 'Verifying...' : 'Verify Account'}
                  {status === 'loading' ? <Hourglass className="text-[20px] animate-spin" /> : <ArrowRight className="text-[20px]" />}
                </button>
              </div>

              {/* Support Links */}
              <div className="flex flex-col items-center gap-sm pt-md mt-lg border-t border-surface-container-highest">
                <button className="font-label-caps text-label-caps text-primary hover:underline bg-transparent border-none cursor-pointer">
                  RESEND CODE
                </button>
                <div className="flex items-center gap-1 font-caption text-caption text-on-surface-variant mt-sm">
                  <Headset className="text-[16px]" />
                  Need help? <Link to="/contact" className="text-primary hover:underline">Contact Support</Link>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-xl px-lg flex flex-col md:flex-row justify-between items-center gap-md border-t border-surface-container-highest bg-background text-on-surface-variant font-caption text-caption">
        <div>© 2024 Skill Intelligence Platform. All rights reserved. Government Workforce Division.</div>
        <div className="flex gap-md">
          <Link to="#" className="hover:text-primary transition-colors duration-200">Privacy Policy</Link>
          <Link to="#" className="hover:text-primary transition-colors duration-200">Terms of Service</Link>
          <Link to="#" className="hover:text-primary transition-colors duration-200">Security Compliance</Link>
        </div>
        <div className="font-label-caps text-label-caps text-on-surface-variant">SKILL INTELLIGENCE PLATFORM</div>
      </footer>
    </div>
  );
};
