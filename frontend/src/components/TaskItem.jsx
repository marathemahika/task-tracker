import React, { useState } from 'react';
import { Trash2, ChevronDown, ChevronUp } from 'lucide-react';

const TaskItem = ({ task, onToggle, onDelete }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const isCompleted = task.status === 'Completed';

  // Dynamic Deadline Calculation
  const getRelativeDeadline = (deadline) => {
    if (!deadline) return null;
    const date = new Date(deadline);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(date);
    target.setHours(0, 0, 0, 0);

    const diffTime = target - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return { text: 'Overdue', isOverdue: true };
    if (diffDays === 0) return { text: 'Today', isOverdue: false };
    if (diffDays === 1) return { text: 'Tomorrow', isOverdue: false };
    return { text: `In ${diffDays} days`, isOverdue: false };
  };

  const deadlineInfo = getRelativeDeadline(task.deadline);
  const isOverdue = deadlineInfo?.isOverdue && !isCompleted;
  
  const priorityClass = task.priority ? `priority-${task.priority.toLowerCase()}` : 'priority-normal';

  return (
    <div className={`task-item ${isCompleted ? 'completed' : ''} ${isOverdue ? 'task-overdue' : ''}`}>
      <input 
        type="checkbox" 
        className="task-checkbox" 
        checked={isCompleted}
        onChange={() => onToggle(task._id, task.status)}
      />
      
      <div className="task-content">
        <div className="task-title-row" onClick={() => setIsExpanded(!isExpanded)} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span className={`priority-indicator ${priorityClass}`}></span>
          <span className="task-title">{task.title}</span>
          {deadlineInfo && !isExpanded && (
            <span className={`task-deadline-badge ${isOverdue ? 'overdue-text' : ''}`}>{deadlineInfo.text}</span>
          )}
          {isExpanded ? <ChevronUp size={16} color="var(--text-placeholder)" /> : <ChevronDown size={16} color="var(--text-placeholder)" />}
        </div>
        
        <div className={`task-details ${isExpanded ? 'expanded' : ''}`}>
          {task.description && (
            <p className="task-desc">{task.description}</p>
          )}
          {task.deadline && (
            <p className="task-full-deadline">
              Deadline: {new Date(task.deadline).toLocaleDateString()} 
              <span className={isOverdue ? 'overdue-text' : ''}> ({deadlineInfo.text})</span>
            </p>
          )}
        </div>
      </div>

      <div className="task-right">
        <div className="task-actions">
          <Trash2 
            size={18} 
            className="action-icon"
            onClick={(e) => { e.stopPropagation(); onDelete(task._id); }} 
          />
        </div>
      </div>
    </div>
  );
};

export default TaskItem;
