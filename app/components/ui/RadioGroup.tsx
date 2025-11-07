import React from 'react';

export interface RadioOption {
  value: string;
  label: string;
}

interface RadioGroupProps {
  name: string;
  label?: string;
  options: RadioOption[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function RadioGroup({
  name,
  label,
  options,
  value,
  onChange,
  className = '',
}: RadioGroupProps) {
  return (
    <fieldset className={className}>
      {label && (
        <legend className="text-[#1a1a1a] font-semibold mb-4 text-sm uppercase tracking-wide">
          {label}
        </legend>
      )}
      <div className="space-y-3">
        {options.map((option) => {
          const isChecked = value === option.value;
          return (
            <label
              key={option.value}
              className="flex items-center cursor-pointer group relative"
            >
              <div className="relative flex items-center">
                <input
                  type="radio"
                  name={name}
                  value={option.value}
                  checked={isChecked}
                  onChange={(e) => onChange(e.target.value)}
                  className="sr-only peer"
                />
                {/* Custom radio button */}
                <div className={`w-5 h-5 border-[2px] border-black mr-3 transition-all duration-200 relative ${
                  isChecked ? 'bg-[#4da6ff]' : 'bg-white group-hover:bg-[#e8e4dc]'
                }`}>
                  {/* Inner dot */}
                  <div className={`absolute inset-0 flex items-center justify-center transition-all duration-200 ${
                    isChecked ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
                  }`}>
                    <div className="w-2 h-2 bg-white"></div>
                  </div>
                </div>
              </div>
              <span className={`font-medium transition-all duration-200 ${
                isChecked
                  ? 'text-[#4da6ff] font-semibold'
                  : 'text-[#1a1a1a] group-hover:text-[#4da6ff]'
              }`}>
                {option.label}
              </span>
              {/* Focus ring */}
              <div className="absolute -inset-2 border-2 border-[#4da6ff] opacity-0 peer-focus-visible:opacity-100 transition-opacity duration-200 pointer-events-none" />
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
