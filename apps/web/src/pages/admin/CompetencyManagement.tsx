import React from 'react';
import useSWR from 'swr';
import { fetchClient } from '../../api/client';
import { Button } from '../../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, Database, Gavel, Plus, Shield } from 'lucide-react';


export const CompetencyManagement = () => {
  const navigate = useNavigate();

  return (
    <div className="flex-1 overflow-y-auto p-lg flex flex-col gap-xl font-body-md text-on-surface bg-background h-full animate-in fade-in duration-300">
      <style>
        {`
          .card-shadow { box-shadow: 0px 1px 3px rgba(26, 22, 20, 0.05); }
        `}
      </style>

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end border-b border-outline-variant pb-md gap-md mt-sm">
        <div>
          <h2 className="font-display-lg text-display-lg text-on-surface">Competency Framework</h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant mt-sm">Management of organizational skill domains.</p>
        </div>
        <div className="flex gap-md">
          <button className="px-md py-sm rounded border border-primary text-primary font-label-caps text-label-caps hover:bg-surface-container transition-colors uppercase tracking-wider">
            Export Matrix
          </button>
          <button className="px-md py-sm rounded bg-primary text-on-primary font-label-caps text-label-caps hover:bg-primary-container transition-colors flex items-center gap-sm uppercase tracking-wider shadow-sm">
            <Plus className="text-[18px]" />
            Add Domain
          </button>
        </div>
      </div>

      {/* Framework Tree / Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-lg">
        {/* Domain: Data Science */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-lg card-shadow">
          <div className="flex items-center justify-between mb-md border-b border-outline-variant pb-sm">
            <h3 className="font-headline-md text-headline-md text-on-surface flex items-center gap-sm">
              <Database className="text-tertiary" />
              Data Science
            </h3>
            <span className="font-caption text-caption text-on-surface-variant">12 Competencies</span>
          </div>
          <div className="flex flex-col gap-sm">
            <details className="group border border-surface-container-high rounded bg-background cursor-pointer" open>
              <summary className="flex items-center justify-between p-sm font-label-caps text-label-caps text-on-surface list-none uppercase tracking-wider">
                <span>Machine Learning</span>
                <ChevronDown className="group-open:rotate-180 transition-transform" />
              </summary>
              <div className="p-sm border-t border-surface-container-high text-body-md text-on-surface-variant">
                <ul className="list-disc list-inside space-y-1">
                  <li>L1: Understanding Basic Algorithms</li>
                  <li>L2: Applying Supervised Learning</li>
                  <li>L3: Model Tuning & Deployment</li>
                </ul>
                <div className="mt-sm flex flex-wrap gap-xs">
                  <span className="bg-[#FCDCCC] text-[#1A1614] px-sm py-xs rounded font-caption text-caption uppercase">Data Scientist</span>
                  <span className="bg-[#FCDCCC] text-[#1A1614] px-sm py-xs rounded font-caption text-caption uppercase">ML Engineer</span>
                </div>
              </div>
            </details>
            <details className="group border border-surface-container-high rounded bg-background cursor-pointer">
              <summary className="flex items-center justify-between p-sm font-label-caps text-label-caps text-on-surface list-none uppercase tracking-wider">
                <span>Statistical Analysis</span>
                <ChevronDown className="group-open:rotate-180 transition-transform" />
              </summary>
              <div className="p-sm border-t border-surface-container-high text-body-md text-on-surface-variant">
                <ul className="list-disc list-inside space-y-1">
                  <li>L1: Descriptive Statistics</li>
                  <li>L2: Hypothesis Testing</li>
                </ul>
              </div>
            </details>
          </div>
        </div>

        {/* Domain: Policy Analysis */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-lg card-shadow">
          <div className="flex items-center justify-between mb-md border-b border-outline-variant pb-sm">
            <h3 className="font-headline-md text-headline-md text-on-surface flex items-center gap-sm">
              <Gavel className="text-tertiary" />
              Policy Analysis
            </h3>
            <span className="font-caption text-caption text-on-surface-variant">8 Competencies</span>
          </div>
          <div className="flex flex-col gap-sm">
            <details className="group border border-surface-container-high rounded bg-background cursor-pointer" open>
              <summary className="flex items-center justify-between p-sm font-label-caps text-label-caps text-on-surface list-none uppercase tracking-wider">
                <span>Legislative Drafting</span>
                <ChevronDown className="group-open:rotate-180 transition-transform" />
              </summary>
              <div className="p-sm border-t border-surface-container-high text-body-md text-on-surface-variant">
                <ul className="list-disc list-inside space-y-1">
                  <li>L1: Basic Structural Drafting</li>
                  <li>L2: Regulatory Compliance Review</li>
                  <li>L3: Complex Policy Translation</li>
                </ul>
                <div className="mt-sm flex flex-wrap gap-xs">
                  <span className="bg-[#FCDCCC] text-[#1A1614] px-sm py-xs rounded font-caption text-caption uppercase">Policy Advisor</span>
                </div>
              </div>
            </details>
            <details className="group border border-surface-container-high rounded bg-background cursor-pointer">
              <summary className="flex items-center justify-between p-sm font-label-caps text-label-caps text-on-surface list-none uppercase tracking-wider">
                <span>Stakeholder Engagement</span>
                <ChevronDown className="group-open:rotate-180 transition-transform" />
              </summary>
              <div className="p-sm border-t border-surface-container-high text-body-md text-on-surface-variant">
                <p>Content for Stakeholder Engagement.</p>
              </div>
            </details>
          </div>
        </div>

        {/* Domain: Cybersecurity */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-lg card-shadow">
          <div className="flex items-center justify-between mb-md border-b border-outline-variant pb-sm">
            <h3 className="font-headline-md text-headline-md text-on-surface flex items-center gap-sm">
              <Shield className="text-tertiary" />
              Cybersecurity
            </h3>
            <span className="font-caption text-caption text-on-surface-variant">15 Competencies</span>
          </div>
          <div className="flex flex-col gap-sm">
            <details className="group border border-surface-container-high rounded bg-background cursor-pointer" open>
              <summary className="flex items-center justify-between p-sm font-label-caps text-label-caps text-on-surface list-none uppercase tracking-wider">
                <span>Threat Intelligence</span>
                <ChevronDown className="group-open:rotate-180 transition-transform" />
              </summary>
              <div className="p-sm border-t border-surface-container-high text-body-md text-on-surface-variant">
                <ul className="list-disc list-inside space-y-1">
                  <li>L1: Identifying Common Threats</li>
                  <li>L2: Advanced Persistent Threat (APT) Analysis</li>
                </ul>
                <div className="mt-sm flex flex-wrap gap-xs">
                  <span className="bg-[#FCDCCC] text-[#1A1614] px-sm py-xs rounded font-caption text-caption uppercase">Security Analyst</span>
                </div>
              </div>
            </details>
          </div>
        </div>
      </div>
    </div>
  );
};
