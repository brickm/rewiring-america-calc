import { useState } from 'react';
import axios from 'axios';

export interface CountyHealthData {
  county: string;
  countyFips: string;
  state: string;
  stateFips: string;
  mortalityReduction: number;
  noxReduced: number;
  pm25Reduced: number;
  households?: number;
}

interface UseHealthImpactsReturn {
  stateFips: string;
  setStateFips: (fips: string) => void;
  countyFips: string;
  setCountyFips: (fips: string) => void;
  healthData: CountyHealthData[];
  loading: boolean;
  error: string;
  showResults: boolean;
  fetchHealthImpacts: () => Promise<void>;
  resetResults: () => void;
}

export function useHealthImpacts(): UseHealthImpactsReturn {
  const [stateFips, setStateFipsState] = useState('');
  const [countyFips, setCountyFipsState] = useState('');
  const [healthData, setHealthData] = useState<CountyHealthData[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchHealthImpacts = async () => {
    setLoading(true);
    setError('');
    setShowResults(false);

    try {
      const response = await axios.post('/api/health-impacts', {
        state_fips: stateFips,
        county_fips: countyFips || undefined,
      });

      setHealthData(response.data.data || []);
      setShowResults(true);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch health impacts data');
    } finally {
      setLoading(false);
    }
  };

  const resetResults = () => {
    setShowResults(false);
  };

  return {
    stateFips,
    setStateFips: (value: string) => {
      setStateFipsState(value);
      resetResults();
    },
    countyFips,
    setCountyFips: (value: string) => {
      setCountyFipsState(value);
      resetResults();
    },
    healthData,
    loading,
    error,
    showResults,
    fetchHealthImpacts,
    resetResults,
  };
}
