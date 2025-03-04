import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GameState, Puzzle } from '../types/game';
import { levels } from '../data/levels';
import PuzzleComponent from './Puzzle';
import GameIntro from './GameIntro';
import GameComplete from './GameComplete';
import ProgressBar from './ProgressBar';
import StoryPanel from './StoryPanel';

// Define the possible game screens
type GameScreen = 'intro' | 'story-intro' | 'playing' | 'story-outro' | 'complete';

const createInitialGameState = (): GameState => {
  return {
    currentLevelId: levels[0].id,
    currentPuzzleIndex: 0,
    completedPuzzles: [],
    hintsUsed: {},
    isLoading: false,
    error: undefined
  };
};

export default function Game() {
  // Instead of using a static initialGameState, we use the function to generate a fresh state
  const [gameState, setGameState] = useState<GameState>(createInitialGameState());
  const [currentScreen, setCurrentScreen] = useState<GameScreen>('intro');
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  
  // This effect will re-import levels (which contains freshly randomized puzzles) when game is restarted
  const [importedLevels, setImportedLevels] = useState(levels);
  
  // Create a variable for the dependency to satisfy ESLint
  const isIntroScreen = currentScreen === 'intro';
  
  // Track mounted state to prevent state updates after unmounting
  const isMounted = useRef(true);
  
  // Set up cleanup on unmount
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);
  
  // When the game is restarted, this will cause the levels to be re-imported
  useEffect(() => {
    // This forces the component to use the latest version of levels with newly randomized puzzles
    if (isIntroScreen && isMounted.current) {
      setImportedLevels([...levels]);
    }
  }, [isIntroScreen]);

  const currentLevel = importedLevels[currentLevelIndex];
  const currentPuzzle = currentLevel?.puzzles[gameState.currentPuzzleIndex];

  // Define setScreenWithTimeout to avoid state updates after transitions
  const setScreenWithTimeout = useCallback((screen: GameScreen, delay = 100) => {
    setTimeout(() => {
      if (isMounted.current) {
        setCurrentScreen(screen);
      }
    }, delay);
  }, []);
  
  // Define advanceToNextLevel first using useCallback
  const advanceToNextLevel = useCallback(() => {
    if (!isMounted.current) return;
    
    console.log('Advancing to next level. Current Level Index:', currentLevelIndex);
    
    // Change condition to account for 6 levels (0-5)
    if (currentLevelIndex < 5) {
      setCurrentLevelIndex(prevIndex => {
        const newIndex = prevIndex + 1;
        console.log("New level index:", newIndex);
        
        if (!isMounted.current) return prevIndex;
        
        setGameState(prev => ({
          ...prev,
          currentLevelId: importedLevels[newIndex].id,
          currentPuzzleIndex: 0
        }));
        
        // Show story intro for new level if available
        if (importedLevels[newIndex].storyIntro) {
          console.log("Showing intro for level:", newIndex);
          setScreenWithTimeout('story-intro');
        } else {
          console.log("No intro, continuing to play");
          setScreenWithTimeout('playing');
        }
        
        return newIndex;
      });
    } else {
      console.log("Game complete");
      // Game complete - add a longer delay to ensure clean transition
      setScreenWithTimeout('complete', 300);
    }
  }, [currentLevelIndex, importedLevels, setScreenWithTimeout]);

  const handlePuzzleSolved = useCallback((puzzle: Puzzle) => {
    if (!isMounted.current) return;
    
    // Add additional error handling
    if (!puzzle || !puzzle.id) {
      console.error("Invalid puzzle object passed to handlePuzzleSolved");
      return;
    }

    console.log("Puzzle solved:", puzzle.id, "Current level:", currentLevelIndex);

    setGameState(prev => {
      // Check if puzzle was already marked as complete to prevent double transitions
      
      
      const newState = {
        ...prev,
        completedPuzzles: [...prev.completedPuzzles, puzzle.id],
        currentPuzzleIndex: prev.currentPuzzleIndex + 1
      };
      
      // Check if this was the last puzzle in the level
      if (currentLevel && newState.currentPuzzleIndex >= currentLevel.puzzles.length) {
        console.log("Last puzzle in level completed");
        
        // Show story outro if available
        if (currentLevel.storyOutro) {
          console.log("Showing level outro");
          setScreenWithTimeout('story-outro');
        } else {
          console.log("No outro, advancing to next level");
          // Add a short delay before advancing to ensure state update completes
          setTimeout(() => {
            if (isMounted.current) {
              advanceToNextLevel();
            }
          }, 200);
        }
      } else {
        console.log("More puzzles remaining in current level");
      }
      
      console.log("Completed puzzles before update:", prev.completedPuzzles);
      console.log("Current puzzle index before update:", prev.currentPuzzleIndex);
      console.log("Completed puzzles after update:", newState.completedPuzzles);
      console.log("Current puzzle index after update:", newState.currentPuzzleIndex);
      
      return newState;
    });
  }, [currentLevel, advanceToNextLevel, setScreenWithTimeout, currentLevelIndex]);

  const handleHintRequest = useCallback((puzzleId: string) => {
    if (!isMounted.current) return;
    
    setGameState(prev => ({
      ...prev,
      hintsUsed: {
        ...prev.hintsUsed,
        [puzzleId]: (prev.hintsUsed[puzzleId] || 0) + 1
      }
    }));
  }, []);

  const startGame = useCallback(() => {
    if (!isMounted.current) return;
    
    // If there's a story intro for the first level, show it
    if (currentLevel?.storyIntro) {
      setCurrentScreen('story-intro');
    } else {
      setCurrentScreen('playing');
    }
  }, [currentLevel]);

  // Simplify the continue handlers to avoid unnecessary delays and state management issues
  const continueFromStoryIntro = useCallback(() => {
    if (isMounted.current) {
      // Set screen immediately without delay
      setCurrentScreen('playing');
    }
  }, []);

  const continueFromStoryOutro = useCallback(() => {
    if (isMounted.current) {
      // Set screen immediately without delay
      advanceToNextLevel();
    }
  }, [advanceToNextLevel]);

  const restartGame = useCallback(() => {
    // Clean up any potential lingering animations or timeouts
    const highestId = window.setTimeout(() => {}, 0);
    for (let i = highestId; i >= 0; i--) {
      window.clearTimeout(i);
    }
    
    if (isMounted.current) {
      // Create a fresh game state when restarting
      setGameState(createInitialGameState());
      setCurrentLevelIndex(0);
      setCurrentScreen('intro');
    }
  }, []);

  // Render appropriate screen based on game state
  if (currentScreen === 'intro') {
    return <GameIntro onStart={startGame} />;
  }

  // For the story panels, add a key prop to force re-render
  if (currentScreen === 'story-intro' && currentLevel?.storyIntro) {
    return (
      <StoryPanel
        key={`intro-${currentLevel.id}-${Date.now()}`} // Add timestamp to force re-render
        currentLevel={currentLevelIndex}
        onLevelChange={advanceToNextLevel}
        text={currentLevel.storyIntro}
        isIntro={true}
        onContinue={continueFromStoryIntro}
      />
    );
  }

  // For the story panels, add a key prop to force re-render
  if (currentScreen === 'story-outro' && currentLevel?.storyOutro) {
    return (
      <StoryPanel
        key={`outro-${currentLevel.id}-${Date.now()}`} // Add timestamp to force re-render
        currentLevel={currentLevelIndex}
        onLevelChange={advanceToNextLevel}
        text={currentLevel.storyOutro}
        isIntro={false}
        onContinue={continueFromStoryOutro}
      />
    );
  }

  if (currentScreen === 'complete') {
    return <GameComplete onRestart={restartGame} />;
  }

  // Playing screen
  if (!currentLevel || !currentPuzzle) {
    return <div>Loading next challenge...</div>;
  }

  return (
    <div className="game-container">
      {gameState.isLoading && <div className="loading">Analyzing data...</div>}
      {gameState.error && <div className="error">{gameState.error}</div>}
      
      <ProgressBar 
        currentLevel={currentLevelIndex + 1} 
        totalLevels={levels.length} 
      />
      
      <h1>{currentLevel.name}</h1>
      <p className="level-description">{currentLevel.description}</p>
      
      <div className="level-progress">
        <span>Mission {currentLevelIndex + 1} of {levels.length}</span>
      </div>
      
      <PuzzleComponent
        puzzle={currentPuzzle}
        onSolved={handlePuzzleSolved}
        onUseHint={() => handleHintRequest(currentPuzzle.id)}
        hintsUsed={gameState.hintsUsed[currentPuzzle.id] || 0}
      />
    </div>
  );
}
