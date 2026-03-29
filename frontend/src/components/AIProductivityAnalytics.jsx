import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js';
import { Flame, ShieldAlert, BarChart } from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const API_BASE = 'http://localhost:5000/api';

export default function AIProductivityAnalytics({ refreshToggle }) {
  const [data, setData] = useState({ teamRisks: [], productivity: [] });

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await axios.get(`${API_BASE}/workflow/analytics`);
        setData(res.data);
      } catch (err) {
        console.error('Analytics fetch error:', err);
      }
    };
    fetchAnalytics();
  }, [refreshToggle]);

  const barChartData = {
    labels: data.productivity.map(p => p.name),
    datasets: [
      {
        label: 'Task Completion Rate (%)',
        data: data.productivity.map(p => p.completionRate),
        backgroundColor: '#6366f1',
        borderRadius: 4
      }
    ]
  };

  const getRiskColor = (risk) => {
    if (risk === 'High Risk') return 'bg-rose-100 text-rose-700 border-rose-200';
    if (risk === 'Medium Risk') return 'bg-amber-100 text-amber-700 border-amber-200';
    return 'bg-emerald-100 text-emerald-700 border-emerald-200';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col gap-6">
      
      {/* Risk Heatmap */}
      <div>
        <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2 mb-4">
          <Flame className="text-brand-500 w-5 h-5" /> Team Risk Heatmap
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
           {data.teamRisks.map((team, idx) => (
             <div key={idx} className={`p-4 rounded-lg border flex flex-col items-center justify-center text-center ${getRiskColor(team.risk)}`}>
               <h3 className="font-bold text-sm uppercase tracking-wide opacity-90">{team.team}</h3>
               <p className="font-black text-xl my-1">{team.risk}</p>
               <p className="text-xs opacity-80">{team.overdue} overdue tasks</p>
               <p className="text-xs font-semibold">{team.completionRate}% completion</p>
             </div>
           ))}
           {data.teamRisks.length === 0 && (
             <div className="text-slate-500 text-sm">No team task data available yet.</div>
           )}
        </div>
      </div>

      <hr className="border-slate-100" />

      {/* Team Productivity Chart */}
      <div>
        <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2 mb-4">
          <BarChart className="text-brand-500 w-5 h-5" /> Productivity Analytics
        </h2>
        
        <div className="h-64 mt-2">
           <Bar 
             data={barChartData} 
             options={{ 
               maintainAspectRatio: false,
               plugins: { legend: { display: false } },
               scales: { y: { suggestedMax: 100 } }
             }} 
           />
        </div>
      </div>

    </div>
  );
}
