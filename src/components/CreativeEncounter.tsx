import React, { useState, useCallback, useEffect } from 'react';
import { CreativeEncounterConfig } from '../types/game';
import '../styles/components/CreativeEncounter.css';

interface CreativeEncounterProps {
  onSubmit: (answer: string) => void;
  isIncorrect: boolean;
  isProcessing?: boolean;
  config?: CreativeEncounterConfig;
}

export default function CreativeEncounter({ 
  onSubmit, 
  isIncorrect, 
  isProcessing = false,
  config
}: CreativeEncounterProps) {
  const [strategy, setStrategy] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [health, setHealth] = useState(config?.healthPoints || 100);
  const [feedback, setFeedback] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [showItems, setShowItems] = useState(false);
  
  const availableItems = config?.availableItems || [
    'Broken pipe wrench', 'Fire extinguisher', 'Electrical wire', 
    'Maintenance tool kit', 'Broken glass shard', 'Emergency flare',
    'Coolant canister', 'Portable welding torch', 'Medical kit'
  ];
  
  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!strategy.trim() || isProcessing) return;
    
    // Track the attempt
    setAttempts(prev => prev + 1);
    
    // Let the parent handle the validation with Gemini AI
    onSubmit(strategy);
    
    // Show some immediate feedback about sending the plan to Josh
    setFeedback("Transmitting your plan to Josh...");
    setShowFeedback(true);
    
    // If this was the first failure, reduce health
    if (isIncorrect && attempts === 0) {
      setHealth(prev => Math.max(prev - 50, 0));
    }
  }, [strategy, isProcessing, attempts, isIncorrect, onSubmit]);
  
  // Reset feedback after a delay
  useEffect(() => {
    if (showFeedback) {
      const timer = setTimeout(() => {
        setShowFeedback(false);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [showFeedback]);
  
  // Add item to strategy text
  const addItemToStrategy = (item: string) => {
    setStrategy(prev => {
      if (prev.includes(item)) return prev;
      
      if (prev.length === 0) return item;
      
      const lastChar = prev[prev.length - 1];
      const separator = lastChar === '.' || lastChar === ',' || lastChar === ' ' ? ' ' : '. ';
      
      return prev + separator + item;
    });
  };
  
  // Health display styles based on remaining health
  const healthBarStyle = {
    width: `${health}%`,
    background: health > 66 ? '#2ea043' : health > 33 ? '#d29922' : '#f85149'
  };
  
  return (
    <div className="creative-encounter">
      <div className="health-status">
        <div className="health-label">
          <span>JOSH'S STATUS</span>
          <span className="health-percent">{health}%</span>
        </div>
        <div className="health-bar-container">
          <div className="health-bar" style={healthBarStyle}></div>
        </div>
        <div className="attempts-counter">
          <span>Chances Remaining: {Math.max(2 - attempts, 0)}</span>
        </div>
      </div>
      
      <div className="encounter-scenario">
        <p>{config?.scenario || 'The creature has Josh cornered. He needs to fight back using items around him!'}</p>
      </div>
      
      <div className="items-panel">
        <div className="items-header" onClick={() => setShowItems(!showItems)}>
          <span>Available Items</span>
          <span className={`items-toggle ${showItems ? 'open' : ''}`}>
            {showItems ? '▼' : '►'}
          </span>
        </div>
        
        {showItems && (
          <div className="items-grid">
            {availableItems.map((item, index) => (
              <div 
                key={index} 
                className="item-chip" 
                onClick={() => addItemToStrategy(item)}
              >
                {item}
              </div>
            ))}
          </div>
        )}
      </div>
      
      <form onSubmit={handleSubmit} className="strategy-form">
        <label htmlFor="strategy">
          Develop a survival strategy for Josh:
        </label>
        <textarea
          id="strategy"
          value={strategy}
          onChange={(e) => setStrategy(e.target.value)}
          placeholder="Describe how Josh should use the available items to fight or distract the creature..."
          rows={6}
          disabled={isProcessing || attempts >= 2}
          className={isIncorrect ? 'incorrect' : ''}
        />
        
        {showFeedback && (
          <div className={`strategy-feedback ${isIncorrect ? 'danger' : 'success'}`}>
            {feedback}
          </div>
        )}
        
        <div className="action-buttons">
          <button 
            type="submit" 
            disabled={isProcessing || !strategy.trim() || attempts >= 2}
            className="send-strategy-btn"
          >
            {isProcessing ? 'Transmitting...' : 'Send Strategy to Josh'}
          </button>
        </div>
        
        {attempts >= 2 && health <= 0 && (
          <div className="game-over-message">
            CRITICAL ERROR: Connection to Josh lost. Mission failed.
          </div>
        )}
      </form>
    </div>
  );
}
