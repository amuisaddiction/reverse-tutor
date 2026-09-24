import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './styles/index.css';
import { GoogleOAuthProvider } from '@react-oauth/google';

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then(registration => {
      console.log('SW registered: ', registration);
      
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            // New update available
            const toast = document.createElement('div');
            toast.className = 'fixed bottom-4 right-4 bg-electric-indigo text-white px-6 py-3 rounded-lg shadow-2xl flex items-center gap-4 z-[9999] animate-fade-in';
            toast.innerHTML = `
              <span class="font-medium">New update available!</span>
              <button onclick="window.location.reload()" class="bg-white/20 hover:bg-white/30 px-3 py-1 rounded text-sm transition-colors">Refresh</button>
            `;
            document.body.appendChild(toast);
          }
        });
      });
    }).catch(registrationError => {
      console.log('SW registration failed: ', registrationError);
    });
  });
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || 'mock_client_id_to_prevent_crash'}>
      <App />
    </GoogleOAuthProvider>
  </React.StrictMode>,
)
