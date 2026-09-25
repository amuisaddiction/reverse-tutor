import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Swords, User, Bot, AlertCircle, CheckCircle, ChevronRight, Loader2 } from 'lucide-react';

const DebateArena = ({ examType }) => {
  const [stage, setStage] = useState('loading'); // loading, debating, voting, revealing
  const [topic, setTopic] = useState('');
  const [debateData, setDebateData] = useState(null);
  
  const [selectedOption, setSelectedOption] = useState(null); // 'A' or 'B'
  const [justification, setJustification] = useState('');
  const [confidence, setConfidence] = useState(5); // Priority 3: Calibration score (1-10)
  
  const [evaluation, setEvaluation] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Animation variants
  const bubbleVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  useEffect(() => {
    fetchDebate();
  }, []);

  const fetchDebate = async () => {
    setStage('loading');
    try {
      // 1. Get Topic (Priority 2 hook later: weakest node)
      const topicRes = await fetch('https://reverse-tutor.onrender.com/api/debate/topic');
      const topicData = await topicRes.json();
      setTopic(topicData.topic);

      // 2. Generate Debate Scenario
      const debateRes = await fetch('https://reverse-tutor.onrender.com/api/debate/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: topicData.topic })
      });
      const data = await debateRes.json();
      setDebateData(data);
      setStage('debating');
    } catch (error) {
      console.error('Error fetching debate:', error);
      // Fallback for offline/demo if API fails
      setDebateData({
        question: "A solid sphere and a hollow sphere of the same mass and radius are released from the top of an inclined plane. Which one reaches the bottom first?",
        optionA: { text: "The solid sphere", isCorrect: true },
        optionB: { text: "They reach at the same time", isCorrect: false },
        argumentA: "It's undeniably the solid sphere. Because its mass is distributed closer to the center, it has a lower moment of inertia. This means less energy is 'wasted' on rotational kinetic energy, giving it a higher translational velocity down the slope.",
        argumentB: "That's a classic misconception. Acceleration due to gravity is independent of mass and mass distribution. Just like a feather and a hammer fall at the same rate in a vacuum, both spheres experience the same g sin(θ) acceleration down the plane."
      });
      setTopic("Rotational Motion - Rolling on Incline");
      setStage('debating');
    }
  };

  const handleVote = async (e) => {
    e.preventDefault();
    if (!selectedOption || !justification.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const chosenText = selectedOption === 'A' ? debateData.optionA.text : debateData.optionB.text;
      const correctText = debateData.optionA.isCorrect ? debateData.optionA.text : debateData.optionB.text;

      const evalRes = await fetch('https://reverse-tutor.onrender.com/api/debate/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: debateData.question,
          chosenOptionText: chosenText,
          correctOptionText: correctText,
          justification: justification,
          confidence: confidence
        })
      });
      const evalData = await evalRes.json();
      setEvaluation(evalData);
      setStage('revealing');
    } catch (error) {
      console.error(error);
      // Fallback
      setEvaluation({
        isCorrect: selectedOption === 'A',
        feedback: selectedOption === 'A' ? "Spot on! The solid sphere has a smaller moment of inertia (2/5 MR²) compared to the hollow sphere (2/3 MR²)." : "You fell for the trap! While gravity is constant, the energy distribution between translational and rotational kinetic energy depends on the moment of inertia.",
        insight: `You were ${confidence}/10 confident, ${selectedOption === 'A' ? 'and your physics intuition is solid.' : 'but fell for the classic trap!'}`
      });
      setStage('revealing');
    }
    setIsSubmitting(false);
  };

  if (stage === 'loading') {
    return (
      <div className="min-h-screen bg-vercel-dark flex flex-col items-center justify-center p-8 text-slate-300">
        <Loader2 className="w-12 h-12 text-electric-indigo animate-spin mb-4" />
        <h2 className="text-xl font-bold text-white">Summoning Debaters...</h2>
        <p className="text-slate-400 mt-2">Generating a tricky MCQ to test your logic.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-vercel-dark p-8 text-slate-300 font-sans">
      <header className="max-w-4xl mx-auto mb-10 flex flex-col md:flex-row justify-between items-start md:items-end border-b border-vercel-border pb-6">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
            <Swords className="text-rose-500" /> AI Debate Arena
          </h1>
          <p className="text-slate-400 text-sm mt-2">Listen to both sides. One is right. One is a trap. You decide.</p>
        </div>
        <div className="mt-4 md:mt-0 bg-vercel-card border border-vercel-border px-4 py-2 rounded-lg text-sm font-medium text-electric-indigo">
          Topic: {topic}
        </div>
      </header>

      <div className="max-w-4xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-vercel-card border border-vercel-border p-8 rounded-2xl shadow-2xl mb-8 relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-electric-indigo to-rose-500"></div>
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4">The Battleground</h2>
          <p className="text-xl font-medium text-white leading-relaxed">{debateData.question}</p>
        </motion.div>

        {stage !== 'revealing' && (
          <div className="space-y-6 mb-12">
            {/* Persona A */}
            <motion.div 
              variants={bubbleVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.5 }}
              className="flex gap-4 items-start"
            >
              <div className="w-10 h-10 rounded-full bg-blue-500/20 border border-blue-500/50 flex items-center justify-center shrink-0 mt-1 shadow-[0_0_15px_rgba(59,130,246,0.3)]">
                <Bot size={20} className="text-blue-400" />
              </div>
              <div className="flex-1">
                <span className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-1 block">The Theorist (Option A)</span>
                <div className="bg-vercel-card border border-vercel-border p-5 rounded-2xl rounded-tl-sm shadow-lg hover:border-blue-500/50 transition-colors">
                  <p className="text-white font-medium mb-3 text-lg">"{debateData.optionA.text}"</p>
                  <p className="text-slate-400 leading-relaxed">{debateData.argumentA}</p>
                </div>
              </div>
            </motion.div>

            {/* Persona B */}
            <motion.div 
              variants={bubbleVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 2.0 }}
              className="flex gap-4 items-start justify-end text-right"
            >
              <div className="flex-1">
                <span className="text-xs font-bold text-rose-400 uppercase tracking-widest mb-1 block">The Challenger (Option B)</span>
                <div className="bg-vercel-card border border-vercel-border p-5 rounded-2xl rounded-tr-sm shadow-lg hover:border-rose-500/50 transition-colors">
                  <p className="text-white font-medium mb-3 text-lg">"{debateData.optionB.text}"</p>
                  <p className="text-slate-400 leading-relaxed">{debateData.argumentB}</p>
                </div>
              </div>
              <div className="w-10 h-10 rounded-full bg-rose-500/20 border border-rose-500/50 flex items-center justify-center shrink-0 mt-1 shadow-[0_0_15px_rgba(244,63,94,0.3)]">
                <Bot size={20} className="text-rose-400" />
              </div>
            </motion.div>
          </div>
        )}

        {/* Voting UI */}
        {(stage === 'debating' || stage === 'voting') && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3.5 }}
            className="bg-[#0A0F1E] border border-vercel-border rounded-2xl p-8 shadow-2xl relative"
          >
            <h3 className="text-lg font-bold text-white text-center mb-6">Cast Your Vote</h3>
            <div className="flex gap-4 mb-8">
              <button 
                onClick={() => setSelectedOption('A')}
                className={`flex-1 p-4 rounded-xl border-2 transition-all font-bold text-lg ${
                  selectedOption === 'A' 
                    ? 'border-blue-500 bg-blue-500/20 text-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.2)]' 
                    : 'border-vercel-border bg-vercel-card text-slate-400 hover:border-blue-500/50 hover:bg-blue-500/5'
                }`}
              >
                Option A
              </button>
              <button 
                onClick={() => setSelectedOption('B')}
                className={`flex-1 p-4 rounded-xl border-2 transition-all font-bold text-lg ${
                  selectedOption === 'B' 
                    ? 'border-rose-500 bg-rose-500/20 text-rose-400 shadow-[0_0_20px_rgba(244,63,94,0.2)]' 
                    : 'border-vercel-border bg-vercel-card text-slate-400 hover:border-rose-500/50 hover:bg-rose-500/5'
                }`}
              >
                Option B
              </button>
            </div>

            <AnimatePresence>
              {selectedOption && (
                <motion.form 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="space-y-6"
                  onSubmit={handleVote}
                >
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">Justify your choice (prove you didn't guess):</label>
                    <textarea 
                      value={justification}
                      onChange={e => setJustification(e.target.value)}
                      className="w-full bg-vercel-dark border border-vercel-border rounded-xl p-4 text-white focus:border-electric-indigo focus:ring-1 focus:ring-electric-indigo transition-all outline-none resize-none"
                      rows="2"
                      placeholder="I chose this because..."
                      required
                    />
                  </div>

                  {/* Priority 3: Confidence Slider */}
                  <div className="bg-vercel-dark/50 border border-vercel-border p-5 rounded-xl">
                    <label className="flex justify-between text-sm font-medium text-slate-300 mb-4">
                      <span>How sure are you?</span>
                      <span className="font-bold text-electric-indigo">{confidence}/10</span>
                    </label>
                    <input 
                      type="range" 
                      min="1" 
                      max="10" 
                      value={confidence} 
                      onChange={e => setConfidence(parseInt(e.target.value))}
                      className="w-full accent-electric-indigo"
                    />
                    <div className="flex justify-between text-xs text-slate-500 mt-2 font-mono uppercase tracking-widest">
                      <span>Wild Guess</span>
                      <span>100% Certain</span>
                    </div>
                  </div>

                  <button 
                    type="submit"
                    disabled={isSubmitting || !justification.trim()}
                    className="w-full bg-electric-indigo text-white font-bold py-4 rounded-xl hover:bg-indigo-500 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(99,102,241,0.3)]"
                  >
                    {isSubmitting ? <Loader2 className="animate-spin" /> : 'Lock in Answer & Reveal'}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Reveal Screen */}
        {stage === 'revealing' && evaluation && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6"
          >
            <div className={`p-8 rounded-2xl border-2 flex flex-col items-center text-center shadow-2xl relative overflow-hidden ${
              evaluation.isCorrect ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-rose-500/10 border-rose-500/30'
            }`}>
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-current to-transparent opacity-50"></div>
              
              {evaluation.isCorrect ? (
                <CheckCircle className="text-emerald-500 w-16 h-16 mb-4" />
              ) : (
                <AlertCircle className="text-rose-500 w-16 h-16 mb-4" />
              )}
              
              <h2 className={`text-3xl font-bold mb-2 ${evaluation.isCorrect ? 'text-emerald-400' : 'text-rose-400'}`}>
                {evaluation.isCorrect ? 'Victory!' : 'Fell for the Trap!'}
              </h2>
              <p className="text-xl text-white font-medium mb-6">
                Correct Answer: {debateData.optionA.isCorrect ? 'Option A' : 'Option B'}
              </p>

              <div className="bg-vercel-dark border border-vercel-border p-6 rounded-xl w-full text-left">
                <span className="text-xs font-bold uppercase tracking-widest text-electric-indigo block mb-2">AI Verdict</span>
                <p className="text-slate-300 leading-relaxed text-lg">{evaluation.feedback}</p>
                <div className="mt-4 p-3 bg-white/5 rounded-lg border border-white/10 flex items-center gap-3">
                  <User size={16} className="text-slate-400" />
                  <p className="text-sm font-medium text-slate-300 italic">"{evaluation.insight}"</p>
                </div>
              </div>
            </div>

            <button 
              onClick={() => fetchDebate()}
              className="w-full bg-vercel-card border border-vercel-border text-white font-bold py-4 rounded-xl hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
            >
              Enter Another Debate <ChevronRight size={18} />
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default DebateArena;
