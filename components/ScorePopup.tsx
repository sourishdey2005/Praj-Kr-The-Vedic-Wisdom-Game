import React from 'react';

interface ScorePopupProps {
  points: number;
}

const ScorePopup: React.FC<ScorePopupProps> = ({ points }) => {
  return (
    <div className="absolute -top-8 right-0 animate-score-popup text-2xl font-bold text-green-300 drop-shadow-lg pointer-events-none">
      +{points}
    </div>
  );
};

export default ScorePopup;
