import React from 'react';
import { Sparkles, Brain, Clock } from 'lucide-react';
import { motion } from 'framer-motion';


export default function AIInsights({ logs }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 overflow-hidden flex flex-col h-[400px]">
      <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
        <Clock className="text-brand-500 w-5 h-5" /> Autonomous Workflow Replay
      </h2>
      
      {logs.length === 0 ? (
        <div className="text-center p-4 text-slate-400">
          No AI actions logged yet.
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto pr-2 relative">
          {/* Vertical timeline line */}
          <div className="absolute left-4 top-4 bottom-0 w-0.5 bg-slate-200" />
          
          <div className="space-y-6 relative">
            {logs.map((log, idx) => (
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                key={log._id} 
                className="flex gap-4 items-start relative z-10"
              >
                <div className={`mt-1 bg-white p-1 rounded-full border-2 ${log.agent === 'Execution Agent' ? 'border-amber-400 text-amber-500 shadow-[0_0_10px_rgba(251,191,36,0.5)]' : 'border-indigo-400 text-indigo-500'}`}>
                  <Sparkles size={14} />
                </div>
                <div className="bg-slate-50 flex-1 rounded-lg p-3 border border-slate-100 shadow-sm hover:shadow-md transition">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold tracking-wide uppercase text-slate-700 bg-white px-2 py-0.5 rounded shadow-sm border border-slate-200">
                      {log.agent}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-sm text-slate-800 mt-1 font-bold">{log.action}</p>
                  <p className="text-xs text-slate-500 mt-1.5 leading-relaxed bg-white p-2 rounded border border-slate-100 italic">
                    {log.reason}
                  </p>
                  <div className="mt-2 text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-bold inline-block">
                    {Math.round(log.confidence * 100)}% Confidence Match
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
