import React, { useState } from 'react';
import { Plus } from 'lucide-react';

const TaskForm = ({ onAdd }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAdd({ title, description, deadline });

    // Reset fields
    setTitle('');
    setDescription('');
    setDeadline('');
  };

  return (
    <div className="top-section">
      <form className="task-form" onSubmit={handleSubmit}>
        <div className="form-input-container">
          <input 
            type="text" 
            className="form-input" 
            placeholder="Add a new task..." 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <button type="submit" className="submit-btn" title="Save Task">
            <Plus size={24} />
          </button>
        </div>

        <div className="secondary-inputs">
          <input 
            type="text" 
            className="form-secondary-input" 
            placeholder="Description (optional)" 
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <input 
            type="date" 
            className="form-secondary-input" 
            style={{ width: 'auto' }}
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
          />
        </div>
      </form>
    </div>
  );
};

export default TaskForm;
