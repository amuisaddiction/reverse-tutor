import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Clock, ArrowRight, Brain, Target, ArrowUpRight } from 'lucide-react';
import { TOPICS } from '../data/topics';

// Expanded quiz questions
const MOCK_QUIZ = [
  {
    q: "A particle of mass m is projected with velocity v making an angle of 45° with the horizontal. The magnitude of the angular momentum of the particle about the point of projection when the particle is at its maximum height is:",
    options: ["zero", "mv^3 / (4√2 g)", "mv^3 / (√2 g)", "mv^2 / 2g"],
    answer: 1,
    explanation: "At max height, velocity is v cos(45) = v/√2. Height is v^2sin^2(45)/2g = v^2/4g. Angular momentum L = mvr_perp = m * (v/√2) * (v^2/4g) = mv^3 / (4√2 g)."
  },
  {
    q: "In an adiabatic process, the density of a diatomic gas becomes 32 times its initial value. The final pressure of the gas is found to be n times the initial pressure. The value of n is:",
    options: ["32", "128", "256", "32√2"],
    answer: 1,
    explanation: "For an adiabatic process, P ∝ ρ^γ. For diatomic gas, γ = 7/5. So P_f / P_i = (ρ_f / ρ_i)^(7/5) = (32)^(7/5) = (2^5)^(7/5) = 2^7 = 128."
  },
  {
    q: "The escape velocity for a body projected vertically upwards from the surface of earth is 11.2 km/s. If the body is projected at an angle of 45° with the vertical, the escape velocity will be:",
    options: ["11.2 km/s", "11.2/√2 km/s", "11.2 * √2 km/s", "22.4 km/s"],
    answer: 0,
    explanation: "Escape velocity is independent of the angle of projection. It only depends on the mass and radius of the planet."
  },
  {
    q: "A simple pendulum has a time period T. If it is taken to a height R (radius of earth) above the earth's surface, its time period will be:",
    options: ["T", "T/√2", "2T", "4T"],
    answer: 2,
    explanation: "g at height h is g' = g / (1 + h/R)^2. At h=R, g' = g/4. Time period T = 2π√(L/g). So T' = 2π√(L/(g/4)) = 2T."
  },
  {
    q: "Two identical capacitors, have the same capacitance C. One of them is charged to potential V1 and the other to V2. The negative ends of the capacitors are connected together. When the positive ends are also connected, the decrease in energy of the combined system is:",
    options: ["(1/4) C (V1^2 - V2^2)", "(1/4) C (V1^2 + V2^2)", "(1/4) C (V1 - V2)^2", "(1/4) C (V1 + V2)^2"],
    answer: 2,
    explanation: "Loss in energy = (1/2) * (C1*C2)/(C1+C2) * (V1-V2)^2. Here C1=C2=C, so it's (1/4)C(V1-V2)^2."
  }
];

const QuizMode = ({ examType }) => {
  const [activeTab, setActiveTab] = useState('Physics');
  const [difficulty, setDifficulty] = useState('Medium');
  const [selectedTopic, setSelectedTopic] = useState(null);
  
  const [isStarted, setIsStarted] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  
  // Timer state
  const [timeLeft, setTimeLeft] = useState(60); // 60 seconds per question

  const subjects = ['Physics', 'Chemistry', examType === 'NEET' ? 'Biology' : 'Math'];
  const filteredTopics = TOPICS.filter(t => t.subject === activeTab && t.classLevel === '11');

  useEffect(() => {
    let timer;
    if (isStarted && !showExplanation && !isFinished && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0 && !showExplanation) {
      handleSelect(-1); // Timeout, marked as wrong
    }
    return () => clearInterval(timer);
  }, [isStarted, showExplanation, isFinished, timeLeft]);

  const startQuizForTopic = (topic) => {
    setSelectedTopic(topic);
    setIsStarted(true);
    setCurrentIdx(0);
    setScore(0);
    setIsFinished(false);
    setShowExplanation(false);
    setSelectedOpt(null);
    setTimeLeft(60);
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
      setTimeLeft(60); // Reset timer for next question
    } else {
      setIsFinished(true);
    }
  };

  if (!isStarted) {
    return (
      <div className="min-h-screen bg-vercel-dark p-8 font-sans text-slate-300">
        <div className="max-w-7xl mx-auto">
          <header className="mb-12 border-b border-vercel-border pb-6">
            <h1 className="text-3xl font-semibold text-white tracking-tight">Adaptive Quiz Mode</h1>
            <p className="text-slate-400 mt-1">Target your weak spots with AI-generated questions</p>
          </header>

          <div className="bg-vercel-card border border-vercel-border rounded-2xl p-8 mb-8">
            <div className="flex justify-between items-center mb-6 border-b border-vercel-border pb-4">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2"><Target size={20} className="text-electric-indigo"/> Chapter Selection</h2>
              <div className="flex gap-2">
                {subjects.map(sub => (
                  <button
                    key={sub}
                    onClick={() => setActiveTab(sub)}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${activeTab === sub ? 'bg-white text-black' : 'hover:bg-vercel-border text-slate-400'}`}
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
                    className={`px-5 py-2 rounded-lg font-medium text-sm transition-all border ${difficulty === level ? 'bg-electric-indigo/10 border-electric-indigo text-electric-indigo' : 'border-vercel-border hover:border-slate-500 text-slate-400'}`}
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
                  className="bg-vercel-dark border border-vercel-border p-4 rounded-xl text-left hover:border-slate-500 transition-colors group flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{topic.emoji}</span>
                    <span className="font-medium text-white text-sm">{topic.label}</span>
                  </div>
                  <ArrowUpRight size={16} className="text-slate-500 group-hover:text-white transition-colors" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isFinished) {
    return (
      <div className="min-h-screen bg-vercel-dark p-8 font-sans flex items-center justify-center">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-vercel-card border border-vercel-border rounded-2xl p-12 text-center max-w-md w-full">
          <div className="w-20 h-20 bg-electric-indigo/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} className="text-electric-indigo" />
          </div>
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
            <div className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Score</div>
            <div className="text-xl font-mono text-white bg-vercel-card px-4 py-1 rounded-md border border-vercel-border">{score}</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Time</div>
            <div className={`text-xl font-mono flex items-center gap-2 bg-vercel-card px-4 py-1 rounded-md border border-vercel-border ${timeLeft <= 10 ? 'text-rose-500 border-rose-500/50' : 'text-white'}`}>
              <Clock size={16} /> {timeLeft}s
            </div>
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
              btnClass += "border-vercel-border bg-vercel-card hover:border-slate-500 text-slate-300";
            } else {
              if (isCorrect) {
                btnClass += "border-emerald-500 bg-emerald-500/10 text-emerald-100";
              } else if (isSelected) {
                btnClass += "border-rose-500 bg-rose-500/10 text-rose-100";
              } else {
                btnClass += "border-vercel-border bg-vercel-dark text-slate-500 opacity-50";
              }
            }

            return (
              <button 
                key={i} 
                onClick={() => handleSelect(i)}
                disabled={showExplanation}
                className={btnClass}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-6 h-6 rounded-full border flex items-center justify-center text-xs font-mono
                    ${showExplanation && isCorrect ? 'border-emerald-500 text-emerald-500' : 
                      showExplanation && isSelected ? 'border-rose-500 text-rose-500' : 
                      'border-slate-500 text-slate-400'}`}
                  >
                    {['A', 'B', 'C', 'D'][i]}
                  </div>
                  <span className="text-lg">{opt}</span>
                </div>
                {showExplanation && isCorrect && <CheckCircle className="text-emerald-500" size={20} />}
                {showExplanation && isSelected && !isCorrect && <XCircle className="text-rose-500" size={20} />}
              </button>
            );
          })}
        </div>

        <AnimatePresence>
          {showExplanation && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="bg-electric-indigo/10 border border-electric-indigo/30 rounded-xl p-6 flex flex-col"
            >
              <div className="flex gap-4">
                <Brain className="text-electric-indigo shrink-0" size={24} />
                <div>
                  <h3 className="font-bold text-white mb-2">AI Explanation</h3>
                  <p className="text-slate-300 leading-relaxed text-sm">{q.explanation}</p>
                </div>
              </div>
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
