import React from 'react';
import { motion } from 'framer-motion';

const MeterBar = ({ score, shake }) => {
  let color = 'bg-rose-500'; 
  if (score > 40) color = 'bg-amber-500'; 
  if (score > 75) color = 'bg-emerald-500'; 

  return (
    <div className="w-full">
      <div className="flex justify-between items-end mb-2 text-sm font-bold text-slate-600 uppercase tracking-wider">
        <span>Understanding Level</span>
        <span className="text-slate-800">{score}%</span>
      </div>
      <motion.div 
        className="w-full bg-slate-100 rounded-full h-3 overflow-hidden shadow-inner"
        animate={shake ? { x: [-5, 5, -5, 5, 0] } : {}}
        transition={{ duration: 0.4 }}
      >
        <motion.div
          className={`h-3 rounded-full ${color}`}
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ type: 'spring', stiffness: 50, damping: 10 }}
        />
      </motion.div>
    </div>
  );
};

export default MeterBar;
