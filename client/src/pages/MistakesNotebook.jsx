import React, { useState, useEffect } from 'react';
import { BookOpen, Search, XCircle, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const MistakesNotebook = () => {
  const [mistakes, setMistakes] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('mistakes');
    if (saved) {
      setMistakes(JSON.parse(saved).reverse());
    }
  }, []);

  const clearMistakes = () => {
    localStorage.removeItem('mistakes');
    setMistakes([]);
  };

  return (
    <div className="min-h-screen bg-vercel-dark p-8 pb-32 text-slate-300 font-sans">
      <header className="mb-10 flex justify-between items-end border-b border-vercel-border pb-6">
        <div>
          <h1 className="text-3xl font-semibold text-white tracking-tight flex items-center gap-3">
            <BookOpen className="text-electric-indigo" /> Mistake Notebook
          </h1>
          <p className="text-slate-400 text-sm mt-1">Review your incorrectly answered quiz questions to reinforce learning.</p>
        </div>
        {mistakes.length > 0 && (
          <button onClick={clearMistakes} className="text-sm font-medium text-rose-500 hover:text-rose-400 transition-colors bg-rose-500/10 px-4 py-2 rounded-lg">
            Clear Notebook
          </button>
        )}
      </header>

      {mistakes.length === 0 ? (
        <div className="bg-vercel-card border border-vercel-border rounded-xl p-12 text-center max-w-2xl mx-auto mt-20">
          <BookOpen size={48} className="text-slate-600 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-white mb-2">No mistakes logged yet!</h2>
          <p className="text-slate-400">When you answer a question incorrectly in Quiz Mode, it will automatically be logged here for future revision.</p>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto space-y-6">
          {mistakes.map((m, idx) => (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              key={idx} 
              className="bg-vercel-card border border-rose-500/30 rounded-xl p-6 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-1 h-full bg-rose-500/50"></div>
              
              <div className="flex justify-between items-start mb-4">
                <span className="text-xs font-mono uppercase tracking-widest bg-vercel-dark px-3 py-1 rounded text-slate-400 border border-vercel-border">
                  {new Date(m.date).toLocaleDateString()} • {m.topicLabel}
                </span>
                
                {(() => {
                  const daysOld = Math.floor((new Date() - new Date(m.date)) / (1000 * 60 * 60 * 24));
                  if (daysOld >= 7) return <span className="bg-rose-500/20 text-rose-400 text-xs px-2 py-1 rounded font-bold">L3 Revision Due</span>;
                  if (daysOld >= 3) return <span className="bg-orange-500/20 text-orange-400 text-xs px-2 py-1 rounded font-bold">L2 Revision Due</span>;
                  if (daysOld >= 1) return <span className="bg-amber-500/20 text-amber-400 text-xs px-2 py-1 rounded font-bold">L1 Revision Due</span>;
                  return <span className="bg-emerald-500/20 text-emerald-400 text-xs px-2 py-1 rounded font-bold">Logged Today</span>;
                })()}
              </div>
              
              <h3 className="text-lg font-medium text-white mb-6 leading-relaxed">{m.question}</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-rose-500/10 border border-rose-500/30 p-4 rounded-lg flex items-start gap-3">
                  <XCircle className="text-rose-500 shrink-0 mt-0.5" size={18} />
                  <div>
                    <span className="text-xs font-bold text-rose-500 uppercase tracking-widest block mb-1">Your Answer</span>
                    <span className="text-rose-200">{m.options[m.selected]}</span>
                  </div>
                </div>
                <div className="bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-lg flex items-start gap-3">
                  <CheckCircle className="text-emerald-500 shrink-0 mt-0.5" size={18} />
                  <div>
                    <span className="text-xs font-bold text-emerald-500 uppercase tracking-widest block mb-1">Correct Answer</span>
                    <span className="text-emerald-200">{m.options[m.answer]}</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-vercel-dark border border-vercel-border p-5 rounded-lg">
                <span className="text-xs font-bold text-electric-indigo uppercase tracking-widest block mb-2">Explanation</span>
                <p className="text-slate-300 text-sm leading-relaxed">{m.explanation}</p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MistakesNotebook;
