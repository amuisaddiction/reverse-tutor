import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Search, ChevronRight, Calculator, FileText, Zap } from 'lucide-react';
import { formulaData } from '../data/formulas';
import 'katex/dist/katex.min.css';
import { BlockMath } from 'react-katex';

const FormulaHub = ({ onQuizStart }) => {
  const [activeSubject, setActiveSubject] = useState('Physics');
  const [searchQuery, setSearchQuery] = useState('');

  const subjects = Object.keys(formulaData);
  const chapters = formulaData[activeSubject] || {};

  const filteredChapters = Object.keys(chapters).reduce((acc, chapterName) => {
    const filteredFormulas = chapters[chapterName].filter(f => 
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      f.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
    if (filteredFormulas.length > 0) acc[chapterName] = filteredFormulas;
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-vercel-dark p-8 text-slate-300 font-sans">
      <div className="max-w-6xl mx-auto">
        <header className="mb-10 flex justify-between items-end border-b border-vercel-border pb-6">
          <div>
            <h1 className="text-3xl font-semibold text-white tracking-tight flex items-center gap-3">
              <Calculator className="text-electric-indigo" /> Master Formula Sheet
            </h1>
            <p className="text-slate-400 mt-2">Curated high-yield JEE/NEET formulas from MathonGo & Vedantu archives.</p>
          </div>
          <button 
            onClick={onQuizStart}
            className="bg-electric-indigo hover:bg-indigo-500 text-white px-5 py-2.5 rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            <Zap size={18} /> Interactive Formula Quiz
          </button>
        </header>

        {/* Tabs and Search */}
        <div className="flex flex-col md:flex-row gap-6 mb-8 justify-between items-start md:items-center">
          <div className="flex bg-vercel-border/30 p-1 rounded-xl">
            {subjects.map(sub => (
              <button
                key={sub}
                onClick={() => setActiveSubject(sub)}
                className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeSubject === sub 
                    ? 'bg-vercel-card text-white shadow-sm border border-vercel-border' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {sub}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input
              type="text"
              placeholder="Search formulas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-vercel-dark border border-vercel-border rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-electric-indigo transition-colors"
            />
          </div>
        </div>

        {/* Formula Display */}
        <div className="space-y-8">
          {Object.keys(filteredChapters).length === 0 ? (
            <div className="text-center py-20 border border-vercel-border border-dashed rounded-2xl bg-vercel-card/30">
              <FileText className="mx-auto h-12 w-12 text-slate-500 mb-4" />
              <p className="text-slate-400 font-medium">No formulas found for "{searchQuery}"</p>
            </div>
          ) : (
            Object.entries(filteredChapters).map(([chapterName, formulas]) => (
              <div key={chapterName} className="bg-vercel-card border border-vercel-border rounded-2xl overflow-hidden">
                <div className="bg-vercel-dark/50 px-6 py-4 border-b border-vercel-border flex items-center gap-3">
                  <BookOpen size={18} className="text-electric-indigo" />
                  <h3 className="text-lg font-semibold text-white">{chapterName}</h3>
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {formulas.map(formula => (
                    <div key={formula.id} className="bg-vercel-dark border border-vercel-border/50 rounded-xl p-5 hover:border-electric-indigo/50 transition-colors group">
                      <h4 className="text-sm font-medium text-slate-300 mb-4 group-hover:text-electric-indigo transition-colors">{formula.name}</h4>
                      <div className="bg-white/5 rounded-lg py-3 mb-4 overflow-x-auto text-center flex items-center justify-center min-h-[80px]">
                        <BlockMath math={formula.latex} />
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed">{formula.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default FormulaHub;
