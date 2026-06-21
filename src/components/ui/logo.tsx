import React from "react";

interface LogoProps {
  className?: string;
  iconClassName?: string;
  showText?: boolean;
  textClassName?: string;
}

export function Logo({
  className = "flex items-center gap-2.5",
  iconClassName = "w-9 h-9",
  showText = true,
  textClassName = "font-extrabold text-lg tracking-tight text-text-primary",
}: LogoProps) {
  return (
    <div className={className}>
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`${iconClassName} select-none drop-shadow-[0_2px_8px_rgba(124,58,237,0.15)]`}
      >
        <defs>
          <linearGradient id="logoBgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0057FF" />
            <stop offset="100%" stopColor="#0046CC" />
          </linearGradient>
          <linearGradient id="pathGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#E0E7FF" />
          </linearGradient>
          <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#D4AF37" />
            <stop offset="100%" stopColor="#AA8410" />
          </linearGradient>
        </defs>
        
        {/* Background Rounded Square with modern proportion */}
        <rect width="100" height="100" rx="26" fill="url(#logoBgGrad)" />
        
        {/* Map Grid Gridlines (subtle opacity) */}
        <line x1="50" y1="15" x2="50" y2="85" stroke="white" strokeWidth="2" strokeOpacity="0.1" strokeDasharray="4 4" />
        <line x1="15" y1="50" x2="85" y2="50" stroke="white" strokeWidth="2" strokeOpacity="0.1" strokeDasharray="4 4" />
        
        {/* Money Map folds forming an M-shape */}
        <path
          d="M26 68 V32 L50 56 L74 32 V48"
          stroke="url(#pathGrad)"
          strokeWidth="9"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        {/* Rising Trend Arrow intersecting the map (gold) */}
        <path
          d="M58 74 L74 58 L74 48"
          stroke="url(#goldGrad)"
          strokeWidth="9"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        {/* The target map marker / growing node (mint success) */}
        <circle cx="74" cy="48" r="6" fill="#00D18F" />
      </svg>
      {showText && <span className={textClassName}>MoneyMap</span>}
    </div>
  );
}

export function LogoIconOnly({ className = "w-9 h-9" }: { className?: string }) {
  return <Logo className="inline-flex" iconClassName={className} showText={false} />;
}
