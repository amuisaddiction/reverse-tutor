import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, ArrowLeft, BrainCircuit, Activity, CheckCircle, Zap } from 'lucide-react';
import ChatBubble from '../components/ChatBubble';
import TypingIndicator from '../components/TypingIndicator';
import MeterBar from '../components/MeterBar';
import RevealBug from '../components/RevealBug';
import ScoreCard from '../components/ScoreCard';
import { useSession } from '../hooks/useSession';

const Session = ({ topic, onEnd }) => {
  const [sessionId, setSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [score, setScore] = useState(20);
  const [isComplete, setIsComplete] = useState(false);
  const [revealedBug, setRevealedBug] = useState(null);
  
  // Real-time evaluation stats
  const [evalStats, setEvalStats] = useState({ clarity: 0, analogy: false, gapAddressed: false });

  const messagesEndRef = useRef(null);
  const { sessionTime, startTimer, stopTimer } = useSession();

  // Initialize Session
  useEffect(() => {
    if (!topic) return;

    let isMounted = true;

    const initSession = async () => {
      setIsTyping(true);
      try {
        const res = await fetch('https://reverse-tutor.onrender.com/api/chat/session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ topic: topic.label })
        });
        
        if (!res.ok) throw new Error('Failed to create session');
        
        const data = await res.json();
        
        if (isMounted) {
          setSessionId(data.sessionId);
          setMessages([{ role: 'ai', content: data.initialMessage }]);
          setScore(20);
          setIsComplete(false);
          setRevealedBug(null);
          setEvalStats({ clarity: 0, analogy: false, gapAddressed: false });
          startTimer();
        }
      } catch (err) {
        console.error('Failed to init session:', err);
      } finally {
        if (isMounted) setIsTyping(false);
      }
    };

    initSession();

    return () => {
      isMounted = false;
      stopTimer();
    };
  }, [topic]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  if (!topic) {
    return (
      <div className="min-h-screen bg-vercel-dark p-8 flex items-center justify-center flex-col text-center">
        <BrainCircuit size={48} className="text-rose-500 mb-6" />
        <h2 className="text-2xl font-bold text-white mb-2">No Topic Selected</h2>
        <p className="text-slate-400 mb-6">Please select a topic from the dashboard to start teaching.</p>
        <button 
          onClick={onEnd}
          className="bg-white text-black px-6 py-2 rounded-md font-medium hover:bg-slate-200 transition-colors"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  // Loading state while generating the hidden misconception
  if (!sessionId && isTyping) {
    return (
      <div className="min-h-screen bg-vercel-dark flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-4">
          <BrainCircuit size={48} className="text-electric-indigo animate-pulse" />
          <p className="text-slate-400 font-mono text-sm">Initializing Feynman Engine...</p>
        </div>
      </div>
    );
  }

  const sendMessage = async () => {
    if (!input.trim() || !sessionId) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const res = await fetch('https://reverse-tutor.onrender.com/api/chat/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          userMessage: userMessage.content
        })
      });

      if (!res.ok) throw new Error('Failed to send message');

      const data = await res.json();

      setIsTyping(false);
      setMessages(prev => [...prev, { role: 'ai', content: data.message }]);
      
      // Update Live Stats
      setEvalStats({
        clarity: data.evaluation.clarity || 0,
        analogy: data.evaluation.analogy || false,
        gapAddressed: data.evaluation.gapAddressed || false
      });

      // Update Score & Bug
      setScore(data.evaluation.score);
      if (data.misconception) {
        setRevealedBug(data.misconception);
      }

      if (data.isComplete) {
        setIsComplete(true);
        stopTimer();
      }

    } catch (err) {
      console.error(err);
      setIsTyping(false);
    }
  };

  return (
    <div className="flex h-screen bg-vercel-dark text-slate-300 font-sans overflow-hidden">
      
      {/* Left Sidebar - Live Analytics & Graph */}
      <div className="w-80 border-r border-vercel-border bg-vercel-card flex flex-col">
        <div className="p-6 border-b border-vercel-border flex items-center justify-between">
          <button onClick={onEnd} className="text-slate-400 hover:text-white transition-colors">
            <ArrowLeft size={20} />
          </button>
          <span className="font-mono text-xs uppercase tracking-widest text-slate-500">Live Telemetry</span>
          <Activity size={16} className="text-electric-indigo" />
        </div>

        <div className="p-6 flex-1 overflow-y-auto">
          <ScoreCard score={score} />
          <RevealBug misconception={revealedBug || "Hidden Misconception"} isRevealed={!!revealedBug} />
          
          <div className="mt-8 space-y-6">
            <div>
              <div className="flex justify-between text-xs font-mono uppercase text-slate-500 mb-2">
                <span>Explanation Clarity</span>
                <span className="text-white">{evalStats.clarity}/10</span>
              </div>
              <MeterBar value={evalStats.clarity * 10} color="bg-emerald-500" />
            </div>
            
            <div className="flex items-center gap-3 bg-vercel-dark p-3 rounded-lg border border-vercel-border">
              <div className={`w-2 h-2 rounded-full ${evalStats.analogy ? 'bg-electric-indigo' : 'bg-slate-600'}`} />
              <span className="text-sm">Analogy Detected</span>
            </div>

            <div className="flex items-center gap-3 bg-vercel-dark p-3 rounded-lg border border-vercel-border">
              <div className={`w-2 h-2 rounded-full ${evalStats.gapAddressed ? 'bg-emerald-500' : 'bg-slate-600'}`} />
              <span className="text-sm">Misconception Targeted</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col relative">
        <div className="p-6 border-b border-vercel-border flex items-center gap-4 bg-vercel-dark/80 backdrop-blur-md z-10">
          <span className="text-4xl">{topic.emoji}</span>
          <div>
            <h2 className="text-xl font-bold text-white leading-tight">Teaching: {topic.label}</h2>
            <p className="text-xs text-slate-500 font-mono">Time elapsed: {Math.floor(sessionTime / 60)}:{(sessionTime % 60).toString().padStart(2, '0')}</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-6 scroll-smooth pb-32">
          <AnimatePresence>
            {messages.map((m, i) => (
              <ChatBubble key={i} message={m} />
            ))}
            {isTyping && <TypingIndicator />}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-vercel-dark via-vercel-dark/90 to-transparent">
          <div className="max-w-4xl mx-auto flex gap-3">
            <button className="p-4 bg-vercel-card border border-vercel-border rounded-xl text-slate-400 hover:text-white transition-colors">
              🎤
            </button>
            <input 
              type="text" 
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage()}
              placeholder="Explain the concept clearly..."
              className="flex-1 bg-vercel-card border border-vercel-border rounded-xl px-6 py-4 text-white placeholder-slate-500 focus:outline-none focus:border-electric-indigo transition-colors"
            />
            <button 
              onClick={sendMessage}
              className="bg-electric-indigo text-white px-6 rounded-xl font-medium hover:bg-indigo-500 transition-colors flex items-center gap-2"
            >
              <Send size={18} />
            </button>
          </div>
        </div>

        {/* Completion Overlay */}
        <AnimatePresence>
          {isComplete && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="absolute inset-0 bg-vercel-dark/95 backdrop-blur-sm z-50 flex items-center justify-center p-8"
            >
              <div className="bg-vercel-card border border-vercel-border p-10 rounded-2xl max-w-md w-full text-center">
                <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle size={40} className="text-emerald-500" />
                </div>
                <h2 className="text-3xl font-bold text-white mb-2">Concept Mastered!</h2>
                <p className="text-slate-400 mb-8">You successfully cleared Ravi's misconception using the Feynman Technique.</p>
                <div className="flex gap-4">
                  <button 
                    onClick={onEnd}
                    className="flex-1 bg-white text-black py-3 rounded-lg font-bold hover:bg-slate-200 transition-colors"
                  >
                    Complete Session
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};

export default Session;
