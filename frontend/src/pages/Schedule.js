import React, { useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Clock, AlertCircle } from "lucide-react";
import "./Schedule.css";

const Schedule = () => {
  const queryClient = useQueryClient();

  // Fetch Tasks
  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ["tasks"],
    queryFn: async () => {
      const res = await axios.get(`http://${window.location.hostname}:5000/api/tasks`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      return res.data;
    }
  });

  // Toggle Task Mutation
  const toggleTaskMutation = useMutation({
    mutationFn: (id) => axios.patch(`http://${window.location.hostname}:5000/api/tasks/${id}`, {}, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks"] })
  });

  const scheduledTasks = useMemo(() => {
    return tasks
      .filter(t => t.startTime)
      .sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
  }, [tasks]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getDay = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="schedule-page fade-in">
      <header className="page-header">
        <h1>Work Schedule</h1>
        <p>Your chronological timeline of upcoming tasks.</p>
      </header>

      {isLoading ? (
        <div className="loading-state">Loading schedule...</div>
      ) : scheduledTasks.length === 0 ? (
        <div className="empty-schedule card">
          <Clock size={48} />
          <h2>No tasks scheduled</h2>
          <p>Go to the Dashboard to add a task with a start and end time.</p>
        </div>
      ) : (
        <div className="timeline-container">
          {scheduledTasks.map((task, index) => {
            const isOverdue = new Date(task.endTime) < new Date() && task.status !== "Completed";
            const showDay = index === 0 || getDay(task.startTime) !== getDay(scheduledTasks[index-1].startTime);

            return (
              <React.Fragment key={task._id}>
                {showDay && <h3 className="timeline-day">{getDay(task.startTime)}</h3>}
                <div className={`timeline-item ${isOverdue ? "overdue" : ""}`}>
                  <div className="timeline-time">
                    <span className="start-time">{formatDate(task.startTime)}</span>
                    <div className="time-line"></div>
                    <span className="end-time">{formatDate(task.endTime)}</span>
                  </div>

                  <div className="timeline-content card">
                    <div className="task-header">
                      <h3>{task.title}</h3>
                      {isOverdue && <span className="overdue-badge"><AlertCircle size={12} /> Overdue</span>}
                    </div>
                    <p>{task.description || "No description provided."}</p>
                    <div className="task-footer">
                      <button 
                        type="button"
                        className={`status-tag-btn ${task.status.toLowerCase().replace(" ", "-")}`}
                        onClick={() => toggleTaskMutation.mutate(task._id)}
                        aria-label={`Mark task ${task.title} as ${task.status === "Completed" ? "pending" : "completed"}`}
                      >
                        {task.status}
                      </button>
                      <div className="assignee-info">
                        <span>Assignee: {task.assignee?.name || "Unassigned"}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </React.Fragment>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Schedule;

