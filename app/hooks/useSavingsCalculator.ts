import { useState } from 'react';
import axios from 'axios';

interface SavingsData {
  mean: number;
  median: number;
  percentile20: number;
  percentile80: number;
}

interface SavingsResponse {
  savings: string;
  upgrade?: string;
  annualSavings?: SavingsData;
  monthlySavings?: SavingsData;
  energyChange?: { mean: number };
  emissionsReduction?: { mean: number };
  estimateType?: string;
}

interface UseSavingsCalculatorReturn {
  address: string;
  setAddress: (address: string) => void;
  currentFuel: string;
  setCurrentFuel: (fuel: string) => void;
  selectedUpgrade: string;
  setSelectedUpgrade: (upgrade: string) => void;
  comparisonMode: boolean;
  setComparisonMode: (mode: boolean) => void;
  savingsData: SavingsResponse | null;
  comparisonData: SavingsResponse[];
  savings: string; // Legacy field for backward compatibility
  loading: boolean;
  error: string;
  showResults: boolean;
  calculateSavings: () => Promise<void>;
  resetResults: () => void;
}

export function useSavingsCalculator(): UseSavingsCalculatorReturn {
  const [address, setAddress] = useState('');
  const [currentFuel, setCurrentFuel] = useState('natural_gas');
  const [selectedUpgrade, setSelectedUpgrade] = useState('hvac__heat_pump_seer18_hspf10');
  const [comparisonMode, setComparisonMode] = useState(false);
  const [savingsData, setSavingsData] = useState<SavingsResponse | null>(null);
  const [comparisonData, setComparisonData] = useState<SavingsResponse[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const calculateSavings = async () => {
    setLoading(true);
    setError('');
    setShowResults(false);

    try {
      if (comparisonMode) {
        // Fetch all three heat pump types
        const upgrades = [
          'hvac__heat_pump_seer15_hspf9',
          'hvac__heat_pump_seer18_hspf10',
          'hvac__heat_pump_seer24_hspf13'
        ];

        const responses = await Promise.all(
          upgrades.map(upgrade =>
            axios.get('/api/savings', {
              params: {
                address,
                heating_fuel: currentFuel,
                upgrade
              }
            })
          )
        );

        setComparisonData(responses.map(r => r.data));
        setSavingsData(null);
      } else {
        // Fetch single selected upgrade
        const response = await axios.get('/api/savings', {
          params: {
            address,
            heating_fuel: currentFuel,
            upgrade: selectedUpgrade
          }
        });

        setSavingsData(response.data);
        setComparisonData([]);
      }

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
    selectedUpgrade,
    setSelectedUpgrade: (value: string) => {
      setSelectedUpgrade(value);
      resetResults();
    },
    comparisonMode,
    setComparisonMode: (value: boolean) => {
      setComparisonMode(value);
      resetResults();
    },
    savingsData,
    comparisonData,
    savings: savingsData?.savings || '', // Legacy field
    loading,
    error,
    showResults,
    calculateSavings,
    resetResults,
  };
}
