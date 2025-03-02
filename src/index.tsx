import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/game.css';
import './styles/components/ImagePuzzle.css';
import './styles/components/VoicePuzzle.css';
import './styles/components/GameIntro.css';
import './styles/components/GameComplete.css';
import './styles/components/StoryPanel.css';
import './styles/components/PatternPuzzle.css'; // Change from PatternMiniGame.css
import './styles/components/TimingPuzzle.css';
import './styles/components/CreativeEncounter.css';

// Extend Window interface
declare global {
  interface Window {
    _gameEmergencyReset: () => void;
  }
}

// Add emergency state recovery mechanism
if (typeof window !== 'undefined') {
  // Add a global emergency reset mechanism
  window._gameEmergencyReset = function() {
    console.log("Emergency game reset triggered");
    localStorage.setItem('game_emergency_reset', 'true');
    window.location.reload();
  };
  
  // Check if we need to recover from an emergency
  if (localStorage.getItem('game_emergency_reset') === 'true') {
    console.log("Recovering from emergency reset");
    localStorage.removeItem('game_emergency_reset');
    // Clean up any lingering state that could cause issues
    const highestId = window.setTimeout(() => {}, 0);
    for (let i = highestId; i >= 0; i--) {
      window.clearTimeout(i);
      window.clearInterval(i);
    }
  }

  // Add emergency keyboard shortcuts for debugging
  // document.addEventListener('keydown', function(e) {
  //   // Alt+R to reload the page
  //   if (e.altKey && e.key === 'r') {
  //     console.log("Emergency reload triggered");
  //     window.location.reload();
  //   }
    
  //   // Alt+C to force continue (simulates clicking continue button)
  //   if (e.altKey && e.key === 'c') {
  //     console.log("Emergency continue triggered");
  //     const continueButtons = document.querySelectorAll('.continue-button');
  //     if (continueButtons.length > 0) {
  //       (continueButtons[0] as HTMLButtonElement).click();
  //       console.log("Simulated click on continue button");
  //     }
  //   }
  // });
  
  // Ensure touch events are handled properly
  document.addEventListener('touchstart', function() {}, {passive: true});
  
  // Clear any lingering timeouts or intervals
  const highestId = window.setTimeout(() => {}, 0);
  for (let i = highestId; i >= 0; i--) {
    window.clearTimeout(i);
    window.clearInterval(i);
  }
  
  // Clear any requestAnimationFrame
  const highestAnimFrameId = requestAnimationFrame(() => {});
  for (let i = highestAnimFrameId; i >= 0; i--) {
    cancelAnimationFrame(i);
  }
}

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(<App />);
