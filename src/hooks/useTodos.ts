
import { useState } from 'react';

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
  priority: 'low' | 'medium' | 'high';
  category: 'study' | 'skill' | 'career' | 'goal' | 'general';
}

export const useTodos = () => {
  const [todos, setTodos] = useState<Todo[]>([]);

  // Add a new task to the list with priority and category
  const addTodo = (
    text: string, 
    priority: 'low' | 'medium' | 'high' = 'medium',
    category: 'study' | 'skill' | 'career' | 'goal' | 'general' = 'general'
  ) => {
    if (text.trim() === '') return;
    
    const newTodo: Todo = {
      id: Date.now().toString(),
      text: text.trim(),
      completed: false,
      createdAt: new Date(),
      priority,
      category
    };
    
    setTodos(prevTodos => [newTodo, ...prevTodos]);
    console.log('Added new todo with category:', newTodo);
  };

  // Remove a task from the list
  const deleteTodo = (id: string) => {
    setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
    console.log('Deleted todo with id:', id);
  };

  // Toggle task completion status
  const toggleTodo = (id: string) => {
    setTodos(prevTodos =>
      prevTodos.map(todo =>
        todo.id === id
          ? { ...todo, completed: !todo.completed }
          : todo
      )
    );
    console.log('Toggled todo completion for id:', id);
  };

  // Get statistics about the todos
  const getStats = () => {
    const total = todos.length;
    const completed = todos.filter(todo => todo.completed).length;
    const pending = total - completed;
    
    return { total, completed, pending };
  };

  // Get stats by category
  const getCategoryStats = () => {
    const categories = ['study', 'skill', 'career', 'goal', 'general'] as const;
    
    return categories.reduce((stats, category) => {
      const categoryTodos = todos.filter(todo => todo.category === category);
      stats[category] = {
        total: categoryTodos.length,
        completed: categoryTodos.filter(todo => todo.completed).length,
        pending: categoryTodos.filter(todo => !todo.completed).length
      };
      return stats;
    }, {} as Record<string, { total: number; completed: number; pending: number }>);
  };

  return {
    todos,
    addTodo,
    deleteTodo,
    toggleTodo,
    getStats,
    getCategoryStats
  };
};
