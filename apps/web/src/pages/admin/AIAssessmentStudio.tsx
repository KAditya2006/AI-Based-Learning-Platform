import React from 'react';
import { Button } from '../../components/ui/Button';
import { Check, ChevronRight, Sparkles, Trash2, ZoomIn, ZoomOut } from 'lucide-react';


export const AIAssessmentStudio = () => {
  return (
    <div className="flex-1 flex flex-col md:flex-row p-md lg:p-lg gap-lg overflow-y-auto bg-surface min-h-[calc(100vh-56px)] font-body-md text-on-surface animate-in fade-in duration-300">
      <style>
        {`
          .surface-card {
            background-color: var(--tw-colors-surface-container-lowest, #FFFFFF);
            border: 1px solid var(--tw-colors-outline-variant, #E8E2DE);
            box-shadow: 0px 1px 3px rgba(26, 22, 20, 0.05);
          }
          .surface-card:active {
            box-shadow: none;
            border-color: #D1C9C4;
          }
        `}
      </style>

      {/* Left Pane: Source Document */}
      <section className="flex-1 flex flex-col surface-card rounded-lg overflow-hidden h-[calc(100vh-100px)]">
        <header className="p-md border-b border-outline-variant bg-surface-container-low flex justify-between items-center">
          <div>
            <h3 className="font-headline-sm text-headline-sm text-on-surface">Source Document Review</h3>
            <p className="font-caption text-caption text-on-surface-variant">ID: DOC-2024-892 • National Statistical Systems Engineering Profile</p>
          </div>
          <div className="flex gap-2">
            <button className="p-2 text-primary hover:bg-surface-container transition-colors rounded">
              <ZoomIn />
            </button>
            <button className="p-2 text-primary hover:bg-surface-container transition-colors rounded">
              <ZoomOut />
            </button>
          </div>
        </header>
        
        <div className="flex-1 p-lg overflow-y-auto bg-surface-lowest relative">
          {/* Simulated Document Content */}
          <div className="max-w-3xl mx-auto font-body-lg text-body-lg text-on-surface leading-relaxed">
            <h1 className="font-display-lg text-display-lg mb-6 text-on-surface">Senior Statistical Officer - Data Informatics</h1>
            <p className="mb-4">
              The Senior Statistical Officer is responsible for overarching data pipeline architecture, national indicator calculation, and integration of administrative records across central ministries.
            </p>
            <p className="mb-4">
              Key responsibilities include{' '}
              <span className="bg-primary-fixed-dim bg-opacity-30 border-b-2 border-primary px-1 cursor-pointer transition-colors hover:bg-opacity-50" title="Extracted Skill: National Indicator Modeling">designing resilient statistical pipelines and index aggregation models</span>{' '}
              that can handle asynchronous data streams from district centers. The candidate must possess deep knowledge of{' '}
              <span className="bg-primary-fixed-dim bg-opacity-30 border-b-2 border-primary px-1 cursor-pointer transition-colors hover:bg-opacity-50" title="Extracted Skill: Microdata Dissemination Standards">Microdata Dissemination Standards</span> and{' '}
              <span className="bg-primary-fixed-dim bg-opacity-30 border-b-2 border-primary px-1 cursor-pointer transition-colors hover:bg-opacity-50" title="Extracted Skill: Time-Series Econometric Analysis">time-series econometric analysis</span>.
            </p>
            <p className="mb-4">
              Furthermore, the role demands strong leadership in{' '}
              <span className="bg-primary-fixed-dim bg-opacity-30 border-b-2 border-primary px-1 cursor-pointer transition-colors hover:bg-opacity-50" title="Extracted Skill: Inter-Agency Coordination">inter-agency coordination and statistical capacity building</span>, guiding state officers through standardized{' '}
              <span className="bg-primary-fixed-dim bg-opacity-30 border-b-2 border-primary px-1 cursor-pointer transition-colors hover:bg-opacity-50" title="Extracted Skill: Survey Quality Assurance">survey quality assurance frameworks</span> and automated auditing pipelines.
            </p>
          </div>
        </div>
      </section>

      {/* Right Pane: AI Extraction Review */}
      <section className="w-full md:w-96 flex flex-col surface-card rounded-lg overflow-hidden h-[calc(100vh-100px)]">
        <header className="p-md border-b border-outline-variant bg-surface-container-low">
          <h3 className="font-headline-sm text-headline-sm text-on-surface flex items-center gap-2">
            <Sparkles className="text-primary" />
            AI Extraction Review
          </h3>
          <p className="font-caption text-caption text-on-surface-variant mt-1">4 Competency nodes identified pending validation</p>
        </header>
        
        <div className="flex-1 p-md overflow-y-auto flex flex-col gap-md">
          {/* Skill Item 1 */}
          <div className="border border-outline-variant rounded-lg p-md bg-surface-container-lowest">
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-headline-sm text-headline-sm text-on-surface">Statistical Pipelines</h4>
              <span className="font-label-caps text-label-caps text-secondary bg-secondary-fixed-dim px-2 py-1 rounded">98% Match</span>
            </div>
            <div className="mb-4">
              <p className="font-caption text-caption text-on-surface-variant mb-1">Suggested Taxonomy Path:</p>
              <p className="font-body-md text-body-md text-on-surface flex items-center gap-1">
                Data & Statistics <ChevronRight className="text-[16px]" /> Architecture
              </p>
            </div>
            <div className="flex gap-2">
              <button className="flex-1 bg-primary text-on-primary py-2 rounded font-label-caps text-label-caps flex justify-center items-center gap-1 hover:bg-primary-container transition-colors uppercase">
                <Check className="text-[18px]" /> Approve
              </button>
              <button className="flex-1 bg-surface border border-primary text-primary py-2 rounded font-label-caps text-label-caps hover:bg-surface-container transition-colors uppercase">
                Modify
              </button>
              <button className="p-2 text-on-surface-variant rounded border border-outline-variant hover:bg-error-container hover:text-error transition-colors">
                <Trash2 className="text-[18px]" />
              </button>
            </div>
          </div>
          
          {/* Skill Item 2 */}
          <div className="border border-outline-variant rounded-lg p-md bg-surface-container-lowest">
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-headline-sm text-headline-sm text-on-surface">Time-Series Modeling</h4>
              <span className="font-label-caps text-label-caps text-secondary bg-secondary-fixed-dim px-2 py-1 rounded">92% Match</span>
            </div>
            <div className="mb-4">
              <p className="font-caption text-caption text-on-surface-variant mb-1">Suggested Taxonomy Path:</p>
              <p className="font-body-md text-body-md text-on-surface flex items-center gap-1">
                Analytics <ChevronRight className="text-[16px]" /> Econometrics
              </p>
            </div>
            <div className="flex gap-2">
              <button className="flex-1 bg-primary text-on-primary py-2 rounded font-label-caps text-label-caps flex justify-center items-center gap-1 hover:bg-primary-container transition-colors uppercase">
                <Check className="text-[18px]" /> Approve
              </button>
              <button className="flex-1 bg-surface border border-primary text-primary py-2 rounded font-label-caps text-label-caps hover:bg-surface-container transition-colors uppercase">
                Modify
              </button>
              <button className="p-2 text-on-surface-variant rounded border border-outline-variant hover:bg-error-container hover:text-error transition-colors">
                <Trash2 className="text-[18px]" />
              </button>
            </div>
          </div>
        </div>
        
        <footer className="p-md border-t border-outline-variant bg-surface-container-low flex justify-end gap-md">
          <button className="text-primary font-label-caps text-label-caps px-4 py-2 hover:bg-surface-container transition-colors uppercase">Save Progress</button>
          <button className="bg-primary text-on-primary font-label-caps text-label-caps px-6 py-2 rounded hover:bg-primary-container transition-colors uppercase">Submit All</button>
        </footer>
      </section>
    </div>
  );
};
