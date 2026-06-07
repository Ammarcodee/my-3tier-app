import React, { useMemo } from "react";
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

  const productivityData = useMemo(() => {
    return analytics?.productivity || [];
  }, [analytics]);

  const activityLogs = useMemo(() => {
    return analytics?.activityLogs || [];
  }, [analytics]);

  if (isLoading) return <div className="loading-state">Syncing analysis...</div>;

  return (
    <div className="analytics-page fade-in">
      <header className="page-header">
        <h1>Workspace Analytics</h1>
        <p>Detailed performance data and activity history.</p>
      </header>

      <div className="analytics-grid">
        <section className="productivity-section card">
          <div className="card-header">
            <TrendingUp size={20} aria-hidden="true" />
            <h2>Team Productivity</h2>
          </div>
          <p className="card-subtitle">Tasks completed per team member.</p>
          
          <table className="data-table">
            <thead>
              <tr>
                <th scope="col">Member</th>
                <th scope="col" className="text-right">Completed Tasks</th>
              </tr>
            </thead>
            <tbody>
              {productivityData.map((p, index) => (
                <tr key={p.name || `member-${index}`}>
                  <td className="member-cell">
                    <UserIcon size={16} aria-hidden="true" />
                    <span>{p.name || "Unknown Member"}</span>
                  </td>
                  <td className="text-right font-bold">{p.tasksCompleted}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="activity-section card">
          <div className="card-header">
            <Activity size={20} aria-hidden="true" />
            <h2>Live Activity Log</h2>
          </div>
          <p className="card-subtitle">Recent actions performed in the workspace.</p>
          
          <div className="log-list">
            {activityLogs.map((log) => (
              <article key={log._id} className="log-item">
                <span className="log-action">{log.action ? log.action.replace(/_/g, " ") : "Action"}</span>
                <p className="log-details">{log.details}</p>
                <div className="log-meta">
                  <span>By: {log.user?.name || "System"}</span>
                  <span className="dot-separator" aria-hidden="true">???</span>
                  <time dateTime={log.timestamp}>{new Date(log.timestamp).toLocaleString()}</time>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Analytics;

