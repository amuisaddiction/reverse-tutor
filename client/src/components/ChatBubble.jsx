import React from 'react';
import { motion } from 'framer-motion';

const ChatBubble = ({ message }) => {
  const isAI = message.role === 'assistant';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex w-full mb-6 ${isAI ? 'justify-start' : 'justify-end'}`}
    >
      <div 
        className={`max-w-[75%] p-5 rounded-2xl shadow-sm ${
          isAI 
            ? 'bg-white border border-slate-200 text-slate-700 font-serif rounded-tl-sm' 
            : 'bg-indigo-600 text-white rounded-tr-sm'
        }`}
      >
        {isAI && <div className="text-xs font-bold text-indigo-500 mb-2 not-italic uppercase tracking-wider">AI Student</div>}
        <p className="leading-relaxed text-[15px]">{message.content}</p>
      </div>
    </motion.div>
  );
};

export default ChatBubble;
