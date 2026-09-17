import React, { useState } from 'react';
import Login from './pages/Login';
import Home from './pages/Home';
import Session from './pages/Session';
import PastPapers from './pages/PastPapers';
import Sidebar from './components/Sidebar';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeScreen, setActiveScreen] = useState('dashboard');
  const [sessionConfig, setSessionConfig] = useState(null);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  const startSession = (topic, difficulty) => {
    setSessionConfig({ topic, difficulty });
    setActiveScreen('session');
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  if (activeScreen === 'session') {
    return (
      <Session 
        topic={sessionConfig.topic} 
        difficulty={sessionConfig.difficulty} 
        onBack={() => setActiveScreen('dashboard')} 
      />
    );
  }

  return (
    <div className="flex">
      <Sidebar activeScreen={activeScreen} setActiveScreen={setActiveScreen} onLogout={handleLogout} />
      <div className="ml-64 flex-1">
        {activeScreen === 'dashboard' && <Home onStart={startSession} />}
        {activeScreen === 'study-map' && <Home onStart={startSession} />}
        {activeScreen === 'past-papers' && <PastPapers />}
      </div>
    </div>
  );
}

export default App;
