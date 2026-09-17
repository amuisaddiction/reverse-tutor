import React from 'react';
import { motion } from 'framer-motion';

const ScoreCard = ({ topic, difficulty, turns, clarity, analogyUsed, gapFound, misconception, reset }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full mx-auto border border-slate-100"
    >
      <div className="text-center mb-8">
        <div className="text-5xl mb-4">🏆</div>
        <h2 className="text-2xl font-bold text-slate-900">Concept Mastered</h2>
        <p className="text-slate-500 mt-1 font-medium">
          {topic.label} · {turns} turns · {difficulty === 'hard' ? 'JEE Advanced' : 'JEE Main'}
        </p>
      </div>

      <div className="space-y-5 mb-8">
        <div className="flex justify-between items-center bg-slate-50 p-4 rounded-xl border border-slate-100">
          <span className="font-semibold text-slate-700">Clarity Score</span>
          <span className="font-bold text-indigo-600 text-lg">{clarity}/10</span>
        </div>
        
        <div className="flex justify-between items-center bg-slate-50 p-4 rounded-xl border border-slate-100">
          <span className="font-semibold text-slate-700">Analogy Used</span>
          <span className={`font-bold ${analogyUsed ? 'text-emerald-500' : 'text-slate-400'}`}>
            {analogyUsed ? '✓ Yes' : '✗ No'}
          </span>
        </div>

        <div className="flex justify-between items-center bg-slate-50 p-4 rounded-xl border border-slate-100">
          <span className="font-semibold text-slate-700">Identified Core Flaw</span>
          <span className={`font-bold ${gapFound ? 'text-emerald-500' : 'text-rose-500'}`}>
            {gapFound ? '✓ Yes' : '✗ No'}
          </span>
        </div>
      </div>

      <div className="bg-indigo-50 border border-indigo-100 p-5 rounded-2xl mb-8">
        <h3 className="text-xs font-bold text-indigo-800 uppercase tracking-wider mb-2">The Hidden Misconception Was:</h3>
        <p className="text-indigo-900 italic">"{misconception}"</p>
      </div>

      <div className="flex gap-4">
        <button 
          onClick={reset}
          className="flex-1 bg-slate-100 text-slate-700 font-bold py-4 rounded-xl hover:bg-slate-200 transition-colors"
        >
          Dashboard
        </button>
        <button 
          className="flex-1 bg-indigo-600 text-white font-bold py-4 rounded-xl hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-600/30"
        >
          Share Result
        </button>
      </div>
    </motion.div>
  );
};

export default ScoreCard;
