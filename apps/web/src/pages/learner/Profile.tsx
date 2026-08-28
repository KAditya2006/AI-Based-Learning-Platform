import React, { useState, useEffect } from 'react';
import useSWR from 'swr';
import { fetchClient } from '../../api/client';
import { profileApi } from '../../api/profile';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Spinner } from '../../components/ui/Spinner';

interface ProfileData {
  firstName: string;
  lastName: string;
  department: string;
  designation: string;
}

export const Profile = () => {
  const { data: profile, error, isLoading, mutate } = useSWR<ProfileData>('/profile', fetchClient);
  
  const [formData, setFormData] = useState<ProfileData>({
    firstName: '',
    lastName: '',
    department: '',
    designation: ''
  });
  
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setFormData(profile);
    }
  }, [profile]);

  if (isLoading) return <div style={{ padding: 'var(--space-6)', textAlign: 'center' }}><Spinner /></div>;
  if (error) return <div style={{ color: 'var(--color-error-text)' }}>Failed to load profile.</div>;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await profileApi.updateProfile({
        firstName: formData.firstName,
        lastName: formData.lastName
        // Department and designation are usually immutable or require admin approval,
        // but we'll include them if your backend supports updating them.
      });
      mutate(formData);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', maxWidth: '800px' }}>
      <div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 600 }}>My Profile</h1>
        <p style={{ color: 'var(--color-text-secondary)' }}>Manage your professional information.</p>
      </div>

      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
              <Input 
                label="First Name" 
                value={formData.firstName || ''}
                onChange={e => setFormData({ ...formData, firstName: e.target.value })}
              />
              <Input 
                label="Last Name" 
                value={formData.lastName || ''}
                onChange={e => setFormData({ ...formData, lastName: e.target.value })}
              />
            </div>
            {/* Display Read-only fields for organizational data */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
              <Input 
                label="Department" 
                value={formData.department || 'Not Set'}
                disabled
              />
              <Input 
                label="Designation" 
                value={formData.designation || 'Not Set'}
                disabled
              />
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
              * Department and Designation can only be changed by your organizational administrator.
            </p>
          </CardContent>
          <CardFooter style={{ justifyContent: 'flex-end' }}>
            <Button type="submit" isLoading={isSaving}>Save Changes</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};
