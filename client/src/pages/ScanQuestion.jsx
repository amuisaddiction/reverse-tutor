import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, UploadCloud, X, Zap, ArrowRight, Brain } from 'lucide-react';

const ScanQuestion = () => {
  const [image, setImage] = useState(null);
  const [base64Data, setBase64Data] = useState(null);
  const [mimeType, setMimeType] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [solution, setSolution] = useState(null);
  const [error, setError] = useState('');

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer?.files[0] || e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      setImage(url);
      setMimeType(file.type);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        const b64 = reader.result.split(',')[1];
        setBase64Data(b64);
      };
      reader.readAsDataURL(file);
    }
  };

  const scanImage = async () => {
    if (!base64Data) return;
    setIsScanning(true);
    setError('');
    
    try {
      const res = await fetch('https://reverse-tutor.onrender.com/api/doubt/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: base64Data, mimeType })
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to scan image');
      setSolution(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsScanning(false);
    }
  };

  const reset = () => {
    setImage(null);
    setBase64Data(null);
    setSolution(null);
    setError('');
  };

  return (
    <div className="min-h-screen bg-vercel-dark p-8 text-slate-300 font-sans">
      <div className="max-w-5xl mx-auto">
        <header className="mb-10 flex justify-between items-end border-b border-vercel-border pb-6">
          <div>
            <h1 className="text-3xl font-semibold text-white tracking-tight flex items-center gap-3">
              <Camera className="text-electric-indigo" /> AI Doubt Solver
            </h1>
            <p className="text-slate-400 text-sm mt-1">Upload handwritten or printed questions for instant step-by-step solutions.</p>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Left Column - Upload Area */}
          <div className="flex flex-col gap-4">
            {!image ? (
              <label 
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                className="border-2 border-dashed border-vercel-border hover:border-electric-indigo bg-vercel-card rounded-2xl h-[400px] flex flex-col items-center justify-center cursor-pointer transition-all group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-electric-indigo/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <UploadCloud size={48} className="text-slate-500 group-hover:text-electric-indigo mb-4 transition-colors" />
                <p className="text-white font-medium mb-1">Drag & drop your doubt here</p>
                <p className="text-sm text-slate-500">Supports JPG, PNG (Max 5MB)</p>
                <input type="file" className="hidden" accept="image/*" onChange={handleDrop} />
              </label>
            ) : (
              <div className="relative border border-vercel-border rounded-2xl overflow-hidden h-[400px] bg-black flex items-center justify-center">
                <img src={image} alt="Uploaded doubt" className="max-h-full max-w-full object-contain" />
                {!isScanning && !solution && (
                  <button 
                    onClick={reset}
                    className="absolute top-4 right-4 bg-black/50 hover:bg-black text-white p-2 rounded-full backdrop-blur transition-all"
                  >
                    <X size={20} />
                  </button>
                )}
                
                {isScanning && (
                  <div className="absolute inset-0 bg-vercel-dark/80 backdrop-blur-sm flex flex-col items-center justify-center">
                    <motion.div 
                      animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <Brain size={48} className="text-electric-indigo mb-6" />
                    </motion.div>
                    <p className="text-white font-medium text-lg">Extracting math context...</p>
                    <p className="text-slate-400 text-sm mt-2">Powered by Gemini 1.5 Pro</p>
                  </div>
                )}
              </div>
            )}

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-sm font-medium mb-4">
                {error}
              </div>
            )}

            {image && !solution && !isScanning && (
              <button 
                onClick={scanImage}
                className="w-full bg-electric-indigo hover:bg-indigo-500 text-white font-bold py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(99,102,241,0.2)] flex items-center justify-center gap-2"
              >
                <Zap size={20} /> Generate AI Solution
              </button>
            )}
            
            {solution && (
              <button 
                onClick={reset}
                className="w-full bg-vercel-card hover:bg-vercel-border/50 border border-vercel-border text-white font-medium py-4 rounded-xl transition-all"
              >
                Scan Another Question
              </button>
            )}
          </div>

          {/* Right Column - Solution Area */}
          <div>
            <AnimatePresence mode="wait">
              {!solution ? (
                <motion.div 
                  key="empty"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="h-full border border-vercel-border border-dashed rounded-2xl flex flex-col items-center justify-center text-slate-500 p-8 text-center"
                >
                  <Brain size={48} className="mb-4 opacity-50" />
                  <p>Your step-by-step solution will appear here.</p>
                </motion.div>
              ) : (
                <motion.div 
                  key="solution"
                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                  className="h-full border border-vercel-border bg-vercel-card rounded-2xl p-8 flex flex-col"
                >
                  <div className="inline-flex items-center gap-2 bg-electric-indigo/10 border border-electric-indigo/30 text-electric-indigo px-3 py-1 rounded-md text-sm font-medium w-fit mb-8">
                    <Target size={16} /> {solution.identifiedTopic}
                  </div>
                  
                  <h3 className="text-lg font-bold text-white mb-4">Step-by-Step Breakdown</h3>
                  <div className="space-y-4 mb-8 flex-1">
                    {solution.steps.map((step, i) => (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.15 }}
                        key={i} 
                        className="bg-vercel-dark p-4 rounded-lg border border-vercel-border text-slate-300 leading-relaxed"
                      >
                        {step}
                      </motion.div>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-6 border-t border-vercel-border">
                    <div>
                      <h4 className="text-xs uppercase font-bold tracking-wider text-slate-500 mb-2">Final Answer</h4>
                      <p className="text-xl font-black text-emerald-400">{solution.finalAnswer}</p>
                    </div>
                    <div>
                      <h4 className="text-xs uppercase font-bold tracking-wider text-slate-500 mb-2">Formulas Applied</h4>
                      <ul className="text-sm text-slate-400 font-mono space-y-1">
                        {solution.formulasUsed.map((f, i) => <li key={i}>• {f}</li>)}
                      </ul>
                    </div>
                  </div>
                  
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScanQuestion;

