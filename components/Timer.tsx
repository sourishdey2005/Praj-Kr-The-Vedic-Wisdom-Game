import React from 'react';

interface TimerProps {
  timeLeft: number;
  totalTime: number;
}

const Timer: React.FC<TimerProps> = ({ timeLeft, totalTime }) => {
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const progress = timeLeft / totalTime;
  const offset = circumference - progress * circumference;

  let strokeColor = 'stroke-amber-400';
  if (progress <= 0.5) strokeColor = 'stroke-yellow-500';
  if (progress <= 0.25) strokeColor = 'stroke-red-500';

  return (
    <div className="relative w-16 h-16 md:w-20 md:h-20" role="timer" aria-live="polite" aria-atomic="true" aria-label={`Time left: ${timeLeft} seconds`}>
      <svg className="w-full h-full" viewBox="0 0 100 100">
        {/* Background circle */}
        <circle
          className="stroke-current text-indigo-800/50"
          strokeWidth="8"
          cx="50"
          cy="50"
          r={radius}
          fill="transparent"
        />
        {/* Progress circle */}
        <circle
          className={`transform -rotate-90 origin-center transition-all duration-300 ${strokeColor}`}
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          cx="50"
          cy="50"
          r={radius}
          fill="transparent"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xl md:text-2xl font-bold text-white">{timeLeft}</span>
      </div>
    </div>
  );
};

export default Timer;
