import React from 'react';

interface FipsInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  required?: boolean;
  helpText?: string;
}

export function FipsInput({ label, value, onChange, placeholder, required, helpText }: FipsInputProps) {
  return (
    <div className="mb-4">
      <label className="block text-[#1a1a1a] font-semibold mb-2 text-sm uppercase tracking-wide">
        {label}
        {required && <span className="text-[#ff4444] ml-1">*</span>}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="w-full px-4 py-3 border-[3px] border-black focus:outline-none focus:border-[#4da6ff] transition-colors duration-200 text-[#1a1a1a]"
      />
      {helpText && (
        <p className="mt-2 text-xs text-[#666666]">
          {helpText}
        </p>
      )}
    </div>
  );
}
