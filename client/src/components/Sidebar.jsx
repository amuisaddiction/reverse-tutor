import React from 'react';
import { Home, Calendar as CalendarIcon, Clock, BookOpen, Brain, Activity, ScanLine, FileText, ChevronRight, BookMarked, LogOut, Target } from 'lucide-react';
import Logo from './Logo';

const Sidebar = ({ activeScreen, setActiveScreen, onLogout, onSwitchTarget, examType }) => {
  const isNeet = examType === 'NEET';
  const themeColor = isNeet ? 'text-emerald-500' : 'text-indigo-500';
  const themeBg = isNeet ? 'bg-emerald-600' : 'bg-indigo-600';
  const themeShadow = isNeet ? 'shadow-emerald-900/50' : 'shadow-indigo-900/50';

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <Home size={20} /> },
    { id: 'study-map', label: 'Curriculum Map', icon: <BookOpen size={20} /> },
    { id: 'session', label: 'AI Session', icon: <Brain size={20} /> },
    { id: 'quiz', label: 'Quiz Mode', icon: <Clock size={20} /> },
    { id: 'mistakes', label: 'Mistake Notebook', icon: <BookMarked size={20} /> },
    { id: 'past-papers', label: 'Past Papers', icon: <FileText size={20} /> },
    { id: 'scan-question', label: 'Doubt Scanner', icon: <ScanLine size={20} /> },
    { id: 'scheduler', label: 'Exam Scheduler', icon: <CalendarIcon size={20} /> },
    { id: 'analytics', label: 'Progress Tracker', icon: <Activity size={20} /> },
  ];

  return (
    <div className="w-64 bg-vercel-dark text-slate-300 h-screen flex flex-col fixed left-0 top-0 border-r border-vercel-border">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
          <Logo className="w-8 h-8" color="#ffffff" />
          RevTutor
        </h1>
        <p className={`text-xs mt-1 uppercase tracking-wider font-bold ${themeColor}`}>
          {examType} PREP
        </p>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4">
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => setActiveScreen(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
              activeScreen === item.id 
                ? `${themeBg} text-white shadow-lg ${themeShadow}` 
                : 'hover:bg-slate-800 hover:text-white'
            }`}
          >
            {item.icon}
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800 space-y-2">
        <button onClick={onSwitchTarget} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800 hover:text-white transition-all duration-200">
          <Target size={20} className="text-slate-400" />
          <span className="font-medium">Switch Target</span>
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
