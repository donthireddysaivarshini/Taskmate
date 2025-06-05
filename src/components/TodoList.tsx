
import React, { useState } from 'react';
import { Plus, CheckCircle2, Clock, Moon, Sun, Target, Filter } from 'lucide-react';
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
  const { todos, addTodo, deleteTodo, toggleTodo, getStats, getCategoryStats } = useTodos();
  const [inputValue, setInputValue] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [category, setCategory] = useState<'study' | 'skill' | 'career' | 'goal' | 'general'>('general');
  const [darkMode, setDarkMode] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  
  const stats = getStats();
  const categoryStats = getCategoryStats();
  const completionPercentage = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;
  
  const allTasksCompleted = stats.total > 0 && stats.completed === stats.total;

  // Handle form submission to add new task
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      addTodo(inputValue.trim(), priority, category);
      setInputValue('');
      setPriority('medium');
      setCategory('general');
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

  // Filter todos based on active tab and category
  const getFilteredTodos = () => {
    let filtered = todos;
    
    // Filter by completion status
    switch (activeTab) {
      case 'active':
        filtered = todos.filter(todo => !todo.completed);
        break;
      case 'completed':
        filtered = todos.filter(todo => todo.completed);
        break;
      default:
        filtered = todos;
    }
    
    // Filter by category
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(todo => todo.category === categoryFilter);
    }
    
    return filtered;
  };

  const filteredTodos = getFilteredTodos();

  const getCategoryConfig = (categoryType: string) => {
    switch (categoryType) {
      case 'study':
        return { name: 'Study', color: 'bg-blue-100 text-blue-800 border-blue-200' };
      case 'skill':
        return { name: 'Skill', color: 'bg-purple-100 text-purple-800 border-purple-200' };
      case 'career':
        return { name: 'Career', color: 'bg-green-100 text-green-800 border-green-200' };
      case 'goal':
        return { name: 'Goal', color: 'bg-orange-100 text-orange-800 border-orange-200' };
      default:
        return { name: 'General', color: 'bg-gray-100 text-gray-800 border-gray-200' };
    }
  };

  return (
    <div className={`min-h-screen transition-all duration-300 ${
      darkMode 
        ? 'bg-slate-900' 
        : 'bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50'
    } relative overflow-hidden`}>
      {/* Subtle background animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute top-0 left-0 w-full h-full opacity-30 ${
          darkMode ? 'bg-gradient-to-br from-purple-900/20 to-blue-900/20' : 'bg-gradient-to-br from-blue-100/50 to-purple-100/50'
        } animate-pulse`}></div>
      </div>

      {/* Confetti Effect for success */}
      {showConfetti && <ConfettiEffect />}

      <div className="max-w-6xl mx-auto p-6 space-y-6 relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <Target className="w-8 h-8 text-blue-600" />
              <h1 className={`text-3xl font-semibold tracking-tight ${
                darkMode ? 'text-white' : 'text-slate-900'
              }`}>
                StudyFlow Pro
              </h1>
            </div>
          </div>
          
          {/* Dark mode toggle */}
          <div className="flex items-center gap-3">
            <Sun className={`w-5 h-5 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`} />
            <Switch 
              checked={darkMode} 
              onCheckedChange={setDarkMode}
            />
            <Moon className={`w-5 h-5 ${darkMode ? 'text-slate-300' : 'text-slate-400'}`} />
          </div>
        </div>

        {/* Progress Overview */}
        {stats.total > 0 && (
          <Card className={`${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} shadow-sm`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`text-sm font-medium ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                  Progress Overview
                </div>
                <div className={`text-sm font-semibold ${darkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                  {stats.completed}/{stats.total} completed
                </div>
              </div>
              <Progress 
                value={completionPercentage} 
                className={`h-2 ${darkMode ? 'bg-slate-700' : 'bg-slate-100'}`}
              />
              {allTasksCompleted && (
                <div className={`mt-4 text-center text-lg font-medium ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
                  🎉 All tasks completed! Excellent work!
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Add Task Section */}
        <Card className={`${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} shadow-sm`}>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex gap-3">
                <Input
                  type="text"
                  placeholder="Enter task title... (e.g. Submit ML assignment)"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className={`flex-1 h-11 text-base ${
                    darkMode 
                      ? 'bg-slate-700 border-slate-600 text-white placeholder:text-slate-400' 
                      : 'bg-white border-slate-300 text-slate-900 placeholder:text-slate-500'
                  } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                />
                <Button 
                  type="submit" 
                  className="h-11 px-6 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Task
                </Button>
              </div>
              
              <div className="flex gap-3">
                <select 
                  value={category} 
                  onChange={(e) => setCategory(e.target.value as any)}
                  className={`px-4 py-2 rounded-lg border text-sm font-medium ${
                    darkMode 
                      ? 'bg-slate-700 border-slate-600 text-white' 
                      : 'bg-white border-slate-300 text-slate-700'
                  } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                >
                  <option value="general">General</option>
                  <option value="study">Study</option>
                  <option value="skill">Skill Building</option>
                  <option value="career">Career</option>
                  <option value="goal">Weekly Goal</option>
                </select>
                
                <select 
                  value={priority} 
                  onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')}
                  className={`px-4 py-2 rounded-lg border text-sm font-medium ${
                    darkMode 
                      ? 'bg-slate-700 border-slate-600 text-white' 
                      : 'bg-white border-slate-300 text-slate-700'
                  } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                >
                  <option value="low">Low Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="high">High Priority</option>
                </select>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Category Filters */}
        <Card className={`${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} shadow-sm`}>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 flex-wrap">
              <Filter className={`w-4 h-4 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`} />
              <Button
                variant={categoryFilter === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setCategoryFilter('all')}
                className="rounded-full text-sm"
              >
                All ({todos.length})
              </Button>
              {['study', 'skill', 'career', 'goal', 'general'].map((cat) => {
                const config = getCategoryConfig(cat);
                const count = categoryStats[cat]?.total || 0;
                return (
                  <Button
                    key={cat}
                    variant={categoryFilter === cat ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setCategoryFilter(cat)}
                    className="rounded-full text-sm"
                  >
                    {config.name} ({count})
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Tasks Section */}
        <Card className={`${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} shadow-sm`}>
          <CardHeader className="pb-4">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className={`grid w-full grid-cols-3 ${darkMode ? 'bg-slate-700' : 'bg-slate-100'}`}>
                <TabsTrigger value="all" className="text-sm font-medium">
                  All ({todos.length})
                </TabsTrigger>
                <TabsTrigger value="active" className="text-sm font-medium">
                  Active ({stats.pending})
                </TabsTrigger>
                <TabsTrigger value="completed" className="text-sm font-medium">
                  Completed ({stats.completed})
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          
          <CardContent className="pt-0">
            {filteredTodos.length === 0 ? (
              <EmptyState darkMode={darkMode} activeTab={activeTab} />
            ) : (
              <div className="space-y-3">
                {filteredTodos.map((todo, index) => (
                  <div 
                    key={todo.id}
                    style={{ animationDelay: `${index * 50}ms` }}
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

      {/* Floating Add Button */}
      <Button
        onClick={() => document.querySelector('input')?.focus()}
        className="fixed bottom-8 right-8 w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg transition-all duration-300 hover:scale-105 z-50"
        size="icon"
      >
        <Plus className="w-6 h-6 text-white" />
      </Button>
    </div>
  );
};

export default TodoList;
