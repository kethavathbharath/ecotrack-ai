/**
 * useEcoData – Central state management hook for EcoTrack AI
 */

import { useState, useEffect, useCallback } from 'react';
import {
  saveCalculation, getHistory, saveGoal, getGoal,
  getChallenges, toggleChallenge, resetChallenges,
  saveTheme, getTheme, saveLastCalc, getLastCalc,
} from '../utils/storage';
import { calculateEmissions, calculateEcoScore, predictNextMonth } from '../utils/calculations';

export function useEcoData() {
  const [history,    setHistory]    = useState([]);
  const [goal,       setGoalState]  = useState(null);
  const [challenges, setChallenges] = useState([]);
  const [lastCalc,   setLastCalc]   = useState(null);
  const [isDark,     setIsDark]     = useState(true);
  const [prediction, setPrediction] = useState(null);

  // ── Load from LocalStorage on mount ───────────────────────────────────────
  useEffect(() => {
    try {
      const h     = getHistory()    || [];
      const g     = getGoal()       || null;
      const c     = getChallenges() || [];
      const lc    = getLastCalc()   || null;
      const theme = getTheme()      || 'dark';

      setHistory(h);
      setGoalState(g);
      setChallenges(c);
      setLastCalc(lc);
      setIsDark(theme !== 'light');
      document.documentElement.classList.toggle('dark', theme !== 'light');

      if (h.length >= 2) {
        const pred = predictNextMonth([...h].reverse());
        setPrediction(pred);
      }
    } catch (err) {
      console.error('EcoData init error:', err);
    }
  }, []);

  // ── Calculate & Save ───────────────────────────────────────────────────────
  const runCalculation = useCallback((inputs) => {
    const emissions = calculateEmissions(inputs);
    const ecoScore  = calculateEcoScore(emissions.total);
    const result    = { ...emissions, ecoScore, inputs };

    const entry = saveCalculation(result);
    const updatedHistory = getHistory() || [];

    setHistory(updatedHistory);
    setLastCalc(entry);
    saveLastCalc(entry);

    if (updatedHistory.length >= 2) {
      const pred = predictNextMonth([...updatedHistory].reverse());
      setPrediction(pred);
    }

    return { emissions, ecoScore, entry };
  }, []);

  // ── Goal ───────────────────────────────────────────────────────────────────
  const updateGoal = useCallback((goalData) => {
    const g = { ...goalData, updatedAt: new Date().toISOString() };
    saveGoal(g);
    setGoalState(g);
  }, []);

  // ── Challenges ─────────────────────────────────────────────────────────────
  const toggleChallengeItem = useCallback((id) => {
    const updated = toggleChallenge(id);
    setChallenges(updated || []);
    return updated;
  }, []);

  const resetAllChallenges = useCallback(() => {
    const reset = resetChallenges();
    setChallenges(reset || []);
  }, []);

  // ── Theme ──────────────────────────────────────────────────────────────────
  const toggleTheme = useCallback(() => {
    setIsDark(prev => {
      const newDark = !prev;
      document.documentElement.classList.toggle('dark', newDark);
      saveTheme(newDark ? 'dark' : 'light');
      return newDark;
    });
  }, []);

  // ── Refresh history from storage ──────────────────────────────────────────
  const refreshHistory = useCallback((newHistory) => {
    // Accept either new array directly or re-read from storage
    const h = Array.isArray(newHistory) ? newHistory : (getHistory() || []);
    setHistory(h);
  }, []);

  // ── Derived ────────────────────────────────────────────────────────────────
  const completedChallenges = challenges.filter(c => c.completed).length;
  const totalPoints = challenges.filter(c => c.completed).reduce((s, c) => s + (c.points || 0), 0);

  return {
    history,
    goal,
    challenges,
    lastCalc,
    isDark,
    prediction,
    runCalculation,
    updateGoal,
    toggleChallengeItem,
    resetAllChallenges,
    toggleTheme,
    refreshHistory,
    completedChallenges,
    totalPoints,
    hasData: history.length > 0,
    latestScore: lastCalc?.ecoScore ?? null,
  };
}
