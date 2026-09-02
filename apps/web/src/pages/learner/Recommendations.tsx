import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Bookmark, Clock, GraduationCap, PieChart, Sliders, Sparkles, Star, Users } from 'lucide-react';


export const Recommendations = () => {
  const navigate = useNavigate();

  return (
    <div className="flex-grow px-lg max-w-screen-2xl mx-auto w-full py-xl space-y-xl font-body-md text-on-surface bg-background min-h-screen animate-in fade-in duration-300">
      {/* Header Section */}
      <section className="flex flex-col md:flex-row justify-between items-start md:items-end gap-md pb-md border-b border-outline-variant">
        <div>
          <h1 className="font-display-lg text-display-lg text-on-surface mb-2">Development Recommendations</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
            AI-driven learning paths personalized for your career trajectory in Data Science. Based on your recent competency assessment.
          </p>
        </div>
        <div className="flex gap-md mt-4 md:mt-0">
          <button className="bg-surface-container-lowest border border-primary text-primary px-4 py-2 rounded-lg font-label-caps text-label-caps flex items-center gap-2 hover:bg-surface-container-low transition-colors shadow-[0px_1px_3px_rgba(26,22,20,0.05)]">
            <Sliders className="text-[18px]" /> Filter
          </button>
        </div>
      </section>

      {/* Bento Grid Layout for Recommendations */}
      <section className="grid grid-cols-1 md:grid-cols-12 gap-lg">
        {/* AI Insight Panel */}
        <div className="md:col-span-12 bg-surface-container-lowest border border-outline-variant rounded-xl p-lg shadow-[0px_1px_3px_rgba(26,22,20,0.05)] flex flex-col md:flex-row items-center gap-lg">
          <div className="w-16 h-16 rounded-full bg-primary-fixed flex items-center justify-center shrink-0">
            <Sparkles className="text-on-primary-fixed text-3xl" />
          </div>
          <div>
            <h2 className="font-headline-sm text-headline-sm text-on-surface mb-1">AI Insight</h2>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Your recent project success indicates a strong foundation in predictive modeling. To advance to a Senior Data Scientist role, focusing on <strong>Advanced Predictive Modeling</strong> and communicating those models via <strong>Data Storytelling</strong> will yield the highest ROI for your career goals over the next quarter.
            </p>
          </div>
        </div>

        {/* Course Card 1: Advanced Predictive Modeling (Hero Card) */}
        <article className="md:col-span-8 bg-surface-container-lowest border border-outline-variant rounded-xl shadow-[0px_1px_3px_rgba(26,22,20,0.05)] overflow-hidden flex flex-col hover:border-outline transition-all duration-200 cursor-pointer" onClick={() => navigate('/learning-path')}>
          <div className="h-48 w-full bg-surface-container-high relative">
            <img className="w-full h-full object-cover mix-blend-multiply opacity-80" alt="Advanced Predictive Modeling" src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" />
            <div className="absolute top-4 left-4 bg-primary-fixed text-on-primary-fixed-variant px-2 py-1 rounded font-label-caps text-label-caps flex items-center gap-1 shadow-[0px_1px_3px_rgba(26,22,20,0.05)]">
              <Star className="text-[14px]" /> Top Recommendation
            </div>
          </div>
          <div className="p-lg flex-grow flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-headline-md text-headline-md text-on-surface">Advanced Predictive Modeling</h3>
                <button className="text-on-surface-variant hover:text-primary transition-colors"><Bookmark /></button>
              </div>
              <p className="font-body-md text-body-md text-on-surface-variant mb-4 line-clamp-2">
                Master complex algorithms, ensemble methods, and deep learning techniques to build highly accurate predictive models for institutional planning.
              </p>
              <div className="flex flex-wrap gap-2 mb-6">
                <span className="bg-[#FCDCCC] text-[#1A1614] px-2 py-1 rounded font-label-caps text-label-caps">Advanced</span>
                <span className="bg-surface-container text-on-surface-variant px-2 py-1 rounded font-caption text-caption flex items-center gap-1">
                  <Clock className="text-[14px]" /> 12 Hours
                </span>
                <span className="bg-surface-container text-on-surface-variant px-2 py-1 rounded font-caption text-caption flex items-center gap-1">
                  <GraduationCap className="text-[14px]" /> Core Skill
                </span>
              </div>
            </div>
            <div className="pt-4 border-t border-outline-variant flex justify-between items-center">
              <div className="font-caption text-caption text-on-surface-variant">Matches 92% of your goal profile</div>
              <button className="bg-[#F05A2A] text-white px-4 py-2 rounded-lg font-label-caps text-label-caps hover:opacity-90 transition-opacity flex items-center gap-2">
                View Course <ArrowRight className="text-[16px]" />
              </button>
            </div>
          </div>
        </article>

        {/* Course Card 2 & 3 Stack */}
        <div className="md:col-span-4 flex flex-col gap-lg">
          {/* Course Card 2: Data Storytelling */}
          <article className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-[0px_1px_3px_rgba(26,22,20,0.05)] p-lg flex flex-col h-full hover:border-outline transition-all duration-200 cursor-pointer" onClick={() => navigate('/learning-path')}>
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-headline-sm text-headline-sm text-on-surface">Data Storytelling</h3>
              <div className="w-10 h-10 rounded bg-tertiary-fixed-dim flex items-center justify-center shrink-0 text-on-tertiary-fixed">
                <PieChart />
              </div>
            </div>
            <p className="font-body-md text-body-md text-on-surface-variant mb-4 flex-grow">
              Learn to translate complex predictive models into clear, actionable narratives for non-technical leadership.
            </p>
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="bg-[#FCDCCC] text-[#1A1614] px-2 py-1 rounded font-label-caps text-label-caps">Intermediate</span>
              <span className="bg-surface-container text-on-surface-variant px-2 py-1 rounded font-caption text-caption flex items-center gap-1">
                <Clock className="text-[14px]" /> 4 Hours
              </span>
            </div>
            <button className="w-full bg-surface-container-lowest border border-[#F05A2A] text-[#F05A2A] px-4 py-2 rounded-lg font-label-caps text-label-caps hover:bg-[#F05A2A] hover:text-white transition-colors">
              View Course
            </button>
          </article>

          {/* Course Card 3: Strategic Leadership */}
          <article className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-[0px_1px_3px_rgba(26,22,20,0.05)] p-lg flex flex-col h-full hover:border-outline transition-all duration-200 cursor-pointer" onClick={() => navigate('/learning-path')}>
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-headline-sm text-headline-sm text-on-surface">Strategic Leadership</h3>
              <div className="w-10 h-10 rounded bg-secondary-fixed-dim flex items-center justify-center shrink-0 text-on-secondary-fixed">
                <Users />
              </div>
            </div>
            <p className="font-body-md text-body-md text-on-surface-variant mb-4 flex-grow">
              Develop the institutional authority to guide cross-functional teams and drive data-informed policy changes.
            </p>
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="bg-surface-container text-on-surface-variant px-2 py-1 rounded font-label-caps text-label-caps">Foundational</span>
              <span className="bg-surface-container text-on-surface-variant px-2 py-1 rounded font-caption text-caption flex items-center gap-1">
                <Clock className="text-[14px]" /> 6 Hours
              </span>
            </div>
            <button className="w-full bg-surface-container-lowest border border-[#F05A2A] text-[#F05A2A] px-4 py-2 rounded-lg font-label-caps text-label-caps hover:bg-[#F05A2A] hover:text-white transition-colors">
              View Course
            </button>
          </article>
        </div>
      </section>
    </div>
  );
};
