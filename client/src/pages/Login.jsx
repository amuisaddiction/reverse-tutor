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
  
  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [age, setAge] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleOtpChange = (index, value) => {
    if (value.length > 1) value = value.slice(-1);
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    // Auto focus next
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!isLogin && !showOtp) {
        // Step 1: Signup -> Request OTP
        const res = await fetch(`https://reverse-tutor.onrender.com/api/auth/signup`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, phone, password })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        setShowOtp(true);
      } else {
        // Step 2: Login OR Verify OTP
        const endpoint = isLogin ? '/api/auth/login' : '/api/auth/verify-otp';
        const body = isLogin ? { email, password } : { name, email, phone, password, otp: otp.join('') };
        
        const res = await fetch(`https://reverse-tutor.onrender.com${endpoint}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        
        if (data.token) localStorage.setItem('token', data.token);
        onLogin();
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    setLoading(true);
    // Simulate OAuth Redirect & Callback
    setTimeout(() => {
      localStorage.setItem('token', 'mock_google_token');
      onLogin();
    }, 1200);
  };

  const wrapperClass = isEmbedded 
    ? "w-full max-w-md mx-auto relative z-10"
    : "min-h-screen flex items-center justify-center bg-vercel-dark font-sans text-slate-300 relative overflow-hidden";

  return (
    <div className={wrapperClass}>
      {/* Background Glow */}
      {!isEmbedded && <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl h-full max-h-[800px] bg-electric-indigo/10 blur-[120px] rounded-full pointer-events-none" />}

      {/* Auth Form - Centered */}
      <div className={`w-full max-w-md relative z-10 ${isEmbedded ? '' : 'p-8'}`}>
        
        {/* Logo */}
        {!isEmbedded && (
          <div className="flex justify-center items-center gap-3 mb-10">
            <Logo className="w-10 h-10" color="#ffffff" />
            <h1 className="text-3xl font-bold text-white tracking-tight">RevTutor</h1>
          </div>
        )}

          <div className="text-center mb-8">
            <h2 className="text-3xl font-semibold text-white tracking-tight mb-2">
              {isLogin ? 'Welcome back' : 'Create your account'}
            </h2>
            <p className="text-slate-400 text-sm">
              {isLogin ? 'Enter your details to access your dashboard.' : 'Start your journey to AIR 1.'}
            </p>
          </div>

          {/* Form Tabs */}
          <div className="flex bg-vercel-border/30 p-1 rounded-xl mb-8 relative">
            <button 
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all z-10 ${isLogin ? 'text-white' : 'text-slate-400 hover:text-slate-300'}`}
            >
              Sign In
            </button>
            <button 
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all z-10 ${!isLogin ? 'text-white' : 'text-slate-400 hover:text-slate-300'}`}
            >
              Sign Up
            </button>
            {/* Animated Pill */}
            <motion.div 
              className="absolute top-1 bottom-1 w-[calc(50%-4px)] bg-vercel-card border border-vercel-border shadow-sm rounded-lg"
              initial={false}
              animate={{ left: isLogin ? '4px' : 'calc(50%)' }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            />
          </div>

          <form onSubmit={handleSubmit}>
            <AnimatePresence mode="wait">
              {!isLogin && !showOtp && (
                <motion.div
                  key="signup-fields"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <FloatingInput label="Full Name" icon={User} value={name} onChange={e => setName(e.target.value)} required={!isLogin} />
                  <FloatingInput label="Phone Number" icon={Phone} type="tel" value={phone} onChange={e => setPhone(e.target.value)} />
                  <FloatingInput label="Age" icon={Calendar} type="number" value={age} onChange={e => setAge(e.target.value)} />
                </motion.div>
              )}
            </AnimatePresence>

            {!showOtp ? (
              <>
                <FloatingInput label="Email Address" icon={Mail} type="email" value={email} onChange={e => setEmail(e.target.value)} required />
                <FloatingInput label="Password" icon={Lock} type="password" value={password} onChange={e => setPassword(e.target.value)} required />
              </>
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6">
                <p className="text-sm text-slate-400 mb-4 text-center">Enter the 6-digit code sent to your email.</p>
                <div className="flex justify-between gap-2">
                  {otp.map((digit, idx) => (
                    <input
                      key={idx} id={`otp-${idx}`} type="text" maxLength={1} value={digit}
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
                className="text-red-400 text-sm mb-4 font-medium"
              >
                {error}
              </motion.p>
            )}

            {isLogin && (
              <div className="flex justify-between items-center text-sm mb-6">
                <label className="flex items-center text-slate-400 gap-2 cursor-pointer hover:text-slate-300 transition-colors">
                  <input type="checkbox" className="rounded bg-vercel-dark border-vercel-border text-electric-indigo focus:ring-electric-indigo focus:ring-offset-vercel-dark" />
                  Remember me
                </label>
                <a href="#" className="text-electric-indigo hover:text-indigo-400 font-medium transition-colors">Forgot Password?</a>
              </div>
            )}

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-white text-black hover:bg-slate-200 font-semibold py-3.5 rounded-xl transition-all disabled:opacity-50 mt-2"
            >
              {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
            </button>
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
