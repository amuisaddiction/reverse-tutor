import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Clock, ArrowRight, Brain, Target, ArrowUpRight } from 'lucide-react';
import { TOPICS } from '../data/topics';

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
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [activeTab, setActiveTab] = useState('Physics');
  const [difficulty, setDifficulty] = useState('Medium');

  const [isStarted, setIsStarted] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const subjects = examType === 'NEET' ? ['Physics', 'Chemistry', 'Biology'] : ['Physics', 'Chemistry', 'Math'];
  const filteredTopics = TOPICS.filter(t => t.subject === activeTab);

  const startQuizForTopic = (topic) => {
    setSelectedTopic(topic);
    setIsStarted(true);
    setCurrentIdx(0);
    setScore(0);
    setIsFinished(false);
    setShowExplanation(false);
    setSelectedOpt(null);
  };

  const handleSelect = (idx) => {
    if (showExplanation) return;
    setSelectedOpt(idx);
    setShowExplanation(true);
    if (idx === MOCK_QUIZ[currentIdx].answer) {
      setScore(s => s + 4);
    } else {
      setScore(s => s - 1);
      
      // Save mistake to Notebook
      const q = MOCK_QUIZ[currentIdx];
      const mistakes = JSON.parse(localStorage.getItem('mistakes') || '[]');
      mistakes.push({
        topicLabel: selectedTopic?.label,
        date: new Date().toISOString(),
        question: q.q,
        options: q.options,
        answer: q.answer,
        selected: idx,
        explanation: q.explanation
      });
      localStorage.setItem('mistakes', JSON.stringify(mistakes));
    }
  };

  const nextQuestion = () => {
    if (currentIdx < MOCK_QUIZ.length - 1) {
      setCurrentIdx(i => i + 1);
      setSelectedOpt(null);
      setShowExplanation(false);
    } else {
      setIsFinished(true);
    }
  };

  if (!isStarted) {
    return (
      <div className="min-h-screen bg-vercel-dark p-8 pb-32 text-slate-300 font-sans">
        <header className="mb-10 border-b border-vercel-border pb-6">
          <h1 className="text-3xl font-semibold text-white tracking-tight flex items-center gap-3">
            <Brain className="text-electric-indigo" /> Generate AI Quiz
          </h1>
          <p className="text-slate-400 text-sm mt-1">Select a specific chapter to generate a dynamically adapted quiz.</p>
        </header>

        <div className="bg-vercel-card border border-vercel-border p-8 rounded-xl mb-8">
          <div className="flex justify-between items-center mb-6 border-b border-vercel-border pb-4">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2"><Target size={20} className="text-electric-indigo"/> Chapter Selection</h2>
            <div className="flex gap-2">
              {subjects.map(sub => (
                <button
                  key={sub}
                  onClick={() => setActiveTab(sub)}
                  className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-electric-indigo ${
                    activeTab === sub 
                      ? 'bg-electric-indigo text-white' 
                      : 'text-slate-400 hover:text-white hover:bg-vercel-border/50'
                  }`}
                >
                  {sub}
                </button>
              ))}
            </div>
          </div>
          
          <div className="mb-8">
            <label className="block text-sm font-bold text-slate-400 uppercase tracking-widest mb-3">Select Difficulty</label>
            <div className="flex gap-4">
              {['Easy', 'Medium', 'Hard'].map(level => (
                <button
                  key={level}
                  onClick={() => setDifficulty(level)}
                  className={`px-6 py-2 rounded-lg font-medium transition-all focus:outline-none focus:ring-2 focus:ring-electric-indigo ${
                    difficulty === level 
                      ? 'bg-electric-indigo/20 text-electric-indigo border border-electric-indigo/50' 
                      : 'bg-vercel-dark border border-vercel-border text-slate-400 hover:border-slate-500'
                  }`}
                  aria-pressed={difficulty === level}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTopics.map(topic => (
              <button 
                key={topic.id}
                onClick={() => startQuizForTopic(topic)}
                className="p-5 rounded-lg border border-vercel-border hover:border-electric-indigo bg-vercel-dark/50 hover:bg-electric-indigo/5 transition-all text-left flex justify-between items-center group focus:outline-none focus:ring-2 focus:ring-electric-indigo w-full"
                aria-label={`Start ${topic.label} Quiz`}
              >
                <div className="flex items-center gap-4">
                  <span className="text-2xl" aria-hidden="true">{topic.emoji}</span>
                  <div>
                    <h3 className="text-white font-medium text-sm group-hover:text-electric-indigo transition-colors">{topic.label}</h3>
                    <span className="text-[10px] font-mono text-slate-500 uppercase">Class {topic.classLevel}</span>
                  </div>
                </div>
                <ArrowRight size={16} className="text-slate-500 group-hover:text-electric-indigo transition-colors" />
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (isFinished) {
    return (
      <div className="min-h-screen bg-vercel-dark p-8 flex items-center justify-center font-sans">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-vercel-card border border-vercel-border p-12 rounded-2xl text-center max-w-md w-full">
          <h2 className="text-3xl font-bold text-white mb-2">Quiz Complete</h2>
          <p className="text-slate-400 mb-8">{selectedTopic?.label}</p>
          <div className="text-6xl font-black text-electric-indigo mb-8">
            {score} <span className="text-xl text-slate-500">/ {MOCK_QUIZ.length * 4}</span>
          </div>
          <button onClick={() => setIsStarted(false)} className="w-full bg-white text-black font-bold py-3 rounded-xl hover:bg-slate-200 transition-colors">
            Take Another Quiz
          </button>
        </motion.div>
      </div>
    );
  }

  const q = MOCK_QUIZ[currentIdx];

  return (
    <div className="min-h-screen bg-vercel-dark p-8 font-sans text-slate-300 flex flex-col">
      <header className="flex justify-between items-center mb-8 border-b border-vercel-border pb-6">
        <div>
          <button onClick={() => setIsStarted(false)} className="text-electric-indigo hover:text-white mb-2 text-sm font-medium">← Back to Chapters</button>
          <h1 className="text-2xl font-bold text-white">Targeted Quiz: {selectedTopic?.label}</h1>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-center">
            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-1">Score</p>
            <p className="text-2xl font-mono text-white font-bold">{score}</p>
          </div>
          <div className="bg-vercel-card border border-vercel-border px-4 py-2 rounded-lg flex items-center gap-2">
            <Clock size={16} className="text-electric-indigo" />
            <span className="font-mono text-white font-medium">14:59</span>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto w-full flex-1 flex flex-col justify-center pb-20">
        <div className="mb-8 flex items-center gap-3">
          <span className="bg-vercel-card border border-vercel-border text-electric-indigo font-mono text-sm px-3 py-1 rounded-md font-bold">
            Q{currentIdx + 1} of {MOCK_QUIZ.length}
          </span>
        </div>
        
        <h2 className="text-2xl font-medium text-white mb-8 leading-relaxed">
          {q.q}
        </h2>

        <div className="space-y-3 mb-8">
          {q.options.map((opt, i) => {
            const isSelected = selectedOpt === i;
            const isCorrect = i === q.answer;
            let btnClass = "w-full text-left p-5 rounded-xl border transition-all flex items-center justify-between ";
            
            if (!showExplanation) {
              btnClass += isSelected ? "border-electric-indigo bg-electric-indigo/10 text-white" : "border-vercel-border bg-vercel-card hover:border-slate-500 hover:bg-vercel-border/30 text-slate-300";
            } else {
              if (isCorrect) btnClass += "border-emerald-500 bg-emerald-500/10 text-emerald-400";
              else if (isSelected) btnClass += "border-red-500 bg-red-500/10 text-red-400";
              else btnClass += "border-vercel-border bg-vercel-card opacity-50";
            }

            return (
              <button 
                key={i} 
                onClick={() => handleSelect(i)} 
                disabled={showExplanation} 
                className={`${btnClass} focus:outline-none focus:ring-2 focus:ring-electric-indigo`}
                aria-label={`Option ${i + 1}: ${opt}`}
                aria-pressed={isSelected}
                tabIndex={showExplanation ? -1 : 0}
              >
                <span className="text-lg">{opt}</span>
                {showExplanation && isCorrect && <CheckCircle className="text-emerald-500" aria-label="Correct" />}
                {showExplanation && isSelected && !isCorrect && <XCircle className="text-red-500" aria-label="Incorrect" />}
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


