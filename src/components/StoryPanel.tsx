import React from 'react';

interface StoryPanelProps {
  currentLevel: number;
  onLevelChange: (level: number) => void;
  text: string;
  isIntro: boolean;
  onContinue: () => void;
}

const StoryPanel: React.FC<StoryPanelProps> = ({ 
  currentLevel, 
  onLevelChange, 
  text, 
  isIntro, 
  onContinue 
}) => {
  const stories = [
    'Welcome to Level 1: The Beginning!',
    'Level 2: The Challenge Intensifies!',
    'Level 3: The Journey Continues!',
    'Level 4: The Midway Point!',
    'Level 5: The Final Stretch!',
    'Level 6: The Ultimate Test!',
    'Level 7: The Grand Finale!'
  ];

  return (
    <div className="story-panel">
      <h1>Story Panel</h1>
      <button 
        onClick={() => onLevelChange(currentLevel + 1)}
        className="force-next-level-button" 
        style={{ position: 'absolute', top: '10px', right: '10px' }}
      >
        Force Next Level
      </button>
      <p>{isIntro ? text : stories[currentLevel]}</p>
      <div className="navigation">
        <button 
          onClick={() => onLevelChange(currentLevel - 1)} 
          disabled={currentLevel === 0}
        >
          Previous
        </button>
        <button 
          onClick={onContinue} 
          disabled={currentLevel === stories.length - 1}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default StoryPanel;