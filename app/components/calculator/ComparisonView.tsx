import React, { useEffect, useState } from 'react';
import { Card } from '../ui/Card';
import { HEAT_PUMP_OPTIONS } from './HeatPumpSelector';

interface SavingsData {
  mean: number;
  median: number;
  percentile20: number;
  percentile80: number;
}

interface SavingsResponse {
  savings: string;
  upgrade?: string;
  annualSavings?: SavingsData;
  monthlySavings?: SavingsData;
  energyChange?: { mean: number };
  emissionsReduction?: { mean: number };
  estimateType?: string;
}

interface ComparisonViewProps {
  comparisonData: SavingsResponse[];
}

export function ComparisonView({ comparisonData }: ComparisonViewProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  if (comparisonData.length === 0) {
    return null;
  }

  // Find the option with best savings
  const bestIndex = comparisonData.reduce((maxIdx, curr, idx, arr) => {
    return (curr.annualSavings?.mean || 0) > (arr[maxIdx].annualSavings?.mean || 0) ? idx : maxIdx;
  }, 0);

  return (
    <div
      className={`transition-all duration-500 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      <Card variant="yellow" shadow="lg" className="p-8 mb-6">
        <h3 className="text-[24px] md:text-[32px] font-mono font-normal leading-[1.1] tracking-tight text-[#1a1a1a] mb-2">
          HEAT PUMP COMPARISON
        </h3>
        <p className="text-sm text-[#666666] mb-6">
          Comparing three heat pump efficiency levels for the same location and fuel type
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {comparisonData.map((data, idx) => {
            const option = HEAT_PUMP_OPTIONS[idx];
            const isBest = idx === bestIndex;

            return (
              <div
                key={option.id}
                className={`relative bg-white border-[3px] p-6 ${
                  isBest
                    ? 'border-[#4da6ff] shadow-[6px_6px_0px_0px_rgba(77,166,255,0.3)]'
                    : 'border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
                }`}
              >
                {isBest && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-[#4da6ff] text-white px-3 py-1 text-xs font-semibold uppercase tracking-wide">
                      Best Value
                    </span>
                  </div>
                )}

                <div className="mb-4">
                  <div className="text-xs font-semibold uppercase tracking-wide text-[#666666] mb-1">
                    {option.name}
                  </div>
                  <div className="text-[10px] text-[#999999] font-mono mb-2">
                    SEER {option.seer} / HSPF {option.hspf}
                  </div>
                </div>

                {/* Annual Savings */}
                <div className="mb-4">
                  <div className="text-xs text-[#666666] mb-1">Annual Savings</div>
                  <div className="text-[28px] md:text-[32px] font-mono font-normal leading-[1.1] text-[#1a1a1a]">
                    ${data.annualSavings?.mean.toFixed(0)}
                  </div>
                  <div className="text-[10px] text-[#666666] mt-1">
                    ${data.annualSavings?.percentile20.toFixed(0)} - $
                    {data.annualSavings?.percentile80.toFixed(0)} range
                  </div>
                </div>

                {/* Monthly Savings */}
                <div className="mb-4">
                  <div className="text-xs text-[#666666] mb-1">Monthly Savings</div>
                  <div className="text-[20px] font-mono font-normal leading-[1.1] text-[#1a1a1a]">
                    ${data.monthlySavings?.mean.toFixed(2)}
                  </div>
                </div>

                {/* Emissions Reduction */}
                {data.emissionsReduction && data.emissionsReduction.mean !== 0 && (
                  <div className="pt-4 border-t-[2px] border-black">
                    <div className="text-xs text-[#666666] mb-1">CO₂ Reduction</div>
                    <div className="text-[16px] font-mono font-normal leading-[1.1] text-[#1a1a1a]">
                      {(data.emissionsReduction.mean / 1000).toFixed(1)} tons/yr
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-6 pt-6 border-t-[2px] border-black">
          <p className="text-sm text-[#666666]">
            <strong>Note:</strong> Higher efficiency heat pumps cost more upfront but may provide
            greater long-term savings. The "Best Value" recommendation shows the highest annual
            savings based on your location and current fuel type.
          </p>
        </div>
      </Card>
    </div>
  );
}
