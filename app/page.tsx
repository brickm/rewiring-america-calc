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
          <Card variant="yellow" shadow="lg" className="p-8 h-full">
            <h2 className="text-[32px] md:text-[40px] font-mono font-normal leading-[1.1] tracking-tight text-[#1a1a1a] mb-4">
              WORKSHOP PRESENTATION
            </h2>
            <p className="text-[#1a1a1a] text-lg mb-6 leading-relaxed">
              View the full workshop slide deck covering AI-assisted development, climate tools, and deployment workflows.
            </p>
            <div className="mt-auto">
              <a href="/workshop-presentation.html" className="inline-block">
                <span className="inline-block bg-[#1a1a1a] hover:bg-[#4da6ff] text-white px-6 py-3 border-[2px] border-black font-semibold uppercase text-sm transition-colors duration-200">
                  View Slides →
                </span>
              </a>
            </div>
          </Card>

          {/* Calculator Card */}
          <Card variant="white" shadow="lg" className="p-8 h-full">
            <h2 className="text-[32px] md:text-[40px] font-mono font-normal leading-[1.1] tracking-tight text-[#1a1a1a] mb-4">
              SAVINGS CALCULATOR
            </h2>
            <p className="text-[#1a1a1a] text-lg mb-6 leading-relaxed">
              Calculate your annual savings by switching to a heat pump.
            </p>
            <div className="mt-auto">
              <a href="/calculator">
                <Button className="w-full">
                  Calculate Savings →
                </Button>
              </a>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
