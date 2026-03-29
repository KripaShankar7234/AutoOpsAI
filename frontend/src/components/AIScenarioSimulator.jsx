import React, { useState } from 'react';
import axios from 'axios';
import { PlayCircle, Loader2, AlertTriangle, CheckCircle2, FlaskConical } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const API_BASE = import.meta.env.PROD ? '/api' : 'http://localhost:5000/api';

export default function AIScenarioSimulator() {
  const [scenario, setScenario] = useState('');
  const [loading, setLoading] = useState(false);
  const [simulation, setSimulation] = useState(null);

  const handleSimulate = async () => {
    if (!scenario.trim()) return;
    setLoading(true);
    setSimulation(null);
    try {
      const res = await axios.post(`${API_BASE}/workflow/simulate`, { scenario });
      setSimulation(res.data);
    } catch (e) {
      console.error(e);
      setSimulation({ impacts: ["System error predicting impact"], completionProbability: 0, suggestedMitigation: "Check AI API status." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col h-full">
      <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2 mb-4">
        <FlaskConical className="text-indigo-500 w-5 h-5" /> AI Scenario Simulator
      </h2>
      
      <p className="text-sm text-slate-500 mb-4">
        Simulate project disruptions to preview downstream impact and AI mitigation strategies.
      </p>

      <div className="flex gap-2">
        <input 
          type="text" 
          placeholder='e.g., "What happens if frontend API is delayed by 3 days?"'
          value={scenario}
          onChange={(e) => setScenario(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSimulate()}
          className="flex-1 px-4 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition"
        />
        <button 
          onClick={handleSimulate}
          disabled={loading || !scenario.trim()}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center justify-center transition-colors disabled:opacity-50"
        >
          {loading ? <Loader2 size={18} className="animate-spin" /> : <PlayCircle size={18} />}
        </button>
      </div>

      <AnimatePresence>
        {simulation && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }} 
            animate={{ opacity: 1, height: 'auto' }} 
            exit={{ opacity: 0, height: 0 }}
            className="mt-6 bg-slate-50 border border-slate-200 rounded-lg p-5"
          >
            <h3 className="font-bold text-slate-700 mb-3 uppercase tracking-wide text-xs">Impact Analysis</h3>
            
            <ul className="space-y-2 mb-4">
              {(simulation.impacts || []).map((impact, idx) => (
                <li key={idx} className="flex gap-2 text-sm text-rose-600 font-medium items-start">
                  <AlertTriangle size={16} className="shrink-0 mt-0.5" /> 
                  <span>{impact}</span>
                </li>
              ))}
            </ul>

            <div className="flex items-center gap-2 mb-4">
               <div className="flex-1 bg-slate-200 h-2 rounded-full overflow-hidden">
                 <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${simulation.completionProbability || 0}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className={`h-full ${(simulation.completionProbability || 0) > 50 ? 'bg-indigo-500' : 'bg-rose-500'}`}
                 />
               </div>
               <span className="text-sm font-bold text-slate-700 w-12 text-right">{simulation.completionProbability || 0}%</span>
            </div>

            <div className="bg-emerald-50 border border-emerald-100 p-3 rounded-lg flex gap-2 items-start mt-2">
               <CheckCircle2 size={16} className="text-emerald-600 mt-0.5 shrink-0" />
               <div className="text-sm text-emerald-800">
                 <span className="font-bold block mb-1">Suggested Mitigation</span>
                 {simulation.suggestedMitigation || "No mitigation suggested."}
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
