import { fetchClient } from './client';

export interface Profile {
  _id: string;
  firstName: string;
  lastName: string;
  department?: { _id: string; name: string };
  designation?: { _id: string; name: string };
  currentAssignment?: string;
  education?: string;
  workExperience?: string;
  learningGoals?: string[];
  onboardingStatus?: string;
}

export const profileApi = {
  getProfile: () => fetchClient<Profile>('/profile'),
  getMetadata: () => fetchClient<{ departments: { _id: string; name: string }[], roles: { _id: string; name: string; department?: string }[] }>('/profile/metadata'),
  updateProfile: (data: Partial<Profile>) => 
    fetchClient<Profile>('/profile', {
      method: 'PATCH',
      body: JSON.stringify(data)
    })
};
