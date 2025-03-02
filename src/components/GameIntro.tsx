import React from 'react';

interface GameIntroProps {
  onStart: () => void;
}

export default function GameIntro({ onStart }: GameIntroProps) {
  return (
    <div className="game-intro">
      <div className="game-logo">
        <h1>Escape the Derelict</h1>
        <div className="logo-subtitle">DEEP SPACE RESCUE MISSION</div>
      </div>
      
      <div className="intro-content">
        <div className="alert-message">
          <div className="alert-header">PRIORITY ALPHA</div>
          <p>
            <strong>URGENT TRANSMISSION:</strong> Explorer Josh Neeq has lost contact with mission control 
            after boarding an abandoned spacecraft on the edge of the Kepler system.
          </p>
          <p>
            You are Josh's AI assistant back on Earth, and his only hope for survival. 
            Guide him through the ship's systems and puzzles to reach the escape pods 
            before whatever lurks aboard finds him.
          </p>
        </div>
        
        <div className="how-to-play">
          <h2>How to Help Josh</h2>
          <ul>
            <li><strong>Text Puzzles:</strong> Solve riddles and puzzles to unlock doors and access systems</li>
            <li><strong>Image Puzzles:</strong> Scan and interpret visual data like QR codes to bypass security</li>
            <li><strong>Voice Puzzles:</strong> Decode messages and provide verbal commands to the ship's systems</li>
            <li>Use hints if you get stuck, but remember - Josh's oxygen is limited!</li>
          </ul>
        </div>
      </div>
      
      <button onClick={onStart} className="start-button">
        Begin Mission
      </button>
    </div>
  );
}
