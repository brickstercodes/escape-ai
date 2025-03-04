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
  // Updated titles to include sequence level
  const stories = [
    'The Control Room: First Contact',
    'Engineering Bay: Power Systems',
    'Science Lab: Strange Discoveries',
    'Maintenance: Life Support Systems',
    'Escape Pod Security: Human Verification',
    'Final Confrontation: Survival'
  ];

  // Get appropriate header based on level and type
  const getHeader = () => {
    if (isIntro) {
      return `Mission Log: ${stories[currentLevel]}`;
    }
    if (currentLevel === 5) { // Last level (creative encounter)
      return 'Mission Accomplished';
    }
    return `Mission Update: Level ${currentLevel + 1} Complete`;
  };

  // Get appropriate button text
  const getButtonText = () => {
    if (currentLevel === 5) return 'Complete Mission';
    if (isIntro) return 'Begin Mission';
    return 'Continue';
  };

  return (
    <div className="story-panel">
      <h1>{getHeader()}</h1>
      
      <div className="story-content">
        <p>{text}</p>
      </div>
      
      <div className="navigation">
        {/* Only show Previous button in development */}
        {process.env.NODE_ENV === 'development' && (
          <button 
            onClick={() => onLevelChange(currentLevel - 1)} 
            disabled={currentLevel === 0}
          >
            Previous
          </button>
        )}
        
        <button 
          onClick={onContinue} 
          className="continue-button"
          disabled={currentLevel >= stories.length}
        >
          {getButtonText()}
        </button>
      </div>
    </div>
  );
};

export default StoryPanel;