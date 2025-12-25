import React, { useState, useEffect } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';
import { motion, AnimatePresence } from 'framer-motion';
import PromotionModal from '../UI/PromotionModal';
import CapturedPieces from '../UI/CapturedPieces';
import { CustomDragLayer } from './CustomDragLayer';
import { PIECE_ASSETS } from '../../utils/assets';
import boardBg from '../../assets/board/board.png';

const ItemTypes = { PIECE: 'piece' };

function Piece({ piece, position, canInteract, scale = 1, offsetY = 0 }) {
    const [{ isDragging }, drag, preview] = useDrag(() => ({
        type: ItemTypes.PIECE,
        item: { piece, from: position },
        canDrag: () => canInteract,
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
    }), [canInteract]);

    useEffect(() => {
        preview(getEmptyImage(), { captureDraggingState: true });
    }, [preview]);

    const pieceImage = PIECE_ASSETS[piece.color][piece.type];

    return (
        <motion.div
            ref={drag}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: isDragging ? 0.3 : 1 }}
            exit={{ scale: 0, opacity: 0, transition: { duration: 0.5 } }}
            className={`w-full h-full flex items-center justify-center z-10 relative ${canInteract && !isDragging ? 'cursor-pointer hover:bg-white/10 rounded-full' : 'cursor-default'}`}
        >
            {pieceImage ? (
                <img
                    src={pieceImage}
                    alt={`${piece.color}${piece.type}`}
                    // pointer-events-none ensures clicks pass through the huge image "head" to the square behind
                    className="absolute bottom-0 w-full h-full pixelated object-contain drop-shadow-md pointer-events-none"
                    style={{
                        transform: `scale(${scale}) translateY(${offsetY}%)`,
                        transformOrigin: 'center bottom',
                        maxHeight: 'none', // Allow overflow
                        maxWidth: 'none'
                    }}
                />
            ) : (
                <span className="text-white font-bold">{piece.type}</span>
            )}
        </motion.div>
    );
}

function Square({ x, y, children, onMove, onClick, isSelected, isPossibleMove, isCapture, isCheck }) {
    const [{ isOver }, drop] = useDrop(() => ({
        accept: ItemTypes.PIECE,
        drop: (item) => onMove(item.from, `${String.fromCharCode(97 + x)}${8 - y}`),
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
        }),
    }), [x, y, onMove]);

    let bgClass = '';
    if (isCheck) bgClass = 'bg-red-500/60 animate-pulse';
    else if (isSelected) bgClass = 'bg-yellow-400/50';
    else if (isOver) bgClass = 'bg-yellow-400/30';

    return (
        <div
            ref={drop}
            onClick={onClick}
            className={`w-full h-full flex items-center justify-center ${bgClass} relative`}
            style={{ aspectRatio: '1/1' }}
        >
            <AnimatePresence>
                {children}
            </AnimatePresence>
        </div>
    );
}

export default function Board({ game, onMove, getMoves, canInteract = true, capturedPieces }) {
    const [selectedSquare, setSelectedSquare] = useState(null);
    const [possibleMoves, setPossibleMoves] = useState([]);
    const [promotionMove, setPromotionMove] = useState(null);

    const board = game.board();

    const handleMoveAttempt = (from, to) => {
        if (!canInteract) return;

        const piece = game.get(from);
        const isPawn = piece?.type === 'p';
        const targetRank = to[1];
        const isPromotion = isPawn && (targetRank === '8' || targetRank === '1');

        if (isPromotion) {
            setPromotionMove({ from, to, color: piece.color });
        } else {
            onMove(from, to, 'q');
        }

        setSelectedSquare(null);
        setPossibleMoves([]);
    };

    const handleSquareClick = (square) => {
        if (!canInteract) return;

        if (selectedSquare === square) {
            setSelectedSquare(null);
            setPossibleMoves([]);
            return;
        }

        const move = possibleMoves.find(m => m.to === square);
        if (move && selectedSquare) {
            handleMoveAttempt(selectedSquare, square);
        } else {
            const piece = game.get(square);
            if (piece && piece.color === game.turn()) {
                setSelectedSquare(square);
                setPossibleMoves(getMoves(square));
            } else {
                setSelectedSquare(null);
                setPossibleMoves([]);
            }
        }
    };

    const handleDrop = (from, to) => {
        if (canInteract) handleMoveAttempt(from, to);
    };

    const handlePromotionSelect = (pieceSymbol) => {
        if (promotionMove) {
            onMove(promotionMove.from, promotionMove.to, pieceSymbol);
            setPromotionMove(null);
        }
    };

    let checkSquare = null;
    if (game.inCheck()) {
        const turn = game.turn();
        for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++) {
                const p = board[r][c];
                if (p && p.type === 'k' && p.color === turn) {
                    checkSquare = `${String.fromCharCode(97 + c)}${8 - r}`;
                }
            }
        }
    }

    // Final Calibrated Values
    const PIECE_CONFIG = {
        w: { p: { scale: 1, y: 28 }, n: { scale: 1.2, y: 23 }, b: { scale: 1.1, y: 27 }, r: { scale: 1, y: 23 }, q: { scale: 1, y: 18 }, k: { scale: 0.95, y: 18 } },
        b: { p: { scale: 1, y: 26 }, n: { scale: 1.05, y: 22 }, b: { scale: 1.25, y: 28 }, r: { scale: 0.75, y: 13 }, q: { scale: 1, y: 24 }, k: { scale: 0.9, y: 18 } }
    };

    const GRID_CONFIG = {
        width: 700,
        height: 505,
        x: -2,
        y: 0,
        perspective: 1000,
        rotateX: 0,
        pieceScale: 1.8
    };

    return (
        <div className="flex items-center justify-center relative overscroll-none w-screen h-screen overflow-hidden">
            <CustomDragLayer />

            <PromotionModal
                isOpen={!!promotionMove}
                color={promotionMove?.color}
                onSelect={handlePromotionSelect}
                onClose={() => setPromotionMove(null)}
            />

            {/* MAIN BOARD SCALE WRAPPER */}
            {/* 
                This div handles the responsiveness.
                By default (mobile), it scales down to 0.55x.
                On md screens (desktop), it scales up to 1.0x.
            */}
            {/* MAIN BOARD SCALE WRAPPER */}
            {/* 
                Responsive Scaling:
                - Default (Mobile Portrait): 0.55x
                - Landscape (Mobile): 0.45x (Fits height)
                - Medium (Tablet/Desktop): 1.0x (Restores full size)
            */}
            <div
                className="relative flex items-center justify-center transition-transform duration-300 origin-center transform scale-[0.55] landscape:scale-[0.35] md:scale-100 md:landscape:scale-100"
            >
                {/* 
                   BOARD BACKGROUND CONTAINER (Fixed Dimensions for Calibration)
                */}
                <div
                    className="relative flex items-center justify-center select-none mb-12"
                    style={{
                        width: '1000px',
                        height: '750px',
                        backgroundImage: `url(${boardBg})`,
                        backgroundSize: '100% 100%',
                        backgroundPosition: 'center',
                    }}
                >
                    {/* Captured Pieces Removed per User Request */}

                    {/* 
                       Dynamic Grid Positioning - CALIBRATED
                    */}
                    <div
                        className="absolute flex items-center justify-center"
                        style={{
                            transform: `translate(${GRID_CONFIG.x}px, ${GRID_CONFIG.y}px) perspective(${GRID_CONFIG.perspective}px) rotateX(${GRID_CONFIG.rotateX}deg)`
                        }}
                    >
                        <div
                            className="grid grid-cols-8 grid-rows-8 gap-0"
                            style={{ width: `${GRID_CONFIG.width}px`, height: `${GRID_CONFIG.height}px` }}
                        >
                            {board.map((row, rIndex) => (
                                row.map((piece, cIndex) => {
                                    const squareId = `${String.fromCharCode(97 + cIndex)}${8 - rIndex}`;
                                    const isSelected = selectedSquare === squareId;
                                    const move = possibleMoves.find(m => m.to === squareId);
                                    const isPossibleMove = !!move;
                                    const isCapture = move?.flags.includes('c') || move?.flags.includes('e');
                                    const isCheck = checkSquare === squareId;

                                    return (
                                        <Square
                                            key={squareId}
                                            x={cIndex}
                                            y={rIndex}
                                            onMove={handleDrop}
                                            onClick={() => handleSquareClick(squareId)}
                                            isSelected={isSelected}
                                            isPossibleMove={isPossibleMove}
                                            isCapture={isCapture}
                                            isCheck={isCheck}
                                        >
                                            {/* Highlights: Clean Professional Look */}
                                            {isPossibleMove && !isCapture && (
                                                <div className="absolute w-4 h-4 rounded-full z-10 bg-black/20"></div>
                                            )}
                                            {isPossibleMove && isCapture && (
                                                <div className="absolute w-full h-full border-[6px] border-red-500/50 rounded-full z-10 animate-ping"></div>
                                            )}

                                            <AnimatePresence>
                                                {piece && (
                                                    <Piece
                                                        key={`${piece.type}-${piece.color}-${squareId}`}
                                                        piece={piece}
                                                        position={squareId}
                                                        canInteract={canInteract && piece.color === game.turn()}
                                                        // Calculate Final Scale: Global Grid Scale * Piece Specific Multiplier
                                                        scale={GRID_CONFIG.pieceScale * (PIECE_CONFIG[piece.color][piece.type]?.scale || 1)}
                                                        // Pass Y Offset (Percentage)
                                                        offsetY={PIECE_CONFIG[piece.color][piece.type]?.y || 0}
                                                    />
                                                )}
                                            </AnimatePresence>
                                        </Square>
                                    );
                                })
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
