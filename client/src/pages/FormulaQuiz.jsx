import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Target, Trophy, RefreshCcw, Check, X } from 'lucide-react';
import { formulaData } from '../data/formulas';
import 'katex/dist/katex.min.css';
import { BlockMath } from 'react-katex';

const generateQuizPool = () => {
  const pool = [];
  Object.keys(formulaData).forEach(subject => {
    Object.keys(formulaData[subject]).forEach(chapter => {
      formulaData[subject][chapter].forEach(f => {
        pool.push({ ...f, subject, chapter });
      });
    });
  });
  return pool;
};

const FormulaQuiz = ({ onBack }) => {
  const [pool, setPool] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [isAnswered, setIsAnswered] = useState(false);

  useEffect(() => {
    const allFormulas = generateQuizPool();
    setPool(allFormulas);
    generateNextQuestion(allFormulas);
  }, []);

  const shuffleArray = (array) => [...array].sort(() => Math.random() - 0.5);

  const generateNextQuestion = (activePool) => {
    if (!activePool || activePool.length === 0) return;
    
    // Pick random correct formula
    const correct = activePool[Math.floor(Math.random() * activePool.length)];
    
    // Pick 3 random wrong formulas
    const wrongOptions = activePool
      .filter(f => f.id !== correct.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
      
    const mixedOptions = shuffleArray([correct, ...wrongOptions]);

    setCurrentQuestion(correct);
    setOptions(mixedOptions);
    setSelectedOption(null);
    setIsAnswered(false);
  };

  const handleSelect = (opt) => {
    if (isAnswered) return;
    setSelectedOption(opt);
    setIsAnswered(true);
    
    if (opt.id === currentQuestion.id) {
      setScore(s => ({ ...s, correct: s.correct + 1, total: s.total + 1 }));
    } else {
      setScore(s => ({ ...s, total: s.total + 1 }));
    }
  };

  const nextQuestion = () => generateNextQuestion(pool);

  if (!currentQuestion) return null;

  return (
    <div className="min-h-screen bg-vercel-dark p-8 text-slate-300 font-sans">
      <div className="max-w-3xl mx-auto">
        <header className="mb-8 flex justify-between items-center">
          <button 
            onClick={onBack}
            className="text-slate-400 hover:text-white flex items-center gap-2 transition-colors"
          >
            <ArrowLeft size={20} /> Back to Hub
          </button>
          
          <div className="bg-vercel-card border border-vercel-border px-4 py-2 rounded-xl flex items-center gap-4 shadow-sm">
            <Trophy size={18} className="text-yellow-500" />
            <span className="font-semibold text-white">Score: {score.correct} / {score.total}</span>
          </div>
        </header>

        <div className="bg-vercel-card border border-vercel-border rounded-3xl p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-electric-indigo to-purple-500"></div>
          
          <div className="text-center mb-8">
            <div className="inline-block bg-vercel-dark px-3 py-1 rounded-full border border-vercel-border text-xs font-medium text-slate-400 mb-4">
              {currentQuestion.subject} • {currentQuestion.chapter}
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Identify the formula for:</h2>
            <p className="text-xl text-electric-indigo font-semibold bg-electric-indigo/10 py-3 px-6 rounded-xl inline-block">
              {currentQuestion.name}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {options.map((opt, idx) => {
              const isSelected = selectedOption?.id === opt.id;
              const isCorrect = opt.id === currentQuestion.id;
              
              let stateClass = "bg-vercel-dark border-vercel-border hover:border-slate-500 text-slate-300";
              if (isAnswered) {
                if (isCorrect) stateClass = "bg-emerald-500/10 border-emerald-500 text-white";
                else if (isSelected) stateClass = "bg-red-500/10 border-red-500 text-white";
                else stateClass = "bg-vercel-dark border-vercel-border opacity-50";
              } else if (isSelected) {
                stateClass = "border-electric-indigo bg-electric-indigo/5 text-white";
              }

              return (
                <button
                  key={opt.id}
                  disabled={isAnswered}
                  onClick={() => handleSelect(opt)}
                  className={`p-6 rounded-2xl border-2 transition-all flex flex-col items-center justify-center min-h-[120px] relative ${stateClass}`}
                >
                  <BlockMath math={opt.latex} />
                  
                  {isAnswered && isCorrect && (
                    <div className="absolute top-3 right-3 bg-emerald-500 text-white rounded-full p-1">
                      <Check size={14} />
                    </div>
                  )}
                  {isAnswered && isSelected && !isCorrect && (
                    <div className="absolute top-3 right-3 bg-red-500 text-white rounded-full p-1">
                      <X size={14} />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          <AnimatePresence>
            {isAnswered && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center pt-6 border-t border-vercel-border"
              >
                <p className="text-slate-400 mb-6 text-center max-w-lg">
                  {selectedOption?.id === currentQuestion.id 
                    ? "Excellent! You correctly identified the formula." 
                    : `Incorrect. The correct formula was ${currentQuestion.name}.`}
                </p>
                <button
                  onClick={nextQuestion}
                  className="bg-white text-black hover:bg-slate-200 font-semibold px-8 py-3 rounded-xl transition-all flex items-center gap-2"
                >
                  Next Question <ArrowRight size={18} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

// Lucide icon patch (ArrowRight is missing from my import above, adding it here or replacing it)
import { ArrowRight } from 'lucide-react';

export default FormulaQuiz;
