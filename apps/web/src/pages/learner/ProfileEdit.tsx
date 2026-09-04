import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useSWR, { mutate } from 'swr';
import { profileApi, Profile } from '../../api/profile';
import { ArrowLeft, Pencil, AlertCircle } from 'lucide-react';
import { authApi } from '../../api/auth';

export const ProfileEdit = () => {
  const navigate = useNavigate();
  const { data: profile, isLoading } = useSWR('/profile', profileApi.getProfile);
  
  const [formData, setFormData] = useState<Partial<Profile>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  
  // Organization cascades
  const [orgs, setOrgs] = useState<{id: string, name: string}[]>([]);
  const [depts, setDepts] = useState<{id: string, name: string}[]>([]);
  const [desigs, setDesigs] = useState<{id: string, name: string}[]>([]);
  const [roles, setRoles] = useState<{id: string, name: string}[]>([]);

  useEffect(() => {
    if (profile) {
      setFormData({
        firstName: profile.firstName || '',
        lastName: profile.lastName || '',
        mobileNumber: profile.mobileNumber || '',
        organization: profile.organization || '',
        departmentName: profile.departmentName || '',
        designationName: profile.designationName || '',
        functionalRole: profile.functionalRole || '',
      });
    }
  }, [profile]);

  useEffect(() => {
    authApi.getOrganizations().then(setOrgs).catch(() => {});
  }, []);

  useEffect(() => {
    if (formData.organization) {
      authApi.getDepartments(formData.organization).then(setDepts).catch(() => {});
    } else { setDepts([]); }
  }, [formData.organization]);

  useEffect(() => {
    if (formData.departmentName) {
      authApi.getDesignations(formData.departmentName).then(setDesigs).catch(() => {});
    } else { setDesigs([]); }
  }, [formData.departmentName]);

  useEffect(() => {
    if (formData.designationName) {
      authApi.getFunctionalRoles(formData.designationName).then(setRoles).catch(() => {});
    } else { setRoles([]); }
  }, [formData.designationName]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleOrgChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, organization: e.target.value, departmentName: '', designationName: '', functionalRole: '' }));
  };
  const handleDeptChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, departmentName: e.target.value, designationName: '', functionalRole: '' }));
  };
  const handleDesigChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, designationName: e.target.value, functionalRole: '' }));
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setError('');
      await profileApi.updateProfile(formData);
      await mutate('/profile');
      navigate('/profile');
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <div className="p-xl text-center">Loading Profile Editor...</div>;

  return (
    <div className="w-full max-w-3xl mx-auto py-xl flex flex-col gap-xl animate-in fade-in duration-300">
      <div className="flex flex-col gap-sm">
        <a 
          className="text-on-surface-variant hover:text-primary transition-colors duration-200 cursor-pointer flex items-center gap-1 w-fit mb-md" 
          onClick={() => navigate('/profile')}
        >
          <ArrowLeft className="text-[20px]" />
          <span className="font-body-md text-body-md">Back to Profile</span>
        </a>
        <h1 className="font-display-lg text-display-lg text-on-surface">Edit Professional Profile</h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant">Update your personal and professional details.</p>
      </div>
      
      {error && (
        <div className="flex items-center gap-sm p-sm bg-error-container border border-error rounded text-sm text-error">
          <AlertCircle className="shrink-0 text-[16px]" />
          <span>{error}</span>
        </div>
      )}

      {/* Personal Information Card */}
      <section className="bg-surface-container-lowest border border-surface-variant rounded shadow-[0px_1px_3px_rgba(26,22,20,0.05)] flex flex-col">
        <div className="border-b border-surface-variant px-lg py-md flex items-center justify-between">
          <h2 className="font-headline-sm text-headline-sm text-on-surface">Personal Information</h2>
        </div>
        <div className="p-lg flex flex-col gap-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
            <div>
              <label className="block font-label-caps text-label-caps text-on-surface-variant mb-sm" htmlFor="firstName">First Name</label>
              <input 
                className="w-full bg-surface-container-lowest border border-surface-variant rounded py-2 px-3 text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-fixed" 
                id="firstName" 
                value={formData.firstName || ''}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block font-label-caps text-label-caps text-on-surface-variant mb-sm" htmlFor="lastName">Last Name</label>
              <input 
                className="w-full bg-surface-container-lowest border border-surface-variant rounded py-2 px-3 text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-fixed" 
                id="lastName" 
                value={formData.lastName || ''}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block font-label-caps text-label-caps text-on-surface-variant mb-sm" htmlFor="mobileNumber">Mobile Number</label>
              <input 
                className="w-full bg-surface-container-lowest border border-surface-variant rounded py-2 px-3 text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-fixed" 
                id="mobileNumber" 
                value={formData.mobileNumber || ''}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Professional Information Card */}
      <section className="bg-surface-container-lowest border border-surface-variant rounded shadow-[0px_1px_3px_rgba(26,22,20,0.05)] flex flex-col">
        <div className="border-b border-surface-variant px-lg py-md">
          <h2 className="font-headline-sm text-headline-sm text-on-surface">Professional Information</h2>
        </div>
        <div className="p-lg grid grid-cols-1 gap-lg">
          <div>
            <label className="block font-label-caps text-label-caps text-on-surface-variant mb-sm" htmlFor="organization">Organization</label>
            <select 
              className="w-full bg-surface-container-lowest border border-surface-variant rounded py-2 px-3 text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-fixed appearance-none cursor-pointer" 
              id="organization"
              value={formData.organization || ''}
              onChange={handleOrgChange}
            >
              <option value="" disabled>Select Organization</option>
              {orgs.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block font-label-caps text-label-caps text-on-surface-variant mb-sm" htmlFor="departmentName">Department</label>
            <select 
              className="w-full bg-surface-container-lowest border border-surface-variant rounded py-2 px-3 text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-fixed appearance-none cursor-pointer disabled:opacity-50" 
              id="departmentName"
              value={formData.departmentName || ''}
              onChange={handleDeptChange}
              disabled={!formData.organization}
            >
              <option value="" disabled>Select Department</option>
              {depts.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block font-label-caps text-label-caps text-on-surface-variant mb-sm" htmlFor="designationName">Designation</label>
            <select 
              className="w-full bg-surface-container-lowest border border-surface-variant rounded py-2 px-3 text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-fixed appearance-none cursor-pointer disabled:opacity-50" 
              id="designationName"
              value={formData.designationName || ''}
              onChange={handleDesigChange}
              disabled={!formData.departmentName}
            >
              <option value="" disabled>Select Designation</option>
              {desigs.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block font-label-caps text-label-caps text-on-surface-variant mb-sm" htmlFor="functionalRole">Functional Role</label>
            <select 
              className="w-full bg-surface-container-lowest border border-surface-variant rounded py-2 px-3 text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-fixed appearance-none cursor-pointer disabled:opacity-50" 
              id="functionalRole"
              value={formData.functionalRole || ''}
              onChange={handleChange}
              disabled={!formData.designationName}
            >
              <option value="" disabled>Select Role</option>
              {roles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
            </select>
          </div>
        </div>
      </section>

      {/* Actions */}
      <div className="flex justify-end gap-md pb-xl">
        <button 
          onClick={() => navigate('/profile')} 
          className="px-6 py-2 bg-surface-container-lowest border border-primary text-primary font-body-md text-body-md rounded-lg hover:bg-primary-fixed transition-colors"
        >
          Cancel
        </button>
        <button 
          onClick={handleSave} 
          disabled={isSaving}
          className="px-6 py-2 bg-primary text-on-primary font-body-md text-body-md rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
};
