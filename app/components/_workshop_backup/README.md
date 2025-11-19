# Workshop Backup Components

These components are **reference implementations** for the heat pump comparison feature.

## Contents:

- **HeatPumpSelector.tsx** - Radio button selector for 3 SEER efficiency levels with comparison mode toggle
- **ComparisonView.tsx** - Side-by-side comparison display with "Best Value" badge logic

## Purpose:

These components were built and tested but removed from the active codebase to demonstrate **TDD (Test-Driven Development)** during the workshop.

## Workshop Flow:

1. **Primary approach**: Build the comparison feature from scratch using TDD
2. **Fallback option**: If time runs short, these can be adapted/integrated

## To Use These:

If needed during the workshop, you can:
- Reference them as implementation examples
- Copy and adapt them to the current codebase
- Use them as a starting point for refactoring

## Note:

These components were working in the app as of Nov 19, 2025. They integrate with:
- `/api/savings` endpoint (accepts `upgrade` parameter)
- `useSavingsCalculator` hook (needs comparison mode state)
- Parallel API calls with `Promise.all`
