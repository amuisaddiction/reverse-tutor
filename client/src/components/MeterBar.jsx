import React from 'react';
import { motion } from 'framer-motion';

const MeterBar = ({ score, shake }) => {
  let color = 'bg-[#C4574B]'; // Coral (0-40)
  if (score > 40) color = 'bg-[#E39B2E]'; // Marigold (41-75)
  if (score > 75) color = 'bg-[#7FB3A0]'; // Mint (76-100)

  return (
    <div className="w-full">
      <div className="flex justify-between items-end mb-1 text-sm font-medium text-gray-700">
        <span>Ravi understands...</span>
        <span>{score}%</span>
      </div>
      <motion.div 
        className="w-full bg-gray-200 rounded-full h-4 overflow-hidden shadow-inner"
        animate={shake ? { x: [-5, 5, -5, 5, 0] } : {}}
        transition={{ duration: 0.4 }}
      >
        <motion.div
          className={`h-4 rounded-full ${color}`}
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ type: 'spring', stiffness: 50, damping: 10 }}
        />
      </motion.div>
    </div>
  );
};

export default MeterBar;
