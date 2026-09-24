import React, { useState, useRef, useEffect } from 'react';
import MeterBar from '../components/MeterBar';
import ChatBubble from '../components/ChatBubble';
import ScoreCard from '../components/ScoreCard';
import { Mic, MicOff, AlertCircle, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Session = ({ topic, difficulty, onBack, examType }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(false);
  const [shakeMeter, setShakeMeter] = useState(false);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [showScore, setShowScore] = useState(false);
  
  // Voice & Feedback
  const [isListening, setIsListening] = useState(false);
  const [feedback, setFeedback] = useState(null); // { type: 'success' | 'error', message: string }
  
  const [clarityScores, setClarityScores] = useState([]);
  const [analogyUsed, setAnalogyUsed] = useState(false);
  const [gapFound, setGapFound] = useState(false);

  const messagesEndRef = useRef(null);
  
  const misconception = topic[difficulty]?.misconception || `I have a fundamental misunderstanding of ${topic.label}.`;

  useEffect(() => {
    setMessages([
      { role: 'assistant', content: `Hey, I'm struggling with ${topic.label}. I think I have a flawed understanding of it. Can you explain it to me?` }
    ]);
  }, [topic]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, feedback]);

  useEffect(() => {
    if (score >= 90 && !sessionComplete) {
      setSessionComplete(true);
    }
  }, [score, sessionComplete]);

  // Web Speech API for Mic
  const toggleListening = () => {
    if (isListening) {
      setIsListening(false);
      return;
    }
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Your browser does not support Voice Input. Please use Chrome.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    
    recognition.onstart = () => setIsListening(true);
    
    recognition.onresult = (event) => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        }
      }
      if (finalTranscript) {
        setInput(prev => prev + ' ' + finalTranscript.trim());
      }
    };
    
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    
    recognition.start();
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading || sessionComplete) return;

    if (isListening) setIsListening(false); // Stop mic when sending
    setFeedback(null); // Clear previous feedback

    const userMessage = input.trim();
    setInput('');
    
    const newMessages = [...messages, { role: 'user', content: userMessage }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const chatRes = await fetch('https://reverse-tutor.onrender.com/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: topic.label, misconception, messages: newMessages, examType })
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
          userMessage,
          examType
        })
      });
      const evalData = await evalRes.json();
      
      if (evalData.score_delta > 0) {
        setScore(prev => Math.min(prev + evalData.score_delta, 100));
        setFeedback({ type: 'success', message: 'Good point! The AI is starting to understand.' });
      } else {
        setShakeMeter(true);
        setTimeout(() => setShakeMeter(false), 500);
        setFeedback({ type: 'error', message: '🚨 Flawed Logic Detected: That explanation is incorrect. Try rethinking your approach.' });
        
        // Save to Mistakes Notebook automatically
        try {
           const saved = JSON.parse(localStorage.getItem('mistakes') || '[]');
           saved.push({
             id: Date.now(),
             date: new Date().toISOString(),
             topicLabel: topic.label,
             question: "Feynman Session Error",
             selected: 0,
             answer: 1,
             options: [userMessage, "AI's counter-question"],
             explanation: `You taught the AI incorrect logic during a Feynman Session. Ensure your conceptual foundation is strong here.`
           });
           localStorage.setItem('mistakes', JSON.stringify(saved));
        } catch (e) {}
      }

      if (evalData.clarity) setClarityScores(prev => [...prev, evalData.clarity]);
      if (evalData.analogy_used) setAnalogyUsed(true);
      if (evalData.gap_addressed) setGapFound(true);

    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'assistant', content: "Let's explore that further! Can you elaborate on the core principle?" }]); // Fallback so UI doesn't break
    }
    setLoading(false);
  };

  const avgClarity = clarityScores.length > 0 
    ? Math.round(clarityScores.reduce((a, b) => a + b, 0) / clarityScores.length) 
    : 0;

  return (
    <div className="flex flex-col h-screen bg-vercel-dark font-sans text-slate-300">
      <header className="bg-[#0A0F1E] px-8 py-5 shadow-2xl border-b border-vercel-border flex items-center justify-between z-10 sticky top-0">
        <button onClick={onBack} className="text-slate-400 font-bold hover:text-white transition-colors bg-vercel-dark px-4 py-2 rounded-lg border border-vercel-border">
          ← Exit Session
        </button>
        <div className="flex items-center gap-3">
          <span className="text-2xl">{topic.emoji}</span>
          <h2 className="font-bold text-xl text-white tracking-tight">{topic.label}</h2>
        </div>
        <div className="w-24"></div>
      </header>

      <div className="bg-[#0A0F1E]/80 backdrop-blur-md px-8 py-5 shadow-sm border-b border-vercel-border z-10 sticky top-[81px]">
        <MeterBar score={score} shake={shakeMeter} />
      </div>

      <main className="flex-1 overflow-y-auto p-8 flex justify-center bg-vercel-dark">
        <div className="w-full max-w-3xl flex flex-col justify-end min-h-full pb-8">
          {messages.map((msg, idx) => (
            <ChatBubble key={idx} message={msg} />
          ))}
          
          <AnimatePresence>
            {feedback && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`flex w-full mb-6 justify-center`}
              >
                <div className={`px-6 py-3 rounded-full flex items-center gap-3 font-medium shadow-lg border ${
                  feedback.type === 'error' ? 'bg-red-500/10 border-red-500/30 text-red-400' : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                }`}>
                  {feedback.type === 'error' ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />}
                  {feedback.message}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {loading && (
            <div className="flex w-full mb-6 justify-start">
               <div className="bg-vercel-card border border-vercel-border text-electric-indigo font-mono italic max-w-[75%] rounded-2xl rounded-tl-sm p-5 shadow-sm animate-pulse">
                 Processing your explanation...
               </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </main>

      {sessionComplete && !showScore && (
        <div className="p-6 bg-[#0A0F1E] border-t border-vercel-border flex justify-center shadow-2xl z-20">
          <button 
            onClick={() => setShowScore(true)}
            className="w-full max-w-md bg-electric-indigo text-white font-bold py-4 rounded-xl hover:bg-indigo-500 transition-colors shadow-[0_0_30px_rgba(99,102,241,0.3)]"
          >
            Reveal the Misconception
          </button>
        </div>
      )}

      {!sessionComplete && (
        <div className="p-6 bg-[#0A0F1E] border-t border-vercel-border shadow-[0_-10px_40px_-10px_rgba(0,0,0,0.3)] z-20 flex justify-center">
          <form onSubmit={handleSend} className="flex gap-4 w-full max-w-3xl relative">
            <button 
              type="button"
              onClick={toggleListening}
              className={`absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full transition-all ${
                isListening ? 'bg-red-500 text-white animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.5)]' : 'text-slate-400 hover:text-electric-indigo hover:bg-electric-indigo/10'
              }`}
              title="Use Microphone"
            >
              {isListening ? <Mic size={20} /> : <MicOff size={20} />}
            </button>
            <input 
              type="text" 
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder={isListening ? "Listening... Speak now!" : "Type your explanation to correct the AI..."}
              className={`flex-1 bg-vercel-dark border rounded-xl pl-14 pr-6 py-4 focus:outline-none focus:bg-vercel-card transition-all text-white placeholder-slate-500 ${
                isListening ? 'border-red-500/50 focus:border-red-500' : 'border-vercel-border focus:border-electric-indigo'
              }`}
            />
            <button 
              type="submit" 
              disabled={loading || (!input.trim() && !isListening)}
              className="bg-electric-indigo text-white px-8 py-4 rounded-xl font-bold hover:bg-indigo-500 transition-colors disabled:opacity-50 shadow-[0_0_20px_rgba(99,102,241,0.2)]"
            >
              Send
            </button>
          </form>
        </div>
      )}

      {showScore && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
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
