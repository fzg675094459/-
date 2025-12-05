
import React, { useState, useEffect, useRef } from 'react';
import { IMAGES, SCARY_TEXTS } from '../constants';
import Button from '../components/Button';
import { Search, Scroll, Hand, Lock } from 'lucide-react';
import { generateStoryContent } from '../services/geminiService';
import { audioManager } from '../services/audioManager';
import { ExplorationStage } from '../types';

interface ExplorationSceneProps {
  stage: ExplorationStage;
  setStage: (stage: ExplorationStage) => void;
  onReadDiary: (text: string) => void;
  onInspectClue: (text: string) => void;
  onEnterPuzzle: () => void;
  onTriggerJumpscare: () => void;
}

const IDLE_THOUGHTS = [
  "这里太安静了...",
  "那个牌位... 刚才是不是动了？",
  "必须快点，蜡烛要灭了。",
  "空气里有一股烧焦的味道。",
  "我感觉有什么东西贴着我的后背...",
  "别回头... 无论听到什么都别回头。",
  "这就是陈家灭门的原因吗？",
  "地上好冷，像是踩在冰窖里。"
];

const ExplorationScene: React.FC<ExplorationSceneProps> = ({ 
  stage, 
  setStage, 
  onReadDiary, 
  onInspectClue,
  onEnterPuzzle, 
  onTriggerJumpscare 
}) => {
  const [loading, setLoading] = useState(false);
  const [flashPos, setFlashPos] = useState({ x: 50, y: 50 });
  const [dialogue, setDialogue] = useState<string>("（深吸一口气）这是陈家祠堂... 我必须找到爷爷留下的笔记。");
  const [glitchText, setGlitchText] = useState<string | null>(null);
  const idleTimer = useRef<number | null>(null);
  
  // Dynamic Dialogue System
  useEffect(() => {
    let mainText = "";
    if (stage === ExplorationStage.ENTER) {
      mainText = "墙壁里有指甲抓挠的声音... 爷爷的家书应该就在左边的供桌附近。";
    } else if (stage === ExplorationStage.FIND_PAPER) {
      mainText = "家书里提到了封印的方法... 等等，左下角的地上怎么有东西在反光？";
    } else if (stage === ExplorationStage.FIND_CLUE) {
      mainText = "那些头发... 那些血... 它们都指向右边的祭坛。封印就在那里。";
    } else if (stage === ExplorationStage.UNLOCK_ALTAR) {
      mainText = "所有的线索都齐了。去祭坛（右侧），结束这一切。";
    }
    setDialogue(mainText);

    // Reset idle timer logic
    startIdleTimer();
    return () => stopIdleTimer();
  }, [stage]);

  const startIdleTimer = () => {
    stopIdleTimer();
    idleTimer.current = window.setInterval(() => {
      // 40% chance to show thought, 20% chance to play scary breath sound
      const rand = Math.random();
      if (rand > 0.6) {
        const thought = IDLE_THOUGHTS[Math.floor(Math.random() * IDLE_THOUGHTS.length)];
        setDialogue(`(心声) ${thought}`);
      }
      if (rand < 0.2) {
        audioManager.playBreathing();
        setDialogue("（猛然回头）谁在那里？！");
      }
    }, 7000);
  };

  const stopIdleTimer = () => {
    if (idleTimer.current) {
      clearInterval(idleTimer.current);
      idleTimer.current = null;
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    setFlashPos({
      x: (e.clientX / window.innerWidth) * 100,
      y: (e.clientY / window.innerHeight) * 100
    });
    
    // Reset idle timer on interaction
    startIdleTimer();
  };

  const triggerGlitch = () => {
    const text = SCARY_TEXTS[Math.floor(Math.random() * SCARY_TEXTS.length)];
    setGlitchText(text);
    audioManager.playClick(); 
    setTimeout(() => setGlitchText(null), 150);
  };

  const handleInspectPaper = async () => {
    audioManager.playPaperFoley(); // Sound effect
    setLoading(true);
    setDialogue("一张残破的发黄信纸... 手感湿漉漉的。");
    const text = await generateStoryContent('diary');
    setLoading(false);
    
    if (stage === ExplorationStage.ENTER) {
      setStage(ExplorationStage.FIND_PAPER);
    }
    onReadDiary(text);
  };

  const handleInspectBlood = async () => {
    audioManager.playHeartbeat(); // Thump thump
    triggerGlitch();
    setLoading(true);
    const text = await generateStoryContent('blood');
    setLoading(false);
    
    if (stage === ExplorationStage.FIND_PAPER) {
      setStage(ExplorationStage.FIND_CLUE);
    }
    onInspectClue(text);
  };

  const handleUnlockAltar = () => {
    if (stage < ExplorationStage.FIND_CLUE) {
      setDialogue("祭坛被一股阴冷的黑气笼罩着，我还缺关键线索，不敢贸然靠近。");
      audioManager.playClick();
      return;
    }
    setDialogue("深呼吸... 只要按顺序解开封印，她就出不来。");
    onEnterPuzzle();
  };

  return (
    <div 
      className="relative h-full w-full bg-black overflow-hidden cursor-crosshair touch-none select-none"
      onPointerMove={handlePointerMove}
    >
      {/* Background with slow zoom breath effect */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000 animate-pulse-slow"
        style={{ 
          backgroundImage: `url(${stage >= ExplorationStage.FIND_CLUE ? IMAGES.BG_ALTAR : IMAGES.BG_HALL})`,
          opacity: 0.35
        }}
      />

      {/* Glitch Overlay Text */}
      {glitchText && (
         <div className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none bg-red-900/30 mix-blend-hard-light">
            <h1 className="text-7xl md:text-9xl font-serif text-red-600 animate-shake writing-vertical-rl md:writing-horizontal-tb tracking-widest">{glitchText}</h1>
         </div>
      )}

      {/* Improved Flashlight: Softer edges, slightly larger */}
      <div 
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          background: `radial-gradient(circle 220px at ${flashPos.x}% ${flashPos.y}%, transparent 5%, rgba(10,5,5,0.85) 40%, black 100%)`
        }}
      />

      {/* Interactive Objects */}
      <div className="absolute inset-0 z-20">
        
        {/* 1. Paper Clue (Top Left) */}
        <div 
          className="absolute top-[20%] left-[15%] transition-all duration-500"
          style={{ 
            opacity: Math.abs(flashPos.x - 15) < 20 && Math.abs(flashPos.y - 20) < 20 ? 1 : 0.05,
            transform: Math.abs(flashPos.x - 15) < 20 && Math.abs(flashPos.y - 20) < 20 ? 'scale(1.05)' : 'scale(1)'
          }}
        >
          <Button variant="ghost" onClick={handleInspectPaper} className="flex flex-col items-center group">
            <Scroll className="w-12 h-12 text-paper-yellow animate-bounce opacity-90 drop-shadow-[0_0_10px_rgba(240,230,140,0.5)]" />
            <span className="text-base text-paper-yellow mt-2 bg-black/80 px-3 py-1 border border-paper-yellow/30">拾取家书</span>
          </Button>
        </div>

        {/* 2. Blood Stain (Bottom Left) - More prominent */}
        {stage >= ExplorationStage.FIND_PAPER && (
          <div 
            className="absolute bottom-[20%] left-[30%] transition-all duration-500"
            style={{ 
              opacity: Math.abs(flashPos.x - 30) < 20 && Math.abs(flashPos.y - 80) < 20 ? 1 : 0.05 
            }}
          >
            <Button variant="ghost" onClick={handleInspectBlood} className="flex flex-col items-center group">
              <Hand className="w-14 h-14 text-blood-red animate-pulse opacity-90 drop-shadow-[0_0_15px_rgba(138,28,28,0.8)]" />
              <span className="text-base text-blood-red mt-2 bg-black/80 px-3 py-1 border border-blood-red/30">检查异样</span>
            </Button>
          </div>
        )}

        {/* 3. Altar (Right Center) */}
        <div 
          className="absolute top-1/2 right-[20%] -translate-y-1/2 transition-all duration-500"
          style={{ opacity: Math.abs(flashPos.x - 80) < 20 && Math.abs(flashPos.y - 50) < 20 ? 1 : 0.05 }}
        >
          <Button variant="ghost" onClick={handleUnlockAltar} className="flex flex-col items-center group">
            {stage >= ExplorationStage.FIND_CLUE ? (
                 <div className="relative">
                    <div className="absolute inset-0 bg-blood-red blur-2xl opacity-30 animate-pulse"></div>
                    <Lock className="w-16 h-16 text-stone-200" />
                 </div>
            ) : (
                 <Lock className="w-10 h-10 text-stone-700" />
            )}
            <span className={`text-base mt-4 bg-black/90 px-4 py-1 border ${stage >= ExplorationStage.FIND_CLUE ? 'text-stone-100 border-stone-400' : 'text-stone-600 border-stone-800'}`}>
                {stage >= ExplorationStage.FIND_CLUE ? '开启封印' : '???'}
            </span>
          </Button>
        </div>
      </div>

      {/* Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/95">
          <div className="flex flex-col items-center gap-4">
             <div className="w-8 h-8 border-2 border-blood-red border-t-transparent rounded-full animate-spin"></div>
             <div className="text-blood-red font-serif animate-pulse tracking-[0.5em] text-xl">
               ... ...
             </div>
          </div>
        </div>
      )}
      
      {/* Dialogue / Status Bar */}
      <div className="absolute bottom-0 left-0 w-full z-30 pointer-events-none">
         <div className="bg-gradient-to-t from-stone-950 via-stone-900/95 to-transparent pt-12 pb-8 px-6 text-center">
            <p className="text-stone-300 font-serif text-lg md:text-xl tracking-widest drop-shadow-md leading-relaxed min-h-[3rem]">
                {dialogue}
            </p>
         </div>
      </div>
    </div>
  );
};

export default ExplorationScene;
