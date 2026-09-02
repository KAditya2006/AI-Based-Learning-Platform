import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Pencil } from 'lucide-react';


export const ProfileEdit = () => {
  const navigate = useNavigate();

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

      {/* Personal Information Card */}
      <section className="bg-surface-container-lowest border border-surface-variant rounded shadow-[0px_1px_3px_rgba(26,22,20,0.05)] flex flex-col">
        <div className="border-b border-surface-variant px-lg py-md flex items-center justify-between">
          <h2 className="font-headline-sm text-headline-sm text-on-surface">Personal Information</h2>
        </div>
        <div className="p-lg flex flex-col gap-lg">
          {/* Avatar Section */}
          <div className="flex items-center gap-lg">
            <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-surface-variant group">
              <img 
                alt="Profile Avatar" 
                className="w-full h-full object-cover" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBl0Vve60AfbH1TzN1wskqUfjenScry9h0XUdHLRK1NGc76Xd3QVmyL0tr1VFrhDk2spJFs9RxCMOvYcsphv2aJfPqfOVTk8K5hDpnXy3J7Trd0lmNn5KbbDjOKBT-IfHRIT7gcyPzeXxZXqILYPoJSqL2ejdRHSsy7TIMGm7TcphJX_tYCxw8zC3_iJ1lcUC-BtSiL3S_Yl0a9xJmcjoFXtJDeABjtLVSW_OpM5AMffNThaXH_pWRdOA"
              />
              <div className="absolute inset-0 bg-inverse-surface/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                <Pencil className="text-surface-container-lowest" />
              </div>
            </div>
            <div>
              <button className="bg-surface-container-lowest border border-surface-variant text-on-surface font-label-caps text-label-caps px-4 py-2 rounded hover:bg-surface-container-low transition-colors duration-200">
                CHANGE AVATAR
              </button>
              <p className="font-caption text-caption text-on-surface-variant mt-xs">JPG, GIF or PNG. Max size of 800K</p>
            </div>
          </div>

          {/* Form Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
            <div>
              <label className="block font-label-caps text-label-caps text-on-surface-variant mb-sm" htmlFor="firstName">First Name</label>
              <input 
                className="w-full bg-surface-container-lowest border border-surface-variant rounded py-2 px-3 text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-fixed" 
                id="firstName" 
                placeholder="Enter first name" 
                type="text" 
                defaultValue="Aris" 
              />
            </div>
            <div>
              <label className="block font-label-caps text-label-caps text-on-surface-variant mb-sm" htmlFor="lastName">Last Name</label>
              <input 
                className="w-full bg-surface-container-lowest border border-surface-variant rounded py-2 px-3 text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-fixed" 
                id="lastName" 
                placeholder="Enter last name" 
                type="text" 
                defaultValue="Thorne" 
              />
            </div>
            <div>
              <label className="block font-label-caps text-label-caps text-on-surface-variant mb-sm" htmlFor="designation">Designation</label>
              <input 
                className="w-full bg-surface-container-lowest border border-surface-variant rounded py-2 px-3 text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-fixed" 
                id="designation" 
                placeholder="e.g. Workforce Planner" 
                type="text" 
                defaultValue="Senior Statistician" 
              />
            </div>
            <div>
              <label className="block font-label-caps text-label-caps text-on-surface-variant mb-sm" htmlFor="department">Department</label>
              <select 
                className="w-full bg-surface-container-lowest border border-surface-variant rounded py-2 px-3 text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-fixed appearance-none cursor-pointer" 
                id="department"
                defaultValue="dept1"
              >
                <option value="dept1">Department of Data Analysis</option>
                <option value="dept2">Workforce Development</option>
                <option value="dept3">Institutional Research</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Details Card */}
      <section className="bg-surface-container-lowest border border-surface-variant rounded shadow-[0px_1px_3px_rgba(26,22,20,0.05)] flex flex-col">
        <div className="border-b border-surface-variant px-lg py-md">
          <h2 className="font-headline-sm text-headline-sm text-on-surface">Contact Details</h2>
        </div>
        <div className="p-lg grid grid-cols-1 md:grid-cols-2 gap-lg">
          <div>
            <label className="block font-label-caps text-label-caps text-on-surface-variant mb-sm" htmlFor="email">Email Address</label>
            <input 
              className="w-full bg-surface-container-lowest border border-surface-variant rounded py-2 px-3 text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-fixed" 
              id="email" 
              placeholder="Enter email" 
              type="email" 
              defaultValue="aris.thorne@skillintel.gov" 
            />
          </div>
          <div>
            <label className="block font-label-caps text-label-caps text-on-surface-variant mb-sm" htmlFor="phone">Phone Number</label>
            <input 
              className="w-full bg-surface-container-lowest border border-surface-variant rounded py-2 px-3 text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-fixed" 
              id="phone" 
              placeholder="Enter phone number" 
              type="tel" 
              defaultValue="+1 (555) 123-4567" 
            />
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
          onClick={() => navigate('/profile')} 
          className="px-6 py-2 bg-primary text-on-primary font-body-md text-body-md rounded-lg hover:opacity-90 transition-opacity"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};
