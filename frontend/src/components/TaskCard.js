import React from "react";
import { Clock, Trash2 } from "lucide-react";
import "./TaskCard.css";

const TaskCard = ({ task, onToggle, onDelete }) => {
  const priorityColors = {
    High: "var(--priority-high)",
    Medium: "var(--priority-medium)",
    Low: "var(--priority-low)",
  };

  const formattedDate = new Date(task.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <article className={`task-card ${task.status === "Completed" ? "completed" : ""}`}>
      <div className="task-main">
        <input 
          type="checkbox" 
          checked={task.status === "Completed"} 
          onChange={() => onToggle(task._id)}
          className="task-checkbox"
          aria-label={`Mark ${task.title} as completed`}
        />
        <div className="task-content">
          <h3 className="task-title">{task.title}</h3>
          <div className="task-meta">
            <span className="priority-pill" style={{ backgroundColor: priorityColors[task.priority] || "var(--text-muted)" }}>
              {task.priority}
            </span>
            <div className="timestamp">
              <Clock size={14} aria-hidden="true" />
              <time dateTime={task.createdAt}>{formattedDate}</time>
            </div>
          </div>
        </div>
      </div>
      
      <button 
        type="button"
        onClick={() => onDelete(task._id)} 
        className="delete-task-btn"
        aria-label={`Delete task ${task.title}`}
      >
        <Trash2 size={18} aria-hidden="true" />
      </button>
    </article>
  );
};

export default TaskCard;

