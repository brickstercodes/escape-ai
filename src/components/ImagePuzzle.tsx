import React, { useState, useCallback } from 'react';

interface ImagePuzzleProps {
  onSubmit: (answer: string) => void;
  isIncorrect: boolean;
  isProcessing?: boolean; // New prop to track processing state
}

export default function ImagePuzzle({ onSubmit, isIncorrect, isProcessing = false }: ImagePuzzleProps) {
  const [answer, setAnswer] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [internalSubmitting, setInternalSubmitting] = useState(false);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnswerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAnswer(e.target.value);
  };

  // Use useCallback to ensure this function has stable identity
  const handleSubmit = useCallback((e: React.MouseEvent | React.FormEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation(); // Stop event bubbling
    }
    
    // Prevent empty submissions or double submissions
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
    
    // Call the parent's onSubmit function
    onSubmit(answer);
    
    // Reset internal submitting state after a delay
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
          <li>Find the QR code in the game world (for testing, use a QR code generator to create a code with the text that matches the required access code)</li>
          <li>Take a picture of it or upload an existing QR code image</li>
          <li>Enter what you see in the answer field and click "Verify Access"</li>
        </ol>
      </div>
      
      <div className="file-upload">
        <label className="file-upload-label">
          <span className="upload-icon" role="img" aria-label="Camera">📷</span>
          <span className="upload-text">Upload Security Badge</span>
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleFileChange} 
            className="file-input" 
            onClick={(e) => e.stopPropagation()}
          />
        </label>
        
        {previewUrl && (
          <div className="image-preview">
            <div className="preview-container">
              <img src={previewUrl} alt="Selected" />
              <div className="scan-overlay">
                <div className="scan-line"></div>
              </div>
            </div>
            <div className="scan-status">Analyzing image...</div>
          </div>
        )}
      </div>

      <form onSubmit={e => handleSubmit(e)} className="puzzle-form">
        <input
          type="text"
          value={answer}
          onChange={handleAnswerChange}
          placeholder="Enter security code from image..."
          className={isIncorrect ? 'incorrect' : ''}
          autoComplete="off"
        />
        <div className="action-buttons">
          <button 
            type="button" // Using button type instead of submit type
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
