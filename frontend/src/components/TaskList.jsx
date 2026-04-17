import React from 'react';
import { ListTodo } from 'lucide-react';
import TaskItem from './TaskItem';

const TaskList = ({ tasks, onToggle, onDelete }) => {
  if (tasks.length === 0) {
    return (
      <div className="empty-state mt-4">
        <ListTodo size={48} color="var(--text-placeholder)" style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
        <p>No tasks found. Time to relax or create a new one!</p>
      </div>
    );
  }

  return (
    <div className="task-list">
      {tasks.map(task => (
        <TaskItem 
          key={task._id} 
          task={task} 
          onToggle={onToggle} 
          onDelete={onDelete} 
        />
      ))}
    </div>
  );
};

export default TaskList;
