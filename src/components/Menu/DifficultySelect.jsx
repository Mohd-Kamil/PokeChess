import React from 'react';
import RetroButton from '../UI/RetroButton';

const DIFFICULTIES = [
    { id: 'easy', elo: 400, trainer: 'Youngster', color: 'green', img: '/bots/bot_easy.png' },
    { id: 'medium', elo: 800, trainer: 'Ace Trainer', color: 'yellow', img: '/bots/bot_medium.png' },
    { id: 'hard', elo: 1200, trainer: 'Gym Leader', color: 'red', img: '/bots/bot_hard.png' },
    { id: 'gm', elo: 2500, trainer: 'Champion', color: 'purple', img: '/bots/bot_expert.png' },
];

export default function DifficultySelect({ onSelect, onBack }) {
    return (
        <div className="relative w-full h-full flex flex-col items-center justify-center p-2 md:p-4 animate-fade-in">
            <h2 className="text-xl md:text-4xl text-white font-bold mb-4 md:mb-12 drop-shadow-lg font-russo tracking-wider text-center shrink-0">
                CHOOSE YOUR OPPONENT
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 w-full max-w-6xl px-2">
                {DIFFICULTIES.map((diff) => (
                    <button
                        key={diff.id}
                        onClick={() => onSelect(diff)}
                        className="group relative flex flex-col items-center bg-gray-800/40 hover:bg-gray-700/60 border border-white/10 hover:border-white/40 rounded-xl md:rounded-2xl p-3 md:p-6 transition-all duration-300 hover:-translate-y-2 w-full backdrop-blur-sm shadow-xl"
                    >
                        {/* Avatar with Glow */}
                        <div className={`relative w-20 h-20 md:w-32 md:h-32 mb-2 md:mb-4 rounded-full overflow-hidden border-2 md:border-4 border-white/10 group-hover:border-${diff.color}-400 transition-colors shadow-2xl shrink-0`}>
                            <img src={diff.img} alt={diff.trainer} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                            <div className={`absolute inset-0 bg-${diff.color}-500/0 group-hover:bg-${diff.color}-500/20 transition-colors`}></div>
                        </div>

                        {/* Info */}
                        <h3 className="text-xs md:text-2xl font-bold text-white uppercase mb-1 font-russo tracking-wide group-hover:text-poke-yellow transition-colors">{diff.trainer}</h3>
                        <span className="text-white/60 text-[10px] md:text-sm font-bold bg-black/30 px-2 md:px-3 py-0.5 md:py-1 rounded-full border border-white/5">
                            ELO: {diff.elo}
                        </span>
                    </button>
                ))}
            </div>

            <div className="mt-12">
                <RetroButton onClick={onBack} color="gray" className="py-2 px-8 text-sm opacity-80 hover:opacity-100">
                    RETURN TO MENU
                </RetroButton>
            </div>
        </div>
    );
}
