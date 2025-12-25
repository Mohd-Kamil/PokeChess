import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PokemonButton from './PokemonButton';
import victoryBg from '../../assets/victory/Gemini_Generated_Image_lkpopblkpopblkpo.png';

export default function GameOverModal({ isOpen, winner, reason, onRestart, onExit }) {
    if (!isOpen) return null;

    let subTitle = reason;
    let colorClass = "text-white";

    if (winner === 'w') {
        colorClass = "text-yellow-400"; // Gold
    } else if (winner === 'b') {
        colorClass = "text-red-500"; // Red
    } else {
        colorClass = "text-gray-300";
    }

    if (reason === 'Stalemate') subTitle = "Stalemate - No Legal Moves";
    if (reason === 'Draw') subTitle = "Draw - Insufficient Material / Repetition";

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    // Container for the victory content
                    className="relative flex flex-col items-center justify-center gap-6 p-6 max-w-2xl w-full"
                >
                    {/* Victory Image - Centered and Large */}
                    <img
                        src={victoryBg}
                        alt="Victory"
                        className="w-full max-w-md object-contain drop-shadow-2xl"
                    />

                    {/* Text & Controls - Below the Image */}
                    <div className="flex flex-col items-center gap-4 w-full">
                        <p className={`font-press-start text-xs md:text-sm ${colorClass} uppercase tracking-widest drop-shadow-[2px_2px_0_rgba(0,0,0,0.8)] bg-black/40 px-6 py-2 rounded-lg border-2 border-white/20`}>
                            {subTitle || "VICTORY!"}
                        </p>

                        <div className="flex gap-4 justify-center mt-2">
                            <PokemonButton
                                onClick={onExit}
                                color="gray"
                                className="w-32"
                            >
                                EXIT
                            </PokemonButton>
                            <PokemonButton
                                onClick={onRestart}
                                color="blue"
                                className="w-40 animate-pulse-slow"
                            >
                                REMATCH
                            </PokemonButton>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
