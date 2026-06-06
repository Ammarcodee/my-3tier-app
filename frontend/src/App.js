import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await axios.get("http://" + window.location.hostname + ":5000/api/tasks");
      setTasks(res.data);
    } catch (err) {
      console.error("Error fetching tasks:", err);
    }
  };

  const addTask = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    setLoading(true);
    try {
      await axios.post("http://" + window.location.hostname + ":5000/api/tasks", { 
        title: title.trim(),
        status: "Pending"
      });
      setTitle("");
      await fetchTasks();
    } catch (err) {
      console.error("Error adding task:", err);
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
          <input
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

        <div className="task-list-section">
          <h2>Your Tasks ({tasks.length})</h2>
          {tasks.length === 0 ? (
            <p className="no-tasks">No tasks yet. Add one above!</p>
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
        </div>
      </main>

      <footer className="app-footer">
        <div className="status-pills">
          <span className="pill sonar">SonarQube: Verified</span>
          <span className="pill jenkins">Jenkins: Automated</span>
          <span className="pill docker">Docker: Deployed</span>
        </div>
      </footer>
    </div>
  );
}

export default App;

