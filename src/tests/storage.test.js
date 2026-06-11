/**
 * Unit Tests – LocalStorage Utilities
 * Tests CRUD operations for history, goals, challenges, and theme
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
  saveCalculation,
  getHistory,
  clearHistory,
  deleteHistoryEntry,
  saveGoal,
  getGoal,
  saveTheme,
  getTheme,
  saveLastCalc,
  getLastCalc,
} from '../utils/storage';

// ── Mock localStorage ─────────────────────────────────────────────────────────
const localStorageMock = (() => {
  let store = {};
  return {
    getItem:    (key)        => store[key] ?? null,
    setItem:    (key, value) => { store[key] = String(value); },
    removeItem: (key)        => { delete store[key]; },
    clear:      ()           => { store = {}; },
  };
})();

Object.defineProperty(global, 'localStorage', { value: localStorageMock });

// ── Helpers ───────────────────────────────────────────────────────────────────
const mockCalc = (total = 200) => ({
  total,
  transport:   50,
  electricity: 80,
  food:        60,
  plastic:     10,
  ecoScore:    75,
  date:        new Date().toISOString(),
});

// ── History ───────────────────────────────────────────────────────────────────

describe('History storage', () => {
  beforeEach(() => localStorage.clear());

  it('getHistory returns empty array when nothing saved', () => {
    expect(getHistory()).toEqual([]);
  });

  it('saveCalculation adds an entry to history', () => {
    saveCalculation(mockCalc());
    const history = getHistory();
    expect(history).toHaveLength(1);
  });

  it('saveCalculation assigns an id to each entry', () => {
    const entry = saveCalculation(mockCalc());
    expect(entry.id).toBeDefined();
  });

  it('multiple saves accumulate correctly', () => {
    saveCalculation(mockCalc(100));
    saveCalculation(mockCalc(200));
    saveCalculation(mockCalc(300));
    expect(getHistory()).toHaveLength(3);
  });

  it('clearHistory empties the history', () => {
    saveCalculation(mockCalc());
    saveCalculation(mockCalc());
    clearHistory();
    expect(getHistory()).toEqual([]);
  });

  it('deleteHistoryEntry removes an entry and reduces history length', () => {
    const before = getHistory().length;
    const entry = saveCalculation(mockCalc(999));
    expect(getHistory().length).toBe(before + 1);
    deleteHistoryEntry(entry.id);
    expect(getHistory().length).toBe(before);
  });

  it('most recent calculation is first in history', () => {
    saveCalculation(mockCalc(100));
    saveCalculation(mockCalc(999));
    const history = getHistory();
    expect(history[0].total).toBe(999);
  });
});

// ── Goal ─────────────────────────────────────────────────────────────────────

describe('Goal storage', () => {
  beforeEach(() => localStorage.clear());

  it('getGoal returns null when nothing saved', () => {
    expect(getGoal()).toBeNull();
  });

  it('saveGoal persists and getGoal retrieves it', () => {
    const goal = { target: 150, label: 'Low Carbon', updatedAt: new Date().toISOString() };
    saveGoal(goal);
    const retrieved = getGoal();
    expect(retrieved.target).toBe(150);
    expect(retrieved.label).toBe('Low Carbon');
  });

  it('saveGoal overwrites previous goal', () => {
    saveGoal({ target: 150 });
    saveGoal({ target: 250 });
    expect(getGoal().target).toBe(250);
  });
});

// ── Theme ─────────────────────────────────────────────────────────────────────

describe('Theme storage', () => {
  beforeEach(() => localStorage.clear());

  it('getTheme returns dark by default when nothing saved', () => {
    expect(getTheme()).toBe('dark');
  });

  it('saveTheme persists theme correctly', () => {
    saveTheme('light');
    expect(getTheme()).toBe('light');
  });

  it('can switch back to dark theme', () => {
    saveTheme('light');
    saveTheme('dark');
    expect(getTheme()).toBe('dark');
  });
});

// ── Last Calculation ──────────────────────────────────────────────────────────

describe('Last calculation storage', () => {
  beforeEach(() => localStorage.clear());

  it('getLastCalc returns null when nothing saved', () => {
    expect(getLastCalc()).toBeNull();
  });

  it('saveLastCalc and getLastCalc round-trips data correctly', () => {
    const calc = mockCalc(350);
    saveLastCalc(calc);
    const retrieved = getLastCalc();
    expect(retrieved.total).toBe(350);
    expect(retrieved.ecoScore).toBe(75);
  });
});
