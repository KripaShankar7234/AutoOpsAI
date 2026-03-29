import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import OverviewPage from './pages/OverviewPage';
import ManagerPage from './pages/ManagerPage';
import ReplayPage from './pages/ReplayPage';
import SimulatorPage from './pages/SimulatorPage';
import AnalyticsPage from './pages/AnalyticsPage';

function App() {
  return (
    <Router>
      <div className="flex h-screen bg-[#F8FAFC] text-slate-800 font-sans overflow-hidden">
        <Sidebar />
        <main className="flex-1 ml-64 p-8 overflow-y-auto">
          <Routes>
            <Route path="/" element={<OverviewPage />} />
            <Route path="/manager" element={<ManagerPage />} />
            <Route path="/replay" element={<ReplayPage />} />
            <Route path="/simulator" element={<SimulatorPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
