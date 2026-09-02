import { useState } from 'react';
import useSWR from 'swr';
import { fetchClient } from '../../api/client';
import type { Enrollment } from '../../api/learning';
import { ArrowRight, Calendar, ChevronLeft, ChevronRight, Download, Medal, Search } from 'lucide-react';


export const LearningHistory = () => {
  const { data: enrollments, isLoading } = useSWR<Enrollment[]>('/learning/enrollments', fetchClient);
  const [searchTerm, setSearchTerm] = useState('');
  
  const history = enrollments?.filter(e => e.status === 'COMPLETED') || [];
  const filteredHistory = history.filter(e => 
    e.resource.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex-grow w-full max-w-screen-2xl mx-auto space-y-xl animate-in fade-in duration-300">
      {/* Header Section */}
      <section className="flex flex-col gap-md md:flex-row md:items-end md:justify-between pb-md border-b border-outline-variant mt-xl">
        <div className="flex flex-col gap-sm">
          <h1 className="font-display-lg text-display-lg text-on-surface">Learning History</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
            A comprehensive record of your completed courses, assessments, and earned certifications.
          </p>
        </div>
        <div className="flex gap-sm mt-4 md:mt-0">
          <button className="bg-surface-container-lowest border border-primary text-primary px-md py-sm rounded-lg font-body-md text-body-md hover:bg-surface-container-low transition-colors flex items-center gap-xs">
            <Download className="text-[18px]" /> Export Report
          </button>
        </div>
      </section>

      {/* Filters and Search */}
      <section className="bg-surface-container-lowest border border-surface-variant rounded-xl p-md flex flex-col md:flex-row gap-md items-center shadow-[0px_1px_3px_rgba(26,22,20,0.05)]">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-sm top-1/2 -translate-y-1/2 text-on-surface-variant" />
          <input 
            className="w-full pl-xl pr-sm py-sm bg-surface-container-lowest border border-surface-variant rounded-lg font-body-md text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-fixed placeholder:text-on-surface-variant" 
            placeholder="Search courses, skills, or certifications..." 
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-sm w-full md:w-auto overflow-x-auto pb-sm md:pb-0">
          <select className="bg-surface-container-lowest border border-surface-variant rounded-lg px-sm py-sm font-body-md text-body-md text-on-surface focus:outline-none focus:border-primary">
            <option>All Types</option>
            <option>Course</option>
            <option>Assessment</option>
            <option>Certification</option>
          </select>
          <select className="bg-surface-container-lowest border border-surface-variant rounded-lg px-sm py-sm font-body-md text-body-md text-on-surface focus:outline-none focus:border-primary">
            <option>All Time</option>
            <option>Past 30 Days</option>
            <option>Past 6 Months</option>
            <option>2023</option>
          </select>
          <select className="bg-surface-container-lowest border border-surface-variant rounded-lg px-sm py-sm font-body-md text-body-md text-on-surface focus:outline-none focus:border-primary">
            <option>Any Score</option>
            <option>&gt; 90%</option>
            <option>&gt; 80%</option>
          </select>
        </div>
      </section>

      {/* History Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg">
          {[1,2,3].map(i => <div key={i} className="h-64 bg-surface-variant rounded-xl animate-pulse"></div>)}
        </div>
      ) : filteredHistory.length === 0 ? (
        <div className="text-center py-12 bg-surface-container rounded-xl border border-surface-variant text-on-surface-variant">
          No learning history found.
        </div>
      ) : (
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg">
          {filteredHistory.map((item) => {
            
            return (
              <div key={item._id} className="bg-surface-container-lowest border border-surface-variant rounded-xl flex flex-col overflow-hidden shadow-[0px_1px_3px_rgba(26,22,20,0.05)] hover:shadow-none hover:border-outline-variant transition-all cursor-pointer group">
                <div className="p-md border-b border-surface-variant flex justify-between items-start bg-surface-container-low">
                  <div className="flex flex-col gap-xs">
                    <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">
                      {item.resource.type || 'Course'}
                    </span>
                    <h3 className="font-headline-sm text-headline-sm text-on-background group-hover:text-primary transition-colors line-clamp-2">
                      {item.resource.title}
                    </h3>
                  </div>
                  <div className={`font-body-md text-body-md px-xs py-[2px] rounded-DEFAULT font-semibold whitespace-nowrap ${false ? 'bg-primary text-on-primary' : 'bg-surface-variant text-on-surface border border-outline-variant'}`}>
                    {false ? 'Pass' : '95%'}
                  </div>
                </div>
                <div className="p-md flex flex-col gap-md flex-grow">
                  <div className="flex gap-sm flex-wrap">
                    <span className="bg-primary-fixed text-on-background font-caption text-caption px-sm py-xs rounded-lg">
                      {item.resource.provider || 'Internal'}
                    </span>
                  </div>
                  <div className="mt-auto flex justify-between items-center pt-md border-t border-surface-variant">
                    <div className="flex items-center gap-xs text-on-surface-variant font-caption text-caption">
                      <Calendar className="text-[16px]" /> {new Date(item.lastAccessedAt).toLocaleDateString()}
                    </div>
                    <button className="text-primary font-body-md text-body-md hover:underline flex items-center gap-xs">
                      {false ? (
                        <>View Certificate <Medal className="text-[16px]" /></>
                      ) : (
                        <>Details <ArrowRight className="text-[16px]" /></>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </section>
      )}

      {/* Pagination */}
      {!isLoading && filteredHistory.length > 0 && (
        <section className="flex justify-center items-center gap-md mt-md">
          <button className="p-sm rounded-lg border border-surface-variant text-on-surface-variant hover:bg-surface-container-low hover:text-primary transition-colors disabled:opacity-50" disabled>
             <ChevronLeft />
          </button>
          <div className="flex gap-xs font-body-md text-body-md">
            <button className="w-8 h-8 rounded-lg bg-primary text-on-primary flex items-center justify-center">1</button>
            <button className="w-8 h-8 rounded-lg hover:bg-surface-container-low text-on-surface-variant flex items-center justify-center transition-colors">2</button>
            <span className="w-8 h-8 flex items-center justify-center text-on-surface-variant">...</span>
          </div>
          <button className="p-sm rounded-lg border border-surface-variant text-on-surface-variant hover:bg-surface-container-low hover:text-primary transition-colors">
            <ChevronRight />
          </button>
        </section>
      )}
    </div>
  );
};
