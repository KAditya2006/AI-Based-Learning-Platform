import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { authApi } from '../../api/auth';
import { AlertCircle, ArrowRight, ArrowLeft, ChevronDown, HelpCircle, Hourglass, Landmark, Check, ShieldCheck, X } from 'lucide-react';

interface IdName { id: string; name: string }

export const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Step 1
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [employeeId, setEmployeeId] = useState('');

  // Step 2
  const [orgs, setOrgs] = useState<IdName[]>([]);
  const [depts, setDepts] = useState<IdName[]>([]);
  const [desigs, setDesigs] = useState<IdName[]>([]);
  const [roles, setRoles] = useState<IdName[]>([]);
  const [organization, setOrganization] = useState('');
  const [department, setDepartment] = useState('');
  const [designation, setDesignation] = useState('');
  const [functionalRole, setFunctionalRole] = useState('');

  useEffect(() => {
    authApi.getOrganizations().then(setOrgs).catch(() => {});
  }, []);

  useEffect(() => {
    setDepartment(''); setDesignation(''); setFunctionalRole('');
    if (organization) {
      authApi.getDepartments(organization).then(setDepts).catch(() => {});
    } else { setDepts([]); }
  }, [organization]);

  useEffect(() => {
    setDesignation(''); setFunctionalRole('');
    if (department) {
      authApi.getDesignations(department).then(setDesigs).catch(() => {});
    } else { setDesigs([]); }
  }, [department]);

  useEffect(() => {
    setFunctionalRole('');
    if (designation) {
      authApi.getFunctionalRoles(designation).then(setRoles).catch(() => {});
    } else { setRoles([]); }
  }, [designation]);

  // Step 3
  const [totalExperience, setTotalExperience] = useState('');
  const [currentRoleExperience, setCurrentRoleExperience] = useState('');
  const [previousDesignation, setPreviousDesignation] = useState('');
  const [previousOrganization, setPreviousOrganization] = useState('');
  const [majorResponsibilities, setMajorResponsibilities] = useState('');

  // Step 4
  const [skills, setSkills] = useState<{ skill: string, proficiency: string }[]>([]);
  const [tempSkill, setTempSkill] = useState('');
  const [tempProficiency, setTempProficiency] = useState('Intermediate');
  const addSkill = () => {
    if (tempSkill && tempProficiency) {
      if (!skills.find(s => s.skill.toLowerCase() === tempSkill.toLowerCase())) {
        setSkills([...skills, { skill: tempSkill, proficiency: tempProficiency }]);
      }
      setTempSkill('');
    }
  };
  const removeSkill = (index: number) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  // Step 5
  const [preferredFormats, setPreferredFormats] = useState<string[]>([]);
  const [preferredLanguage, setPreferredLanguage] = useState('');
  const [learningGoals, setLearningGoals] = useState<string[]>([]);

  const formatOptions = ['Video', 'Course', 'PDF / Document', 'Interactive Learning', 'Practical Exercise', 'Quiz / Assessment', 'Case Study'];
  const goalOptions = ['Improve Current Skills', 'Fill Skill Gaps', 'Prepare for New Responsibilities', 'Career Development', 'Mandatory / Compliance Training', 'Digital Transformation', 'Technology Upskilling', 'Leadership Development', 'Domain Knowledge'];
  const expOptions = ['Less than 1 year', '1–3 years', '3–5 years', '5–10 years', '10–15 years', '15+ years'];

  const toggleArray = (arr: string[], setArr: any, val: string) => {
    setArr(arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 6) {
      if (step === 1 && password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }
      setError(''); setStep(step + 1); return;
    }
    
    setError(''); setIsLoading(true);
    try {
      const res = await authApi.register({
        email, password, firstName, lastName, mobileNumber,
        organization, departmentName: department, designationName: designation, functionalRole,
        experience: { totalExperience, currentRoleExperience, previousDesignation, previousOrganization, majorResponsibilities },
        skills, learningPreferences: { preferredFormats, preferredLanguage, learningGoals }
      });
      login(res.token, res.user);
      navigate('/onboarding/profile');
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Registration failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-background text-on-surface min-h-screen flex flex-col antialiased">
      <main className="flex-1 flex w-full">
        <div className="hidden lg:flex w-[45%] bg-surface-container-low border-r border-surface-variant flex-col items-center justify-center p-2xl relative overflow-hidden">
          <div className="relative z-10 max-w-md text-center">
            <Landmark className="w-20 h-20 text-primary mx-auto mb-lg" />
            <h1 className="font-display-md text-display-md mb-md text-on-surface">Build Your Competency Profile</h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant mb-xl">
              Join the official learning platform designed to match your specific organizational role and skills with personalized AI recommendations.
            </p>
          </div>
        </div>

        <div className="flex-1 flex flex-col justify-center items-center p-md md:p-2xl bg-surface">
          <div className="w-full max-w-xl bg-surface-container shadow-sm rounded-xl p-xl border border-surface-variant">
            
            <div className="flex items-center gap-sm mb-lg">
              <Landmark className="text-primary" />
              <span className="font-headline-sm text-headline-sm font-bold">Skill Intel</span>
            </div>
            
            <div className="mb-xl">
              <h2 className="font-display-sm text-display-sm text-on-surface mb-sm">Create an Account</h2>
              <div className="flex items-center justify-between relative mt-md">
                <div className="absolute left-0 top-1/2 w-full h-[2px] bg-surface-variant -z-10"></div>
                {[1, 2, 3, 4, 5, 6].map(num => (
                  <div key={num} className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${step >= num ? 'bg-primary text-on-primary' : 'bg-surface-container-high text-on-surface-variant border border-surface-variant'}`}>
                    {step > num ? <Check className="w-4 h-4" /> : num}
                  </div>
                ))}
              </div>
            </div>
            
            {error && (
              <div className="mb-lg flex items-center gap-sm p-sm bg-error-container border border-error rounded text-sm text-error">
                <AlertCircle className="shrink-0 text-[16px]" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-lg">
              
              {/* STEP 1 */}
              {step === 1 && (
                <div className="space-y-md animate-in fade-in slide-in-from-bottom-4 duration-300">
                  <h3 className="font-title-lg text-title-lg mb-md">Step 1: Basic Information</h3>
                    <div className="grid grid-cols-2 gap-md mb-md">
                      <div>
                        <label className="block font-label-caps text-label-caps text-on-surface-variant mb-xs">First Name</label>
                        <input required value={firstName} onChange={e => setFirstName(e.target.value)} className="w-full bg-surface-container-lowest border border-surface-variant rounded h-12 px-3 outline-none focus:border-primary" />
                      </div>
                      <div>
                        <label className="block font-label-caps text-label-caps text-on-surface-variant mb-xs">Last Name</label>
                        <input required value={lastName} onChange={e => setLastName(e.target.value)} className="w-full bg-surface-container-lowest border border-surface-variant rounded h-12 px-3 outline-none focus:border-primary" />
                      </div>
                    </div>
                    <div className="mb-md">
                      <label className="block font-label-caps text-label-caps text-on-surface-variant mb-xs">Official Email</label>
                      <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-surface-container-lowest border border-surface-variant rounded h-12 px-3 outline-none focus:border-primary" />
                    </div>
                  <div className="mb-md">
                    <label className="block font-label-caps text-label-caps text-on-surface-variant mb-xs">Mobile Number</label>
                    <input required value={mobileNumber} onChange={e => setMobileNumber(e.target.value)} className="w-full bg-surface-container-lowest border border-surface-variant rounded h-12 px-3 outline-none focus:border-primary" />
                  </div>
                  <div className="grid grid-cols-2 gap-md">
                    <div>
                      <label className="block font-label-caps text-label-caps text-on-surface-variant mb-xs">Password</label>
                      <input type="password" required value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-surface-container-lowest border border-surface-variant rounded h-12 px-3 outline-none focus:border-primary" />
                    </div>
                    <div>
                      <label className="block font-label-caps text-label-caps text-on-surface-variant mb-xs">Confirm Password</label>
                      <input type="password" required value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="w-full bg-surface-container-lowest border border-surface-variant rounded h-12 px-3 outline-none focus:border-primary" />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2 */}
              {step === 2 && (
                <div className="space-y-md animate-in fade-in slide-in-from-bottom-4 duration-300">
                  <h3 className="font-title-lg text-title-lg mb-md">Step 2: Professional Information</h3>
                  <div>
                    <label className="block font-label-caps text-label-caps text-on-surface-variant mb-xs">Organization</label>
                    <select required value={organization} onChange={e => setOrganization(e.target.value)} className="w-full bg-surface-container-lowest border border-surface-variant rounded h-12 px-3 outline-none focus:border-primary">
                      <option value="" disabled>Select Organization</option>
                      {orgs.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block font-label-caps text-label-caps text-on-surface-variant mb-xs">Department / Division</label>
                    <select required disabled={!organization} value={department} onChange={e => setDepartment(e.target.value)} className="w-full bg-surface-container-lowest border border-surface-variant rounded h-12 px-3 outline-none focus:border-primary disabled:opacity-50">
                      <option value="" disabled>Select Department</option>
                      {depts.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block font-label-caps text-label-caps text-on-surface-variant mb-xs">Designation (Official Post)</label>
                    <select required disabled={!department} value={designation} onChange={e => setDesignation(e.target.value)} className="w-full bg-surface-container-lowest border border-surface-variant rounded h-12 px-3 outline-none focus:border-primary disabled:opacity-50">
                      <option value="" disabled>Select Designation</option>
                      {desigs.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block font-label-caps text-label-caps text-on-surface-variant mb-xs">Functional Role (Actual Work Area)</label>
                    <select required disabled={!designation} value={functionalRole} onChange={e => setFunctionalRole(e.target.value)} className="w-full bg-surface-container-lowest border border-surface-variant rounded h-12 px-3 outline-none focus:border-primary disabled:opacity-50">
                      <option value="" disabled>Select Functional Role</option>
                      {roles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                    </select>
                  </div>
                </div>
              )}

              {/* STEP 3 */}
              {step === 3 && (
                <div className="space-y-md animate-in fade-in slide-in-from-bottom-4 duration-300">
                  <h3 className="font-title-lg text-title-lg mb-md">Step 3: Experience</h3>
                  <div className="grid grid-cols-2 gap-md">
                    <div>
                      <label className="block font-label-caps text-label-caps text-on-surface-variant mb-xs">Total Experience</label>
                      <select required value={totalExperience} onChange={e => setTotalExperience(e.target.value)} className="w-full bg-surface-container-lowest border border-surface-variant rounded h-12 px-3 outline-none focus:border-primary">
                        <option value="" disabled>Select Range</option>
                        {expOptions.map(o => <option key={o} value={o}>{o}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block font-label-caps text-label-caps text-on-surface-variant mb-xs">Current Role Experience</label>
                      <select required value={currentRoleExperience} onChange={e => setCurrentRoleExperience(e.target.value)} className="w-full bg-surface-container-lowest border border-surface-variant rounded h-12 px-3 outline-none focus:border-primary">
                        <option value="" disabled>Select Range</option>
                        {expOptions.map(o => <option key={o} value={o}>{o}</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block font-label-caps text-label-caps text-on-surface-variant mb-xs">Previous Designation (Optional)</label>
                    <input value={previousDesignation} onChange={e => setPreviousDesignation(e.target.value)} className="w-full bg-surface-container-lowest border border-surface-variant rounded h-12 px-3 outline-none focus:border-primary" />
                  </div>
                  <div>
                    <label className="block font-label-caps text-label-caps text-on-surface-variant mb-xs">Previous Organization (Optional)</label>
                    <input value={previousOrganization} onChange={e => setPreviousOrganization(e.target.value)} className="w-full bg-surface-container-lowest border border-surface-variant rounded h-12 px-3 outline-none focus:border-primary" />
                  </div>
                  <div>
                    <label className="block font-label-caps text-label-caps text-on-surface-variant mb-xs">Major Responsibilities</label>
                    <textarea required value={majorResponsibilities} onChange={e => setMajorResponsibilities(e.target.value)} className="w-full bg-surface-container-lowest border border-surface-variant rounded h-24 p-3 outline-none focus:border-primary" />
                  </div>
                </div>
              )}

              {/* STEP 4 */}
              {step === 4 && (
                <div className="space-y-md animate-in fade-in slide-in-from-bottom-4 duration-300">
                  <h3 className="font-title-lg text-title-lg mb-md">Step 4: Skills & Proficiency</h3>
                  <div className="flex gap-sm items-end">
                    <div className="flex-1">
                      <label className="block text-xs font-bold text-on-surface-variant mb-1 uppercase tracking-wider">Skill (e.g. SQL, Statistical Analysis)</label>
                      <input value={tempSkill} onChange={e => setTempSkill(e.target.value)} className="w-full bg-surface-container-lowest border border-surface-variant rounded h-10 px-3 outline-none focus:border-primary" />
                    </div>
                    <div className="w-[150px]">
                      <label className="block text-xs font-bold text-on-surface-variant mb-1 uppercase tracking-wider">Proficiency</label>
                      <select value={tempProficiency} onChange={e => setTempProficiency(e.target.value)} className="w-full bg-surface-container-lowest border border-surface-variant rounded h-10 px-3 outline-none focus:border-primary">
                        {['Beginner', 'Intermediate', 'Advanced', 'Expert'].map(p => <option key={p} value={p}>{p}</option>)}
                      </select>
                    </div>
                    <button type="button" onClick={addSkill} className="h-10 px-4 bg-primary text-on-primary rounded text-sm font-bold">Add</button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {skills.map((s, idx) => (
                      <div key={idx} className="flex items-center gap-2 bg-secondary-container text-on-secondary-container px-3 py-1.5 rounded-full text-sm">
                        <span className="font-medium">{s.skill}</span>
                        <span className="text-xs opacity-80 border-l border-on-secondary-container/20 pl-2">{s.proficiency}</span>
                        <button type="button" onClick={() => removeSkill(idx)} className="ml-1 hover:text-error"><X className="w-3 h-3" /></button>
                      </div>
                    ))}
                    {skills.length === 0 && <p className="text-sm text-on-surface-variant italic">Add at least one skill to continue.</p>}
                  </div>
                </div>
              )}

              {/* STEP 5 */}
              {step === 5 && (
                <div className="space-y-md animate-in fade-in slide-in-from-bottom-4 duration-300">
                  <h3 className="font-title-lg text-title-lg mb-md">Step 5: Learning Preferences</h3>
                  
                  <div>
                    <label className="block font-label-caps text-label-caps text-on-surface-variant mb-2">Preferred Learning Formats (Select multiple)</label>
                    <div className="flex flex-wrap gap-2">
                      {formatOptions.map(fmt => (
                        <button key={fmt} type="button" onClick={() => toggleArray(preferredFormats, setPreferredFormats, fmt)} 
                          className={`px-3 py-1.5 rounded text-sm font-medium border transition-colors ${preferredFormats.includes(fmt) ? 'bg-primary text-on-primary border-primary' : 'bg-transparent border-surface-variant text-on-surface hover:bg-surface-container-high'}`}>
                          {fmt}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block font-label-caps text-label-caps text-on-surface-variant mb-xs">Preferred Language</label>
                    <select required value={preferredLanguage} onChange={e => setPreferredLanguage(e.target.value)} className="w-full bg-surface-container-lowest border border-surface-variant rounded h-12 px-3 outline-none focus:border-primary">
                      <option value="" disabled>Select Language</option>
                      <option value="English">English</option>
                      <option value="Hindi">Hindi</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-label-caps text-label-caps text-on-surface-variant mb-2">Learning Goals (Select multiple)</label>
                    <div className="flex flex-wrap gap-2">
                      {goalOptions.map(goal => (
                        <button key={goal} type="button" onClick={() => toggleArray(learningGoals, setLearningGoals, goal)} 
                          className={`px-3 py-1.5 rounded text-sm font-medium border transition-colors ${learningGoals.includes(goal) ? 'bg-primary text-on-primary border-primary' : 'bg-transparent border-surface-variant text-on-surface hover:bg-surface-container-high'}`}>
                          {goal}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 6 */}
              {step === 6 && (
                <div className="space-y-md animate-in fade-in slide-in-from-bottom-4 duration-300">
                  <h3 className="font-title-lg text-title-lg mb-md">Step 6: Review & Submit</h3>
                  <div className="bg-surface-container p-4 rounded border border-surface-variant space-y-4">
                    <div>
                      <h4 className="text-sm font-bold text-on-surface-variant uppercase tracking-wider mb-1">Identity</h4>
                      <p>{firstName} {lastName} ({email}) - Mobile: {mobileNumber}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-on-surface-variant uppercase tracking-wider mb-1">Role</h4>
                      <p>{orgs.find(o=>o.id===organization)?.name} <br/> {depts.find(d=>d.id===department)?.name} <br/> {desigs.find(d=>d.id===designation)?.name} - {roles.find(r=>r.id===functionalRole)?.name}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-on-surface-variant uppercase tracking-wider mb-1">Skills</h4>
                      <p>{skills.map(s => `${s.skill} (${s.proficiency})`).join(', ')}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-sm pt-sm">
                    <input id="terms" type="checkbox" required className="mt-1 w-4 h-4" />
                    <label htmlFor="terms" className="text-sm text-on-surface-variant cursor-pointer">
                      I confirm this information is correct and agree to the Terms of Service.
                    </label>
                  </div>
                </div>
              )}

              <div className="flex gap-4 pt-md">
                {step > 1 && (
                  <button type="button" onClick={() => setStep(step - 1)} className="px-4 py-2 border border-surface-variant rounded font-bold text-on-surface hover:bg-surface-container-high">
                    <ArrowLeft className="w-5 h-5 inline mr-1" /> Back
                  </button>
                )}
                <button 
                  type="submit" 
                  disabled={isLoading || (step === 4 && skills.length === 0)}
                  className="flex-1 bg-primary text-on-primary font-bold rounded h-12 hover:bg-primary/90 active:bg-primary transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {isLoading ? <Hourglass className="animate-spin" /> : (step === 6 ? <Check /> : <ArrowRight />)}
                  {isLoading ? 'Processing...' : (step === 6 ? 'Submit Registration' : 'Continue')}
                </button>
              </div>
            </form>

            <div className="mt-xl pt-lg border-t border-surface-variant text-center">
              <p className="font-body-md text-body-md text-on-surface-variant">
                Already have an account? <Link to="/login" className="text-primary font-bold hover:underline">Sign In</Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};



