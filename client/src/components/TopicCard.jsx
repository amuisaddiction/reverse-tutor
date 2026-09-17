import React from 'react';

const TopicCard = ({ topic, isSelected, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className={`p-4 rounded-xl cursor-pointer transition-all duration-200 border-2 
        ${isSelected 
          ? 'border-[#5B3FD4] shadow-lg -translate-y-1 bg-white' 
          : 'border-transparent bg-white shadow-sm hover:shadow-md hover:-translate-y-1'}`}
    >
      <div className="text-3xl mb-2">{topic.emoji}</div>
      <h3 className="font-semibold text-gray-800">{topic.label}</h3>
      <span className="text-xs text-gray-500 font-medium px-2 py-1 bg-[#F5F2F8] rounded-full mt-2 inline-block">
        {topic.subject}
      </span>
    </div>
  );
};

export default TopicCard;
