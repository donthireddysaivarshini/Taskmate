
import { useState } from 'react';

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
}

export const useTodos = () => {
  const [todos, setTodos] = useState<Todo[]>([]);

  // Add a new task to the list
  const addTodo = (text: string) => {
    if (text.trim() === '') return;
    
    const newTodo: Todo = {
      id: Date.now().toString(),
      text: text.trim(),
      completed: false,
      createdAt: new Date()
    };
    
    setTodos(prevTodos => [newTodo, ...prevTodos]);
    console.log('Added new todo:', newTodo);
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

  return {
    todos,
    addTodo,
    deleteTodo,
    toggleTodo,
    getStats
  };
};
