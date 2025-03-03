import React, { useState, useCallback } from 'react';

interface ImagePuzzleProps {
  onSubmit: (answer: string) => void;
  isIncorrect: boolean;
  isProcessing?: boolean;
}

export default function ImagePuzzle({ onSubmit, isIncorrect, isProcessing = false }: ImagePuzzleProps) {
  const [answer, setAnswer] = useState('');
  const [internalSubmitting, setInternalSubmitting] = useState(false);

  const handleAnswerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAnswer(e.target.value);
  };

  const handleSubmit = useCallback((e: React.MouseEvent | React.FormEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    if (!answer.trim() || isProcessing || internalSubmitting) {
      console.log("Preventing submission:", { 
        answerEmpty: !answer.trim(), 
        isProcessing, 
        internalSubmitting 
      });
      return;
    }
    
    console.log("ImagePuzzle: Submitting answer", answer);
    setInternalSubmitting(true);
    
    onSubmit(answer);
    
    setTimeout(() => {
      setInternalSubmitting(false);
    }, 1000);
  }, [answer, isProcessing, internalSubmitting, onSubmit]);

  const isSubmitting = isProcessing || internalSubmitting;

  return (
    <div className="image-puzzle">
      <div className="puzzle-instructions">
        <p>To solve this puzzle:</p>
        <ol>
          <li>Find the security code in the game world</li>
          <li>Enter the code in the input field below</li>
          <li>Click "Verify Access" to submit</li>
        </ol>
      </div>

      <form onSubmit={e => handleSubmit(e)} className="puzzle-form">
        <input
          type="text"
          value={answer}
          onChange={handleAnswerChange}
          placeholder="Enter security code..."
          className={isIncorrect ? 'incorrect' : ''}
          autoComplete="off"
        />
        <div className="action-buttons">
          <button 
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting || !answer.trim()}
            className="submit-button"
          >
            {isSubmitting ? 'Verifying...' : 'Verify Access'}
          </button>
        </div>
      </form>
    </div>
  );
}
