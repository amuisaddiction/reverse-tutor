import React, { useState } from 'react';
import { motion } from 'framer-motion';
import TopicCard from '../components/TopicCard';
import { TOPICS } from '../data/topics';
import { Flame, Target, Award, ArrowUpRight, Clock, Activity } from 'lucide-react';

const Home = ({ onStart, examType }) => {
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [difficulty, setDifficulty] = useState('easy');
  const [activeTab, setActiveTab] = useState('Physics');

  const isNeet = examType === 'NEET';
  const themeBg = isNeet ? 'bg-emerald-500' : 'bg-indigo-500';
  const themeHover = isNeet ? 'hover:bg-emerald-400' : 'hover:bg-indigo-400';
  const themeText = isNeet ? 'text-emerald-500' : 'text-indigo-500';
  const themeRing = isNeet ? 'focus:ring-emerald-500' : 'focus:ring-indigo-500';
  
  const subjects = isNeet ? ['Physics', 'Chemistry', 'Biology'] : ['Physics', 'Chemistry', 'Math'];
  const filteredTopics = TOPICS.filter(t => t.subject === activeTab);

  // Generate mock contribution graph data
  const contributionGrid = Array.from({ length: 54 }).map((_, i) => (
    <div 
      key={i} 
      className={`w-3 h-3 rounded-sm ${Math.random() > 0.7 ? (isNeet ? 'bg-emerald-400' : 'bg-indigo-400') : Math.random() > 0.4 ? (isNeet ? 'bg-emerald-200' : 'bg-indigo-200') : 'bg-slate-100'}`}
    />
  ));

  return (
    <div className="min-h-screen relative overflow-hidden bg-slate-50 p-8 pb-32">
      {/* Aurora Background Effects */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-indigo-400/20 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className={`absolute top-0 right-0 w-[500px] h-[500px] ${isNeet ? 'bg-emerald-400/20' : 'bg-blue-400/20'} rounded-full blur-[120px] translate-x-1/2 -translate-y-1/2 pointer-events-none`} />

      <div className="relative z-10 max-w-7xl mx-auto">
        <header className="mb-10 flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-black text-slate-800 tracking-tight">Welcome back, Student.</h1>
            <p className="text-slate-500 font-medium mt-2">Let's crush some {examType} concepts today.</p>
          </div>
          <button className="flex items-center gap-2 bg-white border border-slate-200 px-5 py-2.5 rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
            <Activity size={18} /> View Analytics
          </button>
        </header>

        {/* Bento Box Dashboard Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-12">
          
          {/* Main Streak Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`lg:col-span-4 rounded-3xl p-8 relative overflow-hidden text-white ${isNeet ? 'bg-gradient-to-br from-emerald-500 to-teal-700' : 'bg-gradient-to-br from-indigo-500 to-blue-700'} shadow-xl`}
          >
            <div className="absolute top-0 right-0 p-6 opacity-20">
              <Flame size={120} />
            </div>
            <div className="relative z-10">
              <p className="font-bold text-white/80 uppercase tracking-widest text-sm mb-1">Current Streak</p>
              <h2 className="text-6xl font-black mb-6">12<span className="text-2xl font-bold text-white/80"> Days</span></h2>
              <div className="bg-white/20 backdrop-blur-md rounded-2xl p-4 inline-flex items-center gap-3 border border-white/20">
                <ArrowUpRight size={20} className="text-white" />
                <span className="font-medium">Top 5% of {examType} aspirants</span>
              </div>
            </div>
          </motion.div>

          {/* Activity Graph */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-5 bg-white/60 backdrop-blur-xl border border-white p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col justify-between"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-slate-700 flex items-center gap-2">
                <Target size={18} className={themeText} /> Teaching Activity
              </h3>
              <span className="text-sm font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full">148 Concepts</span>
            </div>
            <div className="flex flex-wrap gap-1.5 justify-center">
              {contributionGrid}
            </div>
          </motion.div>

          {/* Recent Sessions */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-3 bg-white/60 backdrop-blur-xl border border-white p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
          >
            <h3 className="font-bold text-slate-700 flex items-center gap-2 mb-6">
              <Clock size={18} className={themeText} /> Recent Sessions
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-lg">⚡</div>
                <div>
                  <p className="font-bold text-slate-800 text-sm">Newton's 3rd Law</p>
                  <p className="text-xs text-slate-500">Mastered 2 hrs ago</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-lg">🔋</div>
                <div>
                  <p className="font-bold text-slate-800 text-sm">Ohm's Law</p>
                  <p className="text-xs text-slate-500">Mastered yesterday</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Study Map Section */}
        <div className="bg-white/60 backdrop-blur-xl border border-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <h2 className="text-2xl font-black text-slate-800 mb-6">The {examType} Study Map</h2>
          
          <div className="flex gap-4 mb-8">
            {subjects.map(sub => (
              <button
                key={sub}
                onClick={() => { setActiveTab(sub); setSelectedTopic(null); }}
                className={`px-6 py-2.5 rounded-full font-bold transition-all ${
                  activeTab === sub 
                    ? `${themeBg} text-white shadow-lg ${isNeet ? 'shadow-emerald-500/30' : 'shadow-indigo-500/30'}` 
                    : 'bg-white text-slate-500 hover:bg-slate-100'
                }`}
              >
                {sub}
              </button>
            ))}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTopics.length > 0 ? filteredTopics.map(topic => (
              <TopicCard 
                key={topic.id} 
                topic={topic} 
                isSelected={selectedTopic?.id === topic.id}
                onClick={() => setSelectedTopic(topic)}
                examType={examType}
              />
            )) : (
              <div className="col-span-full py-12 text-center text-slate-400 font-medium border-2 border-dashed border-slate-200 rounded-2xl">
                Loading AI curriculum for {activeTab}...
              </div>
            )}
          </div>
        </div>

        {/* Start Teaching Floating Bar */}
        {selectedTopic && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed bottom-8 left-[calc(50%+8rem)] -translate-x-1/2 w-full max-w-3xl bg-white/90 backdrop-blur-2xl p-4 rounded-2xl shadow-[0_20px_60px_-10px_rgba(0,0,0,0.3)] border border-white flex items-center justify-between z-50"
          >
            <div className="flex items-center gap-6 px-4">
              <span className="font-bold text-slate-700">Difficulty:</span>
              <label className="flex items-center cursor-pointer gap-2">
                <input 
                  type="radio" 
                  className={`w-4 h-4 ${themeText} ${themeRing}`}
                  checked={difficulty === 'easy'} 
                  onChange={() => setDifficulty('easy')} 
                />
                <span className={difficulty === 'easy' ? 'font-bold text-slate-800' : 'text-slate-500'}>
                  {isNeet ? 'NEET Level' : 'JEE Main'}
                </span>
              </label>
              <label className="flex items-center cursor-pointer gap-2">
                <input 
                  type="radio" 
                  className={`w-4 h-4 ${themeText} ${themeRing}`}
                  checked={difficulty === 'hard'} 
                  onChange={() => setDifficulty('hard')} 
                />
                <span className={difficulty === 'hard' ? 'font-bold text-slate-800' : 'text-slate-500'}>
                  {isNeet ? 'AIIMS Level' : 'JEE Advanced'}
                </span>
              </label>
            </div>

            <button 
              onClick={() => onStart(selectedTopic, difficulty)}
              className={`px-8 py-3 ${themeBg} text-white rounded-xl font-bold ${themeHover} transition-all shadow-lg ${isNeet ? 'shadow-emerald-500/30' : 'shadow-indigo-500/30'} hover:scale-105`}
            >
              Start Teaching AI →
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Home;
