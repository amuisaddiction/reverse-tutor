import React from 'react';
import { motion } from 'framer-motion';

const Onboarding = ({ onSelectExam }) => {
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-8">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">What is your target?</h1>
          <p className="text-slate-400 text-lg">We will personalize your experience, syllabus, and AI tutor.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* NEET Card */}
          <motion.button
            whileHover={{ scale: 1.02, y: -5 }}
            onClick={() => onSelectExam('NEET')}
            className="group relative bg-slate-800/50 backdrop-blur-xl border border-slate-700 p-8 rounded-3xl overflow-hidden text-left hover:border-emerald-500 hover:shadow-[0_0_40px_rgba(16,185,129,0.15)] transition-all duration-300"
          >
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
              <span className="text-8xl">🩺</span>
            </div>
            <div className="text-5xl mb-6">🧬</div>
            <h2 className="text-3xl font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors">NEET (UG)</h2>
            <p className="text-slate-400">Physics, Chemistry, Biology</p>
            <div className="mt-8 pt-6 border-t border-slate-700/50">
              <span className="text-emerald-500 font-bold uppercase tracking-wider text-sm flex items-center gap-2">
                Enter Medical Portal <span className="text-lg">→</span>
              </span>
            </div>
          </motion.button>

          {/* JEE Card */}
          <motion.button
            whileHover={{ scale: 1.02, y: -5 }}
            onClick={() => onSelectExam('JEE')}
            className="group relative bg-slate-800/50 backdrop-blur-xl border border-slate-700 p-8 rounded-3xl overflow-hidden text-left hover:border-indigo-500 hover:shadow-[0_0_40px_rgba(99,102,241,0.15)] transition-all duration-300"
          >
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
              <span className="text-8xl">⚙️</span>
            </div>
            <div className="text-5xl mb-6">📐</div>
            <h2 className="text-3xl font-bold text-white mb-2 group-hover:text-indigo-400 transition-colors">JEE Main & Adv</h2>
            <p className="text-slate-400">Physics, Chemistry, Mathematics</p>
            <div className="mt-8 pt-6 border-t border-slate-700/50">
              <span className="text-indigo-500 font-bold uppercase tracking-wider text-sm flex items-center gap-2">
                Enter Engineering Portal <span className="text-lg">→</span>
              </span>
            </div>
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
