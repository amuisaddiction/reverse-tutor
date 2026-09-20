import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { GoogleLogin } from '@react-oauth/google';
import Logo from '../components/Logo';

const Login = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1); // 1: Email/Pass, 2: OTP
  const [error, setError] = useState('');

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const res = await fetch('http://localhost:3001/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential: credentialResponse.credential }),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('token', data.token);
        onLogin();
      } else setError(data.error || data.message);
    } catch (err) { setError("Google login failed."); }
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/signup';
    
    try {
      const res = await fetch(`http://localhost:3001${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      
      if (res.ok) {
        if (isLogin) {
          localStorage.setItem('token', data.token);
          onLogin();
        } else {
          setStep(2); // Move to OTP step
        }
      } else setError(data.message || 'Authentication failed');
    } catch (err) { setError("Network error."); }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch(`http://localhost:3001/api/auth/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('token', data.token);
        onLogin();
      } else setError(data.message || 'Invalid OTP');
    } catch (err) { setError("Network error."); }
  };

  return (
    <div className="min-h-screen bg-[conic-gradient(at_top_right,_var(--tw-gradient-stops))] from-slate-900 via-indigo-950 to-slate-900 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-slate-900/60 backdrop-blur-2xl border border-slate-800 p-8 rounded-3xl shadow-2xl"
      >
        <div className="text-center mb-8 flex flex-col items-center">
          <Logo className="w-16 h-16 mb-4" color="#ffffff" />
          <h1 className="text-3xl font-bold text-white mb-1">RevTutor</h1>
          <p className="text-indigo-300 font-medium tracking-wide">Elite JEE / NEET Prep</p>
        </div>

        {error && <div className="bg-red-500/20 border border-red-500 text-red-300 px-4 py-2 rounded-lg mb-4 text-sm text-center">{error}</div>}

        {step === 1 ? (
          <>
            <form onSubmit={handleAuthSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full bg-slate-800/50 border border-slate-700 text-white rounded-xl px-4 py-2.5 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Password</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full bg-slate-800/50 border border-slate-700 text-white rounded-xl px-4 py-2.5 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" />
              </div>
              
              <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-indigo-600/30 mt-2">
                {isLogin ? 'Sign In' : 'Create Account'}
              </button>
            </form>

            <div className="my-6 flex items-center before:mt-0.5 before:flex-1 before:border-t before:border-slate-700 after:mt-0.5 after:flex-1 after:border-t after:border-slate-700">
              <p className="mx-4 mb-0 text-center text-sm font-semibold text-slate-500">OR</p>
            </div>

            <div className="flex justify-center">
              <GoogleLogin onSuccess={handleGoogleSuccess} onError={() => setError("Google login failed")} theme="filled_black" shape="pill" />
            </div>

            <div className="text-center mt-6">
              <button onClick={() => setIsLogin(!isLogin)} className="text-slate-400 hover:text-white text-sm transition-colors">
                {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
              </button>
            </div>
          </>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-4 text-center">
            <h2 className="text-xl text-white font-semibold mb-2">Check your Email</h2>
            <p className="text-slate-400 text-sm mb-4">We sent a 6-digit OTP to {email}</p>
            <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="000000" className="w-full bg-slate-800/50 border border-slate-700 text-white rounded-xl px-4 py-3 text-center tracking-[0.5em] text-xl focus:outline-none focus:border-indigo-500" required />
            <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl transition-all">Verify OTP</button>
          </form>
        )}
      </motion.div>
    </div>
  );
};

export default Login;
