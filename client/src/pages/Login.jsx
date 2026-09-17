import React from 'react';
import { motion } from 'framer-motion';

const Login = ({ onLogin }) => {
  return (
    <div className="min-h-screen bg-[conic-gradient(at_top_right,_var(--tw-gradient-stops))] from-slate-900 via-indigo-950 to-slate-900 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-slate-900/60 backdrop-blur-2xl border border-slate-800 p-8 rounded-3xl shadow-2xl"
      >
        <div className="text-center mb-10">
          <div className="text-5xl mb-4">🔄</div>
          <h1 className="text-4xl font-bold text-white mb-2">RevTutor</h1>
          <p className="text-indigo-300 font-medium tracking-wide">Elite JEE / NEET Prep</p>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); onLogin(); }} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
            <input 
              type="email" 
              placeholder="student@example.com"
              className="w-full bg-slate-800/50 border border-slate-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
            <input 
              type="password" 
              placeholder="••••••••"
              className="w-full bg-slate-800/50 border border-slate-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
            />
          </div>
          
          <div className="flex justify-between items-center text-sm">
            <label className="flex items-center text-slate-400 gap-2 cursor-pointer">
              <input type="checkbox" className="rounded bg-slate-800 border-slate-700 text-indigo-500 focus:ring-indigo-500" />
              Remember me
            </label>
            <a href="#" className="text-indigo-400 hover:text-indigo-300">Forgot Password?</a>
          </div>

          <button 
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-indigo-600/30"
          >
            Sign In
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default Login;

