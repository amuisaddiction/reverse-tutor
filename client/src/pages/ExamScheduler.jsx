import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus, Clock, Bell, X, Target } from 'lucide-react';

const ExamScheduler = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([
    { id: 1, date: new Date().setHours(0,0,0,0), title: 'Full Syllabus Mock Test (JEE)', type: 'mock' },
    { id: 2, date: new Date(new Date().getTime() + 86400000 * 2).setHours(0,0,0,0), title: 'Revise Kinematics', type: 'revision' }
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  
  // Form state
  const [eventTitle, setEventTitle] = useState('');
  const [eventType, setEventType] = useState('mock');

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  const handleDayClick = (day) => {
    const clickedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day).setHours(0,0,0,0);
    setSelectedDate(clickedDate);
    setIsModalOpen(true);
  };

  const handleAddEvent = (e) => {
    e.preventDefault();
    if (!eventTitle.trim()) return;
    
    setEvents([...events, {
      id: Date.now(),
      date: selectedDate,
      title: eventTitle,
      type: eventType
    }]);
    
    setIsModalOpen(false);
    setEventTitle('');
    setEventType('mock');
  };

  const renderCalendar = () => {
    const days = [];
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    // Weekday headers
    weekDays.forEach(day => {
      days.push(
        <div key={`header-${day}`} className="text-center font-mono text-xs uppercase tracking-widest text-slate-500 py-4 border-b border-vercel-border">
          {day}
        </div>
      );
    });

    // Empty slots before first day
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="min-h-[120px] p-2 border-b border-r border-vercel-border/50 bg-vercel-dark/30"></div>);
    }

    // Days of month
    for (let d = 1; d <= daysInMonth; d++) {
      const dayDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), d).setHours(0,0,0,0);
      const isToday = dayDate === new Date().setHours(0,0,0,0);
      const dayEvents = events.filter(e => e.date === dayDate);

      days.push(
        <div 
          key={d} 
          onClick={() => handleDayClick(d)}
          className={`min-h-[120px] p-3 border-b border-r border-vercel-border/50 hover:bg-vercel-border/30 cursor-pointer transition-colors relative group ${isToday ? 'bg-electric-indigo/5' : ''}`}
        >
          <div className="flex justify-between items-start mb-2">
            <span className={`text-sm font-medium w-8 h-8 flex items-center justify-center rounded-full ${isToday ? 'bg-electric-indigo text-white shadow-[0_0_15px_rgba(99,102,241,0.5)]' : 'text-slate-400 group-hover:text-white transition-colors'}`}>
              {d}
            </span>
            <Plus size={16} className="text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          
          <div className="space-y-1.5">
            {dayEvents.map(event => (
              <div 
                key={event.id} 
                className={`text-xs px-2 py-1.5 rounded-md truncate font-medium border ${
                  event.type === 'mock' 
                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                    : 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400'
                }`}
              >
                {event.title}
              </div>
            ))}
          </div>
        </div>
      );
    }

    return days;
  };

  return (
    <div className="min-h-screen bg-vercel-dark p-8 text-slate-300 font-sans">
      <div className="max-w-6xl mx-auto">
        
        <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end border-b border-vercel-border pb-6 gap-4">
          <div>
            <h1 className="text-3xl font-semibold text-white tracking-tight flex items-center gap-3">
              <CalendarIcon className="text-electric-indigo" /> Exam Scheduler
            </h1>
            <p className="text-slate-400 text-sm mt-1">Plan your mock tests and get automated email reminders.</p>
          </div>
          <div className="flex items-center gap-4 bg-vercel-card border border-vercel-border p-1.5 rounded-lg">
            <button onClick={prevMonth} className="p-2 hover:bg-vercel-border/50 rounded-md transition-colors"><ChevronLeft size={20} /></button>
            <span className="w-40 text-center font-medium text-white tracking-wide">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </span>
            <button onClick={nextMonth} className="p-2 hover:bg-vercel-border/50 rounded-md transition-colors"><ChevronRight size={20} /></button>
          </div>
        </header>

        <div className="bg-vercel-card border border-vercel-border rounded-2xl overflow-hidden shadow-2xl">
          <div className="grid grid-cols-7 bg-vercel-dark/50">
            {renderCalendar()}
          </div>
        </div>

      </div>

      {/* Add Event Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-vercel-card border border-vercel-border p-8 rounded-2xl w-full max-w-md shadow-2xl relative"
            >
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-6 right-6 text-slate-500 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
              
              <h2 className="text-2xl font-bold text-white mb-2">Schedule Activity</h2>
              <p className="text-sm text-slate-400 mb-6 flex items-center gap-2">
                <Clock size={14} /> For {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </p>

              <form onSubmit={handleAddEvent} className="space-y-6">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-widest text-slate-500 mb-2">Activity Name</label>
                  <input 
                    type="text" 
                    value={eventTitle}
                    onChange={(e) => setEventTitle(e.target.value)}
                    placeholder="e.g. NTA Mock Test 4"
                    autoFocus
                    className="w-full bg-vercel-dark border border-vercel-border text-white rounded-lg px-4 py-3 focus:outline-none focus:border-electric-indigo focus:ring-1 focus:ring-electric-indigo transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-widest text-slate-500 mb-2">Type</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button 
                      type="button"
                      onClick={() => setEventType('mock')}
                      className={`py-3 rounded-lg flex items-center justify-center gap-2 font-medium transition-all border ${
                        eventType === 'mock' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-vercel-dark border-vercel-border text-slate-400 hover:text-slate-300'
                      }`}
                    >
                      <Target size={16} /> Mock Test
                    </button>
                    <button 
                      type="button"
                      onClick={() => setEventType('revision')}
                      className={`py-3 rounded-lg flex items-center justify-center gap-2 font-medium transition-all border ${
                        eventType === 'revision' ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400' : 'bg-vercel-dark border-vercel-border text-slate-400 hover:text-slate-300'
                      }`}
                    >
                      <BookOpen size={16} /> Revision
                    </button>
                  </div>
                </div>

                <div className="bg-electric-indigo/5 border border-electric-indigo/20 p-4 rounded-lg flex items-start gap-3">
                  <Bell size={18} className="text-electric-indigo shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-electric-indigo mb-1">Email Reminder</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">You will receive an automated email 24 hours before this activity is scheduled to start.</p>
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={!eventTitle.trim()}
                  className="w-full bg-white text-black font-bold py-3.5 rounded-xl transition-all disabled:opacity-50 hover:bg-slate-200 shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                >
                  Confirm Schedule
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default ExamScheduler;
