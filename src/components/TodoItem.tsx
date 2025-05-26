
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
          emoji: '🔥', 
          color: 'bg-red-500', 
          text: 'Urgent',
          glow: 'shadow-red-500/50'
        };
      case 'medium':
        return { 
          emoji: '⚡', 
          color: 'bg-yellow-500', 
          text: 'Normal',
          glow: 'shadow-yellow-500/50'
        };
      case 'low':
        return { 
          emoji: '🌱', 
          color: 'bg-green-500', 
          text: 'Chill',
          glow: 'shadow-green-500/50'
        };
      default:
        return { 
          emoji: '⚡', 
          color: 'bg-blue-500', 
          text: 'Normal',
          glow: 'shadow-blue-500/50'
        };
    }
  };

  const priorityConfig = getPriorityConfig(todo.priority || 'medium');

  return (
    <div className={`group flex items-center gap-4 p-4 rounded-2xl border-2 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl ${
      isDeleting ? 'animate-slide-out-right opacity-0 scale-95' : ''
    } ${
      todo.completed 
        ? `${darkMode ? 'bg-green-900/30 border-green-500/50' : 'bg-green-50 border-green-300'} opacity-80` 
        : `${darkMode ? 'bg-gray-700/50 border-purple-500/30 hover:border-purple-400' : 'bg-white/90 border-purple-200 hover:border-purple-400'} hover:shadow-purple-500/20`
    }`}>
      
      {/* Priority indicator */}
      <div className={`flex-shrink-0 w-3 h-8 ${priorityConfig.color} rounded-full ${priorityConfig.glow} shadow-lg`}></div>
      
      {/* Completion toggle button */}
      <Button
        variant="outline"
        size="sm"
        className={`flex-shrink-0 w-10 h-10 rounded-full p-0 transition-all duration-300 transform hover:scale-110 ${
          todo.completed
            ? 'bg-green-500 border-green-500 text-white hover:bg-green-600 shadow-lg shadow-green-500/50'
            : `border-gray-300 hover:border-green-400 hover:bg-green-50 ${darkMode ? 'border-gray-600 hover:border-green-400 hover:bg-green-900/30' : ''}`
        }`}
        onClick={() => onToggle(todo.id)}
      >
        {todo.completed ? (
          <span className="text-lg animate-bounce">✅</span>
        ) : (
          <Check className="w-5 h-5" />
        )}
      </Button>

      {/* Task content */}
      <div className="flex-1 space-y-1">
        <div className="flex items-center gap-2">
          <span 
            className={`flex-1 text-lg font-medium transition-all duration-300 cursor-pointer ${
              todo.completed 
                ? `line-through ${darkMode ? 'text-gray-400' : 'text-gray-500'} animate-pulse` 
                : `${darkMode ? 'text-white' : 'text-gray-800'} hover:text-purple-600`
            }`}
            onClick={() => onToggle(todo.id)}
          >
            {todo.text}
          </span>
          
          {/* Priority badge */}
          <div className={`px-3 py-1 rounded-full text-xs font-bold text-white ${priorityConfig.color} shadow-lg ${priorityConfig.glow} flex items-center gap-1`}>
            <span>{priorityConfig.emoji}</span>
            <span>{priorityConfig.text}</span>
          </div>
        </div>
        
        {/* Timestamp */}
        <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          Created: {new Date(todo.createdAt).toLocaleDateString()}
        </div>
      </div>

      {/* Delete button */}
      <Button
        variant="ghost"
        size="sm"
        className={`flex-shrink-0 w-10 h-10 p-0 text-red-500 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-red-50 hover:text-red-700 hover:scale-110 transform ${
          darkMode ? 'hover:bg-red-900/30' : ''
        }`}
        onClick={handleDelete}
      >
        <Trash2 className="w-5 h-5" />
      </Button>
    </div>
  );
};

export default TodoItem;
