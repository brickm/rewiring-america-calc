'use client';

import Link from 'next/link';
import { AddressInput } from '../components/calculator/AddressInput';
import { FuelSelector } from '../components/calculator/FuelSelector';
import { ErrorMessage } from '../components/calculator/ErrorMessage';
import { SavingsResult } from '../components/calculator/SavingsResult';
import { HeatPumpSelector } from '../components/calculator/HeatPumpSelector';
import { ComparisonView } from '../components/calculator/ComparisonView';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { useSavingsCalculator } from '../hooks/useSavingsCalculator';

export default function CalculatorPage() {
  const {
    address,
    setAddress,
    currentFuel,
    setCurrentFuel,
    selectedUpgrade,
    setSelectedUpgrade,
    comparisonMode,
    setComparisonMode,
    savingsData,
    comparisonData,
    savings,
    loading,
    error,
    showResults,
    calculateSavings,
  } = useSavingsCalculator();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await calculateSavings();
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

      <div className="max-w-[800px] mx-auto px-8 py-12 md:py-16">
        <div className="mb-12 text-[#1a1a1a] text-base leading-relaxed">
          <p className="mb-3">
            Enter your address and select the fuel you <strong>currently</strong> use to heat your home.
          </p>
          <p>
            Then choose a heat pump efficiency level to see your potential savings, or compare all three efficiency levels side-by-side!
          </p>
        </div>

        <Card variant="white" shadow="lg" className="p-8 mb-6">
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <AddressInput value={address} onChange={setAddress} />
            </div>

            <FuelSelector value={currentFuel} onChange={setCurrentFuel} />

            <HeatPumpSelector
              selectedUpgrade={selectedUpgrade}
              onChange={setSelectedUpgrade}
              comparisonMode={comparisonMode}
              onComparisonToggle={() => setComparisonMode(!comparisonMode)}
            />

            <Button type="submit" isLoading={loading} className="w-full">
              {comparisonMode ? 'COMPARE ALL OPTIONS' : 'CALCULATE SAVINGS'}
            </Button>
          </form>
        </Card>

        {error && <ErrorMessage message={error} />}

        {showResults && comparisonMode && comparisonData.length > 0 && (
          <ComparisonView comparisonData={comparisonData} />
        )}

        {showResults && !comparisonMode && savingsData && (
          <SavingsResult
            savings={savings}
            annualSavings={savingsData.annualSavings}
            monthlySavings={savingsData.monthlySavings}
            energyChange={savingsData.energyChange}
            emissionsReduction={savingsData.emissionsReduction}
            estimateType={savingsData.estimateType}
            upgrade={savingsData.upgrade}
          />
        )}
      </div>
    </div>
  );
}
