import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Select } from '../../components/ui/Select';
import { profileApi } from '../../api/profile';

export const Onboarding = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    department: '',
    designation: '',
  });
  
  const [departments, setDepartments] = useState<{value: string, label: string}[]>([]);
  const [roles, setRoles] = useState<{value: string, label: string, department?: string}[]>([]);
  
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  React.useEffect(() => {
    const loadMetadata = async () => {
      try {
        const [metaRes, profileRes] = await Promise.all([
          profileApi.getMetadata(),
          profileApi.getProfile()
        ]);
        
        const depts = metaRes.departments.map(d => ({ value: d._id, label: d.name }));
        const rls = metaRes.roles.map(r => ({ value: r._id, label: r.name, department: r.department }));
        
        setDepartments(depts);
        setRoles(rls);
        
        if (profileRes) {
          setFormData({
            firstName: profileRes.firstName || '',
            lastName: profileRes.lastName || '',
            department: profileRes.department?._id || (depts.length > 0 ? depts[0].value : ''),
            designation: profileRes.designation?._id || (rls.length > 0 ? rls[0].value : ''),
          });
        }
      } catch (error) {
        console.error('Failed to load onboarding metadata', error);
      } finally {
        setIsFetching(false);
      }
    };
    loadMetadata();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await profileApi.updateProfile({
        firstName: formData.firstName,
        lastName: formData.lastName,
        department: formData.department as any,
        designation: formData.designation as any,
        onboardingStatus: 'COMPLETED'
      });
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) return <div>Loading...</div>;

  // Filter roles based on selected department if applicable
  const availableRoles = formData.department 
    ? roles.filter(r => !r.department || r.department === formData.department)
    : roles;

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <Card>
        <CardHeader>
          <CardTitle>Welcome to MoSPI Skill Intelligence</CardTitle>
          <CardDescription>Let's complete your professional profile.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
              <Input 
                label="First Name" 
                required 
                value={formData.firstName}
                onChange={e => setFormData({ ...formData, firstName: e.target.value })}
              />
              <Input 
                label="Last Name" 
                required 
                value={formData.lastName}
                onChange={e => setFormData({ ...formData, lastName: e.target.value })}
              />
            </div>
            <Select 
              label="Department"
              value={formData.department}
              onChange={e => {
                setFormData({ ...formData, department: e.target.value, designation: '' });
              }}
              options={departments}
            />
            <Select 
              label="Designation / Role"
              value={formData.designation}
              onChange={e => setFormData({ ...formData, designation: e.target.value })}
              options={availableRoles}
            />
          </CardContent>
          <CardFooter style={{ justifyContent: 'flex-end' }}>
            <Button type="submit" isLoading={isLoading}>Complete Profile</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};
