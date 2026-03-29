import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Activity, AlertTriangle, ShieldCheck, Zap } from 'lucide-react';


ChartJS.register(ArcElement, Tooltip, Legend);

export default function WorkflowHealth({ health }) {
  if (!health) return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 opacity-50">
      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2"><Activity /> Workflow Health</h2>
      <p>Loading...</p>
    </div>
  );

  const completed = health.totalActive === 0 ? 1 : health.totalActive - health.overdue;
  const overdue = health.totalActive === 0 ? 0 : health.overdue;

  const data = {
    labels: ['On Track', 'Delayed/Overdue'],
    datasets: [{
      data: [completed, overdue],
      backgroundColor: ['#10b981', '#f43f5e'],
      borderWidth: 0,
      cutout: '75%',
    }]
  };

  const options = {
    plugins: {
      legend: { display: false }
    },
    maintainAspectRatio: false
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <h2 className="text-lg font-semibold text-slate-800 mb-6 flex items-center gap-2">
        <Activity className="text-brand-500" /> Workflow Health
      </h2>
      
      <div className="flex flex-col items-center">
        <div className="relative w-48 h-48 mb-4">
          <Doughnut data={data} options={options} />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-3xl font-bold text-slate-800">{health.healthScore}%</span>
            <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">Health</span>
          </div>
        </div>
        
        <div className="flex w-full justify-between mt-4 px-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-slate-800">{health.totalActive}</p>
            <p className="text-xs text-slate-500 uppercase tracking-wide">Active Tasks</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-rose-500">{health.overdue}</p>
            <p className="text-xs text-slate-500 uppercase tracking-wide">Bottlenecks</p>
          </div>
        </div>
      </div>

      {health.riskAnalysis && (
        <div className="mt-8 border-t border-slate-200 pt-6">
          <h3 className="text-md font-semibold text-slate-800 mb-4 flex items-center gap-2">
             <AlertTriangle className="w-4 h-4 text-amber-500" /> AI Risk Predictor
          </h3>
          <div className="space-y-3">
             <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Completion Probability</span>
                <span className={`text-sm font-bold ${health.riskAnalysis.completionProbability > 70 ? 'text-green-600' : 'text-amber-600'}`}>{health.riskAnalysis.completionProbability}%</span>
             </div>
             
             <div className="bg-slate-50 rounded-md p-3">
               <p className="text-xs text-slate-500 uppercase font-semibold mb-1 flex items-center gap-1"><AlertTriangle className="w-3 h-3"/> Risk Detected</p>
               <p className="text-sm text-slate-800">{health.riskAnalysis.riskDetected}</p>
             </div>

             <div className="bg-brand-50 rounded-md p-3">
               <p className="text-xs text-brand-600 uppercase font-semibold mb-1 flex items-center gap-1"><Zap className="w-3 h-3"/> Suggested Action</p>
               <p className="text-sm text-brand-900">{health.riskAnalysis.suggestedAction}</p>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}
