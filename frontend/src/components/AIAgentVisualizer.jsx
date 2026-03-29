import React, { useState, useEffect } from 'react';
import { Brain, UserPlus, Activity, Target, Zap, ArrowRight, Play } from 'lucide-react';
import { motion } from 'framer-motion';

const agents = [
  { id: 'meeting', name: 'Intelligence Agent', icon: <Brain size={20} />, status: 'Analyzing transcript...', bg: 'bg-indigo-100 text-indigo-700' },
  { id: 'task', name: 'Task Agent', icon: <UserPlus size={20} />, status: 'Generating schema...', bg: 'bg-blue-100 text-blue-700' },
  { id: 'monitor', name: 'Monitoring Agent', icon: <Activity size={20} />, status: 'Checking deadlines...', bg: 'bg-emerald-100 text-emerald-700' },
  { id: 'risk', name: 'Risk Predictor', icon: <Target size={20} />, status: 'Calculating probability...', bg: 'bg-amber-100 text-amber-700' },
  { id: 'execution', name: 'Execution Agent', icon: <Zap size={20} />, status: 'Generating mitigations...', bg: 'bg-rose-100 text-rose-700' }
];

export default function AIAgentVisualizer({ triggerRef }) {
  const [activeStep, setActiveStep] = useState(null);

  const simulateProcessing = () => {
    setActiveStep(0);
  };

  useEffect(() => {
    if (activeStep === null) return;
    if (activeStep >= agents.length) {
      setTimeout(() => setActiveStep(null), 3000); 
      return;
    }
    const timer = setTimeout(() => {
      setActiveStep(prev => prev + 1);
    }, 1200);
    return () => clearTimeout(timer);
  }, [activeStep]);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
          <Brain className="text-brand-500 w-5 h-5" /> AI Agent Brain Collaboration
        </h2>
        <button onClick={simulateProcessing} disabled={activeStep !== null} className="text-sm bg-slate-100 hover:bg-slate-200 text-slate-600 px-3 py-1 flex items-center gap-2 rounded-md transition-colors disabled:opacity-50">
           <Play size={14} /> Simulate Flow
        </button>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between w-full h-auto md:h-24 gap-4 md:gap-0">
        {agents.map((agent, index) => {
          const isActive = activeStep === index;
          const isPast = activeStep !== null && index < activeStep;
          
          return (
            <React.Fragment key={agent.id}>
              <div className="flex-1 relative flex flex-col items-center">
                <motion.div 
                  className={`w-14 h-14 rounded-full flex items-center justify-center border-4 z-10 ${isActive ? agent.bg + ' border-current shadow-lg' : isPast ? 'bg-slate-100 border-slate-200 text-slate-400' : 'bg-white border-slate-100 text-slate-300'}`}
                  animate={{ 
                    scale: isActive ? [1, 1.2, 1] : 1, 
                    boxShadow: isActive ? ['0px 0px 0px rgba(0,0,0,0)', '0px 0px 20px rgba(99,102,241,0.5)', '0px 0px 0px rgba(0,0,0,0)'] : 'none'
                  }}
                  transition={{ duration: 1, repeat: isActive ? Infinity : 0 }}
                >
                  {agent.icon}
                </motion.div>
                
                <div className="mt-3 text-center h-10 w-32 hidden md:block">
                  <p className={`font-bold text-xs uppercase ${isActive || isPast ? 'text-slate-700' : 'text-slate-400'}`}>{agent.name}</p>
                  {isActive && (
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[10px] text-slate-500 font-medium whitespace-nowrap overflow-hidden">
                      {agent.status}
                    </motion.p>
                  )}
                </div>
              </div>
              
              {index < agents.length - 1 && (
                <div className="hidden md:flex flex-1 items-center justify-center -mx-4 z-0">
                  <div className="w-full h-1 bg-slate-100 rounded-full relative overflow-hidden">
                     {activeStep !== null && activeStep >= index && (
                        <motion.div 
                          className={`absolute top-0 left-0 bottom-0 ${agents[index].bg.split(' ')[0]}`}
                          initial={{ width: '0%' }}
                          animate={{ width: activeStep > index ? '100%' : '50%' }}
                          transition={{ duration: 1 }}
                        />
                     )}
                  </div>
                  <ArrowRight size={16} className={`ml-1 shrink-0 ${activeStep !== null && activeStep > index ? agents[index].bg.split(' ')[1] : 'text-slate-200'}`} />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
