'use client';

import { useState } from 'react';
import Link from 'next/link';
import { AddressInput } from '../components/calculator/AddressInput';
import { FuelSelector } from '../components/calculator/FuelSelector';
import { HeatPumpSelector } from '../components/calculator/HeatPumpSelector';
import { ErrorMessage } from '../components/calculator/ErrorMessage';
import { SavingsResult } from '../components/calculator/SavingsResult';
import { ComparisonView } from '../components/calculator/ComparisonView';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { useSavingsCalculator } from '../hooks/useSavingsCalculator';
import { useHeatPumpComparison } from '../hooks/useHeatPumpComparison';

export default function CalculatorPage() {
  const [selectedUpgrade, setSelectedUpgrade] = useState('hvac__heat_pump_seer18_hspf10');
  const [comparisonMode, setComparisonMode] = useState(false);

  const {
    address,
    setAddress,
    currentFuel,
    setCurrentFuel,
    savingsData,
    savings,
    loading,
    error,
    showResults,
    calculateSavings,
  } = useSavingsCalculator();

  const {
    comparisonData,
    loading: comparisonLoading,
    error: comparisonError,
    fetchComparison
  } = useHeatPumpComparison();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (comparisonMode) {
      await fetchComparison(address, currentFuel);
    } else {
      await calculateSavings(selectedUpgrade);
    }
  };

  const handleComparisonToggle = () => {
    setComparisonMode(!comparisonMode);
  };

  return (
    <div className="min-h-screen bg-[#e8e4dc]">
      <div className="bg-white border-b-[3px] border-black py-12 px-8">
        <div className="max-w-[1400px] mx-auto">
          <Link href="/" className="inline-block mb-4 text-[#4da6ff] hover:text-[#3d96ef] font-semibold transition-colors duration-200">
            ← Back to Home
          </Link>
          <h1 className="text-[56px] md:text-[72px] font-mono font-normal leading-[1.1] tracking-tight text-[#1a1a1a] mb-2">
            SAVINGS CALCULATOR
          </h1>
          <h2 className="text-[18px] md:text-[20px] font-mono font-normal leading-[1.5] text-[#666666]">
            Calculate Your Heat Pump Savings
          </h2>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-8 py-12 md:py-16">
        <div className="mb-12 text-[#1a1a1a] text-base leading-relaxed max-w-[800px]">
          <p className="mb-3">
            Enter your address and select the fuel you <strong>currently</strong> use to heat your home.
          </p>
          <p>
            {comparisonMode
              ? 'We\'ll compare all three heat pump efficiency levels side-by-side!'
              : 'We\'ll calculate your potential annual savings by switching to a heat pump!'}
          </p>
        </div>

        <Card variant="white" shadow="lg" className="p-8 mb-6 max-w-[800px]">
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <AddressInput value={address} onChange={setAddress} />
            </div>

            <FuelSelector value={currentFuel} onChange={setCurrentFuel} />

            <HeatPumpSelector
              selectedUpgrade={selectedUpgrade}
              onChange={setSelectedUpgrade}
              comparisonMode={comparisonMode}
              onComparisonToggle={handleComparisonToggle}
            />

            <Button
              type="submit"
              isLoading={loading || comparisonLoading}
              className="w-full"
            >
              {comparisonMode ? 'COMPARE ALL THREE' : 'CALCULATE SAVINGS'}
            </Button>
          </form>
        </Card>

        {(error || comparisonError) && (
          <ErrorMessage message={error || comparisonError || ''} />
        )}

        {comparisonMode && comparisonData.length > 0 && (
          <ComparisonView comparisonData={comparisonData} />
        )}

        {!comparisonMode && showResults && savingsData && (
          <div className="max-w-[800px]">
            <SavingsResult
              savings={savings}
              annualSavings={savingsData.annualSavings}
              monthlySavings={savingsData.monthlySavings}
              energyChange={savingsData.energyChange}
              emissionsReduction={savingsData.emissionsReduction}
              estimateType={savingsData.estimateType}
              upgrade={savingsData.upgrade}
            />
          </div>
        )}
      </div>
    </div>
  );
}
