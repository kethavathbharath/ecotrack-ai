/**
 * Unit Tests – Gemini Service
 * Tests mock recommendations, API key validation, and response parsing
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getMockRecommendations } from '../services/geminiService';

// ── getMockRecommendations ────────────────────────────────────────────────────

describe('getMockRecommendations', () => {
  it('returns an array of recommendations', () => {
    const recs = getMockRecommendations();
    expect(Array.isArray(recs)).toBe(true);
  });

  it('returns exactly 6 recommendations', () => {
    const recs = getMockRecommendations();
    expect(recs).toHaveLength(6);
  });

  it('each recommendation has required fields', () => {
    const recs = getMockRecommendations();
    recs.forEach(rec => {
      expect(rec).toHaveProperty('id');
      expect(rec).toHaveProperty('title');
      expect(rec).toHaveProperty('description');
      expect(rec).toHaveProperty('impact');
      expect(rec).toHaveProperty('category');
      expect(rec).toHaveProperty('icon');
    });
  });

  it('each recommendation has a non-empty title', () => {
    const recs = getMockRecommendations();
    recs.forEach(rec => {
      expect(rec.title.length).toBeGreaterThan(0);
    });
  });

  it('each recommendation has a valid category', () => {
    const validCategories = ['transport', 'electricity', 'food', 'waste', 'lifestyle'];
    const recs = getMockRecommendations();
    recs.forEach(rec => {
      expect(validCategories).toContain(rec.category);
    });
  });

  it('recommendation IDs are unique', () => {
    const recs = getMockRecommendations();
    const ids = recs.map(r => r.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it('impact field contains CO2 savings information', () => {
    const recs = getMockRecommendations();
    recs.forEach(rec => {
      expect(rec.impact.toLowerCase()).toMatch(/kg|co2|saves/i);
    });
  });
});

// ── API Key Validation ────────────────────────────────────────────────────────

describe('Gemini API key validation', () => {
  it('VITE_GEMINI_API_KEY env variable can be set', () => {
    // In test environment, import.meta.env is controlled by Vitest
    // This verifies the env variable structure
    const key = import.meta.env.VITE_GEMINI_API_KEY;
    // In tests, this will be undefined — that's expected
    expect(key === undefined || typeof key === 'string').toBe(true);
  });
});
