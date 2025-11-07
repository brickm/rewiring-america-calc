import { useState } from 'react';
import axios from 'axios';

interface UseSavingsCalculatorReturn {
  address: string;
  setAddress: (address: string) => void;
  currentFuel: string;
  setCurrentFuel: (fuel: string) => void;
  savings: string;
  loading: boolean;
  error: string;
  showResults: boolean;
  calculateSavings: () => Promise<void>;
  resetResults: () => void;
}

export function useSavingsCalculator(): UseSavingsCalculatorReturn {
  const [address, setAddress] = useState('');
  const [currentFuel, setCurrentFuel] = useState('natural_gas');
  const [savings, setSavings] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const calculateSavings = async () => {
    setLoading(true);
    setError('');
    setShowResults(false);

    try {
      const response = await axios.get('/api/savings', {
        params: {
          address,
          heating_fuel: currentFuel,
        },
      });

      setSavings(response.data.savings);
      setShowResults(true);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to calculate savings');
    } finally {
      setLoading(false);
    }
  };

  const resetResults = () => {
    setShowResults(false);
  };

  return {
    address,
    setAddress: (value: string) => {
      setAddress(value);
      resetResults();
    },
    currentFuel,
    setCurrentFuel: (value: string) => {
      setCurrentFuel(value);
      resetResults();
    },
    savings,
    loading,
    error,
    showResults,
    calculateSavings,
    resetResults,
  };
}
