import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

interface HealthImpactRow {
  state: string;
  state_fips: string;
  county_fips?: string;
  county?: string;
  upgrade: string;
  households?: number;
  metric: string;
  value: number;
  units: string;
}

interface CountyHealthData {
  county: string;
  countyFips: string;
  state: string;
  stateFips: string;
  mortalityReduction: number;
  noxReduced: number;
  pm25Reduced: number;
  households?: number;
}

// Demo data for states when API access is restricted
const DEMO_DATA: Record<string, HealthImpactRow[]> = {
  '08': [ // Colorado
    { state: 'CO', state_fips: '08', county_fips: '031', county: 'Denver', upgrade: 'hvac__heat_pump_seer24_hspf13', metric: 'mortality_avoided_nox', value: 2.5, units: 'deaths_per_year' },
    { state: 'CO', state_fips: '08', county_fips: '031', county: 'Denver', upgrade: 'hvac__heat_pump_seer24_hspf13', metric: 'nox_reduced', value: 150.8, units: 'tons_per_year' },
    { state: 'CO', state_fips: '08', county_fips: '031', county: 'Denver', upgrade: 'hvac__heat_pump_seer24_hspf13', metric: 'pm25_reduced', value: 12.3, units: 'tons_per_year' },
    { state: 'CO', state_fips: '08', county_fips: '059', county: 'Jefferson', upgrade: 'hvac__heat_pump_seer24_hspf13', metric: 'mortality_avoided_nox', value: 1.8, units: 'deaths_per_year' },
    { state: 'CO', state_fips: '08', county_fips: '059', county: 'Jefferson', upgrade: 'hvac__heat_pump_seer24_hspf13', metric: 'nox_reduced', value: 98.5, units: 'tons_per_year' },
    { state: 'CO', state_fips: '08', county_fips: '059', county: 'Jefferson', upgrade: 'hvac__heat_pump_seer24_hspf13', metric: 'pm25_reduced', value: 8.7, units: 'tons_per_year' }
  ],
  '06': [ // California
    { state: 'CA', state_fips: '06', county_fips: '037', county: 'Los Angeles', upgrade: 'hvac__heat_pump_seer24_hspf13', metric: 'mortality_avoided_nox', value: 15.4, units: 'deaths_per_year' },
    { state: 'CA', state_fips: '06', county_fips: '037', county: 'Los Angeles', upgrade: 'hvac__heat_pump_seer24_hspf13', metric: 'nox_reduced', value: 892.3, units: 'tons_per_year' },
    { state: 'CA', state_fips: '06', county_fips: '037', county: 'Los Angeles', upgrade: 'hvac__heat_pump_seer24_hspf13', metric: 'pm25_reduced', value: 78.9, units: 'tons_per_year' }
  ],
  '36': [ // New York
    { state: 'NY', state_fips: '36', county_fips: '061', county: 'New York', upgrade: 'hvac__heat_pump_seer24_hspf13', metric: 'mortality_avoided_nox', value: 8.3, units: 'deaths_per_year' },
    { state: 'NY', state_fips: '36', county_fips: '061', county: 'New York', upgrade: 'hvac__heat_pump_seer24_hspf13', metric: 'nox_reduced', value: 456.7, units: 'tons_per_year' },
    { state: 'NY', state_fips: '36', county_fips: '061', county: 'New York', upgrade: 'hvac__heat_pump_seer24_hspf13', metric: 'pm25_reduced', value: 42.1, units: 'tons_per_year' }
  ]
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { state_fips, county_fips } = body;

    if (!state_fips) {
      return NextResponse.json(
        { error: 'Missing required parameter: state_fips' },
        { status: 400 }
      );
    }

    let rawData: HealthImpactRow[] = [];
    let isDemo = false;

    try {
      // Try calling Rewiring America Health Impacts API
      const response = await axios.post(
        'https://api.rewiringamerica.org/api/v2/etools/health-impacts',
        {
          state_fips: state_fips,
          county_fips: county_fips || '*', // '*' returns all counties in state
          metrics: [
            'mortality_avoided_nox',
            'mortality_avoided_pm25',
            'nox_reduced',
            'pm25_reduced'
          ],
          upgrade: ['hvac__heat_pump_seer24_hspf13']
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.REWIRING_AMERICA_API_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );

      rawData = response.data.data || [];
    } catch (apiError: any) {
      // If API returns 403 (forbidden) or any error, fall back to demo data
      console.warn('Health Impacts API unavailable, using demo data:', apiError.response?.status);

      const stateData = DEMO_DATA[state_fips] || [];

      // Filter by county if specified
      if (county_fips && county_fips !== '*') {
        rawData = stateData.filter(row => row.county_fips === county_fips);
      } else {
        rawData = stateData;
      }

      isDemo = true;
    }

    // Aggregate data by county
    const countyMap = new Map<string, CountyHealthData>();

    rawData.forEach((row) => {
      const key = `${row.state_fips}-${row.county_fips || 'state'}`;

      if (!countyMap.has(key)) {
        countyMap.set(key, {
          county: row.county || row.state,
          countyFips: row.county_fips || '',
          state: row.state,
          stateFips: row.state_fips,
          mortalityReduction: 0,
          noxReduced: 0,
          pm25Reduced: 0,
          households: row.households
        });
      }

      const countyData = countyMap.get(key)!;

      // Map metrics to our simplified structure
      if (row.metric === 'mortality_avoided_nox' || row.metric === 'mortality_avoided_pm25') {
        countyData.mortalityReduction += row.value;
      } else if (row.metric === 'nox_reduced') {
        countyData.noxReduced = row.value;
      } else if (row.metric === 'pm25_reduced') {
        countyData.pm25Reduced = row.value;
      }
    });

    const aggregatedData = Array.from(countyMap.values());

    return NextResponse.json({
      success: true,
      data: aggregatedData,
      isDemo,
      demoMessage: isDemo ? 'Using demo data - Health Impacts API requires special access' : undefined
    });

  } catch (error: any) {
    console.error('Health Impacts API Error:', error.response?.data || error.message);

    return NextResponse.json(
      {
        error: 'Failed to fetch health impacts data',
        details: error.response?.data?.message || error.message
      },
      { status: 500 }
    );
  }
}
