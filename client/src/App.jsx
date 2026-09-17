import React, { useState } from 'react';
import Home from './pages/Home';
import Session from './pages/Session';

function App() {
  const [activeScreen, setActiveScreen] = useState('home');
  const [sessionConfig, setSessionConfig] = useState(null);

  const startSession = (topic, difficulty) => {
    setSessionConfig({ topic, difficulty });
    setActiveScreen('session');
  };

  const goHome = () => {
    setActiveScreen('home');
    setSessionConfig(null);
  };

  return (
    <>
      {activeScreen === 'home' && <Home onStart={startSession} />}
      {activeScreen === 'session' && (
        <Session 
          topic={sessionConfig.topic} 
          difficulty={sessionConfig.difficulty} 
          onBack={goHome} 
        />
      )}
    </>
  );
}

export default App;
