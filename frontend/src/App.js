import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
 const [tasks, setTasks] = useState([]);
 const [title, setTitle] = useState('');

 useEffect(() => {
 fetchTasks();
 }, []);

 const fetchTasks = async () => {
 try {
 const res = await axios.get('http://' + window.location.hostname + ':5000/api/tasks');
 setTasks(res.data);
 } catch (err) { console.error(err); }
 };

 const addTask = async () => {
 if (!title) return;
 await axios.post('http://' + window.location.hostname + ':5000/api/tasks', { title });
 setTitle('');
 fetchTasks();
 };

 return (
 <div style={{ padding: '20px', fontFamily: 'Arial' }}>
 <h1>Team Task Manager</h1>
 <input 
 value={title} 
 onChange={(e) => setTitle(e.target.value)} 
 placeholder=\New Task Title />
 <button onClick={addTask}>Add Task</button>
 <ul>
 {tasks.map(task => (
 <li key={task._id}>{task.title} - <b>{task.status}</b></li>
 ))}
 </ul>
 </div>
 );
}

export default App;
