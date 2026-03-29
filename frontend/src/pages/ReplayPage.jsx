import React from 'react';
import AIInsights from '../components/AIInsights';
import { useDashboardData } from '../hooks/useDashboardData';

export default function ReplayPage() {
  const { auditLogs } = useDashboardData();

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in duration-500">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
        <h1 className="text-2xl font-bold text-slate-800 mb-2">Autonomous Workflow Replay</h1>
        <p className="text-slate-500 mb-8">
          A chronologic audit trail of every autonomous action taken by the AutoOps AI intelligence hive.
        </p>
        <AIInsights logs={auditLogs} />
      </div>
    </div>
  );
}
