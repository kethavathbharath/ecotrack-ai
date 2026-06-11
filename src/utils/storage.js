/**
 * LocalStorage utilities for EcoTrack AI
 * Handles data persistence for history, goals, challenges
 */

const KEYS = {
  HISTORY:    'ecotrack_history',
  GOAL:       'ecotrack_goal',
  CHALLENGES: 'ecotrack_challenges',
  THEME:      'ecotrack_theme',
  LAST_CALC:  'ecotrack_last_calc',
};

// ── Generic helpers ───────────────────────────────────────────────────────────
function save(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch {
    console.error('LocalStorage write failed for key:', key);
    return false;
  }
}

function load(key, fallback = null) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

// ── History ───────────────────────────────────────────────────────────────────
export function saveCalculation(calcData) {
  const history = load(KEYS.HISTORY, []);
  const entry = {
    id:        Date.now(),
    timestamp: new Date().toISOString(),
    ...calcData,
  };
  history.unshift(entry); // newest first
  // Keep max 50 records
  if (history.length > 50) history.pop();
  save(KEYS.HISTORY, history);
  return entry;
}

export function getHistory() {
  return load(KEYS.HISTORY, []);
}

export function clearHistory() {
  localStorage.removeItem(KEYS.HISTORY);
}

export function deleteHistoryEntry(id) {
  const history = getHistory().filter(h => h.id !== id);
  save(KEYS.HISTORY, history);
}

// ── Goal ──────────────────────────────────────────────────────────────────────
export function saveGoal(goalData) {
  save(KEYS.GOAL, { ...goalData, updatedAt: new Date().toISOString() });
}

export function getGoal() {
  return load(KEYS.GOAL, null);
}

// ── Challenges ────────────────────────────────────────────────────────────────
const DEFAULT_CHALLENGES = [
  { id: 'no-plastic',    title: 'No Plastic Day',             icon: '♻️',  points: 10, completed: false, description: 'Avoid all single-use plastics for a day.' },
  { id: 'walk-5000',     title: 'Walk 5,000 Steps',           icon: '🚶', points: 15, completed: false, description: 'Walk at least 5,000 steps instead of driving.' },
  { id: 'public-transport', title: 'Use Public Transport',   icon: '🚌', points: 20, completed: false, description: 'Commute using bus or metro for a full day.' },
  { id: 'switch-off',    title: 'Switch Off Appliances',      icon: '💡', points: 10, completed: false, description: 'Unplug all unused appliances for 24 hours.' },
  { id: 'veg-day',       title: 'Go Vegetarian Today',        icon: '🥗', points: 15, completed: false, description: 'Have a fully plant-based diet for one day.' },
  { id: 'short-shower',  title: '5-Minute Shower Challenge',  icon: '🚿', points: 10, completed: false, description: 'Keep your shower under 5 minutes.' },
  { id: 'no-car',        title: 'Car-Free Day',               icon: '🚲', points: 25, completed: false, description: 'Travel without a personal car for the whole day.' },
];

export function getChallenges() {
  const saved = load(KEYS.CHALLENGES, null);
  if (!saved) {
    save(KEYS.CHALLENGES, DEFAULT_CHALLENGES);
    return DEFAULT_CHALLENGES;
  }
  // Merge any new default challenges into saved
  const savedIds = new Set(saved.map(c => c.id));
  const merged = [
    ...saved,
    ...DEFAULT_CHALLENGES.filter(c => !savedIds.has(c.id)),
  ];
  return merged;
}

export function toggleChallenge(id) {
  const challenges = getChallenges().map(c =>
    c.id === id ? { ...c, completed: !c.completed, completedAt: !c.completed ? new Date().toISOString() : null } : c
  );
  save(KEYS.CHALLENGES, challenges);
  return challenges;
}

export function resetChallenges() {
  const reset = getChallenges().map(c => ({ ...c, completed: false, completedAt: null }));
  save(KEYS.CHALLENGES, reset);
  return reset;
}

// ── Theme ─────────────────────────────────────────────────────────────────────
export function saveTheme(theme) {
  localStorage.setItem(KEYS.THEME, theme);
}

export function getTheme() {
  return localStorage.getItem(KEYS.THEME) || 'dark';
}

// ── Last Calculation ──────────────────────────────────────────────────────────
export function saveLastCalc(data) {
  save(KEYS.LAST_CALC, data);
}

export function getLastCalc() {
  return load(KEYS.LAST_CALC, null);
}
