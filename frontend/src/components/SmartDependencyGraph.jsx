import React from 'react';
import { GitMerge, ArrowRight, Circle, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function SmartDependencyGraph({ tasks }) {
  // Find tasks that have dependencies
  const tasksWithDeps = tasks.filter(t => t.dependencies && t.dependencies.length > 0);

  if (tasksWithDeps.length === 0) {
    return null; // Skip rendering if no dependencies
  }

  const getStatusIcon = (status) => {
    if (status === 'Completed') return <CheckCircle2 size={16} className="text-emerald-500" />;
    if (status === 'Overdue') return <AlertTriangle size={16} className="text-rose-500" />;
    return <Circle size={16} className="text-slate-400" />;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2 mb-6">
        <GitMerge className="text-brand-500 w-5 h-5" /> Smart Dependency Graph
      </h2>

      <div className="space-y-6">
        {tasksWithDeps.map(task => (
           <div key={task._id} className="bg-slate-50 p-4 rounded-lg border border-slate-100 flex flex-col md:flex-row items-start md:items-center gap-4 relative overflow-hidden">
             
             {/* Render dependencies first (upstream blockers) */}
             <div className="flex flex-col gap-2 relative z-10 w-full md:w-auto">
               <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-2">Blockers</span>
               {task.dependencies.map(dep => (
                 <div key={dep._id} className="bg-white border shadow-sm px-3 py-2 rounded-md flex items-center gap-2 min-w-[200px]">
                    {getStatusIcon(dep.status)}
                    <span className="text-sm font-medium text-slate-700 truncate">{dep.title}</span>
                 </div>
               ))}
             </div>

             {/* Connection line / arrow */}
             <div className="flex justify-center w-full md:w-16 text-slate-300 relative z-10 rotate-90 md:rotate-0 my-2 md:my-0">
               <ArrowRight size={24} />
             </div>

             {/* Dependent task */}
             <div className="flex flex-col gap-2 relative z-10 w-full md:w-auto">
               <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-2">Downstream Task</span>
               <div className={`border shadow-sm px-3 py-2 rounded-md flex items-center gap-2 min-w-[200px] bg-white ${task.status === 'Overdue' ? 'border-rose-300 ring-2 ring-rose-100' : ''}`}>
                  {getStatusIcon(task.status)}
                  <span className="text-sm font-bold text-slate-800 truncate">{task.title}</span>
               </div>
             </div>

           </div>
        ))}
      </div>
    </div>
  );
}
