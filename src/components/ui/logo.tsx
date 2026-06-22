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
        {/* Background Rounded Square with modern proportion */}
        <rect width="100" height="100" rx="24" fill="#0F62FE" />
        
        {/* Map Grid Gridlines (subtle opacity) */}
        <line x1="50" y1="18" x2="50" y2="82" stroke="white" strokeWidth="1.5" strokeOpacity="0.12" strokeDasharray="3 3" />
        <line x1="18" y1="50" x2="82" y2="50" stroke="white" strokeWidth="1.5" strokeOpacity="0.12" strokeDasharray="3 3" />
        
        {/* Money Map folds forming an M-shape */}
        <path
          d="M26 66 V34 L50 56 L74 34 V66"
          stroke="white"
          strokeWidth="8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {showText && <span className={textClassName}>MoneyMap</span>}
    </div>
  );
}

export function LogoIconOnly({ className = "w-9 h-9" }: { className?: string }) {
  return <Logo className="inline-flex" iconClassName={className} showText={false} />;
}
