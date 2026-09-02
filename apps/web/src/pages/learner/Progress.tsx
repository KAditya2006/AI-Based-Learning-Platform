import React from 'react';
import { Button } from '../../components/ui/Button';
import { Award, BadgeCheck, Clock, Download, Dumbbell, Medal, TrendingUp } from 'lucide-react';


export const Progress = () => {
  return (
    <div className="flex-grow max-w-screen-2xl mx-auto w-full px-lg py-xl flex flex-col gap-xl font-body-md text-on-surface bg-background animate-in fade-in duration-300">
      <style>
        {`
          .grounded-shadow {
            box-shadow: 0px 1px 3px rgba(26, 22, 20, 0.05);
          }
          @keyframes growUp {
            from { height: 0; opacity: 0; }
            to { opacity: 1; }
          }
          .chart-bar {
            animation: growUp 1s ease-out forwards;
            transform-origin: bottom;
          }
        `}
      </style>
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-md mt-xl">
        <div>
          <h1 className="font-display-lg text-display-lg text-on-surface mb-xs">Development Progress Trends</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant">Track your competency growth and learning achievements over time.</p>
        </div>
        <div className="flex gap-sm">
          <select className="bg-surface-container-lowest border border-surface-variant text-on-surface rounded font-body-md text-body-md px-3 py-2 focus:border-primary focus:ring-2 focus:ring-primary-fixed-dim outline-none transition-all cursor-pointer">
            <option>Last 6 Months</option>
            <option>Year to Date</option>
            <option>All Time</option>
          </select>
        </div>
      </div>

      {/* KPI Cards Layer */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
        {/* KPI 1 */}
        <div className="bg-surface-container-lowest border border-surface-variant rounded-xl p-lg grounded-shadow flex flex-col justify-between h-32 hover:border-outline-variant transition-colors group cursor-pointer">
          <div className="flex justify-between items-start">
            <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">Overall Growth</span>
            <div className="bg-primary-fixed text-primary-container p-1 rounded">
              <TrendingUp className="text-[20px]" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-display-lg text-display-lg text-on-surface">+18.5%</span>
            <span className="font-caption text-caption text-secondary-container">vs last period</span>
          </div>
        </div>
        
        {/* KPI 2 */}
        <div className="bg-surface-container-lowest border border-surface-variant rounded-xl p-lg grounded-shadow flex flex-col justify-between h-32 hover:border-outline-variant transition-colors group cursor-pointer">
          <div className="flex justify-between items-start">
            <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">Learning Hours</span>
            <div className="bg-surface-container text-on-surface-variant p-1 rounded">
              <Clock className="text-[20px]" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-display-lg text-display-lg text-on-surface">142h</span>
            <span className="font-caption text-caption text-on-surface-variant">YTD total</span>
          </div>
        </div>
        
        {/* KPI 3 */}
        <div className="bg-surface-container-lowest border border-surface-variant rounded-xl p-lg grounded-shadow flex flex-col justify-between h-32 hover:border-outline-variant transition-colors group cursor-pointer">
          <div className="flex justify-between items-start">
            <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">Assessment Pass Rate</span>
            <div className="bg-surface-container text-on-surface-variant p-1 rounded">
              <BadgeCheck className="text-[20px]" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-display-lg text-display-lg text-on-surface">94%</span>
            <span className="font-caption text-caption text-on-surface-variant">Across 12 exams</span>
          </div>
        </div>
      </div>

      {/* Main Data Grid (Bento Layout) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg h-full">
        {/* Large Chart Area (Spans 2 columns) */}
        <div className="lg:col-span-2 bg-surface-container-lowest border border-surface-variant rounded-xl p-lg grounded-shadow flex flex-col min-h-[400px]">
          <div className="flex justify-between items-center mb-xl border-b border-surface-variant pb-md">
            <h2 className="font-headline-sm text-headline-sm text-on-surface">Monthly Competency Growth</h2>
            <button className="text-primary hover:text-primary-container font-label-caps text-label-caps transition-colors flex items-center gap-1 uppercase">
              <Download className="text-[16px]" /> EXPORT
            </button>
          </div>
          
          {/* Simulated High-Density Bar Chart */}
          <div className="flex-grow flex items-end gap-1 sm:gap-2 pb-6 relative min-h-[250px]">
            {/* Y-Axis Lines (Background) */}
            <div className="absolute inset-0 flex flex-col justify-between pb-6 pointer-events-none">
              <div className="border-t border-surface-variant w-full"></div>
              <div className="border-t border-surface-variant w-full"></div>
              <div className="border-t border-surface-variant w-full"></div>
              <div className="border-t border-surface-variant w-full"></div>
            </div>
            
            {/* Bars (Simulated Data) */}
            <div className="flex-1 flex flex-col justify-end group z-10 h-full">
              <div className="w-full bg-surface-container-high rounded-t-sm chart-bar relative hover:bg-primary-fixed-dim transition-colors cursor-pointer" style={{ height: '30%' }}>
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-inverse-surface text-inverse-on-surface font-caption text-caption px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Jan: 30</div>
              </div>
            </div>
            <div className="flex-1 flex flex-col justify-end group z-10 h-full">
              <div className="w-full bg-surface-container-high rounded-t-sm chart-bar relative hover:bg-primary-fixed-dim transition-colors cursor-pointer" style={{ height: '45%' }}></div>
            </div>
            <div className="flex-1 flex flex-col justify-end group z-10 h-full">
              <div className="w-full bg-surface-container-high rounded-t-sm chart-bar relative hover:bg-primary-fixed-dim transition-colors cursor-pointer" style={{ height: '40%' }}></div>
            </div>
            <div className="flex-1 flex flex-col justify-end group z-10 h-full">
              <div className="w-full bg-primary rounded-t-sm chart-bar relative shadow-sm cursor-pointer" style={{ height: '65%' }}>
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-inverse-surface text-inverse-on-surface font-caption text-caption px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Apr: 65</div>
              </div>
            </div>
            <div className="flex-1 flex flex-col justify-end group z-10 h-full">
              <div className="w-full bg-surface-container-high rounded-t-sm chart-bar relative hover:bg-primary-fixed-dim transition-colors cursor-pointer" style={{ height: '55%' }}></div>
            </div>
            <div className="flex-1 flex flex-col justify-end group z-10 h-full">
              <div className="w-full bg-surface-container-high rounded-t-sm chart-bar relative hover:bg-primary-fixed-dim transition-colors cursor-pointer" style={{ height: '70%' }}></div>
            </div>
            <div className="flex-1 flex flex-col justify-end group z-10 h-full">
              <div className="w-full bg-surface-container-high rounded-t-sm chart-bar relative hover:bg-primary-fixed-dim transition-colors cursor-pointer" style={{ height: '85%' }}></div>
            </div>
            <div className="flex-1 flex flex-col justify-end group z-10 h-full">
              <div className="w-full bg-primary rounded-t-sm chart-bar relative shadow-sm cursor-pointer" style={{ height: '95%' }}>
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-inverse-surface text-inverse-on-surface font-caption text-caption px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Aug: 95</div>
              </div>
            </div>
            
            {/* X-Axis Labels */}
            <div className="absolute bottom-0 w-full flex justify-between text-on-surface-variant font-caption text-caption px-2">
              <span>Jan</span>
              <span>Feb</span>
              <span>Mar</span>
              <span className="text-primary font-bold">Apr</span>
              <span>May</span>
              <span>Jun</span>
              <span>Jul</span>
              <span className="text-primary font-bold">Aug</span>
            </div>
          </div>
        </div>
        
        {/* Right Column Stack */}
        <div className="flex flex-col gap-lg">
          {/* Monthly Goal Tracker */}
          <div className="bg-surface-container-lowest border border-surface-variant rounded-xl p-lg grounded-shadow">
            <h2 className="font-headline-sm text-headline-sm text-on-surface mb-md">Current Goal</h2>
            <div className="mb-4">
              <div className="flex justify-between items-end mb-2">
                <span className="font-body-lg text-body-lg text-on-surface font-semibold">Data Science Fundamentals</span>
                <span className="font-caption text-caption text-on-surface-variant">75% Complete</span>
              </div>
              <div className="w-full h-2 bg-surface-variant rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full transition-all duration-500 ease-out" style={{ width: '75%' }}></div>
              </div>
            </div>
            <p className="font-caption text-caption text-on-surface-variant mb-4">Target completion: End of current month. 2 modules remaining.</p>
            <button className="w-full py-2 bg-surface text-primary border border-primary font-label-caps text-label-caps rounded hover:bg-primary-fixed transition-colors uppercase">
              CONTINUE LEARNING
            </button>
          </div>
          
          {/* Recent Achievements */}
          <div className="bg-surface-container-lowest border border-surface-variant rounded-xl p-lg grounded-shadow flex-grow">
            <h2 className="font-headline-sm text-headline-sm text-on-surface mb-md border-b border-surface-variant pb-2">Recent Achievements</h2>
            <div className="flex flex-col gap-4">
              
              {/* Item 1 */}
              <div className="flex gap-md items-start p-3 bg-surface-container-low rounded-lg hover:bg-surface-container-high transition-colors cursor-pointer border border-transparent hover:border-surface-variant">
                <div className="bg-primary-fixed text-primary-container p-2 rounded-full flex-shrink-0">
                  <Medal className="text-[20px]" />
                </div>
                <div>
                  <h3 className="font-body-md text-body-md text-on-surface font-semibold">Advanced Analytics Badge</h3>
                  <p className="font-caption text-caption text-on-surface-variant mt-0.5">Awarded 2 days ago for completing the senior cohort assessment.</p>
                </div>
              </div>
              
              {/* Item 2 */}
              <div className="flex gap-md items-start p-3 bg-surface-container-low rounded-lg hover:bg-surface-container-high transition-colors cursor-pointer border border-transparent hover:border-surface-variant">
                <div className="bg-surface-container text-on-surface-variant p-2 rounded-full flex-shrink-0">
                  <Award className="text-[20px]" />
                </div>
                <div>
                  <h3 className="font-body-md text-body-md text-on-surface font-semibold">Top 10% Contributor</h3>
                  <p className="font-caption text-caption text-on-surface-variant mt-0.5">Recognized in the Q3 peer review cycle.</p>
                </div>
              </div>
              
              {/* Item 3 */}
              <div className="flex gap-md items-start p-3 bg-surface-container-low rounded-lg hover:bg-surface-container-high transition-colors cursor-pointer border border-transparent hover:border-surface-variant">
                <div className="bg-surface-container text-on-surface-variant p-2 rounded-full flex-shrink-0">
                  <Dumbbell className="text-[20px]" />
                </div>
                <div>
                  <h3 className="font-body-md text-body-md text-on-surface font-semibold">Leadership Workshop</h3>
                  <p className="font-caption text-caption text-on-surface-variant mt-0.5">Completed mandatory institutional training module.</p>
                </div>
              </div>
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
