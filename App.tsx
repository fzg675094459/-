
import React, { useState, useEffect } from 'react';
import IntroScene from './scenes/IntroScene';
import ExplorationScene from './scenes/ExplorationScene';
import PuzzleScene from './scenes/PuzzleScene';
import Vignette from './components/Vignette';
import { GameState, ExplorationStage } from './types';
import { audioManager } from './services/audioManager';
import Button from './components/Button';
import { IMAGES } from './constants';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.INTRO);
  const [explorationStage, setExplorationStage] = useState<ExplorationStage>(ExplorationStage.ENTER);
  const [narrativeText, setNarrativeText] = useState<string>('');

  useEffect(() => {
    const preventDefault = (e: TouchEvent) => {
      if (e.touches.length > 1) e.preventDefault();
    };
    document.addEventListener('touchmove', preventDefault, { passive: false });
    return () => document.removeEventListener('touchmove', preventDefault);
  }, []);

  // Handle Ending Audio
  useEffect(() => {
    let stopFire: (() => void) | undefined;
    if (gameState === GameState.ENDING) {
        stopFire = audioManager.playFireSound();
    }
    return () => {
        if (stopFire) stopFire();
    };
  }, [gameState]);

  const triggerJumpscare = () => {
    setGameState(GameState.JUMPSCARE);
    audioManager.stopAmbience();
    audioManager.playJumpscare();
    
    setTimeout(() => {
        setGameState(GameState.INTRO); 
        setExplorationStage(ExplorationStage.ENTER);
    }, 2500);
  };

  const handleCloseReading = () => {
    audioManager.playPaperFoley();
    setGameState(GameState.EXPLORATION);
  };

  const renderScene = () => {
    switch (gameState) {
      case GameState.INTRO:
        return <IntroScene onStart={() => setGameState(GameState.EXPLORATION)} />;
      
      case GameState.EXPLORATION:
        return (
          <ExplorationScene 
            stage={explorationStage}
            setStage={setExplorationStage}
            onReadDiary={(text) => {
              setNarrativeText(text);
              setGameState(GameState.READING);
            }}
            onInspectClue={(text) => {
              setNarrativeText(text);
              setGameState(GameState.OBSERVING);
            }}
            onEnterPuzzle={() => setGameState(GameState.PUZZLE)}
            onTriggerJumpscare={triggerJumpscare}
          />
        );

      case GameState.READING: // The Diary (Paper style)
        return (
            <div className="h-full w-full flex items-center justify-center p-6 bg-black/90 z-40 absolute inset-0 backdrop-blur-sm animate-fade-in">
                <div 
                    className="bg-[#f0e68c] text-stone-900 p-8 max-w-md w-full shadow-[0_0_50px_rgba(0,0,0,0.8)] relative font-serif border-l-4 border-stone-800 overflow-y-auto max-h-[80vh]"
                    style={{ backgroundImage: `url(${IMAGES.PAPER_TEXTURE})`, backgroundBlendMode: 'multiply' }}
                >
                    <div className="absolute -top-3 -right-3 w-12 h-12 bg-blood-red rounded-full opacity-80 blur-sm"></div>
                    <h3 className="text-2xl font-bold mb-6 text-stone-900 border-b-2 border-stone-800 pb-4 tracking-[0.2em] sticky top-0 bg-[#f0e68c]/90">陈家家书</h3>
                    <p className="whitespace-pre-wrap leading-loose mb-10 font-medium text-lg text-stone-800/90 text-justify">
                        {narrativeText}
                    </p>
                    <div className="flex justify-between items-center border-t border-stone-400 pt-6 sticky bottom-0 bg-[#f0e68c]/90 pb-2">
                        <span className="text-xs text-stone-500 uppercase tracking-widest">绝笔</span>
                        <Button onClick={handleCloseReading} className="border-stone-800 text-stone-900 hover:bg-stone-800 hover:text-[#f0e68c]">
                            收好书信
                        </Button>
                    </div>
                </div>
            </div>
        );

      case GameState.OBSERVING: // The Blood/Clues (Dark/Red style)
        return (
            <div className="h-full w-full flex items-center justify-center p-6 bg-red-950/40 z-40 absolute inset-0 backdrop-blur-md animate-fade-in">
                <div className="bg-black/80 text-red-50 p-8 max-w-md w-full border border-red-900 shadow-[0_0_30px_rgba(138,28,28,0.5)] overflow-y-auto max-h-[80vh]">
                    <h3 className="text-xl font-bold mb-4 text-blood-red tracking-[0.3em] flex items-center gap-2 sticky top-0 bg-black/90 py-2">
                         <span className="w-2 h-2 bg-blood-red rounded-full animate-pulse"></span>
                         观察记录
                    </h3>
                    <p className="whitespace-pre-wrap leading-relaxed mb-8 text-stone-300 font-serif text-lg">
                        {narrativeText}
                    </p>
                    <div className="flex justify-end sticky bottom-0 bg-black/90 py-2">
                        <Button onClick={() => setGameState(GameState.EXPLORATION)} variant="primary">
                            离开
                        </Button>
                    </div>
                </div>
            </div>
        );

      case GameState.PUZZLE:
        return (
          <PuzzleScene 
            onSolve={() => setGameState(GameState.ENDING)}
            onFail={triggerJumpscare}
          />
        );

      case GameState.JUMPSCARE:
        return (
          <div className="h-full w-full bg-black flex items-center justify-center overflow-hidden relative">
             <div className="absolute inset-0 bg-blood-red animate-flicker mix-blend-color-burn z-10"></div>
             <div className="absolute inset-0 bg-[url('https://picsum.photos/seed/ghost/800/800?grayscale')] bg-cover bg-center mix-blend-overlay opacity-30 animate-ping"></div>
             <img 
                src={IMAGES.GHOST_HAND} 
                alt="Scare" 
                className="w-full h-full object-cover scale-150 animate-shake contrast-[2] brightness-50 grayscale"
             />
             <div className="absolute inset-0 flex items-center justify-center z-20">
                 <h1 className="text-9xl text-white font-serif mix-blend-difference animate-pulse">死</h1>
             </div>
          </div>
        );

      case GameState.ENDING:
        return (
          <div className="h-full w-full bg-stone-950 flex flex-col items-center justify-center text-center p-8 space-y-8 animate-fade-in relative overflow-hidden">
            <div className="w-20 h-20 border-2 border-paper-yellow rounded-full flex items-center justify-center mb-4 animate-pulse z-10 bg-black/50 backdrop-blur-sm">
                <span className="text-3xl font-serif text-paper-yellow">封</span>
            </div>
            <h2 className="text-4xl md:text-5xl text-paper-yellow font-serif mb-4 tracking-[0.5em] z-10 text-shadow-lg">尘埃落定</h2>
            <div className="max-w-md mx-auto z-10 bg-black/40 p-6 rounded border border-stone-800 backdrop-blur-sm">
                <p className="text-stone-300 leading-relaxed font-serif text-lg mb-4">
                  火焰吞噬了符纸，那股阴冷的视线终于消失了。
                </p>
                <p className="text-stone-500 text-sm">
                  你推开祠堂的大门，外面是黎明前的微光。<br/>
                  但当你低头看向自己的手掌时，<br/>
                  掌心里也多了一道黑色的焦痕。<br/><br/>
                  它... 真的被封印了吗？
                </p>
            </div>
            
            <div className="pt-8 z-10">
              <Button onClick={() => window.location.reload()}>重新入局</Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="h-full w-full overflow-hidden bg-stone-950 relative font-serif">
      <Vignette />
      <main className="h-full w-full relative z-10">
        {renderScene()}
      </main>
    </div>
  );
};

export default App;
