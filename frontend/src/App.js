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
      // Failed to fetch tasks
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
        title: trimmedTitle,
        status: "Pending"
      });
      setTitle("");
      await fetchTasks();
    } catch (err) {
      // Failed to add task
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
      // Failed to toggle task
    }
  };

  const deleteTask = async (id) => {
    if (!id) return;
    try {
      const host = window.location.hostname || "localhost";
      await axios.delete(`http://${host}:5000/api/tasks/${id}`);
      await fetchTasks();
    } catch (err) {
      // Failed to delete task
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
            aria-label="New task title"
          />
          <button type="submit" disabled={loading || !title.trim()}>
            {loading ? "..." : "Add"}
          </button>
        </form>

        <section className="task-list-section">
          <h2>Current Tasks ({tasks.length})</h2>
          <ul className="task-list">
            {tasks.map((task) => (
              <li key={task._id || Math.random()} className={`task-item ${task.status ? task.status.toLowerCase() : ""}`}>
                <button 
                  className="task-info-btn" 
                  onClick={() => toggleTask(task._id)}
                  aria-label={`Mark ${task.title} as ${task.status === "Completed" ? "pending" : "completed"}`}
                >
                  <span className="checkbox" aria-hidden="true">
                    {task.status === "Completed" ? "???" : "???"}
                  </span>
                  <span className="task-text">{task.title}</span>
                </button>
                <button 
                  className="delete-btn" 
                  onClick={() => deleteTask(task._id)}
                  aria-label={`Delete task ${task.title}`}
                >
                  ???????
                </button>
              </li>
            ))}
          </ul>
        </section>
      </main>

      <footer className="app-footer">
        <div className="status-pills">
          <span className="pill sonar">Quality: Verified</span>
          <span className="pill jenkins">Build: Automated</span>
          <span className="pill docker">Infrastructure: Containerized</span>
        </div>
      </footer>
    </div>
  );
}

export default App;

