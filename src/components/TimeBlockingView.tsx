
import React, { useState } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Calendar, Clock, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Todo } from '@/hooks/useTodos';

interface TimeBlockingViewProps {
  todos: Todo[];
  darkMode: boolean;
  onUpdateTodo: (id: string, updates: Partial<Todo>) => void;
}

interface TimeSlot {
  id: string;
  day: string;
  hour: number;
  todoId?: string;
}

interface ScheduledTask {
  todoId: string;
  day: string;
  hour: number;
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const HOURS = Array.from({ length: 12 }, (_, i) => i + 8); // 8 AM to 7 PM

const DraggableTask: React.FC<{ todo: Todo; darkMode: boolean }> = ({ todo, darkMode }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'task',
    item: { todoId: todo.id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const getCategoryConfig = (category: string) => {
    switch (category) {
      case 'study':
        return { emoji: '📚', color: 'bg-blue-500/20 border-blue-400' };
      case 'skill':
        return { emoji: '🧠', color: 'bg-purple-500/20 border-purple-400' };
      case 'career':
        return { emoji: '🚀', color: 'bg-green-500/20 border-green-400' };
      case 'goal':
        return { emoji: '🎯', color: 'bg-orange-500/20 border-orange-400' };
      default:
        return { emoji: '📝', color: 'bg-gray-500/20 border-gray-400' };
    }
  };

  const categoryConfig = getCategoryConfig(todo.category);

  return (
    <div
      ref={drag}
      className={`p-2 rounded-lg border-2 cursor-move transition-all duration-200 ${
        isDragging ? 'opacity-50 scale-95' : 'hover:scale-105'
      } ${categoryConfig.color} ${
        darkMode ? 'bg-gray-700/50' : 'bg-white/90'
      }`}
    >
      <div className="flex items-center gap-2">
        <span>{categoryConfig.emoji}</span>
        <span className={`text-sm font-medium truncate ${
          darkMode ? 'text-white' : 'text-gray-800'
        }`}>
          {todo.text}
        </span>
      </div>
    </div>
  );
};

const TimeSlotComponent: React.FC<{
  day: string;
  hour: number;
  scheduledTask?: Todo;
  darkMode: boolean;
  onDropTask: (todoId: string, day: string, hour: number) => void;
  onRemoveTask: (day: string, hour: number) => void;
}> = ({ day, hour, scheduledTask, darkMode, onDropTask, onRemoveTask }) => {
  const [{ isOver }, drop] = useDrop({
    accept: 'task',
    drop: (item: { todoId: string }) => {
      onDropTask(item.todoId, day, hour);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  const formatTime = (hour: number) => {
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}:00 ${period}`;
  };

  return (
    <div
      ref={drop}
      className={`min-h-[60px] p-2 border-2 border-dashed transition-all duration-200 rounded-lg ${
        isOver 
          ? 'border-purple-400 bg-purple-100/50 scale-105' 
          : `border-gray-300 ${darkMode ? 'border-gray-600' : ''}`
      } ${
        darkMode ? 'bg-gray-700/30' : 'bg-gray-50/50'
      }`}
    >
      {scheduledTask ? (
        <div className="relative group">
          <DraggableTask todo={scheduledTask} darkMode={darkMode} />
          <Button
            variant="ghost"
            size="sm"
            className="absolute -top-1 -right-1 w-6 h-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity bg-red-500 hover:bg-red-600 text-white rounded-full"
            onClick={() => onRemoveTask(day, hour)}
          >
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>
      ) : (
        <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} text-center pt-4`}>
          Drop task here
        </div>
      )}
    </div>
  );
};

const TimeBlockingView: React.FC<TimeBlockingViewProps> = ({ todos, darkMode }) => {
  const [scheduledTasks, setScheduledTasks] = useState<ScheduledTask[]>([]);

  const unscheduledTasks = todos.filter(
    todo => !todo.completed && !scheduledTasks.some(st => st.todoId === todo.id)
  );

  const handleDropTask = (todoId: string, day: string, hour: number) => {
    setScheduledTasks(prev => {
      const filtered = prev.filter(st => !(st.day === day && st.hour === hour));
      return [...filtered, { todoId, day, hour }];
    });
  };

  const handleRemoveTask = (day: string, hour: number) => {
    setScheduledTasks(prev => prev.filter(st => !(st.day === day && st.hour === hour)));
  };

  const getScheduledTask = (day: string, hour: number): Todo | undefined => {
    const scheduled = scheduledTasks.find(st => st.day === day && st.hour === hour);
    return scheduled ? todos.find(todo => todo.id === scheduled.todoId) : undefined;
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <h2 className={`text-2xl font-bold flex items-center justify-center gap-2 ${
            darkMode ? 'text-white' : 'text-gray-800'
          }`}>
            <Calendar className="w-6 h-6" />
            📅 Weekly Time Blocks
          </h2>
          <p className={`mt-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Drag and drop your tasks to schedule them throughout the week
          </p>
        </div>

        {/* Unscheduled Tasks */}
        <Card className={`${darkMode ? 'bg-gray-800/50' : 'bg-white/20'} backdrop-blur-sm border-0`}>
          <CardHeader>
            <CardTitle className={`text-lg ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              📋 Unscheduled Tasks ({unscheduledTasks.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {unscheduledTasks.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {unscheduledTasks.map(todo => (
                  <DraggableTask key={todo.id} todo={todo} darkMode={darkMode} />
                ))}
              </div>
            ) : (
              <div className={`text-center py-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                🎉 All tasks are scheduled! Great planning!
              </div>
            )}
          </CardContent>
        </Card>

        {/* Weekly Calendar Grid */}
        <Card className={`${darkMode ? 'bg-gray-800/50' : 'bg-white/20'} backdrop-blur-sm border-0`}>
          <CardHeader>
            <CardTitle className={`text-lg ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              🗓️ Weekly Schedule
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <div className="min-w-[800px]">
                {/* Header Row */}
                <div className="grid grid-cols-8 gap-2 mb-4">
                  <div className={`p-2 text-center font-semibold ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    <Clock className="w-4 h-4 mx-auto mb-1" />
                    Time
                  </div>
                  {DAYS.map(day => (
                    <div
                      key={day}
                      className={`p-2 text-center font-semibold rounded-lg ${
                        darkMode ? 'text-white bg-gray-700/50' : 'text-gray-800 bg-gray-100'
                      }`}
                    >
                      {day.slice(0, 3)}
                    </div>
                  ))}
                </div>

                {/* Time Slots */}
                {HOURS.map(hour => (
                  <div key={hour} className="grid grid-cols-8 gap-2 mb-2">
                    <div className={`p-2 text-center text-sm font-medium ${
                      darkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {hour >= 12 ? `${hour > 12 ? hour - 12 : hour}:00 PM` : `${hour}:00 AM`}
                    </div>
                    {DAYS.map(day => (
                      <TimeSlotComponent
                        key={`${day}-${hour}`}
                        day={day}
                        hour={hour}
                        scheduledTask={getScheduledTask(day, hour)}
                        darkMode={darkMode}
                        onDropTask={handleDropTask}
                        onRemoveTask={handleRemoveTask}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <Card className={`${darkMode ? 'bg-gray-800/50' : 'bg-white/20'} backdrop-blur-sm border-0`}>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div>
                <div className={`text-2xl font-bold ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
                  {scheduledTasks.length}
                </div>
                <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Scheduled Tasks
                </div>
              </div>
              <div>
                <div className={`text-2xl font-bold ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                  {unscheduledTasks.length}
                </div>
                <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Unscheduled Tasks
                </div>
              </div>
              <div>
                <div className={`text-2xl font-bold ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>
                  {Math.round((scheduledTasks.length / (scheduledTasks.length + unscheduledTasks.length) * 100) || 0)}%
                </div>
                <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Planning Complete
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DndProvider>
  );
};

export default TimeBlockingView;
