import React, { useState, useEffect } from 'react';
import '../styles/components/PatternMiniGame.css';

interface PatternMiniGameProps {
  onComplete: () => void;
}

type SymbolType = 'circle' | 'square' | 'triangle' | 'diamond' | 'hexagon';
type ColorType = 'blue' | 'green' | 'red' | 'yellow' | 'purple';

interface Symbol {
  type: SymbolType;
  color: ColorType;
  id: number;
}

export default function PatternMiniGame({ onComplete }: PatternMiniGameProps) {
  const [patternSequence, setPatternSequence] = useState<Symbol[]>([]);
  const [playerSequence, setPlayerSequence] = useState<Symbol[]>([]);
  const [availableSymbols, setAvailableSymbols] = useState<Symbol[]>([]);
  const [isGenerating, setIsGenerating] = useState(true);
  const [message, setMessage] = useState("Analyzing security protocol...");
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  
  // Generate the symbols once on mount
  useEffect(() => {
    const symbolTypes: SymbolType[] = ['circle', 'square', 'triangle', 'diamond', 'hexagon'];
    const colorTypes: ColorType[] = ['blue', 'green', 'red', 'yellow', 'purple'];
    
    const symbols: Symbol[] = [];
    let id = 0;
    
    // Generate all combinations of symbols and colors
    symbolTypes.forEach(type => {
      colorTypes.forEach(color => {
        symbols.push({ type, color, id: id++ });
      });
    });
    
    // Shuffle and select a subset for the game
    const shuffled = [...symbols].sort(() => Math.random() - 0.5);
    setAvailableSymbols(shuffled.slice(0, 10));
    
    // Generate the pattern to match
    const pattern = shuffled.slice(12, 16);
    setPatternSequence(pattern);
    
    setTimeout(() => {
      setIsGenerating(false);
      setMessage("Complete the security pattern to bypass the firewall");
    }, 2000);
  }, []);
  
  const handleSymbolClick = (symbol: Symbol) => {
    if (isGenerating) return;
    
    const newSequence = [...playerSequence, symbol];
    setPlayerSequence(newSequence);
    
    // Check if sequence is correct once the player has selected enough symbols
    if (newSequence.length === patternSequence.length) {
      checkPattern(newSequence);
    }
  };
  
  const checkPattern = (sequence: Symbol[]) => {
    // In a real pattern game, we'd check some logical relationship
    // For this demo, we'll say the pattern is correct if the last symbol matches
    const isMatch = sequence[sequence.length - 1].type === patternSequence[patternSequence.length - 1].type;
    
    setIsCorrect(isMatch);
    
    if (isMatch) {
      setMessage("Pattern accepted! Security protocol bypassed.");
      setTimeout(() => {
        onComplete();
      }, 2000);
    } else {
      setMessage("Pattern incorrect. Resetting sequence...");
      setTimeout(() => {
        setPlayerSequence([]);
        setIsCorrect(null);
        setMessage("Complete the security pattern to bypass the firewall");
      }, 2000);
    }
  };
  
  const resetSequence = () => {
    setPlayerSequence([]);
  };
  
  // Get a hint about the pattern
  const getHint = () => {
    // In this demo, the hint is that the last symbol must match
    setMessage("Hint: Look for the matching final symbol type");
    setTimeout(() => {
      setMessage("Complete the security pattern to bypass the firewall");
    }, 3000);
  };
  
  const renderSymbolIcon = (symbol: Symbol) => {
    switch (symbol.type) {
      case 'circle': return <div className={`symbol-icon circle ${symbol.color}`} />;
      case 'square': return <div className={`symbol-icon square ${symbol.color}`} />;
      case 'triangle': return <div className={`symbol-icon triangle ${symbol.color}`} />;
      case 'diamond': return <div className={`symbol-icon diamond ${symbol.color}`} />;
      case 'hexagon': return <div className={`symbol-icon hexagon ${symbol.color}`} />;
    }
  };
  
  return (
    <div className="pattern-game">
      <div className="pattern-header">
        <div className="pattern-title">Security Access Protocol</div>
        <div className={`pattern-message ${isCorrect !== null ? (isCorrect ? 'success' : 'error') : ''}`}>
          {message}
        </div>
      </div>

      <div className="pattern-container">
        <div className="pattern-sequence">
          <div className="sequence-label">Required Pattern:</div>
          <div className="sequence-display">
            {patternSequence.map((symbol, index) => (
              <div key={`pattern-${index}`} className="sequence-item">
                {isGenerating ? (
                  <div className="loading-placeholder"></div>
                ) : (
                  renderSymbolIcon(symbol)
                )}
              </div>
            ))}
          </div>
        </div>
        
        <div className="player-sequence">
          <div className="sequence-label">Your Input:</div>
          <div className="sequence-display">
            {Array(patternSequence.length).fill(0).map((_, index) => (
              <div key={`player-${index}`} className="sequence-item">
                {index < playerSequence.length ? (
                  renderSymbolIcon(playerSequence[index])
                ) : (
                  <div className="empty-slot"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="symbol-selection">
        <div className="selection-label">Available Symbols:</div>
        <div className="symbols-grid">
          {availableSymbols.map(symbol => (
            <div 
              key={symbol.id} 
              className="symbol-item" 
              onClick={() => handleSymbolClick(symbol)}
            >
              {renderSymbolIcon(symbol)}
            </div>
          ))}
        </div>
      </div>
      
      <div className="game-actions">
        <button className="reset-button" onClick={resetSequence}>Reset Sequence</button>
        <button className="hint-button" onClick={getHint}>Get Hint</button>
      </div>
    </div>
  );
}
