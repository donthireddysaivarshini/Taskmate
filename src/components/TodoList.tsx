
import React, { useState } from 'react';
import { Plus, ListTodo, CheckCircle2, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTodos } from '@/hooks/useTodos';
import TodoItem from './TodoItem';

const TodoList: React.FC = () => {
  const { todos, addTodo, deleteTodo, toggleTodo, getStats } = useTodos();
  const [inputValue, setInputValue] = useState('');
  const stats = getStats();

  // Handle form submission to add new task
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addTodo(inputValue);
    setInputValue('');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header with statistics */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2 text-4xl font-bold text-gray-800">
          <ListTodo className="w-10 h-10 text-blue-600" />
          Todo List
        </div>
        
        {/* Statistics cards */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center gap-2 text-blue-600 mb-1">
                <ListTodo className="w-5 h-5" />
                <span className="font-semibold">Total</span>
              </div>
              <div className="text-2xl font-bold text-blue-800">{stats.total}</div>
            </CardContent>
          </Card>
          
          <Card className="bg-green-50 border-green-200">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center gap-2 text-green-600 mb-1">
                <CheckCircle2 className="w-5 h-5" />
                <span className="font-semibold">Done</span>
              </div>
              <div className="text-2xl font-bold text-green-800">{stats.completed}</div>
            </CardContent>
          </Card>
          
          <Card className="bg-orange-50 border-orange-200">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center gap-2 text-orange-600 mb-1">
                <Clock className="w-5 h-5" />
                <span className="font-semibold">Pending</span>
              </div>
              <div className="text-2xl font-bold text-orange-800">{stats.pending}</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Add new task form */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg">Add New Task</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              type="text"
              placeholder="Enter a new task..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="flex-1 text-lg h-12"
            />
            <Button 
              type="submit" 
              size="lg"
              className="px-6 bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Tasks list */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg">
            Your Tasks {todos.length > 0 && `(${todos.length})`}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {todos.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <ListTodo className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-lg">No tasks yet!</p>
              <p className="text-sm">Add your first task above to get started.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {todos.map((todo) => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  onToggle={toggleTodo}
                  onDelete={deleteTodo}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TodoList;
