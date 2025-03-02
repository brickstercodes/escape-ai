import React, { useEffect } from 'react';

interface GameCompleteProps {
  onRestart: () => void;
}

export default function GameComplete({ onRestart }: GameCompleteProps) {
  // Clean up any lingering event listeners or animations when component mounts
  useEffect(() => {
    // Force garbage collection and cleanup
    const cleanup = () => {
      // Clear any potential browser animation frames
      let highestId = window.requestAnimationFrame(() => {});
      while (highestId > 0) {
        window.cancelAnimationFrame(highestId);
        highestId--;
      }
    };
    
    return cleanup;
  }, []);
  
  return (
    <div className="game-complete">
      <h1>Mission Successful!</h1>
      
      <div className="terminal-container">
        <div className="terminal-header">
          <span className="terminal-dot red"></span>
          <span className="terminal-dot yellow"></span>
          <span className="terminal-dot green"></span>
          <span className="terminal-title">josh_transmission.log</span>
        </div>
        
        <div className="complete-content">
          <p>
            <strong>[TRANSMISSION BEGIN]</strong> "I made it! The escape pod is on auto-pilot to the nearest outpost. 
            I can't thank you enough for guiding me through that nightmare."
          </p>
          <p>
            "The data I collected suggests that the ship was part of a classified research mission 
            studying extraterrestrial life forms. Something went wrong, and the specimens got loose. 
            This information needs to reach the Galactic Council immediately."
          </p>
          <p>
            "I'm sending you the coordinates of the ship so it can be quarantined. Let's hope no one 
            else stumbles upon it like I did. <strong>[TRANSMISSION END]</strong>"
          </p>
        </div>
      </div>
      
      <div className="mission-stats">
        <h3>Mission Statistics</h3>
        <div className="stats-container">
          <div className="stat-item">
            <span className="stat-label">Mission Status</span>
            <span className="stat-value success">COMPLETED</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Survivor</span>
            <span className="stat-value">Josh Neeq</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Threat Level</span>
            <span className="stat-value danger">HIGH</span>
          </div>
        </div>
      </div>
      
      <div className="replay-message">
        <p>Each playthrough has different riddles and challenges. Try again for a new experience!</p>
      </div>
      
      <button 
        onClick={() => {
          // Add a small delay to give time for cleanup
          setTimeout(onRestart, 50);
        }} 
        className="restart-button"
      >
        New Mission
      </button>
    </div>
  );
}
