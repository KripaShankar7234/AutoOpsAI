import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MeetingUpload from './MeetingUpload';
import TaskBoard from './TaskBoard';
import WorkflowHealth from './WorkflowHealth';
import AIInsights from './AIInsights';
import ManagerChat from './ManagerChat';
import AIProductivityAnalytics from './AIProductivityAnalytics';
import SmartDependencyGraph from './SmartDependencyGraph';
import AIAgentVisualizer from './AIAgentVisualizer';
import AIScenarioSimulator from './AIScenarioSimulator';
import { LayoutDashboard, CheckCircle2, TrendingUp, AlertTriangle } from 'lucide-react';


const API_BASE = 'http://localhost:5000/api';

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [workflowHealth, setWorkflowHealth] = useState(null);
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [tasksRes, healthRes, auditRes] = await Promise.all([
        axios.get(`${API_BASE}/tasks`),
        axios.get(`${API_BASE}/workflow/health`),
        axios.get(`${API_BASE}/workflow/audit`)
      ]);
      setTasks(tasksRes.data);
      setWorkflowHealth(healthRes.data);
      setAuditLogs(auditRes.data);
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleMeetingProcessed = () => {
    fetchData();
  };

  if (loading && !tasks.length) return <div className="flex h-64 items-center justify-center font-bold text-slate-500">Initializing AutoOps Enterprise AI...</div>;

  return (
    <div className="space-y-6">
      
      {/* Top Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-brand-50 rounded-lg text-brand-600"><LayoutDashboard size={24} /></div>
          <div>
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide">Total Tasks</p>
            <p className="text-2xl font-black text-slate-800">{workflowHealth?.totalActive || tasks.length}</p>
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-rose-50 rounded-lg text-rose-600"><AlertTriangle size={24} /></div>
          <div>
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide">Overdue Delay</p>
            <p className="text-2xl font-black text-slate-800">{workflowHealth?.overdue || 0}</p>
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-indigo-50 rounded-lg text-indigo-600"><CheckCircle2 size={24} /></div>
          <div>
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide">Completion Rate</p>
            <p className="text-2xl font-black text-slate-800">{workflowHealth?.healthScore || 0}%</p>
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 rounded-lg text-emerald-600"><TrendingUp size={24} /></div>
          <div>
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide">Project Health</p>
            <p className="text-2xl font-black text-slate-800 text-emerald-600">Healthy</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <AIAgentVisualizer />
          <MeetingUpload onProcessed={handleMeetingProcessed} />
          <TaskBoard tasks={tasks} onTaskUpdated={fetchData} />
          <SmartDependencyGraph tasks={tasks} />
          <AIProductivityAnalytics refreshToggle={tasks.length} />
        </div>
        <div className="space-y-6">
          <ManagerChat />
          <AIInsights logs={auditLogs} />
          <AIScenarioSimulator />
          <WorkflowHealth health={workflowHealth} />
        </div>
      </div>
    </div>
  );
}
