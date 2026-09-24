import React, { useState, useEffect } from 'react';
import LandingPage from './pages/LandingPage';
import Onboarding from './pages/Onboarding';
import Home from './pages/Home';
import Session from './pages/Session';
import PastPapers from './pages/PastPapers';
import QuizMode from './pages/QuizMode';
import ScanQuestion from './pages/ScanQuestion';
import ExamScheduler from './pages/ExamScheduler';
import Analytics from './pages/Analytics';
import MistakesNotebook from './pages/MistakesNotebook';
import Sidebar from './components/Sidebar';
import { Menu, X } from 'lucide-react';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [examType, setExamType] = useState(null); 
  const [activeScreen, setActiveScreen] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [sessionConfig, setSessionConfig] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedExam = localStorage.getItem('examType');
    if (token) setIsAuthenticated(true);
    if (savedExam) setExamType(savedExam);
  }, []);

  const handleLogin = () => setIsAuthenticated(true);
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('examType');
    setIsAuthenticated(false);
    setExamType(null);
  };

  const handleSwitchTarget = () => {
    setExamType(null);
  };

  const handleSelectExam = (type) => {
    setExamType(type);
    localStorage.setItem('examType', type);
  };

  const startSession = (topic, difficulty) => {
    setSessionConfig({ topic, difficulty });
    setActiveScreen('session');
  };

  if (!isAuthenticated) return <LandingPage onLogin={handleLogin} />;
  
  if (!examType) {
    return (
      <div className="min-h-screen bg-vercel-dark flex flex-col items-center justify-center font-sans p-8 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl h-full max-h-[800px] bg-electric-indigo/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="relative z-10 w-full max-w-4xl">
          <Onboarding onSelectExam={handleSelectExam} />
        </div>
      </div>
    );
  }

  if (activeScreen === 'session') {
    return (
      <Session 
        topic={sessionConfig?.topic} 
        difficulty={sessionConfig?.difficulty} 
        examType={examType}
        onBack={() => setActiveScreen('dashboard')} 
      />
    );
  }

  return (
    <div className="flex min-h-screen bg-vercel-dark text-slate-200 font-sans selection:bg-electric-indigo selection:text-white overflow-x-hidden">
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-vercel-dark border-b border-vercel-border z-40 flex items-center px-4">
        <button onClick={() => setIsSidebarOpen(true)} className="text-white focus:outline-none focus:ring-2 focus:ring-electric-indigo rounded">
          <Menu size={24} />
        </button>
        <span className="ml-4 font-bold text-white text-lg">Reverse Tutor</span>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div className="md:hidden fixed inset-0 bg-black/50 z-50" onClick={() => setIsSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <div className={`fixed top-0 left-0 h-full w-64 bg-vercel-dark border-r border-vercel-border z-50 transform transition-transform duration-300 md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {isSidebarOpen && (
          <button onClick={() => setIsSidebarOpen(false)} className="md:hidden absolute top-4 right-4 text-slate-400 hover:text-white">
            <X size={24} />
          </button>
        )}
        <Sidebar activeScreen={activeScreen} setActiveScreen={(s) => { setActiveScreen(s); setIsSidebarOpen(false); }} onLogout={handleLogout} onSwitchTarget={handleSwitchTarget} examType={examType} />
      </div>

      <div className="md:ml-64 flex-1 pt-16 md:pt-0 w-full">
        {activeScreen === 'dashboard' && <Home onStart={startSession} examType={examType} />}
        {activeScreen === 'analytics' && <Analytics examType={examType} />}
        {activeScreen === 'study-map' && <Home onStart={startSession} examType={examType} />}
        {activeScreen === 'quiz' && <QuizMode examType={examType} />}
        {activeScreen === 'mistakes' && <MistakesNotebook />}
        {activeScreen === 'past-papers' && <PastPapers examType={examType} onStart={startSession} />}
        {activeScreen === 'scan-question' && <ScanQuestion />}
        {activeScreen === 'scheduler' && <ExamScheduler />}
      </div>
    </div>
  );
}

export default App;
