import { useEffect, useRef } from 'react';
import AIWorker from '../workers/aiWorker?worker';

export function useAi(game, makeMove, difficulty, gameMode) {
    useEffect(() => {
        if (gameMode !== 'single' || !difficulty || game.isGameOver() || game.turn() === 'w') {
            return; // AI only plays Black
        }

        const delay = 100; // Minimal delay for responsiveness
        let worker;

        const timer = setTimeout(() => {
            // Instantiate Worker
            worker = new AIWorker();

            worker.onmessage = (e) => {
                const bestMove = e.data;
                if (bestMove) {
                    makeMove(bestMove);
                }
                worker.terminate();
            };

            worker.postMessage({
                fen: game.fen(),
                difficulty: difficulty.id
            });

        }, delay);

        return () => {
            clearTimeout(timer);
            if (worker) worker.terminate();
        };
    }, [game, difficulty, gameMode, makeMove]);
}
