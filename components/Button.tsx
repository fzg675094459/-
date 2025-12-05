import React from 'react';
import { audioManager } from '../services/audioManager';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost';
}

const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', className = '', onClick, ...props }) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    audioManager.playClick();
    if (onClick) onClick(e);
  };

  const baseStyle = "px-6 py-2 tracking-widest font-serif border border-transparent transition-all duration-300 active:scale-95";
  const primaryStyle = "text-blood-red border-blood-red hover:bg-blood-red hover:text-black shadow-[0_0_10px_rgba(138,28,28,0.3)]";
  const ghostStyle = "text-stone-500 hover:text-stone-300";

  return (
    <button 
      className={`${baseStyle} ${variant === 'primary' ? primaryStyle : ghostStyle} ${className}`}
      onClick={handleClick}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;