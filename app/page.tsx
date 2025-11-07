'use client';

import { Header } from './components/calculator/Header';
import { AddressInput } from './components/calculator/AddressInput';
import { FuelSelector } from './components/calculator/FuelSelector';
import { ErrorMessage } from './components/calculator/ErrorMessage';
import { SavingsResult } from './components/calculator/SavingsResult';
import { Button } from './components/ui/Button';
import { Card } from './components/ui/Card';
import { useSavingsCalculator } from './hooks/useSavingsCalculator';

export default function Home() {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await calculateSavings();
  };

  return (
    <div className="min-h-screen bg-[#e8e4dc]">
      <Header />

      <div className="max-w-[1200px] mx-auto px-8 py-12 md:py-16">
        <div className="mb-12 text-[#1a1a1a] text-base leading-relaxed max-w-[800px]">
          We're here to help you save money by electrifying your home. Choose an option below to get started.
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Presentation Card */}
          <a href="/workshop-presentation.html" target="_blank" rel="noopener noreferrer" className="block">
            <Card variant="yellow" shadow="lg" className="p-8 h-full transition-all duration-200 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]">
              <h2 className="text-[32px] md:text-[40px] font-mono font-normal leading-[1.1] tracking-tight text-[#1a1a1a] mb-4">
                WORKSHOP PRESENTATION
              </h2>
              <p className="text-[#1a1a1a] text-lg mb-6 leading-relaxed">
                View the full workshop slide deck covering AI-assisted development, climate tools, and deployment workflows.
              </p>
              <div className="mt-auto">
                <span className="inline-block bg-[#1a1a1a] text-white px-6 py-3 border-[2px] border-black font-semibold uppercase text-sm">
                  View Slides →
                </span>
              </div>
            </Card>
          </a>

          {/* Calculator Card */}
          <Card variant="white" shadow="lg" className="p-8 h-full">
            <h2 className="text-[32px] md:text-[40px] font-mono font-normal leading-[1.1] tracking-tight text-[#1a1a1a] mb-4">
              SAVINGS CALCULATOR
            </h2>
            <p className="text-[#1a1a1a] text-lg mb-6 leading-relaxed">
              Calculate your annual savings by switching to a heat pump.
            </p>
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
        </div>

        {error && <ErrorMessage message={error} />}

        {showResults && <SavingsResult savings={savings} />}
      </div>
    </div>
  );
}
