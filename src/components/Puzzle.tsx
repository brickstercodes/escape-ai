import React, { useState, useCallback } from 'react';
import { Puzzle } from '../types/game';
import { validateWithAI } from '../utils/ai';
import { normalizeInput } from '../utils/validation';
import ImagePuzzle from './ImagePuzzle';
import VoicePuzzle from './VoicePuzzle';
import TimingPuzzle from './TimingPuzzle';
import CreativeEncounter from './CreativeEncounter';
import PatternPuzzle from './PatternPuzzle';

interface PuzzleProps {
  puzzle: Puzzle;
  onSolved: (puzzle: Puzzle) => void;
  onUseHint: () => void;
  hintsUsed: number;
}

export default function PuzzleComponent({ puzzle, onSolved, onUseHint, hintsUsed }: PuzzleProps) {
  const [answer, setAnswer] = useState('');
  const [isIncorrect, setIsIncorrect] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [submitAttempts, setSubmitAttempts] = useState(0);
  const [debugInfo, setDebugInfo] = useState('');

  // Use useCallback to ensure stable function identity
  const handleAnswerSubmit = useCallback(async (submittedAnswer: string) => {
    // Prevent empty submissions
    if (!submittedAnswer.trim()) {
      return;
    }
    
    // Prevent multiple submissions while checking
    if (isChecking) {
      return;
    }

    setIsChecking(true);
    setAnswer(submittedAnswer);
    
    try {
      console.log("Checking answer:", submittedAnswer);
      console.log("Expected answer:", puzzle.answer);
      
      // Special case for pattern puzzle - always accept "matched" as correct
      if (puzzle.type === 'pattern' && submittedAnswer === 'matched') {
        console.log("Pattern matched successfully");
        setDebugInfo('Pattern matched successfully!');
        
        setTimeout(() => {
          onSolved(puzzle);
        }, 1000);
        
        return;
      }
      
      let isCorrect = false;
      
      if (puzzle.validateWith === 'ai' && puzzle.aiConfig) {
        try {
          setDebugInfo('Validating with AI...');
          isCorrect = await validateWithAI(submittedAnswer, puzzle.answer, puzzle.aiConfig);
          setDebugInfo('AI validation complete');
        } catch (error) {
          console.error("AI validation error:", error);
          setDebugInfo(`AI Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
          
          // Fallback to simple comparison if AI fails
          const normalizedSubmitted = normalizeInput(submittedAnswer);
          const normalizedAnswer = normalizeInput(puzzle.answer);
          isCorrect = normalizedSubmitted === normalizedAnswer;
        }
      } else {
        // Case-insensitive comparison with normalization
        const normalizedSubmitted = normalizeInput(submittedAnswer);
        const normalizedAnswer = normalizeInput(puzzle.answer);
        isCorrect = normalizedSubmitted === normalizedAnswer;
        
        setDebugInfo(`Simple comparison: "${normalizedSubmitted}" === "${normalizedAnswer}" is ${isCorrect}`);
      }
      
      console.log("Answer is correct:", isCorrect);
      
      if (isCorrect) {
        console.log("Correct answer submitted for puzzle:", puzzle.id);
        setDebugInfo('Correct answer! Calling onSolved...');
        setTimeout(() => {
          console.log("Calling onSolved for puzzle:", puzzle.id);
          onSolved(puzzle);
        }, 100); // Small delay to ensure UI updates before transition
      } else {
        setIsIncorrect(true);
        setDebugInfo('Incorrect answer');
        setTimeout(() => setIsIncorrect(false), 2000);
      }
    } catch (error) {
      console.error('Error validating answer:', error);
      setDebugInfo(`AI Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setTimeout(() => {
        setIsChecking(false);
        // Increment attempts counter to force re-renders if needed
        setSubmitAttempts(prev => prev + 1);
      }, 500);
    }
  }, [isChecking, onSolved, puzzle]);
  
  const handleManualSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation(); // Stop event bubbling
    console.log("Form submitted manually with answer:", answer);
    handleAnswerSubmit(answer);
  }, [answer, handleAnswerSubmit]);

  // Get puzzle type label for display
  const getPuzzleTypeLabel = (type: string) => {
    switch (type) {
      case 'text': return 'Text Analysis';
      case 'image': return 'Visual Recognition';
      case 'voice': return 'Audio Verification';
      case 'timing': return 'Precision Timing';
      case 'creative': return 'Survival Strategy';
      case 'pattern': return 'Pattern Matching';
      default: return 'Unknown Type';
    }
  };

  // For production, you would remove the debug section
  const debugSection = process.env.NODE_ENV !== 'production' && (
    <div className="debug-info" style={{fontSize: '12px', color: '#666', marginTop: '10px'}}>
      <details>
        <summary>Debug Info</summary>
        <p>Submission attempts: {submitAttempts}</p>
        <p>Current answer: "{answer}"</p>
        <p>Expected answer: "{puzzle.answer}"</p>
        <p>Status: {isChecking ? 'Checking...' : (isIncorrect ? 'Incorrect' : 'Idle')}</p>
        <p>Debug: {debugInfo}</p>
      </details>
    </div>
  );

  return (
    <div className="puzzle">
      <div className="puzzle-header">
        <span className="puzzle-type">{getPuzzleTypeLabel(puzzle.type)}</span>
        <span className="hint-counter">
          {hintsUsed > 0 ? `Hints used: ${hintsUsed}/${puzzle.hints.length}` : ''}
        </span>
      </div>
      
      <p>{puzzle.question}</p>

      {hintsUsed > 0 && (
        <div className="hints">
          {puzzle.hints.slice(0, hintsUsed).map((hint, index) => (
            <p key={index}><strong>Hint {index + 1}:</strong> {hint}</p>
          ))}
        </div>
      )}

      {puzzle.type === 'text' && (
        <form onSubmit={handleManualSubmit} className="puzzle-form">
          <input
            type="text"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            className={isIncorrect ? 'incorrect' : ''}
            placeholder="Enter your answer..."
            autoComplete="off"
          />
          <div className="action-buttons">
            <button 
              type="button" 
              onClick={handleManualSubmit}
              className="submit-button"
            >
              {isChecking ? 'Processing...' : 'Submit'}
            </button>
            
            {puzzle.hints.length > hintsUsed && (
              <button 
                type="button" 
                onClick={(e) => {
                  e.preventDefault(); 
                  onUseHint();
                }}
                disabled={isChecking}
              >
                Request Hint
              </button>
            )}
          </div>
        </form>
      )}
      
      {puzzle.type === 'image' && (
        <ImagePuzzle 
          onSubmit={handleAnswerSubmit} 
          isIncorrect={isIncorrect}
          isProcessing={isChecking}
        />
      )}
      
      {puzzle.type === 'voice' && (
        <VoicePuzzle 
          onSubmit={handleAnswerSubmit} 
          isIncorrect={isIncorrect}
          isProcessing={isChecking}
        />
      )}
      
      {puzzle.type === 'timing' && (
        <TimingPuzzle
          onSubmit={handleAnswerSubmit} 
          isIncorrect={isIncorrect}
          isProcessing={isChecking}
        />
      )}

      {puzzle.type === 'creative' && (
        <CreativeEncounter
          onSubmit={handleAnswerSubmit} 
          isIncorrect={isIncorrect}
          isProcessing={isChecking}
          config={puzzle.creativeConfig}
        />
      )}

      {puzzle.type === 'pattern' && (
        <PatternPuzzle 
          onSubmit={handleAnswerSubmit} 
          isIncorrect={isIncorrect} 
          isProcessing={isChecking} 
        />
      )}

      {puzzle.type !== 'text' && puzzle.hints.length > hintsUsed && (
        <button 
          type="button" 
          onClick={(e) => {
            e.preventDefault();
            onUseHint();
          }}
          disabled={isChecking}
        >
          Request Hint
        </button>
      )}
      
      {debugSection}
    </div>
  );
}
