import { Chess } from 'chess.js';
import { getBestMove } from '../utils/aiLogic';

self.onmessage = (e) => {
    const { fen, difficulty } = e.data;
    const game = new Chess(fen);

    // Calculate best move
    const bestMove = getBestMove(game, difficulty);

    // Send back the move (object or null)
    self.postMessage(bestMove);
};
