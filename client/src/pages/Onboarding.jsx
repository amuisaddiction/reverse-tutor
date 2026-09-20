import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Onboarding = ({ onSelectExam }) => {
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState({ age: '', phone: '', grade: '' });

  const nextStep = (e) => {
    e.preventDefault();
    if (step === 1 && (!profile.age || !profile.phone)) return;
    if (step === 2 && !profile.grade) return;
    setStep(s => s + 1);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-8 font-sans">
      <div className="max-w-2xl w-full">
        
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <div className="text-center mb-10">
                <h1 className="text-4xl font-bold text-white mb-4">Complete your Profile</h1>
                <p className="text-slate-400">Just a few details before we personalize your AI tutor.</p>
              </div>
              <form onSubmit={nextStep} className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 p-8 rounded-3xl">
                <div className="space-y-6">
                  <div>
                    <label className="block text-slate-400 font-bold text-sm mb-2 uppercase tracking-widest">Age</label>
                    <input type="number" required value={profile.age} onChange={e => setProfile({...profile, age: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-indigo-500" placeholder="e.g. 17" />
                  </div>
                  <div>
                    <label className="block text-slate-400 font-bold text-sm mb-2 uppercase tracking-widest">Phone Number</label>
                    <input type="tel" required value={profile.phone} onChange={e => setProfile({...profile, phone: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-indigo-500" placeholder="+91 xxxxx xxxxx" />
                  </div>
                  <button type="submit" className="w-full bg-indigo-600 text-white font-bold py-4 rounded-xl hover:bg-indigo-500 mt-4">Continue →</button>
                </div>
              </form>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <div className="text-center mb-10">
                <h1 className="text-4xl font-bold text-white mb-4">What is your Grade?</h1>
                <p className="text-slate-400">This helps adapt the difficulty of questions.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {['11th', '12th', 'Dropper'].map(grade => (
                  <button
                    key={grade}
                    onClick={(e) => { setProfile({...profile, grade}); nextStep(e); }}
                    className="bg-slate-800/50 border border-slate-700 p-8 rounded-3xl hover:border-indigo-500 hover:bg-indigo-500/10 text-white font-bold text-xl transition-all"
                  >
                    {grade}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-white mb-4">What is your Target?</h1>
                <p className="text-slate-400">We will set up your Curriculum Map.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <button onClick={() => onSelectExam('NEET')} className="group bg-slate-800/50 border border-slate-700 p-8 rounded-3xl text-left hover:border-emerald-500 hover:bg-emerald-500/5 transition-all">
                  <div className="text-5xl mb-6">🧬</div>
                  <h2 className="text-3xl font-bold text-white mb-2 group-hover:text-emerald-400">NEET (UG)</h2>
                  <p className="text-slate-400">Physics, Chemistry, Biology</p>
                </button>
                <button onClick={() => onSelectExam('JEE')} className="group bg-slate-800/50 border border-slate-700 p-8 rounded-3xl text-left hover:border-indigo-500 hover:bg-indigo-500/5 transition-all">
                  <div className="text-5xl mb-6">📐</div>
                  <h2 className="text-3xl font-bold text-white mb-2 group-hover:text-indigo-400">JEE Main & Adv</h2>
                  <p className="text-slate-400">Physics, Chemistry, Math</p>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};

export default Onboarding;
