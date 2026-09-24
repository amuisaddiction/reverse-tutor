import React, { useState } from 'react';
import { motion } from 'framer-motion';
import TopicCard from '../components/TopicCard';
import { TOPICS } from '../data/topics';
import { Activity, Clock, ArrowUpRight, Zap, Target, BookOpen } from 'lucide-react';

const Home = ({ onStart, examType }) => {
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [difficulty, setDifficulty] = useState('easy');
  const [activeTab, setActiveTab] = useState('Physics');

  const subjects = examType === 'NEET' ? ['Physics', 'Chemistry', 'Biology'] : ['Physics', 'Chemistry', 'Math'];
  const filteredTopics = TOPICS.filter(t => t.subject === activeTab);

  // Minimalist Vercel-style activity graph
  const contributionGrid = Array.from({ length: 60 }).map((_, i) => {
    const intensity = i === 59 ? 0.4 : 0;
    let bg = 'bg-vercel-border/30';
    if (intensity > 0.8) bg = 'bg-electric-indigo';
    else if (intensity > 0.5) bg = 'bg-electric-indigo/60';
    else if (intensity > 0.3) bg = 'bg-electric-indigo/30';
    return <div key={i} className={`w-3 h-3 rounded-sm ${bg}`} />;
  });

  return (
    <div className="min-h-screen bg-vercel-dark p-8 pb-32 text-slate-300 font-sans">
      <div className="max-w-7xl mx-auto">
        
        <header className="mb-12 flex justify-between items-end border-b border-vercel-border pb-6">
          <div>
            <h1 className="text-3xl font-semibold text-white tracking-tight">Overview</h1>
            <p className="text-slate-400 text-sm mt-1">{examType} Preparation Dashboard</p>
          </div>
          <button 
            onClick={() => document.getElementById('analytics')?.click()}
            className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-md font-medium hover:bg-slate-200 transition-colors text-sm"
          >
            <Activity size={16} /> View Analytics
          </button>
        </header>

        {/* Minimalist Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          
          {/* Streak Card */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-vercel-card border border-vercel-border p-6 rounded-xl flex flex-col justify-between"
          >
            <div className="flex justify-between items-start mb-8">
              <div className="p-2 bg-vercel-border/30 rounded-lg text-electric-indigo">
                <Zap size={20} />
              </div>
              <span className="text-xs font-mono text-slate-500 uppercase tracking-widest">Active</span>
            </div>
            <div>
              <p className="text-sm text-slate-400 mb-1">Current Streak</p>
              <h2 className="text-4xl font-semibold text-white tracking-tight">0 <span className="text-lg text-slate-500 font-normal">Days</span></h2>
            </div>
          </motion.div>

          {/* Activity Graph */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-vercel-card border border-vercel-border p-6 rounded-xl col-span-1 lg:col-span-2 flex flex-col justify-between"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-sm font-medium text-slate-300 flex items-center gap-2">
                <Target size={16} className="text-electric-indigo" /> Teaching Activity
              </h3>
              <span className="text-xs font-mono text-slate-500">0 Concepts Mastered</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {contributionGrid}
            </div>
          </motion.div>
        </div>

        {/* Study Map Section */}
        <div className="bg-vercel-card border border-vercel-border p-8 rounded-xl">
          <div className="flex justify-between items-center mb-6 border-b border-vercel-border pb-4">
            <h2 className="text-xl font-semibold text-white">Curriculum Map</h2>
            <div className="flex gap-2">
              {subjects.map(sub => (
                <button
                  key={sub}
                  onClick={() => { setActiveTab(sub); setSelectedTopic(null); }}
                  className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTopics.length > 0 ? filteredTopics.map(topic => {
                // Generate deterministic mock progress for visual appeal
                const progress = Math.round(((topic.id.length + topic.label.length) % 10) * 10);
                
                return (
                <button 
                  key={topic.id}
                  onClick={() => setSelectedTopic(topic)}
                  aria-label={`${topic.label}, Class ${topic.classLevel}, ${progress}% Completed`}
                  aria-pressed={selectedTopic?.id === topic.id}
                  className={`p-5 rounded-lg border transition-all text-left flex flex-col gap-3 focus:outline-none focus:ring-2 focus:ring-electric-indigo ${
                    selectedTopic?.id === topic.id
                      ? 'border-electric-indigo bg-electric-indigo/10'
                      : 'border-vercel-border hover:border-slate-500 bg-vercel-dark/50'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-4">
                      <span className="text-2xl" aria-hidden="true">{topic.emoji}</span>
                      <div>
                        <h3 className="text-white font-medium text-sm">{topic.label}</h3>
                        <span className="text-[10px] font-mono text-slate-500 uppercase">Class {topic.classLevel}</span>
                      </div>
                    </div>
                    {selectedTopic?.id === topic.id && <ArrowUpRight size={16} className="text-electric-indigo shrink-0" />}
                  </div>
                  
                  {/* Completion Progress Bar */}
                  <div className="w-full mt-2">
                    <div className="flex justify-between text-[10px] font-mono text-slate-400 mb-1">
                      <span>Progress</span>
                      <span>{progress}%</span>
                    </div>
                    <div className="w-full bg-vercel-dark h-1.5 rounded-full overflow-hidden">
                      <div className="bg-electric-indigo h-full rounded-full" style={{ width: `${progress}%` }}></div>
                    </div>
                  </div>
                </button>
              )}) : (
              <div className="col-span-full py-12 text-center text-slate-500 text-sm border border-dashed border-vercel-border rounded-lg">
                Loading official NTA curriculum...
              </div>
            )}
          </div>
        </div>

        {/* Start Teaching Floating Bar */}
        {selectedTopic && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed bottom-8 left-[calc(50%+8rem)] -translate-x-1/2 w-full max-w-2xl bg-vercel-dark border border-vercel-border p-4 rounded-xl shadow-2xl flex items-center justify-between z-50"
          >
            <div className="flex items-center gap-6 px-4">
              <span className="text-sm font-medium text-slate-400">Level:</span>
              <label className="flex items-center cursor-pointer gap-2">
                <input 
                  type="radio" 
                  className="w-3.5 h-3.5 accent-electric-indigo"
                  checked={difficulty === 'easy'} 
                  onChange={() => setDifficulty('easy')} 
                />
                <span className={`text-sm ${difficulty === 'easy' ? 'text-white font-medium' : 'text-slate-400'}`}>
                  {examType === 'NEET' ? 'NEET Prep' : 'JEE Main'}
                </span>
              </label>
              <label className="flex items-center cursor-pointer gap-2">
                <input 
                  type="radio" 
                  className="w-3.5 h-3.5 accent-electric-indigo"
                  checked={difficulty === 'hard'} 
                  onChange={() => setDifficulty('hard')} 
                />
                <span className={`text-sm ${difficulty === 'hard' ? 'text-white font-medium' : 'text-slate-400'}`}>
                  {examType === 'NEET' ? 'AIIMS Level' : 'JEE Advanced'}
                </span>
              </label>
            </div>

            <button 
              onClick={() => onStart(selectedTopic, difficulty)}
              className="px-6 py-2 bg-white text-black rounded-md font-medium text-sm hover:bg-slate-200 transition-colors"
            >
              Initialize AI Session
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Home;
