import React from 'react';
import { Card } from '../ui/Card';

interface ErrorMessageProps {
  message: string;
}

export function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <Card variant="white" shadow="md" className="p-6 mb-6">
      <p className="text-[#1a1a1a] font-semibold">⚠️ {message}</p>
    </Card>
  );
}
