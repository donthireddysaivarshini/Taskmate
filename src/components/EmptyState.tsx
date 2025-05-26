
import React from 'react';

interface EmptyStateProps {
  darkMode: boolean;
  activeTab: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ darkMode, activeTab }) => {
  const getEmptyStateContent = () => {
    switch (activeTab) {
      case 'active':
        return {
          emoji: '🎯',
          title: 'No active tasks!',
          message: 'Time to add some exciting adventures!',
          illustration: '🚀'
        };
      case 'completed':
        return {
          emoji: '🏆',
          title: 'No completed tasks yet!',
          message: 'Complete some tasks to see them here!',
          illustration: '⭐'
        };
      default:
        return {
          emoji: '🐱',
          title: 'No tasks yet!',
          message: 'Time to relax and maybe add some fun tasks!',
          illustration: '😴'
        };
    }
  };

  const content = getEmptyStateContent();

  return (
    <div className="text-center py-16 space-y-6">
      {/* Animated illustration */}
      <div className="relative">
        <div className="text-8xl animate-bounce">
          {content.illustration}
        </div>
        <div className="text-4xl absolute -top-2 -right-2 animate-pulse">
          {content.emoji}
        </div>
      </div>
      
      {/* Text content */}
      <div className="space-y-2">
        <h3 className={`text-2xl font-bold font-['Poppins'] ${
          darkMode ? 'text-white' : 'text-gray-800'
        }`}>
          {content.title}
        </h3>
        <p className={`text-lg ${
          darkMode ? 'text-gray-300' : 'text-gray-600'
        }`}>
          {content.message}
        </p>
      </div>

      {/* Decorative elements */}
      <div className="flex justify-center gap-4 text-2xl">
        <span className="animate-pulse">✨</span>
        <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>🌟</span>
        <span className="animate-pulse" style={{ animationDelay: '0.4s' }}>💫</span>
      </div>
    </div>
  );
};

export default EmptyState;
