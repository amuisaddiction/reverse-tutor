import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, Target, Zap, Clock, BookOpen, Flame } from 'lucide-react';

const Analytics = ({ examType }) => {
  const [timeRange, setTimeRange] = useState('7d');

  // Generate heatmap data
  const generateHeatmap = () => {
    return Array.from({ length: 90 }).map((_, i) => {
      const val = Math.random();
      let intensity = 'bg-vercel-border/30';
      if (val > 0.8) intensity = 'bg-electric-indigo';
      else if (val > 0.6) intensity = 'bg-electric-indigo/80';
      else if (val > 0.4) intensity = 'bg-electric-indigo/50';
      else if (val > 0.2) intensity = 'bg-electric-indigo/30';
      
      return (
        <div 
          key={i} 
          className={`w-3 h-3 rounded-sm ${intensity} hover:ring-2 hover:ring-white transition-all cursor-pointer`}
          title={`Activity Level: ${Math.round(val * 100)}%`}
        />
      );
    });
  };

  // Generate bar chart data
  const accuracyData = [
    { label: 'Physics', val: 78, color: 'bg-emerald-500' },
    { label: 'Chemistry', val: 92, color: 'bg-indigo-500' },
    { label: 'Math', val: 64, color: 'bg-rose-500' },
  ];

  return (
    <div className="min-h-screen bg-vercel-dark p-8 pb-32 text-slate-300 font-sans">
      <div className="max-w-6xl mx-auto">
        
        <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end border-b border-vercel-border pb-6 gap-4">
          <div>
            <h1 className="text-3xl font-semibold text-white tracking-tight flex items-center gap-3">
              <Activity className="text-electric-indigo" /> Progress Tracker
            </h1>
            <p className="text-slate-400 text-sm mt-1">Activity heatmaps and performance analytics.</p>
          </div>
          
          <div className="flex bg-vercel-card border border-vercel-border rounded-lg p-1">
            {['7d', '30d', '90d'].map(range => (
              <button 
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-1.5 text-xs font-mono tracking-widest uppercase rounded-md transition-all ${
                  timeRange === range ? 'bg-vercel-border text-white' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </header>

        {/* Top KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Current Streak', val: '12 Days', icon: <Flame size={20} className="text-orange-500" /> },
            { label: 'Questions Solved', val: '1,492', icon: <Target size={20} className="text-emerald-500" /> },
            { label: 'Avg. Accuracy', val: '84.2%', icon: <Activity size={20} className="text-indigo-500" /> },
            { label: 'Study Hours', val: '142h', icon: <Clock size={20} className="text-blue-500" /> },
          ].map((stat, i) => (
            <motion.div 
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-vercel-card border border-vercel-border p-6 rounded-2xl flex items-start justify-between group hover:border-electric-indigo/50 transition-colors"
            >
              <div>
                <p className="text-xs font-mono uppercase tracking-widest text-slate-500 mb-1">{stat.label}</p>
                <p className="text-2xl font-bold text-white">{stat.val}</p>
              </div>
              <div className="p-3 bg-vercel-dark rounded-xl group-hover:scale-110 transition-transform">
                {stat.icon}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Heatmap Section */}
          <div className="lg:col-span-2 bg-vercel-card border border-vercel-border p-6 rounded-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-sm font-mono uppercase tracking-widest text-slate-400">Activity Heatmap</h2>
              <span className="text-xs bg-electric-indigo/10 text-electric-indigo px-2 py-1 rounded-full font-medium">90 Days</span>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-4 justify-start">
              {generateHeatmap()}
            </div>
            
            <div className="flex items-center justify-end gap-2 text-xs text-slate-500 font-mono mt-4 border-t border-vercel-border/50 pt-4">
              <span>Less</span>
              <div className="w-3 h-3 rounded-sm bg-vercel-border/30"></div>
              <div className="w-3 h-3 rounded-sm bg-electric-indigo/30"></div>
              <div className="w-3 h-3 rounded-sm bg-electric-indigo/50"></div>
              <div className="w-3 h-3 rounded-sm bg-electric-indigo/80"></div>
              <div className="w-3 h-3 rounded-sm bg-electric-indigo"></div>
              <span>More</span>
            </div>
          </div>

          {/* Subject Accuracy Bars */}
          <div className="bg-vercel-card border border-vercel-border p-6 rounded-2xl">
            <h2 className="text-sm font-mono uppercase tracking-widest text-slate-400 mb-6">Subject Mastery</h2>
            <div className="space-y-6">
              {accuracyData.map(subj => (
                <div key={subj.label}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-white font-medium">{subj.label}</span>
                    <span className="font-mono text-slate-400">{subj.val}%</span>
                  </div>
                  <div className="w-full bg-vercel-dark h-2 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${subj.val}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className={`h-full ${subj.color} rounded-full relative`}
                    >
                      <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                    </motion.div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-8 pt-6 border-t border-vercel-border/50">
              <button className="w-full bg-vercel-dark border border-vercel-border hover:border-electric-indigo/50 hover:bg-electric-indigo/5 text-slate-300 font-medium py-3 rounded-xl transition-all text-sm flex items-center justify-center gap-2">
                <BookOpen size={16} /> View Weak Topics
              </button>
            </div>
          </div>
          
        </div>

      </div>
    </div>
  );
};

export default Analytics;
