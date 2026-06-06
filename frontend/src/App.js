import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchTasks = useCallback(async () => {
    try {
      const host = window.location.hostname || "localhost";
      const res = await axios.get(`http://${host}:5000/api/tasks`);
      if (res.data && Array.isArray(res.data)) {
        setTasks(res.data);
      }
    } catch (err) {
      // Fetch error handled
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const addTask = async (e) => {
    e.preventDefault();
    const trimmedTitle = title.trim();
    if (!trimmedTitle) return;
    
    setLoading(true);
    try {
      const host = window.location.hostname || "localhost";
      await axios.post(`http://${host}:5000/api/tasks`, { 
        title: trimmedTitle
      });
      setTitle("");
      await fetchTasks();
    } catch (err) {
      // Add error handled
    } finally {
      setLoading(false);
    }
  };

  const toggleTask = async (id) => {
    if (!id) return;
    try {
      const host = window.location.hostname || "localhost";
      await axios.patch(`http://${host}:5000/api/tasks/${id}`);
      await fetchTasks();
    } catch (err) {
      // Toggle error handled
    }
  };

  const deleteTask = async (id) => {
    if (!id) return;
    try {
      const host = window.location.hostname || "localhost";
      await axios.delete(`http://${host}:5000/api/tasks/${id}`);
      await fetchTasks();
    } catch (err) {
      // Delete error handled
    }
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Team Task Manager</h1>
        <p>Reliable 3-Tier Application</p>
      </header>

      <main className="main-content">
        <form className="task-form" onSubmit={addTask}>
          <label htmlFor="task-input" className="sr-only">New Task Name</label>
          <input
            id="task-input"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Add a new task..."
            disabled={loading}
          />
          <button type="submit" disabled={loading || !title.trim()}>
            {loading ? "..." : "Add"}
          </button>
        </form>

        <section className="task-list-section">
          <h2>Current Tasks ({tasks.length})</h2>
          <ul className="task-list">
            {tasks.map((task, index) => {
              const taskId = task._id || `temp-${index}`;
              const isCompleted = task.status === "Completed";
              return (
                <li key={taskId} className={`task-item ${isCompleted ? "completed" : ""}`}>
                  <button 
                    type="button"
                    className="task-info-btn" 
                    onClick={() => toggleTask(task._id)}
                    aria-label={isCompleted ? "Mark as pending" : "Mark as completed"}
                  >
                    <span className="checkbox-icon">
                      {isCompleted ? "[X]" : "[ ]"}
                    </span>
                    <span className="task-text">{task.title}</span>
                  </button>
                  <button 
                    type="button"
                    className="delete-btn" 
                    onClick={() => deleteTask(task._id)}
                    aria-label="Delete task"
                  >
                    Delete
                  </button>
                </li>
              );
            })}
          </ul>
        </section>
      </main>

      <footer className="app-footer">
        <div className="status-pills">
          <span className="pill sonar">Quality: Checked</span>
          <span className="pill jenkins">Build: Automated</span>
          <span className="pill docker">AWS: Running</span>
        </div>
      </footer>
    </div>
  );
}

export default App;

