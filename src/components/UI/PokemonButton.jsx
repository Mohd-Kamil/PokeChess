import React from 'react';
import { playHoverSound, playSelectSound } from '../../utils/sound';

export default function PokemonButton({ children, onClick, color = 'blue', className = '' }) {
    // Pure CSS Pixel Art Styles
    // GBA Style: crisp borders, distinctive shadows

    const colors = {
        blue: {
            bg: 'bg-blue-500',
            border: 'border-blue-700',
            shadow: 'bg-blue-800',
            highlight: 'bg-blue-400',
            text: 'text-white'
        },
        red: {
            bg: 'bg-red-500',
            border: 'border-red-700',
            shadow: 'bg-red-800',
            highlight: 'bg-red-400',
            text: 'text-white'
        },
        yellow: {
            bg: 'bg-yellow-400',
            border: 'border-yellow-600',
            shadow: 'bg-yellow-700',
            highlight: 'bg-yellow-200',
            text: 'text-yellow-900'
        },
        gray: {
            bg: 'bg-gray-200',
            border: 'border-gray-400',
            shadow: 'bg-gray-500',
            highlight: 'bg-gray-100',
            text: 'text-gray-800'
        }
    };

    const c = colors[color] || colors.blue;

    const handleClick = (e) => {
        playSelectSound();
        if (onClick) onClick(e);
    };

    return (
        <button
            onClick={handleClick}
            onMouseEnter={() => playHoverSound()}
            className={`
                group relative
                inline-flex items-center justify-center
                font-['Press_Start_2P'] text-[10px] md:text-xs uppercase tracking-wider
                py-3 px-6
                transition-transform active:translate-y-1 z-10
                ${c.text}
                ${className}
            `}
            style={{ imageRendering: 'pixelated' }}
        >
            {/* 
                CSS PIXEL ART BUTTON CONSTRUCTION 
                We use multiple divs to create the "box shadow" pixel look without blurring
            */}

            {/* 1. Deep Shadow (Bottom Right) */}
            <div className={`absolute inset-0 translate-y-1 translate-x-1 rounded-sm ${c.shadow}`}></div>

            {/* 2. Main Body */}
            <div className={`absolute inset-0 border-2 rounded-sm ${c.bg} ${c.border} flex flex-col items-center justify-center overflow-hidden`}>
                {/* Top Shine */}
                <div className={`absolute top-0 left-0 right-0 h-1/2 opacity-20 bg-gradient-to-b from-white to-transparent`}></div>
            </div>

            {/* 3. Text Content */}
            <span className="relative z-10 drop-shadow-md">
                {children}
            </span>
        </button>
    );
}
