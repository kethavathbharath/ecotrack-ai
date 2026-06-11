/**
 * Unit Tests – Carbon Footprint Calculations
 * Tests emission factors, eco score, and prediction logic
 */

import { describe, it, expect } from 'vitest';
import {
  calculateEmissions,
  calculateEcoScore,
  getScoreCategory,
  formatCO2,
  getGoalProgress,
  predictNextMonth,
  EMISSION_FACTORS,
} from '../utils/calculations';

// ── Base inputs matching real field names ─────────────────────────────────────
const baseInputs = {
  carKm: 0, busKm: 0, bikeKm: 0,
  electricity: 0,
  food: 'Vegetarian',
  plasticKg: 0,
};

// ── calculateEmissions ────────────────────────────────────────────────────────

describe('calculateEmissions', () => {
  it('returns food emissions even with all-zero transport/electricity inputs', () => {
    const result = calculateEmissions(baseInputs);
    expect(result.food).toBeGreaterThan(0);
    expect(result.total).toBeGreaterThan(0);
  });

  it('calculates car emissions correctly (0.21 kg CO2/km × 30 days)', () => {
    const result = calculateEmissions({ ...baseInputs, carKm: 10 });
    // 10 km/day × 30 days × 0.21 = 63 kg
    expect(result.carEmissions).toBeCloseTo(63, 0);
  });

  it('calculates bus emissions correctly (0.089 kg CO2/km × 30 days)', () => {
    const result = calculateEmissions({ ...baseInputs, busKm: 10 });
    // 10 × 30 × 0.089 = 26.7 kg
    expect(result.busEmissions).toBeCloseTo(26.7, 0);
  });

  it('calculates electricity emissions correctly (0.82 kg CO2/kWh)', () => {
    const result = calculateEmissions({ ...baseInputs, electricity: 100 });
    // 100 × 0.82 = 82 kg
    expect(result.electricity).toBeCloseTo(82, 0);
  });

  it('calculates Vegetarian food emissions (3.8 kg/day × 30)', () => {
    const result = calculateEmissions({ ...baseInputs, food: 'Vegetarian' });
    // 3.8 × 30 = 114 kg
    expect(result.food).toBeCloseTo(114, 0);
  });

  it('calculates Mixed food emissions (6.5 kg/day × 30)', () => {
    const result = calculateEmissions({ ...baseInputs, food: 'Mixed' });
    // 6.5 × 30 = 195 kg
    expect(result.food).toBeCloseTo(195, 0);
  });

  it('calculates Non-Vegetarian food emissions (9.2 kg/day × 30)', () => {
    const result = calculateEmissions({ ...baseInputs, food: 'Non-Vegetarian' });
    // 9.2 × 30 = 276 kg
    expect(result.food).toBeCloseTo(276, 0);
  });

  it('calculates plastic emissions correctly (6 kg CO2/kg × 4.33 weeks)', () => {
    const result = calculateEmissions({ ...baseInputs, plasticKg: 1 });
    // 1 × 6 × 4.33 ≈ 26 kg
    expect(result.plastic).toBeCloseTo(26, 0);
  });

  it('total equals sum of all categories', () => {
    const result = calculateEmissions({
      carKm: 10, busKm: 5, bikeKm: 2,
      electricity: 100,
      food: 'Mixed',
      plasticKg: 0.5,
    });
    const sum = result.transport + result.electricity + result.food + result.plastic;
    expect(result.total).toBeCloseTo(sum, 1);
  });

  it('returns numeric total', () => {
    const result = calculateEmissions(baseInputs);
    expect(typeof result.total).toBe('number');
  });

  it('emission factors are correct values', () => {
    expect(EMISSION_FACTORS.car).toBe(0.21);
    expect(EMISSION_FACTORS.bus).toBe(0.089);
    expect(EMISSION_FACTORS.electricity).toBe(0.82);
    expect(EMISSION_FACTORS.plastic).toBe(6.0);
  });
});

// ── calculateEcoScore ─────────────────────────────────────────────────────────

describe('calculateEcoScore', () => {
  it('returns 100 for zero emissions', () => {
    expect(calculateEcoScore(0)).toBe(100);
  });

  it('returns a score between 0 and 100', () => {
    const score = calculateEcoScore(300);
    expect(score).toBeGreaterThanOrEqual(0);
    expect(score).toBeLessThanOrEqual(100);
  });

  it('returns lower score for higher emissions', () => {
    const lowScore  = calculateEcoScore(800);
    const highScore = calculateEcoScore(100);
    expect(highScore).toBeGreaterThan(lowScore);
  });

  it('never returns a negative score for very high emissions', () => {
    expect(calculateEcoScore(10000)).toBeGreaterThanOrEqual(0);
  });

  it('returns a whole number', () => {
    const score = calculateEcoScore(250);
    expect(Number.isInteger(score)).toBe(true);
  });
});

// ── getScoreCategory ──────────────────────────────────────────────────────────

describe('getScoreCategory', () => {
  it('returns Eco Champion for score >= 81', () => {
    const cat = getScoreCategory(85);
    expect(cat.label).toMatch(/champion/i);
  });

  it('returns Good for score 61–80', () => {
    const cat = getScoreCategory(65);
    expect(cat.label).toMatch(/good/i);
  });

  it('returns Moderate for score 31–60', () => {
    const cat = getScoreCategory(50);
    expect(cat.label).toMatch(/moderate/i);
  });

  it('returns High Impact for score < 31', () => {
    const cat = getScoreCategory(20);
    expect(cat.label).toMatch(/high/i);
  });

  it('returns a color for every category', () => {
    [10, 45, 65, 85].forEach(score => {
      const cat = getScoreCategory(score);
      expect(cat.color).toBeTruthy();
    });
  });

  it('returns a tier for every category', () => {
    [10, 45, 65, 85].forEach(score => {
      const cat = getScoreCategory(score);
      expect(cat.tier).toBeTruthy();
    });
  });
});

// ── formatCO2 ─────────────────────────────────────────────────────────────────

describe('formatCO2', () => {
  it('formats kg values with unit', () => {
    expect(formatCO2(150)).toContain('150');
  });

  it('converts to tonnes for values >= 1000', () => {
    const result = formatCO2(1500);
    expect(result.toLowerCase()).toMatch(/tonne/);
  });

  it('handles zero gracefully', () => {
    expect(formatCO2(0)).toBeTruthy();
    expect(formatCO2(0)).toContain('0');
  });

  it('returns a string', () => {
    expect(typeof formatCO2(250)).toBe('string');
  });
});

// ── getGoalProgress ───────────────────────────────────────────────────────────

describe('getGoalProgress', () => {
  it('returns 0% when current equals target (at limit, not below)', () => {
    // progress = (target - current) / target * 100 = 0%
    const progress = getGoalProgress(200, 200);
    expect(progress).toBe(0);
  });

  it('returns 50% when current is half of target', () => {
    // (200 - 100) / 200 * 100 = 50%
    const progress = getGoalProgress(100, 200);
    expect(progress).toBeCloseTo(50, 0);
  });

  it('returns 100% when current is 0 (zero emissions)', () => {
    const progress = getGoalProgress(0, 200);
    expect(progress).toBe(100);
  });

  it('never exceeds 100%', () => {
    const progress = getGoalProgress(0, 200);
    expect(progress).toBeLessThanOrEqual(100);
  });

  it('returns 0 when no target set', () => {
    expect(getGoalProgress(200, 0)).toBe(0);
    expect(getGoalProgress(200, null)).toBe(0);
  });
});

// ── predictNextMonth ──────────────────────────────────────────────────────────

describe('predictNextMonth', () => {
  it('returns null for empty history', () => {
    expect(predictNextMonth([])).toBeNull();
  });

  it('returns a stable prediction for single data point', () => {
    const result = predictNextMonth([{ total: 200, date: '2024-01-01' }]);
    expect(result).toHaveProperty('predicted', 200);
    expect(result.trend).toBe('stable');
  });

  it('returns prediction object with required fields for multiple points', () => {
    const history = [
      { total: 200, date: '2024-01-01' },
      { total: 220, date: '2024-02-01' },
      { total: 240, date: '2024-03-01' },
    ];
    const result = predictNextMonth(history);
    expect(result).toHaveProperty('predicted');
    expect(result).toHaveProperty('trend');
    expect(result).toHaveProperty('confidence');
  });

  it('predicts an increasing trend for rising data', () => {
    const history = [
      { total: 100 }, { total: 200 }, { total: 300 },
      { total: 400 }, { total: 500 },
    ];
    const result = predictNextMonth(history);
    expect(result.trend).toMatch(/increasing/i);
  });

  it('predicts a decreasing trend for falling data', () => {
    const history = [
      { total: 500 }, { total: 400 }, { total: 300 },
      { total: 200 }, { total: 100 },
    ];
    const result = predictNextMonth(history);
    expect(result.trend).toMatch(/decreasing/i);
  });

  it('predicted value is non-negative', () => {
    const history = [{ total: 100 }, { total: 150 }, { total: 200 }];
    const result = predictNextMonth(history);
    expect(result.predicted).toBeGreaterThanOrEqual(0);
  });
});
