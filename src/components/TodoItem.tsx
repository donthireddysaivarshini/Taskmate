
import React, { useState } from 'react';
import { Trash2, Check } from 'lucide-react';
import { Todo } from '@/hooks/useTodos';
import { Button } from '@/components/ui/button';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  darkMode: boolean;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo, onToggle, onDelete, darkMode }) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = () => {
    setIsDeleting(true);
    setTimeout(() => onDelete(todo.id), 300);
  };

  const getPriorityConfig = (priority: string) => {
    switch (priority) {
      case 'high':
        return { 
          color: 'bg-red-100 text-red-800 border-red-200', 
          text: 'High',
          indicator: 'bg-red-500'
        };
      case 'medium':
        return { 
          color: 'bg-yellow-100 text-yellow-800 border-yellow-200', 
          text: 'Medium',
          indicator: 'bg-yellow-500'
        };
      case 'low':
        return { 
          color: 'bg-green-100 text-green-800 border-green-200', 
          text: 'Low',
          indicator: 'bg-green-500'
        };
      default:
        return { 
          color: 'bg-blue-100 text-blue-800 border-blue-200', 
          text: 'Medium',
          indicator: 'bg-blue-500'
        };
    }
  };

  const getCategoryConfig = (category: string) => {
    switch (category) {
      case 'study':
        return { 
          name: 'Study', 
          color: 'bg-blue-100 text-blue-800 border-blue-200'
        };
      case 'skill':
        return { 
          name: 'Skill', 
          color: 'bg-purple-100 text-purple-800 border-purple-200'
        };
      case 'career':
        return { 
          name: 'Career', 
          color: 'bg-green-100 text-green-800 border-green-200'
        };
      case 'goal':
        return { 
          name: 'Goal', 
          color: 'bg-orange-100 text-orange-800 border-orange-200'
        };
      default:
        return { 
          name: 'General', 
          color: 'bg-gray-100 text-gray-800 border-gray-200'
        };
    }
  };

  const priorityConfig = getPriorityConfig(todo.priority || 'medium');
  const categoryConfig = getCategoryConfig(todo.category || 'general');

  return (
    <div className={`group flex items-center gap-4 p-4 rounded-lg border transition-all duration-200 hover:shadow-md ${
      isDeleting ? 'animate-slide-out-right opacity-0 scale-95' : ''
    } ${
      todo.completed 
        ? `${darkMode ? 'bg-slate-700/50 border-slate-600' : 'bg-slate-50 border-slate-200'} opacity-75` 
        : `${darkMode ? 'bg-slate-700 border-slate-600 hover:border-slate-500' : 'bg-white border-slate-200 hover:border-slate-300'}`
    }`}>
      
      {/* Priority indicator */}
      <div className={`flex-shrink-0 w-1 h-12 rounded-full ${priorityConfig.indicator}`}></div>
      
      {/* Completion toggle button */}
      <Button
        variant="outline"
        size="sm"
        className={`flex-shrink-0 w-8 h-8 rounded-full p-0 transition-all duration-200 ${
          todo.completed
            ? 'bg-green-500 border-green-500 text-white hover:bg-green-600'
            : `border-slate-300 hover:border-green-400 hover:bg-green-50 ${darkMode ? 'border-slate-600 hover:border-green-400 hover:bg-green-900/20' : ''}`
        }`}
        onClick={() => onToggle(todo.id)}
      >
        {todo.completed ? (
          <Check className="w-4 h-4" />
        ) : (
          <div className="w-3 h-3 rounded-full border-2 border-current"></div>
        )}
      </Button>

      {/* Task content */}
      <div className="flex-1 space-y-2">
        <div className="flex items-center justify-between">
          <span 
            className={`text-base font-medium transition-all duration-200 cursor-pointer ${
              todo.completed 
                ? `line-through ${darkMode ? 'text-slate-400' : 'text-slate-500'}` 
                : `${darkMode ? 'text-white' : 'text-slate-900'} hover:text-blue-600`
            }`}
            onClick={() => onToggle(todo.id)}
          >
            {todo.text}
          </span>
        </div>
        
        {/* Tags */}
        <div className="flex items-center gap-2">
          {/* Category tag */}
          <span className={`px-2 py-1 rounded-md text-xs font-medium border ${
            darkMode ? 'bg-slate-600 text-slate-200 border-slate-500' : categoryConfig.color
          }`}>
            {categoryConfig.name}
          </span>
          
          {/* Priority tag */}
          <span className={`px-2 py-1 rounded-md text-xs font-medium border ${
            darkMode ? 'bg-slate-600 text-slate-200 border-slate-500' : priorityConfig.color
          }`}>
            {priorityConfig.text}
          </span>
        </div>
        
        {/* Timestamp */}
        <div className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
          Created {new Date(todo.createdAt).toLocaleDateString()}
        </div>
      </div>

      {/* Delete button */}
      <Button
        variant="ghost"
        size="sm"
        className={`flex-shrink-0 w-8 h-8 p-0 text-slate-400 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-red-50 hover:text-red-600 ${
          darkMode ? 'hover:bg-red-900/20' : ''
        }`}
        onClick={handleDelete}
      >
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
  );
};

export default TodoItem;
