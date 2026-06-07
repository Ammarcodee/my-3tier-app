import React from "react";
import "./StatsRow.css";

const StatsRow = ({ stats }) => {
  const items = [
    { label: "Total Tasks", value: stats.total, color: "var(--primary)" },
    { label: "Completed", value: stats.completed, color: "var(--priority-low)" },
    { label: "In Progress", value: stats.inProgress, color: "var(--priority-medium)" },
    { label: "High Priority", value: stats.highPriority, color: "var(--priority-high)" },
  ];

  return (
    <div className="stats-row">
      {items.map((item) => (
        <div key={item.label} className="stat-card">
          <span className="stat-label">{item.label}</span>
          <span className="stat-value" style={{ color: item.color }}>{item.value}</span>
        </div>
      ))}
    </div>
  );
};

export default StatsRow;

