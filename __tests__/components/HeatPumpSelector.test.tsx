import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { HeatPumpSelector, HEAT_PUMP_OPTIONS } from '@/app/components/calculator/HeatPumpSelector';

describe('HeatPumpSelector', () => {
  const mockOnChange = jest.fn();
  const mockOnComparisonToggle = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render all three heat pump options', () => {
    render(
      <HeatPumpSelector
        selectedUpgrade="hvac__heat_pump_seer18_hspf10"
        onChange={mockOnChange}
      />
    );

    expect(screen.getByText('Standard Efficiency')).toBeInTheDocument();
    expect(screen.getByText('High Efficiency')).toBeInTheDocument();
    expect(screen.getByText('Premium Efficiency')).toBeInTheDocument();
  });

  it('should display SEER and HSPF ratings for each option', () => {
    render(
      <HeatPumpSelector
        selectedUpgrade="hvac__heat_pump_seer18_hspf10"
        onChange={mockOnChange}
      />
    );

    expect(screen.getByText('SEER 15 / HSPF 9')).toBeInTheDocument();
    expect(screen.getByText('SEER 18 / HSPF 10')).toBeInTheDocument();
    expect(screen.getByText('SEER 24 / HSPF 13')).toBeInTheDocument();
  });

  it('should call onChange when a heat pump option is selected', () => {
    render(
      <HeatPumpSelector
        selectedUpgrade="hvac__heat_pump_seer18_hspf10"
        onChange={mockOnChange}
      />
    );

    const premiumOption = screen.getByDisplayValue('hvac__heat_pump_seer24_hspf13');
    fireEvent.click(premiumOption);

    expect(mockOnChange).toHaveBeenCalledWith('hvac__heat_pump_seer24_hspf13');
  });

  it('should highlight the selected heat pump option', () => {
    render(
      <HeatPumpSelector
        selectedUpgrade="hvac__heat_pump_seer24_hspf13"
        onChange={mockOnChange}
      />
    );

    const premiumRadio = screen.getByDisplayValue('hvac__heat_pump_seer24_hspf13');
    expect(premiumRadio).toBeChecked();
  });

  it('should render comparison toggle button when onComparisonToggle is provided', () => {
    render(
      <HeatPumpSelector
        selectedUpgrade="hvac__heat_pump_seer18_hspf10"
        onChange={mockOnChange}
        onComparisonToggle={mockOnComparisonToggle}
      />
    );

    expect(screen.getByText(/Compare All Three Efficiency Levels/i)).toBeInTheDocument();
  });

  it('should not render comparison toggle button when onComparisonToggle is not provided', () => {
    render(
      <HeatPumpSelector
        selectedUpgrade="hvac__heat_pump_seer18_hspf10"
        onChange={mockOnChange}
      />
    );

    expect(screen.queryByText(/Compare All Three Efficiency Levels/i)).not.toBeInTheDocument();
  });

  it('should call onComparisonToggle when comparison button is clicked', () => {
    render(
      <HeatPumpSelector
        selectedUpgrade="hvac__heat_pump_seer18_hspf10"
        onChange={mockOnChange}
        onComparisonToggle={mockOnComparisonToggle}
      />
    );

    const compareButton = screen.getByText(/Compare All Three Efficiency Levels/i);
    fireEvent.click(compareButton);

    expect(mockOnComparisonToggle).toHaveBeenCalledTimes(1);
  });

  it('should disable radio buttons when in comparison mode', () => {
    render(
      <HeatPumpSelector
        selectedUpgrade="hvac__heat_pump_seer18_hspf10"
        onChange={mockOnChange}
        comparisonMode={true}
      />
    );

    const seer15Radio = screen.getByDisplayValue('hvac__heat_pump_seer15_hspf9');
    const seer18Radio = screen.getByDisplayValue('hvac__heat_pump_seer18_hspf10');
    const seer24Radio = screen.getByDisplayValue('hvac__heat_pump_seer24_hspf13');

    expect(seer15Radio).toBeDisabled();
    expect(seer18Radio).toBeDisabled();
    expect(seer24Radio).toBeDisabled();
  });

  it('should show comparison mode active message when in comparison mode', () => {
    render(
      <HeatPumpSelector
        selectedUpgrade="hvac__heat_pump_seer18_hspf10"
        onChange={mockOnChange}
        comparisonMode={true}
      />
    );

    expect(screen.getByText(/Comparison Mode Active/i)).toBeInTheDocument();
  });

  it('should change button text when in comparison mode', () => {
    render(
      <HeatPumpSelector
        selectedUpgrade="hvac__heat_pump_seer18_hspf10"
        onChange={mockOnChange}
        comparisonMode={true}
        onComparisonToggle={mockOnComparisonToggle}
      />
    );

    expect(screen.getByText(/Back to Single Selection/i)).toBeInTheDocument();
  });

  it('should export HEAT_PUMP_OPTIONS with correct data', () => {
    expect(HEAT_PUMP_OPTIONS).toHaveLength(3);
    expect(HEAT_PUMP_OPTIONS[0].seer).toBe(15);
    expect(HEAT_PUMP_OPTIONS[1].seer).toBe(18);
    expect(HEAT_PUMP_OPTIONS[2].seer).toBe(24);
    expect(HEAT_PUMP_OPTIONS[0].id).toBe('hvac__heat_pump_seer15_hspf9');
    expect(HEAT_PUMP_OPTIONS[1].id).toBe('hvac__heat_pump_seer18_hspf10');
    expect(HEAT_PUMP_OPTIONS[2].id).toBe('hvac__heat_pump_seer24_hspf13');
  });
});
