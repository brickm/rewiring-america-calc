import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const address = searchParams.get('address');
  const heatingFuel = searchParams.get('heating_fuel');

  if (!address || !heatingFuel) {
    return NextResponse.json(
      { error: 'Missing required parameters: address and heating_fuel' },
      { status: 400 }
    );
  }

  try {
    console.log('Savings API Request:', {
      url: 'https://api.rewiringamerica.org/api/v1/rem/address',
      params: { address, heating_fuel: heatingFuel, upgrade: 'hvac__heat_pump_seer24_hspf13' },
      hasApiKey: !!process.env.REWIRING_AMERICA_API_KEY,
      apiKeyPrefix: process.env.REWIRING_AMERICA_API_KEY?.substring(0, 10) + '...'
    });

    const response = await axios.get(
      'https://api.rewiringamerica.org/api/v1/rem/address',
      {
        params: {
          address,
          heating_fuel: heatingFuel,
          upgrade: 'hvac__heat_pump_seer24_hspf13'
        },
        headers: {
          Authorization: `Bearer ${process.env.REWIRING_AMERICA_API_KEY}`
        }
      }
    );

    console.log('Savings API Success:', {
      status: response.status,
      hasData: !!response.data,
      estimateType: response.data.estimate_type
    });

    const rawSavings = -Number(response.data.fuel_results?.total?.delta?.cost?.mean?.value || 0);
    const roundedSavings = (Math.round(rawSavings * 100) / 100).toFixed(2);

    return NextResponse.json({
      success: true,
      savings: `$${roundedSavings}`,
      rawSavings,
      estimateType: response.data.estimate_type
    });
  } catch (error: any) {
    console.error('API Error:', error.response?.data || error.message);

    return NextResponse.json(
      {
        error: 'Failed to calculate savings',
        details: error.response?.data?.message || error.message
      },
      { status: 500 }
    );
  }
}
