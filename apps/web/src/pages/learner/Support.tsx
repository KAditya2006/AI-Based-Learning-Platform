import React from 'react';
import { Building, Headset, MapPin, Shield } from 'lucide-react';


export const Support = () => {
  return (
    <div className="flex-grow w-full max-w-screen-2xl mx-auto px-lg py-xl font-body-md text-on-surface bg-background min-h-screen animate-in fade-in duration-300">
      <style>
        {`
          .shadow-card {
            box-shadow: 0px 1px 3px rgba(26, 22, 20, 0.05);
          }
        `}
      </style>
      
      {/* Header Section */}
      <div className="mb-xl max-w-3xl mt-xl">
        <h1 className="font-display-lg text-display-lg text-on-surface mb-sm">Contact Us</h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant">
          For official inquiries, support, or technical assistance regarding the SkillIntel platform. All communications are subject to rigorous institutional security protocols to ensure data integrity and confidentiality.
        </p>
      </div>

      {/* Split Layout Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-xl">
        
        {/* Left Column: Secure Inquiry Form */}
        <div className="lg:col-span-7 flex flex-col gap-xl">
          <div className="bg-surface border border-outline-variant rounded-lg p-xl shadow-card">
            <div className="flex items-center gap-sm mb-lg border-b border-outline-variant pb-md">
              <Shield className="text-primary" />
              <h2 className="font-headline-sm text-headline-sm text-on-surface m-0">Secure Inquiry Form</h2>
              <span className="ml-auto inline-flex items-center px-sm py-xs rounded bg-surface-container-high border border-outline-variant">
                <span className="w-2 h-2 rounded-full bg-secondary-container mr-sm"></span>
                <span className="font-caption text-caption text-on-surface-variant">Secure Government System</span>
              </span>
            </div>
            
            <form className="space-y-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
                <div className="flex flex-col">
                  <label className="font-label-caps text-label-caps text-on-surface-variant mb-xs uppercase" htmlFor="fullName">Full Name</label>
                  <input className="bg-surface border border-outline-variant rounded-lg px-md py-sm focus:outline-none focus:border-secondary-container focus:ring-2 focus:ring-tertiary-fixed text-on-surface font-body-md" id="fullName" name="fullName" required type="text" />
                </div>
                <div className="flex flex-col">
                  <label className="font-label-caps text-label-caps text-on-surface-variant mb-xs uppercase" htmlFor="officialEmail">Official Email (.gov/.mil)</label>
                  <input className="bg-surface border border-outline-variant rounded-lg px-md py-sm focus:outline-none focus:border-secondary-container focus:ring-2 focus:ring-tertiary-fixed text-on-surface font-body-md" id="officialEmail" name="officialEmail" pattern=".*(\.gov|\.mil)$" required title="Please enter a valid .gov or .mil email address." type="email" />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
                <div className="flex flex-col">
                  <label className="font-label-caps text-label-caps text-on-surface-variant mb-xs uppercase" htmlFor="department">Department / Agency</label>
                  <select className="bg-surface border border-outline-variant rounded-lg px-md py-sm focus:outline-none focus:border-secondary-container focus:ring-2 focus:ring-tertiary-fixed text-on-surface font-body-md appearance-none cursor-pointer" id="department" name="department" defaultValue="">
                    <option disabled value="">Select Department</option>
                    <option value="dod">Department of Defense</option>
                    <option value="dhs">Department of Homeland Security</option>
                    <option value="dos">Department of State</option>
                    <option value="other">Other Federal Agency</option>
                  </select>
                </div>
                <div className="flex flex-col">
                  <label className="font-label-caps text-label-caps text-on-surface-variant mb-xs uppercase" htmlFor="subject">Subject</label>
                  <input className="bg-surface border border-outline-variant rounded-lg px-md py-sm focus:outline-none focus:border-secondary-container focus:ring-2 focus:ring-tertiary-fixed text-on-surface font-body-md" id="subject" name="subject" required type="text" />
                </div>
              </div>
              
              <div className="flex flex-col">
                <label className="font-label-caps text-label-caps text-on-surface-variant mb-xs uppercase" htmlFor="message">Message</label>
                <textarea className="bg-surface border border-outline-variant rounded-lg px-md py-sm focus:outline-none focus:border-secondary-container focus:ring-2 focus:ring-tertiary-fixed text-on-surface font-body-md resize-none" id="message" name="message" required rows={5}></textarea>
              </div>
              
              <div className="flex items-start gap-sm mt-md">
                <input className="mt-xs border-outline-variant rounded text-secondary-container focus:ring-tertiary-fixed bg-surface cursor-pointer" id="consent" type="checkbox" />
                <label className="font-caption text-caption text-on-surface-variant leading-tight cursor-pointer" htmlFor="consent">
                  By submitting this form, I acknowledge that this is a U.S. Government information system. Communications are monitored and subject to the Privacy Act of 1974.
                </label>
              </div>
              
              <div className="pt-md flex justify-end">
                <button className="bg-secondary-container text-on-primary font-label-caps text-label-caps uppercase px-lg py-md rounded-lg hover:bg-primary transition-colors duration-200 active:scale-95 shadow-sm" type="submit">
                  Submit Secure Inquiry
                </button>
              </div>
            </form>
          </div>
        </div>
        
        {/* Right Column: Institutional Contacts & Map */}
        <div className="lg:col-span-5 flex flex-col gap-xl">
          {/* Contact Info Card */}
          <div className="bg-surface border border-outline-variant rounded-lg p-xl shadow-card">
            <h3 className="font-headline-sm text-headline-sm text-on-surface mb-md border-b border-outline-variant pb-sm">Institutional Contacts</h3>
            <div className="space-y-lg">
              <div className="flex items-start gap-md">
                <div className="bg-surface-container-low p-sm rounded border border-outline-variant flex-shrink-0">
                  <Building className="text-primary" />
                </div>
                <div>
                  <h4 className="font-label-caps text-label-caps text-on-surface-variant uppercase mb-xs">Headquarters</h4>
                  <p className="font-body-md text-body-md text-on-surface">
                    SkillIntel Command Center<br/>
                    1200 Federal Plaza, NW<br/>
                    Washington, DC 20004
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-md">
                <div className="bg-surface-container-low p-sm rounded border border-outline-variant flex-shrink-0">
                  <Headset className="text-primary" />
                </div>
                <div>
                  <h4 className="font-label-caps text-label-caps text-on-surface-variant uppercase mb-xs">Technical Help Desk</h4>
                  <p className="font-body-md text-body-md text-on-surface">
                    Available 24/7 for cleared personnel.<br/>
                    Phone: +1 (800) 555-0199<br/>
                    Email: support@skillintel.gov
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Map View */}
          <div className="bg-surface border border-outline-variant rounded-lg overflow-hidden shadow-card flex-grow flex flex-col min-h-[300px]">
            <div className="px-md py-sm border-b border-outline-variant bg-surface-container-low">
              <h4 className="font-label-caps text-label-caps text-on-surface-variant uppercase m-0">Facility Location Map</h4>
            </div>
            <div className="flex-grow w-full h-full relative bg-surface-container min-h-[250px]">
              {/* Map Placeholder */}
              <div className="absolute inset-0 bg-cover bg-center w-full h-full opacity-60" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBmRO8jomtky_jfutTxJwtF269b7nBau1Ka3kQc6N82ve_UrJ3JYdsZ5DV0hSJmeuPi2PgSeGgRUr2p3-q-xcgD2AMUhvAE6BJCJhn-e10pxQ4_7wilFQVdst8pGs8Tf9tb7Kl2ifO4SdPU4aDOFT8ct1jzj2F454h2AtJhyphpCg7PuQjubAOkrOfbTCgSQcoukpswAgqEIA4LnVaKGY8uGHqJsjumI2cfY_snIZeeMFr6AXTXkrzrew')" }}></div>
              
              {/* Overlay Pin */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                <div className="bg-secondary-container text-on-primary p-xs rounded-full shadow-md flex items-center justify-center w-10 h-10">
                  <MapPin />
                </div>
              </div>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
};
