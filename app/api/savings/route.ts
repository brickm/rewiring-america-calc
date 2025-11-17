import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const address = searchParams.get('address');
  const heatingFuel = searchParams.get('heating_fuel');
  // Allow upgrade parameter, default to SEER 18 (high efficiency)
  const upgrade = searchParams.get('upgrade') || 'hvac__heat_pump_seer18_hspf10';

  if (!address || !heatingFuel) {
    return NextResponse.json(
      { error: 'Missing required parameters: address and heating_fuel' },
      { status: 400 }
    );
  }

  try {
    console.log('Savings API Request:', {
      url: 'https://api.rewiringamerica.org/api/v1/rem/address',
      params: { address, heating_fuel: heatingFuel, upgrade },
      hasApiKey: !!process.env.REWIRING_AMERICA_API_KEY,
      apiKeyPrefix: process.env.REWIRING_AMERICA_API_KEY?.substring(0, 10) + '...'
    });

    const response = await axios.get(
      'https://api.rewiringamerica.org/api/v1/rem/address',
      {
        params: {
          address,
          heating_fuel: heatingFuel,
          upgrade
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

    // Extract cost savings (negative delta means savings)
    const costData = response.data.fuel_results?.total?.delta?.cost;
    const meanSavings = -Number(costData?.mean?.value || 0);
    const medianSavings = -Number(costData?.median?.value || 0);
    const percentile20 = -Number(costData?.percentile_20?.value || 0);
    const percentile80 = -Number(costData?.percentile_80?.value || 0);

    // Extract energy change (kWh)
    const energyData = response.data.fuel_results?.total?.delta?.energy;
    const meanEnergy = Number(energyData?.mean?.value || 0);

    // Extract emissions reduction (kg CO2e, negative means reduction)
    const emissionsData = response.data.fuel_results?.total?.delta?.co2e;
    const meanEmissions = -Number(emissionsData?.mean?.value || 0);

    // Legacy format for backward compatibility
    const roundedSavings = (Math.round(meanSavings * 100) / 100).toFixed(2);

    return NextResponse.json({
      success: true,
      // Legacy fields (keep for backward compatibility)
      savings: `$${roundedSavings}`,
      rawSavings: meanSavings,
      estimateType: response.data.estimate_type,
      upgrade, // Include which heat pump type was used
      // Enhanced fields
      annualSavings: {
        mean: Math.round(meanSavings * 100) / 100,
        median: Math.round(medianSavings * 100) / 100,
        percentile20: Math.round(percentile20 * 100) / 100,
        percentile80: Math.round(percentile80 * 100) / 100
      },
      monthlySavings: {
        mean: Math.round((meanSavings / 12) * 100) / 100,
        median: Math.round((medianSavings / 12) * 100) / 100,
        percentile20: Math.round((percentile20 / 12) * 100) / 100,
        percentile80: Math.round((percentile80 / 12) * 100) / 100
      },
      energyChange: {
        mean: Math.round(meanEnergy * 100) / 100 // kWh
      },
      emissionsReduction: {
        mean: Math.round(meanEmissions * 100) / 100 // kg CO2e
      }
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
