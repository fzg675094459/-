
import React, { useState, useEffect } from 'react';
import { PuzzleSymbol } from '../types';
import Button from '../components/Button';
import { audioManager } from '../services/audioManager';

interface PuzzleSceneProps {
  onSolve: () => void;
  onFail: () => void;
}

// Correct sequence: Thunder -> Fire -> Mountain
const SEQUENCE = [PuzzleSymbol.THUNDER, PuzzleSymbol.FIRE, PuzzleSymbol.MOUNTAIN];

const PuzzleScene: React.FC<PuzzleSceneProps> = ({ onSolve, onFail }) => {
  const [inputSequence, setInputSequence] = useState<PuzzleSymbol[]>([]);
  const [shaking, setShaking] = useState(false);

  useEffect(() => {
    // Check sequence
    if (inputSequence.length === 0) return;

    const currentIndex = inputSequence.length - 1;
    
    if (inputSequence[currentIndex] !== SEQUENCE[currentIndex]) {
      // Wrong input immediately triggers fail visual, then reset or jumpscare
      triggerFail();
    } else if (inputSequence.length === SEQUENCE.length) {
      // Success
      audioManager.playClick();
      setTimeout(onSolve, 800);
    } else {
      audioManager.playClick();
    }
  }, [inputSequence]);

  const triggerFail = () => {
    setShaking(true);
    audioManager.playClick(); 
    // Small punishment delay
    setTimeout(() => {
      setInputSequence([]);
      setShaking(false);
      // 20% chance to die on wrong move
      if (Math.random() < 0.2) onFail(); 
    }, 600);
  };

  const handlePress = (symbol: PuzzleSymbol) => {
    if (shaking) return;
    setInputSequence(prev => [...prev, symbol]);
  };

  const getSymbolName = (s: PuzzleSymbol) => {
      switch(s) {
          case PuzzleSymbol.THUNDER: return '震 (雷)';
          case PuzzleSymbol.FIRE: return '离 (火)';
          case PuzzleSymbol.WIND: return '巽 (风)';
          case PuzzleSymbol.MOUNTAIN: return '艮 (山)';
      }
  };

  return (
    <div className={`h-full w-full flex flex-col items-center justify-center bg-stone-950 p-4 transition-transform duration-100 ${shaking ? 'translate-x-1 rotate-1' : ''}`}>
      {shaking && <div className="absolute inset-0 bg-red-500/10 z-0 animate-pulse"></div>}
      
      <div className="mb-8 text-center space-y-4 z-10">
        <h2 className="text-4xl text-stone-300 font-serif tracking-[0.3em] text-shadow-sm">五行封印</h2>
        <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-blood-red to-transparent mx-auto"></div>
        <p className="text-lg text-stone-500 font-serif italic opacity-80">
          " 逆转五行，以雷引火，化火为山 "
        </p>
      </div>

      {/* Talisman Area */}
      <div className="relative w-80 h-96 bg-[#2a1d1d] border-2 border-[#3d2b2b] flex flex-wrap items-center justify-center gap-6 p-8 shadow-[0_0_100px_rgba(0,0,0,0.9)_inset] z-10">
        {/* Background texture char */}
        <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none select-none overflow-hidden">
            <span className="text-[12rem] font-serif text-black leading-none">禁</span>
        </div>

        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#1a1111] border border-stone-800 px-8 py-2 text-blood-red font-serif text-base tracking-[0.3em] shadow-xl uppercase">
           急急如律令
        </div>

        {Object.values(PuzzleSymbol).map((symbol) => (
          <button
            key={symbol}
            onClick={() => handlePress(symbol)}
            className={`
              w-24 h-24 rounded-full border border-stone-800 flex flex-col items-center justify-center gap-1 transition-all duration-300 active:scale-90
              ${inputSequence.includes(symbol) 
                ? 'bg-blood-red text-black shadow-[0_0_30px_rgba(138,28,28,0.8)] border-blood-red scale-95' 
                : 'bg-black/60 text-stone-400 hover:text-stone-200 hover:bg-black/80 hover:border-stone-600'}
            `}
          >
            <span className="text-4xl drop-shadow-md">{symbol}</span>
            <span className="text-xs scale-75 opacity-70 font-serif tracking-widest">{getSymbolName(symbol)}</span>
          </button>
        ))}
      </div>

      {/* Status */}
      <div className="mt-12 flex flex-col items-center gap-4 h-16 justify-end z-10">
        <div className="flex gap-6">
            {SEQUENCE.map((_, i) => (
            <div 
                key={i} 
                className={`w-4 h-4 rotate-45 border transition-all duration-500 ${
                    i < inputSequence.length 
                    ? 'bg-blood-red border-blood-red shadow-[0_0_15px_rgba(138,28,28,1)] scale-110' 
                    : 'bg-stone-900 border-stone-800'
                }`}
            />
            ))}
        </div>
        <p className="text-xs text-stone-700 font-serif tracking-widest">
            {inputSequence.length === 0 ? '等待施法...' : '仪式进行中'}
        </p>
      </div>
    </div>
  );
};

export default PuzzleScene;
