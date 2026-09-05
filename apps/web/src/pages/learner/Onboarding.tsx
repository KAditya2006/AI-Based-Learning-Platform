import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Select } from '../../components/ui/Select';
import { User, ShieldCheck, Briefcase, Plus, Trash2 } from 'lucide-react';
import { assessmentApi } from '../../api/assessments';
import { profileApi } from '../../api/profile';

export const Onboarding = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ 
    firstName: '', lastName: '', department: '', designation: '', 
    organization: '', functionalRole: ''
  });
  const [skills, setSkills] = useState<{ skill: string, proficiency: string }[]>([]);
  const [newSkill, setNewSkill] = useState('');
  const [newProficiency, setNewProficiency] = useState('Beginner');
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
            organization: profileRes.organization || '',
            functionalRole: profileRes.functionalRole || ''
          });
          if (profileRes.skills && profileRes.skills.length > 0) {
            setSkills(profileRes.skills);
          }
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsFetching(false);
      }
    };
    loadMetadata();
  }, []);

  const handleAddSkill = () => {
    if (newSkill.trim() === '') return;
    setSkills([...skills, { skill: newSkill.trim(), proficiency: newProficiency }]);
    setNewSkill('');
    setNewProficiency('Beginner');
  };

  const handleRemoveSkill = (index: number) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await profileApi.updateProfile({ ...formData, skills, onboardingStatus: 'COMPLETED' } as any);
      
      // Try to route to an assessment, else dashboard
      const assessments = await assessmentApi.getAssessments();
      if (assessments && assessments.length > 0) {
        navigate(`/assessments/${assessments[0]._id}/preparation`);
      } else {
        navigate('/dashboard');
      }
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
            
            <div style={{ padding: 'var(--sp-4)', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', marginTop: 'var(--sp-2)' }}>
              <div style={{ display: 'grid', gap: 'var(--sp-4)' }}>
                <Input
                  label="Organization" required
                  value={formData.organization}
                  onChange={e => setFormData({ ...formData, organization: e.target.value })}
                  leftIcon={<Briefcase size={15} />}
                />
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
                <Input
                  label="Current Role / Functional Title"
                  value={formData.functionalRole}
                  onChange={e => setFormData({ ...formData, functionalRole: e.target.value })}
                />
              </div>
            </div>

            <div style={{ padding: 'var(--sp-4)', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', marginTop: 'var(--sp-2)' }}>
              <label style={{ fontSize: 'var(--text-sm)', fontWeight: 600, display: 'block', marginBottom: 'var(--sp-3)', color: 'var(--text-secondary)' }}>Current Skills & Proficiencies</label>
              
              {skills.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-2)', marginBottom: 'var(--sp-4)' }}>
                  {skills.map((s, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-default)', padding: 'var(--sp-2) var(--sp-3)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                      <div>
                        <span style={{ fontWeight: 500 }}>{s.skill}</span>
                        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginLeft: 'var(--sp-2)', background: 'var(--bg-subtle)', padding: '2px 6px', borderRadius: '4px' }}>{s.proficiency}</span>
                      </div>
                      <button type="button" onClick={() => handleRemoveSkill(idx)} style={{ color: 'var(--text-error)', background: 'none', border: 'none', cursor: 'pointer' }}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div style={{ display: 'flex', gap: 'var(--sp-2)', alignItems: 'flex-end' }}>
                <div style={{ flex: 2 }}>
                  <Input
                    label="Skill Name"
                    value={newSkill}
                    onChange={e => setNewSkill(e.target.value)}
                    placeholder="e.g. Data Analysis"
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <Select
                    label="Proficiency"
                    value={newProficiency}
                    onChange={e => setNewProficiency(e.target.value)}
                    options={[
                      { value: 'Beginner', label: 'Beginner' },
                      { value: 'Intermediate', label: 'Intermediate' },
                      { value: 'Advanced', label: 'Advanced' },
                      { value: 'Expert', label: 'Expert' }
                    ]}
                  />
                </div>
                <Button type="button" variant="secondary" onClick={handleAddSkill} style={{ height: '40px', padding: '0 var(--sp-3)' }}>
                  <Plus size={18} />
                </Button>
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
