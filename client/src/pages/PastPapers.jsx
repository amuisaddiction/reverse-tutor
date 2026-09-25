import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Clock, CheckCircle, ChevronRight, Play } from 'lucide-react';
import { PAST_PAPERS } from '../data/pastPapers';

const PastPapers = ({ examType }) => {
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [selectedYear, setSelectedYear] = useState('All');
  const [activePaper, setActivePaper] = useState(null); 
  const [timeLeft, setTimeLeft] = useState(3 * 3600); 

  const subjects = ['All', 'Physics', 'Chemistry', examType === 'NEET' ? 'Biology' : 'Math'];
  const years = ['All', 2023, 2022, 2021];

  const filteredPapers = PAST_PAPERS.filter(p => {
    const paperExam = p.exam.toLowerCase();
    const currentExam = (examType || '').toLowerCase();
    if (paperExam !== 'all' && !currentExam.includes(paperExam) && !paperExam.includes(currentExam)) return false;
    if (selectedSubject !== 'All' && p.subject !== selectedSubject) return false;
    if (selectedYear !== 'All' && p.year !== parseInt(selectedYear)) return false;
    return true;
  });

  const startTest = async (paper) => {
    setActivePaper(paper);
    const duration = examType === 'NEET' ? 3 * 3600 + 20 * 60 : 3 * 3600;
    
    // Check if resuming
    const existingEnd = localStorage.getItem('secure_session_end');
    const existingPaper = localStorage.getItem('pausedPaper');

    if (existingEnd && existingPaper === paper.id.toString()) {
       const remaining = Math.floor((parseInt(existingEnd) - Date.now()) / 1000);
       setTimeLeft(remaining > 0 ? remaining : 0);
    } else {
       // Request secure HttpOnly cookie signature from server
       try {
         const res = await fetch('https://reverse-tutor.onrender.com/api/exam/start', {
           method: 'POST',
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify({ durationInSeconds: duration })
         });
         const data = await res.json();
         if (data.success) {
           localStorage.setItem('secure_session_end', data.endTime.toString());
           localStorage.setItem('pausedPaper', paper.id.toString());
           setTimeLeft(duration);
         }
       } catch (err) {
         console.error('Failed to sign secure session:', err);
         // Fallback
         const endTime = Date.now() + duration * 1000;
         localStorage.setItem('secure_session_end', endTime.toString());
         localStorage.setItem('pausedPaper', paper.id.toString());
         setTimeLeft(duration);
       }
    }
  };

  useEffect(() => {
    let interval;
    if (activePaper) {
      interval = setInterval(() => {
        const storedEnd = parseInt(localStorage.getItem('secure_session_end'));
        if (storedEnd) {
          const remaining = Math.floor((storedEnd - Date.now()) / 1000);
          if (remaining <= 0) {
             clearInterval(interval);
             setTimeLeft(0);
          } else {
             setTimeLeft(remaining);
          }
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activePaper]);

  const formatTime = (seconds) => {
    if (seconds <= 0) return '00:00:00';
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (activePaper) {
    return (
      <div className="min-h-screen bg-vercel-dark p-8 text-slate-300 font-sans">
        <header className="flex justify-between items-center mb-8 border-b border-vercel-border pb-6">
          <div>
            <button 
              onClick={() => {
                setActivePaper(null);
              }} 
              className="text-electric-indigo hover:text-white mb-2 text-sm font-medium"
            >
              ← Back to Papers
            </button>
            <h1 className="text-2xl font-bold text-white">{activePaper.title}</h1>
            <p className="text-slate-400 text-sm mt-1">{activePaper.subject} • {activePaper.questions.length} Questions</p>
          </div>
          <div className="bg-vercel-card border border-vercel-border px-6 py-3 rounded-lg flex items-center gap-3">
            <Clock size={20} className={timeLeft < 300 ? 'text-red-500 animate-pulse' : 'text-electric-indigo'} />
            <span className={`font-mono text-xl font-bold tracking-widest ${timeLeft < 300 ? 'text-red-500' : 'text-white'}`}>
              {formatTime(timeLeft)}
            </span>
          </div>
        </header>

        <div className="max-w-4xl mx-auto space-y-8 pb-32">
          {activePaper.questions.map((q, idx) => (
            <div key={idx} className="bg-vercel-card border border-vercel-border rounded-xl p-8">
              <div className="flex gap-4 mb-6">
                <span className="bg-vercel-border/50 text-slate-400 font-mono text-sm px-3 py-1 rounded-md h-fit">Q{idx + 1}</span>
                <p className="text-white text-lg leading-relaxed">{q.q}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-12">
                {q.options.map((opt, oIdx) => (
                  <button key={oIdx} className="text-left p-4 rounded-lg border border-vercel-border hover:border-electric-indigo hover:bg-electric-indigo/10 transition-colors flex items-center gap-4">
                    <div className="w-6 h-6 rounded-full border border-slate-500 flex items-center justify-center text-xs font-mono text-slate-400">
                      {['A', 'B', 'C', 'D'][oIdx]}
                    </div>
                    <span className="text-sm font-medium">{opt}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        <div className="fixed bottom-0 left-64 right-0 bg-vercel-dark border-t border-vercel-border p-6 flex justify-end z-50">
           <button onClick={() => { setActivePaper(null); localStorage.removeItem('secure_session_end'); localStorage.removeItem('pausedPaper'); }} className="bg-electric-indigo text-white px-8 py-3 rounded-md font-medium shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:bg-indigo-400 transition-colors">
             Submit Paper
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
            <h1 className="text-3xl font-semibold text-white tracking-tight">Past Papers Library</h1>
            <p className="text-slate-400 text-sm mt-1">Official NTA {examType} Previous Year Questions</p>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
            <input 
              type="text" 
              placeholder="Search by topic or year..." 
              className="bg-vercel-card border border-vercel-border text-white text-sm rounded-md pl-10 pr-4 py-2 focus:outline-none focus:border-electric-indigo w-64"
            />
          </div>
        </header>

        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <div className="w-64 shrink-0 space-y-8">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4 flex items-center gap-2">
                <Filter size={14} /> Subject
              </h3>
              <div className="space-y-2">
                {subjects.map(s => (
                  <button 
                    key={s} 
                    onClick={() => setSelectedSubject(s)}
                    className={`block w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${selectedSubject === s ? 'bg-electric-indigo/20 text-electric-indigo font-medium' : 'hover:bg-vercel-border/50 text-slate-400'}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4 flex items-center gap-2">
                <Clock size={14} /> Year
              </h3>
              <div className="space-y-2">
                {years.map(y => (
                  <button 
                    key={y} 
                    onClick={() => setSelectedYear(y)}
                    className={`block w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${selectedYear === y ? 'bg-electric-indigo/20 text-electric-indigo font-medium' : 'hover:bg-vercel-border/50 text-slate-400'}`}
                  >
                    {y}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Papers Grid */}
          <div className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <AnimatePresence>
                {filteredPapers.map(paper => (
                  <motion.div 
                    key={paper.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-vercel-card border border-vercel-border p-6 rounded-xl hover:border-slate-500 transition-colors group cursor-pointer"
                    onClick={() => startTest(paper)}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <span className="text-xs font-mono bg-vercel-border/50 text-slate-300 px-2 py-1 rounded">
                          {paper.year}
                        </span>
                        <h3 className="text-lg font-bold text-white mt-3">{paper.title}</h3>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-vercel-dark border border-vercel-border flex items-center justify-center text-slate-500 group-hover:bg-electric-indigo group-hover:text-white group-hover:border-electric-indigo transition-all">
                        <Play size={16} className="ml-1" />
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-slate-400 mt-6 pt-4 border-t border-vercel-border">
                      <span className="flex items-center gap-1"><CheckCircle size={14} /> {paper.subject}</span>
                      <span className="flex items-center gap-1"><Clock size={14} /> 3 Hours</span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {filteredPapers.length === 0 && (
                <div className="col-span-full py-20 text-center text-slate-500 border border-dashed border-vercel-border rounded-xl">
                  No past papers found for these filters.
                </div>
              )}
            </div>
            
            {/* Resume Banner */}
            {localStorage.getItem('pausedPaper') && localStorage.getItem('secure_session_end') && parseInt(localStorage.getItem('secure_session_end')) > Date.now() && (
              <div className="mt-8 bg-electric-indigo/10 border border-electric-indigo/30 p-4 rounded-xl flex items-center justify-between">
                <div>
                  <h4 className="text-white font-medium">Test in Progress</h4>
                  <p className="text-sm text-slate-400">You paused a mock test. Resume to continue.</p>
                </div>
                <button 
                  onClick={() => {
                    const paperId = localStorage.getItem('pausedPaper');
                    const paper = PAST_PAPERS.find(p => p.id === parseInt(paperId));
                    if (paper) startTest(paper);
                  }} 
                  className="bg-electric-indigo text-white px-4 py-2 rounded-lg font-medium text-sm hover:bg-indigo-500 transition-colors"
                >
                  Resume Test
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PastPapers;

