import { useEffect, useRef } from 'react';
import AIWorker from '../workers/aiWorker?worker';

export function useAi(game, makeMove, difficulty, gameMode) {
    const workerRef = useRef(null);
    const makeMoveRef = useRef(makeMove);

    // Keep the ref updated with the latest makeMove function
    // This fixes the stale closure issue where the worker used the initial render's makeMove
    useEffect(() => {
        makeMoveRef.current = makeMove;
    }, [makeMove]);

    // Initialize Worker Lifecycle
    useEffect(() => {
        // Create worker instance once
        workerRef.current = new AIWorker();

        // Handle worker messages (decisions)
        workerRef.current.onmessage = (e) => {
            const bestMove = e.data;
            if (bestMove) {
                // Use the ref to access the *current* makeMove closure
                makeMoveRef.current(bestMove);
            }
        };

        // Cleanup on unmount
        return () => {
            if (workerRef.current) {
                workerRef.current.terminate();
            }
        };
    }, []); // Empty dependency array ensures one worker per session

    // Trigger AI Calculation on Game State Change
    useEffect(() => {
        // Only run if: Single Player, AI turn (Black), Game Active
        if (gameMode !== 'single' || !difficulty || game.isGameOver() || game.turn() === 'w') {
            return;
        }

        // Add a small natural delay before AI "thinks"
        const delay = 300;
        const timer = setTimeout(() => {
            if (workerRef.current) {
                workerRef.current.postMessage({
                    fen: game.fen(),
                    difficulty: difficulty.id
                });
            }
        }, delay);

        return () => clearTimeout(timer);
    }, [game, difficulty, gameMode]);
}
