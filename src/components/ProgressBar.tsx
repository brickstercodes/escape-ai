import React from 'react';

interface ProgressBarProps {
  currentLevel: number;
  totalLevels: number;
}

export default function ProgressBar({ currentLevel, totalLevels }: ProgressBarProps) {
  const progress = (currentLevel / totalLevels) * 100;
  
  return (
    <div className="progress-container">
      <div 
        className="progress-bar"
        style={{ width: `${progress}%` }}
        title={`Level ${currentLevel} of ${totalLevels}`}
      />
    </div>
  );
}
