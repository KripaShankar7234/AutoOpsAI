import React from 'react';
import AIScenarioSimulator from '../components/AIScenarioSimulator';
import SmartDependencyGraph from '../components/SmartDependencyGraph';
import { useDashboardData } from '../hooks/useDashboardData';

export default function SimulatorPage() {
  const { tasks } = useDashboardData();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in duration-500">
      <div>
        <AIScenarioSimulator />
      </div>
      <div>
        <SmartDependencyGraph tasks={tasks} />
      </div>
    </div>
  );
}
