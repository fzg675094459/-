
import React from 'react';
import Button from '../components/Button';
import { audioManager } from '../services/audioManager';

interface IntroSceneProps {
  onStart: () => void;
}

const IntroScene: React.FC<IntroSceneProps> = ({ onStart }) => {
  const handleStart = () => {
    // Unlock audio context on first user interaction
    audioManager.init();
    audioManager.playClick();
    audioManager.playAmbience();
    onStart();
  };

  return (
    <div className="flex flex-col items-center justify-center h-full w-full text-center p-8 bg-black relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
         <div className="absolute top-10 left-10 w-24 h-64 border-2 border-blood-red opacity-50 writing-vertical-rl text-3xl font-serif text-blood-red select-none">
            奠
         </div>
         <div className="absolute bottom-10 right-10 w-24 h-64 border-2 border-blood-red opacity-50 writing-vertical-rl text-3xl font-serif text-blood-red select-none">
            忌
         </div>
      </div>

      <div className="mb-12 space-y-4 z-10">
        <h1 className="text-6xl md:text-7xl font-serif text-blood-red tracking-widest animate-pulse-slow drop-shadow-[0_0_15px_rgba(138,28,28,0.9)] scale-y-110">
          古 符
        </h1>
        <p className="text-xl text-stone-500 tracking-[0.5em] uppercase opacity-80 border-t border-stone-800 pt-4 mt-4">
          The Old Talisman
        </p>
      </div>

      <div className="max-w-xs text-sm text-stone-600 mb-12 border-y border-stone-800 py-6 space-y-2 font-serif">
        <p className="mb-2 text-stone-400">⚠️ <span className="text-blood-red">警告</span></p>
        <p>包含突发惊吓与高频闪光</p>
        <p>请佩戴耳机以获得最佳体验</p>
      </div>

      <Button onClick={handleStart} className="text-2xl px-12 py-3 border-blood-red text-blood-red hover:bg-blood-red hover:text-black">
        入 局
      </Button>
      
      <div className="absolute bottom-4 text-xs text-stone-800">
        v1.3.0 | 扩充版
      </div>
    </div>
  );
};

export default IntroScene;
