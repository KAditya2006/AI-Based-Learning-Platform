import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Select } from '../../components/ui/Select';
import { profileApi } from '../../api/profile';
import { User, ShieldCheck } from 'lucide-react';

export const Onboarding = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ firstName: '', lastName: '', department: '', designation: '' });
  const [departments, setDepartments] = useState<{value: string, label: string}[]>([]);
  const [roles, setRoles] = useState<{value: string, label: string, department?: string}[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    const loadMetadata = async () => {
      try {
        const [metaRes, profileRes] = await Promise.all([ profileApi.getMetadata(), profileApi.getProfile() ]);
        const depts = metaRes.departments.map(d => ({ value: d._id, label: d.name }));
        const rls = metaRes.roles.map(r => ({ value: r._id, label: r.name, department: r.department }));
        setDepartments(depts); setRoles(rls);
        if (profileRes) {
          setFormData({
            firstName: profileRes.firstName || '',
            lastName: profileRes.lastName || '',
            department: profileRes.department?._id || (depts.length > 0 ? depts[0].value : ''),
            designation: profileRes.designation?._id || (rls.length > 0 ? rls[0].value : ''),
          });
        }
      } catch (error) {
        console.error(error);
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
      await profileApi.updateProfile({ ...formData, onboardingStatus: 'COMPLETED' } as any);
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const availableRoles = formData.department ? roles.filter(r => !r.department || r.department === formData.department) : roles;

  if (isFetching) {
    return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading setup...</div>;
  }

  return (
    <div style={{ maxWidth: '640px', margin: '0 auto', paddingTop: 'var(--sp-8)' }}>
      <div style={{ textAlign: 'center', marginBottom: 'var(--sp-8)' }}>
        <div style={{
          width: '56px', height: '56px', borderRadius: 'var(--radius-xl)',
          background: 'linear-gradient(135deg, var(--primary-600), var(--accent-violet))',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto var(--sp-4)', boxShadow: '0 4px 16px var(--ai-glow-soft)',
        }}>
          <ShieldCheck size={28} color="white" />
        </div>
        <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', marginBottom: 'var(--sp-2)' }}>
          Welcome to the Platform
        </h1>
        <p style={{ fontSize: 'var(--text-base)', color: 'var(--text-secondary)' }}>
          Let's complete your professional profile to tailor your experience.
        </p>
      </div>

      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Professional Details</CardTitle>
            <CardDescription>Your name and role determine your competency framework.</CardDescription>
          </CardHeader>
          <CardContent style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-5)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--sp-4)' }}>
              <Input
                label="First Name" required
                value={formData.firstName}
                onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                leftIcon={<User size={15} />}
              />
              <Input
                label="Last Name" required
                value={formData.lastName}
                onChange={e => setFormData({ ...formData, lastName: e.target.value })}
              />
            </div>
            <div style={{ padding: 'var(--sp-4)', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }}>
              <div style={{ display: 'grid', gap: 'var(--sp-4)' }}>
                <Select
                  label="Department"
                  value={formData.department}
                  onChange={e => setFormData({ ...formData, department: e.target.value, designation: '' })}
                  options={departments}
                />
                <Select
                  label="Designation / Role"
                  value={formData.designation}
                  onChange={e => setFormData({ ...formData, designation: e.target.value })}
                  options={availableRoles}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter style={{ justifyContent: 'flex-end' }}>
            <Button type="submit" isLoading={isLoading} size="lg">Complete Setup</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};
