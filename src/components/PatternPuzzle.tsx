import React, { useState, useEffect } from 'react';
import '../styles/components/PatternPuzzle.css';

interface PatternPuzzleProps {
  onSubmit: (answer: string) => void;
  isIncorrect: boolean;
  isProcessing?: boolean;
}

const letters = ['A', 'B', 'C', 'D', 'E'];
const numbers = ['1', '2', '3', '4', '5'];

// Generate a random pattern
const generatePattern = () => {
  return Array.from({ length: 4 }, () => {
    const isLetter = Math.random() < 0.5;
    return isLetter ? letters[Math.floor(Math.random() * letters.length)] : numbers[Math.floor(Math.random() * numbers.length)];
  });
};

export default function PatternPuzzle({ onSubmit, isIncorrect, isProcessing = false }: PatternPuzzleProps) {
  const [pattern, setPattern] = useState<string[]>([]);
  const [selectedSymbols, setSelectedSymbols] = useState<string[]>([]);
  const [feedback, setFeedback] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const newPattern = generatePattern();
    setPattern(newPattern);
    setIsLoading(false);
  }, []);

  const handleSymbolClick = (symbol: string) => {
    if (selectedSymbols.length < 4 && !isProcessing) {
      const newSelected = [...selectedSymbols, symbol];
      setSelectedSymbols(newSelected);
      if (newSelected.length === 4) {
        handleVerify();
      }
    }
  };

  const handleVerify = () => {
    const isCorrect = selectedSymbols.every((symbol, index) => symbol === pattern[index]);
    if (isCorrect) {
      setFeedback('Pattern matched! Launching...');
      onSubmit('matched');
    } else {
      setFeedback('Pattern mismatch. Try again.');
      setTimeout(() => setSelectedSymbols([]), 1500);
    }
  };

  if (isLoading) {
    return <div className="loading-container">Loading pattern...</div>;
  }

  return (
    <div className="pattern-puzzle">
      <div className="pattern-instructions">
        <p>Match the pattern sequence shown at the top by selecting the correct numbers or letters in order.</p>
      </div>
      <div className="pattern-display">
        <h3>Reference Pattern</h3>
        <div className="pattern-container">
          {pattern.map((item, index) => (
            <div key={`pattern-${index}`} className="pattern-item">{item}</div>
          ))}
        </div>
      </div>
      <div className="available-symbols">
        <h3>Available Symbols</h3>
        {[...letters, ...numbers].map((symbol, index) => (
          <div key={`symbol-${index}`} className="symbol-item" onClick={() => handleSymbolClick(symbol)}>{symbol}</div>
        ))}
      </div>
      {feedback && <div className={`feedback ${feedback.includes('matched') ? 'success' : 'error'}`}>{feedback}</div>}
    </div>
  );
}
