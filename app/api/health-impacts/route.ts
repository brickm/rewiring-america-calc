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
  warnings?: string | null;
}

interface CountyHealthData {
  county: string;
  countyFips: string;
  state: string;
  stateFips: string;
  mortalityReduction: number;
  noxReduced: number;
  pm25Reduced: number;
  vocReduced: number;
  so2Reduced: number;
  households?: number;
  warnings?: string | null;
}

// Demo data for states when API access is restricted
const DEMO_DATA: Record<string, HealthImpactRow[]> = {
  '08': [ // Colorado
    { state: 'CO', state_fips: '08', county_fips: '031', county: 'Denver', upgrade: 'hvac__heat_pump_seer18_hspf10', metric: 'avoided_premature_mortality_incidence', value: 2.5, units: 'deaths_per_year' },
    { state: 'CO', state_fips: '08', county_fips: '031', county: 'Denver', upgrade: 'hvac__heat_pump_seer18_hspf10', metric: 'nitrogen_oxides', value: 150800, units: 'kg_per_year' },
    { state: 'CO', state_fips: '08', county_fips: '031', county: 'Denver', upgrade: 'hvac__heat_pump_seer18_hspf10', metric: 'fine_particulate_matter', value: 12300, units: 'kg_per_year' },
    { state: 'CO', state_fips: '08', county_fips: '031', county: 'Denver', upgrade: 'hvac__heat_pump_seer18_hspf10', metric: 'volatile_organic_compounds', value: 28500, units: 'kg_per_year' },
    { state: 'CO', state_fips: '08', county_fips: '031', county: 'Denver', upgrade: 'hvac__heat_pump_seer18_hspf10', metric: 'sulfur_dioxide', value: -8200, units: 'kg_per_year' },
    { state: 'CO', state_fips: '08', county_fips: '059', county: 'Jefferson', upgrade: 'hvac__heat_pump_seer18_hspf10', metric: 'avoided_premature_mortality_incidence', value: 1.8, units: 'deaths_per_year' },
    { state: 'CO', state_fips: '08', county_fips: '059', county: 'Jefferson', upgrade: 'hvac__heat_pump_seer18_hspf10', metric: 'nitrogen_oxides', value: 98500, units: 'kg_per_year' },
    { state: 'CO', state_fips: '08', county_fips: '059', county: 'Jefferson', upgrade: 'hvac__heat_pump_seer18_hspf10', metric: 'fine_particulate_matter', value: 8700, units: 'kg_per_year' },
    { state: 'CO', state_fips: '08', county_fips: '059', county: 'Jefferson', upgrade: 'hvac__heat_pump_seer18_hspf10', metric: 'volatile_organic_compounds', value: 19500, units: 'kg_per_year' },
    { state: 'CO', state_fips: '08', county_fips: '059', county: 'Jefferson', upgrade: 'hvac__heat_pump_seer18_hspf10', metric: 'sulfur_dioxide', value: -5400, units: 'kg_per_year' }
  ],
  '06': [ // California
    { state: 'CA', state_fips: '06', county_fips: '037', county: 'Los Angeles', upgrade: 'hvac__heat_pump_seer18_hspf10', metric: 'avoided_premature_mortality_incidence', value: 15.4, units: 'deaths_per_year' },
    { state: 'CA', state_fips: '06', county_fips: '037', county: 'Los Angeles', upgrade: 'hvac__heat_pump_seer18_hspf10', metric: 'nitrogen_oxides', value: 892300, units: 'kg_per_year' },
    { state: 'CA', state_fips: '06', county_fips: '037', county: 'Los Angeles', upgrade: 'hvac__heat_pump_seer18_hspf10', metric: 'fine_particulate_matter', value: 78900, units: 'kg_per_year' },
    { state: 'CA', state_fips: '06', county_fips: '037', county: 'Los Angeles', upgrade: 'hvac__heat_pump_seer18_hspf10', metric: 'volatile_organic_compounds', value: 185000, units: 'kg_per_year' },
    { state: 'CA', state_fips: '06', county_fips: '037', county: 'Los Angeles', upgrade: 'hvac__heat_pump_seer18_hspf10', metric: 'sulfur_dioxide', value: -42000, units: 'kg_per_year' }
  ],
  '36': [ // New York
    { state: 'NY', state_fips: '36', county_fips: '061', county: 'New York', upgrade: 'hvac__heat_pump_seer18_hspf10', metric: 'avoided_premature_mortality_incidence', value: 8.3, units: 'deaths_per_year' },
    { state: 'NY', state_fips: '36', county_fips: '061', county: 'New York', upgrade: 'hvac__heat_pump_seer18_hspf10', metric: 'nitrogen_oxides', value: 456700, units: 'kg_per_year' },
    { state: 'NY', state_fips: '36', county_fips: '061', county: 'New York', upgrade: 'hvac__heat_pump_seer18_hspf10', metric: 'fine_particulate_matter', value: 42100, units: 'kg_per_year' },
    { state: 'NY', state_fips: '36', county_fips: '061', county: 'New York', upgrade: 'hvac__heat_pump_seer18_hspf10', metric: 'volatile_organic_compounds', value: 95000, units: 'kg_per_year' },
    { state: 'NY', state_fips: '36', county_fips: '061', county: 'New York', upgrade: 'hvac__heat_pump_seer18_hspf10', metric: 'sulfur_dioxide', value: -45000, units: 'kg_per_year' }
  ],
  '53': [ // Washington
    { state: 'WA', state_fips: '53', county_fips: '033', county: 'King', upgrade: 'hvac__heat_pump_seer18_hspf10', metric: 'avoided_premature_mortality_incidence', value: 3.2, units: 'deaths_per_year' },
    { state: 'WA', state_fips: '53', county_fips: '033', county: 'King', upgrade: 'hvac__heat_pump_seer18_hspf10', metric: 'nitrogen_oxides', value: 175000, units: 'kg_per_year' },
    { state: 'WA', state_fips: '53', county_fips: '033', county: 'King', upgrade: 'hvac__heat_pump_seer18_hspf10', metric: 'fine_particulate_matter', value: 18500, units: 'kg_per_year' },
    { state: 'WA', state_fips: '53', county_fips: '033', county: 'King', upgrade: 'hvac__heat_pump_seer18_hspf10', metric: 'volatile_organic_compounds', value: 42000, units: 'kg_per_year' },
    { state: 'WA', state_fips: '53', county_fips: '033', county: 'King', upgrade: 'hvac__heat_pump_seer18_hspf10', metric: 'sulfur_dioxide', value: -12000, units: 'kg_per_year' },
    { state: 'WA', state_fips: '53', county_fips: '061', county: 'Snohomish', upgrade: 'hvac__heat_pump_seer18_hspf10', metric: 'avoided_premature_mortality_incidence', value: 1.8, units: 'deaths_per_year' },
    { state: 'WA', state_fips: '53', county_fips: '061', county: 'Snohomish', upgrade: 'hvac__heat_pump_seer18_hspf10', metric: 'nitrogen_oxides', value: 92000, units: 'kg_per_year' },
    { state: 'WA', state_fips: '53', county_fips: '061', county: 'Snohomish', upgrade: 'hvac__heat_pump_seer18_hspf10', metric: 'fine_particulate_matter', value: 9800, units: 'kg_per_year' },
    { state: 'WA', state_fips: '53', county_fips: '061', county: 'Snohomish', upgrade: 'hvac__heat_pump_seer18_hspf10', metric: 'volatile_organic_compounds', value: 22000, units: 'kg_per_year' },
    { state: 'WA', state_fips: '53', county_fips: '061', county: 'Snohomish', upgrade: 'hvac__heat_pump_seer18_hspf10', metric: 'sulfur_dioxide', value: -6500, units: 'kg_per_year' }
  ],
  '48': [ // Texas
    { state: 'TX', state_fips: '48', county_fips: '201', county: 'Harris', upgrade: 'hvac__heat_pump_seer18_hspf10', metric: 'avoided_premature_mortality_incidence', value: 12.4, units: 'deaths_per_year' },
    { state: 'TX', state_fips: '48', county_fips: '201', county: 'Harris', upgrade: 'hvac__heat_pump_seer18_hspf10', metric: 'nitrogen_oxides', value: 620000, units: 'kg_per_year' },
    { state: 'TX', state_fips: '48', county_fips: '201', county: 'Harris', upgrade: 'hvac__heat_pump_seer18_hspf10', metric: 'fine_particulate_matter', value: 58000, units: 'kg_per_year' },
    { state: 'TX', state_fips: '48', county_fips: '201', county: 'Harris', upgrade: 'hvac__heat_pump_seer18_hspf10', metric: 'volatile_organic_compounds', value: 135000, units: 'kg_per_year' },
    { state: 'TX', state_fips: '48', county_fips: '201', county: 'Harris', upgrade: 'hvac__heat_pump_seer18_hspf10', metric: 'sulfur_dioxide', value: -28000, units: 'kg_per_year' }
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
      const requestBody: any = {
        metrics: [
          'avoided_premature_mortality_incidence',
          'nitrogen_oxides',
          'fine_particulate_matter',
          'volatile_organic_compounds',
          'sulfur_dioxide'
        ],
        upgrade: ['hvac__heat_pump_seer18_hspf10'],
        state_fips: [state_fips]
      };

      // Add county_fips as array
      // Use "*" to get ALL counties in the state (for choropleth maps)
      // Use specific code to get one county
      // Omit to get state-level aggregate
      if (county_fips) {
        requestBody.county_fips = county_fips === '*' ? ['*'] : [county_fips];
      }

      console.log('Health Impacts API Request:', {
        url: 'https://api.rewiringamerica.org/api/v2/etools/health-impacts',
        body: requestBody,
        hasApiKey: !!process.env.REWIRING_AMERICA_API_KEY,
        apiKeyPrefix: process.env.REWIRING_AMERICA_API_KEY?.substring(0, 10) + '...'
      });

      const response = await axios.post(
        'https://api.rewiringamerica.org/api/v2/etools/health-impacts',
        requestBody,
        {
          headers: {
            Authorization: `Bearer ${process.env.REWIRING_AMERICA_API_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );

      // Map API response to our format
      const apiData = response.data.data || [];
      rawData = apiData.map((row: any) => ({
        state: row.state_abbreviation,
        state_fips: state_fips,
        county_fips: row.county_fips,
        county: row.county_name,
        upgrade: row.upgrade_option,
        households: row.number_of_households,
        metric: row.metric,
        value: row.impact,
        units: row.units,
        warnings: row.warnings
      }));
    } catch (apiError: any) {
      // If API returns 403 (forbidden) or any error, fall back to demo data
      console.error('Health Impacts API Error Details:', {
        status: apiError.response?.status,
        statusText: apiError.response?.statusText,
        data: apiError.response?.data,
        message: apiError.message
      });
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
          vocReduced: 0,
          so2Reduced: 0,
          households: row.households,
          warnings: row.warnings
        });
      }

      const countyData = countyMap.get(key)!;

      // Map metrics to our simplified structure
      // Note: NOx, PM2.5, VOC, SO2 are in kg/year; mortality is in deaths/year
      if (row.metric === 'avoided_premature_mortality_incidence') {
        countyData.mortalityReduction = row.value;
      } else if (row.metric === 'nitrogen_oxides') {
        countyData.noxReduced = row.value;
      } else if (row.metric === 'fine_particulate_matter') {
        countyData.pm25Reduced = row.value;
      } else if (row.metric === 'volatile_organic_compounds') {
        countyData.vocReduced = row.value;
      } else if (row.metric === 'sulfur_dioxide') {
        countyData.so2Reduced = row.value;
      }

      // Update warnings if this row has any (keep first non-null warning)
      if (row.warnings && !countyData.warnings) {
        countyData.warnings = row.warnings;
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
