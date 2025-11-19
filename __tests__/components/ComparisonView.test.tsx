import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ComparisonView } from '@/app/components/calculator/ComparisonView';

describe('ComparisonView', () => {
  const mockComparisonData = [
    {
      savings: '$850.50',
      upgrade: 'hvac__heat_pump_seer15_hspf9',
      annualSavings: {
        mean: 850.5,
        median: 840,
        percentile20: 700,
        percentile80: 950
      },
      monthlySavings: {
        mean: 70.88,
        median: 70,
        percentile20: 58.33,
        percentile80: 79.17
      },
      emissionsReduction: {
        mean: 4500
      }
    },
    {
      savings: '$1200.00',
      upgrade: 'hvac__heat_pump_seer18_hspf10',
      annualSavings: {
        mean: 1200,
        median: 1180,
        percentile20: 1000,
        percentile80: 1350
      },
      monthlySavings: {
        mean: 100,
        median: 98.33,
        percentile20: 83.33,
        percentile80: 112.5
      },
      emissionsReduction: {
        mean: 5200
      }
    },
    {
      savings: '$1350.75',
      upgrade: 'hvac__heat_pump_seer24_hspf13',
      annualSavings: {
        mean: 1350.75,
        median: 1330,
        percentile20: 1150,
        percentile80: 1500
      },
      monthlySavings: {
        mean: 112.56,
        median: 110.83,
        percentile20: 95.83,
        percentile80: 125
      },
      emissionsReduction: {
        mean: 5800
      }
    }
  ];

  it('should render nothing when comparisonData is empty', () => {
    const { container } = render(<ComparisonView comparisonData={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it('should render comparison title and description', () => {
    render(<ComparisonView comparisonData={mockComparisonData} />);

    expect(screen.getByText('HEAT PUMP COMPARISON')).toBeInTheDocument();
    expect(screen.getByText(/Comparing three heat pump efficiency levels/i)).toBeInTheDocument();
  });

  it('should render all three heat pump comparison cards', () => {
    render(<ComparisonView comparisonData={mockComparisonData} />);

    expect(screen.getByText('Standard Efficiency')).toBeInTheDocument();
    expect(screen.getByText('High Efficiency')).toBeInTheDocument();
    expect(screen.getByText('Premium Efficiency')).toBeInTheDocument();
  });

  it('should display annual savings for each option', () => {
    render(<ComparisonView comparisonData={mockComparisonData} />);

    expect(screen.getByText('$851')).toBeInTheDocument(); // 850.5 rounds to 851
    expect(screen.getByText('$1200')).toBeInTheDocument();
    expect(screen.getByText('$1351')).toBeInTheDocument();
  });

  it('should display monthly savings for each option', () => {
    render(<ComparisonView comparisonData={mockComparisonData} />);

    expect(screen.getByText('$70.88')).toBeInTheDocument();
    expect(screen.getByText('$100.00')).toBeInTheDocument();
    expect(screen.getByText('$112.56')).toBeInTheDocument();
  });

  it('should display savings ranges for each option', () => {
    render(<ComparisonView comparisonData={mockComparisonData} />);

    expect(screen.getByText(/700.*950/)).toBeInTheDocument();
    expect(screen.getByText(/1000.*1350/)).toBeInTheDocument();
    expect(screen.getByText(/1150.*1500/)).toBeInTheDocument();
  });

  it('should highlight the option with the highest annual savings as "Best Value"', () => {
    render(<ComparisonView comparisonData={mockComparisonData} />);

    // Premium Efficiency has highest savings ($1350.75)
    const bestValueBadges = screen.getAllByText('Best Value');
    expect(bestValueBadges).toHaveLength(1);
  });

  it('should display CO2 reduction when emissions data is available', () => {
    render(<ComparisonView comparisonData={mockComparisonData} />);

    // Emissions are in kg, displayed as tons (divided by 1000)
    expect(screen.getByText('4.5 tons/yr')).toBeInTheDocument();
    expect(screen.getByText('5.2 tons/yr')).toBeInTheDocument();
    expect(screen.getByText('5.8 tons/yr')).toBeInTheDocument();
  });

  it('should not display CO2 reduction when emissions data is zero', () => {
    const dataWithoutEmissions = [
      {
        ...mockComparisonData[0],
        emissionsReduction: { mean: 0 }
      },
      mockComparisonData[1],
      mockComparisonData[2]
    ];

    render(<ComparisonView comparisonData={dataWithoutEmissions} />);

    // Should only have 2 CO2 reduction sections (not 3)
    const co2Labels = screen.getAllByText('CO₂ Reduction');
    expect(co2Labels).toHaveLength(2);
  });

  it('should display SEER and HSPF ratings for each option', () => {
    render(<ComparisonView comparisonData={mockComparisonData} />);

    expect(screen.getByText('SEER 15 / HSPF 9')).toBeInTheDocument();
    expect(screen.getByText('SEER 18 / HSPF 10')).toBeInTheDocument();
    expect(screen.getByText('SEER 24 / HSPF 13')).toBeInTheDocument();
  });

  it('should handle case where middle option has best savings', () => {
    const dataWithMiddleBest = [
      mockComparisonData[0],
      {
        ...mockComparisonData[1],
        annualSavings: { ...mockComparisonData[1].annualSavings, mean: 2000 }
      },
      mockComparisonData[2]
    ];

    render(<ComparisonView comparisonData={dataWithMiddleBest} />);

    const bestValueBadge = screen.getByText('Best Value');
    expect(bestValueBadge).toBeInTheDocument();
  });

  it('should render with animation transition classes', () => {
    const { container } = render(<ComparisonView comparisonData={mockComparisonData} />);

    const mainDiv = container.firstChild;
    expect(mainDiv).toHaveClass('transition-all', 'duration-500');
  });
});
