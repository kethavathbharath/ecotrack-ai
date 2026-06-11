/**
 * Carbon Footprint Calculator Page
 */

import React, { useState } from 'react';
import { Calculator, Car, Bus, Bike, Zap, Utensils, Trash2, CheckCircle } from 'lucide-react';
import { Spinner, AlertBanner, EcoScoreRing } from '../components/ui/UIComponents';
import { formatCO2, getScoreCategory } from '../utils/calculations';

const FOOD_OPTIONS = ['Vegetarian', 'Mixed', 'Non-Vegetarian'];

const FIELD_CONFIG = [
  {
    section: '🚗 Transport',
    fields: [
      { key: 'carKm',  label: 'Daily Car Travel',  unit: 'km/day',  icon: '🚗', placeholder: '20',  min: 0, max: 500,  hint: 'Average km you drive per day' },
      { key: 'busKm',  label: 'Daily Bus/Metro',   unit: 'km/day',  icon: '🚌', placeholder: '10',  min: 0, max: 200,  hint: 'Public transport distance per day' },
      { key: 'bikeKm', label: 'Daily Cycling',     unit: 'km/day',  icon: '🚲', placeholder: '0',   min: 0, max: 100,  hint: 'Bicycle distance (zero emissions!)' },
    ],
  },
  {
    section: '⚡ Energy',
    fields: [
      { key: 'electricity', label: 'Monthly Electricity', unit: 'kWh/month', icon: '⚡', placeholder: '200', min: 0, max: 2000, hint: 'Units from your electricity bill' },
    ],
  },
  {
    section: '♻️ Waste',
    fields: [
      { key: 'plasticKg', label: 'Weekly Plastic Waste', unit: 'kg/week', icon: '🗑️', placeholder: '0.5', min: 0, max: 50, step: '0.1', hint: 'Estimated plastic waste generated weekly' },
    ],
  },
];

export default function CalculatorPage({ onCalculate, lastResult }) {
  const [inputs, setInputs] = useState({
    carKm: '', busKm: '', bikeKm: '',
    electricity: '', food: 'Mixed', plasticKg: '',
  });
  const [result,  setResult]  = useState(lastResult || null);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');

  const handleChange = (key, val) => {
    setInputs(prev => ({ ...prev, [key]: val }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    const numFields = ['carKm', 'busKm', 'bikeKm', 'electricity', 'plasticKg'];
    for (const f of numFields) {
      const v = parseFloat(inputs[f]);
      if (inputs[f] !== '' && (isNaN(v) || v < 0)) {
        setError(`Please enter a valid positive number for ${f}`);
        return;
      }
    }

    setLoading(true);
    setError('');
    try {
      const { emissions, ecoScore } = onCalculate(inputs);
      setResult({ ...emissions, ecoScore });
    } catch (err) {
      setError('Calculation failed. Please check your inputs.');
    } finally {
      setLoading(false);
    }
  };

  const cat = result ? getScoreCategory(result.ecoScore) : null;

  const EMISSION_BARS = result ? [
    { label: 'Transport',   value: result.transport,   color: '#60a5fa', pct: (result.transport / result.total) * 100 },
    { label: 'Electricity', value: result.electricity, color: '#fbbf24', pct: (result.electricity / result.total) * 100 },
    { label: 'Food',        value: result.food,        color: '#a78bfa', pct: (result.food / result.total) * 100 },
    { label: 'Plastic',     value: result.plastic,     color: '#f87171', pct: (result.plastic / result.total) * 100 },
  ] : [];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-up">

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-eco-500/15 border border-eco-500/25 flex items-center justify-center">
            <Calculator size={20} className="text-eco-400" />
          </div>
          <h1 className="section-title mb-0">Carbon Footprint Calculator</h1>
        </div>
        <p className="section-sub ml-13">Enter your daily habits to calculate your monthly CO₂ emissions</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">

        {/* ── Form ── */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {FIELD_CONFIG.map(({ section, fields }) => (
            <div key={section} className="glass-card p-6">
              <h3 className="text-sm font-semibold text-eco-300 mb-4">{section}</h3>
              <div className="space-y-4">
                {fields.map(({ key, label, unit, icon, placeholder, min, max, step, hint }) => (
                  <div key={key}>
                    <label className="eco-label">
                      {icon} {label}
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        className="eco-input pr-20"
                        placeholder={placeholder}
                        min={min} max={max} step={step || '1'}
                        value={inputs[key]}
                        onChange={e => handleChange(key, e.target.value)}
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-white/30 pointer-events-none">
                        {unit}
                      </span>
                    </div>
                    {hint && <p className="text-[11px] text-white/25 mt-1">{hint}</p>}
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Food */}
          <div className="glass-card p-6">
            <h3 className="text-sm font-semibold text-eco-300 mb-4">🍽️ Food Preference</h3>
            <div className="grid grid-cols-3 gap-3">
              {FOOD_OPTIONS.map(opt => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => handleChange('food', opt)}
                  className={`py-3 px-2 rounded-xl text-sm font-medium border transition-all duration-200 ${
                    inputs.food === opt
                      ? 'border-eco-500/50 bg-eco-500/15 text-eco-300'
                      : 'border-white/8 bg-white/3 text-white/50 hover:border-white/20'
                  }`}
                >
                  {opt === 'Vegetarian' ? '🥗' : opt === 'Mixed' ? '🍱' : '🥩'}
                  <br/>
                  <span className="text-xs">{opt}</span>
                </button>
              ))}
            </div>
          </div>

          {error && <AlertBanner type="error" message={error} onClose={() => setError('')} />}

          <button
            type="submit"
            disabled={loading}
            className="eco-btn w-full justify-center py-4 text-base"
          >
            {loading ? <Spinner size="sm" /> : <><Calculator size={18} /> Calculate Footprint</>}
          </button>
        </form>

        {/* ── Result ── */}
        <div className="space-y-5">
          {result ? (
            <>
              {/* Total + Score */}
              <div className="glass-card p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-xs text-white/40 uppercase tracking-wide mb-1">Monthly Total</p>
                    <p className="text-4xl font-bold font-display text-white">{formatCO2(result.total)}</p>
                    <p className="text-xs text-white/30 mt-1">CO₂ equivalent per month</p>
                  </div>
                  <EcoScoreRing score={result.ecoScore} size={120} strokeWidth={8} />
                </div>

                {/* Score label */}
                <div
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold"
                  style={{ background: cat.bg, color: cat.color, border: `1px solid ${cat.color}30` }}
                >
                  <CheckCircle size={16} />
                  {cat.label}
                </div>
              </div>

              {/* Breakdown */}
              <div className="glass-card p-6">
                <h3 className="text-sm font-semibold text-white/70 mb-4">Emission Breakdown</h3>
                <div className="space-y-4">
                  {EMISSION_BARS.map(({ label, value, color, pct }) => (
                    <div key={label}>
                      <div className="flex justify-between text-xs mb-1.5">
                        <span className="text-white/60">{label}</span>
                        <span style={{ color }} className="font-semibold">{formatCO2(value)}</span>
                      </div>
                      <div className="h-2 rounded-full bg-white/6 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-1000"
                          style={{ width: `${Math.max(2, pct)}%`, background: color, boxShadow: `0 0 6px ${color}80` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tips */}
              <div className="glass-card p-5">
                <p className="text-xs text-white/40 mb-3">💡 Next Steps</p>
                <ul className="space-y-2 text-sm text-white/60">
                  <li>→ Go to <strong className="text-eco-300">AI Insights</strong> for personalized recommendations</li>
                  <li>→ Set a <strong className="text-eco-300">Goal</strong> to track your reduction progress</li>
                  <li>→ Check <strong className="text-eco-300">Analytics</strong> to see trends over time</li>
                </ul>
              </div>
            </>
          ) : (
            <div className="glass-card p-10 flex flex-col items-center justify-center text-center h-full min-h-[400px]">
              <div className="text-6xl mb-5 animate-float">🌍</div>
              <h3 className="text-lg font-semibold text-white/70 mb-2">Ready to Calculate</h3>
              <p className="text-sm text-white/35 max-w-xs">
                Fill in your daily habits on the left and click "Calculate Footprint" to see your monthly CO₂ emissions.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
