import React, { useEffect, useState } from 'react';
import { assessmentApi } from '../../api/assessments';
import type { Question } from '../../api/assessments';
import { Button } from '../../components/ui/Button';
import { ChevronLeft, ChevronRight, FilterX, Plus, Search } from 'lucide-react';


export const QuestionBank: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const data = await assessmentApi.getQuestions();
        setQuestions(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, []);

  return (
    <div className="flex-1 w-full max-w-7xl mx-auto px-lg md:px-xl py-xl space-y-xl bg-background font-body-md text-on-surface h-full overflow-y-auto animate-in fade-in duration-300">
      {/* Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-lg border-b border-outline-variant pb-md mt-sm">
        <div>
          <h2 className="font-headline-md text-headline-md text-on-background mb-xs">Question Bank Repository</h2>
          <p className="font-body-md text-body-md text-on-surface-variant">Manage, review, and filter institutional assessment items.</p>
        </div>
        <div className="flex items-center gap-sm">
          <button className="bg-surface border border-primary text-primary px-md py-sm rounded font-label-caps text-label-caps hover:bg-surface-container-low transition-colors uppercase">
            Import CSV
          </button>
          <button className="bg-primary text-on-primary px-md py-sm rounded font-label-caps text-label-caps hover:bg-primary-container transition-colors shadow-sm flex items-center gap-xs uppercase">
            <Plus className="text-[18px]" />
            New Question
          </button>
        </div>
      </div>

      {/* Filters & Search Bar */}
      <div className="bg-surface border border-outline-variant rounded-xl p-md shadow-[0px_1px_3px_rgba(26,22,20,0.05)] flex flex-col md:flex-row gap-md items-center">
        <div className="relative w-full md:w-96 flex-1">
          <Search className="absolute left-sm top-1/2 -translate-y-1/2 text-on-surface-variant" />
          <input 
            className="w-full bg-surface-container-lowest border border-outline-variant rounded pl-[40px] pr-md py-sm font-body-md text-body-md text-on-surface focus:border-primary focus:ring-2 focus:ring-[#FCDCCC] focus:outline-none transition-all placeholder:text-on-surface-variant/60" 
            placeholder="Search questions, tags, or sources..." 
            type="text"
          />
        </div>
        <div className="flex flex-wrap items-center gap-sm w-full md:w-auto">
          <div className="flex items-center gap-xs bg-surface-container border border-outline-variant rounded px-sm py-xs">
            <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">Status:</span>
            <select className="bg-transparent border-none text-body-md font-body-md text-on-surface py-0 pl-xs pr-lg focus:ring-0 cursor-pointer appearance-none">
              <option>Needs Review</option>
              <option>Approved</option>
              <option>Draft</option>
              <option>Archived</option>
            </select>
          </div>
          <div className="flex items-center gap-xs bg-surface-container border border-outline-variant rounded px-sm py-xs">
            <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">Competency:</span>
            <select className="bg-transparent border-none text-body-md font-body-md text-on-surface py-0 pl-xs pr-lg focus:ring-0 cursor-pointer appearance-none">
              <option>All Areas</option>
              <option>Data Analysis</option>
              <option>Policy Formulation</option>
              <option>Cybersecurity</option>
            </select>
          </div>
          <button className="text-primary p-xs hover:bg-surface-container rounded transition-colors" title="Clear Filters">
            <FilterX />
          </button>
        </div>
      </div>

      {/* Question List (Stacked Records) */}
      <div className="flex flex-col gap-md">
        {loading ? (
          <div className="p-8 text-center text-on-surface-variant font-body-md">Loading questions...</div>
        ) : questions.length === 0 ? (
          <>
            {/* Record Item 1 */}
            <div className="bg-surface border border-outline-variant rounded-lg p-md shadow-[0px_1px_3px_rgba(26,22,20,0.05)] hover:border-outline transition-colors group cursor-pointer">
              <div className="flex flex-col md:flex-row justify-between gap-md">
                <div className="flex-1">
                  <div className="flex items-center gap-sm mb-sm">
                    <span className="bg-surface-container-highest text-on-surface px-xs py-[2px] rounded font-label-caps text-[10px] tracking-wider uppercase">ID: Q-8472</span>
                    <span className="bg-[#FCDCCC] text-[#1A1614] px-sm py-[2px] rounded font-label-caps text-[10px] uppercase">Data Analysis</span>
                    <span className="border border-outline-variant text-on-surface-variant px-sm py-[2px] rounded font-label-caps text-[10px] uppercase">Intermediate</span>
                  </div>
                  <h3 className="font-headline-sm text-headline-sm text-on-background mb-xs">Evaluate the validity of a multivariable regression model given a specific dataset.</h3>
                  <p className="font-body-md text-body-md text-on-surface-variant line-clamp-2">The candidate is provided with a sample housing dataset and asked to identify potential issues with collinearity and suggest corrective actions before finalizing the model...</p>
                </div>
                <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-start gap-sm min-w-[120px] border-t md:border-t-0 md:border-l border-outline-variant pt-sm md:pt-0 md:pl-md mt-sm md:mt-0">
                  <div className="flex items-center gap-xs">
                    <span className="w-2 h-2 rounded-full bg-error"></span>
                    <span className="font-label-caps text-label-caps text-on-surface uppercase">Needs Review</span>
                  </div>
                  <div className="text-right">
                    <p className="font-caption text-caption text-on-surface-variant uppercase">Source</p>
                    <p className="font-body-md text-body-md text-on-surface font-medium">Economic Statistics Wing</p>
                  </div>
                  <button className="md:mt-auto text-primary opacity-0 group-hover:opacity-100 transition-opacity font-label-caps text-label-caps hover:underline uppercase">
                    Edit Item
                  </button>
                </div>
              </div>
            </div>

            {/* Record Item 2 */}
            <div className="bg-surface border border-outline-variant rounded-lg p-md shadow-[0px_1px_3px_rgba(26,22,20,0.05)] hover:border-outline transition-colors group cursor-pointer">
              <div className="flex flex-col md:flex-row justify-between gap-md">
                <div className="flex-1">
                  <div className="flex items-center gap-sm mb-sm">
                    <span className="bg-surface-container-highest text-on-surface px-xs py-[2px] rounded font-label-caps text-[10px] tracking-wider uppercase">ID: Q-9103</span>
                    <span className="bg-[#FCDCCC] text-[#1A1614] px-sm py-[2px] rounded font-label-caps text-[10px] uppercase">Policy Formulation</span>
                    <span className="border border-outline-variant text-on-surface-variant px-sm py-[2px] rounded font-label-caps text-[10px] uppercase">Advanced</span>
                  </div>
                  <h3 className="font-headline-sm text-headline-sm text-on-background mb-xs">Draft an executive summary assessing the impact of new national accounts guidelines.</h3>
                  <p className="font-body-md text-body-md text-on-surface-variant line-clamp-2">Candidates must synthesize three distinct reports on state domestic product estimates and create a one-page summary intended for a high-level coordination committee.</p>
                </div>
                <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-start gap-sm min-w-[120px] border-t md:border-t-0 md:border-l border-outline-variant pt-sm md:pt-0 md:pl-md mt-sm md:mt-0">
                  <div className="flex items-center gap-xs">
                    <span className="w-2 h-2 rounded-full bg-primary"></span>
                    <span className="font-label-caps text-label-caps text-on-surface uppercase">Approved</span>
                  </div>
                  <div className="text-right">
                    <p className="font-caption text-caption text-on-surface-variant uppercase">Source</p>
                    <p className="font-body-md text-body-md text-on-surface font-medium">National Accounts Div</p>
                  </div>
                  <button className="md:mt-auto text-primary opacity-0 group-hover:opacity-100 transition-opacity font-label-caps text-label-caps hover:underline uppercase">
                    Edit Item
                  </button>
                </div>
              </div>
            </div>

            {/* Record Item 3 */}
            <div className="bg-surface border border-outline-variant rounded-lg p-md shadow-[0px_1px_3px_rgba(26,22,20,0.05)] hover:border-outline transition-colors group cursor-pointer opacity-75">
              <div className="flex flex-col md:flex-row justify-between gap-md">
                <div className="flex-1">
                  <div className="flex items-center gap-sm mb-sm">
                    <span className="bg-surface-container-highest text-on-surface px-xs py-[2px] rounded font-label-caps text-[10px] tracking-wider uppercase">ID: Q-2281</span>
                    <span className="bg-[#FCDCCC] text-[#1A1614] px-sm py-[2px] rounded font-label-caps text-[10px] uppercase">Cybersecurity</span>
                    <span className="border border-outline-variant text-on-surface-variant px-sm py-[2px] rounded font-label-caps text-[10px] uppercase">Beginner</span>
                  </div>
                  <h3 className="font-headline-sm text-headline-sm text-on-background mb-xs">Identify common security indicators in official survey database access requests.</h3>
                  <p className="font-body-md text-body-md text-on-surface-variant line-clamp-2">Multiple choice scenario presenting authentication records. User must identify unauthorized credential sharing patterns...</p>
                </div>
                <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-start gap-sm min-w-[120px] border-t md:border-t-0 md:border-l border-outline-variant pt-sm md:pt-0 md:pl-md mt-sm md:mt-0">
                  <div className="flex items-center gap-xs">
                    <span className="w-2 h-2 rounded-full bg-outline-variant"></span>
                    <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">Draft</span>
                  </div>
                  <div className="text-right">
                    <p className="font-caption text-caption text-on-surface-variant uppercase">Source</p>
                    <p className="font-body-md text-body-md text-on-surface font-medium">IT Security SME</p>
                  </div>
                  <button className="md:mt-auto text-primary opacity-0 group-hover:opacity-100 transition-opacity font-label-caps text-label-caps hover:underline uppercase">
                    Edit Item
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : (
          questions.map((q, idx) => {
            const qId = q._id || q.id || `Q-${idx}`;
            const compName = typeof q.competency === 'object' ? q.competency?.name : (q.competency_id || q.competency || 'General');
            return (
              <div key={qId} className="bg-surface border border-outline-variant rounded-lg p-md shadow-[0px_1px_3px_rgba(26,22,20,0.05)] hover:border-outline transition-colors group cursor-pointer">
                <div className="flex flex-col md:flex-row justify-between gap-md">
                  <div className="flex-1">
                    <div className="flex items-center gap-sm mb-sm flex-wrap">
                      <span className="bg-surface-container-highest text-on-surface px-xs py-[2px] rounded font-label-caps text-[10px] tracking-wider uppercase">ID: {qId.substring(0,6)}</span>
                      <span className="bg-[#FCDCCC] text-[#1A1614] px-sm py-[2px] rounded font-label-caps text-[10px] uppercase">{compName}</span>
                      <span className="border border-outline-variant text-on-surface-variant px-sm py-[2px] rounded font-label-caps text-[10px] uppercase">Level {q.difficulty}</span>
                    </div>
                    <h3 className="font-headline-sm text-headline-sm text-on-background mb-xs">{q.text}</h3>
                    <p className="font-body-md text-body-md text-on-surface-variant line-clamp-2">
                      {q.options && q.options.length > 0 ? `Options: ${q.options.map(o => o.text).join(', ')}` : 'No options provided.'}
                    </p>
                  </div>
                  <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-start gap-sm min-w-[120px] border-t md:border-t-0 md:border-l border-outline-variant pt-sm md:pt-0 md:pl-md mt-sm md:mt-0">
                    <div className="flex items-center gap-xs">
                      <span className="w-2 h-2 rounded-full bg-primary"></span>
                      <span className="font-label-caps text-label-caps text-on-surface uppercase">Approved</span>
                    </div>
                    <div className="text-right">
                      <p className="font-caption text-caption text-on-surface-variant uppercase">Source</p>
                      <p className="font-body-md text-body-md text-on-surface font-medium">Internal</p>
                    </div>
                    <button className="md:mt-auto text-primary opacity-0 group-hover:opacity-100 transition-opacity font-label-caps text-label-caps hover:underline uppercase">
                      Edit Item
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between border-t border-outline-variant pt-md">
        <span className="font-caption text-caption text-on-surface-variant">Showing 1-3 of {questions.length > 0 ? questions.length : 42} items</span>
        <div className="flex gap-sm">
          <button className="p-xs rounded hover:bg-surface-container text-on-surface-variant disabled:opacity-50" disabled>
            <ChevronLeft />
          </button>
          <button className="w-8 h-8 rounded bg-primary-container text-on-primary-container font-body-md font-medium flex items-center justify-center">1</button>
          <button className="w-8 h-8 rounded hover:bg-surface-container text-on-surface font-body-md flex items-center justify-center">2</button>
          <button className="w-8 h-8 rounded hover:bg-surface-container text-on-surface font-body-md flex items-center justify-center">3</button>
          <button className="p-xs rounded hover:bg-surface-container text-on-surface-variant">
            <ChevronRight />
          </button>
        </div>
      </div>
    </div>
  );
};
