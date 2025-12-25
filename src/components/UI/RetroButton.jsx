import React from 'react';
import { playHoverSound } from '../../utils/sound';

export default function RetroButton({ children, onClick, color = 'blue', className = '' }) {
    const baseColors = {
        blue: 'bg-poke-blue border-blue-900',
        red: 'bg-poke-red border-red-900',
        yellow: 'bg-poke-yellow border-yellow-700 text-black',
        gray: 'bg-gray-700 border-gray-900',
    };

    const colorClasses = baseColors[color] || baseColors.blue;

    return (
        <button
            onClick={onClick}
            onMouseEnter={playHoverSound}
            className={`
                relative w-full py-4 px-6 rounded-lg font-bold uppercase tracking-widest text-lg transition-all
                border-b-4 active:border-b-0 active:translate-y-1 hover:brightness-110
                shadow-lg
                ${colorClasses}
                ${className}
            `}
        >
            {children}
        </button>
    );
}
