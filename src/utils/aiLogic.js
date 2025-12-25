import { Chess } from 'chess.js';

// Piece values
const PIECE_VALUES = {
    p: 100,
    n: 320,
    b: 330,
    r: 500,
    q: 900,
    k: 20000
};

// Piece-Square Tables (Simple standard ones)
// FLIPPED for Black (AI)? No, we usually view board from white's perspective.
// We need to mirror for black or handle index.
const PST = {
    p: [
        [0, 0, 0, 0, 0, 0, 0, 0],
        [50, 50, 50, 50, 50, 50, 50, 50],
        [10, 10, 20, 30, 30, 20, 10, 10],
        [5, 5, 10, 25, 25, 10, 5, 5],
        [0, 0, 0, 20, 20, 0, 0, 0],
        [5, -5, -10, 0, 0, -10, -5, 5],
        [5, 10, 10, -20, -20, 10, 10, 5],
        [0, 0, 0, 0, 0, 0, 0, 0]
    ],
    n: [
        [-50, -40, -30, -30, -30, -30, -40, -50],
        [-40, -20, 0, 0, 0, 0, -20, -40],
        [-30, 0, 10, 15, 15, 10, 0, -30],
        [-30, 5, 15, 20, 20, 15, 5, -30],
        [-30, 0, 15, 20, 20, 15, 0, -30],
        [-30, 5, 10, 15, 15, 10, 5, -30],
        [-40, -20, 0, 5, 5, 0, -20, -40],
        [-50, -40, -30, -30, -30, -30, -40, -50]
    ],
    b: [
        [-20, -10, -10, -10, -10, -10, -10, -20],
        [-10, 0, 0, 0, 0, 0, 0, -10],
        [-10, 0, 5, 10, 10, 5, 0, -10],
        [-10, 5, 5, 10, 10, 5, 5, -10],
        [-10, 0, 10, 10, 10, 10, 0, -10],
        [-10, 10, 10, 10, 10, 10, 10, -10],
        [-10, 5, 0, 0, 0, 0, 5, -10],
        [-20, -10, -10, -10, -10, -10, -10, -20]
    ],
    r: [
        [0, 0, 0, 0, 0, 0, 0, 0],
        [5, 10, 10, 10, 10, 10, 10, 5],
        [-5, 0, 0, 0, 0, 0, 0, -5],
        [-5, 0, 0, 0, 0, 0, 0, -5],
        [-5, 0, 0, 0, 0, 0, 0, -5],
        [-5, 0, 0, 0, 0, 0, 0, -5],
        [-5, 0, 0, 0, 0, 0, 0, -5],
        [0, 0, 0, 5, 5, 0, 0, 0]
    ],
    q: [
        [-20, -10, -10, -5, -5, -10, -10, -20],
        [-10, 0, 0, 0, 0, 0, 0, -10],
        [-10, 0, 5, 5, 5, 5, 0, -10],
        [-5, 0, 5, 5, 5, 5, 0, -5],
        [0, 0, 5, 5, 5, 5, 0, -5],
        [-10, 5, 5, 5, 5, 5, 0, -10],
        [-10, 0, 5, 0, 0, 0, 0, -10],
        [-20, -10, -10, -5, -5, -10, -10, -20]
    ],
    k: [
        [-30, -40, -40, -50, -50, -40, -40, -30],
        [-30, -40, -40, -50, -50, -40, -40, -30],
        [-30, -40, -40, -50, -50, -40, -40, -30],
        [-30, -40, -40, -50, -50, -40, -40, -30],
        [-20, -30, -30, -40, -40, -30, -30, -20],
        [-10, -20, -20, -20, -20, -20, -20, -10],
        [20, 20, 0, 0, 0, 0, 20, 20],
        [20, 30, 10, 0, 0, 10, 30, 20]
    ]
};

// White is MAX, Black is MIN.
// However, our AI is always BLACK (for now).
// So we want to MINIMIZE the evaluation (if White is positive).
// OR, we can just evaluate from the perspective of the side to move.
// Let's stick to standard: White +, Black -. AI wants smallest score.

function evaluateBoard(game) {
    const board = game.board();
    let totalEvaluation = 0;

    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            const piece = board[r][c];
            if (piece) {
                // Get absolute value
                let value = PIECE_VALUES[piece.type];

                // Position bonus
                // PST arrays are 0-7 from top (Rank 8) to bottom (Rank 1).
                // board[0][0] is a8.
                // Our PSTs are usually defined for White (Rank 1 at bottom).
                // So for White, index 0 is Rank 8 (top). Wait, usually PSTs are defined from Rank 8 to Rank 1 if array is row-major.
                // Let's assume standard row-major: index 0 is top row (a8-h8).
                // The PST above looks like White Pawn table (row 1 is 50 -> Rank 7).
                // So row 1 in array is Rank 7.
                // For White: piece is at r, c.
                // For Black: Mirror the row index? (7 - r).

                let pstValue = 0;
                if (piece.color === 'w') {
                    // White starts at bottom (Rank 1, r=7). 
                    // My PST definition:
                    // Row 0: Top (Rank 8/Promotion for White).
                    // Row 1: Rank 7.
                    // ...
                    // Row 6: Rank 2 (Pawn Start)
                    // Row 7: Rank 1 (White Home)
                    // The 'p' table has 50s at Row 1 (Rank 7). So it matches visual top-down.
                    pstValue = PST[piece.type][r][c];
                    totalEvaluation += (value + pstValue);
                } else {
                    // Black starts at top (Rank 8, r=0).
                    // We need to mirror the PST for Black so that Row 6 (Rank 2) becomes Row 1 (Rank 7) for them.
                    // Actually, just flip the row index: PST[piece.type][7 - r][c].
                    // And mirror column/flanks? Usually chess is symmetric horizontally, but K-side vs Q-side matters.
                    // For simplicity, horizontal symmetry is assumed or tables are rough.
                    // Let's just flip rows.
                    pstValue = PST[piece.type][7 - r][c];
                    totalEvaluation -= (value + pstValue);
                }
            }
        }
    }
    return totalEvaluation;
}

// Minimax with Alpha-Beta
function minimax(game, depth, alpha, beta, isMaximizing) {
    if (depth === 0 || game.isGameOver()) {
        return evaluateBoard(game);
    }

    const moves = game.moves();

    if (isMaximizing) {
        let maxEval = -Infinity;
        for (const move of moves) {
            game.move(move);
            const evalScore = minimax(game, depth - 1, alpha, beta, false);
            game.undo();
            maxEval = Math.max(maxEval, evalScore);
            alpha = Math.max(alpha, evalScore);
            if (beta <= alpha) break;
        }
        return maxEval;
    } else {
        let minEval = Infinity;
        for (const move of moves) {
            game.move(move);
            const evalScore = minimax(game, depth - 1, alpha, beta, true);
            game.undo();
            minEval = Math.min(minEval, evalScore);
            beta = Math.min(beta, evalScore);
            if (beta <= alpha) break;
        }
        return minEval;
    }
}

export function getBestMove(game, difficulty) {
    const gameCopy = new Chess(game.fen());
    const moves = gameCopy.moves({ verbose: true });

    if (moves.length === 0) return null;

    // Difficulty Levels
    // Easy: Random
    if (difficulty === 'easy') {
        return moves[Math.floor(Math.random() * moves.length)];
    }

    // Medium: Minimax Depth 2 (Quick, avoids blunders)
    // Black is minimizing (since White is +).
    // If AI is Black, we want the move with MINIMUM score.
    // If AI is White, we want MAXIMUM.
    // Let's assume AI is the current turn.
    const isAiWhite = game.turn() === 'w';
    const depth = difficulty === 'medium' ? 2 : (difficulty === 'hard' ? 3 : 3); // Expert = 3+ or maybe 4? 4 is slow in JS without optimization. stick to 3.

    // Sort moves to improve Alpha-Beta pruning?
    // Captures first.
    moves.sort((a, b) => {
        const scoreA = (a.flags.includes('c') ? 10 : 0) + (a.promotion ? 5 : 0);
        const scoreB = (b.flags.includes('c') ? 10 : 0) + (b.promotion ? 5 : 0);
        return scoreB - scoreA;
    });

    let bestMove = null;
    let bestValue = isAiWhite ? -Infinity : Infinity;

    // Root Search
    for (const move of moves) {
        gameCopy.move(move);
        // Next node is opponent's turn. 
        // If AI is White (Max), next is Black (Min).
        // If AI is Black (Min), next is White (Max).
        const boardValue = minimax(gameCopy, depth - 1, -Infinity, Infinity, !isAiWhite);
        gameCopy.undo();

        if (isAiWhite) {
            if (boardValue > bestValue) {
                bestValue = boardValue;
                bestMove = move;
            }
        } else {
            if (boardValue < bestValue) {
                bestValue = boardValue;
                bestMove = move;
            }
        }
    }

    // If Expert mode (gm), maybe add a small randomness to avoid opening repetition? 
    // Or just pure best.
    // If Hard/Medium, add some randomness if scores are equal or close?
    // For now, strict best is fine.

    return bestMove || moves[0];
}
