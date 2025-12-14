import React from 'react';
import { Link } from 'react-router-dom';
import { reviewHistoryData, reviewQueueData, backendHealthData, reviewsData } from '../data/dummy';
import { Search, FileText, AppWindow, User, Bell } from 'lucide-react';

// --- Image 0 (Stitch Design-8): Landing/Role Selection ---
export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col relative">
      <header className="px-8 py-6 flex justify-between items-center absolute w-full top-0">
         <div className="text-xl font-bold flex items-center gap-3">
             <div className="flex gap-0.5">
                   <div className="w-1.5 h-4 bg-black rounded-full"></div>
                   <div className="w-1.5 h-4 bg-black rounded-full"></div>
                   <div className="w-1.5 h-4 bg-black rounded-full"></div>
            </div>
            App Store
         </div>
         <nav className="flex gap-6 text-sm font-medium items-center text-gray-600">
             <Link to="#">Dashboard</Link>
             <Link to="#">Apps</Link>
             <Link to="#">Documentation</Link>
             <Link to="#">Support</Link>
             <div className="w-8 h-8 bg-teal-800 rounded-full flex items-center justify-center">
                 <div className="w-4 h-4 border-2 border-white rounded-sm transform rotate-45"></div>
             </div>
         </nav>
      </header>
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 mt-20">
        <h1 className="text-4xl font-bold mb-4">Welcome to the App Store</h1>
        <p className="text-gray-600 text-lg mb-12">To get started, please select your role</p>
        <div className="flex gap-4">
          <Link to="/admin/dashboard" className="bg-brand-dark text-white w-48 py-3 rounded-lg font-medium hover:opacity-90 transition">Admin</Link>
          <Link to="/ivi/settings" className="bg-gray-100 text-brand-dark w-48 py-3 rounded-lg font-medium hover:bg-gray-200 transition">Developer</Link>
        </div>
      </main>
    </div>
  );
};

// --- Image 1 (Stitch Design-9): Settings Page (Sidebar Layout) ---
export const SettingsPage: React.FC = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Settings</h1>
      
      {/* Tabs */}
      <div className="border-b mb-8 flex gap-8 text-sm font-medium text-gray-500">
        <button className="pb-3 border-b-2 border-brand-dark text-brand-dark">Profile</button>
        <button className="pb-3 hover:text-brand-dark transition">Security</button>
        <button className="pb-3 hover:text-brand-dark transition">Notifications</button>
      </div>

      <div className="space-y-12 max-w-2xl">
        <section>
          <h2 className="text-xl font-bold mb-6">Personal Information</h2>
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Full name</label>
              <input type="text" className="input-field" defaultValue="Ethan Carter" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Email</label>
              <input type="email" className="input-field" defaultValue="ethan.carter@example.com" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Phone number</label>
              <input type="tel" className="input-field" placeholder="+1 555 000 0000" />
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-6">Profile Photo</h2>
          <div className="flex items-center gap-6">
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Ethan" alt="Profile" className="w-24 h-24 rounded-full bg-orange-100" />
            <div>
              <h3 className="font-bold text-lg">Ethan Carter</h3>
              <p className="text-gray-500 mb-4 text-sm">ethan.carter@example.com</p>
              <button className="btn-secondary py-2 px-4 text-sm">Change Photo</button>
            </div>
          </div>
        </section>
        
        <section>
            <h2 className="text-xl font-bold mb-6">Change Password</h2>
            <div className="space-y-4 mb-6">
                <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700">Current password</label>
                    <input type="password" className="input-field" placeholder="Enter current password" />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700">New password</label>
                    <input type="password" className="input-field" placeholder="Enter new password" />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700">Confirm new password</label>
                    <input type="password" className="input-field" placeholder="Confirm new password" />
                </div>
            </div>
            <button className="bg-brand-dark text-white px-6 py-2 rounded-lg text-sm font-medium">Update Password</button>
        </section>
      </div>
    </div>
  );
};

// --- Image 2 (Stitch Design-11): System Health (Admin Layout) ---
export const SystemHealthPage: React.FC = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">System Health</h1>
      
      <section className="mb-12">
        <h2 className="text-xl font-bold mb-6">UI Latency</h2>
        <div className="card h-80 relative flex flex-col justify-between">
           <div>
            <p className="text-gray-500 mb-1 font-medium">UI Latency</p>
            <div className="flex items-baseline gap-2">
                <h3 className="text-4xl font-bold">20ms</h3>
                <p className="text-sm text-red-500 font-medium bg-red-50 px-2 py-0.5 rounded">Last 7 Days -5%</p>
            </div>
           </div>
          
           {/* Abstract Chart Representation */}
           <div className="flex items-end justify-between h-40 gap-4">
              {/* Mocking the wave curves with SVGs */}
              {[1,2,3,4].map(i => (
                 <svg key={i} viewBox="0 0 100 60" className="w-1/4 h-full overflow-visible" preserveAspectRatio="none">
                    <path d={`M0,60 Q50,${10 * i} 100,60`} fill="none" stroke="#6b7280" strokeWidth="2" />
                 </svg>
              ))}
           </div>
           <div className="flex justify-between text-xs text-gray-400 mt-2">
             <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
           </div>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold mb-6">Backend Health</h2>
        <div className="card p-0 overflow-hidden border border-gray-200">
          <table className="w-full text-left">
            <thead className="bg-white border-b">
              <tr>
                <th className="p-4 pl-6 text-sm font-medium text-gray-500">Service</th>
                <th className="p-4 text-sm font-medium text-gray-500 text-center">Status</th>
                <th className="p-4 text-sm font-medium text-gray-500">Last Updated</th>
              </tr>
            </thead>
            <tbody>
              {backendHealthData.map((item, idx) => (
                <tr key={idx} className="border-b last:border-0 hover:bg-gray-50 transition">
                  <td className="p-4 pl-6 text-sm">{item.service}</td>
                  <td className="p-4 text-center">
                    <span className={`px-8 py-1.5 rounded-full text-xs font-semibold ${item.status === 'Healthy' ? 'bg-gray-100 text-gray-700' : 'bg-gray-200 text-gray-700'}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-gray-400 font-light">{item.updated}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

// --- Image 3 (Stitch Design-3): Review History (Admin Layout) ---
export const ReviewHistoryPage: React.FC = () => {
  return (
    <div>
       <div className="mb-10">
        <h1 className="text-3xl font-bold mb-2">Review History</h1>
        <p className="text-gray-500 font-light">View past review outcomes, including timestamps and reviewer notes, for historical tracking and analysis.</p>
      </div>

      <div className="mb-6 relative">
          <Search className="absolute left-4 top-3.5 text-gray-400" size={20}/>
          <input type="text" placeholder="Search" className="w-full bg-gray-100 rounded-lg pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-gray-200" />
      </div>

      <div className="card p-0 overflow-hidden border border-gray-200">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4 pl-6 text-sm font-medium text-gray-900">App Name</th>
              <th className="p-4 text-sm font-medium text-gray-900">Developer</th>
              <th className="p-4 text-sm font-medium text-gray-900">Reviewer</th>
              <th className="p-4 text-sm font-medium text-gray-900 text-center">Outcome</th>
              <th className="p-4 text-sm font-medium text-gray-900">Timestamp</th>
              <th className="p-4 text-sm font-medium text-gray-900 w-1/4">Notes</th>
            </tr>
          </thead>
          <tbody>
            {reviewHistoryData.map((item) => (
              <tr key={item.id} className="border-b last:border-0 hover:bg-gray-50">
                <td className="p-4 pl-6 text-sm text-gray-800">{item.appName}</td>
                <td className="p-4 text-sm text-gray-500">{item.developer}</td>
                <td className="p-4 text-sm text-gray-500">{item.reviewer}</td>
                <td className="p-4 text-center">
                  <span className={`px-4 py-1 rounded-full text-xs font-bold ${item.outcome === 'Approved' ? 'bg-gray-200 text-gray-800' : 'bg-gray-200 text-gray-800'}`}>
                    {item.outcome}
                  </span>
                </td>
                <td className="p-4 text-sm text-gray-500 whitespace-pre-line">{item.timestamp.replace(' ', '\n')}</td>
                <td className="p-4 text-sm text-gray-500">{item.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// --- Image 4 (Stitch Design-1): Review Queue (Review Queue Layout) ---
export const ReviewQueuePage: React.FC = () => {
    return (
        <div>
         <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Review Queue</h1>
          <p className="text-gray-500">A list of apps and app versions that are currently awaiting review.</p>
        </div>
  
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-white border-b">
              <tr>
                <th className="p-5 pl-6 text-sm font-medium text-gray-700">App Name</th>
                <th className="p-5 text-sm font-medium text-gray-700">Version</th>
                <th className="p-5 text-sm font-medium text-gray-700 text-center">Status</th>
                <th className="p-5 text-sm font-medium text-gray-700">Submitted</th>
                <th className="p-5 text-sm font-medium text-gray-700 text-right pr-6">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reviewQueueData.map((item) => (
                <tr key={item.id} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="p-5 pl-6 font-medium text-gray-800">{item.appName}</td>
                  <td className="p-5 text-gray-500">{item.version}</td>
                  <td className="p-5 text-center">
                    <span className="px-4 py-1.5 bg-gray-100 text-gray-800 font-bold text-xs rounded-full">
                      {item.status}
                    </span>
                  </td>
                  <td className="p-5 text-gray-500">{item.submitted}</td>
                  <td className="p-5 text-right pr-6">
                      <button className="text-gray-900 font-bold hover:underline text-sm">View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

// --- Image 5 (Stitch Design-10): Admin Dashboard (Admin Layout) ---
export const AdminDashboardPage: React.FC = () => {
    return (
      <div>
        <h1 className="text-3xl font-bold mb-10">Dashboard</h1>
        
        <div className="grid grid-cols-3 gap-6 mb-12">
            <div className="bg-white p-6 rounded-lg border border-gray-200">
                <p className="text-gray-600 mb-2 font-medium">Total Apps</p>
                <h2 className="text-4xl font-bold">1,250</h2>
            </div>
            <div className="bg-white p-6 rounded-lg border border-gray-200">
                <p className="text-gray-600 mb-2 font-medium">Pending Reviews</p>
                <h2 className="text-4xl font-bold">35</h2>
            </div>
            <div className="bg-white p-6 rounded-lg border border-gray-200">
                <p className="text-gray-600 mb-2 font-medium">Daily Installs</p>
                <h2 className="text-4xl font-bold">2,450</h2>
            </div>
        </div>

        <h2 className="text-xl font-bold mb-6">Activity Feed</h2>
        <div className="relative pl-4">
             {/* Timeline Line */}
            <div className="absolute left-6 top-2 bottom-4 w-0.5 bg-gray-200"></div>
            
            <div className="space-y-8">
                {[
                    { icon: AppWindow, text: "New app 'Travel Guide' submitted", time: "2 hours ago" },
                    { icon: "✓", text: "Review completed for 'Fitness Tracker'", time: "4 hours ago" },
                    { icon: AppWindow, text: "App 'Music Player' updated", time: "1 day ago" },
                    { icon: User, text: "User 'Sarah' reviewed 'Cooking Recipes'", time: "2 days ago" },
                    { icon: FileText, text: "App 'News Aggregator' published", time: "3 days ago" }
                ].map((item, idx) => (
                    <div key={idx} className="flex items-start gap-4 relative z-10">
                        <div className="w-5 h-5 bg-white border border-black rounded flex items-center justify-center text-xs mt-1 shadow-sm">
                            {typeof item.icon === 'string' ? item.icon : <div className="w-1 h-1 bg-black rounded-full"></div>}
                        </div>
                        <div>
                            <p className="font-medium text-gray-900">{item.text}</p>
                            <p className="text-gray-400 text-sm">{item.time}</p>
                        </div>
                    </div>
                ))}
            </div>
            
            <div className="mt-12 flex justify-end gap-4">
                <button className="bg-brand-dark text-white px-6 py-2 rounded-lg text-sm font-medium">Submit App</button>
                <button className="bg-gray-200 text-brand-dark px-6 py-2 rounded-lg text-sm font-medium">View All Apps</button>
            </div>
        </div>
      </div>
    );
  };

// --- Image 6 (Stitch Design-4): Analytics (Admin Layout) ---
export const AnalyticsPage: React.FC = () => {
    return (
        <div>
            <h1 className="text-3xl font-bold mb-10">App Performance Overview</h1>
            
            <section className="mb-12">
                <h2 className="text-xl font-bold mb-6">Install Trends</h2>
                <div className="card h-80">
                    <p className="text-gray-600 font-medium">App Installs Over Time</p>
                    <h3 className="text-4xl font-bold mb-1">12,345</h3>
                    <p className="text-sm text-green-500 font-medium mb-4">Last 30 Days +5%</p>
                    
                    {/* Mock Line Chart */}
                    <div className="h-40 flex items-end justify-between px-2 gap-4">
                         {[20, 40, 30, 60, 50, 90, 70].map((h, i) => (
                              <div key={i} className="w-full relative h-full overflow-visible">
                                 {/* Just using divs to simulate peaks for simplicity */}
                                 <svg viewBox="0 0 100 100" className="absolute bottom-0 w-full h-full" preserveAspectRatio="none">
                                     <path d={`M0,100 Q50,${100 - h} 100,100`} fill="none" stroke="#6b7280" strokeWidth="2" />
                                 </svg>
                              </div>
                         ))}
                    </div>
                     <div className="flex justify-between text-xs text-gray-400 mt-2 border-t pt-2">
                        <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span><span>Jul</span>
                    </div>
                </div>
            </section>
            
            <section className="mb-12">
                <h2 className="text-xl font-bold mb-6">Update Activity</h2>
                <div className="card h-80">
                    <p className="text-gray-600 font-medium">App Updates</p>
                    <h3 className="text-4xl font-bold mb-1">8,765</h3>
                    <p className="text-sm text-red-500 font-medium mb-8">Last 30 Days -2%</p>
                    
                    {/* Mock Bar Chart */}
                    <div className="flex items-end justify-between h-32 gap-6">
                        {[60, 60, 60, 60, 60, 60, 60].map((h, i) => (
                            <div key={i} className="w-full bg-gray-100 rounded-t-sm h-full relative">
                                <div className="absolute bottom-0 w-full bg-gray-200" style={{height: `${h}%`}}></div>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between text-xs text-gray-400 mt-2 border-t pt-2">
                        <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span><span>Jul</span>
                    </div>
                </div>
            </section>

             <section>
                <h2 className="text-xl font-bold mb-6">Uninstall Rates</h2>
                <div className="card">
                     <p className="text-gray-600 font-medium">App Uninstalls</p>
                    <h3 className="text-4xl font-bold mb-1">4,567</h3>
                    <p className="text-sm text-green-500 font-medium mb-8">Last 30 Days +1%</p>
                    <div className="space-y-6">
                        {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"].map((month, i) => {
                            const width = [90, 10, 85, 70, 10, 80, 40][i];
                            return (
                            <div key={month} className="flex items-center gap-4">
                                <span className="text-xs text-gray-500 w-8 font-medium">{month}</span>
                                <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden relative">
                                    <div className="h-full bg-gray-200 rounded-full" style={{width: `${width}%`}}></div>
                                    <div className="absolute top-0 h-full w-0.5 bg-gray-400" style={{left: `${width}%`}}></div>
                                </div>
                            </div>
                        )})}
                    </div>
                </div>
            </section>
        </div>
    )
}


// --- Image 7 (Stitch Design.png): Login Page ---
export const LoginPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col">
       <header className="px-8 py-6 border-b border-gray-100 flex items-center gap-3">
         <div className="text-2xl font-bold">*</div>
         <div className="font-bold text-lg">App Store Admin</div>
      </header>
      <main className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-md p-8">
          <h1 className="text-3xl font-bold text-center mb-12">Welcome back</h1>
          <form className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Email</label>
              <input type="email" className="input-field bg-gray-50 border-gray-100 py-3.5" placeholder="Enter your email" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Password</label>
              <input type="password" className="input-field bg-gray-50 border-gray-100 py-3.5" placeholder="Enter your password" />
            </div>
            <div className="text-center">
                <button type="button" className="text-sm text-gray-400 hover:text-gray-600">Forgot password?</button>
            </div>
            <button className="w-full bg-brand-dark text-white py-4 rounded-xl font-medium hover:opacity-90 transition">Log in</button>
          </form>
        </div>
      </main>
    </div>
  );
};

// --- Image 8 (Stitch Design-2.jpg): Submission Details (Sidebar Layout) ---
export const SubmissionDetailsPage: React.FC = () => {
    return (
      <div>
        <div className="text-sm text-gray-500 mb-4 font-light">Submissions / In Review / App Details</div>
        <h1 className="text-3xl font-bold mb-2">App Submission Details</h1>
        <p className="text-gray-500 mb-12 font-light">Review the app submission and provide feedback.</p>
  
        <section className="mb-12">
          <h2 className="text-xl font-bold mb-6 pb-2">App Information</h2>
          <div className="grid grid-cols-2 gap-y-10 gap-x-12 max-w-4xl border-t border-gray-200 pt-6">
              <div>
                  <h3 className="text-xs text-gray-400 mb-1 uppercase tracking-wide">App Name</h3>
                  <p className="font-medium text-gray-900">Streamer Pro</p>
              </div>
              <div>
                  <h3 className="text-xs text-gray-400 mb-1 uppercase tracking-wide">Version</h3>
                  <p className="font-medium text-gray-900">1.2.3</p>
              </div>
              <div>
                  <h3 className="text-xs text-gray-400 mb-1 uppercase tracking-wide">Category</h3>
                  <p className="font-medium text-gray-900">Entertainment</p>
              </div>
              <div>
                  <h3 className="text-xs text-gray-400 mb-1 uppercase tracking-wide">Description</h3>
                  <p className="font-medium text-gray-900 text-sm leading-relaxed max-w-sm">Streamer Pro is a video streaming application that allows users to watch their favorite shows and movies on demand.</p>
              </div>
               <div>
                  <h3 className="text-xs text-gray-400 mb-1 uppercase tracking-wide">Developer</h3>
                  <p className="font-medium text-gray-900">Tech Innovators Inc.</p>
              </div>
              <div>
                  <h3 className="text-xs text-gray-400 mb-1 uppercase tracking-wide">Submission Date</h3>
                  <p className="font-medium text-gray-900">2024-01-15</p>
              </div>
          </div>
        </section>
  
        <section className="mb-12">
          <h2 className="text-xl font-bold mb-6">Screenshots</h2>
          <div className="flex gap-8 overflow-x-auto pb-6">
            {/* Mobile Mockups */}
            {[1, 2, 3].map(i => (
                <div key={i} className="w-[200px] h-[400px] bg-red-100 rounded-[2rem] flex-shrink-0 border-[6px] border-gray-800 relative overflow-hidden shadow-xl">
                     {/* Internal screen */}
                     <div className="w-full h-full bg-white relative">
                         {/* Content placeholder */}
                         <div className="absolute top-0 w-full h-16 bg-gray-100 flex items-center justify-center text-xs text-gray-400">Header</div>
                         <div className="p-4 mt-16 space-y-2">
                             <div className="w-full h-24 bg-gray-100 rounded"></div>
                             <div className="w-3/4 h-2 bg-gray-100 rounded"></div>
                             <div className="w-1/2 h-2 bg-gray-100 rounded"></div>
                         </div>
                     </div>
                </div>
            ))}
          </div>
        </section>
        
        <section>
             <h2 className="text-xl font-bold mb-6">Reviewer Actions</h2>
             <div className="h-48 bg-gray-50 border border-dashed border-gray-300 rounded-lg"></div>
        </section>
      </div>
    );
  };

// --- Image 9 (Stitch Design-5.png): Ratings & Reviews (Admin Layout) ---
export const RatingsReviewsPage: React.FC = () => {
    return (
      <div>
         <div className="mb-10">
          <h1 className="text-3xl font-bold mb-2">Ratings & Reviews</h1>
          <p className="text-gray-500 font-light">Manage and respond to user feedback for your apps.</p>
        </div>

        <section className="mb-10">
            <h2 className="text-xl font-bold mb-6">Filters</h2>
            <div className="space-y-4 max-w-md">
                <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700">App</label>
                    <input type="text" className="input-field bg-white border-gray-200" />
                </div>
                 <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700">Date</label>
                    <input type="text" className="input-field bg-white border-gray-200" />
                </div>
                 <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700">Rating</label>
                    <input type="text" className="input-field bg-white border-gray-200" />
                </div>
            </div>
        </section>
  
        <section>
            <h2 className="text-xl font-bold mb-6">Reviews</h2>
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <table className="w-full text-left">
                <thead className="bg-gray-50 border-b">
                <tr>
                    <th className="p-4 pl-6 text-sm font-medium text-gray-900">App</th>
                    <th className="p-4 text-sm font-medium text-gray-900">User</th>
                    <th className="p-4 text-sm font-medium text-gray-900">Rating</th>
                    <th className="p-4 text-sm font-medium text-gray-900 w-2/5">Comment</th>
                    <th className="p-4 text-sm font-medium text-gray-900">Date</th>
                </tr>
                </thead>
                <tbody>
                {reviewsData.map((item) => (
                    <tr key={item.id} className="border-b last:border-0 hover:bg-gray-50">
                        <td className="p-4 pl-6 font-medium text-gray-800">{item.app}</td>
                        <td className="p-4 text-gray-500">{item.user}</td>
                        <td className="p-4 text-gray-500">{item.rating}</td>
                        <td className="p-4 text-gray-500 text-sm">{item.comment}</td>
                        <td className="p-4 text-gray-500 text-sm">{item.date}</td>
                    </tr>
                ))}
                </tbody>
            </table>
            </div>
        </section>
      </div>
    );
  };
// --- Image 10 (Stitch Design-7.png): Reset Password Page ---
export const ResetPasswordPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col">
       <header className="px-8 py-6 border-b border-gray-100 flex items-center justify-between">
         <div className="text-xl font-bold flex items-center gap-3">
             <div className="flex gap-0.5">
                   <div className="w-1.5 h-4 bg-black rounded-full"></div>
                   <div className="w-1.5 h-4 bg-black rounded-full"></div>
                   <div className="w-1.5 h-4 bg-black rounded-full"></div>
            </div>
            App Store
         </div>
         <nav className="flex gap-6 text-sm font-medium items-center text-gray-600">
             <Link to="/admin/dashboard">Dashboard</Link>
             <Link to="#">Apps</Link>
             <Link to="#">Docs</Link>
             <Link to="#">Community</Link>
             <div className="w-8 h-8 bg-teal-800 rounded-full flex items-center justify-center">
                 <div className="w-4 h-4 border-2 border-white rounded-sm transform rotate-45"></div>
             </div>
         </nav>
      </header>
      <main className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-lg p-8">
          <h1 className="text-3xl font-bold text-center mb-8">Reset your password</h1>
          <form className="space-y-6">
            <div>
              <label className="sr-only">Email</label>
              <input type="email" className="input-field bg-gray-100 border-transparent py-4 text-center text-lg" placeholder="Email" />
            </div>
            <button className="w-full bg-black text-white py-4 rounded-lg font-medium hover:opacity-90 transition">Send reset link</button>
            <div className="text-center">
                <span className="text-gray-500">Remember your password? </span>
                <Link to="/login" className="text-gray-900 font-medium hover:underline">Sign in</Link>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};