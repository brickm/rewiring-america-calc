import React from 'react';
import { RadioGroup, RadioOption } from '../ui/RadioGroup';

interface FuelSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const FUEL_OPTIONS: RadioOption[] = [
  { value: 'fuel_oil', label: 'Fuel Oil' },
  { value: 'natural_gas', label: 'Natural Gas' },
  { value: 'propane', label: 'Propane' },
  { value: 'electricity', label: 'Electricity' },
];

export function FuelSelector({ value, onChange }: FuelSelectorProps) {
  return (
    <RadioGroup
      name="fuel"
      label="Current Heating Fuel:"
      options={FUEL_OPTIONS}
      value={value}
      onChange={onChange}
      className="mb-8"
    />
  );
}
