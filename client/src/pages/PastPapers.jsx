import React from 'react';

const PastPapers = () => {
  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Past Papers & MCQs</h1>
        <p className="text-slate-500 mt-2">Test your knowledge before teaching the AI.</p>
      </header>
      
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center py-20">
        <div className="text-6xl mb-4">📝</div>
        <h2 className="text-2xl font-bold text-slate-700 mb-2">Previous Year Questions (PYQ) Database</h2>
        <p className="text-slate-500 max-w-md">
          This feature is currently being populated with 10 years of JEE Main, JEE Advanced, and NEET question papers.
        </p>
        <button className="mt-6 px-6 py-3 bg-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-300 transition-colors">
          Notify me when ready
        </button>
      </div>
    </div>
  );
};

export default PastPapers;
