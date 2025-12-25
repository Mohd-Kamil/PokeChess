import React, { useState, useCallback, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Board from './components/Board/Board';
import MainMenu from './components/Menu/MainMenu';
import DifficultySelect from './components/Menu/DifficultySelect';
import GameOverModal from './components/UI/GameOverModal';
import PokemonButton from './components/UI/PokemonButton';
import { useChessGame } from './hooks/useChessGame';
import { useAi } from './hooks/useAi';
import { playMoveSound, playCaptureSound, playGameStartSound, playCheckSound, playSelectSound } from './utils/sound';
import mainBg from './assets/Background/main_bg.png';
import menuBtn from './assets/buttons/MENU.png';
import restartBtn from './assets/buttons/RESTART.png';
import undoBtn from './assets/buttons/UNDO.png';

function App() {
  const { game, makeMove, resetGame, getMoves, inCheck, undo } = useChessGame();

  // Game Over Logic
  const isGameOver = game.isGameOver();
  const getGameOverReason = () => {
    if (game.isCheckmate()) return "Checkmate";
    if (game.isDraw()) return "Draw";
    if (game.isStalemate()) return "Stalemate";
    return "Game Over";
  };
  const winner = game.turn() === 'w' ? 'b' : 'w';

  // Check Sound
  useEffect(() => {
    if (inCheck && !isGameOver) {
      setTimeout(() => playCheckSound(), 200);
    }
  }, [inCheck, isGameOver]);

  const handleMove = useCallback((moveOrFrom, to, promotion = 'q') => {
    let move;
    if (typeof moveOrFrom === 'object') {
      move = moveOrFrom;
    } else {
      move = { from: moveOrFrom, to, promotion };
    }

    const result = makeMove(move);
    if (result) {
      if (result.flags.includes('c') || result.flags.includes('e')) {
        playCaptureSound();
      } else {
        playMoveSound();
      }
    }
    return result;
  }, [makeMove]);

  const [screen, setScreen] = useState('menu');
  const [gameMode, setGameMode] = useState(null);
  const [difficulty, setDifficulty] = useState(null);

  const isPlayerTurn = !isGameOver && (gameMode === 'multi' || game.turn() === 'w');

  useAi(game, handleMove, difficulty, gameMode);

  // Calculate captured pieces
  const history = game.history({ verbose: true });
  const capturedPieces = {
    w: history.filter(m => m.color === 'b' && m.captured).map(m => m.captured), // Captured White pieces (by Black)
    b: history.filter(m => m.color === 'w' && m.captured).map(m => m.captured), // Captured Black pieces (by White)
  };

  const handleModeSelect = (mode) => {
    setGameMode(mode);
    if (mode === 'single') {
      setScreen('difficulty');
    } else {
      setScreen('game');
      playGameStartSound();
      resetGame();
    }
  };

  const handleDifficultySelect = (diff) => {
    setDifficulty(diff);
    setScreen('game');
    playGameStartSound();
    resetGame();
  };

  const handleBackToMenu = () => {
    setScreen('menu');
    setGameMode(null);
    setDifficulty(null);
  };

  const resetAndPlay = () => {
    resetGame();
    playSelectSound();
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div
        className="min-h-screen w-screen flex flex-col items-center justify-center bg-gray-900 text-white font-['Press_Start_2P'] bg-center overflow-hidden"
        style={{
          backgroundImage: `url(${mainBg})`,
          backgroundSize: '100% 100%', // Force full stretch to show entire image
          imageRendering: 'auto' // Ensure smooth scaling (not pixelated)
        }}
      >

        {screen === 'menu' && (
          <MainMenu onSelectMode={handleModeSelect} />
        )}

        {screen === 'difficulty' && (
          <DifficultySelect onSelect={handleDifficultySelect} onBack={handleBackToMenu} />
        )}

        {screen === 'game' && (
          <div className="flex flex-col items-center animate-fade-in relative w-full h-full justify-center">

            <GameOverModal
              isOpen={isGameOver}
              winner={game.isCheckmate() ? winner : 'd'}
              reason={getGameOverReason()}
              onRestart={resetAndPlay}
              onExit={handleBackToMenu}
            />

            {/* GAME CONTROLS - Responsive Layout */}
            {/* Mobile Portrait: Top Row | Desktop & Landscape: Left Column Absolute */}
            <div className="flex flex-row justify-center gap-2 w-full mb-2 z-50 
                            md:absolute md:top-1/2 md:left-8 md:-translate-y-1/2 md:flex-col md:w-32 md:gap-6 md:mb-0
                            landscape:absolute landscape:top-1/2 landscape:left-8 landscape:-translate-y-1/2 landscape:flex-col landscape:w-32 landscape:gap-6 landscape:mb-0">
              <button
                onClick={handleBackToMenu}
                className="w-24 md:w-full landscape:w-full hover:scale-105 active:scale-95 transition-transform"
              >
                <img src={menuBtn} alt="MENU" className="w-full drop-shadow-md" />
              </button>
              <button
                onClick={resetAndPlay}
                className="w-24 md:w-full landscape:w-full hover:scale-105 active:scale-95 transition-transform"
              >
                <img src={restartBtn} alt="RESTART" className="w-full drop-shadow-md" />
              </button>
              <button
                onClick={undo}
                className="w-24 md:w-full landscape:w-full hover:scale-105 active:scale-95 transition-transform"
              >
                <img src={undoBtn} alt="UNDO" className="w-full drop-shadow-md" />
              </button>
            </div>

            {/* Removed VS Trainer Overlay per user request */}

            <Board
              game={game}
              onMove={handleMove}
              getMoves={getMoves}
              canInteract={isPlayerTurn}
              capturedPieces={capturedPieces}
            />
            {/* Removed bottom-right button */}
          </div>
        )}
      </div>
    </DndProvider>
  );
}

export default App;
