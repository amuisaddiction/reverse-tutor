import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Clock, ArrowRight, Brain } from 'lucide-react';

const MOCK_QUIZ = [
  {
    q: "A particle of mass m is projected with velocity v making an angle of 45° with the horizontal. The magnitude of the angular momentum of the particle about the point of projection when the particle is at its maximum height is:",
    options: ["zero", "mv³ / (4√2 g)", "mv³ / (√2 g)", "mv² / 2g"],
    answer: 1,
    explanation: "At max height, velocity is v cos(45) = v/√2. Height is v²sin²(45)/2g = v²/4g. Angular momentum L = mvr_perp = m * (v/√2) * (v²/4g) = mv³ / (4√2 g)."
  },
  {
    q: "In an adiabatic process, the density of a diatomic gas becomes 32 times its initial value. The final pressure of the gas is found to be n times the initial pressure. The value of n is:",
    options: ["32", "128", "256", "32√2"],
    answer: 1,
    explanation: "For adiabatic process, P ∝ ρ^γ. For diatomic gas, γ = 7/5. So P_f / P_i = (ρ_f / ρ_i)^(7/5) = (32)^(7/5) = (2^5)^(7/5) = 2^7 = 128."
  }
];

const QuizMode = ({ examType }) => {
  const [isStarted, setIsStarted] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const handleSelect = (idx) => {
    if (showExplanation) return;
    setSelectedOpt(idx);
    setShowExplanation(true);
    if (idx === MOCK_QUIZ[currentIdx].answer) {
      setScore(s => s + 4);
    } else {
      setScore(s => s - 1);
    }
  };

  const nextQuestion = () => {
    if (currentIdx < MOCK_QUIZ.length - 1) {
      setCurrentIdx(c => c + 1);
      setSelectedOpt(null);
      setShowExplanation(false);
    } else {
      setIsFinished(true);
    }
  };

  if (!isStarted) {
    return (
      <div className="min-h-screen bg-vercel-dark p-8 flex items-center justify-center">
        <div className="bg-vercel-card border border-vercel-border p-12 rounded-2xl max-w-lg w-full text-center">
          <Brain size={48} className="text-electric-indigo mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-white mb-4">Chapter Quiz Mode</h1>
          <p className="text-slate-400 mb-8">Test your {examType} concepts with adaptive difficulty. +4 for correct, -1 for incorrect.</p>
          <button 
            onClick={() => setIsStarted(true)}
            className="w-full bg-electric-indigo hover:bg-indigo-500 text-white font-bold py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(99,102,241,0.2)]"
          >
            Start Quiz
          </button>
        </div>
      </div>
    );
  }

  if (isFinished) {
    return (
      <div className="min-h-screen bg-vercel-dark p-8 flex items-center justify-center">
        <div className="bg-vercel-card border border-vercel-border p-12 rounded-2xl max-w-lg w-full text-center">
          <h1 className="text-4xl font-black text-white mb-2">Quiz Complete</h1>
          <p className="text-slate-400 mb-8">Adaptive Analysis Generated</p>
          <div className="text-6xl font-black text-electric-indigo mb-8">{score} <span className="text-xl text-slate-500 font-medium">/ {MOCK_QUIZ.length * 4}</span></div>
          <button 
            onClick={() => { setIsStarted(false); setCurrentIdx(0); setScore(0); setSelectedOpt(null); setShowExplanation(false); setIsFinished(false); }}
            className="bg-white text-black font-bold py-3 px-8 rounded-lg hover:bg-slate-200 transition-colors"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const question = MOCK_QUIZ[currentIdx];

  return (
    <div className="min-h-screen bg-vercel-dark p-8 text-slate-300 font-sans">
      <header className="max-w-3xl mx-auto flex justify-between items-center mb-12">
        <div className="flex gap-2">
          {MOCK_QUIZ.map((_, i) => (
            <div key={i} className={`h-1.5 w-12 rounded-full ${i <= currentIdx ? 'bg-electric-indigo' : 'bg-vercel-border'}`} />
          ))}
        </div>
        <div className="flex items-center gap-2 text-slate-400 font-mono bg-vercel-border/30 px-3 py-1 rounded text-sm">
          <Clock size={14} /> 00:00:00
        </div>
      </header>

      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl text-white font-medium leading-relaxed mb-10">
          <span className="text-electric-indigo font-bold mr-4">Q{currentIdx + 1}.</span>
          {question.q}
        </h2>

        <div className="space-y-4 mb-12">
          {question.options.map((opt, idx) => {
            let stateClass = "border-vercel-border hover:border-electric-indigo hover:bg-vercel-border/30";
            if (showExplanation) {
              if (idx === question.answer) stateClass = "border-emerald-500 bg-emerald-500/10 text-emerald-500";
              else if (idx === selectedOpt) stateClass = "border-red-500 bg-red-500/10 text-red-500";
              else stateClass = "border-vercel-border opacity-50";
            }

            return (
              <button 
                key={idx}
                onClick={() => handleSelect(idx)}
                disabled={showExplanation}
                className={`w-full text-left p-5 rounded-xl border transition-all flex items-center gap-4 ${stateClass}`}
              >
                <div className={`w-8 h-8 rounded-full border flex items-center justify-center font-mono text-sm
                  ${showExplanation && idx === question.answer ? 'border-emerald-500' : 
                    showExplanation && idx === selectedOpt ? 'border-red-500' : 'border-slate-500'}
                `}>
                  {['A', 'B', 'C', 'D'][idx]}
                </div>
                <span className="text-lg">{opt}</span>
                {showExplanation && idx === question.answer && <CheckCircle className="ml-auto text-emerald-500" />}
                {showExplanation && idx === selectedOpt && idx !== question.answer && <XCircle className="ml-auto text-red-500" />}
              </button>
            );
          })}
        </div>

        <AnimatePresence>
          {showExplanation && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-electric-indigo/10 border border-electric-indigo/30 p-6 rounded-xl flex flex-col items-start gap-4"
            >
              <h3 className="font-bold text-electric-indigo uppercase tracking-wider text-sm">Instant AI Explanation</h3>
              <p className="text-slate-300 leading-relaxed">{question.explanation}</p>
              <button 
                onClick={nextQuestion}
                className="mt-4 bg-electric-indigo text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-500 transition-colors flex items-center gap-2 self-end"
              >
                {currentIdx < MOCK_QUIZ.length - 1 ? 'Next Question' : 'Finish Quiz'} <ArrowRight size={16} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default QuizMode;
