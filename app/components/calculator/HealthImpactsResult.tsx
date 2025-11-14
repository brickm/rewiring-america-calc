import React, { useEffect, useState } from 'react';
import { Card } from '../ui/Card';
import { CountyHealthData } from '../../hooks/useHealthImpacts';

interface HealthImpactsResultProps {
  healthData: CountyHealthData[];
}

export function HealthImpactsResult({ healthData }: HealthImpactsResultProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  if (healthData.length === 0) {
    return (
      <Card variant="white" shadow="lg" className="p-8">
        <p className="text-[#666666]">No health impacts data available for this location.</p>
      </Card>
    );
  }

  // Calculate totals across all counties
  const totalMortality = healthData.reduce((sum, county) => sum + county.mortalityReduction, 0);
  const totalNox = healthData.reduce((sum, county) => sum + county.noxReduced, 0);
  const totalPm25 = healthData.reduce((sum, county) => sum + county.pm25Reduced, 0);

  return (
    <div
      className={`transition-all duration-500 ${
        isVisible
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-4'
      }`}
    >
      <Card variant="yellow" shadow="lg" className="p-8 mb-6">
        <h3 className="text-[24px] md:text-[32px] font-mono font-normal leading-[1.1] tracking-tight text-[#1a1a1a] mb-6">
          HEALTH IMPACTS
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Mortality Reduction */}
          <div className="bg-white border-[3px] border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <div className="text-sm font-semibold uppercase tracking-wide text-[#666666] mb-2">
              Lives Saved Annually
            </div>
            <div className="text-[32px] md:text-[40px] font-mono font-normal leading-[1.1] text-[#1a1a1a]">
              {totalMortality.toFixed(1)}
            </div>
            <div className="text-sm text-[#666666] mt-2">
              deaths avoided per year
            </div>
          </div>

          {/* NOx Reduction */}
          <div className="bg-white border-[3px] border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <div className="text-sm font-semibold uppercase tracking-wide text-[#666666] mb-2">
              NOx Reduced
            </div>
            <div className="text-[32px] md:text-[40px] font-mono font-normal leading-[1.1] text-[#1a1a1a]">
              {totalNox.toFixed(1)}
            </div>
            <div className="text-sm text-[#666666] mt-2">
              tons per year
            </div>
          </div>

          {/* PM2.5 Reduction */}
          <div className="bg-white border-[3px] border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <div className="text-sm font-semibold uppercase tracking-wide text-[#666666] mb-2">
              PM2.5 Reduced
            </div>
            <div className="text-[32px] md:text-[40px] font-mono font-normal leading-[1.1] text-[#1a1a1a]">
              {totalPm25.toFixed(1)}
            </div>
            <div className="text-sm text-[#666666] mt-2">
              tons per year
            </div>
          </div>
        </div>

        {healthData.length > 1 && (
          <div className="mt-6 pt-6 border-t-[2px] border-black">
            <p className="text-sm text-[#666666] font-medium mb-2">
              Data shown for {healthData.length} counties in {healthData[0].state}
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {healthData.slice(0, 6).map((county, idx) => (
                <div key={idx} className="text-xs text-[#1a1a1a]">
                  • {county.county}: {county.mortalityReduction.toFixed(1)} lives saved
                </div>
              ))}
              {healthData.length > 6 && (
                <div className="text-xs text-[#666666]">
                  + {healthData.length - 6} more counties
                </div>
              )}
            </div>
          </div>
        )}

        {healthData.length === 1 && (
          <div className="mt-6 pt-6 border-t-[2px] border-black">
            <p className="text-sm text-[#666666] font-medium">
              Data shown for {healthData[0].county} County, {healthData[0].state}
            </p>
          </div>
        )}
      </Card>

      <Card variant="white" shadow="lg" className="p-6">
        <p className="text-sm text-[#666666] leading-relaxed">
          <strong>Note:</strong> Health benefits from electrification are real but modest compared to other public health interventions.
          The primary case for electrification remains climate mitigation and energy cost savings.
        </p>
      </Card>
    </div>
  );
}
