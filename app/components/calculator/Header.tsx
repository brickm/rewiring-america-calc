import React from 'react';

export function Header() {
  return (
    <div id="titlebar" className="bg-white border-b-[3px] border-black py-12 px-8">
      <div className="max-w-[1400px] mx-auto">
        <h1 className="text-[56px] md:text-[72px] font-mono font-normal leading-[1.1] tracking-tight text-[#1a1a1a] mb-2">
          ELECTRIFICATION NATION
        </h1>
        <h2 className="text-[18px] md:text-[20px] font-mono font-normal leading-[1.5] text-[#666666]">
          Your Heat Pump People
        </h2>
      </div>
    </div>
  );
}
