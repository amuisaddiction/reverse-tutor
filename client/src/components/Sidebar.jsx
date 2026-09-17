import React from 'react';
import { Home, BookOpen, FileText, Settings, LogOut } from 'lucide-react';

const Sidebar = ({ activeScreen, setActiveScreen, onLogout }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <Home size={20} /> },
    { id: 'past-papers', label: 'Past Papers (MCQs)', icon: <FileText size={20} /> },
    { id: 'study-map', label: 'Teach AI (Study Map)', icon: <BookOpen size={20} /> },
  ];

  return (
    <div className="w-64 bg-slate-900 text-slate-300 h-screen flex flex-col fixed left-0 top-0 border-r border-slate-800">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          <span className="text-indigo-500">🔄</span> RevTutor
        </h1>
        <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider font-semibold">JEE / NEET Prep</p>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4">
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => setActiveScreen(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
              activeScreen === item.id 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/50' 
                : 'hover:bg-slate-800 hover:text-white'
            }`}
          >
            {item.icon}
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800 space-y-2">
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800 transition-all duration-200">
          <Settings size={20} />
          <span className="font-medium">Settings</span>
        </button>
        <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-900/30 text-red-400 hover:text-red-300 transition-all duration-200">
          <LogOut size={20} />
          <span className="font-medium">Sign Out</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
