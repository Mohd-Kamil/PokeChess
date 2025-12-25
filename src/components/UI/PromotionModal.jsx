import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import background from '../../assets/Background/backfround.png';

const PROMOTION_OPTIONS = (color) => [
    { id: 'q', label: 'Queen', img: color === 'w' ? '/pieces/white/white_queen.png' : '/pieces/black/black_queen.png' },
    { id: 'r', label: 'Rook', img: color === 'w' ? '/pieces/white/white_rook.png' : '/pieces/black/black_rook.png' },
    { id: 'b', label: 'Bishop', img: color === 'w' ? '/pieces/white/white_bishop.png' : '/pieces/black/black_bishop.png' },
    { id: 'n', label: 'Knight', img: color === 'w' ? '/pieces/white/white_knight.png' : '/pieces/black/black_knight.png' },
];

export default function PromotionModal({ isOpen, onClose, onSelect, color }) {
    if (!isOpen) return null;

    const options = PROMOTION_OPTIONS(color);

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    className="relative w-[95vw] max-w-2xl min-h-[450px] md:min-h-[500px] flex flex-col items-center justify-center p-8 md:p-12"
                    style={{
                        backgroundImage: `url(${background})`,
                        backgroundSize: '100% 100%',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat'
                    }}
                >
                    <h2 className="text-xl md:text-3xl font-bold text-white mb-8 mt-4 drop-shadow-md font-press-start tracking-wider">
                        PROMOTE!
                    </h2>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 w-full px-2 md:px-6 place-items-center">
                        {options.map((opt) => (
                            <button
                                key={opt.id}
                                onClick={() => onSelect(opt.id)}
                                className="group relative w-28 h-28 md:w-36 md:h-36 bg-black/50 hover:bg-yellow-400/30 border-2 md:border-4 border-yellow-400/50 hover:border-yellow-400 rounded-xl transition-all duration-200 flex flex-col items-center justify-center gap-0 hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(250,204,21,0.8)]"
                            >
                                <img
                                    src={opt.img}
                                    alt={opt.label}
                                    className="w-full h-full object-contain pixelated drop-shadow-2xl scale-125 group-hover:scale-150 transition-transform duration-200"
                                />
                            </button>
                        ))}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
