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

  if (isLoading) return <div className="loading-state">Building timeline...</div>;

  return (
    <div className="schedule-page fade-in">
      <header className="page-header">
        <h1>Work Schedule</h1>
        <p>Your chronological timeline of upcoming tasks.</p>
      </header>

      {scheduledTasks.length === 0 ? (
        <section className="empty-schedule card">
          <Clock size={48} aria-hidden="true" />
          <h2>No tasks scheduled</h2>
          <p>Go to the Dashboard to add a task with a start and end time.</p>
        </section>
      ) : (
        <div className="timeline-container">
          {scheduledTasks.map((task, index) => {
            const isOverdue = new Date(task.endTime) < new Date() && task.status !== "Completed";
            const showDay = index === 0 || getDay(task.startTime) !== getDay(scheduledTasks[index-1].startTime);

            return (
              <React.Fragment key={task._id}>
                {showDay && <h3 className="timeline-day">{getDay(task.startTime)}</h3>}
                <article className={`timeline-item ${isOverdue ? "overdue" : ""}`}>
                  <div className="timeline-time">
                    <time className="start-time" dateTime={task.startTime}>{formatDate(task.startTime)}</time>
                    <div className="time-line" aria-hidden="true"></div>
                    <time className="end-time" dateTime={task.endTime}>{formatDate(task.endTime)}</time>
                  </div>

                  <div className="timeline-content card">
                    <div className="task-header">
                      <h3>{task.title}</h3>
                      {isOverdue && <span className="overdue-badge"><AlertCircle size={12} aria-hidden="true" /> Overdue</span>}
                    </div>
                    <p>{task.description || "No description provided."}</p>
                    <div className="task-footer">
                      <button
                        type="button"
                        className={`status-tag-btn ${task.status.toLowerCase().replace(/\s/g, "-")}`}
                        onClick={() => toggleTaskMutation.mutate(task._id)}
                        aria-label={`Toggle status for ${task.title}`}
                      >
                        {task.status}
                      </button>
                      <div className="assignee-info">
                        <span>Assignee: {task.assignee?.name || "Unassigned"}</span>
                      </div>
                    </div>
                  </div>
                </article>
              </React.Fragment>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Schedule;

