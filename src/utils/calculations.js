/**
 * Carbon Footprint Calculation Utilities
 * Emission factors based on IPCC & EPA standards (kg CO2 per unit)
 */

// ── Emission Factors ──────────────────────────────────────────────────────────
export const EMISSION_FACTORS = {
  // Transport: kg CO2 per km
  car:  0.21,   // average petrol/diesel car
  bus:  0.089,  // public bus
  bike: 0.0,    // bicycle (zero emissions)

  // Electricity: kg CO2 per kWh (India grid average)
  electricity: 0.82,

  // Food: kg CO2 per day
  food: {
    Vegetarian:     3.8,
    Mixed:          6.5,
    'Non-Vegetarian': 9.2,
  },

  // Plastic: kg CO2 per kg of plastic waste
  plastic: 6.0,
};

// ── Main Calculator ───────────────────────────────────────────────────────────
/**
 * Calculate monthly carbon emissions from user inputs.
 * @param {Object} inputs - user form data
 * @returns {Object} emission breakdown and totals
 */
export function calculateEmissions(inputs) {
  const {
    carKm = 0,
    busKm = 0,
    bikeKm = 0,
    electricity = 0,
    food = 'Mixed',
    plasticKg = 0,
  } = inputs;

  const DAYS_PER_MONTH = 30;
  const WEEKS_PER_MONTH = 4.33;

  // Transport (daily → monthly)
  const carEmissions  = Number(carKm)  * EMISSION_FACTORS.car  * DAYS_PER_MONTH;
  const busEmissions  = Number(busKm)  * EMISSION_FACTORS.bus  * DAYS_PER_MONTH;
  const bikeEmissions = Number(bikeKm) * EMISSION_FACTORS.bike * DAYS_PER_MONTH;
  const transportTotal = carEmissions + busEmissions + bikeEmissions;

  // Electricity (monthly units = kWh)
  const electricityEmissions = Number(electricity) * EMISSION_FACTORS.electricity;

  // Food (daily factor × 30 days)
  const foodFactor = EMISSION_FACTORS.food[food] || EMISSION_FACTORS.food['Mixed'];
  const foodEmissions = foodFactor * DAYS_PER_MONTH;

  // Plastic (weekly kg × weeks)
  const plasticEmissions = Number(plasticKg) * EMISSION_FACTORS.plastic * WEEKS_PER_MONTH;

  const total = transportTotal + electricityEmissions + foodEmissions + plasticEmissions;

  return {
    total:          parseFloat(total.toFixed(2)),
    transport:      parseFloat(transportTotal.toFixed(2)),
    carEmissions:   parseFloat(carEmissions.toFixed(2)),
    busEmissions:   parseFloat(busEmissions.toFixed(2)),
    bikeEmissions:  parseFloat(bikeEmissions.toFixed(2)),
    electricity:    parseFloat(electricityEmissions.toFixed(2)),
    food:           parseFloat(foodEmissions.toFixed(2)),
    plastic:        parseFloat(plasticEmissions.toFixed(2)),
  };
}

// ── Eco Score ─────────────────────────────────────────────────────────────────
/**
 * Generate Eco Score (0–100) from total monthly CO2 in kg.
 * Benchmark: global avg ~400–600 kg/month; eco-champion < 100 kg/month
 */
export function calculateEcoScore(totalKgCO2) {
  // Score decreases as CO2 increases
  // 0 kg → 100 score; 600+ kg → 0 score
  const MAX_CO2 = 600;
  const score = Math.max(0, Math.round(100 - (totalKgCO2 / MAX_CO2) * 100));
  return Math.min(100, score);
}

export function getScoreCategory(score) {
  if (score >= 81) return { label: 'Eco Champion 🏆', color: '#22c55e', bg: 'rgba(34,197,94,0.15)', tier: 'champion' };
  if (score >= 61) return { label: 'Good 🌿',         color: '#4ade80', bg: 'rgba(74,222,128,0.12)', tier: 'good' };
  if (score >= 31) return { label: 'Moderate ⚠️',    color: '#fbbf24', bg: 'rgba(251,191,36,0.12)', tier: 'moderate' };
  return             { label: 'High Impact 🔥',       color: '#f87171', bg: 'rgba(248,113,113,0.12)', tier: 'high' };
}

// ── AI Prediction ─────────────────────────────────────────────────────────────
/**
 * Simple linear regression prediction for next month's footprint.
 * Falls back to weighted average if < 3 data points.
 */
export function predictNextMonth(history) {
  if (!history || history.length === 0) return null;

  if (history.length === 1) {
    return {
      predicted: history[0].total,
      trend: 'stable',
      confidence: 'low',
    };
  }

  const n = history.length;
  const values = history.map(h => h.total);

  // Calculate slope via simple linear regression
  const mean_x = (n - 1) / 2;
  const mean_y = values.reduce((a, b) => a + b, 0) / n;

  let num = 0, den = 0;
  values.forEach((y, x) => {
    num += (x - mean_x) * (y - mean_y);
    den += (x - mean_x) ** 2;
  });

  const slope = den !== 0 ? num / den : 0;
  const intercept = mean_y - slope * mean_x;
  const predicted = Math.max(0, intercept + slope * n);

  const trend = slope > 5 ? 'increasing' : slope < -5 ? 'decreasing' : 'stable';
  const confidence = n >= 5 ? 'high' : n >= 3 ? 'medium' : 'low';

  return {
    predicted: parseFloat(predicted.toFixed(2)),
    trend,
    confidence,
    slope: parseFloat(slope.toFixed(2)),
    changePercent: mean_y > 0 ? parseFloat(((slope / mean_y) * 100).toFixed(1)) : 0,
  };
}

// ── Helpers ───────────────────────────────────────────────────────────────────
export function formatCO2(kg) {
  if (kg >= 1000) return `${(kg / 1000).toFixed(2)} tonnes`;
  return `${kg.toFixed(1)} kg`;
}

export function getEmissionColor(category) {
  const colors = {
    transport:   '#60a5fa',
    electricity: '#fbbf24',
    food:        '#a78bfa',
    plastic:     '#f87171',
  };
  return colors[category] || '#22c55e';
}

export function getGoalProgress(current, target) {
  if (!target || target <= 0) return 0;
  const progress = Math.max(0, Math.min(100, ((target - current) / target) * 100));
  return parseFloat(progress.toFixed(1));
}
