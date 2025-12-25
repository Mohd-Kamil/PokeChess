import { useState, useCallback } from 'react';
import { Chess } from 'chess.js';

export function useChessGame() {
    const [game, setGame] = useState(new Chess());
    const [fen, setFen] = useState(game.fen());

    const makeMove = useCallback((move) => {
        try {
            const gameCopy = new Chess();
            gameCopy.loadPgn(game.pgn());
            const result = gameCopy.move(move);
            setGame(gameCopy);
            setFen(gameCopy.fen());
            return result;
        } catch (e) {
            return null;
        }
    }, [game]);

    const getMoves = useCallback((square) => {
        return game.moves({ square, verbose: true });
    }, [game]);

    const resetGame = useCallback((fenString) => {
        const newGame = new Chess(fenString || undefined);
        setGame(newGame);
        setFen(newGame.fen());
    }, []);

    const undo = useCallback(() => {
        const gameCopy = new Chess();
        gameCopy.loadPgn(game.pgn());
        gameCopy.undo();
        setGame(gameCopy);
        setFen(gameCopy.fen());
    }, [game]);

    return {
        game,
        fen,
        makeMove,
        getMoves, // Exporting this for highlighting
        resetGame,
        undo, // Export undo
        isGameOver: game.isGameOver(),
        isCheck: game.isCheck(),
        isCheckmate: game.isCheckmate(),
        inCheck: game.inCheck(), // For visual red king
        turn: game.turn(),
        history: game.history({ verbose: true }),
    };
}
