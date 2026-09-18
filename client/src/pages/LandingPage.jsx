import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Logo from '../components/Logo';
import Login from './Login';
import { TOPICS } from '../data/topics';
import { ArrowUpRight, BookOpen, Target, ChevronDown } from 'lucide-react';

const LandingPage = ({ onLogin }) => {
  const [previewExam, setPreviewExam] = useState('JEE Main');
  
  const subjects = previewExam === 'NEET' ? ['Physics', 'Chemistry', 'Biology'] : ['Physics', 'Chemistry', 'Math'];
  const [activeTab, setActiveTab] = useState('Physics');

  const filteredTopics = TOPICS.filter(t => t.subject === activeTab);

  const scrollToLogin = () => {
    document.getElementById('auth-section').scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="bg-vercel-dark font-sans text-slate-300 overflow-x-hidden">
      
      {/* 1. Hero Section */}
      <section className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl h-full max-h-[600px] bg-electric-indigo/10 blur-[120px] rounded-full pointer-events-none" />
        
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative z-10 flex flex-col items-center">
          <div className="flex items-center gap-4 mb-8">
            <Logo className="w-16 h-16" color="#ffffff" />
            <h1 className="text-5xl font-black text-white tracking-tight">RevTutor</h1>
          </div>
          
          <h2 className="text-4xl md:text-6xl font-black text-white leading-tight tracking-tighter mb-6 max-w-4xl">
            Reverse Engineer your<br />JEE & NEET Preparation.
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed mb-10">
            A minimalist, highly adaptive platform that pinpoints exactly where you are losing marks, generates dynamic syllabus heatmaps, and serves chapter-wise quizzes.
          </p>

          <button onClick={scrollToLogin} className="bg-white text-black px-8 py-4 rounded-xl font-bold hover:bg-slate-200 transition-all flex items-center gap-2">
            Get Started Now <ChevronDown size={20} />
          </button>
        </motion.div>
      </section>

      {/* 2. Login / Sign Up Section */}
      <section id="auth-section" className="py-20 border-t border-vercel-border bg-black/20">
        <div className="max-w-md mx-auto">
          {/* We embed the existing Login component here */}
          <Login onLogin={onLogin} isEmbedded={true} />
        </div>
      </section>

      {/* 3. Explore the Curriculum Section */}
      <section className="py-32 px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">What do you want to master?</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {['JEE Main', 'JEE Advanced', 'NEET'].map(exam => (
              <button 
                key={exam}
                onClick={() => setPreviewExam(exam)}
                className={`px-8 py-3 rounded-full font-medium transition-all border ${
                  previewExam === exam 
                    ? 'bg-electric-indigo border-electric-indigo text-white shadow-[0_0_20px_rgba(99,102,241,0.3)]' 
                    : 'bg-vercel-card border-vercel-border text-slate-400 hover:text-white hover:border-slate-500'
                }`}
              >
                {exam}
              </button>
            ))}
          </div>
        </div>

        {/* 4. Curriculum Preview Grid */}
        <div className="bg-vercel-card border border-vercel-border p-8 rounded-2xl relative overflow-hidden">
          
          <div className="flex flex-col md:flex-row justify-between items-center mb-8 border-b border-vercel-border pb-6">
            <div>
              <h3 className="text-2xl font-bold text-white mb-2 flex items-center gap-2"><Target className="text-electric-indigo" /> {previewExam} Syllabus</h3>
              <p className="text-slate-400 text-sm">Preview of our adaptive curriculum map.</p>
            </div>
            <div className="flex gap-2 mt-4 md:mt-0">
              {subjects.map(sub => (
                <button
                  key={sub}
                  onClick={() => setActiveTab(sub)}
                  className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeTab === sub 
                      ? 'bg-white text-black' 
                      : 'text-slate-400 hover:text-white bg-vercel-dark border border-vercel-border'
                  }`}
                >
                  {sub}
                </button>
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTopics.map((topic, i) => (
              <motion.div 
                key={topic.id}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="p-5 rounded-xl border border-vercel-border bg-vercel-dark/50 hover:border-electric-indigo hover:bg-electric-indigo/5 transition-all group cursor-pointer"
                onClick={scrollToLogin}
              >
                <div className="flex items-center gap-4">
                  <span className="text-3xl">{topic.emoji}</span>
                  <div>
                    <h4 className="text-white font-medium mb-1 group-hover:text-electric-indigo transition-colors">{topic.label}</h4>
                    <span className="text-[10px] font-mono text-slate-500 uppercase flex items-center gap-1">
                      <BookOpen size={10} /> Class {topic.classLevel}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          {/* Fade out bottom overlay to tease user to login */}
          <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-vercel-card to-transparent flex items-end justify-center pb-6">
            <button onClick={scrollToLogin} className="text-electric-indigo font-bold hover:text-white transition-colors flex items-center gap-2">
              Sign in to unlock all chapters <ArrowUpRight size={16} />
            </button>
          </div>
        </div>

      </section>

      <footer className="py-8 text-center text-slate-600 text-sm border-t border-vercel-border">
        © 2026 RevTutor Inc. Built for top percentiles.
      </footer>
    </div>
  );
};

export default LandingPage;

