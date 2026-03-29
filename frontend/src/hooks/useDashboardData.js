import { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

export function useDashboardData() {
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

  return { tasks, workflowHealth, auditLogs, loading, fetchData };
}
