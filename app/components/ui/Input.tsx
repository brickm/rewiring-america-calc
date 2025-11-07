import React, { useState } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export function Input({ label, className = '', ...props }: InputProps) {
  const inputId = props.id || props.name || 'input';
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="block">
      {label && (
        <label
          htmlFor={inputId}
          className={`text-sm uppercase tracking-wide block mb-3 font-semibold transition-colors duration-200 ${
            isFocused ? 'text-[#4da6ff]' : 'text-[#1a1a1a]'
          }`}
        >
          {label}
        </label>
      )}
      <div className="relative">
        <input
          id={inputId}
          className={`w-full px-4 py-3 border-[2px] border-black text-[#1a1a1a] placeholder:text-[#666666] focus:outline-none focus:border-[#4da6ff] focus:ring-4 focus:ring-[#4da6ff]/20 transition-all duration-200 ${className}`}
          onFocus={(e) => {
            setIsFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            props.onBlur?.(e);
          }}
          {...props}
        />
        <div
          className={`absolute bottom-0 left-0 h-[2px] bg-[#4da6ff] transition-all duration-300 ${
            isFocused ? 'w-full' : 'w-0'
          }`}
        />
      </div>
    </div>
  );
}
