import React from 'react';

// Map standard chess piece codes to our Pokemon assets
const PIECE_ICONS = {
    w: {
        p: '/pieces/white/white_pawn.png',
        n: '/pieces/white/white_knight.png',
        b: '/pieces/white/white_bishop.png',
        r: '/pieces/white/white_rook.png',
        q: '/pieces/white/white_queen.png',
        k: '/pieces/white/white_king.png',
    },
    b: {
        p: '/pieces/black/black_pawn.png',
        n: '/pieces/black/black_knight.png',
        b: '/pieces/black/black_bishop.png',
        r: '/pieces/black/black_rook.png',
        q: '/pieces/black/black_queen.png',
        k: '/pieces/black/black_king.png',
    },
};

export default function CapturedPieces({ pieces, color }) {
    // pieces is an array of captured piece strings (e.g., 'p', 'n') belonging to 'color'
    // 'color' is the color of the PIECES, not the player who captured them.
    // e.g. Left Panel (Player 2's captures) displays WHITE pieces (if Player 2 is Black).

    return (
        <div className="flex flex-col gap-1 items-center w-full">
            {pieces.map((p, i) => {
                const icon = PIECE_ICONS[color][p];
                return (
                    <div key={i} className="w-100 h-25 md:w-14 md:h-14 animate-fade-in transition-transform hover:scale-125 hover:z-10 relative cursor-help" title={`Captured ${p.toUpperCase()}`}>
                        <img src={icon} alt={p} className="w-full h-full object-contain drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)]" />
                    </div>
                );
            })}
        </div>
    );
}
