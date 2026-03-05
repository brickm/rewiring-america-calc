import React from 'react';

interface MonthlySavingsChartProps {
  annualSavings: number;
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function MonthlySavingsChart({ annualSavings }: MonthlySavingsChartProps) {
  if (!annualSavings) return null;

  const monthlySavings = annualSavings / 12;

  return (
    <div className="bg-white border-[3px] border-black p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] mb-6">
      <div className="flex items-baseline justify-between mb-4">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-[#1a1a1a]">
          MONTHLY SAVINGS BREAKDOWN
        </h3>
        <span className="text-sm font-mono text-[#666666]">
          ${monthlySavings.toFixed(2)}/month
        </span>
      </div>

      <div className="flex items-end gap-2 h-32">
        {MONTHS.map((month) => (
          <div key={month} className="flex-1 flex flex-col items-center gap-1">
            <div
              data-testid="month-bar"
              className="w-full bg-[#ffd900] border-[3px] border-black"
              style={{ height: '80px' }}
            />
            <span className="text-[10px] font-semibold text-[#666666]">{month}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
