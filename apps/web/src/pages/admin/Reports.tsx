import React from 'react';
import { Button } from '../../components/ui/Button';
import { Download, FileSpreadsheet, FileText, Grid3X3, Table, Wrench } from 'lucide-react';


export const Reports = () => {
  return (
    <div className="flex-1 overflow-y-auto bg-surface p-container-margin md:p-lg grid grid-cols-1 md:grid-cols-12 gap-xl font-body-md text-on-surface h-full animate-in fade-in duration-300">
      <style>
        {`
          .shadow-grounded { box-shadow: 0px 1px 3px rgba(26, 22, 20, 0.05); }
          .active-press:active { box-shadow: none; border-color: #D1C9C4; }
        `}
      </style>

      {/* Left Column: Report List */}
      <div className="md:col-span-8 flex flex-col gap-lg mt-sm">
        <header>
          <h1 className="font-display-lg text-display-lg text-on-surface mb-2">Central Governance Repository</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant">System-generated reports and official exports.</p>
        </header>
        
        <div className="flex flex-col gap-4">
          {/* Report Item 1 */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-md shadow-grounded flex justify-between items-center active-press transition-all cursor-pointer">
            <div className="flex items-center gap-md">
              <div className="p-3 bg-surface-container rounded-full text-primary">
                <FileText />
              </div>
              <div>
                <h3 className="font-headline-sm text-headline-sm text-on-surface">Q3 Institutional Skill Health Review</h3>
                <p className="font-body-md text-body-md text-on-surface-variant">Generated: Oct 01, 2026 • System Automated</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="text-primary hover:bg-surface-container p-2 rounded flex items-center gap-1 font-label-caps text-label-caps transition-colors uppercase">
                <FileText className="text-sm" /> PDF
              </button>
              <button className="text-primary hover:bg-surface-container p-2 rounded flex items-center gap-1 font-label-caps text-label-caps transition-colors uppercase">
                <FileSpreadsheet className="text-sm" /> CSV
              </button>
            </div>
          </div>

          {/* Report Item 2 */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-md shadow-grounded flex justify-between items-center active-press transition-all cursor-pointer">
            <div className="flex items-center gap-md">
              <div className="p-3 bg-surface-container rounded-full text-primary">
                <Table />
              </div>
              <div>
                <h3 className="font-headline-sm text-headline-sm text-on-surface">Annual Statistical Workforce Capability Matrix</h3>
                <p className="font-body-md text-body-md text-on-surface-variant">Generated: Jan 15, 2026 • Administrator Export</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="text-primary hover:bg-surface-container p-2 rounded flex items-center gap-1 font-label-caps text-label-caps transition-colors uppercase">
                <FileText className="text-sm" /> PDF
              </button>
              <button className="text-primary hover:bg-surface-container p-2 rounded flex items-center gap-1 font-label-caps text-label-caps transition-colors uppercase">
                <Grid3X3 className="text-sm" /> XLSX
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Custom Builder */}
      <div className="md:col-span-4 mt-sm">
        <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-lg shadow-grounded h-full">
          <div className="border-b border-outline-variant pb-4 mb-6">
            <h2 className="font-headline-md text-headline-md text-on-surface flex items-center gap-2">
              <Wrench className="text-primary" />
              Custom Builder
            </h2>
          </div>
          <form className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label className="font-label-caps text-label-caps text-on-surface-variant uppercase">Data Domain</label>
              <select className="w-full bg-surface-container-lowest border border-outline-variant rounded p-2 font-body-md text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-fixed transition-all cursor-pointer">
                <option>Workforce Readiness</option>
                <option>Compliance & Training</option>
                <option>Skill Gap Analysis</option>
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-label-caps text-label-caps text-on-surface-variant uppercase">Date Range</label>
              <div className="flex gap-2">
                <input className="w-1/2 bg-surface-container-lowest border border-outline-variant rounded p-2 font-body-md text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-fixed transition-all" type="date" />
                <span className="self-center text-on-surface-variant">-</span>
                <input className="w-1/2 bg-surface-container-lowest border border-outline-variant rounded p-2 font-body-md text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-fixed transition-all" type="date" />
              </div>
            </div>
            <button className="mt-4 w-full bg-primary text-on-primary font-label-caps text-label-caps py-3 rounded flex justify-center items-center gap-2 hover:bg-surface-tint transition-colors uppercase tracking-wider shadow-sm" type="button">
              <Download className="text-sm" />
              Generate Report
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
