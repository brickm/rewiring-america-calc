import React from 'react';
import { Input } from '../ui/Input';

interface AddressInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function AddressInput({ value, onChange }: AddressInputProps) {
  return (
    <Input
      label="Address:"
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="123 Main St, Denver, CO 80203"
      required
    />
  );
}
