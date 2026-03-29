import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, MessageSquare, Clock, FlaskConical, BarChart3, Settings } from 'lucide-react';

export default function Sidebar() {
  const location = useLocation();
  const currentPath = location.pathname;

  const NavLink = ({ to, icon, label }) => {
    const isActive = currentPath === to;
    return (
      <Link 
        to={to} 
        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
          isActive 
            ? 'bg-indigo-50 text-indigo-700 shadow-sm border border-indigo-100/50' 
            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-transparent'
        }`}
      >
        <div className={isActive ? 'text-indigo-600' : 'text-slate-400'}>{icon}</div>
        {label}
      </Link>
    );
  };

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 bg-slate-50 border-r border-slate-200 flex flex-col z-50">
      
      {/* Brand Header */}
      <div className="h-16 flex items-center px-6 border-b border-slate-200/60 mb-6">
        <Link to="/" className="flex items-center gap-3 group w-full">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center text-white font-bold text-lg shadow-md group-hover:scale-105 transition-transform">
            A
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-800 leading-tight">AutoOps AI</h1>
            <div className="text-[9px] text-slate-500 font-bold uppercase tracking-[0.2em] mt-0.5">Enterprise</div>
          </div>
        </Link>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 px-4 space-y-1">
        <div className="px-2 pb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">Workspace</div>
        <NavLink to="/" icon={<Home size={18} />} label="Overview" />
        <NavLink to="/manager" icon={<MessageSquare size={18} />} label="AI Manager" />
        <NavLink to="/replay" icon={<Clock size={18} />} label="Workflow Replay" />
        <NavLink to="/simulator" icon={<FlaskConical size={18} />} label="Simulator" />
        <NavLink to="/analytics" icon={<BarChart3 size={18} />} label="Analytics" />
      </div>

      {/* User Profile Footer */}
      <div className="p-4 border-t border-slate-200/60 mt-auto">
        <div className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer border border-transparent hover:border-slate-200">
          <div className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white shadow-sm flex items-center justify-center">
            <span className="text-xs font-bold text-slate-600">PM</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-800 truncate">Project Manager</p>
            <p className="text-xs text-slate-500 truncate">user@autoops.ai</p>
          </div>
          <Settings size={16} className="text-slate-400" />
        </div>
      </div>
    </aside>
  );
}
