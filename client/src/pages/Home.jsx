import React, { useState } from 'react';
import TopicCard from '../components/TopicCard';
import { TOPICS } from '../data/topics';
import { Flame, Target, Award } from 'lucide-react';

const Home = ({ onStart, examType }) => {
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [difficulty, setDifficulty] = useState('easy');
  const [activeTab, setActiveTab] = useState('Physics');

  const isNeet = examType === 'NEET';
  const themeBg = isNeet ? 'bg-emerald-600' : 'bg-indigo-600';
  const themeHover = isNeet ? 'hover:bg-emerald-500' : 'hover:bg-indigo-500';
  const themeText = isNeet ? 'text-emerald-600' : 'text-indigo-600';
  const themeRing = isNeet ? 'focus:ring-emerald-600' : 'focus:ring-indigo-600';
  const themeShadow = isNeet ? 'shadow-emerald-600/30' : 'shadow-indigo-600/30';

  const subjects = isNeet ? ['Physics', 'Chemistry', 'Biology'] : ['Physics', 'Chemistry', 'Math'];
  const filteredTopics = TOPICS.filter(t => t.subject === activeTab);

  return (
    <div className={`min-h-screen p-8 pb-32 ${isNeet ? 'bg-emerald-50/30' : 'bg-slate-50'}`}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="bg-orange-100 p-4 rounded-xl text-orange-500">
            <Flame size={28} />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">Daily Streak</p>
            <p className="text-3xl font-bold text-slate-800">0 Days</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className={`p-4 rounded-xl ${isNeet ? 'bg-emerald-100 text-emerald-500' : 'bg-indigo-100 text-indigo-500'}`}>
            <Target size={28} />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">Problems Solved</p>
            <p className="text-3xl font-bold text-slate-800">0</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className={`p-4 rounded-xl ${isNeet ? 'bg-teal-100 text-teal-500' : 'bg-blue-100 text-blue-500'}`}>
            <Award size={28} />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">Accuracy Score</p>
            <p className="text-3xl font-bold text-slate-800">--%</p>
          </div>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-slate-800 mb-6">Chapter-wise Study Map</h2>
      
      <div className="flex gap-4 mb-8 border-b border-slate-200 pb-4">
        {subjects.map(sub => (
          <button
            key={sub}
            onClick={() => { setActiveTab(sub); setSelectedTopic(null); }}
            className={`px-6 py-2.5 rounded-full font-bold transition-all ${
              activeTab === sub 
                ? 'bg-slate-800 text-white shadow-md' 
                : 'bg-white text-slate-500 hover:bg-slate-200'
            }`}
          >
            {sub}
          </button>
        ))}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
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
            Adding actual {activeTab} PYQs and Concepts to database...
          </div>
        )}
      </div>

      {selectedTopic && (
        <div className="fixed bottom-8 left-[calc(50%+8rem)] -translate-x-1/2 w-full max-w-3xl bg-white p-4 rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.2)] border border-slate-200 flex items-center justify-between z-50">
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
            className={`px-8 py-3 ${themeBg} text-white rounded-xl font-bold ${themeHover} transition-colors shadow-lg ${themeShadow}`}
          >
            Start Teaching AI →
          </button>
        </div>
      )}
    </div>
  );
};

export default Home;
