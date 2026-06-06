import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchTasks = useCallback(async () => {
    try {
      const res = await axios.get(`http://${window.location.hostname}:5000/api/tasks`);
      setTasks(res.data);
    } catch (err) {
      // Handle error
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
      await axios.post(`http://${window.location.hostname}:5000/api/tasks`, { title: trimmedTitle });
      setTitle("");
      await fetchTasks();
    } catch (err) {
      // Handle error
    } finally {
      setLoading(false);
    }
  };

  const toggleTask = async (id) => {
    try {
      await axios.patch(`http://${window.location.hostname}:5000/api/tasks/${id}`);
      await fetchTasks();
    } catch (err) {
      // Handle error
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`http://${window.location.hostname}:5000/api/tasks/${id}`);
      await fetchTasks();
    } catch (err) {
      // Handle error
    }
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Team Task Manager</h1>
        <p>Full CRUD 3-Tier Application</p>
      </header>

      <main className="main-content">
        <form className="task-form" onSubmit={addTask}>
          <input
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
            {tasks.map((task) => (
              <li key={task._id} className={`task-item ${task.status.toLowerCase()}`}>
                <div className="task-info" onClick={() => toggleTask(task._id)}>
                  <span className="checkbox">{task.status === "Completed" ? "???" : "???"}</span>
                  <span className="task-text">{task.title}</span>
                </div>
                <button className="delete-btn" onClick={() => deleteTask(task._id)}>???????</button>
              </li>
            ))}
          </ul>
        </section>
      </main>

      <footer className="app-footer">
        <div className="status-pills">
          <span className="pill sonar">Code Quality: Passed</span>
          <span className="pill jenkins">CI/CD: Active</span>
          <span className="pill docker">AWS: Deployed</span>
        </div>
      </footer>
    </div>
  );
}

export default App;

