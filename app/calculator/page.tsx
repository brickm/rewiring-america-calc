'use client';

import Link from 'next/link';
import { AddressInput } from '../components/calculator/AddressInput';
import { FuelSelector } from '../components/calculator/FuelSelector';
import { ErrorMessage } from '../components/calculator/ErrorMessage';
import { SavingsResult } from '../components/calculator/SavingsResult';
import { HealthImpactsResult } from '../components/calculator/HealthImpactsResult';
import { FipsInput } from '../components/calculator/FipsInput';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { useSavingsCalculator } from '../hooks/useSavingsCalculator';
import { useHealthImpacts } from '../hooks/useHealthImpacts';

export default function CalculatorPage() {
  const {
    address,
    setAddress,
    currentFuel,
    setCurrentFuel,
    savings,
    loading,
    error,
    showResults,
    calculateSavings,
  } = useSavingsCalculator();

  const {
    stateFips,
    setStateFips,
    countyFips,
    setCountyFips,
    healthData,
    loading: healthLoading,
    error: healthError,
    showResults: showHealthResults,
    isDemo,
    demoMessage,
    fetchHealthImpacts,
  } = useHealthImpacts();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await calculateSavings();
  };

  const handleHealthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetchHealthImpacts();
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
          Enter your address and select the fuel you currently use to heat your home. We'll tell you how much you can save by switching to a heat pump!
        </div>

        <Card variant="white" shadow="lg" className="p-8 mb-6">
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <AddressInput value={address} onChange={setAddress} />
            </div>

            <FuelSelector value={currentFuel} onChange={setCurrentFuel} />

            <Button type="submit" isLoading={loading} className="w-full">
              CALCULATE SAVINGS
            </Button>
          </form>
        </Card>

        {error && <ErrorMessage message={error} />}

        {showResults && <SavingsResult savings={savings} />}

        {/* Health Impacts Section */}
        <div className="mt-16 pt-16 border-t-[3px] border-black">
          <h2 className="text-[40px] md:text-[48px] font-mono font-normal leading-[1.1] tracking-tight text-[#1a1a1a] mb-4">
            HEALTH IMPACTS
          </h2>
          <p className="mb-8 text-[#1a1a1a] text-base leading-relaxed">
            See the county-level health benefits of residential electrification in your state.
          </p>

          <Card variant="white" shadow="lg" className="p-8 mb-6">
            <form onSubmit={handleHealthSubmit}>
              <FipsInput
                label="State FIPS Code"
                value={stateFips}
                onChange={setStateFips}
                placeholder="e.g., 08 for Colorado"
                required
                helpText="Enter the 2-digit FIPS code for your state. Common codes: CA=06, CO=08, NY=36, TX=48"
              />

              <FipsInput
                label="County FIPS Code (Optional)"
                value={countyFips}
                onChange={setCountyFips}
                placeholder="* for all counties, or 031 for Denver"
                helpText="Use * to get all counties (for maps), enter a 3-digit code for one county, or leave blank for state aggregate."
              />

              <Button type="submit" isLoading={healthLoading} className="w-full">
                GET HEALTH IMPACTS
              </Button>
            </form>
          </Card>

          {healthError && <ErrorMessage message={healthError} />}

          {showHealthResults && <HealthImpactsResult healthData={healthData} isDemo={isDemo} demoMessage={demoMessage} />}
        </div>
      </div>
    </div>
  );
}
