import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { BarChart3, Brain, Network } from 'lucide-react';


export const Features: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex-grow flex flex-col items-center w-full bg-background text-on-surface antialiased min-h-screen">
      {/* Top Navigation */}
      <header className="w-full sticky top-0 h-14 bg-surface border-b border-outline-variant z-50">
        <div className="flex justify-between items-center px-lg max-w-screen-2xl mx-auto h-full">
          <div className="font-headline-md text-headline-md text-primary font-bold tracking-tight cursor-pointer" onClick={() => navigate('/')}>Learning Mate</div>
          <nav className="hidden md:flex gap-xl h-full items-center">
            <Link to="/" className="text-on-surface-variant hover:text-primary font-body-lg text-body-lg h-full flex items-center px-sm transition-colors duration-200">Home</Link>
            <Link to="/features" className="text-primary font-semibold border-b-2 border-primary h-full flex items-center px-sm mt-0.5">Features</Link>
          </nav>
          <div className="flex items-center gap-md">
            <Button variant="primary" onClick={() => navigate('/login')} className="hidden md:block">
              Login
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-grow flex flex-col items-center w-full px-lg max-w-screen-2xl mx-auto py-xl gap-xl">
        {/* Hero Section */}
        <section className="w-full flex flex-col md:flex-row items-center justify-between gap-xl bg-surface-container-lowest border border-surface-variant rounded-xl p-xl shadow-[0px_1px_3px_rgba(26,22,20,0.05)]">
          <div className="flex-1 flex flex-col gap-md max-w-2xl">
            <h1 className="font-display-lg text-display-lg text-on-surface">Architecting the Future-Ready Workforce</h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant">
              Discover how our institutional-grade platform leverages explainable AI to bridge skill gaps and drive measurable organizational growth.
            </p>
            <div className="flex gap-md mt-md">
              <Button variant="primary" onClick={() => navigate('/login')}>Get Started</Button>
              <Button variant="ghost" className="border border-primary">Explore Documentation</Button>
            </div>
          </div>
          <div className="flex-1 w-full relative min-h-[300px] md:min-h-[400px] rounded-lg overflow-hidden border border-outline-variant">
            <div 
              className="w-full h-full object-cover absolute inset-0 bg-cover bg-center" 
              style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAqStYM1EbARX5ltwC-5i_rHE0s4iX2MowOWaoKeR0GaRsSFF-dMaTirO5pLf57TpuT0kod9xroqABYnjt4_e4b9D-Y7aqolRvTLhVSV1gyU5_-6sWfue0QiK6Xd62OlKTn_qOIFD3LDld6WSfNqAVdiASAtu1nM82_MCKSvocgG6ukPtGoUPT-AQgAwtklIip3nxeZYx9cpkPqdhP3gXBy_nRouVIy2vqBfh_5mFUNDRnNhuG0xqxojA')" }}
            />
          </div>
        </section>

        {/* Features Grid */}
        <section className="w-full flex flex-col gap-lg">
          <div className="flex flex-col gap-xs mb-md">
            <span className="font-label-caps text-label-caps text-primary uppercase tracking-wider">Core Capabilities</span>
            <h2 className="font-headline-md text-headline-md text-on-surface">Competency Intelligence</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg w-full">
            {/* Feature Card 1 */}
            <div className="bg-surface-container-lowest border border-surface-variant rounded-xl p-lg flex flex-col gap-md shadow-[0px_1px_3px_rgba(26,22,20,0.05)] hover:shadow-none hover:border-[#D1C9C4] transition-all cursor-pointer">
              <div className="p-sm bg-surface-container-low rounded-lg w-fit">
                <Network className="text-primary" />
              </div>
              <div className="border-b border-surface-variant pb-sm">
                <h3 className="font-headline-sm text-headline-sm text-on-surface">Dynamic Skill Mapping</h3>
              </div>
              <p className="font-body-md text-body-md text-on-surface-variant flex-grow">
                Continuously track and model the evolving competency architecture of your entire organization in real-time.
              </p>
              <div className="flex gap-sm flex-wrap mt-auto">
                <span className="bg-[#FCDCCC] text-[#1A1614] px-sm py-xs rounded-lg font-caption text-caption">Ontology</span>
                <span className="bg-[#FCDCCC] text-[#1A1614] px-sm py-xs rounded-lg font-caption text-caption">AI-Driven</span>
              </div>
            </div>

            {/* Feature Card 2 */}
            <div className="bg-surface-container-lowest border border-surface-variant rounded-xl p-lg flex flex-col gap-md shadow-[0px_1px_3px_rgba(26,22,20,0.05)] hover:shadow-none hover:border-[#D1C9C4] transition-all cursor-pointer">
              <div className="p-sm bg-surface-container-low rounded-lg w-fit">
                <BarChart3 className="text-primary" />
              </div>
              <div className="border-b border-surface-variant pb-sm">
                <h3 className="font-headline-sm text-headline-sm text-on-surface">Gap Analysis Dashboards</h3>
              </div>
              <p className="font-body-md text-body-md text-on-surface-variant flex-grow">
                Identify critical capability shortages instantly with high-density, actionable visualizations tailored for workforce planners.
              </p>
              <div className="flex gap-sm flex-wrap mt-auto">
                <span className="bg-[#FCDCCC] text-[#1A1614] px-sm py-xs rounded-lg font-caption text-caption">Analytics</span>
                <span className="bg-[#FCDCCC] text-[#1A1614] px-sm py-xs rounded-lg font-caption text-caption">Reporting</span>
              </div>
            </div>

            {/* Feature Card 3 */}
            <div className="bg-surface-container-lowest border border-surface-variant rounded-xl p-lg flex flex-col gap-md shadow-[0px_1px_3px_rgba(26,22,20,0.05)] hover:shadow-none hover:border-[#D1C9C4] transition-all cursor-pointer">
              <div className="p-sm bg-surface-container-low rounded-lg w-fit">
                <Brain className="text-primary" />
              </div>
              <div className="border-b border-surface-variant pb-sm">
                <h3 className="font-headline-sm text-headline-sm text-on-surface">Explainable Inference</h3>
              </div>
              <p className="font-body-md text-body-md text-on-surface-variant flex-grow">
                Ensure transparent decision-making with AI models that provide clear, auditable reasoning for every inferred skill.
              </p>
              <div className="flex gap-sm flex-wrap mt-auto">
                <span className="bg-[#FCDCCC] text-[#1A1614] px-sm py-xs rounded-lg font-caption text-caption">Compliance</span>
                <span className="bg-[#FCDCCC] text-[#1A1614] px-sm py-xs rounded-lg font-caption text-caption">Auditable</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer Component */}
      <footer className="w-full py-xl mt-auto bg-surface-container border-t border-outline-variant">
        <div className="flex flex-col md:flex-row justify-between items-center px-lg w-full max-w-screen-2xl mx-auto gap-md">
          <div className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">
            © 2024 Learning Mate Platform. All rights reserved.
          </div>
          <nav className="flex flex-wrap gap-md justify-center">
            <Link to="#" className="font-caption text-caption text-on-surface-variant hover:underline hover:text-primary transition-colors duration-200 cursor-pointer">Privacy Policy</Link>
            <Link to="#" className="font-caption text-caption text-on-surface-variant hover:underline hover:text-primary transition-colors duration-200 cursor-pointer">Terms of Service</Link>
            <Link to="#" className="font-caption text-caption text-on-surface-variant hover:underline hover:text-primary transition-colors duration-200 cursor-pointer">Accessibility</Link>
          </nav>
        </div>
      </footer>
    </div>
  );
};
