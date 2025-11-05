'use client';

import { useState } from 'react';
import axios from 'axios';

export default function Home() {
  const [address, setAddress] = useState('');
  const [currentFuel, setCurrentFuel] = useState('natural_gas');
  const [savings, setSavings] = useState('');
  const [hidden, setHidden] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setHidden(true);

    try {
      const response = await axios.get('/api/savings', {
        params: {
          address,
          heating_fuel: currentFuel
        }
      });

      setSavings(response.data.savings);
      setHidden(false);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to calculate savings');
    } finally {
      setLoading(false);
    }
  };

  const onFuelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentFuel(e.target.value);
    setHidden(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div id="titlebar" className="bg-blue-600 text-white py-8 text-center">
        <h1 className="text-4xl font-bold">Electrification Nation</h1>
        <h2 className="text-xl mt-2">Your Heat Pump People</h2>
      </div>

      <div className="max-w-2xl mx-auto p-8">
        <div className="mb-8 text-gray-700">
          We're here to help you save money by electrifying your home. Enter your address and select the fuel you
          currently use to heat your home and we'll tell you how much you can save by having us install a heat pump!
        </div>

        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow">
          <label className="block mb-4">
            <p className="text-gray-700 font-medium mb-2">Address:</p>
            <input
              type="text"
              value={address}
              onChange={(e) => {
                setAddress(e.target.value);
                setHidden(true);
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </label>

          <fieldset className="mb-4">
            <legend className="text-gray-700 font-medium mb-2">Current Heating Fuel:</legend>
            <div className="space-y-2">
              {[
                { value: 'fuel_oil', label: 'Fuel Oil' },
                { value: 'natural_gas', label: 'Natural Gas' },
                { value: 'propane', label: 'Propane' },
                { value: 'electricity', label: 'Electricity' }
              ].map((fuel) => (
                <label key={fuel.value} className="flex items-center">
                  <input
                    type="radio"
                    name="fuel"
                    value={fuel.value}
                    checked={currentFuel === fuel.value}
                    onChange={onFuelChange}
                    className="mr-2"
                  />
                  <span className="text-gray-700">{fuel.label}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? 'Calculating...' : 'OK'}
          </button>
        </form>

        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {!hidden && (
          <div className="mt-6 bg-green-50 border border-green-200 p-6 rounded-lg">
            <p className="text-lg mb-2">
              Expected annual savings: <span className="text-2xl font-bold text-green-600">{savings}</span>
            </p>
            <p className="text-gray-600">
              Call us at 1-800-LEC-TRIC to get your job started today!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
