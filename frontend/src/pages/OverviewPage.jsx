import React from 'react';
import { useDashboardData } from '../hooks/useDashboardData';
import MeetingUpload from '../components/MeetingUpload';
import TaskBoard from '../components/TaskBoard';
import SmartDependencyGraph from '../components/SmartDependencyGraph';
import AIAgentVisualizer from '../components/AIAgentVisualizer';
import { LayoutDashboard, CheckCircle2, TrendingUp, AlertTriangle } from 'lucide-react';

export default function OverviewPage() {
  const { tasks, workflowHealth, loading, fetchData } = useDashboardData();

  if (loading && !tasks.length) return <div className="flex h-64 items-center justify-center font-bold text-indigo-500 animate-pulse">Initializing AutoOps Enterprise AI...</div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Top Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] hover:shadow-lg transition-all flex items-center gap-5">
          <div className="p-3.5 bg-indigo-50/80 rounded-xl text-indigo-600 ring-4 ring-indigo-50/50"><LayoutDashboard size={22} /></div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.1em]">Total Tasks</p>
            <p className="text-3xl font-bold text-slate-800 tracking-tight">{workflowHealth?.totalActive || tasks.length}</p>
          </div>
        </div>
        <div className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] hover:shadow-lg transition-all flex items-center gap-5">
          <div className="p-3.5 bg-rose-50/80 rounded-xl text-rose-500 ring-4 ring-rose-50/50"><AlertTriangle size={22} /></div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.1em]">Overdue</p>
            <p className="text-3xl font-bold text-slate-800 tracking-tight">{workflowHealth?.overdue || 0}</p>
          </div>
        </div>
        <div className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] hover:shadow-lg transition-all flex items-center gap-5">
          <div className="p-3.5 bg-blue-50/80 rounded-xl text-blue-500 ring-4 ring-blue-50/50"><CheckCircle2 size={22} /></div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.1em]">Completion</p>
            <p className="text-3xl font-bold text-slate-800 tracking-tight">{workflowHealth?.healthScore || 0}%</p>
          </div>
        </div>
        <div className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] hover:shadow-lg transition-all flex items-center gap-5">
          <div className="p-3.5 bg-emerald-50/80 rounded-xl text-emerald-500 ring-4 ring-emerald-50/50"><TrendingUp size={22} /></div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.1em]">Health</p>
            <p className="text-3xl font-bold text-emerald-600 tracking-tight">Stable</p>
          </div>
        </div>
      </div>

      <AIAgentVisualizer />
      
      <div className="grid grid-cols-1 gap-6">
        <MeetingUpload onProcessed={fetchData} />
        <TaskBoard tasks={tasks} onTaskUpdated={fetchData} />
        <SmartDependencyGraph tasks={tasks} />
      </div>
    </div>
  );
}
