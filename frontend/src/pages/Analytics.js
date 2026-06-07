import React from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Activity, TrendingUp, User as UserIcon } from "lucide-react";
import "./Analytics.css";

const Analytics = () => {
  // Fetch Analytics
  const { data: analytics, isLoading } = useQuery({
    queryKey: ["analytics"],
    queryFn: async () => {
      const res = await axios.get(`http://${window.location.hostname}:5000/api/analytics`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      return res.data;
    }
  });

  if (isLoading) return <p>Loading analytics...</p>;

  return (
    <div className="analytics-page fade-in">
      <header className="page-header">
        <h1>Workspace Analytics</h1>
        <p>Detailed performance data and activity history.</p>
      </header>

      <div className="analytics-grid">
        <div className="productivity-section card">
          <div className="card-header">
            <TrendingUp size={20} />
            <h2>Team Productivity</h2>
          </div>
          <p className="card-subtitle">Tasks completed per team member.</p>
          
          <table className="data-table">
            <thead>
              <tr>
                <th>Member</th>
                <th className="text-right">Completed Tasks</th>
              </tr>
            </thead>
            <tbody>
              {analytics?.productivity.map((p) => (
                <tr key={p.name}>
                  <td className="member-cell">
                    <UserIcon size={16} />
                    <span>{p.name}</span>
                  </td>
                  <td className="text-right font-bold">{p.tasksCompleted}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="activity-section card">
          <div className="card-header">
            <Activity size={20} />
            <h2>Live Activity Log</h2>
          </div>
          <p className="card-subtitle">Recent actions performed in the workspace.</p>
          
          <div className="log-list">
            {analytics?.activityLogs.map((log) => (
              <div key={log._id} className="log-item">
                <span className="log-action">{log.action.replace("_", " ")}</span>
                <p className="log-details">{log.details}</p>
                <div className="log-meta">
                  <span>By: {log.user?.name || "System"}</span>
                  <span>???</span>
                  <span>{new Date(log.timestamp).toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;

