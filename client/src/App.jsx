import React, { useState } from 'react';
import Login from './pages/Login';
import Onboarding from './pages/Onboarding';
import Home from './pages/Home';
import Session from './pages/Session';
import PastPapers from './pages/PastPapers';
import Sidebar from './components/Sidebar';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [examType, setExamType] = useState(null); 
  const [activeScreen, setActiveScreen] = useState('dashboard');
  const [sessionConfig, setSessionConfig] = useState(null);

  const handleLogin = () => setIsAuthenticated(true);
  const handleLogout = () => {
    setIsAuthenticated(false);
    setExamType(null);
  };

  const startSession = (topic, difficulty) => {
    setSessionConfig({ topic, difficulty });
    setActiveScreen('session');
  };

  if (!isAuthenticated) return <Login onLogin={handleLogin} />;
  
  if (!examType) return <Onboarding onSelectExam={(type) => setExamType(type)} />;

  if (activeScreen === 'session') {
    return (
      <Session 
        topic={sessionConfig.topic} 
        difficulty={sessionConfig.difficulty} 
        examType={examType}
        onBack={() => setActiveScreen('dashboard')} 
      />
    );
  }

  return (
    <div className="flex min-h-screen bg-vercel-dark text-slate-200 font-sans selection:bg-electric-indigo selection:text-white">
      <Sidebar activeScreen={activeScreen} setActiveScreen={setActiveScreen} onLogout={handleLogout} examType={examType} />
      <div className="ml-64 flex-1">
        {activeScreen === 'dashboard' && <Home onStart={startSession} examType={examType} />}
        {activeScreen === 'study-map' && <Home onStart={startSession} examType={examType} />}
        {activeScreen === 'past-papers' && <PastPapers examType={examType} onStart={startSession} />}
      </div>
    </div>
  );
}

export default App;
