/**
 * @jest-environment node
 */

import { POST } from '@/app/api/health-impacts/route';

// Mock axios
jest.mock('axios');
const axios = require('axios');

// Mock NextRequest
class MockNextRequest {
  json: () => Promise<any>;

  constructor(body: any) {
    this.json = async () => body;
  }
}

describe('/api/health-impacts', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.REWIRING_AMERICA_API_KEY = 'test_key';
  });

  it('should return 400 if state_fips is missing', async () => {
    const request = new MockNextRequest({}) as any;
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toContain('Missing required parameter');
  });

  it('should return health impacts data on successful API call', async () => {
    const mockApiResponse = {
      data: {
        data: [
          {
            state: 'CO',
            state_fips: '08',
            county_fips: '031',
            county: 'Denver',
            upgrade: 'hvac__heat_pump_seer24_hspf13',
            households: 100000,
            metric: 'mortality_avoided_nox',
            value: 2.5,
            units: 'deaths_per_year'
          },
          {
            state: 'CO',
            state_fips: '08',
            county_fips: '031',
            county: 'Denver',
            upgrade: 'hvac__heat_pump_seer24_hspf13',
            households: 100000,
            metric: 'nox_reduced',
            value: 150.8,
            units: 'tons_per_year'
          },
          {
            state: 'CO',
            state_fips: '08',
            county_fips: '031',
            county: 'Denver',
            upgrade: 'hvac__heat_pump_seer24_hspf13',
            households: 100000,
            metric: 'pm25_reduced',
            value: 12.3,
            units: 'tons_per_year'
          }
        ]
      }
    };

    axios.post.mockResolvedValue(mockApiResponse);

    const request = new MockNextRequest({ state_fips: '08', county_fips: '031' }) as any;
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.data).toHaveLength(1); // Should be aggregated by county
    expect(data.data[0].county).toBe('Denver');
    expect(data.data[0].mortalityReduction).toBe(2.5);
    expect(data.data[0].noxReduced).toBe(150.8);
    expect(data.data[0].pm25Reduced).toBe(12.3);
  });

  it('should handle multiple counties in state', async () => {
    const mockApiResponse = {
      data: {
        data: [
          {
            state: 'CO',
            state_fips: '08',
            county_fips: '031',
            county: 'Denver',
            upgrade: 'hvac__heat_pump_seer24_hspf13',
            metric: 'mortality_avoided_nox',
            value: 2.5,
            units: 'deaths_per_year'
          },
          {
            state: 'CO',
            state_fips: '08',
            county_fips: '059',
            county: 'Jefferson',
            upgrade: 'hvac__heat_pump_seer24_hspf13',
            metric: 'mortality_avoided_nox',
            value: 1.8,
            units: 'deaths_per_year'
          }
        ]
      }
    };

    axios.post.mockResolvedValue(mockApiResponse);

    const request = new MockNextRequest({ state_fips: '08' }) as any;
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.data).toHaveLength(2);
    expect(data.data[0].county).toBe('Denver');
    expect(data.data[1].county).toBe('Jefferson');
  });

  it('should fallback to demo data on API error', async () => {
    axios.post.mockRejectedValue(new Error('API Error'));

    const request = new MockNextRequest({ state_fips: '08' }) as any;
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.isDemo).toBe(true);
    expect(data.demoMessage).toContain('Health Impacts API requires special access');
    expect(data.data.length).toBeGreaterThan(0); // Should have demo data for Colorado
  });

  it('should handle empty response data', async () => {
    const mockApiResponse = {
      data: {
        data: []
      }
    };

    axios.post.mockResolvedValue(mockApiResponse);

    const request = new MockNextRequest({ state_fips: '99' }) as any;
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.data).toHaveLength(0);
  });
});
