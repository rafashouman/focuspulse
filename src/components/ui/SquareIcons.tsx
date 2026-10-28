// src/components/ui/SquareIcons.tsx
import React from 'react';

interface IconProps {
  className?: string;
}

// Ícone 1:1 - Sorte do Destino (Olho / Karma)
export function FateLuckIcon({ className = "w-6 h-6" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={`aspect-square ${className}`} stroke="currentColor" strokeWidth="2">
      <path d="M12 3L14.5 9.5L21 12L14.5 14.5L12 21L9.5 14.5L3 12L9.5 9.5L12 3Z" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  );
}

// Ícone 1:1 - Créditos Cripto
export function CyberCreditIcon({ className = "w-6 h-6" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={`aspect-square ${className}`} stroke="currentColor" strokeWidth="2">
      <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2" />
      <line x1="12" y1="7" x2="12" y2="17" />
      <line x1="8" y1="10" x2="16" y2="10" />
      <line x1="8" y1="14" x2="16" y2="14" />
    </svg>
  );
}

// Ícone 1:1 - Inversão de Polaridade (Flip Normal <-> Invertida)
export function PolarityFlipIcon({ className = "w-6 h-6" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={`aspect-square ${className}`} stroke="currentColor" strokeWidth="2">
      <path d="M7 3L3 7L7 11" />
      <path d="M3 7H16C18.7614 7 21 9.23858 21 12" />
      <path d="M17 21L21 17L17 13" />
      <path d="M21 17H8C5.23858 17 3 14.7614 3 12" />
    </svg>
  );
}

// Ícone 1:1 - Reescrita Neural (Mãos)
export function NeuralRewriteIcon({ className = "w-6 h-6" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={`aspect-square ${className}`} stroke="currentColor" strokeWidth="2">
      <polyline points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}