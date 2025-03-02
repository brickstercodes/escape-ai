import React, { useState, useEffect, useRef } from 'react';
import '../styles/components/PatternPuzzle.css';

interface PatternPuzzleProps {
  onSubmit: (answer: string) => void;
  isIncorrect: boolean;
  isProcessing?: boolean;
}

type Symbol = {
  shape: string;
  color: string;
};

const shapes = ['circle', 'square', 'triangle', 'diamond', 'hexagon'];
const colors = ['red', 'blue', 'green', 'yellow', 'purple'];

// Generate a random pattern
const generatePattern = () => {
  return Array.from({ length: 4 }, () => ({
    shape: shapes[Math.floor(Math.random() * shapes.length)],
    color: colors[Math.floor(Math.random() * colors.length)],
  }));
};

// Generate available symbols, ensuring the pattern shapes are included
const generateAvailableSymbols = (pattern: Symbol[]) => {
  // Extract all shapes from the pattern
  const patternShapes = pattern.map(item => item.shape);
  
  // Create a set of symbols (shapes)
  const symbolSet = new Set<string>(patternShapes);
  
  // Add random shapes until we have at least 6 total shapes
  while (symbolSet.size < 6) {
    symbolSet.add(shapes[Math.floor(Math.random() * shapes.length)]);
  }
  
  // Convert to array and shuffle
  return Array.from(symbolSet).sort(() => Math.random() - 0.5);
};

export default function PatternPuzzle({ onSubmit, isIncorrect, isProcessing = false }: PatternPuzzleProps) {
  const [pattern, setPattern] = useState<Symbol[]>([]);
  const [availableSymbols, setAvailableSymbols] = useState<string[]>([]);
  const [selectedSymbols, setSelectedSymbols] = useState<string[]>([]);
  const [feedback, setFeedback] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  
  const initialized = useRef(false);
  
  // Initialize pattern on component mount
  useEffect(() => {
    if (!initialized.current) {
      const newPattern = generatePattern();
      setPattern(newPattern);
      setAvailableSymbols(generateAvailableSymbols(newPattern));
      setIsLoading(false);
      initialized.current = true;
    }
  }, []);
  
  const handleSymbolClick = (symbol: string) => {
    if (selectedSymbols.length < 4 && !isProcessing) {
      const newSelected = [...selectedSymbols, symbol];
      setSelectedSymbols(newSelected);
      
      // If we've selected 4 symbols, automatically check if correct
      if (newSelected.length === 4) {
        setTimeout(() => {
          handleVerify();
        }, 500);
      }
    }
  };
  
  const handleReset = () => {
    setSelectedSymbols([]);
    setFeedback('');
  };
  
  const handleVerify = () => {
    if (selectedSymbols.length !== 4 || isProcessing) return;
    
    // Check if the pattern matches (same shapes in same order)
    const isCorrect = selectedSymbols.every(
      (symbol, index) => symbol === pattern[index].shape
    );
    
    if (isCorrect) {
      setFeedback('Pattern matched! Launching...');
      onSubmit('matched');
    } else {
      setFeedback('Pattern mismatch. Try again.');
      setTimeout(() => {
        setSelectedSymbols([]);
        setFeedback('');
      }, 1500);
    }
  };
  
  if (isLoading) {
    return <div className="loading-container">Loading pattern...</div>;
  }
  
  return (
    <div className="pattern-puzzle">
      <div className="pattern-instructions">
        <p>Match the pattern sequence shown at the top by selecting the correct shapes in order.</p>
        <p>Focus on the <strong>shape types</strong>, not the colors.</p>
      </div>
      
      <div className="pattern-container">
        <h3>Reference Pattern</h3>
        <div className="pattern-display">
          {pattern.map((item, index) => (
            <div 
              key={`pattern-${index}`} 
              className={`pattern-item ${item.shape} ${item.color}`}
            />
          ))}
        </div>
      </div>
      
      <div className="selection-container">
        <h3>Your Selection: {selectedSymbols.length}/4</h3>
        <div className="selected-symbols">
          {Array.from({ length: 4 }).map((_, index) => (
            <div 
              key={`selection-${index}`} 
              className={`selection-slot ${selectedSymbols[index] || 'empty'}`}
            >
              {index < selectedSymbols.length ? '' : '?'}
            </div>
          ))}
        </div>
      </div>
      
      <div className="symbols-container">
        <h3>Available Shapes</h3>
        <div className="available-symbols">
          {availableSymbols.map((symbol, index) => {
            // Randomly assign a color to each shape
            const randomColor = colors[Math.floor(Math.random() * colors.length)];
            return (
              <div
                key={`symbol-${index}`}
                className={`symbol-item ${symbol} ${randomColor}`}
                onClick={() => handleSymbolClick(symbol)}
              />
            );
          })}
        </div>
      </div>
      
      <div className="pattern-controls">
        <button 
          onClick={handleReset} 
          disabled={selectedSymbols.length === 0 || isProcessing}
          className="reset-button"
        >
          Reset
        </button>
        
        <button 
          onClick={handleVerify}
          disabled={selectedSymbols.length !== 4 || isProcessing}
          className="verify-button"
        >
          Verify Pattern
        </button>
      </div>
      
      {feedback && (
        <div className={`feedback ${feedback.includes('matched') ? 'success' : 'error'}`}>
          {feedback}
        </div>
      )}
    </div>
  );
}
