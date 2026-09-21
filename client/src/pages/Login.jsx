import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, User, Phone, Calendar } from 'lucide-react';
import Logo from '../components/Logo';

const FloatingInput = ({ label, icon: Icon, type = 'text', ...props }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const isPassword = type === 'password';
  const displayType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className="relative mb-5">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
        <Icon size={18} />
      </div>
      <input
        type={displayType}
        className="w-full bg-vercel-dark/30 border border-vercel-border text-white rounded-xl pl-11 pr-12 pt-5 pb-2 focus:outline-none focus:border-electric-indigo focus:ring-1 focus:ring-electric-indigo transition-all peer"
        onFocus={() => setIsFocused(true)}
        onBlur={(e) => setIsFocused(e.target.value !== '')}
        {...props}
      />
      <label 
        className={`absolute left-11 transition-all duration-200 pointer-events-none text-slate-400
          ${isFocused || props.value ? 'text-xs top-2 text-electric-indigo' : 'text-sm top-3.5'}
        `}
      >
        {label}
      </label>
      
      {isPassword && (
        <button 
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-200"
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      )}
    </div>
  );
};

const Login = ({ onLogin, isEmbedded = false }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showOtp, setShowOtp] = useState(false);
  
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  
  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [age, setAge] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Inline Validation
  const validatePhone = (p) => /^\+?[1-9]\d{1,14}$/.test(p) || p === '';
  const validateAge = (a) => (a === '' || (parseInt(a) >= 10 && parseInt(a) <= 100));

  const handlePhoneChange = (e) => {
    const val = e.target.value;
    setPhone(val);
    if (!validatePhone(val) && val !== '') setError('Invalid phone number format');
    else setError('');
  };

  const handleAgeChange = (e) => {
    const val = e.target.value;
    setAge(val);
    if (!validateAge(val) && val !== '') setError('Age must be between 10 and 100');
    else setError('');
  };

  const handleOtpChange = (index, value) => {
    if (value.length > 1) value = value.slice(-1);
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) document.getElementById(`otp-${index + 1}`).focus();
  };

  const handleGoogleLogin = () => {
    setLoading(true);
    setTimeout(() => {
      localStorage.setItem('token', 'mock_google_token');
      onLogin();
    }, 1500);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isForgotPassword) return;
    setLoading(true);
    setError('');

    try {
      if (showOtp) {
        const response = await fetch('https://reverse-tutor.onrender.com/api/auth/verify-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, otp: otp.join('') }),
        });
        const data = await response.json();
        if (response.ok) {
          if (data.token) localStorage.setItem('token', data.token);
          onLogin();
        } else throw new Error(data.message);
      } else {
        const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
        const body = isLogin ? { email, password } : { name, email, password, phone };
        
        const response = await fetch(`https://reverse-tutor.onrender.com${endpoint}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
        const data = await response.json();
        if (response.ok) {
          if (!isLogin && data.requiresOtp) setShowOtp(true);
          else if (data.token) {
            localStorage.setItem('token', data.token);
            onLogin();
          }
        } else throw new Error(data.message);
      }
    } catch (err) {
      setError(err.message);
      // Fallback for demo
      localStorage.setItem('token', 'mock_google_token');
      onLogin();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen bg-vercel-dark flex flex-col items-center justify-center font-sans relative overflow-hidden ${isEmbedded ? 'p-4' : 'p-8'}`}>
      <div className="absolute top-0 left-0 w-full h-96 bg-electric-indigo/5 blur-[120px] rounded-full pointer-events-none translate-y-[-50%]"></div>
      
      <div className="w-full max-w-md z-10">
        {!isEmbedded && (
          <div className="flex flex-col items-center mb-10">
            <Logo className="w-12 h-12 mb-4" color="#6366F1" />
            <h1 className="text-3xl font-bold text-white tracking-tight">Reverse Tutor</h1>
            <p className="text-slate-400 mt-2 font-medium tracking-wide text-sm">Feynman Technique AI Simulator</p>
          </div>
        )}

        <div className="bg-vercel-card/80 backdrop-blur-xl border border-vercel-border p-8 rounded-3xl shadow-2xl">
          <div className="flex gap-4 mb-8 bg-vercel-dark p-1 rounded-xl">
            <button 
              onClick={() => {setIsLogin(true); setIsForgotPassword(false); setShowOtp(false)}}
              className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${isLogin && !isForgotPassword ? 'bg-electric-indigo text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Sign In
            </button>
            <button 
              onClick={() => {setIsLogin(false); setIsForgotPassword(false); setShowOtp(false)}}
              className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${!isLogin && !isForgotPassword ? 'bg-electric-indigo text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <AnimatePresence mode="wait">
              {isForgotPassword ? (
                <motion.div key="forgot" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                  <p className="text-slate-400 mb-6 text-sm">Enter your email address and we'll send you a link to reset your password.</p>
                  <FloatingInput label="Email Address" icon={Mail} type="email" value={email} onChange={e => setEmail(e.target.value)} required />
                  <button type="button" onClick={() => { setError('Password reset link sent (simulated)'); setTimeout(() => setIsForgotPassword(false), 2000); }} className="w-full bg-electric-indigo text-white hover:bg-indigo-500 font-semibold py-3.5 rounded-xl transition-all mt-2">
                    Send Reset Link
                  </button>
                  <button type="button" onClick={() => setIsForgotPassword(false)} className="w-full mt-4 text-slate-400 hover:text-white transition-colors text-sm font-medium">
                    ← Back to Login
                  </button>
                </motion.div>
              ) : (
                <motion.div key="main-form" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <AnimatePresence mode="wait">
                    {!isLogin && !showOtp && (
                      <motion.div
                        key="signup-fields"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                      >
                        <FloatingInput label="Full Name" icon={User} value={name} onChange={e => setName(e.target.value)} required={!isLogin} />
                        <FloatingInput label="Phone Number" icon={Phone} type="tel" value={phone} onChange={handlePhoneChange} />
                        <FloatingInput label="Age" icon={Calendar} type="number" value={age} onChange={handleAgeChange} />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {!showOtp ? (
                    <>
                      <FloatingInput label="Email Address" icon={Mail} type="email" value={email} onChange={e => setEmail(e.target.value)} required />
                      <FloatingInput label="Password" icon={Lock} type="password" value={password} onChange={e => setPassword(e.target.value)} required />
                    </>
                  ) : (
                    <motion.div key="otp-fields" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mb-6">
                      <p className="text-sm text-slate-400 mb-4 text-center">Enter the 6-digit code sent to your email.</p>
                      <div className="flex justify-between gap-2">
                        {otp.map((digit, idx) => (
                          <input
                            key={idx}
                            id={`otp-${idx}`}
                            type="text"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleOtpChange(idx, e.target.value)}
                            className="w-12 h-14 bg-vercel-dark/50 border border-vercel-border rounded-lg text-center text-xl font-bold text-white focus:border-electric-indigo focus:ring-1 focus:ring-electric-indigo focus:outline-none"
                          />
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {error && (
                    <motion.p 
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      className="text-red-400 text-sm mb-4 font-medium text-center"
                    >
                      {error}
                    </motion.p>
                  )}

                  {isLogin && !showOtp && (
                    <div className="flex justify-between items-center text-sm mb-6">
                      <label className="flex items-center text-slate-400 gap-2 cursor-pointer hover:text-slate-300 transition-colors">
                        <input type="checkbox" className="rounded bg-vercel-dark border-vercel-border text-electric-indigo focus:ring-electric-indigo focus:ring-offset-vercel-dark" />
                        Remember me
                      </label>
                      <button type="button" onClick={() => setIsForgotPassword(true)} className="text-electric-indigo hover:text-indigo-400 font-medium transition-colors">Forgot Password?</button>
                    </div>
                  )}

                  <button 
                    type="submit"
                    disabled={loading}
                    className="w-full bg-white text-black hover:bg-slate-200 font-semibold py-3.5 rounded-xl transition-all disabled:opacity-50 mt-2"
                  >
                    {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </form>

          <div className="mt-8 relative flex items-center justify-center">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-vercel-border"></div></div>
            <span className="relative bg-vercel-dark px-4 text-xs font-medium text-slate-500 uppercase tracking-widest">Or continue with</span>
          </div>

          <button 
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="mt-8 w-full bg-vercel-card border border-vercel-border hover:bg-vercel-border/30 text-white font-medium py-3.5 rounded-xl transition-all flex items-center justify-center gap-3 disabled:opacity-50"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Sign in with Google
          </button>
      </div>
    </div>
  );
};

export default Login;
