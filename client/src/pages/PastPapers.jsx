import React, { useState, useEffect } from 'react';
import { Search, Play, Clock, CheckCircle, Filter, Download, ArrowLeft, Activity, Trophy } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PAST_PAPERS } from '../data/pastPapers';

const PastPapers = ({ examType }) => {
  const [selectedYear, setSelectedYear] = useState('All');
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [activePaper, setActivePaper] = useState(null);
  
  // Timer State
  const [timeLeft, setTimeLeft] = useState(0);
  const [testFinished, setTestFinished] = useState(false);

  const years = ['All', ...Array.from(new Set(PAST_PAPERS.filter(p => p.exam === examType).map(p => p.year))).sort((a, b) => b - a)];
  const subjects = ['All', 'Full Paper', 'Physics', 'Chemistry', 'Mathematics', 'Biology'];

  const filteredPapers = PAST_PAPERS.filter(p => {
    if (p.exam !== examType) return false;
    if (selectedYear !== 'All' && p.year !== parseInt(selectedYear)) return false;
    if (selectedSubject !== 'All' && p.subject !== selectedSubject) return false;
    return true;
  });

  const startTest = (paper) => {
    setActivePaper(paper);
    setTestFinished(false);
    
    // Set timer based on exam rules
    if (paper.exam === 'NEET') {
      setTimeLeft(3 * 3600 + 20 * 60); // 3 Hours 20 Mins
    } else {
      setTimeLeft(3 * 3600); // 3 Hours for JEE Main and Advanced (per paper)
    }
  };

  useEffect(() => {
    if (activePaper && !testFinished && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            setTestFinished(true); // Auto-submit when time is up
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [activePaper, testFinished, timeLeft]);

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (activePaper) {
    if (testFinished) {
      // Results Screen
      return (
        <div className="min-h-screen bg-vercel-dark p-8 flex items-center justify-center font-sans">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-vercel-card border border-vercel-border p-12 rounded-2xl text-center max-w-2xl w-full">
            <Trophy size={64} className="text-yellow-500 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-white mb-2">Test Completed!</h2>
            <p className="text-slate-400 mb-8">{activePaper.exam} {activePaper.year} • {activePaper.session} {activePaper.shift}</p>
            
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-vercel-dark border border-vercel-border p-4 rounded-xl">
                <span className="text-xs uppercase tracking-widest text-slate-500 font-bold block mb-1">Score</span>
                <span className="text-2xl font-mono text-white">184<span className="text-sm text-slate-500">/{activePaper.exam === 'NEET' ? '720' : '300'}</span></span>
              </div>
              <div className="bg-vercel-dark border border-emerald-500/30 p-4 rounded-xl">
                <span className="text-xs uppercase tracking-widest text-emerald-500 font-bold block mb-1">Accuracy</span>
                <span className="text-2xl font-mono text-emerald-400">76%</span>
              </div>
              <div className="bg-vercel-dark border border-rose-500/30 p-4 rounded-xl">
                <span className="text-xs uppercase tracking-widest text-rose-500 font-bold block mb-1">Errors</span>
                <span className="text-2xl font-mono text-rose-400">12</span>
              </div>
            </div>

            {/* Simulated Performance Graph */}
            <div className="mb-8">
              <h4 className="text-sm font-bold text-slate-300 mb-4 text-left">Subject Performance</h4>
              <div className="space-y-3">
                {['Physics', 'Chemistry', activePaper.exam === 'NEET' ? 'Biology' : 'Mathematics'].map(subj => (
                  <div key={subj} className="flex items-center gap-4">
                    <span className="w-24 text-left text-xs font-medium text-slate-400">{subj}</span>
                    <div className="flex-1 h-3 bg-vercel-dark rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }} 
                        animate={{ width: `${Math.random() * 60 + 30}%` }} 
                        className={`h-full ${subj === 'Physics' ? 'bg-blue-500' : subj === 'Chemistry' ? 'bg-emerald-500' : 'bg-rose-500'}`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button onClick={() => setActivePaper(null)} className="w-full bg-electric-indigo text-white font-bold py-3 rounded-xl hover:bg-indigo-500 transition-colors">
              Return to Archives
            </button>
          </motion.div>
        </div>
      );
    }

    // Active Test Screen
    return (
      <div className="min-h-screen bg-vercel-dark">
        <header className="bg-[#0A0F1E] border-b border-vercel-border p-6 flex justify-between items-center sticky top-0 z-40 shadow-2xl">
          <div className="flex items-center gap-4">
            <button onClick={() => setActivePaper(null)} className="text-slate-400 hover:text-white transition-colors bg-slate-800/50 p-2 rounded-lg">
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">{activePaper.exam} {activePaper.year}</h1>
              <p className="text-slate-400 text-sm font-medium">{activePaper.session} • {activePaper.shift} • {activePaper.subject}</p>
            </div>
          </div>
          <div className={`bg-vercel-card border px-6 py-3 rounded-lg flex items-center gap-3 shadow-inner shadow-black/50 ${timeLeft < 600 ? 'border-red-500/50' : 'border-vercel-border'}`}>
            <Clock size={20} className={timeLeft < 600 ? 'text-red-500 animate-pulse' : 'text-electric-indigo'} />
            <span className={`font-mono text-xl font-bold tracking-widest ${timeLeft < 600 ? 'text-red-500' : 'text-white'}`}>
              {formatTime(timeLeft)}
            </span>
          </div>
        </header>

        <div className="max-w-4xl mx-auto py-12 px-8 pb-32">
          {Array.from({ length: 5 }).map((_, idx) => (
            <div key={idx} className="bg-vercel-card border border-vercel-border rounded-xl p-8 mb-8 shadow-lg">
              <div className="flex gap-4 mb-6">
                <span className="bg-vercel-dark border border-vercel-border text-electric-indigo font-mono text-sm px-3 py-1 rounded-md h-fit font-bold">Q{idx + 1}</span>
                <p className="text-white text-lg leading-relaxed">Consider a particle moving in a straight line with an initial velocity of 5 m/s. If the acceleration is given by a = 2t (where t is in seconds), what is the velocity at t = 3s?</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-12">
                {['14 m/s', '11 m/s', '9 m/s', '23 m/s'].map((opt, oIdx) => (
                  <button key={oIdx} className="text-left p-4 rounded-lg border border-vercel-border hover:border-electric-indigo hover:bg-electric-indigo/10 transition-all flex items-center gap-4 group focus:ring-2 focus:ring-electric-indigo">
                    <div className="w-6 h-6 rounded-full border border-slate-600 group-hover:border-electric-indigo flex items-center justify-center text-xs font-mono text-slate-400 group-hover:text-electric-indigo">
                      {['A', 'B', 'C', 'D'][oIdx]}
                    </div>
                    <span className="text-sm font-medium text-slate-300 group-hover:text-white">{opt}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        <div className="fixed bottom-0 left-64 right-0 bg-vercel-dark/90 backdrop-blur-md border-t border-vercel-border p-6 flex justify-end z-50">
           <button onClick={() => setTestFinished(true)} className="bg-electric-indigo text-white px-10 py-3 rounded-lg font-bold shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:bg-indigo-400 hover:-translate-y-1 transition-all">
             Submit Paper Early
           </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-vercel-dark p-8 text-slate-300 font-sans">
      <div className="max-w-7xl mx-auto">
        <header className="mb-10 flex justify-between items-end border-b border-vercel-border pb-6">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
              Official Past Papers Archive
            </h1>
            <p className="text-slate-400 text-sm mt-2 font-medium">Source: Official NTA Question Papers (2014-2026)</p>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
            <input 
              type="text" 
              placeholder="Search by topic or year..." 
              className="bg-vercel-card border border-vercel-border text-white text-sm rounded-md pl-10 pr-4 py-2.5 focus:outline-none focus:border-electric-indigo w-64 transition-colors"
            />
          </div>
        </header>

        <div className="flex gap-8">
          <div className="w-64 shrink-0 space-y-8">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4 flex items-center gap-2">
                <Clock size={14} /> Year
              </h3>
              <div className="space-y-1.5 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                {years.map(y => (
                  <button 
                    key={y} 
                    onClick={() => setSelectedYear(y)}
                    className={`block w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${selectedYear === y ? 'bg-electric-indigo text-white shadow-lg shadow-electric-indigo/20' : 'hover:bg-vercel-border/50 text-slate-400 hover:text-slate-200'}`}
                  >
                    {y}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4 flex items-center gap-2">
                <Filter size={14} /> Subject
              </h3>
              <div className="space-y-1.5">
                {subjects.map(s => (
                  <button 
                    key={s} 
                    onClick={() => setSelectedSubject(s)}
                    className={`block w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${selectedSubject === s ? 'bg-electric-indigo text-white shadow-lg shadow-electric-indigo/20' : 'hover:bg-vercel-border/50 text-slate-400 hover:text-slate-200'}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex-1">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              <AnimatePresence>
                {filteredPapers.map(paper => (
                  <motion.div 
                    key={paper.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-vercel-card border border-vercel-border p-5 rounded-xl hover:border-slate-500 transition-colors group flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex justify-between items-start mb-3">
                        <span className="text-xs font-bold bg-vercel-dark text-slate-300 px-2.5 py-1 rounded border border-vercel-border shadow-sm">
                          {paper.year}
                        </span>
                        <span className="text-xs font-medium text-electric-indigo bg-electric-indigo/10 px-2 py-1 rounded-md">
                          {paper.session} • {paper.shift}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-white mb-1 group-hover:text-electric-indigo transition-colors">{paper.exam}</h3>
                      <p className="text-sm text-slate-400 font-medium">{paper.subject}</p>
                    </div>
                    
                    <div className="flex items-center gap-3 mt-6 pt-4 border-t border-vercel-border">
                      <button 
                        onClick={() => startTest(paper)}
                        className="flex-1 bg-electric-indigo/10 hover:bg-electric-indigo text-electric-indigo hover:text-white border border-electric-indigo/30 hover:border-transparent transition-all py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2"
                      >
                        <Play size={16} /> Solve Online
                      </button>
                      <a 
                        href={paper.pdfUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 bg-vercel-dark hover:bg-slate-800 border border-vercel-border hover:border-slate-500 text-slate-300 transition-all py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2"
                      >
                        <Download size={16} /> Download PDF
                      </a>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PastPapers;
