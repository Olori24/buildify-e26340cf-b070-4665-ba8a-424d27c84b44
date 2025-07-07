
import React from 'react';
import { cn } from '@/lib/utils';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'icon' | 'full';
  className?: string;
  color?: 'light' | 'dark';
}

const Logo: React.FC<LogoProps> = ({ 
  size = 'md', 
  variant = 'full',
  className,
  color = 'dark'
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

  const textColor = color === 'light' ? 'text-white' : 'text-gray-900';
  const accentColor = 'text-primary';

  return (
    <div className={cn(`flex items-center gap-2 ${sizeMap[size].container}`, className)}>
      <div className={`${sizeMap[size].icon} rounded-lg bg-primary flex items-center justify-center overflow-hidden`}>
        <svg 
          viewBox="0 0 100 100" 
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* Package with tracking path */}
          <rect x="20" y="30" width="60" height="45" rx="4" fill="white" />
          <path 
            d="M25,40 L75,40 M50,40 L50,75" 
            stroke="#5925DC" 
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray="2 2"
          />
          <path 
            d="M20,50 C30,45 40,65 50,60 C60,55 70,75 80,70" 
            stroke="#5925DC" 
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
          />
          <circle cx="20" cy="50" r="3" fill="#5925DC" />
          <circle cx="50" cy="60" r="3" fill="#5925DC" />
          <circle cx="80" cy="70" r="3" fill="#5925DC" />
          
          {/* 24 for 24/7 service */}
          <text 
            x="50" 
            y="30" 
            fontSize="14" 
            fontWeight="bold" 
            fill="white" 
            textAnchor="middle" 
            dominantBaseline="middle"
          >
            24
          </text>
        </svg>
      </div>
      
      {variant === 'full' && (
        <span className={`font-bold ${sizeMap[size].text} ${textColor}`}>
          OLORI<span className={accentColor}>24</span>
        </span>
      )}
    </div>
  );
};

export default Logo;

export default Logo;