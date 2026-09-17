import React from 'react';
import { motion } from 'framer-motion';

const ChatBubble = ({ message }) => {
  const isAI = message.role === 'assistant';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex w-full mb-4 ${isAI ? 'justify-start' : 'justify-end'}`}
    >
      <div 
        className={`max-w-[80%] rounded-2xl p-4 ${
          isAI 
            ? 'bg-[#F5F2F8] text-[#2A1B3D] font-serif italic' 
            : 'bg-[#5B3FD4] text-white'
        }`}
      >
        {isAI && <div className="text-xs font-bold text-[#5B3FD4] mb-1 not-italic">Ravi</div>}
        <p className="leading-relaxed">{message.content}</p>
      </div>
    </motion.div>
  );
};

export default ChatBubble;
