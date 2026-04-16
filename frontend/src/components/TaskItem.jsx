import React from 'react';
import { Trash2 } from 'lucide-react';

const TaskItem = ({ task, onToggle, onDelete }) => {
  const isCompleted = task.status === 'Completed';

  // Format date if exists
  const formattedDate = task.deadline 
    ? new Date(task.deadline).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric'
      })
    : null;

  return (
    <div className={`task-item ${isCompleted ? 'completed' : ''}`}>
      <input 
        type="checkbox" 
        className="task-checkbox" 
        checked={isCompleted}
        onChange={() => onToggle(task._id, task.status)}
      />
      
      <div className="task-content">
        <span className="task-title">{task.title}</span>
        {task.description && (
          <span className="task-desc">{task.description}</span>
        )}
      </div>

      <div className="task-right">
        {formattedDate && (
          <span className="task-deadline">{formattedDate}</span>
        )}
        <div className="task-actions">
          <Trash2 
            size={18} 
            className="action-icon"
            onClick={() => onDelete(task._id)} 
          />
        </div>
      </div>
    </div>
  );
};

export default TaskItem;
