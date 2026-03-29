import React from 'react';
import ManagerChat from '../components/ManagerChat';
import WorkflowHealth from '../components/WorkflowHealth';
import { useDashboardData } from '../hooks/useDashboardData';

export default function ManagerPage() {
  const { workflowHealth } = useDashboardData();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in duration-500">
      <div className="flex flex-col h-[calc(100vh-140px)]">
         <ManagerChat />
      </div>
      <div>
         <WorkflowHealth health={workflowHealth} />
      </div>
    </div>
  );
}
