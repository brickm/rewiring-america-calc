import React from 'react';

interface CardProps {
  children: React.ReactNode;
  variant?: 'white' | 'yellow' | 'blue';
  shadow?: 'sm' | 'md' | 'lg' | 'xl' | 'none';
  hover?: boolean;
  className?: string;
}

export function Card({
  children,
  variant = 'white',
  shadow = 'lg',
  hover = false,
  className = '',
}: CardProps) {
  const variantStyles = {
    white: 'bg-white',
    yellow: 'bg-[#ffd900]',
    blue: 'bg-[#4da6ff]',
  };

  const shadowStyles = {
    sm: 'shadow-hard-sm',
    md: 'shadow-hard-md',
    lg: 'shadow-hard-lg',
    xl: 'shadow-hard-xl',
    none: '',
  };

  const hoverStyles = hover
    ? 'transition-all duration-200 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]'
    : '';

  return (
    <div
      className={`border-[3px] border-black ${variantStyles[variant]} ${shadowStyles[shadow]} ${hoverStyles} ${className}`}
    >
      {children}
    </div>
  );
}
