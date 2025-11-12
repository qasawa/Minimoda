'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'

interface KiddoraAnimatedLogoProps {
  width?: number
  height?: number
  className?: string
  playOnHover?: boolean
}

export function KiddoraAnimatedLogo({ 
  width = 200, 
  height = 100, 
  className = '',
  playOnHover = false 
}: KiddoraAnimatedLogoProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [animationKey, setAnimationKey] = useState(0)

  const triggerAnimation = () => {
    if (playOnHover) {
      setAnimationKey(prev => prev + 1)
    }
  }

  return (
    <motion.div
      className={`inline-block ${className}`}
      onMouseEnter={() => {
        setIsHovered(true)
        triggerAnimation()
      }}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.3 }}
    >
      <svg 
        key={animationKey}
        className="kiddora-animated-logo" 
        width={width} 
        height={height} 
        viewBox="0 0 400 200" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <style>
          {`
            .star-path {
              stroke-dasharray: 200;
              stroke-dashoffset: 200;
              animation: drawStar 1.5s ease-out forwards;
            }
            
            @keyframes drawStar {
              to { 
                stroke-dashoffset: 0; 
              }
            }
            
            .star-fill {
              opacity: 0;
              animation: fillStar 0.6s ease-out 1.2s forwards;
            }
            
            @keyframes fillStar {
              0% { 
                opacity: 0; 
                transform: scale(0.9);
              }
              100% { 
                opacity: 1; 
                transform: scale(1);
              }
            }
            
            .letter {
              opacity: 0;
              transform: translateY(20px);
              animation: letterBounce 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards, 
                         persistentGlow 3s ease-in-out 2s infinite,
                         subtleBreathe 4s ease-in-out 2.5s infinite;
            }
            
            .letter:nth-child(1) { animation-delay: 0.3s, 2s, 2.5s; }
            .letter:nth-child(2) { animation-delay: 0.4s, 2.1s, 2.6s; }
            .letter:nth-child(3) { animation-delay: 0.5s, 2.2s, 2.7s; }
            .letter:nth-child(4) { animation-delay: 0.6s, 2.3s, 2.8s; }
            .letter:nth-child(5) { animation-delay: 0.7s, 2.4s, 2.9s; }
            .letter:nth-child(6) { animation-delay: 0.8s, 2.5s, 3.0s; }
            .letter:nth-child(7) { animation-delay: 0.9s, 2.6s, 3.1s; }
            
            @keyframes letterBounce {
              0% {
                opacity: 0;
                transform: translateY(20px) scale(0.9);
              }
              60% {
                opacity: 0.9;
                transform: translateY(-3px) scale(1.02);
              }
              100% {
                opacity: 1;
                transform: translateY(0) scale(1);
              }
            }
            
            @keyframes persistentGlow {
              0%, 100% { 
                filter: drop-shadow(0 0 4px rgba(255, 107, 157, 0.4)) drop-shadow(0 0 8px rgba(64, 90, 255, 0.3));
              }
              25% { 
                filter: drop-shadow(0 0 8px rgba(255, 107, 157, 0.6)) drop-shadow(0 0 12px rgba(110, 186, 238, 0.4));
              }
              50% { 
                filter: drop-shadow(0 0 6px rgba(254, 127, 238, 0.5)) drop-shadow(0 0 10px rgba(64, 90, 255, 0.5));
              }
              75% { 
                filter: drop-shadow(0 0 10px rgba(192, 107, 219, 0.6)) drop-shadow(0 0 14px rgba(74, 144, 226, 0.4));
              }
            }
            
            @keyframes subtleBreathe {
              0%, 100% { 
                transform: translateY(0) scale(1);
              }
              50% { 
                transform: translateY(-1px) scale(1.005);
              }
            }
            
            .persistent-shimmer {
              animation: shimmerWave 3s linear 2s infinite;
            }
            
            @keyframes shimmerWave {
              0% { 
                transform: translateX(-100%);
                opacity: 0;
              }
              50% { 
                opacity: 0.8;
              }
              100% { 
                transform: translateX(300%);
                opacity: 0;
              }
            }
            
            .kiddora-animated-logo:hover .letter {
              animation: letterBounce 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards,
                         enhancedGlow 0.8s ease-in-out infinite,
                         hoverFloat 1.2s ease-in-out infinite;
            }
            
            @keyframes enhancedGlow {
              0%, 100% { 
                filter: drop-shadow(0 0 8px rgba(255, 107, 157, 0.8)) drop-shadow(0 0 16px rgba(64, 90, 255, 0.6));
              }
              50% { 
                filter: drop-shadow(0 0 12px rgba(254, 127, 238, 0.9)) drop-shadow(0 0 20px rgba(110, 186, 238, 0.7));
              }
            }
            
            @keyframes hoverFloat {
              0%, 100% { 
                transform: translateY(0) rotate(0deg) scale(1);
              }
              25% { 
                transform: translateY(-2px) rotate(0.5deg) scale(1.02);
              }
              75% { 
                transform: translateY(1px) rotate(-0.5deg) scale(1.01);
              }
            }
          `}
        </style>
        
        <defs>
          {/* Enhanced Gradients */}
          <linearGradient id="starGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{stopColor: '#4a90e2'}} />
            <stop offset="50%" style={{stopColor: '#6ebaee'}} />
            <stop offset="100%" style={{stopColor: '#7bb8f0'}} />
          </linearGradient>
          
          <linearGradient id="textGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style={{stopColor: '#ff6b9d'}} />
            <stop offset="25%" style={{stopColor: '#fe7fee'}} />
            <stop offset="50%" style={{stopColor: '#c06bdb'}} />
            <stop offset="75%" style={{stopColor: '#405aff'}} />
            <stop offset="100%" style={{stopColor: '#4a90e2'}} />
          </linearGradient>
          
          <linearGradient id="shimmerGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style={{stopColor: 'rgba(255,255,255,0)'}} />
            <stop offset="40%" style={{stopColor: 'rgba(255,255,255,0)'}} />
            <stop offset="50%" style={{stopColor: 'rgba(255,255,255,0.8)'}} />
            <stop offset="60%" style={{stopColor: 'rgba(255,255,255,0)'}} />
            <stop offset="100%" style={{stopColor: 'rgba(255,255,255,0)'}} />
          </linearGradient>
          
          {/* Shadow Filter */}
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Main Star - Rounded like Kiddora.jpeg */}
        <g transform="translate(200, 35)">
          <path 
            className="star-path" 
            d="M 0,-22 Q 4,-14 6,-8 Q 14,-6 22,-4 Q 14,2 10,8 Q 12,16 8,22 Q 0,16 -8,22 Q -12,16 -10,8 Q -14,2 -22,-4 Q -14,-6 -6,-8 Q -4,-14 0,-22 Z" 
            stroke="url(#starGradient)" 
            strokeWidth="2.5" 
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path 
            className="star-fill" 
            d="M 0,-22 Q 4,-14 6,-8 Q 14,-6 22,-4 Q 14,2 10,8 Q 12,16 8,22 Q 0,16 -8,22 Q -12,16 -10,8 Q -14,2 -22,-4 Q -14,-6 -6,-8 Q -4,-14 0,-22 Z" 
            fill="url(#starGradient)"
          />
        </g>
        
        {/* Main Text with Shimmer Effect */}
        <g>
          <text 
            x="200" 
            y="140" 
            fontFamily="var(--font-nunito), Nunito, Arial, sans-serif" 
            fontSize="72" 
            fontWeight="800" 
            textAnchor="middle" 
            fill="url(#textGradient)"
            filter="url(#glow)"
          >
            <tspan className="letter">K</tspan>
            <tspan className="letter">i</tspan>
            <tspan className="letter">d</tspan>
            <tspan className="letter">d</tspan>
            <tspan className="letter">o</tspan>
            <tspan className="letter">r</tspan>
            <tspan className="letter">a</tspan>
          </text>
          
          {/* Persistent Shimmer Effect */}
          <rect 
            className="persistent-shimmer" 
            x="0" 
            y="100" 
            width="40" 
            height="60" 
            fill="url(#shimmerGradient)" 
          />
        </g>
      </svg>
    </motion.div>
  )
}
