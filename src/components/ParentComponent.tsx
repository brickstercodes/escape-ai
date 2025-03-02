import React from 'react';
import StoryPanel from './StoryPanel';

const ParentComponent = () => {
  const handleContinue = () => {
    console.log('Continue action triggered');
    // Add any additional logic here
  };

  return (
    <div>
      <StoryPanel 
        text="Josh awakens with a dull pain in his head..."
        isIntro={true}
        onContinue={handleContinue}
        currentLevel={0}
        onLevelChange={function (level: number): void {
          throw new Error('Function not implemented.');
        } }
      />
    </div>
  );
};

export default ParentComponent; 