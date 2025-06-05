import React, { useState } from 'react';
import { Plus, ListTodo, CheckCircle2, Clock, Moon, Sun, Sparkles, BookOpen, Brain, Rocket, Target } from 'lucide-react';
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
import TimeBlockingView from './TimeBlockingView';

const TodoList: React.FC = () => {
  const { todos, addTodo, deleteTodo, toggleTodo, getStats, getCategoryStats } = useTodos();
  const [inputValue, setInputValue] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [category, setCategory] = useState<'study' | 'skill' | 'career' | 'goal' | 'general'>('general');
  const [darkMode, setDarkMode] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [mainTab, setMainTab] = useState('tasks'); // Add this new state for main navigation
  
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
        return { emoji: '📚', name: 'Study Tasks', icon: BookOpen, color: 'bg-blue-500' };
      case 'skill':
        return { emoji: '🧠', name: 'Skill Building', icon: Brain, color: 'bg-purple-500' };
      case 'career':
        return { emoji: '🚀', name: 'Career Tasks', icon: Rocket, color: 'bg-green-500' };
      case 'goal':
        return { emoji: '🎯', name: 'Weekly Goals', icon: Target, color: 'bg-orange-500' };
      default:
        return { emoji: '📝', name: 'General', icon: ListTodo, color: 'bg-gray-500' };
    }
  };

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

      <div className="max-w-5xl mx-auto space-y-6 relative z-10">
        {/* Header with dark mode toggle */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-white">
              <div className="flex items-center gap-2 text-4xl font-bold font-['Poppins']">
                <Sparkles className="w-10 h-10 text-yellow-300 animate-pulse" />
                🎓 StudyFlow Pro
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

        {/* Main Navigation Tabs */}
        <Card className={`shadow-2xl backdrop-blur-sm border-0 ${
          darkMode ? 'bg-gray-800/50' : 'bg-white/20'
        } transition-all duration-300`}>
          <CardContent className="p-4">
            <Tabs value={mainTab} onValueChange={setMainTab} className="w-full">
              <TabsList className={`grid w-full grid-cols-2 ${
                darkMode ? 'bg-gray-700/50' : 'bg-white/30'
              }`}>
                <TabsTrigger value="tasks" className="font-semibold">
                  📋 Task Manager
                </TabsTrigger>
                <TabsTrigger value="timeblocking" className="font-semibold">
                  📅 Time Blocks
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </CardContent>
        </Card>

        {/* Content based on selected main tab */}
        {mainTab === 'tasks' && (
          <>
            {/* Category filter tabs */}
            <Card className={`shadow-2xl backdrop-blur-sm border-0 ${
              darkMode ? 'bg-gray-800/50' : 'bg-white/20'
            } transition-all duration-300`}>
              <CardHeader>
                <CardTitle className={`text-xl font-['Poppins'] ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  📊 Categories
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={categoryFilter === 'all' ? 'default' : 'outline'}
                    onClick={() => setCategoryFilter('all')}
                    className="rounded-full"
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
                        onClick={() => setCategoryFilter(cat)}
                        className="rounded-full flex items-center gap-1"
                      >
                        <span>{config.emoji}</span>
                        <span>{config.name} ({count})</span>
                      </Button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Add new task form */}
            <Card className={`shadow-2xl backdrop-blur-sm border-0 ${
              darkMode ? 'bg-gray-800/50' : 'bg-white/20'
            } transition-all duration-300 hover:scale-[1.02]`}>
              <CardHeader>
                <CardTitle className={`text-xl font-['Poppins'] ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  ✨ Add New Task
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      placeholder="What needs to be done? 🚀"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      className={`flex-1 text-lg h-12 border-2 transition-all duration-200 focus:scale-[1.02] ${
                        darkMode 
                          ? 'bg-gray-700/50 border-purple-500 text-white placeholder:text-gray-300' 
                          : 'bg-white/80 border-purple-300 text-gray-800'
                      }`}
                    />
                  </div>
                  
                  <div className="flex gap-2">
                    {/* Category selector */}
                    <select 
                      value={category} 
                      onChange={(e) => setCategory(e.target.value as any)}
                      className={`px-4 py-2 rounded-lg border-2 transition-all duration-200 ${
                        darkMode 
                          ? 'bg-gray-700/50 border-purple-500 text-white' 
                          : 'bg-white/80 border-purple-300 text-gray-800'
                      }`}
                    >
                      <option value="general">📝 General</option>
                      <option value="study">📚 Study</option>
                      <option value="skill">🧠 Skill Building</option>
                      <option value="career">🚀 Career</option>
                      <option value="goal">🎯 Weekly Goal</option>
                    </select>
                    
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
                    Add Task! 🎯
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
          </>
        )}

        {/* Time Blocking View */}
        {mainTab === 'timeblocking' && (
          <TimeBlockingView 
            todos={todos}
            darkMode={darkMode}
            onUpdateTodo={() => {}} // We'll implement this later if needed
          />
        )}
      </div>

      {/* Floating add button */}
      <Button
        onClick={() => {
          setMainTab('tasks');
          setTimeout(() => document.querySelector('input')?.focus(), 100);
        }}
        className="fixed bottom-8 right-8 w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-2xl transition-all duration-300 hover:scale-110 transform z-50"
        size="icon"
      >
        <Plus className="w-8 h-8 text-white" />
      </Button>
    </div>
  );
};

export default TodoList;
