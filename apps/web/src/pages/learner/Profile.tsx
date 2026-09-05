import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import useSWR from 'swr';
import { profileApi } from '../../api/profile';
import { Award, Badge, Building2, CheckCircle, Download, Flag, Pencil, Radar, BookOpen, LayoutList } from 'lucide-react';

export const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const { data: profile, error, isLoading } = useSWR('/profile', profileApi.getProfile);

  if (isLoading) return <div className="p-xl text-center">Loading Profile...</div>;
  if (error || !profile) return <div className="p-xl text-center text-error">Failed to load profile. Please try again.</div>;

  const displayName = profile.firstName ? `${profile.firstName} ${profile.lastName}` : (user?.email?.split('@')[0] || 'Official');
  const roleDisplay = profile.designationName || 'Not added';
  const orgDisplay = profile.organization || 'Not added';
  const deptDisplay = profile.departmentName || 'Not added';

  return (
    <div className="pt-xl px-lg max-w-5xl mx-auto pb-xl animate-in fade-in duration-300">
      {/* Profile Identity Card */}
      <section className="bg-surface-container-lowest rounded-xl p-lg border border-outline-variant shadow-[0px_1px_3px_rgba(26,22,20,0.05)] mb-xl flex flex-col md:flex-row items-center md:items-start gap-lg relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-primary"></div>
        <div className="w-32 h-32 md:w-40 md:h-40 shrink-0 rounded-lg overflow-hidden border-2 border-surface-variant bg-surface">
          <img 
            alt="Official Photo" 
            className="w-full h-full object-cover" 
            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=FCDCCC&color=1A1614&size=160`}
          />
        </div>
        <div className="flex-1 text-center md:text-left mt-md md:mt-0">
          <h2 className="font-display-lg text-display-lg text-on-surface mb-xs capitalize">{displayName}</h2>
          <p className="font-headline-sm text-headline-sm text-on-surface-variant mb-md">{roleDisplay}</p>
          <div className="flex flex-col md:flex-row gap-md md:gap-xl mb-md justify-center md:justify-start">
            <div className="flex items-center gap-sm">
              <Building2 className="text-outline" />
              <span className="font-body-lg text-body-lg text-on-surface">{orgDisplay} - {deptDisplay}</span>
            </div>
            <div className="flex items-center gap-sm">
              <Badge className="text-outline" />
              <span className="font-body-lg text-body-lg text-on-surface">Functional Role: {profile.functionalRole || 'Not added'}</span>
            </div>
          </div>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl border-l-2 border-outline-variant pl-md italic">
            Email: {user?.email} • Mobile: {profile.mobileNumber || 'Not added'}
          </p>
        </div>
        <div className="flex flex-col gap-sm self-stretch md:self-auto justify-start mt-md md:mt-0">
          <button onClick={() => navigate('/profile/edit')} className="bg-surface-container-lowest border border-primary text-primary px-md py-sm rounded flex items-center justify-center gap-xs font-label-caps text-label-caps hover:bg-surface-container transition-all">
            <Pencil className="text-[18px]" />
            EDIT PROFILE
          </button>
        </div>
      </section>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-xl">
        {/* Left Column: Skills & Proficiencies */}
        <section className="bg-surface-container-lowest rounded-xl p-lg border border-outline-variant shadow-[0px_1px_3px_rgba(26,22,20,0.05)] flex flex-col">
          <div className="flex items-center justify-between border-b border-surface-variant pb-sm mb-md">
            <h3 className="font-headline-md text-headline-md text-on-surface flex items-center gap-sm">
              <Radar className="text-primary" />
              Professional Skills
            </h3>
          </div>
          <div className="flex-1 flex flex-col gap-md">
            {profile.skills && profile.skills.length > 0 ? (
              profile.skills.map((s, idx) => (
                <div key={idx}>
                  <div className="flex justify-between font-label-caps text-label-caps mb-xs">
                    <span className="text-on-surface">{s.skill}</span>
                    <span className="text-primary font-bold">{s.proficiency}</span>
                  </div>
                  <div className="w-full h-2 bg-surface-variant rounded-full overflow-hidden">
                    <div className={`h-full bg-primary ${s.proficiency === 'Expert' ? 'w-[95%]' : s.proficiency === 'Advanced' ? 'w-[75%]' : s.proficiency === 'Intermediate' ? 'w-[50%]' : 'w-[25%]'}`}></div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-on-surface-variant italic">Not added</p>
            )}
          </div>
        </section>
        
        {/* Right Column: Experience & Preferences */}
        <section className="bg-surface-container-lowest rounded-xl p-lg border border-outline-variant shadow-[0px_1px_3px_rgba(26,22,20,0.05)] flex flex-col">
          <div className="flex items-center justify-between border-b border-surface-variant pb-sm mb-md">
            <h3 className="font-headline-md text-headline-md text-on-surface flex items-center gap-sm">
              <LayoutList className="text-primary" />
              Experience & History
            </h3>
          </div>
          <div className="space-y-sm mb-lg">
            <p><strong>Total Experience:</strong> {profile.experience?.totalExperience || 'Not added'}</p>
            <p><strong>Current Role Experience:</strong> {profile.experience?.currentRoleExperience || 'Not added'}</p>
            <p><strong>Previous Org:</strong> {profile.experience?.previousOrganization || 'Not added'}</p>
            <p><strong>Previous Desig:</strong> {profile.experience?.previousDesignation || 'Not added'}</p>
            <p><strong>Responsibilities:</strong> {profile.experience?.majorResponsibilities || 'Not added'}</p>
          </div>

          <div className="flex items-center justify-between border-b border-surface-variant pb-sm mb-md">
            <h3 className="font-headline-md text-headline-md text-on-surface flex items-center gap-sm">
              <BookOpen className="text-primary" />
              Learning Preferences
            </h3>
          </div>
          <div className="space-y-sm">
            <p><strong>Formats:</strong> {profile.learningPreferences?.preferredFormats?.join(', ') || 'Not added'}</p>
            <p><strong>Language:</strong> {profile.learningPreferences?.preferredLanguage || 'Not added'}</p>
            <p><strong>Goals:</strong> {profile.learningPreferences?.learningGoals?.join(', ') || 'Not added'}</p>
          </div>
        </section>
      </div>
    </div>
  );
};
