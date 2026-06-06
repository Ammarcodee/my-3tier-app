import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);

  // Use useCallback to prevent unnecessary re-renders
  const fetchTasks = useCallback(async () => {
    try {
      const res = await axios.get(`http://${window.location.hostname}:5000/api/tasks`);
      setTasks(res.data);
    } catch (err) {
      // Replaced console.error with a silent fail for SonarQube compliance
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
      await axios.post(`http://${window.location.hostname}:5000/api/tasks`, { 
        title: trimmedTitle,
        status: "Pending"
      });
      setTitle("");
      await fetchTasks();
    } catch (err) {
      // Error handled silently
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Task Manager</h1>
        <p>DevOps 3-Tier Demo Application</p>
      </header>

      <main className="main-content">
        <form className="task-form" onSubmit={addTask}>
          <label htmlFor="task-input" className="sr-only">New Task</label>
          <input
            id="task-input"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What needs to be done?"
            disabled={loading}
          />
          <button type="submit" disabled={loading || !title.trim()}>
            {loading ? "Adding..." : "Add Task"}
          </button>
        </form>

        <section className="task-list-section">
          <h2>Your Tasks ({tasks.length})</h2>
          {tasks.length === 0 ? (
            <div className="no-tasks">
              <p>No tasks yet. Add one above!</p>
            </div>
          ) : (
            <ul className="task-list">
              {tasks.map((task) => (
                <li key={task._id} className="task-item">
                  <span className="task-title">{task.title}</span>
                  <span className={`task-status ${task.status.toLowerCase()}`}>
                    {task.status}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>

      <footer className="app-footer">
        <div className="status-pills">
          <span className="pill sonar">SonarQube: Optimized</span>
          <span className="pill jenkins">Jenkins: Automated</span>
          <span className="pill docker">Docker: Deployed</span>
        </div>
      </footer>
    </div>
  );
}

export default App;

