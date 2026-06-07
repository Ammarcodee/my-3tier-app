import React, { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import StatsRow from "../components/StatsRow";
import TaskCard from "../components/TaskCard";
import { Plus } from "lucide-react";
import "./Dashboard.css";

const Dashboard = () => {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState("All");
  
  // New Task States
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState("Medium");
  const [newTaskStartTime, setNewTaskStartTime] = useState("");
  const [newTaskEndTime, setNewTaskEndTime] = useState("");
  const [newTaskAssignee, setNewTaskAssignee] = useState("");

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

  // Fetch Teams (to get potential assignees)
  const { data: teams = [] } = useQuery({
    queryKey: ["teams"],
    queryFn: async () => {
      const res = await axios.get(`http://${window.location.hostname}:5000/api/teams/my`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      return res.data;
    }
  });

  // Flat list of all unique members across user's teams
  const teamMembers = useMemo(() => {
    const members = new Map();
    teams.forEach(team => {
      team.members?.forEach(m => members.set(m._id, m));
    });
    return Array.from(members.values());
  }, [teams]);

  // Create Task Mutation
  const createTaskMutation = useMutation({
    mutationFn: (newTask) => axios.post(`http://${window.location.hostname}:5000/api/tasks`, newTask, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks"] })
  });

  // Toggle Task Mutation
  const toggleTaskMutation = useMutation({
    mutationFn: (id) => axios.patch(`http://${window.location.hostname}:5000/api/tasks/${id}`, {}, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks"] })
  });

  // Delete Task Mutation
  const deleteTaskMutation = useMutation({
    mutationFn: (id) => axios.delete(`http://${window.location.hostname}:5000/api/tasks/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks"] })
  });

  const stats = useMemo(() => {
    return {
      total: tasks.length,
      completed: tasks.filter(t => t.status === "Completed").length,
      inProgress: tasks.filter(t => t.status !== "Completed").length,
      highPriority: tasks.filter(t => t.priority === "High").length,
    };
  }, [tasks]);

  const filteredTasks = tasks.filter(t => {
    if (filter === "All") return true;
    if (filter === "Active") return t.status !== "Completed";
    if (filter === "Done") return t.status === "Completed";
    return true;
  });

  const progress = stats.total > 0 ? (stats.completed / stats.total) * 100 : 0;

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    
    createTaskMutation.mutate({ 
      title: newTaskTitle, 
      priority: newTaskPriority,
      startTime: newTaskStartTime || undefined,
      endTime: newTaskEndTime || undefined,
      assignee: newTaskAssignee || undefined,
      team: teams[0]?._id // For demo, we just assign to the first team
    });

    setNewTaskTitle("");
    setNewTaskStartTime("");
    setNewTaskEndTime("");
    setNewTaskAssignee("");
  };

  return (
    <div className="dashboard fade-in">
      <header className="dashboard-header">
        <div>
          <h1>Welcome Back!</h1>
          <p className="date-display">{new Date().toLocaleDateString("en-US", { weekday: 'long', month: 'long', day: 'numeric' })}</p>
        </div>
        <div className="header-actions">
          <div className="progress-container">
            <div className="progress-info">
              <span>Overall Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="progress-bar-bg">
              <div className="progress-bar-fill" style={{ width: `${progress}%` }}></div>
            </div>
          </div>
        </div>
      </header>

      <StatsRow stats={stats} />

      <section className="task-section">
        <div className="section-header">
          <div className="filter-tabs">
            {["All", "Active", "Done"].map(tab => (
              <button 
                key={tab} 
                onClick={() => setFilter(tab)}
                className={`tab-btn ${filter === tab ? "active" : ""}`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="dashboard-grid">
          <div className="task-list-container">
            {isLoading ? (
              <p>Loading tasks...</p>
            ) : filteredTasks.length === 0 ? (
              <div className="empty-state">No tasks found in this category.</div>
            ) : (
              filteredTasks.map(task => (
                <TaskCard 
                  key={task._id} 
                  task={task} 
                  onToggle={() => toggleTaskMutation.mutate(task._id)}
                  onDelete={() => deleteTaskMutation.mutate(task._id)}
                />
              ))
            )}
          </div>

          <div className="add-task-panel">
            <div className="add-task-card card">
              <h3>Create Task</h3>
              <form onSubmit={handleAddTask} className="enhanced-form">
                <div className="input-group">
                  <label>Title</label>
                  <input 
                    type="text" 
                    placeholder="Task name" 
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    required
                  />
                </div>
                
                <div className="input-group">
                  <label>Priority</label>
                  <select value={newTaskPriority} onChange={(e) => setNewTaskPriority(e.target.value)}>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>

                <div className="input-group">
                  <label>Assignee</label>
                  <select value={newTaskAssignee} onChange={(e) => setNewTaskAssignee(e.target.value)}>
                    <option value="">Select Member</option>
                    {teamMembers.map(m => (
                      <option key={m._id} value={m._id}>{m.name}</option>
                    ))}
                  </select>
                </div>

                <div className="time-group">
                  <div className="input-group">
                    <label>Start Time</label>
                    <input 
                      type="datetime-local" 
                      value={newTaskStartTime}
                      onChange={(e) => setNewTaskStartTime(e.target.value)}
                    />
                  </div>
                  <div className="input-group">
                    <label>End Time</label>
                    <input 
                      type="datetime-local" 
                      value={newTaskEndTime}
                      onChange={(e) => setNewTaskEndTime(e.target.value)}
                    />
                  </div>
                </div>

                <button type="submit" className="add-btn" disabled={createTaskMutation.isPending}>
                  <Plus size={20} />
                  <span>{createTaskMutation.isPending ? "Adding..." : "Add Task"}</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;

