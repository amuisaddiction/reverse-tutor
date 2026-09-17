import React from 'react';
import { motion } from 'framer-motion';

const ScoreCard = ({ topic, difficulty, turns, clarity, analogyUsed, gapFound, misconception, reset }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full mx-auto"
    >
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-[#2A1B3D]">🎉 Ravi gets it now!</h2>
        <p className="text-gray-500 mt-1">
          {topic.label} · {turns} turns · {difficulty === 'hard' ? 'Hard' : 'Normal'}
        </p>
      </div>

      <div className="space-y-4 mb-6">
        <div className="flex justify-between items-center">
          <span className="font-medium text-gray-700">Clarity</span>
          <span className="font-bold text-[#5B3FD4]">{clarity}/10</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="font-medium text-gray-700">Analogy Used</span>
          <span className={`font-bold ${analogyUsed ? 'text-[#7FB3A0]' : 'text-gray-400'}`}>
            {analogyUsed ? '✓ Yes' : '✗ No'}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="font-medium text-gray-700">Found the Gap</span>
          <span className={`font-bold ${gapFound ? 'text-[#7FB3A0]' : 'text-[#C4574B]'}`}>
            {gapFound ? '✓ Yes' : '✗ No'}
          </span>
        </div>
      </div>

      <div className="bg-[#F5F2F8] p-4 rounded-xl mb-6">
        <h3 className="text-sm font-bold text-[#5B3FD4] uppercase mb-2">Ravi was hiding:</h3>
        <p className="text-gray-700 italic">"{misconception}"</p>
      </div>

      <div className="flex gap-3">
        <button 
          onClick={reset}
          className="flex-1 bg-[#F5F2F8] text-[#5B3FD4] font-semibold py-3 rounded-xl hover:bg-gray-200 transition-colors"
        >
          Try Next Topic
        </button>
        <button 
          className="flex-1 bg-[#5B3FD4] text-white font-semibold py-3 rounded-xl hover:bg-opacity-90 transition-colors"
        >
          Share Card
        </button>
      </div>
    </motion.div>
  );
};

export default ScoreCard;
