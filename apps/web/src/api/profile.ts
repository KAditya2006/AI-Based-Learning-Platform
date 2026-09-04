import { fetchClient } from './client';

export interface Profile {
  _id: string;
  firstName: string;
  lastName: string;
  department?: { _id: string; name: string };
  designation?: { _id: string; name: string };
  mobileNumber?: string;
  organization?: string;
  departmentName?: string;
  designationName?: string;
  functionalRole?: string;
  experience?: {
    totalExperience?: string;
    currentRoleExperience?: string;
    previousDesignation?: string;
    previousOrganization?: string;
    majorResponsibilities?: string;
  };
  skills?: {
    skill: string;
    proficiency: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  }[];
  learningPreferences?: {
    preferredFormats?: string[];
    preferredLanguage?: string;
    learningGoals?: string[];
  };
  onboardingStatus?: string;
}

export const profileApi = {
  getProfile: () => fetchClient<Profile>('/profile'),
  getMetadata: () => fetchClient<{ departments: { _id: string; name: string }[], roles: { _id: string; name: string; department?: string }[] }>('/profile/metadata'),
  updateProfile: (data: Partial<Profile>) => 
    fetchClient<Profile>('/profile', {
      method: 'PATCH',
      data: data
    })
};


