import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, MessageSquare, Clock, FlaskConical, BarChart3, Settings } from 'lucide-react';

export default function Navbar() {
  const location = useLocation();
  const currentPath = location.pathname;

  const NavLink = ({ to, icon, label }) => {
    const isActive = currentPath === to;
    return (
      <Link 
        to={to} 
        className={`flex items-center gap-2 text-sm font-semibold transition-all duration-200 border-b-2 pb-1.5 ${
          isActive 
            ? 'text-indigo-600 border-indigo-600' 
            : 'text-slate-500 border-transparent hover:text-slate-800 hover:border-slate-300'
        }`}
      >
        {icon} {label}
      </Link>
    );
  };

  return (
    <header className="bg-white border-b border-slate-200 px-6 py-4 sticky top-0 z-50 shadow-sm transition-all">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-200 group-hover:scale-105 transition-transform">
            A
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800 leading-tight">AutoOps AI</h1>
            <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Enterprise Operator</div>
          </div>
        </Link>

        {/* Navbar Links */}
        <nav className="hidden md:flex items-center gap-8 mt-1">
          <NavLink to="/" icon={<Home size={16} />} label="Overview" />
          <NavLink to="/manager" icon={<MessageSquare size={16} />} label="AI Manager" />
          <NavLink to="/replay" icon={<Clock size={16} />} label="Workflow Replay" />
          <NavLink to="/simulator" icon={<FlaskConical size={16} />} label="Simulator" />
          <NavLink to="/analytics" icon={<BarChart3 size={16} />} label="Analytics" />
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          <button className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-all">
            <Settings size={20} />
          </button>
          <div className="w-9 h-9 rounded-full bg-slate-200 border-2 border-white shadow-sm flex items-center justify-center cursor-pointer hover:ring-2 ring-indigo-100 transition-all">
            <span className="text-xs font-bold text-slate-600">PM</span>
          </div>
        </div>
      </div>
    </header>
  );
}
