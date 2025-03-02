import React, { useState, useEffect, useRef, useCallback } from 'react';
import '../styles/components/TimingPuzzle.css';

interface TimingPuzzleProps {
  onSubmit: (answer: string) => void;
  isIncorrect: boolean;
  isProcessing?: boolean;
}

export default function TimingPuzzle({ onSubmit, isIncorrect, isProcessing = false }: TimingPuzzleProps) {
  // State for tracking the position of the sliding block
  const [position, setPosition] = useState(0);
  const [direction, setDirection] = useState(1); // 1 for right, -1 for left
  const [speed, setSpeed] = useState(2); // Movement speed
  const [isAnimating, setIsAnimating] = useState(true);
  const [attempts, setAttempts] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [showPrecisionBar, setShowPrecisionBar] = useState(false);
  const [clickPosition, setClickPosition] = useState<number | null>(null);
  
  // Constants for the game
  const MIN_POSITION = 0;
  const MAX_POSITION = 100;
  const SWEET_SPOT_CENTER = 50;
  const SWEET_SPOT_SIZE = 10; // Size of the sweet spot (total width)
  const SWEET_SPOT_START = SWEET_SPOT_CENTER - SWEET_SPOT_SIZE / 2;
  const SWEET_SPOT_END = SWEET_SPOT_CENTER + SWEET_SPOT_SIZE / 2;
  
  // Reference for animation frame
  const animationRef = useRef<number | null>(null);
  
  // Initialize animation
  useEffect(() => {
    if (isAnimating) {
      const animate = () => {
        setPosition(prevPosition => {
          let newPosition = prevPosition + direction * speed;
          
          // Reverse direction if reaching the edges
          if (newPosition >= MAX_POSITION) {
            newPosition = MAX_POSITION;
            setDirection(-1);
          } else if (newPosition <= MIN_POSITION) {
            newPosition = MIN_POSITION;
            setDirection(1);
          }
          
          return newPosition;
        });
        
        animationRef.current = requestAnimationFrame(animate);
      };
      
      animationRef.current = requestAnimationFrame(animate);
      
      // Clean up animation when component unmounts or animation stops
      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      };
    }
  }, [isAnimating, direction, speed]);
  
  // Handle click on the slider
  // Fix missing dependencies in useCallback hook
  const handleClick = useCallback(() => {
    if (isProcessing || !isAnimating) return;
    
    // Stop the animation
    setIsAnimating(false);
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    
    setAttempts(prev => prev + 1);
    setClickPosition(position);
    setShowPrecisionBar(true);
    
    // Check if the position is within the sweet spot
    const isSuccess = position >= SWEET_SPOT_START && position <= SWEET_SPOT_END;
    
    if (isSuccess) {
      setFeedback('Power coupling aligned successfully!');
      
      // Wait to show the success state before proceeding
      setTimeout(() => {
        onSubmit('aligned');
      }, 1500);
    } else {
      // Calculate how far off they were
      const distanceFromCenter = Math.abs(position - SWEET_SPOT_CENTER);
      
      if (distanceFromCenter < 15) {
        setFeedback('Close! Just a little adjustment needed.');
      } else if (distanceFromCenter < 25) {
        setFeedback('Not quite aligned. Try again.');
      } else {
        setFeedback('Alignment failed. Recalibrating...');
      }
      
      // Reset after showing feedback
      setTimeout(() => {
        setIsAnimating(true);
        setShowPrecisionBar(false);
        setClickPosition(null);
        setFeedback('');
      }, 2000);
    }
  }, [position, isAnimating, isProcessing, onSubmit, SWEET_SPOT_START, SWEET_SPOT_END, SWEET_SPOT_CENTER]);
  
  // Increase difficulty with each attempt
  useEffect(() => {
    if (attempts > 0) {
      setSpeed(Math.min(5, 2 + attempts * 0.5));
    }
  }, [attempts]);

  return (
    <div className="timing-puzzle">
      <div className="puzzle-instructions">
        <p>To repair the power coupling:</p>
        <ol>
          <li>The coupling alignment block is moving back and forth</li>
          <li>Click "Align Coupling" when the block is in the center target zone</li>
          <li>You need precise timing to secure the alignment</li>
          <li>Each failed attempt makes the block move faster</li>
        </ol>
      </div>
      
      <div className="power-coupling-container">
        <div className="alignment-bar">
          <div className="sweet-spot"></div>
          <div 
            className="sliding-block" 
            style={{ left: `${position}%` }}
          ></div>
        </div>
        
        {showPrecisionBar && clickPosition !== null && (
          <div className="precision-display">
            <div className="precision-bar">
              <div className="precision-sweet-spot"></div>
              <div 
                className="precision-marker" 
                style={{ left: `${clickPosition}%` }}
              ></div>
            </div>
          </div>
        )}
        
        {feedback && (
          <div className={`feedback ${feedback.includes('success') ? 'success' : ''}`}>
            {feedback}
          </div>
        )}
        
        <div className="action-buttons coupling-buttons">
          <button 
            className="align-button" 
            onClick={handleClick}
            disabled={!isAnimating || isProcessing}
          >
            Align Coupling
          </button>
        </div>
        
        <div className="attempt-counter">
          Alignment Attempts: {attempts}
        </div>
      </div>
    </div>
  );
}
