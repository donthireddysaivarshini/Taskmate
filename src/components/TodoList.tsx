
import React, { useState } from 'react';
import { Plus, ListTodo, CheckCircle2, Clock, Moon, Sun, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { useTodos } from '@/hooks/useTodos';
import TodoItem from './TodoItem';
import EmptyState from './EmptyState';
import ConfettiEffect from './ConfettiEffect';

const TodoList: React.FC = () => {
  const { todos, addTodo, deleteTodo, toggleTodo, getStats } = useTodos();
  const [inputValue, setInputValue] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [darkMode, setDarkMode] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  
  const stats = getStats();
  const completionPercentage = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;
  
  const allTasksCompleted = stats.total > 0 && stats.completed === stats.total;

  // Handle form submission to add new task
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      addTodo(inputValue.trim(), priority);
      setInputValue('');
      setPriority('medium');
    }
  };

  // Handle task completion with confetti
  const handleToggleTask = (id: string) => {
    const task = todos.find(t => t.id === id);
    if (task && !task.completed) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
    toggleTodo(id);
  };

  // Filter todos based on active tab
  const getFilteredTodos = () => {
    switch (activeTab) {
      case 'active':
        return todos.filter(todo => !todo.completed);
      case 'completed':
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  };

  const filteredTodos = getFilteredTodos();

  return (
    <div className={`min-h-screen transition-all duration-500 ${
      darkMode 
        ? 'bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900' 
        : 'bg-gradient-to-br from-purple-400 via-pink-400 to-orange-400'
    } py-8 px-4 relative overflow-hidden`}>
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-2 h-2 bg-white/20 rounded-full animate-pulse"></div>
        <div className="absolute top-20 right-20 w-1 h-1 bg-white/30 rounded-full animate-ping"></div>
        <div className="absolute bottom-20 left-20 w-3 h-3 bg-white/10 rounded-full animate-bounce"></div>
        <div className="absolute bottom-10 right-10 w-1 h-1 bg-white/40 rounded-full animate-pulse"></div>
      </div>

      {/* Confetti Effect */}
      {showConfetti && <ConfettiEffect />}

      <div className="max-w-4xl mx-auto space-y-6 relative z-10">
        {/* Header with dark mode toggle */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-white">
              <div className="flex items-center gap-2 text-4xl font-bold font-['Poppins']">
                <Sparkles className="w-10 h-10 text-yellow-300 animate-pulse" />
                ✨ Fun Todo List
              </div>
            </div>
            
            {/* Dark mode toggle */}
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-full p-2">
              <Sun className={`w-5 h-5 transition-colors ${darkMode ? 'text-gray-400' : 'text-yellow-300'}`} />
              <Switch 
                checked={darkMode} 
                onCheckedChange={setDarkMode}
                className="data-[state=checked]:bg-purple-600"
              />
              <Moon className={`w-5 h-5 transition-colors ${darkMode ? 'text-blue-300' : 'text-gray-400'}`} />
            </div>
          </div>

          {/* Progress bar */}
          {stats.total > 0 && (
            <div className="space-y-2">
              <div className="flex justify-between text-white font-semibold">
                <span>Progress: {stats.completed}/{stats.total} tasks</span>
                <span>{completionPercentage}% Complete</span>
              </div>
              <Progress 
                value={completionPercentage} 
                className="h-3 bg-white/20"
              />
              {allTasksCompleted && (
                <div className="text-2xl animate-bounce">
                  🎉 All tasks completed! Time to celebrate! 🎉
                </div>
              )}
            </div>
          )}
        </div>

        {/* Add new task form */}
        <Card className={`shadow-2xl backdrop-blur-sm border-0 ${
          darkMode ? 'bg-gray-800/50' : 'bg-white/20'
        } transition-all duration-300 hover:scale-[1.02]`}>
          <CardHeader>
            <CardTitle className={`text-xl font-['Poppins'] ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              ✨ Add New Adventure
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="What exciting task awaits? 🚀"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className={`flex-1 text-lg h-12 border-2 transition-all duration-200 focus:scale-[1.02] ${
                    darkMode 
                      ? 'bg-gray-700/50 border-purple-500 text-white placeholder:text-gray-300' 
                      : 'bg-white/80 border-purple-300 text-gray-800'
                  }`}
                />
                
                {/* Priority selector */}
                <select 
                  value={priority} 
                  onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')}
                  className={`px-4 py-2 rounded-lg border-2 transition-all duration-200 ${
                    darkMode 
                      ? 'bg-gray-700/50 border-purple-500 text-white' 
                      : 'bg-white/80 border-purple-300 text-gray-800'
                  }`}
                >
                  <option value="low">🌱 Chill</option>
                  <option value="medium">⚡ Normal</option>
                  <option value="high">🔥 Urgent</option>
                </select>
              </div>
              
              <Button 
                type="submit" 
                size="lg"
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg transform"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add to Adventure List! 🎯
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Tasks with tabs */}
        <Card className={`shadow-2xl backdrop-blur-sm border-0 ${
          darkMode ? 'bg-gray-800/50' : 'bg-white/20'
        } transition-all duration-300`}>
          <CardHeader>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className={`grid w-full grid-cols-3 ${
                darkMode ? 'bg-gray-700/50' : 'bg-white/30'
              }`}>
                <TabsTrigger value="all" className="font-semibold">
                  📋 All ({todos.length})
                </TabsTrigger>
                <TabsTrigger value="active" className="font-semibold">
                  ⚡ Active ({stats.pending})
                </TabsTrigger>
                <TabsTrigger value="completed" className="font-semibold">
                  ✅ Done ({stats.completed})
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          
          <CardContent>
            {filteredTodos.length === 0 ? (
              <EmptyState darkMode={darkMode} activeTab={activeTab} />
            ) : (
              <div className="space-y-3">
                {filteredTodos.map((todo, index) => (
                  <div 
                    key={todo.id}
                    style={{ animationDelay: `${index * 100}ms` }}
                    className="animate-fade-in"
                  >
                    <TodoItem
                      todo={todo}
                      onToggle={handleToggleTask}
                      onDelete={deleteTodo}
                      darkMode={darkMode}
                    />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Floating add button */}
      <Button
        onClick={() => document.querySelector('input')?.focus()}
        className="fixed bottom-8 right-8 w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-2xl transition-all duration-300 hover:scale-110 transform z-50"
        size="icon"
      >
        <Plus className="w-8 h-8 text-white" />
      </Button>
    </div>
  );
};

export default TodoList;
