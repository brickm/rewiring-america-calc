/**
 * @jest-environment node
 */

import { GET } from '@/app/api/savings/route';

// Mock axios
jest.mock('axios');
const axios = require('axios');

// Mock NextRequest
class MockNextRequest {
  url: string;
  nextUrl: { searchParams: URLSearchParams };

  constructor(url: string) {
    this.url = url;
    const urlObj = new URL(url);
    this.nextUrl = {
      searchParams: urlObj.searchParams
    };
  }
}

describe('/api/savings', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.REWIRING_AMERICA_API_KEY = 'test_key';
  });

  it('should return 400 if address is missing', async () => {
    const request = new MockNextRequest('http://localhost:3000/api/savings?heating_fuel=natural_gas') as any;
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toContain('Missing required parameters');
  });

  it('should return 400 if heating_fuel is missing', async () => {
    const request = new MockNextRequest('http://localhost:3000/api/savings?address=Denver,CO') as any;
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toContain('Missing required parameters');
  });

  it('should return savings data on successful API call', async () => {
    const mockApiResponse = {
      data: {
        fuel_results: {
          total: {
            delta: {
              cost: {
                mean: {
                  value: -850.5
                }
              }
            }
          }
        },
        estimate_type: 'address_level'
      }
    };

    axios.get.mockResolvedValue(mockApiResponse);

    const request = new MockNextRequest('http://localhost:3000/api/savings?address=Denver,CO&heating_fuel=natural_gas') as any;
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.savings).toBe('$850.50');
    expect(data.estimateType).toBe('address_level');
  });

  it('should return 500 on API error', async () => {
    axios.get.mockRejectedValue(new Error('API Error'));

    const request = new MockNextRequest('http://localhost:3000/api/savings?address=Denver,CO&heating_fuel=natural_gas') as any;
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe('Failed to calculate savings');
  });

  it('should handle zero savings correctly', async () => {
    const mockApiResponse = {
      data: {
        fuel_results: {
          total: {
            delta: {
              cost: {
                mean: {
                  value: 0
                }
              }
            }
          }
        },
        estimate_type: 'puma_level'
      }
    };

    axios.get.mockResolvedValue(mockApiResponse);

    const request = new MockNextRequest('http://localhost:3000/api/savings?address=Test&heating_fuel=electricity') as any;
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.savings).toBe('$0.00');
  });
});
