import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MonthlySavingsChart } from '@/app/components/calculator/MonthlySavingsChart';

describe('MonthlySavingsChart', () => {
  const annualSavings = 1200;
  const monthlySavings = 100; // 1200 / 12

  it('should render 12 bars when given annual savings', () => {
    const { container } = render(<MonthlySavingsChart annualSavings={annualSavings} />);
    const bars = container.querySelectorAll('[data-testid="month-bar"]');
    expect(bars).toHaveLength(12);
  });

  it('should display correct month labels (Jan-Dec)', () => {
    render(<MonthlySavingsChart annualSavings={annualSavings} />);

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    months.forEach((month) => {
      expect(screen.getByText(month)).toBeInTheDocument();
    });
  });

  it('should display monthly value formatted as currency', () => {
    render(<MonthlySavingsChart annualSavings={annualSavings} />);
    expect(screen.getByText('$100.00/month')).toBeInTheDocument();
  });

  it('should display the chart header', () => {
    render(<MonthlySavingsChart annualSavings={annualSavings} />);
    expect(screen.getByText('MONTHLY SAVINGS BREAKDOWN')).toBeInTheDocument();
  });

  it('should not render when annualSavings is 0', () => {
    const { container } = render(<MonthlySavingsChart annualSavings={0} />);
    expect(container.firstChild).toBeNull();
  });

  it('should handle non-round monthly values', () => {
    render(<MonthlySavingsChart annualSavings={1000} />);
    // 1000 / 12 = 83.333...
    expect(screen.getByText('$83.33/month')).toBeInTheDocument();
  });
});
