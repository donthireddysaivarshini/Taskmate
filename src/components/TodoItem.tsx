
import React from 'react';
import { Trash2, Check } from 'lucide-react';
import { Todo } from '@/hooks/useTodos';
import { Button } from '@/components/ui/button';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo, onToggle, onDelete }) => {
  return (
    <div className={`group flex items-center gap-3 p-4 rounded-lg border transition-all duration-200 hover:shadow-md ${
      todo.completed 
        ? 'bg-green-50 border-green-200 opacity-75' 
        : 'bg-white border-gray-200 hover:border-blue-300'
    }`}>
      {/* Completion toggle button */}
      <Button
        variant="outline"
        size="sm"
        className={`flex-shrink-0 w-8 h-8 rounded-full p-0 transition-all duration-200 ${
          todo.completed
            ? 'bg-green-500 border-green-500 text-white hover:bg-green-600'
            : 'border-gray-300 hover:border-green-400 hover:bg-green-50'
        }`}
        onClick={() => onToggle(todo.id)}
      >
        {todo.completed && <Check className="w-4 h-4" />}
      </Button>

      {/* Task text */}
      <span 
        className={`flex-1 transition-all duration-200 ${
          todo.completed 
            ? 'line-through text-gray-500' 
            : 'text-gray-800'
        }`}
        onClick={() => onToggle(todo.id)}
      >
        {todo.text}
      </span>

      {/* Delete button */}
      <Button
        variant="ghost"
        size="sm"
        className="flex-shrink-0 w-8 h-8 p-0 text-red-500 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-red-50 hover:text-red-700"
        onClick={() => onDelete(todo.id)}
      >
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
  );
};

export default TodoItem;
