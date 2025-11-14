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

    // Call Rewiring America Health Impacts API
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

    const rawData: HealthImpactRow[] = response.data.data || [];

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
      data: aggregatedData
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
