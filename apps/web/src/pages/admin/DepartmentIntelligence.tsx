import React from 'react';
import useSWR from 'swr';
import { adminApi } from '../../api/admin';
import { Button } from '../../components/ui/Button';
import { AlertTriangle, ArrowRight, Download, GraduationCap, History, Lightbulb, Network, PieChart, Plus, Sparkles, TrendingUp, Users } from 'lucide-react';


export const DepartmentIntelligence = () => {
  const { data: depts, error, mutate } = useSWR('/admin/intelligence/departments', adminApi.getDepartmentIntelligence);

  return (
    <div className="flex-1 p-lg md:p-xl max-w-7xl mx-auto w-full space-y-xl bg-background font-body-md text-on-surface h-full overflow-y-auto animate-in fade-in duration-300">
      <style>
        {`
          .card-shadow {
            box-shadow: 0px 1px 3px rgba(26, 22, 20, 0.05);
          }
          .card-interactive:active {
            box-shadow: none;
            border-color: #D1C9C4 !important;
          }
        `}
      </style>

      {/* Header Section */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-md mt-sm">
        <div>
          <h2 className="font-display-lg text-display-lg text-on-surface">Platform &amp; Department Insights</h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant mt-1">Enterprise-grade overview of workforce metrics and intelligence.</p>
        </div>
        <div className="flex items-center gap-sm">
          <button className="bg-surface-container-lowest border border-surface-variant text-primary font-label-caps text-label-caps px-md py-2 rounded flex items-center gap-2 hover:bg-surface-container-low transition-colors h-10 card-shadow card-interactive uppercase">
            <Download className="text-[18px]" />
            Export Report
          </button>
          <button className="bg-primary text-on-primary font-label-caps text-label-caps px-md py-2 rounded flex items-center gap-2 hover:bg-surface-tint transition-colors h-10 card-shadow card-interactive uppercase">
            <Plus className="text-[18px]" />
            New Directive
          </button>
        </div>
      </header>

      {/* Key Metrics Bento Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-md">
        {/* Metric 1 */}
        <div className="bg-surface-container-lowest border border-surface-variant rounded-xl p-lg flex flex-col justify-between card-shadow card-interactive relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Users className="text-6xl text-primary" />
          </div>
          <div>
            <h3 className="font-label-caps text-label-caps text-on-surface-variant mb-2 uppercase tracking-wider">Total Officials</h3>
            <div className="font-display-lg text-display-lg text-on-surface">14,205</div>
          </div>
          <div className="mt-4 flex items-center gap-2 font-caption text-caption">
            <span className="text-primary-container flex items-center bg-primary-fixed px-2 py-1 rounded-sm">
              <TrendingUp className="text-xs mr-1" /> +2.4%
            </span>
            <span className="text-on-surface-variant">vs last month</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-surface-container-lowest border border-surface-variant rounded-xl p-lg flex flex-col justify-between card-shadow card-interactive relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <GraduationCap className="text-6xl text-primary" />
          </div>
          <div>
            <h3 className="font-label-caps text-label-caps text-on-surface-variant mb-2 uppercase tracking-wider">Active Statistical Cadres</h3>
            <div className="font-display-lg text-display-lg text-on-surface">8,432</div>
          </div>
          <div className="mt-4 flex items-center gap-2 font-caption text-caption">
            <span className="text-primary-container flex items-center bg-primary-fixed px-2 py-1 rounded-sm">
              <TrendingUp className="text-xs mr-1" /> +12.1%
            </span>
            <span className="text-on-surface-variant">vs last month</span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-surface-container-lowest border border-surface-variant rounded-xl p-lg flex flex-col justify-between card-shadow card-interactive relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <PieChart className="text-6xl text-primary" />
          </div>
          <div>
            <h3 className="font-label-caps text-label-caps text-on-surface-variant mb-2 uppercase tracking-wider">Competency Coverage</h3>
            <div className="font-display-lg text-display-lg text-on-surface">78.5%</div>
          </div>
          <div className="mt-4 w-full bg-surface-variant rounded-full h-1.5">
            <div className="bg-primary h-1.5 rounded-full" style={{ width: '78.5%' }}></div>
          </div>
        </div>
      </section>

      {/* Complex Layout Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg">
        {/* Left Column: Priority Skill Gaps & Activity (2/3 width) */}
        <div className="lg:col-span-2 space-y-lg">
          {/* Priority Skill Gaps */}
          <div className="bg-surface-container-lowest border border-surface-variant rounded-xl card-shadow">
            <div className="p-md border-b border-surface-variant flex justify-between items-center">
              <h3 className="font-headline-sm text-headline-sm text-on-surface flex items-center gap-2">
                <AlertTriangle className="text-primary" />
                Priority Skill Gaps
              </h3>
              <button className="text-primary font-label-caps text-label-caps hover:underline uppercase">View All</button>
            </div>
            <div className="p-0">
              <ul className="divide-y divide-surface-variant">
                <li className="p-md hover:bg-surface-container-low transition-colors flex items-start justify-between gap-4">
                  <div>
                    <h4 className="font-headline-sm text-headline-sm text-on-surface text-base">Survey Sampling Frameworks</h4>
                    <p className="font-body-md text-body-md text-on-surface-variant mt-1">Critical shortage across Field Operations Division. Affects 3 active surveys.</p>
                    <div className="mt-2 flex gap-2">
                      <span className="bg-[#FCDCCC] text-[#1A1614] font-caption text-caption px-2 py-1 rounded font-semibold uppercase">High Priority</span>
                      <span className="bg-surface-variant text-on-surface-variant font-caption text-caption px-2 py-1 rounded uppercase">Methodology</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="font-headline-md text-headline-md text-error">-42%</div>
                    <div className="font-caption text-caption text-on-surface-variant uppercase">deficit</div>
                  </div>
                </li>
                <li className="p-md hover:bg-surface-container-low transition-colors flex items-start justify-between gap-4">
                  <div>
                    <h4 className="font-headline-sm text-headline-sm text-on-surface text-base">National Accounts &amp; GVA Modeling</h4>
                    <p className="font-body-md text-body-md text-on-surface-variant mt-1">Impending superannuations creating knowledge void in State Income Units.</p>
                    <div className="mt-2 flex gap-2">
                      <span className="bg-[#FCDCCC] text-[#1A1614] font-caption text-caption px-2 py-1 rounded font-semibold uppercase">Medium Priority</span>
                      <span className="bg-surface-variant text-on-surface-variant font-caption text-caption px-2 py-1 rounded uppercase">Economics</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="font-headline-md text-headline-md text-error">-28%</div>
                    <div className="font-caption text-caption text-on-surface-variant uppercase">deficit</div>
                  </div>
                </li>
                <li className="p-md hover:bg-surface-container-low transition-colors flex items-start justify-between gap-4">
                  <div>
                    <h4 className="font-headline-sm text-headline-sm text-on-surface text-base">Data Governance &amp; Confidentiality Protocols</h4>
                    <p className="font-body-md text-body-md text-on-surface-variant mt-1">DPDP Act alignment training required across all regional statistical bureaus.</p>
                    <div className="mt-2 flex gap-2">
                      <span className="bg-[#FCDCCC] text-[#1A1614] font-caption text-caption px-2 py-1 rounded font-semibold uppercase">Medium Priority</span>
                      <span className="bg-surface-variant text-on-surface-variant font-caption text-caption px-2 py-1 rounded uppercase">Compliance</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="font-headline-md text-headline-md text-error">-15%</div>
                    <div className="font-caption text-caption text-on-surface-variant uppercase">deficit</div>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* Latest Activity Stream */}
          <div className="bg-surface-container-lowest border border-surface-variant rounded-xl card-shadow">
            <div className="p-md border-b border-surface-variant">
              <h3 className="font-headline-sm text-headline-sm text-on-surface flex items-center gap-2">
                <History className="text-primary" />
                Latest Activity
              </h3>
            </div>
            <div className="p-md">
              <div className="relative border-l border-surface-variant ml-3 space-y-6 pb-4">
                <div className="relative pl-6">
                  <div className="absolute w-3 h-3 bg-primary rounded-full -left-[6.5px] top-1.5 border-2 border-surface-container-lowest"></div>
                  <p className="font-caption text-caption text-on-surface-variant mb-1">10 mins ago</p>
                  <p className="font-body-md text-body-md text-on-surface"><span className="font-semibold">System Alert:</span> Surge in completion for 'SDG Indicators Level 2'.</p>
                </div>
                <div className="relative pl-6">
                  <div className="absolute w-3 h-3 bg-surface-variant rounded-full -left-[6.5px] top-1.5 border-2 border-surface-container-lowest"></div>
                  <p className="font-caption text-caption text-on-surface-variant mb-1">2 hours ago</p>
                  <p className="font-body-md text-body-md text-on-surface"><span className="font-semibold">Admin (J. Doe):</span> Published new competency matrix for 2026-27.</p>
                </div>
                <div className="relative pl-6">
                  <div className="absolute w-3 h-3 bg-surface-variant rounded-full -left-[6.5px] top-1.5 border-2 border-surface-container-lowest"></div>
                  <p className="font-caption text-caption text-on-surface-variant mb-1">5 hours ago</p>
                  <p className="font-body-md text-body-md text-on-surface"><span className="font-semibold">Batch Process:</span> Weekly institutional readiness index synced successfully.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: AI Insights (1/3 width) */}
        <div className="lg:col-span-1 space-y-lg">
          <div className="bg-surface-container-lowest border border-surface-variant rounded-xl card-shadow overflow-hidden flex flex-col h-full">
            {/* Stylized AI Header */}
            <div className="bg-surface-container p-md border-b border-surface-variant relative overflow-hidden">
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary via-surface to-surface"></div>
              <h3 className="font-headline-sm text-headline-sm text-on-surface flex items-center gap-2 relative z-10">
                <Lightbulb className="text-primary" />
                AI Strategic Insights
              </h3>
              <p className="font-caption text-caption text-on-surface-variant relative z-10 mt-1">Generated dynamically based on cadre performance telemetry.</p>
            </div>
            <div className="p-md flex-1 space-y-md">
              {/* Insight Card 1 */}
              <div className="bg-surface-bright border border-surface-variant rounded-lg p-sm hover:border-outline-variant transition-colors">
                <div className="flex items-start gap-3">
                  <div className="bg-primary-fixed text-primary-container p-1 rounded-full shrink-0 mt-0.5">
                    <Sparkles className="text-[16px]" />
                  </div>
                  <div>
                    <h4 className="font-label-caps text-label-caps text-on-surface mb-1 uppercase tracking-wider">Emerging Pathway</h4>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">Cadres who finish 'Econometric Modeling' achieve 3.4x higher accuracy on field microdata audits.</p>
                  </div>
                </div>
              </div>
              {/* Insight Card 2 */}
              <div className="bg-surface-bright border border-surface-variant rounded-lg p-sm hover:border-outline-variant transition-colors">
                <div className="flex items-start gap-3">
                  <div className="bg-primary-fixed text-primary-container p-1 rounded-full shrink-0 mt-0.5">
                    <ArrowRight className="text-[16px]" />
                  </div>
                  <div>
                    <h4 className="font-label-caps text-label-caps text-on-surface mb-1 uppercase tracking-wider">Bottleneck Detected</h4>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">Module 3 of 'Advanced CPI Calculation' shows a 41% drop-off. Review module duration.</p>
                  </div>
                </div>
              </div>
              {/* Insight Card 3 */}
              <div className="bg-surface-bright border border-surface-variant rounded-lg p-sm hover:border-outline-variant transition-colors">
                <div className="flex items-start gap-3">
                  <div className="bg-primary-fixed text-primary-container p-1 rounded-full shrink-0 mt-0.5">
                    <Network className="text-[16px]" />
                  </div>
                  <div>
                    <h4 className="font-label-caps text-label-caps text-on-surface mb-1 uppercase tracking-wider">Competency Synergies</h4>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">Strong mutual correlation between 'Data Cleaning' and 'District Coordination' masteries.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-sm border-t border-surface-variant bg-surface-container-lowest">
              <button onClick={() => mutate()} className="w-full text-primary font-label-caps text-label-caps py-2 hover:bg-surface-container-low transition-colors rounded text-center uppercase tracking-wider">
                Refresh Insights
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
