import React, { useState } from 'react';
import TopicCard from '../components/TopicCard';
import { TOPICS } from '../data/topics';

const Home = ({ onStart }) => {
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [difficulty, setDifficulty] = useState('easy');

  return (
    <div className="min-h-screen bg-[#F5F2F8] p-6 flex flex-col items-center">
      <div className="max-w-4xl w-full">
        <header className="mb-12 text-center mt-10">
          <h1 className="text-4xl font-bold text-[#2A1B3D] mb-3">🔄 Reverse Tutor</h1>
          <p className="text-xl text-gray-600">"Teach it. Really understand it."</p>
        </header>

        <h2 className="text-xl font-bold text-gray-700 mb-6 text-center">Pick a topic to teach:</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {TOPICS.map(topic => (
            <TopicCard 
              key={topic.id} 
              topic={topic} 
              isSelected={selectedTopic?.id === topic.id}
              onClick={() => setSelectedTopic(topic)}
            />
          ))}
        </div>

        <div className="flex flex-col items-center gap-8">
          <div className="flex items-center gap-4 bg-white px-6 py-3 rounded-full shadow-sm">
            <span className="font-semibold text-gray-700">Difficulty:</span>
            <label className="flex items-center cursor-pointer gap-2">
              <input 
                type="radio" 
                className="w-4 h-4 text-[#5B3FD4] focus:ring-[#5B3FD4]"
                checked={difficulty === 'easy'} 
                onChange={() => setDifficulty('easy')} 
              />
              <span className={difficulty === 'easy' ? 'font-bold' : ''}>Normal</span>
            </label>
            <label className="flex items-center cursor-pointer gap-2 ml-4">
              <input 
                type="radio" 
                className="w-4 h-4 text-[#5B3FD4] focus:ring-[#5B3FD4]"
                checked={difficulty === 'hard'} 
                onChange={() => setDifficulty('hard')} 
              />
              <span className={difficulty === 'hard' ? 'font-bold' : ''}>Hard</span>
            </label>
          </div>

          <button 
            disabled={!selectedTopic}
            onClick={() => onStart(selectedTopic, difficulty)}
            className={`px-12 py-4 rounded-full font-bold text-lg transition-all ${
              selectedTopic 
                ? 'bg-[#5B3FD4] text-white shadow-lg hover:shadow-xl hover:-translate-y-1' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Start Teaching →
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
