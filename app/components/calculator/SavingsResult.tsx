import React, { useEffect, useState } from 'react';
import { Card } from '../ui/Card';

interface SavingsResultProps {
  savings: string;
}

export function SavingsResult({ savings }: SavingsResultProps) {
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
        <div className="text-[#1a1a1a] text-lg mb-4">
          <span className="font-semibold uppercase tracking-wide text-sm block mb-2 animate-fadeIn">
            Expected Annual Savings:
          </span>
          <span className="text-[48px] md:text-[56px] font-mono font-normal leading-[1.1] inline-block animate-slideUp">
            {savings}
          </span>
        </div>
        <div className="mt-6 pt-6 border-t-[2px] border-black">
          <p className="text-[#1a1a1a] font-medium animate-fadeIn" style={{ animationDelay: '200ms' }}>
            📞 Call us at <span className="font-bold">1-800-LEC-TRIC</span> to get your job started today!
          </p>
        </div>
      </Card>
    </div>
  );
}
