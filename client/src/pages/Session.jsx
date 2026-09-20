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
      { role: 'assistant', content: `Hey, I'm struggling with ${topic.label}. I think I have a flawed understanding of it. Can you explain it to me?` }
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
      const chatRes = await fetch('https://reverse-tutor.onrender.com/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: topic.label, misconception, messages: newMessages })
      });
      const chatData = await chatRes.json();
      
      setMessages(prev => [...prev, { role: 'assistant', content: chatData.message }]);

      const evalRes = await fetch('https://reverse-tutor.onrender.com/api/evaluate', {
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
      setMessages(prev => [...prev, { role: 'assistant', content: "Network error occurred." }]);
    }
    setLoading(false);
  };

  const avgClarity = clarityScores.length > 0 
    ? Math.round(clarityScores.reduce((a, b) => a + b, 0) / clarityScores.length) 
    : 0;

  return (
    <div className="flex flex-col h-screen bg-slate-50">
      <header className="bg-white px-8 py-5 shadow-sm border-b border-slate-200 flex items-center justify-between z-10">
        <button onClick={onBack} className="text-slate-400 font-bold hover:text-slate-800 transition-colors">
          ← Exit Session
        </button>
        <div className="flex items-center gap-3">
          <span className="text-2xl">{topic.emoji}</span>
          <h2 className="font-bold text-xl text-slate-800">{topic.label}</h2>
        </div>
        <div className="w-24"></div>
      </header>

      <div className="bg-white/80 backdrop-blur-md px-8 py-5 shadow-sm border-b border-slate-200 z-10 sticky top-0">
        <MeterBar score={score} shake={shakeMeter} />
      </div>

      <main className="flex-1 overflow-y-auto p-8 flex justify-center bg-slate-50">
        <div className="w-full max-w-3xl flex flex-col justify-end min-h-full pb-8">
          {messages.map((msg, idx) => (
            <ChatBubble key={idx} message={msg} />
          ))}
          {loading && (
            <div className="flex w-full mb-6 justify-start">
               <div className="bg-white border border-slate-200 text-slate-400 font-serif italic max-w-[75%] rounded-2xl rounded-tl-sm p-5 shadow-sm">
                 Thinking...
               </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </main>

      {sessionComplete && !showScore && (
        <div className="p-6 bg-white border-t border-slate-200 flex justify-center shadow-2xl z-20">
          <button 
            onClick={() => setShowScore(true)}
            className="w-full max-w-md bg-emerald-500 text-white font-bold py-4 rounded-xl hover:bg-emerald-400 transition-colors shadow-lg shadow-emerald-500/30"
          >
            Reveal the Misconception
          </button>
        </div>
      )}

      {!sessionComplete && (
        <div className="p-6 bg-white border-t border-slate-200 shadow-[0_-10px_40px_-10px_rgba(0,0,0,0.05)] z-20 flex justify-center">
          <form onSubmit={handleSend} className="flex gap-4 w-full max-w-3xl">
            <input 
              type="text" 
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Type your explanation to correct the AI..." 
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-6 py-4 focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-1 focus:ring-indigo-500 transition-all text-slate-800"
            />
            <button 
              type="submit" 
              disabled={loading || !input.trim()}
              className="bg-indigo-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-indigo-500 transition-colors disabled:opacity-50 shadow-lg shadow-indigo-600/30"
            >
              Send
            </button>
          </form>
        </div>
      )}

      {showScore && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
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
