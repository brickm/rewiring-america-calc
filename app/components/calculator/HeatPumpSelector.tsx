import React from 'react';

export interface HeatPumpOption {
  id: string;
  name: string;
  seer: number;
  hspf: number;
  description: string;
}

export const HEAT_PUMP_OPTIONS: HeatPumpOption[] = [
  {
    id: 'hvac__heat_pump_seer15_hspf9',
    name: 'Standard Efficiency',
    seer: 15,
    hspf: 9,
    description: 'Entry-level heat pump - meets minimum federal standards'
  },
  {
    id: 'hvac__heat_pump_seer18_hspf10',
    name: 'High Efficiency',
    seer: 18,
    hspf: 10,
    description: 'Energy Star certified - recommended for most homes'
  },
  {
    id: 'hvac__heat_pump_seer24_hspf13',
    name: 'Premium Efficiency',
    seer: 24,
    hspf: 13,
    description: 'Top-tier performance - maximum long-term savings'
  }
];

interface HeatPumpSelectorProps {
  selectedUpgrade: string;
  onChange: (upgrade: string) => void;
  comparisonMode?: boolean;
  onComparisonToggle?: () => void;
}

export function HeatPumpSelector({
  selectedUpgrade,
  onChange,
  comparisonMode = false,
  onComparisonToggle
}: HeatPumpSelectorProps) {
  return (
    <div className="mb-6">
      <label className="block text-sm font-semibold uppercase tracking-wide text-[#1a1a1a] mb-3">
        Select Heat Pump Type:
      </label>

      {comparisonMode && (
        <div className="mb-4 p-4 bg-[#ffd900] border-[3px] border-black">
          <p className="text-sm font-semibold text-[#1a1a1a]">
            🔍 Comparison Mode Active - All three heat pump types will be compared
          </p>
        </div>
      )}

      <div className="space-y-3">
        {HEAT_PUMP_OPTIONS.map((option) => (
          <label
            key={option.id}
            className={`block p-4 border-[3px] transition-all ${
              comparisonMode
                ? 'border-[#999999] bg-[#f5f5f5] cursor-not-allowed opacity-60'
                : selectedUpgrade === option.id
                ? 'border-[#4da6ff] bg-[#f0f8ff] shadow-[4px_4px_0px_0px_rgba(77,166,255,0.3)] cursor-pointer'
                : 'border-black bg-white hover:border-[#4da6ff] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.1)] cursor-pointer'
            }`}
          >
            <input
              type="radio"
              name="heatPump"
              value={option.id}
              checked={selectedUpgrade === option.id}
              onChange={(e) => onChange(e.target.value)}
              disabled={comparisonMode}
              className="sr-only"
            />
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="font-semibold text-[#1a1a1a] text-base mb-1">
                  {option.name}
                </div>
                <div className="text-sm text-[#666666] mb-2">
                  {option.description}
                </div>
                <div className="text-xs text-[#1a1a1a] font-mono">
                  SEER {option.seer} / HSPF {option.hspf}
                </div>
              </div>
              {selectedUpgrade === option.id && !comparisonMode && (
                <div className="ml-4 flex-shrink-0">
                  <span className="w-6 h-6 bg-[#4da6ff] rounded-full flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="3"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M5 13l4 4L19 7"></path>
                    </svg>
                  </span>
                </div>
              )}
            </div>
          </label>
        ))}
      </div>

      {onComparisonToggle && (
        <div className="mt-4">
          <button
            type="button"
            onClick={onComparisonToggle}
            className={`w-full py-3 px-4 border-[3px] font-semibold uppercase tracking-wide text-sm transition-colors duration-200 ${
              comparisonMode
                ? 'border-[#4da6ff] bg-[#4da6ff] text-white hover:bg-[#3d96ef]'
                : 'border-black bg-white hover:bg-[#ffd900] text-[#1a1a1a]'
            }`}
          >
            {comparisonMode ? '← Back to Single Selection' : '🔍 Compare All Three Efficiency Levels'}
          </button>
          <p className="text-xs text-[#666666] mt-2 text-center">
            {comparisonMode
              ? 'Click to choose one heat pump type'
              : 'See all efficiency levels side-by-side'}
          </p>
        </div>
      )}
    </div>
  );
}
