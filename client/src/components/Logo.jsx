import React from 'react';

const Logo = ({ className = "w-8 h-8", color = "currentColor" }) => (
  <svg 
    viewBox="0 0 100 100" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Outer refresh/loop arrow representing 'Reverse' */}
    <path 
      d="M50 10C27.9086 10 10 27.9086 10 50C10 72.0914 27.9086 90 50 90C67.653 90 82.6393 78.5367 88.0822 62.5" 
      stroke="url(#brandGradient)" 
      strokeWidth="8" 
      strokeLinecap="round" 
    />
    <path 
      d="M88 62L88 82" 
      stroke="url(#brandGradient)" 
      strokeWidth="8" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
    />
    <path 
      d="M88 62L68 62" 
      stroke="url(#brandGradient)" 
      strokeWidth="8" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
    />
    
    {/* Inner 'R' representing 'Tutor' */}
    <path 
      d="M35 30H55C63.2843 30 70 36.7157 70 45C70 53.2843 63.2843 60 55 60H35V30Z" 
      stroke={color} 
      strokeWidth="8" 
      strokeLinejoin="round"
    />
    <path 
      d="M35 60L55 80" 
      stroke={color} 
      strokeWidth="8" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
    />
    
    <defs>
      <linearGradient id="brandGradient" x1="10" y1="50" x2="90" y2="50" gradientUnits="userSpaceOnUse">
        <stop stopColor="#6366F1" /> {/* Indigo */}
        <stop offset="1" stopColor="#10B981" /> {/* Emerald */}
      </linearGradient>
    </defs>
  </svg>
);

export default Logo;

