import React, { useState, useRef, useEffect } from 'react';
import MeterBar from '../components/MeterBar';
import ChatBubble from '../components/ChatBubble';
import ScoreCard from '../components/ScoreCard';

const Session = ({ topic, difficulty, onBack }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(false);
  const [shakeMeter, setShakeMeter] = useState(false);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [showScore, setShowScore] = useState(false);
  
  const [clarityScores, setClarityScores] = useState([]);
  const [analogyUsed, setAnalogyUsed] = useState(false);
  const [gapFound, setGapFound] = useState(false);

  const messagesEndRef = useRef(null);
  
  const misconception = topic[difficulty].misconception;

  useEffect(() => {
    setMessages([
      { role: 'assistant', content: `Hey, I'm trying to understand ${topic.label} but I'm a bit confused. Can you explain it to me?` }
    ]);
  }, [topic]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (score >= 90 && !sessionComplete) {
      setSessionComplete(true);
    }
  }, [score, sessionComplete]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading || sessionComplete) return;

    const userMessage = input.trim();
    setInput('');
    
    const newMessages = [...messages, { role: 'user', content: userMessage }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const chatRes = await fetch('http://localhost:3001/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: topic.label, misconception, messages: newMessages })
      });
      const chatData = await chatRes.json();
      
      setMessages(prev => [...prev, { role: 'assistant', content: chatData.message }]);

      const evalRes = await fetch('http://localhost:3001/api/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          topic: topic.label, 
          misconception, 
          transcript: JSON.stringify(newMessages), 
          userMessage 
        })
      });
      const evalData = await evalRes.json();
      
      if (evalData.score_delta > 0) {
        setScore(prev => Math.min(prev + evalData.score_delta, 100));
      } else {
        setShakeMeter(true);
        setTimeout(() => setShakeMeter(false), 500);
      }

      if (evalData.clarity) setClarityScores(prev => [...prev, evalData.clarity]);
      if (evalData.analogy_used) setAnalogyUsed(true);
      if (evalData.gap_addressed) setGapFound(true);

    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'assistant', content: "Hmm, I got confused (network error) — try again?" }]);
    }
    setLoading(false);
  };

  const avgClarity = clarityScores.length > 0 
    ? Math.round(clarityScores.reduce((a, b) => a + b, 0) / clarityScores.length) 
    : 0;

  return (
    <div className="flex flex-col h-screen bg-[#F5F2F8]">
      <header className="bg-white p-4 shadow-sm flex items-center justify-between z-10">
        <button onClick={onBack} className="text-gray-500 font-bold hover:text-gray-800">
          ← Back
        </button>
        <h2 className="font-bold text-xl">{topic.emoji} {topic.label}</h2>
        <div className="w-16"></div>
      </header>

      <div className="bg-white px-6 py-4 shadow-sm z-10 sticky top-0">
        <MeterBar score={score} shake={shakeMeter} />
      </div>

      <main className="flex-1 overflow-y-auto p-4 flex justify-center">
        <div className="w-full max-w-3xl flex flex-col justify-end min-h-full pb-4">
          {messages.map((msg, idx) => (
            <ChatBubble key={idx} message={msg} />
          ))}
          {loading && (
            <div className="flex w-full mb-4 justify-start">
               <div className="bg-[#F5F2F8] text-[#2A1B3D] font-serif italic max-w-[80%] rounded-2xl p-4">
                 Ravi is thinking...
               </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </main>

      {sessionComplete && !showScore && (
        <div className="p-4 bg-white flex justify-center shadow-lg z-20">
          <button 
            onClick={() => setShowScore(true)}
            className="w-full max-w-md bg-[#7FB3A0] text-white font-bold py-3 rounded-full hover:bg-opacity-90"
          >
            Reveal the Bug
          </button>
        </div>
      )}

      {!sessionComplete && (
        <div className="p-4 bg-white shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-20 flex justify-center">
          <form onSubmit={handleSend} className="flex gap-2 w-full max-w-3xl">
            <input 
              type="text" 
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Type your explanation..." 
              className="flex-1 border-2 border-gray-200 rounded-full px-6 py-3 focus:outline-none focus:border-[#5B3FD4]"
            />
            <button 
              type="submit" 
              disabled={loading || !input.trim()}
              className="bg-[#5B3FD4] text-white px-6 py-3 rounded-full font-bold hover:bg-opacity-90 disabled:opacity-50"
            >
              Send
            </button>
          </form>
        </div>
      )}

      {showScore && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <ScoreCard 
            topic={topic}
            difficulty={difficulty}
            turns={Math.floor(messages.length / 2)}
            clarity={avgClarity}
            analogyUsed={analogyUsed}
            gapFound={gapFound}
            misconception={misconception}
            reset={onBack}
          />
        </div>
      )}
    </div>
  );
};

export default Session;
