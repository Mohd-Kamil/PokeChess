import React, { useEffect, useState } from 'react';
import { playSelectSound, initAudio } from '../../utils/sound';
import mainBg from '../../assets/Background/main_bg.png';
import playBtn from '../../assets/buttons/play.png';
import modesBtn from '../../assets/buttons/modes.png';
import logo from '../../assets/logo/logo.png';

export default function MainMenu({ onSelectMode }) {
    const [showModes, setShowModes] = useState(false);

    useEffect(() => {
        const handleInteract = () => initAudio();
        window.addEventListener('click', handleInteract);
        return () => window.removeEventListener('click', handleInteract);
    }, []);

    const handlePlayClick = () => {
        playSelectSound();
        setShowModes(true);
    };

    const handleModeSelect = (mode) => {
        playSelectSound();
        onSelectMode(mode);
    };

    return (
        <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden">
            <img
                src={mainBg}
                className="absolute inset-0 w-full h-full z-[-1]"
                style={{ objectFit: 'fill' }}
                alt="Background"
            />

            <div className="z-10 flex flex-col items-center gap-6 animate-fade-in-up">
                {/* Logo placed on top */}
                <img src={logo} alt="PokeChess Logo" className="w-[300px] md:w-[400px] drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)] mb-4 -mt-12" />

                {!showModes ? (
                    <button
                        onClick={handlePlayClick}
                        className="hover:scale-105 active:scale-95 transition-transform focus:outline-none animate-pulse-slow"
                    >
                        <img src={playBtn} alt="Play" className="w-[280px] md:w-[380px] drop-shadow-2xl" />
                    </button>
                ) : (
                    <div className="relative w-[340px] md:w-[440px] animate-fade-in hover:scale-105 transition-transform duration-500">
                        <img src={modesBtn} alt="Select Mode" className="w-full drop-shadow-2xl" />

                        {/* Invisible Hit Areas - Horizontal Split */}
                        <div className="absolute inset-0 flex cursor-pointer">
                            {/* Left Half: Single Player */}
                            <div
                                className="w-[50%] h-full transition-colors rounded-l-lg"
                                onClick={() => handleModeSelect('single')}
                                title="Single Player"
                            />
                            {/* Right Half: Multiplayer */}
                            <div
                                className="w-[50%] h-full transition-colors rounded-r-lg"
                                onClick={() => handleModeSelect('multi')}
                                title="Multiplayer"
                            />
                        </div>
                    </div>
                )}

                <p className="text-white/60 text-[10px] font-bold mt-4 animate-pulse">
                    MADE BY MOHD KAMIL
                </p>
            </div>
        </div>
    );
}
