
import React from 'react';
import { CheckCircle2, Target, Clock } from 'lucide-react';

interface EmptyStateProps {
  darkMode: boolean;
  activeTab: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ darkMode, activeTab }) => {
  const getEmptyStateContent = () => {
    switch (activeTab) {
      case 'active':
        return {
          icon: Clock,
          title: 'No active tasks',
          message: 'All caught up! Add a new task to get started.',
          color: 'text-blue-500'
        };
      case 'completed':
        return {
          icon: CheckCircle2,
          title: 'No completed tasks yet',
          message: 'Complete some tasks to see your progress here.',
          color: 'text-green-500'
        };
      default:
        return {
          icon: Target,
          title: 'No tasks yet',
          message: 'Create your first task to start being productive.',
          color: 'text-purple-500'
        };
    }
  };

  const content = getEmptyStateContent();
  const IconComponent = content.icon;

  return (
    <div className="text-center py-16 space-y-4">
      <div className={`flex justify-center mb-4`}>
        <div className={`p-4 rounded-full ${darkMode ? 'bg-slate-700' : 'bg-slate-100'}`}>
          <IconComponent className={`w-8 h-8 ${content.color}`} />
        </div>
      </div>
      
      <div className="space-y-2">
        <h3 className={`text-xl font-semibold ${
          darkMode ? 'text-white' : 'text-slate-900'
        }`}>
          {content.title}
        </h3>
        <p className={`text-base ${
          darkMode ? 'text-slate-400' : 'text-slate-600'
        }`}>
          {content.message}
        </p>
      </div>
    </div>
  );
};

export default EmptyState;
