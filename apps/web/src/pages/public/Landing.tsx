import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { ArrowRight, BadgeCheck, CheckCircle, Globe, GraduationCap, Landmark, Radar, Shield, TrendingUp } from 'lucide-react';


export const Landing: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex-grow flex flex-col items-center w-full bg-background text-on-background font-body-lg antialiased min-h-screen">
      {/* Top Navigation for Landing Page */}
      <header className="w-full h-[56px] flex items-center justify-between px-container-margin md:px-xl z-50 bg-background border-b border-surface-variant">
        <div className="flex items-center gap-xs">
          <Landmark className="text-primary text-[28px]" />
          <span className="font-headline-sm text-headline-sm font-bold text-primary">Skill Intelligence</span>
        </div>
        <div>
          <Button variant="primary" onClick={() => navigate('/login')}>Login</Button>
        </div>
      </header>

      <main className="flex-grow flex flex-col items-center w-full">
        {/* Hero Section */}
        <section className="w-full max-w-7xl mx-auto px-container-margin md:px-xl py-xl md:py-[64px] flex flex-col md:flex-row items-center gap-xl md:gap-[64px]">
          <div className="flex-1 flex flex-col gap-lg z-10 items-start">
            <div className="inline-flex items-center gap-sm bg-surface-container-high px-sm py-xs rounded-full border border-surface-variant w-fit">
              <BadgeCheck className="text-tertiary text-[16px]" />
              <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">Government Standard 800-53 Compliant</span>
            </div>
            <h1 className="font-display-lg text-display-lg text-on-background md:text-[48px] md:leading-[56px]">
              Elevate Institutional Capacity Through <span className="text-primary">Competency Intelligence</span>
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
              A rigorous, data-driven platform designed for government workforce planners and institutional educators to map skills, identify gaps, and deploy personalized learning at scale.
            </p>
            <div className="flex flex-col sm:flex-row gap-md pt-sm">
              <Button variant="primary" onClick={() => navigate('/login')} className="flex items-center justify-center gap-sm">
                Get Started
                <ArrowRight className="text-[18px]" />
              </Button>
              <Button variant="ghost" onClick={() => navigate('/about')} className="border border-primary">
                Explore Methodology
              </Button>
            </div>
          </div>
          <div className="flex-1 w-full relative">
            <div className="w-full aspect-[4/3] rounded-xl overflow-hidden shadow-[0px_1px_3px_rgba(26,22,20,0.05)] border border-surface-variant relative z-10 bg-surface">
              <div 
                className="bg-cover bg-center w-full h-full" 
                style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuC_pwOdSF2DLrSm09-mrcEIIoTdFf5SgsmfBYZ5Rnyqtl1mMmKOlMIy6AQ4xJgD0obElLyUsHogGUYeuzr1e6eI2BM9e_R7n5mvtsC6oa7bCl-21HMEPF_28GJA9GcJKYurZjbOJo6qoyjjNtEwcd1Or-MOkT2gBWN3SYVGTreJv8HHh-6Bm-nmfVYaPRjsXFATtAKRw6jkj6m9jOAxjP7gOnScmdDF6SMcelNzuxXWaQDZSZBi-kO2Bw')" }}
              />
            </div>
            {/* Decorative element */}
            <div className="absolute -bottom-lg -left-lg w-full h-full bg-secondary-fixed rounded-xl -z-10 opacity-50"></div>
          </div>
        </section>

        {/* Trust & Scale */}
        <section className="w-full bg-surface-container-low border-y border-surface-variant py-xl">
          <div className="max-w-7xl mx-auto px-container-margin md:px-xl">
            <p className="font-label-caps text-label-caps text-center text-on-surface-variant uppercase mb-lg">Trusted by federal agencies and educational institutions</p>
            <div className="flex flex-wrap justify-center gap-xl md:gap-[64px] opacity-70 grayscale">
              <div className="flex items-center gap-sm font-headline-sm text-headline-sm text-on-background font-bold"><Landmark /> Dept. of Education</div>
              <div className="flex items-center gap-sm font-headline-sm text-headline-sm text-on-background font-bold"><Shield /> Defense Logistics</div>
              <div className="flex items-center gap-sm font-headline-sm text-headline-sm text-on-background font-bold"><Globe /> Global Policy Institute</div>
            </div>
          </div>
        </section>

        {/* Feature Bento Grid */}
        <section className="w-full max-w-7xl mx-auto px-container-margin md:px-xl py-xl md:py-[80px] flex flex-col gap-xl md:gap-[64px]">
          <div className="text-center max-w-3xl mx-auto flex flex-col gap-md">
            <h2 className="font-display-lg text-display-lg text-on-background">A Structured Approach to Professional Development</h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant">Move beyond generic training. Our statistical system provides precise insights into organizational capability and individual growth trajectories.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-lg md:gap-xl">
            {/* Feature 1: Large Card */}
            <div className="col-span-1 md:col-span-8 bg-surface border border-surface-variant rounded-xl p-lg md:p-xl flex flex-col justify-between shadow-[0px_1px_3px_rgba(26,22,20,0.05)] overflow-hidden relative">
              <div className="flex flex-col gap-md relative z-10 max-w-lg mb-xl">
                <div className="w-12 h-12 rounded-full bg-primary-fixed flex items-center justify-center text-primary mb-sm">
                  <Radar />
                </div>
                <h3 className="font-headline-md text-headline-md text-on-background">Competency Intelligence</h3>
                <p className="font-body-lg text-body-lg text-on-surface-variant">Map your entire workforce against standardized competency frameworks. Identify critical skill gaps before they impact operational readiness.</p>
              </div>
              <div className="w-full h-48 md:h-64 rounded-lg bg-surface-container-high border border-surface-variant overflow-hidden relative z-10">
                <div 
                  className="bg-cover bg-center w-full h-full" 
                  style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCacD-HSoX26de2Z_AVW3PpCsJ3junwxlHLZCzXfYr6RwNrMYOeEUG7z__XkRynPDXJqrt_xmYtz3ilFQEjs30S_NcVq8KEDK0mv-BVn_BznJvtIjctnJYvWT03129F-WbYDow9gyeTHWlSwMsdfWwLUfbNsONOmmNJTPsHi-DctdTITtTE0RyUSiWmn7er78T8LnpKhW1CFvs8YD1yPHY_Vj3muSyA4bKEzQBpPqbVKkYh5MIw8G0kBg')" }}
                />
              </div>
            </div>

            {/* Feature 2: Tall Card */}
            <div className="col-span-1 md:col-span-4 bg-surface border border-surface-variant rounded-xl p-lg flex flex-col shadow-[0px_1px_3px_rgba(26,22,20,0.05)]">
              <div className="flex flex-col gap-md mb-auto">
                <div className="w-12 h-12 rounded-full bg-secondary-fixed flex items-center justify-center text-secondary mb-sm">
                  <GraduationCap />
                </div>
                <h3 className="font-headline-md text-headline-md text-on-background">Personalized Learning</h3>
                <p className="font-body-md text-body-md text-on-surface-variant">Deploy targeted curriculum based on individual assessment data. Ensure every hour of training directly addresses a documented competency gap.</p>
              </div>
              <div className="mt-lg pt-lg border-t border-surface-variant">
                <ul className="flex flex-col gap-sm">
                  <li className="flex items-start gap-sm">
                    <CheckCircle className="text-primary text-[20px] mt-[2px]" />
                    <span className="font-body-md text-body-md text-on-background">Adaptive assessments</span>
                  </li>
                  <li className="flex items-start gap-sm">
                    <CheckCircle className="text-primary text-[20px] mt-[2px]" />
                    <span className="font-body-md text-body-md text-on-background">Micro-credentialing</span>
                  </li>
                  <li className="flex items-start gap-sm">
                    <CheckCircle className="text-primary text-[20px] mt-[2px]" />
                    <span className="font-body-md text-body-md text-on-background">Verified learning paths</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Feature 3: Wide Card */}
            <div className="col-span-1 md:col-span-12 bg-inverse-surface rounded-xl p-lg md:p-xl flex flex-col md:flex-row items-center gap-xl shadow-[0px_1px_3px_rgba(26,22,20,0.05)]">
              <div className="flex-1 flex flex-col gap-md">
                <div className="w-12 h-12 rounded-full bg-surface-variant/20 flex items-center justify-center text-on-tertiary mb-sm">
                  <TrendingUp />
                </div>
                <h3 className="font-headline-md text-headline-md text-on-tertiary">Organizational Growth</h3>
                <p className="font-body-lg text-body-lg text-inverse-on-surface/80">Track the ROI of your training investments. Our statistical engine correlates learning outcomes with operational performance metrics across your entire institution.</p>
                <Link to="/features" className="text-primary-fixed-dim font-label-caps text-label-caps uppercase mt-sm self-start flex items-center gap-xs hover:text-primary-fixed transition-colors">
                  Read the Whitepaper <ArrowRight className="text-[16px]" />
                </Link>
              </div>
              <div className="flex-1 w-full flex justify-center">
                {/* Abstract stat representation */}
                <div className="w-full max-w-sm flex items-end justify-center gap-sm h-40">
                  <div className="w-12 bg-primary-fixed-dim/20 rounded-t-sm h-[40%]"></div>
                  <div className="w-12 bg-primary-fixed-dim/40 rounded-t-sm h-[60%]"></div>
                  <div className="w-12 bg-primary-fixed-dim/60 rounded-t-sm h-[75%]"></div>
                  <div className="w-12 bg-primary-fixed-dim rounded-t-sm h-[100%] relative">
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-surface text-on-surface font-label-caps text-[10px] px-2 py-1 rounded shadow-sm">+42%</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Minimal Footer */}
      <footer className="w-full bg-surface-container border-t border-surface-variant py-lg mt-auto">
        <div className="max-w-7xl mx-auto px-container-margin md:px-xl flex flex-col md:flex-row justify-between items-center gap-md">
          <div className="flex items-center gap-xs">
            <Landmark className="text-on-surface-variant text-[20px]" />
            <span className="font-headline-sm text-[16px] font-bold text-on-surface-variant">Skill Intelligence</span>
          </div>
          <div className="flex gap-lg">
            <Link to="#" className="font-caption text-caption text-on-surface-variant hover:text-primary transition-colors">Privacy Policy</Link>
            <Link to="#" className="font-caption text-caption text-on-surface-variant hover:text-primary transition-colors">Terms of Service</Link>
            <Link to="#" className="font-caption text-caption text-on-surface-variant hover:text-primary transition-colors">Accessibility Statement</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};
