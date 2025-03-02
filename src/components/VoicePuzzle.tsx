import React, { useState, useCallback } from 'react';

interface VoicePuzzleProps {
  onSubmit: (answer: string) => void;
  isIncorrect: boolean;
  isProcessing?: boolean;
}

export default function VoicePuzzle({ onSubmit, isIncorrect, isProcessing = false }: VoicePuzzleProps) {
  const [answer, setAnswer] = useState('');
  const [isRecording, setIsRecording] = useState(false);
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
      return;
    }
    
    console.log("VoicePuzzle: Submitting answer", answer);
    setInternalSubmitting(true);
    
    // Call the parent's onSubmit function
    onSubmit(answer);
    
    // Reset internal submitting state after a delay
    setTimeout(() => {
      setInternalSubmitting(false);
    }, 1000);
  }, [answer, isProcessing, internalSubmitting, onSubmit]);

  // This is a placeholder for actual voice recognition
  const toggleRecording = useCallback(() => {
    setIsRecording(prev => !prev);
    
    if (!isRecording) {
      // Simulating start of recording
      console.log("Starting voice recording...");
      
      // Simulating end of recording after 2 seconds
      setTimeout(() => {
        setIsRecording(false);
        setAnswer("A"); // For testing purposes, simulating the correct answer
        console.log("Recording stopped, simulated answer set");
      }, 2000);
    }
  }, [isRecording]);

  const isSubmitting = isProcessing || internalSubmitting;

  return (
    <div className="voice-puzzle">
      <div className="puzzle-instructions">
        <p>To solve this puzzle:</p>
        <ol>
          <li>Use the binary chart below to decode the message</li>
          <li>Each 8-digit binary code represents one letter</li>
          <li>Once you've decoded the message, speak or type the answer to the question</li>
        </ol>
      </div>
      
      <div className="binary-chart">
        <h3>Binary to ASCII Chart</h3>
        <div className="chart-container">
          <div className="chart-item"><span className="code">01000001</span> = A</div>
          <div className="chart-item"><span className="code">01000010</span> = B</div>
          <div className="chart-item"><span className="code">01000011</span> = C</div>
          <div className="chart-item"><span className="code">01000100</span> = D</div>
          <div className="chart-item"><span className="code">01000101</span> = E</div>
          <div className="chart-item"><span className="code">01000110</span> = F</div>
          <div className="chart-item"><span className="code">01000111</span> = G</div>
          <div className="chart-item"><span className="code">01001000</span> = H</div>
          <div className="chart-item"><span className="code">01001001</span> = I</div>
          <div className="chart-item"><span className="code">01001010</span> = J</div>
          <div className="chart-item"><span className="code">01001011</span> = K</div>
          <div className="chart-item"><span className="code">01001100</span> = L</div>
          <div className="chart-item"><span className="code">01001101</span> = M</div>
          <div className="chart-item"><span className="code">01001110</span> = N</div>
          <div className="chart-item"><span className="code">01001111</span> = O</div>
          <div className="chart-item"><span className="code">01010000</span> = P</div>
          <div className="chart-item"><span className="code">01010001</span> = Q</div>
          <div className="chart-item"><span className="code">01010010</span> = R</div>
          <div className="chart-item"><span className="code">01010011</span> = S</div>
          <div className="chart-item"><span className="code">01010100</span> = T</div>
          <div className="chart-item"><span className="code">01010101</span> = U</div>
          <div className="chart-item"><span className="code">01010110</span> = V</div>
          <div className="chart-item"><span className="code">01010111</span> = W</div>
          <div className="chart-item"><span className="code">01011000</span> = X</div>
          <div className="chart-item"><span className="code">01011001</span> = Y</div>
          <div className="chart-item"><span className="code">01011010</span> = Z</div>
          <div className="chart-item"><span className="code">00100000</span> = SPACE</div>
        </div>
      </div>
      
      <button 
        type="button" 
        onClick={toggleRecording}
        className={isRecording ? 'recording' : ''}
        disabled={isProcessing || internalSubmitting}
      >
        {isRecording ? 'Stop Recording' : 'Start Recording'}
      </button>

      <form onSubmit={e => handleSubmit(e)} className="puzzle-form">
        <input
          type="text"
          value={answer}
          onChange={handleAnswerChange}
          placeholder="Speak or type your answer here"
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
            {isSubmitting ? 'Processing...' : 'Submit'}
          </button>
        </div>
      </form>
    </div>
  );
}
