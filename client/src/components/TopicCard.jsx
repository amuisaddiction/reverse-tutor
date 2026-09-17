import React from 'react';

const TopicCard = ({ topic, isSelected, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className={`p-6 rounded-2xl cursor-pointer transition-all duration-200 border-2 
        ${isSelected 
          ? 'border-indigo-600 shadow-[0_8px_30px_rgb(0,0,0,0.12)] -translate-y-1 bg-white' 
          : 'border-slate-100 bg-white hover:border-indigo-200 hover:shadow-md hover:-translate-y-1'}`}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="text-3xl">{topic.emoji}</div>
        <span className="text-[10px] font-bold tracking-wider uppercase bg-slate-100 text-slate-500 px-2 py-1 rounded">
          Class {topic.classLevel}
        </span>
      </div>
      <h3 className="font-bold text-slate-800 text-lg">{topic.label}</h3>
    </div>
  );
};

export default TopicCard;
