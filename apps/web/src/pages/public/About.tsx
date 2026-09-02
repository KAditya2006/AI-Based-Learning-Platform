import React from 'react';
import { Link } from 'react-router-dom';
import { Flag, LineChart, Network, PencilRuler, ShieldCheck } from 'lucide-react';


export const About = () => {
  return (
    <div className="bg-background text-on-background min-h-[calc(100vh-3.5rem)] flex flex-col antialiased">
      <main className="flex-grow w-full max-w-screen-2xl mx-auto px-lg md:px-xl py-xl space-y-32">
        {/* Hero Section: Editorial Layout */}
        <section className="grid grid-cols-1 md:grid-cols-12 gap-xl items-center pt-xl">
          <div className="md:col-span-7 space-y-lg">
            <p className="font-label-caps text-label-caps text-primary tracking-widest uppercase">Institutional Intelligence</p>
            <h1 className="font-display-lg text-display-lg text-on-surface tracking-tight leading-tight">
              Advancing the Official <br className="hidden lg:block"/>Statistical System.
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl leading-relaxed">
              Empowering the public sector with authoritative, data-driven insights. Our platform establishes a standardized, secure foundation for institutional knowledge mapping, ensuring workforce planners and educators have the clarity required for strategic growth.
            </p>
            <div className="pt-sm">
              <button className="bg-primary text-on-primary font-label-caps text-label-caps px-lg py-sm rounded-DEFAULT uppercase tracking-wider hover:bg-primary-container transition-colors shadow-sm">
                Explore Our Mission
              </button>
            </div>
          </div>
          <div className="md:col-span-5 rounded-lg overflow-hidden border border-outline-variant shadow-sm bg-surface">
            <img 
              className="w-full h-[400px] object-cover" 
              alt="Institutional AI framework abstraction" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCSy73FVLOK4bJxUhvR-5n51TPEe7suV_HCA9lUMSdohUZFRHfrViXYxQBz-D0O79E4f9DMsj3Xp9P8ZNgn-DLn5_X3NlUzThE19RtPr9ypvgzFIUpeHNIbzQPRnZ3yyvdkdS4HM-XAM8um6CeED4f5u2zMROQ03K0axvzrSA3aYsO0CnEPUGgSnYHqULKB2aHPeKCxOFyKF4OgjzqpOInC9iFnI_d62RFfqeapfbxx6HfqDqgZYvgGFQ"
            />
          </div>
        </section>

        {/* Mission & Integration: Side-by-Side */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-xl items-stretch border-t border-outline-variant pt-xl">
          <div className="flex flex-col justify-center space-y-md pr-0 lg:pr-xl">
            <div className="flex items-center space-x-sm text-secondary">
              <Flag />
              <h2 className="font-headline-sm text-headline-sm">Our Mission</h2>
            </div>
            <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
              We bridge the gap between complex institutional data and actionable workforce strategy. By synthesizing disparate statistical records into a cohesive intelligence layer, we provide government planners with a clear, distraction-free environment to chart organizational progress. The aesthetic of our tools reflects our purpose: reliable, stable, and profoundly human-centric.
            </p>
          </div>
          <div className="bg-surface rounded-lg border border-outline-variant shadow-sm p-xl flex flex-col justify-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-container opacity-5 rounded-bl-full"></div>
            <h3 className="font-headline-md text-headline-md text-on-surface mb-md">Data-Driven Clarity</h3>
            <div className="space-y-sm">
              <div className="flex items-start space-x-md border-b border-surface-variant pb-sm">
                <LineChart className="text-primary mt-xs" />
                <div>
                  <h4 className="font-label-caps text-label-caps text-on-surface">Predictive Modeling</h4>
                  <p className="font-body-md text-body-md text-on-surface-variant">Anticipate institutional skill gaps with robust statistical forecasting.</p>
                </div>
              </div>
              <div className="flex items-start space-x-md pt-sm">
                <Network className="text-primary mt-xs" />
                <div>
                  <h4 className="font-label-caps text-label-caps text-on-surface">Seamless Integration</h4>
                  <p className="font-body-md text-body-md text-on-surface-variant">Connect existing public sector ledgers into a unified intelligence stream.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Core Pillars: Bento Grid */}
        <section className="space-y-lg">
          <div className="text-center space-y-sm max-w-3xl mx-auto mb-xl">
            <h2 className="font-headline-md text-headline-md text-on-surface">Pillars of Operation</h2>
            <p className="font-body-md text-body-md text-on-surface-variant">The architectural foundations that ensure stability, accuracy, and institutional trust across our entire statistical framework.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
            {/* Pillar 1 */}
            <div className="bg-surface border border-outline-variant rounded-lg p-xl shadow-sm hover:border-outline transition-colors group">
              <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center mb-md group-hover:bg-primary-fixed transition-colors">
                <PencilRuler className="text-on-surface-variant group-hover:text-primary" />
              </div>
              <h3 className="font-headline-sm text-headline-sm text-on-surface mb-sm">Foundation</h3>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Establishing a standardized ontology for institutional skills, ensuring every metric rests upon unshakeable, verified ground truth data.
              </p>
            </div>
            {/* Pillar 2 */}
            <div className="bg-surface border border-outline-variant rounded-lg p-xl shadow-sm hover:border-outline transition-colors group">
              <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center mb-md group-hover:bg-primary-fixed transition-colors">
                <Network className="text-on-surface-variant group-hover:text-primary" />
              </div>
              <h3 className="font-headline-sm text-headline-sm text-on-surface mb-sm">Integration</h3>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Aggregating disparate educational and professional ledgers into a singular, cohesive dashboard for holistic workforce planning.
              </p>
            </div>
            {/* Pillar 3 */}
            <div className="bg-surface border border-outline-variant rounded-lg p-xl shadow-sm hover:border-outline transition-colors group">
              <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center mb-md group-hover:bg-primary-fixed transition-colors">
                <ShieldCheck className="text-on-surface-variant group-hover:text-primary" />
              </div>
              <h3 className="font-headline-sm text-headline-sm text-on-surface mb-sm">Security</h3>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Government-grade compliance protocols enforcing strict access controls and immutable audit trails for all intelligence operations.
              </p>
            </div>
          </div>
        </section>

        {/* Organizational Background */}
        <section className="bg-surface border border-outline-variant rounded-lg shadow-sm overflow-hidden flex flex-col md:flex-row">
          <div className="w-full md:w-2/5 border-b md:border-b-0 md:border-r border-outline-variant bg-cover bg-center" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAae247xeMDTfjaI6SsZiFZLcjqqsmbO68jsD9kBLvAygDcayEJhM-GRxdGCCLiEBr-BbMA6Wb3zFrLPW58vpucY_YUdCF47HIZpGHOcuqVuPOwZZcBcfXyCI___YOyKaK-dwgdUKG-idksvxNt43HSaadp9RciYv1i6pC7L-VY8gD35SHePQYNOIudz09iKqQYUaX_2mRMF2TntfT2g76noqd8IuEaIHii7QM3gXaFZWRzPUWQY10YcA')" }}>
            <div className="h-48 md:h-full"></div>
          </div>
          <div className="w-full md:w-3/5 p-xl md:p-12 flex flex-col justify-center space-y-md bg-surface">
            <h2 className="font-headline-md text-headline-md text-on-surface">Organizational Background</h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant">
              Forged from the necessity for unified institutional metrics, our organization began as a centralized node for verifying educational credentials. Today, it stands as the definitive layer for governmental workforce intelligence.
            </p>
            <div className="grid grid-cols-2 gap-md pt-md">
              <div className="border-l-2 border-primary pl-sm">
                <span className="block font-display-lg text-display-lg text-on-surface">15+</span>
                <span className="font-label-caps text-label-caps text-on-surface-variant">Agencies Integrated</span>
              </div>
              <div className="border-l-2 border-primary pl-sm">
                <span className="block font-display-lg text-display-lg text-on-surface">Tier 1</span>
                <span className="font-label-caps text-label-caps text-on-surface-variant">Security Clearance</span>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};
