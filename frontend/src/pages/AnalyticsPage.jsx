import React from 'react';
import AIProductivityAnalytics from '../components/AIProductivityAnalytics';
import { useDashboardData } from '../hooks/useDashboardData';

export default function AnalyticsPage() {
  const { tasks } = useDashboardData();

  return (
    <div className="animate-in fade-in duration-500">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Organization Analytics</h1>
        <p className="text-slate-500">Global metrics calculated across all active agents and teams.</p>
      </div>
      
      <AIProductivityAnalytics refreshToggle={tasks.length} />
    </div>
  );
}
