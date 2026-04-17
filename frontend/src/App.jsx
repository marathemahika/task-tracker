import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Layout } from 'lucide-react';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import './index.css';

const API_URL = import.meta.env.PROD 
  ? '/_/backend/tasks' 
  : (import.meta.env.VITE_API_URL || '/tasks');

function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');

  // Fetch tasks
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get(API_URL);
      if (Array.isArray(response.data)) {
        setTasks(response.data);
      } else {
        console.error('Invalid data format received:', response.data);
        alert('Could not fetch tasks. The API might not be configured correctly.');
        setTasks([]); // Fallback to avoid crashing
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  // Add Task
  const addTask = async (taskData) => {
    try {
      const response = await axios.post(API_URL, taskData);
      setTasks([response.data.task, ...tasks]);
    } catch (error) {
      console.error('Error adding task:', error);
      alert('Failed to connect to backend MongoDB. Make sure your server is running!');
    }
  };

  // Update Status
  const toggleStatus = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === 'Pending' ? 'Completed' : 'Pending';
      const response = await axios.put(`${API_URL}/${id}`, { status: newStatus });
      setTasks(tasks.map(task => task._id === id ? response.data.task : task));
    } catch (error) {
      console.error('Error updating task:', error);
      alert('Failed to update task across MongoDB.');
    }
  };

  // Delete Task
  const deleteTask = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setTasks(tasks.filter(task => task._id !== id));
    } catch (error) {
      console.error('Error deleting task:', error);
      alert('Failed to delete task from MongoDB.');
    }
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'All' || task.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const completedCount = tasks.filter(t => t.status === 'Completed').length;
  const progressPercent = tasks.length ? Math.round((completedCount / tasks.length) * 100) : 0;

  return (
    <div className="app-container">
      <header className="header">
        <Layout size={48} color="var(--accent-primary)" style={{ marginBottom: '1rem' }} />
        <h1>Task Tracker</h1>
        <p>Manage your daily goals with focus</p>
        
        {tasks.length > 0 && (
          <div className="task-list-progress">
            <div className="progress-text">
              <span>{completedCount} of {tasks.length} tasks completed</span>
              <span>{progressPercent}%</span>
            </div>
            <div className="progress-bar-container">
              <div className="progress-bar-fill" style={{ width: `${progressPercent}%` }}></div>
            </div>
          </div>
        )}
      </header>

      <main>
        <TaskForm onAdd={addTask} />

        <div className="filter-controls">
          <input 
            type="text" 
            placeholder="Search tasks by title..." 
            className="search-input form-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <select 
            className="status-filter form-secondary-input"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        {loading ? (
          <div className="empty-state">Loading tasks...</div>
        ) : (
          <TaskList 
            tasks={filteredTasks} 
            onToggle={toggleStatus} 
            onDelete={deleteTask} 
          />
        )}
      </main>
    </div>
  );
}

export default App;
