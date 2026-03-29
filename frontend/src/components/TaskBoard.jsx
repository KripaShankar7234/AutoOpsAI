import React from 'react';
import { CheckCircle2, Circle, Clock, AlertTriangle, Sparkles, Loader2 } from 'lucide-react';

import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

export default function TaskBoard({ tasks, onTaskUpdated }) {
  const [sortedTasks, setSortedTasks] = React.useState(null);
  const [isPrioritizing, setIsPrioritizing] = React.useState(false);

  const handlePrioritize = async () => {
    setIsPrioritizing(true);
    try {
      const res = await axios.get(`${API_BASE}/tasks/prioritized`);
      setSortedTasks(res.data);
    } catch(e) {
      console.error(e);
    } finally {
      setIsPrioritizing(false);
    }
  };

  React.useEffect(() => {
    // Reset prioritized sorting if main tasks prop updates in a meaningfully changing way. 
    // For a hackathon, we can leave it sticky or just clear it. 
    setSortedTasks(null);
  }, [tasks.length]); // A gross simplifiction

  const handleUpdateStatus = async (id, status) => {
    try {
      await axios.put(`${API_BASE}/tasks/update/${id}`, { status });
      onTaskUpdated();
    } catch (err) {
      console.error(err);
    }
  };

  const getStatusIcon = (status) => {
    if (status === 'Completed') return <CheckCircle2 size={18} className="text-emerald-500" />;
    if (status === 'Overdue') return <AlertTriangle size={18} className="text-rose-500 animate-pulse" />;
    if (status === 'In Progress') return <Clock size={18} className="text-amber-500" />;
    return <Circle size={18} className="text-slate-400" />;
  };

  const displayTasks = sortedTasks || tasks;

  return (
    <div className="bg-white rounded-2xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-slate-200/60 p-6 overflow-hidden transition-all">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
          <CheckCircle2 className="text-indigo-500 w-5 h-5" /> Active Tasks
        </h2>
        <button 
          onClick={handlePrioritize}
          disabled={isPrioritizing || tasks.length === 0}
          className="flex items-center gap-2 text-sm bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-medium py-1.5 px-3 rounded-lg transition-colors disabled:opacity-50"
        >
          {isPrioritizing ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />} 
          AI Prioritize
        </button>
      </div>
      
      {displayTasks.length === 0 ? (

        <div className="text-center p-8 text-slate-400 border-2 border-dashed border-slate-200 rounded-lg">
          No tasks available yet. Upload a meeting to generate tasks.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-slate-100 text-slate-500 text-sm">
                <th className="py-3 px-4 w-1/3">Task</th>
                <th className="py-3 px-4">Owner</th>
                <th className="py-3 px-4 hidden md:table-cell">Team</th>
                <th className="py-3 px-4 hidden sm:table-cell">Deadline</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {displayTasks.map((task) => (
                <tr key={task._id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 font-medium text-slate-700">{task.title}</td>
                  <td className="py-3 px-4 text-slate-600">
                    <span className="bg-slate-200 text-slate-700 px-2 py-1 rounded-full text-xs font-semibold">
                      {task.owner}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-600 hidden md:table-cell text-sm">
                    {task.team || 'General'}
                  </td>
                  <td className="py-3 px-4 text-slate-500 text-sm hidden sm:table-cell">{task.deadline}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                      {getStatusIcon(task.status)}
                      <span className="hidden lg:inline">{task.status}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    {task.priority === 'High' && <span className="bg-rose-100 text-rose-700 px-2 py-1 rounded text-xs font-bold ring-1 ring-inset ring-rose-200 uppercase tracking-widest leading-none">High</span>}
                    {task.priority === 'Medium' && <span className="bg-amber-100 text-amber-700 px-2 py-1 rounded text-xs font-bold ring-1 ring-inset ring-amber-200 uppercase tracking-widest leading-none">Med</span>}
                    {(task.priority === 'Low' || !task.priority) && <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-bold ring-1 ring-inset ring-blue-200 uppercase tracking-widest leading-none">Low</span>}
                  </td>
                  <td className="py-3 px-4 text-right">
                    {task.status !== 'Completed' && (
                      <button 
                        onClick={() => handleUpdateStatus(task._id, 'Completed')}
                        className="text-[11px] uppercase tracking-wider bg-emerald-50 hover:bg-emerald-500 text-emerald-600 hover:text-white border border-emerald-200 hover:border-emerald-500 py-1.5 px-3 rounded-full transition-all font-bold shadow-sm"
                      >
                        Mark Done
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
