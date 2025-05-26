
import React, { useEffect, useState } from 'react';

const ConfettiEffect: React.FC = () => {
  const [particles, setParticles] = useState<Array<{
    id: number;
    x: number;
    y: number;
    color: string;
    delay: number;
  }>>([]);

  useEffect(() => {
    const colors = ['#ff6b9d', '#ffd93d', '#6bcf7f', '#4d9fff', '#ff8c42', '#c74dff'];
    const newParticles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      color: colors[Math.floor(Math.random() * colors.length)],
      delay: Math.random() * 2,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute w-3 h-3 rounded-full animate-bounce"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            backgroundColor: particle.color,
            animationDelay: `${particle.delay}s`,
            animationDuration: '2s',
            boxShadow: `0 0 10px ${particle.color}`,
          }}
        />
      ))}
      
      {/* Celebration text */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="text-6xl font-bold text-white text-center animate-pulse">
          🎉 AMAZING! 🎉
        </div>
        <div className="text-2xl text-white text-center mt-2 font-['Poppins']">
          Task completed! You're awesome! ⭐
        </div>
      </div>
    </div>
  );
};

export default ConfettiEffect;
