import { useState } from 'react';

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

const HEAT_PUMP_UPGRADES = [
  'hvac__heat_pump_seer15_hspf9',
  'hvac__heat_pump_seer18_hspf10',
  'hvac__heat_pump_seer24_hspf13'
];

export function useHeatPumpComparison() {
  const [comparisonData, setComparisonData] = useState<SavingsResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchComparison = async (address: string, heatingFuel: string) => {
    if (!address || !heatingFuel) {
      setError('Address and heating fuel are required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Use Promise.all to fetch all three heat pump comparisons in parallel
      const promises = HEAT_PUMP_UPGRADES.map(upgrade => {
        const params = new URLSearchParams({
          address,
          heating_fuel: heatingFuel,
          upgrade
        });
        return fetch(`/api/savings?${params.toString()}`).then(res => res.json());
      });

      const results = await Promise.all(promises);

      // Check if all results are successful
      const allSuccessful = results.every(result => result.success);
      if (!allSuccessful) {
        throw new Error('One or more API calls failed');
      }

      setComparisonData(results);
    } catch (err) {
      setError('Failed to fetch comparison data');
      setComparisonData([]);
    } finally {
      setLoading(false);
    }
  };

  return {
    comparisonData,
    loading,
    error,
    fetchComparison
  };
}
