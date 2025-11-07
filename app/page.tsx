'use client';

import { Header } from './components/calculator/Header';
import { IntroText } from './components/calculator/IntroText';
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

      <div className="max-w-[800px] mx-auto px-8 py-12 md:py-16">
        <IntroText />

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
      </div>
    </div>
  );
}
