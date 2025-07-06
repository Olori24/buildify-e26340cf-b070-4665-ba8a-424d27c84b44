
import React from 'react';
import { cn } from '@/lib/utils';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'icon' | 'full';
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ 
  size = 'md', 
  variant = 'full',
  className
}) => {
  // Size mappings
  const sizeMap = {
    sm: {
      container: 'h-8',
      icon: 'h-8 w-8',
      text: 'text-lg',
    },
    md: {
      container: 'h-10',
      icon: 'h-10 w-10',
      text: 'text-xl',
    },
    lg: {
      container: 'h-12',
      icon: 'h-12 w-12',
      text: 'text-2xl',
    },
  };

  return (
    <div className={cn(`flex items-center gap-2 ${sizeMap[size].container}`, className)}>
      <div className={`${sizeMap[size].icon} rounded-full bg-primary flex items-center justify-center overflow-hidden`}>
        <svg 
          viewBox="0 0 100 100" 
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* Crown symbol for "OLORI" (which means "queen" in Yoruba) */}
          <path 
            d="M20,65 L30,40 L50,55 L70,40 L80,65 L20,65 Z" 
            fill="white" 
            stroke="white" 
            strokeWidth="2"
          />
          <path 
            d="M35,65 L35,75 L65,75 L65,65" 
            fill="none" 
            stroke="white" 
            strokeWidth="4"
          />
          <circle cx="30" cy="40" r="5" fill="white" />
          <circle cx="50" cy="55" r="5" fill="white" />
          <circle cx="70" cy="40" r="5" fill="white" />
          
          {/* 24 for 24/7 service */}
          <text 
            x="50" 
            y="55" 
            fontSize="14" 
            fontWeight="bold" 
            fill="#000" 
            textAnchor="middle" 
            dominantBaseline="middle"
          >
            24
          </text>
        </svg>
      </div>
      
      {variant === 'full' && (
        <span className={`font-bold ${sizeMap[size].text}`}>
          OLORI<span className="text-primary">24</span>
        </span>
      )}
    </div>
  );
};

export default Logo;