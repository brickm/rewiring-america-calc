import React, { useEffect, useState } from 'react';
import { Card } from '../ui/Card';

interface SavingsData {
  mean: number;
  median: number;
  percentile20: number;
  percentile80: number;
}

interface SavingsResultProps {
  savings: string; // Legacy format: "$850.50"
  annualSavings?: SavingsData;
  monthlySavings?: SavingsData;
  energyChange?: { mean: number };
  emissionsReduction?: { mean: number };
  estimateType?: string;
  upgrade?: string;
}

// Map upgrade codes to friendly names
const UPGRADE_NAMES: Record<string, string> = {
  'hvac__heat_pump_seer15_hspf9': 'Standard Efficiency Heat Pump (SEER 15 / HSPF 9)',
  'hvac__heat_pump_seer18_hspf10': 'High Efficiency Heat Pump (SEER 18 / HSPF 10)',
  'hvac__heat_pump_seer24_hspf13': 'Premium Efficiency Heat Pump (SEER 24 / HSPF 13)'
};

export function SavingsResult({
  savings,
  annualSavings,
  monthlySavings,
  energyChange,
  emissionsReduction,
  estimateType,
  upgrade
}: SavingsResultProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger animation after component mounts
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`transition-all duration-500 ${
        isVisible
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-4'
      }`}
    >
      <Card variant="yellow" shadow="lg" className="p-8">
        {/* Heat Pump Type Header */}
        {upgrade && UPGRADE_NAMES[upgrade] && (
          <div className="mb-6 pb-6 border-b-[2px] border-black">
            <div className="text-xs font-semibold uppercase tracking-wide text-[#666666] mb-1">
              Selected Heat Pump:
            </div>
            <div className="text-base font-semibold text-[#1a1a1a]">
              {UPGRADE_NAMES[upgrade]}
            </div>
          </div>
        )}

        {/* Main Annual Savings */}
        <div className="text-[#1a1a1a] mb-6">
          <span className="font-semibold uppercase tracking-wide text-sm block mb-2 animate-fadeIn">
            Expected Annual Savings:
          </span>
          <span className="text-[48px] md:text-[56px] font-mono font-normal leading-[1.1] inline-block animate-slideUp">
            {savings}
          </span>
        </div>

        {/* Enhanced Data Grid */}
        {annualSavings && monthlySavings && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* Monthly Savings */}
            <div className="bg-white border-[3px] border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <div className="text-xs font-semibold uppercase tracking-wide text-[#666666] mb-2">
                Monthly Savings
              </div>
              <div className="text-[32px] font-mono font-normal leading-[1.1] text-[#1a1a1a]">
                ${monthlySavings.mean.toFixed(2)}
              </div>
              <div className="text-xs text-[#666666] mt-2">
                Range: ${monthlySavings.percentile20.toFixed(0)} - ${monthlySavings.percentile80.toFixed(0)}/month
              </div>
            </div>

            {/* Savings Range Indicator */}
            <div className="bg-white border-[3px] border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <div className="text-xs font-semibold uppercase tracking-wide text-[#666666] mb-2">
                Annual Savings Range
              </div>
              <div className="text-[32px] font-mono font-normal leading-[1.1] text-[#1a1a1a]">
                ${annualSavings.percentile20.toFixed(0)} - ${annualSavings.percentile80.toFixed(0)}
              </div>
              <div className="text-xs text-[#666666] mt-2">
                20th-80th percentile range
              </div>
            </div>

            {/* Energy Change */}
            {energyChange && energyChange.mean !== 0 && (
              <div className="bg-white border-[3px] border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <div className="text-xs font-semibold uppercase tracking-wide text-[#666666] mb-2">
                  Energy Impact
                </div>
                <div className="text-[32px] font-mono font-normal leading-[1.1] text-[#1a1a1a]">
                  {energyChange.mean > 0 ? '+' : ''}{(energyChange.mean / 1000).toFixed(1)}k
                </div>
                <div className="text-xs text-[#666666] mt-2">
                  kWh change per year
                </div>
              </div>
            )}

            {/* Emissions Reduction */}
            {emissionsReduction && emissionsReduction.mean !== 0 && (
              <div className="bg-white border-[3px] border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <div className="text-xs font-semibold uppercase tracking-wide text-[#666666] mb-2">
                  CO₂ Reduction
                </div>
                <div className="text-[32px] font-mono font-normal leading-[1.1] text-[#1a1a1a]">
                  {(emissionsReduction.mean / 1000).toFixed(1)}
                </div>
                <div className="text-xs text-[#666666] mt-2">
                  metric tons CO₂e per year
                </div>
              </div>
            )}
          </div>
        )}

        {/* Estimate Type Info */}
        {estimateType && (
          <div className="mb-6 p-3 bg-white/50 border-[2px] border-black">
            <p className="text-xs text-[#666666]">
              <strong>Estimate Type:</strong> {estimateType === 'address_level' ? 'Address-specific' : 'Regional average'}
              {estimateType === 'puma_level' && ' (less precise)'}
            </p>
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-6 pt-6 border-t-[2px] border-black">
          <p className="text-[#1a1a1a] font-medium animate-fadeIn" style={{ animationDelay: '200ms' }}>
            📞 Call us at <span className="font-bold">1-800-LEC-TRIC</span> to get your job started today!
          </p>
        </div>
      </Card>
    </div>
  );
}
